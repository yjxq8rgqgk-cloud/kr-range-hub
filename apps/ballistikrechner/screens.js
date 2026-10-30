/* ============================================================
   Ballistikrechner 3.0 — Screens (Overlays)
   Geschoss/Gewehr · Wetter · Profile · Tabelle · Grafiken ·
   Wind-Segment-Profil · Settings. Alles live an die Engine.
   ============================================================ */
(function () {
  'use strict';
  const A = window.App, B = window.Ballistics;
  const host = () => document.querySelector('.screen');

  function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  function screen(id, title, bodyHTML, footHTML) {
    const s = el(`<div class="scrn" id="scrn-${id}">
      <div class="scrn-head"><div class="back" aria-label="Zurück">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </div><h2>${title}</h2><div class="spacer"></div><img class="scrn-mark" src="assets/kr-mark-line.png" alt=""></div>
      <div class="scrn-body">${bodyHTML}</div>
      ${footHTML ? `<div class="scrn-foot">${footHTML}</div>` : ''}</div>`);
    s.querySelector('.back').addEventListener('click', () => A.closeScreen());
    host().appendChild(s);
    return s;
  }
  const field = (label, id, val, hint, type, info) =>
    `<div class="field"><label>${label}${info ? ` <span class="ib" data-info="${info}">i</span>` : ''}</label><input type="${type || 'number'}" id="${id}" value="${val}" inputmode="${type === 'text' ? 'text' : 'decimal'}">${hint ? `<div class="hint2">${hint}</div>` : ''}</div>`;
  const seg = (id, opts, cur) =>
    `<div class="seg" data-seg="${id}">${opts.map(o => `<button data-v="${o.v}" class="${String(o.v) === String(cur) ? 'on' : ''}">${o.label}</button>`).join('')}</div>`;
  const segVal = (root, id) => { const b = root.querySelector(`.seg[data-seg="${id}"] button.on`); return b ? b.dataset.v : null; };
  const numv = (root, id) => parseFloat(root.querySelector('#' + id).value);

  // Geschoss-Silhouette je ballistischem Profil (Seitenprofil, Spitze rechts)
  function bulletShape(model) {
    const shapes = {
      G7: { path: 'M40,32 L56,25 L130,25 Q186,26 212,45 Q186,64 130,65 L56,65 L40,58 Z', name: 'G7 · Boattail-Spitz', desc: 'Schlankes Boattail-Spitzgeschoss mit langer Ogive — moderne Langstrecken-/Match-Geschosse.' },
      G1: { path: 'M44,25 L138,25 Q184,27 200,40 L200,50 Q184,63 138,65 L44,65 Z', name: 'G1 · Flachbasis', desc: 'Flachbasis mit kürzerer, stumpferer Ogive — klassische Vollmantel-/Jagdgeschosse.' },
      GA: { path: 'M44,25 L140,25 A20,20 0 0 1 140,65 L44,65 Z', name: 'GA · Rundkopf', desc: 'Rundkopf auf Flachbasis — kurze, schwere Geschosse.' },
      RA4: { path: 'M36,34 L58,25 L120,25 Q190,25 218,45 Q190,65 120,65 L58,65 L36,56 Z', name: 'RA4 · VLD-Boattail', desc: 'Sehr schlankes Low-Drag-Boattail mit extra langer Ogive — Ultra-Langstrecke.' }
    };
    return shapes[model] || shapes.G7;
  }

  // ---------------- GESCHOSS & GEWEHR ----------------
  function buildGun() {
    const b = B.config.bullet, r = B.config.rifle;
    const body = `
      <button class="kbtn" id="openAmmoDb" style="width:100%;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:9px;">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/></svg>
        Munitionsdatenbank
      </button>
      <div class="sect-t" style="margin-top:0">Gespeicherte Munition <span class="ib" data-info="Antippen lädt die Werte ins Formular. Über „Speichern“ legst du die aktuelle Eingabe als neue Munition an. Mit dem ✕ löschst du eigene Einträge.">i</span></div>
      <div class="ammo-lib" id="ammoLib"></div>
      <div class="sect-t">Geschoss <span class="ib" data-info="Ballistisches Profil + BC bestimmen den Luftwiderstand. G7 passt zu modernen Langgeschossen, G1 zu Flachbasis.">i</span></div>
      <label style="font-family:var(--font-cond);font-weight:600;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--copper-bright);display:block;margin-bottom:6px;">Ballistisches Profil <span class="ib" data-info="Die Drag-Kurve, zu der dein BC gehört (G1/G7/GA/RA4). Steht beim BC-Wert auf Packung/Datenblatt. Faustregel: G7 für lange Boattail-Match-Geschosse, G1 für klassische Flachbasis.">i</span></label>
      ${seg('model', [{ v: 'G1', label: 'G1' }, { v: 'G7', label: 'G7' }, { v: 'GA', label: 'GA' }, { v: 'RA4', label: 'RA4' }], b.model)}
      <div class="bullet-vis">
        <svg viewBox="0 0 240 90" preserveAspectRatio="xMidYMid meet">
          <defs><linearGradient id="bvGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#E3C4AB"/><stop offset="0.5" stop-color="#C9824E"/><stop offset="1" stop-color="#8C4F2C"/></linearGradient></defs>
          <path id="bulletPath" d="" fill="url(#bvGrad)" stroke="#EFE8D6" stroke-width="1" stroke-opacity="0.45"/>
        </svg>
        <div class="bv-cap"><div class="bv-name" id="bvName"></div><div class="bv-desc" id="bvDesc"></div></div>
      </div>
      <div style="height:14px"></div>
      <div class="field2">${field('Hersteller', 'g_mfr', b.mfr, '', 'text', 'Geschoss-Hersteller (steht auf der Packung). Nur zur Benennung — ohne Einfluss auf die Berechnung.')}${field('Name', 'g_name', b.name, '', 'text', 'Modellbezeichnung, z. B. FMJ, SMK, ELD-M. Steht auf Packung/Datenblatt. Nur Benennung.')}</div>
      <div class="field2">${field('Ballist. Koeffizient', 'g_bc', b.bc, '', '', 'Ballistischer Koeffizient: Maß für den Luftwiderstand. Auf der Packung oder im Hersteller-Datenblatt — passend zum gewählten Profil (G1/G7). Höher = flacher.')}${field('Gewicht (gr)', 'g_wt', b.weightGr, '', '', 'Geschossgewicht in Grain (gr). Steht auf der Packung, z. B. 148 gr.')}</div>
      <div class="field2">${field('Kaliber (mm)', 'g_cal', b.caliberMm, '', '', 'Geschossdurchmesser in mm (.308 = 7.62 mm). Aus der Kaliberangabe/Datenblatt.')}${field('Länge (mm)', 'g_len', b.lengthMm, '', '', 'Geschosslänge in mm. Aus dem Hersteller-Datenblatt oder selbst mit Messschieber. Wirkt NUR auf die Drallstabilität (SG) und damit die Spindrift (seitliche Drift durch den Drall) — Abfall, Tempo, Energie und Flugzeit kommen allein aus dem BC. Länge unbekannt? Trage 0 ein: dann rechnet die App mit einem neutralen Standard-Stabilitätsfaktor SG ≈ 1.1.')}</div>
      <div class="sect-t">Gewehr</div>
      <div class="field2">${field('Mündung (<span id="lbl_mv">fps</span>)', 'r_mv', Units.disp('speed', r.mvFps), '', '', 'Mündungsgeschwindigkeit. Am genauesten selbst mit Chronograph/Doppler messen; alternativ Patronen-Datenblatt (gilt für eine bestimmte Lauflänge und Temperatur).')}${field('Visierhöhe (<span id="lbl_sh">cm</span>)', 'r_sh', Units.disp('sight', r.sightHeightCm), '', '', 'Abstand Mitte Zielfernrohr zur Laufmitte. Messen: Okular-Mittelpunkt minus halber Laufdurchmesser — oder Angabe der Montage.')}</div>
      ${field('Zero (<span id="lbl_zero">m</span>)', 'r_zero', Units.disp('range', r.zeroM), '', '', 'Distanz, auf die du eingeschossen hast (Haltepunkt = Treffpunkt), z. B. 100 m.')}
      <label style="font-family:var(--font-cond);font-weight:600;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--copper-bright);display:block;margin:6px 0;">Drall <span class="ib" data-info="Drehrichtung der Züge — meistens rechts. Steht beim Lauf-/Waffenhersteller; sonst per Putzstock-Test bestimmbar. Bestimmt die Richtung der Spindrift.">i</span></label>
      ${seg('twist', [{ v: 'smooth', label: 'Glatt' }, { v: 'left', label: 'Links' }, { v: 'right', label: 'Rechts' }], r.twist)}
      <div style="height:14px"></div>
      ${field('Drall-Rate (1:X Zoll)', 'r_tw', r.twistRate, '', '', 'Dralllänge 1:X — eine Umdrehung pro X Zoll (z. B. 1:11). Steht beim Lauf-/Waffenhersteller. Wirkt auf die Spindrift.')}`;
    const s = screen('gun', 'Geschoss & Gewehr', body,
      `<button class="kbtn ghost" data-act="cancel">Abbrechen</button><button class="kbtn ghost" data-act="save">Speichern</button><button class="kbtn" data-act="apply">Übernehmen</button>`);

    // ---- Formular ↔ Munitions-Objekt ----
    function readForm() {
      return {
        model: segVal(s, 'model'), mfr: s.querySelector('#g_mfr').value, name: s.querySelector('#g_name').value,
        bc: numv(s, 'g_bc'), weightGr: numv(s, 'g_wt'), caliberMm: numv(s, 'g_cal'), lengthMm: numv(s, 'g_len'),
        mv: Units.toBase('speed', numv(s, 'r_mv')), tw: numv(s, 'r_tw')
      };
    }
    function fillForm(a) {
      s.querySelector('#g_mfr').value = a.mfr; s.querySelector('#g_name').value = a.name;
      s.querySelector('#g_bc').value = a.bc; s.querySelector('#g_wt').value = a.weightGr;
      s.querySelector('#g_cal').value = a.caliberMm; s.querySelector('#g_len').value = a.lengthMm;
      if (a.mv != null) s.querySelector('#r_mv').value = Units.disp('speed', a.mv);
      if (a.tw != null) s.querySelector('#r_tw').value = a.tw;
      s.querySelectorAll(`.seg[data-seg="model"] button`).forEach(x => x.classList.toggle('on', x.dataset.v === a.model));
      setBulletVis(a.model);
    }
    function ammoLabel(a) {
      const cal = a.caliberMm ? a.caliberMm + 'mm' : '';
      const prim = `<span class="ac-prim"><b class="ac-name">${[a.mfr, a.name].filter(Boolean).join(' ')}</b>${cal ? `<span class="ac-cal">${cal}</span>` : ''}</span>`;
      const sub = [a.weightGr ? a.weightGr + 'gr' : '', a.model ? a.model + ' ' + a.bc : ''].filter(Boolean).join(' · ');
      return `${prim}${sub ? `<span class="ac-sub">${sub}</span>` : ''}`;
    }
    function ammoShort(a) {
      const cal = a.caliberMm ? a.caliberMm + 'mm' : '';
      return [a.name || 'Munition', cal].filter(Boolean).join(' · ');
    }
    function renderLib() {
      const lib = A.state.ammoLib || [];
      const wrap = s.querySelector('#ammoLib');
      if (!lib.length) { wrap.innerHTML = '<div class="hint2" style="font-size:12px">Noch keine Munition gespeichert — unten „Speichern“.</div>'; return; }
      const cb = B.config.bullet;
      const isActive = a => a.model === cb.model && (a.mfr || '') === (cb.mfr || '') && (a.name || '') === (cb.name || '')
        && +a.bc === +cb.bc && +a.weightGr === +cb.weightGr && +a.caliberMm === +cb.caliberMm;
      wrap.innerHTML = lib.map(a => `<div class="ammo-chip${isActive(a) ? ' active' : ''}" data-load="${a.id}">
        <span class="ac-t">${ammoLabel(a)}</span>
        ${isActive(a) ? '<span class="pill-tag">aktiv</span>' : ''}
        <button class="ac-del" data-del="${a.id}" title="Löschen" aria-label="Löschen">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button></div>`).join('');
      wrap.querySelectorAll('[data-load]').forEach(chip => chip.addEventListener('click', e => {
        if (e.target.closest('[data-del]')) return;
        const a = (A.state.ammoLib || []).find(x => x.id === chip.dataset.load);
        if (a) { fillForm(a); A.toast('Geladen — „Übernehmen“ zum Rechnen.'); }
      }));
      wrap.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.del;
        const a = (A.state.ammoLib || []).find(x => x.id === id);
        A.confirm({
          title: 'Munition löschen',
          message: 'Munition „' + (a ? ammoShort(a) : '') + '“ wirklich löschen? Das kann nicht rückgängig gemacht werden.',
          onConfirm: () => {
            A.state.ammoLib = (A.state.ammoLib || []).filter(x => x.id !== id);
            A.persist(); renderLib(); A.toast('Munition gelöscht.');
          }
        });
      }));
    }
    // ---- Munitionsdatenbank (externe DB → Formular) ----
    (function () {
      const DB = window.KR_AMMO_DB || [];
      // Kaliberbezeichnung → Geschossdurchmesser (mm)
      function caliberToMm(c) {
        if (!c) return 0;
        const k = c.toLowerCase().trim();
        const map = {
          '.22 short': 5.7, '.22 lr': 5.7, '.22 hornet': 5.7, '.222 rem.': 5.7, '.223 rem.': 5.7, '.22-250 rem.': 5.7,
          '.243 win.': 6.2, '6 mm creedmoor': 6.2, '6,5 creedmoor': 6.7,
          '.270 win.': 7.0, '.280 rem.': 7.2, '7 mm rem. mag.': 7.2,
          '.30 carbine': 7.62, '.30-30 win.': 7.62, '.308 win.': 7.62, '.30-06 spr.': 7.62, '.300 win. mag.': 7.62, '.30 r blaser': 7.62,
          '.303 british': 7.7, '.375 h&h mag.': 9.5, '.45 auto / .45 acp': 11.5, '.45-70 govt.': 11.6
        };
        if (map[k] != null) return map[k];
        let m = k.match(/^(\d+(?:[.,]\d+)?)\s*(?:x|mm|\u00d7)/);
        if (m) return parseFloat(m[1].replace(',', '.'));
        m = k.match(/(\d+(?:[.,]\d+)?)/);
        if (m) { const v = parseFloat(m[1].replace(',', '.')); if (v > 0.2 && v < 20) return v; }
        return 0;
      }
      // DB-Eintrag → fillForm-Objekt (alle für die App relevanten Werte)
      function dbToAmmo(o) {
        const model = o.g7 != null ? 'G7' : 'G1';
        const bc = o.g7 != null ? o.g7 : (o.g1 != null ? o.g1 : '');
        return {
          model, mfr: o.m, name: o.a, bc,
          weightGr: o.gr != null ? o.gr : '',
          caliberMm: caliberToMm(o.c) || '',
          lengthMm: o.l != null ? o.l : 0,
          mv: o.v != null ? Math.round(o.v * 3.28084) : null
        };
      }
      const esc = str => String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const modal = document.createElement('div');
      modal.className = 'adb-scrim'; modal.id = 'adbModal';
      modal.innerHTML = `<div class="adb-panel" role="dialog" aria-modal="true" aria-label="Munitionsdatenbank">
        <div class="adb-head"><h3>Munitionsdatenbank</h3><button type="button" class="adb-x" data-adb="cancel" aria-label="Schließen">✕</button></div>
        <div class="adb-body">
          <div class="adb-fld"><label>Hersteller</label><div class="adb-sel"><select id="adbMfr"></select></div></div>
          <div class="adb-fld"><label>Kaliber</label><div class="adb-sel"><select id="adbCal"></select></div></div>
          <div class="adb-fld"><label>Munition</label><div class="adb-sel"><select id="adbLoad"></select></div></div>
          <div id="adbPrev"></div>
        </div>
        <div class="adb-foot"><button type="button" class="kbtn ghost" data-adb="cancel">Abbrechen</button><button type="button" class="kbtn" data-adb="apply">Übernehmen</button></div>
      </div>`;
      (document.querySelector('.screen') || document.body).appendChild(modal);
      const selMfr = modal.querySelector('#adbMfr'), selCal = modal.querySelector('#adbCal'),
            selLoad = modal.querySelector('#adbLoad'), prev = modal.querySelector('#adbPrev');
      const opt = (v, l) => `<option value="${esc(v)}">${esc(l)}</option>`;
      const mfrs = [...new Set(DB.map(o => o.m))].sort((a, b) => a.localeCompare(b, 'de'));
      const calsFor = m => [...new Set(DB.filter(o => o.m === m).map(o => o.c))].sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
      const loadsFor = (m, c) => DB.map((o, i) => ({ o, i })).filter(x => x.o.m === m && x.o.c === c);
      const loadLabel = o => { const bc = o.g7 != null ? ('G7 ' + o.g7) : (o.g1 != null ? ('G1 ' + o.g1) : 'BC fehlt'); return [o.a, (o.gr != null ? o.gr + ' gr' : ''), bc].filter(Boolean).join(' · '); };
      function fillMfr() { selMfr.innerHTML = mfrs.map(m => opt(m, m)).join(''); }
      function fillCal() { selCal.innerHTML = calsFor(selMfr.value).map(c => opt(c, c)).join(''); }
      function fillLoad() { selLoad.innerHTML = loadsFor(selMfr.value, selCal.value).map(x => opt(x.i, loadLabel(x.o))).join(''); }
      function renderPrev() {
        const o = DB[+selLoad.value];
        if (!o) { prev.innerHTML = '<div class="adb-empty">Keine Auswahl.</div>'; return; }
        const a = dbToAmmo(o);
        const rows = [
          ['Profil / BC', o.g7 != null ? ('G7 · ' + o.g7) : (o.g1 != null ? ('G1 · ' + o.g1) : '—')],
          ['Gewicht', (o.gr != null ? o.gr + ' gr' : '—') + (o.g != null ? ' · ' + o.g + ' g' : '')],
          ['Kaliber', esc(o.c) + (a.caliberMm ? (' · ' + a.caliberMm + ' mm') : '')],
          ['V₀', o.v != null ? (o.v + ' m/s · ' + a.mv + ' fps') : '—'],
          ['Länge', o.l != null ? (o.l + ' mm') : '—']
        ];
        const warn = (o.g1 == null && o.g7 == null)
          ? '<div class="pv-warn">⚠ Kein BC in der Datenbank — bitte nach dem Übernehmen den ballistischen Koeffizienten ergänzen.</div>' : '';
        prev.innerHTML = `<div class="adb-prev"><div class="pv-name">${esc(o.n)}</div>
          <div class="pv-grid">${rows.map(r => `<span class="k">${r[0]}</span><span class="v">${r[1]}</span>`).join('')}</div>
          ${o.p ? `<div class="pv-note">${esc(o.p)}</div>` : ''}${warn}</div>`;
      }
      selMfr.addEventListener('change', () => { fillCal(); fillLoad(); renderPrev(); });
      selCal.addEventListener('change', () => { fillLoad(); renderPrev(); });
      selLoad.addEventListener('change', renderPrev);
      function openModal() { if (!DB.length) { A.toast('Munitionsdatenbank nicht geladen.'); return; } fillMfr(); fillCal(); fillLoad(); renderPrev(); modal.classList.add('on'); }
      function closeModal() { modal.classList.remove('on'); }
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
      modal.querySelectorAll('[data-adb="cancel"]').forEach(b => b.addEventListener('click', closeModal));
      modal.querySelector('[data-adb="apply"]').addEventListener('click', () => {
        const o = DB[+selLoad.value];
        if (!o) { A.toast('Bitte eine Munition wählen.'); return; }
        fillForm(dbToAmmo(o)); closeModal();
        A.toast('Aus Datenbank geladen — „Übernehmen“ zum Rechnen.');
      });
      s.querySelector('#openAmmoDb').addEventListener('click', openModal);
    })();

    s.querySelector('[data-act="cancel"]').addEventListener('click', () => A.closeScreen('gun'));
    s.querySelector('[data-act="save"]').addEventListener('click', () => {
      const a = readForm();
      if (!a.name) { A.toast('Bitte zuerst einen Namen vergeben.'); s.querySelector('#g_name').focus(); return; }
      a.id = 'a' + Date.now();
      A.state.ammoLib = A.state.ammoLib || [];
      A.state.ammoLib.push(a); A.persist(); renderLib();
      A.toast('Munition „' + ammoShort(a) + '“ gespeichert.');
    });
    s.querySelector('[data-act="apply"]').addEventListener('click', () => {
      B.setBullet({ model: segVal(s, 'model'), mfr: s.querySelector('#g_mfr').value, name: s.querySelector('#g_name').value,
        bc: numv(s, 'g_bc'), weightGr: numv(s, 'g_wt'), caliberMm: numv(s, 'g_cal'), lengthMm: numv(s, 'g_len') });
      B.setRifle({ mvFps: Units.toBase('speed', numv(s, 'r_mv')), sightHeightCm: Units.toBase('sight', numv(s, 'r_sh')), zeroM: Units.toBase('range', numv(s, 'r_zero')),
        twist: segVal(s, 'twist'), twistRate: numv(s, 'r_tw') });
      B.config.id = (segVal(s, 'model')) + ' ' + s.querySelector('#g_name').value;
      // Aktives Profil mit dem neuen Setup synchronisieren (Name + Snapshot)
      const ap = A.state.profiles.find(p => p.id === A.state.activeProfile);
      if (ap) {
        const nm = (s.querySelector('#g_name').value || '').trim();
        if (!ap.name || ap.name === 'Neues Profil') ap.name = nm || B.config.id;
        ap.snap = { id: B.config.id, bullet: Object.assign({}, B.config.bullet), rifle: Object.assign({}, B.config.rifle),
          weatherCurrent: Object.assign({}, B.config.weatherCurrent), weatherZero: Object.assign({}, B.config.weatherZero) };
      }
      A.persist(); A.render(); A.closeScreen('gun'); A.toast('Profil aktualisiert · neu gerechnet.');
    });
    function setBulletVis(model) {
      const sh = bulletShape(model);
      s.querySelector('#bulletPath').setAttribute('d', sh.path);
      s.querySelector('#bvName').textContent = sh.name;
      s.querySelector('#bvDesc').textContent = sh.desc;
    }
    s.querySelector('.seg[data-seg="model"]').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setBulletVis(b.dataset.v); });
    s._onOpen = () => {
      const bb = B.config.bullet, rr = B.config.rifle;
      const blank = v => (v > 0 ? v : '');   // leeres Feld statt „0" bei neuem Profil
      s.querySelector('#g_mfr').value = bb.mfr; s.querySelector('#g_name').value = bb.name;
      s.querySelector('#g_bc').value = blank(bb.bc); s.querySelector('#g_wt').value = blank(bb.weightGr);
      s.querySelector('#g_cal').value = blank(bb.caliberMm); s.querySelector('#g_len').value = blank(bb.lengthMm);
      s.querySelector('#r_mv').value = rr.mvFps > 0 ? Units.disp('speed', rr.mvFps) : ''; s.querySelector('#r_sh').value = rr.sightHeightCm > 0 ? Units.disp('sight', rr.sightHeightCm) : '';
      s.querySelector('#r_zero').value = Units.disp('range', rr.zeroM); s.querySelector('#r_tw').value = blank(rr.twistRate);
      s.querySelector('#lbl_mv').textContent = Units.lbl('speed');
      s.querySelector('#lbl_sh').textContent = Units.lbl('sight');
      s.querySelector('#lbl_zero').textContent = Units.lbl('range');
      s.querySelectorAll(`.seg[data-seg="model"] button`).forEach(x => x.classList.toggle('on', x.dataset.v === bb.model));
      s.querySelectorAll(`.seg[data-seg="twist"] button`).forEach(x => x.classList.toggle('on', x.dataset.v === rr.twist));
      setBulletVis(bb.model);
      renderLib();
    };
  }

  // ---------------- WETTER ----------------
  function buildWx() {
    const c = B.config.weatherCurrent, z = B.config.weatherZero;
    const body = `
      <div class="sect-t">Aktuelles Wetter <span class="ib" data-info="Bedingungen am Schussort jetzt. Höhere Temperatur/Feuchte = dünnere Luft = weniger Abfall.">i</span></div>
      <div class="field2">${field('Temperatur (<span id="lbl_ct">°C</span>)', 'c_t', Units.disp('temp', c.tC), '', '', 'Lufttemperatur jetzt am Schussort. Thermometer / Kestrel / Wetter-App. Kälter = dichtere Luft = mehr Abfall.')}${field('Druck (<span id="lbl_cp">hPa</span>)', 'c_p', Units.disp('pres', c.pHpa), '', '', 'Absoluter Stationsluftdruck — NICHT auf Meereshöhe umgerechnet. Kestrel / Barometer. In der Höhe niedriger.')}</div>
      ${field('Luftfeuchte (%)', 'c_h', c.rh, '', '', 'Relative Luftfeuchte in %. Geringer Einfluss. Kestrel / Wetter-App.')}
      <div class="quick"><button data-copy="z2c">↧ Von Zeroing kopieren</button><button data-act="geoload" style="border-color:var(--copper);color:var(--copper-bright)">⌖ Vom Standort laden</button></div>
      <div class="sect-t">Zeroing-Wetter <span class="ib" data-info="Bedingungen beim Einschießen. Legt den Zero-Winkel fest.">i</span></div>
      <div class="field2">${field('Temperatur (<span id="lbl_zt">°C</span>)', 'z_t', Units.disp('temp', z.tC), '', '', 'Temperatur beim Einschießen. So rechnet die App von deinem realen Zero aus.')}${field('Druck (<span id="lbl_zp">hPa</span>)', 'z_p', Units.disp('pres', z.pHpa), '', '', 'Stationsluftdruck beim Einschießen (absolut, nicht meereshöhen-korrigiert).')}</div>
      ${field('Luftfeuchte (%)', 'z_h', z.rh, '', '', 'Relative Luftfeuchte beim Einschießen.')}
      <div class="quick"><button data-copy="c2z">↥ Von Aktuell kopieren</button><button data-act="geoloadz" style="border-color:var(--copper);color:var(--copper-bright)">⌖ Vom Standort laden</button></div>`;
    const s = screen('wx', 'Wetter', body,
      `<button class="kbtn ghost" data-act="cancel">Abbrechen</button><button class="kbtn" data-act="apply">Übernehmen</button>`);
    s.querySelector('[data-copy="z2c"]').addEventListener('click', () => {
      s.querySelector('#c_t').value = s.querySelector('#z_t').value; s.querySelector('#c_p').value = s.querySelector('#z_p').value; s.querySelector('#c_h').value = s.querySelector('#z_h').value;
    });
    s.querySelector('[data-copy="c2z"]').addEventListener('click', () => {
      s.querySelector('#z_t').value = s.querySelector('#c_t').value; s.querySelector('#z_p').value = s.querySelector('#c_p').value; s.querySelector('#z_h').value = s.querySelector('#c_h').value;
    });
    // Wetter vom Standort (GPS) über Open-Meteo — surface_pressure ist der absolute Stationsdruck
    function wireGeo(btn, prefix) {
      if (!btn) return;
      const geoLabel = '⌖ Vom Standort laden';
      const busy = txt => { btn.textContent = txt; btn.disabled = true; btn.style.opacity = '0.6'; };
      const done = () => { btn.textContent = geoLabel; btn.disabled = false; btn.style.opacity = ''; };
      btn.addEventListener('click', () => {
        if (!navigator.geolocation) { A.toast('Standort wird vom Gerät nicht unterstützt.'); return; }
        busy('Standort …');
        navigator.geolocation.getCurrentPosition(pos => {
          const la = pos.coords.latitude, lo = pos.coords.longitude;
          busy('Wetter …');
          fetch('https://api.open-meteo.com/v1/forecast?latitude=' + la + '&longitude=' + lo + '&current=temperature_2m,relative_humidity_2m,surface_pressure')
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(d => {
              const cu = d && d.current;
              if (!cu || cu.temperature_2m == null || cu.surface_pressure == null) throw new Error('Keine Daten');
              s.querySelector('#' + prefix + '_t').value = Units.disp('temp', cu.temperature_2m);
              s.querySelector('#' + prefix + '_p').value = Units.disp('pres', cu.surface_pressure);
              s.querySelector('#' + prefix + '_h').value = Math.round(cu.relative_humidity_2m);
              done();
              A.toast('Wetter geladen — „Übernehmen“ zum Rechnen.');
            })
            .catch(() => { done(); A.toast('Wetter konnte nicht geladen werden.'); });
        }, err => {
          done();
          A.toast(err && err.code === 1 ? 'Standortfreigabe verweigert.' : 'Standort nicht verfügbar.');
        }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
      });
    }
    wireGeo(s.querySelector('[data-act="geoload"]'), 'c');
    wireGeo(s.querySelector('[data-act="geoloadz"]'), 'z');
    s.querySelector('[data-act="cancel"]').addEventListener('click', () => A.closeScreen('wx'));
    s.querySelector('[data-act="apply"]').addEventListener('click', () => {
      B.setWeather({ tC: Units.toBase('temp', numv(s, 'c_t')), pHpa: Units.toBase('pres', numv(s, 'c_p')), rh: numv(s, 'c_h') },
        { tC: Units.toBase('temp', numv(s, 'z_t')), pHpa: Units.toBase('pres', numv(s, 'z_p')), rh: numv(s, 'z_h') });
      A.render(); A.closeScreen('wx'); A.toast('Wetter aktualisiert · neu gerechnet.');
    });
    s._onOpen = () => {
      const cc = B.config.weatherCurrent, zz = B.config.weatherZero;
      s.querySelector('#c_t').value = Units.disp('temp', cc.tC); s.querySelector('#c_p').value = Units.disp('pres', cc.pHpa); s.querySelector('#c_h').value = cc.rh;
      s.querySelector('#z_t').value = Units.disp('temp', zz.tC); s.querySelector('#z_p').value = Units.disp('pres', zz.pHpa); s.querySelector('#z_h').value = zz.rh;
      s.querySelector('#lbl_ct').textContent = Units.lbl('temp'); s.querySelector('#lbl_cp').textContent = Units.lbl('pres');
      s.querySelector('#lbl_zt').textContent = Units.lbl('temp'); s.querySelector('#lbl_zp').textContent = Units.lbl('pres');
    };
  }

  // ---------------- PROFILE ----------------
  function buildProfiles() {
    const body = `
      <div class="hint2" style="margin-bottom:12px;font-size:13px;color:var(--fg-dim)">Profile für verschiedene Waffen/Laborierungen. Antippen aktiviert. „Neues Profil anlegen“ startet mit leeren Geschoss- &amp; Gewehrdaten, „+“ legt das aktuelle Setup als Profil ab.</div>
      <div id="profList"></div>
      <button class="kbtn" id="newProfile" style="width:100%;margin-top:8px">+ Neues Profil anlegen</button>
      <button class="kbtn ghost" id="addProfile" style="width:100%;margin-top:10px">Aktuelles Setup als Profil speichern</button>`;
    const s = screen('profiles', 'Profile', body);

    function snapOf() {
      return { id: B.config.id, bullet: Object.assign({}, B.config.bullet), rifle: Object.assign({}, B.config.rifle),
        weatherCurrent: Object.assign({}, B.config.weatherCurrent), weatherZero: Object.assign({}, B.config.weatherZero) };
    }
    function subOf(p) {
      const b = (p.snap && p.snap.bullet) || B.config.bullet, r = (p.snap && p.snap.rifle) || B.config.rifle;
      return b.weightGr + 'gr · ' + b.model + ' ' + b.bc + ' · ' + r.mvFps + 'fps';
    }
    function row(p, active) {
      const tick = active
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';
      return `<div class="card" style="margin:0 0 10px"><div class="card-h" data-pick="${p.id}">
        <span class="ci">${tick}</span>
        <div style="flex:1;min-width:0"><div class="ct">${p.name}</div><div class="pmeta" style="font-family:var(--font-mono);font-size:10px;color:var(--fg-dim)">${subOf(p)}</div></div>
        ${active ? '<span class="pill-tag">aktiv</span>' : '<span class="cv">wählen ›</span>'}
        <button class="prof-act" data-renameprof="${p.id}" title="Profil benennen" aria-label="Profil benennen">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
        </button>
        <button class="prof-act del" data-delprof="${p.id}" title="Profil löschen" aria-label="Profil löschen">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button></div></div>`;
    }
    function paint() {
      const profs = A.state.profiles;
      // Aktives Profil spiegelt stets die Live-Konfiguration → Snapshot sicherstellen,
      // damit ein Zurückwechseln (auch auf Profil 1) die Werte korrekt wiederherstellt.
      const act = profs.find(q => q.id === A.state.activeProfile);
      if (act && !act.snap) { act.snap = snapOf(); A.persist(); }
      s.querySelector('#profList').innerHTML = profs.map(p => row(p, p.id === A.state.activeProfile)).join('');
      s.querySelectorAll('[data-pick]').forEach(x => x.addEventListener('click', e => {
        if (e.target.closest('[data-delprof]') || e.target.closest('[data-renameprof]')) return;
        const p = profs.find(q => q.id === x.dataset.pick);
        if (!p) return;
        if (p.id === A.state.activeProfile) { A.openScreen('gun'); return; }
        // Verlassenes Profil behält seine aktuelle Live-Konfiguration
        const leaving = profs.find(q => q.id === A.state.activeProfile);
        if (leaving) leaving.snap = snapOf();
        if (p.snap) { B.setBullet(p.snap.bullet); B.setRifle(p.snap.rifle); B.setWeather(p.snap.weatherCurrent, p.snap.weatherZero); B.config.id = p.snap.id || p.name; }
        A.state.activeProfile = p.id; A.persist(); A.render(); paint();
        A.toast('Profil „' + p.name + '“ aktiv.');
      }));
      s.querySelectorAll('[data-renameprof]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        const p = profs.find(q => q.id === btn.dataset.renameprof);
        if (!p) return;
        A.prompt({
          title: 'Profil benennen',
          message: 'Gib dem Profil einen Namen.',
          value: p.name,
          placeholder: 'z. B. .308 Match',
          onConfirm: (v) => {
            if (!v) { A.toast('Name darf nicht leer sein.'); return; }
            p.name = v;
            if (p.snap) p.snap.id = v;
            if (p.id === A.state.activeProfile) { B.config.id = v; A.render(); }
            A.persist(); paint();
            A.toast('Profil benannt: „' + v + '“.');
          }
        });
      }));
      s.querySelectorAll('[data-delprof]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.delprof;
        const p = profs.find(q => q.id === id);
        if (A.state.profiles.length <= 1) { A.toast('Das letzte Profil kann nicht gelöscht werden.'); return; }
        A.confirm({
          title: 'Profil löschen',
          message: 'Profil „' + (p ? p.name : '') + '“ wirklich löschen? Das kann nicht rückgängig gemacht werden.',
          onConfirm: () => {
            A.state.profiles = A.state.profiles.filter(q => q.id !== id);
            if (A.state.activeProfile === id) {
              const first = A.state.profiles[0];
              A.state.activeProfile = first.id;
              if (first.snap) { B.setBullet(first.snap.bullet); B.setRifle(first.snap.rifle); B.setWeather(first.snap.weatherCurrent, first.snap.weatherZero); B.config.id = first.snap.id || first.name; A.render(); }
            }
            A.persist(); paint(); A.toast('Profil gelöscht.');
          }
        });
      }));
    }
    s.querySelector('#addProfile').addEventListener('click', () => {
      if (A.state.profiles.length >= 4) { A.toast('Maximal vier Profile.'); return; }
      const snap = snapOf();
      const p = { id: 'pr' + Date.now(), name: snap.id || ('Profil ' + (A.state.profiles.length + 1)), snap };
      A.state.profiles.push(p); A.state.activeProfile = p.id; A.persist(); paint();
      A.toast('Profil „' + p.name + '“ gespeichert.');
    });
    s.querySelector('#newProfile').addEventListener('click', () => {
      if (A.state.profiles.length >= 4) { A.toast('Maximal vier Profile.'); return; }
      // Geschoss- & Gewehrdaten auf null — Wetter bleibt erhalten
      const cur = snapOf();
      const blank = {
        id: 'Neues Profil',
        bullet: { mfr: '', name: '', model: 'G7', bc: 0, weightGr: 0, caliberMm: 0, lengthMm: 0 },
        rifle:  { mvFps: 0, sightHeightCm: 0, zeroM: 100, twist: 'right', twistRate: 0 },
        weatherCurrent: Object.assign({}, cur.weatherCurrent),
        weatherZero: Object.assign({}, cur.weatherZero)
      };
      // Verlassenes Profil behält sein aktuelles Setup
      const leaving = A.state.profiles.find(q => q.id === A.state.activeProfile);
      if (leaving) leaving.snap = cur;
      const p = { id: 'pr' + Date.now(), name: 'Neues Profil', snap: blank };
      A.state.profiles.push(p); A.state.activeProfile = p.id;
      B.setBullet(blank.bullet); B.setRifle(blank.rifle); B.setWeather(blank.weatherCurrent, blank.weatherZero);
      B.config.id = blank.id;
      A.persist(); A.render(); paint();
      A.toast('Neues Profil — Geschoss & Gewehr eintragen.');
      A.openScreen('gun');
    });
    s._onOpen = paint;
  }

  // ---------------- TABELLE ----------------
  function buildTable() {
    const cols = [
      { k: 'elev', label: 'Höhe', info: 'Höhenkorrektur, HOCH.' },
      { k: 'wind', label: 'Seite', info: 'Seitenkorrektur (Spindrift + Wind), L/R.' },
      { k: 'drop', label: 'Abfall', info: 'Geschossabfall unter Visierlinie.' },
      { k: 'speed', label: 'Tempo', info: 'Restgeschwindigkeit.' },
      { k: 'energy', label: 'Energie', info: 'Auftreffenergie.' },
      { k: 'tof', label: 'Flugzeit', info: 'Flugzeit (s).' }
    ];
    const colUnit = k => k === 'elev' || k === 'wind' ? Units.corrShort()
      : k === 'drop' ? 'cm' : k === 'speed' ? Units.lbl('speed')
      : k === 'energy' ? Units.lbl('energy') : k === 'tof' ? 's' : '';
    const on = { elev: 1, wind: 1, drop: 1, speed: 1, energy: 0, tof: 1 };
    const maxVals = [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1700,2000];
    const stepVals = [10,25,50,100,200,500];
    const angVals = [-60,-45,-30,-20,-15,-10,-5,0,5,10,15,20,30,45,60];
    function nearestIdx(arr, v) { let bi=0,bd=Infinity; arr.forEach((a,i)=>{const d=Math.abs(a-v);if(d<bd){bd=d;bi=i;}}); return bi; }
    const t0 = A.state.table;
    const body = `
      <div class="drum-wrap" id="tDrums">
        <div class="drum-col"><div class="drum-col-lbl">Distanz</div><div class="drum-picker" id="dp-max"><div class="drum-sel"></div><div class="drum-fade-top"></div><div class="drum-fade-bot"></div><div class="drum-list" id="dl-max"></div></div></div>
        <div class="drum-col"><div class="drum-col-lbl">Schritt</div><div class="drum-picker" id="dp-step"><div class="drum-sel"></div><div class="drum-fade-top"></div><div class="drum-fade-bot"></div><div class="drum-list" id="dl-step"></div></div></div>
        <div class="drum-col"><div class="drum-col-lbl">Winkel</div><div class="drum-picker" id="dp-ang"><div class="drum-sel"></div><div class="drum-fade-top"></div><div class="drum-fade-bot"></div><div class="drum-list" id="dl-ang"></div></div></div>
      </div>
      <div class="colchips" id="colchips">${cols.map(c => `<button data-col="${c.k}" class="${on[c.k] ? 'on' : ''}">${c.label}</button>`).join('')}</div>
      <div style="overflow:auto;-webkit-overflow-scrolling:touch"><table class="btable" id="btab"></table></div>`;
    const s = screen('table', 'Ballistik-Tabelle', body,
      `<button class="kbtn" data-act="export"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:7px"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>Export als PDF</button>`);
    const maxOpts = [600, 800, 1000, 1200, 1500], stepOpts = [50, 100, 200], angOpts = [-30, -15, 0, 15, 30];

    function exportPdf() {
      const t = A.state.table;
      const b = B.config.bullet, r = B.config.rifle, wc = B.config.weatherCurrent;
      const activeCols = cols.filter(c => on[c.k]);
      const rows = B.tableRows(t.max, t.step, t.angle, A.buildWindFn());
      const seg = A.state.segments;
      const windTxt = seg.enabled
        ? (seg.name + ' · ' + seg.count + ' ' + A.t('Segmente'))
        : (Units.fmt('wind', A.state.windMs) + ' · ' + Math.round(A.state.windDir) + '°');
      const cell = (c, row) => {
        if (c.k === 'elev') return row.range === 0 ? '–' : '▲' + Units.corr(row.elevMrad).num;
        if (c.k === 'wind') return row.range === 0 ? '–' : (row.windDir + ' ' + Units.corr(row.windMrad).num);
        if (c.k === 'drop') return 'D ' + (Math.abs(row.dropCm) < 0.05 ? '0.0' : row.dropCm.toFixed(row.dropCm < 100 ? 1 : 0));
        if (c.k === 'speed') return Units.num('speed', row.speedFps);
        if (c.k === 'energy') return Units.num('energy', row.energyJ);
        if (c.k === 'tof') return row.tof.toFixed(3);
        return '';
      };
      const colU = k => k === 'elev' || k === 'wind' ? Units.corrShort() : k === 'drop' ? 'cm' : k === 'speed' ? Units.lbl('speed') : k === 'energy' ? Units.lbl('energy') : k === 'tof' ? 's' : '';
      const head = '<th>' + A.t('Distanz') + ' ' + Units.lbl('range') + '</th>' + activeCols.map(c => '<th>' + A.t(c.label) + ' · ' + colU(c.k) + '</th>').join('');
      const body2 = rows.map(row =>
        '<tr><td class="rng">' + Units.num('range', row.range) + '</td>' + activeCols.map(c => '<td>' + cell(c, row) + '</td>').join('') + '</tr>'
      ).join('');
      const today = new Date().toLocaleDateString(A.lang() === 'en' ? 'en-GB' : 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const logo = (window.KR_PRINT_LOGO || '');
      // Druckdichte: Schrift/Zeilenhöhe an Zeilenzahl koppeln, damit die Tabelle immer auf EIN Blatt passt
      const nRows = rows.length;
      const dens = nRows <= 16 ? { fs: '9.5pt', pad: '3.4px', hfs: '8.4pt' }
                 : nRows <= 22 ? { fs: '8.4pt', pad: '2.7px', hfs: '7.6pt' }
                 : nRows <= 28 ? { fs: '7.6pt', pad: '2.1px', hfs: '7pt' }
                 :               { fs: '7pt',   pad: '1.7px', hfs: '6.6pt' };
      const doc = `<!DOCTYPE html><html lang="${A.lang() === 'en' ? 'en' : 'de'}"><head><meta charset="UTF-8"><title>${A.t('Ballistik-Tabelle')} ${b.name}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          @page{size:A4 portrait;margin:11mm;}
          body{font-family:Arial,Helvetica,sans-serif;color:#000;background:#fff;font-size:10pt;line-height:1.3;position:relative;}
          .wmark{position:fixed;right:0;bottom:0;width:62mm;opacity:.06;pointer-events:none;z-index:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
          .hd{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border-bottom:2px solid #000;padding-bottom:7px;margin-bottom:4px;position:relative;z-index:1;}
          .hd .hl{min-width:0;}
          .hd .logo{height:13mm;width:auto;flex:0 0 auto;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
          h1{font-size:15pt;letter-spacing:.5px;text-transform:uppercase;}
          .sub{font-size:9pt;color:#000;margin-bottom:8px;position:relative;z-index:1;}
          .meta,table.bt,.foot{position:relative;z-index:1;}
          .meta{width:100%;border-collapse:collapse;margin-bottom:9px;font-size:9pt;}
          .meta td{border:1px solid #000;padding:3px 7px;vertical-align:top;}
          .meta td.l{font-weight:bold;width:22%;background:#eee;text-transform:uppercase;font-size:8pt;letter-spacing:.4px;}
          table.bt{width:100%;border-collapse:collapse;font-size:${dens.fs};table-layout:fixed;}
          table.bt th{border:1px solid #000;padding:${dens.pad} 3px;background:#000;color:#fff;font-size:${dens.hfs};text-transform:uppercase;letter-spacing:.2px;line-height:1.1;}
          table.bt td{border:1px solid #000;padding:${dens.pad} 3px;text-align:center;font-variant-numeric:tabular-nums;}
          table.bt td.rng{font-weight:bold;}
          table.bt tr{page-break-inside:avoid;}
          table.bt tr:nth-child(even) td{background:#f0f0f0;}
          .foot{margin-top:8px;font-size:8pt;color:#000;border-top:1px solid #000;padding-top:6px;display:flex;justify-content:space-between;}
          /* Bildschirm-Werkzeugleiste — wird beim Drucken/PDF ausgeblendet */
          .toolbar{position:sticky;top:0;left:0;right:0;z-index:10;display:flex;gap:10px;align-items:center;justify-content:flex-start;
            padding:10px 12px;margin:-4px -4px 16px;background:#14110B;border-bottom:2px solid #000;}
          .toolbar .tb-spacer{flex:1;}
          .toolbar button{font-family:Arial,Helvetica,sans-serif;font-size:11pt;font-weight:bold;letter-spacing:.4px;
            text-transform:uppercase;padding:11px 18px;border:0;border-radius:4px;cursor:pointer;min-height:44px;}
          .toolbar .tb-print{background:#B26A3E;color:#fff;}
          .toolbar .tb-print:active{background:#8a4f2c;}
          .toolbar .tb-back,.toolbar .tb-close{background:transparent;color:#EFE8D6;border:1px solid #6b6052;}
          .toolbar .tb-back:active,.toolbar .tb-close:active{background:#2a2419;}
          @media print{ .toolbar{display:none !important;} body{padding:0 !important;} }
          @media screen{ body{padding:4px;} }
        </style></head><body>
        <div class="toolbar">
          <button type="button" class="tb-back" onclick="window.close()">${A.t('← Zurück')}</button>
          <span class="tb-spacer"></span>
          <button type="button" class="tb-close" onclick="window.close()">${A.t('Schließen')}</button>
          <button type="button" class="tb-print" onclick="window.print()">${A.t('Drucken / PDF')}</button>
        </div>
        ${logo ? `<img class="wmark" src="${logo}" alt="">` : ''}
        <div class="hd"><div class="hl"><h1>${A.t('Ballistik-Tabelle')}</h1></div>${logo ? `<img class="logo" src="${logo}" alt="KR">` : ''}</div>
        <div class="sub">${b.mfr} ${b.name} · ${b.caliberMm} mm — ${A.t('erstellt')} ${today}</div>
        <table class="meta">
          <tr><td class="l">${A.t('Geschoss')}</td><td>${b.mfr} ${b.name} · ${b.weightGr} gr · ${b.caliberMm} mm</td>
              <td class="l">${A.t('Profil / BC')}</td><td>${b.model} · ${b.bc}</td></tr>
          <tr><td class="l">${A.t('Mündung / Zero')}</td><td>${Units.fmt('speed', r.mvFps)} · ${Units.fmt('range', r.zeroM)}</td>
              <td class="l">${A.t('Drall')}</td><td>1:${r.twistRate}" ${A.t({right:'rechts',left:'links',smooth:'glatt'}[r.twist])}</td></tr>
          <tr><td class="l">${A.t('Wetter')}</td><td>${Units.fmt('temp', wc.tC)} · ${Units.fmt('pres', wc.pHpa)} · ${wc.rh} %</td>
              <td class="l">${A.t('Wind / Winkel')}</td><td>${windTxt} · ${t.angle}°</td></tr>
        </table>
        <table class="bt"><thead><tr>${head}</tr></thead><tbody>${body2}</tbody></table>
        <div class="foot"><span>Ballistikrechner 3.0</span><span>${A.t('Einheiten:')} ${Units.corrShort()} · cm · ${Units.lbl('speed')} · ${Units.lbl('energy')} · s</span></div>
        </body></html>`;
      const w = window.open('', '_blank');
      if (!w) { A.toast(A.t('Bitte Pop-ups erlauben, um die PDF zu erzeugen.')); return; }
      w.document.open(); w.document.write(doc); w.document.close();
      w.focus();
    }

    // ---- Drum Picker setup ----
    function makeDrum(pickerId, listId, values, initVal, suffix, onChange) {
      const ITEM_H = 44;
      const picker = s.querySelector('#' + pickerId);
      const list = s.querySelector('#' + listId);
      const H = 96;
      const center = H / 2;
      let idx = nearestIdx(values, initVal);
      function getOff(i) { return center - i * ITEM_H - ITEM_H / 2; }
      let curOff = getOff(idx);
      function renderList() {
        const suf = typeof suffix === 'function' ? suffix() : suffix;
        list.innerHTML = values.map((v, i) => {
          const active = i === idx;
          const dist = Math.abs(i - idx);
          const op = Math.max(0.2, 1 - dist * 0.28);
          return `<div class="drum-item${active ? ' dact' : ''}" style="opacity:${op.toFixed(2)}">${v}${suf ? `<span class="drum-dsuf">${suf}</span>` : ''}</div>`;
        }).join('');
      }
      function setPos(off, anim) {
        list.style.transition = anim ? 'transform .26s cubic-bezier(.2,.85,.3,1)' : 'none';
        list.style.transform = `translateY(${off}px)`;
      }
      function snapToIdx(raw) {
        idx = Math.max(0, Math.min(values.length - 1, Math.round(raw)));
        curOff = getOff(idx);
        setPos(curOff, true);
        renderList();
        onChange(values[idx]);
      }
      renderList(); setPos(curOff, false);
      let startY, startOff, dragging = false, lastY, lastT, vel;
      function getY(e) { return e.touches ? e.touches[0].clientY : e.clientY; }
      function onStart(e) {
        dragging = true; startY = getY(e); startOff = curOff; vel = 0; lastY = startY; lastT = Date.now();
        list.style.transition = 'none'; e.preventDefault();
      }
      function onMove(e) {
        if (!dragging) return;
        const y = getY(e), now = Date.now(), dt = now - lastT;
        if (dt > 0) vel = (y - lastY) / dt;
        lastY = y; lastT = now;
        curOff = startOff + (y - startY);
        list.style.transform = `translateY(${curOff}px)`;
        const liveIdx = Math.max(0, Math.min(values.length-1, Math.round((center - curOff - ITEM_H/2) / ITEM_H)));
        if (liveIdx !== idx) { idx = liveIdx; renderList(); }
        e.preventDefault();
      }
      function onEnd() {
        if (!dragging) return; dragging = false;
        const proj = curOff + vel * 100;
        snapToIdx((center - proj - ITEM_H/2) / ITEM_H);
      }
      picker.addEventListener('touchstart', onStart, { passive: false });
      picker.addEventListener('touchmove', onMove, { passive: false });
      picker.addEventListener('touchend', onEnd);
      picker.addEventListener('mousedown', onStart);
      document.addEventListener('mousemove', e => { if (dragging) onMove(e); });
      document.addEventListener('mouseup', () => { if (dragging) onEnd(); });
      return { getValue: () => values[idx], setValue: v => { idx = nearestIdx(values, v); curOff = getOff(idx); setPos(curOff, true); renderList(); } };
    }

    const rlSuf = () => ' ' + Units.lbl('range');
    const drumMax  = makeDrum('dp-max',  'dl-max',  maxVals,  Units.disp('range', t0.max),  rlSuf, v => { A.state.table.max   = Units.toBase('range', v); paint(); A.persist(); });
    const drumStep = makeDrum('dp-step', 'dl-step', stepVals, Units.disp('range', t0.step), rlSuf, v => { A.state.table.step  = Units.toBase('range', v); paint(); A.persist(); });
    const drumAng  = makeDrum('dp-ang',  'dl-ang',  angVals,  t0.angle, '°',  v => { A.state.table.angle = v; paint(); A.persist(); });

    function paint() {
      const t = A.state.table;
      const rows = B.tableRows(t.max, t.step, t.angle, A.buildWindFn());
      const cur = Math.round(A.state.range / t.step) * t.step;
      const head = `<thead><tr><th>Distanz<br><span style="font-family:var(--font-mono);font-size:8px;letter-spacing:.05em;color:var(--fg-faint)">${Units.lbl('range')}</span></th>${cols.filter(c => on[c.k]).map(c => `<th>${c.label} <span class="ib" data-info="${c.info}">i</span><br><span style="font-family:var(--font-mono);font-size:8px;letter-spacing:.05em;color:var(--fg-faint)">${colUnit(c.k)}</span></th>`).join('')}</tr></thead>`;
      const bodyRows = rows.map(r => {
        const cells = cols.filter(c => on[c.k]).map(c => {
          if (c.k === 'elev') return `<td>${r.range === 0 ? '–' : '▲' + Units.corr(r.elevMrad).num}</td>`;
          if (c.k === 'wind') return `<td>${r.range === 0 ? '–' : (r.windDir + ' ' + Units.corr(r.windMrad).num)}</td>`;
          if (c.k === 'drop') return `<td class="dim">D ${r.dropCm.toFixed(r.dropCm < 100 ? 1 : 0)}</td>`;
          if (c.k === 'speed') return `<td>${Units.num('speed', r.speedFps)}</td>`;
          if (c.k === 'energy') return `<td class="dim">${Units.num('energy', r.energyJ)}</td>`;
          if (c.k === 'tof') return `<td class="dim">${r.tof.toFixed(3)}</td>`;
        }).join('');
        return `<tr class="${r.range === cur ? 'hl' : ''}"><td class="rng">${Units.num('range', r.range)}</td>${cells}</tr>`;
      }).join('');
      s.querySelector('#btab').innerHTML = head + '<tbody>' + bodyRows + '</tbody>';
    }
    s.querySelector('#colchips').addEventListener('click', e => {
      const btn = e.target.closest('[data-col]'); if (!btn) return;
      on[btn.dataset.col] = on[btn.dataset.col] ? 0 : 1; btn.classList.toggle('on'); paint();
    });
    s.querySelector('[data-act="export"]').addEventListener('click', exportPdf);
    s._onOpen = () => {
      drumMax.setValue(Units.disp('range', A.state.table.max));
      drumStep.setValue(Units.disp('range', A.state.table.step));
      drumAng.setValue(A.state.table.angle);
      paint();
    };
  }

  // ---------------- GRAFIKEN ----------------
  function buildGraphs() {
    const charts = [
      { id: 'drop', label: 'Abfall', uf: () => 'cm', get: r => r.dropCm, fmt: v => 'D ' + v.toFixed(0) + ' cm', flip: true },
      { id: 'elev', label: 'Höhe', uf: () => Units.corrShort(), get: r => parseFloat(Units.corr(r.elevMrad).num), fmt: (v, r) => '▲ ' + (Number.isInteger(v) ? v : v.toFixed(1)) + ' ' + Units.corrShort() + ' · ' + Math.round(r.dropCm) + ' cm', flip: true },
      { id: 'wind', label: 'Seite', uf: () => 'cm', get: r => r.totalSideCm, fmt: (v, r) => (v >= 0 ? 'L ' : 'R ') + Units.corr(r.windMrad).num + ' ' + Units.corrShort() + ' · ' + Math.abs(v).toFixed(1) + ' cm', flip: true },
      { id: 'speed', label: 'Tempo', uf: () => Units.lbl('speed'), get: r => parseFloat(Units.num('speed', r.speedFps)), fmt: v => v + ' ' + Units.lbl('speed') }
    ];
    const body = `
      <div class="ctrlbar ctrlbar-sticky"><div class="cb" data-cyc="gmax"><div class="cbl">Max. Distanz</div><div class="cbv" id="gMax">1200</div></div>
        <div class="cb" style="cursor:default"><div class="cbl">Entfernung</div><div class="cbv" id="gScrubR">300 m</div></div></div>
      <div class="hint2" style="margin-bottom:12px">Über eine Grafik fahren/ziehen → Werte an dieser Distanz. <span class="ib" data-info="Genau dein Wunsch: Hover/Tippen liefert exakte Werte je Distanz für alle Kurven gleichzeitig.">i</span></div>
      <div id="gcards"></div>`;
    const s = screen('graphs', 'Profil-Grafiken', body);
    const maxOpts = [300, 600, 800, 1000, 1200];
    let rows = [], scrubFrac = 0.25;

    function compute() {
      const max = A.state.graph.max;
      rows = [];
      for (let r = 0; r <= max; r += Math.max(10, Math.round(max / 60 / 5) * 5)) rows.push(B.solve({ range: r, windFn: A.buildWindFn(), angleDeg: A.state.angle }));
    }
    function path(get, flip) {
      const vals = rows.map(get); let mn = Math.min(...vals), mx = Math.max(...vals);
      if (mx === mn) mx = mn + 1; const pad = (mx - mn) * 0.08; mn -= pad; mx += pad;
      const n = rows.length;
      return rows.map((r, i) => {
        const x = (i / (n - 1)) * 100;
        const frac = (get(r) - mn) / (mx - mn);
        const y = flip ? frac * 100 : 100 - frac * 100;
        return (i ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2);
      }).join(' ') + '|' + mn + '|' + mx;
    }
    function paintCards() {
      s.querySelector('#gMax').textContent = Units.num('range', A.state.graph.max) + ' ' + Units.lbl('range');
      const max = A.state.graph.max;
      const fmtAx = v => { if (Math.abs(v) < 0.05) v = 0; return Math.abs(v) >= 100 ? Math.round(v) : (Math.round(v * 10) / 10); };
      s.querySelector('#gcards').innerHTML = charts.map(c => {
        const p = path(c.get, c.flip); const d = p.split('|')[0];
        const vals = rows.map(c.get); const rmn = Math.min(...vals), rmx = Math.max(...vals);
        const topVal = c.flip ? rmn : rmx, botVal = c.flip ? rmx : rmn;
        return `<div class="gcard" data-gid="${c.id}"><div class="gt"><span class="gl">${c.label}</span><span class="gv" id="gv-${c.id}">–</span></div>
          <div class="gbody">
            <div class="gyaxis"><span class="gy-t">${fmtAx(topVal)}</span><span class="gy-u">${c.uf()}</span><span class="gy-b">${fmtAx(botVal)}</span></div>
            <div class="gwrap"><svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="100" x2="100" y2="100" stroke="#38301F" stroke-width="0.5"/>
              <path d="${d}" fill="none" stroke="#C9824E" stroke-width="1" vector-effect="non-scaling-stroke"/>
            </svg><div class="gscrub" id="gs-${c.id}"></div><div class="gdot" id="gd-${c.id}"></div></div>
          </div>
          <div class="gxaxis"><span>0</span><span class="gx-lab">Distanz · ${Units.lbl('range')}</span><span>${Units.num('range', max)}</span></div></div>`;
      }).join('');
      // pointer handling per wrap
      s.querySelectorAll('.gwrap').forEach(w => {
        const move = ev => {
          const r = w.getBoundingClientRect(); const pt = ev.touches ? ev.touches[0] : ev;
          scrubFrac = Math.max(0, Math.min(1, (pt.clientX - r.left) / r.width)); updateScrub(); ev.preventDefault();
        };
        w.addEventListener('mousemove', move); w.addEventListener('mousedown', move);
        w.addEventListener('touchstart', move, { passive: false }); w.addEventListener('touchmove', move, { passive: false });
      });
      updateScrub();
    }
    function updateScrub() {
      const max = A.state.graph.max; const range = Math.round(scrubFrac * max);
      s.querySelector('#gScrubR').textContent = Units.num('range', range) + ' ' + Units.lbl('range');
      const sol = B.solve({ range, windFn: A.buildWindFn(), angleDeg: A.state.angle });
      charts.forEach(c => {
        s.querySelector('#gv-' + c.id).textContent = c.fmt(c.get(sol), sol);
        const gs = s.querySelector('#gs-' + c.id); gs.style.left = (scrubFrac * 100) + '%';
        const vals = rows.map(c.get); let mn = Math.min(...vals), mx = Math.max(...vals); if (mx === mn) mx = mn + 1;
        const pad = (mx - mn) * 0.08; mn -= pad; mx += pad;
        const frac = (c.get(sol) - mn) / (mx - mn);
        const yFrac = c.flip ? frac : 1 - frac;
        const gd = s.querySelector('#gd-' + c.id); gd.style.left = (scrubFrac * 100) + '%'; gd.style.top = (yFrac * 100) + '%';
      });
    }
    s.querySelector('[data-cyc="gmax"]').addEventListener('click', () => {
      const g = A.state.graph; g.max = maxOpts[(maxOpts.indexOf(g.max) + 1) % maxOpts.length]; compute(); paintCards();
    });
    s._onOpen = () => { A.state.graph.max = 300; scrubFrac = Math.max(0, Math.min(1, A.state.range / A.state.graph.max)); compute(); paintCards(); };
  }

  // ---------------- WIND-SEGMENT-PROFIL ----------------
  function buildWind() {
    const body = `
      <div class="sect-t">Modus</div>
      ${seg('wmode', [{ v: 'uniform', label: 'Windstärke/Richtung' }, { v: 'segments', label: 'Segmente' }], A.state.segments.enabled ? 'segments' : 'uniform')}
      <div id="uniBlock" style="margin-top:16px">
        <div class="wind-grid">
          <div class="dial" id="uDial"><svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="56" fill="#1A160E" stroke="#4A3F29" stroke-width="2"/>
            <g font-family="JetBrains Mono" font-size="9" fill="#8C7B58" text-anchor="middle"><text x="60" y="16">N</text><text x="108" y="63">O</text><text x="60" y="111">S</text><text x="13" y="63">W</text></g>
            <g id="uDialNeedle"><line x1="60" y1="60" x2="60" y2="14" stroke="#C9824E" stroke-width="3" stroke-linecap="round"/><polygon points="60,8 55,20 65,20" fill="#C9824E"/></g>
            <circle cx="60" cy="60" r="4" fill="#EFE8D6"/></svg></div>
          <div class="wind-side"><div class="wind-readout"><span class="big" id="uSpd">0.0</span><span class="un" id="uSpdU">m/s</span></div>
            <div class="wind-sub" id="uDir">Richtung 0°</div>
            <div class="slabel"><span>STÄRKE</span><span id="uSpd2">0.0 m/s</span></div>
            <input type="range" class="sl" id="uSlider" min="0" max="15" step="0.5" value="0"></div>
        </div>
      </div>
      <div id="segBlock" style="display:none">
        <div class="field2" style="margin-top:16px">${field('Stand-Name', 's_name', A.state.segments.name, '', 'text', 'Name dieses Schießstands/Szenarios (frei wählbar). Wird gespeichert, damit du Windprofile pro Stand wiederverwenden kannst.')}
          <div class="field"><label>Segmente</label>${seg('scount', [{ v: 2, label: '2' }, { v: 3, label: '3' }, { v: 4, label: '4' }], A.state.segments.count)}</div></div>
        <div class="sect-t">Grenzen &amp; Wind je Abschnitt <span class="ib" data-info="Jeder Abschnitt hat eigene Windgeschwindigkeit (Slider) und -richtung (Mini-Dial). Die Tabelle/Reticle rechnen segmentiert.">i</span></div>
        <div class="seg-layout">
          <div class="seg-lane" aria-hidden="false">
            <div class="lane-end is-target">
              <div class="lane-ico lane-target"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><line x1="12" y1="1.5" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22.5" y2="12"/></svg></div>
              <div class="lane-lab">Ziel</div>
            </div>
            <div class="lane-line"></div>
            <div class="lane-end">
              <div class="lane-ico lane-shooter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3.2"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg></div>
              <div class="lane-lab">Schütze</div>
            </div>
          </div>
          <div id="segList"></div>
        </div>
      </div>`;
    const s = screen('wind', 'Wind & Segmente', body,
      `<button class="kbtn ghost" data-act="cancel">Schließen</button><button class="kbtn" data-act="apply">Anwenden</button>`);

    // uniform controls
    let uDir = A.state.windDir;
    function paintUni() {
      s.querySelector('#uSpd').textContent = Units.num('wind', A.state.windMs);
      s.querySelector('#uSpd2').textContent = Units.fmt('wind', A.state.windMs);
      s.querySelector('#uSpdU').textContent = Units.lbl('wind');
      s.querySelector('#uDir').textContent = A.t('Richtung') + ' ' + Math.round(uDir) + '° · ' + A.clockTxt(uDir);
      s.querySelector('#uDialNeedle').setAttribute('transform', `rotate(${uDir} 60 60)`);
      s.querySelector('#uSlider').value = A.state.windMs;
    }
    A.attachDial(s.querySelector('#uDial'), () => uDir, v => { uDir = v; paintUni(); });
    s.querySelector('#uSlider').addEventListener('input', e => { A.state.windMs = +e.target.value; paintUni(); });

    // segments
    function segArr() { return A.state.segments; }
    function paintSeg() {
      const sg = segArr(); const lo = [0]; for (let i = 0; i < sg.count - 1; i++) lo.push(sg.bounds[i] || (i + 1) * 300);
      const list = s.querySelector('#segList'); list.innerHTML = '';
      const cards = [], divs = [];
      for (let i = 0; i < sg.count; i++) {
        const hi = (i < sg.count - 1) ? (sg.bounds[i] || (i + 1) * 300) : 'max';
        const w = sg.winds[i] || (sg.winds[i] = { ms: 0, dir: 270 });
        const rowEl = el(`<div class="segrow"><div class="sr-h"><span class="sr-d">${Units.num('range', lo[i])} – ${hi === 'max' ? 'max' : Units.num('range', hi)} ${Units.lbl('range')}</span><span class="sr-x">Seg ${i + 1}</span></div>
          <div class="sr-b"><div class="mini-dial" data-seg-i="${i}"><svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="29" fill="#1A160E" stroke="#4A3F29" stroke-width="2"/>
            <g class="mneedle"><line x1="32" y1="32" x2="32" y2="9" stroke="#C9824E" stroke-width="2.5" stroke-linecap="round"/><polygon points="32,5 28,13 36,13" fill="#C9824E"/></g>
            <circle cx="32" cy="32" r="3" fill="#EFE8D6"/></svg></div>
          <div style="flex:1"><div class="wind-readout"><span class="big" style="font-size:22px" data-spd="${i}">${Units.num('wind', w.ms)}</span><span class="un">${Units.lbl('wind')} · </span><span class="un" data-dir="${i}">${w.dir}°</span></div>
            <input type="range" class="sl" data-slider="${i}" min="0" max="15" step="0.5" value="${w.ms}"></div></div></div>`);
        rowEl.querySelector('.mneedle').setAttribute('transform', `rotate(${w.dir} 32 32)`);
        cards[i] = rowEl;
      }
      for (let i = 0; i < sg.count - 1; i++) {
        divs[i] = el(`<div class="field segbound"><label style="margin-bottom:4px"><span>Grenze</span> Seg ${i + 1}→${i + 2} (${Units.lbl('range')}) <span class="ib" data-info="Distanz, ab der das nächste Wind-Segment gilt. Schätze die Bereiche, in denen der Wind merklich anders weht — Gelände, Deckung, Täler.">i</span></label><input type="number" data-bound="${i}" value="${Units.num('range', sg.bounds[i] || (i + 1) * 300)}"></div>`);
      }
      // weitestes Segment oben (Ziel), nächstes unten (Schütze)
      for (let i = sg.count - 1; i >= 0; i--) {
        list.appendChild(cards[i]);
        if (i > 0) list.appendChild(divs[i - 1]);
      }
      // wire sliders, dials, bounds
      list.querySelectorAll('[data-slider]').forEach(sl => sl.addEventListener('input', e => {
        const i = +e.target.dataset.slider; sg.winds[i].ms = +e.target.value;
        list.querySelector(`[data-spd="${i}"]`).textContent = Units.num('wind', sg.winds[i].ms);
      }));
      list.querySelectorAll('.mini-dial').forEach(md => {
        const i = +md.dataset.segI;
        A.attachDial(md, () => sg.winds[i].dir, v => {
          sg.winds[i].dir = v; md.querySelector('.mneedle').setAttribute('transform', `rotate(${v} 32 32)`);
          const d = list.querySelector(`[data-dir="${i}"]`); if (d) d.textContent = v + '°';
        });
      });
      list.querySelectorAll('[data-bound]').forEach(inp => inp.addEventListener('change', e => {
        const i = +e.target.dataset.bound; sg.bounds[i] = Math.round(Units.toBase('range', +e.target.value)); paintSeg();
      }));
    }
    function setMode(mode) {
      const segMode = mode === 'segments';
      s.querySelector('#uniBlock').style.display = segMode ? 'none' : '';
      s.querySelector('#segBlock').style.display = segMode ? '' : 'none';
      if (segMode) paintSeg();
    }
    s.querySelector('.seg[data-seg="wmode"]').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setMode(b.dataset.v); });
    s.querySelector('.seg[data-seg="scount"]').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return; A.state.segments.count = +b.dataset.v;
      // ensure bounds/winds length
      const sg = A.state.segments;
      while (sg.winds.length < sg.count) sg.winds.push({ ms: 3, dir: 270 });
      paintSeg();
    });
    s.querySelector('[data-act="cancel"]').addEventListener('click', () => A.closeScreen('wind'));
    s.querySelector('[data-act="apply"]').addEventListener('click', () => {
      const mode = segVal(s, 'wmode');
      if (mode === 'segments') {
        A.state.segments.enabled = true; A.state.segments.name = s.querySelector('#s_name').value || 'Stand';
        A.toast('Segment-Wind aktiv · Dashboard zeigt „Multi".');
      } else {
        A.state.segments.enabled = false; A.state.windDir = uDir;
        A.toast('Uniformer Wind übernommen.');
      }
      A.render(); A.closeScreen('wind');
    });
    s._onOpen = () => {
      uDir = A.state.windDir; paintUni();
      s.querySelectorAll('.seg[data-seg="wmode"] button').forEach(x => x.classList.toggle('on', x.dataset.v === (A.state.segments.enabled ? 'segments' : 'uniform')));
      s.querySelectorAll('.seg[data-seg="scount"] button').forEach(x => x.classList.toggle('on', +x.dataset.v === A.state.segments.count));
      s.querySelector('#s_name').value = A.state.segments.name;
      setMode(A.state.segments.enabled ? 'segments' : 'uniform');
    };
  }

  // ---------------- SETTINGS ----------------
  function buildSettings() {
    const u = A.state.units;
    const groups = [
      { id: 'range', t: 'Distanz', opts: ['M', 'YDS', 'FT'] },
      { id: 'angle', t: 'Korrektur · Höhe/Seite', opts: ['0.1 MRAD', 'MRAD', '1/4 MOA', 'MOA'] },
      { id: 'sight', t: 'Visierhöhe', opts: ['CM', 'MM', 'IN'] },
      { id: 'mv', t: 'Geschwindigkeit', opts: ['FPS', 'M/S'] },
      { id: 'wind', t: 'Windgeschw.', opts: ['M/S', 'MPH', 'KN'] },
      { id: 'temp', t: 'Temperatur', opts: ['C', 'F', 'K'] },
      { id: 'pres', t: 'Druck', opts: ['HPA', 'MBAR', 'INHG'] },
      { id: 'energy', t: 'Energie', opts: ['J', 'FT-LBS'] }
    ];
    const body = groups.map(g => `<div class="sect-t" style="border:none;margin:14px 0 8px">${g.t}</div>${seg('set_' + g.id, g.opts.map(o => ({ v: o, label: o })), u[g.id])}`).join('');
    const s = screen('settings', 'Settings · Einheiten', body, `<button class="kbtn" data-act="close">Fertig</button>`);
    s.querySelector('[data-act="close"]').addEventListener('click', () => A.closeScreen('settings'));
    s.addEventListener('click', e => {
      const btn = e.target.closest('.seg button'); if (!btn) return;
      const grp = btn.closest('.seg'); if (!grp || !/^set_/.test(grp.dataset.seg)) return;
      const id = grp.dataset.seg.replace('set_', '');
      A.state.units[id] = btn.dataset.v;
      A.persist(); A.refreshConfigUI(); A.render();
      A.toast('Einheit übernommen: ' + btn.dataset.v);
    });
    s._onOpen = () => {
      groups.forEach(g => s.querySelectorAll(`.seg[data-seg="set_${g.id}"] button`)
        .forEach(x => x.classList.toggle('on', x.dataset.v === A.state.units[g.id])));
    };
  }

  // ---------------- MAIN SETTINGS ----------------
  function buildMainSettings() {
    const pf = A.state.prefs || (A.state.prefs = { theme: 'dark', lang: 'de' });
    const body = `
      <div class="sect-t" style="margin-top:4px">Gesamtübersicht</div>
      <div class="mset-d" style="margin:-2px 0 12px">Druckfertiges Datenblatt (PDF) mit allen Werten des aktiven Profils.</div>
      <button class="kbtn mset-databtn" data-act="overview" style="width:100%">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
        Gesamtübersicht drucken
      </button>
      <div class="mset-stamp">KR · Ballistikrechner 3.0</div>`;
    const s = screen('mainsettings', 'Haupteinstellungen', body, `<button class="kbtn" data-act="close">Fertig</button>`);

    // ---- Gesamtübersicht (Datenblatt-PDF) ----
    s.querySelector('[data-act="overview"]').addEventListener('click', printOverview);

    s.querySelector('[data-act="close"]').addEventListener('click', () => A.closeScreen('mainsettings'));

    // Beim Öffnen aktuellen Zustand spiegeln + ggf. Boarisch anwenden
    s._onOpen = () => {};

    // Aktuelle Sprache sofort auf diesen Screen anwenden, falls nicht Deutsch
    if (pf.lang && pf.lang !== 'de' && A.translateNode) {
      A.translateNode(s, pf.lang);
    }

    // ============================================================
    //  GESAMTÜBERSICHT — druckfertiges Datenblatt (Graustufen, 1 Blatt)
    // ============================================================
    function printOverview() {
      // Fenster sofort im Klick-Kontext öffnen (Pop-up-Blocker), dann GPS asynchron nachladen
      const w = window.open('', '_blank');
      if (!w) { A.toast(A.t('Bitte Pop-ups erlauben, um die Übersicht zu erzeugen.')); return; }
      w.document.open();
      w.document.write('<!DOCTYPE html><html lang="' + (A.lang() === 'en' ? 'en' : 'de') + '"><head><meta charset="UTF-8"><title>' + A.t('Gesamtübersicht') + ' …</title>'
        + '<style>html,body{height:100%;margin:0;background:#14110B;color:#EFE8D6;'
        + 'font-family:Arial,Helvetica,sans-serif;display:flex;align-items:center;justify-content:center;}'
        + '.ld{text-align:center;}.ld b{display:block;font-size:15pt;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px;}'
        + '.ld span{font-size:10pt;color:#B9AC93;}</style></head><body><div class="ld"><b>' + A.t('Gesamtübersicht') + '</b>'
        + '<span>' + A.t('Standort & Daten werden geladen …') + '</span></div></body></html>');
      w.document.close();
      A.toast(A.t('Standort wird ermittelt …'));

      const finish = coords => {
        try {
          const doc = buildOverviewDoc(coords);
          w.document.open(); w.document.write(doc); w.document.close(); w.focus();
        } catch (err) { try { w.close(); } catch (e) {} A.toast(A.t('Übersicht konnte nicht erzeugt werden.')); }
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => finish({ lat: pos.coords.latitude, lon: pos.coords.longitude, acc: pos.coords.accuracy }),
          () => finish(null),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
        );
      } else finish(null);
    }

    function buildOverviewDoc(coords) {
      const t = A.state.table;
      const windFn = A.buildWindFn();
      const angle = A.state.angle;
      const b = B.config.bullet, r = B.config.rifle, wc = B.config.weatherCurrent, wz = B.config.weatherZero;
      const ap = A.state.profiles && A.state.profiles.find(p => p.id === A.state.activeProfile);
      const profName = (ap && ap.name) ? ap.name : B.config.id;
      const twistTxt = A.t({ right: 'rechts', left: 'links', smooth: 'glatt' }[r.twist]) || r.twist;

      // ---- Datum / Uhrzeit / GPS ----
      const now = new Date();
      const isEN = A.lang() === 'en';
      const dt = now.toLocaleString(isEN ? 'en-GB' : 'de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + (isEN ? '' : ' Uhr');
      const gps = coords
        ? (Math.abs(coords.lat).toFixed(5) + '° ' + (coords.lat >= 0 ? 'N' : 'S') + ' · ' + Math.abs(coords.lon).toFixed(5) + '° ' + (coords.lon >= 0 ? (isEN ? 'E' : 'O') : 'W'))
        : A.t('GPS nicht verfügbar');

      // ---- Spec-Boxen ----
      const box = (title, rows, cls) => `<div class="box ${cls || ''}"><div class="box-h">${title}</div><table class="kv">${rows.map(rw => `<tr><td class="k">${rw[0]}</td><td class="v">${rw[1]}</td></tr>`).join('')}</table></div>`;

      const bulletRows = [
        [A.t('Hersteller'), b.mfr || '–'], [A.t('Bezeichnung'), b.name || '–'],
        [A.t('Profil / BC'), b.model + ' · ' + b.bc], [A.t('Gewicht'), b.weightGr + ' gr'],
        [A.t('Kaliber'), b.caliberMm + ' mm'], [A.t('Länge'), b.lengthMm + ' mm']
      ];
      const rifleRows = [
        [A.t('Mündung V0'), Units.fmt('speed', r.mvFps)], ['Zero', Units.fmt('range', r.zeroM)],
        [A.t('Drall'), '1:' + r.twistRate + '" ' + twistTxt], [A.t('Visierhöhe'), r.sightHeightCm + ' cm']
      ];
      const wxNowRows = [[A.t('Temperatur'), Units.fmt('temp', wc.tC)], [A.t('Luftdruck'), Units.fmt('pres', wc.pHpa)], [A.t('Luftfeuchte'), wc.rh + ' %']];
      const wxZeroRows = [[A.t('Temperatur'), Units.fmt('temp', wz.tC)], [A.t('Luftdruck'), Units.fmt('pres', wz.pHpa)], [A.t('Luftfeuchte'), wz.rh + ' %']];

      // Wind
      const sg = A.state.segments;
      let windRows;
      if (sg.enabled) {
        const lo = [0]; for (let i = 0; i < sg.count - 1; i++) lo.push(sg.bounds[i] || 0);
        const hi = []; for (let i = 0; i < sg.count - 1; i++) hi.push(sg.bounds[i] || 0); hi.push(t.max);
        windRows = [[A.t('Modus'), A.t('Segmente') + ' · ' + sg.name]];
        for (let i = 0; i < sg.count; i++) {
          const w0 = sg.winds[i] || { ms: 0, dir: 0 };
          windRows.push([Units.num('range', lo[i]) + '–' + Units.num('range', Math.min(hi[i], t.max)) + ' ' + Units.lbl('range'),
            Units.fmt('wind', w0.ms) + ' · ' + Math.round(w0.dir) + '°']);
        }
      } else {
        windRows = [[A.t('Modus'), A.t('Gleichmäßig')], [A.t('Stärke'), Units.fmt('wind', A.state.windMs)], [A.t('Richtung'), Math.round(A.state.windDir) + '°']];
      }

      const ret = A.state.reticle;
      const retRows = [[A.t('Einheit'), A.state.units.angle], [A.t('Bildebene'), ret.plane], [A.t('Absehen'), ret.type], [A.t('Schusswinkel'), angle + '°']];

      let kennRows;
      try { const d = B.diagnostics(); kennRows = [[A.t('Zero-Winkel'), d.aZeroMrad.toFixed(2) + ' mrad'], [A.t('Luftdichte ρ'), d.rho.toFixed(3) + ' kg/m³'], [A.t('Schallgeschw.'), d.cs.toFixed(0) + ' m/s'], [A.t('Stabilität SG'), d.sg.toFixed(2)]]; }
      catch (e) { kennRows = [['—', '—']]; }

      // ---- Tabelle (cleane Schrittweite, max. ~14 Zeilen für 1 Blatt) ----
      const niceSteps = [25, 50, 100, 150, 200, 250, 300, 400, 500];
      const stepO = niceSteps.find(x => t.max / x <= 14) || 500;
      const cols = [
        { k: 'elev', label: 'Höhe' }, { k: 'wind', label: 'Seite' }, { k: 'drop', label: 'Abfall' },
        { k: 'speed', label: 'Tempo' }, { k: 'energy', label: 'Energie' }, { k: 'tof', label: 'Flugzeit' }
      ];
      const colU = k => (k === 'elev' || k === 'wind') ? Units.corrShort() : k === 'drop' ? 'cm' : k === 'speed' ? Units.lbl('speed') : k === 'energy' ? Units.lbl('energy') : k === 'tof' ? 's' : '';
      const cell = (c, row) => {
        if (c.k === 'elev') return row.range === 0 ? '–' : '▲' + Units.corr(row.elevMrad).num;
        if (c.k === 'wind') return row.range === 0 ? '–' : (row.windDir + ' ' + Units.corr(row.windMrad).num);
        if (c.k === 'drop') return 'D ' + (Math.abs(row.dropCm) < 0.05 ? '0.0' : row.dropCm.toFixed(row.dropCm < 100 ? 1 : 0));
        if (c.k === 'speed') return Units.num('speed', row.speedFps);
        if (c.k === 'energy') return Units.num('energy', row.energyJ);
        if (c.k === 'tof') return row.tof.toFixed(3);
        return '';
      };
      const trows = B.tableRows(t.max, stepO, angle, windFn);
      const thead = '<th>' + A.t('Distanz') + '<br><span class="u">' + Units.lbl('range') + '</span></th>' + cols.map(c => '<th>' + A.t(c.label) + '<br><span class="u">' + colU(c.k) + '</span></th>').join('');
      const tbody = trows.map(row => '<tr><td class="rng">' + Units.num('range', row.range) + '</td>' + cols.map(c => '<td>' + cell(c, row) + '</td>').join('') + '</tr>').join('');

      // ---- Grafiken (Graustufen-Sparklines) ----
      const charts = [
        { id: 'drop', label: 'Abfall', uf: 'cm', get: rr => rr.dropCm, flip: true },
        { id: 'elev', label: 'Höhe', uf: Units.corrShort(), get: rr => parseFloat(Units.corr(rr.elevMrad).num), flip: true },
        { id: 'wind', label: 'Seite', uf: 'cm', get: rr => rr.totalSideCm, flip: true },
        { id: 'speed', label: 'Tempo', uf: Units.lbl('speed'), get: rr => parseFloat(Units.num('speed', rr.speedFps)), flip: false }
      ];
      const gmax = t.max, stepG = Math.max(10, Math.round(gmax / 60 / 5) * 5), grows = [];
      for (let rg = 0; rg <= gmax; rg += stepG) grows.push(B.solve({ range: rg, windFn, angleDeg: angle }));
      const fmtAx = v => { if (Math.abs(v) < 0.05) v = 0; return Math.abs(v) >= 100 ? Math.round(v) : (Math.round(v * 10) / 10); };
      function spark(get, flip) {
        const vals = grows.map(get); let mn = Math.min(...vals), mx = Math.max(...vals);
        if (mx === mn) mx = mn + 1; const pad = (mx - mn) * 0.08, lo = mn - pad, hi = mx + pad, n = grows.length;
        const d = grows.map((row, i) => { const x = (i / (n - 1)) * 100, frac = (get(row) - lo) / (hi - lo), y = flip ? frac * 100 : 100 - frac * 100; return (i ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2); }).join(' ');
        return { d, mn, mx };
      }
      const graphsHtml = charts.map(c => {
        const sp = spark(c.get, c.flip); const topVal = c.flip ? sp.mn : sp.mx, botVal = c.flip ? sp.mx : sp.mn;
        return `<div class="gbox"><div class="gh"><span>${A.t(c.label)}</span><span class="gu">${c.uf}</span></div>
          <div class="gplot"><div class="gax"><span>${fmtAx(topVal)}</span><span>${fmtAx(botVal)}</span></div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="0" y1="50" x2="100" y2="50" stroke="#d8d8d8" stroke-width="0.6"/><line x1="0" y1="100" x2="100" y2="100" stroke="#9a9a9a" stroke-width="0.9"/><path d="${sp.d}" fill="none" stroke="#111" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg></div>
          <div class="gxr"><span>0</span><span>${Units.num('range', gmax)} ${Units.lbl('range')}</span></div></div>`;
      }).join('');

      const logo = (window.KR_PRINT_LOGO || '');
      const unitsSummary = Units.corrShort() + ' · cm · ' + Units.lbl('speed') + ' · ' + Units.lbl('energy') + ' · s';

      return `<!DOCTYPE html><html lang="${isEN ? 'en' : 'de'}"><head><meta charset="UTF-8"><title>${A.t('Gesamtübersicht')} · ${profName}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        @page{size:A4 portrait;margin:9mm;}
        body{font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff;font-size:8.4pt;line-height:1.32;position:relative;}
        img.gs{filter:grayscale(1) contrast(1.04);-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        .wmark{position:fixed;right:2mm;bottom:3mm;width:58mm;opacity:.055;pointer-events:none;z-index:0;}
        .sheet{position:relative;z-index:1;}
        /* Header */
        .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:2.4pt solid #111;padding-bottom:5px;margin-bottom:7px;}
        .hd .hl{display:flex;align-items:center;gap:10px;min-width:0;}
        .hd .logo{height:14mm;width:auto;flex:0 0 auto;}
        .hd h1{font-size:18pt;letter-spacing:.4px;text-transform:uppercase;line-height:.95;}
        .hd .sub{font-size:7.6pt;color:#444;text-transform:uppercase;letter-spacing:.5px;margin-top:3px;}
        .hd .meta{text-align:right;font-size:7.8pt;line-height:1.5;color:#222;white-space:nowrap;}
        .hd .meta b{font-size:9pt;letter-spacing:.3px;}
        .hd .meta .gps{font-variant-numeric:tabular-nums;}
        /* Boxes */
        .grid{display:grid;gap:2.6mm;margin-bottom:2.6mm;}
        .g4{grid-template-columns:repeat(4,1fr);}
        .g3{grid-template-columns:1.6fr 1fr 1fr;}
        .box{border:0.8pt solid #111;border-radius:1mm;overflow:hidden;break-inside:avoid;}
        .box-h{background:#111;color:#fff;font-size:7pt;font-weight:bold;letter-spacing:.8px;text-transform:uppercase;padding:2.4px 5px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        table.kv{width:100%;border-collapse:collapse;}
        table.kv td{padding:1.8px 5px;vertical-align:top;border-top:0.5pt solid #e2e2e2;}
        table.kv tr:first-child td{border-top:0;}
        table.kv td.k{color:#555;width:46%;font-size:7.4pt;}
        table.kv td.v{text-align:right;font-weight:bold;font-variant-numeric:tabular-nums;}
        /* Graphs */
        .graphs{display:grid;grid-template-columns:repeat(4,1fr);gap:2.6mm;margin-bottom:2.6mm;}
        .gbox{border:0.8pt solid #111;border-radius:1mm;overflow:hidden;break-inside:avoid;}
        .gh{display:flex;justify-content:space-between;align-items:baseline;background:#ececec;padding:2px 5px;border-bottom:0.6pt solid #111;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        .gh span:first-child{font-weight:bold;font-size:7.6pt;text-transform:uppercase;letter-spacing:.4px;}
        .gh .gu{font-size:6.6pt;color:#555;}
        .gplot{display:flex;height:18mm;padding:1mm 1mm 0;}
        .gplot .gax{display:flex;flex-direction:column;justify-content:space-between;font-size:6pt;color:#666;text-align:right;padding-right:1mm;font-variant-numeric:tabular-nums;width:8mm;}
        .gplot svg{flex:1;height:100%;}
        .gxr{display:flex;justify-content:space-between;font-size:6pt;color:#666;padding:0.6mm 5px 1.2mm;font-variant-numeric:tabular-nums;}
        /* Table */
        .tbl-h{font-size:7.4pt;font-weight:bold;letter-spacing:.9px;text-transform:uppercase;margin:0 0 2mm;color:#111;border-bottom:0.8pt solid #111;padding-bottom:1.4mm;}
        table.bt{width:100%;border-collapse:collapse;font-size:7.8pt;}
        table.bt th{border:0.6pt solid #111;padding:2.6px 2px;background:#111;color:#fff;font-size:6.6pt;text-transform:uppercase;letter-spacing:.3px;line-height:1.15;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        table.bt th .u{font-weight:normal;font-size:5.8pt;color:#cfcfcf;letter-spacing:.2px;}
        table.bt td{border:0.6pt solid #555;padding:2.4px 2px;text-align:center;font-variant-numeric:tabular-nums;}
        table.bt td.rng{font-weight:bold;background:#f0f0f0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        table.bt tr:nth-child(even) td{background:#f6f6f6;}
        table.bt tr:nth-child(even) td.rng{background:#e7e7e7;}
        .foot{margin-top:3mm;font-size:6.6pt;color:#333;border-top:0.6pt solid #111;padding-top:1.6mm;display:flex;justify-content:space-between;letter-spacing:.3px;}
        /* Bildschirm-Werkzeugleiste — wird beim Drucken/PDF ausgeblendet */
        .toolbar{position:sticky;top:0;left:0;right:0;z-index:20;display:flex;gap:10px;align-items:center;justify-content:flex-start;
          padding:10px 12px;margin:-9mm -9mm 6mm;background:#14110B;border-bottom:2px solid #000;}
        .toolbar .tb-spacer{flex:1;}
        .toolbar button{font-family:Arial,Helvetica,sans-serif;font-size:11pt;font-weight:bold;letter-spacing:.4px;
          text-transform:uppercase;padding:11px 18px;border:0;border-radius:4px;cursor:pointer;min-height:44px;}
        .toolbar .tb-print{background:#B26A3E;color:#fff;}
        .toolbar .tb-print:active{background:#8a4f2c;}
        .toolbar .tb-back,.toolbar .tb-close{background:transparent;color:#EFE8D6;border:1px solid #6b6052;}
        .toolbar .tb-back:active,.toolbar .tb-close:active{background:#2a2419;}
        @media print{ .toolbar{display:none !important;} body{padding:0 !important;} .wmark{opacity:.05;} }
        @media screen{ body{max-width:200mm;margin:0 auto;padding:0 6mm 14mm;} }
      </style></head><body>
      <div class="toolbar">
        <button type="button" class="tb-back" onclick="window.close()">${A.t('← Zurück')}</button>
        <span class="tb-spacer"></span>
        <button type="button" class="tb-close" onclick="window.close()">${A.t('Schließen')}</button>
        <button type="button" class="tb-print" onclick="window.print()">${A.t('Drucken / PDF')}</button>
      </div>
      ${logo ? `<img class="wmark gs" src="${logo}" alt="">` : ''}
      <div class="sheet">
        <div class="hd">
          <div class="hl">${logo ? `<img class="logo gs" src="${logo}" alt="KR">` : ''}
            <div><h1>${A.t('Gesamtübersicht')}</h1><div class="sub">${A.t('Profil')} ${profName} · ${b.mfr} ${b.name} · ${b.caliberMm} mm</div></div></div>
          <div class="meta"><b>Ballistikrechner 3.0</b><br>${dt}<br><span class="gps">${gps}</span></div>
        </div>
        <div class="grid g4">
          ${box(A.t('Geschoss'), bulletRows)}
          ${box(A.t('Gewehr'), rifleRows)}
          ${box(A.t('Wetter · Aktuell'), wxNowRows)}
          ${box(A.t('Wetter · Zeroing'), wxZeroRows)}
        </div>
        <div class="grid g3">
          ${box(A.t('Wind'), windRows)}
          ${box(A.t('Absehen'), retRows)}
          ${box(A.t('Kennwerte'), kennRows)}
        </div>
        <div class="graphs">${graphsHtml}</div>
        <div class="tbl-h">${A.t('Ballistik-Tabelle')} · 0–${Units.num('range', t.max)} ${Units.lbl('range')} · ${A.t('Schritt')} ${stepO} · ${A.t('Winkel')} ${angle}°</div>
        <table class="bt"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
        <div class="foot"><span>KR · Ballistikrechner 3.0 — ${A.t('Gesamtübersicht')}</span><span>${A.t('Einheiten:')} ${unitsSummary}</span></div>
      </div>
      </body></html>`;
    }
  }

  function buildHits() {
    const s = screen('hits', 'Trefferauswertung', '<div></div>', '');
    if (window.HitsScreen) window.HitsScreen.mount(s, A);
  }

  function buildInfo() {
    // interaktive Variable: v(symbol, erklärung)
    const v = (sym, info) => `<span class="v" data-info="${info.replace(/"/g, '&quot;')}">${sym}</span>`;
    const body = `
      <div class="fx-intro">Der Rechner löst keine Faustformel, sondern integriert die <b>echte Flugbahn</b> als Punktmasse Schritt für Schritt (Euler, Δt = 1 ms) — mit luftdichteabhängigem Luftwiderstand aus der <b>G7/G1-Widerstandstabelle</b>. Fahr über jeden <span style="color:var(--copper-bright)">farbigen Buchstaben</span> für die Erklärung.</div>
      <div class="fx-legend"><span class="dotv">Symbol</span> antippen oder mit Maus berühren → Erklärung</div>

      <div class="fx-card">
        <div class="fx-head"><div class="fx-title">Luftwiderstand</div><div class="fx-tag">Kerngleichung</div></div>
        <div class="eq">${v('a', 'Verzögerung des Geschosses durch Luftwiderstand (m/s²). Wird in jedem Zeitschritt neu berechnet und bremst entlang der Flugrichtung.')} <span class="op">=</span> <span class="frac"><span class="num">1</span><span class="den">2</span></span> <span class="op">·</span> ${v('ρ', 'Luftdichte (kg/m³). Hängt von Temperatur, Luftdruck und Feuchte ab — siehe Karte „Luftdichte". Dichtere Luft = mehr Widerstand.')} <span class="op">·</span> <span class="frac"><span class="num">π</span><span class="den">4·${v('BC', 'Ballistischer Koeffizient (kg/m²). Beschreibt, wie gut das Geschoss die Luft „schneidet". Höherer BC = weniger Abbremsung. Aus dem Profil, z. B. G7 0.396.')}</span></span> <span class="op">·</span> ${v('C', 'Widerstandsbeiwert C_d. Wird machabhängig aus der G7- bzw. G1-Tabelle interpoliert — er steigt stark im Überschall-/Transschallbereich.')}<sub>d</sub>(${v('M', 'Mach-Zahl = v / Schallgeschwindigkeit. Bestimmt, welcher C_d-Wert aus der Tabelle gilt.')}) <span class="op">·</span> ${v('v', 'Momentane Geschwindigkeit des Geschosses (m/s). Geht im Quadrat ein — bei doppeltem Tempo vervierfacht sich der Widerstand.')}<sup>2</sup></div>
        <div class="fx-note">Diese Beschleunigung wird auf die Flugrichtung verteilt: aₓ = −a·vₓ/v, a_y = −a·v_y/v − g.</div>
      </div>

      <div class="fx-card">
        <div class="fx-head"><div class="fx-title">Luftdichte</div><div class="fx-tag">Atmosphäre</div></div>
        <div class="eq">${v('ρ', 'Resultierende Luftdichte (kg/m³) — Summe aus trockenem Luft- und Wasserdampf-Anteil.')} <span class="op">=</span> <span class="frac"><span class="num">${v('p', 'Partialdruck der trockenen Luft (Pa) = Gesamtdruck − Dampfdruck.')}<sub>d</sub></span><span class="den">${v('R', 'Spezifische Gaskonstante trockener Luft = 287.06 J/(kg·K).')} · ${v('T', 'Absolute Temperatur in Kelvin = °C + 273.15.')}</span></span> <span class="op">+</span> <span class="frac"><span class="num">${v('p', 'Partialdruck des Wasserdampfs (Pa) = (rel. Feuchte / 100) · Sättigungsdampfdruck.')}<sub>w</sub></span><span class="den">${v('R', 'Gaskonstante für Wasserdampf = 461.5 J/(kg·K).')}<sub>v</sub> · ${v('T', 'Absolute Temperatur in Kelvin.')}</span></span></div>
        <div class="fx-note">Feuchte Luft ist leichter als trockene — deshalb wird der Dampfanteil getrennt gerechnet. Der Sättigungsdruck folgt der Magnus-Formel pₛ = 6.108·10^(7.5·t/(237.3+t)).</div>
      </div>

      <div class="fx-card">
        <div class="fx-head"><div class="fx-title">Schall & Mach</div><div class="fx-tag">Transschall</div></div>
        <div class="eq">${v('c', 'Schallgeschwindigkeit in der aktuellen Luft (m/s). Steigt mit der Temperatur.')}<sub>s</sub> <span class="op">=</span> 331.3 <span class="op">·</span> <span style="font-size:1.3em">√</span><span style="border-top:1px solid var(--fg-faint);padding:0 4px">1 <span class="op">+</span> <span class="frac"><span class="num">${v('t', 'Lufttemperatur in °C.')}</span><span class="den">273.15</span></span></span></div>
        <div class="fx-note">Die Mach-Zahl M = v / c_s entscheidet, welcher Widerstandsbeiwert gilt. Um Mach 1 (Transschall) steigt der Widerstand sprunghaft.</div>
      </div>

      <div class="fx-card">
        <div class="fx-head"><div class="fx-title">Schritt-Integration</div><div class="fx-tag">Euler · Δt = 1 ms</div></div>
        <div class="eq">${v('v', 'Geschwindigkeitsvektor. Wird je Achse fortgeschrieben: v += a·Δt.')}′ <span class="op">=</span> ${v('v', 'Geschwindigkeit im aktuellen Schritt.')} <span class="op">+</span> ${v('a', 'Gesamtbeschleunigung = Luftwiderstand + Schwerkraft g.')} <span class="op">·</span> ${v('Δt', 'Zeitschritt = 0,001 s. So fein, dass die Bahn praktisch exakt abgebildet wird.')}</div>
        <div class="eq" style="padding-top:2px">${v('x', 'Position des Geschosses. Wird ebenfalls je Schritt fortgeschrieben.')}′ <span class="op">=</span> ${v('x', 'Position im aktuellen Schritt.')} <span class="op">+</span> ${v('v', 'Geschwindigkeit in dieser Achse.')} <span class="op">·</span> ${v('Δt', 'Zeitschritt 1 ms.')}</div>
        <div class="fx-note">Tausende solcher Mini-Schritte ergeben die komplette Flugbahn — inklusive Restgeschwindigkeit und Flugzeit an jedem Meter.</div>
      </div>

      <div class="fx-card">
        <div class="fx-head"><div class="fx-title">Höhenkorrektur</div><div class="fx-tag">Klicks · 0,1 mrad</div></div>
        <div class="eq">${v('E', 'Höhenkorrektur in 0,1-mrad-Klicks (UP). Das stellst du am Turm ein.')} <span class="op">=</span> <span class="frac"><span class="num">${v('D', 'Geschossabfall unter der Visierlinie (cm) an der Zieldistanz.')}</span><span class="den">${v('L', 'Zieldistanz in Metern, geteilt durch 100 → cm pro 0,1 mrad.')} / 100</span></span> <span class="op">·</span> cos(${v('α', 'Schusswinkel (bergauf/bergab). Nur die waagerechte Komponente „zählt" für den Abfall — daher der Kosinus.')})</div>
        <div class="fx-note">1 mrad = 10 cm auf 100 m. Der Kosinus-Faktor sorgt dafür, dass du bei steilen Berg- oder Talschüssen weniger hoch halten musst.</div>
      </div>

      <div class="fx-card">
        <div class="fx-head"><div class="fx-title">Seite: Wind & Drall</div><div class="fx-tag">Spindrift · Litz</div></div>
        <div class="eq">${v('s', 'Seitliche Drift durch den Drall (Spindrift) in cm. Bei Rechtsdrall driftet das Geschoss nach rechts.')} <span class="op">=</span> 1.25 <span class="op">·</span> (${v('S', 'Gyroskopische Stabilität (Miller-Formel) aus Geschossmasse, -länge, Kaliber und Drallrate.')}<sub>g</sub> <span class="op">+</span> 1.2) <span class="op">·</span> ${v('T', 'Flugzeit bis zum Ziel (s). Je länger das Geschoss fliegt, desto mehr Drift.')}<sub>f</sub><sup>1.83</sup></div>
        <div class="fx-note">Der Seitenwind wird zusätzlich über die ganze Bahn integriert (Lag-Time-Modell): langsamere Geschosse „hängen" länger im Wind und werden stärker versetzt. Beides zusammen ergibt die Seitenkorrektur.</div>
      </div>

      <div class="fx-card">
        <div class="fx-head"><div class="fx-title">Auftreffenergie</div><div class="fx-tag">Wumms</div></div>
        <div class="eq">${v('E', 'Bewegungsenergie des Geschosses am Ziel (Joule).')} <span class="op">=</span> <span class="frac"><span class="num">1</span><span class="den">2</span></span> <span class="op">·</span> ${v('m', 'Geschossmasse in kg (aus grain umgerechnet: 1 gr = 0,0648 g).')} <span class="op">·</span> ${v('v', 'Restgeschwindigkeit am Ziel (m/s) aus der Integration.')}<sup>2</sup></div>
        <div class="fx-note">Die Geschwindigkeit geht im Quadrat ein — sie bestimmt die Energie weit stärker als die Masse.</div>
      </div>`;
    screen('info', 'Gut zu Wissen', body, '');
  }

  function init() {
    buildGun(); buildWx(); buildProfiles(); buildTable(); buildGraphs(); buildWind(); buildSettings(); buildMainSettings(); buildInfo(); buildHits();
    // Alle frisch gebauten Screens in die aktive Sprache bringen
    try {
      const lang = (A.state.prefs && A.state.prefs.lang) || 'de';
      if (lang !== 'de' && A.applyLang) A.applyLang(lang);
    } catch (e) {}
    // generische Segment-Button-Logik
    document.addEventListener('click', e => {
      const btn = e.target.closest('.seg button'); if (!btn) return;
      const grp = btn.closest('.seg'); grp.querySelectorAll('button').forEach(b => b.classList.remove('on')); btn.classList.add('on');
    });
  }
  window.Screens = { init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
