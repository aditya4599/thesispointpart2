/* ThesisPoint Research — shared helpers used by every page. */
(function () {
  var cfg = window.TPR_CONFIG || {};
  var api = (cfg.apiBase || '').replace(/\/$/, '');

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function money(value, currency) {
    if (value == null || value === '') return '';
    var inr = currency === 'INR';
    return (inr ? '₹' : '$') + Number(value).toLocaleString(inr ? 'en-IN' : 'en-US', { maximumFractionDigits: 0 });
  }

  function date(d) {
    if (!d) return '';
    var dt = new Date(d);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dt.getDate() + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
  }

  function pct(n) {
    if (n == null) return '';
    return (n > 0 ? '+' : '') + Number(n).toFixed(1) + '%';
  }

  // "Target Met" replaces the rating once a Reco reaches its target.
  function recoLabel(r) {
    if (r.reco_status === 'target_met') return 'Target Met';
    if (r.reco_status === 'closed') return 'Closed';
    return r.rating || '';
  }

  function upside(r) {
    if (r.upside_pct != null) return Number(r.upside_pct);
    if (r.price_at_publication > 0 && r.target_price) return (r.target_price / r.price_at_publication - 1) * 100;
    return null;
  }

  // Loads research from TPR Back-End when connected, otherwise uses assets/data.js.
  function loadReports() {
    var sample = (window.TPR_SAMPLE || []).slice();
    if (!api) return Promise.resolve(sample);
    return fetch(api + '/api/reports')
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(function (json) {
        return (json.reports || []).map(function (r) {
          r.author = r.authors && r.authors.name ? r.authors.name : 'ThesisPoint Research';
          r.link = r.link || r.pdf_url || '#';
          return r;
        });
      })
      .catch(function () { return sample; });
  }

  // Every <form data-subscribe> on the page.
  function wireSubscribe() {
    document.querySelectorAll('form[data-subscribe]').forEach(function (form) {
      var input = form.querySelector('input[type=email]');
      var status = form.querySelector('.status');
      var button = form.querySelector('button');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        status.className = 'status';
        var email = input.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          status.textContent = 'Enter a valid email address.';
          status.classList.add('err');
          input.focus();
          return;
        }
        if (!api) {
          status.textContent = 'Subscriptions start saving once the site is connected to TPR Back-End.';
          status.classList.add('ok');
          return;
        }
        button.disabled = true;
        fetch(api + '/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, source: form.getAttribute('data-subscribe') || 'website' }),
        })
          .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, body: j }; }); })
          .then(function (r) {
            if (!r.ok) throw new Error(r.body.error || 'Could not subscribe.');
            status.textContent = 'You’re subscribed. The next report will land in your inbox.';
            status.classList.add('ok');
            form.reset();
          })
          .catch(function (err) {
            status.textContent = err.message || 'Could not subscribe. Try again.';
            status.classList.add('err');
          })
          .finally(function () { button.disabled = false; });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', wireSubscribe);

  window.TPR = { esc: esc, money: money, date: date, pct: pct, recoLabel: recoLabel, upside: upside, loadReports: loadReports };
})();
