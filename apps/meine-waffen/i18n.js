// KR i18n — runtime DOM translator (de | en | bar). Used across all pages.
(function () {
  var DICT = {
    '(optional)': { en: '(optional)', bar: '(wannst mogst)' },
    'AUSWERTUNGEN / übersicht': { en: 'analytics / overview', bar: 'auswertung / überblick' },
    'Abbrechen': { en: 'Cancel', bar: 'Lossn mas' },
    'Alle Sorten mit Foto, Hersteller, Kaliber, Gewicht und Geschwindigkeit.': { en: 'All types with photo, manufacturer, calibre, weight and velocity.', bar: 'Olle Soatn mit Buidl, Hersteller, Kaliber, Gwicht und Gschwindigkeit.' },
    'Alle eingetragenen Teile mit Foto, Hersteller und Teilebezeichnung.': { en: 'All registered parts with photo, manufacturer and part name.', bar: 'Olle eitrognan Teife mit Buidl, Hersteller und Teilnam.' },
    'Alle eingetragenen Waffen mit Foto, Hersteller, Kaliber und Seriennummer.': { en: 'All registered firearms with photo, manufacturer, calibre and serial number.', bar: 'Olle eitrognan Schiaßeisn mit Buidl, Hersteller, Kaliber und Seriennummer.' },
    'Als PDF speichern': { en: 'Save as PDF', bar: 'Ois PDF obspeichern' },
    'Anderen Ort eingeben': { en: 'Enter another location', bar: 'An andan Ort eigem' },
    'Aus': { en: 'Off', bar: 'Aus' },
    'Ausstellende Behörde': { en: 'Issuing authority', bar: 'Ausstoiende Behörd' },
    'Ausstellungsdatum': { en: 'Date of issue', bar: 'Ausstoi-Datum' },
    'Auswertung · Timeline': { en: 'Analysis · Timeline', bar: 'Auswertung · Zeitstroang' },
    'Bearbeiten': { en: 'Edit', bar: 'Ändern' },
    'Bei Veränderungen an der Waffe — z. B. neue Montage, Umbau oder Schaden — ein Bild aufnehmen, um den Zustand zu dokumentieren.': { en: 'When the firearm changes — e.g. new mount, conversion or damage — take a photo to document the condition.', bar: 'Wenn si wos an dei Schiaßeisn ändert — z. B. neie Montage, Umbau oder a Schadn — mach a Buidl, dassd den Zuastand festhoidst.' },
    'Benutztes Zubehör': { en: 'Accessory used', bar: 'Benutzts Zeig' },
    'Bestand verwalten — Hersteller, Kaliber und Seriennummer.': { en: 'Manage inventory — manufacturer, calibre and serial number.', bar: 'Bestand verwoitn — Hersteller, Kaliber und Seriennummer.' },
    'Bezeichnung': { en: 'Designation', bar: 'Bezeichnung' },
    'Bild laden': { en: 'Load image', bar: 'Buidl lon' },
    'Dark Mode': { en: 'Dark Mode', bar: 'Finsta-Modus' },
    'Daten': { en: 'Data', bar: 'Datn' },
    'Datensicherung': { en: 'Backup', bar: 'Datensicherung' },
    'Der aktuelle Bestand wird dabei vollständig ersetzt. Dieser Schritt lässt sich nicht rückgängig machen.': { en: 'The current inventory will be completely replaced. This step cannot be undone.', bar: 'Dei jetziga Bestand wead kombdd ersetzt. Des kost nimma rückgängig macha.' },
    'Diese Sorte wirklich löschen? Das lässt sich nicht rückgängig machen.': { en: 'Really delete this type? This cannot be undone.', bar: 'De Soatn wirkli weghaun? Des kost nimma rückgängig macha.' },
    'Diese Waffe wirklich löschen? Das lässt sich nicht rückgängig machen.': { en: 'Really delete this firearm? This cannot be undone.', bar: 'De Schiaßeisn wirkli weghaun? Des kost nimma rückgängig macha.' },
    'Diesen Timeline-Eintrag wirklich löschen? Das lässt sich nicht rückgängig machen.': { en: 'Really delete this timeline entry? This cannot be undone.', bar: 'Den Timeline-Eitrog wirkli weghaun? Des kost nimma rückgängig macha.' },
    'Dieses Teil wirklich löschen? Das lässt sich nicht rückgängig machen.': { en: 'Really delete this part? This cannot be undone.', bar: 'Des Teil wirkli weghaun? Des kost nimma rückgängig macha.' },
    'Druckfertiges Datenblatt (PDF) mit allen Werten des aktiven Profils.': { en: 'Print-ready data sheet (PDF) with all values of the active profile.', bar: 'Druckfertigs Datnblattl (PDF) mit olle Wert vom aktivn Profui.' },
    'Druckvorschau · A4 · Graustufen': { en: 'Print preview · A4 · Greyscale', bar: 'Druckvorschau · A4 · Graustufn' },
    'Eigene Bezeichnung eingeben': { en: 'Enter your own label', bar: 'Eigane Bezeichnung eigem' },
    'Einstellungen': { en: 'Settings', bar: 'Eistellunga' },
    'Eintrag löschen': { en: 'Delete entry', bar: 'Eitrog weghaun' },
    'Eintrittsdatum': { en: 'Date joined', bar: 'Beitritts-Datum' },
    'Farbe': { en: 'Colour', bar: 'Farb' },
    'Fertig': { en: 'Done', bar: 'Basd scho' },
    'Foto': { en: 'Photo', bar: 'Buidl' },
    'Foto aufnehmen': { en: 'Take photo', bar: 'Buidl macha' },
    'Foto aufnehmen oder ein vorhandenes Bild laden.': { en: 'Take a photo or load an existing image.', bar: 'A Buidl macha oder a vorhandns lon.' },
    'Foto der Munition': { en: 'Photo of the ammunition', bar: 'Buidl vo da Munition' },
    'Foto der Munition aufnehmen oder ein vorhandenes Bild laden.': { en: 'Take a photo of the ammunition or load an existing image.', bar: 'A Buidl vo da Munition macha oder a vorhandns lon.' },
    'Foto der Waffe': { en: 'Photo of the firearm', bar: 'Buidl vo da Schiaßeisn' },
    'Foto der Waffe aufnehmen oder ein vorhandenes Bild laden.': { en: 'Take a photo of the firearm or load an existing image.', bar: 'A Buidl vo da Schiaßeisn macha oder a vorhandns lon.' },
    'Foto des Zubehörs': { en: 'Photo of the accessory', bar: 'Buidl vom Zeig' },
    'Foto des Zubehörs aufnehmen oder ein vorhandenes Bild laden.': { en: 'Take a photo of the accessory or load an existing image.', bar: 'A Buidl vom Zeig macha oder a vorhandns lon.' },
    'Foto entfernen': { en: 'Remove photo', bar: 'Buidl wegmacha' },
    'Freitext — z. B. Ergebnisse, Auffälligkeiten …': { en: 'Free text — e.g. results, anything notable …', bar: 'Freitext — z. B. Ergebnisse, wos auffoin is …' },
    'Freitext — z. B. Montage, Zustand, Kaufdatum …': { en: 'Free text — e.g. mounting, condition, purchase date …', bar: 'Freitext — z. B. Montage, Zuastand, Kafdatum …' },
    'Gesamt abgegebene Schuss': { en: 'Total shots fired', bar: 'Insgesamt obgschossne Schuss' },
    'Gesamtschüsse pro Waffe': { en: 'Total shots per firearm', bar: 'Gsamtschuss pro Schiaßeisn' },
    'Gesamtübersicht': { en: 'Full overview', bar: 'Gsamtüberblick' },
    'Gesamtübersicht drucken': { en: 'Print full overview', bar: 'Gsamtüberblick druckn' },
    'Geschwindigkeit': { en: 'Velocity', bar: 'Gschwindigkeit' },
    'Gewicht': { en: 'Weight', bar: 'Gwicht' },
    'Hausnummer': { en: 'House number', bar: 'Hausnumma' },
    'Hersteller': { en: 'Manufacturer', bar: 'Hersteller' },
    'Hochdeutsch — die aktuelle Sprache.': { en: 'Choose the language for the whole app.', bar: 'Wäi de Sprach für de ganze App aus.' },
    'Import': { en: 'Import', bar: 'Import' },
    'Inhaber': { en: 'Owner', bar: 'Eigntüma' },
    'Kaliber': { en: 'Calibre', bar: 'Kaliber' },
    'Kein Zubehör dieser Waffe zugeordnet.': { en: 'No accessory assigned to this firearm.', bar: 'Koa Zeig zu dera Schiaßeisn zuagoadnt.' },
    'Kein Zubehör zugeordnet.': { en: 'No accessory assigned.', bar: 'Koa Zeig zuagoadnt.' },
    'Keine Daten': { en: 'No data', bar: 'Koane Datn' },
    'Keine Daten vorhanden': { en: 'No data available', bar: 'Koane Datn do' },
    'Keine Waffe ausgewählt.': { en: 'No firearm selected.', bar: 'Koa Schiaßeisn ausgwäid.' },
    'Löschen': { en: 'Delete', bar: 'Weghaun' },
    'Haupteinstellungen': { en: 'Main Settings', bar: 'Haupt-Eistellunga' },
    'Maximaler Kontrast: helle Fläche, tiefe Schrift — ablesbar in praller Sonne.': { en: 'Maximum contrast: light surface, dark type — readable in bright sun.', bar: 'Maximaler Kontrast: hejje Flächn, dunkle Schrift — ablesbar in da prain Sun.' },
    'Mein Zubehör': { en: 'My Accessories', bar: 'Mei Zeig' },
    'Meine Munition': { en: 'My Ammunition', bar: 'Mei Munition' },
    'Meine Munitionssorten': { en: 'My Ammunition Types', bar: 'Meine Munitions-Soatn' },
    'Meine Waffen': { en: 'My Firearms', bar: 'Meine Schiaßeisn' },
    'Menü': { en: 'Menu', bar: 'Menü' },
    'Mitgliedsnummer': { en: 'Membership number', bar: 'Mitgliedsnumma' },
    'Modifikation': { en: 'Modification', bar: 'Umbau' },
    'Munition löschen': { en: 'Delete ammunition', bar: 'Munition weghaun' },
    'Munitionssorten': { en: 'Ammunition types', bar: 'Munitions-Soatn' },
    'NWR-ID Erlaubnis': { en: 'NWR-ID Permit', bar: 'NWR-ID Erlaubnis' },
    'NWR-ID Person': { en: 'NWR-ID Person', bar: 'NWR-ID Person' },
    'Name': { en: 'Surname', bar: 'Nam' },
    'Name und Anschrift des Karteninhabers.': { en: 'Name and address of the card holder.', bar: 'Nam und Adress vom Kartninhaba.' },
    'Neue Munitionssorte hinzufügen': { en: 'Add new ammunition type', bar: 'Neie Munitions-Soatn dazua doa' },
    'Neue Waffe hinzufügen': { en: 'Add new firearm', bar: 'Neie Schiaßeisn dazua doa' },
    'Neues Zubehör hinzufügen': { en: 'Add new accessory', bar: 'Neis Zeig dazua doa' },
    'Noch kein Zubehör angelegt.': { en: 'No accessory added yet.', bar: 'No koa Zeig oglegt.' },
    'Noch keine Einträge erfasst.': { en: 'No entries recorded yet.', bar: 'No koane Eiträg erfasst.' },
    'Noch keine Einträge. Lege über „Timelineelement“ das erste Ereignis an.': { en: 'No entries yet. Use “Timeline item” to add the first event.', bar: 'No koane Eiträg. Mit „Timelineelement“ legst as easte Ereignis o.' },
    'Noch keine Munition hinterlegt — unter „Meine Munition" anlegen.': { en: 'No ammunition stored yet — add it under “My Ammunition”.', bar: 'No koa Munition hinterlegt — unter „Mei Munition" oleng.' },
    'Noch keine Munitionssorten angelegt.': { en: 'No ammunition types added yet.', bar: 'No koane Munitions-Soatn oglegt.' },
    'Noch keine Timeline-Einträge erfasst.': { en: 'No timeline entries recorded yet.', bar: 'No koane Timeline-Eiträg erfasst.' },
    'Noch keine Timeline-Einträge. Lege Trainings, Wettkämpfe und Reinigungen bei einer Waffe an — die Auswertung füllt sich automatisch.': { en: 'No timeline entries yet. Add training, competitions and cleanings to a firearm — the analysis fills itself automatically.', bar: 'No koane Timeline-Eiträg. Leg Trainings, Wettkämpf und Putzaktiona bei ana Schiaßeisn o — de Auswertung füit si vo söiwa.' },
    'Noch keine Vereine angelegt.': { en: 'No clubs added yet.', bar: 'No koane Vereine oglegt.' },
    'Noch keine Waffen angelegt': { en: 'No firearms added yet', bar: 'No koane Schiaßeisn oglegt' },
    'Noch keine Waffen angelegt — lege zuerst eine Waffe an, um sie hier zuzuordnen.': { en: 'No firearms added yet — add a firearm first to assign it here.', bar: 'No koane Schiaßeisn oglegt — leg zerscht oane o, dassd as do zuaordna kost.' },
    'Noch keine Waffen angelegt.': { en: 'No firearms added yet.', bar: 'No koane Schiaßeisn oglegt.' },
    'Noch keine Waffenbesitzkarten angelegt.': { en: 'No ownership cards added yet.', bar: 'No koane Waffnbesitzkartn oglegt.' },
    'Noch keine verschossene Munition erfasst.': { en: 'No spent ammunition recorded yet.', bar: 'No koa verschossne Munition erfasst.' },
    'Notizen': { en: 'Notes', bar: 'Notizn' },
    'Persönliche Daten': { en: 'Personal details', bar: 'Persönliche Datn' },
    'Persönliche Daten, Vereine und Waffenbesitzkarten.': { en: 'Personal details, clubs and ownership cards.', bar: 'Persönliche Datn, Vereine und Waffnbesitzkartn.' },
    'Postleitzahl': { en: 'Postcode', bar: 'Postleitzoi' },
    'Profil': { en: 'Profile', bar: 'Profui' },
    'Reinigung': { en: 'Cleaning', bar: 'Putzn' },
    'Seriennummer': { en: 'Serial number', bar: 'Seriennumma' },
    'Sichere alle Profile, Munition und Einstellungen als Datei — oder spiel eine Sicherung wieder ein. Übertrag damit deine Daten auf ein anderes Gerät.': { en: 'Back up all profiles, ammunition and settings as a file — or restore a backup. Use it to move your data to another device.', bar: 'Sicha olle Profui, Munition und Eistellunga ois Datei — oda spui a Sicherung wieda ei. Damit bringst dei Datn af a anders Gerät.' },
    'Sicherung einspielen': { en: 'Restore backup', bar: 'Sicherung einspuin' },
    'Sonnenlicht': { en: 'Sunlight', bar: 'Sunnaliacht' },
    'Sonstiges (Freitext) …': { en: 'Other (free text) …', bar: 'Anderes (Freitext) …' },
    'Sorten verwalten — Hersteller, Kaliber, Gewicht und Geschwindigkeit.': { en: 'Manage types — manufacturer, calibre, weight and velocity.', bar: 'Soatn verwoitn — Hersteller, Kaliber, Gwicht und Gschwindigkeit.' },
    'Speichern': { en: 'Save', bar: 'Speichern' },
    'Sprache': { en: 'Language', bar: 'Sprach' },
    'Stammdaten': { en: 'Master data', bar: 'Stammdatn' },
    'Straße': { en: 'Street', bar: 'Stroßn' },
    'Teil': { en: 'Part', bar: 'Teil' },
    'Teile verwalten — Foto, Hersteller und Teilebezeichnung.': { en: 'Manage parts — photo, manufacturer and part name.', bar: 'Teife verwoitn — Buidl, Hersteller und Teilnam.' },
    'Teilebezeichnung': { en: 'Part name', bar: 'Teilnam' },
    'Thema': { en: 'Theme', bar: 'Thema' },
    'Timeline': { en: 'Timeline', bar: 'Zeitstroang' },
    'Timeline-Einträge': { en: 'Timeline entries', bar: 'Timeline-Eiträg' },
    'Timelineelement': { en: 'Timeline item', bar: 'Timelineelement' },
    'Tippe hier, um deine erste Waffe hinzuzufügen.': { en: 'Tap here to add your first firearm.', bar: 'Tipp do, dassd dei easte Schiaßeisn dazua doast.' },
    'Training': { en: 'Training', bar: 'Training' },
    'Verbaut an': { en: 'Mounted on', bar: 'Verbaut an' },
    'Verbautes Zubehör': { en: 'Mounted accessories', bar: 'Verbauts Zeig' },
    'Verein anlegen': { en: 'Add club', bar: 'Verein oleng' },
    'Vereine': { en: 'Clubs', bar: 'Vereine' },
    'Vereinsname': { en: 'Club name', bar: 'Vereinsnam' },
    'Vereinsnummer': { en: 'Club number', bar: 'Vereinsnumma' },
    'Verschossene Munition': { en: 'Spent ammunition', bar: 'Verschossne Munition' },
    'Verwendete Munition': { en: 'Ammunition used', bar: 'Vawendde Munition' },
    'Vorname': { en: 'First name', bar: 'Voanam' },
    'WAFFEN- UND ZUBEHÖRINVENTAR': { en: 'FIREARMS & ACCESSORY INVENTORY', bar: 'SCHIASSEISN- UND ZEIG-INVENTAR' },
    'WAFFENBESTAND · FÜR MEHR INFOS KLICKEN': { en: 'FIREARMS · CLICK FOR MORE INFO', bar: 'SCHIASSEISN-BESTAND · FÜR MEHR INFOS KLICKA' },
    'WBK Nummer': { en: 'WBK number', bar: 'WBK-Numma' },
    'Waffe': { en: 'Firearm', bar: 'Schiaßeisn' },
    'Waffe löschen': { en: 'Delete firearm', bar: 'Schiaßeisn weghaun' },
    'Waffenbesitzkarte anlegen': { en: 'Add ownership card', bar: 'Waffnbesitzkartn oleng' },
    'Waffenbesitzkarten': { en: 'Ownership cards', bar: 'Waffnbesitzkartn' },
    'Waffenbestand': { en: 'Firearms inventory', bar: 'Schiaßeisn-Bestand' },
    'Wann': { en: 'When', bar: 'Wann' },
    'Was': { en: 'What', bar: 'Wos' },
    'Wettkampf': { en: 'Competition', bar: 'Wettkampf' },
    'Wiederherstellen': { en: 'Restore', bar: 'Wiederherstoin' },
    'Wo': { en: 'Where', bar: 'Wo' },
    'Wohnort': { en: 'Town', bar: 'Wohnort' },
    'Zubehör': { en: 'Accessories', bar: 'Zeig' },
    'Zubehör löschen': { en: 'Delete accessory', bar: 'Zeig weghaun' },
    'Zurück': { en: 'Back', bar: 'Zruck' },
    'drucken': { en: 'print', bar: 'druckn' },
    'einlesen:': { en: 'import:', bar: 'einlesn:' },
    'z. B. 123-45678': { en: 'e.g. 123-45678', bar: 'z. B. 123-45678' },
    'z. B. 150 Schuss': { en: 'e.g. 150 rounds', bar: 'z. B. 150 Schuss' },
    'z. B. 360 m/s': { en: 'e.g. 360 m/s', bar: 'z. B. 360 m/s' },
    'z. B. 8,0 g / 124 gr': { en: 'e.g. 8.0 g / 124 gr', bar: 'z. B. 8,0 g / 124 gr' },
    'z. B. 9 mm Luger': { en: 'e.g. 9 mm Luger', bar: 'z. B. 9 mm Luger' },
    'z. B. Aimpoint': { en: 'e.g. Aimpoint', bar: 'z. B. Aimpoint' },
    'z. B. Heckler & Koch': { en: 'e.g. Heckler & Koch', bar: 'z. B. Heckler & Koch' },
    'z. B. P30': { en: 'e.g. P30', bar: 'z. B. P30' },
    'z. B. RUAG': { en: 'e.g. RUAG', bar: 'z. B. RUAG' },
    'z. B. Rotpunktvisier Micro H-2': { en: 'e.g. red dot sight Micro H-2', bar: 'z. B. Rotpunktvisier Micro H-2' },
    'z. B. grün': { en: 'e.g. green', bar: 'z. B. grea' },
    'Übersicht': { en: 'Overview', bar: 'Überblick' },
    'Übersicht deiner Mitgliedschaften.': { en: 'Overview of your memberships.', bar: 'Überblick vo deine Mitgliedschaftn.' },
    'Übersicht deiner WBK.': { en: 'Overview of your ownership cards.', bar: 'Überblick vo deine WBK.' },
    '— Auswählen —': { en: '— Select —', bar: '— Auswäin —' },
    '— Kein Zubehör —': { en: '— No accessory —', bar: '— Koa Zeig —' },
    '— Munition wählen —': { en: '— Select ammunition —', bar: '— Munition wäin —' },
    '— Nicht zugeordnet —': { en: '— Not assigned —', bar: '— Net zuagoadnt —' }
  };

  var ATTRS = ['placeholder', 'title', 'aria-label'];
  var origT = new WeakMap();
  var applying = false;
  var observer = null;
  var timer = null;

  function lang() {
    try {
      var v = localStorage.getItem('app:lang');
      if (v) return v;
      if (window.KRHubLang) return window.KRHubLang.get();
      return 'de';
    } catch (e) { return 'de'; }
  }

  function doText(node) {
    var raw = origT.has(node) ? origT.get(node) : node.nodeValue;
    if (raw == null) return;
    var trimmed = raw.replace(/\s+/g, ' ').trim();
    if (!DICT[trimmed]) return;
    if (!origT.has(node)) origT.set(node, raw);
    var L = lang();
    var core = (L === 'de') ? trimmed : (DICT[trimmed][L] || trimmed);
    var lead = (raw.match(/^\s*/) || [''])[0];
    var trail = (raw.match(/\s*$/) || [''])[0];
    var next = lead + core + trail;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function doAttr(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var pk = '__i18n_' + a;
      var raw = (pk in el) ? el[pk] : el.getAttribute(a);
      if (raw == null) continue;
      var key = String(raw).replace(/\s+/g, ' ').trim();
      if (!DICT[key]) continue;
      if (!(pk in el)) el[pk] = raw;
      var L = lang();
      var val = (L === 'de') ? raw : (DICT[key][L] || raw);
      if (el.getAttribute(a) !== val) el.setAttribute(a, val);
    }
  }

  function apply() {
    if (applying || !document.body) return;
    applying = true;
    if (observer) observer.disconnect();
    try {
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var p = n.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          var t = p.nodeName;
          if (t === 'SCRIPT' || t === 'STYLE' || t === 'NOSCRIPT' || t === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [], x;
      while ((x = w.nextNode())) nodes.push(x);
      for (var i = 0; i < nodes.length; i++) doText(nodes[i]);
      var els = document.body.querySelectorAll('[placeholder],[title],[aria-label]');
      for (var j = 0; j < els.length; j++) doAttr(els[j]);
    } catch (e) {}
    applying = false;
    if (observer) observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  function schedule() {
    if (applying) return;
    clearTimeout(timer);
    timer = setTimeout(apply, 60);
  }

  function start() {
    if (!document.body) { setTimeout(start, 30); return; }
    observer = new MutationObserver(schedule);
    apply();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  window.__krSetLang = function (l) {
    try { localStorage.setItem('app:lang', l); } catch (e) {}
    if (window.KRHubLang && (l === 'de' || l === 'en')) window.KRHubLang.set(l);
    apply();
  };
  window.__krLang = lang;
  window.addEventListener('storage', function (e) { if (!e || e.key == null || e.key === 'app:lang') apply(); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

// iOS standalone (home-screen app): keep same-origin link taps inside the app
// instead of kicking out to a new Safari tab.
(function () {
  var standalone = ('standalone' in window.navigator) && window.navigator.standalone;
  if (!standalone) return;
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (/^(https?:|mailto:|tel:)/i.test(href) && a.host !== window.location.host) return;
    e.preventDefault();
    window.location.href = a.href;
  }, false);
})();

