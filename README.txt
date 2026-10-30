KR Range Hub — fünf Apps unter einer Startseite
================================================

Start:
  index.html im Browser öffnen.

Empfohlen (wegen Browser-Sicherheitsregeln bei lokalen Dateien):
  Im Ordner ein Terminal öffnen und starten:
      python3 -m http.server 8080
  Dann im Browser: http://localhost:8080
  Hintergrund: Das Schießfehler-Diagnosetool lädt seine Datenbank
  per fetch(). Direkt aus dem Dateisystem (file://) blockieren
  Chrome/Edge das. Safari und Firefox sind toleranter.

Struktur:
  index.html            Startseite (5 Kacheln)
  einstellungen.html    Zentrale Optik-Einstellungen (Dunkel/Hell/System)
  shared/               Gemeinsames Theme (theme.css, theme.js)
  apps/                 Die fünf Apps, unverändert bis auf zwei
                        injizierte Zeilen im <head> (Theme + Hub-Button)

Theme:
  Wahl wird in localStorage gespeichert und zusätzlich als
  ?theme=-Parameter an die App-Links angehängt. Der helle Modus
  überschreibt die Farbvariablen des KR-Design-Systems; einzelne
  Stellen mit fest codierten Farben bleiben dunkel.
