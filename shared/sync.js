/* ============================================================
   KR Hub — geräteübergreifende Sync (GitHub-Gist)
   Synchronisiert den KOMPLETTEN localStorage aller Hub-Apps
   (Meine Waffen, Munitionsbestand, Ballistik-Profile,
   Zähler-Verläufe, Einstellungen …) über einen privaten Gist.

   Funktionsweise:
   - Läuft über shared/theme.js auf jeder App-Seite.
   - Beim Öffnen: vom Gist laden (throttled).
   - Bei Änderungen: in den Gist hochladen (erkannt per Hash-Poll,
     gebündelt/debounced) — unabhängig davon, welche App schreibt.
   - Konfliktschutz über Zeitstempel: hat sich remote UND lokal
     geändert, wird nicht still überschrieben, sondern gefragt.

   Der Token (nur `gist`-Recht) liegt NUR lokal und wird NIE in den
   Gist geschrieben. Steuerung: window.KRHubSync (Einstellungen-Seite).
   ============================================================ */
(function () {
  var API = 'https://api.github.com';
  var GIST_FILE = 'kr-range-hub-sync.json';
  var GIST_DESC = 'KR Range Hub – Gerätesync (nicht löschen)';
  var PUSH_DEBOUNCE = 2500;   // ms nach letzter Änderung bis Upload
  var PULL_THROTTLE = 20000;  // ms: höchstens so oft beim Navigieren laden
  var POLL_MS = 4000;         // ms: Änderungs-Erkennung

  // localStorage-Schlüssel der Sync selbst (werden NICHT mitsynchronisiert)
  var K = {
    token: 'kr-hub-sync-token',
    gist:  'kr-hub-sync-gist',
    seen:  'kr-hub-sync-seen',   // zuletzt abgeglichener Remote-Zeitstempel
    hash:  'kr-hub-sync-hash',   // Hash des zuletzt synchronen Datenstands
    pull:  'kr-hub-sync-lastpull'
  };
  function isSyncKey(k) { return !!k && k.indexOf('kr-hub-sync-') === 0; }

  // --- rohe (nicht als Datenänderung zählende) Speicherzugriffe ---
  var origSet = Storage.prototype.setItem;
  var origRemove = Storage.prototype.removeItem;
  function ls(k)     { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { origSet.call(localStorage, k, v); } catch (e) {} }
  function rawDel(k) { try { origRemove.call(localStorage, k); } catch (e) {} }

  function token()      { return ls(K.token); }
  function gistId()     { return ls(K.gist); }
  function configured() { return !!(token() && gistId()); }
  // Schutz: nur sichern, wenn wirklich Nutzdaten vorhanden sind. Verhindert,
  // dass ein leeres/zurückgesetztes Gerät das Cloud-Backup leert.
  function hasRealData() {
    var mainKeys = ['waffen:liste', 'zubehoer:liste', 'munition:liste', 'munitionsbestand_v1',
                    'profil:vereine', 'profil:wbk', 'timeline:liste', 'waffenlog.v1', 'brk2_state'];
    for (var i = 0; i < mainKeys.length; i++) {
      var v = ls(mainKeys[i]);
      if (v && v !== '[]' && v !== '{}' && v !== 'null' && v !== '""') return true;
    }
    return false;
  }

  // --- Datenschnappschuss (alles außer Sync-internen Keys) ---
  function snapshot() {
    var d = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!isSyncKey(k)) { try { d[k] = localStorage.getItem(k); } catch (e) {} }
    }
    return d;
  }
  function stableStr(obj) {
    return JSON.stringify(obj, Object.keys(obj).sort());
  }
  function hashStr(s) {
    var h = 5381, i = s.length;
    while (i) { h = (h * 33) ^ s.charCodeAt(--i); }
    return (h >>> 0).toString(16) + ':' + s.length;
  }
  function snapHash() { return hashStr(stableStr(snapshot())); }
  function localDirty() { return snapHash() !== ls(K.hash); }

  // --- Zustand + UI-Benachrichtigung ---
  var listeners = [];
  var state = { status: 'idle', message: '', lastSync: null, conflict: null };
  function emit() {
    var snap = status();
    listeners.forEach(function (f) { try { f(snap); } catch (e) {} });
  }
  function setState(p) { for (var k in p) state[k] = p[k]; emit(); }
  function status() {
    return {
      configured: configured(),
      gistId: gistId(),
      status: state.status,
      message: state.message,
      lastSync: state.lastSync,
      conflict: state.conflict
    };
  }

  // --- GitHub-API ---
  function friendly(e) {
    var m = (e && e.message) || String(e);
    if (/401/.test(m)) return 'Token ungültig oder ohne gist-Recht.';
    if (/403/.test(m)) return 'GitHub lehnt ab (Limit oder Rechte).';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'Keine Verbindung zu GitHub.';
    return m;
  }
  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({
      'Authorization': 'token ' + token(),
      'Accept': 'application/vnd.github+json'
    }, opts.headers || {});
    return fetch(API + path, opts).then(function (r) {
      if (!r.ok) throw new Error('GitHub ' + r.status);
      return r.status === 204 ? null : r.json();
    });
  }
  function readRemote() {
    return api('/gists/' + gistId()).then(function (g) {
      var f = g.files && g.files[GIST_FILE];
      if (!f) throw new Error('Sync-Datei im Gist fehlt.');
      if (f.truncated && f.raw_url) {
        return fetch(f.raw_url).then(function (r) { return r.text(); }).then(JSON.parse);
      }
      return JSON.parse(f.content);
    });
  }
  function writeRemote() {
    var payload = { app: 'KR Range Hub', version: 1, updatedAt: new Date().toISOString(), data: snapshot() };
    var files = {}; files[GIST_FILE] = { content: JSON.stringify(payload, null, 2) };
    return api('/gists/' + gistId(), { method: 'PATCH', body: JSON.stringify({ files: files }) })
      .then(function () { return payload; });
  }
  function createRemote() {
    var payload = { app: 'KR Range Hub', version: 1, updatedAt: new Date().toISOString(), data: snapshot() };
    var files = {}; files[GIST_FILE] = { content: JSON.stringify(payload, null, 2) };
    return api('/gists', { method: 'POST', body: JSON.stringify({ description: GIST_DESC, public: false, files: files }) })
      .then(function (g) { return { id: g.id, payload: payload }; });
  }
  function findRemote() {
    return api('/gists?per_page=100').then(function (list) {
      for (var i = 0; i < (list || []).length; i++) {
        if (list[i].files && list[i].files[GIST_FILE]) return list[i];
      }
      return null;
    });
  }

  // --- Remote anwenden (zählt NICHT als lokale Änderung) ---
  function applyRemote(data) {
    data = data || {};
    var keep = {};
    Object.keys(data).forEach(function (k) {
      if (!isSyncKey(k)) { keep[k] = 1; rawSet(k, data[k]); }
    });
    var del = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!isSyncKey(k) && !keep[k]) del.push(k);
    }
    del.forEach(rawDel);
  }

  // --- Push / Pull ---
  var pushing = false, pushTimer = null;
  function schedulePush() {
    if (!configured() || pushing || pushTimer || !hasRealData()) return;
    pushTimer = setTimeout(function () { pushTimer = null; push(); }, PUSH_DEBOUNCE);
  }
  function push() {
    if (!configured() || pushing || !hasRealData()) return Promise.resolve();
    pushing = true;
    setState({ status: 'syncing', message: 'Speichere …' });
    return writeRemote().then(function (payload) {
      rawSet(K.seen, payload.updatedAt);
      rawSet(K.hash, snapHash());
      setState({ status: 'ok', message: 'Gesichert', lastSync: new Date(), conflict: null });
    }).catch(function (e) {
      setState({ status: 'error', message: friendly(e) });
    }).then(function () { pushing = false; });
  }

  function pull(force) {
    if (!configured()) return Promise.resolve('unconfigured');
    var now = Date.now(), last = parseInt(ls(K.pull) || '0', 10);
    if (!force && last && (now - last) < PULL_THROTTLE) return Promise.resolve('throttled');
    setState({ status: 'syncing', message: 'Lade …' });
    return readRemote().then(function (remote) {
      rawSet(K.pull, String(Date.now()));
      var rStamp = remote.updatedAt || '';
      var seen = ls(K.seen) || '';
      var dirty = localDirty();
      if (rStamp && rStamp !== seen) {
        // Remote hat sich seit dem letzten Abgleich geändert
        if (dirty) {
          setState({ status: 'conflict', message: 'Konflikt: Remote und lokal geändert.', conflict: remote });
          return 'conflict';
        }
        applyRemote(remote.data || {});
        rawSet(K.seen, rStamp);
        rawSet(K.hash, snapHash());
        setState({ status: 'ok', message: 'Aktualisiert · lädt neu …', lastSync: new Date(), conflict: null });
        setTimeout(function () { try { location.reload(); } catch (e) {} }, 700);
        return 'applied';
      }
      // Remote unverändert
      if (dirty) return push().then(function () { return 'pushed'; });
      setState({ status: 'ok', message: 'Synchron', lastSync: new Date(), conflict: null });
      return 'insync';
    }).catch(function (e) {
      setState({ status: 'error', message: friendly(e) });
      return 'error';
    });
  }

  // --- Änderungs-Erkennung (unabhängig von der schreibenden App) ---
  setInterval(function () {
    if (configured() && state.status !== 'conflict' && hasRealData() && localDirty()) schedulePush();
  }, POLL_MS);

  // Beim Verlassen der Seite offene Änderungen noch wegschreiben (best effort)
  window.addEventListener('pagehide', function () {
    try {
      if (!configured() || !localDirty() || !hasRealData()) return;
      var payload = { app: 'KR Range Hub', version: 1, updatedAt: new Date().toISOString(), data: snapshot() };
      var body = JSON.stringify(payload);
      if (body.length > 60000) return; // keepalive-Limit (64 KB) — großer Stand: regulärer Push hat i.d.R. schon gespeichert
      var files = {}; files[GIST_FILE] = { content: body };
      fetch(API + '/gists/' + gistId(), {
        method: 'PATCH', keepalive: true,
        headers: { 'Authorization': 'token ' + token(), 'Accept': 'application/vnd.github+json' },
        body: JSON.stringify({ files: files })
      });
      rawSet(K.seen, payload.updatedAt);
      rawSet(K.hash, hashStr(stableStr(payload.data)));
    } catch (e) {}
  });

  // WICHTIG (Datenschutz gegen Verlust): Es wird NIE mehr automatisch aus der
  // Cloud geladen/angewendet — das hat früher lokale Daten überschrieben.
  // Automatisch passiert nur noch das SICHERN (push). Das Wiederherstellen aus
  // der Cloud ist eine bewusste Aktion über die Einstellungen (restoreFromCloud).
  function init() {
    if (configured() && hasRealData() && localDirty()) schedulePush();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' && configured() && hasRealData() && localDirty()) push();
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // --- Öffentliche API (für die Einstellungen-Seite) ---
  window.KRHubSync = {
    isConfigured: configured,
    status: status,
    onChange: function (f) {
      listeners.push(f);
      try { f(status()); } catch (e) {}
      return function () { var i = listeners.indexOf(f); if (i >= 0) listeners.splice(i, 1); };
    },
    // Manuell: lokalen Stand in die Cloud sichern (überschreibt nie lokale Daten).
    backupNow: function () {
      if (!configured()) return Promise.reject(new Error('Sync nicht eingerichtet.'));
      if (!hasRealData()) return Promise.reject(new Error('Keine Daten zum Sichern vorhanden.'));
      return push();
    },
    syncNow: function () { return window.KRHubSync.backupNow(); },
    // Cloud-Stand ansehen (für eine Vorschau vor dem Wiederherstellen).
    peekCloud: function () { return readRemote(); },
    // Bewusstes Wiederherstellen aus der Cloud (ersetzt lokale Daten). NUR manuell.
    restoreFromCloud: function () {
      if (!configured()) return Promise.reject(new Error('Sync nicht eingerichtet.'));
      setState({ status: 'syncing', message: 'Lade aus Cloud …' });
      return readRemote().then(function (remote) {
        applyRemote(remote.data || {});
        rawSet(K.seen, remote.updatedAt || '');
        rawSet(K.hash, snapHash());
        setState({ status: 'ok', message: 'Aus Cloud wiederhergestellt · lädt neu …', lastSync: new Date(), conflict: null });
        setTimeout(function () { try { location.reload(); } catch (e) {} }, 800);
        return 'restored';
      }).catch(function (e) { setState({ status: 'error', message: friendly(e) }); throw e; });
    },
    setup: function (tok) {
      tok = (tok || '').trim();
      if (!tok) return Promise.reject(new Error('Kein Token eingegeben.'));
      rawSet(K.token, tok);
      setState({ status: 'syncing', message: 'Prüfe Token & suche vorhandene Sync …' });
      return findRemote().then(function (g) {
        if (g) {
          rawSet(K.gist, g.id);
          return readRemote().then(function (remote) {
            var take = window.confirm(
              'Es gibt bereits eine Sync für diesen GitHub-Account.\n\n' +
              'OK  = Daten von dort übernehmen (ersetzt die lokalen Daten auf DIESEM Gerät).\n' +
              'Abbrechen = stattdessen deine lokalen Daten hochladen (überschreibt die Sync).');
            if (take) {
              applyRemote(remote.data || {});
              rawSet(K.seen, remote.updatedAt || '');
              rawSet(K.hash, snapHash());
              setState({ status: 'ok', message: 'Verbunden · Daten übernommen · lädt neu …', lastSync: new Date() });
              setTimeout(function () { try { location.reload(); } catch (e) {} }, 900);
              return 'applied';
            }
            return push().then(function () {
              setState({ status: 'ok', message: 'Verbunden · lokale Daten hochgeladen.', lastSync: new Date() });
              return 'pushed';
            });
          });
        }
        return createRemote().then(function (res) {
          rawSet(K.gist, res.id);
          rawSet(K.seen, res.payload.updatedAt);
          rawSet(K.hash, snapHash());
          setState({ status: 'ok', message: 'Eingerichtet · erstes Backup hochgeladen.', lastSync: new Date() });
          return 'created';
        });
      }).catch(function (e) {
        rawDel(K.token); rawDel(K.gist);
        setState({ status: 'error', message: friendly(e) });
        throw e;
      });
    },
    // Konflikt auflösen
    resolveRemote: function () {
      if (!state.conflict) return pull(true);
      applyRemote(state.conflict.data || {});
      rawSet(K.seen, state.conflict.updatedAt || '');
      rawSet(K.hash, snapHash());
      setState({ status: 'ok', message: 'Remote übernommen · lädt neu …', lastSync: new Date(), conflict: null });
      setTimeout(function () { try { location.reload(); } catch (e) {} }, 700);
      return Promise.resolve('applied');
    },
    resolveLocal: function () {
      setState({ conflict: null });
      return push();
    },
    disconnect: function () {
      rawDel(K.token); rawDel(K.gist); rawDel(K.seen); rawDel(K.hash); rawDel(K.pull);
      setState({ status: 'idle', message: 'Sync getrennt (Gist bleibt erhalten).', lastSync: null, conflict: null });
      return Promise.resolve();
    }
  };
})();
