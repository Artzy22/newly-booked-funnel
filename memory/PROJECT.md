---
name: B2B High-Ticket Landing Page (Newly Booked funnel) — project-local copy
description: In-folder memory for the Newly Booked B2B funnel. Mirrors ~/.claude/projects/-Users-jesus-/memory/project_b2b_funnel.md so the project carries its own context.
type: project
---

# Newly Booked B2B Funnel — project-local memory

> This file lives inside the project so it travels with the repo. The canonical copy is at `~/.claude/projects/-Users-jesus-/memory/project_b2b_funnel.md`. Keep them in sync.

## Quick orientation
- 5-page funnel: Landing → Schedule → Confirmed → Privacy → Terms
- React via unpkg + Babel-standalone in-browser JSX (no build step)
- Two-host pattern: GitHub Pages serves JSX/CSS/assets as CDN; GHL Custom HTML elements paste wrapper HTML that loads from that CDN via `<base href>`
- Dev server: `python ~/.claude/dev_server.py` (no-cache)

## Hosting
- **GitHub:** https://github.com/Artzy22/newly-booked-funnel (public)
- **GitHub Pages:** https://newly-booked.github.io/newly-booked-funnel/
- **GHL production (newlybooked.com):**
  - Landing: `/landing-page-480036`
  - Schedule: `/schedule`
  - Confirmed: `/thank-you-page-847536`
  - Privacy: `/privacy-page`
  - Terms: `/terms-1902-page`

## Brand
- **Newly Booked, Co.** DBA Mirrored Aesthetics
- 198 Ashford Rd, Eastford, CT 06242
- ivan@newlybooked.com · 860-634-6622
- CEO: Ivan Merlo-Iglikov

## Brand voice rules
- **NO em-dashes anywhere in visible body copy.** Hard rule. Jesus flags this every time.
- Owner-facing framing on copy ("every owner asks", "make sense", "converting")

## GHL integration
- **Calendar ID:** `BGNQmAzoXkDO1ZTo90c0`
- **Host:** `api.leadconnectorhq.com` (NOT `link.newlybooked.com` — SSL cert flaky, breaks Safari blank-white and Chrome ERR_SSL_PROTOCOL_ERROR)
- **Form ID:** `OBcU0DQg0xrj8cZrJdbg`
- **Hidden form CSS class:** `nb-hidden-form`
- **Form fields (order = GHL query_keys):**
  1. Full Name (single combined, `full_name`)
  2. Phone
  3. City
  4. Email
  5. Monthly Revenue (custom)
  6. Top Treatment (custom)
  7. Combined SMS consent
- **Hidden-form-fill:** use native `HTMLInputElement.prototype.value` setter (bypass React state). `knownNames` MUST include `full_name` and `name` so revenue doesn't slide into the name field.
- **iframe auto-resize id pattern:** `${NB_GHL_CALENDAR_ID}_${Date.now()}` via useMemo

## File map
- `app.jsx` — landing (qualifier quiz + hidden GHL form)
- `qualifier.jsx` — GHL hidden-form-fill (submitContact pattern)
- `scheduler-app.jsx` / `scheduler.jsx` — GHL booking iframe
- `confirmed-app.jsx` — thank-you (Hammer Them + testimonials + FAQ)
- `tweaks-panel.jsx` — has `window.nbUrl(name, fallback)` (ignores `[REPLACE_*]` placeholders)
- `confirmed.html`, `schedule.html`, `privacy.html`, `terms.html`, `index.html`
- `ghl-pages/*.html` — paste-ready GHL Custom HTML wrappers

## Confirmed page section flow
1. Hero ("You're locked in") with URL-param personalization (name/slot)
2. **Hammer Them grid** — "Before the call" / "The 14 questions every owner asks, *answered*." 3-col desktop, 2-col tablet, 1-col mobile. Aspect 4/5, no HTML overlays
3. SMS callout
4. Text FAQ
5. Hear it from them (6 testimonials)
6. How it works
7. How to prepare

## Wistia IDs

**Testimonials:**
- Isabel `8t1vtmy0my`, Natalie `s6a0lg2l2b`, Couzue `krkefwptbl`, Azmi `f0vlaj8cng`, Micaela `4ft5xbenoa`, Eliana `69l69xocrq`

**Hammer Them (CF_HAMMERTHEM in confirmed-app.jsx):**
| ix | Question | Wistia ID |
|----|----------|-----------|
| 1  | I haven't got enough time. | `bfmbtvg832` |
| 2  | How do we make you stand out? | `m6169m7kzu` |
| 3  | How do we know it works? | `9u2ckyrqak` |
| 4  | Is it better for me to make the ads, or you? | `32piq6olrt` |
| 6  | How fast can I see results? | `56fd2qfcan` |
| 7  | Is hiring an agency a short-term fix? | `hgbgrog83d` |
| 8  | I've tried ads before, it didn't work. | `p2fzrg1hip` |
| 9  | Do you have testimonials? | `71evnaexa7` |
| 10 | Do you guarantee results? | `38zhblnara` |
| 11 | Which treatment should I advertise? | `ahhhq7v5d9` |
| 12 | How our patient sales team works. | `esh8li4zt4` |
| 13 | Why 9 out of 10 medspas fail with agencies. | `q9gvm2tpk2` |
| 14 | If you've been burned before. | `253llfn0ms` |
| 15 | How our patient acquisition system works. | `i2wlf5j7is` |

## Cross-page nav
- `window.__NB_LANDING_URL`, `__NB_SCHEDULE_URL`, `__NB_CONFIRMED_URL`, `__NB_PRIVACY_URL`, `__NB_TERMS_URL`
- Helper: `window.nbUrl(name, fallback)` ignores `[REPLACE_*]` placeholder strings

## Gotchas
- Hash-anchor scroll handlers must be narrow: `a` with `href` literally starting with `#`, skip modifier keys. Greedy selector hijacks form-submit buttons.
- Videos too big for git (2.6GB) → route through Wistia, swap IDs into CF_HAMMERTHEM
- HTML overlays on Hammer Them tiles double the in-video chyrons and cover Ivan's face — leave videos bare
- Two folder copies exist: this one (BNBFOLDER) is canonical, Desktop copy is older
