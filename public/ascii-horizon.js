/*!
 * ascii-horizon.js — an ASCII black hole intro for any website.
 *
 *  - A black hole made of text characters, with a spinning accretion disk.
 *  - It follows the mouse and eats the letters in its way.
 *  - Scroll down (wheel / swipe / arrow keys) and it grows until it swallows the
 *    screen, revealing your site through the hole. Scroll back up and it shrinks.
 *  - If nobody scrolls, it just keeps revolving in place.
 *
 * Idea inspired by SiddDevZ/horizon (MIT). This is a separate, lightweight
 * 2D-canvas implementation, not a copy of that project's WebGL code.
 *
 * Usage (put in <head>, plain script tag, no defer/async):
 *   <script>window.ASCII_HORIZON = { text: 'your own words here' };</script>
 *   <script src="ascii-horizon.js"></script>
 *
 * When the intro is over it fires:  window 'ascii-horizon:done'  (and CFG.onDone).
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ config */
  var CFG = {
    text: 'Somewhere past the edge of this page a star collapsed, and it has been falling ever since. ' +
          'Everything that drifts too close is pulled apart, letter by letter, and stretched into light. ' +
          'Move your mouse and it will follow you. Scroll down and it will take the whole screen. ' +
          'On the other side of the horizon there is a portfolio, quietly waiting for you to arrive.',
    hint: 'scroll to fall in',
    skip: 'skip ›',
    bg: '#03040a',
    font: "'Martian Mono', 'Courier New', monospace",
    scrollDistance: 2.0,   // roughly how many screen-heights of scrolling it takes to fall in
    once: false,           // true = only once per browser tab session
    onDone: null
  };
  var user = window.ASCII_HORIZON || {};
  for (var key in user) if (Object.prototype.hasOwnProperty.call(user, key)) CFG[key] = user[key];

  // People who ask their OS for reduced motion go straight to the site.
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    if (CFG.once) {
      if (sessionStorage.getItem('asciiHorizonSeen')) return;
      sessionStorage.setItem('asciiHorizonSeen', '1');
    }
  } catch (e) {}

  var doc = document, html = doc.documentElement;
  var canvas = doc.createElement('canvas');
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;

  /* ---------------------------------------------------------------- overlay */
  var style = doc.createElement('style');
  style.textContent =
    '#ascii-horizon{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483647;touch-action:none;overflow:hidden}' +
    '#ascii-horizon canvas{display:block;width:100%;height:100%}' +
    '#ascii-horizon .ah-hint{position:absolute;left:50%;bottom:6vh;transform:translateX(-50%);pointer-events:none;' +
    'font:12px/1 ' + CFG.font + ';letter-spacing:.28em;text-transform:uppercase;color:#9aa6c4;' +
    'transition:opacity .6s ease;animation:ah-bob 2.4s ease-in-out infinite;white-space:nowrap}' +
    '#ascii-horizon .ah-hint.off{opacity:0}' +
    '#ascii-horizon .ah-skip{position:absolute;right:16px;top:14px;background:none;border:0;cursor:pointer;' +
    'font:12px/1 ' + CFG.font + ';color:#8a95b3;opacity:.55;padding:8px}' +
    '#ascii-horizon .ah-skip:hover,#ascii-horizon .ah-skip:focus{opacity:1;outline:none}' +
    '@keyframes ah-bob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,6px)}}' +
    'html.ah-lock{overflow:hidden!important}';
  html.appendChild(style);

  var root = doc.createElement('div');
  root.id = 'ascii-horizon';
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', 'An animated black hole. Scroll to fall in and enter the site.');
  root.style.background = CFG.bg;
  var hint = doc.createElement('div');
  hint.className = 'ah-hint';
  hint.textContent = CFG.hint + '  ↓';
  var skipBtn = doc.createElement('button');
  skipBtn.className = 'ah-skip';
  skipBtn.type = 'button';
  skipBtn.textContent = CFG.skip;
  root.appendChild(canvas);
  root.appendChild(hint);
  root.appendChild(skipBtn);
  html.appendChild(root);
  html.classList.add('ah-lock');
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.scrollTo(0, 0); } catch (e) {}

  /* --------------------------------------------------------------- constants */
  var DISK_CHARS = ' .:-=+*#%@';          // brightness ramp for the glowing parts
  var RIN = 1.22, ROUT = 3.9;             // accretion disk, in units of the hole radius
  var WARM_N = 28, COOL_N = 10;           // palette sizes (disk = warm, photon ring = cool)
  var TEXT_COLORS = [
    'rgba(150,162,190,0.12)',   // 0 fading back in
    'rgba(150,162,190,0.30)',   // 1 resting page text
    'rgba(200,176,146,0.55)',   // 2 warming up
    'rgba(255,150,60,0.92)',    // 3 glowing orange
    'rgba(255,208,145,1)',      // 4 hot
    'rgba(255,247,230,1)'       // 5 white-hot
  ];
  var MAXP = 2400;                         // max letters in flight

  /* ------------------------------------------------------------------ helpers */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function sm(a, b, x) { var k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); }
  function hash(i) {
    i = (i ^ 61) ^ (i >>> 16); i = i + (i << 3); i = i ^ (i >>> 4);
    i = Math.imul(i, 0x27d4eb2d); i = i ^ (i >>> 15);
    return (i >>> 0) / 4294967296;
  }
  function ramp(stops, k) {
    for (var s = 1; s < stops.length; s++) {
      if (k <= stops[s][0] || s === stops.length - 1) {
        var a = stops[s - 1], b = stops[s], f = clamp((k - a[0]) / (b[0] - a[0]), 0, 1);
        return 'rgb(' + Math.round(lerp(a[1], b[1], f)) + ',' + Math.round(lerp(a[2], b[2], f)) + ',' + Math.round(lerp(a[3], b[3], f)) + ')';
      }
    }
  }
  var WARM = [[0, 52, 9, 5], [0.18, 150, 38, 8], [0.42, 255, 100, 18], [0.68, 255, 172, 66], [0.86, 255, 226, 158], [1, 255, 249, 233]];
  var COOL = [[0, 86, 118, 205], [0.5, 165, 204, 255], [1, 244, 250, 255]];
  var palette = [];
  var i0;
  for (i0 = 0; i0 < WARM_N; i0++) palette.push(ramp(WARM, i0 / (WARM_N - 1)));
  for (i0 = 0; i0 < COOL_N; i0++) palette.push(ramp(COOL, i0 / (COOL_N - 1)));

  /* -------------------------------------------------------------------- state */
  var W = 0, H = 0, dpr = 1, cw = 10, ch = 19, cols = 0, rows = 0, spw = 0, sph = 0;
  var atD = null, atT = null;                       // sprite atlases (disk glyphs, page letters)
  var letters, alive, bornAt, regrowAt, starCh, starPh, eaten = [];
  var pRho = new Float32Array(MAXP), pTh = new Float32Array(MAXP), pCh = new Uint8Array(MAXP), pSpd = new Float32Array(MAXP), np = 0;
  var inited = false, finished = false, raf = 0, last = 0, t = 0, spawned = 0;
  var mx = 0, my = 0, hx = 0, hy = 0, R = 60, tilt = 0.27, roll = -0.16, flare = 0;
  var p = 0, pT = 0, auto = false;                  // fall progress (smoothed / target)
  var dRn = 0;                                      // set by diskI

  /* ------------------------------------------------------------------- layout */
  function makeAtlas(w, h) { var c = doc.createElement('canvas'); c.width = w; c.height = h; return c; }

  function buildAtlases() {
    spw = Math.ceil(cw * dpr); sph = Math.ceil(ch * dpr);
    var fontPx = Math.round(cw * 1.68 * dpr), g, k, c;
    atD = makeAtlas(spw * DISK_CHARS.length, sph * palette.length);
    g = atD.getContext('2d');
    g.font = fontPx + 'px ' + CFG.font; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (c = 0; c < palette.length; c++) {
      g.fillStyle = palette[c];
      for (k = 1; k < DISK_CHARS.length; k++) g.fillText(DISK_CHARS.charAt(k), k * spw + spw / 2, c * sph + sph / 2);
    }
    atT = makeAtlas(spw * 94, sph * TEXT_COLORS.length);
    g = atT.getContext('2d');
    g.font = fontPx + 'px ' + CFG.font; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (c = 0; c < TEXT_COLORS.length; c++) {
      g.fillStyle = TEXT_COLORS[c];
      for (k = 33; k < 127; k++) g.fillText(String.fromCharCode(k), (k - 33) * spw + spw / 2, c * sph + sph / 2);
    }
  }

  function typeset() {
    var n = cols * rows, r, c, i;
    letters = new Uint8Array(n); alive = new Uint8Array(n);
    bornAt = new Float32Array(n); regrowAt = new Float32Array(n);
    starCh = new Uint8Array(n); starPh = new Float32Array(n);
    eaten = [];
    for (i = 0; i < n; i++) {
      var h = hash(i * 3 + 11);
      if (h < 0.013) { starCh[i] = h < 0.002 ? 43 : 46; starPh[i] = hash(i * 7 + 5) * 6.283; }
    }
    var clean = String(CFG.text)
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
      .replace(/[^\x20-\x7E]+/g, ' ').replace(/\s+/g, ' ').trim() || 'hello world';
    var words = clean.split(' '), wi = 0;
    for (r = 0; r < rows; r++) {
      var line = '';
      for (;;) {
        var w = words[wi % words.length];
        if (line.length + w.length + (line ? 1 : 0) > cols) {
          if (!line) { line = w.slice(0, cols); wi++; }
          break;
        }
        line += (line ? ' ' : '') + w; wi++;
      }
      for (c = 0; c < line.length; c++) {
        var code = line.charCodeAt(c);
        if (code > 32 && code < 127) { letters[r * cols + c] = code; alive[r * cols + c] = 1; }
      }
    }
  }

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    cw = Math.max(7, Math.min(14, Math.round(W / 150)));
    var budget = Math.ceil(Math.sqrt((W * H) / 9000 / 1.9));   // keep the grid under ~9000 cells
    cw = Math.max(cw, budget);
    ch = Math.round(cw * 1.9);
    cols = Math.ceil(W / cw) + 1; rows = Math.ceil(H / ch) + 1;
    buildAtlases(); typeset(); np = 0;
    if (!inited) { mx = hx = W / 2; my = hy = H / 2; inited = true; }
  }

  /* ------------------------------------------------------------- the disk glow */
  // Brightness of the accretion disk at radius rho (in hole radii) and azimuth phi.
  function diskI(rho, phi, noEdge) {
    var rn = (rho - RIN) / (ROUT - RIN);
    if (rn < 0 || rn > 1) return 0;
    dRn = rn;
    var base = Math.pow(1 - rn, 1.35);
    var edge = (noEdge ? 1 : sm(0, 0.05, rn)) * (1 - sm(0.7, 1, rn));
    var w = 0.95 / (rho * Math.sqrt(rho));            // Keplerian: inner gas orbits faster
    var q = phi - w * t;
    var n = 0.62 + 0.20 * Math.sin(2 * q + rho * 2.2) + 0.12 * Math.sin(5 * q - rho * 3.9 + 1.3) + 0.06 * Math.sin(9 * q + rho * 7.1);
    var dop = 1 + 0.5 * Math.cos(phi);                // the side rotating toward us is brighter
    return base * n * dop * edge * 1.15;
  }

  /* ------------------------------------------------------------------ update */
  function eatCell(i, dx, dy, d) {
    alive[i] = 0; regrowAt[i] = t + 3.5 + hash(i) * 5.5; eaten.push(i);
    flare = Math.min(1, flare + 0.012);
    // only some of the eaten letters get a visible fall, so a big gulp stays readable
    if (np < MAXP && spawned < 70) {
      spawned++;
      var E = 1.15 * R, img = 0.5 * (d + Math.sqrt(d * d + 4 * E * E));
      pRho[np] = Math.max(img / R, 1.45 + 0.6 * hash(i + 99));
      pTh[np] = Math.atan2(dy, dx); pCh[np] = letters[i]; pSpd[np] = 0.75 + 0.55 * hash(i + 7);
      np++;
    }
  }

  function update(dt) {
    // fall progress: follows the scroll target; "skip" keeps it moving at a steady pace
    var diff = pT - p, step = diff * (1 - Math.exp(-dt * 5.5));
    if (auto && diff > 0 && step < 0.42 * dt) step = Math.min(diff, 0.42 * dt);
    p += step;
    if (pT >= 1 && p > 0.9985) p = 1;

    // size grows exponentially with progress, so the fall feels like it's accelerating
    var R0 = clamp(Math.min(W, H) * 0.18, 56, 170), Rmax = 0.66 * Math.sqrt(W * W + H * H);
    R = R0 * Math.pow(Rmax / R0, Math.pow(p, 1.3)) * (1 + 0.012 * Math.sin(t * 1.7));

    // position: follows the mouse (heavy, smooth); drifts back to the middle while falling
    var cb = sm(0.35, 0.95, p);
    var tx = lerp(mx, W / 2, cb) + (1 - cb) * Math.sin(t * 0.37) * W * 0.006;
    var ty = lerp(my, H / 2, cb) + (1 - cb) * Math.cos(t * 0.29) * H * 0.008;
    var k = 1 - Math.exp(-dt * 2.8);
    hx += (tx - hx) * k; hy += (ty - hy) * k;
    tilt = clamp(0.27 + 0.18 * (0.5 - hy / H) + 0.015 * Math.sin(t * 0.5), 0.12, 0.45);
    roll = -0.16 + 0.22 * (hx / W - 0.5);
    flare *= Math.exp(-dt * 1.8);

    // eat letters that wander inside the capture radius
    spawned = 0;
    var Rc = 1.5 * R, Rc2 = Rc * Rc;
    var c0 = Math.max(0, ((hx - Rc) / cw) | 0), c1 = Math.min(cols - 1, ((hx + Rc) / cw) | 0);
    var r0 = Math.max(0, ((hy - Rc) / ch) | 0), r1 = Math.min(rows - 1, ((hy + Rc) / ch) | 0);
    for (var row = r0; row <= r1; row++) {
      var dy = row * ch + ch * 0.5 - hy;
      for (var col = c0; col <= c1; col++) {
        var i = row * cols + col;
        if (!alive[i]) continue;
        var dx = col * cw + cw * 0.5 - hx, d2 = dx * dx + dy * dy;
        if (d2 < Rc2) eatCell(i, dx, dy, Math.sqrt(d2));
      }
    }

    // letters grow back (away from the hole), so there's always something to eat
    var keep = Rc * 1.35, keep2 = keep * keep;
    for (var e = eaten.length - 1; e >= 0; e--) {
      var ci = eaten[e];
      if (t < regrowAt[ci]) continue;
      var ex = (ci % cols) * cw + cw * 0.5 - hx, ey = ((ci / cols) | 0) * ch + ch * 0.5 - hy;
      if (ex * ex + ey * ey > keep2) {
        alive[ci] = 1; bornAt[ci] = t;
        eaten[e] = eaten[eaten.length - 1]; eaten.pop();
      }
    }

    // letters in flight spiral inward, faster as they get closer
    for (var n = np - 1; n >= 0; n--) {
      var rho = pRho[n], sp = pSpd[n];
      rho -= dt * sp * (0.22 + 0.4 / (rho * rho));
      pTh[n] += dt * sp * (2.0 / (rho * Math.sqrt(rho)) + 0.25);
      if (rho < 1.02) {
        flare = Math.min(1, flare + 0.01);
        np--; pRho[n] = pRho[np]; pTh[n] = pTh[np]; pCh[n] = pCh[np]; pSpd[n] = pSpd[np];
      } else pRho[n] = rho;
    }
  }

  /* -------------------------------------------------------------------- draw */
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = CFG.bg; ctx.fillRect(0, 0, W, H);

    var ca = Math.cos(roll), sa = Math.sin(roll), invTilt = 1 / tilt;
    var R2 = R * R;
    var OUT2 = (ROUT * R) * (ROUT * R), LENS2 = (2.4 * R) * (2.4 * R);
    var dw = spw / dpr, dh = sph / dpr, hw = cw / 2, hh = ch / 2;
    // the glow dims and thins out as the hole grows, so the fall shows depth instead of a white wall
    var diskFade = (1 - 0.42 * sm(0.2, 0.8, p)) * (1 - sm(0.8, 0.99, p));
    var row, col, x, y, r2, r, i;

    for (row = 0; row < rows; row++) {
      var py = row * ch + hh; y = py - hy;
      var y2 = y * y;
      for (col = 0; col < cols; col++) {
        var px = col * cw + hw; x = px - hx;
        r2 = x * x + y2;
        var Idisk = 0, ringI = 0, inner = 0;

        if (r2 < OUT2) {
          r = Math.sqrt(r2);
          var xr = x * ca + y * sa, yr = -x * sa + y * ca, yd = yr * invTilt;
          // the disk itself (the near half also crosses in front of the hole)
          var rho = Math.sqrt(xr * xr + yd * yd) / R;
          if (rho > RIN && rho < ROUT && (yr >= 0 || r2 > R2)) {
            Idisk = diskI(rho, Math.atan2(yd, xr), false); inner = 1 - dRn;
          }
          if (r2 < LENS2 && r2 > R2 * 0.94) {
            var u = r / R - 1, tt = u < 0 ? 0 : u / 1.15;
            if (tt < 1) {
              // light from the far side of the disk bends over the top and under the bottom
              var rhoF = RIN + (ROUT - RIN) * 0.62 * Math.pow(tt, 1.5);
              var phiF = -Math.abs(Math.atan2(yr, xr));
              var bias = 0.55 + 0.45 * (0.5 - 0.5 * yr / r);
              var Il = diskI(rhoF, phiF, true) * Math.pow(1 - tt, 1.25) * bias * 1.55;
              if (Il > Idisk) { Idisk = Il; inner = 1 - tt; }
            }
            // photon ring: kept at least about one character cell wide so it never gets skipped
            var rw = Math.max(0.11, ch * 0.6 / R);
            var a = (r / R - 1.06) / rw, b = (r / R - 1.06) / (rw * 4);
            ringI = (1.15 * Math.exp(-a * a) + 0.26 * Math.exp(-b * b)) * (1 + 1.2 * flare);
          }
        } else r = Math.sqrt(r2);

        var itot = (ringI > Idisk ? ringI : Idisk) * diskFade;
        ringI *= diskFade; Idisk *= diskFade;
        if (itot > 0.055) {
          var gi = clamp((Math.pow(Math.min(itot, 1.4), 0.8) * 10) | 0, 1, 9), gc;
          if (ringI > 0.3 && ringI >= Idisk * 0.75) gc =WARM_N + clamp((Math.min(ringI, 1) * (COOL_N - 1)) | 0, 0, COOL_N - 1);
          else gc = clamp(((0.10 + 0.78 * Math.min(Idisk, 1) + 0.32 * inner) * (WARM_N - 1)) | 0, 0, WARM_N - 1);
          ctx.drawImage(atD, gi * spw, gc * sph, spw, sph, px - hw, py - hh, dw, dh);
          continue;
        }
        if (r2 < R2 * 0.98) continue;                       // inside the horizon: nothing

        // page letters: they warm up as they get close to the hole, right before being eaten
        i = row * cols + col;
        if (alive[i]) {
          var rr = r / R;
          var lvl = t - bornAt[i] < 0.9 && bornAt[i] > 0 ? 0 : rr < 2.4 ? 4 : rr < 3.1 ? 3 : rr < 4.4 ? 2 : 1;
          ctx.drawImage(atT, (letters[i] - 33) * spw, lvl * sph, spw, sph, px - hw, py - hh, dw, dh);
        } else {
          if (starCh[i]) {
            ctx.drawImage(atT, (starCh[i] - 33) * spw, (Math.sin(t * 1.6 + starPh[i]) > 0.25 ? 1 : 0) * sph, spw, sph, px - hw, py - hh, dw, dh);
          }
        }
      }
    }

    // letters being swallowed
    for (var n = 0; n < np; n++) {
      var rh = pRho[n], th = pTh[n], code2 = pCh[n], sp2 = pSpd[n];
      var level = rh > 2.0 ? 3 : rh > 1.5 ? 4 : 5;
      var fade = clamp((rh - 1.0) / 0.12, 0, 1) * diskFade;
      for (var gh = 0; gh < 3; gh++) {
        var rg = rh * (1 + 0.03 * gh), tg = th - gh * 0.05 * (2.0 / (rh * Math.sqrt(rh)) + 0.25) * sp2;
        ctx.globalAlpha = fade * (gh === 0 ? 1 : gh === 1 ? 0.4 : 0.18);
        ctx.drawImage(atT, (code2 - 33) * spw, level * sph, spw, sph,
          hx + rg * R * Math.cos(tg) - hw, hy + rg * R * Math.sin(tg) - hh, dw, dh);
      }
    }
    ctx.globalAlpha = 1;

    // the final act: the inside of the hole turns into a window onto the site
    var open = sm(0.5, 0.9, p);
    if (open > 0) {
      var gr = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 0.99);
      gr.addColorStop(0, 'rgba(0,0,0,' + open + ')');
      gr.addColorStop(0.82, 'rgba(0,0,0,' + open + ')');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (open > 0 && !draw.clear) { draw.clear = true; root.style.background = 'transparent'; }
  }

  /* ---------------------------------------------------------------- lifecycle */
  function frame(now) {
    if (finished) return;
    try {
      var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; t += dt;
      update(dt);
      draw();
      hint.classList.toggle('off', p > 0.03 || pT > 0.03);
      if (p >= 1) { finish(); return; }
    } catch (err) { finish(); if (window.console) console.error('ascii-horizon:', err); return; }
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('wheel', onWheel, { passive: false });
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', onResize);
    root.removeEventListener('touchstart', onTouchStart);
    root.removeEventListener('touchmove', onTouchMove);
    if (root.parentNode) root.parentNode.removeChild(root);
    if (style.parentNode) style.parentNode.removeChild(style);
    html.classList.remove('ah-lock');
    try { window.dispatchEvent(new CustomEvent('ascii-horizon:done')); } catch (e) {}
    if (typeof CFG.onDone === 'function') { try { CFG.onDone(); } catch (e2) {} }
  }

  /* -------------------------------------------------------------------- input */
  function addScroll(dy) { auto = false; pT = clamp(pT + dy / (H * CFG.scrollDistance), 0, 1); }
  function skip() { auto = true; pT = 1; }
  var touchY = 0;
  function onWheel(e) {
    if (finished) return;
    e.preventDefault();
    var d = e.deltaY; if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= H;
    addScroll(d);
  }
  function onTouchStart(e) { if (e.touches && e.touches[0]) touchY = e.touches[0].clientY; }
  function onTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    e.preventDefault();
    var y = e.touches[0].clientY; addScroll((touchY - y) * 1.7); touchY = y;
  }
  function onKey(e) {
    var k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' || k === ' ') { e.preventDefault(); addScroll(H * 0.35); }
    else if (k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); addScroll(-H * 0.35); }
    else if (k === 'End') { e.preventDefault(); skip(); }
    else if (k === 'Home') { e.preventDefault(); auto = false; pT = 0; }
    else if (k === 'Escape') skip();
  }
  function onPointer(e) { if (e.pointerType === 'touch') return; mx = e.clientX; my = e.clientY; }
  var resizeTimer = 0;
  function onResize() { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 120); }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('resize', onResize);
  root.addEventListener('touchstart', onTouchStart, { passive: true });
  root.addEventListener('touchmove', onTouchMove, { passive: false });
  skipBtn.addEventListener('click', skip);

  layout();
  raf = requestAnimationFrame(function (now) { last = now; frame(now); });
})();
