/* Research library: search, filters, sort, the upside board and the archive. */
(function () {
  var T = window.TPR;
  var MAX_SCALE = 80; // the board's scale runs 0–80% upside
  var TYPES = [
    { v: 'stock_report', label: 'Stock reports', cta: 'Read report' },
    { v: 'article', label: 'Articles', cta: 'Read article' },
    { v: 'pitch_deck', label: 'Pitch decks', cta: 'View deck' },
    { v: 'sector_note', label: 'Sector notes', cta: 'Read note' },
  ];
  var state = { q: '', type: 'all', market: 'all', reco: 'all', sort: 'newest', sel: null };
  var items = [];

  var typeOf = function (v) { return TYPES.filter(function (t) { return t.v === v; })[0] || { label: v, cta: 'Read' }; };
  var isReco = function (r) { return r.type === 'stock_report'; };

  function matches(r, skip) {
    var q = state.q.trim().toLowerCase();
    var text = [r.title, r.company, r.ticker, r.sector, r.summary, r.market].join(' ').toLowerCase();
    return (skip === 'type' || state.type === 'all' || r.type === state.type) &&
      (skip === 'market' || state.market === 'all' || r.market === state.market) &&
      (skip === 'reco' || state.reco === 'all' || (isReco(r) && T.recoLabel(r) === state.reco)) &&
      (!q || text.indexOf(q) !== -1);
  }

  // Filter options come from what is actually published, so empty categories never show.
  function renderFilters() {
    var groups = [
      { key: 'type', label: 'Type', options: TYPES.map(function (t) { return { v: t.v, label: t.label }; }), count: function (o) { return items.filter(function (r) { return r.type === o.v; }).length; } },
      { key: 'market', label: 'Market', options: unique(function (r) { return r.market; }), count: function (o) { return items.filter(function (r) { return r.market === o.v; }).length; } },
      { key: 'reco', label: 'Reco', options: unique(function (r) { return isReco(r) ? T.recoLabel(r) : null; }), count: function (o) { return items.filter(function (r) { return isReco(r) && T.recoLabel(r) === o.v; }).length; } },
    ];
    var html = groups.map(function (g) {
      var opts = g.options.map(function (o) { return { v: o.v, label: o.label, n: g.count(o) }; }).filter(function (o) { return o.n > 0; });
      if (opts.length < 2) return '';
      var chips = [{ v: 'all', label: 'All', n: '' }].concat(opts).map(function (o) {
        return '<button type="button" class="pill" data-key="' + g.key + '" data-v="' + T.esc(o.v) + '" aria-pressed="' + (state[g.key] === o.v) + '">' +
          '<span>' + T.esc(o.label) + '</span>' + (o.n !== '' ? '<span class="count">' + o.n + '</span>' : '') + '</button>';
      }).join('');
      return '<div class="filter-group" role="group" aria-label="' + g.label + '"><span>' + g.label + '</span>' + chips + '</div>';
    }).join('');
    document.getElementById('filter-groups').innerHTML = html;
    document.querySelectorAll('#sorts .pill').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === state.sort));
    });
  }

  function unique(pick) {
    var seen = {};
    items.forEach(function (r) { var v = pick(r); if (v) seen[v] = true; });
    return Object.keys(seen).map(function (v) { return { v: v, label: v }; });
  }

  function renderBoard(list) {
    var recos = list.filter(isReco).sort(function (a, b) { return T.upside(b) - T.upside(a); });
    if (!recos.some(function (r) { return r.slug === state.sel; })) state.sel = recos[0] ? recos[0].slug : null;
    var board = document.getElementById('board-rows');

    if (!recos.length) {
      board.innerHTML = '<p class="empty">No Recos match these filters. Clear a filter to see the board.</p>';
    } else {
      board.innerHTML = recos.map(function (r) {
        var up = T.upside(r);
        var w = Math.min(100, (up / MAX_SCALE) * 100);
        var met = r.reco_status === 'target_met';
        return '<button type="button" data-slug="' + T.esc(r.slug) + '" aria-pressed="' + (r.slug === state.sel) + '" class="' + (met ? 'met' : '') + '">' +
          '<span class="who"><strong>' + T.esc(r.ticker) + '</strong><small>' + T.esc(T.recoLabel(r)) + ', ' + T.esc(T.date(r.published_at)) + '</small></span>' +
          '<span class="track" aria-hidden="true"><span class="base"></span><span class="fill" style="width:' + w + '%"></span><span class="start"></span><span class="end" style="left:' + w + '%"></span></span>' +
          '<span class="pct">' + T.pct(up) + '</span></button>';
      }).join('');
    }
    renderPreview(recos.filter(function (r) { return r.slug === state.sel; })[0]);
  }

  function renderPreview(r) {
    var box = document.getElementById('preview');
    if (!r) {
      box.innerHTML = '<p class="sum">Pick a Reco on the board to see its rating, target and thesis here.</p>';
      return;
    }
    var label = T.recoLabel(r);
    var badge = r.reco_status === 'target_met' ? 'met' : r.reco_status === 'closed' ? 'muted' : '';
    box.innerHTML =
      '<div class="top"><span>' + T.esc(r.exchange) + ': ' + T.esc(r.ticker) + '</span><span class="badge ' + badge + '">' + T.esc(label) + '</span></div>' +
      '<h3>' + T.esc(r.company || r.title) + '</h3>' +
      '<dl><div><dt>Price then</dt><dd>' + T.money(r.price_at_publication, r.currency) + '</dd></div>' +
      '<div><dt>Target</dt><dd>' + T.money(r.target_price, r.currency) + '</dd></div>' +
      '<div><dt>Upside</dt><dd>' + T.pct(T.upside(r)) + '</dd></div></dl>' +
      '<p class="sum">' + T.esc(r.summary) + '</p>' +
      '<p class="meta">' + T.esc(r.sector) + '. Published ' + T.esc(T.date(r.published_at)) + ' by ' + T.esc(r.author) + '.</p>' +
      '<a class="btn btn-primary" href="' + T.esc(r.link) + '">Read the full report</a>';
  }

  function renderArchive(list) {
    var sorted = list.slice().sort(function (a, b) {
      if (state.sort === 'upside') return (T.upside(b) == null ? -1 : T.upside(b)) - (T.upside(a) == null ? -1 : T.upside(a));
      return a.published_at === b.published_at ? 0 : a.published_at < b.published_at ? 1 : -1;
    });
    var box = document.getElementById('archive-list');
    if (!sorted.length) {
      box.innerHTML = '<div class="none"><p>Nothing matches that search and those filters.</p><button type="button" class="btn" id="clear">Clear filters</button></div>';
      return;
    }
    box.innerHTML = sorted.map(function (r) {
      var t = typeOf(r.type);
      var right = isReco(r)
        ? '<span class="rating ' + (r.reco_status === 'target_met' ? 'met' : '') + '">' + T.esc(T.recoLabel(r)) + '</span>' +
          '<span class="num">Target ' + T.money(r.target_price, r.currency) + ', ' + T.pct(T.upside(r)) + '</span>'
        : (r.read_minutes ? '<span>' + r.read_minutes + ' min read</span>' : '');
      return '<article>' +
        '<div class="left"><strong>' + T.esc(t.label.replace(/s$/, '')) + '</strong><span>' + T.esc(T.date(r.published_at)) + '</span><span>' + T.esc(r.market) + ', ' + T.esc(r.sector) + '</span></div>' +
        '<div class="mid"><h3><a href="' + T.esc(r.link) + '">' + T.esc(r.title) + '</a></h3><p>' + T.esc(r.summary) + '</p></div>' +
        '<div class="right">' + right + '<a href="' + T.esc(r.link) + '">' + t.cta + '</a></div>' +
        '</article>';
    }).join('');
  }

  function render() {
    var list = items.filter(function (r) { return matches(r); });
    renderFilters();
    renderBoard(list);
    renderArchive(list);
    document.getElementById('count').textContent = 'Showing ' + list.length + ' of ' + items.length;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var search = document.getElementById('search');
    search.addEventListener('input', function () { state.q = search.value; render(); });

    document.addEventListener('click', function (e) {
      var chip = e.target.closest('.pill[data-key]');
      if (chip) { state[chip.dataset.key] = chip.dataset.v; render(); return; }
      var row = e.target.closest('#board-rows button');
      if (row) { state.sel = row.dataset.slug; render(); return; }
      if (e.target.closest('#clear')) {
        state.q = ''; state.type = 'all'; state.market = 'all'; state.reco = 'all';
        search.value = '';
        render();
      }
    });

    T.loadReports().then(function (all) {
      items = all;
      // ?q=RKLB or ?type=article in the address pre-fills the page.
      var params = new URLSearchParams(location.search);
      if (params.get('q')) { state.q = params.get('q'); search.value = state.q; }
      if (params.get('type')) state.type = params.get('type');
      render();
    });
  });
})();
