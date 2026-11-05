# Entwicklungsstand

## Schritt 3 – gezielte Regelkorrektur, experimentell

Die [Regelkorrektur](race/R24_SCHRITT3_REGELKORREKTUR.md) behandelt ein beobachtetes widersprüchliches Signal: ein schnelleres, nicht verzögerndes direktes Vorderrad und zugleich eine verzögernde entfernte Gruppenspitze. Es wird nur der Wattwunsch angepasst, keine Position oder Geschwindigkeit. In drei Kontroll-Seeds verringerte sich die räumliche Spreizung nach direktem Anstieg→Abfahrt; beim sanften Übergang zeigte sich auch ein schlechterer Gegenfall. Drei Seeds über alle vier Profile sind dokumentiert und ergeben unterschiedliche Rennverläufe. 369/369 lokale Tests bestanden; der ergänzte Watt-Reglertest und der Browser-Build bestanden separat. Dies ist ein begrenzter experimenteller Fix, keine vollständige Lösung oder Realismusfreigabe; weitere Terrain- und Mehrseed-Tests bleiben nötig.

## Schritt 3 – kontrollierte Geländeversuche und Einzelanschlüsse

[Kontrollierte Terrain- und Anschlussprüfung](race/R24_SCHRITT3_TERRAIN_UND_ANSCHLUSS.md): In 30-km-Kontrollstrecken blieb das Modellfeld bei Ebene und Anstieg→Ebene zusammen, teilte sich jedoch zeitweise beim Übergang in eine Abfahrt. Eine begrenzte Beschleunigungsreferenz reduzierte die Spreizung in drei Kontroll-Seeds, bewirkte aber Änderungen in Vollrennen und bleibt eine nicht übernommene Heuristik. Einzelne Kapitäns-Anschlussversuche werden im Checkpoint-Modus mit ursprünglicher Zielgruppe, Helfern und beobachtetem Gruppenzusammenschluss dokumentiert. Zusätzliche Vollrennen mit Seeds 42/123 bestätigen erhebliche Rennverlauf-Unterschiede; die Korrektur ist nicht übernommen. Im Berg-Seed 123 mit Flachfahrerfeld stehen zwei Sprinter unter den Top 10, im bergtypischen Feld keiner – gesondert offen. 368/368 Tests und PR-CI erfolgreich. Keine nachweislich robuste Gruppenregelkorrektur, weitere Prüfungen bleiben offen.

## Schritt 3 – Fortsetzung: Anschlussarbeit messbar, Gruppenregler offen

Im Checkpoint-Diagnosemodus werden tatsächlich geleistete Sekunden und Kurbelarbeit unter Anschlussauftrag sowie an der unmittelbaren Gruppenspitze je Helfer erfasst. Der gepaarte Berglauf ergab identische Rennereignisse, Klassifikation und Messpunkte mit und ohne Zusatzmessung; der vollständige lokale Testlauf bestand mit 365/365 Tests und das Browsermodul ließ sich bauen und importieren. Zwei weitere Varianten des Gruppenreglers zeigten keine belastbare Verbesserung und wurden nicht übernommen. [Einzelheiten und offene Aufgaben](race/R24_SCHRITT3_GRUPPEN_UND_SPRINTER.md). Die Korrektur des Geländeübergangs und die Bewertung des Erfolgs einzelner Anschlussversuche bleiben offen; Schritt 3 ist insoweit nicht vollständig abgeschlossen.

## Schritt 3 – Gruppenübergang und Sprinter geprüft (05.11.2026)

[Schritt 3: Gruppen und Sprinter](race/R24_SCHRITT3_GRUPPEN_UND_SPRINTER.md) enthält aktuelle Sekundenmessung, gepaarte Gegenprobe, reale Auftragsereignisse im fiktiven Rennen und einen Test zu individuell unterschiedlichen Sprintern. Eine einfache lokale Beschleunigungsreferenz veränderte die Renndynamik stark und wurde nicht in die Engine übernommen. Der Gruppenübergang und die tatsächliche Dauer und Wirksamkeit der Kapitänsjagd sind daher **noch nicht abschließend gelöst**. Fünf zielgerichtete Tests bestanden. Diagnose, Messdaten und verworfene Versuchsänderung sind gesichert; für Nutzerfeedback hier anhalten.

## Schritt 2 – Rennverläufe untersucht (05.11.2026)

Die gepaarten Liège- und Hautacam-Läufe sowie ein Berg-Kontrolllauf ohne Attacken sind in [Schritt 2: Rennverläufe](race/R24_SCHRITT2_RENNVERLAEUFE.md) mit Skript und Rohdaten dokumentiert. Der Sprintersieg trat auf dem Stand vor der Kapitänsjagd auf; aktuell liegt derselbe Fahrer im Einzelbeispiel auf Platz 15. Eine frühe Berggruppenteilung tritt auch ohne Attacken auf. Die stark unterschiedlichen Resultate der Kletterer gehen mit früh auseinanderlaufenden Gruppenverläufen einher, ihre unmittelbaren Ursachen sind mit 5-km-Messpunkten nicht abschließend bewiesen. Mess- und Modellgrenzen sowie nächste Untersuchungen stehen im Bericht. Keine Engineänderung; nach Nutzerwunsch hier anhalten und Feedback abwarten.

## Schritt 1 – technische Absicherung (05.11.2026)

Der auf GitHub gespeicherte Entwicklungsstand `fc64c6b781c5696b88911e2f010845bbc244e17d` hat den vollständigen PR-Testlauf [GitHub Actions #286](https://github.com/Lancester/radsportmanager/actions/runs/41987212329) erfolgreich bestanden. Das Browsermodul wurde lokal mit TypeScript 5.8.3 neu erzeugt und als ES-Modul erfolgreich geladen. Der vollständige lokale Lauf auf demselben Code bestand mit **363/363 Tests** (Node 24.22.1, 139 s); keine der beiden expliziten R24-Warnungen zur Feldteilung wurde in diesem Lauf ausgegeben. Auch der Syntaxcheck des Diagnose-Skripts bestand.

**Kritische Bewertung der Teständerungen:** Die isolierten Klassiker-Tests prüfen die Rampenentscheidung bei geeigneter Situation sowie Gegenbeispiele; der kontrollierte 20-km-Flachtest verlangt ohne Wind und Attacken eine zusammenhängende 154er-Zielgruppe. Im echten Profiltest sind eine große Zielgruppe, die fehlende Feldteilung ohne erneute Attacke und eine feste Obergrenze des Hügel-Medianrückstands jedoch keine harten Gates mehr. Warnungen bzw. reine Gültigkeitsprüfungen können sportliche Regressionen deshalb nicht zuverlässig erkennen. Auch eine funktionslose Einbindung der Spezial-Rampenarbeit kann trotz isoliertem Funktionstest unentdeckt bleiben, wenn der Referenzlauf keine geeignete Gruppe enthält. Diese Lücken bleiben offen und müssen mit gezielten, situationsabhängigen Integrationstests und ausgewerteten Mehrseed-Vergleichen geschlossen werden; eine feste Wunsch-Zielgruppe oder ein pauschales Rückstandslimit wären dafür keine ausreichende fachliche Begründung.

**Vereinbarung:** Nach Abschluss jedes Schritts anhalten und den Nutzer informieren. Nächster Schritt nach Freigabe: detaillierte Diagnose der ausgewählten Rennverläufe, noch keine vorgezogene Änderung an der Renn-KI.

## Wiederaufnehmbarer Zwischenstand – R-24 (05.11.2026)

**Entwicklungsbranch:** `feature/r24-rennki-audit`, [Entwurf PR #81](https://github.com/Lancester/radsportmanager/pull/81). Dieser Stand ist experimentell; `main` bleibt unverändert. Die ausführliche Chronik steht in [R-24 Auditkorrekturen](race/R24_AUDIT_KORREKTUREN.md), der Abgleich mit echten Rennen in [R-24 Realrennen](race/R24_REALRENNEN_ABGLEICH.md).

**Erledigt:** Der physikalische Bewegungskern und der CP/W′-Kern wurden beibehalten. Die Ermüdungskopplung, Angriffs- und Jagdentscheidungen, Gruppenerkennung und Renntelemetrie wurden überarbeitet. Ein Fehler im Sprintzug, der unbeteiligten Fahrern Leistung entzog, und eine verdeckte 25-%-Begrenzung der dreiminütigen Rampenbewertung wurden korrigiert. Geschützte abgehängte Kapitäne können mit tatsächlich verfügbaren Teamhelfern einen Anschluss organisieren; die dokumentierten Entscheidungsschwellen sind vorläufig und erzeugen keine künstliche Positionsänderung.

**Sportlicher Zwischenstand:** Im kontrollierten Vergleich mit demselben fiktiven Fahrerfeld und Seed 2026 lagen die Medianrückstände `main` → aktueller Kandidat bei Lille 26,9 → 17,2 s, Boulogne 344,7 → 205,4 s, Liège 791,2 → 600,6 s und Hautacam 1931,7 → 936,2 s. Das sind Einzelbeobachtungen, keine Zielwerte und kein Nachweis einer allgemeinen Verbesserung. Andere Zusammensetzungen und Seeds ergeben andere Ergebnisse; insbesondere variiert die Wirkung der Kapitänsjagd. Große Rückstände sind für sich genommen kein Fehler: Der Finishermedian des echten Liège betrug 2024 +13:10 und 2025 +5:41. Die unterschiedlichen Teilnehmer, Ausfälle und Zeitmessungen begrenzen den Vergleich.

**Geprüft:** 17 gezielte Tests zur Rampenbewertung und 19 zur Jagd-/Schutzlogik bestanden; nach Anpassung situationsabhängiger Integrationserwartungen bestanden 12 gezielte Profil-/Klassiktests. TypeScript wurde geprüft. Der letzte Gesamtlauf vor der Testanpassung ergab 362/363; der einzelne Fehltest verlangte Rampenarbeit auch ohne passende Rennsituation. Die Testannahme wurde transparent angepasst und durch unabhängige situative Tests ergänzt; der spätere vollständige Gesamtlauf bestand mit 363/363 Tests (siehe Schritt 1 oben). Keine Realismusfreigabe.

**Als Nächstes:** Vollständige Tests und CI auf dem jeweiligen Branchstand prüfen; vier Profile mit mehreren Seeds und gleichen Feldern nachvollziehbar gegenüberstellen; Rennverläufe und Leistung insbesondere bei frühen Berg-Gruppentrennungen, Anschlüssen, Sprintern und Klassikern untersuchen. Erst danach Auswirkungen und dokumentierte Schwellen bewerten. Noch kein Merge nach `main`.

## R-24 – Auditkorrekturen als experimenteller Entwicklungsstand

Auf dem Entwicklungsbranch werden die im unabhängigen Audit erkannten
Kopplungs-, Angriffs-, Gruppen- und Jagdprobleme bearbeitet. Der
Bewegungs- und CP/W′-Kern bleibt erhalten; die konkrete R-19-Kopplung
und die `stable-pack`-Entscheidungen ändern sich. Die autonome Wahl der
Jagdhelfer bleibt die Produktentscheidung. Einzelheiten, Modellannahmen,
Testergebnisse und offene sportliche Befunde:
[R-24 Auditkorrekturen](race/R24_AUDIT_KORREKTUREN.md).

**Status:** Dieser Abschnitt beschreibt einen Testkandidaten auf einem
Entwicklungsbranch, keine Übernahme nach `main` und keine
Realismusfreigabe. Der nachfolgende R-23-Abschnitt beschreibt weiterhin
den integrierten Stand von `main`.

**Aktueller Stand: 04.11.2026 – R-23: Sprint-, Jagd-, Klassiker- und Hügel-KI in `main`; 330/330 Tests; Work-Gesamtaudit als nächste unabhängige Qualitätsprüfung.** Ein Seed ist noch keine Mehrseed-Kalibrierung.

## Aktueller verbindlicher Stand – R-23 integriert und Work-Gesamtaudit vorbereitet (04.11.2026)

**Fertig nach `main` gemergt:** PR [#74](https://github.com/Lancester/radsportmanager/pull/74) (Sprint/Jagd), [#76](https://github.com/Lancester/radsportmanager/pull/76) (Klassiker) und [#78](https://github.com/Lancester/radsportmanager/pull/78) (Hügel-KI + generische Angriffe ohne starre 88-%-Sperre). Letzter Code-Merge-Commit `f7333421`; [CI #41904933020](https://github.com/Lancester/radsportmanager/actions/runs/41904933020) **330/330 Tests erfolgreich**, 154 fiktive Fahrer je Profil, **ein Seed 2026**. `legacy`, physikalischer Motion-Core, CP/W′, R-19 und Aero-Kern unverändert.

**Sportliche Referenz (ein Seed, nicht kalibriert):** Lille F149 Sprinter, 8 Sprinter Top10, 26 Fahrer Siegerzeitgruppe, 45 Attacken. Boulogne F001 Klassiker, 35 Attacken statt 108 (19 früh, 0 Mitte, 16 auf späten Rampen), Median +129,70 s statt +81,41 s. Liège F057 Klassiker, 0 Sprinter Top10, 53 Attacken. Hautacam F078 Kletterer, 0 Sprinter Top10, 13 Attacken. Lille, Liège und Hautacam wurden durch PR #78 in allen bisherigen Referenzkennzahlen exakt erhalten. Am 1,1-km-Haut-Pichot sind **zehn Angriffsereignisse** auffällig: Das sind Wattwünsche, nicht zehn bestätigte erfolgreiche Ausreißgruppen; ein explizites 5-km-Checkpoint-/W′-Audit ist in PR #78 ergänzt.

**Produktentscheidung:** PR [#75](https://github.com/Lancester/radsportmanager/pull/75) (manuelle 0–5-Jagdhelferzahl) ist **ohne Merge geschlossen**. Manager gibt die Leitlinie vor, sportliche Leiter bestimmen Helferzahl und Ablösung autonom.

**Nächste Priorität:** **Unabhängiger kritischer Work-Gesamtaudit vor weiteren Renn-KI-/Manager-Features.** Vollständiger Auftrag: [`docs/race/KI_GESAMTAUDIT_WORK_BRIEFING.md`](https://github.com/Lancester/radsportmanager/blob/main/docs/race/KI_GESAMTAUDIT_WORK_BRIEFING.md). Insbesondere übersehene starre Prozentfenster, Taktikprioritäten, 10–30er-Spitzengruppen, große Zeitabstände, tatsächliche Angriffsfolgen, CP/W′-/Windschatteninvarianten, Mehrseed-Stabilität und Android-Laufzeit prüfen. Ältere Aussagen wie „PR #74/#76/#78 ungemergt“ sind historische Journalnotizen, **nicht** der aktuelle Stand. Keine Sport-Realismusabnahme aus nur einem Seed ableiten.

## Integrationsabnahme Sprint/Jagd und Klassiker am 04.11.2026

**Verbindlicher Integrationsstand 04.11.2026:** PR [#74](https://github.com/Lancester/radsportmanager/pull/74) (Sprintteamjagd, realer Helfereinsatz, individueller Zielsprint, bessere Feldkohäsion) **und** PR [#76](https://github.com/Lancester/radsportmanager/pull/76) (Klassiker-KI) sind nacheinander **nach `main` gemergt**. Code-Merge-Commits `568f2341` und `8b478639`. Die *kombinierte* CI [#41890188739](https://github.com/Lancester/radsportmanager/actions/runs/41890188739) war mit **324/324 Tests erfolgreich, 0 Fehler**, inklusive vier 154-Fahrer-Referenzrennen, No-Attack-/30er-, Physik- und Integrationschecks.

**Sportlicher Stand:** Lille, Seed 2026, 5 km vor Ziel **115 Fahrer** in der führenden physischen Gruppe statt zuvor 25; 8 Sprinter Top10, 26 Fahrer in 1-s-verknüpfter Siegerzeitgruppe, 2 Fluchten eingeholt, 1.425 s CP-nahe reale Feldjagd, 22 individuelle Sprintantritte. **Der konservative 30er-Massenprint-Proxy ist weiterhin false**, und aus einem Seed keine Massensprint-Häufigkeit ableiten. Liège: Klassiker F057 Sieger, **0 Sprinter in Top10**, gezielte Rampentempo-/Positionierungsarbeit; mögliche größere Zeitabstände später statistisch kalibrieren. Boulogne und Hautacam gegenüber ihrer Referenz unverändert. **Keine Änderungen** an `legacy`-Default, CP/W′, R-19, Motion-Core oder Aero. **PR #75 (Managerwahl 0–5 Jagdhelfer) bleibt offen und ungemergt.** Nächstes getrenntes KI-Thema: hügelige Etappen (Boulogne 108 Attacken im Seed 2026), danach PR #75 und Multi-Seed-Kalibrierung.

**Wichtig bei älteren Notizen:** Frühere, weiter unten stehende Aussagen wie „PR #74/#76 noch offen“ beschreiben ihren historischen damaligen Zustand und sind **seit dieser Integration überholt**. Die KI wurde technisch integriert, **nicht** als wissenschaftlich/mehrseed-statistisch vollständig kalibriert deklariert.

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


## R-22 Pilot 0.1 – manueller Monte-Carlo-Workflow, erste Sensitivität (04.11.2026)

[PR #55](https://github.com/Lancester/radsportmanager/pull/55)
gemergt, `main`-Commit
`d5e763cad6d0dea4e6a23ec0ae24c3da2c8cf7e2`.
[GitHub Actions Main #41763646503](https://github.com/Lancester/radsportmanager/actions/runs/41763646503)
**242/242 Tests erfolgreich, 0 Fehler; reguläre
Rennengine-/TypeScript-/Browser- und Pages-Abnahme grün.**

Die künftigen großen
Monte-Carlo-Serien werden **vom Nutzer selbst**
in **GitHub Actions per workflow_dispatch**
gestartet; KEINE Push-/Schedule-/Automationsserie.
Die Parameter sind Profil, 3–100 Seeds,
5/10/22 Teams à 7 Fahrer, 50–240 km,
Seed und optional gepaarter
20/100-g/h-Vergleich. Bericht im
GitHub-Run-Summary und als 30-Tage-Artefakt
(CSV, JSON, Markdown). Dauer-/Quota-Risiko
bei 154 Fahrern und vielen Seeds
ausdrücklich dokumentiert.

**Erster tatsächlich ausgeführter Technikpilot:**
[PR-Actions #41763527407](https://github.com/Lancester/radsportmanager/actions/runs/41763527407):
vier komplette 170-km-Bergrennen
(2 Seeds × 2 Kohlenhydratzufuhren,
5 Teams × 7 Fahrer), **140 Zielankünfte**,
mechanische Energie-/W′-/KH-Bilanzen geprüft.
100 gegenüber 20 g/h führte im
Modell zu durchschnittlich
**2932 s kürzerer Siegerzeit**
und durchschnittlich 860,6 s geringerem
Median-Zielrückstand. Dies ist ein
**auffällig großer Modell-Effekt,
keine realweltliche Behauptung**.

**Nächste R-22-Aufgabe:** die
physiologischen R-19-Annahmen,
Formations-/Gruppenschwellen
und langen Rennzeiten mit
realen unabhängigen Referenzen
untersuchen, Seeds auf mehr
physikalisch begründete
Variabilität ausweiten,
Kalibrierungs-/Validation Sets
trennen und skalierte Runs
manuell durchführen.
[R-22 Issue #54](https://github.com/Lancester/radsportmanager/issues/54)
bleibt offen, **R-23 noch nicht begonnen**.

[Anleitung und Pilotreporte](race/R22_MONTE_CARLO_PILOT.md).


## R-22A/B/C – neue Strecken-/Fahrer-/Teamreferenzen mit manueller Schnellwahl (04.11.2026)

Gemeinsame Datengrundlage und Ablauf
[Details](race/R22ABC_REFERENZSTRECKEN_PROFIFELDER.md).
Die bisherigen 35er-Pilotfelder und
künstlichen R-21-Strecken bleiben für
**Funktionstests** erhalten, gelten aber
ausdrücklich **nicht** als Endkalibrierungsmaßstab.

Vier reale Renn-Anker: Lille 184,9 km,
Boulogne 209,1 km, Liège–Bastogne–Liège
252 km, Hautacam 180,6 km (alle 2025).
Distanzen und wichtige Anstiegslängen/
Mittelsteigungen sind quellenbelegt.
**Keine Original-GPX-Datei**; Strecken-
Übergänge sind explizite Näherungen.
Bei Lille, Boulogne und Hautacam
werden die publizierten Gesamt-
Höhenmeter mathematisch erreicht
(1065/2164/3850); Lüttich hat
3346 **rein modellierte** Höhenmeter.
GPS-/DEM-Verifikation bleibt offen.

Physiologische Typmittel aus
144 WorldTour/Pro-Continental-Fahrer-
profilen sind die Basis für 154
fiktive Fahrerwerte: CP/W′,
Körpermasse und CdA differenziert
nach Sprinter, Kletterer, GC,
Allrounder und Zeitfahrer.
Klassikerfahrer und FTP-Abbildung
sind gesondert deklarierte Annahmen.
Fahrerkader bleiben bei neuen Seeds
identisch; der Seed verändert derzeit
vor allem CP-Tagesform.

**Szenarioabhängig** 22 Teams à
7 Fahrer mit 5 taktischen Schwerpunkten;
auf flachen Straßen mehr Sprintteams,
im Hochgebirge mehr GC-/Kletterteams,
im Ardennenklassiker mehr Klassikerteams.
Kader- und Quellenmanifest wird
mit dem Monte-Carlo-Artefakt exportiert.

Die **manuell ausgelöste GitHub-Actions-Maske**
fragt nur noch Szenario, Seed-Anzahl,
optional Ernährungsvergleich und
Startseed; Felder und km werden automatisch
ausgewählt. Keine Rundfahrten und
keine automatische Serie.

**Pilotabnahme:** vier komplett
simulierte historische Rennanker
mit je 154 Startern, zusammen 616
vollständige Klassifikationen,
[CI #41768768694](https://github.com/Lancester/radsportmanager/actions/runs/41768768694)
technisch erfolgreich. Die
teilweise sehr großen Lücken und
Kletterersiege auch bei Flachrennen
werden ausdrücklich **nicht als
physiologisch realistisch bestätigt**.
Nächster eigentlicher R-22-Schritt
sind GPX-/Höhenprofil-Datenqualität,
unabhängiger Referenzvergleich
und die CP/W′-/Ermüdungs- und
Feld-Dynamik-Kalibrierung.
R-23 bleibt ausstehend.


## R-22 Ursachen-Audit (04.11.2026) – nachgemessene frühe Feldfragmentierung

[PR #57](https://github.com/Lancester/radsportmanager/pull/57)
gemergt. [249/249 Regressionstests erfolgreich](https://github.com/Lancester/radsportmanager/actions/runs/41774943026).
Die 5-km-Simulation zeichnet bei Bedarf alle 154 Fahrer samt
Position, Gruppen, Watt, CP, W′, Kohlenhydraten, R-19-Verfügbarkeit
und Aero-Faktor auf, **ohne Physik- oder Ergebniseingriff**.

Gepaarter Lille-184,9-km-Test (154 Fahrer, Seed 2026):
Baseline Sieger 12619,2 s (52,75 km/h), Medianabstand
663,6 s, letzter 4023,5 s, 50 Gruppen.
**Ohne R-19**: Sieger 420,7 s schneller, 37 Gruppen.
**Alte Aero-Approximation**: Sieger 2240,6 s langsamer,
mittlerer Aero-Faktor 0,8902 statt 0,5897, aber
**60 statt 50 Gruppen**.

Entscheidender neuer Messbefund: Bereits bei
**km 25 zwölf** und **km 50 29** Abstandsgruppen,
obwohl die **R-19-Leistungsstrafe noch 0 %** ist.
Bei km 150 sind es 42 Gruppen und
15,8 % Median-R-19-Leistungsstrafe.
Die **frühe Fragmentierung kann nicht durch R-19
allein erklärt werden**; die
starke Formationsaerodynamik (mehrfach Median
Aero-Faktor 0,40), 1D-Abstandsfeedback
und Varianz der Fahreranforderungen
müssen getrennt geprüft werden.
**Keine Kalibrierungsparameter verändert.**

[Ausführlicher Ursache-Audit samt Zahlen](race/R22_URSACHEN_AUDIT.md).
Neuer separater manueller Workflow
**R-22 – Ursachen-Audit (154 Fahrer)** mit
vier Rennvorlagen, Start-Seed und
CSV/JSON/Markdown zum Herunterladen;
bestehender Monte-Carlo-Workflow bleibt erhalten.
R-22 ist weiterhin offen; R-23 nicht freigegeben.


## R-22 experimentelle gruppenbewusste Fahrer-KI (04.11.2026)

[PR #58](https://github.com/Lancester/radsportmanager/pull/58)
gemergt, Code-Commit
`08116b99e22dc775dd8429d0710d5f0ba7634f9e`,
[PR CI 252/252 Tests erfolgreich](https://github.com/Lancester/radsportmanager/actions/runs/41777253189).

**Nachgewiesener KI-Fehler:** Die alte automatische
Angriffsentscheidung erlaubt keine Attacken
vor 18 % Rennfortschritt; dennoch entstand
bereits nach km 25 die starke Fragmentierung.
Die bestehende Standard-KI verlangt
von Fahrern viel zu unabhängig
CP-basierte Dauerleistung, statt
kontrolliertes Gruppentempo zu fahren.

**Neue Option** `groupRidingModel:'cohesive'`
in der Einzelrenn-Engine:
ein physischer Pacesetter pro Gruppe,
gruppenbezogen berechnete Wattanfragen
zur passenden Geschwindigkeit und
Beschleunigung, mit Vorrang für Angriff,
Sprint, aktive Teamarbeit und
Verfolgung; erste frühe Angriffsmöglichkeiten.
Keine Geschwindigkeits-/Zeit-/Positionsboni.
**Standard bleibt unverändert legacy**,
R-22-Version ist **nur experimenteller
A/B-Schalter**, weil noch nicht validiert.

**Drei echte 154-Fahrer-Iterationen (Lille,
Seed 2026):** Individueller Gruppenansatz
verschlechterte die Gruppenanzahl 50→75;
zu defensiver gemeinsamer Pacesetter
unterdrückte Attacken komplett und
ergab nur 41,3 km/h. Dritte Fassung:
**46,01 km/h statt 52,75 km/h;
18 statt 50 maximale Gruppen;
Hauptgruppe km25: 138 statt 39 Fahrer;
16 statt 2 Attacken**.
Allerdings **Median-Zielrückstand
823,5 statt 663,6 s** und
**390 individuelle Chase-Intent-Wechsel**
gegenüber 7: Jagd-/Team-KI ist nicht
abnahmefähig, Kalibrierung weiter offen.

Zusätzlicher ausschließlich manuell
zu startender GitHub-Workflow
**R-22 – Gruppen-KI A/B (154 Fahrer)**
([Workflow](https://github.com/Lancester/radsportmanager/actions/workflows/r22-group-ai-ab.yml)),
mit identischem Seed/Referenzstrecke, zwei
154er-Vollrennen und CSV/JSON/Markdown-
Protokoll. [Vollständige A/B-Dokumentation](race/R22_GRUPPENFAHR_KI_AB.md).
Nächster Schritt: stabile
Pelotonspitzen-Teamführung,
Ausreißerjagd, Chase-Hysterese
und mehrprofilige Validierung.
R-23 ausdrücklich noch nicht freigegeben.


## R-22 koordinierte Peloton-KI, Energiesparen und Zielgruppen (04.11.2026)

[PR #59](https://github.com/Lancester/radsportmanager/pull/59)
nach grüner CI mit **254/254 Tests** gemergt.
Neue zusätzliche Einzelrenn-Option
`groupRidingModel:'coordinated'`
vereint gruppenbewusstes Energiesparen,
Teams mit eigenem Verfolgungsinteresse
und zeitlich stabilen Jagdmandaten.
**Default bleibt legacy; cohesive und
coordinated bleiben Experimente.**
Die Mechanik erzwingt weder
Geschwindigkeiten noch Positionen
noch Zielplatzierungen.

Mit `finishGroupMetrics` werden bei
Flachetappen ausdrücklich **Größe der
Siegergruppe, größte Zielgruppe,
deren Rückstand auf die Siegerzeit
und Fahrer binnen 60 Sekunden**
gemessen, als 1-s-Zeitgruppenproxy
(nicht UCI-offiziell).
[Auswertung und Einschränkungen](race/R22_HAUPTFELD_JAGD_ZIELGRUPPEN.md).

**Echte 154-Fahrer-Lille-Kontrollprobe
(Seed 2026, 184,9 km):**
- Legacy: 52,75 km/h, größte Zielgruppe
  23 Fahrer, deren Rückstand 239 s,
  Siegergruppe 9 Fahrer, 307,8 W
  durchschnittliche Kurbelarbeit pro
  Fahrsekunde.
- Cohesive: 46,01 km/h,
  größte Zielgruppe 57 Fahrer,
  deren Rückstand 810 s,
  Siegergruppe 3, 207,2 W.
- Coordinated: 44,76 km/h,
  größte Zielgruppe **133 Fahrer**,
  deren Rückstand **929 s (15:29 min)**,
  Siegergruppe **nur 3 Fahrer**,
  167,8 W. Maximal 5 statt 50
  Abstandsgruppen, 123 statt 390
  Wechsel in die Verfolgungsabsicht
  gegenüber `cohesive`.

**Kritischer Befund:** Ein riesiges
Hauptfeld mit über 15 min Rückstand ist
KEIN realistisch erreichter Massensprint!
Das geringere Tempo erklärt einen Teil
des niedrigeren Wattbedarfs.
Der Vergleich zeigt Verbesserungen beim
Zusammenhalt und Energiesparen,
aber die Jagd-/Führungsmechanik bleibt
deutlich unzureichend. Keine
R-22-Gesamtkalibrierung oder
R-23-Freigabe.
Neuer manueller Workflow
**R-22 – Gruppen-KI + Zielgruppen
(154 Fahrer)** mit vier Strecken
und frei wählbarem Seed; keine
automatischen Monte-Carlo-Kampagnen.


## R-22 – physische Helfer-Aufrückarbeit und Relais-Jagd, 04.11.2026

[PR #60](https://github.com/Lancester/radsportmanager/pull/60)
**erfolgreich gemergt**; [PR-CI #41782295118](https://github.com/Lancester/radsportmanager/actions/runs/41782295118)
**255/255 Tests erfolgreich**. Vollständiger Bericht:
[docs/race/R22_RELAY_JAGD_EXPERIMENT.md](race/R22_RELAY_JAGD_EXPERIMENT.md).

Zwei weitere **nicht-standardmäßig aktivierte** KI-Versuche
erweitern die früheren Modelle, ohne CP/W′/R-19, Aero-Kern
oder Bewegung zu verändern:
- `groupRidingModel:'relays'`: physischer Aufstieg
  nominierter Mannschaftshelfer nach vorn
  (bis zu vier, maximal 300 m rückliegend,
  nur bei echtem Team-Jagdmandat).
- `groupRidingModel:'relay-paced'`: die unterstützenden
  Helfer arbeiten sich mit physisch berechneter
  Gruppen-Mitfahrleistung plus max. 42 W
  und Deckel 102,5 % Tages-CP kontrolliert
  zur Front, statt dauerhaft blind 110 % CP
  anzufordern. Ein echter Fronthelfer kann
  weiterhin seinen taktischen Jagdauftrag erfüllen.

**Erstmalig messbare KPI:** beauftragte Jagdsekunden
gegenüber Sekunden, in denen tatsächlich
ein nominierter Verfolger an der Spitze
der größten physischen Gruppe führt.
Lille 184,9 km, 154 Fahrer, Seed 2026:
- `relays`: 6.870 s Auftrag,
  **109 s tatsächliche Frontjagd**;
  größte Zielgruppe 116 Fahrer,
  **12:55 min** hinter Sieger.
- `relay-paced`: 11.430 s Auftrag,
  **1.848 s tatsächliche Frontjagd**;
  größte Zielgruppe 67 Fahrer,
  **6:06 min** hinter Sieger.
  464 individuelle Jagd-Intent-Wechsel,
  24 maximale Gruppen und Mittelwatt ~208 W.

Die gemessene Teamführungszeit steigt stark,
aber **Jagd-/Führungsrotation ist noch NICHT
realistisch**, die Gruppenkohäsion wird schlechter,
und der Zielgruppen-Rückstand ist für ein
echtes sprintdominiertes Flachrennen noch
deutlich zu groß. Die Verbesserung darf
nicht als Abschluß der Kalibrierung gelten.
**Standard bleibt `legacy`; keine Freigabe R-23.**

Neuer A/B/C/D/E-Vergleich läuft über den weiterhin
**ausschließlich manuell startbaren**
[Gruppen-KI-A/B-Workflow](https://github.com/Lancester/radsportmanager/actions/workflows/r22-group-ai-ab.yml).
Nächster Schritt: physische Ablösung und
Rückkehr von Helfern (nicht dauerhaftes
W′-Aufbrauchen), Jagd-Auftragsdauer,
Pelotonspitzen-Pacing, dann mehrere Seeds
und voneinander unabhängige Rennprofile prüfen.


## R-22: Relais-Führungsdiagnose als nächster kleiner Schritt (04.11.2026)

**Arbeitsbranch:** `feature/r22-relais-fuehrungsdiagnose`. Nach [PR #61](https://github.com/Lancester/radsportmanager/pull/61) und der Front-Gating-Ursachenprüfung folgt bewusst **zunächst nur bessere Messung statt erneuter KI-/Physik-Parameteränderung**.

Die Rennsimulation protokolliert nun für die drei experimentellen physischen Relaismodi zusätzlich `mainFieldChaserLeaderChanges` (direkte Wechsel zwischen tatsächlich jagend führenden Fahrern an der Front der größten physischen Gruppe) und `longestMainFieldChaserStintS` (längste kontinuierliche persönliche Jagdführung). Beide Kennzahlen stehen in `scripts/r22-group-ai-ab.mjs` (JSON/Markdown) und sind über den bestehenden Sechs-Varianten-Vollrenntest auf Konsistenz prüfbar.

**Abnahmestand:** Quelländerungen und Regressionstest geschrieben, aber GitHub-Actions-Ergebnis und tatsächliche neue Messwerte **noch nicht bestätigt**. Keine neue sportliche Realismusfreigabe. Standard-KI bleibt `legacy`; R-22 Issue #54 und Peloton-Issue #42 bleiben offen. Keine Anpassung von CP/W′, R-19, Aero, Integrator, Strecken, Fahrertypen oder Spielsystemen. Keine automatische Großtest-Serie.

**Exakter nächster Schritt:** CI prüfen; danach mit vom Nutzer manuell ausgelösten A/B-Läufen mehrere Seeds und Rennprofile vergleichen. Die Häufigkeit echter Ablösungen, längste Frontphasen, Dauer von Jagdmandaten, physische Zielgruppengrößen und Rückstände gemeinsam beurteilen. Erst danach einen isolierten, schaltbaren KI-Versuch für Ablösung/Rückkehr vorsehen. Details: [R22_RELAIS_FUEHRUNGSDIAGNOSE.md](race/R22_RELAIS_FUEHRUNGSDIAGNOSE.md).


### R-22 Relais-Diagnose: technische Abnahme (04.11.2026)

[PR #62](https://github.com/Lancester/radsportmanager/pull/62) wurde erfolgreich in `main` übernommen (Squash-Commit `d63afbf3cc4eefd447669896db59c6cfb4c89564`). [PR-Actions #41785543300](https://github.com/Lancester/radsportmanager/actions/runs/41785543300) war erfolgreich: **257/257 Tests, 0 Fehler**, inklusive des Sechs-Varianten-Vollrennvergleichs mit jeweils 154 Fahrern. Die neuen Kennzahlen für direkte physische Jagd-Führungswechsel und die längste ununterbrochene persönliche Frontphase sind in die Diagnostik aufgenommen; dies ist **noch keine sportliche Verbesserung der KI**. Der bisherige Default `legacy` bleibt bestehen.

**Weiter offen:** Die neuen Führungs-Kennzahlen tatsächlich über mehrere manuell gestartete Seeds und Strecken auswerten, bevor wir das KI-Verhalten für Ablösung, Rückkehr und ruhige Verfolgung verändern. Der CI-Erfolg ist ein technischer Nachweis, keine professionelle Realitätskalibrierung. R-22 bleibt offen, R-23 ist nicht freigegeben.


## R-22: Separater stabiler Peloton-Regler – Kontrolltest vor Freigabe (04.11.2026)

Nach PR #62 wurde die direkte 1D-Gruppen-/Fahrer-KI geprüft: Der bisherige Nachfahrregler setzt acht Fahrer voraus, lässt Jagdhelfer ohne wirkliche Frontposition hohe Watt anfordern und fällt beim Überschreiten von 42 m auf individuelle Zielwatt zurück. Die grundsätzliche Trennung zwischen 24-m-Windschutz und 42-m-Abstandsdiagnose ist richtig, aber die Rückkehr zur Einzel-KI kann Lochbildung verstärken. In der bestehenden Kraft-/Energiebilanz wurde bei Codeprüfung kein ebenso eindeutiger Integratorfehler gefunden; die dynamische Gegenprobe folgt im Test.

**Feature-Branch** `feature/r22-stabiler-peloton-regler`: zusätzliche, ausschließlich opt-in verwendete Variante `groupRidingModel:'stable-pack'`. Lokale Vordermann-Geschwindigkeit, Kraftwatt für dessen Fahrt, begrenzte Abstandsregelung, physisch arbeitende Jagdhelfer nur vorne; kein automatisches Schließen oder neu erfundener Aero-/Leistungsvorteil. Veraltete Taktik- oder CP/W′-Modelle wurden nicht verändert. Ein fester 30-Fahrer-/600-s-Konstanttempo-Test, Einzelregler- und 30-Fahrer-Vollrenntests sind ergänzt. [Fachnotiz](race/R22_STABILES_PELOTON.md).

**Aktueller Status: Code erstellt; Test-/CI-Abnahme noch offen.** Vor positiver Prüfung keine Aussage über tatsächlich gestiegene Zielgruppenqualität. Standard `legacy` bleibt, R-22 Issue #54 und Issue #42 offen. Nächster Schritt: Testfehler korrigieren, anschließend manuelle A/B-Fälle mit mehreren Seeds/Profilen und Wirkungskennzahlen. R-23 keinesfalls freigeben.


### R-22 stabilisierter Peloton-Versuch: geprüfter Status / **NICHT MERGEN** (04.11.2026)

[PR #63](https://github.com/Lancester/radsportmanager/pull/63) bleibt **Draft**; kein neuer Standard. [GitHub-Regression #41788228190](https://github.com/Lancester/radsportmanager/actions/runs/41788228190) **261/261 Tests bestanden**, inklusive 600-s-/30-Fahrer-Konstanttempo, Energieprüfung und sieben vollständigen 154-Fahrer-Lille-Varianten. Der ursprüngliche Versuch ohne Beschleunigungs-Feedforward war zwar technisch grün, sportlich aber deutlich schlechter (27 Fahrer in größter Zielgruppe, 576 s Rückstand). Nach Einbau der physisch begründeten Beschleunigungsarbeit verbessert sich dieser Wert auf **88 Fahrer**, aber mit **570 s (~9:30 min)** Rückstand, **26 maximalen physischen Abstandsgruppen**, nur **28 Fahrern innerhalb 60 s** und **183 direkten Jagdführerwechseln**. Deshalb **keine Freigabe**, **kein Merge nach main**, solange keine deutlich glaubwürdigeren Vergleichsverteilungen nachgewiesen wurden.

**Exakter nächster Schritt:** Kontrollierte fahrertypen- und profilspezifische Ursache des frühen Hauptfeldzerfalls isolieren (Lead-Pacing/Leistungsgrenze, lokaler Windschutz, R-19, tatsächliche Jagdfront, 1D-Überholen); harte A/B-Gegenproben mit identischen Seeds und echter Energie-/Positionsbilanz. Keine stillen Zeit-/Geschwindigkeitsboni, keine Änderung am Standardmodell ohne neue fachliche Belege; keine automatisierte große Monte-Carlo-Serie. Vollständiger Befund in [R22_STABILES_PELOTON.md](race/R22_STABILES_PELOTON.md).


### Korrektur nach 154-Fahrer-Isolation und A/B-Abnahme – R-22 (04.11.2026)

Die pauschale lokale Mitfahrregelung aus frühen PR-63-Commits ist **verworfen**: der 154er-Isolationstest zeigte ohne Angriffe ein schlechtes Feld. Die geprüfte Endfassung bewahrt die funktionierende reguläre Gruppen-KI für geschützte Mitfahrer und benutzt nur bei physischen Verfolgern/kleinen Gruppen die neue Regelung.

[CI #41789070378](https://github.com/Lancester/radsportmanager/actions/runs/41789070378): **262/262 Tests**, kontrollierte 154er-/20-km-Flachfahrt mit 154 Fahrern in einer Zielgruppe und sieben vollständige Lille-184,9-km-Rennen. Lille/Seed 2026: größte Zielgruppe **86 Fahrer, 15,77 s** Rückstand; **118** Fahrer binnen 60 s statt nur drei in den beiden zuvor genannten A/B-Modellen. Echte Jagdführung **2639 s**, **49** Attacken, max. **16** Gruppen – relevante Restprobleme. Keine Zeit-/Positionsboni, keine Änderungen an CP/W′, R-19, Aero oder Bewegungsintegrator.

**Weiterer Plan:** experimentelle Option getrennt halten, keinen ungeprüften Standardwechsel. Mehrere Seeds/Referenzprofile über den schon vorhandenen ausschließlich manuell startbaren Workflow prüfen, anschließend Angriffstaktik und Gruppen-/Jagdrotation beurteilen. R-22 bleibt offen und R-23 gesperrt. [Einordnung](race/R22_STABILES_PELOTON.md).


### R-22: PR #63 abgeschlossen, Main-Standard unverändert (04.11.2026)

[PR #63](https://github.com/Lancester/radsportmanager/pull/63) mit Squash `8112633bec9e958bd10de70765429809eaa832f6` erfolgreich nach `main` übernommen. [PR-CI #41789684647](https://github.com/Lancester/radsportmanager/actions/runs/41789684647): **262/262 Tests grün**, 7 × 154-Fahrer-Lille-Vergleich, 154er-/20-km-Isolation ohne Attacken, 30er-/600-s-Konstanttempo- und physikalische Energieprüfungen. Keine veränderten CP/W′-, R-19-, Formationsaero- oder Bewegungsintegratorformeln; neuer `stable-pack`-Modus nur explizit aktivierbar, Standard `legacy` unverändert. Lille 184,9 km/Seed 2026: größte Zielgruppe 86 Fahrer/15,77 s Rückstand, 118 innerhalb 60 s; weitere Begrenzungen: 49 Attacken, 16 max. Gruppen, keine Mehrseed-/Mehrprofil-Freigabe.

**Exakter nächster Schritt:** mit dem bereits manuell startbaren R-22-Gruppen-KI-Workflow Mehrseed- und Mehrprofil-Vergleiche (insb. Boulogne, Hautacam) messen; danach Angriffs-/Jagd-Hysterese, energetische Begrenzungen und Zielgruppenrealismus gezielt weiterentwickeln. Nicht automatisch Groß-Monte-Carlo starten, R-23 noch nicht freigeben. [Detailbericht](race/R22_STABILES_PELOTON.md).


## R-22: Neue Priorität vom Nutzer – profilweises kleines Testen statt Vorab-Großvalidierung (04.11.2026)

**Ausdrücklich entschieden:** PR #63/`stable-pack` als Entwicklungsbasis behalten, aber zunächst nur unsere vier **schon vorhandenen** Streckenprofile (Lille/Boulogne/Lüttich/Hautacam) mit **je einem** identischen Seed im normalen GitHub-PR-Testlauf durch den Assistenten vergleichen. Danach konkrete KI-Schwächen anhand tatsächlicher Rennverläufe gezielt beheben, ohne Grundphysik oder `legacy`-Default umzubauen. Die große Mehrseed-/Monte-Carlo-Validierung wird **erst am Ende** der KI-Kalibrierung beschlossen und manuell gestartet.

**Implementierung:** `scripts/r22-profile-smoke.mjs` und `tests/r22-profile-smoke.test.mjs` erzeugen/prüfen vier vollständige Einzelrennen mit je 154 fiktiven Profis und Seed 2026; Ausgabe von Sieger-/Zielgruppen, Angriffen, echten Führungswechseln, W′-/Endurance-/Watt-/Aero-/Gruppen-Indikatoren in GitHub-Actions-Logs. Bestehende Referenzproxies/Kader wiederverwendet, keine neue Strecke oder historische Starterliste. Neu vorgeschlagener großer Matrix-Workflow wurde **aus dem Feature-Branch zurückgenommen** und nicht gestartet.

**Status vor CI:** Code/Dokumente im Feature-Branch; tatsächliche Profilresultate und Testausgang noch offen. **Nächster Schritt:** PR-CI der vier Profile auswerten, konkretes Problem priorisieren, minimale KI-Korrektur separat gegen diese Profile regressionsprüfen. [Verbindliche Details](race/R22_KLEINE_PROFILTESTS.md). R-22 offen, R-23 gesperrt.


## R-22: Vier kleine Etappenprofil-Prüfungen tatsächlich ausgeführt – PR #64 (04.11.2026)

**Nutzerpriorität umgesetzt:** Keine vorgezogene große 36-/60-Rennen-Mehrseed-Matrix. [PR #64](https://github.com/Lancester/radsportmanager/pull/64) wurde mit Squash-Commit `5bf802e978513af94a0456f7e5cb0d7d84be3795` auf `main` integriert. [GitHub Actions #41796481506](https://github.com/Lancester/radsportmanager/actions/runs/41796481506): **264/264 Tests erfolgreich**, inklusive exakt **vier zusätzlicher** vollständiger 154-Fahrer-Rennen, je ein Seed 2026 mit `groupRidingModel:'stable-pack'`. Die bestehende größere, ausschließlich manuelle A/B-Action wurde nicht gestartet; keine neue Teststrecke; der vorgeschlagene 36-/60-Rennen-Workflow wurde aus dem Branch verworfen. `legacy` bleibt Default.

| Profil | Strecke | Sieger-Fahrertyp | Größte Zielgruppe | Deren Rückstand | Innerhalb 60 s | Attacken | Max. Gruppen |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| Flach | Lille, 184,9 km | Allrounder | 86 | 15,77 s | 118 | 49 | 16 |
| Hügelig | Boulogne, 209,1 km | Klassiker | 32 | 63,24 s | 31 | **108** | 17 |
| Klassiker | Lüttich, 252 km | **Sprinter** | 46 | 706,93 s | 21 | 41 | **36** |
| Berg | Hautacam, 180,6 km | **Sprinter** | 12 | 1351,80 s | 17 | 18 | 25 |

**Ebenfalls tatsächlich geprüft – ohne zusätzliche Rennen:** Siegerverläufe bei 25/50/75/90 % und letzten Anstiegen. Der spätere **F093** (Sprinter) hat in Lüttich und Hautacam **keine registrierte eigene Attacke**. In Lüttich liegt er rund bei km 240 auf Rang 6 und gewinnt später (vier Sprinter auf den ersten vier Zielplätzen). Auf Hautacam ist F093 bei km 165 bereits vorne, vor dem 13,5-km-Schlussanstieg ab km ~167,1; er führt auch bei km 170 und 180. In beiden Rennen sind `mainFieldFrontWorkWithAssignedChaserS=0` – *nur* der enge Metrikwert für nominierte Verfolger als tatsächlich führende Fahrer des jeweils größten physischen Feldes, kein Beweis für fehlende allgemeine Tempoarbeit. Die hohen Rückstände und Sieger-/Top-10-Typen sind **sportliche Warnsignale**; die 1-s-Zielgruppen sind Simulationsproxies, keine UCI-Gruppen.

**Nächste konkrete kleine Entwicklung:** Vor jeder Änderung die Ursache aus der bisherigen `stable-pack`-Gruppe/KI und dem Schlüsselsegment rekonstruieren: Können Kletterer/Klassikerfahrer ihre Watt-pro-kg-Vorteile an Steigungen durch echte, begrenzte Positionierung/Attacken umsetzen, oder werden sie durch reine Gruppentempoanpassung passiv gehalten? Falls belegt, eine einzige kleine physikalisch begründete Selektionsregel in der **experimentellen** KI ergänzen; danach wieder genau vier Profiltests und die ruhige 154er-Flachkontrolle. Boulognes 108 Attacken und das Jagdführungsverhalten sind weitere isolierte Kandidaten, **keine sofortige globale Parameteranpassung**. Große Mehrseed-Validierung wie beschlossen erst später und manuell. [Fahrplan und Ergebnisse](race/R22_KLEINE_PROFILTESTS.md), [CI](https://github.com/Lancester/radsportmanager/actions/runs/41796481506). R-22 bleibt offen, R-23 nicht freigegeben.


## R-22: Bergphysik-Gegenprobe vor eigener Kletter-KI – iterativer Schritt (04.11.2026)

Ausgangslage PR #64: Sprinter F093 gewinnt in nur einem Seed 2026 sowohl Lüttich als auch Hautacam ohne eigene Attacke. **Zuerst die Bergphysik unabhängig geprüft, nicht sofort einen Bergfahrer-Bonus programmiert.** [CI #41797896614](https://github.com/Lancester/radsportmanager/actions/runs/41797896614) **268/268 Tests grün**; unabhängige analytische Leistungsgleichung gegen denselben dynamischen `advanceMotionStep` und 13,5-km-/7,8%-Bergfahrt, Aero/Schwerkraft-Bilanz und CP/W′-Grenzen geprüft. Fiktiver Sprinter bei CP 381 W/87,9 kg ca. 17,9 km/h, Kletterer bei CP 354 W/70,9 kg ca. 20,1 km/h, GC bei CP 389 W/71,5 kg ca. 21,6 km/h. **Kein nachweisbarer Grundfehler im Steigungskern; keine Kernänderungen.**

Danach kleiner neuer Modus **nur für `stable-pack`**: `src/engine/race/climb-tempo.ts` erlaubt auf ausreichend langen/steilen Passagen aus physisch berechneter nachhaltiger, auch ohne Windschatten ausreichender eigener Kurbelwatt ein schnelleres Tempo als der Pacesetter. R-19, CP/W′, Windschutz und Bewegung bleiben die bestehenden Begrenzungen.

**Iteration A:** [CI #41798294519](https://github.com/Lancester/radsportmanager/actions/runs/41798294519) **271/271**, Hautacam Kletterer statt Sprinter, aber Lille stark verschlechtert (große Zielgruppe 115/78,34 s Rückstand statt 86/15,77 s) und mehr Feldfragmentierung → **zu breite Kletter-KI verworfen**.

**Iteration B:** [CI #41798829969](https://github.com/Lancester/radsportmanager/actions/runs/41798829969) **271/271**, nur lange ≥3-km-Anstiege: Lille und Boulogne **exakt unverändert**; Hautacam Kletterer mit zwei in der Siegergruppe, jedoch 44 maximale Distanzgruppen statt 25. Lüttich weiterhin Sprintersieg. Diese Fassung ist noch nicht zufriedenstellend.

**Iteration C (gerade in Prüfung):** noch stärker dosiert: nur Anstiege ab 5 km und nur Kletterer mit `role:'kapitaen'`, damit nicht viele Helfer gleichzeitig die Berggruppe auflösen. Einheitliche vier Etappenprofile Seed 2026 und Kurz-Physik-Regressionsgates laufen. Vor Testabschluss **keinen Erfolg behaupten**; weiter vollständige Messung und Entscheidung über Annahme/Verwerfen. [Vollbericht](race/R22_BERGPHYSIK_UND_KLETTER_KI.md). Wie beschlossen kein großes Mehrseedraster bis zur Schlussphase, `legacy` Default unverändert, R-22 offen, R-23 gesperrt.


### R-22: fünf Berg-KI-Iterationen gemessen – Kletterkapitän-Variante C ausgewählt (04.11.2026)

Die Physik wurde **zuerst** gegen eine unabhängige stationäre Bergwatt-Gleichung und den echten Bewegungsintegrator geprüft ([#41797896614](https://github.com/Lancester/radsportmanager/actions/runs/41797896614) 268/268 grün). Die anschließenden **fünf** kleinen KI-Varianten hatten je **271/271 grüne Tests** einschließlich vier vollständiger 154-Fahrer-Einzelrennen, jeweils Seed 2026. Das ist kein Groß-Monte-Carlo. Die Experimente A/B/C/D/E und die Gründe für ihre Annahme/Verwerfung stehen vollständig in [R22_BERGPHYSIK_UND_KLETTER_KI.md](race/R22_BERGPHYSIK_UND_KLETTER_KI.md).

**Endentscheidung für die experimentelle Entwicklungsfassung in [PR #65](https://github.com/Lancester/radsportmanager/pull/65):** Nur an ≥5 km langen Steigungen von ≥5,5 % dürfen Kletterer/GC-Fahrer mit Rolle `kapitaen` mehr als die Gruppenwattanpassung anfordern, wenn sie das ungeschützte reale Gruppentempo mit nachhaltiger eigener Leistung übertreffen können; die Wattanfrage bleibt bei maximal 98 % CP sowie maximal 80 W über dem ungeschützten Haltebedarf. Kein Sonderbonus für Ergebnis, Zeit, Geschwindigkeit, Position oder Energie. Kein Eingriff in `legacy`, Bewegungsintegrator, Windschatten, CP/W′ oder R-19. Die genannte Auswahl C wurde in [CI #41799290398](https://github.com/Lancester/radsportmanager/actions/runs/41799290398) mit 271/271 erfolgreich geprüft; eine identische Schlussprüfung des wiederhergestellten Quellstandes folgt.

**Profilresultate von C (vier × 154 Fahrer, Seed 2026):** Lille 86 größte Zielgruppe / 15,77 s Rückstand, Boulogne 32 / 63,24 s, Lüttich 46 / 706,93 s – **alle drei exakt wie vor der Berg-KI**. Hautacam gewinnt ein Kletterer, Plätze 1–4 sind Kletterer, größte Zielgruppe 4 / 299,09 s, 2 Fahrer innerhalb 60 s, maximal 36 Abstandsgruppen (zuvor 25). Die offene Feldfragmentierung ist weiterhin zu prüfen, kein vollständiger Realismusnachweis.

**Warum D/E nicht übernommen:** Weichere Variante D (96%-CP / +45W) bringt zu viele Nichtkletterer in die Spitzengruppe, E (97%-CP / +60W) erzeugt wieder einen 1.230,74-s-Rückstand der größten Zielgruppe. Daher C bevorzugt – **vorläufig** und nur opt-in.

**Nächster exakter Schritt nach PR #65:** Im selben kleinen Vierprofil-Prozess die gesonderte Klassiker-/Puncheur-Taktik für Lüttich prüfen (bisher Sprinter gewinnt); anschließend separat Boulognes 108 Attacken und die Bergfeld-Zerlegung analysieren. Die große Mehrseed-Kalibrierung bleibt bis zum Ende verschoben. Standard `legacy`, R-22 offen, R-23 gesperrt.


### R-22 Abschluss dieser Bergphysik-/Kletter-KI-Runde auf main (04.11.2026)

**[PR #65](https://github.com/Lancester/radsportmanager/pull/65) ist nach `main` integriert** (Squash `d8ec5cbf5b1eb9f7de62162f2a7ec523a50d0d14`). Die vollständig neu geprüfte finale Quellfassung bestand [GitHub Actions #41800807951](https://github.com/Lancester/radsportmanager/actions/runs/41800807951): **271/271 Tests, 0 Fehler**, inklusive vier existierenden 154-Fahrer-Profilrennen mit Seed 2026, unabhängiger 13,5-km-Bergphysik, CP/W′-/Aero-/Schwerkraft-Bilanz, 154er-Flach-No-Attack- und 30er-Konstanttempo-Regressionsfällen. Keine physikalischen Kernänderungen, kein Default-Wechsel.

**Final gewählte, weiterhin opt-in experimentelle `stable-pack`-Berg-KI:** nur Kletterer/GC-Kapitäne auf Steigungen ab 5,5 % und modellierten ≥5-km-Pässen mit realem ungeschütztem Wattüberschuss; bis 98 % CP / 80 W zusätzliche nachhaltige Leistung gegenüber solo Halten des Fronttempos. **Lille, Boulogne und Lüttich exakt unverändert** gegenüber vor der KI-Korrektur. **Hautacam:** Kletterer Plätze 1–4; größte Zielgruppe 4 Fahrer, 299,09 s Rückstand; max. 36 Distanzgruppen (vorher 25), also noch nicht perfekt. Alle fünf getesteten Abstufungen samt Problemen dokumentiert in [R22_BERGPHYSIK_UND_KLETTER_KI.md](race/R22_BERGPHYSIK_UND_KLETTER_KI.md).

**Nächster konkreter kleiner Schritt (keine vorgezogene große Validierung):** die vorhandene Lüttich-Etappe weiter analysieren; eine eigene KI-Entscheidung für Klassiker-/Puncheurfahrer an kürzeren steilen Anstiegen prüfen, ohne den Langpass-Klettermodus oder Lille/Boulogne zu stören. Danach gesondert 108 Attacken auf Boulogne und physische Berggruppen am Hautacam prüfen. R-22 und Issue #54/#42 bleiben offen; R-23 nicht freigegeben.


## R-22: Benutzerorientiertes Gesamtbild der implementierten Rennfahr-KI und reale Berggruppen (04.11.2026)

**Neues Hauptnachschlagewerk:** [RENNFAHR_KI_GESAMTUEBERSICHT.md](race/RENNFAHR_KI_GESAMTUEBERSICHT.md) dokumentiert die **Codewirklichkeit** (Stand nach PR #65): Entscheidungsrhythmus 10 s, Physik/Abstände pro Sekunde; Individual-, Team-, Jagd-/Relais-, Peloton-, Formations-, `stable-pack`- und Kletterkapitäns-Entscheidungen mit Quellverweisen; tatsächliche Regeln/Schwellwerte; Kombination von Wattanfrage, Ausdauer, CP/W′ und Bewegungsintegrator; experimentelle Modi, offene Annahmen, fehlende 2D-/Managerfähigkeiten und vier geprüfte Referenzrennen Seed 2026.

**Korrektur einer zu strengen bisherigen Erwartung an Bergetappen:** Reale Tour/Vuelta 2025: Hautacam Rang 2 +2:10, Rang 10 +7:26, Rang 20 +11:47; Col de la Loze +1:45/+3:26/+11:20; La Plagne +0:02/+3:54/+6:46; Bola del Mundo +0:11/+1:30/+4:32. Diese **Einzelbeispiele**, nicht statistisch repräsentativ, belegen eine teils enorme Bergselektion. Der echte Hautacam-Rennbericht nennt bereits nur 14 Fahrer in der Favoritengruppe am Col du Soulor. Der aktuelle Simulationswert `maximumGroups=36` ist das **Maximum von 42-m-Abstandsgruppen während irgendeiner Rennsekunde**, nicht die Gruppenzahl am letzten Anstieg oder die Zahl der Zielfahrergruppen. **Nicht** versuchen, pauschal die Anzahl der Berggruppen zu reduzieren. Stattdessen Schlüsselanstieg-Checkpoints und Sieger-/Favoritenabstände mit der echten Etappenlogik vergleichen. Quellen im neuen KI-Nachschlagewerk.

**Priorität nach der Dokumentation:** Kurze steile Klassikeranstiege (insbesondere Liège/La Redoute/Roche-aux-Faucons) mit passender, physisch begrenzter Klassiker-/Puncheur-Entscheidung durch kleine vierprofilige Gegenproben untersuchen. Sprint-Finish nach 250 km in der bisherigen Modellierung ist ein konkretes Warnsignal, aber keine Rechtfertigung für künstliche Klassikersieger. `legacy` Default nicht ändern; keine große Vorab-Monte-Carlo-Serie. R-22/Issue #54 offen, R-23 nicht freigegeben.


## R-22 – objektive Vorab-Favoriten und deren Zielränge als neues Diagnose-Gate (04.11.2026)

**Nutzerwunsch umgesetzt im Testbranch:** Für jede ohnehin durchgeführte der **vier** Referenzetappen `stable-pack`/Seed 2026 werden die nach **vor Rennstart vorhandenen Fähigkeiten** stärksten Kletterer, Klassikerfahrer, Sprinter, Zeitfahrer und Allrounder sowie ihre tatsächlichen Zielränge und Rückstände ausgewiesen. Zusätzlich je Profil die drei physisch stärksten Fahrer des **gesamten** Starterfelds – damit auch über Kategorien hinweg nachvollziehbar ist, ob die objektiven Favoriten vorne liegen. Rangliste nutzt ausschließlich Fahrerwerte; das Endergebnis wird **nur zur Anzeige** zugeordnet, nicht zur Erstellung oder Manipulation der Leistungsrangfolge. Klassenvergleich: 8-%-Bergtempo aus CP/Masse/CdA, 3-Minuten-Power/W′ pro Gesamtgewicht, Sprint-Wattanfrage, Solo-Flachtempo und kombinierter Allroundindex. [Technische Definition](race/R22_FAHRERSTAERKE_FAVORITEN_AUSWERTUNG.md). Noch keine statistische Prognose und kein Ziel, jeden Favoriten zum Sieger zu machen. Bestehender Physikkern und `legacy`-Standard unverändert.

**Nächster Schritt:** CI der vier kleinen Rennen mit den neuen `R22-FAVORITES`-Logs prüfen und konkrete Kandidaten/Ergebnisränge dokumentieren; die bereits fachlich verbesserte Klassiker-KI aus PR #67 getrennt integrieren, sobald deren PR-Merge vollständig bestätigt ist. Anschließend bessere individuelle, W′- und Positions-abhängige Rampenangriffsentscheidungen statt nahezu simultanen zehn Attacken. Kein großes Mehrseed-Raster.


## R-22 – Verifizierter Favoritencheck + Klassiker-KI zusammen auf main (04.11.2026)

**Auf Nutzerwunsch jetzt dauerhaft in jedem Vierprofil-Regressionstest:** objektiver Vorab-Stärkerang der fünf Fahrertypen `sprinter`, `kletterer`, `klassiker`, `zeitfahrer`, `allrounder` mit tatsächlicher Zielplatzierung und Rückstand. Zusätzlich pro Strecke stärkste 3 Fahrer des ganzen Feldes und Vorab-Fähigkeitsrang des tatsächlichen Siegers. Die Fähigkeit wird ausschließlich aus vor dem Start gemeldeten CP, W′, Gewicht, CdA und Sprintspezialisierung ermittelt. **Keine Steuerung der KI, keine Erfolgsboni.** [PR #68](https://github.com/Lancester/radsportmanager/pull/68) zunächst 276/276 grün. Nach kombinierter Integration mit der bereits geprüften Klassiker-KI [PR #69](https://github.com/Lancester/radsportmanager/pull/69), Squash `02ac58185f9f88ed2b109393bf15fd2717968458`, [CI #41811008468](https://github.com/Lancester/radsportmanager/actions/runs/41811008468) **279/279 Tests grün**. [Vollständige Methodik und echte Zahlen](race/R22_FAHRERSTAERKE_FAVORITEN_AUSWERTUNG.md).

**Gemessene stärkste Spezialisten (ein Seed 2026, je 154 Fahrer):** Lille: stärkster Sprinter **F023 auf Platz 150**, +267,50s; Boulogne: stärkster Klassiker **F003 auf Platz 109**, +237,73s; Lüttich: derselbe starke Klassiker-/Helfer **F003 auf Platz 120**, +1019,59s; Hautacam: stärkster Kletterer **F078 auf Platz 1**. Gerade die schlechten Flach-/Klassikerfavoritenränge zeigen eine verbleibende **Taktik-/Rollen-/Positionierungs-Frage**, keinen Beweis für defekte Schwerkraftphysik. Lüttichs Schonung und späte, echte CP/W′-Attacken verbessern den Rennverlauf (52 Attacken und 27 innerhalb einer Minute statt zuvor 41 und 21), obwohl noch ein Sprinter gewinnt. Die alte PR #67 wurde wegen GitHub-Mergeblockade als **in #69 übertragen und ersetzt** geschlossen.

**Neuester weiterer Versuch:** [PR #70](https://github.com/Lancester/radsportmanager/pull/70) testet separat, je Team den nach 3-Minuten-W/kg körperlich stärksten Klassikerfahrer (auch bisheriger Helfer) als geeigneten Rampenangreifer auszuwählen und jeweils nur den aktuell stärksten Kandidaten einer physischen Gruppe starten zu lassen. **GitHub lieferte bislang keinen zugeordneten CI-Lauf für diesen PR; NICHT auf main und NICHT als erfolgreich bewerten.** Bei dessen Prüfung unbedingt vier Profile (nicht mehr Seeds) und `R22-FAVORITES` inklusive F003 betrachten. Danach Lille-Sprinter F023 separat hinsichtlich Gruppendynamik/Sprintzug untersuchen, Boulogne-Attacken (108) später. Große statistische Validierung weiterhin erst zum Schluss, nur manuell. `legacy` bleibt Default, `stable-pack` opt-in; R-22 offen, R-23 gesperrt.


## R-22 – Nutzerfreigabe PR #71 und detaillierte Lille-Analyse abgeschlossen (04.11.2026)

**[PR #71](https://github.com/Lancester/radsportmanager/pull/71)** integriert per Squash `369077b2f5a3a424d2959947b547a58a20a67d51`. [CI #41814392330](https://github.com/Lancester/radsportmanager/actions/runs/41814392330) **281/281 Tests erfolgreich, null Fehler**, einschließlich aller vier vorhandenen 154er-Referenzrennen mit einem Seed 2026 und allen aktuellen `R22-FAVORITES`-Auswertungen. Alter PR #70 (ohne CI) ausdrücklich als durch PR #71 ersetzt geschlossen. Neue Klassiker-KI nominiert bei einem langen rampenreichen Rennen den physisch geeigneten Team-Spezialisten unabhängig von Helfer-/Kapitänsrolle; innerhalb einer echten Gruppe ist neue Spezialattacke nur dem derzeit stärksten Kandidaten gestattet, nur nahe genug zur tatsächlichen Spitze; dauernde Attacke weiter vollständig W′-/R-19-/bewegungsbegrenzt. **Keine Veränderung des physikalischen Kerns, `legacy` Default bleibt, `stable-pack` opt-in.**

**Sportliche Zahlen aus diesem CI:** Lille Allrounder Sieger / 49 Attacken / größte Zielzeitgruppe 86 und +15,77 s; Boulogne Klassiker / 108 Attacken / 32 und +63,24 s; Hautacam Kletterer / 13 Attacken / 4 und +299,09 s – diese drei unverändert. Liège trotz zusätzlicher selektiver Steuerung weiter **Sprinter Sieger**, 68 Attacken (zuvor 52), 45 spezielle Rampenattacken durch 15 Fahrer, größte Zielzeitgruppe 31 und +152,89 s; stärkster Klassiker F003 **Platz 122**. **Softwareabnahme bestanden, aber Klassiker-Selektion sportlich noch nicht gelöst**; keinen Realismuserfolg behaupten.

**Lille-Ursachenanalyse neu direkt in bestehendem Profil-Smoke:** [R22_LILLE_SPRINTER_DIAGNOSE.md](race/R22_LILLE_SPRINTER_DIAGNOSE.md) aus `R22-LILLE-SPRINTER-AUDIT`. Stärkster Sprinter **F023** (Team T04 / `sprint`, CP 407,9 W Basis, 406,66 W Tagesform) endet **Platz 150, +267,50 s**, mit **91,2 % W′** noch vorhanden, Ø 258,63 W; bereits km 5 Rang 150 innerhalb eines noch zusammenhängenden 154er-Feldes, km 100 Rang 126 innerhalb der 136er-Gruppe, **km 120 Rang 126 nur noch in 11er-Abstandsgruppe ~1,275 km hinter Spitze**, km 160 +2,8 km. Sprintteam-Helfer haben zwar um km 41–49 Jagdaufträge, bringen den Zielsprinter aber nicht rechtzeitig in eine vordere Feldposition; Sprintzugplan erst in letzten 10 km hilft dort nicht mehr. **Befund gegen W′-Erschöpfung, für Positions-/Schutz-/Koordinationsproblem der Renn-KI.** Der Sieger F057 hält sich dagegen von Beginn an vorn und startet viele wiederholte Attacken – getrenntes späteres Problem.

**Verbindlicher nächster kleiner Schritt:** noch vor weiteren CP-/Sprintfähigkeitsänderungen die **Sprinterpositionierung in großen Flachfeldern und rechtzeitige Teamunterstützung** als Wattentscheidung untersuchen, ohne Magnet-/Teleport-Positionskorrektur. Vier Profiltests + 154er-No-Attack-20-km-Kontrolltest, Favoritencheck und Lille-Checkpointanalyse. Lüttich später separat weiter an realer Attackenwirkung und taktischer Nominierung optimieren. Keine große Multi-Seed-Vorabvalidierung. R-22/Issues offen, R-23 nicht freigegeben.


## R-22 – Frühe physisch gefahrene Sprinterpositionierung: erster verifizierter Vierprofiltest (04.11.2026)

**Nutzerwunsch „Bitte einarbeiten!“ umgesetzt als eigenständige neue opt-in-Modulregel** `src/engine/race/sprint-positioning.ts` + `race-simulator.ts`, neuer [PR #72](https://github.com/Lancester/radsportmanager/pull/72). Bei langem sprinterfreundlichem Einzelrennen (modelliert mindestens 140 km, höchstens 1.650 m Gesamtanstieg), wenn der geschützte Sprinter eines Sprintteams im großen physischen Feld (≥40) **hinter dem oberen Drittel** fährt und Reserve besitzt, erhält er zusätzliche **reale begrenzte Kurbelwatt** bis 70 W über dem normalen Gruppenwattwert und maximal 104 % Tages-CP. Eine einzelne tatsächlich innerhalb 24 m **hinter dem Sprinter** fahrende Teamhilfe darf maximal +30 W bis zur eigenen CP aufwenden. Nur früh bis 85 % Distanz, keine Konflikte mit Sprint/Attacke/Jagd/Erholung. **Keine künstliche Platzierung, Geschwindigkeit, Energie oder zusätzliche Athletenleistung**; der bestehende Rechenkern setzt das Watt um. `legacy` und nicht sprinterfreundliche Routen sind unverändert.

**Erste technische und sportliche Gegenprobe:** [Actions #41816164406](https://github.com/Lancester/radsportmanager/actions/runs/41816164406) **285/285 grün**, alle bisher üblichen Testfälle inkl. exakt vier Referenzrennen (154 Fahrer, je Seed 2026), kein Mehrseedraster. Lille F023 **Platz 41 / +17,53 s statt 150 / +267,50 s**, km 20 Rang 17 statt 149, km 120 verbundenes Feld **148 Fahrer** statt abgehängter 11er-Gruppe, am Ziel ~87 % W′-Reserve; innerhalb 60 s **146 statt 118** Fahrer, maximale Distanzgruppen **11 statt 16**. Lille-Sieger weiterhin ein **Allrounder** aus Flucht, Favoriten gewinnen nicht automatisch. Boulogne/Liège/Hautacam unverändert im selben Seed. Die *Erstdiagnose* im Hauptbericht [R22_LILLE_SPRINTER_DIAGNOSE.md](race/R22_LILLE_SPRINTER_DIAGNOSE.md) zeigt den früheren Fehler, [neuer R22_FRUEHE_SPRINTERPOSITIONIERUNG.md](race/R22_FRUEHE_SPRINTERPOSITIONIERUNG.md) erklärt nun den getesteten Eingriff und seine Grenzen.

**Aktueller Gate-Stand:** Die erweiterte Ausgabe `sprintPositioningSeconds`/`sprintEscortSeconds` wurde nach dem ersten grünen CI-Lauf dem ohnehin vorhandenen Smoke-Test hinzugefügt. Vor dem Merge noch den daraufhin gültigen vollständigen CI-Lauf und tatsächlich angeforderte Begleiterarbeit prüfen, keine frühzeitige Erfolgsbehauptung zu einer fertigen Sprintzug-Organisation. **Danach** eigene späte Sprintteam-Jagd-/Positionierungs-KI prüfen; Liège-Klassiker- und Boulogne-Attacken-Themen separat. Physik nicht ändern, große Mehrseed-Tests erst zum Abschluss, R-22 offen, R-23 gesperrt.


## R-22: freigegebene dreiphasige Sprinter-KI, Solo-Hinterradwahl und echtes Helfertempo (04.11.2026)

**Nach expliziter Nutzerkorrektur** keine frühe Top-20-Positionierung mehr: Sprinter bleiben zunächst geschützt im Hauptfeld, rücken **erst ab ca. 75 %** Distanz an die Spitze, suchen ab ca. 94 % die günstige Schlussposition. Sprintstärke, **individuelle unabhängige Hinterradfindung** (`wheelFindingSkill` 0..1) und **physisch tatsächlich nahe Helfer** sind getrennte Fähigkeiten/Beobachtungen; ein Sprinter darf ohne eigene Helfer einem wirklichen fremden Hinterrad folgen. Kein pauschales Zufalls-/Siegprozent, kein Phantom-Windschatten. Helfer im letzten 10-km-Finale stimmen ihren Kurbelwattwunsch auf die tatsächliche eigene Position und das Tempo ihres Sprinters ab; keine Positionssprünge.

**Vollständig integriert:** [PR #73](https://github.com/Lancester/radsportmanager/pull/73), Squash `11e02f2f2cbc1be0d247facc55d14f0734e852f2`, [CI #41820155850](https://github.com/Lancester/radsportmanager/actions/runs/41820155850): **295/295 grün**, ebenso zweiter CI-Lauf. Alter PR #72 als ersetzt geschlossen. Lille, fixer Seed 2026/154 fiktive Fahrer: stärkster Sprinter **F023 Platz 5 (+8,18s)** statt ursprünglichem **150 (+267,50s)**; km20 bewusst noch Rang134, km100 Rang110, vor Sprint Rang17 von126 und **3 eigene Helfer tatsächlich innerhalb 30 m vor ihm**. Er besitzt Sprintskill .95, das davon unabhängige Hinterradtalent .976. Die KI verwendete echte Sprintzug-Leistungsanpassung und selbstständige Fremdhinterrad-Anfragen; Klassikerrenn-, Hügel- und Bergetappen-Referenzen blieben im einen Seed unverändert. Lille gewinnt **Klassikerspezialist F036**, also weiterhin kein fertiges Sprint-/Feldjagd-Kalibrierergebnis. **Die drei nahegelegenen Helfer waren vor Sprintauslösung nicht offiziell mit Crew-Mission `sprintzug` gekennzeichnet**: Noch kein vollständiger klassischer Leadout. `stable-pack` weiter opt-in, `legacy` Default, CP/W′-, R-19- und Bewegungskern unverändert, R-22 offen, R-23 weiterhin nicht gestartet.

**Dokumentation und genaue Messzahlen:** [R22_FRUEHE_SPRINTERPOSITIONIERUNG.md](race/R22_FRUEHE_SPRINTERPOSITIONIERUNG.md), neuester Abschnitt 6. **Nächster Schritt:** nur kleine isolierte Iterationen an koordinierter Sprintteam-Schlussführung und Frühflucht-Verfolgung bei echten Rennen; stets `R22-FAVORITES`, 154er No-Attack-Kontrolle, Vierprofil-Seed 2026. Große Multi-Seed-Validierung wie vom Nutzer gewünscht erst zum Ende.

## R-22 – Fortsetzung nach Chatabsturz (04.11.2026)
Verbindlicher nächster kleiner Entwicklungsschritt bleibt PR #74 (experimentell): die physisch tatsächlich kurze Jagdfront trotz längerem Crewauftrag verbessern. Vor dem neuen Versuch war der aktuelle PR-#74-Head `9b4fe6f` in [CI #41839310989](https://github.com/Lancester/radsportmanager/actions/runs/41839310989) **309/309 grün**, Lille aber 203 Führungswechsel, maximal **102 s** ununterbrochene Feldkopf-Jagd und **0** verausgabte Helfer; 116 Fahrer in 60 s. Die nachfolgende isolierte Änderung nominiert genau einen gemeinsamen physisch verfügbaren Jagdführenden über Teams hinweg und lässt andere Jagdhelfer ohne automatische 18-W-Aufrückanforderung im Windschatten mitfahren. **Neue CI und Vergleichsergebnisse stehen noch aus.** Siehe [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 7. PR #75 (Managerwahl 0–5) bleibt gesondert offen; `main` unverändert, `legacy` bleibt Default, keine großen Mehrseed-Läufe. Keine neue Grundsatzentscheidung.

**R-22 ergänzender Messstand (04.11.2026):** [CI #41853813817](https://github.com/Lancester/radsportmanager/actions/runs/41853813817) auf experimentellem PR #74: **309/310**, ein alter Auftragskontinuitäts-Test fehlgeschlagen, daher **keine Freigabe**. Lille zeigte längste reale Jagdfront 102→634 s, Führungswechsel 203→187, 116→122 Fahrer innerhalb 60 s, aber F023 Rang 4→11 und noch 0 ermüdungsbedingte Ablösungen. Die nächste isolierte Codekorrektur erhält die alte Team-Leader-API auch ohne globalen Status und reduziert herabgestufte zweite Team-Leader-Watt zu echten Unterstützungswatt. Ergebnis und CI dieser Korrektur noch offen. Weitere Zahlen: [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 8.

## R-22 – Finales Ergebnis der Chat-Fortsetzung (04.11.2026)
**Finale CI des unveränderten Codeheads [#41854711585](https://github.com/Lancester/radsportmanager/actions/runs/41854711585), Commit `a9b92f5`: 310/310 Tests erfolgreich, 0 Fehler.** Der frühere Alt-Test ist mit unveränderter fachlicher Erwartung wieder grün. Die teamweise Führungsübergabe funktioniert auch ohne den neuen optionalen globalen Status; echte Unterstützer fordern nicht die Watt des alten Teamführenden an. Weiter kein Merge nach `main`.
Lille 184,9 km, 154 fiktive Fahrer, Seed 2026, `stable-pack`: gegenüber dem letzten grünen Stand vor dieser Runde [#41839310989](https://github.com/Lancester/radsportmanager/actions/runs/41839310989):
| Indikator | vorher | jetzt |
|---|---:|---:|
| Längste reale ununterbrochene Hauptfeld-Jagdfront | 102 s | **634 s** |
| Wechsel von tatsächlich an der Hauptfeldspitze fahrenden Verfolgern | 203 | **187** |
| Hauptfeld-Frontsekunden mit zugeordnetem Verfolgungsauftrag | 2.196 s | **2.290 s** |
| Fahrer binnen 60 s der Siegerzeit | 116 | **122** |
| Größte Zielzeitgruppe | 70 | **75** |
| Zeitrückstand der größten Zielgruppe | +30,01 s | **+42,89 s** |
| Vorab stärkster Sprinter F023 | Rang 4 (+0,19 s) | **Rang 11 (+20,42 s)** |
| Siegerfahrertyp | Sprinter F079 | **Kletterer F134** |
| Im letzten Drittel physisch verausgabte und abgelöste Jagdhelfer | 0 | **0** |
| Echte CP-nahe Jagdfrontsekunden (über Fahrer summiert) | 870 s | **739 s** |
Die Ausreißer waren bei km 170 noch ca. **544 m**, bei km 180 ca. **425 m** vor dem Feld. 15–20 Minuten physisch bestätigte Dauerführung sind damit **noch nicht** erreicht, ebenso wenig eine sichtbare Verfolgungsüberlegenheit. WICHTIG: `longestMainFieldChaserStintS` misst den kontinuierlich real am Hauptfeldkopf fahrenden **beauftragten Verfolger mit Verfolgungs-Intent**; dieser alte Diagnoseschlüssel prüft nicht ausdrücklich `crewDuty='fuehrung'` und sagt allein nichts über die fortlaufende Kurbelwatt-Intensität des einen global nominierten Leaders aus. `realFrontChaseCpSeconds` sind kumulierte, nicht kontinuierliche Sekunden. **Nicht** aus 634 s ableiten, ein einzelner global beauftragter Führender habe 634 s mit CP-nahen Watt gefahren!
Die drei anderen Referenzprofile Boulogne, Liège und Hautacam haben sich im einzigen Seed numerisch nicht geändert. Die 154er-No-Attack- und 30er-Konstanttempo-Regressionsprüfungen blieben grün. Software-Gate bestanden, **Sport-/Realismus-Gate nicht bestanden**. Keine Änderung an `legacy`, Teammanager PR #75, Formationsaero, CP/W′, R-19 oder dem Bewegungsintegrator. Große Seed-Statistik weiterhin zurückgestellt.
**Nächster enger Arbeitsschritt vor Merge:** erst zusätzliche *kontinuierliche echte Führungs-Watt- und Positionierungsdiagnose* für den namentlich beauftragten globalen Leader (Dauer in 18 m der physischen Feldspitze und tatsächlich angelegte Leistung) und dessen taktisch begründeten Ablösegrund; dann systematisch prüfen, warum Jäger trotz kontinuierlicher Aufträge nicht lange genug an der echten Spitze sind, warum Sprintzug-Helfer nachlassen und warum die Ausreißer nicht früher eingeholt werden. Nachbesserung nur mit vier kleinen Profilen, No-Attack- und Favoritencheck, keine Physik- oder Default-Änderung.
GitHub-Dokumentation auf dem experimentellen Branch ergänzt; nächster Schritt vor Freigabe: explizit *duty-führenden* Fahrer über wirklich kontinuierliche CP-nahe Feldspitzenarbeit diagnostizieren. PR #74 bleibt offen, PR #75 separat, `main` unverändert. Für diese rein textliche Dokumentationsaktualisierung wird keine neue teure Gesamttestsuite beansprucht.

## R-22 – namentliche Jagdfront und echte 10-s-Ablösung, Teststand 04.11.2026
**Verifizierter Folgeversuch vom 04.11.2026:** Im experimentellen PR #74 wurde der 180-s-Aufrücker-Schutz (sportlich unbrauchbar) auf **50 s für noch nicht vorne fahrende Nachrücker** verkürzt. Zusätzlich dürfen in der späten Sprintteam-Jagd ab 90 % Rennfortschritt **echte kurze Rotationen bereits nach 10 s** stattfinden, wenn beide verfügbaren Jäger tatsächlich innerhalb von 18 m der physisch gemessenen Hauptfeldspitze fahren und der Übernehmende mindestens 2 m real voraus liegt. Kein Phantomwechsel in 80–140 m Entfernung; keine direkte Änderung an Position, Geschwindigkeit oder Energie. Zwei bewusst abwechselnde Fahrer mit eigenen Watt sind eine zulässige alternative Taktik zur langen Einzelführung, aber die KI organisiert den Wechsel bislang **nicht aktiv als eigenes Zweier-Staffelprogramm**.
[Actions #41861080773](https://github.com/Lancester/radsportmanager/actions/runs/41861080773), Codehead `53ac3ef`: **316/316 grün** inkl. neuer Einheitenprüfung `echte zehnsekündige Ablösung` und vier Profil-Smokes mit 154 Fahrern/Seed 2026. Lille: bei km170 Flucht tatsächlich eingeholt (im verworfenen 180-s-Test noch ~410 m Vorsprung), **1 physisch verausgabter Jagdhelfer**, **78 s bewusstes Ausrollen**; echte namentliche Jagdfront insgesamt **1.425 s**, davon längster kontinuierlicher CP-naher Führungsstint **514 s**, mittlere reale Führungswatt ca. **342,78 W**. Lille-Sieger **Sprinter F044**, aber nur **1 Sprinter unter den Top 10**; Siegerzeitgruppe **25 Fahrer mit 8 Sprinterspezialisten**. Größte Zielzeitgruppe **69 Fahrer**, erst **43,21 s** hinter dem Sieger. Der vorsichtige Massensprint-Proxy (mindestens 30 in Siegergruppe plus mindestens 2 Sprinter Top 10) bleibt daher **false**; **F023 Platz 20 (+1,17 s)**. Andere drei Referenzprofile unverändert.
**Grenze:** Ein einzelner Seed ist weder eine aussagekräftige Massensprint-Wahrscheinlichkeit noch die sportliche Kalibrierung des Modells. In Lille wurde keine komplette bewusst gesteuerte Zehnsekunden-Zweierstaffel beobachtet; der neue Regressionstest belegt nur, dass eine schon physisch vollzogene Kurzrotation korrekt erkannt und nicht blockiert wird. Später müssen dynamische Zweier-Führungsorganisation, Erholung im Windschatten und Sprinter im finalen vorderen Feld systematisch geprüft werden, ohne Ergebnisse künstlich auf Sprintersiege zu trimmen. `main`, Default-`legacy`, Formations-Aero, CP/W′, R-19 und PR #75 unverändert; **R-22 sportlich offen, keine Merge-Freigabe**.
Detailbericht [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 14.

## R-22 – individualisierter Sprintbeginn, Sprintspitzenleistung und -dauer (04.11.2026)
**R-22 experimenteller individueller Endspurt (04.11.2026), nur PR #74:** Bisher gab es auf allen Etappen einen pauschalen Antritt erst bei 250 m mit `CP + 180 W + 210 W × sprintSkill` – weder individuelle Startdistanz noch angemessene kurzzeitige Sprintwatt. CP/W′ und R-19 waren bereits physisch modelliert und bleiben unverändert. Die neue `src/engine/race/final-sprint.ts` berechnet für jeden real im Rennfeld fahrenden Sprinterspezialisten aus **individueller Früh-/Spätstartneigung `sprintLaunchPreference`**, tatsächlich geschütztem Hinterrad, Position und Distanz zur Front seiner aktuellen physischen Gruppe, eigenem vs. Gruppenfronttempo, Gegenwind und W′-Reserve, **ob genau jetzt der Sprint ausgelöst werden soll**. Die KI entscheidet pro tatsächlich gefahrenem Zeitschritt und merkt sich den einmaligen Start; es gibt **KEIN gemeinsames 400-m- oder 250-m-Startsignal**. Danach fordert sie individuelle anfangs hohe, zeitlich abfallende Kurbelwatt an: optionale unabhängige Fahrerwerte **`sprintPeakPowerW` und `sprintDecayTimeS`**, in der fiktiven Referenzfahrt gestreut, aber **noch nicht kalibriert**. Alle Watt laufen wie bisher erst durch R-19, den echten CP/W′-Verbrauch und `advanceMotionStep`; keine hinzugefügte Geschwindigkeit, Position oder physikalische Sonderenergie. Die alte automatische 250-m-Auslösung wird ausschließlich für die davon erfassten Sprinterspezialisten des experimentellen langen flachen `stable-pack` unterdrückt, damit echte Spätstarter nicht doch unbeabsichtigt vorzeitig sprinten. Auf Boulogne, Liège, Hautacam, `legacy` und anderen Modellen gilt weiterhin der unveränderte alte Pfad.
**Teststatus:** Neue isolierte Unit-Tests prüfen unterschiedliche Früh-/Spät-Antritte, variierende Wind-/Gruppensituationen, maximale anliegende und abfallende Wattleistung, getrennte Dauer, echten W′-Verbrauch und das Entfernen der pauschalen 250-m-Automatik nur im Opt-in-Modus. Der Vierprofiltest 154 Fahrer/Seed 2026 und vollständiger Regressionstest wurden nach Code-Commit `a9f6bd0` angestoßen: [GitHub Actions #41864359250](https://github.com/Lancester/radsportmanager/actions/runs/41864359250) – **noch in Warteschlange; daher KEINE behaupteten Siege, Top10-Quoten, Massenprints oder grüne Gesamtvalidierung für diese Version**. Ergebnis erst nach realem Test protokollieren. Letzter bestätigter Vorher-Wert: [#41861080773](https://github.com/Lancester/radsportmanager/actions/runs/41861080773) 316/316, Lille 1 Sprinter in Top10, 25 Fahrer Siegerzeitgruppe, F023 Rang20. R-22 bleibt sportlich offen; **PR #74 nicht mergen**, getrennte Manager-PR #75 und `main` unverändert.
Nächste Freigabebedingung: separat prüfen, ob auf Lille unterschiedliche tatsächliche Startdistanzen und echte Sprintwatt protokolliert sind, wie viele **Sprinter in den Top 10** und in der Siegergruppe ankommen, ob der konservative Massenprint-Proxy erfüllt ist; daneben **Boulogne/Liège/Hautacam numerisch unverändert**, No-Attack/30er/Favoriten unverletzt. Ohne grüne Läufe keine Sportabnahme.

## R-22 – individuelles Sprintfinale, erstes integriertes Testergebnis (04.11.2026)
**Neuer realer CI-Lauf der individuellen Final-Sprint-KI:** [Actions #41864359250](https://github.com/Lancester/radsportmanager/actions/runs/41864359250) mit **321/322 bestandenen Tests**. Ein neuer, fachlich inkonsistenter Unit-Testfall nutzte `groupSize=1` bei `rankInGroup=14`; die KI lehnte das korrekt mit `RangeError` ab. Testdaten auf `rankInGroup=1` korrigiert, Codefix `f678a9d`; [vollständiger Wiederholungslauf #41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) bei Dokumentationsstand **noch queued**, also **noch nicht grün**.
Die bereits vollständig ausgeführten 4 Rennprofile (154 Fahrer, Seed 2026) zeigen für Lille **8 Sprinterspezialisten in Top 10**, Sieger **Sprinter F009**, zuvor bester Sprintfavorit **F023 Platz 2 (+0,19 s)** statt Platz 20; **22 individuelle Sprintstarts**, Top-10-Sprinter z.B. bei 192,4/232,4/266,6/318,2/351,5 m, tatsächlich anliegende Spitzenwatt der Top-10-Sprinter ca. 1.239–1.381 W. **24 Fahrer in Siegerzeitgruppe**, darum vorläufiger konservativer Proxy `massSprintProxy=false` trotz 8 Sprintern in den Top 10; die 30er-Schwelle bedarf fachlicher Überprüfung, ohne sie nachträglich für diesen Lauf zu verschieben. **Boulogne, Liège und Hautacam unverändert**, jeweils 0 individuelle Sprintstarts. Ein positiver Sportbefund aus einem Seed ist **keine Wahrscheinlichkeit oder Gesamtfreigabe**. Keine Änderung am Bewegungskern, CP/W′, R-19, an `main`, `legacy` oder separatem PR #75; PR #74 weiterhin nicht mergen.

## Abschluss Sprintfinale-Teilfunktion – noch keine R-22-Gesamtfreigabe (04.11.2026)
**Verifizierter Abschluss des isolierten Sprint-KI-Arbeitsschritts (04.11.2026):** [Actions #41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) **322/322 Tests erfolgreich, 0 Fehler**. Code-Commit `f678a9d` korrigierte ausschließlich den unmöglichen Testzustand (Einzelgruppe, Rang 14 → Rang 1); kein Eingriff in das Sprintmodell. Lille (154 Fahrer, Seed 2026): **22 reale individuelle Sprintantritte**, **8 Sprinterspezialisten Top 10**, Sieger F009 (Sprinter), stärkster F023 **2. Platz +0,19 s** (vorher Platz 20), **24 Fahrer Siegerzeitgruppe**. Top10-Sprintstarts unterschiedlich, z.B. 192/232/267/286/318/352 m, reale Spitzenwatt ca. 1.239–1.381 W. Boulogne, Liège, Hautacam numerisch unverändert und jeweils 0 individuelle Sprintstarts. **Das isolierte Feature ist technisch abgeschlossen**, `main` nicht verändert. **Gesamt-R-22 sportlich offen**, weil der konservative `massSprintProxy=false` wegen 24 statt mindestens 30 Fahrern in der Siegerzeitgruppe bleibt (nicht nachträglich am erfolgreichen Ergebnis ausrichten); Liège hat weiterhin 6 Sprinter in Top10 und bedarf eigener Klassiker-KI-Optimierung. PR #74 offen und *nicht* mergen; PR #75 separat. Ein einzelner Seed ist keine Massensprint-Häufigkeitskalibrierung.

## R-22 – erste Klassiker-Auswahl und frühzeitige Rampenpositionierung (04.11.2026)
**Klassiker-KI, erster experimenteller Vierprofil-Erfolg (04.11.2026):** Getrennte [Entwurfs-PR #76](https://github.com/Lancester/radsportmanager/pull/76), Code c57e01d + Testaudit 815f16c, basiert auf dem noch offenen PR #74, **nicht auf main gemergt**. Neu ist src/engine/race/classics-racecraft.ts: (1) vor den späten Schlüsselrampen physisch mit eigener CP-naher Antriebsarbeit in DER ECHTEN Abstandsgruppe aufrücken, statt Klassikerspezialisten als weit zurückliegende Helfer zu belassen; (2) an ausgewählten steilen Schlussrampen EINEN nach aktueller körperlicher Stärke geeigneten vorderen Klassikerfahrer pro physischer Gruppe moderat oberhalb CP länger Tempo machen lassen. Beide Entscheidungen sind reine begrenzte Wattanfragen; jeder Fahrer bleibt an W′, R-19, Masse/Steigung/Aero, realem Abstand und Bewegungskern gebunden. Die alte selektive einzelne 180-s-Attacke bleibt erhalten, falls sportlich gerechtfertigt; kein Klassikersieg/Positionssprung/Siegbonus programmiert. Regel gilt nur für lange rampenreiche Klassiker im experimentellen stable-pack; **legacy-Standard sowie Sprint-/Bergmodelle unangetastet**.
**Bestätigte CI [#41870445572](https://github.com/Lancester/radsportmanager/actions/runs/41870445572), 324/324 Tests grün, 0 Fehler**, darunter 154-Fahrer-Lille/Boulogne/Liège/Hautacam mit genau Seed 2026, 30er und No-Attack-Regression. Gegenüber verifizierter vorheriger Basis [#41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) bleiben Lille, Boulogne und Hautacam in **allen bisherigen Ergebnisfeldern** exakt unverändert (neue Diagnosefelder und Laufzeit ausgenommen). Liège: zuvor 6 Sprinter unter Top 10, Sprinter F114 Sieger, stärkster Klassiker F003 Rang 122, drittstärkster Klassiker F049 Rang 107, 24 Fahrer Siegerzeitgruppe → **0 Sprinter Top10**, Sieger Klassikerspezialist **F057**, **F003 Rang 2 (+0,73 s), F049 Rang 3 (+0,78 s)**, **3 Fahrer in Siegerzeitgruppe**. Tatsächlich angefordert: **5.878 Fahrer-Sekunden Positionsarbeit**, **487 Fahrer-Sekunden selektives Rampentempo** von F003 und F049; separate klassische Rampenattacken 45→39, alle energetisch/physikalisch begrenzt. Der mediane Zielrückstand in Liège wächst allerdings von **265,01 s auf 667,12 s** – fachlich noch zu bewerten, nicht als vollständig kalibrierten Realismus ausgeben. **Ein Seed ist kein Beleg realistischer Siegwahrscheinlichkeiten**; PR #76 als Draft, keine Mergefreigabe. Bestehende R-22-Feldjagd/Sprint-KI in PR #74 und Manager-Helferwahl in PR #75 bleiben eigenständige offene Arbeiten.

## R-22 – Abschluss der Klassiker-KI-Funktion und bewusste Verwerfung kontraproduktiver Varianten (04.11.2026)
**Abschluss des isolierten R-22-Klassiker-KI-Entwicklungsschritts (04.11.2026):** Fachlicher Zielstand ist die ursprüngliche realitätsnähere Selektion aus PR #76 (Codebasis `815f16c`, abschließender Code-Commit `18fe59f`). **Verifizierter finaler vollständiger Testlauf [GitHub Actions #41875836222](https://github.com/Lancester/radsportmanager/actions/runs/41875836222): 324/324 erfolgreich, 0 Fehler**, einschließlich vier Referenzrennen mit je 154 fiktiven Fahrern/Seed 2026 sowie bisheriger No-Attack-, 30er-, CP/W′- und R-19-Regressionen. Liège: Klassiker F057 Sieger; Top10 **7 Klassiker, 2 Zeitfahrer, 1 Allrounder, 0 Sprinter**, stärkster Klassiker F003 **Platz 2 (+0,73s)**, drittstärkster F049 **Platz 3 (+0,78s)**, Siegerzeitgruppe 3, 5.878 Fahrer-Sekunden zusätzlichen Positionswatt-Wunsches und 487 Fahrer-Sekunden gezieltem Rampentempo-Watt-Wunsch. Lille, Boulogne und Hautacam **in allen bisherigen Ergebniskennzahlen unverändert**; `legacy`-Default sowie Physikkern, Formationsaerodynamik, W′, R-19, Bewegung und eigener PR #75 unverändert. Keine Gewinner-/Watt-/Zeit-/Positionsboni. Der Medianrückstand von 667,12 s (+11:07) und frühe Rückstände des hinteren Feldes (Rang 77 bereits etwa 1,0 km bei km190, 3,85 km bei km215) sind ausdrücklich ein offener *R-22-Gesamtkalibrierungsbefund*, kein Beweis umfassend realistischen Feldverhaltens. Originalimplementierung mit gemessenen Gruppenpositionen und W′-abhängigen echten Taktik-Wattwünschen wurde nach Gegenversuchen bewusst **beibehalten**: Eine pauschale +40-W-Regel allein lieferte 24.867 statt 5.878 nominierte Fahrer-Sekunden Aufrückarbeit und zehn Klassikerspezialisten unter zehn; die anschließende fahrertypübergreifende Nominierung ließ den stärksten klassiker F003 wieder auf Platz 119–124 zurückfallen. Diese Varianten wurden verworfen, nicht auf main gebracht. **Isolierte Klassiker-Funktion technisch abgeschlossen und zur Begutachtung bereit; PR #76 baut noch auf PR #74 auf und wird nicht nach main gemergt.** Spätere Mehrseed-/Feldgruppen-Häufigkeitskalibrierung gehört zur R-22-Gesamtabnahme, nicht zu einem künstlich auf Klassikersieger getrimmten Feature. Details in [R22_KLASSIKER_KI_ABNAHME.md](race/R22_KLASSIKER_KI_ABNAHME.md).

## R-22: Eingrenzung und Reparatur der späten Sprintteam-Feldteilung (04.11.2026)
**R-22 PR #74, gezielte Reparatur des Zielsprintfeldes (04.11.2026):** Der zunächst offene vermeintliche Jagdfehler ließ sich durch **reale Checkpoints** genauer eingrenzen: Die Feldjagd hatte die Ausreißer bei km 170 schon eingeholt, aber in der letzten Anfahrt hatte die bisherige Sprintpositionierung `leadoutFrontShare=.10` mehrere Sprintteams gleichzeitig aus einem 120er-Hauptfeld nach vorne beschleunigt: Bei km 180 waren nur **25 Fahrer in der ersten** und **90 Fahrer in der größten physischen Gruppe**. Die konservative Zielgruppen-Heuristik `massSprintProxy` blieb mit 24 Fahrern in der Siegerzeitgruppe unter dem Schwellenwert 30. **Nicht die erfolgreiche Jagd künstlich verschärfen.**
**Gezielte KI-Änderung:** In `src/engine/race/sprint-positioning.ts` reicht den Sprintteams ab 94 % Streckenfortschritt jetzt das **vordere Fünftel** (`leadoutFrontShare=.20`) statt das erste Zehntel, bevor sie zusätzliche Positionierungswatt anfordern. Ein guter Fahrer darf natürlich aus eigener Leistung die Spitze und den Sprint gewinnen; die Regel nimmt nur unnötige Extra-Watt bei ohnehin bereits guter Position zurück. Kein Positions-, Gruppen-, Zeit-, CP/W′-, R-19- oder Aero-Eingriff; vor 94 % bleibt alles unverändert. Ergänzend `R22-LILLE-FINALE-FIELD` erfasst beim bereits vorhandenen Vierprofil-Smoke die reale Feldgruppe bei km 165/170/175/180; der neue Szenarioregressionstest verlangt im einmaligen Lille-Seed 2026 mindestens 80 Fahrer in der ersten zusammenhängenden Gruppe 5 km vor dem Ziel (keine allgemeine Massenprintquote).
**Vollständiger erster CI [#41881059600](https://github.com/Lancester/radsportmanager/actions/runs/41881059600) auf Codecommit `248e8dd`: 322/322 Tests grün**, vier Profile (154 Fahrer, jeweils Seed 2026), 30er und No-Attack-Gates. Lille: **erste physische Gruppe bei km 180 = 115 statt 25 Fahrer**, größte physische Gruppe ebenfalls 115; 5 km vorher bei km 175 120 Fahrer zusammen. Sieger Sprinter F149 statt F009, **8 Sprinter Top10 unverändert**, Siegerzeitgruppe **26 statt 24 Fahrer**, größte Zielzeitgruppe 71 Fahrer bei **+20,73 s statt +43,64 s**; 119 statt 117 Fahrer binnen +60 s. **Jagdwerte unverändert und weiter belegt:** 2 Fluchten eingeholt, 1.425 s namentlich gemessene CP-nahe Feldkopf-Jagd, längster kontinuierlicher Führungsblock 514 s, 1 Helfer nach 984 s Frontarbeit bewusst zurückgefallen, 22 individuelle Sprintantritte. **Boulogne, Liège, Hautacam exakt unverändert**. Der neue reine Test-/Dokumentationsstand nach `248e8dd` war zum Zeitpunkt dieser Notiz noch nicht separat CI-verifiziert.
**Grenze:** Der konservative **30er-Siegerzeitgruppen-Proxy bleibt `false`**. Keine Schwellenabsenkung, um Testerfolg vorzutäuschen; aus diesem einen Seed keine allgemeine Wahrscheinlichkeit für Massensprints ableiten. Die konkrete Fehlselektion vor den letzten 5 km ist aber sportlich und physikalisch messbar deutlich verbessert. **PR #74 weiterhin offen und ungemergt; PR #75 getrennt, PR #76 als abhängiger Klassiker-PR, `main` unverändert**. Vor eventueller Integration den vollständigen CI-Lauf des neuesten Test-/Dokumentationsstands prüfen und auf echte Feldgruppen/Sprint-KI achten.
