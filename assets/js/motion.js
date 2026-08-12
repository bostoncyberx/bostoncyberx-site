// Supporting motion: counting stat numbers, territory entrances, magnetic CTAs.
// Everything is feedback or reveal; the hero constellation and signal line
// remain the authored moments. No-JS and reduced-motion keep content visible.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('motion-on');

  // Territory entrances
  var terrs = [].slice.call(document.querySelectorAll('.territory'));
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    terrs.forEach(function (t) { io.observe(t); });
  } else {
    terrs.forEach(function (t) { t.classList.add('in'); });
  }

  // Counting numbers in the gap diagram
  function count(el, to, suffix, ms) {
    if (reduced) { el.textContent = to + suffix; return; }
    var t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var gv = document.getElementById('gapviz');
  if (gv) {
    var fired = false;
    var arm = function () {
      if (fired) return; fired = true;
      var nums = gv.querySelectorAll('.label b');
      if (nums[0]) count(nums[0], 82, '%', 1100);
      if (nums[1]) count(nums[1], 26, '%', 1100);
      var delta = gv.querySelector('.delta b');
      if (delta) count(delta, 56, ' pts', 1300);
    };
    if ('IntersectionObserver' in window && !reduced) {
      new IntersectionObserver(function (es, o) {
        es.forEach(function (e) { if (e.isIntersecting) { arm(); o.disconnect(); } });
      }, { threshold: 0.35 }).observe(gv);
    } else { arm(); }
  }

  // Scroll reveals: section heads and card-like blocks, staggered by sibling order
  var rvEls = [].slice.call(document.querySelectorAll('.section-head, .step, .paper, .card, .stat, .ops .meter'));
  rvEls.forEach(function (el, i) {
    el.classList.add('rv');
    var sibs = el.parentElement ? [].slice.call(el.parentElement.children).filter(function (s) { return s.classList.contains('rv'); }) : [];
    var idx = sibs.indexOf(el);
    if (idx > 0) el.style.transitionDelay = Math.min(idx * 0.12, 0.36) + 's';
  });
  if ('IntersectionObserver' in window && !reduced) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });
    rvEls.forEach(function (el) { rio.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Magnetic primary CTAs (desktop pointers only)
  if (!reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    [].slice.call(document.querySelectorAll('.btn-primary,.btn-green')).forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = 'translate(' + (dx * 6) + 'px,' + (dy * 5 - 1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }
})();
