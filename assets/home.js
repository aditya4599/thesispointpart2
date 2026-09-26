/* Homepage: the gap ruler and the Longer reads list. */
(function () {
  var T = window.TPR;
  var START = 14; // where "price when published" sits on the ruler, in %

  function position(up) {
    return Math.min(94, START + up * 1.15);
  }

  function buildTicks(ruler) {
    for (var i = 0; i <= 20; i++) {
      var major = i % 5 === 0;
      var t = document.createElement('div');
      t.className = 'tick';
      t.style.left = i * 5 + '%';
      t.style.top = major ? '69px' : '74px';
      t.style.height = major ? '22px' : '12px';
      ruler.insertBefore(t, ruler.querySelector('.bar'));
    }
  }

  function renderGap(recos) {
    var section = document.getElementById('gap');
    if (!recos.length) { section.hidden = true; return; }
    var picker = document.getElementById('picker');
    var ruler = document.getElementById('ruler');
    buildTicks(ruler);

    picker.innerHTML = recos.map(function (r, i) {
      return '<button type="button" data-i="' + i + '" aria-pressed="false"><span>' + T.esc(r.ticker) +
        '</span><span>' + T.esc(T.recoLabel(r)) + '</span></button>';
    }).join('');

    function select(i) {
      var r = recos[i];
      var up = T.upside(r) || 0;
      var met = r.reco_status === 'target_met';
      var tLeft = position(up);
      picker.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i));
      });

      var big = document.getElementById('upside');
      big.textContent = T.pct(up);
      big.classList.toggle('met', met);
      document.getElementById('upside-note').textContent = met
        ? 'upside to our target when published. Target Met.'
        : 'upside to our target on the day we published';

      ruler.classList.toggle('met', met);
      ruler.querySelector('.bar').style.left = START + '%';
      ruler.querySelector('.bar').style.width = tLeft - START + '%';
      ruler.querySelector('.dot').style.left = START + '%';
      ruler.querySelector('.ring').style.left = tLeft + '%';

      var narrow = ruler.clientWidth < 560;
      var price = ruler.querySelector('.label.price');
      var target = ruler.querySelector('.label.target');
      price.style.left = START + '%';
      price.style.transform = narrow ? 'translateX(-20%)' : 'translateX(-50%)';
      price.querySelector('strong').textContent = T.money(r.price_at_publication, r.currency);
      target.style.left = tLeft + '%';
      target.style.transform = narrow && tLeft > 70 ? 'translateX(-80%)' : 'translateX(-50%)';
      target.querySelector('strong').textContent = T.money(r.target_price, r.currency);

      document.getElementById('gap-meta').textContent =
        (r.company || r.title) + ', ' + r.exchange + ': ' + r.ticker + '. ' + r.sector + ', published ' + T.date(r.published_at) + '.';
      document.getElementById('gap-thesis').textContent = r.summary || '';
      var link = document.getElementById('gap-link');
      link.href = r.link;
      link.textContent = 'Read the ' + (r.company || r.title) + ' report';
    }

    var current = 0;
    picker.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      current = Number(b.dataset.i);
      select(current);
    });
    window.addEventListener('resize', function () { select(current); });
    select(0);
  }

  function renderReads(articles) {
    var grid = document.getElementById('reads');
    if (!articles.length) { document.getElementById('reads-section').hidden = true; return; }
    grid.innerHTML = articles.slice(0, 2).map(function (a) {
      return '<article>' +
        '<span class="meta">' + T.esc(a.sector) + (a.read_minutes ? ', ' + a.read_minutes + ' min read' : '') + '</span>' +
        '<h3><a href="' + T.esc(a.link) + '">' + T.esc(a.title) + '</a></h3>' +
        '<p>' + T.esc(a.summary) + '</p>' +
        '</article>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    T.loadReports().then(function (all) {
      var byDate = function (a, b) { return a.published_at === b.published_at ? 0 : a.published_at < b.published_at ? 1 : -1; };
      renderGap(all.filter(function (r) { return r.type === 'stock_report'; }).sort(byDate).slice(0, 3));
      renderReads(all.filter(function (r) { return r.type === 'article'; }).sort(byDate));
    });
  });
})();
