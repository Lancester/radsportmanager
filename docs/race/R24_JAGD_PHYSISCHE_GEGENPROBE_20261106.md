# R-24 – Wechselwirkung Feldkohäsion, Attacken und Teamjagd: physische Gegenprobe (06.11.2026)

## Zweck und Umfang

Die Nutzerentscheidung lautet: Rennengine vor der nächsten Manager-Ausbaustufe **grob funktionsfähig** machen, insbesondere Feldzusammenhalt, Attacken und Teamjagd. Keine per-Rennstrecke ergebnisgetriebene Heuristik. Diese Diagnose ersetzt bloße Jagd-Eventzähler durch **tatsächlich berechnete Watt und Windexposition**.

- Basis `develop/manager-mvp` (Audit-Engine), verglichen mit der bisherigen Versuchskorrektur `experiment/r24-negative-accel-fix-20261106` ([Draft-PR #84](https://github.com/Lancester/radsportmanager/pull/84)).
- Bestehender [A/B-Bericht](R24_SPORTLICHE_GEGENPROBE_BH_20261106.md): 3 Seeds × Boulogne/Hautacam.
- Neues **rein passives** Messtool auf `experiment/r24-chase-telemetry-20261106` ([Draft-PR #85](https://github.com/Lancester/radsportmanager/pull/85)); der neue Messcode in `race-simulator.ts` wird im Workflow vor Ausführung **identisch in beide Checkouts kopiert**. Sportmotor unterscheidet sich somit weiterhin nur durch `local-group-reference.ts` (PR #84).
- [GitHub Actions #42228532005](https://github.com/Lancester/radsportmanager/actions/runs/42228532005): 2 Seeds (42, 2026) × 2 Strecken (Boulogne, Hautacam) × 2 Versionen = **8 vollständige, erfolgreich berechnete Renndurchläufe**. 154 fiktive Fahrer, Attacken, Ermüdung und Teamstrategie aktiv. Logs/7-Tage-Artefakte unter dem Workflow. Es handelt sich um dieselben Seeds wie bereits verwendete Sport-Gegenproben und **nicht** um neue unabhängige Monte-Carlo-Samples.

## Messbegriffe – absolut kritisch

- `chaseEvents` zählt registrierte Jagd-Auslösungen bzw. Teamaufträge, **keine** nachgewiesenen körperlichen Führungsstints.
- `assignedRiderSeconds` summiert alle Sekunden von Fahrern mit `crewMission==='jagd'` (auch wenn sie nicht führen).
- `windFrontRiderSeconds` summiert Sekunden von Fahrern mit Jagd-Mission, die **an der Front ihrer jeweiligen aktuellen 42-m-Abstandsgruppe** liegen (<=1 m) und Windfaktor >=.95 haben. Diese Summe kann **auch kleinere Gruppen und Anschluss-/Rejoin-Missionen** umfassen. **Nicht identisch mit expliziter Führung des größten Hauptfelds.**
- `highPowerWindFrontRiderSeconds` setzt dort tatsächlich abgerechnete Kurbelwatt >=86 % der effektiv verfügbaren CP voraus.
- `windFrontEnergyJ` summiert echte Kurbelenergie, aber ebenfalls über die Fronten *aller* beteiligten Gruppen; es gibt keinen Wind-/Geschwindigkeits- oder Siegbonus.
- Bei sprintfreundlichen Strecken existiert eine spezielle `namedChaseLeader`-Messung. Für Boulogne/Hautacam wird diese nicht verwendet, weshalb alte Nullwerte **NICHT** beweisen, dass niemand führt.

## Vergleichsmessungen (Audit → Versuch PR #84)

| Strecke | Seed | Jagd-Events | Jagdmissionen, Fahrer-s | Windfront, Fahrer-s | Hochwatt-Windfront, Fahrer-s | Windfront-Kurbelenergie |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Boulogne | 2026 | 643 → 102 | 109610 → 13110 | 10274 → 771 | 10274 → 771 | 4,261 → 0,343 MJ |
| Boulogne | 42 | 276 → 171 | 51760 → 50330 | 4503 → **5750** | 4503 → 5750 | 1,877 → **2,406 MJ** |
| Hautacam | 2026 | 235 → 73 | 50240 → 21830 | 7104 → 3595 | 7104 → 3581 | 2,859 → 1,537 MJ |
| Hautacam | 42 | 177 → 89 | 36680 → 31290 | 7564 → 1764 | 7559 → 1757 | 3,042 → 0,733 MJ |

*Fahrer-Sekunden addieren Einsatzzeiten aller passenden Fahrer. Kein Einzelhelfer fährt 10.274 Sekunden am Stück; maximale gemessene fortlaufende Windfront-Stints: Boulogne 2026 **574 → 204 s**, Boulogne 42 **235 → 195 s**, Hautacam 2026 **513 → 474 s**, Hautacam 42 **541 → 124 s**.*

**Interpretation:** Der Fix verändert tatsächlich physische Einsätze und nicht bloß Eventzähler. Die Wirkung ist **nicht monoton**: in Boulogne Seed 42 sinkt die Zahl der Jagd-Events von 276 auf 171, aber die Windfront-Arbeit **steigt** von 4503 auf 5750 Fahrer-Sekunden. Weniger Jagd-Aufträge = nicht generell weniger physische Arbeit. In Boulogne 2026 bleibt eine lange, weitgehend kompakte Verfolgergruppe hinter einem Solosieger; dieser Fall war bereits in `R24_SPORTLICHE_GEGENPROBE_BH_20261106.md` abgeklärt.

## Codepfad und plausible Modellrisiken

1. `race-simulator.ts` ermittelt alle zehn Sekunden räumliche Gruppen, wählt die **größte** als Hauptgruppe, liest `analyzeRaceSituation()`, ruft `coordinatePelotonChase()` und danach `decideIntelligentCrew()` auf. Durch einen neuen Gruppenzusammenhalt ändern sich deshalb die Eingangsdaten der Jagd-KI (welche Gruppe Hauptfeld ist, ob eine kleine Spitze voraus liegt, deren Abstand/Relativtempo). Es ist nicht überraschend, dass sich Teams, Jagdaufträge und reale Arbeit ändern. **Der geänderte Gruppenzusammenhalt kann bereits einen Großteil der Effekte erklären.**
2. Der Jagdkoordinator (`peloton-chase.ts`) definiert `minimumActionSeconds:150` und `cooldownSeconds:120`. Die Mindesthandlungsdauer und der Fall `if(breakaway&&!adaptive) return previous` gelten **ausdrücklich nur für nicht-adaptiven Modus**. Die aktuelle stable-pack-KI ruft ihn mit `adaptiveChase:true` auf; dort kann eine bestehende Teamzuweisung bei neu berechneter `choices`-Liste geändert bzw. verkürzt werden. Das ist ein **technischer Risikopunkt**, aber der kausale Anteil an beobachteten Stints ist noch nicht nachgewiesen.
3. `analyzeRaceSituation()` setzt voraus, dass die erste Gruppe nicht die größte ist, ehe es eine kleine Spitzengruppe erkennt. Besonders bei neu zusammenhängenden Gruppen kann die Jagd zwischen „relevant“ und „nicht relevant“ wechseln.
4. In der nicht sprint-spezifischen Team-AI sind Führungsrotationen von 75 s als Grundwert hinterlegt, für besondere Sprintjagdfälle bis 1200 s. Gemessene Windfront-Stints von 124–574 s sind daher **nicht automatisch ein Reglerfehler**, können durch Fahrerpositionsbewegung, mehrere KI-Takte und Gruppeneinteilung entstehen.
5. Gemessene Attacken und physische W′-Abrechnung bleiben aktiv. Kein Beleg für gratis Positionssprünge. Der direkte Solosieg von F134 in Boulogne 2026 wurde gesondert mit Attacke bei km 200,78, tatsächlichem W′-Verbrauch und 133er-Verfolgergruppe bei km 205 dokumentiert. Ein belastbares Urteil über die absolute Plausibilität eines 52-s-Vorsprungs erfordert vergleichbare reale Renndaten.

## Fachliche Schlussfolgerung

- **Kein Beleg, dass PR #84 pauschal die Verfolgungsfähigkeit zerstört.** Die Rennen unterscheiden sich in Geometrie und Teamstrategien; die Reduktion der physischen Jagd ist in drei der vier geprüften Konstellationen stark, in der vierten nehmen echte Frontsekunden zu.
- **Aber auch keine abschließende Sportfreigabe.** Die adaptive Team-KI braucht klare, messbare Bedingungen: Was ist eine echte kleine Spitze vor dem tatsächlich führenden bzw. größten Feld; wann darf ein Team einen mindestens 150-s-Auftrag beenden; wann führt ein nominierter Helfer körperlich am Windkopf des verfolgenden Hauptfelds?
- **Als nächste kleinste kausale Prüfung** kein größerer Monte-Carlo-Test und kein neues Sprint-/Fahrerphysikmodell, sondern nur eine passive **10-s-Jagdentscheidungszeitreihe** auf Boulogne 2026: physische Haupt- und Spitzengruppe, `leadingBreakaway`, Distanz, Teams `previous.active` → `next.active`, Grund bei Änderung; tatsächliche Führungsarbeit ausschließlich in der größten verfolgenden Gruppe. Damit unterscheidet man gerechtfertigtes Jagdende von algorithmisch flatterndem Jagdauftrag. Erst bei belegtem Flattern ein minimales, konditionales Mandats-Hysterese-Experiment. Bei realistisch wechselnder Rennlage kein Fix an der Jagd-KI.
- **Dokumentierter Stopp:** Eine einzelne gezielte Verfolgungs-Korrektur plus gepaarte Rennregression, dann Rennengine für die MVP-Stufe festlegen. Nicht wieder wochenlang alle Rennen nachjustieren.

**Status:** `main` und `develop/manager-mvp` sind in ihrer Engine unverändert; PR #84 und #85 bleiben ungemergte Experimente.
