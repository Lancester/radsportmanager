# R-24: Detailprüfung Hautacam – Favoriten und Attacken

Stand 05.11.2026. Verglichen werden die fixierten Stände main 621e712371563278c5bed2bb643dd598a9a7bcf4 und Entwicklung 1945e2d6b71289f90cca5dc8c793090a4af93341, Bergfeld, zehn Seeds, stable-pack. Eingabepaare sind zuvor geprüft. Einzelheiten und Realdaten in R24_HAUTACAM_EINORDNUNG_PRUEFAUFTRAG.md. Keine Änderungen an main oder der Engine auf dem Entwicklungsbranch.

## F134

Der Kapitän ist auch ohne Siege sehr bergstark: CP 405,6 W, Körpermasse 63,3 kg, Rad 7,7 kg, W′ 18.542 J, CdA 0,2545 m², Aggression 0,717. F078 hat CP 405,8 W, 62,8 kg Körpermasse, 7,7 kg Rad, W′ 16.879 J, CdA 0,2643 m², Aggression 0,531. Dies sind Eingabewerte, keine Messungen realer Fahrer. Der Vorabindex berücksichtigt andere Faktoren als Rennen, Teamarbeit, Zufall und Langzeitermüdung. Unterschiede in Aerodynamik, Reserve und Aggression können relevant sein, beweisen aber die Ursache der Siege nicht.

Entwicklung: F134 gewinnt bei Seeds 11, 101, 777, 2025, 2027, 9001 und belegt 2, 2, 4 und 4 in den übrigen. Bei Seed 11 gewinnt er ohne erfasstes Attackenereignis. Bei Seed 777: frühe Attacke bei eigenem km 20,7; fünf km später liegt er ca. 484 m vor dem damaligen Gruppenführer; später weitere Attacken, auch bei km 174,2. Bei Seed 42 Attacke bei km 19,2, fünf km später 279 m vor der ursprünglichen Gruppe und an der Spitze; er wird am Ende Zweiter. Die 5-km-Abstände sind Momentaufnahmen, keine Beweise durchgängiger Flucht. Häufige Siege sind nicht allein durch frühe Attacken erklärt. Keine Feststellung einer versteckten Siegerregel.

## F078, Seed 42

Entwicklung: Platz 73, +565,4 s. Die Checkpoints sind Zeitpunkte, an denen die Rennspitze den angegebenen Kilometer erreicht; die eigene Position des Fahrers ist kleiner als der Spitzenkilometer, wenn er zurückliegt. Bei Spitzen-km 15 beträgt der Rückstand ca. 188 m und seine Gruppe 74 Fahrer; bei Spitzen-km 20 ca. 329 m und 24 Fahrer; bei Spitzen-km 25 ca. 782 m. Die Momentaufnahmen zeigen frühe Teilungen, aber keine lückenlose Trennungsgeschichte. Bei Spitzen-km 175 sind noch 74 % W′ vorhanden, bei km 180 noch 31 %, im Ziel 110 J von 16.879 J. Der Durchschnitt über das ganze Rennen beträgt 282,7 W (Kurbelarbeit geteilt durch Zielzeit). W′-Mangel ganz am Ende ist modelliert, nicht Beweis dafür, warum er früh den Anschluss verliert. Kein erfasster Angriffsversuch. Die Telemetrie erfasst auch Anschlussversuche, einige mit Erreichen der damaligen Zielgruppe; das ist kein Nachweis eines Anschlusses an die Rennspitze.

Auf main: Platz 15, +78,0 s; bei Spitzen-km 15 bereits 352 m hinter der Spitze. Andere Abläufe trotz gleichem Input-Seed. Der Vergleich erklärt den frühen Rückstand nicht ursächlich.

## Attacken: Zähler und räumliche Verteilung

Das attack-Ereignis und der Zähler entstehen beim Wechsel der Fahrerabsicht zu Angriff; sie sind kein Nachweis des erfolgreichen Lösens. Beide Stände zählen solche Wechsel, aber ihre Entscheidungen und übrigen Rennabläufe unterscheiden sich. Summen in je zehn Bergfeld-Rennen:

| eigener Streckenkilometer | main | Entwicklung |
|---|---:|---:|
| 0 bis <50 | 93 | 115 |
| 50 bis <100 | 10 | 126 |
| 100 bis <140 | 7 | 150 |
| 140 bis <167,1 | 0 | 55 |
| 167,1 bis Ziel | 10 | 60 |
| gesamt | 120 | 506 |

Entwicklung: 298 Angriffe von Kapitänen, 198 von Helfern, 10 von Fahrern mit Rolle Sprinter. 301/506 beginnen laut Telemetrie mehr als 120 m hinter der Rennspitze. Bei 482 Versuchen mit ursprünglicher Gruppe von mindestens zwei Fahrern und verfügbarer 5-km-Messung lagen 66 nach fünf eigenen Kilometern mehr als 50 m vor dem bis dahin vordersten noch aktiven Mitglied der ursprünglichen Gruppe; 311 lagen nicht vor diesem Mitglied. Das ist eine definierte Momentaufnahme, kein universelles Erfolgsmaß und kein Vergleich mit main, für das diese Telemetrie fehlt. Angefangene Angriffe kurz vor dem Ziel haben keine 5-km-Messung. Gleiche Personen und Rennen sind mehrfach vertreten.

Die alte allgemeine Entscheidungsregel setzte in vielen Situationen höchstens 120 m Abstand zur Rennspitze, mindestens vier Gruppenmitglieder und 900 s Abstand zum letzten Angriff voraus. Die adaptive Regel verwendet eine gewichtete Zufallsentscheidung, schließt rückliegende Gruppen nicht pauschal aus und lässt nach 120 s grundsätzlich neue Versuche zu; sie berücksichtigt u. a. Position, Rolle, Leistung, W′, Gelände und Teamsituation. Einzeln erlaubt sind diese Eigenschaften kein Nachweis, welcher Mechanismus den Unterschied der Gesamtläufe hervorruft.

## Zwei isolierte Kontrollversuche

Im Checkout 1945e2d6b71289f90cca5dc8c793090a4af93341 wurde ausschließlich im attackOpportunity-Zweig für stable-pack die Bedingung auf false gesetzt, sodass die darunterliegende allgemeine statt adaptive Angriffsentscheidung benutzt wird. Restlicher Entwicklungscode, Diagnosewerkzeug aus 8923aa7e51edfd640843bfc0b4811f8988b61929, Routen, Felder, Seeds und Node 24.22.1 unverändert. Die gemeinsamen UND vollständigen Fahrer-Hashes stimmen jeweils mit den vorhandenen Entwicklungsläufen überein. Die Kontrolländerung blieb lokal; sie ist keine vorgeschlagene Korrektur und entspricht nicht insgesamt dem main-Stand.

| Seed | Version | Attacken | Sieger | F134 | F078 | F106 |
|---|---|---:|---|---:|---:|---:|
| 42 | Entwicklung/adaptiv | 49 | F036 | 2 | 73 | 11 |
| 42 | Entwicklung/allgemeine Regel | 714 | F036 | 14 | 2 | 3 |
| 777 | Entwicklung/adaptiv | 53 | F134 | 1 | 21 | 4 |
| 777 | Entwicklung/allgemeine Regel | 706 | F043 | 18 | 12 | 13 |

Der Tausch beeinflusst das Rennverhalten sehr stark. Der Befund widerspricht einer simplen Behauptung, die adaptive Regel erzeuge gegenüber der alten Regel in jedem Kontext mehr Attacken. Die sehr hohe Zahl bei alter Regel im neuen Kontext zeigt ein Zusammenwirken mit dem übrigen Entwicklungsstand; genaue interne Ursache dieses Zusammenspiels noch nicht isoliert. Beide Kontrollen sind keine unabhängige Stichprobe und liefern keinen Nachweis, dass allein die Angriffslogik F078s Platz 73 oder F134s Siege „verursacht“. Sie zeigen die Empfindlichkeit der Ergebnisse gegenüber dieser Regel.

Reproduzierbarkeit: im genannten Checkout in src/engine/race/race-simulator.ts ausschließlich `if(x.disableAttacks)return false;\n              if(x.groupRidingModel==='stable-pack'){` durch dieselbe Zeile mit `if(false && x.groupRidingModel==='stable-pack'){` ersetzen. Danach `node scripts/r24-grossvergleich.mjs CHECKOUT tdf25_hautacam 42 profile AUSGABEDATEI` und analog Seed 777 mit dem unveränderten Diagnosewerkzeug aus 8923aa7e. Auszüge mit allen Kontroll-Zieleinläufen, Angriffereignissen, beobachteten Checkpoints und Eingabehashes: r24-grossvergleich-daten/hautacam-angriffsregel-kontrollen-auszug.json. Nicht alle Rohdiagnosen der Kontrollläufe sind in diesem Auszug enthalten.

## Ergebnis und Grenzen

Die Dominanz von F134 ist teilweise angesichts seiner Werte und Rolle verständlich, aber der relative Einfluss von Aerodynamik, Gruppendynamik, Ermüdung und Taktik ist offen. F078 verlor früh Boden und wies im Finale fast kein W′ mehr auf; Ursache der ersten Trennung, Auswirkung der Team- und Gruppendynamik sowie seine Position gegenüber den anderen Favoriten sind nicht lückenlos belegt. Die Attackenzahl wird durch Regeln und übrigen Zustand beeinflusst; für ein Urteil über taktische Plausibilität sind ausgewählte Ereignisse samt Gruppe, Ziel und Verlauf noch einzeln zu prüfen. Keine Sportfreigabe und keine Engineänderung empfohlen allein auf Basis dieser Befunde.
