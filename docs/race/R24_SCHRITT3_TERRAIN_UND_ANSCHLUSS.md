# R-24 Schritt 3: Gelände-Kontrollversuche und Anschlussversuche

05.11.2026, Entwicklung auf `feature/r24-rennki-audit`. Die Messungen sind synthetische Gegenproben, keine Kalibrierung auf eine gewünschte Gruppengröße. Die Situation im vorherigen Stand und alle nicht übernommenen Experimente stehen in [Schritt 3](R24_SCHRITT3_GRUPPEN_UND_SPRINTER.md).

## Kontrollierte Geländeversuche

30-km-Strecken, dasselbe fiktive 154er-Bergfeld, Seed 2026, Wind und technische Abfahrtsbeschränkungen null, Attacken ausgeschaltet, alle Teams `ausgewogen`, Langzeitermüdung aus. Das vermeidet in diesem Kontrollversuch Teamstrategien mit Anschlussaufträgen und Angriffe, modelliert aber keine echte Profietappe. Alle Fälle beginnen mit 10 km Ebene, außer der ganz flachen Strecke; im Anschluss folgen gegebenenfalls 5 km bei +4 % und nach Plan Ebene bzw. -4 % Abfahrt. Die sanfte Variante fügt 2 km Ebene zwischen Anstieg und Abfahrt ein. Die gemeldeten Kilometer beziehen sich auf die Rennspitze. Daten: [terrain-basis-2026.jsonl](r24-schritt3b-daten/terrain-basis-2026.jsonl), Skript [r24-terrain-isolation.mjs](../../scripts/r24-terrain-isolation.mjs).

| Gelände | Gruppen bei Führungs-km 20 | Abstandsgruppen bei km 25 | räumliche Spanne bei km 20 |
| --- | --- | --- | ---: |
| Ebene | 154 | 154 | 15 m |
| Anstieg → Ebene | 154 | 154 | 20 m |
| Anstieg → Abfahrt | 127 / 17 / 9 / 1 | 144 / 9 / 1 | 619 m |
| Anstieg → 2 km Ebene → Abfahrt | 144 / 9 / 1 | 144 / 9 / 1 | 250 m |

Die 1D-Positionen sind ein vereinfachtes Feldmodell; 154 Fahrer auf 15 m dürfen nicht als realistische räumliche Feldlänge interpretiert werden. Die Messung zeigt innerhalb dieses Modells eine deutliche Wechselwirkung mit dem Geländeübergang – nicht, dass alle realen Fahrer bei jeder Abfahrt zusammenbleiben müssten. Sie isoliert nicht endgültig, welcher Anteil aus Referenzregel, Windschatten, 1D-Anordnung oder Fahrphysik stammt.

Eine Versuchskopie begrenzte die Differenz zwischen direkter Vorderrad- und Führungsbeschleunigung vorläufig auf ±0,1 m/s². Bei Anstieg → Abfahrt betrug die Feldspanne bei km 20 im Basislauf vs. Versuch 619→253 m (Seed 2026), 576→273 m (42), 602→225 m (123); bei km 25 585→231 m, 576→298 m, 680→211 m. Dies ist ein konsistenter Effekt in drei kontrollierten Läufen, keine unabhängige empirische Bestätigung. Die frühere Vollrennen-Gegenprobe zeigt gleichzeitig erhebliche Änderungen auf mehreren Profilen; der numerische Grenzwert ist eine unkalibrierte Heuristik. Der Versuch ist **nicht** Teil der Engine. Die beiden anderen Gegenproben und Rohdaten sind im Datenordner gesichert.

## Einzelne Kapitäns-Anschlussversuche

Im Checkpoint-Modus gibt `rejoinAttempts` zusätzlich zu den aufsummierten `rejoinWork`-Werten einzelne Episoden aus. Beginn: mindestens ein dem Team zugeordneter Anschlussauftrag an einen Helfer; Ziel: die zu diesem Zeitpunkt unmittelbar vorausliegende 42-m-Abstandsgruppe. Erfasst werden Kapitän, anfängliche Zielgruppen-IDs, nominierte Helfer, Beginn und Ende, Anfangslücke und Endzustand. Im taktischen 10-s-Raster wird beobachtet, ob der Kapitän derselben durch 42-m-Nachbarketten gebildeten Abstandsgruppe angehört wie **mindestens ein** ursprünglich zur Zielgruppe gehörender aktiver Fahrer. `original_target_in_same_group` bedeutet daher weder unmittelbaren Radkontakt noch, dass die vollständige ursprüngliche Gruppe erreicht wurde. `endGapM=0` beschreibt das Zusammenfallen der Gruppengrenze, keine tatsächlich gemessene Nullmeter-Distanz zwischen Fahrern.

Endet die Nominierung vorher, wird `order_ended` gemeldet; Gründe wie fehlender Helfer, Reserve, wechselnde Gruppensituation oder taktische Neubewertung sind daraus nicht eindeutig rekonstruierbar. Wenn Kapitän/Ziel nicht mehr aktiv sind, wird dies gesondert ausgewiesen. Spätere Anschlüsse nach einem beendeten Auftrag werden dieser Episode nicht als Erfolg zugeschrieben. Es handelt sich um eine Beobachtung, keinen kausalen Nachweis, dass die Helferarbeit den Kontakt bewirkt hat.

Im untersuchten Hautacam-Bergfeld mit Attacken und Seed 2026 wurden insgesamt 79 Episoden registriert: 48 mit mindestens einem ursprünglichen Zielfahrer in derselben Abstandsgruppe, 31 mit zuvor beendetem Auftrag. Davon T12/F078: 13 Episoden, 9 bzw. 4; T20/F134: 6 Episoden, 4 bzw. 2. Mehrere kurz aufeinanderfolgende Episoden können zu demselben dynamischen Rennverlauf gehören; diese Zahlen sind keine voneinander unabhängigen Erfolgschancen. [Rohdaten](r24-schritt3b-daten/anschluss-berg-2026.json). Der Vergleich der übrigen Diagnoseausgabe vor/nach der zusätzlichen Beobachtung war strukturell identisch.

## Einordnung und offen

Die Änderung betrifft ausschließlich optionale Diagnosedaten, keine Auftrags-, Leistungs-, Geschwindigkeits- oder Positionsentscheidung. Unit- und Integrationstests prüfen unter anderem Zielgruppen-Zusammengehörigkeit, beendete Aufträge, nicht mehr verfügbare Ziele und die Ergebnisgleichheit mit/ohne Diagnostik.

Eine robuste **Korrektur** des Geländeübergangs ist noch nicht bewiesen. Der begrenzte Ansatz verdient weitere Überprüfung an mehr Geländevarianten, mehreren Vollrenn-Seeds und geeigneten Messungen der tatsächlich geforderten und gefahrenen Watt. Anschließend sind die Auswirkungen auf verschiedene Fahrer und strategische Situationen zu beurteilen. Auch die Ursachen einzelner abgebrochener Anschlussaufträge und ihre kausale Wirkung müssen weiter untersucht werden. Ein künstlicher Sieger, eine starre Zielgruppe oder eine pauschale Höchstgrenze für Abstände werden nicht vorgegeben.
