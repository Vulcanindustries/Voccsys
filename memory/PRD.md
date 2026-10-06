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
