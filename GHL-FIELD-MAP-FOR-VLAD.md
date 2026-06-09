# Newly Booked: Funnel to GHL Field Map (for Vlad)

Full map of how the apply-page quiz connects into GHL. Updated 2026-06-09 (v2).
**Read section 4 first** — duplicate fields are the one thing that needs cleanup.

> The funnel matches each **radio** field by its **option text** (the answer wording),
> NOT by the field name or key. So a field's name/key can be anything, but its radio
> options must match section 6 (case/dashes don't matter, wording does). Text fields
> are matched by their label.

---

## 1. How it connects
- The funnel at **newlybooked.com/apply** fills a **hidden GHL form** on the same page, then clicks its submit. GHL creates the contact and runs the form's redirect.
- Hidden form = a GHL **Form element** with custom CSS class `nb-hidden-form`, placed on the page and hidden off-screen.
- **Qualified** → form submits → GHL redirect → schedule page. **Disqualified** → funnel skips the form (no contact) → newlybooked.com/dq.
- No webhook, no Zapier.

## 2. Form setup
| Setting | Value |
|---|---|
| Form | "B2B SURVEY LANDING PAGE BV" (`eZdat7aJqX9PIs7I11tJ`) |
| Location | `xHVYjflu3TyKtrxryOzy` |
| Custom CSS class | **`nb-hidden-form`** |
| Placement | **Inline Form element**, NOT the iframe/embed code |
| Hide method | Off-screen CSS (`left:-9999px`). **NOT `display:none`** |
| On-Submit | Redirect → `https://newlybooked.com/schedule-822049` |

## 3. Field types (the key rule)
Funnel fills **Radio** and **Single-line text** reliably. It **cannot** fill **Dropdowns** (they come through blank). Every multiple-choice question must be a **Radio**.

## 4. IMPORTANT — duplicate fields to clean up
There are several duplicate fields for the same question. When more than one is on the form, the funnel fills only the first and the rest stay blank. **Keep ONE field per question on the form, remove the others.**

| Question | # fields | Action |
|---|---|---|
| Monthly Revenue | **5** | keep 1, remove 4 |
| Sales Confidence | **2** | keep 1, remove 1 |
| Fat-Reduction Treatment | 2 | keep 1 |
| Weekend Consults | 2 | keep 1 |
| Owns Medspa / Physical Location / Years in Business / Business Name | 1 each | OK |

**Duplicate revenue fields:**
`contact.what_does_your_spa_currently_bring_in_per_month` · `contact.roughly_whats_your_monthly_revenue_right_now` · `contact.what_is_your_currennthly_revenue` (typo) · `contact.what_is_your_current_monthly_revenue` · `contact.monthly_revenue`

**Duplicate sales fields:**
`contact.sales_experience_is_the_common_thread_among_our_most_successful_spas_how_confident_are_you_in_your_sales_abilities` · `contact.on_a_scale_of_1_10_how_confident_are_you_in_your_sales_skills_the_spas_that_succeed_with_us_almost_always_rate_themselves_high`

Whichever you keep, make sure its options match section 6. (Optional: rename the long question-text fields to something short so the contact record reads clean.)

## 5. Exact answer options (set GHL radio values to match)
🚫 = routes the lead to the disqualify page.

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
- $10K – $30K  (qualifies, NOT a DQ)
- $30K – $100K
- $100K+

**5. Weekend Consults**
- Yes, I am ready to do whatever it takes to grow my business
- 🚫 No, I am not willing to make Fridays and Saturdays available for consultations

**6. Years in Business**
- 🚫 Under 1 year  (now disqualifies)
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

## 6. Standard fields
Full Name, Email, Phone, and "City, ST" from the location picker (splits into **City** + **State**, also fills the market(s) field). Business name → `contact.company_business_name`. Consent checkboxes auto-checked.

## 7. Disqualify routing (updated)
DQ → newlybooked.com/dq when: no $1K+ medspa · no physical location / not a medspa / not open · won't offer fat-reduction · **under $10K/mo** (note: $10K–$30K now **qualifies**) · **under 1 year in business** · won't take Fri/Sat consults.

## 8. iClosed prefill
Schedule page `/schedule-822049` opens iClosed pre-filled via `iclosedName`, `iclosedEmail`, `iclosedPhone` (digits + US country code `1`). Keep the `schedule-822049` slug in sync with the form's redirect.

## 9. Notification cleanup
Remove the old "Sales Abilities" and "Experience With Ads/Agencies" placeholder lines from the "New iClosed Lead" workflow — they're now real questions (Sales Confidence + Ad/Agency Experience).

## 10. Field keys reference
| Question | Key(s) in GHL |
|---|---|
| Owns Medspa | `contact.owns_medspa` |
| Physical Location | `contact.physical_location` |
| Fat-Reduction Treatment | `contact.do_you_own_a_medical_spa_or_aesthetic_clinic_that_currently_offers_fat_reduction_treatments_like_kybella_or_pcdc_liquid_lipo` / `contact.top_treatment` |
| Monthly Revenue | (5 dups — see §4) keep one |
| Weekend Consults | `contact.program_has_generated_over_5_3_mil_..._success_story_with_our_program` / `contact.weekend_consults` |
| Years in Business | `contact.years_in_business` |
| Sales Confidence | (2 dups — see §4) keep one |
| Business Name | `contact.company_business_name` (also seen: `contact.company_name`) |
| Located in / Market | `contact.what_markets_is_your_clinic_located_in` |

## Test checklist
1. Clean up duplicate fields (§4) → one field per question on the form.
2. Run newlybooked.com/apply with qualifying answers → confirm every field populates.
3. Confirm redirect to schedule page + iClosed pre-filled.
4. Run with a DQ answer ("Under $10K" or "Under 1 year") → lands on /dq, no contact.

*Open question for Byron: should sales answer "I don't like the idea of having to actively sell…" disqualify? Currently it does not.*
