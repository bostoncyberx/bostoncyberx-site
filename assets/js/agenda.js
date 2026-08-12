// The CEO agenda: one need live at a time. The red signal draws along the
// item's rule while it holds the floor, then the next need takes over.
// Click or keyboard selects; hover or focus holds; reduced motion = manual only.
(function () {
  var wrap = document.getElementById('agenda');
  if (!wrap) return;
  var items = [].slice.call(wrap.querySelectorAll('.agenda-item'));
  if (!items.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 6500, idx = 0, timer = null, held = false;
  var stageImgs = [].slice.call(wrap.querySelectorAll('.as-img'));

  function stage(i) {
    stageImgs.forEach(function (im, j) {
      if (j === i) {
        im.classList.remove('out');
        // restart from the base pose before sliding in
        void im.offsetWidth;
        im.classList.add('on');
      } else if (im.classList.contains('on')) {
        im.classList.remove('on');
        im.classList.add('out');
        setTimeout(function () { im.classList.remove('out'); }, 950);
      } else {
        im.classList.remove('on', 'out');
      }
    });
  }

  function set(i) {
    idx = i;
    stage(i);
    items.forEach(function (it, j) {
      var on = j === i;
      it.classList.toggle('on', on);
      it.querySelector('.ai-head').setAttribute('aria-expanded', on ? 'true' : 'false');
      var p = it.querySelector('.ai-progress');
      p.style.transition = 'none';
      p.style.transform = 'scaleX(0)';
    });
    if (reduced) return;
    var p = items[i].querySelector('.ai-progress');
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      p.style.transition = 'transform ' + DUR + 'ms linear';
      p.style.transform = 'scaleX(1)';
    }); });
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (held || document.hidden) { schedule(); return; }
      set((idx + 1) % items.length);
    }, DUR + 200);
  }

  items.forEach(function (it, j) {
    it.querySelector('.ai-head').addEventListener('click', function () { set(j); });
  });
  wrap.addEventListener('mouseenter', function () { held = true; });
  wrap.addEventListener('mouseleave', function () { held = false; });
  wrap.addEventListener('focusin', function () { held = true; });
  wrap.addEventListener('focusout', function () { held = false; });

  set(0);
})();
