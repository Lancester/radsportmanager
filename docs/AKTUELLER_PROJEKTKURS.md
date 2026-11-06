# Aktueller Projektkurs – Radsportmanager (06.11.2026)

**Verbindlicher Einstieg für neue Chats:** Zuerst diese Datei lesen, danach `docs/START_HIER.md`, `docs/ENTWICKLUNGSSTAND.md` und bei Bedarf `docs/ENTSCHEIDUNGEN.md`. Achtung: Die älteren Einstiegstexte beschreiben teilweise historisch den Stand vom 04.11.2026; bei Widerspruch gilt bis zur konsolidierten Dokumentation dieser neuere Projektkurs. Vor Änderungen den aktuellen GitHub-Stand prüfen.

## Produktziel
Ein kostenloser, offline spielbarer Einzelspieler-Radsportmanager (später mehrjährige Karriere, Etappenrennen). Der Spieler führt das Team, legt vor Rennen Leitlinien fest; Fahrer und sportliche Leiter handeln im Rennen autonom. Keine 3D-/Live-Steuerung und keine unnötige Mikro-Physik. Spielbare, glaubwürdige Rennabläufe sind wichtiger als unkalibrierte zusätzliche taktische Spezialregeln.

## Drei eingefrorene Vergleichsstände
- `main`, Commit `621e712371563278c5bed2bb643dd598a9a7bcf4`: bisheriger stabiler Integrationsstand.
- Audit-Engine, Commit `1945e2d6b71289f90cca5dc8c793090a4af93341`: **vorläufig ausgewählte Ausgangsbasis**.
- Gesamtmodell, Vergleichscommit `772d1e910d01f991fe69f857e1291fb474978afe`, Branch `feature/r24-eintagesmodell-gesamt`: experimenteller Funktions-/Diagnosebestand; nicht pauschal übernehmen.
Die Engine-Commits bezeichnen die festgehaltenen Kurzvergleichsstände, nicht automatisch den neuesten HEAD der historischen Entwicklungsbranches.

## Neue aktive Entwicklung
Branch `develop/manager-mvp`, zunächst **exakt vom Audit-Commit** erstellt. Er ist die einzige neu vorgesehene aktive Linie. `main`, Audit-Historie und Gesamtmodell **nicht zurücksetzen, löschen, force-pushen oder automatisch mergen**. Alte Branches bleiben zunächst bestehen. Nicht behaupten, diese Dokumentationsanlage habe Code oder sportliche Ergebnisse geändert.

## Nachgewiesene Vergleichsbasis
27 Rennsimulationen (3 Engines × Lille/Boulogne/Hautacam × Seeds 42/123/2026, gemeinsames fiktives Feld), 16 restaurierte und 11 neue Läufe, dokumentierte Quellen-/Engine-Hashes, technische Ergebnisprüfungen. Kleine Stichprobe, keine unabhängige sportliche Realismusabnahme; kein isolierter reiner KI-Vergleich.
Bericht: `docs/race/R24_DREI_STAENDE_ERGEBNIS_UND_ENTSCHEIDUNG.md` **auf dem Gesamtmodell-Branch**. Weitere Daten dort unter `docs/race/r24-kurzvergleich-20261106/`.
Audit als vorläufige Grundlage: weniger auffällige wiederholte Verfolgungsbeginne als das Gesamtmodell; dennoch frühe Feldfragmentierung, Helfer-/Kapitänsverhalten, Jagddauer und einzelne Favoritenresultate weiter prüfen.

## Verbindliche Reihenfolge
1. Bestehende Architektur und Tests auf `develop/manager-mvp` verifizieren; keine ungeprüfte Aussage über komplette Tests oder Android-Laufzeit.
2. Höchstens zwei gezielte, durch reproduzierbare Gegenproben begründete Korrekturrunden: (a) vorzeitiger Feldzerfall, (b) wechselnde Verfolgungs-/Reaktionszustände, (c) wirksame Flucht-/Teamjagd. **Keine** neue großflächige Taktiküberarbeitung.
3. Begrenzte Abnahme mit unterschiedlichen Profilen, Seeds, Fahrerfeldern und anschließend Android-Benchmark. Keine Pflichtsieger oder auf feste Ergebnisse getrimmten Heuristiken.
4. Erste spielbare Managerschleife: Team/Fahrer, Vorabstrategie, autonomes Rennen, gewertetes Ergebnis, aus gemessenen Ereignissen erzeugter Bericht.
5. Rundfahrten anschließend mit übergeordneter Etappenverwaltung und echter Zustandsübergabe/Regeneration; die derzeitige Einzeletappenengine besitzt diese Übergabe **noch nicht**.

## Regeln zur Nachvollziehbarkeit
- Historische Dateien, Branches, Commit-/Ergebnisnachweise unangetastet behalten; kein Cleanup durch Löschen.
- Änderungen auf kleinen Feature-Branches oder direkt nur nach abgesprochener Arbeitsweise; keine parallele neue Engine-Linie.
- Pro Änderung: Zweck, betroffene Dateien, Prüfungen, Auswirkungen, offener nächster Schritt auf Deutsch dokumentieren.
- Unterscheiden: **beschlossen**, **vorläufig**, **getestet**, **noch offen**.
- Arbeitsstand nach abgeschlossener Runde aktualisieren; keine CI-/Testergebnisse behaupten, die nicht erneut geprüft wurden.
- Dokumentationskonsolidierung in `main` später über prüfbaren Pull Request und erst nach Freigabe. Bis dahin ist diese Datei der neue Einstieg **auf develop/manager-mvp**.
