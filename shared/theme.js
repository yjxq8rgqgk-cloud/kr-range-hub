/* KR Hub — zentrale Theme-Steuerung.
   Priorität: URL-Parameter ?theme= > localStorage > System.
   Fügt außerdem einen Zurück-zum-Hub-Button ein. */
(function () {
  var KEY = 'kr-hub-theme'; // 'dark' | 'light' | 'system'

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  var param = null;
  try {
    param = new URLSearchParams(location.search).get('theme');
  } catch (e) {}

  var pref = param || stored() || 'dark';
  if (param) store(param);

  function apply(p) {
    var mode = p;
    if (p === 'system') {
      mode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', mode);
  }
  apply(pref);

  // Als App ohne Browser-Adressleiste laufen (iOS/Android vom Homescreen).
  // Die Meta-Tags markieren jede Seite als Web-App. Im iOS-Standalone-Modus
  // öffnet iOS interne Links sonst in Safari (mit Adressleiste) — der Klick-
  // Handler hält sie im App-Fenster.
  (function standalone() {
    function meta(name, content) {
      if (document.querySelector('meta[name="' + name + '"]')) return;
      var m = document.createElement('meta');
      m.setAttribute('name', name);
      m.setAttribute('content', content);
      (document.head || document.documentElement).appendChild(m);
    }
    meta('apple-mobile-web-app-capable', 'yes');
    meta('mobile-web-app-capable', 'yes');
    meta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    meta('apple-mobile-web-app-title', 'KR Range Hub');

    if (('standalone' in navigator) && navigator.standalone) {
      document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        if (a.target === '_blank' || a.hasAttribute('download')) return;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;          // reiner Anker
        var url;
        try { url = new URL(href, location.href); } catch (err) { return; }
        if (url.origin !== location.origin) return;            // extern → normal im Browser
        e.preventDefault();
        location.href = url.href;
      }, true);
    }
  })();

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if ((stored() || 'dark') === 'system') apply('system');
    });
  }

  // Hub-Wurzel aus dem eigenen Skriptpfad ableiten (…/shared/theme.js)
  var self = document.currentScript;
  var hubRoot = null;
  if (self && self.src) {
    hubRoot = self.src.replace(/shared\/theme\.js(\?.*)?$/, '');
  }

  // Einheitlicher KR-Kopf für alle Teil-Apps (wie auf der Hauptseite:
  // "KR <Name>" mit Unterstrich; Hub-Button oben rechts, rechtshand-nah).
  var APP_NAMES = {
    'meine-waffen': 'Meine Waffen',
    'munitionsbestand': 'Munitionsbestand',
    'trefferaufnahme': 'Trefferaufnahme',
    'ringzaehler': 'Ringzähler',
    'schuss-timer': 'Schuss-Timer',
    'ballistikrechner': 'Ballistikrechner',
    'kompendium': 'DSB Sportordnung',
    'schiessrecht': 'Schießrecht',
    'schiessfehler': 'Schießfehler'
  };
  var appSlug = null;
  (function () {
    var m = location.pathname.match(/\/apps\/([^\/]+)\//);
    if (m) appSlug = m[1];
    if (appSlug) document.documentElement.setAttribute('data-kr-app', appSlug);
  })();
  function appName() {
    if (appSlug && APP_NAMES[appSlug]) return APP_NAMES[appSlug];
    return (document.title || '').split(/[—\-–|·]/)[0].trim();
  }

  function addAppBar() {
    if (!hubRoot) return;
    // Auf der Hub-Startseite selbst keinen Kopf einfügen (hat schon einen)
    if (document.documentElement.hasAttribute('data-kr-hub-root')) return;
    if (document.querySelector('.kr-appbar')) return;
    var bar = document.createElement('header');
    bar.className = 'kr-appbar';
    var brand = document.createElement('div');
    brand.className = 'kr-appbar-brand';
    brand.innerHTML = '<span class="kr-appbar-kr">KR</span><span class="kr-appbar-name"></span>';
    brand.querySelector('.kr-appbar-name').textContent = appName();
    var home = document.createElement('a');
    home.className = 'kr-appbar-home';
    home.href = hubRoot + 'index.html';
    home.setAttribute('aria-label', 'Zum Hub');
    home.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/></svg>' +
      '<span>Hub</span>';
    bar.appendChild(brand);
    bar.appendChild(home);
    document.body.insertBefore(bar, document.body.firstChild);
    setBarHeight();
  }
  function setBarHeight() {
    var b = document.querySelector('.kr-appbar');
    if (!b) return;
    try { document.documentElement.style.setProperty('--kr-bar-h', b.offsetHeight + 'px'); } catch (e) {}
  }
  window.addEventListener('resize', setBarHeight);

  function ensureAppBar() { try { addAppBar(); } catch (e) {} }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAppBar);
  } else {
    ensureAppBar();
  }
  window.addEventListener('load', ensureAppBar);
  // Bundler-Seiten (z. B. Kompendium, Schießfehler) ersetzen das DOM nach dem
  // Laden und löschen den eingefügten Kopf — daher kurz nachfassen.
  if (hubRoot && !document.documentElement.hasAttribute('data-kr-hub-root')) {
    var krTries = 0;
    var krIv = setInterval(function () {
      krTries++;
      if (!document.querySelector('.kr-appbar')) {
        if (appSlug && !document.documentElement.getAttribute('data-kr-app')) {
          document.documentElement.setAttribute('data-kr-app', appSlug);
        }
        ensureAppBar();
      }
      if (krTries >= 25 || document.querySelector('.kr-appbar')) clearInterval(krIv);
    }, 160);
  }

  // Geräteübergreifende Sync laden (läuft auf jeder App-Seite)
  if (hubRoot && !window.KRHubSync) {
    var syncScript = document.createElement('script');
    syncScript.src = hubRoot + 'shared/sync.js';
    syncScript.async = true;
    (document.head || document.documentElement).appendChild(syncScript);
  }

  // Für die Einstellungsseite
  window.KRHubTheme = {
    get: function () { return stored() || 'dark'; },
    set: function (v) { store(v); apply(v); }
  };

  // Hub-weite Sprachwahl (Deutsch/English) — Apps mit eigener i18n lesen
  // diesen Wert als Vorgabe und halten ihn beim eigenen Sprachwechsel aktuell.
  var LANG_KEY = 'kr-hub-lang';
  window.KRHubLang = {
    get: function () { try { return localStorage.getItem(LANG_KEY) || 'de'; } catch (e) { return 'de'; } },
    set: function (v) { try { localStorage.setItem(LANG_KEY, v); } catch (e) {} }
  };
})();
