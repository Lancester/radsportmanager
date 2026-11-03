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

## Erster Smartphone-Benchmark (GitHub Pages)

Die erste mobilfreundliche Testwebseite unter `docs/index.html` soll den echten R-03-TypeScript-Rechenkern **im Android-Browser-Web-Worker** ausführen. Ein kleiner GitHub-Pages-Workflow kompiliert den Kern und prüft vor der Veröffentlichung alle 64 bisherigen Tests.

**Einmalige Admin-Einstellung notwendig:** Repository → Settings → Pages → Source **GitHub Actions**. Erst nach erfolgreicher Veröffentlichung ist die übliche Projekt-Pages-Adresse erreichbar. Das ist noch **keine veröffentlichte und auf Android getestete App**.

[Deutsche Schritt-für-Schritt-Anleitung mit Testgrößen und Grenzen](docs/ANDROID_BENCHMARK.md).

## NEU: Acht Fahrer fahren erstmals gemeinsam

Der experimentelle Baustein `src/engine/physics/drafting-group.ts` lässt **3–8 Fahrer wirklich gleichzeitig mit Positions-/Windschatten-Wechselwirkung** fahren. Der Testfahrer F8 bekommt in Sekunde 30 eine von außen vorgegebene niedrigere Wattzahl und verliert durch die Physik den Anschluss. **Noch keine Fahrer-KI oder vollständiges Peloton.** Die Android-Benchmarkseite enthält einen zusätzlichen Testknopf für diese gemeinsame Gruppe. Formeln und Grenzen: [docs/physik/R03G_ACHTFAHRER.md](docs/physik/R03G_ACHTFAHRER.md).


## Erste regelbasierte Fahrer-KI (R-04)

Ein kleiner **erklärbarer TypeScript-Fahrer-Agent** darf im Achtfahrer-Test eine wachsende Lücke erkennen und für kurze Zeit begrenzt zusätzliche Watt anfordern. Keine ML-Bibliotheken, keine Cloud, keine direkte Änderung von Geschwindigkeit oder Ergebnis. Vergleichbare Web-Worker-Tests **ohne KI / mit Regel-KI** auf GitHub Pages. Noch kein vollwertiges Peloton oder Managerspiel. [Funktionsweise und Grenzen](docs/ai/LUECKENAGENT.md).


## R-05: Abstandsregler, CP/W′ und getrennte FTP-Kennzahl

Der nächste Schritt verbindet die erste regelbasierte Lücken-KI mit einer optionalen **physikalischen Brems-/Abstandsregelung** und einer **begrenzten W′-Reserve oberhalb der Critical Power**. FTP wird als eigenständiger Fahrer-/Trainingswert vorgesehen, nicht mit CP verwechselt. Keine realistische Langzeit-Ermüdungs- oder vollständige 160-Fahrer-Rennsimulation; kein automatisches seitliches Ausweichen. [Formeln und Grenzen](docs/physik/R05_ABSTAND_CP_WPRIME.md).


## Verifizierter R-05-Abschluss auf GitHub (03.11.2026)

**In `main` übernommen:** [PR #31](https://github.com/Lancester/radsportmanager/pull/31), Squash-Commit `579f68a27e3dcf9c4b80b17d4cf22ebd2fd3d0bd`.

**Verifizierter Github-Actions-/GitHub-Pages-Lauf:** [#41698413046](https://github.com/Lancester/radsportmanager/actions/runs/41698413046) erfolgreich; Job-Logs bestätigen **116 Tests / 116 bestanden / 0 Fehler** (95 bisherige und **21 neue R-05-Tests**). TypeScript-Browser-Übersetzung, existierende Zwei-/Achtfahrer-Kontrollläufe und neuer R-05-Gruppen-Smoke-Test bestanden. GitHub-Pages-Veröffentlichung auf https://lancester.github.io/radsportmanager/ erfolgreich.

**Vergleich bei acht gemeinsam fahrenden Fahrern, je 120 virtuelle Sekunden (Node.js im GitHub-Runner; nicht auf Android gemessen):**

| Szenario | Endlücke F7 → F8 | W′-Limit |
| --- | ---: | --- |
| F8 ohne KI (alter Test) | 100,414498 m | keines |
| F8 mit bisherigem Lückenagent ohne CP/W′ | 53,846536 m | keines |
| F8 mit Lückenagent, aktiver Abstandsregel und CP/W′ | **68,951942 m** | **37,8 s leistungslimitiert** |

In R-05 hat F8 im **frei erfundenen** Profil `CP=220 W`, `FTP=210 W` und anfänglich `W′=1200 J`. Seine Rest-W′ beträgt am Rennende **8,012079 J**. Die größere Lücke als im bisherigen KI-Lauf ist **plausibel und gewollt**, weil der Fahrer wegen der begrenzten Reserven nicht unbegrenzt den vom Agenten geforderten Wattwert leisten kann.

**Sicherheitsregler:** Im vorliegenden Achtfahrerbeispiel bleibt F8 hinter dem Feld zurück, deshalb erfolgt **0 s Bremsung**. Die **aktive Bremskraft/Abstandsreaktion** wurde aber in einem **gesonderten echten Drei-Fahrer-Auflauf-Szenario** getestet und ihre mechanische Bremsverlustarbeit bilanziert. Ein schon zu kurzer Bremsweg führt weiterhin zu explizitem Fehler, nicht zu Bewegungsteleportation. **Keine garantierte Kollisionsvermeidung oder autonome 2D-Spursteuerung.**

**Browser:** Der neue fünfte Knopf `NEU · KI + Abstand + CP/W′` wurde über GitHub Pages veröffentlicht. **Noch kein tatsächlicher Android-R-05-Messbericht**, daher keine Rechenzeit auf dem Smartphone angegeben oder auf 160 Fahrer hochgerechnet. Der Nutzer kann später den neuen Preset anwählen und die JSON-Ergebnisse schicken.

**Wissenschaftliches Profil:** FTP bleibt bewusst **separat von CP** (beide korrelieren, sind aber nicht austauschbar). Die hier verwendete lineare W′-Wiederherstellung ist eine **nicht kalibrierte Testheuristik** und nicht das validierte W′bal-/Skiba-Modell. Auch CP-Leistung unterhalb der Schwelle ist **nicht garantiert unbegrenzt haltbar**; langfristige Ermüdung/Ernährung/Training stehen aus.

**Nächste fachliche Entwicklungsoption:** Dynamisch sichere Bremsreaktionen auch bei abrupt verzögerndem Vordermann, danach 2D-Positionen/Reibkreis/Kurven und individuell kalibrierte CP/W′-Wiederherstellung; für den späteren Manager separate FTP-Tests, Trainingszonen und periodisierte Trainingssteuerung.


## R-06 · Mehrere technische Schritte in einem Paket

Der Achtfahrer-Prototyp erhält vorausschauende Reaktion auf bekannte Führungsbremsung, **stetige extern befohlene Querbewegung** mit Kontrolle auch *zwischen* Simulationsschritten, echte Überholereignisse und eine erste **FTP-bezogene Statistik** aus tatsächlich angewendeter Pedalleistung. Keine komplette taktische Spurwahl-KI, kein 3D- oder Kurven-Peloton und keine wissenschaftlich kalibrierte Ermüdungsrechnung. [Details](docs/physik/R06_SICHERHEIT_SPUR_FTP.md).


## R-06 gebündelt: 134/134 Tests und Browser-Überholen verifiziert (03.11.2026)

**Implementiert und nach echtem CI-Lauf geprüft:**
- [PR #33](https://github.com/Lancester/radsportmanager/pull/33) fügte **drei Teilentwicklungen** hinzu: vorausschauende Längsabstandsreaktion auf *explizit bekannte* Führungsbremsung, stetige Querverschiebung mit swept-Zweiachs-Konflikterkennung und echtem Überholereignis sowie eine aus **tatsächlich angewendeter Kurbelwatt** berechnete FTP-Statistik.
- [PR #34](https://github.com/Lancester/radsportmanager/pull/34) korrigierte einen durch den neuen starken Bremsfall aufgedeckten **echten Integrator-Randfall**: Bei Stillstand *innerhalb* eines Zeitschritts darf nur die wirksame Zeit bis zur vollständigen Verzögerung in den Bremsweg und die Energiegleichung eingehen. Zusätzlich wurde ein gezielter Stillstands-Energietest ergänzt. **Keine künstliche Positions-/Geschwindigkeitsverschiebung**.
- Endgültiger geprüfter Merge-Commit `4a4b2d18f09577b9359f2ef8885f519443965cab`.
- Verifizierter [GitHub-Actions-Lauf #41703325010](https://github.com/Lancester/radsportmanager/actions/runs/41703325010) vollständig `success`: **134 Tests ausgeführt, 134 bestanden, 0 fehlgeschlagen**, TypeScript-Browser-Übersetzung, originale R-03/R-04/R-05-Tests, neuer R-06-ESM-Smoketest sowie **GitHub-Pages-Deployment** erfolgreich.
- Der echte übersetzte Achtfahrer-Überholtest (`createEightRiderPassExample(65)`) meldet im Runner **7 Überholereignisse** von F8 auf der getrennten Spur, abschließende Seitenposition **y=2 m**. Das ist ein **extern vorgegebener** Spur- und 500-W-Leistungsbefehl als Test, **keine autonome Überhol-KI**. Keine verifizierte realistische Überholzeit eines echten Profi-Pelotons.
- Im früheren R-05-Profil ergibt die neu integrierte FTP-Diagnose **90 s oberhalb des fiktiven FTP-Wertes** während 120 s Fahrzeit. Diese Zahl ist **nur eine Pedalwatt-Messgröße**, keine Aussage über realistische metabolische Ermüdung oder einen Trainingseffekt. Das CP/W′-Limit und die getrennte FTP-Kennzahl bleiben bestehen.
- **Wiederholungs-/Regressionscheck:** R-05-Smoketest liefert weiter F8-Endlücke **68,951942 m**, Rest-W′ **8,012079 J**, CP-begrenzte Zeit **37,8 s**; frühere Android-Messungen werden nicht überschrieben.
- GitHub Pages ist veröffentlicht: **https://lancester.github.io/radsportmanager/**. Neuer optionaler Preset **„NEU · 8 Fahrer überholen · 65 s“**, daneben die bisherigen Tests. **Noch kein echter Android-Rechenzeitbericht** zum neuen R-06-Test, deshalb keine Smartphone-Laufzeit oder Hochrechnung vorwegnehmen.

**Weiter bewusst offen:** Garantiert kollisionsfreie Fahrt bei unvorhergesehener Führungsbremsung, Lenkwinkel/Querbeschleunigung/Fahrtechnik und Kurven-/Reibkreis-Kopplung, echte autonome Spurwahl/Überholtaktik, realistische W′-Wiederauffüllung und FTP-Trainingssteuerung, gemeinsame 160-Fahrer-/200-km-Rennsimulation und Managerspiel. Diese Weiterarbeiten nicht als bereits erledigt darstellen. Grundlagen, Testgeometrie und Grenzen: [R-06](physik/R06_SICHERHEIT_SPUR_FTP.md).
