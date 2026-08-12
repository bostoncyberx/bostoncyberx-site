// hero-lab.js — three candidate hero instruments, all one idea: disorder resolving into structure.
// A: lattice    scattered dust locks into an orthogonal lattice around the message, and re-forms when disturbed.
// B: mark       pillar-coloured motes (the three verbs) converge into the red x, hold, disperse, repeat.
// C: ranks      an amber swarm meets a red structuring boundary and leaves it in ordered pillar ranks.
// House rules: ink ground, red is identity + defense, amber is threat, pillar colours are the three verbs.
// Reduced motion renders the resolved state, once, with no loop.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var RED = [255, 59, 48], BLUE = [59, 130, 246], CYAN = [34, 211, 238],
      GREEN = [52, 211, 153], AMBER = [251, 191, 36], SLATE = [148, 163, 184];
  var PILLARS = [BLUE, CYAN, GREEN];

  var FIELDS = [];

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function mix(A, B, t) {
    return [lerp(A[0], B[0], t) | 0, lerp(A[1], B[1], t) | 0, lerp(A[2], B[2], t) | 0];
  }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')'; }

  // Deterministic pseudo-random so a resize doesn't reshuffle the whole field.
  function rnd(i, salt) {
    var x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  // Sample the real Archivo glyph into points, so the mark is the typeface, not an approximation.
  function glyphPoints(ch, weight, maxPts) {
    var S = 300, off = document.createElement('canvas');
    off.width = S; off.height = S;
    var o = off.getContext('2d');
    o.fillStyle = '#fff';
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.font = weight + ' ' + Math.round(S * 0.92) + 'px Archivo, system-ui, sans-serif';
    o.fillText(ch, S / 2, S / 2 + S * 0.02);
    var data = o.getImageData(0, 0, S, S).data;
    var hits = [];
    var minX = S, maxX = 0, minY = S, maxY = 0;
    for (var y = 0; y < S; y += 2) {
      for (var x = 0; x < S; x += 2) {
        if (data[(y * S + x) * 4 + 3] > 130) {
          hits.push([x, y]);
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    // Normalise to the INK bounds, not the em box: a lowercase x has no ascender or
    // descender, so the em box would leave it small and sitting low in the canvas.
    var bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY);
    var span = Math.max(bw, bh);
    var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    for (var h = 0; h < hits.length; h++) {
      hits[h] = [(hits[h][0] - cx) / span, (hits[h][1] - cy) / span];
    }
    // Even thinning down to the target count keeps the stroke weight honest.
    if (hits.length > maxPts) {
      var keep = [], stride = hits.length / maxPts;
      for (var i = 0; i < maxPts; i++) keep.push(hits[Math.floor(i * stride)]);
      hits = keep;
    }
    return hits;
  }

  function Field(canvas, mode) {
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(1.5, window.devicePixelRatio || 1);
    var W = 0, H = 0, t = 0, running = false, raf = 0;
    var ps = [], glyph = null, grid = [];
    var mouse = { x: -9999, y: -9999, on: false };
    var born = 0, lastP = reduced ? 1 : 0;

    function density() {
      return clamp(Math.round(W * H / 1900), 220, 900);
    }

    function build() {
      ps = [];
      var i, n;

      if (mode === 'lattice') {
        var step = clamp(Math.sqrt(W * H) / 26, 24, 42);
        var cols = Math.floor(W / step), rows = Math.floor(H / step);
        var ox = (W - (cols - 1) * step) / 2, oy = (H - (rows - 1) * step) / 2;
        var k = 0;
        grid = [];
        for (var r = 0; r < rows; r++) {
          grid[r] = [];
          for (var c = 0; c < cols; c++, k++) {
            var hx = ox + c * step, hy = oy + r * step;
            // Calm clearing behind the copy: the lattice thins where the words live.
            var dx = (hx / W - 0.5) / 0.5, dy = (hy / H - 0.5) / 0.5;
            var d = Math.sqrt(dx * dx + dy * dy);
            var vis = smooth((d - 0.24) / 0.44);
            if (vis < 0.02) { grid[r][c] = null; continue; }
            var q = {
              hx: hx, hy: hy,
              x: rnd(k, 1) * W, y: rnd(k, 2) * H,
              px: 0, py: 0, ox: 0, oy: 0,
              r: 0.9 + rnd(k, 3) * 0.8,
              node: (r % 3 === 0 && c % 4 === 0),
              vis: vis,
              tw: 0.4 + rnd(k, 4) * 1.3,
              ph: rnd(k, 5) * 6.2832
            };
            grid[r][c] = q;
            ps.push(q);
          }
        }
      }

      else if (mode === 'mark') {
        if (!glyph) glyph = glyphPoints('x', 800, 1500);
        var scale = Math.min(W, H) * 0.82;
        for (i = 0; i < glyph.length; i++) {
          ps.push({
            hx: W / 2 + glyph[i][0] * scale,
            hy: H / 2 + glyph[i][1] * scale,
            x: 0, y: 0,
            sx: rnd(i, 6), sy: rnd(i, 7),
            r: 0.8 + rnd(i, 8) * 0.9,
            col: PILLARS[i % 3],
            tw: 0.5 + rnd(i, 9) * 1.2,
            ph: rnd(i, 10) * 6.2832
          });
        }
      }

      else { // ranks
        // Derive the count from the grid, not the other way round, so the ordered side
        // fills the field completely instead of leaving it looking empty.
        var rankStep = clamp(Math.sqrt(W * H) / 40, 16, 26);
        var rcols = Math.max(6, Math.floor(W / rankStep));
        var rrows = Math.max(4, Math.floor(H / rankStep));
        n = Math.min(2600, rcols * rrows);
        var rox = (W - (rcols - 1) * rankStep) / 2;
        var roy = (H - (rrows - 1) * rankStep) / 2;
        for (i = 0; i < n; i++) {
          var rc = i % rcols, rr = Math.floor(i / rcols);
          ps.push({
            hx: rox + rc * rankStep,
            hy: roy + rr * rankStep,
            x: rnd(i, 11) * W, y: rnd(i, 12) * H,
            vx: (rnd(i, 13) - 0.5) * 0.5,
            vy: (rnd(i, 14) - 0.5) * 0.5,
            r: 0.7 + rnd(i, 15) * 0.9,
            col: PILLARS[i % 3],
            tw: 0.4 + rnd(i, 16) * 1.3,
            ph: rnd(i, 17) * 6.2832
          });
        }
      }
    }

    function resize() {
      var box = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(box.width));
      H = Math.max(1, Math.round(box.height));
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      glyph = null;
      build();
      // Repaint at the progress we were already at; a resize must never blank the hero.
      draw(lastP);
    }

    // p is the master convergence value: 0 = scattered, 1 = resolved.
    function draw(p) {
      lastP = p;
      ctx.clearRect(0, 0, W, H);
      var i, q, px, py, a, c;

      if (mode === 'lattice') {
        // Pass 1: settle every point, so the edges can be drawn from final positions.
        for (i = 0; i < ps.length; i++) {
          q = ps[i];
          q.e = smooth(p * 1.25 - rnd(i, 18) * 0.25);
          px = lerp(q.x, q.hx, q.e);
          py = lerp(q.y, q.hy, q.e);
          if (!reduced) {
            // Disturb and re-form: the field yields to the cursor, then rebuilds itself.
            var mdx = px - mouse.x, mdy = py - mouse.y;
            var md = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mouse.on && md < 150) {
              var push = (1 - md / 150) * 42;
              q.ox = lerp(q.ox, (mdx / (md || 1)) * push, 0.16);
              q.oy = lerp(q.oy, (mdy / (md || 1)) * push, 0.16);
            } else {
              q.ox = lerp(q.ox, 0, 0.06);
              q.oy = lerp(q.oy, 0, 0.06);
            }
            px += q.ox; py += q.oy;
            py += Math.sin(t * 0.5 + q.ph) * 1.6 * q.e;
          }
          q.px = px; q.py = py;
        }

        // Pass 2: the lattice edges. Structure is the claim, so the structure has to be visible.
        ctx.lineWidth = 1;
        for (var gr = 0; gr < grid.length; gr++) {
          for (var gc = 0; gc < grid[gr].length; gc++) {
            var A = grid[gr][gc];
            if (!A) continue;
            var nbrs = [grid[gr][gc + 1], grid[gr + 1] ? grid[gr + 1][gc] : null];
            for (var nb = 0; nb < 2; nb++) {
              var B = nbrs[nb];
              if (!B) continue;
              // Edges only earn their opacity once both ends have arrived.
              var ea = Math.min(A.e, B.e);
              var av = Math.min(A.vis, B.vis) * ea * ea * 0.62;
              if (av < 0.012) continue;
              ctx.strokeStyle = rgba(SLATE, av);
              ctx.beginPath();
              ctx.moveTo(A.px, A.py);
              ctx.lineTo(B.px, B.py);
              ctx.stroke();
            }
          }
        }

        // Pass 3: the points, with red only at the structural nodes.
        for (i = 0; i < ps.length; i++) {
          q = ps[i];
          a = (q.node ? 1 : 0.78) * q.vis * q.e * (0.76 + 0.24 * Math.sin(t * q.tw + q.ph));
          c = q.node ? RED : SLATE;
          ctx.fillStyle = rgba(c, a);
          ctx.beginPath();
          ctx.arc(q.px, q.py, q.node ? q.r * 1.7 : q.r, 0, 6.2832);
          ctx.fill();
        }
      }

      else if (mode === 'mark') {
        for (i = 0; i < ps.length; i++) {
          q = ps[i];
          var e2 = smooth(p * 1.3 - (q.sx * 0.3));
          // Scatter origin sits well outside the mark, so arrival reads as gathering.
          var fx = q.sx * W * 1.5 - W * 0.25;
          var fy = q.sy * H * 1.5 - H * 0.25;
          px = lerp(fx, q.hx, e2);
          py = lerp(fy, q.hy, e2);
          if (!reduced) {
            px += Math.sin(t * 0.6 + q.ph) * (1 - e2) * 9;
            py += Math.cos(t * 0.5 + q.ph) * (1 - e2) * 9;
          }
          // Many capabilities arrive in the pillar colours and resolve into one identity.
          c = mix(q.col, RED, smooth(e2 * 1.4 - 0.25));
          a = (0.2 + 0.55 * e2) * (0.7 + 0.3 * Math.sin(t * q.tw + q.ph));
          ctx.fillStyle = rgba(c, a);
          ctx.beginPath();
          ctx.arc(px, py, q.r * (0.8 + 0.5 * e2), 0, 6.2832);
          ctx.fill();
        }
      }

      else { // ranks — a red boundary sweeps, leaving order behind it
        var bx = reduced ? W : (p * (W + 240) - 120);
        for (i = 0; i < ps.length; i++) {
          q = ps[i];
          if (!reduced) {
            q.x += q.vx; q.y += q.vy;
            if (q.x < 0) q.x = W; else if (q.x > W) q.x = 0;
            if (q.y < 0) q.y = H; else if (q.y > H) q.y = 0;
          }
          // Order is claimed by rank position, not by where the mote happens to be.
          var e3 = smooth((bx - q.hx) / 190);
          px = lerp(q.x, q.hx, e3);
          py = lerp(q.y, q.hy, e3);
          c = mix(AMBER, q.col, e3);
          a = (0.16 + 0.42 * e3) * (0.66 + 0.34 * Math.sin(t * q.tw + q.ph));
          ctx.fillStyle = rgba(c, a);
          ctx.beginPath();
          ctx.arc(px, py, q.r * (0.9 + 0.35 * e3), 0, 6.2832);
          ctx.fill();
        }
        if (!reduced && bx > -40 && bx < W + 40) {
          var g = ctx.createLinearGradient(bx - 26, 0, bx + 26, 0);
          g.addColorStop(0, rgba(RED, 0));
          g.addColorStop(0.5, rgba(RED, 0.5));
          g.addColorStop(1, rgba(RED, 0));
          ctx.fillStyle = g;
          ctx.fillRect(bx - 26, 0, 52, H);
        }
      }
    }

    function frame(ts) {
      if (!born) born = ts;
      t += 0.016;
      var age = (ts - born) / 1000;
      var p;
      if (mode === 'lattice') {
        p = smooth(age / 2.4);                       // converge once, then hold
      } else if (mode === 'mark') {
        var cyc = age % 9.5;                          // gather, hold, release
        p = cyc < 2.2 ? smooth(cyc / 2.2)
          : cyc < 6.8 ? 1
          : 1 - smooth((cyc - 6.8) / 1.5);
      } else {
        p = (age % 9) / 7.2;                          // boundary sweeps, then resets
      }
      draw(p);
      if (running) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    FIELDS.push({ mode: mode, canvas: canvas, draw: draw, resize: resize, step: function (dt) { t += dt; } });

    if (mode === 'lattice' && !reduced) {
      canvas.parentNode.addEventListener('pointermove', function (e) {
        var b = canvas.getBoundingClientRect();
        mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; mouse.on = true;
      });
      canvas.parentNode.addEventListener('pointerleave', function () { mouse.on = false; });
    }

    // Only the visible candidate burns frames.
    if (!reduced) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (!running) { running = true; born = 0; raf = requestAnimationFrame(frame); }
        } else if (running) {
          running = false; cancelAnimationFrame(raf);
        }
      }, { threshold: 0.05 });
      io.observe(canvas);
    }
  }

  function boot() {
    var nodes = document.querySelectorAll('canvas[data-hero]');
    for (var i = 0; i < nodes.length; i++) new Field(nodes[i], nodes[i].getAttribute('data-hero'));
    // ?static=1 paints the resolved frame once and skips the loop, for capture and review.
    var s = /[?&]static=([0-9.]+)/.exec(location.search);
    if (s) {
      window.__bcxHeroFrame(Math.min(1, parseFloat(s[1]) || 1), 3);
      // ?debug=1 reports coverage in the title, so a headless capture can be checked.
      if (/[?&]debug=1/.test(location.search)) {
        var rep = [];
        for (var j = 0; j < FIELDS.length; j++) {
          var cv = FIELDS[j].canvas;
          var dd = cv.getContext('2d', { willReadFrequently: true })
                     .getImageData(0, 0, cv.width, cv.height).data;
          var n = 0;
          for (var k = 3; k < dd.length; k += 4) if (dd[k] > 8) n++;
          rep.push(FIELDS[j].mode + '=' + cv.width + 'x' + cv.height + ':' +
                   (100 * n / (cv.width * cv.height)).toFixed(2) + '%');
        }
        document.title = 'LIT ' + rep.join(' ');
      }
      // ?map=1 prints a coarse density map, so shape can be confirmed without a screenshot.
      if (/[?&]map=1/.test(location.search)) {
        var out = [];
        for (var f = 0; f < FIELDS.length; f++) {
          var cn = FIELDS[f].canvas;
          if (cn.width < 40) continue;
          var im = cn.getContext('2d', { willReadFrequently: true })
                     .getImageData(0, 0, cn.width, cn.height).data;
          var COLS = 56, ROWS = 22, ramp = ' .:-=+*#%@';
          out.push('--- ' + FIELDS[f].mode + ' ---');
          for (var ry = 0; ry < ROWS; ry++) {
            var line = '';
            for (var rx = 0; rx < COLS; rx++) {
              var x0 = Math.floor(rx * cn.width / COLS), x1 = Math.floor((rx + 1) * cn.width / COLS);
              var y0 = Math.floor(ry * cn.height / ROWS), y1 = Math.floor((ry + 1) * cn.height / ROWS);
              var sum = 0, cnt = 0;
              for (var yy = y0; yy < y1; yy += 2) {
                for (var xx = x0; xx < x1; xx += 2) {
                  sum += im[(yy * cn.width + xx) * 4 + 3]; cnt++;
                }
              }
              var v = cnt ? sum / cnt / 255 : 0;
              line += ramp[Math.min(9, Math.floor(v * 30))];
            }
            out.push(line);
          }
        }
        var pre = document.createElement('pre');
        pre.id = 'bcx-map';
        pre.textContent = out.join('\n');
        document.body.appendChild(pre);
      }
    }
  }

  // QA hook, same idea as __bcxFieldFrame: drive a frame by hand where rAF is unavailable.
  // __bcxHeroFrame(progress 0..1, secondsToAdvance)
  window.__bcxHeroFrame = function (p, dt) {
    for (var i = 0; i < FIELDS.length; i++) {
      if (dt) FIELDS[i].step(dt);
      FIELDS[i].draw(p);
    }
    return FIELDS.length;
  };

  // Boot on whichever comes first. Waiting only on document.fonts.ready leaves the hero blank
  // whenever the webfont is slow, blocked, or (in headless capture) never settles.
  var booted = false;
  function once() {
    if (booted) return;
    booted = true;
    boot();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (booted) {
        // Archivo arrived after we started: re-sample the glyph so the mark is the real letterform.
        for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i].mode === 'mark') FIELDS[i].resize();
      } else once();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', once);
  else once();
  window.addEventListener('load', once);
  setTimeout(once, 1500);
})();
