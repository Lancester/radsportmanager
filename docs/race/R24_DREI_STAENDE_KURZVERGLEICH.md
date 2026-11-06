# R24: Drei-Stände-Kurzvergleich – Arbeitsplan und Wiederaufnahme

Auftrag 06.11.2026: zügige, nachvollziehbare Entscheidung für eine erste spielbare Rennengine vorbereiten; Etappenrenn-Erweiterbarkeit als eigenes Kriterium bewerten. Kein neuer Entwicklungsbranch, keine neue Motoränderung oder automatische Sportfreigabe.

## Vorab fixierter Plan

- 27 Rennen: drei Modellstände × Lille, Boulogne und Hautacam × Seeds 42, 123 und 2026. Jeweils gemeinsames Lille-Referenzfeld, 154 fiktive Fahrer, `stable-pack`, ohne geplante Defekte und ausgeschaltetes Fluchtkooperationsexperiment.
- Main `621e712371563278c5bed2bb643dd598a9a7bcf4`, Engine-SHA-256 `4afdf3d734548be50b7e95f3672200ce4bbdf179daa3a0b4ec23d0ad91dc21a6`.
- Audit-Zwischenstand `1945e2d6b71289f90cca5dc8c793090a4af93341`, Engine-SHA-256 `2c6f7f154f98a86627952d10ab556b8e2bea50b39bb2a0b850b304ac12ae40b8`. Dieser gesamte Engine-Inhalt stimmt mit den zuvor gesicherten Punkt-2-Manifesten für die Auditversion überein. Die dort genannte Commit-ID `62111902a722233ac0d1a4430a5ec2bf674f37f5` ist auf GitHub nicht auffindbar; deshalb ist hier der anhand des Engine-Inhaltshashes nachgewiesene Commit maßgeblich. Die Gleichheit der Engine bedeutet nicht, dass die zwei vollständigen Git-Bäume identisch sind.
- Gesamtmodell `772d1e910d01f991fe69f857e1291fb474978afe`, Engine-SHA-256 `cda3f93d7a7f6e4822b4b2fa0eb01410cd99ce50dd4a33ebe3cdcf5865b48492`. Der spätere Branch enthält außerdem eine technische Diagnosekorrektur; diese wurde für Lille/101 ohne Ergebnis- oder Ereignisänderung geprüft, aber der breite Vergleich bleibt für genaue Reproduzierbarkeit auf dem festgehaltenen Engine-Stand.
- Node v24.22.1, `scripts/r24-grossvergleich.mjs` mit SHA-256 `b7299c1ec8deef61b145a1bb61a746f0d5ca1689f7a8fa32add2d9d9dbdf0be5`. Jede Neuaufgabe erhält eine eigene atomar geschriebene Datei und separat dokumentierte Quellen- und Aufgabenkennung. Bis zum Beginn einer Aufgabe den Engine- und Skripthash prüfen, danach erneut kontrollieren.
- 12 bereits restaurierte main-/Gesamtmodellläufe (Lille und Boulogne, je drei Seeds) stammen aus den per Manifest und Einzelprüfsumme geprüften Sicherungsblöcken der begonnenen 200er-Reihe. Vier weitere Läufe (Audit Lille/42 und alle drei Versionen Hautacam/42) sind in den Punkt-2-Archiven samt zugehörigem Engine-Manifest vorhanden. Der Lille-Schnittpunkt der beiden Archive ist für main und Gesamtmodell hinsichtlich Eingabehash, Klassifikation und Ereignissen identisch geprüft.
- Folglich sind voraussichtlich elf echte Rennen neu zu rechnen: je zwei Audit-Läufe auf Lille und Hautacam, drei auf Boulogne und je zwei Läufe von main und Gesamtmodell auf Hautacam. Ältere Archive ohne vollständiges Serienmanifest können Kontext liefern, werden hier nicht automatisch als gleichartig nachgewiesen ausgegeben.
- Jede 3er-Kombination wird nach gemeinsamen Eingabehashes sowie Ergebnisstruktur, 154 Finishern und bestehender Energietoleranz geprüft. Der gemeinsame Hash lässt `durabilityFactor` und `wPrimeRecoveryFactor` aus, da main sie nicht kennt. Unterschiedliche Codepfade bedeuten: gleicher Seed garantiert keine identischen späteren Zufallsentscheidungen. Die Stände unterscheiden sich außerdem nicht nur in Taktik; das ist kein isolierter KI-A/B-Test.
- Drei Seeds sind eine kleine Orientierung, keine Repräsentativität und kein Beweis für realistisches Rennverhalten. Ergebnisgruppen nur mit dokumentierter 1-s-/3-s-Nachbarregel als Diagnose, nicht als vollständig offizielles Ergebnis. Vorab-Proxys rollenbewusst einordnen, reale Renndaten nur als begrenzte Orientierung.
- Bewertung: technische Vollständigkeit und Energiebilanz getrennt von sportlichen Verläufen, Angriff und Verfolgung, Gruppenbildung, Favoriten und Rollen, beobachtbarer Begründbarkeit, Wartbarkeit und Laufzeit. Vergleichslaufzeiten unter paralleler Ausführung sind keine Android-Benchmarks. Keine erzwingenden Gewinner-, Rang- oder Rückstandsvorgaben.
- Etappenrennen: beurteilen, ob Fahrerzustand, Teams, Etappenprofil, Ziel-/Strategieeingaben und Ergebnisdaten eine spätere Etappen-Koordination ermöglichen; Gesamtwertung, Regeneration, Etappenziele und Personal sind noch nicht automatisch implementiert. Manager-/sportlicher-Leiter-Aufgabenteilung bleibt offen.

## Status

Plan vor Laufbeginn dokumentiert. Keine abschließende Entscheidung; die elf Neuaufgaben und die vollständige gemeinsame Auswertung stehen noch aus. Fertige Ergebnisse in kleinen Blöcken auf diesem Branch sichern.


## Zwischenstand und Wiederherstellung

22 von 27 Läufen sind vorhanden: 16 geprüfte Wiederverwendungen und sechs neue Ergebnisse, gesichert als Blöcke 001–005 unter `docs/race/r24-kurzvergleich-20261106/`. Die fünf übrigen Aufgaben betreffen Hautacam; ein Teil davon wird gerade gerechnet. Dieser Abschnitt wurde vor Abschluss der laufenden Aufgaben geschrieben, daher kann es lokal weitere noch nicht gesicherte Ergebnisse geben.

Das Manifest fixiert die Quellen und Einzeldatei-Prüfsummen der 16 wiederverwendeten Daten. Neue Blöcke enthalten die ursprünglichen Ergebnisdateien und Einzelprüfsummen sowie die Prüfsumme des komprimierten Blocks und die Kennung des Manifests. `scripts/r24-dreistaende-wiederherstellen.py` rekonstruiert neu berechnete Ergebnisse aus den Blöcken; die Wiederherstellung zweier tatsächlicher Ergebnisse wurde lokal geprüft. Die wiederverwendeten Dateien müssen separat aus den im Manifest benannten Archiven wiederhergestellt und geprüft werden. `scripts/r24-dreistaende-kurzvergleich.py` berechnet fehlende Läufe nur bei passenden Engine- und Skriptprüfsummen. Seine momentan verwendeten absoluten Arbeitsverzeichnisse müssen bei Wiederaufnahme an die Umgebung angepasst werden.

Keine sportliche Gesamtaussage oder Festlegung auf einen Modellstand vor dem kompletten Kurzvergleich.
