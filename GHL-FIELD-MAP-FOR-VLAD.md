# Newly Booked: Funnel → GHL Field Map (for Vlad)

How the apply-page funnel connects into GHL. **Synced 2026-06-10** to the verified
handoff (keys checked against the live workflows). Replaces the earlier draft.
The funnel code (`versions/v2/funnel-app.jsx`) was updated the same day to match
these keys — tenure label **"Business Experience"** and revenue key
`current_monthly_revenue`.

> **The one rule:** the funnel fills the hidden GHL form like a human.
> **Radio** fields are matched by their **option text** (the answer wording —
> case/dashes don't matter, wording does). **Text** fields are matched by their
> **label**. The funnel **cannot** fill a **Dropdown / Single-Options** field —
> those come through blank.

---

## 1. How it connects
- The funnel at **newlybooked.com/apply** fills a **hidden GHL form** on the same page, then clicks its submit. GHL creates the contact and runs the form's redirect.
- Hidden form = a GHL **Form element** with custom CSS class **`nb-hidden-form`**, placed on the page and hidden off-screen (`left:-9999px`, **not** `display:none`).
- **Qualified** → form submits → GHL redirect → schedule page. **Disqualified** → funnel skips the form (no contact) → newlybooked.com/dq.
- No webhook, no Zapier.

| Setting | Value |
|---|---|
| Form | "B2B SURVEY LANDING PAGE BV" (`eZdat7aJqX9PIs7I11tJ`) |
| Location | `xHVYjflu3TyKtrxryOzy` |
| Custom CSS class | **`nb-hidden-form`** |
| Placement | Inline **Form element**, NOT the iframe/embed code |
| On-Submit | Redirect → `https://newlybooked.com/schedule-822049` |

---

## 2. The 9 fields — verified keys, type, status

| # | Field | Key | Type it must be | Action in GHL |
|---|---|---|---|---|
| 1 | Business Name | `contact.business_name` | Text | ✅ fills — none |
| 2 | Market / City-State | `contact.what_markets_is_your_clinic_located_in` | Text | field must exist; funnel writes the `"City, ST"` string |
| 3 | Monthly Revenue | `contact.current_monthly_revenue` | Text | ✅ fills — keep as Text |
| 4 | Treatment | `contact.do_you_own_a_medical_spa_or_aesthetic_clinic_that_can_currently_treatments_like_kybella_or_pcdc_liquid_lipo_for_fat_reduction` | **Radio** | **flip Single-Options → Radio** (options already match §5) |
| 5 | Physical Location | `contact.before_we_move_forward_can_you_confirm_that_your_business_is_a_medical_spa_or_aesthetic_clinic` | Radio | ✅ fills — none |
| 6 | Weekend Consults | `contact.this_program_has_generated_over_5mil_for_our_spas_55_of_all_sales_happen_on_fridays__saturdays_are_you_willing_to_take_consultations_on_these_days_every_week_and_invest_the_extra_time_to_learn_how_to_become_a_success_story_with_our_program` | **Radio** | **flip Single-Options → Radio** (options match §5) |
| 7 | Tenure | `contact.how_long_has_your_medspa_been_in_business` — display **"Business Experience"** | **Text** | **convert Radio → Text** (its options can't match the funnel) |
| 8 | Sales | `contact.only_spas_with_sales_experience_are_wildly_successful_with_our_program_how_confident_are_you_in_your_sales_abilities` | **Radio** | **flip Single-Options → Radio** (options match §5) |
| 9 | Ads | `contact.worked_with_agency_run_ads_before` | Radio | ✅ fills — none |

> The funnel now fills **Tenure and Revenue whichever type you choose** — Tenure as
> Text *or* as a Radio whose options you reset to the funnel's buckets; Revenue as
> Text *or* Radio. The recommended setup is the **Type it must be** column above.

The funnel's first question ("Do you own a medspa with treatments priced $1,000+?")
is a **funnel-only gate** — it has no GHL field; a "No" just routes the lead to /dq.

---

## 3. Field types — the only blockers
The funnel fills **Radio** and **single-line Text** reliably; it **cannot** fill **Dropdown / Single-Options**.
- **Treatment, Weekend, Sales** are Single-Options today → **flip the type to Radio** and keep the exact option text in §5 (it already matches the funnel — no option editing needed).
- **Tenure** is a Radio whose options ("Just opened / Less than 6 months / 6-12 months / 1-3 years / More than 3 years") **do not match** the funnel's buckets → **convert it to single-line Text**. The funnel then writes the bucket string ("3 – 5 years") and the workflow just prints it. (Changing the funnel's buckets instead would break its disqualify logic, so don't.)
- Do NOT leave any of these as Dropdown/Single-Options.

## 4. De-dupe — one field per question
When more than one field for the same question is on the form, the funnel fills only the **first** match and the rest stay blank. Keep exactly **one** field per question, bound to the key in §2. (Earlier there were 5 revenue + 2 sales duplicates — remove the extras.)

---

## 5. Exact answer options (set the GHL radio values to match)
🚫 = routes the lead to the disqualify page (the funnel owns the DQ decision).

**4. Treatment**
- Yes, we already offer it
- No, BUT we have injectors and are open to offer it, if it makes sense
- 🚫 No, and we can't or do not plan on offering it

**5. Physical Location**
- Yes, I own a medical spa with a physical location (suite or storefront)
- 🚫 I don't operate out of a physical location
- 🚫 I haven't opened yet
- 🚫 I'm not a medical spa or an aesthetic clinic

**3. Monthly Revenue** (Text — funnel writes one of these strings)
- 🚫 Under $10K
- $10K – $30K  (qualifies, NOT a DQ)
- $30K – $100K
- $100K+

**6. Weekend Consults**
- Yes, I am ready to do whatever it takes to grow my business
- 🚫 No, I am not willing to make Fridays and Saturdays available for consultations

**7. Tenure** (Text — funnel writes one of these strings)
- 🚫 Under 1 year
- 1 – 3 years
- 3 – 5 years
- 5+ years

**8. Sales** (no DQ)
- I have prior sales experience or already sell 4-figure packages at my spa. I just need more appointments/opportunities.
- I am charismatic and a natural hustler. Just tell me what to say and I'll sell it till the cows come home
- I wouldn't consider myself a sales person
- I don't like the idea of having to actively sell patients into 4-figure treatment plans

**9. Ads** (no DQ)
- Yes
- No
- No, I've never tried any forms of paid marketing

---

## 6. Standard fields
Full Name, Email, Phone, and "City, ST" from the location step (splits into **City** + **State**, and also fills the Market field #2). Consent checkboxes auto-checked.

## 7. Disqualify routing
DQ → newlybooked.com/dq when: leaving immediately on Q1 · no physical location / not a medspa / not open · won't offer fat-reduction · **under $10K/mo** ($10K–$30K now **qualifies**) · **under 1 year in business** · won't take Fri/Sat consults. **Sales and Ads never DQ.**

## 8. iClosed prefill
Schedule page `/schedule-822049` opens iClosed pre-filled from `localStorage` (`nb_name`, `nb_email`, `nb_phone`). Keep the `schedule-822049` slug in sync with the form's redirect.

## 9. Notification cleanup
In the "New iClosed Lead" / call-reminder workflow, make sure the **Sales** (#8) and **Ads** (#9) lines map to the real fields above — they used to be placeholders.

---

## Test checklist
1. **Flip** Treatment / Weekend / Sales → Radio; **convert** Tenure → Text; **de-dupe** to one field per question (§3–4).
2. Run **newlybooked.com/apply** with qualifying answers → confirm all 9 fields in §2 populate on the new contact and every workflow renders complete.
3. Confirm redirect → schedule page + iClosed pre-filled.
4. Run with a DQ answer ("Under $10K" or "Under 1 year") → lands on /dq, no contact.
