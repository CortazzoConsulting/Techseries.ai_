# TechSeries.ai — Claude Code Context

## Project
Single-file HTML SPA for TechSeries.ai — Atlanta's AI business event series.
Live at: https://techseries.ai
GitHub: cortazzoconsulting/Techseries.ai_ (branch: main)
Hosting: **GitHub Pages** (auto-deploys on git push; Cloudflare is only DNS/CDN
in front). There are no Cloudflare Pages Functions, no `_redirects`, and no edge
rewrites — clean URLs need a real directory with an index.html.

## Files
- `index.html` — the entire website (~9.4MB single-file SPA, base64 images embedded).
  The Oct 22 page carries a 17-image "Event Preview" gallery (the social carousel),
  embedded at 800px wide / JPEG q70 to keep the file from ballooning. Resize any new
  gallery art the same way before embedding — full-resolution art will add megabytes.
- `worker.js` — Cloudflare Worker for email subscriptions via Resend
- `CNAME` — custom domain for Cloudflare Pages
- `og-default.jpg` — 1200x630 site-wide social card (home/all SPA routes)
- `og-summit.jpg` — 1200x630 social card for the summit
  **Social images must be real files, never base64 data URIs** — LinkedIn, Facebook
  and iMessage cannot fetch a data: URI, so a data-URI og:image shows no preview.
- `executive-summit/index.html` — static entry point carrying the summit's title,
  OG/Twitter tags and Event schema, then handing off to the SPA via /?p=executive-summit

## Deployment
```bash
git add index.html
git commit -m "description of change"
git push origin main
# Cloudflare auto-deploys in ~60 seconds
```

Pages and the Worker are two separate deploys from this one repo:
- **GitHub Pages** serves the site; `index.html` goes live ~40s after a push.
- **Worker** (`restless-forest-42da`, the email endpoint) deploys via Workers
  Builds, configured by `wrangler.toml`. Once Workers Builds is connected to
  this repo, pushing `worker.js` deploys it too.

If Workers Builds is ever disconnected, the Worker must be deployed by hand
(dashboard -> Edit code -> paste -> Deploy) and will otherwise silently keep
running old code while the repo moves ahead.

## Navigation System
- All pages: `<div id="pg-{id}" class="pg">`
- Navigate with: `go('id')` in JS — `go()` prepends `pg-` to find the element
- Nav map in the script block maps page IDs to nav link IDs
- CRITICAL: every `go('x')` call must have a matching `id="pg-x"` page div

## All 22 Pages
pg-home, pg-series, pg-ev-april, pg-ev-june, pg-ev-august,
pg-ev-october, pg-ev-summit, pg-ev-am, pg-past, pg-past-1,
pg-past-2, pg-past-3, pg-past-4, pg-past-5, pg-past-aug,
pg-speakers, pg-team, pg-sponsors, pg-community, pg-faq,
pg-about, pg-register

## Brand
- Fonts: Bebas Neue (display), DM Sans (body), DM Mono (mono)
- Colors: `--blue:#1a3aff` · `--green:#00c472` · `--orange:#ff5a1f` · `--red:#e8192c` · `--gold:#c9a227` · bg `#0a0a0f`
- Nav: TECHSERIES.AI wordmark + "Powered by Getnetworked" (text only, no logo)
- Custom cursor: blue dot + lagging ring, ripple on click
- Mobile hamburger at ≤900px

## Canonical Stats — NEVER CHANGE WITHOUT EXPLICIT INSTRUCTION
- Community Members: 500+
- Events This Year: 5
- Industry Speakers: 20+
- Registrations: 800+
- In-Person Attendees: 300+
- Organic Impressions: 108K+
- Organic Growth: 100%
- Exec Decision-Makers: 237
- Founded: 2025
- Location: Atlanta, Georgia

## 2026 Event Series

| Event | Date | Time | Color | Status |
|-------|------|------|-------|--------|
| AI-Native Companies | Apr 30 | 4:00–7:30 PM | `#6b8cff` | Completed |
| The Economics of AI | Jun 18 | 5:30–7:30 PM | `--green` | Completed |
| Building AI-Ready Teams | Aug 20 | 5:00–7:30 PM | `--orange` | Completed |
| AI in Real Estate: From Leads to Deals | Oct 22 | 5:00–8:30 PM | `--red` | CURRENT MAIN EVENT (ticketed) |
| Executive Summit 2027 | Dec 9 | 9:00 AM–6:00 PM EST | `--gold` | Flagship, ticketed |
| TechSeries AM | Monthly | 7:30–9:00 AM | `#a78bfa` | Recurring |

## Getnetworked URLs
- Community: https://app.getnetworked.com/techseries.ai
- Apr 30: https://app.getnetworked.com/event/-tech-series-kickoff-ai-native-companies-how-modern-businesses-are-actually-running-on-ai
- Jun 18: https://app.getnetworked.com/event/-the-economics-of-ai-roi-costs-and-scaling-reality
- Aug 20: https://app.getnetworked.com/event/-building-ai-ready-teams-talent-culture-leadership-in-the-ai-era
- Oct 22: https://app.getnetworked.com/event/-autonomous-business-systems-from-automation-to-ai-agents
  (The event was renamed in place to AI in Real Estate — the old slug is still the
  live URL and matches the flyer QR code. Don't "fix" it to a real-estate slug.)
- Dec 9:  https://app.getnetworked.com/event/-executive-summit-the-state-of-ai-in-business-2027

## Past Events
- **pg-past-1** — Oct 30, 2025 · Responsible AI & Best Practices
  Jeff Sizemore, Mayor Rusty Paul, Kyle Tothill, Vik Dhawan, Ravi Bijlani, Jonathan Hessing
- **pg-past-2** — Dec 18, 2025 · AI in the Workplace
  Amyn Sadruddin, Sarah Woodward, Nandu Shah, Nicola Smith (Southwest Airlines),
  Brian Fletcher, Aby Varma (Spark Novus), Sean Wood, Misha Sulpovar
- **pg-past-3** — Feb 19, 2026 · Future of AI & Business in 2026
  Kwanza Hall, Aby Varma, Erich Starrett, Dr. Beverly Wright, Aylin Orial,
  Mark Michelson, Stephanie Richards, Sree Pradhip & Ameet Shedge
- **pg-past-4** — Apr 30, 2026 · AI-Native Companies (Event 1 of 5)
  49 attended · 92% open to intros · 49% founders
- **pg-past-5** — Jun 18, 2026 · Economics of AI (Event 2 of 5)
  Jonathan Gonzalez (Global Controller, Microsoft)
  3,997 page views · 79 RSVPs · 4 sponsors · YouTube: https://youtu.be/85OhRvhN9jw
- **pg-past-aug** — Aug 20, 2026 · Building AI-Ready Teams (Event 3 of 5)
  James Stovall (Workfast Consulting, ex-Deloitte) + Sara Branch

## Current Main Event — October 22
**Tech Series: AI in Real Estate — From Leads to Deals**
How AI Agents & Automation Are Reshaping Real Estate. Industry-focused edition for
agents, brokers, investors, developers, lenders, property managers, builders,
architects, proptech, and vendors. Curated networking + AI-powered attendee matches
through GetNetworked.
- **Speakers (announced Oct 2026):**
  - Micro keynotes: Glennda Baker (The Queen of Real Estate Video, 1.4M+ followers,
    1B+ views) · Jim Fountain (Founder, Elated Real Estate, 27+ yrs, 1,000+ homeowners,
    $1B+ volume)
  - Panel: Tim Wright (moderator, Cushman & Wakefield) · Jessica Wade (eXp Realty) ·
    Mark Phillips (Phillips Brothers Real Estate) · Tim Stone (Seo Capital Group)
  - Host & MC: Ethan Cortazzo
- Partners: Ohlson & Medlock (closing attorneys), Elated Real Estate,
  Venture CPA & Tax Advisors, Life Time Work Sandy Springs (venue), Getnetworked
- Format: Keynote + Industry Panel + Workflow Demos + Q&A + Networking Reception
- Schedule: 5:00–6:00 arrival, curated networking + partner showcase →
  6:00–7:30 main program → 7:30–8:30 networking reception
- Food: light bites, drinks, charcuterie
- Tickets: **General Admission $30 (current)** · VIP Connect $49 (limited) ·
  Team Pass $75 (4 attendees). Early Bird $20 closed Oct 12 — its tier card is
  dimmed and marked "Sales ended" rather than removed.
- When a price window closes, update: home urgency line, home hero card ticket row,
  series card blurb, event hero meta, the tier cards, the sidebar card rows and
  footnote, and **both** pricing FAQs (there are two).

## Venue
Life Time Work Sandy Springs — 5600 Roswell Rd Building C, Sandy Springs, GA 30342

## Key Contact
Ethan Cortazzo — Founder & CEO, Getnetworked
ethan@techseries.ai · (480) 268-3484 · moderates all events

## Email System
- Worker endpoint: https://restless-forest-42da.ethan-93f.workers.dev/subscribe
- From: ethan@techseries.ai · Notify: ethan@techseries.ai
- techseries.ai is a verified sending domain in Resend. The records live in
  Cloudflare DNS: MX + SPF on `send.techseries.ai`, DKIM at
  `resend._domainkey.techseries.ai`. Leave them DNS-only (grey cloud).
- DMARC is `p=quarantine` with relaxed alignment, which those records satisfy.
  Don't move the sender to a domain that isn't verified — mail will be spam-filed.
- Welcome email fires automatically on subscribe
- **The Resend API key is a Cloudflare Worker secret named `RESEND_API_KEY`.**
  Never hardcode it in `worker.js` or write it into this file — this repo is public.
  Set or rotate it with: `wrangler secret put RESEND_API_KEY`

## Sponsor Pricing
- Single event: Platinum $2K · Gold $1K · Silver $500 · Bronze $250 · Vendor Booth $500
- 4-event series: Platinum $6,500 · Gold $3,250 · Silver $1,750 · Bronze $900
- Executive Summit: Platinum $5K · Gold $2,500 · Vendor Booth $750
- Annual partner: Platinum $10K · Gold $5K · Silver $2.5K · Bronze $1.25K

Sponsor inquiries stay as an internal form emailing ethan@techseries.ai.

## Key CSS Classes
`.pg` page wrapper (display:none unless `.on`) · `.s` section container · `.H2` display heading · `.desc` body paragraph
`.ev-hero`, `.ev-body`, `.ev-grid`, `.ev-main`, `.ev-card` — event page layout
`.pe-card`, `.pe-grid` — past event cards
`.schedule`, `.schedule-row`, `.schedule-time`, `.schedule-body` — event schedules
`.bp` primary blue button · `.bo` outline button · `.lbl` uppercase label
`.stats`, `.stat-item`, `.stat-num` — stats grid · `.pills`, `.pill` — tag pills
`.tli`, `.tl-date`, `.tl-body` — home timeline
`.comm-card`, `.comm-num` — community stats · `.faq-item` — FAQ accordion
`.gallery-img` — clickable photo (triggers lightbox)

## Key JS Functions
`go(id)` navigate to page · `toggleMob()` mobile menu · `toggleFAQ(el)` FAQ accordion
`openLightbox(src, alt, groupId)` · `lightboxNav(dir)` · `closeLightbox(e)`
`submitEmail()` email form submission · `updateHomeCd()` countdown timer · `countUp(el)` stat counter

## Critical Rules
1. NEVER change canonical stats without explicit instruction
2. Every `go('x')` needs a matching `id="pg-x"` — verify after edits
3. Div balance: every `<div>` needs a `</div>` — count after structural changes
4. Images are base64-embedded — never remove or externalize them
5. All event registration links go to Getnetworked URLs
6. Founded 2025 — never say 2024
7. Single file — everything lives in `index.html`
8. Never commit secrets. The Resend key belongs in a Cloudflare secret, not the repo
9. After any page rebuild, verify div balance and test navigation

## How to Update When an Event Completes
1. Add a past event card to the `pg-past` `.pe-grid` (newest first)
2. Create the `pg-past-{id}` detail page
3. Mark the series card Completed
4. Update home timeline: `opacity:.7`, change tag to Completed
5. Mark the next event "Next Up" on the series page
6. Update home hero: new flyer, countdown date, CTA button color + URL
7. Update the urgency line and hero card details
8. Add the new page to the nav map in `go()`
9. Update overall site stats if needed


## Executive Summit 2027 — December 9, 2026
Flagship full-day summit: "The State of AI in Business: 2027 Outlook".
Page: `pg-ev-summit`, also reachable at techseries.ai/executive-summit/ via the
static entry point `executive-summit/index.html` (GitHub Pages has no edge rewrites).
- 9:00 AM–6:00 PM EST · main program 10:00–5:00 · reception 5:00–6:00 · Atlanta, venue TBA
- Tickets (GetNetworked is the only checkout): Founding Community $79 (Oct 13–23) ·
  Early Bird $99 (Oct 24–Nov 6) · General $149 (Nov 7–Dec 9) · VIP Executive $249
  (Oct 13–Dec 7) · Corporate Team $499 for 4 (Oct 13–Dec 4)
- **`SUMMIT_TICKETS_LIVE` gates everything.** It is `false` until the tiers are
  actually live and purchasable in GetNetworked. While false, every tier shows
  "Not yet on sale" (no dates promised) and all CTAs read "Join the Priority List"
  pointing at the GetNetworked RSVP. Flip it to `true` only after confirming
  purchase works; the per-tier data-start/data-end windows then drive
  Coming soon / Available / Sales ended. Never "sold out" — only GetNetworked knows.
- Sponsorship inquiries use `sponsorInquiry()`, which validates and opens a prefilled
  email. There is no backend: the Worker's email has been down since RESEND_API_KEY
  was never set. Do not reintroduce a form that posts nowhere.
- Sponsorship: Presenting $10K (1) · Platinum $5K (2) · Gold $2.5K (4) · Silver $1K (6)

### Publication rules for the Summit — do not break these
1. **No community partner or speaker may be named, logo'd, or hinted at** anywhere —
   page copy, metadata, structured data, or source — until the organizer approves
   that specific announcement in writing. `SUMMIT_PARTNERS` ships empty and the
   partner block stays `hidden`; adding an entry is what publishes it.
2. Speakers show "Speaker Announcements Coming Soon" until confirmed.
3. No attendance projections. Internal targets (200–300 attendees, 6–8 partners,
   12–18 speakers) are planning figures and must never appear publicly.
4. Venue stays "announcing soon" until the booking is confirmed.
5. Don't promise catering, VIP perks, or sponsor activations before they're confirmed.
6. Registration/payment stays on GetNetworked — never add a second checkout.
7. Summit changes are not deployed without the organizer's explicit approval.
8. No unverified attendance or speaker counts in copy **or artwork**. The supplied
   summit flyer's "1,000+ attendees · 30+ speakers" line was painted out before use.
