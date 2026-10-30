/* ============================================================
   Ballistikrechner 3.0 — Einheiten-Umrechnung & Formatierung
   Interne Referenz (Engine) bleibt IMMER:
     Distanz m · Geschwindigkeit fps · Wind m/s · Temp °C ·
     Druck hPa · Energie J · Visierhöhe cm · Korrektur mrad
   Dieses Modul rechnet nur an der Anzeige-/Eingabekante um.
   Die gewählten Einheiten stehen in App.state.units.
   ============================================================ */
(function (global) {
  'use strict';

  const DEFAULTS = { range: 'M', angle: '0.1 MRAD', sight: 'CM', mv: 'FPS', wind: 'M/S', temp: 'C', pres: 'HPA', energy: 'J' };

  // Umrechnungstabellen: to = Basis→Anzeige, from = Anzeige→Basis
  const TABLES = {
    range:  { M:   { lbl: 'm',   to: v => v,            from: v => v,            dp: 0 },
              YDS: { lbl: 'yds', to: v => v / 0.9144,   from: v => v * 0.9144,   dp: 0 },
              FT:  { lbl: 'ft',  to: v => v / 0.3048,   from: v => v * 0.3048,   dp: 0 } },
    speed:  { FPS:   { lbl: 'fps', to: v => v,           from: v => v,           dp: 0 },
              'M/S': { lbl: 'm/s', to: v => v * 0.3048,  from: v => v / 0.3048,  dp: 1 } },
    wind:   { 'M/S': { lbl: 'm/s', to: v => v,           from: v => v,           dp: 1 },
              MPH:   { lbl: 'mph', to: v => v * 2.2369363, from: v => v / 2.2369363, dp: 1 },
              KN:    { lbl: 'kn',  to: v => v * 1.9438445, from: v => v / 1.9438445, dp: 1 } },
    temp:   { C: { lbl: '°C', to: v => v,                 from: v => v,                 dp: 0 },
              F: { lbl: '°F', to: v => v * 9 / 5 + 32,    from: v => (v - 32) * 5 / 9,  dp: 0 },
              K: { lbl: 'K',  to: v => v + 273.15,        from: v => v - 273.15,        dp: 0 } },
    pres:   { HPA:  { lbl: 'hPa',  to: v => v,            from: v => v,            dp: 0 },
              MBAR: { lbl: 'mbar', to: v => v,            from: v => v,            dp: 0 },
              INHG: { lbl: 'inHg', to: v => v * 0.0295299937, from: v => v / 0.0295299937, dp: 2 } },
    energy: { J:        { lbl: 'J',     to: v => v,           from: v => v,           dp: 0 },
              'FT-LBS': { lbl: 'ft-lb', to: v => v * 0.7375621, from: v => v / 0.7375621, dp: 0 } },
    sight:  { CM: { lbl: 'cm', to: v => v,          from: v => v,          dp: 2 },
              MM: { lbl: 'mm', to: v => v * 10,     from: v => v / 10,     dp: 1 },
              IN: { lbl: 'in', to: v => v / 2.54,   from: v => v * 2.54,   dp: 2 } }
  };

  // Welche state.units-Taste füttert welche Familie
  const FAMILY_KEY = { range: 'range', speed: 'mv', wind: 'wind', temp: 'temp', pres: 'pres', energy: 'energy', sight: 'sight' };

  function units() {
    const s = global.App && global.App.state && global.App.state.units;
    return s || DEFAULTS;
  }
  function code(family) {
    const key = FAMILY_KEY[family];
    return (units()[key]) || DEFAULTS[key] || DEFAULTS[family];
  }
  function def(family) {
    const c = code(family);
    return TABLES[family][c] || TABLES[family][DEFAULTS[FAMILY_KEY[family]]] || Object.values(TABLES[family])[0];
  }

  function round(v, dp) { const f = Math.pow(10, dp); return Math.round(v * f) / f; }

  // Basis→Anzeige (Zahl)
  function disp(family, baseVal) { return round(def(family).to(baseVal), def(family).dp); }
  // Anzeige→Basis (Zahl)
  function toBase(family, dispVal) { return def(family).from(dispVal); }
  // Einheiten-Kürzel
  function lbl(family) { return def(family).lbl; }
  // Formatiert "12 m" / "892 fps"
  function fmt(family, baseVal, withUnit) {
    const d = def(family); const v = round(d.to(baseVal), d.dp);
    const txt = d.dp > 0 ? v.toFixed(d.dp) : String(Math.round(v));
    return withUnit === false ? txt : txt + ' ' + d.lbl;
  }
  // nur die Zahl als String (mit passenden Nachkommastellen)
  function num(family, baseVal) { return fmt(family, baseVal, false); }

  // ---- Korrektur (Höhe/Seite) aus mrad ----
  const MOA_PER_MRAD = 3.43774677;
  function corr(mrad) {
    const c = units().angle || DEFAULTS.angle;
    if (c === 'MRAD')    return { num: mrad.toFixed(1), unit: 'mrad', clicks: false };
    if (c === 'MOA')     return { num: (mrad * MOA_PER_MRAD).toFixed(1), unit: 'MOA', clicks: false };
    if (c === '1/4 MOA') return { num: String(Math.round(mrad * MOA_PER_MRAD / 0.25)), unit: 'Klicks · ¼ MOA', clicks: true };
    /* '0.1 MRAD' */      return { num: String(Math.round(mrad * 10)), unit: 'Klicks · 0.1 mrad', clicks: true };
  }
  // kurzes Einheiten-Kürzel für Tabellen-/Achsenköpfe
  function corrShort() {
    const c = units().angle || DEFAULTS.angle;
    return c === 'MRAD' ? 'mrad' : c === 'MOA' ? 'MOA' : c === '1/4 MOA' ? '¼ MOA' : '0.1 mrad';
  }

  function ensure(state) {
    if (!state.units) state.units = Object.assign({}, DEFAULTS);
    else for (const k in DEFAULTS) if (state.units[k] == null) state.units[k] = DEFAULTS[k];
    return state.units;
  }

  global.Units = { DEFAULTS, disp, toBase, lbl, fmt, num, corr, corrShort, ensure, code };
})(window);
