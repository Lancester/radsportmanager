# Race Engine 1.0 – RC1 (06.11.2026)

**Release Candidate, kein produktiver Merge und keine minutengenaue historische Kalibrierung.**

## Versionierte Grundlage
- Ausgehend von `experiment/r24-negative-accel-fix-20261106` ([PR #84](https://github.com/Lancester/radsportmanager/pull/84)); anders als `develop/manager-mvp` nur lokale Beschleunigungsreferenz korrigiert, keine neue Physiologie/Taktik.
- Ergebnis-Anzeigeadapter `src/engine/race/finish-time-groups.ts` und Tests von [PR #90](https://github.com/Lancester/radsportmanager/pull/90); **nicht** in `simulateRace()` integriert, damit Ergebnis- und Physikschicht sauber getrennt bleiben.
- Prüfbelege: [32 vollständige Abnahmerennen](https://github.com/Lancester/radsportmanager/actions/runs/42237671835), [32 Zeitgruppen- und Kalibrierungsläufe](https://github.com/Lancester/radsportmanager/actions/runs/42244065657).
- Ausführliche Bewertung: [Engine-Abnahme](R24_ENGINE_1_0_ABNAHME_20261106.md), [Zielgruppen und absolute Zeiten](R24_ZEITGRUPPEN_ABSOLUTKALIBRIERUNG_20261106.md).

## Freigabeumfang
- Einzelrennen für Flach, Hügel, Klassiker und Berge als **generative Simulation mit fiktiven Fahrerfeldern**.
- CP/W′-Physik, Windschatten, Gruppeninteraktion, autonome Team-/Angriffs-KI und langfristige Ermüdung aktiv.
- Postprocessing der vorläufigen Zielzeitgruppen mit 1s/3s-Kettenlücken, ohne Änderung der individuellen Rennzeiten.
- Die begrenzte Kalibrierung zeigt gegenüber realen 2025er Siegerzeiten Mittelabweichungen von rund +4,7% Lille, −0,8% Boulogne, −3,7% Lüttich, +3,7% Hautacam. Kein globaler Korrekturfaktor; keine profilbezogenen Handicaps.
- Nicht vollständig realistisch: 1D-Feldgeometrie und Spitzenrotation, synthetische Streckenübergänge und Fahrer, fehlende UCI-Ausnahmen bei 3s, große Lüttich-Zielabstände und absolute Geschwindigkeit. Diese Grenzen im Browserbericht **sichtbar** halten.

## Produktnächster Schritt
Browser-Einzelrennenlabor nach [Konzept](EINZELRENNEN_TESTLABOR_KONZEPT_20261106.md), lokal und offline; vier Teststrecken, Seed, vorhandene echte Taktik-Eingaben, Ergebnisgruppe und Rennbericht. Kein neues Physikmodell, kein 3D, keine zusätzlichen Servicekosten. Für nachvollziehbare manuelle Szenariovergleiche zunächst Baseline-Seed fixieren.

## Versionspflege
Diese RC-Branch ist ein **unveränderlicher Rücksprungpunkt für Experimente**. Neue UI-/Kalibrieränderungen nur in eigenen Entwicklungsbranches; die alten Audit-/PR-Stände bleiben erhalten. Kein blindes Mergen von PR86 oder PR89 (unwirksame Zusatzheuristiken). `main` und `develop/manager-mvp` bleiben unangetastet.
