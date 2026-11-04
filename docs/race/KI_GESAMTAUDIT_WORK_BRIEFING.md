# Unabhängige Gesamtauditierung der Rennfahrer- und Team-KI – Work-Auftrag

**Projekt:** öffentlicher Offline-Radsportmanager, Repository `Lancester/radsportmanager`, Branch **`main`**.
**Ziel:** Eine fachlich unabhängige, kritische zweite Prüfung des gesamten KI- und Rennsimulationssystems. Dies ist **keine** Bitte um Bestätigung der bisherigen Arbeit. Suche nach logischen Fehlern, systematischen Verzerrungen, falsch kombinierten Regeln, widersprüchlichen Prioritäten und unrealistischen Resultaten. Kennzeichne Unsicherheit und die Grenzen von Ein-Seed-Smoke-Tests.

## Projektkontext

- Das Spiel soll ein realistischer Einzelspieler-Radsportmanager werden. Der Spieler stellt die **strategische Rennleitlinie** auf; sportliche Leiter sowie Fahrer-KI entscheiden autonome Einsatzpläne, Gruppentaktik und verfügbare physische Watt. **Kein Mikromanagement der Zahl der Jagdhelfer.**
- Rennsimulation: fiktive Fahrer- und Teamdaten, reale Distanz- und Anstiegsanker der vier Referenzrennen, nicht GPX-genaue Übergänge. `stable-pack` ist die moderne opt-in-KI; `legacy` ist historischer Default und darf für Vergleichbarkeit unangetastet bleiben.
- Reale Entscheidungen sollen aus **Positionsdynamik, Aero/Windschatten, Fahrerleistung, CP/W′, Ermüdung, Strecke, Rennsituation** entstehen. KEIN Erzwingen von Gewinnern, Positionen, Gruppen, Zielzeiten oder unbezahlten Watt.
- Getestete Grundtypen: `tdf25_lille` flach (184,9 km), `tdf25_boulogne` hügelig (209,1 km), `lbl25_liege` Klassiker (252 km), `tdf25_hautacam` Bergankunft (180,6 km), je 154 Fahrer, Referenz-Seed 2026.
- PR #74 (Sprint/Jagd) und #76 (Klassiker) wurden integriert; PR #78 betrifft Hügelangriffe plus allgemeine späte Angriffe; PR #75 zur manuell wählbaren Jagdhelferzahl **wurde bewusst ohne Merge geschlossen**. Prüfe den **tatsächlichen aktuellen Status auf GitHub**, nicht ältere Textstellen im Entwicklungsjournal.

## Verbindliche Einstiegsdateien auf main

- `docs/START_HIER.md`, `docs/ENTWICKLUNGSSTAND.md`, `docs/ENTSCHEIDUNGEN.md`: oberste aktuelle Abschnitte und chronologisches Journal unterscheiden.
- `docs/race/RENNFAHR_KI_GESAMTUEBERSICHT.md`, `docs/race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md`, `docs/race/R22_KLASSIKER_KI_ABNAHME.md`.
- Pull Requests [#74](https://github.com/Lancester/radsportmanager/pull/74), [#76](https://github.com/Lancester/radsportmanager/pull/76), [#78](https://github.com/Lancester/radsportmanager/pull/78), verworfene [#75](https://github.com/Lancester/radsportmanager/pull/75), alle relevanten Testläufe.

## Code schwerpunktmäßig lesen, Aufrufpfade verfolgen

- `src/engine/race/race-simulator.ts`: gesamter Ablauf, 10-s-KI/1-s-Physik, Prioritäten, Gruppen, Attacken, Hysterese, Eventzählungen, Zielklassifikation.
- `src/engine/race/race-tactics.ts`, `general-attack.ts`, `hilly-racecraft.ts`, `classics-punch.ts`, `classics-racecraft.ts`, `climb-tempo.ts`: Initiativen, Wattregeln, Rolle/Profil/Reserve, tatsächliche Gruppe, Angriffsfortsetzung.
- `src/engine/race/peloton-chase.ts`, `race-team-ai.ts`, `chase-helper-fatigue.ts`, `chase-leader-telemetry.ts`: Ausreißer-/Feldjagd, mehrköpfige Gruppen, tatsächliche 10–20-minütige Führung, Ablösung, Erschöpfung, Verantwortlichkeiten.
- `src/engine/race/stable-pack.ts`, `peloton.ts`, `formation-aero.ts`, `sprint-positioning.ts`, `sprint-leadout.ts`, `sprint-wheel-choice.ts`, `final-sprint.ts`, `finish-groups.ts`.
- `src/engine/physics/motion-core.ts`, `src/engine/physiology/critical-power.ts`, zugehörige Endurance-/R-19-Bausteine.
- `src/engine/race/reference-fixtures.ts`, `scripts/r22-profile-smoke.mjs`, `tests/r22-profile-smoke.test.mjs`, alle neuen R-23-Tests.

## Unbedingt eigenständig auf folgende Fehlerklassen prüfen

1. **Künstliche Zeit-/Distanzfenster:** Früher gab es eine generische Angriffsblockade ab 88 % Strecke; suche **weitere** starre Grenzen, Schwellen, redundante Gates und ungewollt unerreichbare Zweige. Prüfe Angriffsmöglichkeiten vor/auf/nach Schlussanstiegen, Flachfinale, Anfahrt, 1 km vor Ziel. Unterscheide sinnvolle physiologische Grenzen von übertriebenen Scripts.
2. **Tatsächliche Wirkung statt nur Befehle:** Wird jede `desiredPowerW`-Entscheidung nach Packsynchronisierung, Aero und W′-Begrenzung überhaupt umgesetzt? Lässt sich ein Fahrer durch Mehrleistung wirklich absetzen, oder führt die 1D-Gruppenregel zu künstlichem Mitschwimmen/Abriss? Keine Positionsteleportation.
3. **Gruppen- und Jagdlogik:** 42-m-physische Abstandsgruppen versus realer Windschatten; wann kann ein Fahrer zurückfallen, aufschließen, im großen Feld sparen? Erkennt die Jagd-KI nur Fluchten mit 1–6 Fahrern, während **10–30 Fahrer vor einer großen Gruppe** unkoordiniert davonfahren? Wer übernimmt bei Hügeln/Klassikern die Arbeit?
4. **Angriffe:** Anzahl, Zeitpunkt, betroffene Fahrer, wiederholte Angriffe auf derselben 1–2-km-Rampe, Abstände **5 km nach dem Angriff**, Veränderung von W′ und späterer Platzierung, rationale Teaminteressen. Die geringe Angriffszahl allein ist **kein** Realismusbeweis.
5. **Sprint und Helfer:** Ausreißer real eingeholt; mehrere Teams arbeiten nicht zu viel gleichzeitig; Sprintzüge führen nicht zum künstlichen 25er-Split kurz vor dem Ziel; 30-Fahrer-`massSprintProxy` ist ein strenger Diagnosewert und sollte nicht zurechtgebogen werden. Ohne Sprintzug ebenfalls Sprintchancen.
6. **Hügel und Klassiker:** Plausible Spitzengruppe, Etappenprofil, Abstände zur Hauptgruppe, nicht ausschließlich nach Fahrertyp-Label; besonders Medianrückstände und zu starke Gruppenselektion prüfen.
7. **Berge:** Kein Sprinter gewinnt eine extreme Bergankunft aufgrund versehentlicher Zug-/Aero-/AI-Boni; gute Kletterer/GC-Leader dürfen auch **nach 88 %** angreifen, sofern W′, Position und Steigung passen.
8. **Determinismus, Sicherheit und Leistungsfähigkeit:** Gleicher Seed = gleiche Klassifikation/Events; unerwartete Seiteneffekte einer KI-Regel auf andere Rennprofile; CP/W′-/R-19-Energieinvarianten; Laufzeit und Skalierung auf Android; keine unnötige Mikrophysik.
9. **Autonomie des sportlichen Leiters:** strategische Spielereingaben versus autonome Helferzahl/Führungswechsel; weshalb Personal und taktische Entscheidung einen Unterschied machen, ohne Echtzeit-Klicksteuerung.

## Reproduktion und Prüfmethodik

- Bestehende GitHub Actions **prüfen und verlinken**, nicht aus grünen Unit-Tests auf sportlichen Realismus schließen.
- Lokaler Grundtest (wenn Entwicklungsumgebung verfügbar):
  `node --experimental-strip-types scripts/r22-profile-smoke.mjs --route all --seed 2026`.
  Tests entsprechend `package.json` ausführen.
- Erst Vergleich **vor/nach PR #78** je Rennen. Danach mehrere **unterschiedliche Seeds** (idealerweise mindestens 5 je Profil, sofern Rechenzeit vertretbar; längere Serien ausdrücklich als zusätzliche Stichproben markieren) und ausgewählte Grenzfälle: kleine Ausreißergruppe, starke 20–30er Spitzengruppe, ein Fahrer früh abgehängt, knappe W′-Reserve, Sprint nach eingeholter Flucht, Bergankunft ohne Angriffe.
- Bestehende Referenz ist ein einzelner deterministischer Seed mit 154 fiktiven Fahrern, **keine empirische Kalibrierung** gegen reale Renndaten. Veröffentliche Verteilungen der Siegerprofile, Top10-Archetypen, Ziellücken, Führungssekunden, erfolgreichen Attacken und realer Gruppengrößen.

## Ergebnis liefern

1. **Executive Summary:** Ist das Modell für die nächste Managerphase belastbar? Wo nicht? Welche Punkte aus bisherigen Antworten sind durch Tests **nicht** gedeckt?
2. **Priorisierte Befundtabelle P0/P1/P2/P3** je mit konkreter GitHub-Datei + Zeile/Funktion, beobachtetem Effekt, Reproduktion, vermuteter Ursache und kleinstem sinnvollen Fix.
3. **Szenariovergleich** für alle vier Profile, Vergleich vor/nach Hügel-/88%-Fix sowie Mehrseed-Muster, mit Kennzeichnung von Messungen und Annahmen.
4. **Pragmatische Reihenfolge** von maximal fünf nächsten Korrekturen, jeweils mit messbaren Akzeptanzkriterien und Regressionstests.
5. **Positive Ergebnisse** ebenfalls nennen, aber keinerlei Gefälligkeit oder unkritische Zustimmung.

**Wichtig:** Zunächst **nur untersuchen und berichten**. **Keine** eigenständigen Merges, Änderung von `main`, neuen Features, künstlichen Gewinner-/Zeitskripten oder großflächigen Rewrites. Für vorgeschlagene Änderungen eine nachvollziehbare PR-Planung liefern. Unklare Punkte und Evidenzlücken explizit markieren.
