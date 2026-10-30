/* ============================================================
   Ballistikrechner 3.0 — Physik-Engine
   Echte Punktmasse-Ballistik: Euler-Integration (dt=0.001s) mit
   G7/G1-Drag-Tabellen, Atmosphäre (Luftdichte aus T/P/rH),
   Zero-Winkel-Suche, Spindrift (Miller/Litz), Wind (Lag-Time).
   Verifiziert gegen die .308-Referenz (148gr FMJ, G7 0.396).

   Öffentliche API:
     Ballistics.config            – aktuelle Konfiguration (lesen)
     Ballistics.setBullet(o) / setRifle(o) / setWeather(cur,zero)
     Ballistics.solve({range,windMs,windDirDeg,angleDeg})
     Ballistics.ladder(max,wind,dir,angle,n)
     Ballistics.tableRows(max,step,angle,windMs,dir)
   ============================================================ */
(function (global) {
  'use strict';

  // ---- Physik-Konstanten ----
  const G = 9.80665, R = 287.058, Rv = 461.5, RHO0 = 1.2250;
  const BC_SI = 703.07;            // 1 lb/in² → kg/m²
  const GR2KG = 0.0000647989;
  const FPS2MS = 0.3048, IN2MM = 25.4;

  // ---- Drag-Tabellen (Mach → Cd) ----
  const G7 = [[0,0.1198],[0.05,0.1197],[0.1,0.1196],[0.15,0.1194],[0.2,0.1193],[0.25,0.1194],[0.3,0.1194],[0.35,0.1194],[0.4,0.1193],[0.45,0.1193],[0.5,0.1194],[0.55,0.1193],[0.6,0.1194],[0.65,0.1197],[0.7,0.1202],[0.725,0.1207],[0.75,0.1215],[0.775,0.1226],[0.8,0.1242],[0.825,0.1266],[0.85,0.1306],[0.875,0.1368],[0.9,0.1464],[0.925,0.166],[0.95,0.2054],[0.975,0.2993],[1.0,0.3803],[1.025,0.4015],[1.05,0.4043],[1.075,0.4034],[1.1,0.4014],[1.125,0.3987],[1.15,0.3955],[1.2,0.3884],[1.25,0.381],[1.3,0.3732],[1.35,0.3657],[1.4,0.358],[1.5,0.344],[1.55,0.3376],[1.6,0.3315],[1.65,0.326],[1.7,0.3209],[1.75,0.316],[1.8,0.3117],[1.85,0.3078],[1.9,0.3042],[1.95,0.301],[2.0,0.298],[2.05,0.2951],[2.1,0.2922],[2.15,0.2892],[2.2,0.2864],[2.25,0.2835],[2.3,0.2807],[2.35,0.2779],[2.4,0.2752],[2.45,0.2725],[2.5,0.2697],[2.6,0.2643],[2.7,0.2588],[2.8,0.2535],[2.9,0.2483],[3.0,0.2432],[3.1,0.2382],[3.2,0.2333],[3.3,0.2284],[3.4,0.2235],[3.5,0.2187],[3.6,0.214],[3.7,0.2093],[3.8,0.2047],[3.9,0.2002],[4.0,0.1956],[4.2,0.1869],[4.4,0.1784],[4.6,0.1701],[4.8,0.162],[5.0,0.1541]];
  const G1 = [[0,0.2629],[0.05,0.2558],[0.1,0.2487],[0.15,0.2413],[0.2,0.2344],[0.25,0.2278],[0.3,0.2214],[0.35,0.2155],[0.4,0.2096],[0.45,0.2042],[0.5,0.1991],[0.55,0.1944],[0.6,0.1899],[0.65,0.1859],[0.7,0.1823],[0.725,0.1813],[0.75,0.1786],[0.775,0.1763],[0.8,0.174],[0.825,0.1713],[0.85,0.1683],[0.875,0.1651],[0.9,0.164],[0.925,0.1716],[0.95,0.178],[0.975,0.1884],[1.0,0.2034],[1.025,0.2165],[1.05,0.223],[1.075,0.2298],[1.1,0.232],[1.125,0.2337],[1.15,0.2352],[1.2,0.236],[1.25,0.2358],[1.3,0.2341],[1.35,0.2326],[1.4,0.2298],[1.45,0.2248],[1.5,0.2208],[1.55,0.2171],[1.6,0.2133],[1.65,0.2096],[1.7,0.2061],[1.75,0.2026],[1.8,0.1991],[1.85,0.1956],[1.9,0.1921],[1.95,0.1886],[2.0,0.1852],[2.05,0.1817],[2.1,0.1782],[2.15,0.1748],[2.2,0.1714],[2.25,0.1679],[2.3,0.1645],[2.35,0.1613],[2.4,0.1579],[2.45,0.1548],[2.5,0.1518],[2.6,0.1458],[2.7,0.14],[2.8,0.1345],[2.9,0.1292],[3.0,0.124],[3.1,0.119],[3.2,0.1141],[3.3,0.1094],[3.4,0.1048],[3.5,0.1004],[3.6,0.0962],[3.7,0.0921],[3.8,0.0882],[3.9,0.0844],[4.0,0.0808],[4.2,0.0732],[4.4,0.0656],[4.6,0.0589],[4.8,0.0522],[5.0,0.0464]];
  const TABLES = { G1: G1, G7: G7, GA: G7, RA4: G1 };  // GA/RA4: Näherung

  function cdOf(table, mach) {
    if (mach <= table[0][0]) return table[0][1];
    const n = table.length;
    if (mach >= table[n - 1][0]) return table[n - 1][1];
    for (let i = 0; i < n - 1; i++) {
      if (mach >= table[i][0] && mach <= table[i + 1][0]) {
        const t = (mach - table[i][0]) / (table[i + 1][0] - table[i][0]);
        return table[i][1] + t * (table[i + 1][1] - table[i][1]);
      }
    }
    return table[n - 1][1];
  }

  // ---- Atmosphäre ----
  function airDensity(w) {
    const T = w.tC, Tk = T + 273.15;
    const Ps = 6.1078 * Math.pow(10, (7.5 * T) / (237.3 + T)); // hPa
    const Pw = (w.rh / 100) * Ps;
    const Pd = w.pHpa - Pw;
    return (Pd * 100) / (R * Tk) + (Pw * 100) / (Rv * Tk);      // kg/m³
  }
  function speedOfSound(w) { return 331.3 * Math.sqrt(1 + w.tC / 273.15); }

  // ============================================================
  //  Konfiguration
  // ============================================================
  const config = {
    id: 'H7 .308',
    bullet: { mfr: 'KR Firearms', name: 'FMJ', model: 'G7', bc: 0.396, weightGr: 148, caliberMm: 7.62, lengthMm: 24 },
    rifle:  { mvFps: 2838, sightHeightCm: 4.22, zeroM: 100, twist: 'right', twistRate: 11 },
    weatherCurrent: { tC: 15, pHpa: 1000, rh: 78 },
    weatherZero:    { tC: 13, pHpa: 1005, rh: 53 }
  };

  let cache = null;  // { step, n, x[], drop[], elev[], speedFps[], energyJ[], tof[], spinCm[], spinDir }

  // ---- ein Integrationslauf ----
  function integrate(launchRad, weather, maxRange) {
    const b = config.bullet, r = config.rifle;
    const v0 = r.mvFps * FPS2MS;
    const bcSi = b.bc * BC_SI;
    const table = TABLES[b.model] || G7;
    const rho = airDensity(weather);
    const cs = speedOfSound(weather);
    const dt = 0.001;
    const kBase = 0.5 * rho * (Math.PI / 4) / bcSi;  // a = kBase*cd*v²

    let vx = v0 * Math.cos(launchRad), vy = v0 * Math.sin(launchRad);
    let x = 0, y = 0, t = 0;
    const out = { x: [0], y: [0], v: [v0], t: [0] };
    let nextSample = 1;
    while (x < maxRange && t < 12) {
      const v = Math.hypot(vx, vy);
      const a = kBase * cdOf(table, v / cs) * v * v;
      const ax = -a * vx / v, ay = -a * vy / v - G;
      vx += ax * dt; vy += ay * dt; x += vx * dt; y += vy * dt; t += dt;
      while (x >= nextSample && nextSample <= maxRange) {
        // linear an Meter-Grenze interpolieren
        const v2 = Math.hypot(vx, vy);
        out.x.push(nextSample); out.y.push(y); out.v.push(v2); out.t.push(t);
        nextSample++;
      }
    }
    return out;
  }

  // ---- Zero-Winkel (so dass Geschoss LOS-Höhe bei zeroM erreicht) ----
  function findZeroAngle(weather) {
    const sh = config.rifle.sightHeightCm / 100;     // LOS-Höhe (m)
    const zr = config.rifle.zeroM;
    let lo = 0, hi = 0.03;                            // rad
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const tr = integrate(mid, weather, zr + 1);
      const yAtZero = tr.y[zr] != null ? tr.y[zr] : tr.y[tr.y.length - 1];
      if (yAtZero < sh) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  // ---- Spindrift (Miller SG + Litz) ----
  function spinDriftFn() {
    const b = config.bullet, r = config.rifle;
    if (r.twist === 'smooth') return { mag: () => 0, dir: 0 };
    const dIn = b.caliberMm / IN2MM;
    const lCal = b.lengthMm / b.caliberMm;            // Länge in Kalibern
    const twCal = r.twistRate / dIn;                  // Drall in Kalibern/Umdr.
    // Miller SG (imperial Basis) + Geschw.-Korrektur
    let sg = (30 * b.weightGr) / (twCal * twCal * Math.pow(dIn, 3) * lCal * (1 + lCal * lCal));
    const v0 = r.mvFps;
    sg *= Math.pow(v0 / 2800, 1 / 3);
    if (!isFinite(sg) || sg < 1) sg = 1.1;
    const dir = r.twist === 'left' ? -1 : 1;          // rechts → Drift rechts (+)
    return {
      // Litz: drift(inch) = 1.25*(SG+1.2)*tof^1.83
      mag: tof => 1.25 * (sg + 1.2) * Math.pow(tof, 1.83) * 2.54, // cm
      dir, sg
    };
  }

  // ---- Cache neu berechnen ----
  function recompute() {
    const maxRange = 2000;
    // Leeres/neues Profil: unvollständige Daten → flacher Null-Cache statt NaN.
    const bb = config.bullet, rr = config.rifle;
    if (!(bb.bc > 0) || !(rr.mvFps > 0) || !(bb.weightGr > 0) || !(bb.caliberMm > 0)) {
      const N = maxRange + 1, z = new Float64Array(N), xs = new Float64Array(N);
      for (let i = 0; i < N; i++) xs[i] = i;
      cache = { n: N, x: xs, drop: z, elev: z, speedFps: z, energyJ: z, tof: z, spinCm: z,
                spinDir: 0, sg: 0, aZero: 0, rho: airDensity(config.weatherCurrent),
                cs: speedOfSound(config.weatherCurrent), mvMs: 0, empty: true };
      return;
    }
    const aZero = findZeroAngle(config.weatherZero);
    const tr = integrate(aZero, config.weatherCurrent, maxRange);
    const sh = config.rifle.sightHeightCm / 100;
    const m = config.bullet.weightGr * GR2KG;
    const spin = spinDriftFn();
    const n = tr.x.length;
    const drop = new Float64Array(n), elev = new Float64Array(n),
          speedFps = new Float64Array(n), energyJ = new Float64Array(n),
          tof = new Float64Array(n), spinCm = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const range = tr.x[i];
      const dCm = (sh - tr.y[i]) * 100;               // Drop unter LOS (cm)
      drop[i] = dCm;
      elev[i] = range > 0 ? (dCm / range) * 100 : 0;   // 0.1 mrad (UP) = dropCm/(range/100)
      speedFps[i] = tr.v[i] / FPS2MS;
      energyJ[i] = 0.5 * m * tr.v[i] * tr.v[i];
      tof[i] = tr.t[i];
      spinCm[i] = spin.mag(tr.t[i]) * spin.dir;        // +rechts
    }
    cache = { n, x: tr.x, drop, elev, speedFps, energyJ, tof, spinCm, spinDir: spin.dir, sg: spin.sg, aZero,
              rho: airDensity(config.weatherCurrent), cs: speedOfSound(config.weatherCurrent),
              mvMs: config.rifle.mvFps * FPS2MS };
  }
  recompute();

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sample(arr, range) {
    range = clamp(range, 0, cache.n - 1);
    const i = Math.floor(range), f = range - i;
    if (i >= cache.n - 1) return arr[cache.n - 1];
    return arr[i] + f * (arr[i + 1] - arr[i]);
  }

  // ---- Wind (integriert, segmentfähig) → Geschoss-Auslenkung nach links (cm) ----
  // windFn(x) liefert Querwind (+ = von rechts) in m/s an Distanz x (m).
  function windageCm(range, windFn) {
    if (range <= 0) return 0;
    const maxI = Math.min(Math.floor(range), cache.n - 2);
    let vlat = 0, ylat = 0;
    for (let i = 0; i < maxI; i++) {
      const dt = cache.tof[i + 1] - cache.tof[i];
      if (dt <= 0) continue;
      const v = cache.speedFps[i] * FPS2MS;
      const v2 = cache.speedFps[i + 1] * FPS2MS;
      const aDrag = (v - v2) / dt;          // Verzögerung
      const kDrag = v > 0 ? aDrag / v : 0;   // 1/Zeitkonstante
      const cross = windFn(i);               // + von rechts → Luft strömt nach links → +links
      vlat += kDrag * (cross - vlat) * dt;
      ylat += vlat * dt;
    }
    return ylat * 100;                       // +links (cm)
  }
  function uniformWindFn(windMs, dirDeg) {
    const c = windMs * Math.sin(dirDeg * Math.PI / 180);
    return () => c;
  }

  // ============================================================
  //  Lösung
  // ============================================================
  function solve(o) {
    o = o || {};
    const range = clamp(o.range != null ? o.range : 100, 0, 2000);
    const windMs = Math.max(0, o.windMs || 0);
    const dir = ((o.windDirDeg || 0) % 360 + 360) % 360;
    const angle = o.angleDeg || 0;
    const cosA = Math.cos(angle * Math.PI / 180);

    const dropCm = sample(cache.drop, range);
    const elevRaw = sample(cache.elev, range);
    const speedFps = sample(cache.speedFps, range);
    const energyJ = sample(cache.energyJ, range);
    const tof = sample(cache.tof, range);
    const spinRight = -sample(cache.spinCm, range);   // Drift +rechts → Korrektur links: spinCorrLeft = +spinCm(links?) 
    // cache.spinCm ist +rechts (Geschoss driftet rechts bei Rechtsdrall) → Korrektur links
    const spinCorrLeftCm = sample(cache.spinCm, range); // +rechts Drift ⇒ correction left positive
    // (Rechtsdrall: spinCm>0 = Drift rechts ⇒ man korrigiert links ⇒ links+ = +spinCm)

    const elev01 = elevRaw * cosA;

    // Wind: Geschoss links+ ⇒ Korrektur rechts(−). windFn aus o.windFn ODER uniform.
    const windFn = o.windFn || uniformWindFn(windMs, dir);
    const wLeft = windageCm(range, windFn);
    const windCorrLeftCm = -wLeft;

    const totalLeftCm = spinCorrLeftCm + windCorrLeftCm;
    const cmPerClick = range > 0 ? range / 100 : 1;   // cm pro 0.1 mrad
    const totalClicks = Math.round(totalLeftCm / cmPerClick);
    const elevClicks = Math.round(elev01);

    return {
      range, windMs, windDirDeg: dir, angleDeg: angle,
      elevClicks, elevMrad: elev01 / 10, elevDir: 'U',
      windClicks: Math.abs(totalClicks), windDir: totalClicks >= 0 ? 'L' : 'R',
      windMrad: Math.abs(totalClicks) / 10,
      dropCm, speedFps, speedMs: speedFps * FPS2MS, mach: (speedFps * FPS2MS) / cache.cs,
      energyJ, energyFtlb: energyJ * 0.7376, tof,
      spinCm: spinCorrLeftCm, windDriftCm: wLeft, totalSideCm: totalLeftCm,
      holdDownMrad: elev01 / 10,
      holdSideMrad: -(totalClicks) / 10
    };
  }

  function ladder(maxRange, windMs, dir, angle, n) {
    const out = []; n = n || 9;
    const wf = (typeof windMs === 'function') ? windMs : uniformWindFn(windMs, dir);
    for (let i = 1; i <= n; i++) {
      const r = Math.round((maxRange * i / n) / 5) * 5;
      const s = solve({ range: r, windFn: wf, angleDeg: angle });
      out.push({ range: r, downMrad: s.holdDownMrad, sideMrad: s.holdSideMrad });
    }
    return out;
  }

  function tableRows(maxRange, step, angle, windMs, dir) {
    const rows = [];
    const wf = (typeof windMs === 'function') ? windMs : uniformWindFn(windMs || 0, dir || 0);
    for (let r = 0; r <= maxRange; r += step) {
      rows.push(solve({ range: r, windFn: wf, angleDeg: angle || 0 }));
    }
    return rows;
  }

  // ---- Setter ----
  function setBullet(o) { Object.assign(config.bullet, o); recompute(); }
  function setRifle(o) { Object.assign(config.rifle, o); recompute(); }
  function setWeather(cur, zero) {
    if (cur) Object.assign(config.weatherCurrent, cur);
    if (zero) Object.assign(config.weatherZero, zero);
    recompute();
  }
  function diagnostics() { return { sg: cache.sg, aZeroMrad: cache.aZero * 1000, rho: cache.rho, cs: cache.cs }; }

  global.Ballistics = {
    config, solve, ladder, tableRows, recompute, windageCm, uniformWindFn,
    setBullet, setRifle, setWeather, diagnostics,
    airDensity, speedOfSound,
    get mvMs() { return cache.mvMs; }
  };

})(window);
