# Technik und Softwarearchitektur

**Status:** vorläufig bevorzugte Architektur; nach einem realen Android-Benchmark überprüfen.

## Ziele

- Vollständig offlinefähiger Einzelspieler, ohne Serverdatenbank.
- Android-Handy als primäres Spiel-, Test- und Entwicklungsgerät.
- Gleiche Simulationsengine in Browser und Node.js für CI-/Monte-Carlo-Tests.
- Möglichst wenige Abhängigkeiten, kostenloser Betrieb, nachvollziehbare Versionierung.

## Vorgeschlagener Stack

| Ebene | Technologie | Grund |
| --- | --- | --- |
| Rennengine | TypeScript | Typisiert, testbar, Ausführung als JavaScript auf Android und Node |
| Oberfläche | Vue 3 | Dynamische, mobil optimierte Ansichten |
| Bundling | Vite | Schlankes Entwicklungs- und Buildwerkzeug |
| Hintergrundrechnen innerhalb der geöffneten App | Web Worker | UI-Thread bleibt bedienbar |
| Lokale Spielstände | IndexedDB | Ohne Server-DB nutzbar |
| Installierbarkeit und Offlinebetrieb | PWA und Service Worker | App-artige Nutzung nach erstmaligem Laden |
| Tests | Node.js + Test-Runner, GitHub Actions | Reproduzierbare Checks |
| Option bei gemessenem Engpass | Rust + WebAssembly | Nur Hotspots gezielt ersetzen |

## Architekturschnittstellen

**Rennengine als reines Modul ohne DOM, Vue, IndexedDB oder Netzwerk.**

simulateRace(race, riders, teams, strategy, seed) -> result, updatedState, events

Darüber:
- Game/Career-Logik für Saisons, Teams, Transfers, Training und Finanzen.
- Reporting für Texte aus dokumentierten Rennereignissen.
- Persistence-Adapter für IndexedDB und exportierbare Spielstände.
- UI-Adapter zur mobilen Benutzeroberfläche.
- Worker-Adapter zur CPU-Ausführung, ohne die Oberfläche zu blockieren.

Mögliche Verzeichnisse nach der Konzeptphase: src/engine, src/career, src/reporting, src/persistence, src/ui, src/workers, tests/unit, tests/benchmark, tests/calibration.

## Grenzen und Risiken

- Ein Web Worker läuft nicht garantiert weiter, wenn die PWA geschlossen oder Android sie schlafen legt.
- Große Simulationen daher für die lokale Nutzung kurz halten oder in gesicherte Checkpoints unterteilen.
- Browser-Speicher kann gelöscht werden: Import/Export, Migrationsstrategien und möglichst persistente Speicherung vorsehen.
- Rechenleistung, RAM, Batterie und thermische Drosselung auf einem echten Android-Handy testen.
- Rust/WebAssembly nicht vorschnell einführen; erst nach realen Messungen.
- Keine echten personenbezogenen Daten oder private Schlüssel in die öffentliche Codebasis.

## Hosting

Die spätere statische PWA kann auf einem geeigneten kostenlosen Webhost bereitstehen (z. B. GitHub Pages oder Cloudflare Pages). Das Bereitstellen einer Webseite ist etwas anderes als die Simulation: Die Rennen werden auf dem Endgerät berechnet. Ein optionaler Onlinevergleich wäre ein separates, späteres Vorhaben.

## Sicherheit und Kompatibilität

Speicherstände versionieren, Änderungen mit automatischen Regressionstests prüfen, Eingabedaten validieren, keine dynamisch ausführbaren Spielstand-Dateien laden. Dokumentation und UI zunächst auf Deutsch.

## Technischer Zwischenstand R-01/R-02 (03.11.2026)

Die stationären Physiktests auf Ebene und Anstieg benutzen nun denselben **TypeScript-Rechenkern** `src/engine/physics/steady-state.ts`, um die Grundgleichungen nicht doppelt pflegen zu müssen. `r01-flat.ts` und `r02-climb.ts` sind schlanke Szenario-Adapter. `npm test` führt sieben vorhandene und neun neue Tests ohne externe Abhängigkeiten lokal unter Node.js 22.16 aus.

Das ist noch keine dynamische mehrstündige Simulation. Die Engine besitzt bewusst weder Wind/Bergab- noch Peloton-/KI-Funktionalität. Erst nach zusätzlichen Physikschritten soll das Web-Worker-/Android-Benchmark-Gerüst entstehen.

## Dynamische Engine vereinheitlicht (03.11.2026)

**Jetzt ein einziger dynamischer Solver:** `src/engine/physics/motion-core.ts` integriert Kräfte, Position und Tempo. `dynamic-route.ts` und `corner-route.ts` sind API-kompatible Adapter. Die stationäre `steady-state.ts` bleibt für unabhängig berechenbare R-01-/R-02-Vergleiche bestehen.

**49 Tests in einem lokalen Node.js-22.16-Lauf bestanden;** TypeScript 5.8.3 ohne Typfehler. Lokal benchmarkbar mit `node --experimental-strip-types benchmarks/isolated-riders.mjs`; nur **1/20/160 voneinander unabhängige Fahrer über je 4 km**, kein Peloton oder echter Android/Web-Worker-Lauf.

Details: [physik/GEMEINSAMER_KERN.md](physik/GEMEINSAMER_KERN.md). Nächster Schritt R-03 (zunächst Zweier-Windschatten), danach ein realer Android-Worker-Performancecheck.
