"""
VOCCSYS Backend API Tests
Covers:
- GET /api/         : service status
- POST /api/inquiries: create inquiry (valid, invalid email, missing field)
- GET /api/inquiries: list inquiries in reverse chronological order
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://voccsys-landing.preview.emergentagent.com",
).rstrip("/")

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Service status ----------
class TestServiceStatus:
    def test_root_returns_ok(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "VOCCSYS API"
        assert data.get("status") == "ok"


# ---------- POST /api/inquiries validation ----------
class TestInquiryValidation:
    def test_invalid_email_returns_422(self, api_client):
        payload = {
            "name": "TEST_John Doe",
            "company": "TEST_Acme Corp",
            "email": "not-an-email",
            "phone": "+91 9876543210",
            "industry": "Power Generation",
            "message": "invalid email test",
        }
        r = api_client.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 422, f"expected 422 got {r.status_code}: {r.text}"
        body = r.json()
        assert "detail" in body

    def test_missing_required_field_returns_422(self, api_client):
        payload = {
            # missing "name"
            "company": "TEST_Acme Corp",
            "email": "user@example.com",
            "phone": "+91 9876543210",
            "industry": "Power Generation",
        }
        r = api_client.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 422
        body = r.json()
        assert "detail" in body
        # confirm the missing field is flagged
        joined = str(body["detail"]).lower()
        assert "name" in joined

    def test_short_name_returns_422(self, api_client):
        # name has min_length=2
        payload = {
            "name": "A",
            "company": "TEST_Acme Corp",
            "email": "user@example.com",
            "phone": "+91 9876543210",
            "industry": "Power Generation",
        }
        r = api_client.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 422


# ---------- POST /api/inquiries success + GET verification ----------
class TestInquiryCreateAndList:
    def test_create_inquiry_persists_and_is_listed(self, api_client):
        unique_marker = f"TEST_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": f"TEST_John {unique_marker}",
            "company": f"TEST_Acme {unique_marker}",
            "email": f"{unique_marker}@example.com",
            "phone": "+91 9876543210",
            "industry": "Power Generation",
            "message": "Please demo VOCCSYS.",
        }
        r = api_client.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 201, f"expected 201 got {r.status_code}: {r.text}"

        created = r.json()
        # Response structure
        assert "id" in created and isinstance(created["id"], str) and len(created["id"]) > 0
        assert "created_at" in created and isinstance(created["created_at"], str)
        # Data values persisted
        assert created["name"] == payload["name"]
        assert created["company"] == payload["company"]
        assert created["email"] == payload["email"]
        assert created["phone"] == payload["phone"]
        assert created["industry"] == payload["industry"]
        assert created["message"] == payload["message"]

        created_id = created["id"]

        # Verify via GET /api/inquiries that the record is persisted
        r2 = api_client.get(f"{API}/inquiries")
        assert r2.status_code == 200
        items = r2.json()
        assert isinstance(items, list)
        ids = [it.get("id") for it in items]
        assert created_id in ids, "created inquiry not returned by GET /api/inquiries"

        found = next(it for it in items if it.get("id") == created_id)
        assert found["email"] == payload["email"]
        assert found["company"] == payload["company"]
        # no MongoDB _id leaking
        assert "_id" not in found

    def test_list_inquiries_reverse_chronological(self, api_client):
        # create two inquiries with a small delay
        base = f"TEST_{uuid.uuid4().hex[:6]}"

        p1 = {
            "name": f"TEST_First {base}",
            "company": "TEST_Order Co",
            "email": f"first_{base}@example.com",
            "phone": "+91 9000000001",
            "industry": "HVAC / District Cooling",
            "message": "first",
        }
        r1 = api_client.post(f"{API}/inquiries", json=p1)
        assert r1.status_code == 201
        id1 = r1.json()["id"]

        time.sleep(1.2)  # ensure created_at differs

        p2 = {
            "name": f"TEST_Second {base}",
            "company": "TEST_Order Co",
            "email": f"second_{base}@example.com",
            "phone": "+91 9000000002",
            "industry": "HVAC / District Cooling",
            "message": "second",
        }
        r2 = api_client.post(f"{API}/inquiries", json=p2)
        assert r2.status_code == 201
        id2 = r2.json()["id"]

        r_list = api_client.get(f"{API}/inquiries")
        assert r_list.status_code == 200
        items = r_list.json()
        ids = [it["id"] for it in items]
        assert id1 in ids and id2 in ids

        # Verify descending order: id2 should appear before id1
        pos1 = ids.index(id1)
        pos2 = ids.index(id2)
        assert pos2 < pos1, (
            "GET /api/inquiries not returning reverse chronological order "
            f"(pos of newer={pos2}, older={pos1})"
        )

        # Verify created_at strictly descending across the whole list
        created_ats = [it["created_at"] for it in items]
        assert created_ats == sorted(created_ats, reverse=True), (
            "created_at values are not sorted descending"
        )


# ---------- Edge case: empty payload ----------
class TestInquiryEdgeCases:
    def test_empty_body_returns_422(self, api_client):
        r = api_client.post(f"{API}/inquiries", json={})
        assert r.status_code == 422

    def test_message_optional(self, api_client):
        # message is optional - inquiry should still be created if omitted
        payload = {
            "name": "TEST_NoMessage",
            "company": "TEST_Co",
            "email": f"nomsg_{uuid.uuid4().hex[:6]}@example.com",
            "phone": "+91 9999999999",
            "industry": "Steel / Metals",
        }
        r = api_client.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 201
        data = r.json()
        assert data["message"] == ""
