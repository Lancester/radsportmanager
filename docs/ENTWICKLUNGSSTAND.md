# Entwicklungsstand

**Aktueller Stand: 03.11.2026 · Phase 2: R-03-Windschatten vorhanden; Android-Browser-Benchmark vorbereitet, echte Android-Messung steht aus.** Die früheren Phasenstände weiter unten sind als chronologisches Journal zu lesen; die aktuelle nächste Aufgabe steht im letzten Abschnitt.

## Bereits festgelegt

- Öffentliches GitHub-Repository Lancester/radsportmanager mit Hauptbranch main eingerichtet; Schreibzugriff der verbundenen GitHub-App bestätigt.
- 14 deutschsprachige Projektdateien auf main eingecheckt (README, Konzept, Technik, Entscheidungen, Validierung, Roadmap, Arbeitsanleitung und Issue-Vorlagen).
- Sieben konkrete GitHub-Issues #1 bis #7 angelegt. Keine kostenpflichtige CI-Rechenzeit ausgelöst.
- Grundrichtung: realistischer, kostenloser Offline-Radsportmanager mit langfristigem Einzelspieler-Karrieremodus.
- Spieler leitet das Gesamtteam; sportliche Leiter führen Rennen autonom. Taktikabstimmung vor Rennen.
- Zunächst isolierten, nachvollziehbaren Rennsimulator entwickeln und validieren; erst danach den umfassenden Manager.
- Technischer Favorit: eigenständige TypeScript-Engine, später Vue/Vite, Web Worker, IndexedDB und PWA.

## Noch NICHT erledigt

- R-01: erster **kleiner ausführbarer TypeScript-Physikkern** für stationäre Fahrt auf ebener Strecke, kein vollständiger Rennsimulator und kein spielbarer Manager.
- Steigung, Wind, Beschleunigung, W′-/Critical-Power-Modell, Ermüdung, Gruppendynamik, KI und Rennberichte sind erst Konzepte; R-01 deckt nur den stationären flachen Einzeltest ab.
- Kein echter Android-Benchmark und keine statistische Validierung durchgeführt.
- Keine GitHub-Actions-Workflows oder Monte-Carlo-Läufe gestartet.
- Lizenz, Projektname, Datenquellen und Feinheiten der Spielmechanik noch offen.

## Nächster konkreter Schritt

1. **Issue #1 – Simulationsanforderungen und Referenzszenarien** als nächstes Hauptthema bearbeiten. Siehe https://github.com/Lancester/radsportmanager/issues/1 .
2. Eingabedaten und erwartete Ausgaben der isolierten Engine spezifizieren.
3. Kleine erste Physik-/Leistungsmodelle mit reproduzierbaren Tests entwickeln.
4. Einen mobilen Benchmark mit 160 fiktiven Fahrern über ca. 200 km aufbauen; erst dann die endgültige Technologieentscheidung bestätigen.

## Dokumentationsjournal

| Datum | Änderung | Prüfung | Ergebnis |
| --- | --- | --- | --- |
| 03.11.2026 | 14 Dateien in main übernommen, sieben Issues (#1–#7) angelegt | GitHub-Leseprüfung und Issue-URLs; kein Programmcode, keine CI | Als Nächstes Issue #1 konkretisieren |

**Hinweis:** Der genaue Issue- und Pull-Request-Stand muss bei jeder neuen Arbeitsrunde live auf GitHub geprüft werden.


## Zwischenstand: Issue #1

Am 03.11.2026 wurde **[REFERENZSZENARIEN.md](REFERENZSZENARIEN.md)** als erster fachlicher Entwurf erarbeitet: 12 testbare Anforderungen, 8 Referenzszenarien, Eingabe-/Ausgabeschema, Entwicklungsschritte M0–M4 und offene Fragen. Die Anforderungen wurden **dokumentiert**, noch nicht durch eine Engine getestet.

**Issue #1 bleibt offen** bis zur gemeinsamen Besprechung von Realismus, Szenarioprioritäten und MVP-Vereinfachungen.

**Nächster konkreter Schritt:** Die fiktiven Referenzfälle R-01 (Ebene) und R-02 (Berg) fachlich prüfen und die ersten verbindlichen Prüfgrenzen definieren. Noch keine Simulation programmieren oder aufwendige CI-Läufe starten.


## Zwischenstand: Feldposition und Simulationsarchitektur (03.11.2026)

Im Rahmen von Issue #1 wurde als **verbindliche fachliche Anforderung** ergänzt, dass Fahrer eine eigenständige Fähigkeit zur Positionierung im Peloton besitzen. Feldposition und rechtzeitiges Aufrücken vor Schlüsselstellen beeinflussen Windschatten, Energieaufwand und Risiko von Gruppenrissen.

Als **vorläufiger technischer Ansatz** ist ein gekoppeltes physikalisch-physiologisches Modell mit regelbasierten Agentenentscheidungen und einem dynamischen Pelotonmodell vorgeschlagen. Keine generative KI oder reine Zufallsauslosung.

Neu: [PELOTON_POSITIONIERUNG.md](PELOTON_POSITIONIERUNG.md) mit drei weiteren Szenarien R-09 bis R-11. **Issue #1 bleibt offen**, insbesondere wegen noch ungeklärter räumlicher Auflösung, Aero-Parametern und Benchmark-Anforderungen.

**Nächster Schritt:** Zunächst R-01/R-02 physikalisch ausarbeiten, parallel die minimal notwendige Positionsrepräsentation für R-03 und R-09 konkretisieren. Noch keine Rennengine, kein Action-Workflow, kein Benchmark.


## Zwischenstand: R-01 Referenzrechnung und kleines TypeScript-Modul (03.11.2026)

**Erledigt:** Der isolierte 20-km-Ebenen-Test R-01 wurde mit explizitem CdA, Crr, Fahrer-/Materialmasse, Luftdichte und Pedalleistung inklusive vorläufigem Antriebswirkungsgrad mathematisch abgeleitet. Die Referenzwerte für 250 W und 300 W wurden unabhängig mit Python/SciPy berechnet und in einem kleinen TypeScript-Modul reproduziert. **7 von 7 lokalen Tests bestanden.**

Dokumentation: [physik/R01_EBENE.md](physik/R01_EBENE.md). Rechenkern: `src/engine/physics/r01-flat.ts`. Tests: `tests/r01-flat.test.mjs`, lokal über `npm run test:r01`.

**Nicht umgesetzt:** noch keine realistisch kalibrierte Engine, keine Fahrphysiologie, keine Gruppen/KI, keine GitHub Actions, keine Tests auf Android. Die dokumentierten 97,5 % Wirkungsgrad sind **eine offene Modellannahme**, keine finale Entscheidung.

**Nächster Schritt:** Mit dem Nutzer R-01 fachlich beurteilen (Pedal- oder Radleistung, CdA/Position, stationäre Fahrt). Danach R-02 mit Steigung ergänzen und unabhängige Zahlen/Tests erzeugen. Issues #1 und #2 bleiben offen.


## Rückmeldung zu R-01 und Arbeitsweise (03.11.2026)

**Vom Nutzer bestätigt:** Fahrerleistungswerte werden in **Watt am Pedal/Kurbel** angegeben; Antriebsverluste separat berechnet (Entscheidung D-029). Die Konvention ist damit beschlossen, die beispielhaften 97,5 % Wirkungsgrad jedoch **nicht**.

**Arbeitsregel:** Der Nutzer muss GitHub-Dokumente nicht regelmäßig selbst lesen. Der Assistent fasst Ergebnisse, Auswirkungen **und sämtliche neu formulierten entscheidungsrelevanten offenen Fragen** im Chat verständlich zusammen. Nur ausdrücklich bestätigte Antworten gelten als beschlossen. GitHub bleibt die technische und historische Quelle der Wahrheit.

**Noch im Chat zu klären:** veränderlicher CdA für Körperhaltung/Ausrüstung; zuerst stationäre Fahrt vs. Beschleunigung sofort; 97,5 % Antriebswirkungsgrad als vorläufiger Testwert vs. zukünftige Parametrisierung.

**Nächster Schritt:** Diese offenen Modellfragen mit dem Nutzer klären, danach R-02 (Steigung) spezifizieren. Keine Code- oder Teständerungen für diese Dokumentationsaktualisierung notwendig.

## Aktueller Stand nach R-02 (03.11.2026)

**Erledigt und lokal geprüft:**
- R-01 (Ebene) und R-02 (Berg) teilen sich jetzt den Rechenkern `src/engine/physics/steady-state.ts`. Eingaben sind Watt am Pedal, Gesamtmasse, CdA, Crr, Luftdichte, veränderbarer Antriebswirkungsgrad sowie Steigung als `gradeFraction`.
- R-02 berechnet stationäres Tempo auf 8 km mit 7 %: **60-kg-Fahrer + 8 kg Material: 19,342501 km/h / 24:48,95**; **80-kg-Fahrer + 8 kg Material: 15,682984 km/h / 30:36,39**; jeweils 300 W am Pedal.
- **16 von 16 lokalen Tests bestanden** (7 R-01-Regressionsprüfungen + 9 R-02-Prüfungen). Unabhängige Sollwerte mit Python/SciPy, eigentliche Engine in TypeScript.
- 2 kg weniger Material spart im bewusst gewählten R-02-Test 33,08 s; CdA 0,30 → 0,25 spart 20,38 s. Das sind **mathematische Beispielwerte, keine realistisch belegten Produkteffekte**.
- Nutzer hat variable CdA-Werte, späteres Beschleunigungsmodell und 97,5 % als vorläufigen Testwert bestätigt. Neue Spielanforderung: käufliche, budgetabhängige Ausrüstung für kleine/große Teams (physikalische Eigenschaften statt pauschale Boni).

**Nicht erledigt:** kein dynamischer Fahr-/Abfahrts-/Wind-/Peloton-/KI-Simulator, keine Fahrerphysiologie, kein Shop und kein Karrieremodus. Keine GitHub Actions und kein Android-Benchmark ausgeführt.

**Dateien:** [physik/R02_BERG.md](physik/R02_BERG.md), [physik/R01_EBENE.md](physik/R01_EBENE.md), `src/engine/physics/steady-state.ts`, `src/engine/physics/r02-climb.ts` und `tests/r02-climb.test.mjs`.

**Nächster konkreter Schritt:** Mit dem Nutzer R-02-Ergebnisse und Materialeffekte besprechen; dann das Modell um abschnittsweise Steigungsänderungen, **Beschleunigung und Abfahrten** erweitern, bevor die Pelotondynamik R-03 beginnt. Kein uneingeschränkt laufender GitHub-Actions-Workflow.

## Neuester Stand: Dynamische Abschnitte, Beschleunigung und Bremsen (03.11.2026)

**Auftrag:** Nutzer möchte nach R-02 ausdrücklich mehrere Streckenabschnitte, Beschleunigung, Verzögerung und Abfahrten umsetzen. **Erledigt:** Eigenständiges neues TypeScript-Modul src/engine/physics/dynamic-route.ts, 15 neue lokale Tests in tests/dynamic-route.test.mjs und Erklärung unter [physik/DYNAMISCHE_STRECKE.md](physik/DYNAMISCHE_STRECKE.md).

- Simulation integriert Position und Tempo über bis zu fünf Demo-Abschnitte **ohne Geschwindigkeits-Sprung**. Ebene (250 W) → +7 % Berg (300 W) → −7 % Abfahrt (0 W) → 200 m manuelle Bremskraft (20 N) → erneute Ebene (250 W).
- Demo mit 4.000 m: **470,8713 s / 7:50,87 min**, Spitze **60,68 km/h**, Höhendifferenz gesamt 0 m, **15/15 dynamische Tests lokal bestanden**.
- Bestehende R-01/R-02-Code- und Testdateien **nicht verändert**; die vorherigen 16 Tests wurden im aktuellen lokalen Arbeitslauf **nicht erneut** ausgeführt. npm test umfasst zukünftig alle vorhandenen Testdateien.
- Kein Wind, keine Kurven- oder Bremsvorschau, keine Rotationsmasse der Räder, keine Physiologie oder Pelotonposition. 180 N vorläufiges Anfahrkraftlimit, 0,25 s Testschritt und 20 N explizite Test-Bremskraft sind keine kalibrierten Werte.
- Keine GitHub Actions aktiviert, keine Android-Ausführung getestet.

**Nächster Schritt:** Mit dem Nutzer die in der neuen Dokumentation vollständig aufgelisteten sieben offenen Modellgrenzen besprechen (insbesondere vorausschauendes Bremsen vor Kurven, rotierende Trägheit und Streckenprofilauflösung). Danach nächste kleine Physikaufgabe vor Gruppen-/Windschattentest R-03 priorisieren. Bezug: [Issue #14](https://github.com/Lancester/radsportmanager/issues/14), [Issue #2](https://github.com/Lancester/radsportmanager/issues/2).


**Nachtrag zur Versionshistorie (03.11.2026):** Der dynamische Einzelfahrer-Rechenkern wurde über [PR #15](https://github.com/Lancester/radsportmanager/pull/15) in main übernommen und die Teilaufgabe [Issue #14](https://github.com/Lancester/radsportmanager/issues/14) als abgeschlossen markiert. Die übergeordneten Issues #1 und #2 bleiben geöffnet; nächster fachlicher Austausch: vorausschauende Bremsung, rotierende Radträgheit und Profilauflösung priorisieren.

## Neuester Stand: Kurvenvorschau und Radträgheit (03.11.2026)

**Auftrag:** Nutzer möchte den vorgeschlagenen Physikaufbau fortsetzen und ist insbesondere an Smartphone-Rechenleistung interessiert.

**Umgesetzt:** `src/engine/physics/corner-route.ts` als *eigenständiger*, weiterhin isolierter TypeScript-Prototyp; `tests/corner-route.test.mjs` mit **14 von 14 lokal bestandenen neuen Tests** (Node.js 22.16). Die älteren R-01/R-02/dynamic-route-Module und deren Tests wurden nicht verändert; die gesamte frühere Testsuite wurde in dieser Runde **nicht** erneut ausgeführt.

**Funktion:** Kurvenradius, Reibwert und vorläufige Sicherheitsmarge bestimmen ein Einfahrtstempo; das Programm berechnet vor dem Kurvenpunkt nötige Bremsarbeit mit endlicher Bremskraft. Zu kurze Anfahrten führen zu einem **Fehler statt magischem Geschwindigkeitswechsel**. Die Trägheit beider Laufräder wird als I/r² zur *Beschleunigungsmasse* addiert, aber nicht zur Schwerkraftmasse.

**Demo 600 m:** Start 43,2 km/h; Kurve nach 250 m mit R=15 m, μ=0,6, S=0,7; Limit 28,30 km/h, Einfahrt ca. 28,05 km/h, erster Bremsvorgang ca. 13 m vor der Kurve; Zeit **58,86 s**. Bei μ=0,4: Grenztempo 23,11 km/h, Einfahrt ca. 22,81 km/h, Zeit **60,77 s**. Sämtliche Werte **Testparameter ohne Realweltkalibrierung**.

**Kleiner Node-Kurzbenchmark:** 160 **voneinander unabhängige** Berechnungen der 600-m-Demo in einem lokalen Lauf **ca. 148 ms**. **Kein Android-/Web-Worker-/Peloton-Benchmark**, nicht auf 200 km hochrechnen.

**Dokumentation:** [physik/KURVEN_UND_ROTATION.md](physik/KURVEN_UND_ROTATION.md); Bezug [Issue #16](https://github.com/Lancester/radsportmanager/issues/16).

**Weiter offen:** Kurve als durchgehender Bogen mit Linienwahl/Querhaftung/Reibkreis statt Punkt; individuelle Fahrtechnik; echte Reib-/Trägheitswerte; Haupt-Engine vereinheitlichen; Profilglättung; Leistungs-Dauer-Profil; Wind/Peloton/Team-KI. Keine GitHub Actions gestartet.

**Nächster konkreter Schritt:** Erst gemeinsamen dynamischen Physikkern und gesamte Regressionstests konsolidieren, danach eine erste kleine R-03-Windschatten-Gruppe und *einen echten* Android-Worker-Benchmark aufbauen. Alle offenen Modellentscheidungen im Chat vorstellen.


## GitHub-Abschluss der Kurvenphase (03.11.2026)

Die Kurvenvorschau und Laufradträgheit wurden über **[PR #17](https://github.com/Lancester/radsportmanager/pull/17)** erfolgreich in den main-Branch übernommen. **[Issue #16](https://github.com/Lancester/radsportmanager/issues/16)** wurde als Teilaufgabe geschlossen. Die übrigen Aufgaben, insbesondere #2, #4 und #6, bleiben offen.

**Nächste konkrete Aufgabe vor R-03:** [Issue #18 – gemeinsamen dynamischen Physikkern konsolidieren und Gesamttests ausführen](https://github.com/Lancester/radsportmanager/issues/18). Die bisherigen **45 Tests** (7 R-01, 9 R-02, 15 dynamische, 14 Kurven) wurden bisher nur in getrennten lokalen Entwicklungsrunden geprüft, **nicht in einem gemeinsamen aktuellen Lauf**. Keine GitHub-Actions- oder Android-Ausführung behaupten.

Für einen echten Smartphone-Nachweis braucht es zusätzlich einen Browser/Web-Worker-Prototyp mit realistischen 160-Fahrer-Situationen und reproduzierbaren Zeitmessungen. Die kleine Node-Messung von 160 isolierten 600-m-Fahrten ist lediglich ein früher CPU-Hinweis.

## Neuester Stand: Physikkern vereinheitlicht, alle Tests gemeinsam bestanden (03.11.2026)

Die Arbeit an [Issue #18](https://github.com/Lancester/radsportmanager/issues/18) verbindet die bisherigen dynamischen Streckenabschnitte und die Kurvenvorschau in **einem einzigen dynamischen TypeScript-Rechenkern**: `src/engine/physics/motion-core.ts`. Die alten `dynamic-route.ts`- und `corner-route.ts`-Dateien bleiben als dünne Adapter samt ihrer Eingabe-/Ausgabeformen erhalten. Die unabhängigen stationären R-01/R-02-Referenzsolver wurden bewusst **nicht geändert**.

**Ausgeführter lokaler Gesamttest:** 7 R-01 + 9 R-02 + 15 dynamische + 14 Kurven + 4 Integration = **49/49 bestanden**, 0 Fehler (Node.js 22.16.0). TypeScript-Typprüfung mit `tsc 5.8.3` ebenfalls erfolgreich.

Die vier neuen Integrationstests zeigen, dass **Anstieg, Abfahrt, Kurvenvorschau, explizites Bremsen und zusätzliche rotierende Trägheit in einem einzigen Szenario** funktionieren. Separate alte Testdateien bleiben erhalten.

**Erster reproduzierbarer Node-Benchmark (dreimal je Größe, mittlerer Wert):** 1 Fahrer/4 km ca. 7,14 ms, 20 Fahrer/4 km 126,15 ms, 160 **unabhängige** Fahrer/4 km **960,46 ms**. **Kein Peloton, keine Positions-KI, kein 200-km-/Android-Benchmark; keine Hochrechnung zulässig.** Es wurden keine GitHub Actions aktiviert.

**Neue beschlossene Spielanforderung:** Fahrer besitzen später trainierbare Fahrtechnik, individuelle Risikobereitschaft und unterschiedliches fahrerisches Talent. Noch **nicht** in der Simulation umgesetzt, siehe Issue #19.

**Technische Erklärung:** [physik/GEMEINSAMER_KERN.md](physik/GEMEINSAMER_KERN.md).

**Nächster konkreter Schritt:** R-03 mit **zwei Fahrern und positionsabhängigem Windschatten** als isolierbarem Test beginnen; danach kleine Gruppen/Positionswechsel. Parallel einen echten Android-Web-Worker-Benchmark vorbereiten, bevor wir eine vollständige 160-Fahrer-/200-km-Simulation versprechen.


## Abschluss der Integrationsphase und nächste Aufgabe (03.11.2026)

Die Zusammenführung wurde über [PR #20](https://github.com/Lancester/radsportmanager/pull/20) erfolgreich auf `main` übernommen. Der gemeinsame Kern ist [motion-core.ts](../src/engine/physics/motion-core.ts). [Issue #18](https://github.com/Lancester/radsportmanager/issues/18) wurde **abgeschlossen**.

**49/49 lokale Tests bestanden**, vollständige TypeScript-Typprüfung erfolgreich; manuelle Node-Kurzmessung mit 1/20/160 unabhängig gerechneten Fahrern über 4 km dokumentiert. Noch kein Browser-/Web-Worker-/Android-Test; keine GitHub Actions aktiviert.

**Verbindlicher nächster technischer Arbeitsauftrag:** [Issue #21 – R-03 Windschatten zunächst mit zwei Fahrern](https://github.com/Lancester/radsportmanager/issues/21). Erst physikalische Aero-Reduktion mit echtem gemeinsamem Fahrzustand, dann Führungswechsel und wachsende Gruppen. Der Android-Benchmark gehört zu den ersten weiteren Nachweisen, **bevor** 160 Fahrer über 200 km als technisch machbar gelten.

**Spätere Spielanforderung, gesichert unter [Issue #19](https://github.com/Lancester/radsportmanager/issues/19):** individuelle Fahrtechnik, Risikobereitschaft, fahrerisches Talent und spezielles Training. Noch keine Gameplay- oder Fahrer-KI-Implementierung.

## Neuester Stand: R-03 – zwei Fahrer mit Windschatten (03.11.2026)

**Erledigt:** Im neuen `src/engine/physics/drafting-pair.ts` werden erstmals zwei Fahrer **auf derselben Simulationsuhr** berechnet. Beide haben eigene longitudinalen/lateralen Positionen, Geschwindigkeiten, Pedalleistungen und mechanische Energiebilanzen. Der gemeinsame dynamische Physiksolver `motion-core.ts` wurde um einen nur auf den Luftwiderstand wirkenden Aero-Faktor erweitert. Alle vorherigen APIs bleiben erhalten.

**Statische R-03-Referenz (39,6 km/h, flach, windstill, 80 kg, CdA 0,30, Crr 0,004, η 0,975):** Im Wind braucht der fiktive Fahrer **281,14 W am Pedal**; dicht dahinter bei 0,5 m Modell-Radabstand **216,00 W**. Die 65,14 W Ersparnis folgen nur aus reduziertem Luftwiderstand – der Rollwiderstand bleibt gleich. Die 35-%-Maximalreduktion und exponentielle Abstandsfunktion sind **vorläufige und noch nicht gemessene Testannahmen**, keine endgültigen Radsport-Koeffizienten.

**Dynamische Tests:** Der Schutz nimmt bei größerer Lücke ab. Ein natürlicher Führungswechsel ist durch Längsüberholen auf einer versetzten Spur protokollierbar. In derselben Spur wird eine geometrische Überlappung **als Fehler gemeldet**, da noch keine sichere Spur- oder Kollisionsvermeidung implementiert ist.

**Tatsächlich lokal ausgeführt:** **49 alte + 15 neue = 64/64 Tests bestanden**, Node.js 22.16.0; TypeScript-Typprüfung (`tsc 5.8.3`) ohne Fehler. Keine GitHub Actions gestartet. Manueller Node-Kurzbenchmark mit unabhängigen 12-s-Zweierläufen: 1 / 10 / 100 Läufe, Median **0,82 / 8,39 / 41,15 ms**. **Nicht** auf 160 Fahrer / 200 km extrapolieren.

**Dokumentation:** [physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md](physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md).

**Noch nicht entwickelt:** Querwind, mehrere Nachbarn, natürliche seitliche Bewegung, automatische Positions-KI, Fahrerphysiologie, Peloton mit 160 Fahrern oder Android-Web-Worker-Test.

**Nächster konkreter Schritt:** Erst die R-03-Engine auf einem echten Android-Smartphone im Browser/Web Worker messen, dann eine kleine Gruppe mit 3–8 Fahrern und nachvollziehbaren Windschatten-Nachbarschaften aufbauen. Der Teammanager- und Fahrerfähigkeits-Teil bleibt späteres Vorhaben. Fachliche Parameter und die offene Fragenliste mit dem Nutzer im Chat besprechen.


## Abschluss R-03 und nächster technischer Schritt (03.11.2026)

**[PR #22](https://github.com/Lancester/radsportmanager/pull/22)** wurde erfolgreich in `main` übernommen. Alle neuen Quelldateien, Tests und die Dokumentation wurden danach in `main` erneut per GitHub-Lesezugriff überprüft. **[Issue #21](https://github.com/Lancester/radsportmanager/issues/21)** ist als erster, abgegrenzter **Zweier-Windschattenprototyp abgeschlossen**.

**64/64 lokale Node.js-Tests bestanden und TypeScript-Typprüfung erfolgreich**, darunter 15 neue Zweier-Tests. Die angenommene Aero-Reduktionsfunktion ist noch **nicht empirisch kalibriert**; Kollision in derselben Spur führt zu erklärtem Fehler, keine automatische Kollisionsvermeidung.

**Nächster konkreter Auftrag:** [Issue #23 – Android-Web-Worker-Benchmark und darauf aufbauende erste 3–8-Fahrer-Gruppen](https://github.com/Lancester/radsportmanager/issues/23). Vor den ersten tatsächlichen Android-Messwerten dürfen keine Hochrechnungen zur Laufzeit einer kompletten 160-Fahrer-/200-km-Etappe als gesichert gelten. Die allgemeinen Issues #4 (Gruppen/Windschatten) und #6 (statistische Validierung/Android) bleiben offen.

## Android-Web-Worker-Benchmark vorbereitet (03.11.2026)

**Auftrag:** R-03 auf einem echten Android-Smartphone messen, bevor große Pelotons implementiert werden.

**Im neuen GitHub-Pull-Request vorbereitet:**
- `docs/index.html`: deutschsprachige mobile Testseite mit drei Größen (1/10/80 unabhängige Zweiergruppen), Abbruchmöglichkeit, Rechenzeitmessung und lokal kopierbarem Ergebnisbericht.
- `docs/benchmark/app.js` und `docs/benchmark/r03-worker.js`: die eigentliche Simulation läuft in einem Web Worker ohne Blockieren der Oberfläche; eindeutige Ergebnis-Prüfzahl.
- `npm run build:benchmark`: **bestehende** R-03-TypeScript-Engine samt Physikimporten wird mit TypeScript 5.8.3 in echtes Browser-JavaScript kompiliert. Keine separat entwickelte zweite Physik-Engine.
- `.github/workflows/r03-benchmark-pages.yml`: kleiner auf relevante Dateien begrenzter GitHub-Pages-Workflow mit Node 22, allen 64 Physiktests, anschließender Browser-Übersetzung und 10-Minuten-Timeout. **Erstmalig bewusst GitHub Actions zur Veröffentlichung; Standard-Runner sind im öffentlichen Repo laut GitHub kostenlos.** Keine periodischen Simulationen oder umfangreichen Monte-Carlo-Läufe.
- Ausführliche Anleitung und Einschränkungen: [ANDROID_BENCHMARK.md](ANDROID_BENCHMARK.md).

**Tatsächlich lokal geprüft:** 64/64 vorhandene Tests bestanden, TypeScript-Übersetzung erzeugte korrekt auf `.js` umgestellte Importe, JS-Worker konnte unter Node.js als kontrollierte Testumgebung sowohl 1 Paar / 12 s als auch 80 unabhängige Paare / 120 s ausführen, inklusive reproduzierbarer Prüfsumme. Der synthetische 80-Paar-Lauf benötigte lokal ca. 0,43 s pro Wiederholung; dies ist **keine Android-Messung**.

**Noch ausdrücklich nicht geprüft:** Benutzeroberfläche in einem echten Browser auf Android, GitHub-Pages-Deployment und Performance/Kompatibilität des echten Smartphone-Web-Workers. Ein grafischer Browseraufruf im Arbeitscontainer wurde durch Zugriffsregeln blockiert.

**Nächste Nutzeraktion:** GitHub Repository `Lancester/radsportmanager` → Settings → Pages → Source **GitHub Actions** auswählen; falls nötig den bestehenden Workflow unter Actions manuell erneut starten. Erst nach erfolgreichem Deployment die vorgeschlagenen Testläufe in Chrome auf dem Android-Gerät ausführen und den Ergebnisbericht hier teilen.

**Nachfolgende Entwicklung:** Auf Grundlage dieser echten Messungen 3–8 gekoppelte Fahrer auf einer gemeinsamen Zeitachse mit Positions-/Windschatten-Nachbarschaft statt unabhängiger Paare implementieren. [Issue #23](https://github.com/Lancester/radsportmanager/issues/23) bleibt bis zur Android-Messung und späteren Gruppenerweiterung offen.


## GitHub-Abschluss des Android-Benchmark-Bausteins (03.11.2026)

Die Android-Testwebseite, die Browser-Worker-Dateien und der kleine Build-/Pages-Workflow wurden über [PR #24](https://github.com/Lancester/radsportmanager/pull/24) **erfolgreich in main** übernommen. Die Dateien wurden danach unmittelbar über den GitHub-Connector auf main geprüft; lokale Quelldatei-Hashes von HTML, app.js und r03-worker.js stimmen mit den GitHub-Blobs überein.

**Aktueller tatsächlicher Status:** 64/64 Node-Tests erfolgreich, TypeScript-Browsermodul lokal kompiliert und Worker-Logik synthetisch unter Node aufgerufen. **Der echte GitHub-Pages-Publish und ein Browser-/Android-Lauf wurden noch nicht bestätigt.** Ein lokaler Playwright-/Chromium-Aufruf war durch den Container-Netzwerkzugriff blockiert. Keine Android-Zahlen erfinden.

**Nächste Nutzeraktion:** Einmalig Repository → Settings → Pages → Source „GitHub Actions“ auswählen, anschließend auf erfolgreichen Workflow und Pages-Link prüfen, gegebenenfalls den bestehenden Workflow manuell starten. Danach Testläufe auf Android Chrome und JSON-Ergebnis hier im Chat. [Issue #23](https://github.com/Lancester/radsportmanager/issues/23) bleibt offen; echte Gruppendynamik mit 3–8 Fahrern kommt erst danach.


## GitHub-Actions-Fehlerdiagnose: R-03-Pages-Publish (03.11.2026)

**Betroffener Lauf:** [Actions Run #41676386568](https://github.com/Lancester/radsportmanager/actions/runs/41676386568), Job `deploy`, ID `126058035865`.

**Vom tatsächlichen Job-Protokoll bestätigt:** Checkout, Node.js, TypeScript-Installation, **alle 64 Physiktests** und die Browser-JavaScript-Übersetzung waren erfolgreich. Erst der zusätzliche Node-ESM-**Smoketest** beendete sich mit Exit-Code 1; die GitHub-Pages-Schritte wurden dadurch **übersprungen**.

**Ursache:** Der Workflow verlangte mit `result.elapsedS !== 12` eine *exakt* repräsentierte Gleitkomma-Zeit. Die Simulationsuhr benutzt 0,2-s-Schritte und liegt durch Rechenrundung bei ungefähr `11.999999999999986` Sekunden (Abweichung 1,4×10⁻¹⁴ s). Das ist eine normale Rundungsabweichung, **kein Fehler in der Fahrphysik**. Die Node.js-20- und Ubuntu-Meldungen im Screenshot waren nur Warnung/Hinweis.

**Korrektur:** Workflow-Smokeprüfung verlangt nun `abs(result.elapsedS - durationS) <= 10^-9 s` und kontrolliert zusätzlich Endpositions-Finitheit und positive Schrittzahl; sie gibt Prüfwerte bei Fehlern aus. Es werden **keine Physikformeln, Simulationstests oder Benutzerdaten** geändert.

**Wichtig:** Nach dem Code-Fix erneut gestarteter Pages-Build muss *erst noch erfolgreich abgeschlossen* sein; aus dem alten Lauf lässt sich kein tatsächlicher Pages-Status ableiten. Sollte ein anschließender `configure-pages`-/`deploy-pages`-Schritt scheitern, Pages-Einstellung oder GitHub-Berechtigungen anhand dessen Logs prüfen. Der Nutzer muss nichts an Node.js oder Ubuntu ändern.


## Erster tatsächlich durchgeführter Android-Test (03.11.2026)

**Ergebnis vom Nutzer direkt aus dem Android-Browser übermittelt:** Die veröffentlichte GitHub-Pages-Webseite und ihr Web Worker führen die R-03-Physik tatsächlich auf Android aus. Die frühere Formulierung, dass es noch keinen echten Android-Lauf gibt, ist damit für den **kleinen Test** überholt. **Mittlerer und großer Test sind weiterhin offen.**

| Messgröße | Erster Android-Test |
| --- | --- |
| Veröffentlichter Git-Stand | `dffcf78` (Fix-Commit aus PR #25) |
| Browser | Chrome 156 auf Android (User-Agent meldet eine reduzierte Android-Kennung, keine verifizierte OS-Version) |
| Zeitpunkt des Berichts (UTC) | 2026-11-03T17:00:40.740Z |
| Testumfang | 1 Zweiergruppe, 2 Fahrer, 12 virtuelle Sekunden |
| Rechenschritte | 60 pro Wiederholung |
| Wiederholungen | 3 |
| Rechenzeiten | **18,8 ms / 7,1 ms / 4,6 ms** |
| Median | **7,1 ms** |
| Simulations-Prüfsumme | **276,626283** (innerhalb der drei Wiederholungen gleich) |
| Laufzeitumgebung | **Web Worker im Android-Browser** |

**Interpretation:** Echter erster Machbarkeitsnachweis für die R-03-Zweierfahrt auf Android, inklusive vom Browser zurückgelieferter, reproduzierbarer Prüfzahl und messbarer Laufzeit. Der deutliche Unterschied zwischen den drei Messungen könnte mit JIT-Warm-up, Caches oder Systemschwankungen zusammenhängen; er ist **nicht** als Ursache verifiziert. Die Prüfsumme wurde bisher nur zwischen den Wiederholungen auf diesem Gerät als gleich bestätigt, **noch nicht separat gegen eine unabhängige Node-Referenz derselben Buildversion verglichen**.

**Nicht daraus ableiten:** Keine Zusage für 20 oder 160 Fahrer in realen Gruppen, keine Aussage über 200 km, Akku-/Temperatur-/Speicherkosten und keine Web-Worker-Verhaltensprüfung bei Sperrbildschirm oder langer Laufzeit. Der Test mit 160 Fahrern auf der Webseite besteht vorerst aus **80 unabhängigen Zweiergruppen**.

**Nächste Messung:** Auf derselben Webseite den **mittleren Test (10 Paare, jeweils 120 virtuelle Sekunden)** und dann den **großen Test (80 Paare, jeweils 120 virtuelle Sekunden)** ausführen, jeweils Berichte im Chat teilen. Die Zeiten über verschiedene Größen sind interessanter als eine lineare Hochrechnung aus dem kleinen Test.


## Aktuellster Stand: alle drei Android-Web-Worker-Tests erfolgreich (03.11.2026)

Die Testwebseite wurde mit dem Browserstand **`dffcf78`** tatsächlich auf Android (Chrome 156) benutzt. Nach dem bereits dokumentierten Klein-Test wurden **auch Mittel und Groß erfolgreich gemessen**. Jeweils drei Läufe:

- **1 unabhängiges Paar / 2 Fahrer / 12 virtuelle Sekunden / 60 Paar-Schritte:** Median **7,1 ms**, Prüfsumme 276,626283.
- **10 unabhängige Paare / 20 Fahrer / je 120 virtuelle Sekunden / 6.000 Paar-Schritte:** Median **35,5 ms**, Rohzeiten 75 / 35,5 / 26,2 ms, Prüfsumme **24.318,863289**.
- **80 unabhängige Paare / 160 Fahrer / je 120 virtuelle Sekunden / 48.000 Paar-Schritte:** Median **191,8 ms**, Rohzeiten 257,7 / 191,8 / 166,5 ms, Prüfsumme **194.550,906309**.

Die zwei 120-s-Prüfsummen skalieren achtfach (Abweichung 0,000003 infolge Endrundung). 8-fache Zahl von Zweiergruppen ergibt etwa **5,40-fache Median-Laufzeit**; der genaue Grund der nichtlinearen Skalierung wurde nicht untersucht. Das ist ein erfolgreicher **erster echter Android-Physikbenchmark**, aber **noch kein vollständiges 160-Fahrer-Peloton oder 200-km-Rennen**.

**[Detaillierte Auswertung](ANDROID_BENCHMARK.md)**. **Nächste Entwicklung:** zuerst deterministische **3–8 Fahrer auf einer gemeinsamen Uhr mit echten Nachbarschafts-/Abstandsinteraktionen**, danach auf dem Android-Web-Worker benchmarken. [Issue #23](https://github.com/Lancester/radsportmanager/issues/23) bleibt dafür offen. Keine GitHub-Actions-Dauerlast oder automatischer großer Monte-Carlo-Test erforderlich; aus diesen Daten noch keine Zusage zur Langzeit-Performance machen.

## In Entwicklung: R-03G – Achtfahrergruppe auf gemeinsamer Uhr (03.11.2026)

**Vom Nutzer ausdrücklich beauftragt:** acht Fahrer miteinander fahren lassen und klären, ob schon KI-Entscheidungen stattfinden. **Antwort: Noch keine taktische KI.** Vorgaben für Pedalleistung/Spur bleiben extern; die physikalische Reaktion ist dynamisch.

**Neuer Implementierungsstand im Entwicklungsbranch:** `src/engine/physics/drafting-group.ts` mit 3–8 Fahrern, tatsächlich gemeinsamen Zeitschritten und Windschatten aus mehreren vorausfahrenden Nachbarn. Vorläufige Mehrfahrer-Abschirmung ist mathematisch gedeckelt, nicht empirisch kalibriert. Kollisionen in einer Spur lösen einen Fehler aus, da noch kein autonomes Ausweichen existiert. Als kontrollierbares Testbeispiel wird F8 nach Sekunde 30 um 45 W schwächer; eine Lücke bildet sich aus der Bewegungsphysik und löst ein dokumentiertes Ereignis aus.

**Prüfstatus beim Erstellen des Branches:** **16 neue Tests lokal** mit einer mathematisch entsprechenden Testversion des Physikintegrators erfolgreich; TypeScript 5.8.3 Typprüfung für das neue Modul bestanden. Der **vollständige echte GitHub-Integrationslauf aus 64 bisherigen + 16 neuen Tests** muss durch den vorhandenen kleinen Pages-Workflow nach Übernahme in `main` erst noch bestätigt werden. Bis dahin **nicht** „80/80 auf GitHub bestanden“ behaupten.

**Android:** Die vorhandene öffentliche Webseite bekommt einen vierten Testknopf **„8 Fahrer gemeinsam · 120 s“**, der die **kompilierte Original-TypeScript-Gruppenengine** als Web Worker verwendet. Testergebnis einschließlich Prüfsumme, Lückenweite, Ereigniszeit und tatsächlicher Rechenzeit wird lokal ausgegeben; noch **keine echte Android-Messung** des Gruppenmodus. Die alten 1/10/80-Paar-Presets bleiben nutzbar.

**Technische Erklärung:** [physik/R03G_ACHTFAHRER.md](physik/R03G_ACHTFAHRER.md).

**Nächster Schritt:** Pull Request prüfen und in main übernehmen; GitHub Actions mit **80 Tests und Gruppen-ESM-Smoke-Test** prüfen. Danach vom Nutzer echten Android-Worker-Benchmark für 8 gekoppelte Fahrer über 120 s abfragen. Später: natürliches Aufrücken/Verdrängen, Taktik-Agenten, kalibrierte Aero-Modelle und größere Gruppen.


## GitHub-Integration und Pages-Bereitstellung bestätigt (03.11.2026)

**Pull Request:** [#26](https://github.com/Lancester/radsportmanager/pull/26) wurde mit Squash-Commit `5caca0213f1ece1d32ae7d8345b686909a5ba2a9` erfolgreich in `main` übernommen.

**Erfolgreicher GitHub-Actions-Lauf:** [#41683075141](https://github.com/Lancester/radsportmanager/actions/runs/41683075141) vom 03.11.2026, Job `deploy` – `status=completed`, `conclusion=success`. Die tatsächlichen Job-Logs bestätigen:
- **80 Tests ausgeführt, 80 bestanden, 0 fehlgeschlagen** (64 alte + 16 neue).
- Bestehende R-03-TypeScript-Engine plus neues Gruppenmodul für Browser erfolgreich übersetzt.
- ESM-Smoketest: sowohl Zweier- als auch **Achtfahrer-Modul erfolgreich** aus dem generierten JavaScript importiert; Achtfahrer-Test hat **600 Rechenschritte** abgeschlossen und eine Lücke erzeugt.
- GitHub-Pages-Upload und -Deployment erfolgreich. Bestätigter Link: **https://lancester.github.io/radsportmanager/**.

**Neuer Android-Testknopf:** `NEU · 8 Fahrer gemeinsam · 120 s`. Der Browser-Web-Worker lädt `drafting-group.js`, führt die gekoppelte Achtfahrer-Rechnung dreimal aus und zeigt Median-Rechenzeit, Prüfsumme, Lückenweite und Ereigniszeit. **Noch nicht tatsächlich vom Nutzer auf Android ausgeführt**; die obigen erfolgreichen Ergebnisse stammen aus dem GitHub-Runner, nicht vom Smartphone.

**Für den Nutzer:** Testseite öffnen, ausschließlich den neuen Achtfahrer-Knopf betätigen, Ergebnis kopieren und im Chat mitteilen. Die bisherigen unabhängigen Zweier-Tests bleiben unverändert verfügbar.

**KI weiterhin nicht enthalten:** Feste Spur, feste Startleistung, ein von außen veranlasster −45-W-Befehl für F8 nach 30 s. Reaktion, Windschatten, Position, Geschwindigkeit und Lückenereignis entstehen im dynamischen Physikmodell. Fahrertechnik, Positionsentscheidungen und Teamtaktik später als separate Agenten.


## Erste echte Android-Messung der gekoppelten Achtfahrergruppe (03.11.2026)

**Tatsächlicher Nutzerbericht vom Android-Smartphone, nicht von Node.js oder GitHub Actions:** Der neue gekoppelte Achtfahrer-Test wurde erfolgreich im veröffentlichten **Web Worker** ausgeführt. Szenario-/Build-Version `r03-android-v2`, Commit **`5caca02`** (entspricht dem verifizierten Merge-Commit `5caca0213f1ece1d32ae7d8345b686909a5ba2a9`), Chrome **156** unter Android. Der User-Agent `Android 10; K` erlaubt **keine** sichere Bestimmung der konkreten Hardware oder Android-Version.

| Kennzahl | Gemessen bzw. vom Worker zurückgemeldet |
| --- | ---: |
| Fahrermodus | **8 Fahrer gemeinsam** (`achtfahrer-gruppe`) |
| Virtuelle Zeit | **120 s** |
| Gemeinsame Schritte je Wiederholung | **600** à 0,2 s |
| Drei reale Rechenzeiten | **52,9 / 26,8 / 19,7 ms** |
| **Median** | **26,8 ms** |
| Ergebnis-Prüfsumme | **10560,145488** (innerhalb aller 3 Wiederholungen identisch) |
| Endlücke zwischen F7 und F8 | **100,414498 m** |
| Erfasste Lückenereignisse | **1** |
| Zeitpunkt der ersten offenen Lücke | **44 s** virtuelle Zeit |
| Letztes Tempo von F8 | **34,762058 km/h** |
| Zeitpunkt des Berichts (UTC) | **2026-11-03T17:26:40.842Z** |

**Plausibilitätskontrolle:** In der Demo haben zunächst acht Fahrer auf einer Ebene feste Wattzahlen und Abstände. Nach **30 virtuellen Sekunden** wird bei F8 **durch ein vorgegebenes Testkommando**, nicht durch KI, die Leistung um 45 W gesenkt. F8 fällt durch die dynamische Kraftrechnung zurück, die Windschattenwirkung wird bei wachsender Lücke kleiner und die Lücke überschreitet bei **Sekunde 44** die vorläufige Meldeschwelle von **8 m**. Das im Android-Bericht festgestellte **100,414498-m-Ergebnis** passt zum zuvor lokal geprüften Gruppentest. Die ursprüngliche GitHub-Actions-Testserie mit **80/80 bestandenen Tests** und erfolgreich ausgelieferter Webseite ist separat verifiziert.

**Bedeutung:** Erster tatsächlich auf Android ausgeführter **gekoppelter** Mehrfahrerphysiktest – im Unterschied zu den bisherigen **80 unabhängigen Zweiergruppen**. Der Lauf dauerte auf diesem Browser im Median nur rund **0,027 reale Sekunden**, um **120 virtuelle Sekunden** mit acht dynamisch wechselwirkenden Fahrern zu berechnen.

**Grenzen:** Die drei Laufzeiten streuen erheblich; beispielsweise können JIT-Warm-up und Hintergrundlast dazu beitragen, die Ursache ist aber nicht diagnostiziert. Der 160-Fahrer-Vergleichstest mit 191,8 ms berechnete **80 getrennte Zweiergruppen** und ist **kein direkter Skalierungsvergleich**. Gruppen-Aerodynamik bleibt heuristisch (max. 35 % Luftwiderstandsreduktion), keine selbständige Fahrtechnik, taktische KI, Spurwechsel- oder Kollisionsvermeidung, kein Querwind, keine Ermüdung, keine 200-km-Etappe, keine Akku-/Temperatur- oder Sperrbildschirm-Messung. **Daher keine belastbare Prognose für 160 miteinander interagierende Fahrer.**

**Nächste fachliche Entwicklungsentscheidung:** Vor größerem Peloton zuerst eine begrenzte **regelbasierte Reaktion** auf sich öffnende Lücken (z. B. mehr Leistung aufbringen oder zurückfallen), danach sichere seitliche Positionsbewegung und die schon beschlossenen individuellen Fähigkeiten (Fahrtechnik, Positionierung, Risiko). **Das ist ein Vorschlag, keine bisher implementierte oder vom Nutzer beschlossene KI.** Der Physikkern bleibt für tatsächlich gefahrene Geschwindigkeiten maßgeblich.


## Abschluss des Achtfahrer-/Android-Meilensteins (03.11.2026)

**Issue #23 nach echtem Android-Gruppenbenchmark als abgeschlossen markiert.** 8 physikalisch gekoppelte Fahrer über 120 s wurden auf Android mit **26,8 ms Median** gemessen (3 Läufe 52,9/26,8/19,7 ms); Prüfsumme 10560,145488, F8-Endlücke 100,414498 m, erstes Lückenereignis bei 44 s. Der GitHub-Pages-Build der Gruppenengine hatte zuvor **80/80 Tests erfolgreich**. Alle Details stehen in [ANDROID_BENCHMARK.md](ANDROID_BENCHMARK.md).

**Nächste fachliche Option (nicht automatisch beschlossen):** [Issue #27 – einfache regelbasierte Fahrerreaktion auf eine aufreißende Lücke](https://github.com/Lancester/radsportmanager/issues/27). Dafür zuerst Reaktionsschwellen, Watt-/Physiologiegrenzen und spätere sichere Positionsbewegungen diskutieren. Die reine Physik bleibt bestehen. Noch keine autonome KI oder echtes 160-Fahrer-Peloton.


## Neu: R-04 – erste begrenzte Fahrer-KI für Lückenreaktion (03.11.2026)

**Auftrag:** Erklären, wie wir Fahrer-KI programmieren, sie im Achtfahrer-Modell erstmals implementieren und die Reife des gesamten Rennsimulators einordnen.

**Implementiert in diesem Entwicklungsbranch:** `src/engine/ai/gap-controller.ts` als **eigene, reine regelbasierte TypeScript-Zustandsmaschine**, **ohne ML- oder KI-Bibliothek**. F8 kann eine wachsende Lücke erkennen, für eine begrenzte Zeit mehr Kurbelwatt anfordern und nach einem festen Limit in einen Erholungsmodus wechseln. Der Agent schreibt **keine** Geschwindigkeit/Position direkt um. `src/engine/physics/drafting-group.ts` unterstützt optionale Agenten; ohne Agent ist der frühere Gruppenlauf weiterhin unverändert. **15 neue Tests** für Regeln und reale Gruppenintegration werden zur bisherigen Suite mit **80 Prüfungen** ergänzt.

**Android:** Die GitHub-Pages-Webseite enthält zwei vergleichbare Achtfahrer-Presets **„ohne KI“ / „mit Regel-KI“**. Web Worker verwendet die aus demselben TypeScript-Kern generierten Module. Neues Ergebnis umfasst die Anzahl der Agentenentscheidungen, Nachsetzzeit, zusätzlichen Antriebsaufwand und Endlücke. **Echte Android-Laufzeit dieser neuen KI-Version noch nicht gemessen.**

**Wichtig:** Gesamttest `95/95`, Browser-Smoke-Test und Deployment sind **erst nach GitHub-Actions-Ausführung zu verifizieren**. Der frühere Stand `80/80` und **26,8 ms für acht gekoppelte Fahrer ohne KI** bleiben bestätigt; diese früheren Messwerte niemals als aktuelle KI-Benchmarks ausgeben.

**Reife:** Die Einzel-Fahrphysik (Ebene, Berg, Abfahrt, Bremsen, Kurvenkontrollpunkte, Rotation) und **erste Mehrfahrerphysik** (Windschatten, 8 Fahrer, Android) sind technische Prototypen, aber noch nicht zu einer durchgehend realistischen Rennengine verbunden. **Noch keine 160-Fahrer-Rennsimulationsversion oder spielbare Managerkarriere**. Kritische Lücken: 2D-Feldpositionen und sicheres Ausweichen/Bremsen, echte Gruppen-Kurvenphysik, Querwind, CP/W′/Ermüdung, vielfältige taktische Fahrer- und Teamentscheidungen, vollständige 200-km-Etappen und Spieleoberfläche.

**Ausführliche Erklärung, offener Entscheidungsbedarf und Abgrenzungen:** [ai/LUECKENAGENT.md](ai/LUECKENAGENT.md). **Folge:** zunächst Tests und tatsächlichen Android-KI-Benchmark verifizieren, dann sichere Positionierung/Abstände und ein echtes Leistungsdauer-Modell diskutieren.


## Verifizierter Abschluss der R-04-Implementierung (03.11.2026)

**Code:** [PR #28](https://github.com/Lancester/radsportmanager/pull/28) integrierte den neuen `src/engine/ai/gap-controller.ts` und die optionale Agentenkopplung an `drafting-group.ts`. [PR #29](https://github.com/Lancester/radsportmanager/pull/29) korrigierte nach dem tatsächlichen ersten fehlgeschlagenen Browser-Build nur die TypeScript-Ausgabepfade (durch `../ai` ist der gemeinsame Quellpfad jetzt `src/engine`; im Browser liegt der übersetzte Rechenkern unter `generated/physics/`).

**Bestätigter GitHub-Actions-Erfolg:** [Run #41692857294](https://github.com/Lancester/radsportmanager/actions/runs/41692857294), Squash-Commit `5b4e737e8f7917d37037cc3d098455c448da56b7`, `conclusion=success`, Node.js/TypeScript-Übersetzung, Agenten-ESM-Smoke-Test und GitHub-Pages-Deployment erfolgreich.

- **95 Tests**, davon **95 bestanden, 0 Fehler** (80 bisherige + 15 neue Regeln-/Agenten-Tests).
- Im echten kompilierten Browsermodul werden dieselben 8 Fahrer über **120 virtuelle Sekunden / 600 Schritte** simuliert. Beide Rennvarianten nutzen exakt dieselbe Physik und dieselbe anfängliche Formation.
- **Ohne KI** beträgt die Endlücke F7→F8 **100,41449796114853 m**.
- **Mit regelbasierter KI bei F8** beträgt die Endlücke **53,84653579082055 m**, also rund **46,57 m weniger**.
- **4 protokollierte Agentenzustandswechsel** im integrierten Smoke-Test.
- Die ursprüngliche externe −45-W-Vorgabe für F8 ab Sekunde 30 bleibt in beiden Szenarien erhalten; der Agent darf darauf befristet durch eine höhere eigene Wattanforderung reagieren. Es gibt keine direkte Änderung von Strecke oder Tempo.

**Veröffentlicht:** https://lancester.github.io/radsportmanager/ – bisheriger Vergleichsknopf `8 Fahrer · ohne KI · 120 s` und neu `NEU · 8 Fahrer · mit Regel-KI`. **Noch nicht** auf dem realen Android-Smartphone mit dem Agenten gemessen; die früheren 26,8 ms waren der **ohne-KI-Gruppenbenchmark**, nicht dieses neue Szenario.

**Fachliche Einordnung:** Die Agentenentscheidung ist deterministisch und transparent, aber noch ein **sehr kleiner Einzelfall**. Weder physiologische Leistungs-Dauer-Grenzen noch sichere Abstands-/Spurentscheidungen, umfassende taktische Fahrer-KI, komplette Gruppenkurven, Querwind oder ein gemeinsames 160-Fahrer-200-km-Rennen sind vorhanden. Die gesamte Rennengine bleibt eine **frühe Prototypenphase**, der Manager selbst ist noch nicht spielbar.

**Unmittelbarer nächster Schritt:** Der Nutzer führt beide Achtfahrer-Presets auf demselben Android-Gerät aus und übermittelt die neuen JSON-Berichte, besonders `agentPursuitS`, `agentDecisionCount`, `agentExtraWorkJ`, `finalGapM` und `medianMs`. Danach zuerst Abstandssicherung und CP/W′-Modellplanung, um wattgetriebene Kollisionen und unrealistische Dauerleistungen zu vermeiden.


## Android-Vergleich: erste Fahrer-Regel-KI gegen reine Physik bestanden (03.11.2026)

**Quelle: zwei vom Nutzer unmittelbar aus der veröffentlichten GitHub-Pages-Webseite auf demselben Android-Gerät kopierte JSON-Berichte.** Browser-Engine-Commit `5b4e737` (GitHub-Merge `5b4e737e8f7917d37037cc3d098455c448da56b7`), `r04-android-v3`, Chrome 156 / Android, Web Worker. Prüfsummen wurden durch die Webseite jeweils über drei identische Simulationswiederholungen verglichen. Das Gerät lässt sich aus dem abstrahierten User-Agent nicht sicher identifizieren.

| Kennzahl | Acht Fahrer **ohne KI** | Acht Fahrer **mit Regel-KI bei F8** |
| --- | ---: | ---: |
| Virtuelle Simulationszeit | 120 s | 120 s |
| Gemeinsame Rechenschritte | 600 | 600 |
| Rechenzeiten (3 Wiederholungen) | 24,4 / 21,6 / 14,3 ms | 42,1 / 32,9 / 22,3 ms |
| **Median-Rechenzeit** | **21,6 ms** | **32,9 ms** |
| Prüfsumme | 10560,145488 | 10606,739017 |
| Endlücke F7→F8 | 100,414498 m | 53,846536 m |
| Ein Lückenereignis bei | 44,0 s | 45,8 s |
| Endtempo F8 | 34,762058 km/h | 37,732002 km/h |
| Protokollierte Agenten-Zustandswechsel | – | 4 |
| Erster Nachsetzbeginn | – | 39,0 s |
| Gesamtdauer im Zustand `nachsetzen` | – | 60 s |
| Modellierte zusätzliche Antriebsarbeit | – | **3367,38807 J** (ca. 3,37 kJ) |
| Zeitpunkt des Nutzerberichts UTC | 18:33:26.889 | 18:33:38.673 |

**Physikalischer/spielerischer Vergleich:** Das identische Achtfahrer-Szenario endet mit KI bei F8 um **46,567962 m (46,38 %) geringerer Lücke** und ungefähr **2,970 km/h höherem Endtempo**. Die KI setzt dafür zusätzliche Pedalleistung ein, nicht einen Positions- oder Temposprung. Die **3367 J** sind die vom aktuellen Code summierte, näherungsweise zusätzliche mechanische Antriebsarbeit aus dem Agenten-Wattaufschlag während der Nachsetzintervalle; **noch keine vollständig modellierte physiologische W′-Erschöpfung**. Die Nachsetzzeit **60 s ist die Summe mehrerer Phasen**; die Regelgrenze von **30 s gilt pro Nachsetzphase**, nicht insgesamt über die ganzen 120 s. Der Wert `agentDecisionCount=4` zählt protokollierte **Zustandswechsel**, nicht sämtliche im 1-s-Takt ausgewerteten Entscheidungen.

**Rechenleistung:** Die Mediane unterscheiden sich um **11,3 ms**, hier rund **52,3 %**. Wegen nur drei Wiederholungen pro Variante, schwankender Rohzeiten und nicht randomisierter Ausführungsreihenfolge ist dieser Prozentsatz **keine stabile isolierte Messung der reinen Agentenkosten**. Auch die physikalische Trajektorie des F8 ändert sich und damit dessen Berechnungen. Dennoch zeigt der Vergleich: Das zusätzliche kleine regelbasierte Entscheidungssystem läuft in diesem Test auf Android in wenigen Millisekunden.

**Technischer Abnahmestand:** Reale Browser-Web-Worker-Ausführung beider Varianten bestätigt; zuvor [95/95 GitHub-Tests und erfolgreicher Pages-Publish](https://github.com/Lancester/radsportmanager/actions/runs/41692857294) bestanden. **Erste Agentenmeilenstein-Messung abgeschlossen**, aber weiterhin **keine autonome Spur- und Kollisionsvermeidung, kein CP/W′/Ermüdungsmodell, keine Gruppen-Berg-/Kurvenfahrt, kein 160-Fahrer-Peloton oder kompletter Manager**. Die Aero-Abschirmung im Gruppenmodell ist nicht empirisch kalibriert.

**Empfohlene nächste technische Arbeit:** Sichere Abstandsregelung mit physikalisch begründeter Bremsung/Leistungsrücknahme, noch bevor Fahrer vollautomatisch Positionswechsel und Angriffe fahren. Danach CP/W′/Ermüdung integrieren, damit zusätzliche Watt nicht unbegrenzt zur Verfügung stehen.


## In Umsetzung: R-05 · Abstand und CP/W′ für Achtfahrer-KI (03.11.2026)

**Nutzerauftrag:** Abstands-/Kollisionsvermeidung und direkt anschließend CP/W′-Leistungsreserven mit der bisherigen KI verbinden. FTP als eigenständige grundlegende Kennzahl für die spätere Trainingssteuerung festhalten.

**Neuer Code im Entwicklungsbranch:**
- `src/engine/ai/following-safety.ts` – optionale longitudinale Reaktion: frühzeitig Watt wegnehmen und bei deutlicher Gefahr eine **reale Bremskraft** fordern. Bei nicht mehr ausreichend möglichem Bremsweg wird eine **Gefahr als Fehler** gemeldet. Noch keine garantierte vollständige Kollisionsvermeidung oder 2D-Spurentscheidung.
- `src/engine/physiology/critical-power.ts` – individuell gespeicherte **CP und W′** mit zwingender Joule-Bilanz, Wattbegrenzung bei Reserveende, bewusst vereinfachter Unter-CP-Erholung. **FTP wird separat und unverändert gespeichert**, niemals ungeprüft in CP umgerechnet.
- `src/engine/physics/motion-core.ts` – optional `brakeForceN` im bereits gemeinsamen Integrator; Energiegleichung enthält `brakeLossJ`.
- `src/engine/physics/drafting-group.ts` – Agentenwunsch → Sicherheitsregler → CP/W′ → gemeinsamer Physikschritt. Alte 8-Fahrer-Szenarien ohne Optionen bleiben verfügbar.
- Eigene R-05-Tests und separater Browserknopf `KI + Abstand + CP/W′`; über den vorhandenen kleinen Pages-Workflow erst zu prüfen.

**Vorheriger bestätigter Stand:** 95/95 Tests, echter Android-KI-Vergleich 21,6 ms ohne vs. 32,9 ms mit F8-Lückenregel. **Neuer R-05-Code/Android-Modus noch nicht als erfolgreich getestet behaupten**, bis der GitHub-Actions-Gesamtlauf und später die echte Android-Messung erfolgreich sind.

**Grenzen/offen:** FTP-Trainingszonen, CP/W′-Rekonstitutionsparameter und Langzeitermüdung, sichere Spurbewegung, Kurven-/Gefällebremsen im Feld und das zusammenhängende 160-Fahrer-Rennen sind noch nicht entwickelt. [R-05-Erklärung](physik/R05_ABSTAND_CP_WPRIME.md).


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


## Erster echter Android-R-05-Benchmark – KI, Abstand und CP/W′ (03.11.2026)

**Quelle:** Vom Nutzer aus der veröffentlichten GitHub-Pages-Testseite übermittelter vollständiger JSON-Bericht. Das ist ein **tatsächlicher Lauf auf Android im Chrome-Web-Worker**, keine Node-Hochrechnung. Buildstand `579f68a` (GitHub-Merge `579f68a27e3dcf9c4b80b17d4cf22ebd2fd3d0bd`), `benchmarkVersion=r05-android-v4`, Modus `achtfahrer-sicher-cp`, Chrome 156. Der User-Agent nennt eine generische Android-Kennung, aus der sich die tatsächliche OS-Version oder das konkrete Gerät nicht zuverlässig ablesen lassen.

| Gemessene/berichtete Kennzahl | R-05 auf Android |
| --- | ---: |
| Fahrer / gemeinsame Simulationszeit | 8 / 120 s |
| Gemeinsame Rechenschritte pro Wiederholung | 600 |
| Rechenzeiten (drei Läufe) | 29,7 / 21,5 / 15,8 ms |
| **Median** | **21,5 ms** |
| Simulationsprüfsumme (in 3 Wiederholungen identisch) | **10591,625031** |
| Endlücke F7 → F8 | **68,951942 m** |
| Erstes erkanntes Lückenereignis | **45,8 s** |
| Endtempo F8 | **36,095269 km/h** |
| Agenten-Zustandswechsel / erste Nachsetzentscheidung | 4 / bei **39 s** |
| Kumulierte Zeit im Nachsetzmodus | **60 s** (mehrere max. 30-s-Phasen) |
| Zusätzliche mechanische Antriebsarbeit durch den Agenten (Modellwert) | **2089,034151 J** |
| W′-Startreserve des fiktiven F8 | **1200 J** |
| Kumulativer W′-Verbrauch oberhalb CP | **1432,350286 J** |
| Abgeleitete kumulative W′-Regeneration unter CP | **240,362365 J** |
| **W′-Rest nach 120 s** | **8,012079 J** |
| Zeit mit tatsächlicher CP/W′-Leistungsbegrenzung | **37,8 s** |
| Bremszeit / Sicherheitsereignisse | **0 s / 0** |
| CP-Leistungsbegrenzungsereignisse | **4** |
| Berichtzeitpunkt (UTC) | `2026-11-03T19:03:13.370Z` |

**Bilanzprüfung:** W′-Rest ≈ 1200 J − 1432,350286 J + 240,362365 J = 8,012079 J. **Der kumulierte Verbrauch darf über der Anfangskapazität liegen**, weil die Reserve zwischen Belastungen wieder (vorläufig heuristisch) regeneriert wird. `agentExtraWorkJ` (2089 J) ist **nicht** dasselbe wie der W′-Verbrauch oberhalb CP (1432 J); es wird gegenüber der ursprünglichen Wattvorgabe und mit berücksichtigt eingestelltem Antriebswirkungsgrad berechnet.

**Vergleich mit anderen tatsächlich gemessenen Android-Läufen, jeweils 8 Fahrer über 120 s:** Ohne KI betrug F8s Lücke **100,414498 m**, mit R-04-Regelagent ohne CP/W′-Limit **53,846536 m**, mit R-05-Agent und CP/W′ **68,951942 m**. R-05 erhält somit einen Teil des Vorteils gegenüber keiner KI (rund **31,46 m** kleinere Lücke), während physiologische Grenzen den Anschluss gegenüber dem unbegrenzten Agenten um **15,11 m** erschweren. **Die Android-Mediane 21,6 / 32,9 / 21,5 ms dürfen bei nur drei streuenden Messungen nicht als stabile Rangfolge der Algorithmusgeschwindigkeiten gedeutet werden.**

**Sicherheit:** Keine Bremsung in diesem **Abreißszenario**, weil F8 langsamer wird. Der separate bestandene Drei-Fahrer-Bremstest und 116/116 erfolgreich geprüfte GitHub-Tests belegen nur den vorhandenen begrenzten Längsabstandsschutz. **Keine Garantie kollisionsfreier Rennen**, kein automatischer 2D-Spurwechsel, kein Mehrfahrer-Kurven-/Reibkreis-Modell.

**Messmeilenstein erfüllt:** R-05-Worker mit CP/W′ und aktiver Abstandsregelung ist tatsächlich auf Android lauffähig. **Nicht** mit einem validierten physiologischen W′bal-Modell oder mehrstündiger 160-Fahrer-Rennsimulation verwechseln. Die gemessene W′-Regeneration beruht weiterhin auf einer frei gewählten Testheuristik; `ftpW` ist bewusst separat von `criticalPowerW`. Offene technische Nachfolgeaufgaben siehe Issues [#30](https://github.com/Lancester/radsportmanager/issues/30) und [#32](https://github.com/Lancester/radsportmanager/issues/32).


## R-06 – in Integration: drei kleine Teilentwicklungen gebündelt (03.11.2026)

**Auftrag des Nutzers:** Mehrere sinnvolle technische Schritte gemeinsam umsetzen, ohne nach jeder kleinen Änderung wieder einen Android-Knopf bedienen zu müssen.

**Umgesetzt im Entwicklungsbranch:** (1) Vorausschauende Längsabstandssteuerung mit optionalem ausdrücklich bekanntem Führungsbremsbefehl und physikalisch bilanzierter Bremse, (2) stetige extern befohlene Querverschiebung, Prüfung der gesamten Längs-/Querbewegung zwischen Schritten und echtes Überholereignis, (3) tatsächliche Kurbelwatt-Statistik relativ zur eigenständig gespeicherten FTP (Durchschnittsleistung, Zeit/Arbeit oberhalb FTP). Alte Achtfahrer-Szenarien bleiben ohne diese Zusätze unverändert. **Noch keine autonome Überhol-KI.**

**Abnahme ausstehend:** Bestehende **116 Tests**, neue R-06-Tests, TypeScript-Browser-Build und GitHub-Pages-Deployment müssen den echten GitHub-Actions-Lauf erst bestehen. Kein unbekanntes Android-Ergebnis behaupten. Neue Webseite mit zusätzlichem **65-s-Achtfahrer-Überholpreset** soll nach Erfolg automatisch veröffentlicht werden. Die bisherige Android-R-05-Messung von **21,5 ms** wird nicht ungeprüft auf neue Bewegungen übertragen.

**Weiter offen:** Wirklich robuste Sicherheit bei unvorhergesehenen Bremsmanövern, intelligente sichere Spurwahl, dynamische Fahrtechnik-/Kurvenphysik, kalibrierte CP/W′-/FTP-Trainingseffekte, volle 160-Fahrer-Etappen. [R-06-Fachdokumentation](physik/R06_SICHERHEIT_SPUR_FTP.md).


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


## R-07 in Entwicklung – autonome Überholspur, sichere Prognose und CP-gezügelte Attacke (03.11.2026)

Auf Wunsch des Nutzers wurden mehrere kleine, zusammenhängende Entwicklungen **in einem Durchgang** erarbeitet: (1) eigene Überholspur-Entscheidungsfunktion mit Alternativseite und „nicht überholen“ bei Konflikten, (2) Integration mit kontinuierlicher Querbewegung und Kontrolle auch zwischen Simulationsschritten, (3) einfache Angriffswatt-Anforderung **erst nach abgeschlossenem Spurwechsel**, stets durch vorhandene R-05-Abstands- und CP/W′-Regeln begrenzt.

Neue Dateien `src/engine/ai/overtake-controller.ts` und `tests/r07-overtake-ai.test.mjs` sowie optionale `overtakeAgents` in `src/engine/physics/drafting-group.ts`. Zwei Referenzläufe sind vollständig vergleichbar: **automatisch entschiedener Spurwechsel** versus **gleicher seitlicher Weg und gleicher Wattverlauf, extern fest vorgegeben**. Zusätzlich Blockade beider Seiten, Alternativspur, ungültige Wünsche, W′-Erschöpfung und Energieerhaltung in den Tests.

Neuer Android-Knopf `8 Fahrer · autonome Überhol-KI`. Frühere Benchmark-Presets bleiben enthalten. **Stand bei Implementierung:** bisher 134/134 Tests verifiziert, **neue Suite und GitHub-Pages-Deployment erst nach echtem CI-Lauf als bestätigt ansehen**. Noch keine Android-Laufzeit dieses Agenten vorhanden.

Fachliche Grenzen: Spurwahl-Prognose nur mit derzeitiger Geschwindigkeit anderer Fahrer; keine Lenkwinkel-/Kurven- oder Fahrtechnikphysik, keine automatische Rückkehr ins Feld oder taktische Team-KI; kein vollwertiges Peloton. [R-07-Details](ai/R07_UEBERHOLAGENT.md).
