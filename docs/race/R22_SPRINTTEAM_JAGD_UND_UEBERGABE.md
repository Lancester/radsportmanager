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


## 5. Vier Varianten – tatsächlich gegengeprüft (ein Seed, je 154 Fahrer)

Die folgenden **vier** kleinen Varianten wurden als nacheinander isolierte Hypothesen über die bestehende feste Vierprofil-CI verglichen. Die Zahlen sind **keine statistisch kalibrierte Siegwahrscheinlichkeit**.

| Lille, Seed 2026 | PR #73 Baseline | A: längere Jagd, noch kein paralleler Sprintzug | **B: parallele Jagd UND Sprintzug (ausgewählt)** | C: zusätzlich aggressiveres Sprinter-Aufrücken | D: schon von Beginn an vier Sprintteams auf Jagd |
| --- | ---: | ---: | ---: | ---: | ---: |
| Gewinner | F036 (Klassiker) | F036 | **F036** | F036 | F079 (**Sprinter**) |
| Bester Sprinter F023 | Rang **5**, +8,18 s | Rang 27, +10,65 s | **Rang 17, +5,82 s** | Rang 25, +5,54 s | Rang 24, +2,90 s |
| Größte Zielzeitgruppe | 81 | 53 | **80** | 65 | 65 |
| Rückstand größte Zielgruppe | +25,94 s | +41,98 s | **+19,04 s** | +35,38 s | +72,90 s |
| Fahrer binnen 60 Sekunden | 130 | 128 | **128** | 128 | **43 – deutlich schlechter** |
| Maximum 42-m-Abstandsgruppen unterwegs | 14 | 12 | **11** | 13 | 11 |
| Tatsächlich mit Sprintzug beauftragte Helfer-Sekunden | 0 | 13.570 | **15.100** | 13.970 | 14.930 |
| Davon tatsächlich in 30 m Nähe zum eigenen Sprinter | 0 | 12.793 | **14.372** | 12.899 | 14.271 |
| Späte Jagdhelfer-Sekunden | nicht separat erhoben | 21.970 | **20.710** | 20.310 | 0 |
| Nachweisbare Frontarbeit an der Hauptfeldspitze | 2.930 s | 2.963 s | **2.934 s** | 2.921 s | 2.216 s |

**CI-Belege:**
- A: [Actions #41825375164](https://github.com/Lancester/radsportmanager/actions/runs/41825375164): 298/299 bestanden; ein ausschließlich neues Testassert zählte fünf vorhandene Helfer fälschlich als vier. **Keine physikalischen Fehler**, aber vor allem sportlich schlechtere Positionierung.
- **B: [Actions #41826062511](https://github.com/Lancester/radsportmanager/actions/runs/41826062511), 299/299 Tests bestanden.** Die reparierte, tatsächlich kombinierte Sprintzug- und Jagdplanung ist **die Auswahl**.
- C: [Actions #41826797724](https://github.com/Lancester/radsportmanager/actions/runs/41826797724): 299/299 bestanden, aber aggressiveres Vorrücken führte zu kleineren Zielgruppen und schlechterem F023-Rang. Daher wieder zurück zu `advanceFrontShare=.25`, `leadoutFrontShare=.10`.
- D: [Actions #41827371327](https://github.com/Lancester/radsportmanager/actions/runs/41827371327): 299/299 bestanden, aber mehr unnatürliche Zielzeitverteilung (nur 43 binnen 60 s) und weniger echte Hauptfeld-Frontarbeit. **Ein Sprintersieg allein darf kein Tuningziel sein.** Deshalb vier jagende Sprintteams **erst im späten Abschnitt bis 35 km vor Ziel**, davor maximal drei.

**Fachliche Bewertung:** Variante B verbessert gegenüber der Baseline die zeitliche Nähe der größten Zielgruppe und die physische Gruppenstabilität etwas, dokumentiert vor dem Zielsprint bei **F023 vier reale Teamhelfer innerhalb 30 m, davon drei mit Sprintzugauftrag** (zuvor drei nahe Helfer, aber **null** Crew-Sprintzugmissionen). F023 bleibt ein echtes Rennergebnis, obwohl er im einzigen Seed nach Platz 5 auf Rang 17 zurückgeht: **5,82 Sekunden statt 8,18 Sekunden** Rückstand – eine wesentlich aussagekräftigere Mehrfachzielabwägung als „Sprinter muss gewinnen“.

Die Feldjagd wurde durch die neue Planung **nicht eindeutig erfolgreicher**: Der Sieger F036 bleibt diesmal vor dem Feld, und `mainFieldFrontWorkWithAssignedChaserS` steigt nur unwesentlich von 2.930 auf 2.934 s. Daher ist die Phase **echte taktische Missionsteilung/Sprintzug-Funktion, noch keine vollständig realistisch kalibrierte Einholwahrscheinlichkeit**.

**Isolationskontrolle:** Lille ist das einzige Profil mit dieser Zusatzfunktion. Boulogne, Liège und Hautacam sind bei Seed 2026 gegenüber PR #73 numerisch unverändert. Die 154er-20km-No-Attack-Gruppe bleibt vollständig zusammen, 30er-Konstanttempo ebenso. `legacy` bleibt unverändert Standard, `stable-pack` opt-in, großer Seed-Test erst am Ende.

**Status:** Die Version B ist wiederhergestellt und muss vor der endgültigen Zusammenführung noch einmal gegen den letzten Branch-Head in CI bestätigt werden. R-22 bleibt offen; Sprintteam-Überholung/Einholen der Flucht wird als nachgelagerte, separate KI-Frage weiterentwickelt, nicht durch künstliches Abwerten früher Ausreißer.
