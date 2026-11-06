# Aktueller Entwicklungsstand (Kurzfassung)

**Datum:** 06.11.2026. **Aktiver Arbeitsbranch:** `develop/manager-mvp`. Dieser Branch wurde aus Audit-Commit `1945e2d6b71289f90cca5dc8c793090a4af93341` erstellt. Der anschließende Dokumentationsabschluss hat die Rennengine nicht verändert.

## Gesichert / nachgewiesen

- Drei Vergleichs-Engines sind über Commit-SHAs eindeutig referenziert: `main` 621e712, Audit 1945e2d, Gesamtmodell 772d1e9.
- Der reproduzierbar dokumentierte Kurzvergleich umfasst 27 Rennen (Lille, Boulogne, Hautacam; je drei Seeds und drei Versionen). Die Auswahl des Audits ist **vorläufig** und keine vollständige sportliche Abnahme.
- Bisherige Branches, Code, Prüfdaten und lange Entwicklungstagebücher bleiben unverändert erhalten.
- Der neue [Branch-/Engine-Archivindex](ENGINE_UND_BRANCH_ARCHIV.md) dokumentiert das Inventar; der [Projektkurs](AKTUELLER_PROJEKTKURS.md) beschreibt die Arbeitsregeln.

## Nicht als erledigt ausgeben

- Kein vollständiger technischer Standardtestsatz oder Android-Benchmark **auf dem neuen MVP-Branch** im Zuge dieser Dokumentationsrunde durchgeführt.
- Keine der drei Varianten als abschließend sportlich realistisch kalibriert bestätigt.
- Noch kein spielbarer Manager, keine fortsetzbaren Etappen-/Regenerationszustände.
- Die bei der Sichtung offenen PRs #79 und #81 bleiben ohne automatische Übernahme.

## Nächste klar begrenzte Arbeitsaufgabe

1. Audit-Checkout auf dem neuen Branch: Build/Tests und vorhandene Baseline-Szenarien prüfen; Ausgangswerte einfrieren.
2. Höchstens zwei gezielte, testbare Korrekturrunden für frühe Feldteilung, häufige Reaktionswechsel und wirksame Jagd/Fluchtkooperation – **keine** neuen KI-Regelsammlungen.
3. Eintagesrenn-Kandidat mit mehreren Seeds/Fahrertypen, nachvollziehbaren Verlaufskriterien und Android-Laufzeit abnehmen oder präzise Restfehler dokumentieren.
4. Minimale Spielschleife aus Team, Rennziel, autonomer Simulation und Ergebnisbericht umsetzen.

**Für neue Chats:** Diese Datei und [Projektkurs](AKTUELLER_PROJEKTKURS.md) gelten für die aktuelle Arbeitsrichtung. `docs/ENTWICKLUNGSSTAND.md` und alte `START_HIER.md`-Abschnitte sind umfangreiche historische Journale und können überholte Zwischenstände enthalten. Die für die konkrete Arbeit sichtbaren Branch- und Teststände jedes Mal auf GitHub prüfen.
