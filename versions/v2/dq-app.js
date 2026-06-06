/* Newly Booked — disqualified ("not a fit") page, streamed from the repo.
   A thin loader on the GHL page pulls this in, so edits here go live on push —
   no re-paste. Renders as a single fixed, full-viewport overlay with the navy
   background directly on it, so it reliably covers GHL's (white) host page
   regardless of how GHL nests the embed. */
(function () {
  // Fonts
  var f = document.createElement('link');
  f.rel = 'stylesheet';
  f.href = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(f);

  // Styles (everything scoped under #nb-dq-overlay so it can't clash with GHL)
  var style = document.createElement('style');
  style.textContent = [
    '#nb-dq-overlay{position:fixed;inset:0;z-index:2147483600;background:#0A1628;color:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased}',
    '#nb-dq-overlay *{box-sizing:border-box;margin:0;padding:0}',
    '#nb-dq-overlay .dq-wrap{min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:48px 24px}',
    '#nb-dq-overlay .dq-card{width:100%;max-width:640px;text-align:left}',
    '#nb-dq-overlay .dq-brand{display:flex;align-items:center;gap:9px;font-weight:600;font-size:15px;letter-spacing:.02em;color:#fff;margin-bottom:40px}',
    '#nb-dq-overlay .dq-brand .dot{width:9px;height:9px;border-radius:999px;background:#2B54E8;display:inline-block}',
    '#nb-dq-overlay .dq-eyebrow{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#5C79F2;padding-top:14px;border-top:1px solid #1B2D4A;display:inline-block;margin-bottom:18px}',
    '#nb-dq-overlay .dq-h1{font-family:"Source Serif 4",Georgia,serif;font-size:40px;line-height:1.12;letter-spacing:-.02em;margin:0 0 18px;color:#fff}',
    '#nb-dq-overlay .dq-h1 em{font-style:italic;color:#5C79F2}',
    '#nb-dq-overlay .dq-sub{font-size:16px;line-height:1.6;color:#C5D0E0;margin:0 0 28px}',
    '#nb-dq-overlay .dq-list{list-style:none;margin:0 0 32px;padding:0;border-top:1px solid #1B2D4A}',
    '#nb-dq-overlay .dq-list li{font-size:14.5px;color:#C5D0E0;padding:14px 0 14px 26px;position:relative;border-bottom:1px solid #1B2D4A}',
    '#nb-dq-overlay .dq-list li::before{content:"";position:absolute;left:0;top:21px;width:12px;height:2px;border-radius:2px;background:#2B54E8}',
    '#nb-dq-overlay .dq-note{font-size:13.5px;line-height:1.6;color:#8A9AB3;margin:0}',
    '@media (max-width:560px){#nb-dq-overlay .dq-h1{font-size:30px}#nb-dq-overlay .dq-brand{margin-bottom:28px}}'
  ].join('');
  document.head.appendChild(style);

  // Overlay (remove any previous instance first, in case of double-load)
  var old = document.getElementById('nb-dq-overlay');
  if (old) old.remove();
  var overlay = document.createElement('div');
  overlay.id = 'nb-dq-overlay';
  overlay.innerHTML =
    '<main class="dq-wrap"><div class="dq-card">' +
      '<div class="dq-brand"><span class="dot"></span>Newly Booked</div>' +
      '<div class="dq-eyebrow">Application received</div>' +
      '<h1 class="dq-h1" id="dq-h1">Right now, we’re <em>not the right fit.</em></h1>' +
      '<p class="dq-sub" id="dq-sub">Thanks for taking the time to apply. Based on your answers, your spa isn’t a match for the program today, and we’d rather tell you straight than waste a call.</p>' +
      '<ul class="dq-list">' +
        '<li>Owner-operated medspa or aesthetic clinic with a physical location</li>' +
        '<li>Already doing $30K+ per month in revenue</li>' +
        '<li>Offers fat-reduction treatments (Kybella, PCDC / Liquid Lipo, or similar)</li>' +
        '<li>Able to take Friday &amp; Saturday consultations</li>' +
      '</ul>' +
      '<p class="dq-note">If your situation changes, or you think this was a mistake, just reply to the email we sent and we’ll take another look.</p>' +
    '</div></main>';
  document.body.appendChild(overlay);

  // Personalize with the first name from the URL, if present.
  try {
    var name = (new URLSearchParams(location.search).get('name') || '').trim();
    if (name) {
      var first = name.split(/\s+/)[0].replace(/[<>&]/g, '');
      document.getElementById('dq-sub').textContent =
        'Thanks for taking the time to apply, ' + first +
        '. Based on your answers, your spa isn’t a match for the program today, and we’d rather tell you straight than waste a call.';
    }
  } catch (e) {}
})();
