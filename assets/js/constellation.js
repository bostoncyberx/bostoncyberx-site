// The constellation: ~2,600 particles forming the red x on the hero's right,
// swarming in on load, breathing with the pointer, dispersing as you scroll.
// Adapted from the void concept; brand red with pillar-color sparks.
// Reduced motion: the formed x as a single still frame that fades on scroll.
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = document.getElementById("constellation");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var disperse = 0;
  var clearedOut = false;
  var SPARKS = ["#FBBF24", "#3B82F6", "#22D3EE", "#34D399"];

  function sampleX() {
    var S = 340;
    var off = document.createElement("canvas");
    off.width = S; off.height = S;
    var octx = off.getContext("2d");
    if (!octx) return [];
    octx.clearRect(0, 0, S, S);
    octx.fillStyle = "#fff";
    octx.font = "900 " + Math.round(S * 0.98) + "px Archivo, 'Arial Black', Arial, sans-serif";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText("X", S / 2, S / 2 + S * 0.04);
    var data;
    try { data = octx.getImageData(0, 0, S, S).data; }
    catch (e) { return []; }
    var pts = [], step = 2;
    for (var y = 0; y < S; y += step) {
      for (var x = 0; x < S; x += step) {
        if (data[(y * S + x) * 4 + 3] > 128) {
          pts.push([x / S - 0.5, y / S - 0.5]);
        }
      }
    }
    return pts;
  }

  function particleCount() {
    if (W < 560) return 1200;
    if (W < 900) return 1800;
    return 2600;
  }

  function buildParticles(keepPositions) {
    var pts = sampleX();
    if (!pts.length) return;
    var count = particleCount();
    var wide = W >= 1100;
    var scale = wide ? Math.min(W * 0.46, H * 0.88) : Math.min(W * 0.78, H * 0.82);
    var cx = wide ? W * 0.74 : W / 2, cy = H * 0.52;
    var old = keepPositions ? particles : null;
    var next = [];
    for (var i = 0; i < count; i++) {
      var pt = pts[(Math.random() * pts.length) | 0];
      var jitter = 2.4;
      var hx = cx + pt[0] * scale + (Math.random() - 0.5) * jitter;
      var hy = cy + pt[1] * scale + (Math.random() - 0.5) * jitter;
      var spark = Math.random() < 1 / 12;
      var ang = Math.random() * Math.PI * 2;
      var prev = old && old[i];
      next.push({
        hx: hx, hy: hy,
        x: prev ? prev.x : hx + (Math.random() - 0.5) * W * 0.8,
        y: prev ? prev.y : hy + (Math.random() - 0.5) * H * 0.8,
        vx: prev ? prev.vx : 0,
        vy: prev ? prev.vy : 0,
        size: 1 + Math.random() * 1.2,
        col: spark ? SPARKS[(Math.random() * SPARKS.length) | 0] : "#FF3B30",
        baseA: spark ? 0.6 + Math.random() * 0.4 : 0.42 + Math.random() * 0.58,
        tw: 0.4 + Math.random() * 1.4,
        twp: Math.random() * Math.PI * 2,
        f1: 0.14 + Math.random() * 0.22,
        p1: Math.random() * Math.PI * 2,
        f2: 0.05 + Math.random() * 0.1,
        p2: Math.random() * Math.PI * 2,
        amp1: 4 + Math.random() * 6,
        amp2: 2 + Math.random() * 4,
        depth: 0.25 + Math.random() * 0.75,
        ddx: Math.cos(ang),
        ddy: Math.sin(ang) * 0.85 - 0.25,
        dd: 120 + Math.random() * 420
      });
    }
    particles = next;
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildParticles(particles.length > 0);
    if (reduced) drawStatic();
  }

  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    var fade = 1 - easeInOut(disperse);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.globalAlpha = p.baseA * 0.85 * fade;
      ctx.fillStyle = p.col;
      ctx.fillRect(p.hx, p.hy, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    var t = now * 0.001;
    var d = easeInOut(disperse);
    if (d >= 0.999) {
      if (!clearedOut) { ctx.clearRect(0, 0, W, H); clearedOut = true; }
      return;
    }
    clearedOut = false;
    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;
    ctx.clearRect(0, 0, W, H);
    var fade = 1 - d;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var hx = p.hx + p.ddx * p.dd * d;
      var hy = p.hy + p.ddy * p.dd * d;
      var tx = hx + Math.sin(t * p.f1 + p.p1) * p.amp1 + Math.sin(t * p.f2 + p.p2) * p.amp2 + pointer.x * p.depth;
      var ty = hy + Math.cos(t * p.f1 * 0.9 + p.p2) * p.amp1 * 0.8 + Math.cos(t * p.f2 + p.p1) * p.amp2 + pointer.y * p.depth;
      p.vx = (p.vx + (tx - p.x) * 0.014) * 0.92;
      p.vy = (p.vy + (ty - p.y) * 0.014) * 0.92;
      p.x += p.vx;
      p.y += p.vy;
      var a = p.baseA * (0.55 + 0.45 * Math.sin(t * p.tw + p.twp)) * fade;
      if (a < 0.02) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.col;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  resize();

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  });

  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(function () {
      buildParticles(true);
      if (reduced) drawStatic();
    }).catch(function () {});
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    disperse = Math.min(1, Math.max(0, y / (H * 0.85)));
    if (reduced) drawStatic();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!reduced) {
    window.addEventListener("pointermove", function (e) {
      pointer.tx = (e.clientX - W / 2) * 0.035;
      pointer.ty = (e.clientY - H / 2) * 0.035;
    }, { passive: true });
    requestAnimationFrame(frame);
  }

  window.__bcxConstellationFrame = function (t) {
    var was = reduced;
    frame(t || 1000);
  };
})();
