# R-24: Großer Vergleich – Arbeitsstand und Protokoll

Stand 05.11.2026. Nutzerfreigabe liegt vor. Keine Änderung an `main`, keine vorgegebenen Sieger oder Rückstandsgrenzen.

## Fixierter Versuchsaufbau

- `main`: GitHub-Commit `621e712371563278c5bed2bb643dd598a9a7bcf4`.
- Entwicklungsbranch: GitHub-Commit `1945e2d6b71289f90cca5dc8c793090a4af93341`; der Enginecode entspricht dem lokalen Stand `aa58e6b` vor diesem Diagnosewerkzeug.
- Vier existierende Referenzprofile Lille, Boulogne, Lüttich, Hautacam, jeweils mit demselben Lille-Feld (`common`) und dem zur Strecke vorhandenen Referenzfeld (`profile`), 154 fiktive Fahrer, 22 Teams. Bei Lille sind diese Felder identisch, die Läufe dokumentieren dies gesondert.
- Seeds 11, 42, 101, 123, 777, 2025, 2026, 2027, 9001, 31415; je dieselben je Version, Profil und Feld. Die fünf Seeds 42, 123, 2025, 2026, 2027 wurden in früheren Diagnosen teils bereits verwendet; die Reihe ist daher keine völlig blinde Stichprobe. 160 Läufe geplant.
- Modus in beiden Versionen ausdrücklich `stable-pack`; Vergleich ist für diesen experimentellen Modus und nicht automatisch den älteren `legacy`-Standard repräsentativ.
- Identität gemeinsamer Strecke, Teams, Fahrerbasis und Seed wird über einen Hash je Lauf nachgewiesen. Die neuen Attribute `durabilityFactor`, `wPrimeRecoveryFactor` kennt `main` nicht; sie und die globale Ermüdungskalibrierung gehören bewusst zum Entwicklungsstand. Gleicher Seed garantiert wegen unterschiedlicher Ablaufpfade keine identischen späteren Zufallsereignisse.
- Vor der Simulation wird die vorhandene vereinfachte Leistungsrangliste (`categoryStrength`) für alle Fahrer erstellt. Sie ist keine kalibrierte Siegwahrscheinlichkeit und berücksichtigt Rennrollen, Teamarbeit und Mehrstunden-Ermüdung nicht vollständig. Nachher werden Vorabränge mit den Zielplätzen zusammengeführt; zusätzlich werden Spezialisten und ihre Rollen ausgewiesen.
- Zielgruppen werden aus Nachbarlücken mit mindestens 1 s bzw. mindestens 3 s als Gruppenwechsel getrennt; pro Rennen beide Ergebnisse. Dies ist eine lokale Nachberechnung aus simulierten Zielzeiten, keine Umsetzung der vollständigen UCI-Sonderregeln; reale Wertung gemäß jeweiligem Rennen wählen.
- Unterschiedliche Ausfälle, Rundfahrtvorgeschichte, Gruppenzeitregeln, Wetter und Realität des synthetischen Profils beschränken den Realvergleich. Große Rückstände sind nicht automatisch Fehler. Die Physik- und Energiebilanz wird im Diagnosewerkzeug geprüft.

## Bereits ausgeführt

Ein erster gepaarter Testlauf Lille/common, Seed 42, auf beiden Ständen vollständig durchgeführt. Gemeinsame Eingaben weisen denselben SHA-256 aus. Entwicklungsbranch Sieger F009, `main` Sieger F036; Rohdaten enthalten auch Favoriten, Zielgruppen, Ereignisse und Checkpoints. Dieser Einzelbefund ist keine Sportfreigabe und erklärt die Ursachen der Unterschiede noch nicht.

Das Diagnosewerkzeug `scripts/r24-grossvergleich.mjs` schreibt je Lauf atomar eine eigene JSON-Datei; es ändert weder die Engine noch die Eingaben während des Rennens. Es wurde syntaktisch geprüft und auf beiden Versionen mit je einem Vollrennen ausgeführt. Die zwei JSON-Dateien sind lokale Arbeitsdaten unter `artifacts/r24-grossvergleich/`; Übernahme reproduzierbarer Ergebnisse nach Auswertung vorgesehen.

## Offen

Vereinbarte Mehrseed-Läufe abschließen, paarweise Hashes und Vollständigkeit prüfen; Ergebnisse und Favoritenränge auswerten, beobachtete Verläufe und Ursachen an ausgewählten Beispielen gezielt prüfen. Echtzeitdaten/Profi-Favoriten vor dem jeweiligen realen Rennen recherchieren. Zusätzlich Prüfen, ob ein synthetischer Seitenwind-Fall und Anstieg–Abfahrt–Flach auf beiden Versionen gleich abgebildet werden können. Resultate und Einschränkungen sichern; noch keine Gesamtaussage zum Ermüdungsmodell.

## Zwischenstand: Lille, gemeinsames Fahrerfeld, zehn Seeds

Die ersten zehn Paare sind abgeschlossen. Alle zehn Hashpaare gemeinsamer Eingaben stimmen überein. In dieser kleinen Auswahl gewinnen auf `main` neun Sprinter und ein Klassikerfahrer, auf dem Entwicklungsstand fünf Sprinter und fünf als Kletterer bezeichnete Fahrer. Nach der nachberechneten 1-s-Regel beträgt die mediane Siegergruppe 29 bzw. 23,5 Fahrer; die mediane jeweils größte Zielgruppe 90,5 bzw. 98. Das ist eine deskriptive Zwischenbilanz, weder eine repräsentative Siegwahrscheinlichkeit noch ein Beweis, dass der Entwicklungsstand besser oder schlechter ist. Die übrigen Profile und Ursachenanalysen laufen noch.

Der stärkste Sprint-Proxy F023 belegt auf `main` in diesen zehn Rennen die Ränge 1, 21, 2, 1, 2, 3, 2, 2, 2, 3; auf dem Entwicklungsstand 95, 2, 17, 8, 2, 1, 2, 2, 2, 23 (Seeds in Reihenfolge 11, 42, 101, 123, 777, 2025, 2026, 2027, 9001, 31415). Der Proxy erfasst weder komplette Strecke noch Position und Teamtaktik; die Unterschiede verlangen Verlaufsprüfung.

Beispiel Entwicklungsstand, Seed 11: Sieger F134 attackierte bei km 18,6 und km 177,1; bei Kontrollpunkten km 20–140 war er als einzelne führende Gruppe erfasst, bei km 160 gehörte er zu einer Gruppe mit 94 Fahrern und bei km 180 zu einer Zweiergruppe. F023 wurde 95. Diese Momentaufnahmen beweisen weder eine durchgehende Solofahrt noch, weshalb die Jagd erfolgte oder scheiterte. Eine engere Ursachenanalyse folgt. [Laufweise Kennzahlen und Eingabe-Hashes](r24-grossvergleich-daten/lille-common-10-seeds.csv).

Die gezielten Favoriten-, Referenzfeld- und individuellen Ermüdungstests liefen mit **10/10 erfolgreich**. Erkenntnis zur Seedwirkung aus dem Code: In beiden Versionen bestimmt der Seed auch die individuelle Tages-CP über einen Faktor zwischen 0,98 und 1,02. Im Entwicklungsstand steuert er zusätzlich reproduzierbare, nach Fahrer und Zeittakt gebildete Angriffszufallswerte; keine Behauptung eines gemeinsam synchronen sequenziellen Zufallsstroms. Basiswerte, Feld und Strecke bleiben für ein Szenario gleich.

Die 20 vollständigen Lille/common-Renndatensätze einschließlich Zeitreihen, Ereignissen, Diagnosen, Klassifikationen und Favoriten sind komprimiert als [JSONL](r24-grossvergleich-daten/lille-common-10-seeds.jsonl.gz) gesichert (eine JSON-Zeile je Lauf). Zusätzlich wurden die Lille/profile-Läufe als identische Wiederholung des gleichen Feldes bestätigt: Für alle 20 Version-/Seed-Kombinationen waren Eingabehash, Klassifikation und Ereignisse identisch. Sie liefern daher keine 20 zusätzlichen unabhängigen sportlichen Beobachtungen.
