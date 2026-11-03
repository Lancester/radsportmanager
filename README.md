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

## Zweiter Physiktest: R-02 am Berg

Neu: [R-02 – stationärer Anstieg](docs/physik/R02_BERG.md) mit Schwerkraft, geometrisch korrekter Steigung und vereinfachten Vergleichen zwischen Fahrer- und Materialgewicht sowie CdA. **16 lokale Tests** prüfen R-01 und R-02 gemeinsam; `npm test`. Die spätere Ausrüstung soll eine budgetabhängige strategische Entscheidung sein; der Karriere- und Kaufteil ist noch nicht implementiert.

## Dynamischer Streckenprototyp

Nun kann **ein einzelner Fahrer** über mehrere Abschnitte ohne Geschwindigkeitssprünge fahren, bergauf langsamer werden, bergab rollen und durch eine vorgegebene Bremskraft verzögern. [Dokumentation, Formeln und 4-km-Demo](docs/physik/DYNAMISCHE_STRECKE.md). Neuer Testaufruf: npm run test:route. **15 neue lokale Tests** bestanden. Weiterhin kein Peloton, keine Renn-KI und kein installierbares Smartphone-Spiel.

## Kurvenvorschau und Laufradträgheit

Neuer, getrennt getesteter Prototyp: [Kurven und Radrotation erklärt](docs/physik/KURVEN_UND_ROTATION.md). Bisher kann der Testfahrer vor einer Kurve aufgrund von Radius und Reifenhaftung bremsen; eine rotierende Laufradträgheit beeinflusst Beschleunigung und Energie. **14 lokale Tests bestanden**, Aufruf `npm run test:corners`. Das ist noch **keine fahrbare App oder Peloton-Rennengine**.

## Gemeinsamer dynamischer Physikkern

Die bisherigen dynamischen Physikprototypen sind jetzt in `src/engine/physics/motion-core.ts` zusammengeführt. Die APIs für R-01, R-02, dynamische Abschnitte und Kurven bleiben bestehen. **49 Tests lokal gemeinsam bestanden**; vier neue Integrationstests verbinden Anstieg, Abfahrt, Bremsen, Kurvenvorschau und Laufradträgheit. Erklärung und Benchmarkgrenzen: [docs/physik/GEMEINSAMER_KERN.md](docs/physik/GEMEINSAMER_KERN.md). `npm test` führt alle aus. Noch kein Windschatten, keine Peloton-KI oder Smartphone-Version.

## R-03: erste gekoppelte Zweierfahrt mit Windschatten

Jetzt erstmals **zwei** Fahrer mit gemeinsamer Simulationsuhr, dynamisch veränderter Lücke und physikalischer Windschattenreduktion: [R-03 verständlich erklärt](docs/physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md). Der neue Code liegt in `src/engine/physics/drafting-pair.ts`. **64/64 lokale Tests bestanden**, davon 15 neu. Noch **kein echtes Peloton, keine Renn-KI, keine Android-Version**. Testen mit `npm test`, manuelle Node-Kurzmessung mit `npm run bench:r03`.
