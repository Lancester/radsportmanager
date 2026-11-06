# R-24 – 10-Sekunden-Jagdkoordination: Diagnose und Abgrenzung (06.11.2026)

## Ziel und Versuchsstatus

Auftrag: Vor dem Manager die Rennengine grob stabilisieren, insbesondere Feldzusammenhalt, Attacken und organisierte Verfolgung. **In dieser Runde wurde nur instrumentiert und gemessen. Keine produktive Rennregel wurde verändert.**

- Passive Instrumentierung im bestehenden ungemergten [Diagnose-PR #85](https://github.com/Lancester/radsportmanager/pull/85), Branch `experiment/r24-chase-telemetry-20261106` (auf Experiment PR #84).
- [Actions #42233742758](https://github.com/Lancester/radsportmanager/actions/runs/42233742758), beide Seed-Jobs erfolgreich. Audit-Checkout `develop/manager-mvp` und PR-84-Experiment erhalten **denselben** Diagnoscode in `race-simulator.ts` kopiert; die eine sportmechanische Differenz ist die Referenzregel `local-group-reference.ts`.
- 2 Seeds (42, 2026) × 2 Rennen (Boulogne, Hautacam) × 2 Rennversionen = **8 vollständige paarige Simulationsläufe**. Dieselben bereits untersuchten Seeds; keine neue unabhängige Zufallsstichprobe.
- Alle 10 Sekunden wird bei stabiler Gruppenversion der vorherige und neue Satz jagender Teams verglichen: Beginn, Ende, Teilwechsel, verbleibender Auftrag (`sinceS`), erkannte Spitzen- und Hauptfeldgröße, Abstand und prognostizierter Abstand.
- `shortStopsWhileGapValid` ist **bewusst nur ein Warnsignal:** Vorher mindestens ein Team aktiv, danach keines, zuletzt gespeicherte Mandatsdauer unter 150 s, `leadingBreakaway` noch wahr und erkannter Abstand >=65 m. **Diese Definition prüft nicht**, ob die Teamhelfer noch verfügbar sind oder das Rennen bald zu Ende ist.

## Zusammenfassung (Audit → Versuch PR #84)

| Strecke | Seed | KI-Entscheidungstakte | Teamwechsel | Start/Stopp | vollständige Stopps vor 150 s bei erkennbarer Spitze |
| --- | ---: | ---: | ---: | ---: | ---: |
| Boulogne | 2026 | 1909 → 1894 | 109 → 14 | 16/16 → 5/5 | 4 → 0 |
| Boulogne | 42 | 1746 → 1874 | 48 → 22 | 16/16 → 5/5 | 11 → 0 |
| Hautacam | 2026 | 1881 → 1987 | 33 → 6 | 14/14 → 3/3 | 7 → 1 |
| Hautacam | 42 | 1905 → 1998 | 47 → 17 | 20/20 → 8/8 | 11 → 3 |

Jede Simulation hat eine andere Anzahl Entscheidungstakte, weil sich die Simulationsdauer ändert. Ein Ereigniszähler ist deshalb keine unmittelbare Qualitätsmetrik. Unter der Versuchsreferenz wird die Teamjagd weniger häufig unterbrochen; ob dies eine *verbesserte Regel* oder eine *stabilere physische Rennsituation* widerspiegelt, ist getrennt zu prüfen.

## Konkrete 10-Sekunden-Fälle

- **Audit, Boulogne Seed 42:** bei km **141,93** sind `T05/T10/T14` seit **10 s** beauftragt; sie werden trotz erkannter führender Gruppe (43 Fahrer), Hauptfeld (79 Fahrer), Abstand **603 m**, Abstand/Reststrecke 0,009 wieder vollständig abgewählt. Weitere vergleichbare Stopps bei km 142,72, 143,40 und 159–162.
- **Audit, Hautacam Seed 2026:** bei km **143,20** werden `T04/T05/T10` nach **20 s** und bei km **143,57** nach **10 s** vollständig abgewählt, obwohl führende Gruppe 4 Fahrer, vermeintliches Hauptfeld 25 Fahrer und ein erkannter Vorsprung um **326–332 m** besteht.
- **PR84, Hautacam Seed 42:** bei km **136,03** fällt `T06` nach **100 s** weg, vorausliegend 4 Fahrer bei **1878 m** Vorsprung. Das kann ein sinnvoller Abbruch einer aussichtslosen Jagd, eine geänderte Gruppenwahl oder mangelnde Teamfähigkeit sein; die Entscheidungsdaten trennen dies noch nicht.
- **PR84, Boulogne Seed 2026:** keine solchen vorzeitigen vollständigen Stopps während einer erkannten Flucht. Die frühen Beendigungen bei km 21,87 und 29,15 fallen in der Diagnose explizit unter `no-leading-breakaway` (erkannte Flucht nicht mehr gültig) und sind **nicht** als Fehler zu verbuchen.
- Ereignisse **nachdem die Rennspitze bereits das Ziel erreicht hat** haben teils `gapFractionOfRemaining > 1`. Diese dürfen nicht in der sportlichen Hysterese-Kalibrierung als normal verfolgbarer Rückstand gelten. Im Modus `RaceInput` ist der Führende für die Taktik zu diesem Zeitpunkt bereits ein anderer noch aktiver Fahrer; `remainingM` ist klein. Das muss beim künftigen Bericht ausgefiltert werden.

## Codeursache und korrekte Interpretation

`src/engine/race/peloton-chase.ts`:

1. `R22_CHASE.minimumActionSeconds = 150` wird im Block `if (!adaptive && ...)` angewandt. Bei `stable-pack` wird jedoch `adaptiveChase: true` übergeben.
2. Der adaptive Modus behält bestehende Teams bereits dann bei, wenn sie in `choices` weiterhin vorkommen (`stillEligible`). Das ist sinnvoll.
3. Ein vorzeitiger Abbruch trotz erkennbarer Flucht entsteht, wenn **kein Team aus dem vorherigen aktiven Satz in der neu berechneten `choices`-Liste bleibt**. Die Liste hängt von der **gegenwärtig größten physischen Abstandsgruppe** (`mainGroupIds`), Teaminteressen, Helferreserven und eigenen vorn liegenden Fahrern ab. Die Liste kann sich bei Gruppen-Neuordnung ändern, auch wenn die abgesetzte Spitze weiter existiert.
4. Folglich wäre eine pauschale `150-s-Halteklemme` falsch: Sie könnte Teams ohne Fahrer im tatsächlich verfolgenden Feld, mit entkommenem eigenen Kapitän oder ohne Reserven künstlich zum Jagen verpflichten. Der bisherige Code vermeidet genau solche Phantomaufträge teilweise durch `stillEligible`.
5. Der auffällig starke Effekt von PR #84 auf Jagdzähler ist also mit geändertem **physischen Gruppenzusammenhalt** und damit neu berechneten Teamvoraussetzungen vereinbar. **Der kausale Grund jeder einzelnen Team-Abwahl ist noch nicht nachgewiesen.** Die Taktikänderung ist real, aber nicht automatisch inkorrekt.

## Kleinstmögliche anschließende Ursachenprüfung (statt Fix auf Verdacht)

Vor **irgendeiner** Regeländerung den ersten kurzen Abbruch aus Boulogne Seed 42 isolieren und bei genau zwei 10-s-Takten pro Team die Kriterien aufzeichnen:

- echte Hauptfeld-IDs und alle verfügbaren Helfer pro zuvor aktivem Team;
- Position eigener Kapitän/Sprinter relativ zur Ausreißergruppe und Hauptgruppe;
- `choices` vor `stillEligible`, Ablehnungsursache `not-in-main`, `no-helpers`, `own-leader-ahead`, `own-helper-ahead`, `no-interest` oder `choice-limit`;
- wechselte tatsächlich die *größte* Gruppe oder stieg nur deren Rang im Feld?

**Nur wenn** die Lage unverändert und das Team weiterhin körperlich/strategisch berechtigt ist, wäre ein minimaler Hysterese-Fix im Koordinator gerechtfertigt. Falls die Hauptgruppe physisch wechselt oder das Team keinen jagdfähigen Helfer hat, keinen künstlichen Auftrag erzwingen; besser Gruppenidentifikation/Diagnose prüfen.

**Status:** Keine sportliche Änderung und kein Merge von PR #84/#85. Frühere Tests der lokalen Beschleunigungsreferenz bleiben gültig. Ziel weiterhin: eine begrenzte Engine-1.0-Abnahme statt unendlicher Einzelheuristiken.
