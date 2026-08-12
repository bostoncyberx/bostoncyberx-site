// The Signal Line: one continuous thread drawn by scroll, lighting a node at
// each station and handing pillar color off along real page geometry.
// Full rail on wide desktop only; below 1200px a static CSS hairline spine
// (main::before) carries the device instead.
(function () {
  var svg = document.querySelector('.signal-rail svg');
  var path = document.getElementById('signal-path');
  var nodesG = document.getElementById('signal-nodes');
  var grad = document.getElementById('sigGrad');
  if (!svg || !path || !nodesG || !grad) return;
  if (window.matchMedia('(max-width: 1199px)').matches) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stations = [].slice.call(document.querySelectorAll('[data-station]'));
  var main = document.querySelector('main');
  var gauge = document.getElementById('gauge');
  var COLORS = { r: '#FF3B30', t: '#3B82F6', d: '#22D3EE', a: '#34D399' };
  var nodes = [];

  function stationY(s, mainTop) {
    return s.getBoundingClientRect().top + window.scrollY - mainTop + 84;
  }

  function build() {
    var mainTop = main.getBoundingClientRect().top + window.scrollY;
    var H = main.offsetHeight;
    var W = main.offsetWidth;
    var X = Math.max(28, Math.round((W - 1160) / 2) - 34); // left margin, outside the wrap
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);

    // Territory geometry drives the color hand-off
    var tEls = { t: document.querySelector('.territory.t'), d: document.querySelector('.territory.d'), a: document.querySelector('.territory.a') };
    function range(el) {
      var r = el.getBoundingClientRect();
      var top = r.top + window.scrollY - mainTop;
      return [top, top + el.offsetHeight];
    }
    var rt = range(tEls.t), rd = range(tEls.d), ra = range(tEls.a);
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.setAttribute('x1', 0); grad.setAttribute('y1', 0);
    grad.setAttribute('x2', 0); grad.setAttribute('y2', H);
    var stops = [
      [0, COLORS.r], [Math.max(0.02, (rt[0] - 120) / H * 0.5), COLORS.r],
      [rt[0] / H, COLORS.t], [rt[1] / H, COLORS.t],
      [(rd[0] + 80) / H, COLORS.d], [rd[1] / H, COLORS.d],
      [(ra[0] + 80) / H, COLORS.a], [ra[1] / H, COLORS.a],
      [Math.min(0.97, (ra[1] + 500) / H), COLORS.r], [1, COLORS.r]
    ];
    grad.innerHTML = stops.map(function (s) {
      return '<stop offset="' + s[0].toFixed(4) + '" stop-color="' + s[1] + '"/>';
    }).join('');

    // Node color = the color the line carries at that y
    function colorAt(y) {
      if (y < rt[0]) return COLORS.r;
      if (y < rd[0]) return COLORS.t;
      if (y < ra[0]) return COLORS.d;
      if (y < ra[1] + 400) return COLORS.a;
      return COLORS.r;
    }

    var pts = [];
    var startY = 140;
    pts.push([X, startY]);
    nodesG.innerHTML = '';
    nodes = [];
    stations.forEach(function (s, i) {
      if (i === 0) return;
      var y = stationY(s, mainTop);
      pts.push([X, y - 26]);
      pts.push([X + 10, y - 16]);
      pts.push([X + 10, y + 16]);
      pts.push([X, y + 26]);
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', X + 10); c.setAttribute('cy', y); c.setAttribute('r', 4.5);
      c.setAttribute('class', 'signal-node');
      c.style.color = s.getAttribute('data-accent') || colorAt(y);
      nodesG.appendChild(c);
      nodes.push({ el: c, y: y });
    });

    // Terminal run: route to the gauge ring and dock beneath it
    var endY = H - 140;
    var gx = X, gy = endY;
    if (gauge) {
      var gr = gauge.getBoundingClientRect();
      gx = gr.left + gr.width / 2 - main.getBoundingClientRect().left;
      gy = gr.top + window.scrollY - mainTop - 26;
      pts.push([X, gy - 60]);
      pts.push([gx, gy - 60]);
      pts.push([gx, gy]);
      var term = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      term.setAttribute('cx', gx); term.setAttribute('cy', gy); term.setAttribute('r', 5);
      term.setAttribute('class', 'signal-node');
      term.style.color = COLORS.r;
      nodesG.appendChild(term);
      nodes.push({ el: term, y: gy });
    } else {
      pts.push([X, endY]);
    }

    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length; i++) d += ' L' + pts[i][0] + ' ' + pts[i][1];
    path.setAttribute('d', d);

    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = reduced ? 0 : len;
    if (reduced) nodes.forEach(function (n) { n.el.classList.add('lit'); });
    return len;
  }

  var totalLen = build();
  var ticking = false;

  function update() {
    ticking = false;
    if (reduced) return;
    var mainTop = main.getBoundingClientRect().top + window.scrollY;
    var H = main.offsetHeight;
    var scrollBottom = window.scrollY + window.innerHeight * 0.72;
    var progress = Math.min(1, Math.max(0, (scrollBottom - mainTop - 140) / (H - 280)));
    path.style.strokeDashoffset = totalLen * (1 - progress);
    var drawnY = 140 + (H - 280) * progress;
    nodes.forEach(function (n) { n.el.classList.toggle('lit', drawnY >= n.y); });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  var rt2;
  window.addEventListener('resize', function () {
    clearTimeout(rt2);
    rt2 = setTimeout(function () { totalLen = build(); update(); }, 150);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { totalLen = build(); update(); });
  }
  update();

  // Gap bars + gauge: fill when first seen
  var seen = function (el, cb) {
    if (!('IntersectionObserver' in window) || reduced) { cb(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { cb(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(el);
  };
  var gv = document.getElementById('gapviz');
  if (gv) seen(gv, function () { gv.classList.add('on'); });
  var gg = document.getElementById('gauge');
  if (gg) seen(gg, function () { gg.classList.add('on'); });
})();
