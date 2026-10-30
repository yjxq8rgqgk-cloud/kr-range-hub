/* ============================================================
   Ballistikrechner 3.0 — Reticle (Live-Absehen, Canvas)
   Zeichnet die Zielfernrohr-Ansicht: Fadenkreuz, mrad-Skala,
   Holdover-Leiter mit Distanzlabels, Wind-Trajektorie und den
   aktuellen Lösungs-Haltepunkt (Kupfer, glühend).
   ============================================================ */
(function (global) {
  'use strict';

  const C = {
    ink900: '#14110B', ink850: '#1A160E', ink800: '#211C13', ink700: '#2B2418',
    copper: '#B26A3E', copperBright: '#C9824E', copperDeep: '#8C4F2C',
    steel: '#9A988F', steelLight: '#C2C0B6', sand: '#BCAB86', bone: '#EFE8D6',
    bronze: '#C39A4C', gold: '#D2B05A'
  };

  // Sonnenlicht-Palette: hell, maximaler Kontrast
  const SUN = {
    bgCenter: '#F8F3EA', bgEdge: '#EDE4D0',
    cross: 'rgba(20,16,8,.45)',
    post: '#13100A',
    tick: 'rgba(30,22,10,.75)',
    label: 'rgba(130,60,18,.95)',
    holdRing: '#A04018', holdDot: '#A04018',
    glowInner: 'rgba(160,64,24,.35)', glowOuter: 'rgba(160,64,24,0)',
    wind: 'rgba(50,35,15,.55)',
    windText: 'rgba(40,28,10,.85)',
    windArrow: '#A04018',
    ringOuter: '#2a2010',
    ringInner: '#6a5840'
  };

  function draw(canvas, sol, ladderArr, opts) {
    opts = opts || {};
    const sun = !!opts.sun;
    const dpr = global.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const R = Math.min(w, h) / 2 - 2;     // Scope-Radius
    const ox = w / 2, oy = h / 2;          // Scope-Mittelpunkt

    // ---- Scope-Innenraum (Clip auf Kreis) ----
    ctx.save();
    ctx.beginPath(); ctx.arc(ox, oy, R, 0, Math.PI * 2); ctx.clip();

    if (sun) {
      // Heller Hintergrund mit leichter Vignette nach außen hin
      const g = ctx.createRadialGradient(ox, oy - R * 0.1, R * 0.15, ox, oy, R * 1.0);
      g.addColorStop(0, SUN.bgCenter);
      g.addColorStop(0.72, '#EDE4D0');
      g.addColorStop(1, '#D8CDB5');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } else {
      const g = ctx.createRadialGradient(ox, oy - R * 0.15, R * 0.2, ox, oy, R * 1.05);
      g.addColorStop(0, '#221d14');
      g.addColorStop(0.7, C.ink850);
      g.addColorStop(1, '#0d0b07');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }

    // Zero-Punkt: oberes Drittel, damit Holdover-Leiter Platz hat
    const cx = ox;
    const cy = oy - R * 0.42;
    const usableDown = (oy + R) - cy - 10;
    const pxPerMrad = usableDown / 12;     // ~12 mrad sichtbar nach unten
    const my = m => cy + m * pxPerMrad;    // mrad runter → y
    const mx = m => cx + m * pxPerMrad;    // mrad seite → x (rechts+)

    // ---- Fadenkreuz ----
    // dünne Mittellinien
    ctx.strokeStyle = sun ? SUN.cross : 'rgba(194,192,182,.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, oy - R); ctx.lineTo(cx, oy + R); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox - R, cy); ctx.lineTo(ox + R, cy); ctx.stroke();

    // dicke Außenposten
    const postFromMrad = 4.2;
    ctx.strokeStyle = sun ? SUN.post : C.bone; ctx.lineWidth = 3.4; ctx.lineCap = 'butt';
    // horizontal posts
    ctx.beginPath(); ctx.moveTo(ox - R, cy); ctx.lineTo(mx(-postFromMrad), cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx(postFromMrad), cy); ctx.lineTo(ox + R, cy); ctx.stroke();
    // vertical top post
    ctx.beginPath(); ctx.moveTo(cx, oy - R); ctx.lineTo(cx, my(-postFromMrad)); ctx.stroke();

    // ---- Subtensions je Absehen-Typ ----
    const rtype = (opts && opts.type) || 'MRAD-HASH';
    ctx.font = '600 ' + Math.max(9, R * 0.052) + 'px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';

    if (rtype === 'MRAD-HASH' || rtype === 'MIL-DOT') {
      // Horizontale Skala
      for (let m = -postFromMrad + 1; m <= postFromMrad - 1; m++) {
        if (m === 0) continue;
        if (rtype === 'MIL-DOT') {
          ctx.fillStyle = sun ? SUN.tick : C.steelLight;
          ctx.beginPath(); ctx.arc(mx(m), cy, 2.1, 0, Math.PI * 2); ctx.fill();
        } else {
          const big = (m % 5 === 0); const len = big ? 9 : 6;
          ctx.strokeStyle = sun ? SUN.tick : C.steelLight; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(mx(m), cy - len); ctx.lineTo(mx(m), cy + len); ctx.stroke();
        }
      }
      // Vertikale Holdover-Skala
      for (let m = 1; m <= 12; m++) {
        if (rtype === 'MIL-DOT') {
          ctx.fillStyle = sun ? SUN.tick : 'rgba(188,171,134,.9)';
          ctx.beginPath(); ctx.arc(cx, my(m), 2.1, 0, Math.PI * 2); ctx.fill();
        } else {
          const big = (m % 5 === 0); const len = big ? 12 : 7;
          ctx.strokeStyle = sun ? SUN.tick : 'rgba(188,171,134,.85)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(cx - len, my(m)); ctx.lineTo(cx + len, my(m)); ctx.stroke();
        }
      }
      // Distanzlabels aus ladderArr
      ctx.fillStyle = sun ? SUN.label : 'rgba(201,130,78,.85)';
      ctx.textAlign = 'left';
      ladderArr.forEach(p => {
        const y = my(p.downMrad);
        if (y > oy + R - 4 || p.downMrad < 0.3) return;
        ctx.fillText(p.range + ' m', cx + 16, y);
      });
    }
    // DUPLEX: keine Subtensions (nur Posten + Mittelkreuz)

    // ---- Wind-Trajektorie (Kurve durch Holdover-Punkte) ----
    if (ladderArr.length) {
      ctx.strokeStyle = sun ? SUN.wind : 'rgba(178,106,62,.55)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ladderArr.forEach(p => ctx.lineTo(mx(p.sideMrad), my(p.downMrad)));
      ctx.stroke();
    }

    // ---- aktueller Lösungs-Haltepunkt ----
    const hx = mx(sol.holdSideMrad);
    const hy = my(sol.holdDownMrad);
    // Glühen
    const glowC0 = sun ? SUN.glowInner : 'rgba(201,130,78,.42)';
    const glowC1 = sun ? SUN.glowOuter : 'rgba(201,130,78,0)';
    const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 0.14);
    glow.addColorStop(0, glowC0);
    glow.addColorStop(1, glowC1);
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(hx, hy, R * 0.14, 0, Math.PI * 2); ctx.fill();
    // Ring + Punkt
    ctx.strokeStyle = sun ? SUN.holdRing : C.copperBright; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = sun ? SUN.holdDot : C.copperBright;
    ctx.beginPath(); ctx.arc(hx, hy, 3.2, 0, Math.PI * 2); ctx.fill();
    // kleine Markierungslinien
    ctx.strokeStyle = sun ? 'rgba(160,64,24,.9)' : 'rgba(201,130,78,.9)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(hx - 14, hy); ctx.lineTo(hx - 9, hy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx + 9, hy); ctx.lineTo(hx + 14, hy); ctx.stroke();

    ctx.restore(); // end clip

    // ---- Scope-Ring ----
    ctx.lineWidth = 3;
    ctx.strokeStyle = sun ? SUN.ringOuter : '#0c0a06';
    ctx.beginPath(); ctx.arc(ox, oy, R + 0.5, 0, Math.PI * 2); ctx.stroke();
    const ring = ctx.createLinearGradient(ox - R, oy - R, ox + R, oy + R);
    if (sun) { ring.addColorStop(0, '#6a5840'); ring.addColorStop(0.5, '#8a7252'); ring.addColorStop(1, '#4a3f2a'); }
    else { ring.addColorStop(0, '#4a4036'); ring.addColorStop(0.5, '#776a52'); ring.addColorStop(1, '#3a332a'); }
    ctx.lineWidth = 2;
    ctx.strokeStyle = ring;
    ctx.beginPath(); ctx.arc(ox, oy, R - 1, 0, Math.PI * 2); ctx.stroke();

    // ---- Wind-Indikator oben rechts (im Scope) ----
    ctx.save();
    ctx.beginPath(); ctx.arc(ox, oy, R, 0, Math.PI * 2); ctx.clip();
    const wx = ox + R * 0.30, wy = oy - R * 0.62;
    ctx.font = '600 ' + Math.max(10, R * 0.055) + 'px "JetBrains Mono", monospace';
    ctx.fillStyle = sun ? SUN.windText : 'rgba(154,152,143,.9)';
    ctx.textAlign = 'center';
    const dirTxt = sol.windMs > 0 ? sol.windDirDeg + '°' : '—';
    ctx.fillText('WIND ' + sol.windMs.toFixed(1) + ' m/s · ' + dirTxt, wx, wy);
    if (sol.windMs > 0) {
      // Pfeil in Wind-FROM-Richtung
      const ar = R * 0.12;
      const ang = (sol.windDirDeg) * Math.PI / 180; // 0=oben
      const ax = wx, ay = wy + R * 0.16;
      ctx.translate(ax, ay); ctx.rotate(ang + Math.PI); // Pfeil zeigt wohin Wind weht
      ctx.strokeStyle = sun ? SUN.windArrow : C.copperBright; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -ar); ctx.lineTo(0, ar); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, ar); ctx.lineTo(-4, ar - 6); ctx.moveTo(0, ar); ctx.lineTo(4, ar - 6); ctx.stroke();
    }
    ctx.restore();
  }

  global.Reticle = { draw };

})(window);
