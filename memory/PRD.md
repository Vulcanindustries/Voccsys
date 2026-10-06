# VOCCSYS Landing Page — PRD

## Original Problem Statement
Build a landing page for VOCCSYS (Vulcan Online Condenser Cleaning System) — a patented industrial engineering product by Vulcan Industries India.

## User Choices (2026-12)
- Industries: All (Power, HVAC, Petrochemical, Steel, Sugar, Chemical)
- Sections: All (Hero, Overview, How It Works, Benefits/ROI, Specs, Industries, Trust, Contact, Footer)
- Contact form: Saved to MongoDB (email integration deferred)
- Design: Delegated to design_agent → dark industrial theme
- Logo: Text-based wordmark
- Contact recipient email: contactus@vulcanindustriesindia.com

## Architecture
- FastAPI backend (/api/inquiries POST/GET, /api/status)
- MongoDB storage (inquiries collection)
- React 19 frontend with framer-motion, lucide-react, sonner (toasts)
- Design system: Chivo + IBM Plex Sans fonts, #F59E0B amber accent on #09090B graphite

## Implemented (2026-12)
- Sticky header with in-page nav + mobile menu
- Hero with headline, dual CTAs, hero stats + system snapshot
- Overview section (3 pillars: Continuous / Mechanical / Proven)
- How It Works: animated SVG diagram (sponge balls flowing through tubes + return loop) + 4-step process cards
- Benefits: 4 metric cards + 6 benefit tiles with lucide icons
- Technical Specs: 4 spec group grid (Configuration, Sponge Balls, System, Compliance)
- Industries Served: 6 industry cards
- Trust: marquee client logos + 3 testimonials
- Contact form (Name/Company/Email/Phone/Industry/Message) → POST /api/inquiries
- Footer with brand + explore + contact
- All key elements carry data-testid attributes
- Sonner toasts for form submission feedback
- `noValidate` form + custom JS validation for consistent toast UX

## Backlog / Next Actions
- **P1**: Email notifications on new inquiries (Resend/SendGrid) — needs API key from user
- **P1**: Admin view for saved inquiries (currently only via GET /api/inquiries)
- **P2**: Add real case-study logos + photos when brand assets provided
- **P2**: SEO metadata (title, OG tags, sitemap)
- **P3**: Multi-language (Hindi) toggle for regional B2B outreach
- **P3**: PDF brochure download CTA

## Update (2026-07-06) — Hash anchor navigation fix
- Added `ScrollToHash` component in `App.js`: watches route changes, smooth-scrolls to element matching URL hash (e.g. `#contact`), scrolls to top otherwise. Fixes React Router not auto-scrolling on cross-page anchor links.
- Added `scroll-mt-20` to Contact section so it clears the sticky header on anchor scroll.
- FAQ page links "Reach out to our team." and "Ask our team →" now land on home page scrolled to the Contact section (verified: click tests + direct `/#contact` load, contact_top ≈ 80px).

## Update (2026-07-06, evening) — Email alerts, Admin dashboard, Case study, Video check
- **Email alerts**: POST /api/inquiries now sends a branded notification email to contactus@vulcanindustriesindia.com via Emergent managed Resend proxy (env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, EMAIL_REPLY_TO, OWNER_EMAIL). Guardrail gate `_assert_safe_email` on every send. Inquiry still succeeds (201) if email fails; failure logged.
- **Admin dashboard**: JWT Bearer auth (12h token, localStorage `vocc_admin_token`). Routes: POST /api/auth/login (brute-force lockout: 5 fails = 15 min, keyed on X-Forwarded-For first hop + email), GET /api/auth/me. GET/PATCH/DELETE /api/inquiries now admin-only (401 without token). Frontend pages /admin/login and /admin (filter tabs, status new/contacted/closed, delete, logout). Admin seeded idempotently from ADMIN_EMAIL/ADMIN_PASSWORD env.
- **Case Study section**: /app/frontend/src/components/site/CaseStudy.jsx between Trust and ROICalculator. "06 / Case Study", before/after metric table (backpressure, TTD, heat rate, downtime) + dark strip (+4.1 MW, 5.4 months payback). Clearly labelled "Illustrative example — representative 210 MW thermal unit". Contact renumbered to 07.
- **YouTube embed**: confirmed video u0iLiX1AXN8 shows "Video unavailable" — owner-side YouTube embed setting, NOT a code bug. User must enable "Allow embedding" in YouTube Studio.
- Tests: /app/backend/tests/test_voccsys_api.py (13 tests, all pass); /app/test_reports/iteration_3.json; /app/auth_testing.md.

## Update (2026-07-06, late) — Password change + Weekly digest cron
- **In-dashboard password change**: POST /api/auth/change-password (Bearer auth, verifies current password, min 10-char new). Dashboard header "Password" button opens modal (testids: password-change-form, pw-current-input, pw-new-input, pw-confirm-input, pw-save-button). Admin startup seed now only creates when missing — never reconciles hash against env (owner password is authoritative).
- **Weekly enquiry digest**: .emergent/crons.yml cron "weekly-enquiry-digest", Monday 9:00 Asia/Kolkata -> POST /api/cron/weekly-digest. Route verifies Bearer WEBHOOK_CRON_SECRET (constant-time), idempotent via run_id in db.cron_runs, acks immediately and emails in background (open = new+contacted enquiries). Verified: 401 no/wrong auth, 400 bad body, accepted+duplicate flow, digest email 202 Accepted.
- **Fix**: admin dashboard mobile (375px) horizontal overflow — header now wraps.
- Regression: 13/13 backend pytest pass.
- Deferred by user: real case study data (keeping illustrative example until user sends verified numbers).

## Update (2026-07-06, final) — Questionnaire link
- Footer Explore column now includes "Questionnaire" (data-testid=footer-questionnaire-link) -> https://forms.gle/h3nt7HpikzScrfHy6, opens in new tab. Verified: click resolves to the live Google Form.

## Update (2026-07-06) — Footer cleanup
- Explore column reordered: Questionnaire now above FAQ.
- Bottom strip: removed duplicate FAQ and Privacy Policy links (now only "VOCCSYS™ · Made in India"). Privacy Policy still linked in the footer Contact column; FAQ still in Explore.

## Update (2026-07-06) — Case Study moved to its own page
- Landing-page Case Study section removed (old components/site/CaseStudy.jsx deleted; Contact renumbered back to 06).
- New standalone page /case-study (src/pages/CaseStudy.jsx): headline, illustrative-example card, before/after metrics table, net-effect strip, CTA "Request a proposal" -> /#contact.
- Footer Explore column: "Case study" link added between Questionnaire and FAQ (data-testid=footer-casestudy-link).
- Verified: page renders desktop+mobile (no overflow), footer link routes correctly, CTA lands on contact section, landing has no leftover section.
