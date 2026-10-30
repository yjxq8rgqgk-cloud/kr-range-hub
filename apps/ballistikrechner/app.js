/* ============================================================
   Ballistikrechner 3.0 — App-Controller (Dashboard + Router)
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const B = window.Ballistics;

  const state = {
    range: 300, windMs: 0, windDir: 0, angle: 0,
    reticle: { unit: 'MRAD', plane: 'FFP', type: 'MRAD-HASH' },
    segments: { enabled: false, name: 'Stand 1', count: 3, bounds: [300, 700], winds: [{ ms: 2, dir: 270 }, { ms: 4, dir: 270 }, { ms: 6, dir: 270 }] },
    table: { max: 1200, step: 100, angle: 0 },
    graph: { max: 300 },
    ammoLib: [
      { id: 'h7', model: 'G7', mfr: 'KR Firearms', name: 'FMJ', bc: 0.396, weightGr: 148, caliberMm: 7.62, lengthMm: 24, mv: 2838, tw: 11, builtin: true },
      { id: 'p308175', model: 'G7', mfr: 'Sierra', name: 'MatchKing', bc: 0.243, weightGr: 175, caliberMm: 7.62, lengthMm: 31, mv: 2600, tw: 11, builtin: true },
      { id: 'p65140', model: 'G7', mfr: 'Hornady', name: 'ELD-M', bc: 0.326, weightGr: 140, caliberMm: 6.5, lengthMm: 33, mv: 2750, tw: 8, builtin: true },
      { id: 'p223', model: 'G7', mfr: 'Sierra', name: 'TMK', bc: 0.205, weightGr: 77, caliberMm: 5.69, lengthMm: 24, mv: 2750, tw: 7, builtin: true }
    ],
    profiles: [{ id: 'pr1', name: 'H7 .308', snap: null }],
    activeProfile: 'pr1',
    prefs: { theme: 'dark', lang: (window.KRHubLang ? window.KRHubLang.get() : 'de') },
    units: { range: 'M', angle: '0.1 MRAD', sight: 'CM', mv: 'FPS', wind: 'M/S', temp: 'C', pres: 'HPA', energy: 'J' },
    hits: {
      shots: [],
      meta: { weapon: '', ammo: '', caliber: '' },
      geom: { tenMm: 50, ringMm: 25, discMm: 500, klickMm: 20 },
      outlier: 3.5,
      zoom: 1,
      shown: false
    }
  };
  window.App = { state, $, $$, B };
  if (window.Units) Units.ensure(state);

  const canvas = $('#reticle');

  // ---------- Wind-Funktion (uniform oder segmentiert) ----------
  function segBounds() {
    const s = state.segments;
    const lo = [0]; for (let i = 0; i < s.count - 1; i++) lo.push(s.bounds[i] || 0);
    const hi = []; for (let i = 0; i < s.count - 1; i++) hi.push(s.bounds[i] || 0); hi.push(1300);
    return { lo, hi };
  }
  function buildWindFn() {
    const s = state.segments;
    if (!s.enabled) return B.uniformWindFn(state.windMs, state.windDir);
    const { lo, hi } = segBounds();
    return function (x) {
      for (let i = 0; i < s.count; i++) {
        if (x >= lo[i] && x < hi[i]) {
          const w = s.winds[i] || { ms: 0, dir: 0 };
          return w.ms * Math.sin(w.dir * Math.PI / 180);
        }
      }
      const w = s.winds[s.count - 1] || { ms: 0, dir: 0 };
      return w.ms * Math.sin(w.dir * Math.PI / 180);
    };
  }
  window.App.buildWindFn = buildWindFn;

  // ---------- Dial-Ticks ----------
  function drawTicks(svgGroup) {
    let html = '';
    for (let d = 0; d < 360; d += 30) {
      const a = (d - 90) * Math.PI / 180, r1 = 50, r2 = (d % 90 === 0) ? 42 : 46;
      html += `<line x1="${(60 + Math.cos(a) * r1).toFixed(1)}" y1="${(60 + Math.sin(a) * r1).toFixed(1)}" x2="${(60 + Math.cos(a) * r2).toFixed(1)}" y2="${(60 + Math.sin(a) * r2).toFixed(1)}"/>`;
    }
    svgGroup.innerHTML = html;
  }
  drawTicks($('#dialTicks'));

  // ---------- Render Dashboard ----------
  function fmtDrop(cm) { return 'D ' + cm.toFixed(cm < 100 ? 1 : 0) + ' cm'; }

  function render() {
    const wf = buildWindFn();
    const s = B.solve({ range: state.range, windFn: wf, angleDeg: state.angle });

    // Höhen-/Seitenkorrektur in gewählter Einheit
    const ce = Units.corr(s.elevMrad), cw = Units.corr(s.windMrad);
    $('#elevNum').textContent = ce.num;
    $('#windNum').textContent = cw.num;
    $('#elevUnit').textContent = ce.unit;
    $('#windUnit').textContent = cw.unit;
    $('#windDir').textContent = (s.windDir === 'L' ? '◀ L' : 'R ▶');
    $('#rangeNum').textContent = Units.num('range', s.range);
    $('#rangeUnitBig').textContent = Units.lbl('range');
    updateChips();
    $('#fDrop').textContent = fmtDrop(s.dropCm);
    $('#fSpeed').textContent = Units.fmt('speed', s.speedFps);
    $('#fEnergy').textContent = Units.fmt('energy', s.energyJ);
    $('#fTof').textContent = s.tof.toFixed(2) + ' s';
    $('#rVal').textContent = Units.num('range', state.range);
    $('#rValU').textContent = Units.lbl('range');

    // wind card
    if (state.segments.enabled) {
      $('#wSpeed').textContent = 'Multi';
      $('#wSpeed').style.fontSize = '22px';
      $('#windCv').textContent = state.segments.count + ' ' + t('Segmente');
      $('#wDirTxt').textContent = state.segments.name + ' · ' + t('segmentierter Wind');
    } else {
      $('#wSpeed').style.fontSize = '';
      $('#wSpeed').textContent = Units.num('wind', state.windMs);
      $('#windCv').textContent = Units.fmt('wind', state.windMs) + ' · ' + Math.round(state.windDir) + '°';
      $('#wDirTxt').textContent = state.windMs > 0
        ? (t('Richtung') + ' ' + Math.round(state.windDir) + '° · ' + clockTxt(state.windDir))
        : (t('Richtung') + ' ' + Math.round(state.windDir) + '° · ' + t('kein Wind'));
    }
    $('#wSpeed2').textContent = Units.fmt('wind', state.windMs);
    $('#wSpeedU').textContent = Units.lbl('wind');
    $('#angleCv').textContent = state.angle + '°';
    if (document.activeElement !== $('#angleInput')) $('#angleInput').value = state.angle;
    $('#dialNeedle').setAttribute('transform', `rotate(${state.windDir} 60 60)`);

    refreshConfigUI();

    const lad = B.ladder(state.graph.max, wf, 0, state.angle, 9);
    Reticle.draw(canvas, s, lad, { type: state.reticle.type, sun: (state.prefs && state.prefs.theme === 'sun') });
    persist();
  }
  window.App.render = render;

  // ---------- Reticle-Chips (Maßeinheit / Bildebene / Absehen-Typ) ----------
  const ANGLE_UNITS = ['0.1 MRAD', 'MRAD', '1/4 MOA', 'MOA'];
  const chipOpts = { plane: ['FFP', 'SFP'], type: ['MRAD-HASH', 'DUPLEX', 'MIL-DOT'] };
  function updateChips() {
    $('#chipUnit').querySelector('.mc-val').textContent = state.units.angle;
    $('#chipPlane').querySelector('.mc-val').textContent = state.reticle.plane;
    $('#chipType').querySelector('.mc-val').textContent = state.reticle.type;
  }
  function cycleChip(key) {
    if (key === 'unit') {
      const i = ANGLE_UNITS.indexOf(state.units.angle);
      state.units.angle = ANGLE_UNITS[(i + 1) % ANGLE_UNITS.length];
      render(); persist();
      toast('Korrektur-Einheit: ' + state.units.angle);
      return;
    }
    const a = chipOpts[key];
    state.reticle[key] = a[(a.indexOf(state.reticle[key]) + 1) % a.length];
    render();
    if (key === 'plane') toast(state.reticle.plane === 'SFP' ? 'SFP: Absehen-Maße gelten nur bei max. Vergrößerung.' : 'FFP: Absehen-Maße gelten bei jeder Vergrößerung.');
    if (key === 'type') toast('Absehen: ' + state.reticle.type);
  }

  function refreshConfigUI() {
    const b = B.config.bullet, r = B.config.rifle, wc = B.config.weatherCurrent;
    const ap = state.profiles && state.profiles.find(p => p.id === state.activeProfile);
    $('#pName').textContent = (ap && ap.name) ? ap.name : B.config.id;
    $('#pMeta').textContent = [
      [b.mfr, b.name].filter(Boolean).join(' '),
      b.weightGr ? b.weightGr + ' gr' : '',
      b.caliberMm ? b.caliberMm + ' mm' : ''
    ].filter(Boolean).join(' · ');
    $('#spName').textContent = b.mfr + ' · ' + b.name;
    $('#spBC').textContent = b.model + ' · ' + b.bc;
    $('#spWt').textContent = b.weightGr + ' gr · ' + b.caliberMm + ' mm';
    $('#spMV').textContent = Units.fmt('speed', r.mvFps) + ' · ' + Units.num('range', r.zeroM) + ' ' + Units.lbl('range');
    $('#spTw').textContent = '1:' + r.twistRate + '" ' + t({ right: 'rechts', left: 'links', smooth: 'glatt' }[r.twist]);
    $('#wxT').textContent = Units.fmt('temp', wc.tC);
    $('#wxP').textContent = Units.num('pres', wc.pHpa);
    $('#wxPU').textContent = Units.lbl('pres');
    $('#wxH').textContent = wc.rh + '%';
  }
  window.App.refreshConfigUI = refreshConfigUI;

  function clockTxt(deg) {
    const d = ['Gegenwind', 'von 1–2 Uhr', 'von rechts', 'von 4–5 Uhr', 'Rückenwind', 'von 7–8 Uhr', 'von links', 'von 10–11 Uhr'];
    return t(d[Math.round(deg / 45) % 8]);
  }
  window.App.clockTxt = clockTxt;

  // ---------- Distanz ----------
  function syncSlider(sel, v) { const el = $(sel); if (el) { el.value = v; el.setAttribute('value', v); } }
  $('#rangeSlider').addEventListener('input', e => { state.range = +e.target.value; e.target.setAttribute('value', state.range); render(); });
  $$('[data-rstep]').forEach(b => b.addEventListener('click', () => {
    state.range = Math.max(0, Math.min(1200, state.range + (+b.dataset.rstep)));
    syncSlider('#rangeSlider', state.range); render();
  }));
  $('#windSlider').addEventListener('input', e => { state.windMs = +e.target.value; e.target.setAttribute('value', state.windMs); state.segments.enabled = false; render(); });
  function clampAngle(v) { return Math.max(-60, Math.min(60, Math.round(v || 0))); }
  $('#angleInput').addEventListener('input', e => { state.angle = clampAngle(+e.target.value); render(); });
  $('#angleInput').addEventListener('blur', e => { state.angle = clampAngle(+e.target.value); e.target.value = state.angle; render(); });
  document.querySelectorAll('[data-astep]').forEach(b => b.addEventListener('click', () => {
    state.angle = clampAngle(state.angle + (+b.dataset.astep));
    $('#angleInput').value = state.angle; render();
  }));

  // ---------- Wind-Dial ----------
  attachDial($('#dial'), () => state.windDir, v => { state.windDir = v; state.segments.enabled = false; render(); });
  function attachDial(el, get, set) {
    let drag = false;
    function ang(ev) {
      const r = el.getBoundingClientRect(), pt = ev.touches ? ev.touches[0] : ev;
      let deg = Math.atan2(pt.clientX - (r.left + r.width / 2), -(pt.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
      set((Math.round(((deg + 360) % 360) / 5) * 5) % 360);
    }
    el.addEventListener('mousedown', e => { drag = true; ang(e); e.preventDefault(); });
    window.addEventListener('mousemove', e => { if (drag) { ang(e); e.preventDefault(); } });
    window.addEventListener('mouseup', () => drag = false);
    el.addEventListener('touchstart', e => { drag = true; ang(e); e.preventDefault(); }, { passive: false });
    window.addEventListener('touchmove', e => { if (drag) { ang(e); e.preventDefault(); } }, { passive: false });
    window.addEventListener('touchend', () => drag = false);
  }
  window.App.attachDial = attachDial;

  // ---------- solution tap ----------
  $('#solution').addEventListener('click', () => {
    const s = B.solve({ range: state.range, windFn: buildWindFn(), angleDeg: state.angle });
    toast('Drop ' + s.dropCm.toFixed(0) + ' cm · Drift ' + s.totalSideCm.toFixed(1) + ' cm · Mach ' + s.mach.toFixed(2) + ' · ' + s.tof.toFixed(2) + ' s');
  });

  // ---------- Router ----------
  function updateNavActive(screenId) {
    const map = { table: 'navTable', graphs: 'navGraph', wind: 'navWind', hits: 'navHits' };
    $$('.botnav button').forEach(b => b.classList.remove('on'));
    const activeId = screenId && map[screenId] ? map[screenId] : 'navHome';
    const el = document.getElementById(activeId);
    if (el) el.classList.add('on');
  }
  function openScreen(id) {
    const el = document.getElementById('scrn-' + id);
    if (el) {
      el.classList.add('on'); if (el._onOpen) el._onOpen();
      const lang = (state.prefs && state.prefs.lang) || 'de';
      if (lang !== 'de') translateNode(el, lang);
    }
    updateNavActive(id);
  }
  function closeScreen(id) {
    if (id) { const el = document.getElementById('scrn-' + id); if (el) el.classList.remove('on'); }
    else $$('.scrn.on').forEach(s => s.classList.remove('on'));
    // Refresh nav highlight based on remaining open screens
    const open = $$('.scrn.on');
    const topId = open.length ? open[open.length - 1].id.replace('scrn-', '') : null;
    updateNavActive(topId);
  }
  window.App.openScreen = openScreen;
  window.App.closeScreen = closeScreen;

  // chrome + nav triggers
  $('#openGun').addEventListener('click', () => openScreen('gun'));
  $('#openWx').addEventListener('click', () => openScreen('wx'));
  $('#btnProfiles').addEventListener('click', () => openScreen('profiles'));
  $('#btnSettings').addEventListener('click', () => openScreen('settings'));
  $('#btnMainSettings').addEventListener('click', () => openScreen('mainsettings'));
  $('#btnInfo').addEventListener('click', () => openScreen('info'));

  // ---------- Zielansprache-Toggle (Absehen ein-/ausblenden) ----------
  (function() {
    const hero = $('.hero');
    const btn  = $('#btnHero');
    function applyHero(visible) {
      hero.classList.toggle('hero-hidden', !visible);
      btn.classList.toggle('hero-on', visible);
      if (visible) requestAnimationFrame(() => { try { render(); } catch(e) {} });
    }
    // Beim App-Start immer eingeklappt — ohne Animation, damit nichts „zuklappt"
    hero.style.transition = 'none';
    applyHero(false);
    requestAnimationFrame(() => { hero.style.transition = ''; });
    btn.addEventListener('click', () => {
      const nowVisible = hero.classList.contains('hero-hidden');
      state.prefs = state.prefs || {};
      state.prefs.heroHidden = !nowVisible;
      applyHero(nowVisible);
      persist();
    });
  })();

  $('#navHome').addEventListener('click', () => { closeScreen(); updateNavActive(null); });
  $('#navTable').addEventListener('click', () => { closeScreen(); openScreen('table'); });
  $('#navGraph').addEventListener('click', () => { closeScreen(); openScreen('graphs'); });
  $('#navWind').addEventListener('click', () => { closeScreen(); openScreen('wind'); });
  // 'Treffer'-Tab entfernt — es gibt die eigenständige Trefferaufnahme-App im Hub.
  const _navHits = $('#navHits');
  if (_navHits) _navHits.addEventListener('click', () => { closeScreen(); openScreen('hits'); });
  $('#openWindSeg2').addEventListener('click', () => openScreen('wind'));
  $('#chipUnit').addEventListener('click', e => { if (e.target.closest('.mc-i')) return; cycleChip('unit'); });
  $('#chipPlane').addEventListener('click', e => { if (e.target.closest('.mc-i')) return; cycleChip('plane'); });
  $('#chipType').addEventListener('click', e => { if (e.target.closest('.mc-i')) return; cycleChip('type'); });

  // ---------- toast ----------
  let toastT;
  function toast(msg) {
    let t = $('#toast');
    if (!t) {
      t = document.createElement('div'); t.id = 'toast';
      t.style.cssText = 'position:absolute;left:50%;bottom:78px;transform:translateX(-50%);background:#2B2418;border:1px solid #5A4A30;color:#DCD0B5;font-family:var(--font-mono);font-size:11px;padding:9px 14px;border-radius:6px;z-index:120;max-width:88%;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.6);transition:opacity .2s;pointer-events:none;';
      $('.screen').appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(toastT); toastT = setTimeout(() => { t.style.opacity = '0'; }, 2200);
  }
  window.App.toast = toast;

  // ---------- Bestätigungsdialog ----------
  function confirmDialog(opts) {
    opts = opts || {};
    let m = $('#confirmModal');
    if (!m) {
      m = document.createElement('div'); m.id = 'confirmModal'; m.className = 'modal-scrim';
      m.innerHTML = '<div class="modal-box" role="dialog" aria-modal="true">' +
        '<div class="modal-title" id="cmTitle"></div><div class="modal-msg" id="cmMsg"></div>' +
        '<div class="modal-acts"><button class="kbtn ghost" id="cmCancel">Abbrechen</button>' +
        '<button class="kbtn danger" id="cmOk">Löschen</button></div></div>';
      $('.screen').appendChild(m);
    }
    m.querySelector('#cmTitle').textContent = opts.title || 'Bestätigen';
    m.querySelector('#cmMsg').textContent = opts.message || '';
    const okBtn = m.querySelector('#cmOk'); okBtn.textContent = opts.okLabel || 'Löschen';
    okBtn.classList.toggle('danger', opts.danger !== false);
    function close() { m.classList.remove('on'); }
    const onCancel = () => { close(); };
    const onOk = () => { close(); if (opts.onConfirm) opts.onConfirm(); };
    m.querySelector('#cmCancel').onclick = onCancel;
    okBtn.onclick = onOk;
    m.onclick = e => { if (e.target === m) onCancel(); };
    m.classList.add('on');
  }
  window.App.confirm = confirmDialog;

  // ---------- Eingabe-Dialog (Umbenennen o. Ä.) ----------
  function promptDialog(opts) {
    opts = opts || {};
    let m = $('#promptModal');
    if (!m) {
      m = document.createElement('div'); m.id = 'promptModal'; m.className = 'modal-scrim';
      m.innerHTML = '<div class="modal-box" role="dialog" aria-modal="true">' +
        '<div class="modal-title" id="pmTitle"></div><div class="modal-msg" id="pmMsg"></div>' +
        '<input type="text" id="pmInput" class="pm-input" autocomplete="off">' +
        '<div class="modal-acts"><button class="kbtn ghost" id="pmCancel">Abbrechen</button>' +
        '<button class="kbtn" id="pmOk">Speichern</button></div></div>';
      $('.screen').appendChild(m);
    }
    m.querySelector('#pmTitle').textContent = opts.title || 'Eingabe';
    const msg = m.querySelector('#pmMsg'); msg.textContent = opts.message || ''; msg.style.display = opts.message ? '' : 'none';
    const input = m.querySelector('#pmInput');
    input.value = opts.value || ''; input.placeholder = opts.placeholder || '';
    const okBtn = m.querySelector('#pmOk'); okBtn.textContent = opts.okLabel || 'Speichern';
    function close() { m.classList.remove('on'); }
    const onCancel = () => { close(); };
    const onOk = () => { const v = input.value.trim(); close(); if (opts.onConfirm) opts.onConfirm(v); };
    m.querySelector('#pmCancel').onclick = onCancel;
    okBtn.onclick = onOk;
    input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); onOk(); } else if (e.key === 'Escape') { onCancel(); } };
    m.onclick = e => { if (e.target === m) onCancel(); };
    m.classList.add('on');
    requestAnimationFrame(() => { input.focus(); input.select(); });
  }
  window.App.prompt = promptDialog;

  // ---------- Thema (Dark Mode / Sonnenlicht-Kontrast) ----------
  // Folgt der zentralen Hub-Einstellung (dunkel/hell), nicht mehr einem
  // eigenen In-App-Umschalter.
  function hubThemeMode() {
    if (!window.KRHubTheme) return 'dark';
    var t = KRHubTheme.get();
    if (t === 'system') {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    return t;
  }
  function applyTheme(theme) {
    state.prefs = state.prefs || {};
    state.prefs.theme = theme === 'light' ? 'sun' : 'dark';
    const scr = $('.screen');
    if (scr) scr.classList.toggle('theme-sun', state.prefs.theme === 'sun');
    // Absehen neu zeichnen — andere Kontrastfarben je Thema
    try { render(); } catch (e) {}
  }
  window.App.applyTheme = applyTheme;
  applyTheme(hubThemeMode());
  window.addEventListener('storage', function (e) {
    if (!e || e.key == null || e.key === 'kr-hub-theme') applyTheme(hubThemeMode());
  });

  // ---------- Sprache (Deutsch / English) ----------
  // Englisch kommt aus i18n-en.js (Text + Tooltips).
  const EN_TEXT = (window.I18N_EN && window.I18N_EN.text) || {};
  const EN_INFO = (window.I18N_EN && window.I18N_EN.info) || {};
  const DICT_TEXT = { en: EN_TEXT };
  const DICT_INFO = { en: EN_INFO };

  // Kanonisches Deutsch je Knoten/Element — Übersetzen ist damit idempotent & umkehrbar,
  // egal von welcher Sprache aus. Die Trefferauswertung (#scrn-hits) übersetzt sich selbst.
  const _txtDe = new WeakMap();
  const _infoDe = new WeakMap();
  function inHits(node) {
    const el = node.nodeType === 1 ? node : node.parentNode;
    return !!(el && el.closest && el.closest('#scrn-hits'));
  }
  function trText(n, lang) {
    const raw = n.nodeValue; if (!raw) return;
    const tt = raw.trim(); if (!tt) return;
    let de = _txtDe.get(n);
    if (de === undefined) { de = tt; _txtDe.set(n, de); }
    const dict = DICT_TEXT[lang];
    const tgt = (lang === 'de' || !dict) ? de : (dict[de] != null ? dict[de] : de);
    if (tgt !== tt) n.nodeValue = raw.replace(tt, tgt);
  }
  function trInfo(elm, lang) {
    const cur = elm.getAttribute('data-info'); if (cur == null) return;
    let de = _infoDe.get(elm);
    if (de === undefined) { de = cur; _infoDe.set(elm, de); }
    const dict = DICT_INFO[lang];
    const tgt = (lang === 'de' || !dict) ? de : (dict[de] != null ? dict[de] : de);
    if (tgt !== cur) elm.setAttribute('data-info', tgt);
  }
  function translateNode(node, lang) {
    if (!node) return;
    if (node.nodeType === 3) { if (!inHits(node)) trText(node, lang); return; }
    if (node.nodeType !== 1) return;
    if (node.closest && node.closest('#scrn-hits')) return;
    const tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (tw.nextNode()) { if (!inHits(tw.currentNode)) nodes.push(tw.currentNode); }
    nodes.forEach(n => trText(n, lang));
    if (node.matches && node.matches('[data-info]') && !inHits(node)) trInfo(node, lang);
    if (node.querySelectorAll) node.querySelectorAll('[data-info]').forEach(e => { if (!inHits(e)) trInfo(e, lang); });
  }
  function translateScope(root, lang) { translateNode(root, lang); }

  function applyLang(lang) {
    state.prefs = state.prefs || {};
    state.prefs.lang = lang;
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'de');
    translateNode($('.screen'), lang);
    if (window.HitsScreen && HitsScreen._refresh) { try { HitsScreen._refresh(); } catch (e) {} }
    if (window.KRHubLang && (lang === 'de' || lang === 'en')) window.KRHubLang.set(lang);
  }
  window.App.applyLang = applyLang;
  window.App.translateNode = translateNode;

  // Übersetzungshelfer für dynamisch zusammengebaute Strings (render, Screens).
  function t(de) {
    const lang = (state.prefs && state.prefs.lang) || 'de';
    const dict = DICT_TEXT[lang];
    return (lang === 'de' || !dict || dict[de] == null) ? de : dict[de];
  }
  window.App.t = t;
  window.App.lang = () => (state.prefs && state.prefs.lang) || 'de';

  // Beobachter: dynamisch nachgebaute Inhalte (Tabelle, Profile, Toasts, Overlays …)
  // werden in der aktiven Sprache nachübersetzt. Keine Rückkopplung, da wir nur
  // nodeValue/Attribute ändern (childList wird beobachtet, nicht characterData).
  (function observeI18n() {
    const scr = $('.screen'); if (!scr || !window.MutationObserver) return;
    const obs = new MutationObserver(muts => {
      const lang = (state.prefs && state.prefs.lang) || 'de';
      if (lang === 'de') return;
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1 || node.nodeType === 3) translateNode(node, lang);
        }
      }
    });
    obs.observe(scr, { childList: true, subtree: true });
  })();

  // ---------- tooltip (delegiert, auch für dynamische Elemente) ----------
  const tip = $('#tip'); let pinned = null;
  function showTip(el) {
    const txt = el.getAttribute('data-info'); if (!txt) return;
    tip.textContent = txt; tip.classList.add('show');
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = Math.max(8, Math.min(r.left + r.width / 2 - tw / 2, innerWidth - tw - 8));
    let top = r.top - th - 9; if (top < 8) top = r.bottom + 9;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function hideTip() { tip.classList.remove('show'); }
  document.addEventListener('mouseover', e => { const el = e.target.closest('[data-info]'); if (el && !pinned) showTip(el); });
  document.addEventListener('mouseout', e => { const el = e.target.closest('[data-info]'); if (el && !pinned) hideTip(); });
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-info]');
    if (el) { e.stopPropagation(); if (pinned === el) { pinned = null; hideTip(); } else { pinned = el; showTip(el); } }
    else if (pinned) { pinned = null; hideTip(); }
  });

  // ---------- persistence ----------
  // Live-Ballistik (Geschoss/Gewehr/Wetter) liegt in Ballistics.config, nicht in state.
  // Damit Einstellungen einen Reload überleben, spiegeln wir sie beim Speichern mit.
  function liveSnap() {
    return {
      id: B.config.id,
      bullet: Object.assign({}, B.config.bullet),
      rifle: Object.assign({}, B.config.rifle),
      weatherCurrent: Object.assign({}, B.config.weatherCurrent),
      weatherZero: Object.assign({}, B.config.weatherZero)
    };
  }
  window.App.liveSnap = liveSnap;
  function persist() { try { state.live = liveSnap(); localStorage.setItem('brk2_state', JSON.stringify(state)); } catch (e) {} }
  window.App.persist = persist;
  window.App.render = render;
  (function restore() {
    try {
      const s = JSON.parse(localStorage.getItem('brk2_state') || 'null');
      if (s) {
        Object.assign(state, s);
        if (!state.segments) state.segments = { enabled: false, name: 'Stand 1', count: 3, bounds: [300, 700], winds: [{ ms: 2, dir: 270 }, { ms: 4, dir: 270 }, { ms: 6, dir: 270 }] };
        if (!state.table) state.table = { max: 1200, step: 100, angle: 0 };
        if (!state.graph) state.graph = { max: 300 };
        if (!state.ammoLib) state.ammoLib = [];
        if (!state.profiles) state.profiles = [{ id: 'pr1', name: 'H7 .308', snap: null }];
        if (!state.activeProfile) state.activeProfile = state.profiles[0].id;
        if (!state.reticle) state.reticle = { unit: 'MRAD', plane: 'FFP', type: 'MRAD-HASH' };
        if (!state.prefs) state.prefs = { theme: 'dark', lang: (window.KRHubLang ? window.KRHubLang.get() : 'de') };
        if (!state.hits) state.hits = { shots: [], meta: { weapon: '', ammo: '', caliber: '' }, geom: { tenMm: 50, ringMm: 25, discMm: 500, klickMm: 20 }, outlier: 3.5, zoom: 1, shown: false };
        if (window.Units) Units.ensure(state);
        // Live-Ballistik wiederherstellen — sonst springt das Profil nach Reload auf Default zurück
        if (state.live && state.live.bullet) {
          try {
            B.setBullet(state.live.bullet);
            B.setRifle(state.live.rifle);
            B.setWeather(state.live.weatherCurrent, state.live.weatherZero);
            if (state.live.id) B.config.id = state.live.id;
            // Aktives Profil mit der Live-Konfiguration synchron halten
            const ap = state.profiles && state.profiles.find(p => p.id === state.activeProfile);
            if (ap) ap.snap = Object.assign({}, state.live);
          } catch (e) {}
        }
        syncSlider('#rangeSlider', state.range);
        syncSlider('#windSlider', state.windMs);
        if ($('#angleInput')) $('#angleInput').value = state.angle;
      }
    } catch (e) {}
    // Einstellungen anwenden (Thema-Klasse + ggf. Boarisch fürs Dashboard)
    try {
      const scr = $('.screen');
      if (scr) scr.classList.toggle('theme-sun', hubThemeMode() === 'light');
      const lang0 = state.prefs && state.prefs.lang;
      if (lang0 && lang0 !== 'de') {
        document.documentElement.setAttribute('lang', lang0 === 'en' ? 'en' : 'de');
        translateNode($('.screen'), lang0);
      }
    } catch (e) {}
    // Initiales Render — warten bis Layout fertig, damit Canvas-Dimensionen stimmen
    requestAnimationFrame(() => { try { render(); } catch (e) {} });
  })();

  // ---------- Vollbild-Absehen (Zoom + Pan) ----------
  (function scopeViewer() {
    const fs = document.createElement('div');
    fs.className = 'scope-fs'; fs.id = 'scopeFs';
    fs.innerHTML = '<div class="scope-vp" id="scopeVp"><canvas id="reticleBig"></canvas></div>' +
      '<button class="scope-close" id="scopeClose"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
      '<div class="scope-hint">Ziehen zum Verschieben · Scrollen / Pinch zum Zoomen</div>' +
      '<div class="scope-ctrls"><button data-z="in">+</button><button data-z="reset">⟲</button><button data-z="out">−</button></div>';
    $('.screen').appendChild(fs);
    const vp = fs.querySelector('#scopeVp'), big = fs.querySelector('#reticleBig');
    let scale = 1, tx = 0, ty = 0;
    function apply() { big.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; }
    function drawBig() {
      const cs = Math.max(vp.clientWidth, vp.clientHeight) * 1.06;
      big.style.width = cs + 'px'; big.style.height = cs + 'px';
      const wf = buildWindFn();
      const s = B.solve({ range: state.range, windFn: wf, angleDeg: state.angle });
      const lad = B.ladder(state.graph.max, wf, 0, state.angle, 12);
      Reticle.draw(big, s, lad, { type: state.reticle.type, sun: (state.prefs && state.prefs.theme === 'sun') });
    }
    function open() { fs.classList.add('on'); scale = 1; tx = 0; ty = 0; requestAnimationFrame(() => { drawBig(); apply(); }); }
    function close() { fs.classList.remove('on'); }
    function setScale(v) { scale = Math.max(0.5, Math.min(5, v)); apply(); }
    canvas.addEventListener('click', open);
    fs.querySelector('#scopeClose').addEventListener('click', close);
    fs.querySelector('.scope-ctrls').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.z === 'in') setScale(scale * 1.3);
      else if (b.dataset.z === 'out') setScale(scale / 1.3);
      else { scale = 1; tx = 0; ty = 0; apply(); }
    });
    // Maus-Pan
    let drag = false, lx = 0, ly = 0, pinchD = 0;
    vp.addEventListener('mousedown', e => { drag = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener('mousemove', e => { if (!drag) return; tx += e.clientX - lx; ty += e.clientY - ly; lx = e.clientX; ly = e.clientY; apply(); });
    window.addEventListener('mouseup', () => drag = false);
    vp.addEventListener('wheel', e => { e.preventDefault(); setScale(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12)); }, { passive: false });
    // Touch-Pan + Pinch
    const dist = e => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    vp.addEventListener('touchstart', e => {
      if (e.touches.length === 1) { drag = true; lx = e.touches[0].clientX; ly = e.touches[0].clientY; }
      else if (e.touches.length === 2) { drag = false; pinchD = dist(e); }
    }, { passive: false });
    vp.addEventListener('touchmove', e => {
      e.preventDefault();
      if (e.touches.length === 1 && drag) { tx += e.touches[0].clientX - lx; ty += e.touches[0].clientY - ly; lx = e.touches[0].clientX; ly = e.touches[0].clientY; apply(); }
      else if (e.touches.length === 2) { const d = dist(e); if (pinchD) setScale(scale * d / pinchD); pinchD = d; }
    }, { passive: false });
    vp.addEventListener('touchend', () => { drag = false; pinchD = 0; });
    window.addEventListener('resize', () => { if (fs.classList.contains('on')) drawBig(); });
  })();

  // ---------- init ----------
  let raf = 0;
  function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); }
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  new ResizeObserver(() => schedule()).observe($('.reticle-wrap'));
  requestAnimationFrame(() => requestAnimationFrame(render));
})();
