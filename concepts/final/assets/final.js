// final.js — bostoncyberx "Final" concept engine.
// One file, five instruments:
//   1. ambient  — the hero-b mark loop, promoted to a fixed whole-page layer:
//                 star dust drifts across the viewport, gathers into the giant
//                 red x, holds, releases, and keeps drifting. Every page.
//   2. matrix   — Halo's dot-matrix headline renderer ([data-matrix]).
//   3. forge    — Void's interactive F O R G E letters.
//   4. xfield   — Void's pointer-parallax constellation that disperses on
//                 scroll ([data-xfield] inside a positioned hero).
//   5. beadx    — Ledger's FIG. bead X, re-lit for the ink world ([data-beadx]).
// Plus: reveal-on-view, count-up, agenda auto-advance, mobile menu.
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var RED = [255, 59, 48], BLUE = [59, 130, 246], CYAN = [34, 211, 238],
      GREEN = [52, 211, 153];
  var PILLARS = [BLUE, CYAN, GREEN];

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function mix(A, B, t) {
    return [lerp(A[0], B[0], t) | 0, lerp(A[1], B[1], t) | 0, lerp(A[2], B[2], t) | 0];
  }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a.toFixed(3) + ")"; }
  function rnd(i, salt) {
    var x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // Sample a glyph's ink into normalized points (Void/hero-b technique).
  function glyphPoints(ch, weight, maxPts) {
    var S = 300, off = document.createElement("canvas");
    off.width = S; off.height = S;
    var o = off.getContext("2d");
    o.fillStyle = "#fff";
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.font = weight + " " + Math.round(S * 0.92) + "px Archivo, system-ui, sans-serif";
    o.fillText(ch, S / 2, S / 2 + S * 0.02);
    var data;
    try { data = o.getImageData(0, 0, S, S).data; } catch (e) { return []; }
    var hits = [], minX = S, maxX = 0, minY = S, maxY = 0;
    for (var y = 0; y < S; y += 2) {
      for (var x = 0; x < S; x += 2) {
        if (data[(y * S + x) * 4 + 3] > 130) {
          hits.push([x, y]);
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    var bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY);
    var span = Math.max(bw, bh);
    var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    for (var h = 0; h < hits.length; h++) {
      hits[h] = [(hits[h][0] - cx) / span, (hits[h][1] - cy) / span];
    }
    if (hits.length > maxPts) {
      var keep = [], stride = hits.length / maxPts;
      for (var i = 0; i < maxPts; i++) keep.push(hits[Math.floor(i * stride)]);
      hits = keep;
    }
    return hits;
  }

  /* =====================================================================
     1 · AMBIENT — whole-page mark loop + drifting star dust
     ===================================================================== */
  function Ambient() {
    var host = document.createElement("div");
    host.id = "bcx-ambient";
    host.setAttribute("aria-hidden", "true");
    var canvas = document.createElement("canvas");
    host.appendChild(canvas);
    document.body.prepend(host);

    var ctx = canvas.getContext("2d");
    var DPR = Math.min(1.5, window.devicePixelRatio || 1);
    var W = 0, H = 0, t = 0, born = 0, raf = 0, running = false;
    var ps = [], glyph = null;

    function density() { return clamp(Math.round(W * H / 1700), 260, 980); }

    function build() {
      if (!glyph) glyph = glyphPoints("x", 800, 1500);
      ps = [];
      var n = density();
      // The mark covers the page: as tall as the viewport allows.
      var scale = Math.min(W * 0.9, H * 0.96);
      for (var i = 0; i < n; i++) {
        var g = glyph[i % glyph.length];
        ps.push({
          hx: W / 2 + g[0] * scale + (rnd(i, 31) - 0.5) * 3,
          hy: H / 2 + g[1] * scale + (rnd(i, 32) - 0.5) * 3,
          fx: rnd(i, 33) * W,           // free (dust) position, keeps drifting
          fy: rnd(i, 34) * H,
          vx: (rnd(i, 35) - 0.5) * 0.22,
          vy: (rnd(i, 36) - 0.5) * 0.18,
          r: 0.8 + rnd(i, 37) * 1.1,
          col: PILLARS[i % 3],
          stag: rnd(i, 38) * 0.3,       // per-mote stagger inside the gather
          tw: 0.5 + rnd(i, 39) * 1.2,
          ph: rnd(i, 40) * 6.2832
        });
      }
    }

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      glyph = null;
      build();
      draw(reduced ? 1 : lastP);
    }

    var lastP = reduced ? 1 : 0;
    // p: 0 = free dust, 1 = the x fully formed.
    function draw(p) {
      lastP = p;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var q = ps[i];
        if (!reduced) {
          q.fx += q.vx; q.fy += q.vy;
          if (q.fx < -6) q.fx = W + 6; else if (q.fx > W + 6) q.fx = -6;
          if (q.fy < -6) q.fy = H + 6; else if (q.fy > H + 6) q.fy = -6;
        }
        var e = smooth(p * 1.3 - q.stag);
        var px = lerp(q.fx, q.hx, e);
        var py = lerp(q.fy, q.hy, e);
        if (!reduced) {
          px += Math.sin(t * 0.6 + q.ph) * (1 - e) * 6;
          py += Math.cos(t * 0.5 + q.ph) * (1 - e) * 6;
        }
        // Pillar-coloured dust resolves into the one red identity (hero-b).
        var c = mix(q.col, RED, smooth(e * 1.4 - 0.25));
        var a = (0.16 + 0.4 * e) * (0.68 + 0.32 * Math.sin(t * q.tw + q.ph));
        ctx.fillStyle = rgba(c, a);
        ctx.beginPath();
        ctx.arc(px, py, q.r * (0.8 + 0.5 * e), 0, 6.2832);
        ctx.fill();
      }
    }

    function frame(ts) {
      if (!born) born = ts;
      t += 0.016;
      var age = (ts - born) / 1000;
      // gather 2.6 · hold 5.2 · release 1.8 · drift 3.4  (13s cycle)
      var cyc = age % 13;
      var p = cyc < 2.6 ? smooth(cyc / 2.6)
            : cyc < 7.8 ? 1
            : cyc < 9.6 ? 1 - smooth((cyc - 7.8) / 1.8)
            : 0;
      draw(p);
      if (running) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", function () {
      clearTimeout(resize._t);
      resize._t = setTimeout(resize, 160);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { glyph = null; build(); });
    }
    if (document.fonts && document.fonts.addEventListener) {
      document.fonts.addEventListener("loadingdone", function () {
        glyph = null; build(); if (reduced) draw(1);
      });
    }

    if (!reduced) {
      running = true;
      raf = requestAnimationFrame(frame);
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { running = false; cancelAnimationFrame(raf); }
        else if (!running) { running = true; raf = requestAnimationFrame(frame); }
      });
    } else {
      draw(1);
    }

    window.__bcxAmbientFrame = function (p, dt) { if (dt) t += dt; draw(p); return ps.length; };
  }

  /* =====================================================================
     2 · MATRIX — dot-matrix headlines (Halo)
     ===================================================================== */
  function Matrix(el) {
    this.el = el;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    el.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.lines = (el.getAttribute("data-matrix") || "").split("|");
    this.color = el.getAttribute("data-matrix-color") || "#F2F4F8";
    this.played = false;
    this.dots = [];
  }
  Matrix.prototype.build = function () {
    var cssW = this.el.clientWidth;
    if (cssW < 10) return;
    var small = cssW < 700;
    var cell = small ? 4 : 6;
    this.dotSize = small ? 2 : 3;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var off = document.createElement("canvas");
    var octx = off.getContext("2d");
    octx.font = "900 100px Archivo, sans-serif";
    var maxW = 0;
    for (var i = 0; i < this.lines.length; i++) {
      maxW = Math.max(maxW, octx.measureText(this.lines[i]).width);
    }
    var fs = Math.floor(100 * (cssW * 0.97) / Math.max(1, maxW));
    fs = Math.min(fs, this.lines.length > 1 ? 210 : 180);
    var lh = Math.round(fs * 0.98);
    var cssH = lh * this.lines.length + Math.round(fs * 0.12);
    off.width = cssW; off.height = cssH;
    octx = off.getContext("2d");
    octx.fillStyle = "#fff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.font = "900 " + fs + "px Archivo, sans-serif";
    for (i = 0; i < this.lines.length; i++) {
      octx.fillText(this.lines[i], cssW / 2, lh * i + lh / 2 + fs * 0.06);
    }
    var img;
    try { img = octx.getImageData(0, 0, cssW, cssH).data; } catch (e) { return; }
    var dots = [], spread = cssW * 0.45;
    for (var y = Math.floor(cell / 2); y < cssH; y += cell) {
      for (var x = Math.floor(cell / 2); x < cssW; x += cell) {
        if (img[(y * cssW + x) * 4 + 3] > 140) {
          dots.push({
            tx: x, ty: y,
            sx: x + (Math.random() - 0.5) * spread,
            sy: y + (Math.random() - 0.5) * spread,
            d: Math.random() * 0.35
          });
        }
      }
    }
    this.dots = dots;
    this.cssW = cssW; this.cssH = cssH;
    this.canvas.width = cssW * dpr;
    this.canvas.height = cssH * dpr;
    this.canvas.style.width = cssW + "px";
    this.canvas.style.height = cssH + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  Matrix.prototype.render = function (p) {
    var ctx = this.ctx, s = this.dotSize, h = s / 2;
    ctx.clearRect(0, 0, this.cssW, this.cssH);
    ctx.fillStyle = this.color;
    for (var i = 0; i < this.dots.length; i++) {
      var d = this.dots[i];
      var lt = clamp((p - d.d) / 0.65, 0, 1);
      if (lt <= 0) continue;
      var e = easeOutCubic(lt);
      ctx.globalAlpha = Math.min(1, e * 1.4);
      ctx.fillRect(d.sx + (d.tx - d.sx) * e - h, d.sy + (d.ty - d.sy) * e - h, s, s);
    }
    ctx.globalAlpha = 1;
  };
  Matrix.prototype.play = function () {
    if (this.played) return;
    this.played = true;
    this.lastP = 0;
    if (reduced || !this.dots.length) { this.lastP = 1; this.render(1); return; }
    var self = this, start = null, DUR = 920;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / DUR);
      self.lastP = p;
      self.render(p);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    // rAF can be suspended (hidden panes, aggressive battery savers): make
    // sure the headline never stays half-assembled.
    setTimeout(function () {
      if (self.lastP < 1) { self.lastP = 1; self.render(1); }
    }, DUR + 400);
  };

  function initMatrices() {
    var els = document.querySelectorAll("[data-matrix]");
    if (!els.length) return;
    var ms = [];
    els.forEach(function (el) { ms.push(new Matrix(el)); });
    function buildAll() {
      ms.forEach(function (m) { m.build(); if (m.played) m.render(1); });
    }
    var ready = (document.fonts && document.fonts.load)
      ? Promise.all([document.fonts.load("900 100px Archivo"), document.fonts.ready]).catch(function () {})
      : Promise.resolve();
    ready.then(function () {
      buildAll();
      // fonts.ready can resolve before the face is truly usable for canvas
      // metrics (hidden panes, throttled loads): poll check() until it is.
      if (document.fonts && document.fonts.check && !document.fonts.check("900 100px Archivo")) {
        var tries = 0;
        var iv = setInterval(function () {
          tries++;
          if (document.fonts.check("900 100px Archivo") || tries > 60) {
            clearInterval(iv);
            buildAll();
          }
        }, 250);
      }
      if (document.fonts && document.fonts.addEventListener) {
        document.fonts.addEventListener("loadingdone", buildAll);
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            ms.forEach(function (m) { if (m.el === en.target) m.play(); });
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.4 });
      ms.forEach(function (m) { io.observe(m.el); });
      // Belt and suspenders: an element already in the viewport plays now,
      // without waiting for an observer callback that a hidden or throttled
      // pane may never deliver.
      function playVisible() {
        ms.forEach(function (m) {
          if (m.played) return;
          var r = m.el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) m.play();
        });
      }
      playVisible();
      setTimeout(playVisible, 600);
      window.addEventListener("scroll", playVisible, { passive: true });
      window.__bcxMatrixFrame = function (p) {
        ms.forEach(function (m) { m.render(typeof p === "number" ? p : 1); });
        return ms.length;
      };
      window.addEventListener("resize", function () {
        clearTimeout(initMatrices._t);
        initMatrices._t = setTimeout(buildAll, 180);
      });
    });
  }

  /* =====================================================================
     3 · FORGE — interactive letters (Void)
     ===================================================================== */
  function initForge() {
    var line = document.getElementById("forge-line");
    var panel = document.getElementById("forge-panel");
    if (!line || !panel) return;
    var items = line.querySelectorAll(".forge-item");
    var stageEl = panel.querySelector(".forge-stage");
    var qEl = panel.querySelector(".forge-question");
    var timer = null;
    function activate(item) {
      if (item.classList.contains("active")) return;
      items.forEach(function (it) {
        it.classList.toggle("active", it === item);
        it.querySelector("button").setAttribute("aria-expanded", it === item ? "true" : "false");
      });
      panel.classList.add("swap");
      clearTimeout(timer);
      timer = setTimeout(function () {
        stageEl.innerHTML = '<span class="amber">' + item.dataset.stage.charAt(0) + "</span>" + item.dataset.stage;
        qEl.textContent = item.dataset.q;
        panel.classList.remove("swap");
      }, reduced ? 0 : 220);
    }
    items.forEach(function (item) {
      item.querySelector("button").addEventListener("click", function () { activate(item); });
      item.addEventListener("pointerenter", function () { activate(item); });
    });
  }

  /* =====================================================================
     4 · XFIELD — parallax constellation, disperses on scroll (Void)
     ===================================================================== */
  function initXfield() {
    var wrap = document.querySelector("[data-xfield]");
    if (!wrap) return;
    var canvas = wrap.querySelector("canvas") || wrap.appendChild(document.createElement("canvas"));
    var ctx = canvas.getContext("2d");
    var DPR = Math.min(1.5, window.devicePixelRatio || 1);
    var W = 0, H = 0, t = 0, raf = 0, running = false;
    var ps = [], glyph = null, disperse = 0;
    var pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function build() {
      if (!glyph) glyph = glyphPoints("x", 800, 1200);
      ps = [];
      var n = clamp(Math.round(W * H / 2600), 320, 1300);
      var wide = W >= 980;
      var scale = wide ? Math.min(W * 0.42, H * 0.9) : Math.min(W * 0.7, H * 0.7);
      var cx = wide ? W * 0.72 : W / 2, cy = H * 0.52;
      for (var i = 0; i < n; i++) {
        var g = glyph[i % glyph.length];
        var ang = rnd(i, 51) * 6.2832;
        ps.push({
          hx: cx + g[0] * scale + (rnd(i, 52) - 0.5) * 2.4,
          hy: cy + g[1] * scale + (rnd(i, 53) - 0.5) * 2.4,
          r: 0.9 + rnd(i, 54) * 1.1,
          spark: rnd(i, 55) < 1 / 14,
          baseA: 0.4 + rnd(i, 56) * 0.55,
          tw: 0.5 + rnd(i, 57) * 1.3,
          ph: rnd(i, 58) * 6.2832,
          depth: 0.25 + rnd(i, 59) * 0.75,
          ddx: Math.cos(ang), ddy: Math.sin(ang) * 0.8 - 0.3,
          dd: 120 + rnd(i, 60) * 380
        });
      }
    }
    function resize() {
      var b = wrap.getBoundingClientRect();
      W = Math.max(1, Math.round(b.width));
      H = Math.max(1, Math.round(b.height));
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      glyph = null;
      build();
      if (reduced) drawStatic();
    }
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var q = ps[i];
        ctx.fillStyle = rgba(q.spark ? [251, 191, 36] : RED, q.baseA * 0.8);
        ctx.beginPath();
        ctx.arc(q.hx, q.hy, q.r, 0, 6.2832);
        ctx.fill();
      }
    }
    function frame() {
      raf = requestAnimationFrame(frame);
      t += 0.016;
      var d = smooth(disperse);
      ctx.clearRect(0, 0, W, H);
      if (d >= 0.999) return;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      var fade = 1 - d;
      for (var i = 0; i < ps.length; i++) {
        var q = ps[i];
        var px = q.hx + q.ddx * q.dd * d + Math.sin(t * 0.2 + q.ph) * 4 + pointer.x * q.depth;
        var py = q.hy + q.ddy * q.dd * d + Math.cos(t * 0.17 + q.ph) * 4 + pointer.y * q.depth;
        var a = q.baseA * (0.55 + 0.45 * Math.sin(t * q.tw + q.ph)) * fade;
        if (a < 0.02) continue;
        ctx.fillStyle = rgba(q.spark ? [251, 191, 36] : RED, a);
        ctx.beginPath();
        ctx.arc(px, py, q.r, 0, 6.2832);
        ctx.fill();
      }
    }
    resize();
    window.addEventListener("resize", function () {
      clearTimeout(initXfield._t);
      initXfield._t = setTimeout(resize, 160);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { glyph = null; build(); if (reduced) drawStatic(); });
    }
    if (document.fonts && document.fonts.addEventListener) {
      document.fonts.addEventListener("loadingdone", function () {
        glyph = null; build(); if (reduced) drawStatic();
      });
    }
    if (reduced) { drawStatic(); return; }
    window.addEventListener("pointermove", function (e) {
      pointer.tx = (e.clientX - W / 2) * 0.03;
      pointer.ty = (e.clientY - H / 2) * 0.03;
    }, { passive: true });
    window.addEventListener("scroll", function () {
      var rect = wrap.getBoundingClientRect();
      disperse = clamp(-rect.top / (rect.height * 0.7), 0, 1);
    }, { passive: true });
    running = true;
    raf = requestAnimationFrame(frame);
  }

  /* =====================================================================
     5 · BEADX — the FIG. bead X, ink edition (Ledger)
     ===================================================================== */
  function initBeadX() {
    var wrap = document.querySelector("[data-beadx]");
    if (!wrap) return;
    var cv = wrap.querySelector("canvas") || wrap.appendChild(document.createElement("canvas"));
    var ctx = cv.getContext("2d");
    var N = 13, ZOFF = 0.17, SLOPE = 0.94, RB = 0.165, F = 3.4, TILT = -0.13;
    var beads = [];
    for (var s = 0; s < 2; s++) {
      for (var i = 0; i < N; i++) {
        var tt = -1 + 2 * i / (N - 1);
        beads.push({ x: tt, y: (s ? tt : -tt) * SLOPE, z: s ? -ZOFF : ZOFF });
      }
    }
    var W = 0, H = 0, dpr = 1;
    function resize() {
      var r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    }
    function cmix(c1, c2, t) {
      return "rgb(" + Math.round(lerp(c1[0], c2[0], t)) + "," +
        Math.round(lerp(c1[1], c2[1], t)) + "," + Math.round(lerp(c1[2], c2[2], t)) + ")";
    }
    // Ink-world light: far beads fog toward the panel, highlights stay cool paper.
    var FOG = [17, 24, 39], HI = [203, 210, 220], MID = [96, 104, 118], DK = [28, 34, 46], EDGE = [10, 13, 22];
    var cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    function draw(theta) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var base = Math.min(W, H) * 0.4, cx = W / 2, cy = H / 2;
      var ct = Math.cos(theta), st = Math.sin(theta);
      var P = [];
      for (var k = 0; k < beads.length; k++) {
        var b = beads[k];
        var x = b.x * ct + b.z * st;
        var z = -b.x * st + b.z * ct;
        var y = b.y * cosT - z * sinT;
        z = b.y * sinT + z * cosT;
        var sc = F / (F - z);
        P.push({ px: cx + x * base * sc, py: cy + y * base * sc, pr: RB * base * sc, z: z });
      }
      P.sort(function (a, b) { return a.z - b.z; });
      for (var j = 0; j < P.length; j++) {
        var p = P[j];
        var near = clamp((p.z + 1) / 2, 0, 1);
        var fog = (1 - near) * 0.5;
        var g = ctx.createRadialGradient(
          p.px - p.pr * 0.38, p.py - p.pr * 0.42, p.pr * 0.08, p.px, p.py, p.pr);
        g.addColorStop(0, cmix(HI, FOG, fog));
        g.addColorStop(0.38, cmix(MID, FOG, fog));
        g.addColorStop(0.78, cmix(DK, FOG, fog));
        g.addColorStop(1, cmix(EDGE, FOG, fog));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.pr, 0, 6.28319);
        ctx.fill();
      }
    }
    resize();
    window.addEventListener("resize", function () { resize(); if (reduced) draw(0.5); });
    if (reduced) { draw(0.5); return; }
    var t0 = null, visible = false, running = false;
    function loop(ts) {
      if (!visible) { running = false; return; }
      if (t0 === null) t0 = ts;
      draw(0.5 + (ts - t0) * 0.00028);
      requestAnimationFrame(loop);
    }
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; requestAnimationFrame(loop); }
    }, { threshold: 0 }).observe(wrap);
  }

  /* =====================================================================
     Reveal · count-up · agenda · menu
     ===================================================================== */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (reduced) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14 });
    els.forEach(function (el) { io.observe(el); });
  }

  function initCounts() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var comma = el.getAttribute("data-comma") === "1";
      if (reduced) { el.textContent = comma ? target.toLocaleString("en-US") : String(target); return; }
      var start = null, DUR = 1100;
      function fr(ts) {
        if (start === null) start = ts;
        var p = easeOutCubic(Math.min(1, (ts - start) / DUR));
        var v = Math.round(target * p);
        el.textContent = comma ? v.toLocaleString("en-US") : String(v);
        if (p < 1) requestAnimationFrame(fr);
      }
      requestAnimationFrame(fr);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  function initAgenda() {
    var rows = document.querySelectorAll(".agenda-row");
    if (!rows.length) return;
    var idx = 0, timer = null, paused = false;
    function set(i) {
      idx = i;
      rows.forEach(function (r, j) {
        r.setAttribute("aria-expanded", j === i ? "true" : "false");
        var prog = r.querySelector(".prog");
        if (prog) { prog.style.animation = "none"; void prog.offsetWidth; prog.style.animation = ""; }
      });
    }
    rows.forEach(function (r, j) {
      r.addEventListener("click", function () { set(j); restart(); });
      r.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(j); restart(); }
      });
      r.addEventListener("pointerenter", function () { paused = true; });
      r.addEventListener("pointerleave", function () { paused = false; });
    });
    function tick() { if (!paused) set((idx + 1) % rows.length); }
    function restart() { clearInterval(timer); if (!reduced) timer = setInterval(tick, 6500); }
    set(0);
    restart();
  }

  function initMenu() {
    var btn = document.querySelector(".menu-btn");
    var nav = document.querySelector(".nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function boot() {
    if (!document.body.hasAttribute("data-no-ambient")) Ambient();
    initMatrices();
    initForge();
    initXfield();
    initBeadX();
    initReveal();
    initCounts();
    initAgenda();
    initMenu();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
