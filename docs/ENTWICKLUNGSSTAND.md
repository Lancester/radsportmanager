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
