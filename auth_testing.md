# Auth Testing Playbook — VOCCSYS Admin

Implementation: Bearer JWT (12h access token, no cookies). Token stored in
localStorage under `vocc_admin_token` by the frontend.

Step 1: MongoDB verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`; unique index on users.email; index on login_attempts.identifier.

Step 2: API testing (use external REACT_APP_BACKEND_URL for e2e; localhost:8001 works locally)
```
# Login (expect 200 + access_token)
curl -s -X POST $API/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@vulcanindustriesindia.com","password":"Vocc64369d3def47!Sys"}'

# Me (expect user object)
curl -s $API/api/auth/me -H "Authorization: Bearer <token>"

# Protected list without token (expect 401)
curl -s -o /dev/null -w "%{http_code}" $API/api/inquiries

# Protected list with token (expect 200 array)
curl -s $API/api/inquiries -H "Authorization: Bearer <token>"

# Bad password (expect 401; 5 consecutive failures lock the IP+email pair for 15 min — 429)
curl -s -X POST $API/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@vulcanindustriesindia.com","password":"wrong"}'
```
Note for brute-force tests: lockout is keyed by "{ip}:{email}". Testing from a
different IP (external URL vs localhost) uses a separate counter.

Step 3: Frontend flow
1. Open /admin -> should redirect to /admin/login when no token
2. Sign in with admin credentials -> lands on /admin dashboard listing enquiries
3. Filter tabs, status buttons (Contacted / Close / Reopen), Delete (confirm dialog), Sign out
