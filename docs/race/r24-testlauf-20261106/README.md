# Großer Rennvergleich – laufende Serie

Gestartet am 06.11.2026. Geplant sind 200 Rennen: `main` (Commit 621e712371563278c5bed2bb643dd598a9a7bcf4) und das Eintagesmodell mit Engine-Stand von Branch-Commit 772d1e910d01f991fe69f857e1291fb474978afe, jeweils dieselben Seeds und gemeinsamen Basisdaten. Die Option für experimentelle Fluchtkooperation und vorgegebene Defekte ist aus. Die gesamte Testkonfiguration einschließlich Quell- und Skriptprüfsummen steht im [Manifest](vergleich-manifest.json). `commonInputs` berücksichtigt nicht die später eingeführten Attribute `durabilityFactor` und `wPrimeRecoveryFactor` und ist kein Beleg für identische Gesamtmodelle.

Vollständige Paare werden in komprimierten JSONL-Blöcken mit Manifest-Kennung, Einzeldatei-Prüfsummen und vollständigen Renndaten gesichert. Ein Block ist als Base64-Text gespeichert; zum Entpacken: `base64 -d BLOCK.jsonl.gz.b64 | gzip -dc > rennen.jsonl`. Fehlende lokale Daten können aus den Blöcken unter ihrem jeweiligen `filename` wiederhergestellt werden. Beim Fortsetzen müssen Quellen und Konfiguration dem Manifest entsprechen.

Der Test ist gestartet, aber noch nicht abgeschlossen; keine Aussage über ein bestandenes Gesamtergebnis. Lille/common und Lille/profile sind identische Testfelder, keine unabhängigen Wiederholungen. Die technischen Standardtests mit zwei vorherigen Zeitüberschreitungen wurden durch diese Rennserie nicht ersetzt.

Die Blockzeilen enthalten die bytegenauen ursprünglichen Dateien als `raceRaw`; ihre individuellen Prüfsummen werden geprüft. Wiederherstellung nach dem Herunterladen von Manifest, Blockdateien und zugehörigen `.json`-Metadaten: `python3 scripts/r24-grossvergleich-wiederherstellen.py --blocks PFAD_ZU_BLOECKEN --output PFAD_ZUM_TESTLAUF`. Das Werkzeug weist beschädigte Blöcke, fremde Manifeste und abweichende vorhandene Ergebnisse ab. Eine Wiederherstellung von sechs tatsächlichen Ergebnisdateien wurde bytegenau geprüft; ein beschädigter Block wurde abgewiesen.

## Wiederaufnahmeprüfung am 06.11.2026

Die 19 auf GitHub vorhandenen Blöcke 001–019 wurden abgerufen, Base64-dekodiert und ihre SHA-256-Prüfsummen der komprimierten Daten mit den jeweiligen Metadaten verglichen: 19 von 19 stimmten überein. Alle Metadaten nennen dieselbe Manifest-Kennung. Sie listen 96 unterschiedliche Renndateien, entsprechend 48 Paaren. Diese Prüfung umfasst nicht das Entpacken, die Prüfsummen der einzelnen Renndateien oder einen neuen Rennlauf. Die gesicherte Wiederherstellung und die Prüfung von Quellen, Konfiguration und Einzeldateien bleiben vor der Fortsetzung erforderlich.

Zum Prüfzeitpunkt war keine Rechenumgebung verfügbar; es wurden keine weiteren Rennen gestartet. Nach dem dokumentierten Plan fehlen weiterhin 104 der 200 Läufe. Die vorhandenen Ergebnisse und das Manifest bleiben unverändert.
