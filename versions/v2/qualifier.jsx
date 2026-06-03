// Qualifier (v2) — single full application form.
// All questions render at once. On submit we validate every field, then
// evaluate the disqualifier rules below: if ANY answer is a DQ, we route to
// the DQ page; otherwise we route to the schedule page. Question set mirrors
// the live GHL opt-in form so a new GHL form can be wired to it 1:1.

// React's input wrapper stores value in framework state; setting input.value
// directly is ignored. Use the native setter then dispatch input/change.
function setNativeInputValue(input, value) {
  const proto = input.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value');
  if (setter && setter.set) setter.set.call(input, value);
  else input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

// Phone helpers — strip non-digits, format (xxx) xxx-xxxx, 10 digits = valid.
function phoneDigits(raw) { return String(raw || '').replace(/\D/g, ''); }
function formatPhone(raw) {
  const d = phoneDigits(raw).slice(0, 10);
  if (d.length === 0) return '';
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
function isValidPhone(raw) { return phoneDigits(raw).length === 10; }
function isValidEmail(raw) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(raw).trim()); }

// ---- Question options (edit labels freely; `v` is the stored value) --------
const TREATMENT_OPTS = [
  { v: '', label: 'Select one…' },
  { v: 'yes', label: 'Yes — I can perform Kybella / PCDC (Liquid Lipo)' },
  { v: 'similar', label: 'Yes — I offer similar fat-reduction treatments' },
  { v: 'no', label: 'No — I don\'t offer fat-reduction treatments' },
];
const REVENUE_OPTS = [
  { v: '', label: 'Select monthly revenue…' },
  { v: '<10', label: 'Under $10K / month' },
  { v: '10-30', label: '$10K – $30K / month' },
  { v: '30-50', label: '$30K – $50K / month' },
  { v: '50-100', label: '$50K – $100K / month' },
  { v: '100-200', label: '$100K – $200K / month' },
  { v: '200+', label: '$200K+ / month' },
];
const LOCATION_OPTS = [
  { v: '', label: 'Select one…' },
  { v: 'yes', label: 'Yes — I own a medspa with a physical location' },
  { v: 'no-location', label: 'I don\'t operate out of a physical location' },
  { v: 'not-open', label: 'I haven\'t opened yet' },
  { v: 'not-medspa', label: 'I\'m not a medspa or an aesthetic clinic' },
];
const FRISAT_OPTS = [
  { v: '', label: 'Select one…' },
  { v: 'yes', label: 'Yes — I\'m willing to take Fri & Sat consults' },
  { v: 'no', label: 'No' },
];
const TENURE_OPTS = [
  { v: '', label: 'Select one…' },
  { v: '<1', label: 'Less than 1 year' },
  { v: '1-3', label: '1 – 3 years' },
  { v: '3-5', label: '3 – 5 years' },
  { v: '5+', label: '5+ years' },
];

// ---- DISQUALIFIER RULES ----------------------------------------------------
// Each returns true when that answer should send the lead to the DQ page.
// EDIT HERE to change who qualifies.
const DQ_RULES = {
  treatment: (v) => v === 'no',
  revenue: (v) => v === '<10' || v === '10-30',         // under $30K/mo fails
  location: (v) => v !== 'yes',                          // must have a location
  frisat: (v) => v === 'no',                             // must do Fri/Sat
};

const labelFor = (opts, val) => (opts.find((o) => o.v === val) || {}).label || val;

function Qualifier({ accent }) {
  const [v, setV] = React.useState({
    name: '', email: '', phone: '', city: '',
    treatment: '', revenue: '', location: '', frisat: '', tenure: '', business: '',
  });
  const [submitted, setSubmitted] = React.useState(false);

  const set = (k) => (e) => setV((prev) => ({ ...prev, [k]: e.target.value }));
  const setPhone = (e) => setV((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));

  const required = ['name', 'email', 'phone', 'city', 'treatment', 'revenue', 'location', 'frisat', 'tenure', 'business'];
  const emailBad = !isValidEmail(v.email);
  const phoneBad = !isValidPhone(v.phone);
  const blank = (k) => !String(v[k]).trim();
  const hasErrors = required.some(blank) || emailBad || phoneBad;

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) {
      const firstBad = document.querySelector('.qualifier-card .invalid');
      if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const disqualified = Object.keys(DQ_RULES).some((k) => DQ_RULES[k](v[k]));

    // Every answer, human-readable, ready to forward as URL params.
    const params = new URLSearchParams({
      name: v.name.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      business: v.business.trim(),
      city: v.city.trim(),
      treatment: labelFor(TREATMENT_OPTS, v.treatment),
      revenue: labelFor(REVENUE_OPTS, v.revenue),
      location: labelFor(LOCATION_OPTS, v.location),
      frisat: labelFor(FRISAT_OPTS, v.frisat),
      tenure: labelFor(TENURE_OPTS, v.tenure),
      status: disqualified ? 'dq' : 'qualified',
    });

    // GHL INTEGRATION (pending the new GHL form): when a hidden GHL form with
    // class .nb-hidden-form is present on the page, fill its standard contact
    // fields so GHL creates/updates the contact, then we control the redirect
    // ourselves so qualified vs. DQ routing is reliable.
    const ghlForm = document.querySelector('.nb-hidden-form');
    if (ghlForm) {
      const parts = v.name.trim().split(/\s+/);
      const firstName = parts.shift() || '';
      const lastName = parts.join(' ');
      const setByName = (n, val) => {
        const inp = ghlForm.querySelector(`input[name="${n}"]`);
        if (inp && val != null) setNativeInputValue(inp, val);
      };
      setByName('first_name', firstName);
      setByName('last_name', lastName);
      setByName('full_name', v.name.trim());
      setByName('name', v.name.trim());
      setByName('email', v.email.trim());
      setByName('phone', v.phone.trim());
      setByName('city', v.city.trim());
      ghlForm.querySelectorAll('input[type="checkbox"]').forEach((cb) => { if (!cb.checked) cb.click(); });
      const submitBtn = ghlForm.querySelector('button[type="submit"]') || ghlForm.querySelector('button');
      if (submitBtn) submitBtn.click();
    }

    const dest = disqualified
      ? window.nbUrl('__NB_DQ_URL', 'dq.html')
      : window.nbUrl('__NB_SCHEDULE_URL', 'schedule.html');
    setTimeout(() => {
      window.location.href = `${dest}${dest.includes('?') ? '&' : '?'}${params.toString()}`;
    }, ghlForm ? 220 : 0);
  };

  // Small labelled field wrapper.
  const Field = ({ label, k, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, fontWeight: 500, color: 'var(--navy-200)', lineHeight: 1.45 }}>
        {label}<span style={{ color: 'var(--gold-400)' }}> *</span>
      </label>
      {children}
    </div>
  );

  const cls = (k, extra) => `qualifier-input${(submitted && (blank(k) || extra)) ? ' invalid' : ''}`;
  const Select = ({ k, opts, extra }) => (
    <select className={cls(k, extra)} value={v[k]} onChange={set(k)}>
      {opts.map((o) => (
        <option key={o.v} value={o.v} disabled={o.v === ''}>{o.label}</option>
      ))}
    </select>
  );

  return (
    <div className="qualifier-card" id="qualify">
      <div className="qualifier-head">
        <div>
          <div className="label">Apply now</div>
          <div className="step" style={{ marginTop: 6 }}>Takes ~60 seconds · See if your area is open</div>
        </div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--gold-400)', letterSpacing: '0.1em' }}>NB · 01</div>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Your full name" k="name">
          <input className={cls('name')} type="text" placeholder="First and last name" value={v.name} onChange={set('name')} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Email address" k="email">
            <input className={cls('email', emailBad)} type="email" placeholder="you@clinic.com" value={v.email} onChange={set('email')} />
          </Field>
          <Field label="Phone number" k="phone">
            <input className={cls('phone', phoneBad)} type="tel" inputMode="numeric" placeholder="(555) 555-5555" value={v.phone} onChange={setPhone} />
          </Field>
        </div>

        <Field label="What city and state is your clinic located in?" k="city">
          <input className={cls('city')} type="text" placeholder="e.g. Houston, Texas" value={v.city} onChange={set('city')} />
        </Field>

        <Field label="Do you own a medspa or aesthetic clinic that can perform treatments like Kybella or PCDC (Liquid Lipo) for fat reduction?" k="treatment">
          <Select k="treatment" opts={TREATMENT_OPTS} />
        </Field>

        <Field label="What is your approximate MONTHLY revenue?" k="revenue">
          <Select k="revenue" opts={REVENUE_OPTS} />
        </Field>

        <Field label="Can you confirm your business is a medspa or aesthetic clinic with a physical location?" k="location">
          <Select k="location" opts={LOCATION_OPTS} />
        </Field>

        <Field label="55% of sales happen Fri & Saturday. Are you willing to take consultations on those days and invest the time to learn our program?" k="frisat">
          <Select k="frisat" opts={FRISAT_OPTS} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="How long has your medspa been in business?" k="tenure">
            <Select k="tenure" opts={TENURE_OPTS} />
          </Field>
          <Field label="Business name" k="business">
            <input className={cls('business')} type="text" placeholder="Your business name" value={v.business} onChange={set('business')} />
          </Field>
        </div>

        {submitted && hasErrors && (
          <div className="qualifier-input-error">Please complete every field with a valid email and 10-digit phone number.</div>
        )}

        <button type="submit" className="btn btn-gold btn-block btn-lg">Submit application →</button>

        <div className="qualifier-consent-note">
          By submitting, you agree to receive text messages from Newly Booked about programs and updates. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.
        </div>
        <div className="qualifier-fineprint">No retainer pitch · No 12-month contract · No setter callback</div>
      </form>

      <div className="qualifier-foot">
        <span></span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--navy-300)', letterSpacing: '0.1em' }}>SECURE</span>
      </div>
    </div>
  );
}

window.Qualifier = Qualifier;
