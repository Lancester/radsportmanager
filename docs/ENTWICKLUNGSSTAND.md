# Entwicklungsstand

**Datum: 03.11.2026 · Phase 0 – Projektstart**

## Bereits festgelegt

- Öffentliches GitHub-Repository Lancester/radsportmanager mit Hauptbranch main eingerichtet; Schreibzugriff der verbundenen GitHub-App bestätigt.
- Vollständige deutsche Projektdokumentation als Basis für spätere Chats erstellt.
- Grundrichtung: realistischer, kostenloser Offline-Radsportmanager mit langfristigem Einzelspieler-Karrieremodus.
- Spieler leitet das Gesamtteam; sportliche Leiter führen Rennen autonom. Taktikabstimmung vor Rennen.
- Zunächst isolierten, nachvollziehbaren Rennsimulator entwickeln und validieren; erst danach den umfassenden Manager.
- Technischer Favorit: eigenständige TypeScript-Engine, später Vue/Vite, Web Worker, IndexedDB und PWA.

## Noch NICHT erledigt

- Kein Produktionscode, keine ausführbare Rennengine und kein spielbarer Manager.
- Physik, W′-/Critical-Power-Modell, Ermüdung, Gruppendynamik, KI und Rennberichte sind erst Konzepte.
- Kein echter Android-Benchmark und keine statistische Validierung durchgeführt.
- Keine GitHub-Actions-Workflows oder Monte-Carlo-Läufe gestartet.
- Lizenz, Projektname, Datenquellen und Feinheiten der Spielmechanik noch offen.

## Nächster konkreter Schritt

1. Die ersten GitHub-Issues als Arbeitsplan verwenden; nächstes Hauptthema: **messbare Anforderungen und Referenzszenarien für die Rennsimulation**.
2. Eingabedaten und erwartete Ausgaben der isolierten Engine spezifizieren.
3. Kleine erste Physik-/Leistungsmodelle mit reproduzierbaren Tests entwickeln.
4. Einen mobilen Benchmark mit 160 fiktiven Fahrern über ca. 200 km aufbauen; erst dann die endgültige Technologieentscheidung bestätigen.

## Dokumentationsjournal

| Datum | Änderung | Prüfung | Ergebnis |
| --- | --- | --- | --- |
| 03.11.2026 | Projektstruktur und fachlicher/technischer Konzeptstand nach GitHub übernommen | Nur redaktionell, kein Programmcode | Nächste Phase: Simulation spezifizieren |

**Hinweis:** Der genaue Issue- und Pull-Request-Stand muss bei jeder neuen Arbeitsrunde live auf GitHub geprüft werden.
