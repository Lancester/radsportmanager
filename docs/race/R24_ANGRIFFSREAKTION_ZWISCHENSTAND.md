# Punkt 2: erste echte Kontrollrennen zu Angriffen und Reaktionen

Stand 06.11.2026. Es wurden zwei vollständige Strecken mit demselben gemeinsamen Fahrerfeld und Seed 42 in je drei Ständen simuliert, insgesamt sechs Rennen. Das ist ein erster Kontrollvergleich, nicht der vollständige große Mehrseed-Test.

## Versuchsaufbau

- `main`: Commit `621e712371563278c5bed2bb643dd598a9a7bcf4`.
- Vorheriger Audit-Stand: Commit `62111902a722233ac0d1a4430a5ec2bf674f37f5`.
- Neues Eintagesmodell: Engine-Stand des Branches bei Commit `772d1e910d01f991fe69f857e1291fb474978afe`. Das Flucht-Kooperationsexperiment und geplante Defekte waren ausgeschaltet.
- Lille und Hautacam, gemeinsames Lille-Feld, jeweils 154 fiktive Fahrer, Seed 42 und Modus `stable-pack`. Physische Abschlussdaten und Energiebilanz bestanden die Prüfungen des Rennskripts. Alle Fahrer wurden jeweils klassiert.
- Je Strecke stimmt der Hash der **gemeinsamen Basisdaten** zwischen den drei Ständen überein: Lille `e4a5e85c8de49235a9de260a9b4faaa703311501cec9e02258f5c6ff45f6270d`; Hautacam `46d2e13110857b58849d5e940ced94d91dfb68cb0a34363d164c2c4070f40eed`. Entwicklungsattribute `durabilityFactor` und `wPrimeRecoveryFactor` sind wie im bisherigen Testprotokoll aus diesem gemeinsamen Hash ausgenommen. Die vollständigen Fahrerhashes und Engine-Inhaltshashes bleiben in den Daten/Manifesten erhalten. Der gleiche Seed erzwingt keine identischen späteren Zufallsentscheidungen.

## Ergebnisse

| Strecke und Stand | Sieger | Angriffsbeginn-Ereignisse | Verfolgungsbeginn-Ereignisse | Reaktionen mit entsprechender Beschriftung |
|---|---|---:|---:|---:|
| Hautacam – main | F134 | 9 | 4 | nicht vergleichbar beschriftet |
| Hautacam – Audit | F134 | 46 | 175 | nicht vergleichbar beschriftet |
| Hautacam – neues Modell | F134 | 37 | 1.735 | 1.467 |
| Lille – main | F036 | 60 | 276 | nicht vergleichbar beschriftet |
| Lille – Audit | F009 | 19 | 16 | nicht vergleichbar beschriftet |
| Lille – neues Modell | F043 | 17 | 1.871 | 1.483 |

Ein Angriff oder eine Verfolgung ist hier der protokollierte **Beginn eines Zustands**. Mehrere Ereignisse können denselben Fahrer und dieselbe Situation betreffen. Sie belegen keine unabhängigen Fahrer, keine erfolgreiche Attacke und keine bestimmte Dauer. Die alten Stände verwenden nicht dieselbe neue Beschriftung; dort kein Ereignis mit diesem Text zu finden beweist nicht, dass sie nicht auf Angriffe reagieren.

Auf Hautacam wurden im neuen Modell 906 der 1.467 ausdrücklich benannten Angriffsreaktionen in den ersten 30 km registriert. Alle 154 Fahrer hatten mindestens eine solche Reaktion. Ein bei km 0,31 gestarteter Angriff des Kapitäns F120 wurde im Laufe des Rennens in 190 Reaktionsbeginnen durch 128 verschiedene Fahrer als Bezug genannt. Dieselben Fahrer können mehrfach gezählt sein. Auf Lille waren es 926 der 1.483 Reaktionsbeginne in den ersten 30 km; auch dort hatte jeder Fahrer mindestens einen. Die Ereignislisten hatten jeweils weniger als 100.000 Einträge, die aktuelle Ereignisobergrenze wurde in diesen zwei Rennen nicht erreicht.

Das Muster ist in beiden Läufen **auffällig und plausibel ein Hinweis auf eine zu häufige Reaktionswahl**, insbesondere bei der anfänglichen Fluchtbildung. Es beweist noch keine tatsächliche Überlastung: Dazu müssen Dauer, tatsächlich gefahrene Leistung, Windschatten, Gruppensituation und Anschluss ausgewählter Reaktionen untersucht werden. Der Code bewertet hier unter anderem Gegnergefahr, Abstand und Helfer, berücksichtigt aber in der Reaktionsentscheidung nicht ausdrücklich, ob die eigene Mannschaft eine frühe Flucht überhaupt besetzen möchte oder den Kapitän für später schonen will. Als nächster Arbeitspunkt sollte diese taktische Motivation anhand konkreter Verläufe ergänzt und mit denselben Eingaben vor/nach der Änderung getestet werden. Keine künstliche Angriffs- oder Reaktionshöchstzahl als Realitätsersatz.

### Favoriten und Ergebniszusammensetzung

Der vorab berechnete Leistungsproxy ist keine realistische Siegwahrscheinlichkeit und bewertet Rollen nicht vollständig. Auf Hautacam waren die ersten drei Proxys F134 (Kapitän), F085 (Klassikerfahrer) und F135 (Helfer desselben Teams wie F134). Ihre Zielränge waren:

| Stand | F134 | F085 | F135 |
|---|---:|---:|---:|
| main | 1 | 113 | 125 |
| Audit | 1 | 5 | 139 |
| Neues Modell | 1 | 84 | 135 |

Im neuen Berglauf verzeichnete F134 eine Attacke bei km 168,0, etwa 70 s Angriffszeit und danach Platz 1; F085 und F135 hatten keine protokollierten Angriffsbeginn-Ereignisse. Dass F135 Helfer ist, ist bei der sportlichen Einordnung wichtig. Die Top 10 des neuen Berglaufs bestanden aus vier Kletterern, vier Zeitfahrern und zwei Klassikerfahrern. Im neuen Flachlauf waren es sieben Sprinter, zwei Allrounder und ein Klassikerfahrer. Die Zusammensetzung einzelner Rennen ist keine Verteilung über viele Seeds und keine ausreichende Realismusbewertung.

## Sicherung und Wiederholung

Die vollständigen drei Ausgaben je Strecke einschließlich Ereignissen, Klassifikation und Diagnostik sind als gzip-komprimiertes JSONL in Base64 gesichert: [Hautacam](r24-grossvergleich-daten/vergleich-punkt2-hautacam42-vorher.jsonl.gz.b64), [Lille](r24-grossvergleich-daten/vergleich-punkt2-lille42-vorher.jsonl.gz.b64). Eine Zeile enthält jeweils `version` und `race`. Beispiel zum Entpacken: `base64 -d DATEI.jsonl.gz.b64 | gzip -dc > rennen.jsonl`. Die jeweiligen Vergleichsmanifeste sind ebenfalls im Datenordner gespeichert. Für neue Ergebnisse zählt `scripts/r24-reaction-audit.mjs` die beschrifteten Ereignisse, unterscheidet wiederholte Fahrer und fasst Abschnitte zusammen. 16 gezielte Tests zu Attackenzielen, Reaktionen und der Auswertung bestanden. Diese gezielten Tests ersetzen nicht den vollständigen Standardtest.
