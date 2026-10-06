from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import ipaddress
import logging
import uuid
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import httpx
import hmac
import asyncio

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="VOCCSYS Landing API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---------- Email (Emergent managed proxy) ----------
# Base URL is a CONSTANT — never read from env, so it survives deployment.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


def _inquiry_email_html(inq: "Inquiry") -> str:
    def row(label: str, value: str) -> str:
        return (
            f'<tr><td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:13px;'
            f'font-weight:bold;color:#6B6E6C;border-bottom:1px solid #EAE8E2;white-space:nowrap">{label}</td>'
            f'<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:13px;'
            f'color:#1F1F22;border-bottom:1px solid #EAE8E2">{value}</td></tr>'
        )

    message_html = escape(inq.message).replace("\n", "<br>") if inq.message else "&mdash;"
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#F2F1ED;padding:24px"><tr><td>'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#FFFFFF;border:1px solid #D9D6CE;margin:0 auto">'
        '<tr><td style="padding:20px 24px;border-bottom:3px solid #B45309">'
        f'<span style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;color:#1F1F22">'
        f'New enquiry — {escape(inq.company)}</span><br>'
        '<span style="font-family:Arial,sans-serif;font-size:12px;color:#6B6E6C">'
        'Submitted via the voccsys.com contact form</span></td></tr>'
        '<tr><td style="padding:12px 10px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        + row("Name", escape(inq.name))
        + row("Company", escape(inq.company))
        + row("Email", f'<a href="mailto:{escape(inq.email)}" style="color:#B45309">{escape(inq.email)}</a>')
        + row("Phone", escape(inq.phone))
        + row("Industry", escape(inq.industry))
        + row("Message", message_html)
        + '</table></td></tr>'
        '<tr><td style="padding:16px 24px;border-top:1px solid #D9D6CE">'
        '<a href="https://voccsys.com/admin" style="font-family:Arial,sans-serif;font-size:12px;'
        'color:#B45309">View all enquiries in the admin dashboard</a>'
        '<p style="font-family:Arial,sans-serif;font-size:11px;color:#9A9D9B;margin:12px 0 0">'
        f'Sent by the {escape(EMAIL_FROM_NAME)} website. This is an automated notification.</p>'
        '</td></tr></table></td></tr></table>'
    )


# ---------- Auth ----------
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_TTL_HOURS = 12
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_TTL_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    company: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=40)
    industry: str = Field(..., min_length=1, max_length=80)
    message: Optional[str] = Field(default="", max_length=2000)


class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    email: str
    phone: str
    industry: str
    message: str = ""
    status: Literal["new", "contacted", "closed"] = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InquiryStatusUpdate(BaseModel):
    status: Literal["new", "contacted", "closed"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=200)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "VOCCSYS API", "status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ---------- Auth routes ----------
def _client_ip(request: Request) -> str:
    """Real client IP behind the K8s ingress: X-Forwarded-For first hop."""
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    real = request.headers.get("x-real-ip")
    if real:
        return real.strip()
    return request.client.host if request.client else "unknown"


@api_router.post("/auth/login")
async def login(payload: LoginRequest, request: Request):
    email = payload.email.lower()
    ip = _client_ip(request)
    identifier = f"{ip}:{email}"

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        locked_until = attempt["locked_until"]
        if isinstance(locked_until, str):
            locked_until = datetime.fromisoformat(locked_until)
        if locked_until > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        new_count = (attempt.get("count", 0) if attempt else 0) + 1
        update = {"identifier": identifier, "count": new_count}
        if new_count >= MAX_FAILED_ATTEMPTS:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    return {
        "access_token": create_access_token(user["id"], email),
        "token_type": "bearer",
        "user": {"email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")},
    }


@api_router.get("/auth/me")
async def auth_me(admin: dict = Depends(get_current_admin)):
    return admin


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1, max_length=200)
    new_password: str = Field(..., min_length=10, max_length=200)


@api_router.post("/auth/change-password")
async def change_password(payload: ChangePasswordRequest, admin: dict = Depends(get_current_admin)):
    user = await db.users.find_one({"id": admin["id"]})
    if not user or not verify_password(payload.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await db.users.update_one(
        {"id": admin["id"]},
        {"$set": {"password_hash": hash_password(payload.new_password)}},
    )
    return {"status": "ok"}


# ---------- Inquiry routes ----------
@api_router.post("/inquiries", response_model=Inquiry, status_code=201)
async def create_inquiry(payload: InquiryCreate):
    inquiry = Inquiry(**payload.model_dump())
    doc = inquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    try:
        await db.inquiries.insert_one(doc)
    except Exception:
        logger.exception("Failed to save inquiry")
        raise HTTPException(status_code=500, detail="Failed to save inquiry")
    try:
        subject = f"New enquiry: {inquiry.company} ({inquiry.industry})"
        await send_email(to=OWNER_EMAIL, subject=subject, html=_inquiry_email_html(inquiry))
    except Exception:
        logger.exception("Inquiry saved but notification email failed")
    return inquiry


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(admin: dict = Depends(get_current_admin)):
    items = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


@api_router.patch("/inquiries/{inquiry_id}", response_model=Inquiry)
async def update_inquiry_status(inquiry_id: str, payload: InquiryStatusUpdate, admin: dict = Depends(get_current_admin)):
    result = await db.inquiries.find_one_and_update(
        {"id": inquiry_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if isinstance(result.get('created_at'), str):
        result['created_at'] = datetime.fromisoformat(result['created_at'])
    return result


@api_router.delete("/inquiries/{inquiry_id}", status_code=204)
async def delete_inquiry(inquiry_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")


# ---------- Cron routes ----------
WEBHOOK_CRON_SECRET = os.environ["WEBHOOK_CRON_SECRET"]


def _digest_email_html(open_items: list) -> str:
    if not open_items:
        rows = (
            '<tr><td colspan="4" style="padding:16px 14px;font-family:Arial,sans-serif;'
            'font-size:13px;color:#6B6E6C">No open enquiries right now. Nice and clear.</td></tr>'
        )
    else:
        rows = ""
        for it in open_items:
            created = it.get("created_at", "")
            if isinstance(created, str):
                created = created[:10]
            rows += (
                '<tr>'
                f'<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:13px;color:#1F1F22;border-bottom:1px solid #EAE8E2">{escape(it.get("name", ""))}<br><span style="color:#6B6E6C;font-size:12px">{escape(it.get("company", ""))}</span></td>'
                f'<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:13px;color:#1F1F22;border-bottom:1px solid #EAE8E2">{escape(it.get("industry", ""))}</td>'
                f'<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:13px;color:#B45309;border-bottom:1px solid #EAE8E2">{escape((it.get("status") or "new").upper())}</td>'
                f'<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:12px;color:#6B6E6C;border-bottom:1px solid #EAE8E2">{escape(created)}</td>'
                '</tr>'
            )
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#F2F1ED;padding:24px"><tr><td>'
        '<table role="presentation" width="600" cellpadding="0" cellspacing="0" '
        'style="background:#FFFFFF;border:1px solid #D9D6CE;margin:0 auto">'
        '<tr><td style="padding:20px 24px;border-bottom:3px solid #B45309">'
        '<span style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;color:#1F1F22">'
        f'Weekly enquiry digest — {len(open_items)} open</span><br>'
        '<span style="font-family:Arial,sans-serif;font-size:12px;color:#6B6E6C">'
        'Your Monday-morning summary of open voccsys.com enquiries</span></td></tr>'
        '<tr><td style="padding:12px 10px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        '<tr><td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:11px;color:#6B6E6C;letter-spacing:1px">CONTACT</td>'
        '<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:11px;color:#6B6E6C;letter-spacing:1px">INDUSTRY</td>'
        '<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:11px;color:#6B6E6C;letter-spacing:1px">STATUS</td>'
        '<td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:11px;color:#6B6E6C;letter-spacing:1px">RECEIVED</td></tr>'
        + rows +
        '</table></td></tr>'
        '<tr><td style="padding:16px 24px;border-top:1px solid #D9D6CE">'
        '<a href="https://voccsys.com/admin" style="font-family:Arial,sans-serif;font-size:12px;'
        'color:#B45309">Open the admin dashboard</a>'
        '<p style="font-family:Arial,sans-serif;font-size:11px;color:#9A9D9B;margin:12px 0 0">'
        f'Sent by the {escape(EMAIL_FROM_NAME)} website. Automated weekly summary.</p>'
        '</td></tr></table></td></tr></table>'
    )


async def _run_weekly_digest(run_id: str):
    try:
        open_items = await db.inquiries.find(
            {"status": {"$in": ["new", "contacted"]}}, {"_id": 0}
        ).sort("created_at", -1).to_list(200)
        subject = f"VOCCSYS weekly digest — {len(open_items)} open enquir{'y' if len(open_items) == 1 else 'ies'}"
        email_id = await send_email(to=OWNER_EMAIL, subject=subject, html=_digest_email_html(open_items))
        await db.cron_runs.update_one({"run_id": run_id}, {"$set": {"email_id": email_id, "done_at": datetime.now(timezone.utc).isoformat()}})
        logger.info(f"Weekly digest sent (run {run_id}, {len(open_items)} open)")
    except Exception:
        logger.exception(f"Weekly digest failed (run {run_id})")


@api_router.post("/cron/weekly-digest")
async def cron_weekly_digest(request: Request):
    # Cron endpoints must ack 2xx immediately; enqueue/background the actual work.
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else ""
    if not token or not hmac.compare_digest(token, WEBHOOK_CRON_SECRET):
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        envelope = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body")
    run_id = (envelope or {}).get("run_id") or request.headers.get("X-Webhook-Id") or str(uuid.uuid4())
    existing = await db.cron_runs.find_one({"run_id": run_id})
    if existing:
        return {"status": "duplicate", "run_id": run_id}
    await db.cron_runs.insert_one({
        "run_id": run_id,
        "schedule_id": (envelope or {}).get("schedule_id", "weekly-enquiry-digest"),
        "received_at": datetime.now(timezone.utc).isoformat(),
    })
    asyncio.create_task(_run_weekly_digest(run_id))
    return {"status": "accepted", "run_id": run_id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")

    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    # Seed only when missing — the dashboard lets the owner change the password
    # in-app, so reconciling against env on every restart would silently revert it.
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
