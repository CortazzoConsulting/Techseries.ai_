# TechSeries.ai — Claude Code Context

## Project
Single-file HTML SPA for TechSeries.ai — Atlanta's AI business event series.
Live at: https://techseries.ai
GitHub: cortazzoconsulting/Techseries.ai_ (branch: main)
Hosting: Cloudflare Pages (auto-deploys on git push)

## Files
- `index.html` — the entire website (~7.8MB single-file SPA, base64 images embedded)
- `worker.js` — Cloudflare Worker for email subscriptions via Resend
- `CNAME` — custom domain for Cloudflare Pages

## Deployment
```bash
git add index.html
git commit -m "description of change"
git push origin main
# Cloudflare auto-deploys in ~60 seconds
```

The Worker deploys separately from Pages — pushing `worker.js` does NOT deploy it.
Deploy the Worker with `wrangler deploy`, or paste it into the Cloudflare dashboard.

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
| Autonomous Business Systems | Oct 22 | 5:00–7:30 PM | `--red` | CURRENT MAIN EVENT |
| Executive Summit 2027 | Dec 9 | All Day | `--gold` | Upcoming |
| TechSeries AM | Monthly | 7:30–9:00 AM | `#a78bfa` | Recurring |

## Getnetworked URLs
- Community: https://app.getnetworked.com/techseries.ai
- Apr 30: https://app.getnetworked.com/event/-tech-series-kickoff-ai-native-companies-how-modern-businesses-are-actually-running-on-ai
- Jun 18: https://app.getnetworked.com/event/-the-economics-of-ai-roi-costs-and-scaling-reality
- Aug 20: https://app.getnetworked.com/event/-building-ai-ready-teams-talent-culture-leadership-in-the-ai-era
- Oct 22: https://app.getnetworked.com/event/-autonomous-business-systems-from-automation-to-ai-agents
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
- Speaker: TBA (not yet announced)
- Sponsors: Getnetworked, Cortazzo Consulting LLC, + 1 other
- Format: Keynote + Panel + Networking Reception
- Schedule: 5:00 arrival → 5:30 program → 6:30 networking

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
