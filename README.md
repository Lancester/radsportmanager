# Radsportmanager – Open-Source-Projekt (Arbeitstitel)

**Status: Konzeptphase, Stand 03.11.2026.** Noch keine Rennsimulation und keine spielbare Version.

Ein kostenloser, langfristig motivierender **Offline-Radsportmanager**. Die Spielerrolle ist die Leitung eines professionellen Radsportteams: Fahrer und Mitarbeiter verpflichten, die Organisation führen, Ziele und Saison planen. Sportliche Leiter betreuen die Rennen eigenständig. Schwerpunkt ist eine **glaubwürdige, erklärbare Rennsimulation**, nicht eine 3D-Rennsteuerung.

## Grundsätze

- Einzelspieler-Karriere über viele virtuelle Saisons; online spielen ist nicht erforderlich.
- Vom kleinen Team bis zur Weltspitze; lebendige Konkurrenz, Talente, Mitarbeiter, Sponsoren und Karrierehistorie.
- Teambesprechung vor Rennen; während der Rennen keine direkte Fahrersteuerung.
- Interne Simulation mit Physik, Physiologie, Gruppendynamik, Taktik und begrenztem plausiblem Zufall.
- Entwicklung und Tests möglichst vollständig vom Android-Smartphone aus.
- Öffentliches GitHub-Repository; keine zusätzliche ALL-INKL-Datenbank nötig.
- Zuerst eine isolierte Rennengine validieren, dann den umfassenden Karrieremodus entwickeln.

## Einstieg und Dokumentation

**Neue Chats / Mitwirkende:** Zuerst [START_HIER](docs/START_HIER.md), [ENTWICKLUNGSSTAND](docs/ENTWICKLUNGSSTAND.md) und [ENTSCHEIDUNGEN](docs/ENTSCHEIDUNGEN.md) lesen.

| Datei | Zweck |
| --- | --- |
| [SPIELKONZEPT](docs/SPIELKONZEPT.md) | Rolle, Spielschleife, Motivation und Personal |
| [RENNSIMULATION](docs/RENNSIMULATION.md) | Rechenmodell, KI, Berichte, offene Risiken |
| [TECHNIK](docs/TECHNIK.md) | Architektur, Offlinebetrieb und Smartphone-Entwicklung |
| [VALIDIERUNG](docs/VALIDIERUNG.md) | Simulationstests, Realismus und Benchmarks |
| [ROADMAP](docs/ROADMAP.md) | Entwicklungsphasen und Arbeitsreihenfolge |
| [GITHUB_EINRICHTUNG](docs/GITHUB_EINRICHTUNG.md) | GitHub-Abläufe und Kostenkontrolle |
| [QUELLEN_UND_ANNAHMEN](docs/QUELLEN_UND_ANNAHMEN.md) | Quellen, gesicherte Fakten und Hypothesen |

## Sprache, Status und Lizenz

Projektdokumentation, Aufgaben, Berichte, UI und Kommunikation werden **auf Deutsch** geführt. Technische Bezeichner und Programmiersprachen bleiben in ihrer üblichen Form; ein späteres englisches UI ist optional.

Das Repository ist **öffentlich**, aber eine Open-Source-Lizenz wurde noch **nicht** festgelegt. Bis eine passende LICENSE-Datei vorliegt, ist die Nachnutzung des Codes nicht automatisch freigegeben. Für erste Prototypen ausschließlich fiktive Fahrer und Teams nutzen.


## Erster programmierter Physiktest

Der Test **R-01 – Ebene, 20 km, 250/300 Watt** ist als erstes isoliertes, deterministisches TypeScript-Modul umgesetzt. Die verständliche Herleitung und die Ergebnisse stehen in [docs/physik/R01_EBENE.md](docs/physik/R01_EBENE.md). Lokale Tests: `npm run test:r01` (Node.js mit TypeScript-Stripping). **Das ist noch kein spielbarer Rennmanager.**
