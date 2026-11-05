Warning: truncated output (original token count: 49379)
Total output lines: 1787

# Entwicklungsstand

## Großer Rennvergleich läuft

[Testaufbau und Zwischenstand](race/R24_GROSSVERGLEICH_ARBEITSSTAND.md): GitHub-Stände fixiert, gepaarter Pilot auf beiden Versionen erfolgreich; 160 Mehrseed-Läufe und die Auswertung sind offen. Ergebnisse nicht vorwegnehmen.

## Profirennen als Vergleichsbasis

[Profirennen-Datenbasis](race/R24_PROFIRENNEN_DATENBASIS.md): zehn ausgewählte Rennen und Etappen aus 2024/2025 mit Ergebnissen, Rennkontext, Quellen und Vergleichsgrenzen. Die Auswahl dient der Diskussion und ist keine statistische Validierung oder Zielvorgabe. Der große Simulationsvergleich wurde noch nicht gestartet; Profilumfang, Seeds und Auswertung sind vorab gemeinsam festzulegen.

## Zukunftsidee: Erholung zwischen Etappen

[Erholung bei Etappenrennen und Manager-Idee](race/ETAPPENRENNEN_REGENERATION_MANAGER_IDEE.md) hält fest, was bereits existiert und was für mehrtägige Ermüdung, Zustandsübergabe, individuelle Tageserholung sowie mögliche Managerentscheidungen zu Betreuung und Schlafmaterial noch offen ist. Keine Umsetzung oder zugesicherte Wirkung; die geplante Diskussion über den Einzelrennen-Vergleich bleibt der nächste Schritt.

## Erste individuelle Ermüdungskalibrierung – in Prüfung

[Erste Ermüdungskalibrierung](race/R24_ERSTE_ERMUEDUNGSKALIBRIERUNG.md): unabhängige optionale Fahrerfaktoren für Langzeit-Ermüdungsresistenz und W′-Erholung, erste explizite Heuristik und reproduzierbare Belastungsszenarien. Historische Vergleichsmodelle bleiben unverändert; Talent-/Trainings- und Karrierefunktionen sind noch nicht implementiert. 16 gezielte Tests, der vollständige Lauf mit 374/374 und Browser-Build bestanden; ein anschließend ergänzter Renn-Integrationstest zur W′-Erholung bestand ebenfalls. Ein einzelner Vier-Profil-Vorher-Nachher-Lauf ist dokumentiert; beim Hügelrennen gewann ein Zeitfahrer nach einer Attacke. Der GitHub-PR-Test #302 lief beim letzten Abruf noch. Parameter und sportlicher Realismus bleiben unvalidiert; der größere `main`-Vergleich ist als eigener nächster Schritt vorgesehen.

## Schritt 4 – Belastung und Ermüdung, Zwischenstand

[Schritt 4: Belastung und Ermüdungsmodell](race/R24_SCHRITT4_BELASTUNG_UND_ERMUEDUNG.md): CP/W′-Kern beibehalten, Langzeitermüdung und W′-Erholung vor sportlicher Realismusfreigabe gezielt weiterentwickeln und empirisch prüfen. Der abrupte Freigabesprung nach 90 min wurde im experimentellen stable-pack durch eine ausdrücklich vorläufige kontinuierliche Einblendung ersetzt; historische Vergleichsmodi bleiben unverändert. Attacken, Jagdarbeit und Modellfälle wurden untersucht; Kausalität einzelner Einholungen und physiologische Kalibrierung bleiben offen. Die gepaarten Vier-Profil-Vergleiche für drei Seeds und der vollständige lokale Testlauf sind abgeschlossen: 371/371 Tests und Browser-Build bestanden; der GitHub-PR-Lauf #299 lief beim letzten Abruf noch. Nicht als physiologische Realismusfreigabe interpretieren.

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

**Nächster konk…31379 tokens truncated…suchen, pauschal die Anzahl der Berggruppen zu reduzieren. Stattdessen Schlüsselanstieg-Checkpoints und Sieger-/Favoritenabstände mit der echten Etappenlogik vergleichen. Quellen im neuen KI-Nachschlagewerk.

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
