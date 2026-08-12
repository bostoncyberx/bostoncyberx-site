// bcxBastion dome: a wireframe defense dome with a rotating radar sweep.
// Renders into any canvas.bastion-dome. Cyan world, static under reduced motion.
(function () {
  var canvases = [].slice.call(document.querySelectorAll('canvas.bastion-dome'));
  if (!canvases.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  canvases.forEach(function (canvas) {
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(2, window.devicePixelRatio || 1);
    var N = 130, LINK = 0.55;
    var pts = [];
    var W, H, R, CX, BY;
    var rot = 0, sweep = 0, running = false;

    for (var i = 0; i < N * 2; i++) {
      var k = i + 0.5;
      var phi = Math.acos(1 - 2 * k / (N * 2));
      var theta = Math.PI * (1 + Math.sqrt(5)) * k;
      var y = Math.cos(phi);
      if (y < 0.05) continue; // upper hemisphere only
      pts.push({ x: Math.cos(theta) * Math.sin(phi), y: y, z: Math.sin(theta) * Math.sin(phi) });
    }

    function size() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      R = Math.min(W * 0.42, H * 1.15);
      CX = W / 2; BY = H * 0.92;
    }

    function frame() {
      if (!running && !reduced) return;
      ctx.clearRect(0, 0, W, H);
      rot += 0.004; sweep += 0.02;
      var sy = Math.sin(rot), cy = Math.cos(rot);
      var tilt = 0.42, st = Math.sin(tilt), ct = Math.cos(tilt);

      // base ring
      ctx.strokeStyle = 'rgba(255,59,48,.30)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(CX, BY, R, R * 0.2, 0, 0, 6.2832); ctx.stroke();

      // sweep beam on the base
      var sa = sweep % 6.2832;
      ctx.fillStyle = 'rgba(255,59,48,.10)';
      ctx.beginPath(); ctx.moveTo(CX, BY);
      ctx.ellipse(CX, BY, R, R * 0.2, 0, sa, sa + 0.7);
      ctx.closePath(); ctx.fill();

      var P = [];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        var x1 = p.x * cy - p.z * sy, z1 = p.x * sy + p.z * cy;
        var y2 = p.y * ct - z1 * st, z2 = p.y * st + z1 * ct;
        var s = 1 / (1.7 - z2 * 0.5);
        P.push({ px: CX + x1 * R * s, py: BY - y2 * R * 0.98 * s, z: z2, az: Math.atan2(z1, x1) });
      }

      ctx.lineWidth = 1;
      for (var a = 0; a < P.length; a++) {
        if (P[a].z < -0.3) continue;
        for (var b = a + 1; b < P.length; b++) {
          if (P[b].z < -0.3) continue;
          var dx = pts[a].x - pts[b].x, dyy = pts[a].y - pts[b].y, dz = pts[a].z - pts[b].z;
          if (dx * dx + dyy * dyy + dz * dz < LINK * LINK) {
            var al = 0.06 + 0.09 * ((P[a].z + P[b].z) / 2 + 1) / 2;
            ctx.strokeStyle = 'rgba(255,59,48,' + al + ')';
            ctx.beginPath(); ctx.moveTo(P[a].px, P[a].py); ctx.lineTo(P[b].px, P[b].py); ctx.stroke();
          }
        }
      }

      for (var m = 0; m < P.length; m++) {
        var q = P[m];
        var depth = (q.z + 1) / 2;
        var al2 = 0.3 + 0.45 * depth;
        var r2 = 0.8 + 1.2 * depth;
        var da = Math.abs(((q.az - sa) % 6.2832 + 6.2832) % 6.2832);
        if (da < 0.5 || da > 5.78) { al2 = Math.min(1, al2 + 0.5); r2 += 0.9; }
        ctx.fillStyle = 'rgba(255,59,48,' + al2 + ')';
        ctx.beginPath(); ctx.arc(q.px, q.py, r2, 0, 6.2832); ctx.fill();
      }

      if (!reduced && running) requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
    function stop() { running = false; }

    size();
    window.addEventListener('resize', function () { size(); if (reduced) { running = true; frame(); running = false; } });

    if ('IntersectionObserver' in window && !reduced) {
      new IntersectionObserver(function (es) {
        es[0].isIntersecting && !document.hidden ? start() : stop();
      }, { threshold: 0.05 }).observe(canvas);
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : null; });
    } else { running = true; frame(); running = reduced ? false : running; }

    if (reduced) { running = true; frame(); running = false; }
    window.__bcxDomeFrame = function () { var was = running; running = true; frame(); running = was; };
  });
})();
