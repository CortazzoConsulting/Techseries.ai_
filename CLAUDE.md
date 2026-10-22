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
- `og-aiday.jpg` — 1200x630 social card for Atlanta AI Day
- `og-summit.jpg` — superseded card from the Executive Summit branding
  **Social images must be real files, never base64 data URIs** — LinkedIn, Facebook
  and iMessage cannot fetch a data: URI, so a data-URI og:image shows no preview.
- `atlanta-ai-day/index.html` — static entry point with the event's title, OG/Twitter
  tags and Event schema, handing off to the SPA via /?p=atlanta-ai-day
- `executive-summit/index.html` — kept so old links survive; forwards to /atlanta-ai-day/

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
| Atlanta AI Day: The State of AI — Now & Next | Dec 10 | 9:00 AM–6:00 PM | `--gold` | YEAR-END FLAGSHIP (ticketed) |
| TechSeries AM | Monthly | 7:30–9:00 AM | `#a78bfa` | Recurring |

## Getnetworked URLs
- Community: https://app.getnetworked.com/techseries.ai
- Apr 30: https://app.getnetworked.com/event/-tech-series-kickoff-ai-native-companies-how-modern-businesses-are-actually-running-on-ai
- Jun 18: https://app.getnetworked.com/event/-the-economics-of-ai-roi-costs-and-scaling-reality
- Aug 20: https://app.getnetworked.com/event/-building-ai-ready-teams-talent-culture-leadership-in-the-ai-era
- Oct 22: https://app.getnetworked.com/event/-autonomous-business-systems-from-automation-to-ai-agents
  (The event was renamed in place to AI in Real Estate — the old slug is still the
  live URL and matches the flyer QR code. Don't "fix" it to a real-estate slug.)
- Dec 10: https://app.getnetworked.com/event/-executive-summit-the-state-of-ai-in-business-2027
  (Renamed in place to Atlanta AI Day — the old slug is still the live URL and matches
  the flyer QR code. Don't "fix" it, exactly like the Oct 22 event.)

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
- `RESEND_API_KEY` **is set and email is working** (verified Oct 21, 2026 — /subscribe,
  /speaker and /sponsor all return real Resend message ids).
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


## Atlanta AI Day — Thursday, December 10, 2026
Year-end flagship: "The State of AI — Now & Next". Tagline: one city, every AI
community, one day. Page: `pg-ev-summit` (id kept; only the branding changed),
reachable at techseries.ai/atlanta-ai-day/ and the legacy /executive-summit/.
- 9:00 AM–6:00 PM · **Life Time Work Sandy Springs — venue is CONFIRMED**, not TBA
- Built in blocks with real breaks, not back-to-back sessions
- Tickets (GetNetworked is the only checkout): Founding Community $79 · Early Bird
  $99 · General $149 · VIP Executive $249 · Corporate Team $499 for 4
- **`SUMMIT_TICKETS_LIVE` gates everything.** Still `false`: GetNetworked shows the
  event as Private/Free with an RSVP request and no purchasable tiers. While false,
  every tier reads "Not yet on sale" and all CTAs read "RSVP for Atlanta AI Day",
  matching GetNetworked, which still lists the event as a free RSVP with no
  purchasable tiers. When tiers go live, flipping the flag switches CTAs to
  "Get Your Tickets".
  Flip to `true` only after confirming a member of the public can actually buy.
- Sponsorship: Presenting $10K (1) · Platinum $5K (2) · Gold $2.5K (4) · Silver $1K (6)

## Site-wide top banner
`.topbar` is fixed above the nav on every page, promoting Atlanta AI Day. It is
offset-safe: `body{padding-top:var(--tb)}` and `nav{top:var(--tb)}` move together,
so nav-to-content spacing is unchanged. `--tb` is 34px desktop / 32px mobile, where
the `.tb-long` date+venue span is hidden to keep it on one line.

## Intake forms — speaker & sponsor
Real forms, not mailto. `submitIntake(kind, P)` in `index.html` POSTs JSON to the
Worker. `P` is the element-id prefix, so the same form can appear more than once:
`spk` (Atlanta AI Day page), `hspk` (home page), `spo` (sponsor). Every instance
needs its own `{P}-form`, `{P}-first`, `{P}-last`, `{P}-email`, `{P}-btn`,
`{P}-status` — duplicate ids will break both copies.
- `POST /speaker` — firstName, lastName, email
- `POST /sponsor` — plus company, interest, message
Both send a TechSeries-branded confirmation to the applicant (`intakeEmailHTML`) and a
notification to ethan@techseries.ai with `reply_to` set to the applicant. Submitted
values are HTML-escaped before entering the notification email.
The UI validates first name and email, disables the button while sending, hides the
inputs on success, and on failure shows the server's reason plus a mailto fallback.
**Never replace these with a form that posts nowhere** — the old sponsors-page form
faked a success message while discarding submissions.

### Publication rules for Atlanta AI Day — do not break these
1. **No community partner or speaker may be named, logo'd, or hinted at** anywhere —
   page copy, metadata, structured data, or source — until the organizer approves
   that specific announcement in writing. `SUMMIT_PARTNERS` ships empty and the
   partner block stays `hidden`; adding an entry is what publishes it.
2. Speakers show "Speaker Announcements Coming Soon" until confirmed.
3. No attendance projections. Internal targets (200–300 attendees, 6–8 partners,
   12–18 speakers) are planning figures and must never appear publicly.
4. Venue is confirmed: Life Time Work Sandy Springs. (Was TBA until Oct 2026.)
5. Don't promise catering, VIP perks, or sponsor activations before they're confirmed.
6. Registration/payment stays on GetNetworked — never add a second checkout.
7. Atlanta AI Day changes are deployed normally now; the pre-launch approval gate
   applied to the original summit build.
8. No unverified attendance or speaker counts in copy **or artwork**. The supplied
   summit flyer's "1,000+ attendees · 30+ speakers" line was painted out before use.
