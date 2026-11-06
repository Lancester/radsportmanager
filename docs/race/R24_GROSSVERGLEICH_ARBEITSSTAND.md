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

## Zwischenstand: Boulogne, gemeinsames Fahrerfeld, zehn Seeds

Zehn Paare mit identischem Hash der gemeinsamen Eingaben sind vollständig. Auf `main` gewann ein als Klassikerfahrer eingeordneter Fahrer achtmal (jeweils F036), dazu ein Sprinter und ein Zeitfahrer. Auf dem Entwicklungsstand gewannen fünf Kletterer, drei Sprinter und zwei Zeitfahrer; bei fünf der zehn Läufe war F134 der Sieger. Die jeweilige Siegergruppe nach 1-s-Nachbarlücken hatte in beiden Versionen den Median 1; die mediane Größe der jeweils größten Zielgruppe betrug 18 bzw. 21,5. Die Mediane der individuellen Rang-77/78-Medianrückstände der zehn Rennen betrugen rund 290,2 bzw. 84,0 Sekunden. Das sind **keine Sollwerte**; ein Solosieg oder kleiner Rückstand ist für sich weder plausibel noch unplausibel.

Der profilbezogene 3-Minuten-Leistungsproxy liegt in beiden Versionen mit einem medianen Zielrang von etwa 80 weit hinten. Der Index enthält weder Taktik noch Rollen und ist kein geprüfter Wettfavorit: Dieser Befund ist Anlass, die Fahrerrolle und den Verlauf zu untersuchen, kein automatischer Fehler. Unterschiede zwischen beiden Versionen lassen sich nicht ohne Kontrolllauf einer einzelnen Codeänderung zuschreiben.

[Laufweise Kennzahlen](r24-grossvergleich-daten/boulogne-common-10-seeds.csv) und [vollständige Renndaten](r24-grossvergleich-daten/boulogne-common-10-seeds.jsonl.gz). Alle gesicherten JSONL-Zeilen enthalten ein Objekt mit `version` (`main`/`dev`) und `race` (vollständige ursprüngliche Diagnoseausgabe); das zuvor gesicherte Lille-Archiv wurde hierfür entsprechend ergänzt. Das Sicherungsskript kontrolliert die Eingabehashes jedes Paares. Die Auswertung der profiltypischen Felder sowie Lüttich und Hautacam läuft weiter.

## Boulogne mit profiltypischem Feld

Auch hier zehn vollständig geprüfte Eingabepaare: Auf `main` gewannen zehn als Klassikerfahrer geführte Fahrer (davon siebenmal F036), auf dem Entwicklungsstand sieben Kletterer, zwei Sprinter und ein Zeitfahrer. Die mediane 1-s-Siegergruppe war in beiden Versionen 1,5 Fahrer; die mediane jeweils größte Zielgruppe war 22 bzw. 21. Mediane der mittleren Zielrückstände: 319,9 bzw. 116,6 Sekunden. Der stärkste Kurzanstiegsproxy erreicht median Rang 88,5 bzw. 78,5, was ohne Prüfung der Helferrolle, Rennarbeit und Ausreißer nicht als Fehlverhalten interpretiert werden darf. Die Siegertypen sind keine erwarteten Mindestzahlen; ihre Unterschiede rechtfertigen eine nähere Prüfung.

[Kennzahlen](r24-grossvergleich-daten/boulogne-profile-10-seeds.csv), [vollständige Daten](r24-grossvergleich-daten/boulogne-profile-10-seeds.jsonl.gz). Zur Ursachenklärung wurden je zwei zusätzliche Seeds auf Lille und Boulogne für den isolierten Branchstand vor der Ermüdungskalibrierung `a33c32c` angesetzt; diese gezielt ausgewählten Kontrollläufe sind noch offen und keine unabhängige Stichprobe.

Die zwei synthetischen Zusatzeingaben wurden konzipiert: Lille-Grundprofil mit 6 m/s Seitenwind auf den letzten 60 km; Lille-Grundprofil, dessen letzte 15 km durch 3 km mit 6 % Anstieg, 5 km mit −3,6 % und 7 km flaches Finale ersetzt werden. Die Windmodellierung ist eine Vereinfachung und kein Beleg für vollständig simulierte seitliche Windstaffeln. Seed 42 beim Übergangsprofil ist auf beiden Versionen durchgerechnet, gemeinsame Eingaben haben identischen Hash; Ergebnis für Seitenwind und weitere Seeds laufen.

## Wiederaufnahme bei Unterbrechung

Für die nächste Reihe muss ein **neues leeres Ausgabeverzeichnis** verwendet werden. Beispiel: `python3 scripts/r24-grossvergleich-starten.py --main-root PFAD_MAIN --dev-root PFAD_BRANCH --output PFAD_NEUE_REIHE --dry-run`; `--before-root` ist optional. Ohne `--dry-run` werden die Läufe ausgeführt; `--workers` passt die Parallelität an. Auf Linux wird das Zielverzeichnis gegen parallele Instanzen gesperrt. Das Manifest bindet neue Ergebnisse an die Inhalte der Engine-Verzeichnisse, Testskripte, Testplan und Node-Version und prüft die gespeicherte Kennung bei der Wiederaufnahme. Veränderte oder fehlende Herkunft wird abgewiesen; alte Ergebnisse bleiben erhalten, dürfen aber nicht ungeprüft mit neuen vermischt werden. Neue Ergebnisse enthalten die benötigten Fahrerdaten; für historische Ergebnisse kann weiterhin `rosters.json` erforderlich sein. Die Bindung kann Änderungen während eines abrupt abgebrochenen Prozesses nicht in jedem Fall rückwirkend aufdecken.

## Lüttich mit gemeinsamem Feld

Zehn geprüfte Paare: Auf `main` gewannen zehn als Klassikerfahrer eingeordnete Fahrer, auf dem Entwicklungsstand acht Kletterer und zwei Allrounder. Die Mediane der individuellen Feldmedianrückstände betragen 920,45 bzw. 668,34 s; eine 1-s-Siegergruppe hat median 1,5 bzw. 1 Fahrer. Echte Lüttich-Rennen zeigen ebenfalls sehr unterschiedliche Abstände; wegen Ausfällen und anderen Feldern sind die Zahlen nicht direkt gleichsetzbar. Die Werte allein begründen keine Wertung des Realismus.

Die Mediane der fahrerweisen modellierten Leistungsverfügbarkeit bei Zielankunft, anschließend über die zehn Rennen gemittelt durch den Median, liegen bei 100 % (`main`) und 94,96 % (Entwicklungsstand); dieselbe Aggregation für den Anteil des verbleibenden W′ ergibt 100 % bzw. 98,53 %. Dies sind zustands- und modellabhängige Größen, keine Messwerte realer Fahrer und kein isolierter Wirkungsnachweis der Ermüdungskalibrierung. Insbesondere können andere Rennverläufe, Felder und Leistungsanforderungen den Vergleich beeinflussen.

[Kennzahlen](r24-grossvergleich-daten/liege-common-10-seeds.csv), [vollständige Daten](r24-grossvergleich-daten/liege-common-10-seeds.jsonl.gz). Die Auswertesoftware berücksichtigt nun auch Zielwerte für Ermüdungsverfügbarkeit, W′-Anteil und Kohlenhydrate; deren wissenschaftliche Validität folgt aus den Rennläufen nicht.
