# R24: Technischer Kontrolllauf Fluchtgruppenexperiment

Codezustand: Commit `50b7fa6de886e7ac569c25fb510fcd82d2ac0d19` des Gesamtbranches. Hautacam-Referenz, 154 Fahrer, Seed 777, stable-pack, ansonsten identische Eingaben. Zwei lokale Läufe, einzig das optionale Merkmal `experimentalBreakawayCooperation` wurde umgeschaltet. Dies ist ein einzelner technischer Kontrolllauf, kein sportlicher Mehrseed-Vergleich und keine Freigabe.

| Messung | Experiment aus | Experiment an |
|---|---:|---:|
| Zielankünfte | 154 | 154 |
| Sieger-ID | F078 | F134 |
| Ereignisse Flucht erkannt | 8 | 14 |
| Ereignisse Flucht eingeholt | 3 | 4 |
| Angebote Führungsarbeit / Begrenzung | 0 / 0 | 137 / 19 |
| Anschlussversuche begonnen | 22 | 17 |
| Angebote Nachführ-Ablösung | 1 | 0 |
| Beobachtete Positionswechsel nach Angebot | 1 | 0 |
| Attackenereignisse | 39 | 38 |

Die protokollierten Arbeits-/Schonungsereignisse sind taktische Absichten, keine gemessene tatsächliche Führungszeit. Dass sich der Sieger ändert, ist allein kein Fehlernachweis. Das Fehlen des beobachteten Nachführwechsels bei diesem Seed erklärt das Scheitern eines bestehenden Integrationschecks; ein anderer Verlauf kann der Grund sein, es belegt weder einen physikalischen Defekt noch die Funktionsfähigkeit der Zusammenarbeit.

Auffälligkeit: Die Fluchterkennung protokolliert bereits ohne Experiment im Beispiel eine Gruppe von 40 Fahrern und weitere Gruppen von 39 bzw. 33 Fahrern als Flucht; mit Experiment Gruppen von 38–40 Fahrern. Eine große Spitzengruppe kann sportlich vorkommen, aber die 1D-Abstandsgruppen und Zusammensetzung müssen geprüft werden, bevor das Experiment auf ihnen verlässlich angewendet werden kann. Die hohe Zahl an Arbeitsabsichten und die Wirkung der Änderungen bedürfen genauer Ursachenanalyse.

Das Experiment bleibt standardmäßig deaktiviert. Nächste Schritte: echte zeitlich aufgelöste Gruppenzusammensetzung und Abstände auswerten, tatsächliche Führungsarbeit und Energie statt Absichtsereignissen messen, eine geeignete Gruppensituation für die freiwillige Zusammenarbeit ableiten, Teaminteressen und Erschöpfung prüfen, Anschlusswechsel mit geeigneten gezielten Szenarien erneut testen und erst danach über eine Aktivierung oder den großen Vergleich entscheiden.


## Nachmessung: Gruppenform und tatsächlich geleistete Arbeit

Nach Ergänzung einer optionalen Diagnostik und Korrektur der Meldungen nach dem Zielsieg wurde der gleiche gepaarte Kontrolllauf erneut durchgeführt. Ausführung: `node scripts/r24-breakaway-audit.mjs`; vollständige Messdaten: `docs/race/r24-flucht-frontmessung-seed-777.jsonl`. Der geprüfte Renncode entspricht Commit `13eb8ff7aca1909036969f2e0c382b584b1ed087` (die danach ergänzten Änderungen betreffen nur Test, Skript und Dokumentation).

Die Diagnostik zählt reale Frontposition und dort tatsächlich abgerechnete Kurbelarbeit, solange eine erfasste vorderste Gruppe mit mindestens zwei Fahrern mindestens 75 m vor der größten Gruppe liegt. Sie misst nicht alle denkbaren Führungsphasen und ist keine metabolische Gesamtenergie. Windexposition wird durch den modellierten Aero-Faktor ab 0,95 angenähert. Eine längere Frontphase belegt nicht selbst einen freiwillig vereinbarten Führungswechsel.

| Messgröße | Experiment aus | Experiment an |
|---|---:|---:|
| Erkannte Fluchten bis zum Zielsieg | 4 | 5 |
| In der definierten Situation erfasste Frontzeit, Summe | 10.152 s | 5.813 s |
| Abgerechnete Kurbelarbeit während dieser Frontzeit | ca. 3.803 kJ | ca. 2.262 kJ |
| Unterschiedliche erfasste Fahrer an der Front | 45 | 45 |
| Arbeits-/Schonungsabsichten | 0 / 0 | 111 / 3 |

Die Zeit- und Arbeitssummen beziehen sich auf unterschiedliche, durch den Rennverlauf bestimmte beobachtete Situationen. Die niedrigere Gesamtsumme belegt daher nicht allein, dass das Experiment die Führung effizienter oder ineffizienter macht.

Ohne Experiment war die längste ununterbrochene gemessene Frontphase von F043 1086 s (18:06 min), mit etwa 435 kJ abgerechneter Kurbelarbeit und einer beobachteten Gruppengröße zwischen 17 und 19. Mit Experiment dauerte die längste Phase von F043 682 s (11:22 min) mit etwa 268 kJ bei 41 Fahrern. Diese Beispiele sind keine repräsentativen Durchschnittswerte.

Bei der Erkennung ohne Experiment lagen 40 Fahrer laut eindimensionaler Position auf 11,4 m Länge; eine weitere Gruppe mit 39 Fahrern auf 5,6 m. Mit Experiment wurden 38 Fahrer auf 2,9 m und 40 Fahrer auf 3,8 m gemeldet. Das Modell hat keine vollständigen seitlichen Fahrspuren: Die Werte sind Längskoordinaten und belegen weder konkrete seitliche Positionen noch reale Kollisionsabstände. Sie zeigen aber eine wesentliche Grenze für die Interpretation von Gruppengeometrie und Führungswechseln; die experimentelle Taktik muss unter Berücksichtigung dieser Modellgrenze geprüft werden.

Ein konkreter Auswertungsfehler wurde korrigiert: Nach der ersten Zielankunft erkannte der Tracker weitere Gruppen unter den zurückliegenden Fahrern als neue Rennfluchten. Diese falschen Meldungen werden jetzt unterdrückt; die tatsächliche Zielankunft wird nicht als Einholung bezeichnet. Vor der Korrektur meldete derselbe Lauf 8 bzw. 14 Fluchten, nach ihr 4 bzw. 5. Die ältere Tabelle oben ist damit ein historischer Zwischenstand.

11 gezielte technische Prüfungen inklusive Diagnostik und Regression sowie ein unabhängiger Transparenztest bestanden; dieser prüft, dass eingeschaltete Diagnostik Ergebnis und Ereignisse nicht verändert. Der TypeScript-Build bestand. Das Experiment bleibt deaktiviert; ein erneuter vollständiger technischer Gesamttest und der sportliche Vergleich stehen aus.


## Frontlage und Positionswechsel – Folgestand

Erneuter gepaarter Kontrolllauf, Hautacam-Referenz, 154 Fahrer, Seed 777; Renncode mit vorsichtigem Frontkontext und korrigierter Bestätigung der Fluchtgruppe. Die Daten stehen in `docs/race/r24-flucht-frontwechsel-seed-777.jsonl`, reproduzierbar mit `node scripts/r24-breakaway-audit.mjs`. Beide Läufe kamen mit 154 Fahrern ins Ziel, die mechanische Energiebilanz blieb innerhalb des geprüften Toleranzwerts.

| Beobachtung | Experiment aus | Experiment an |
|---|---:|---:|
| Erkannte Fluchten bis zum Zielsieg | 4 | 4 |
| Beobachtete Frontzeit in der definierten Situation | 10.152 s | 6.670 s |
| Davon Frontlage im 0,5-m-Band unklar | 2.213 s | 1.802 s |
| Roh gezählte Änderungen der vordersten Längsposition | 1.254 | 1.000 |
| Davon mit mindestens 5 s vor und nach dem Wechsel | 17 | 31 |
| Davon beim Übergang nicht im 0,5-m-Band unklar | 3 | 3 |
| Protokollierte Absichten Arbeit / Schonung | 0 / 0 | 16 / 0 |

Rohwechsel sind **keine** realen taktischen Ablösungen: Die Sortierung des 1D-Modells kann bei fast gleicher Längsposition häufig wechseln. Das 0,5-m-Band und die fünf Sekunden sind vorläufige diagnostische Maßstäbe, keine Regel des Profiradsports. Selbst ein unter diesen Kriterien als klarer Positionswechsel erfasster Vorgang beweist keine Absprache und keine längerfristige Mitarbeit. Da sich Rennverlauf und erfasste Situationen unterscheiden und nur ein Seed vorliegt, belegen die Zahlen weder eine Verbesserung noch allgemeine Häufigkeiten. Die experimentelle Zusammenarbeit bleibt ausgeschaltet.

Gegenüber der ersten Versuchsfassung werden unklare Frontsituationen vorsichtiger behandelt; der Fahrer erhält dort keine besondere experimentelle Fluchtarbeitsanweisung. Die vorhandene Rennphysik bleibt unverändert. Zusätzlich wurde korrigiert, dass eine völlig neu entstandene Spitzengruppe nicht die bereits verstrichene Beobachtungszeit der vorherigen Gruppe übernimmt. Eine Gruppe, deren Zusammensetzung sich mit mindestens einem gemeinsamen Fahrer verändert, kann die bestehende Beobachtungszeit behalten.

17 gezielte Tests und die vorhandene Integrationsprüfung für einen längeren Berg-Anschluss bestanden; ebenso der TypeScript-Build und ein Diagnostik-Transparenztest. Der vollständige technische Testsatz wird auf diesem Stand separat geprüft. Die nötige sportliche Prüfung der Gruppenbildung, Zusammenarbeit, Gegenreaktionen und Wirksamkeit bleibt offen.
