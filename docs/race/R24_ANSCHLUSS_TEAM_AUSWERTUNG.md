# R-24: Anschlussversuche, Teamaufträge und F078

Stand 05.11.2026. Experiment auf eigenem Branch experiment/r24-anschluss-teamauftrag, aus experiment/r24-angriffsmotivation. Keine Änderung an main oder feature/r24-rennki-audit. Entscheidung über Übernahme ausdrücklich offen.

## Untersuchung F078, Hautacam/profile, Seed 777

Im ursprünglichen Entwicklungsstand 1945e2d6: Rang 21; mit erster Motivationsfassung Rang 66. Input-Hashes für Strecke, Teams, Fahrer und Seed sind gleich. Unterschiedlicher Programmstand verändert aber den Rennverlauf, so dass einzelne Ursachen nicht aus dem Rangvergleich folgen.

Im ersten Motivationsexperiment beginnt F078 bei eigenem km 72,45 eine 60-s-Attacke „gruppe_erreichen“, aus einer Fünfergruppe, rund 454 m hinter der damals aktiven Rennspitze. Die Angriffstelemetrie erfasst 5,65 kJ oberhalb effektiver CP während dieser 60 Sekunden. Fünf eigene Kilometer später ist er rund 1.079 m hinter der aktiven Spitze und hat noch 6 % W′; die bis dahin verbrauchte Reserve ist nicht ausschließlich dem 60-s-Angriff zuzurechnen. Der Abstand zur Rennspitze ist nicht identisch mit dem Abstand zur angepeilten nächsten Gruppe.

Erste Ergänzung: Entfernung UND stationär geschätzte Geschwindigkeit/Energie zur konkreten nächsten Gruppe sowie Vorrang für zugewiesene Mannschaftsarbeit. Ergebnis: Das kontrollierte Rennen blieb in Klassifikation, Events und Checkpoints identisch (Rang 66). Keine behauptete Verbesserung.

Die einmalige Instrumentierung des Moments t=5770 s ergab: nächste Gruppe ca. 281 m vor F078, momentane Geschwindigkeit des hintersten Zielfahrers ca. 8,98 m/s; lokale Steigung ca. 2,73 %. Die erste Schätzung errechnete mit einem 180-s-Leistungsbudget ca. 2,27 m/s relativen Geschwindigkeitsvorteil und ließ den Versuch zu. Das sind idealisierte stationäre Momentanwerte. 281/2,27 ergibt etwa 124 s bei konstanten Bedingungen; die tatsächliche Angriffsabsicht dauerte jedoch 60 s. Unterschiedlicher Zeitpunkt der tatsächlichen Belastung, Beschleunigung und Verhalten der Zielgruppe sind zu beachten.

Zweite Ergänzung: 60 s Prognosehorizont und maximal 35 % der aktuell verfügbaren W′ als rechnerisches Zusatzbudget (zusätzlich CP-Limit), angepasst an die Attackendauer. Das ist eine vorläufige konservative Heuristik und kein physiologisch validierter Parameter. Das konkrete Ereignis bei km 72,45 trat danach nicht mehr auf; F078 beendete den Lauf auf Rang 23. Da nach Regeländerung auch andere Aktionen und Gruppensituationen abweichen, ist dies kein isolierter Kausalnachweis, dass dieser eine Angriff Rang 66 verursachte.

## Implementierung und Einschränkungen

Die Anschlussbewertung verwendet Abstand zum tatsächlichen hintersten Mitglied der nächsten Gruppe, dessen momentane Geschwindigkeit, lokale Steigung, Wind, Fahrrad-/Fahrermasse, CdA, geschätzte verfügbare CP und W′. Das Geschwindigkeitsergebnis kommt aus einer stationären Widerstandsgleichung; es verändert keine physischen Zustände. Sie berücksichtigt nicht dynamische Beschleunigung, künftiges Gelände, Reaktion der Zielgruppe, Helfer, Windschatten oder ein längeres, gesteuertes Nachführmanöver. Bergab (<−3 %) wird die Schätzung nicht verwendet, da Bremsung und Fahrtechnik fehlen. Die Formel ist daher eine vorläufige Vorauswahl, keine belegte Anschlusswahrscheinlichkeit. Das Zeitbudget kann mehrminütige erfolgreiche Jagden unberechtigt ausschließen.

Ein Helfer mit konkretem aktuellen Auftrag von planned.orders (jagd, schutz, sprintzug) startet keinen neuen eigenmächtigen Angriff. Bereits laufende Angriffe werden von der bestehenden Fortsetzungslogik behandelt. Ein gewünschter taktischer Rollenwechsel ist bisher nicht gesondert umgesetzt und darf nicht als erledigt gelten.

## Acht Vergleichsläufe, je zwei Seeds pro Profil

Referenz: Entwicklungsstand 1945e2d6, nicht main. Ausprobierter Stand enthält zugleich Angriffsmotivation, Anpassung der Anschlussprognose UND Schutz für Teamaufträge. Alle acht gemeinsamen Eingabehashes und Fahrerhashes stimmen. Kein isolierter Wirkungsnachweis einzelner Regeln. Größte 1-s-Zielgruppe muss nicht die Siegergruppe sein.

| Profil | Seed | Angriffe Referenz → Experiment | größte 1-s-Zielgruppe | Sieger Referenz → Experiment |
|---|---:|---:|---:|---|
| Hautacam | 42 | 49 → 27 | 5 → 9 | F036 → F134 |
| Hautacam | 777 | 53 → 38 | 14 → 13 | F134 → F134 |
| Lille | 42 | 19 → 11 | 98 → 106 | F009 → F023 |
| Lille | 777 | 19 → 12 | 138 → 110 | F085 → F106 |
| Boulogne | 42 | 46 → 27 | 20 → 15 | F015 → F148 |
| Boulogne | 777 | 42 → 19 | 14 → 28 | F134 → F106 |
| Lüttich | 42 | 62 → 18 | 31 → 43 | F134 → F134 |
| Lüttich | 777 | 55 → 18 | 13 → 18 | F092 → F092 |

Der stärkste Sprintproxy F023 wurde in Lille bei Seed 42 Zweiter → Erster und bei 777 Zweiter → Siebter; in letzterem gewinnt der als Klassikerfahrer gekennzeichnete F106 eine 10-köpfige 1-s-Siegergruppe, größte 1-s-Zielgruppe 110. Dies erfordert Rennverlaufskontrolle; die Kategorie allein macht das Ergebnis nicht unmöglich. In Hautacam 777 Rang F078 21 → 23 gegenüber dem älteren Entwicklungsstand und 66 → 23 gegenüber der ersten Motivationsfassung.

Im Experiment wurden bei Hautacam 42, Lille 42 und Boulogne 42 keine Angriffe mit dem Ziel gruppe_erreichen protokolliert. Das ist ein mögliches Zeichen überstrenger Filterung, kein Fehlerbeweis. Ein nach neuer Heuristik ausgeschlossener Versuch kann in Wirklichkeit mit längerer Nachführarbeit, Gruppe oder veränderlichem Gelände dennoch erfolgreich sein. Bei acht Läufen sind keine sportlichen Häufigkeiten oder stabilen Ergebnisse belegt.

[Vergleichskennzahlen](r24-grossvergleich-daten/anschluss-teamauftrag-vergleich.json) und [Rennauszüge](r24-grossvergleich-daten/anschluss-teamauftrag-rennauszuege.json) enthalten Zieldaten, Angriffe, Ziele, Angriffsspuren, Zielgruppen und ausgewählte Berg-Checkpoints; sie sind keine vollständigen Rohdaten. Die Vorversuche sind im Branch experiment/r24-angriffsmotivation dokumentiert. Diagnosewerkzeug aus 8923aa7e51edfd640843bfc0b4811f8988b61929.

## Tests und Fortsetzung

28 gezielte Tests für Motivationsauswahl, physische Anschlussannahmen, Attackentelemetrie, Verfolgung, Team-/Kapitänsarbeit und Sprintübergabe bestanden. Acht vollständige, paarweise verglichene Simulationen wurden nach mechanischer Energiebilanz und Eingabehash geprüft. Die gesamte Testsuite wurde für diese letzte Fassung nicht erneut durchgeführt; der frühere 378/378-Wert gilt für die Vorversion.

Nächste Priorität: Anschlusspotenzial und die F078-Entscheidung mit gezielter Telemetrie (Zielgruppe, Lücke, Zieltempo, Prognose, späteres tatsächliches Ergebnis) instrumentieren und gegen ausgewählte echte Anschlussverläufe testen. Anschließend restriktive Schätzungen, Helferrollen und Flachfinale untersuchen; breitere Mehrseed-Prüfung auf allen vier Profilen. Keine Freigabe aus den bisherigen Läufen.
