# R-22 – Teamjagd und Sprintzug: gleichzeitig, physisch und taktisch sinnvoll

**Stand 04.11.2026.** Ein experimenteller KI-Schritt nach der bereits in `main` integrierten dreiphasigen Sprinterpositionierung / Hinterradfindung aus [PR #73](https://github.com/Lancester/radsportmanager/pull/73). Nutzerziel: Ein Team mit Siegambitionen soll **frühzeitig echte Fluchten einholen**, statt kurz vor dem Ziel die Jagd komplett zugunsten des Sprintzuges abzubrechen; gleichzeitig dürfen die fürs Finale nötigen Helfer nicht alle im Wind arbeiten.

## Tatsächliche Ausgangslage (Baseline PR #73, Lille Seed 2026)

- 154 fiktive Profis, 184,9 km Lille, experimenteller `stable-pack`-Modus. Stärkster Sprinter F023: **Zielrang 5, +8,18 Sekunden**, am Sprintbeginn Rang 17 in einer 126er-Zielgruppe mit drei Teamhelfern innerhalb 30 m, davon **null** als `sprintzug`-Missionsauftrag.
- Sieger **F036, Klassikerfahrer**, startete über das ganze Rennen hinweg zahlreiche wiederholte Attacken. Am Checkpoint 170 km war er vorne, während das Hauptfeld noch etwa 1,3 km zurücklag; bei km 180 lag F023 noch 194 m hinter der Rennspitze.
- Sprintteam-Taktik bei `decideIntelligentCrew` hatte zwei konkurrierende Bedingungen: `sprintTrain` auf den letzten 10 km schaltete eine laufende Jagd **ausnahmslos** ab, und das Zugpersonal wurde an der **absoluten Spitze der physischen Gruppe** gefiltert, auch wenn der Sprinter innerhalb dieser langen Gruppe hunderte Meter dahinter fuhr.
- `coordinatePelotonChase` schloss koordinierte Jagd bei 94 % Distanz ab; im späten Finale erhielten Sprintteams keinerlei weitere Jagdmandate, auch wenn eine **reale Flucht** noch vor dem Hauptfeld fuhr.

## Umsetzung im eigenen PR #74

Ausschließlich auf langen, überwiegend flachen Strecken mit `groupRidingModel:'stable-pack'` aktiv:

1. **Jagdkoordination:** `src/engine/race/peloton-chase.ts` kann physisch erkennbare, größenmäßig plausible Fluchten auch nach 94 % noch verfolgen (mit Anpassung an Restdistanz, höchstens vier beteiligte Teams, bestehenden Mindest-/Cooldown-Zeiten). Eine fiktive Flucht ohne räumliche Trennung wird weiterhin nicht „verfolgt“.
2. **Frühe Teamarbeit:** Geplante Jagd wird durch tatsächlich vorne positionierte Helfer umgesetzt. Nur beim nachgewiesenen Sprint-Finale-Modus dürfen Teams bei einer sinnvollen Flucht die späte Jagd fortführen; andere Strecken und `legacy` behalten unveränderte Planung.
3. **Echter Sprintzug:** `src/engine/race/race-team-ai.ts` wählt im letzten 10-km-Fenster die Helfer nach **räumlicher Nähe zum eigenen Sprinter**, nicht zur manchmal entfernten Pelotonkante. Führung erhält nur ein Helfer, der wirklich vor dem Sprinter und nicht mehr als 35 m von ihm entfernt fährt; kein Phantom-Leader.
4. **Parallele Missionen statt Entweder-oder:** Wenn eine laufende Feldjagd bereits kurz vor dem Finale wichtig ist, können **physisch vorhandene** Helfer an der Feldfront weiterjagen und **gleichzeitig** ein bis drei andere, tatsächlich beim Sprinter befindliche Helfer den Sprintzug vorbereiten. Auf dem alten Plan war immer die Jagd oder der Sprintzug dominant. In der neuen Planung können innerhalb einer Mannschaft separate individuelle `CrewOrder`-Missionen `jagd` und `sprintzug` gleichzeitig existieren; keine zusätzliche Fahrerzahl oder Energie.
5. **Messbarkeit statt Sieggarantie:** Neue Werte `actualSprintTrainRiderSeconds`, `nearSprinterTrainRiderSeconds` und `lateSprintChaseRiderSeconds` in `race-simulator.ts`/den vier bestehenden Referenzproben. Die bisher vorhandenen Zähler `mainFieldFrontWorkWithAssignedChaserS`, `sprintFinale` (tatsächliche Helfer vor/nach dem Sprinter) und `R22-FAVORITES` bleiben bestehen.

**Kein Eingriff in Fahrphysik oder Athletenwerte:** Jede Fahrt beruht auf den schon getesteten `motion-core`-, `critical-power`-/W′-, `endurance`- und Formationsaero-Regeln. Die verbesserte KI darf einem Fahrer nicht einfach eine höhere Geschwindigkeit zuweisen, sondern nur gewünschte, durch dieselben physiologischen/physikalischen Grenzen laufende Watt anfordern.

## Kleine Tests und Abnahme

- `tests/r22-sprint-chase-handoff.test.mjs`: Einholen einer echten Flucht auch nach 94 %, kein spätes Phantomverfolgen, real nahe Helfer trotz großer physischer Feldlänge, gleichzeitig zugewiesene Jagd- und Sprintzug-Rollen und reservierte Teamhelfer.
- `tests/r22-profile-smoke.test.mjs`: Alle vier bekannten Referenzrennen mit einem einzigen Seed **2026**, je 154 Fahrer, unveränderte Vorab-Favoritenrankings, neue drei Diagnosezähler, gleiche physische Energieregessionen.
- Weiterhin `tests/r22-stable-pack.test.mjs`: 154er-Feld / 20km / keine Attacken muss zusammenbleiben; 30er-Konstanttempo-Fahrt darf nicht auseinanderfallen.
- Keine automatische Monte-Carlo-Serie vor Abschluss der KI-Entwicklung. Sieg eines Sprinters im einzigen Seed ist **kein** notwendiges Bestehenskriterium; wichtig sind tatsächliche Mannschaftsjagd, Helferpositionen, zielführende Energienutzung und keine Verschlechterung der übrigen Profile.

### Erste Regression als Gegenwarnung (vorläufig)

Eine frühe Zwischenvariante mit **entweder Jagd oder Sprintzug**, aber späterem Jagdende, hatte zwar **real 13.570 Sprintzug-Helfersekunden** und 21.970 späte Jagdhelfersekunden, jedoch Lille F023 nur Platz **27 (+10,65 s)** statt Baseline 5 (+8,18 s), und keine erkennbare bessere Einholung. Sie war sportlich **nicht gut genug**. Der parallele Jagd-und-Zug-Ansatz ist die nachfolgende gezielte Korrektur; er darf erst nach seinem eigenen vollständigen CI-Lauf bewertet werden.

**Status:** experimenteller PR #74, `legacy` weiterhin Standard, `stable-pack` opt-in, R-22 offen. Der endgültige Ergebnisvergleich muss nach dem tatsächlich geprüften Merge als weiterer Abschnitt ergänzt werden. R-23 weiterhin nicht freigegeben.
