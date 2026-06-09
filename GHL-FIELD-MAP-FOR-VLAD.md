# Newly Booked — Funnel → GHL Field Map (for Vlad)

This is the full map of how the apply-page quiz connects into GHL: every question,
the GHL field it fills, the field **type** it must be, the exact answer options, the
disqualify rules, and the keys. Last updated 2026-06-09.

---

## 1. How it connects (the mechanism)

- The funnel at **newlybooked.com/apply** is a custom quiz. On the final step it
  **fills a hidden GHL form sitting on the same page**, then clicks that form's
  submit. GHL creates the contact and runs the form's redirect.
- That hidden form is a GHL **Form element** with the custom CSS class
  **`nb-hidden-form`**, dropped onto the apply page and hidden off-screen.
- **Qualified** lead → form submits → GHL redirect → **schedule page**.
- **Disqualified** lead → the funnel skips the form (no contact created) and sends
  them to **newlybooked.com/dq**. The funnel owns the disqualify decision, not GHL.

So there is **no webhook and no Zapier** — the funnel types the answers into your
GHL form like a human would, then submits it.

---

## 2. Form setup to confirm in GHL

| Setting | Value |
|---|---|
| Form | "B2B SURVEY LANDING PAGE BV" (`eZdat7aJqX9PIs7I11tJ`) |
| Location | `xHVYjflu3TyKtrxryOzy` |
| Custom CSS class on the form | **`nb-hidden-form`** |
| How it's placed on /apply | As an **inline Form element** in the page builder — **NOT** the iframe/embed-code version |
| How it's hidden | Off-screen CSS (`position:absolute; left:-9999px`). **Do NOT use `display:none`** — that stops the inputs from initializing and nothing fills |
| On-Submit action | **Redirect → `https://newlybooked.com/schedule-822049`** |

---

## 3. Field TYPES — the one rule that matters most

The funnel can reliably fill **Radio** and **Single-line text** fields.
It **cannot** fill a **Dropdown** — GHL renders dropdowns as a custom widget the
script can't set, so they come through **blank**. This is what caused the missing
fields before.

**→ Every multiple-choice question must be a RADIO. Never a dropdown.**

| GHL field | Must be |
|---|---|
| Owns Medspa | **Radio** |
| Physical Location | **Radio** |
| Fat-Reduction Treatment | **Radio** |
| Monthly Revenue | **Radio** |
| Weekend Consults | **Radio** |
| Years in Business | **Radio** (text also works) |
| Sales Confidence | **Radio** |
| Ad / Agency Experience | **Radio** |
| What market(s) located in | **Single-line text** |
| Business Name | **Single-line text** |
| Full Name / Email / Phone / City / State | Standard fields |

---

## 4. Full field map (in funnel order)

| # | Question the lead sees | GHL field | Type | Disqualifies? |
|---|---|---|---|---|
| 1 | Do you own a medspa with treatment plans priced at $1,000+? | Owns Medspa | Radio | 1 option |
| 2 | Confirm you're a medspa with a physical location? | Physical Location | Radio | 3 options |
| 3 | Do you offer fat-reduction (Kybella / PCDC Liquid Lipo)? | Fat-Reduction Treatment | Radio | 1 option |
| 4 | What does your spa bring in per month? | Monthly Revenue | Radio | 2 options |
| 5 | Willing to take consults Fri & Sat every week? | Weekend Consults | Radio | 1 option |
| 6 | How long has your medspa been in business? | Years in Business | Radio | no |
| 7 | How confident are you in your sales abilities? | Sales Confidence | Radio | no* |
| 8 | Worked with an agency or run ads before? | Ad / Agency Experience | Radio | no |
| 9 | Where is your medspa located? | What market(s)… (+ City/State) | Text | no |
| 10 | What's the name of your business? | Business Name | Text | no |
| 11 | Name / Email / Phone | standard contact fields | Standard | — |

\* Sales is **info-only** right now. Open question for Byron: should
"I don't like the idea of having to actively sell…" disqualify? (Currently it does not.)

---

## 5. Exact answer options (set the GHL radio values to match)

The funnel matches answers **case- and dash-insensitive**, so `$10K – $30K` and
`$10k - $30K` both work — but keep the wording identical to be safe.
🚫 = this answer routes the lead to the DQ page.

**1. Owns Medspa**
- Yes, we can inject those treatments
- 🚫 No, I'm going to leave this page immediately

**2. Physical Location**
- Yes, I own a medical spa with a physical location (suite or storefront)
- 🚫 I don't operate out of a physical location
- 🚫 I haven't opened yet
- 🚫 I'm not a medical spa or an aesthetic clinic

**3. Fat-Reduction Treatment**
- Yes, we already offer it
- No, BUT we have injectors and are open to offer it, if it makes sense
- 🚫 No, and we can't or do not plan on offering it

**4. Monthly Revenue**
- 🚫 Under $10K
- 🚫 $10K – $30K
- $30K – $100K
- $100K+

**5. Weekend Consults**
- Yes, I am ready to do whatever it takes to grow my business
- 🚫 No, I am not willing to make Fridays and Saturdays available for consultations

**6. Years in Business** (no DQ)
- Under 1 year
- 1 – 3 years
- 3 – 5 years
- 5+ years

**7. Sales Confidence** (no DQ)
- I have prior sales experience or already sell 4-figure packages at my spa. I just need more appointments/opportunities.
- I am charismatic and a natural hustler. Just tell me what to say and I'll sell it till the cows come home
- I wouldn't consider myself a sales person
- I don't like the idea of having to actively sell patients into 4-figure treatment plans

**8. Ad / Agency Experience** (no DQ)
- Yes
- No
- No, I've never tried any forms of paid marketing

---

## 6. Standard contact fields

| Funnel value | Fills GHL |
|---|---|
| Full name | Full Name (also First/Last if split fields exist) |
| Email | Email |
| Phone | Phone |
| "City, ST" from the location picker | **City** + **State** (the funnel splits "Austin, TX" → City=Austin, State=TX) and also writes the full "Austin, TX" into the **What market(s)** field |
| Business name | Business Name |

Consent checkbox(es) on the form are auto-checked.

---

## 7. Disqualify routing

A lead is sent to **newlybooked.com/dq** (no GHL contact created) if they pick any
🚫 answer above. In short, they DQ when they: don't own a $1K+ medspa · have no
physical location / aren't a medspa / haven't opened · won't offer fat-reduction ·
do under $30K/month · or won't take Fri/Sat consults. Everyone else is **qualified**
and goes to the schedule page.

---

## 8. Schedule page → iClosed prefill

After a qualified submit, the schedule page (**/schedule-822049**) opens the iClosed
booking popup with the lead's info pre-filled. The funnel saves name/email/phone in
the browser, and the schedule page passes them to iClosed as:

- `iclosedName` (full name)
- `iclosedEmail`
- `iclosedPhone` (digits only, with US country code `1` in front)

Nothing to do here — just don't change the schedule page's URL slug
(`schedule-822049`), or update it in the form's On-Submit redirect if you do.

---

## 9. Notification cleanup

The "New iClosed Lead" Slack/Discord alert is a GHL **workflow**. Please remove the
old **"Sales Abilities"** and **"Experience With Ads/Agencies"** lines if they're
still empty placeholders — those are now real quiz questions (Sales Confidence + Ad/
Agency Experience) and will populate on their own once mapped to the radio fields
above.

---

## 10. Field keys (confirmed so far)

The funnel matches fields by their **label/options**, so exact keys aren't required —
but for reference:

- Monthly Revenue → `contact.what_does_your_spa_currently_bring_in_per_month`
- What market(s) located in → `contact.what_markets_is_your_clinic_located_in`

The rest (Owns Medspa, Physical Location, Fat-Reduction, Weekend Consults, Years in
Business, Sales Confidence, Ad/Agency Experience, Business Name) match automatically
by their radio option values / field label. If any one doesn't fill in a test, send
Byron that field's key and label and it'll get wired explicitly.

---

### Quick test checklist
1. Open **newlybooked.com/apply**, run the quiz with qualifying answers.
2. Confirm a contact is created with **every** field populated (esp. Revenue, Sales,
   Ad Experience, Years in Business, Market).
3. Confirm it **redirects to the schedule page** and the iClosed popup is pre-filled.
4. Run it again with a DQ answer (e.g. "Under $10K") → should land on **/dq**, no contact.
