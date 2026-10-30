/* ============================================================
   Ballistikrechner 3.0 — Trefferauswertung (Target Analysis)
   Interaktive 10er-Schützenscheibe: Treffer einzeichnen,
   pinch/pan zoom, MPI · Visierkorrektur · Haltepunkt · Streukreis,
   Ausreißer-Erkennung, S/W-PDF-Export auf ein Blatt.
   ============================================================ */
(function (global) {
  'use strict';
  const TA = {};
  global.HitsScreen = TA;

  // Farben (Bildschirm)
  const COL = {
    shot: '#7FA8C0',      // Treffer (gewertet)
    outlier: '#C2573A',   // Ausreißer
    center: '#9BB85E',    // Ziel / Mitte
    mpi: '#E0A24E',       // Mittlerer Treffpunkt
    hold: '#6E97B5',      // Haltepunkt
    group: '#C9824E',     // Streukreis
    ring: 'rgba(201,177,140,.42)',
    ringStrong: 'rgba(201,177,140,.72)',
    grid: 'rgba(201,177,140,.10)',
    num: 'rgba(201,177,140,.55)'
  };
  const SUN = {
    ring: 'rgba(60,46,20,.42)', ringStrong: 'rgba(60,46,20,.72)',
    grid: 'rgba(60,46,20,.10)', num: 'rgba(60,46,20,.6)'
  };

  // Boarisch — lustige Übersetzung der Trefferauswertung
  const BO = {
    'Trefferauswertung': 'Doffa-Gschau',
    'Tippen = Treffer · Ziehen = verschieben · 2 Finger = zoomen': 'Tippa = Doffa · Ziagn = umischiam · 2 Finga = zoomer',
    'Steuerung': 'Zum Rumdrucka',
    'Ergebnis': 'Wos rauskimmt',
    'Einstellungen': 'Eistellunga',
    'Berechnen': 'Ausrechna',
    'Letzten löschen': 'Letztn weg',
    'Zurücksetzen': 'Olls weg',
    'Als PDF exportieren': 'Ois PDF rausgebn',
    'Scheibengröße': 'Scheim-Größ',
    'Mittlerer Treffpunkt': "Wo's mittn higeht",
    'Visierkorrektur': 'Visier-Richtn',
    'Haltepunkt': "Wo'd hihoidn muasst",
    'Streukreis (Ø)': 'Streu-Kroas (Ø)',
    'Waffe': 'Bix',
    'Munition': 'Patrona',
    'Kaliber': 'Kaliba',
    'Ringabstand': 'Ring-Obstand',
    'Scheiben-Ø': 'Scheim-Ø',
    'Scheibe-Ø': 'Scheim-Ø',
    'Klickwert': 'Klick-Wert',
    'Ausreißer-Empfindlichkeit': "Ausreißa-G'spür",
    'streng': "g'nau",
    'tolerant': 'wuascht',
    // dynamische Wörter
    'rechts': 'rechts', 'links': 'links', 'hoch': 'auffi', 'tief': 'tiaf', 'mittig': 'mittn', 'runter': 'owi',
    'Abstand': 'Obstand', 'Ring': 'Ring', 'Mitte': 'Mittn', 'zentriert': 'mittn drin', 'Klick': 'Klick',
    'Treffer': 'Doffa', 'gewertet': 'zoiht', 'Ausreißer': 'Ausreißa',
    'Treffer gewertet': 'Doffa zoiht', 'Ausreißer ignoriert': 'Ausreißa wuascht',
    'ohne Visierkorrektur halten': 'ohne Visier-Richtn hoitn',
    'Auswertung berechnet': "Ausg'rechnet",
    'Zuerst Treffer auf der Scheibe einzeichnen.': "Zerscht amoi Doffa auf d'Scheim moin.",
    'Keine Treffer vorhanden.': 'Koane Doffa do.',
    'Bereits leer.': 'Eh scho leer.',
    'Scheibe zurückgesetzt.': 'Scheim is wieda leer.',
    'Zurücksetzen?': 'Olls weg?',
    'Alle eingezeichneten Treffer werden entfernt.': 'Olle Doffa wern glescht.'
  };

  // English — Übersetzung der Trefferauswertung
  const EN = {
    'Trefferauswertung': 'Target Analysis',
    'Tippen = Treffer · Ziehen = verschieben · 2 Finger = zoomen': 'Tap = hit · Drag = move · 2 fingers = zoom',
    'Steuerung': 'Controls',
    'Ergebnis': 'Result',
    'Einstellungen': 'Settings',
    'Berechnen': 'Calculate',
    'Letzten löschen': 'Delete last',
    'Zurücksetzen': 'Reset',
    'Als PDF exportieren': 'Export as PDF',
    'Scheibengröße': 'Target size',
    'Mittlerer Treffpunkt': 'Mean point of impact',
    'Visierkorrektur': 'Sight correction',
    'Haltepunkt': 'Hold point',
    'Streukreis (Ø)': 'Group size (Ø)',
    'Waffe': 'Rifle',
    'Munition': 'Ammunition',
    'Kaliber': 'Caliber',
    '10er-Ø': '10-ring Ø',
    'Ringabstand': 'Ring spacing',
    'Scheiben-Ø': 'Target Ø',
    'Scheibe-Ø': 'Target Ø',
    'Klickwert': 'Click value',
    'Ausreißer-Empfindlichkeit': 'Outlier sensitivity',
    'streng': 'strict',
    'tolerant': 'tolerant',
    'rechts': 'right', 'links': 'left', 'hoch': 'high', 'tief': 'low', 'mittig': 'centred', 'runter': 'down',
    'Abstand': 'Distance', 'Ring': 'Ring', 'Mitte': 'Centre', 'zentriert': 'centred', 'Klick': 'clicks',
    'Treffer': 'Hits', 'gewertet': 'counted', 'Ausreißer': 'Outliers',
    'Treffer gewertet': 'hits counted',
    'Ausreißer ignoriert': 'outliers ignored',
    'ohne Visierkorrektur halten': 'hold without sight correction',
    'Auswertung berechnet': 'Analysis calculated',
    'Zuerst Treffer auf der Scheibe einzeichnen.': 'First mark some hits on the target.',
    'Keine Treffer vorhanden.': 'No hits present.',
    'Bereits leer.': 'Already empty.',
    'Scheibe zurückgesetzt.': 'Target reset.',
    'Zurücksetzen?': 'Reset?',
    'Alle eingezeichneten Treffer werden entfernt.': 'All marked hits will be removed.',
    'Treffer gesamt': 'Total hits',
    'ohne Korrektur': 'without correction',
    'Auswertung': 'Analysis',
    'Keine Treffer eingezeichnet.': 'No hits marked.',
    'Streukreis': 'Group',
    '← Zurück': '← Back',
    'Schließen': 'Close',
    'Drucken / PDF': 'Print / PDF',
    'Bitte Pop-ups erlauben, um die PDF zu erzeugen.': 'Please allow pop-ups to generate the PDF.'
  };

  // English — Tooltips (data-info) der Trefferauswertung
  const EN_INFO = {
    'Wird aus 10er-Ø und Ringabstand für eine 10-Ring-Scheibe errechnet. Du kannst den Wert überschreiben.': 'Computed from the 10-ring Ø and ring spacing for a 10-ring target. You can override the value.',
    'Wie weit sich der Treffpunkt auf der Scheibe pro Klick verschiebt (mm/Klick). Daraus wird die Visierkorrektur in Klicks berechnet.': 'How far the point of impact moves on the target per click (mm/click). The sight correction in clicks is derived from it.'
  };

  const f1 = v => (Math.round(v * 10) / 10).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const dirH = x => x > 0.05 ? 'rechts' : x < -0.05 ? 'links' : 'mittig';
  const dirV = y => y > 0.05 ? 'tief' : y < -0.05 ? 'hoch' : 'mittig';

  function geomNorm(g) {
    const tenMm = Math.max(2, g.tenMm || 50);
    const ringMm = Math.max(1, g.ringMm || 25);
    const discMm = Math.max(tenMm, g.discMm || (tenMm + 18 * ringMm));
    const klickMm = Math.max(0.1, g.klickMm || 20);
    return { tenMm, ringMm, discMm, klickMm };
  }
  function scoreAt(r, g) {
    const tenR = g.tenMm / 2;
    if (r <= tenR) return 10;
    const steps = Math.ceil((r - tenR) / g.ringMm);
    return Math.max(0, 10 - steps);
  }
  function scoreDecimal(r, g) {
    const tenR = g.tenMm / 2;
    if (r <= tenR) return Math.max(0, 10 + (tenR - r) / g.ringMm * 0); // 10 inside ten-ring
    const v = 10 - (r - tenR) / g.ringMm;
    return Math.max(0, v);
  }

  function median(a) {
    if (!a.length) return 0;
    const b = a.slice().sort((x, y) => x - y), m = b.length >> 1;
    return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
  }
  function computeStats(shots, g, sens) {
    const n = shots.length;
    if (!n) return null;
    const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
    const outliers = [];
    if (n >= 4) {
      // robuster Mittelpunkt (Median) + MAD — unempfindlich gegen grobe Ausreißer
      const cxR = median(shots.map(s => s.x)), cyR = median(shots.map(s => s.y));
      const d = shots.map(s => Math.hypot(s.x - cxR, s.y - cyR));
      const medD = median(d);
      const madSigma = 1.4826 * median(d.map(v => Math.abs(v - medD))) || (mean(d.map(v => Math.abs(v - medD))) * 1.2533);
      if (madSigma > 1e-6) {
        const thr = medD + sens * madSigma;
        shots.forEach((s, i) => { if (d[i] > thr) outliers.push(i); });
      }
    }
    const valued = shots.filter((s, i) => outliers.indexOf(i) < 0);
    const vc = valued.length || 1;
    const vx = mean(valued.map(s => s.x)), vy = mean(valued.map(s => s.y));
    let group = 0, pa = null, pb = null;
    for (let i = 0; i < valued.length; i++)
      for (let j = i + 1; j < valued.length; j++) {
        const dd = Math.hypot(valued[i].x - valued[j].x, valued[i].y - valued[j].y);
        if (dd > group) { group = dd; pa = valued[i]; pb = valued[j]; }
      }
    return { mx: vx, my: vy, group, outliers, valuedCount: vc, total: n, pa, pb };
  }

  // ============================================================
  TA.mount = function (s, A) {
    const body = s.querySelector('.scrn-body');
    const H = A.state.hits;
    const L = () => (A.state.prefs && A.state.prefs.lang) || 'de';
    const t = de => {
      const l = L();
      if (l === 'by') return BO[de] != null ? BO[de] : de;
      if (l === 'en') return EN[de] != null ? EN[de] : de;
      return de;
    };
    const tdirH = x => t(x > 0.05 ? 'rechts' : x < -0.05 ? 'links' : 'mittig');
    const tdirV = y => t(y > 0.05 ? 'tief' : y < -0.05 ? 'hoch' : 'mittig');

    body.innerHTML = `
      <div class="ta-card accent">
        <div class="ta-stage" id="taStage">
          <canvas id="taCanvas"></canvas>
          <div class="ta-hint" id="taHint" data-i="Tippen = Treffer · Ziehen = verschieben · 2 Finger = zoomen">Tippen = Treffer · Ziehen = verschieben · 2 Finger = zoomen</div>
          <div class="ta-zoom">
            <button id="taZoomIn" aria-label="Vergrößern">+</button>
            <button id="taZoomOut" aria-label="Verkleinern">−</button>
            <button id="taZoomFit" aria-label="Einpassen" style="font-size:13px">⤢</button>
          </div>
        </div>
        <div class="ta-cap" id="taCap"></div>
      </div>

      <div class="ta-card">
        <div class="ta-h" data-i="Steuerung">Steuerung</div>
        <button class="kbtn" id="taCalc" style="width:100%" data-i="Berechnen">Berechnen</button>
        <div class="ta-row">
          <button class="kbtn ghost" id="taUndo" data-i="Letzten löschen">Letzten löschen</button>
          <button class="kbtn ghost" id="taReset" data-i="Zurücksetzen">Zurücksetzen</button>
        </div>
        <div class="ta-row"><button class="kbtn ghost" id="taPdf" style="border-color:var(--copper);color:var(--copper-bright)" data-i="Als PDF exportieren">Als PDF exportieren</button></div>
        <div class="ta-slider-row">
          <div class="ta-slider-top"><span class="l" data-i="Scheibengröße">Scheibengröße</span><span class="v" id="taZoomV">100 %</span></div>
          <input type="range" class="sl" id="taZoomSlider" min="40" max="300" step="1" value="100">
        </div>
      </div>

      <div class="ta-card">
        <div class="ta-h" data-i="Ergebnis">Ergebnis</div>
        <div class="ta-res"><span class="dot" style="background:${COL.mpi}"></span><div class="body">
          <div class="lab" data-i="Mittlerer Treffpunkt">Mittlerer Treffpunkt</div><div class="val empty" id="taRmpi">—</div><div class="sub" id="taRmpiS"></div></div></div>
        <div class="ta-res"><span class="dot" style="background:${COL.center}"></span><div class="body">
          <div class="lab" data-i="Visierkorrektur">Visierkorrektur</div><div class="val empty" id="taRcorr">—</div><div class="sub" id="taRcorrS"></div></div></div>
        <div class="ta-res"><span class="dot" style="background:${COL.hold}"></span><div class="body">
          <div class="lab" data-i="Haltepunkt">Haltepunkt</div><div class="val empty" id="taRhold">—</div><div class="sub" id="taRholdS"></div></div></div>
        <div class="ta-res"><span class="ring"></span><div class="body">
          <div class="lab" data-i="Streukreis (Ø)">Streukreis (Ø)</div><div class="val empty" id="taRgrp">—</div><div class="sub" id="taRgrpS"></div></div></div>
      </div>

      <div class="ta-card">
        <div class="ta-h" data-i="Einstellungen">Einstellungen</div>
        <div class="field"><label><span data-i="Waffe">Waffe</span></label><input type="text" id="taWeapon" placeholder="z. B. Anschütz 1907" value="${H.meta.weapon || ''}"></div>
        <div class="field"><label><span data-i="Munition">Munition</span></label><input type="text" id="taAmmo" placeholder="z. B. RWS R 50 / Match" value="${H.meta.ammo || ''}"></div>
        <div class="field"><label><span data-i="Kaliber">Kaliber</span></label><input type="text" id="taCaliber" placeholder="z. B. .22 lr" value="${H.meta.caliber || ''}"></div>
        <div class="ta-nrow"><label><span data-i="10er-Ø">10er-Ø</span></label><div class="ta-ninput"><input type="number" id="taTen" inputmode="decimal" value="${H.geom.tenMm}"><span class="u">mm</span></div></div>
        <div class="ta-nrow"><label><span data-i="Ringabstand">Ringabstand</span></label><div class="ta-ninput"><input type="number" id="taRing" inputmode="decimal" value="${H.geom.ringMm}"><span class="u">mm</span></div></div>
        <div class="ta-nrow"><label><span data-i="Scheiben-Ø">Scheiben-Ø</span> <span class="ib" data-info="Wird aus 10er-Ø und Ringabstand für eine 10-Ring-Scheibe errechnet. Du kannst den Wert überschreiben.">i</span></label><div class="ta-ninput"><input type="number" id="taDisc" inputmode="decimal" value="${H.geom.discMm}"><span class="u">mm</span></div></div>
        <div class="ta-nrow"><label><span data-i="Klickwert">Klickwert</span> <span class="ib" data-info="Wie weit sich der Treffpunkt auf der Scheibe pro Klick verschiebt (mm/Klick). Daraus wird die Visierkorrektur in Klicks berechnet.">i</span></label><div class="ta-ninput"><input type="number" id="taKlick" inputmode="decimal" value="${H.geom.klickMm}"><span class="u">mm</span></div></div>
        <div class="ta-slider-row">
          <div class="ta-slider-top"><span class="l" data-i="Ausreißer-Empfindlichkeit">Ausreißer-Empfindlichkeit</span><span class="v" id="taOutV">${f1(H.outlier)}</span></div>
          <input type="range" class="sl" id="taOutSlider" min="1" max="6" step="0.5" value="${H.outlier}">
          <div class="ta-slider-ends"><span data-i="streng">streng</span><span data-i="tolerant">tolerant</span></div>
        </div>
      </div>`;

    const stage = body.querySelector('#taStage');
    const canvas = body.querySelector('#taCanvas');
    const ctx = canvas.getContext('2d');
    const cap = body.querySelector('#taCap');

    // ---- View (zoom about center + pan) ----
    let zoom = H.zoom || 1, panX = 0, panY = 0, fitScale = 1;
    let stats = null;

    function geom() { return geomNorm(H.geom); }
    function isSun() { return document.querySelector('.screen').classList.contains('theme-sun'); }

    function draw() {
      const rect = stage.getBoundingClientRect();
      const cssW = rect.width, cssH = rect.height;
      if (!cssW || !cssH) return;
      const dpr = global.devicePixelRatio || 1;
      if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
        canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      const g = geom();
      const discR = g.discMm / 2;
      fitScale = (Math.min(cssW, cssH) * 0.46) / discR;
      const scale = fitScale * zoom;
      const ox = cssW / 2 + panX, oy = cssH / 2 + panY;
      const sun = isSun();
      const cRing = sun ? SUN.ring : COL.ring, cRingS = sun ? SUN.ringStrong : COL.ringStrong;
      const cGrid = sun ? SUN.grid : COL.grid, cNum = sun ? SUN.num : COL.num;
      const W = (wx, wy) => [ox + wx * scale, oy + wy * scale];

      // faint grid (every ringMm)
      ctx.strokeStyle = cGrid; ctx.lineWidth = 1;
      const stepPx = g.ringMm * scale;
      if (stepPx > 6) {
        for (let gx = ox % stepPx; gx < cssW; gx += stepPx) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, cssH); ctx.stroke(); }
        for (let gy = oy % stepPx; gy < cssH; gy += stepPx) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cssW, gy); ctx.stroke(); }
      }

      // rings (outer→inner)
      const tenR = g.tenMm / 2;
      const nRings = Math.max(1, Math.round((discR - tenR) / g.ringMm) + 1);
      for (let k = nRings - 1; k >= 0; k--) {
        const rr = tenR + k * g.ringMm;
        const [sx, sy] = W(0, 0);
        ctx.beginPath(); ctx.arc(sx, sy, rr * scale, 0, Math.PI * 2);
        ctx.strokeStyle = (k === 0) ? cRingS : cRing;
        ctx.lineWidth = (k === 0) ? 1.6 : 1.1;
        ctx.stroke();
      }
      // ten-ring inner fill (subtle)
      {
        const [sx, sy] = W(0, 0);
        ctx.beginPath(); ctx.arc(sx, sy, tenR * scale, 0, Math.PI * 2);
        ctx.fillStyle = sun ? 'rgba(60,46,20,.06)' : 'rgba(201,177,140,.06)'; ctx.fill();
      }
      // ring numbers along lower vertical axis
      if (g.ringMm * scale > 16) {
        ctx.fillStyle = cNum; ctx.font = '600 ' + Math.min(13, Math.max(9, g.ringMm * scale * 0.32)) + 'px "JetBrains Mono",monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let k = 0; k < nRings; k++) {
          const rr = tenR + (k - 0.5) * g.ringMm; if (rr <= 0) continue;
          const val = 10 - k; if (val < 1) break;
          const [sx, sy] = W(0, rr);
          if (sy > 0 && sy < cssH) ctx.fillText(String(val), sx, sy);
        }
      }
      // center cross (Ziel / Mitte)
      {
        const [sx, sy] = W(0, 0); const c = 9;
        ctx.strokeStyle = COL.center; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(sx - c, sy); ctx.lineTo(sx + c, sy); ctx.moveTo(sx, sy - c); ctx.lineTo(sx, sy + c); ctx.stroke();
      }

      // group circle + hold + MPI (only when shown)
      if (H.shown && stats) {
        const [msx, msy] = W(stats.mx, stats.my);
        if (stats.group > 0) {
          ctx.beginPath(); ctx.arc(msx, msy, (stats.group / 2) * scale, 0, Math.PI * 2);
          ctx.strokeStyle = COL.group; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]); ctx.stroke(); ctx.setLineDash([]);
        }
        // hold point = -MPI
        const [hsx, hsy] = W(-stats.mx, -stats.my);
        ctx.strokeStyle = COL.hold; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(hsx, hsy, 8, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hsx - 12, hsy); ctx.lineTo(hsx - 5, hsy); ctx.moveTo(hsx + 5, hsy); ctx.lineTo(hsx + 12, hsy);
        ctx.moveTo(hsx, hsy - 12); ctx.lineTo(hsx, hsy - 5); ctx.moveTo(hsx, hsy + 5); ctx.lineTo(hsx, hsy + 12); ctx.stroke();
      }

      // shots
      const out = stats ? stats.outliers : [];
      H.shots.forEach((sh, i) => {
        const [sx, sy] = W(sh.x, sh.y);
        const isOut = H.shown && out.indexOf(i) >= 0;
        if (isOut) {
          ctx.strokeStyle = COL.outlier; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx - 3.2, sy - 3.2); ctx.lineTo(sx + 3.2, sy + 3.2); ctx.moveTo(sx + 3.2, sy - 3.2); ctx.lineTo(sx - 3.2, sy + 3.2); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2);
          ctx.fillStyle = COL.shot; ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1; ctx.stroke();
        }
      });

      // MPI marker on top
      if (H.shown && stats) {
        const [msx, msy] = W(stats.mx, stats.my);
        ctx.save(); ctx.translate(msx, msy); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = COL.mpi; ctx.fillRect(-6, -6, 12, 12);
        ctx.strokeStyle = '#1b130c'; ctx.lineWidth = 1.4; ctx.strokeRect(-6, -6, 12, 12);
        ctx.restore();
        ctx.beginPath(); ctx.arc(msx, msy, 1.7, 0, Math.PI * 2); ctx.fillStyle = '#1b130c'; ctx.fill();
      }
    }

    function relabel() {
      const ttl = s.querySelector('.scrn-head h2'); if (ttl) ttl.textContent = t('Trefferauswertung');
      body.querySelectorAll('[data-i]').forEach(eln => { eln.textContent = t(eln.dataset.i); });
      const lang = L();
      body.querySelectorAll('[data-info]').forEach(eln => {
        if (eln.dataset.deInfo === undefined) eln.dataset.deInfo = eln.getAttribute('data-info') || '';
        const de = eln.dataset.deInfo;
        eln.setAttribute('data-info', (lang === 'en' && EN_INFO[de] != null) ? EN_INFO[de] : de);
      });
    }

    function renderCap() {
      const g = geom();
      cap.innerHTML = `${t('10er-Ø')} <b>${f1(g.tenMm)} mm</b> · ${t('Ringabstand')} <b>${f1(g.ringMm)} mm</b> · ${t('Scheibe-Ø')} <b>${f1(g.discMm)} mm</b><br>${t('Treffer')}: <b>${H.shots.length}</b>${H.shown && stats ? ` · ${t('gewertet')} <b>${stats.valuedCount}</b> · ${t('Ausreißer')} <b>${stats.outliers.length}</b>` : ''}`;
    }

    function setEmpty(id, sid) {
      const v = body.querySelector('#' + id); v.classList.add('empty'); v.textContent = '—';
      if (sid) body.querySelector('#' + sid).textContent = '';
    }
    function renderResults() {
      if (!H.shown || !stats) {
        setEmpty('taRmpi', 'taRmpiS'); setEmpty('taRcorr', 'taRcorrS');
        setEmpty('taRhold', 'taRholdS'); setEmpty('taRgrp', 'taRgrpS');
        return;
      }
      const g = geom();
      const mx = stats.mx, my = stats.my;
      const dist = Math.hypot(mx, my);
      // MPI
      const vmpi = body.querySelector('#taRmpi'); vmpi.classList.remove('empty');
      vmpi.textContent = `${f1(Math.abs(mx))} mm ${tdirH(mx)} · ${f1(Math.abs(my))} mm ${tdirV(my)}`;
      body.querySelector('#taRmpiS').textContent =
        `${t('Abstand')} ${f1(dist)} mm · ${t('Ring')} ${f1(scoreDecimal(dist, g))}`;
      // Visierkorrektur (Klicks, Richtung gegen den Versatz)
      const klick = g.klickMm;
      const hC = Math.round(Math.abs(mx) / klick), vC = Math.round(Math.abs(my) / klick);
      const hDir = mx > 0 ? '← ' + t('links') : mx < 0 ? '→ ' + t('rechts') : '–';
      const vDir = my > 0 ? '↑ ' + t('hoch') : my < 0 ? '↓ ' + t('runter') : '–';
      const vcorr = body.querySelector('#taRcorr'); vcorr.classList.remove('empty');
      const parts = [];
      if (vC > 0) parts.push(`${vDir} ${vC}`);
      if (hC > 0) parts.push(`${hDir} ${hC}`);
      vcorr.textContent = parts.length ? parts.join(' · ') + ' ' + t('Klick') : t('zentriert');
      body.querySelector('#taRcorrS').textContent = `${t('Klickwert')} ${f1(klick)} mm · vert. ${f1(Math.abs(my))} mm · horiz. ${f1(Math.abs(mx))} mm`;
      // Haltepunkt = -MPI
      const hx = -mx, hy = -my;
      const vhold = body.querySelector('#taRhold'); vhold.classList.remove('empty');
      vhold.textContent = (Math.hypot(hx, hy) < 0.05) ? t('Mitte') : `${f1(Math.abs(hy))} mm ${tdirV(hy)} · ${f1(Math.abs(hx))} mm ${tdirH(hx)}`;
      body.querySelector('#taRholdS').textContent = t('ohne Visierkorrektur halten');
      // Streukreis
      const vgrp = body.querySelector('#taRgrp'); vgrp.classList.remove('empty');
      vgrp.textContent = f1(stats.group) + ' mm';
      body.querySelector('#taRgrpS').textContent = `${stats.valuedCount} ${t('Treffer gewertet')}${stats.outliers.length ? ` · ${stats.outliers.length} ${t('Ausreißer ignoriert')}` : ''}`;
    }

    function recompute() {
      stats = computeStats(H.shots, geom(), H.outlier);
      renderResults(); renderCap(); draw();
    }
    function refresh() { renderCap(); draw(); }
    // Sprache wechseln (von außen aufrufbar)
    TA._refresh = function () { relabel(); if (H.shown) recompute(); else { renderResults(); renderCap(); } };

    // ---- Pointer handling: tap=place, drag=pan, 2=pinch ----
    const ptrs = new Map();
    let pinch = null, dragStart = null, moved = 0, downT = 0;

    function localPt(e) { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.x, y: e.clientY - r.y }; }

    stage.addEventListener('pointerdown', e => {
      // Tippen auf die Zoom-Steuerung (+ / − / Einpassen) darf KEINEN Treffer setzen
      if (e.target.closest && e.target.closest('.ta-zoom')) return;
      stage.setPointerCapture(e.pointerId);
      const p = localPt(e); ptrs.set(e.pointerId, p);
      if (ptrs.size === 1) { dragStart = { x: p.x, y: p.y, panX, panY }; moved = 0; downT = Date.now(); }
      else if (ptrs.size === 2) {
        const arr = [...ptrs.values()];
        pinch = { d0: Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y), zoom0: zoom, panX0: panX, panY0: panY,
          mx: (arr[0].x + arr[1].x) / 2, my: (arr[0].y + arr[1].y) / 2 };
        dragStart = null;
      }
    });
    stage.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId)) return;
      const p = localPt(e); ptrs.set(e.pointerId, p);
      if (pinch && ptrs.size >= 2) {
        const arr = [...ptrs.values()];
        const d = Math.hypot(arr[0].x - arr[1].x, arr[0].y - arr[1].y);
        const mx = (arr[0].x + arr[1].x) / 2, my = (arr[0].y + arr[1].y) / 2;
        let nz = pinch.zoom0 * (d / (pinch.d0 || 1));
        nz = Math.max(0.4, Math.min(3, nz));
        const rect = stage.getBoundingClientRect();
        // keep world point under the pinch midpoint anchored
        const scale0 = fitScale * pinch.zoom0, scale1 = fitScale * nz;
        const wx = (pinch.mx - (rect.width / 2 + pinch.panX0)) / scale0;
        const wy = (pinch.my - (rect.height / 2 + pinch.panY0)) / scale0;
        zoom = nz;
        panX = mx - rect.width / 2 - wx * scale1;
        panY = my - rect.height / 2 - wy * scale1;
        syncZoomUI(); draw();
      } else if (dragStart && ptrs.size === 1) {
        const dx = p.x - dragStart.x, dy = p.y - dragStart.y;
        moved = Math.max(moved, Math.hypot(dx, dy));
        panX = dragStart.panX + dx; panY = dragStart.panY + dy;
        draw();
      }
    });
    function endPtr(e) {
      if (!ptrs.has(e.pointerId)) return;
      const p = ptrs.get(e.pointerId);
      ptrs.delete(e.pointerId);
      if (pinch && ptrs.size < 2) pinch = null;
      if (ptrs.size === 0) {
        const dt = Date.now() - downT;
        if (moved < 6 && dt < 400 && !pinch) {
          // tap → place a hit
          const rect = stage.getBoundingClientRect();
          const scale = fitScale * zoom;
          const wx = (p.x - (rect.width / 2 + panX)) / scale;
          const wy = (p.y - (rect.height / 2 + panY)) / scale;
          H.shots.push({ x: wx, y: wy });
          if (H.shown) recompute(); else refresh();
          A.persist();
        }
        dragStart = null;
      } else if (ptrs.size === 1) {
        const only = [...ptrs.values()][0];
        dragStart = { x: only.x, y: only.y, panX, panY }; moved = 99;
      }
    }
    stage.addEventListener('pointerup', endPtr);
    stage.addEventListener('pointercancel', endPtr);
    stage.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const mx = e.clientX - rect.x, my = e.clientY - rect.y;
      let nz = Math.max(0.4, Math.min(3, zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
      const scale0 = fitScale * zoom, scale1 = fitScale * nz;
      const wx = (mx - (rect.width / 2 + panX)) / scale0;
      const wy = (my - (rect.height / 2 + panY)) / scale0;
      zoom = nz; panX = mx - rect.width / 2 - wx * scale1; panY = my - rect.height / 2 - wy * scale1;
      syncZoomUI(); draw();
    }, { passive: false });

    // ---- zoom UI ----
    const zSlider = body.querySelector('#taZoomSlider'), zVal = body.querySelector('#taZoomV');
    function syncZoomUI() { zSlider.value = Math.round(zoom * 100); zVal.textContent = Math.round(zoom * 100) + ' %'; H.zoom = zoom; }
    function zoomCenter(nz) { nz = Math.max(0.4, Math.min(3, nz)); zoom = nz; syncZoomUI(); draw(); }
    zSlider.addEventListener('input', () => { zoom = (+zSlider.value) / 100; zVal.textContent = Math.round(zoom * 100) + ' %'; H.zoom = zoom; draw(); });
    zSlider.addEventListener('change', () => A.persist());
    body.querySelector('#taZoomIn').addEventListener('click', () => zoomCenter(zoom * 1.25));
    body.querySelector('#taZoomOut').addEventListener('click', () => zoomCenter(zoom / 1.25));
    body.querySelector('#taZoomFit').addEventListener('click', () => { zoom = 1; panX = 0; panY = 0; syncZoomUI(); draw(); A.persist(); });

    // ---- buttons ----
    body.querySelector('#taCalc').addEventListener('click', () => {
      if (!H.shots.length) { A.toast(t('Zuerst Treffer auf der Scheibe einzeichnen.')); return; }
      H.shown = true; recompute(); A.persist();
      A.toast(t('Auswertung berechnet') + ' · ' + H.shots.length + ' ' + t('Treffer') + '.');
    });
    body.querySelector('#taUndo').addEventListener('click', () => {
      if (!H.shots.length) { A.toast(t('Keine Treffer vorhanden.')); return; }
      H.shots.pop();
      if (H.shown) recompute(); else refresh();
      A.persist();
    });
    body.querySelector('#taReset').addEventListener('click', () => {
      if (!H.shots.length) { A.toast(t('Bereits leer.')); return; }
      A.confirm({
        title: t('Zurücksetzen?'), message: t('Alle eingezeichneten Treffer werden entfernt.'),
        okLabel: t('Zurücksetzen'), danger: true,
        onConfirm: () => { H.shots = []; H.shown = false; stats = null; renderResults(); refresh(); A.persist(); A.toast(t('Scheibe zurückgesetzt.')); }
      });
    });
    body.querySelector('#taPdf').addEventListener('click', () => exportPdf());

    // ---- settings inputs ----
    const wEl = body.querySelector('#taWeapon'), aEl = body.querySelector('#taAmmo'), cEl = body.querySelector('#taCaliber');
    [['#taWeapon', 'weapon'], ['#taAmmo', 'ammo'], ['#taCaliber', 'caliber']].forEach(([sel, key]) => {
      body.querySelector(sel).addEventListener('input', e => { H.meta[key] = e.target.value; A.persist(); });
    });
    const tenEl = body.querySelector('#taTen'), ringEl = body.querySelector('#taRing'), discEl = body.querySelector('#taDisc'), klickEl = body.querySelector('#taKlick');
    let discManual = false;
    function autoDisc() {
      if (discManual) return;
      const ten = parseFloat(tenEl.value) || 50, ring = parseFloat(ringEl.value) || 25;
      const d = ten + 18 * ring;
      discEl.value = Math.round(d); H.geom.discMm = d;
    }
    function commitGeom() {
      H.geom.tenMm = parseFloat(tenEl.value) || 50;
      H.geom.ringMm = parseFloat(ringEl.value) || 25;
      H.geom.discMm = parseFloat(discEl.value) || (H.geom.tenMm + 18 * H.geom.ringMm);
      H.geom.klickMm = parseFloat(klickEl.value) || 20;
      if (H.shown) recompute(); else refresh();
      A.persist();
    }
    tenEl.addEventListener('input', () => { autoDisc(); commitGeom(); });
    ringEl.addEventListener('input', () => { autoDisc(); commitGeom(); });
    discEl.addEventListener('input', () => { discManual = true; commitGeom(); });
    klickEl.addEventListener('input', commitGeom);
    const outSlider = body.querySelector('#taOutSlider'), outV = body.querySelector('#taOutV');
    outSlider.addEventListener('input', () => { H.outlier = +outSlider.value; outV.textContent = f1(H.outlier); if (H.shown) recompute(); });
    outSlider.addEventListener('change', () => A.persist());

    // ---- resize ----
    const ro = new ResizeObserver(() => draw());
    ro.observe(stage);
    s._onOpen = () => { relabel(); syncZoomUI(); if (H.shown) recompute(); else { renderResults(); refresh(); } setTimeout(draw, 60); setTimeout(draw, 220); };

    // initial
    relabel();
    syncZoomUI();
    requestAnimationFrame(() => { if (H.shown) recompute(); else { renderResults(); refresh(); } });
    setTimeout(draw, 80);

    // ============ PDF EXPORT (S/W, ein Blatt) ============
    function exportPdf() {
      const g = geom();
      const m = H.meta;
      const st = H.shown && stats ? stats : computeStats(H.shots, g, H.outlier);
      const discR = g.discMm / 2, tenR = g.tenMm / 2;
      const nRings = Math.max(1, Math.round((discR - tenR) / g.ringMm) + 1);
      const pad = g.ringMm * 0.6;
      const vb = discR + pad;
      const cx = 0, cy = 0;
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-vb} ${-vb} ${vb * 2} ${vb * 2}" width="150mm">`;
      svg += `<rect x="${-vb}" y="${-vb}" width="${vb * 2}" height="${vb * 2}" fill="#fff"/>`;
      const sw = discR * 0.004;
      for (let k = nRings - 1; k >= 0; k--) {
        const rr = tenR + k * g.ringMm;
        svg += `<circle cx="0" cy="0" r="${rr}" fill="none" stroke="#000" stroke-width="${k === 0 ? sw * 1.7 : sw}"/>`;
      }
      // ring numbers
      const fs = g.ringMm * 0.5;
      for (let k = 0; k < nRings; k++) {
        const val = 10 - k; if (val < 1) break;
        const rr = tenR + (k - 0.5) * g.ringMm; if (rr <= 0) continue;
        svg += `<text x="0" y="${rr}" font-family="Arial" font-size="${fs}" fill="#000" text-anchor="middle" dominant-baseline="middle">${val}</text>`;
      }
      // center cross
      const cc = g.ringMm * 0.5;
      svg += `<line x1="${-cc}" y1="0" x2="${cc}" y2="0" stroke="#000" stroke-width="${sw}"/><line x1="0" y1="${-cc}" x2="0" y2="${cc}" stroke="#000" stroke-width="${sw}"/>`;
      const dotR = discR * 0.018;
      // group circle
      if (st && st.group > 0) {
        svg += `<circle cx="${st.mx}" cy="${st.my}" r="${st.group / 2}" fill="none" stroke="#000" stroke-width="${sw * 1.2}" stroke-dasharray="${g.ringMm * 0.3} ${g.ringMm * 0.25}"/>`;
      }
      // shots
      H.shots.forEach((sh, i) => {
        const isOut = st && st.outliers.indexOf(i) >= 0;
        if (isOut) {
          svg += `<circle cx="${sh.x}" cy="${sh.y}" r="${dotR}" fill="none" stroke="#000" stroke-width="${sw * 1.3}"/>`;
          const q = dotR * 0.7;
          svg += `<line x1="${sh.x - q}" y1="${sh.y - q}" x2="${sh.x + q}" y2="${sh.y + q}" stroke="#000" stroke-width="${sw}"/><line x1="${sh.x + q}" y1="${sh.y - q}" x2="${sh.x - q}" y2="${sh.y + q}" stroke="#000" stroke-width="${sw}"/>`;
        } else {
          svg += `<circle cx="${sh.x}" cy="${sh.y}" r="${dotR}" fill="#000"/>`;
        }
      });
      // hold (open square) + MPI (filled diamond)
      if (st) {
        const hs = dotR * 1.3;
        svg += `<rect x="${-st.mx - hs}" y="${-st.my - hs}" width="${hs * 2}" height="${hs * 2}" fill="none" stroke="#000" stroke-width="${sw * 1.4}"/>`;
        const ms = dotR * 1.4;
        svg += `<path d="M ${st.mx} ${st.my - ms} L ${st.mx + ms} ${st.my} L ${st.mx} ${st.my + ms} L ${st.mx - ms} ${st.my} Z" fill="#fff" stroke="#000" stroke-width="${sw * 1.4}"/><circle cx="${st.mx}" cy="${st.my}" r="${dotR * 0.35}" fill="#000"/>`;
      }
      svg += `</svg>`;

      // results text
      let resRows = '';
      if (st) {
        const dist = Math.hypot(st.mx, st.my);
        const klick = g.klickMm;
        const hC = Math.round(Math.abs(st.mx) / klick), vC = Math.round(Math.abs(st.my) / klick);
        const corr = [];
        if (vC > 0) corr.push(`${st.my > 0 ? t('hoch') : t('runter')} ${vC}`);
        if (hC > 0) corr.push(`${st.mx > 0 ? t('links') : t('rechts')} ${hC}`);
        resRows = `
          <tr><td class="l">${t('Mittlerer Treffpunkt')}</td><td>${f1(dist)} mm — X ${f1(Math.abs(st.mx))} ${tdirH(st.mx)} · Y ${f1(Math.abs(st.my))} ${tdirV(st.my)} · ${t('Ring')} ${f1(scoreDecimal(dist, g))}</td></tr>
          <tr><td class="l">${t('Visierkorrektur')}</td><td>${corr.length ? corr.join(' · ') + ' ' + t('Klick') : t('zentriert')} (${t('Klickwert')} ${f1(klick)} mm)</td></tr>
          <tr><td class="l">${t('Haltepunkt')}</td><td>${Math.hypot(st.mx, st.my) < 0.05 ? t('Mitte') : `${f1(Math.abs(st.my))} mm ${tdirV(-st.my)} · ${f1(Math.abs(st.mx))} mm ${tdirH(-st.mx)}`} (${t('ohne Korrektur')})</td></tr>
          <tr><td class="l">${t('Streukreis (Ø)')}</td><td>${f1(st.group)} mm · ${st.valuedCount} ${t('gewertet')}${st.outliers.length ? ` · ${st.outliers.length} ${t('Ausreißer')}` : ''}</td></tr>`;
      } else {
        resRows = `<tr><td class="l">${t('Auswertung')}</td><td>${t('Keine Treffer eingezeichnet.')}</td></tr>`;
      }
      const today = new Date().toLocaleDateString(L() === 'en' ? 'en-GB' : 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const doc = `<!DOCTYPE html><html lang="${L() === 'en' ? 'en' : 'de'}"><head><meta charset="UTF-8"><title>${t('Trefferauswertung')}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          @page{size:A4 portrait;margin:12mm;}
          html,body{background:#fff;color:#000;font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;line-height:1.4;}
          /* Bildschirm-Werkzeugleiste — wird beim Drucken/PDF ausgeblendet */
          .toolbar{position:sticky;top:0;left:0;right:0;z-index:10;display:flex;gap:10px;align-items:center;justify-content:flex-start;padding:10px 12px;margin:0 0 14px;background:#14110B;border-bottom:2px solid #000;}
          .toolbar .tb-spacer{flex:1;}
          .toolbar button{font-family:Arial,Helvetica,sans-serif;font-size:11pt;font-weight:bold;letter-spacing:.4px;text-transform:uppercase;padding:11px 18px;border:0;border-radius:4px;cursor:pointer;min-height:44px;}
          .toolbar .tb-print{background:#B26A3E;color:#fff;}
          .toolbar .tb-print:active{background:#8a4f2c;}
          .toolbar .tb-back,.toolbar .tb-close{background:transparent;color:#EFE8D6;border:1px solid #6b6052;}
          .toolbar .tb-back:active,.toolbar .tb-close:active{background:#2a2419;}
          @media print{ .toolbar{display:none !important;} }
          h1{font-size:17pt;letter-spacing:.5px;text-transform:uppercase;border-bottom:2px solid #000;padding-bottom:6px;}
          .sub{font-size:9pt;margin:4px 0 12px;}
          .wrap{display:flex;gap:14mm;align-items:flex-start;}
          .target{flex:0 0 92mm;}
          .target svg{width:92mm;height:auto;border:1px solid #000;}
          .side{flex:1;}
          table{width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:10px;}
          td{border:1px solid #000;padding:5px 8px;vertical-align:top;}
          td.l{font-weight:bold;width:42%;background:#eee;text-transform:uppercase;font-size:8pt;letter-spacing:.3px;}
          .legend{font-size:8pt;margin-top:8px;line-height:1.6;}
          .foot{margin-top:14px;font-size:8pt;border-top:1px solid #000;padding-top:6px;display:flex;justify-content:space-between;}
        </style></head><body>
        <div class="toolbar">
          <button type="button" class="tb-back" onclick="window.close()">${t('← Zurück')}</button>
          <span class="tb-spacer"></span>
          <button type="button" class="tb-close" onclick="window.close()">${t('Schließen')}</button>
          <button type="button" class="tb-print" onclick="window.print()">${t('Drucken / PDF')}</button>
        </div>
        <h1>${t('Trefferauswertung')}</h1>
        <div class="sub">${[m.weapon, m.ammo, m.caliber].filter(Boolean).join(' · ') || 'KR Ballistikrechner 3.0'} · ${today}</div>
        <div class="wrap">
          <div class="target">${svg}</div>
          <div class="side">
            <table>
              <tr><td class="l">${t('Waffe')}</td><td>${m.weapon || '—'}</td></tr>
              <tr><td class="l">${t('Munition')}</td><td>${m.ammo || '—'}</td></tr>
              <tr><td class="l">${t('Kaliber')}</td><td>${m.caliber || '—'}</td></tr>
              <tr><td class="l">${t('10er-Ø')} / ${t('Ringabstand')}</td><td>${f1(g.tenMm)} mm / ${f1(g.ringMm)} mm</td></tr>
              <tr><td class="l">${t('Scheiben-Ø')} / ${t('Klickwert')}</td><td>${f1(g.discMm)} mm / ${f1(g.klickMm)} mm</td></tr>
              <tr><td class="l">${t('Treffer gesamt')}</td><td>${H.shots.length}</td></tr>
            </table>
            <table>${resRows}</table>
            <div class="legend">● ${t('Treffer')} · ◆ ${t('Mittlerer Treffpunkt')} · □ ${t('Haltepunkt')} · ○✕ ${t('Ausreißer')} · ┄ ${t('Streukreis')}</div>
          </div>
        </div>
        <div class="foot"><span>KR · Ballistikrechner 3.0 — ${t('Trefferauswertung')}</span><span>${t('Ausreißer-Empfindlichkeit')} ${f1(H.outlier)}</span></div>
        </body></html>`;
      const w = window.open('', '_blank');
      if (!w) { A.toast(t('Bitte Pop-ups erlauben, um die PDF zu erzeugen.')); return; }
      w.document.open(); w.document.write(doc); w.document.close(); w.focus();
    }
  };
})(window);
