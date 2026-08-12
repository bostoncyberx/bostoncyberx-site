// The Signal Field: one continuous atmosphere behind every section.
// A fixed canvas renders drifting signal dust and two soft aurora glows whose
// hue follows scroll through the pillar story (red > blue > cyan > green > red).
// The scenery never switches as you scroll; the light changes. Pages without
// territories hold brand red. Reduced motion: static frame, hue still follows.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.createElement('canvas');
  canvas.className = 'field-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext('2d');
  var DPR = Math.min(1.5, window.devicePixelRatio || 1);
  var W, H, t = 0, running = false, boost = 0, lastScroll = window.scrollY;

  var RED = [255, 59, 48], BLUE = [59, 130, 246], CYAN = [34, 211, 238], GREEN = [52, 211, 153];
  var stops = [];
  var dust = [];
  var N = 110;

  function buildStops() {
    stops = [{ y: 0, c: RED }];
    var te = document.querySelector('.territory.t');
    var de = document.querySelector('.territory.d');
    var ae = document.querySelector('.territory.a');
    function mid(el) {
      var r = el.getBoundingClientRect();
      return r.top + window.scrollY + el.offsetHeight / 2;
    }
    if (te && de && ae) {
      stops.push({ y: mid(te), c: BLUE });
      stops.push({ y: mid(de), c: CYAN });
      stops.push({ y: mid(ae), c: GREEN });
      stops.push({ y: mid(ae) + window.innerHeight * 1.3, c: RED });
    }
    stops.push({ y: (document.documentElement.scrollHeight || 99999) + 2, c: stops[stops.length - 1].c });
  }

  function hueAt(y) {
    for (var i = 1; i < stops.length; i++) {
      if (y < stops[i].y) {
        var p = (y - stops[i - 1].y) / Math.max(1, stops[i].y - stops[i - 1].y);
        p = Math.max(0, Math.min(1, p));
        p = p * p * (3 - 2 * p);
        var A = stops[i - 1].c, B = stops[i].c;
        return [A[0] + (B[0] - A[0]) * p | 0, A[1] + (B[1] - A[1]) * p | 0, A[2] + (B[2] - A[2]) * p | 0];
      }
    }
    return stops[stops.length - 1].c;
  }

  function seed() {
    dust = [];
    for (var i = 0; i < N; i++) {
      var z = 0.25 + 0.75 * Math.pow((i % 37) / 36, 1.6);
      dust.push({
        x: (i * 733.13) % W,
        y: (i * 391.77) % H,
        z: z,
        r: 0.5 + 1.3 * z,
        vx: (((i * 17) % 10) / 10 - 0.5) * 0.08,
        vy: -(0.05 + 0.16 * z),
        tw: 0.4 + ((i * 29) % 10) / 10 * 1.4,
        ph: (i * 1.7) % 6.2832
      });
    }
  }

  function size() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }

  function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    var hue = hueAt(window.scrollY + H * 0.55);
    var cs = hue[0] + ',' + hue[1] + ',' + hue[2];

    // aurora glows: one high right, one low left, slowly orbiting
    var g1x = W * (0.74 + 0.05 * Math.sin(t * 0.11)), g1y = H * (0.22 + 0.07 * Math.cos(t * 0.09));
    var g1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, Math.max(W, H) * 0.62);
    g1.addColorStop(0, 'rgba(' + cs + ',0.075)');
    g1.addColorStop(1, 'rgba(' + cs + ',0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    var g2x = W * (0.15 + 0.05 * Math.cos(t * 0.07)), g2y = H * (0.84 + 0.05 * Math.sin(t * 0.13));
    var g2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, Math.max(W, H) * 0.5);
    g2.addColorStop(0, 'rgba(' + cs + ',0.05)');
    g2.addColorStop(1, 'rgba(' + cs + ',0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    // signal dust
    for (var i = 0; i < dust.length; i++) {
      var p = dust[i];
      if (!reduced) {
        p.x += p.vx; p.y += p.vy * (1 + boost * 2.2);
        if (p.y < -20) { p.y = H + 18; p.x = (p.x + 173) % W; }
        if (p.x < -20) p.x = W + 18; else if (p.x > W + 20) p.x = -18;
      }
      var al = (0.05 + 0.11 * p.z) * (0.62 + 0.38 * Math.sin(t * p.tw + p.ph));
      ctx.fillStyle = 'rgba(' + cs + ',' + al.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }

    boost *= 0.93;
    if (running && !reduced) requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; if (!reduced) requestAnimationFrame(frame); } }
  function stop() { running = false; }

  size();
  buildStops();
  if (reduced) {
    frame();
    var rTick = false;
    window.addEventListener('scroll', function () {
      if (rTick) return; rTick = true;
      requestAnimationFrame(function () { rTick = false; frame(); });
    }, { passive: true });
  } else {
    start();
    window.addEventListener('scroll', function () {
      var dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      boost = Math.min(1.6, boost + Math.abs(dy) * 0.004);
      // dust reacts to travel: near particles slide a touch, far ones barely
      for (var i = 0; i < dust.length; i++) {
        var p = dust[i];
        p.y -= dy * 0.05 * p.z;
        if (p.y < -20) p.y += H + 40; else if (p.y > H + 20) p.y -= H + 40;
      }
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
  }
  var rs;
  window.addEventListener('resize', function () {
    clearTimeout(rs);
    rs = setTimeout(function () { size(); buildStops(); if (reduced) frame(); }, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildStops);
  window.addEventListener('load', buildStops);

  window.__bcxFieldFrame = function (n) {
    var was = running; running = true;
    for (var i = 0; i < (n || 1); i++) frame();
    running = was;
  };
})();
