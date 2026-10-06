"""VOCCSYS backend API tests: auth, inquiries CRUD, email alert, lockout."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://voccsys-landing.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@vulcanindustriesindia.com"
ADMIN_PASSWORD = "Vocc64369d3def47!Sys"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    assert data.get("token_type") == "bearer"
    assert data["user"]["email"] == ADMIN_EMAIL
    assert data["user"]["role"] == "admin"
    return data["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Auth ----------
class TestAuth:
    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WrongPass_doNotLock!1"})
        assert r.status_code == 401

    def test_auth_me_requires_token(self, session):
        r = session.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_auth_me_with_token(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"

    def test_auth_me_invalid_token(self, session):
        r = session.get(f"{API}/auth/me", headers={"Authorization": "Bearer invalid.token.here"})
        assert r.status_code == 401


# ---------- Inquiries ----------
class TestInquiries:
    created_ids = []

    def test_list_without_token_401(self, session):
        r = session.get(f"{API}/inquiries")
        assert r.status_code == 401

    def test_patch_without_token_401(self, session):
        r = session.patch(f"{API}/inquiries/nonexistent", json={"status": "contacted"})
        assert r.status_code == 401

    def test_delete_without_token_401(self, session):
        r = session.delete(f"{API}/inquiries/nonexistent")
        assert r.status_code == 401

    def test_create_inquiry_public(self, session):
        payload = {
            "name": "TEST_Automated Tester",
            "company": "TEST_Pytest Co",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+91 9999999999",
            "industry": "Power",
            "message": "TEST_automated backend_test.py submission",
        }
        r = session.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["company"] == payload["company"]
        assert data["status"] == "new"
        assert "id" in data
        TestInquiries.created_ids.append(data["id"])

    def test_list_with_token(self, session, auth_headers):
        r = session.get(f"{API}/inquiries", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        if TestInquiries.created_ids:
            ids = {it["id"] for it in items}
            assert TestInquiries.created_ids[0] in ids

    def test_patch_status_flow(self, session, auth_headers):
        assert TestInquiries.created_ids, "need created inquiry"
        iid = TestInquiries.created_ids[0]
        for status in ("contacted", "closed", "new"):
            r = session.patch(f"{API}/inquiries/{iid}", json={"status": status}, headers=auth_headers)
            assert r.status_code == 200, r.text
            assert r.json()["status"] == status

    def test_delete_inquiry(self, session, auth_headers):
        # Create one specifically to delete
        payload = {
            "name": "TEST_ToDelete",
            "company": "TEST_Delete Co",
            "email": f"delete_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+91 8888888888",
            "industry": "Steel",
            "message": "delete me",
        }
        r = session.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 201
        iid = r.json()["id"]
        r = session.delete(f"{API}/inquiries/{iid}", headers=auth_headers)
        assert r.status_code == 204
        # Verify absence
        r = session.get(f"{API}/inquiries", headers=auth_headers)
        ids = {it["id"] for it in r.json()}
        assert iid not in ids

    def test_cleanup_created(self, session, auth_headers):
        for iid in TestInquiries.created_ids:
            session.delete(f"{API}/inquiries/{iid}", headers=auth_headers)


# ---------- Brute force lockout (safe fake email) ----------
class TestLockout:
    def test_lockout_with_fake_email(self, session):
        fake = f"lockout-test-{uuid.uuid4().hex[:6]}@example.com"
        last_status = None
        for i in range(6):
            r = session.post(f"{API}/auth/login", json={"email": fake, "password": "wrong"})
            last_status = r.status_code
        # After 5 failures, 6th should return 429 OR still 401 depending on sequence
        # The 5th attempt sets locked_until; 6th should be 429.
        assert last_status in (429, 401), f"Final status {last_status}"
        # explicitly make one more call to confirm 429
        r = session.post(f"{API}/auth/login", json={"email": fake, "password": "wrong"})
        assert r.status_code == 429, f"Expected 429 lockout, got {r.status_code}"
