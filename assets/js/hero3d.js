// The signal constellation, v2: the orb defends the client's business.
// Seven named systems orbit the orb on tethers. Amber threats drift in from
// the edges; the orb intercepts each with a razor-thin red beam (brand red,
// the same red as the x) and the threat bursts into sparks. Clicking the hero
// spawns a threat at the cursor. Bounded to the hero, pauses offscreen/hidden,
// static under prefers-reduced-motion (sphere + systems, no combat).
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var canvas = document.createElement('canvas');
  canvas.id = 'hero3d';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.matchMedia('(max-width: 900px)').matches;
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var N = small ? 120 : 240;
  var LINK = 0.62;
  var pts = [];
  var W, H, R, CX, CY;
  var rotY = 0, rotX = -0.35;
  var targX = 0, targY = 0, curX = 0, curY = 0;
  var running = false, visible = false;
  var sweepT = -1, lastSweep = 0;
  var pulses = [];

  // Defense scene state
  var SATS = ['Operations', 'Legal', 'Finance', 'Marketing', 'Pipeline', 'Fraud watch', 'Supply chain'].map(function (name, i, arr) {
    return { name: name, ang: (i / arr.length) * 6.2832 + 0.4, speed: 0.00042 + (i % 3) * 0.00013, rr: 1.5 + (i % 3) * 0.17 };
  });
  var threats = [], beams = [], sparks = [];
  var nextThreat = 1800;

  for (var i = 0; i < N; i++) {
    var k = i + 0.5;
    var phi = Math.acos(1 - 2 * k / N);
    var theta = Math.PI * (1 + Math.sqrt(5)) * k;
    pts.push({ x: Math.cos(theta) * Math.sin(phi), y: Math.cos(phi), z: Math.sin(theta) * Math.sin(phi), j: Math.random() * Math.PI * 2 });
  }

  function size() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R = Math.min(W, H) * (small ? 0.34 : 0.36);
    CX = W * 0.56; CY = H * 0.47;
  }

  function color(py, a) {
    var t = Math.max(0, Math.min(1, (py - (CY - R)) / (2 * R)));
    var c = t < 0.5
      ? [255 + (255 - 255) * t * 2, 138 + (59 - 138) * t * 2, 128 + (48 - 128) * t * 2]
      : [255 + (196 - 255) * (t - 0.5) * 2, 59 + (34 - 59) * (t - 0.5) * 2, 48 + (24 - 48) * (t - 0.5) * 2];
    return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';
  }

  function satPos(s) {
    return { x: CX + Math.cos(s.ang) * R * s.rr * 1.12, y: CY + Math.sin(s.ang) * R * s.rr * 0.52 };
  }

  function spawnThreat(x, y) {
    if (threats.length >= 3) return;
    var s = SATS[(Math.random() * SATS.length) | 0];
    threats.push({ x: x, y: y, sat: s, sp: 0.9 + Math.random() * 0.5, born: performance.now() });
  }
  function spawnEdgeThreat() {
    var side = Math.random();
    var x, y;
    if (side < 0.35) { x = W + 20; y = Math.random() * H; }
    else if (side < 0.6) { x = Math.random() * W; y = -20; }
    else if (side < 0.85) { x = Math.random() * W; y = H + 20; }
    else { x = -20; y = Math.random() * H * 0.4; }
    spawnThreat(x, y);
  }

  var lastT = 0;
  function frame(now) {
    if (!running) return;
    var dt = lastT ? Math.min(50, now - lastT) : 16;
    lastT = now;
    ctx.clearRect(0, 0, W, H);
    rotY += 0.0016;
    curX += (targX - curX) * 0.04; curY += (targY - curY) * 0.04;
    var ry = rotY + curX * 0.25, rx = rotX + curY * 0.18;
    var sy = Math.sin(ry), cy2 = Math.cos(ry), sx = Math.sin(rx), cx2 = Math.cos(rx);

    if (!reduced) {
      if (sweepT < 0 && now - lastSweep > 6500) { sweepT = 0; lastSweep = now; }
      if (sweepT >= 0) { sweepT += 1 / (1.6 * 60); if (sweepT > 1) sweepT = -1; }
    }

    var P = [];
    for (var i = 0; i < N; i++) {
      var p = pts[i];
      var x1 = p.x * cy2 - p.z * sy, z1 = p.x * sy + p.z * cy2;
      var y1 = p.y * cx2 - z1 * sx, z2 = p.y * sx + z1 * cx2;
      var s = R / (1.9 - z2 * 0.9);
      P.push({ px: CX + x1 * s, py: CY + y1 * s, z: z2 });
    }

    ctx.lineWidth = 1;
    for (var a = 0; a < N; a++) {
      var A = P[a]; if (A.z < -0.2) continue;
      for (var b = a + 1; b < N; b++) {
        var B = P[b]; if (B.z < -0.2) continue;
        var dx = pts[a].x - pts[b].x, dyy = pts[a].y - pts[b].y, dz = pts[a].z - pts[b].z;
        if (dx * dx + dyy * dyy + dz * dz < LINK * LINK) {
          ctx.strokeStyle = color((A.py + B.py) / 2, 0.05 + 0.1 * ((A.z + B.z) / 2 + 1) / 2);
          ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.lineTo(B.px, B.py); ctx.stroke();
        }
      }
    }

    var sweepY = sweepT >= 0 ? 1 - 2 * sweepT : null;

    if (!reduced) {
      if (pulses.length < 7 && Math.random() < 0.06) {
        for (var tries = 0; tries < 8; tries++) {
          var pa = (Math.random() * N) | 0, pb = (Math.random() * N) | 0;
          if (pa === pb) continue;
          var ddx = pts[pa].x - pts[pb].x, ddy = pts[pa].y - pts[pb].y, ddz = pts[pa].z - pts[pb].z;
          if (ddx * ddx + ddy * ddy + ddz * ddz < LINK * LINK) { pulses.push({ a: pa, b: pb, t: 0, v: 0.014 + Math.random() * 0.02 }); break; }
        }
      }
      for (var pi = pulses.length - 1; pi >= 0; pi--) {
        var pu = pulses[pi]; pu.t += pu.v;
        if (pu.t >= 1) { pulses.splice(pi, 1); continue; }
        var A2 = P[pu.a], B2 = P[pu.b];
        if (A2.z < -0.2 || B2.z < -0.2) continue;
        var ix = A2.px + (B2.px - A2.px) * pu.t, iy = A2.py + (B2.py - A2.py) * pu.t;
        var fade = Math.sin(pu.t * Math.PI);
        ctx.fillStyle = 'rgba(240,253,255,' + (0.85 * fade) + ')';
        ctx.beginPath(); ctx.arc(ix, iy, 1.8, 0, 6.2832); ctx.fill();
      }
    }

    for (var m = 0; m < N; m++) {
      var q = P[m];
      var depth = (q.z + 1) / 2;
      var al = 0.25 + 0.55 * depth, r2 = 0.9 + 1.5 * depth;
      if (!reduced) al = Math.max(0.12, al + Math.sin(now / 900 + pts[m].j) * 0.12);
      if (sweepY !== null && Math.abs(pts[m].y - sweepY) < 0.12) { al = Math.min(1, al + 0.55); r2 += 1.2; }
      ctx.fillStyle = color(q.py, al);
      ctx.beginPath(); ctx.arc(q.px, q.py, r2, 0, 6.2832); ctx.fill();
    }

    // ---- The systems the orb protects
    ctx.font = '600 11.5px Archivo, sans-serif';
    for (var si = 0; si < SATS.length; si++) {
      var sat = SATS[si];
      if (!reduced) sat.ang += sat.speed * dt;
      var sp = satPos(sat);
      // tether
      var dxo = sp.x - CX, dyo = sp.y - CY, dlen = Math.sqrt(dxo * dxo + dyo * dyo);
      var ex = CX + dxo / dlen * R * 0.98, ey = CY + dyo / dlen * R * 0.55;
      ctx.strokeStyle = 'rgba(148,163,184,.12)';
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(sp.x, sp.y); ctx.stroke();
      // node + label
      ctx.fillStyle = 'rgba(248,250,252,.85)';
      ctx.beginPath(); ctx.arc(sp.x, sp.y, 2.6, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,.4)';
      ctx.beginPath(); ctx.arc(sp.x, sp.y, 5.5, 0, 6.2832); ctx.stroke();
      if (!small) {
        ctx.fillStyle = 'rgba(148,163,184,.72)';
        ctx.fillText(sat.name, sp.x + 9, sp.y + 3.5);
      }
    }

    // ---- Threats, beams, sparks
    if (!reduced) {
      nextThreat -= dt;
      if (nextThreat <= 0 && threats.length < 2) { spawnEdgeThreat(); nextThreat = 2600 + Math.random() * 1800; }

      for (var ti = threats.length - 1; ti >= 0; ti--) {
        var t = threats[ti];
        var tp = satPos(t.sat);
        var tdx = tp.x - t.x, tdy = tp.y - t.y, td = Math.sqrt(tdx * tdx + tdy * tdy);
        var step = t.sp * dt * 0.06;
        t.x += tdx / td * step; t.y += tdy / td * step;
        // draw threat: pulsing amber diamond
        var blink = 0.65 + 0.35 * Math.sin(now / 140);
        ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(0.7854);
        ctx.fillStyle = 'rgba(251,191,36,' + blink + ')';
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
        // intercept near the target system, or before the threat can cross the orb
        var odx = t.x - CX, ody = t.y - CY;
        if (td < R * 0.55 || (odx * odx + ody * ody) < R * R * 1.1) {
          var bdx = t.x - CX, bdy = t.y - CY, bl = Math.sqrt(bdx * bdx + bdy * bdy);
          beams.push({ x1: CX + bdx / bl * R * 0.9, y1: CY + bdy / bl * R * 0.52, x2: t.x, y2: t.y, life: 220 });
          for (var sk = 0; sk < 9; sk++) {
            var ang = Math.random() * 6.2832, v = 0.4 + Math.random() * 1.4;
            sparks.push({ x: t.x, y: t.y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, life: 380 + Math.random() * 220 });
          }
          threats.splice(ti, 1);
        }
      }

      for (var bi = beams.length - 1; bi >= 0; bi--) {
        var bm = beams[bi]; bm.life -= dt;
        if (bm.life <= 0) { beams.splice(bi, 1); continue; }
        var ba = Math.min(1, bm.life / 160);
        ctx.strokeStyle = 'rgba(255,59,48,' + (0.22 * ba) + ')'; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(bm.x1, bm.y1); ctx.lineTo(bm.x2, bm.y2); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,59,48,' + (0.95 * ba) + ')'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(bm.x1, bm.y1); ctx.lineTo(bm.x2, bm.y2); ctx.stroke();
        ctx.fillStyle = 'rgba(255,120,110,' + (0.9 * ba) + ')';
        ctx.beginPath(); ctx.arc(bm.x1, bm.y1, 2.6, 0, 6.2832); ctx.fill();
        ctx.lineWidth = 1;
      }

      for (var ski = sparks.length - 1; ski >= 0; ski--) {
        var spk = sparks[ski]; spk.life -= dt;
        if (spk.life <= 0) { sparks.splice(ski, 1); continue; }
        spk.x += spk.vx * dt * 0.06; spk.y += spk.vy * dt * 0.06;
        var sa = Math.min(1, spk.life / 300);
        ctx.fillStyle = 'rgba(255,99,90,' + (0.85 * sa) + ')';
        ctx.beginPath(); ctx.arc(spk.x, spk.y, 1.3, 0, 6.2832); ctx.fill();
      }
    }

    if (!reduced) requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; lastT = 0; requestAnimationFrame(frame); } }
  function stop() { running = false; }

  size();
  window.addEventListener('resize', function () { size(); if (reduced) { running = true; frame(performance.now()); running = false; } });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (reduced) return;
      visible && !document.hidden ? start() : stop();
    }, { threshold: 0.05 }).observe(hero);
  } else { visible = true; if (!reduced) start(); }

  document.addEventListener('visibilitychange', function () {
    if (reduced) return;
    document.hidden || !visible ? stop() : start();
  });

  if (!small) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      targX = (e.clientX - r.left) / r.width - 0.5;
      targY = (e.clientY - r.top) / r.height - 0.5;
    });
    // Click anywhere open in the hero: spawn a threat at the cursor, watch it die
    hero.addEventListener('click', function (e) {
      if (reduced || e.target.closest('a,button,input,select,textarea')) return;
      var r = canvas.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < -40 || x > W + 40 || y < -40 || y > H + 40) return;
      spawnThreat(x, y);
    });
  }

  if (reduced) { running = true; frame(performance.now()); running = false; }

  // QA hooks
  window.__bcxHeroFrame = function (t) { var was = running; running = true; frame(t || performance.now()); running = was; };
  window.__bcxSpawnThreat = spawnThreat;
})();
