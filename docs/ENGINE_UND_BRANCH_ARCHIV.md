# Engine-Referenzen und Branch-Archiv

**Stand:** 06.11.2026. Inventar der auf GitHub bei dieser Sichtung aufgelisteten 68 Branches. **Kein Branch wurde gelöscht, umbenannt, zurückgesetzt oder gemergt.** Dies ist ein Wegweiser, keine Einzelprüfung jedes Branch-Inhalts. Historische Branches gelten nicht automatisch als aktive Aufträge.

## Drei unveränderliche Vergleichs-Commits

| Bedeutung | Referenz | Verwendung |
| --- | --- | --- |
| Main-Ausgangspunkt | `621e712371563278c5bed2bb643dd598a9a7bcf4` | historisch stabiler Stand, laufender `main` separat prüfen |
| Audit-Kandidat | `1945e2d6b71289f90cca5dc8c793090a4af93341` | Basis des neuen `develop/manager-mvp` |
| Gesamtmodell im Kurzvergleich | `772d1e910d01f991fe69f857e1291fb474978afe` | experimentelle Vergleichsreferenz |

Die Commits sind durch ihren SHA festgehalten; die gleichnamigen Entwicklungsbranches können zusätzliche spätere Commits besitzen. `develop/manager-mvp` hat bereits einen Dokumentationscommit nach seinem Audit-Ausgangspunkt. Keine Behauptung, dass alle Varianten nur die KI unterschieden: Auch Ermüdungsattribute variieren.

## Testbelege und Grenzen

- 27 dokumentierte Vergleichsrennen: drei Stände, Lille/Boulogne/Hautacam, Seeds 42/123/2026, gemeinsames fiktives Feld, 154 Fahrer. 16 gesicherte Läufe wiederverwendet; 11 neu berechnet.
- Hauptbericht und Rohdaten bleiben auf `feature/r24-eintagesmodell-gesamt`: [Ergebnis und Entscheidung](https://github.com/Lancester/radsportmanager/blob/feature/r24-eintagesmodell-gesamt/docs/race/R24_DREI_STAENDE_ERGEBNIS_UND_ENTSCHEIDUNG.md), [Manifest](https://github.com/Lancester/radsportmanager/blob/feature/r24-eintagesmodell-gesamt/docs/race/r24-kurzvergleich-20261106/manifest.json).
- Empfehlung: Audit als **vorläufige** Grundlage. Feldzerfall, Jagd-/Reaktionslogik, Favoritenstreuung, volle Tests und Android-Laufzeit offen.
- Diese Dokumentationsarbeit führt **keine neue Simulation und keinen CI-Lauf** durch.

## Branch-Inventar (nicht gelöscht)

### Verbindliche Entwicklung (2)

- `develop/manager-mvp`
- `main`

### R-24-Vergleichs- und Experimentzweige (6)

- `docs/r24-rennki-regeluebersicht`
- `experiment/r24-angriffsmotivation`
- `experiment/r24-anschluss-teamauftrag`
- `experiment/r24-mehrminuten-anschluss`
- `feature/r24-eintagesmodell-gesamt`
- `feature/r24-rennki-audit`

### R-22/R-23-Feature- und Dokumentationszweige (27)

- `docs/r22-current-racing-ai-complete-overview`
- `docs/r22-sprint-klassiker-integration-20261104`
- `docs/r23-ki-integrated-work-handoff`
- `feature/r22-attack-vs-field-cohesion`
- `feature/r22-causal-audit`
- `feature/r22-chase-helpers-peel-off-after-work`
- `feature/r22-classics-integrate-favorites-and-selective-attacks`
- `feature/r22-classics-ramp-selection`
- `feature/r22-classics-short-steep-attack-ai`
- `feature/r22-climb-physics-and-selective-ai`
- `feature/r22-early-sprint-positioning`
- `feature/r22-group-cohesion-ai`
- `feature/r22-hilly-attack-decisions`
- `feature/r22-manager-set-chase-helper-limit`
- `feature/r22-monte-carlo-pilot`
- `feature/r22-peloton-chase-energy-finish`
- `feature/r22-pre-race-favorites-audit`
- `feature/r22-real-chase-relays`
- `feature/r22-relais-fuehrungsdiagnose`
- `feature/r22-selective-classics-and-lille-diagnostics`
- `feature/r22-selective-puncheur-team-leader`
- `feature/r22-sprint-chase-to-leadout-handoff`
- `feature/r22-sprint-phase-wheel-final-ci`
- `feature/r22-stabiler-peloton-regler`
- `feature/r22-validation-protocol-multiroute`
- `feature/r22abc-reference-profiles-quickstart`
- `feature/r23-hilly-racecraft`

### R-11 bis R-21 und frühere Konzepte/Technik/Fixes (33)

- `docs/r01-pedalwatt-und-fragen-transparenz`
- `docs/r09-rennvalidierung-peloton-prioritaet`
- `experiment/r11-einmaldiagnose-20261103`
- `feature/r11-mehrseed-balancing-diagnose`
- `feature/r12-aero-formation-vergleich`
- `feature/r13-formationswindschatten-standard`
- `feature/r14-teamfuehrung-verfolgung`
- `feature/r15-r16-multihelfer-rennintelligenz`
- `feature/r17-r21-engine-abschluss`
- `fix/agent-browser-pfade`
- `fix/r03-pages-smoke-test-toleranz`
- `fix/r06-stillstand-energiegleichgewicht`
- `fix/r10-flucht-einholen-status`
- `fix/r11-sieben-eindeutige-diagnoserennen`
- `konzept/issue-1-peloton-positionierung`
- `konzept/issue-1-referenzszenarien`
- `technik/android-r03-browser-benchmark`
- `technik/dynamische-streckenabschnitte`
- `technik/gemeinsamer-physikkern`
- `technik/kurvenvorschau-und-radtraegheit`
- `technik/r01-physikmodell-ebene`
- `technik/r02-berg-und-ausruestung`
- `technik/r03-achtfahrer-gruppe`
- `technik/r03-windschatten-zwei-fahrer`
- `technik/r04-regelagent-lueckenreaktion`
- `technik/r05-abstand-cp-wprime`
- `technik/r06-sicherheit-spur-und-training`
- `technik/r07-autonome-spurwahl-gruppenki`
- `technik/r08-rejoin-multiagent-kurvenlimit`
- `technik/r09-erster-vollstaendiger-rennprototyp`
- `technik/r09-rennauswertung-benchmark`
- `technik/r10-peloton-gruppentempo-taktikruhe`
- `technik/r10-peloton-taktik-und-fluchtgruppen`

## Aufräumregel

1. Keine historischen Branches löschen, bevor Relevanz, PR-Zuordnung, ungemergte Commits und benötigte Testdaten einzeln geprüft und nötigenfalls mit unveränderlicher Commit-ID oder Tag gesichert sind.
2. Neue Entwicklung nur auf `develop/manager-mvp` oder kurzlebigen davon abgezweigten Arbeitsbranches; keine parallelen neuen Motorlinien.
3. Aus dem Gesamtmodell nur überprüfbar nützliche, kleine Mechaniken mit Tests übernehmen.
4. Historische Journale und Versuchsdaten nicht durch redaktionelles Kürzen verlieren; bei neuen Chatfenstern den [aktuellen Projektkurs](AKTUELLER_PROJEKTKURS.md) zuerst lesen.
5. Bestehende offene PRs (#79 und #81 bei Sichtung) nicht automatisch mergen oder schließen; vor künftiger Bereinigung ihren Status erneut prüfen.
