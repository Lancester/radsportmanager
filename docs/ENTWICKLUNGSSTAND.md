# Entwicklungsstand

**Aktueller Stand: 03.11.2026 · R-10: vollständige 30-Fahrer-/50-km-Rennen, verbesserter Peloton-Zusammenhalt und stabilere Renn-KI sind mit **198/198 Tests** geprüft.** Frühere Phasenstände weiter unten sind das chronologische Journal. Der echte Android-Median für komplette 50-km-Rennen ist noch nicht gemessen.

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


## R-07 auf GitHub vollständig geprüft: 150/150 Tests, autonome Spur und CP (03.11.2026)

**Implementierung und Merge:** [PR #36](https://github.com/Lancester/radsportmanager/pull/36), Squash-Commit `254a256faef510d35b9b18cc568ab9a89ebf009e` erfolgreich in `main`.

**Vollständig verifizierter GitHub-Actions-Lauf:** [#41705987015](https://github.com/Lancester/radsportmanager/actions/runs/41705987015), `conclusion=success`. Reale Logs: **150 Tests ausgeführt, 150 bestanden, 0 Fehler**, TypeScript-Browser-Kompilierung, alle älteren R-03/R-04/R-05/R-06-Prüfungen, neuer R-07-ESM-Smoke-Test und GitHub-Pages-Bereitstellung erfolgreich.

**Kontrolllauf in der GitHub-Node-Laufzeit (keine Android-Zeitmessung):**
- F8 trifft in der 65-s-Achtfahrergruppe **genau eine autonome Spurentscheidung**. Zielspur y=2 m, nach abgeschlossenem stetigem Wechsel **erst dann** Wattanforderung.
- Physischer Gruppenlauf registriert **7 Überholereignisse** von F8 gegenüber F1–F7 auf getrennter Spur.
- Nach CP/W′-Leistungsbegrenzung bleiben am Ende **8.250 J W′** des **rein fiktiven** Ausgangsprofils (CP 300 W, W′ 12.000 J, FTP 285 W).
- Der identisch physikalisch gesteuerte **manuelle** Kontrolllauf (vorher fest vorgegebene Spur bei 0 s, dieselben 360 W ab 2,5 s) unterscheidet sich in der F8-Endposition nur um **0,000009218 m**. Die winzige Abweichung ist numerisch plausibel; keine künstliche Beschleunigung oder Positionsteleportation.
- Verifizierte Android-Webseite https://lancester.github.io/radsportmanager/ enthält jetzt einen **zusätzlichen**, separat auswählbaren Button `NEU · 8 Fahrer · autonome Überhol-KI`; alte Tests bleiben verfügbar.
- **Noch kein echter R-07-Android-Benchmark übermittelt**, daher keine Aussage zur Rechenzeit auf dem Smartphone oder einer 160-Fahrer-Gruppe.

**Drei erfüllte technische Ziele im gebündelten Paket:** autonome, nachvollziehbare Wahl unter mehreren Seiten / Verzicht bei Blockade; vorausschauende swept-Konfliktprüfung mit tatsächlicher stetiger Querbewegung; physikalisch konsistente, begrenzte Angriffswatt mit CP/W′, FTP-Telemetrie und realer Abstandsregel. Die Prognose selbst setzt vorläufig konstante aktuelle Geschwindigkeiten der Nachbarn voraus.

**Verbleibende Grenzen:** Noch kein selbstständiges Wiedereinscheren, keine koordinierte dynamische Spurwahl vieler Fahrer, keine fahrtechnische Querbeschleunigung/Lenkung/Kurven-Reibkreisphysik, keine Garantie kollisionsfreier Feldfahrt, keine kalibrierte CP/W′-Regeneration und kein vollständiges Rennen/Managerspiel. Genau diese Grenzen nicht als erreicht ausgeben. [R-07-Dokumentation](ai/R07_UEBERHOLAGENT.md).


## R-08 – gebündeltes Entwicklungspaket im Branch (03.11.2026)

**Beauftragt:** Zwei bis drei größere Aufgaben möglichst ohne Nutzerinteraktion gemeinsam bearbeiten.

**Drei neue optionale Bausteine:** `rejoin-controller.ts` prüft nach einem autonomen Überholvorgang eine konservative Rückkehr auf die Heimatspur mit Vorfahrtabstand; `lane-coordination.ts` reserviert gegenläufige/kollidierende parallele Spurziele für mehrere Fahrer reproduzierbar nach stabilen IDs; `steering-limits.ts` erweitert neue Szenarien um ein glattes Seitenbewegungsprofil mit begrenzter Seitengeschwindigkeit und Querbeschleunigung, einschließlich **nur näherungsweisem** Kurven-Haftungsbudget.

**Gemeinsame Demo:** Ein Fahrer überholt und schert bei großem Vorsprung automatisch vor der Gruppe ein; ein zweiter Fall mit zwei KI-Fahrern zeigt simultane freie Spuren mit physikalischer Bewegung und CP/W′-begrenzt angeforderter Leistung. Alte R-03 bis R-07-Szenarien ohne neue Optionen sollen sich nicht ändern. Neue Android-Knöpfe für 115-s-Wiedereinscheren und 70-s-Mehrfahrer-KI.

**Prüfstatus vor CI:** Code und 19 neue Tests vorbereitet, zuvor **150 erfolgreich**; eine Aussage über Gesamttest/Pages/Android ist erst nach realem Run erlaubt. Das neue glatte Bewegungsprofil enthält keine tatsächliche Fahrradlenkung. Kein ganzes Rennen, keine 160 Fahrer, keine automatische Teamtaktik. [Dokumentation](ai/R08_WIEDEREINSCHEREN_MULTIAGENT.md).



## R-08 GitHub-Abnahme: 169/169 und zwei echte KI-Szenarien (03.11.2026)

**Implementierung:** [Pull Request #38](https://github.com/Lancester/radsportmanager/pull/38) mit Merge-Commit `f4052cc149ae6897b2acacd3b377c6e46f7ed80a` auf `main` übernommen.

**Automatische Abnahme:** [GitHub-Actions-Lauf #41710587230](https://github.com/Lancester/radsportmanager/actions/runs/41710587230), `completed/success`. Der tatsächliche Job-Log bestätigt **169 Tests / 169 bestanden / 0 fehlgeschlagen**, erfolgreiche Browser-TypeScript-Kompilierung, alle bisherigen R-03–R-07-Smoke-Tests, neue R-08-ESM-Gruppentests und erfolgreiches **GitHub-Pages-Deployment** nach https://lancester.github.io/radsportmanager/.

**Drei in diesem Paket technisch erreichte Meilensteine:**
1. **Autonomes Wiedereinscheren:** Im Achtfahrer-Referenztest wählt F8 nach **7 physikalischen Überholungen** und genügend Vorsprung **einmal** die sichere Rückkehr, und die Fahrt beendet den Seitenwechsel wieder bei **y=0 m**; Event-Zahlen `rejoinChoices=1` / `autonomousRejoins=1`. Der Test benutzt eine sehr konservative Strategie: nur **vor** der gesamten Reihe, nicht zwischen anderen Fahrern.
2. **Koordinierte autonome Spurwahl von zwei Fahrern:** F7 erhält **y=+2 m**, F8 **y=−2 m**, obwohl beide zunächst dieselbe bevorzugte Seite wollen. Der simulierte Mehrfahrer-Gruppenlauf meldet **12 physikalisch berechnete Überholereignisse**. Die Spurreservierung wird nach **stabiler Fahrer-ID**, nicht Eingabe-Array-Reihenfolge ausgewertet; die betreffenden Regressionstests sind bestanden.
3. **Glatter Seitenwechsel mit Querbeschleunigungsgrenze:** Im R-08-Mehrfahrer-Referenzlauf betrug die größte vom Modell erfasste Querbeschleunigung der beiden aktiven Fahrer **0,7850666666666671 m/s²**, also unter der fiktiven Obergrenze **1,5 m/s²**. Das Kurven-Gripbudget ist bisher nur eine konstante-Radius-Prüfung für den Seitenwechsel, **keine realistische, gekoppelte Kurvenfahrt**.

**Browser:** Die bestehende Testseite hat jetzt zusätzlich die Knöpfe **„NEU · Überholen + Wiedereinscheren“** (115 simulierte Sekunden) und **„NEU · Zwei KI-Fahrer gleichzeitig“** (70 simulierte Sekunden). Beide verwenden die aus dem Original-TypeScript gebauten Module in einem Web Worker. **Noch keine echten Android-Laufzeiten** für diese zwei neuen Szenarien vorliegend. Kein Smartphone-Ergebnis erfinden; der GitHub-Runner ist kein Android-Gerät.

**Grenzen:** Ein Konflikt in der Vorhersage führt zur Zurückhaltung, aber eine unerwartete Änderung der Geschwindigkeit/Spur anderer Fahrer kann im laufenden, eigentlichen Solver weiterhin einen Sicherheitsfehler auslösen. Keine voll gekoppelte Fahrrad-Lenk-/Kurvendynamik, keine intelligenten mittigen Peloton-Lücken und noch keine vollständige Fahrerfeld-/Renn-KI mit 160 Fahrern. FTP, CP/W′ und langfristiges Training sind weiterhin nicht sportwissenschaftlich kalibriert.

**Nächste Aufgaben:** Wiedereinscheren in variierende, tatsächlich sichere Lücken; bewegliche Hindernisse und gemeinsames Aushandeln geplanter Spurwechsel; tatsächliche 2D-Lenk-/Kurven-/Bremshaftungsphysik und später ein vollständiges Rennfeld. [R-08-Modell](ai/R08_WIEDEREINSCHEREN_MULTIAGENT.md).


## Beschlossener Richtungswechsel und R-09-Rennprototyp (03.11.2026)

**Der Nutzer fordert ausdrücklich, kein weiteres Mikrophysik-Klein-Klein zu entwickeln:** Vorfahrt für **vollständige Rennsimulationen, autonome Teamtaktik, Ereignisse und Zielzeitklassen**. Details der Kurven-/Lenk- und Reifenphysik bleiben vorläufig zurückgestellt. Bestehender R-01–R-08-Physikcode wird **nicht gelöscht**, sondern zentrale `motion-core.ts`-Integrationsphysik und `critical-power.ts` direkt wiederverwendet; für viele Fahrer werden Windschatten und Gruppen **bewusst anders, abstrahiert** berechnet. Die bisherige Achtfahrer-2D-Kollisions-/Positions-KI ist **nicht automatisch** im 30-Fahrer-Modus aktiv.

**R-09 im Entwicklungsbranch:** `src/engine/race/race-tactics.ts` (Leitlinien für fiktive Teams, Rollen und begrenzte Wattwünsche), `src/engine/race/race-simulator.ts` (30 fiktive Fahrer/fünf Teams, 50-km-Flach-/Hügelstrecke, echte Geschwindigkeit und Steigung, CP/W′, Windschatten, technisch vereinfachte Abfahrt, komplette Rangliste, Gruppen- und taktische Events). `docs/rennen.html` mit Rennbesprechung und Taktikvergleich im Web Worker, neue R-09-Tests, Einbindung im bestehenden GitHub-Pages-Workflow.

**Abnahme ausstehend:** Die bisher **169/169 bestandenen** Tests müssen zusammen mit den neuen Rennintegrationstests erneut laufen. TS-Browser-Build, Renn-Smoketest, Github Pages und echter Android-Lauf dürfen erst nach Prüfung als erfolgreich bezeichnet werden. **Erste Rennresultate noch nicht gegen echte Profi-Rennen validiert.**

**Nächste Schritte:** (1) Testdaten und tatsächliche Rennresultate untersuchen, (2) Attacken, Gruppenentscheidungen und Fahrerrollen verbessern, (3) erst dann 60/160 Fahrer und 100–200-km-Distanzen auf Smartphone prüfen. [R-09-Details](race/R09_ERSTES_RENNEN.md).



## R-09: drei vollständige Rennen als Plausibilitätsdiagnose (03.11.2026)

Die neue Rennsimulation wurde **ausdrücklich nicht als realistisch kalibriertes Profirennen** freigegeben. Ein kurzer Diagnoselauf von drei vollständigen Rennen steht jetzt dauerhaft als reproduzierbares Script unter `scripts/r09-race-diagnostics.mjs`. [PR #41](https://github.com/Lancester/radsportmanager/pull/41) ist integriert; der tatsächlich erfolgreiche [GitHub-Actions-Lauf #41715064254](https://github.com/Lancester/radsportmanager/actions/runs/41715064254) bestätigt **183/183 Tests, 0 Fehler, drei komplette Rennläufe, Browser-Build und Pages-Deployment**.

| 50-km-Profil (je 30 Fahrer, Seed 2026) | Sieger | Siegerzeit | letzter Rückstand | beobachtete Maximum-Abstandsgruppen | protokollierte Gruppenaufteilungen / Verfolgungswechsel |
| --- | --- | ---: | ---: | ---: | ---: |
| Hügelig – Kapitän schützen | F07 | 4.433,0 s | 577,2 s | **30** | 135 / 319 |
| Hügelig – Team Nordwind offensiv | F13 | 4.446,4 s | 561,7 s | **29** | 147 / 155 |
| Flach – Team Nordwind Sprint | F07 | 4.181,5 s | 367,8 s | **15** | 52 / 415 |

Die drei Läufe waren auf GitHub-Runner etwa **374–549 ms** Rechenzeit, **keine Android-Messung**. Hügelig „Kapitän schützen“: F07 siegt nach rund **1:13:53 h**, 30 Fahrer erreichen das Ziel bis ca. **1:23:30 h**. Die durchschnittliche tatsächlich gefahrene Kurbelwatt über alle Fahrer beträgt ca. **271,4 W**. Über drei Szenarien 10–15 Sprint- und Angriffsevents; diese Modellzahlen sind nicht als repräsentative Profirennstatistik auszugeben.

**Wichtige Bewertung:** Die körperlichen/energetischen Zahlen werden aus denselben bisher verwendeten Kernen berechnet. Die derzeitige größere Rennfeldabstraktion führt allerdings zur **starken Feldfragmentierung** (im Hügelkurs zeitweise 30 einzelne Abstandsgruppen für 30 Fahrer) und **sehr vielen Wechseln zur Verfolgung**. Das ist **nicht ausreichend glaubwürdig**, um schon taktische Rennergebnisse zu bewerten. Gruppenaufteilungen zählen Übergänge der einfachen Abstandsklassifikation und sind noch keine sauber modellierten Fluchtgruppen. Die Windschatten-Heuristik ist noch nicht die validierte Gruppendynamik.

**Taktik wirkt numerisch:** Bei identischem Seed und Profil fuhr F01 mit offensiver statt Kapitän-schonender Leitlinie rund **61,254 s schneller** (4.575,293 s → 4.514,039 s), belegte in beiden Fällen Rang 5. Die Änderung kann sogar den Sieger ändern (F07 vs. F13), obwohl nur Team Nordwind eine andere Strategie erhielt – plausible indirekte Wechselwirkung ist möglich, noch nicht gegen reale Rennen kalibriert.

**Neue höchste Priorität:** [Issue #42 – echtes Peloton, Gruppen-Zusammenhalt, Ausreißer/Verfolgung und taktisches Balancing](https://github.com/Lancester/radsportmanager/issues/42). Zuerst die 30-Fahrer-/50-km-Gruppenlogik glaubwürdig machen; erst danach größere Felder und lange Rennen. **Weitere Lenk- und Kurven-Mikrophysik aus Issue #39 zurückstellen**, solange deren Nutzen für die Rennqualität nicht nachgewiesen ist.

**Ehrliche App-Beschreibung:** Die neue `docs/rennen.html`-Seite erklärt nun korrekt, dass die Fahrer vorerst nach einfachen Taktikregeln autonom handeln. **Eigenständige sportliche Leiter und Personalmanagement existieren im Rennprototyp noch nicht.**


## R-10 vollständig verifiziert: drei Rennläufe und 197/197 Tests (03.11.2026)

**Code- und Testabnahme:** [PR #45](https://github.com/Lancester/radsportmanager/pull/45) wurde auf `main` übernommen. Der reale [GitHub-Actions-Lauf #41717402354](https://github.com/Lancester/radsportmanager/actions/runs/41717402354) ist vollständig **erfolgreich**: **197/197 Tests, 0 Fehler**, drei komplette 50-km-Rennen, originale TypeScript-Browserübersetzung, ESM-Smoke-Test und Pages-Veröffentlichung.

**Vergleich mit den drei dokumentierten R-09-Referenzrennen (30 Fahrer, 50 km, Seed 2026):**

| Rennen | Max. Abstandsgruppen R-09 → R-10 | Gruppen-Trennereignisse R-09 → R-10 | Verfolgungsstarts R-09 → R-10 | bestätigte Fluchten / wieder eingeholt |
| --- | ---: | ---: | ---: | ---: |
| Hügelig, Kapitän schützen | **30 → 20** | **135 → 26** | **319 → 36** | **1 / 1** |
| Hügelig, T1 offensiv | **29 → 22** | **147 → 27** | **155 → 21** | **2 / 1** |
| Flach, T1 Sprint | **15 → 12** | **52 → 13** | **415 → 64** | **2 / 1** |

Die **Verfolgungsstarts sind massiv zurückgegangen**, und Fahrer können dank begrenzter, tatsächlich physikalisch ausgeführter Wattkorrektur besser als Gruppe zusammenfahren. Gruppenaufteilungen werden seltener und reale, über Zeit bestätigte Fluchten und Einholungen erscheinen im Rennprotokoll. **Das ist eine Verbesserung des vorherigen Prototyps, noch keine Realitätsvalidierung.** Auf dem Hügelkurs entstehen weiterhin zeitweise **20–22 Abstandsgruppen**. Auch die maximalen Zielrückstände bleiben hoch. Ein glaubwürdiges Peloton ist noch nicht fertig.

Der R-10-GitHub-Runner meldete beispielsweise für den hügeligen geschützten Lauf F13 als Sieger mit **4.464,8 s** Fahrzeit, **581,4 s** Rückstand des letzten Fahrers; der Vergleich T1 offensiv ändert F01s Zielzeit bei identischem Seed um **3,783 s**. Ein Teamstrategie-Effekt existiert also, darf aber nicht als bereits perfekt ausbalanciert gelten.

**Wiederverwendung ausdrücklich bestätigt:** Vollrennen verwenden unverändert `motion-core.ts` (`advanceMotionStep`) und `critical-power.ts`; der neue `peloton.ts` ergänzt ausschließlich begrenzte Wattwünsche und abstrahierten Windschatten. **R-03 bis R-08 bleiben unveränderte Labortests**, werden nicht als komplettes 2D-Peloton in die 30-Fahrer-Simulation hineinkopiert.

**Für die kommenden Arbeiten:** Noch nicht 160 Fahrer oder 200 km als ausgereift ausgeben. Nächste sachliche Abnahme: qualitative Abstands-/Attacken-/Verfolgungslogik über mehrere Fahrerprofile und Strecken, danach erst größere Fahrerfelder (60 → 100 → 160) und tatsächlicher Android-Gesamtrennbenchmark. **Keine neue Detail-Lenkphysik ohne beobachteten Rennnutzen.**


## R-10 – endgültige Abnahme und Fluchtkorrektur (03.11.2026)

**Aktuell verifizierter Code:** [PR #45](https://github.com/Lancester/radsportmanager/pull/45) führte die neue Peloton-/Taktiklogik ein; [PR #46](https://github.com/Lancester/radsportmanager/pull/46) beseitigte eine irreführende Einholmeldung. Der abschließende [GitHub-Actions-Run #41717987913](https://github.com/Lancester/radsportmanager/actions/runs/41717987913) ist **vollständig erfolgreich: 198 Tests, 198 bestanden, 0 fehlgeschlagen**, drei reale 50-km-Testsimulationen, TypeScript-Browser-Build und Pages-Veröffentlichung.

**Drei vollständige Vergleichsrennen mit identischem Seed 2026 (je 30 fiktive Fahrer und 50 km):**

| Rennen | Maximale Abstandsgruppen: R09 → R10 | Verfolgungsstarts: R09 → R10 | Bestätigte Flucht / tatsächlich eingeholt nach R10 |
| --- | ---: | ---: | ---: |
| Hügelig, Kapitän schützen | **30 → 20** | **319 → 36** | **1 / 1** |
| Hügelig, T1 offensiv | **29 → 22** | **155 → 21** | **1 / 0** |
| Flach, T1 Sprint | **15 → 12** | **415 → 64** | **1 / 0** |

**Warum die geänderten Fluchtzahlen wichtig sind:** Der ursprüngliche PR #45 verwendete „nicht mehr mindestens 75 m Fluchtvorsprung“ irrtümlich als gleichbedeutend mit „eingeholt“. PR #46 meldet einen erfolgreichen Wiederanschluss erst bei tatsächlich auf **höchstens 35 m** geschlossener Lücke über den verlangten Zeitraum. Ereignisse tragen jetzt die jeweils gemessene `gapM` für später nachprüfbare Rennberichte. Die weiter oben festgehaltenen älteren R-10-Fluchtzahlen **2/1** in zwei Szenarien gehören ausdrücklich zur **Zwischenversion vor dieser Korrektur**, nicht zum heutigen Stand.

**Weitere reale Diagnosen aus dem endgültigen GitHub-Runner:** Hügelig „Kapitän schützen“: Sieger **F13**, Siegerzeit **4.464,8 s**, letzter Rückstand **581,4 s**, maximal **20** Abstandsgruppen und **26** protokollierte Gruppenaufteilungen. Hügelig T1 offensiv: maximal **22** Gruppen und **21** Verfolgungsstarts. Flach: maximal **12** Gruppen und **64** Verfolgungsstarts. Die tatsächlichen Renn-Ergebnisse folgen weiterhin dem vorherigen `motion-core.ts`-Physikintegrator und CP/W′, nicht einem Ergebnisbonus.

**Nicht als sportlich abschließend validieren:** Zwar weniger Chaos als in R-09, aber **20–22** Gruppen im hügeligen 30-Fahrer-Rennen und bis zu neun Minuten Zeitspreizung sind noch kritisch. Bei identischer Tagesform veränderte die offensive Nordwind-Leitlinie die Zielzeit von Kapitän F01 nur um rund **3,78 Sekunden**. Das zeigt den nächsten fachlichen Bedarf: Teamarbeit und Verfolgung **qualitativ** verbessern, tatsächliche Gruppenbildung/Attacken gegen realistische Rennabläufe plausibilisieren, und erst danach größeren Feldern/Langdistanzen Priorität geben. **Keine zusätzliche Detail-Lenk- oder Reifenphysik ohne nachgewiesenen Spielnutzen.**

**Browser:** https://lancester.github.io/radsportmanager/rennen.html läuft im bestehenden Web Worker. Veröffentlicht und im GitHub-Runner getestet; **echte Android-Laufzeit des 50-km-Rennens weiterhin unbekannt**.


## R-11: Mehr-Seed- und Fahrerprofil-Diagnose – in Prüfung (03.11.2026)

**Auftrag aus Issue #42, ohne Änderung der Grundsatzentscheidung:** Vor einem weiteren Balancing der abstrakten 30-Fahrer-Rennen zuerst mehrere Seeds, Strecken und Fahrerprofile untersuchen. Kein neuer Reifen-/Lenk-/Kurven-Mikrophysikcode.

**Im Feature-Branch `feature/r11-mehrseed-balancing-diagnose` implementiert (noch nicht auf main):**
- `src/engine/race/race-audit.ts` prüft die Ziel-/Energiebilanzen, Gruppen-Snapshot-Summen und belegte Flucht-/Einholabstände. Es misst u. a. Median-Gruppenzahl an 5-km-Snapshots, Anteil isolierter Fahrer, Ausreißer, tatsächliche Einholungen und Wattmittel.
- `tests/r11-race-balance.test.mjs` deckt zwei Seeds, zwei Streckenprofile, eine veränderte Teamleitlinie, einen CP/FTP/W′-Kontrast von Helfer F03 und fehlerhafte Gruppen-/Fluchtereignisse ab. Die Tests sind **geschrieben, aber noch nicht durch GitHub Actions bestätigt**.
- `scripts/r11-balance-diagnostics.mjs` bietet sieben kurze vollständige, **nur manuell** zu startende 50-km-Rennen mit strukturierten Messwerten. Keine neue große automatische Monte-Carlo-Reihe.
- Ein minimaler schreibgeschützter PR-Testworkflow führt kleine Regressionstests vor dem Merge aus. Die ursprüngliche main-/Pages-CI bleibt unverändert.
- Methodik und Grenzen: [R11_MEHRSEED_BALANCING.md](race/R11_MEHRSEED_BALANCING.md).

**Letzter zuvor bestätigter Renn-Teststand:** R-10, 198/198, erfolgreicher GitHub-Actions-Lauf #41717987913. **R-11-Teststand erst nach einem tatsächlich erfolgreichen Check berichten.** Die R-11-Diagnose ist noch keine sportliche Validierung und liefert noch keine Android-50-km-Laufzeit.

**Exakter nächster Schritt:** PR-Regression prüfen, manuelle sieben Vergleichsrennen ausführen, konkrete Mehr-Seed-/Gruppen-/Strategieeffekte fachlich auswerten. Erst danach eine gezielte kleine Verbesserung für Helfer-/Kapitän-/Verfolger-Zusammenarbeit formulieren und erneut gegen dieselben Fälle prüfen. Issue #42 bleibt offen; die Erweiterung auf 60/100/160 Fahrer ist nachrangig.


## R-11 nach PR #47: kleine Balancing-Regression integriert und verifiziert (03.11.2026)

**Code in main:** [PR #47](https://github.com/Lancester/radsportmanager/pull/47), Squash-Commit `69d9e4126ed9623b2daf2b94ee19c8f9bbf5d3df`. Der neue [Pull-Request-Testlauf #41727050681](https://github.com/Lancester/radsportmanager/actions/runs/41727050681) war erfolgreich: **202/202 Tests, 0 Fehler**, darunter **vier R-11-Tests**. Der nach dem Merge ausgelöste [main-Lauf #41727203475](https://github.com/Lancester/radsportmanager/actions/runs/41727203475) ist ebenfalls vollständig **erfolgreich**: **202/202 Tests**, drei bisherige 50-km-Diagnoserennen, TypeScript-Browser-Build, ESM-Smoke-Test und GitHub-Pages-Deployment.

**Ergebnis:** Alle bisherigen R-01–R-10-Regressionen blieben grün. R-11 misst jetzt gruppenbezogene Beobachtungen über mehrere Seeds/Strecken/Fahrerprofile und verhindert irreführende Einholmeldungen in der Diagnose. Die vorhandenen fahrphysikalischen und taktischen Kerne wurden **nicht** geändert. Der R-10-Hügelkurs verbleibt daher erwartungsgemäß bei maximal **20 bzw. 22** Abstandsgruppen und die T1-Strategieänderung bei ungefähr **3,783 s** Unterschied für F01 (Seed 2026). Diese Werte sind **keine Realismus-Abnahme**.

**Noch offen:** Das zusätzliche `scripts/r11-balance-diagnostics.mjs` wurde im PR auf Syntax geprüft, aber seine sieben 50-km-Vergleichsläufe wurden **noch nicht als eigener Diagnoselauf ausgeführt und ausgewertet**. Für andere Seeds/Fahrerprofile liegen damit noch keine im Entwicklungsstand dokumentierten numerischen Diagnoseergebnisse vor. Keine Android-Messung; keine 60/100/160-Fahrer-Validierung.

**Nächster konkreter Schritt:** Die kurze manuelle R-11-Diagnose ausführen, Gruppen-/Einzelfahrer-/Watt- und Teamstrategie-Unterschiede **fachlich auswerten**, und danach in Issue #42 eine kleine, isolierte Verbesserung von Helfer-/Kapitän-/Verfolger-Arbeit entwickeln und gegen dieselben Seeds prüfen. Keine Änderung der D-074–D-077-Grundsatzentscheidungen.


## R-11: sieben tatsächlich durchgerechnete Rennvarianten und Windschattenbefund (03.11.2026)

**Jüngster verifizierter Diagnosestand:** [GitHub Actions #41728617720](https://github.com/Lancester/radsportmanager/actions/runs/41728617720) **erfolgreich**, sieben separate 50-km-Rennen mit je 30 Zielankünften, sechs Seed-/Strecken-/Strategiekombinationen und ein abgeschwächtes Fahrerprofil F03. Der Lauf kontrollierte ausdrücklich genau sieben `R11-LAUF`-Zeilen und zwei Taktik-/einen Profilvergleich. Ein voriger Probelauf #41728273878 führte bei gleicher Physik das 2026-Basisrennen doppelt aus (acht Durchläufe, sieben unterschiedliche Fälle); dies wurde im Diagnoseskript korrigiert. Keine Testreihe im Hintergrund; tatsächliche einmalige Ausführung auf einem GitHub-Runner, **kein Android-Benchmark**.

| Rennen | Max. Abstandsgruppen | Median 5-km-Snapshot-Gruppen | Isolierte Fahrer in Snapshots | Letzter Zielrückstand |
| --- | ---: | ---: | ---: | ---: |
| Hügelig, geschützt, Seed 2026 | 20 | 14 | 14,8 % | 581,4 s |
| Hügelig, offensiv, Seed 2026 | 22 | 12 | 15,9 % | 504,6 s |
| Flach, Sprint, Seed 2026 | 12 | 10 | 11,1 % | 420,9 s |
| Hügelig, geschützt, Seed 2027 | **24** | 13 | 14,1 % | 544,9 s |
| Hügelig, offensiv, Seed 2027 | 20 | 11 | 12,2 % | 517,4 s |
| Flach, Sprint, Seed 2027 | 12 | 9 | 6,3 % | 334,1 s |
| Hügelig, geschützt, F03 schwächer, Seed 2026 | 23 | 13 | 20,0 % | 634,6 s |

**Empfindlichkeit:** Die T1-Leitlinie „offensiv“ verbessert bei gleicher Hügel-Startaufstellung F01 um **3,783 s (Seed 2026)** beziehungsweise **30,491 s (Seed 2027)**; F13 bleibt Sieger. F03 mit testweise **−12 % CP/FTP/W′** verliert **330,095 s**, und die Zahl maximaler Gruppen erhöht sich von 20 auf 23. Es handelt sich um **fiktive Modellvergleiche**, keine Realweltrennstatistik.

**Im tatsächlichen 30er-Rennmodus nachgelesen:** `src/engine/race/peloton.ts` berücksichtigt für den Windschatten **nur den unmittelbar davor liegenden Fahrer** und reduziert den Luftwiderstand im günstigsten Fall um **19 %** (`aeroFactor=0.81`). Die Größe der Fahrergruppe und der tiefere Schutz innerhalb des Pelotons fehlen vollständig. Das ältere R-03-/Achtfahrermodul mit mehreren Vordermännern bleibt isoliert und ist nicht in das 30-Fahrer-Rennen integriert. Forschung von Blocken et al. (2018, DOI 10.1016/j.jweia.2018.06.011) macht die große Differenz zwischen kleinen Reiheverbänden und dicht gepacktem 121er-Peloton deutlich. Deren extreme Drag-Faktoren nicht blind auf unser eindimensionales 30er-Modell kopieren.

**Fazit:** Ein wichtiger struktureller Windschatten-Mangel ist **durch Codeprüfung bestätigt** und plausibler Kandidat für die zu starke Fragmentierung. **Kausal nicht nachgewiesen:** Ohne A/B-Rennen ist der relative Einfluss von Aero, Verfolger-KI, CP/W′ und Fahrerprofilen unbekannt. Nicht allein am `draftFactorAtWheel` drehen und keine künstliche Ergebnisangleichung.

**Exakter nächster Entwicklungsauftrag, noch nicht beschlossen:** isolierten schaltbaren Entwurf für **lokale Dichte-/Gruppenpositions-abhängige Windschattenfaktoren** (2–3 Fahrer versus dichtes Peloton) spezifizieren; einzeln mit Ein-/Mehrfahrer-Kontrollfällen sowie sieben R-11-Referenzrennen vergleichen. Danach taktische Helfer-/Kapitän-/Verfolger-Interaktion getrennt verbessern. R-01–R-08 und unveränderte Physik-/CP/W′-Kerne behalten. Issue #42 bleibt offen. Ausführliche [Messwerte, Quellen und Abgrenzungen](race/R11_MEHRSEED_BALANCING.md).


### Letzte technische Verifikation nach R-11-Diagnose (03.11.2026)

[PR #48](https://github.com/Lancester/radsportmanager/pull/48) ist in `main` integriert (Squash-Commit `59ada3e31bc9701e160f16b671f8c0fe9db7aef2`). Der zugehörige [GitHub-Actions-Lauf #41729337161](https://github.com/Lancester/radsportmanager/actions/runs/41729337161) ist **vollständig erfolgreich: 202 Tests, 202 bestanden, 0 fehlgeschlagen**, drei bestehende komplette 50-km-Referenzrennen, TypeScript-Browser-Build, ESM-Smoke-Test und Pages-Veröffentlichung. Die sieben zusätzlichen Varianten wurden **separat tatsächlich erfolgreich** in [R-11-Diagnose #41728617720](https://github.com/Lancester/radsportmanager/actions/runs/41728617720) ausgeführt und in [R11_MEHRSEED_BALANCING.md](race/R11_MEHRSEED_BALANCING.md) bewertet. **Kein neuer Windschattenfaktor beschlossen, keine Rennphysik geändert.** Fachlicher nächster Schritt: kontrollierter A/B-Prototyp unterschiedlicher gruppen- und positionsabhängiger Aerodynamik, danach Teamtaktik. Issue #42 bleibt offen.


## R-12 – gezielter Formationswindschatten als getrennter A/B-Versuch (03.11.2026)

**Implementiert (vorläufig, nur zuschaltbar):** `src/engine/race/formation-aero.ts`
ermittelt aus mehreren Vordermännern und lokalen Abständen einen
positionsabhängigen Luftwiderstandsfaktor. Eingabeschalter:
`RaceInput.aeroModel='formation-experiment'`; **ohne
Schalter gilt weiter exakt das R-10-Legacy-Modell**.
Keine direkte Änderung von Position/Tempo, kein Ergebnisbonus.
`advanceMotionStep` sowie `applyCpWprimeStep` sind weiterhin
unverändert. Die alte Abstandsregelung und Team-KI bleiben vorerst
ebenfalls unverändert. Sieben neue Tests einschließlich
komplettem 50-km-A/B-Lauf und Bitgleichheit des Legacy-Modus.

**Tatsächlich überprüft:** [PR-Regression #41730702259](https://github.com/Lancester/radsportmanager/actions/runs/41730702259)
**209/209 Tests, null Fehler**. Die gesonderte
[Diagnose #41730692771](https://github.com/Lancester/radsportmanager/actions/runs/41730692771)
führte **14 vollständige Rennen (7 identische Eingabepaare)** durch.
Der [Build-/Browsercheck #41730888302](https://github.com/Lancester/radsportmanager/actions/runs/41730888302)
bestätigt erfolgreichen TypeScript-Build und komplettes
30-Fahrer-ESM-Rennen in der Experimentvariante auf einem GitHub-Runner.
**Keine echte Android-Laufzeitmessung.** Einmaliger Workflow
danach wieder entfernt.

| Referenz | Maximale 42-m-Abstandsgruppen alt → Experiment | Letzter Rückstand alt → Experiment |
| --- | ---: | ---: |
| Hügelig, geschützt, 2026 | 20 → 21 | 581,4 → 619,7 s |
| Hügelig, offensiv, 2026 | 22 → 20 | 504,6 → 721,7 s |
| Flach, Sprint, 2026 | **12 → 3** | 420,9 → 689,5 s |
| Hügelig, geschützt, 2027 | 24 → 20 | 544,9 → 605,0 s |
| Hügelig, offensiv, 2027 | 20 → 22 | 517,4 → 718,2 s |
| Flach, Sprint, 2027 | **12 → 4** | 334,1 → 937,5 s |
| Hügelig, Helfer F03 geschwächt, 2026 | 23 → 23 | 634,6 → 691,0 s |

**Fachliche Bewertung:** Die Aero-Modelllücke ist **funktional
relevant**: Ein dichtes Feld wird auf flachen Strecken deutlich
geschlossener, mit niedrigerer durchschnittlicher Kurbelwatt und
größerer verbleibender W′-Reserve. **Trotzdem ist das Experiment
nicht ausreichend realistisch**, da der letzte Rückstand in allen
sieben Szenarien steigt und Hügelläufe teils mehr Gruppen erzeugen.
Ein Vorteil einzelner Gruppenstatistiken ist kein Beleg für
glaubwürdige Flucht/Verfolgung. Ausführlich:
[R12_FORMATIONSAERODYNAMIK.md](race/R12_FORMATIONSAERODYNAMIK.md).

**Nächster konkreter Schritt:** Vor Festlegung neuer Windschattenwerte
die **Gruppenformation/Reihenbildung** (1D-Reihe gegenüber dichtem
mehrspurigen Peloton) und tatsächliche **Führung/Verfolgung/Abhängen**
im isolierten kontrollierten Test verbessern. Vor allem prüfen, ob
die bisherige auf R-10-Aero ausgelegte Watt-Regelung mit starkem
Windschutz und erschöpften Fahrern sinnvoll interagiert.
Danach mehrere feste Seed-/Strecken-/Profilvergleiche wiederholen;
bis dahin `legacy` als Standard beibehalten. Issue #42 offen.


### R-12 – endgültig geprüfter Merge- und Deploymentstand (03.11.2026)

[PR #49](https://github.com/Lancester/radsportmanager/pull/49)
ist mit Squash-Commit `8138141b487f9585147b83616651dd97d8062d2f`
in `main` übernommen. Der **tatsächlich erfolgreiche**
[GitHub-Actions-Lauf #41731492676](https://github.com/Lancester/radsportmanager/actions/runs/41731492676)
bestätigt **209/209 Tests, 0 Fehler**, die unveränderten drei
Legacy-Referenzrennen, TypeScript-Browser-Build, ESM-Smoke-Test und
GitHub-Pages-Veröffentlichung. Die **zusätzlichen 14 A/B-Vollrennen**
wurden getrennt in [#41730692771](https://github.com/Lancester/radsportmanager/actions/runs/41730692771)
ausgeführt. **Das neue Modell ist auf main vorhanden, aber nicht
der aktive Standard**; `legacy` gilt weiterhin ohne explizite
Anforderung. Offener nächster Schritt wie oben: Gruppen-/Positions-
Repräsentation mit Fahrerrollen und Abgehängtenlogik verbessern,
bevor eine Aero-Parameterfreigabe beschlossen wird.


## R-13: Formationswindschatten direkt als Rennstandard übernommen (03.11.2026)

**Nutzerentscheidung nach 14 R-12-Vergleichsrennen:** Der mögliche
deutlich höhere Rückstand eines einzelnen, vom geschützten Hauptfeld
abgehängten Fahrers ist **sportlich plausibel** und darf nicht
pauschal als Balancingfehler behandelt werden. Der Windschatten soll
deshalb **ohne weitere Kalibrierungsfreigabe als Spielregel** verwendet
werden. Ausdrücklich kein künstliches Zusammenhalten, kein
Zeitbonus und keine "magische" Aufholgeschwindigkeit.

**Umsetzung in PR #50:** Standard ohne `aeroModel` ist jetzt das
lokal mehrfahrerabhängige Formations-Aeromodell;
`'formation'` und historisches `'formation-experiment'` sind
explizite Synonyme, `'legacy'` lässt R-10-/R-11-Vergleiche
reproduzieren. Die gleichauf startenden Fahrer erhalten nicht
aufgrund der ID-Reihenfolge fiktiven Windschutz; sie zählen auch
nicht auf das Limit von zehn echten Vorderleuten. Isolierte
Fahrer ohne nahen Vordermann erhalten `aeroFactor=1`.
Im regulären Rennen wirkt die neue Formel *ausschließlich* über
Luftwiderstand in `advanceMotionStep`; CP/W′ und der Rest der
Fahrer-/Streckensimulation bleiben unverändert.

**Reproduzierbare neue Regression:** Sieben vollständige 30-Fahrer-/
50-km-Standardrennen über zwei Seeds, flach/hügelig und mit
verändertem Helfer F03, plus gezielte Gleichauf-, Alleinfahrer-
und Legacy-Vergleichstests. Alle echten Prüfergebnisse und
Grenzen in [R13_FORMATIONSWINDSCHATTEN_STANDARD.md](race/R13_FORMATIONSWINDSCHATTEN_STANDARD.md).

**R-12-Berichte bleiben historische A/B-Messungen, kein
Widerspruch zur neuen Entscheidung.** Der neue Default ist
eine bewusste Spielentwicklungsentscheidung, kein Nachweis,
dass 24 m oder Aero-0,40 für reale 30er-Pelotons exakt
wissenschaftlich kalibriert wären. **Offener nächster Schritt:**
Führung, Helfer-/Kapitänszusammenarbeit und Verfolgung als
eigenständige Spielmechaniken verbessern, ohne große natürliche
Zeitabstände künstlich zu vermeiden. Issue #42 bleibt offen.


### R-13: abschließende main-Abnahme und regulärer Browser-Stand (03.11.2026)

[PR #50](https://github.com/Lancester/radsportmanager/pull/50) ist
mit Merge-Squash `5764f090863d53ed7517d3f32bc615f105a951ce`
auf `main` übernommen. Der **tatsächlich abgeschlossene und
erfolgreiche** [main-Actions-Lauf #41734418472](https://github.com/Lancester/radsportmanager/actions/runs/41734418472)
bestätigt **213/213 Tests, 0 Fehler**, drei vollständige
50-km-Referenzrennen im **neuen Standard**, TypeScript-Browser-
Build, ESM-Smoke-Test und erfolgreiche GitHub-Pages-Veröffentlichung.

**Verifizierte neue Live-Standard-Rennergebnisse, Seed 2026:**
Hügelig Kapitän schützen: Sieger F25, maximal 22 Abstandsgruppen,
Median-Zielrückstand 180,7 s, letzter Rückstand 604,6 s.
Hügelig offensiv: Sieger F07, letzter Rückstand 712,1 s.
Flach Sprint: Sieger F26, maximal 3 Abstandsgruppen,
Median-Zielrückstand 0,8 s, letzter Rückstand 688,5 s.
Weitere vier Standard-Szenarien und CP/W′-/Aero-Sicherheitsprüfungen
im [R-13-Fachdokument](race/R13_FORMATIONSWINDSCHATTEN_STANDARD.md).
Dies sind fiktive Modellresultate, keine empirischen Rennprognosen.

**Aktueller verbindlicher nächster Schritt:** Teamführung,
Helfer/Kapitän, Fahren in der Spitze, Führungswechsel und
Verfolgungsentscheidungen – nicht bloß die größeren Rückstände
einzeln Abgehängter abschaffen. `legacy` nur noch explizite
R-10-/R-11-Vergleichsoption. Issue #42 bleibt offen.


## R-14: Teamtempo, rotierende Helfer und autonome Feldverfolgung (04.11.2026)

**Implementiert** durch `src/engine/race/team-pacing.ts` und
Integration in den 10-Sekunden-Takt von
`race-simulator.ts`: Teamziele (Kapitän/Sprinter je
Strategie) werden mit aktiven nahen Helfern abgestimmt,
Führungswünsche nach je 90 s rotiert und durch
W′-Reserve sowie Lage der tatsächlichen Fahrer begrenzt.
Gezielte Verfolgung startet nur bei einer gemessenen
75–400-m-Lücke zu einer kleinen abgesetzten Spitzengruppe,
wenn der eigene geschützte Fahrer im größeren Hauptfeld
fährt. **Keine** automatische Jagd auf weit abgehängte
Einzelfahrer. Die bisherige unkoordinierte Helferverfolgung
wurde nur im aktiven Rennkontext ersetzt; `chooseRacePower`
bleibt isoliert kompatibel. Attacke, Erholung, Sprint
behalten Vorrang.

**Echte Wirkung:** `team-pace` und `team-chase`
werden als Ereignisse sowie `teamPaceStarts` und
`teamChaseStarts` als gezählte Auftragsanfänge protokolliert.
Browserseite `docs/rennen.html` und
`docs/race/app.js` zeigen die neuen Mannschaftsaktionen.
Der Physikintegrator, CP/W′, Fahrer-/Streckenparameter,
R-01–R-08 und der R-13-Formationswindschatten wurden
**nicht** verändert. Auch bei großen Rückständen
keine künstlichen Aufholboni.

**Verifizierter Feature-Branch-Teststand:**
[PR-Regression #41737911881](https://github.com/Lancester/radsportmanager/actions/runs/41737911881)
**221/221 bestanden**;
[separate Vollrennen-/Browserdiagnose #41738013741](https://github.com/Lancester/radsportmanager/actions/runs/41738013741)
**sieben fiktive 30-Fahrer-/50-km-Rennen und TypeScript-ESM-Build
erfolgreich**. Deren Auftragsstarts:
Hügelig geschützt 2026: **182 Führungs-/6 Verfolgungseinsätze**,
hügelig offensiv 2026: **110/7**,
flach Sprint 2026: **223/0**,
hügelig geschützt 2027: **164/9**,
hügelig offensiv 2027: **84/2**,
flach Sprint 2027: **185/0**,
Helfer F03 schwächer: **97/6**.
Die Flachrennen hatten keine bestätigte Flucht;
null Verfolgung ist dort die korrekte Reaktion.
Die Resultate hängen von der jetzt geänderten
tatsächlichen Wattarbeit ab; **kein** auf frühere
Gruppenzahlen festgelegtes Ergebnis.

**Fachdokument mit vollständig nachprüfbaren
Tabellen und Grenzen:**
[R14_TEAM_FUEHRUNG_VERFOLGUNG.md](race/R14_TEAM_FUEHRUNG_VERFOLGUNG.md).

**Nächster sinnvoller Schritt:** Die Startzahlen sind
Team-Auftragswechsel, **noch keine** nachgewiesenen
physischen Führungswechsel im realen 2D-Peloton.
Geprüfte Führung an der tatsächlich vorderen Position,
koordinierter Wechsel der Helfer, intelligentere
Teamreaktion und sportliche Leiter als spätere Spielfigur.
Issue #42 bleibt dafür offen. Keine Detail-Lenkphysik.


### R-14: erfolgreicher main-Merge, komplette Regression und Pages (04.11.2026)

[PR #51](https://github.com/Lancester/radsportmanager/pull/51),
Squash-Commit `83d3e912a118903dc8cf523e6c724aef4e7d5e2f`.
Der abschließende [main-Actions-Lauf #41738747990](https://github.com/Lancester/radsportmanager/actions/runs/41738747990)
ist **erfolgreich beendet: 221 Tests bestanden, 0 Fehler**,
drei vollständige 50-km-Rennen, TypeScript-ESM-/Browser-Build,
Smoketest und **GitHub-Pages-Deployment erfolgreich**.
Eine siebenfache Full-Race-Ergänzungsdiagnose (210
Zielankünfte) wurde separat in
[Actions #41738013741](https://github.com/Lancester/radsportmanager/actions/runs/41738013741)
mit Event-/Teamzähler- und Energiebilanz ausgeführt.

**Aktuelle Standardrennen, Seed 2026:** Hügelig geschützt
Sieger F26, **18** maximal getrennte Abstandsgruppen,
**6** gezielte Teamverfolgungsstarts, letzte Zielperson
**648,4 s** zurück. Hügelig offensiv: Sieger F13,
**7** Teamverfolgungen, letzter Rückstand **618,3 s**.
Flach Sprint: Sieger F20, **223** Führungsauftragsstarts,
**0** Verfolgung ohne belegte Flucht, letzter Rückstand
**396,7 s**. Die veränderten Zielzeiten entstehen nur aus
Watt-/CP-/W′-/Widerstands- und Streckenphysik; kein
Ergebnisbonus. Die Werte sind fiktiv, keine
Realrenndaten.

**Weiterführung:** `team-pace` belegt den Start eines
Watt-Auftrags, nicht die physisch erreichte Position als
tatsächlicher Frontfahrer. Diese Lücke gezielt
verringern, anschließend Mannschaftstaktik, realere
Verfolgungsorganisation und Sportdirektoren
entwickeln. Keine ungebetene Detail-Lenkphysik.
[Alle sieben R-14-Fälle und Grenzen](race/R14_TEAM_FUEHRUNG_VERFOLGUNG.md).
Issue #42 bleibt offen.


## R-15/R-16 – zusammen implementierte reine Rennengine-Verbesserungen (04.11.2026)

**Nutzergrenze verbindlich:** Keine Rundfahrten oder Karrieremodus-
Features im Arbeitspaket der Rennengine. Teamrollen- und
Sportdirektor-Einstellungen sind mögliche spätere
Managementoberflächen; hier werden **nur** die tatsächlichen
autonomen Entscheidungen der bereits vorhandenen Rennfahrer
weiterentwickelt.

**R-15:** `race-team-ai.ts` teilt einer Mannschaft bis zu
fünf verfügbare Helfer für dieselbe Jagd-/Sprintzug-/
Schutzmission zu, statt genau einen nach R-14.
Ein einzelner tatsächlich frontnaher Fahrer erhält
Führungs-Watt, weitere Helfer andere (meist geringere)
Anforderungen. W′, körperliche Position und Distanz
zum geschützten Fahrer begrenzen die Beteiligung.
Echte Frontnähe wird zusätzlich pro Fahrsekunde
diagnostiziert; Aufträge sind noch keine
physikalisch garantierte 2D-Staffelfahrt.

**R-16:** Abschätzung der Verfolgung anhand kleiner
tatsächlich vorausliegender Flucht, gemessener
Lücke, Hauptfeldgröße, Relativgeschwindigkeit,
Reststrecke, Teaminteresse und W′. Eine
ausgewogene Mannschaft kann bei moderater
Gefahr andere Mannschaften die Arbeit
leisten lassen. Die alten zwei starren
Attackenfenster werden **nur im neuen
Rennmodus** durch situative Angriffe
mit Erholungs-/W′- und Positionsprüfung
ersetzt. Die bisherige R-14-KI bleibt
für einen kontrollierten Vergleich
über `RaceInput.tacticModel='r14'` wählbar.
Standard ist `'r15-r16'`.

**Unverändert:** `advanceMotionStep`, die
CP/W′-Bilanz, physikalischer Brems-/Streckenkern,
der R-13-Formationswindschatten, R-01–R-08
und die vollständige 30-Fahrer-/50-km-Berechnung.
Keine künstliche Einholung oder Angleichung
großer natürlicher Rückstände.

**Testmethodik:** Neue Isolationstests für
fünf Helfer innerhalb derselben Mannschaft,
physische Frontposition, Sprintzug,
Erschöpfung, taktische Gefahrenabschätzung,
strategisches Mitfahren, dynamischen Angriff
und deterministische Vollrennen.
`scripts/r15-r16-comparison.mjs` vergleicht
**sieben identische Seed-/Team-/Streckenfälle**
je mit R-14 und R-15/R-16, also
14 vollständige Rennen und 420 klassifizierte
Ergebnisse. Separate Browser-ESM-Abnahme.
Die finalen GitHub-Actions-Resultate
stehen in der
[R-15/R-16-Fachnotiz](race/R15_R16_MEHRHELFER_RENNINTELLIGENZ.md).

**Folgende Entwicklung weiterhin ausschließlich
Rennengine:** real messbare Frontübernahmen,
Positionsziele, Relaisarbeit, intelligentere
Kooperation/Konkurrenz und gezielte
Verfolgungsentscheidungen mit verschiedenen
Fahrerfeldern. Issue #42 bleibt für
weitere Rennmechanik offen.


### R-15/R-16 – finale Implementierungsabnahme und nächster Auftrag (04.11.2026)

[PR #52](https://github.com/Lancester/radsportmanager/pull/52)
ist mit Squash `26a195b540c0c39d1ca5911198fd058bcd6be70b`
auf `main` übernommen.
[Actions #41742236444](https://github.com/Lancester/radsportmanager/actions/runs/41742236444)
ist vollständig erfolgreich: **232/232 Tests**,
drei 50-km-Rennläufe, TypeScript-Browser-/ESM-Build
und GitHub-Pages-Deployment. Dazu
[separat 14 echte 50-km-Simulationen, 420 Zielankünfte](https://github.com/Lancester/radsportmanager/actions/runs/41741844022)
mit identischen sieben R-14- und R-15/R-16-Eingabepaaren,
ohne Kunstboni oder Abstandsangleichung.

**Technische Wirkung:** Mehrhelfer-Aufträge wurden
in allen sieben neuen Vollrennen zugeteilt,
in fünf davon gleichzeitig mehrere eines Teams.
Frontnahe Führungszeit wurde in allen sieben
gemessen und Sprintzugauftrag in zwei.
Ein eigener isolierter Test beweist
**alle fünf Helfer eines Teams** in einer
dringlichen Verfolgung, mit unterschiedlicher
Führungs-/Unterstützungsleistung.
Unter den Standardfällen war das Maximum
**drei aktive Helfer eines Teams**.
Die Dynamik ist noch ein abstrahiertes 1D-
Rennmodell, keine umfassende reale 2D-Staffelfahrt.

**Beispiel Seed 2026:** hügelig geschützt
Sieger F07, Median-Zielrückstand 63,9 s,
letzter Rückstand 564,0 s; flach Sprint
Sieger F08, Median 1,3 s, letzter
Rückstand 369,8 s. Gewinnerwechsel
ergeben sich ausschließlich aus
veränderter KI-Wattarbeit durch
unveränderte physikalische Modelle.

**Nächste Entwicklungsaufgabe nur innerhalb der
Rennengine:** tatsächliche ablösefähige
Führungspositionen und koordinierte Reaktionen
mehrerer Teams, ohne vollständige 2D-Lenkphysik.
**Karrieremodus, Rundfahrten, Verträge,
Personal, Training und Manageroberflächen sind
ausdrücklich ein getrenntes späteres System.**
Issue #42 offen.
[Messungen und Methoden](race/R15_R16_MEHRHELFER_RENNINTELLIGENZ.md).


## R-17 bis R-21 – gemeinsames abschließendes Funktionspaket vor der großen Kalibrierung (04.11.2026)

Das gemeinsam vom Nutzer bestellte Rennengine-Paket
ist in `feature/r17-r21-engine-abschluss` bearbeitet.
[Verbindlicher Fahrplan](race/ROADMAP_R17_R23_VERBINDLICH.md),
[technisches Gesamtdokument](race/R17_R21_ENGINE_ABSCHLUSS.md).

Die fünf ausschließlich rennmechanischen Funktionsbereiche:

1. **R-17: Führungsposition und Übergabe.**
   Durch `previousLeaders` wird eine tatsächlich
   frontnah fahrende Helferzuordnung 75 s lang
   gehalten, es sei denn, reale Position/W′
   sprechen dagegen. Ablösung nur bei erneut
   geeigneter Position **vor Kapitän/Sprinter**.
   Weiterhin 1D ohne Teleportation/Spurphysik.
2. **R-18: Gegner- und Fluchtreaktion.**
   120-s-Projektion der aus realen Fahrerabständen
   und Geschwindigkeiten gemessenen Lücke,
   zusammen mit Restdistanz und Teamstrategie.
   Kein Ergebnisbonus/garantiertes Einholen.
3. **R-19: Kohlenhydrat und Ausdauer.**
   Transparenter Speicher, Zufuhr,
   Verbrauch, nicht gedeckter Bedarf und
   Energiespeicherüberlauf; Belastungsstrafe
   erst ab ca. 90 min, optionaler `'off'`-A/B-Test.
   CP/W′- und mechanische Energiebilanzen bleiben
   nachweisbar unverändert.
4. **R-20: Fahrerspezialisierung und Umgebung.**
   Fahrertypen aus realen Körper-/Leistungsprofilen,
   Wind und Untergrund per physikalischem
   Aero-/Rollwiderstand. Keine Ergebnisfaktoren.
5. **R-21: große Einzelrennen.**
   2–210 Fahrer, 1–30 Teams, bis 300 km
   per Einzelevent, 22×7=154 Tests mit
   200-km-Flach-/Hügel-, 240-km-Klassiker-
   und 170-km-Bergprofilen.
   Technische Gruppe-/Event-/Energie-
   und CPU-Stressproben.

**Reale Pilotmessungen der Großfeldszenarien:**
Vier volle 154-Fahrer-Rennen und eine 70er-
Berg-Gegenprobe erfolgreich auf dem
GitHub-Runner ausgeführt. Die Rennzeit-/Gruppen-
Ausreißer sind noch **nicht empirisch kalibriert**.
Der aktuelle positionsgeprüfte
[GitHub-Actions-Lauf #41744546224](https://github.com/Lancester/radsportmanager/actions/runs/41744546224)
ergab für 154 Fahrer/200 km flach:
19 maximale Gruppen, Median-Zielrückstand
ca. 14 min, letzter Fahrer ca. 43 min zurück.
Für 154 Fahrer/170 km bergig:
87 Gruppen, Median-Zielrückstand
ca. 47 min, letzter Fahrer ca. 113 min zurück.
Alle vier 154er-Profile liefen im CI-Runner
in ca. 7,5–10,8 Sekunden je Einzelevent.
Das sind **technische Messungen, keine
behaupteten realistischen WorldTour-Verteilungen**.

**Nach diesem Paket:** kein weiterer
unbegrenzter Feature-Zyklus, sondern
**R-22 Validierung/Monte Carlo/Endkalibrierung**
mit verschiedenen Profilen, großen Feldern,
realen Vergleichsdaten und unabhängigen
Validation Sets; erst danach
**R-23 Freigabe-Gate für Rennengine 1.0**.
Die UCI-ähnlichen Einzelrennprofile gehören
in die Rennengine, die Kombination
zu Etappenrennen/Gesamtwertungen nicht.


### R-17–R-21: finaler main-Stand und nächste Phase R-22 (04.11.2026)

[PR #53](https://github.com/Lancester/radsportmanager/pull/53)
ist mit Commit `9a8aeacf5e8afe3dfa6f8324229fea7cfd4529b7`
in `main`. **Reguläre
[main-CI #41745212283](https://github.com/Lancester/radsportmanager/actions/runs/41745212283)
vollständig erfolgreich: 241/241 Tests, 0 Fehler,
drei komplette 50-km-Vollrennen, TypeScript-/Browser-ESM
und GitHub-Pages-Deployment.** Die separate
[Langstrecken-Abnahme #41744830294](https://github.com/Lancester/radsportmanager/actions/runs/41744830294)
bestätigt vier 154-Fahrer-Einzelrennen über
170–240 km plus 70er-Berg-Gegenprobe
(**686 klassifizierte Fahrer**), aus
unveränderter mechanischer Physik.
Das einmalige Stressworkflow ist entfernt;
`npm run test:scale` bleibt.

**Als technischer Engine-Funktionsumfang abgeschlossen:**
R-17 tatsächliche Führungspositions-/Schichtprüfung,
R-18 Prognose-/Teamverfolgung, R-19
bilanzierte Verpflegung und Langzeitausdauer,
R-20 Fahrertypen und physische Umwelt,
R-21 154+ Fahrer und lange Einzelrennen.

**NICHT abgeschlossen:** Empirische Kalibrierung
auf echte Profi-Renndynamik.
[**R-22 Issue #54**](https://github.com/Lancester/radsportmanager/issues/54)
ist dafür der nächste eigenständige Schritt:
Monte-Carlo-/Seed-Studie mit großen Starterfeldern,
realen unabhängigen Referenzrennen,
Plausibilitätsprüfung der teils sehr großen
Zielabstände und dokumentierten A/B-Parametern.
Erst nach erfolgreichem R-22 folgt
**R-23 Freigabegate** für Engine 1.0.
**Rundfahrten, Transfers, Karriere, Mitarbeiter
und Saisons bleiben ausdrücklich andere Spielsysteme.**
