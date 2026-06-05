/* Newly Booked — schedule page, streamed from the repo.
   Injects the "pick your time" markup + styles, then prefills the iClosed
   popup from the lead's details (URL params first, then the localStorage the
   funnel wrote). A tiny shell on the GHL page loads this file, so every edit
   here goes live on push — no re-paste of the schedule page ever again. */
(function () {
  var BASE = 'https://artzy22.github.io/newly-booked-funnel/versions/v2/';
  var v = Date.now();

  // --- fonts + styles ---
  function addLink(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
  addLink('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,500..600&display=swap');
  addLink(BASE + 'schedule.css?v=' + v);

  // --- markup ---
  var host = document.getElementById('nb-schedule');
  if (!host) { host = document.createElement('div'); host.id = 'nb-schedule'; document.body.appendChild(host); }
  host.innerHTML = `
    <div class="wrap">
      <div class="top">
        <div class="logo"><span class="mark">N<i></i>B</span>Newly Booked</div>
        <div class="secure"><span class="dot"></span>Your spot is held</div>
      </div>

      <div class="stage">
        <div class="eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.3 4.3L19 7"/></svg>
          You qualify
        </div>
        <h1 id="sch-h1">Pick your time.</h1>
        <p class="sub">A quick <b style="color:var(--navy-900);font-weight:700">15-minute intro call</b> with a patient generation specialist. We’ll look at your local market, your current offerings, and your experience, then estimate how many new patients you should be seeing, and whether Newly Booked is the right fit. No pressure, just a conversation.</p>
        <div class="meta">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>15 minutes</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>Phone call</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>No pressure</span>
        </div>

        <div class="cal">
          <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg></span>
          <h2>Book your intro call</h2>
          <p>Tap below to open your calendar and grab a 15-minute slot, right here. Takes about 30 seconds.</p>
          <button class="book-btn" id="sch-book" type="button"
                  data-iclosed-link="https://app.iclosed.io/e/newlybooked/setter-call"
                  data-embed-type="popup">
            Pick your time
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>

      <div class="foot">Newly Booked · We only get paid when patients pay you · <a href="https://newlybooked.com/apply">Back to start</a></div>
    </div>
  `;

  // --- prefill the iClosed popup link ---
  // Read the lead's details from the URL first, then fall back to the
  // localStorage the funnel wrote (the GHL form redirect carries no params).
  var ICLOSED = 'https://app.iclosed.io/e/newlybooked/setter-call';
  var p = new URLSearchParams(location.search);
  var ls = function (k) { try { return (localStorage.getItem(k) || '').trim(); } catch (e) { return ''; } };
  var name = (p.get('name') || ls('nb_name') || '').trim();
  var email = (p.get('email') || ls('nb_email') || '').trim();
  var phone = (p.get('phone') || ls('nb_phone') || '').trim();

  if (name) {
    var first = name.split(/\s+/)[0].replace(/[<>&]/g, '');
    var h1 = document.getElementById('sch-h1');
    if (h1) h1.textContent = 'Pick your time, ' + first + '.';
    try { sessionStorage.setItem('nb_name', name); } catch (e) {}
  }

  // iClosed reads these exact keys — iclosedName (full name), iclosedEmail,
  // iclosedPhone (digits only). https://docs.iclosed.io/en/articles/9830929
  var pre = new URLSearchParams();
  if (name) pre.set('iclosedName', name);
  if (email) pre.set('iclosedEmail', email);
  // iClosed's phone widget reads the country code from the leading digits, so a
  // bare US 10-digit number gets misread (e.g. "516..." → Peru +51). Prepend
  // the US country code "1": 1 + 10 digits, matching iClosed's docs.
  var digits = phone.replace(/\D/g, '');
  if (digits.length === 10) digits = '1' + digits;
  if (digits) pre.set('iclosedPhone', digits);
  // iClosed's docs want spaces as %20, not the + that URLSearchParams emits.
  // (A literal + inside a value stays %2B, so emails like a+b@x.com survive.)
  var qs = pre.toString().replace(/\+/g, '%20');
  var btn = document.getElementById('sch-book');
  if (btn) btn.setAttribute('data-iclosed-link', ICLOSED + (qs ? ('?' + qs) : ''));

  // --- iClosed popup widget (opens the calendar overlay on this page) ---
  var w = document.createElement('script');
  w.type = 'text/javascript';
  w.src = 'https://app.iclosed.io/assets/widget.js';
  w.async = true;
  document.body.appendChild(w);
})();
