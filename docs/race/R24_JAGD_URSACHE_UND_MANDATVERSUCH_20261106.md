# R-24 – Warum die Jagd-KI Aufträge abbricht; 150-s-Mandatsversuch (06.11.2026)

## Ausgangsfrage

Die adaptiv gesteuerte Jagd soll bei einer plausibel verfolgbaren Flucht nicht alle zehn Sekunden aufgrund einer kleinen Lageänderung stoppen. Der Koordinator `src/engine/race/peloton-chase.ts` verwendet `R22_CHASE.minimumActionSeconds = 150` bisher nicht im adaptiven Modus. Vor einer Korrektur wurde exakt diagnostiziert, warum laufende Teamaufträge enden.

## Diagnose: Ablehnungsgründe nachvollzogen

- Reine, von der Rennmechanik getrennte Instrumentierung auf [Draft-PR #85](https://github.com/Lancester/radsportmanager/pull/85), [Actions #42234376968](https://github.com/Lancester/radsportmanager/actions/runs/42234376968), zwei Seeds × Boulogne/Hautacam × Audit/Referenzfix (8 Vollrennläufe). Gleicher Diagnosecode auf beiden Seiten, stets nur ein geänderter Sportparameter: Referenz aus PR #84.
- **Konkret Boulogne Seed 42, Audit, km 141,93:** abgesetzte Spitzengruppe 43 Fahrer, größte Verfolgergruppe 79, ca. 602,9 m Abstand, noch beträchtliche Reststrecke, bisheriger Jagdauftrag 10 s alt, Teams T10/T05/T14 fallen vollständig aus der Jagd. Die neue `urgent`-Berechnung ist `false`. T10 ist `kapitaen_schuetzen`, hat 6 eigene Feldfahrer, darunter 5 verfügbare Helfer und keine eigene Teamspitze vor dem Feld. **Sein Jagdauftrag endet allein deshalb, weil die Dringlichkeitsschwelle nach unten überschritten wird.** Bei km 142,72 und 143,40 wiederholt sich die Abwahl; ähnliche Wechsel bei km 159–162. Team T05 hat zusätzlich einen eigenen Helfer voraus und ist deshalb gesondert nicht ohne Weiteres chase-berechtigt.
- **Audit Hautacam Seed 42, km 143,79:** 16 Fahrer voraus, 46er größtes Verfolgerfeld, 308,9 m Abstand; Team T06 mit 2 verfügbaren Helfern und Kapitän im Hauptfeld wird nach 20 s vollständig abgewählt, weil `urgent=false`. Für andere Teams kann hingegen `ownHelperAhead` oder Helfermangel ein sachlicher Ausstiegsgrund sein.
- **Wichtig:** Führungsgruppenwechsel, `ownLeaderAhead`, Helfermangel und verlorene körperliche Nähe dürfen nicht mit einer pauschalen Mindestmandatsklemme überschrieben werden. Die interessanten Fälle sind nur jene, bei denen dieselbe Mannschaft weiterhin jagdberechtigte Fahrer und ein bedrohtes Teamziel hat.
- Die `urgent`-Bedingung in `peloton-chase.ts` lautet: `gapFractionOfRemaining > 0.009 || projectedGapM > max(400, remainingM * 0.025)`. Ein bisschen unter dieser Schwelle erlischt die Jagdberechtigung für mehrere Teamstrategien, obwohl die Flucht als solche weiterhin erkannt wird.

## Isolierter Mini-Fix und Gegenprobe

- Ausschließlich im neuen [Draft-PR #86](https://github.com/Lancester/radsportmanager/pull/86), Branch `experiment/r24-chase-minimum-mandate-20261106`, auf PR #84 aufgebaut. Einzige Engineänderung: Weitergeltung eines bestehenden adaptiven Jagdauftrags unter 150 s, wenn noch `breakaway`, ein eigener Kapitän/Sprinter im Hauptfeld, geeignete Helfer und kein schützenswerter Teamfahrer vorne existieren. `optedOut`, `groupMembers`, Mindestgruppengröße, Reserveschwelle und das Ende echter Fluchten bleiben unverändert. **Kein Merge.**
- Sechs gezielte Tests: 150-s-Fortsetzung bei neutraler Dringlichkeit, Ende nach Frist, sofortiges Ende bei eingefangener Spitze, fehlenden Helfern, Kapitän vorne oder fehlender Hauptfeldzugehörigkeit. Eine erste Testfixture war versehentlich nur dreiköpfig, während der Algorithmus vier Fahrer verlangt; die Fixture wurde korrigiert. Danach Unit-Tests und TS-Prüfung grün.
- [Actions #42235015812](https://github.com/Lancester/radsportmanager/actions/runs/42235015812): zwei Seed-Jobs **success**. Vier A/B-Paare = 8 Vollrennsimulationen auf Boulogne/Hautacam Seeds 42/2026. Unterschied zwischen den Seiten **nur** dieser Mandatsschutz; die für beide Versionen identische passive Messinstrumentierung wurde aus PR #85 kopiert.

| Rennen | Seed | Jagdereignisse PR84 → PR86 | Teamwechsel | Echte Windfrontsekunden | Sieger | Sonstige Ereignisse |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Boulogne | 2026 | 102 → 102 | 14 → 14 | 771 → 771 | F134 → F134 | Attacken 55, Fluchten 7, eingeholt 4: gleich |
| Boulogne | 42 | 171 → 175 | 22 → 23 | 5750 → 5750 | F015 → F015 | Attacken 44, Fluchten 4, eingeholt 2: gleich |
| Hautacam | 2026 | 73 → 73 | 6 → 6 | 3595 → 3595 | F015 → F015 | Attacken 59, Fluchten 19, eingeholt 0: gleich |
| Hautacam | 42 | 89 → 89 | 17 → 17 | 1764 → 1764 | F015 → F015 | Attacken 52, Fluchten 14, eingeholt 2: gleich |

- Die 150-s-Neuregel hat **keine konsistente positive sportliche Wirkung** in dieser Stichprobe. Boulogne 42: vier zusätzliche Jagdereignisse und ein zusätzlicher Teamwechsel, aber keine zusätzliche Windfront-Arbeit. Die Unverändertheit der anderen Zusammenfassungen beweist keine bitgenaue Gleichheit jedes Fahrerzustands.
- Der Fix PR #84 selbst ist in diesem Paarvergleich **die gemeinsame Basis**. Seine zuvor belegte stärkere Feldkohäsion und stabilere Teamjagd werden dadurch nicht widerlegt.

## Technische Schlussfolgerung und Entscheidung

1. **Die ursprüngliche Ursache für hektische Jagdabbrüche ist identifiziert:** `urgent` kann für weiter jagdfähige Teams über kurze Schwellenüberschreitungen flackern. Die Team-KI koppelt deren Auftrag direkt an diesen aktuellen Dringlichkeitswert. Das ist besonders in der unverbesserten Audit-Engine deutlich.
2. **Unter PR #84 tritt der ursprüngliche Fehler deutlich seltener auf.** PR #84 stabilisiert die physische Formation und damit die analysierte Gruppenlage, wodurch Jagdentscheidungen weniger stark wechseln.
3. **PR #86 jetzt nicht mergen.** Eine zusätzliche Regel bringt nachweislich nicht den erwarteten Mehrwert und erhöht die Zahl der Mechaniken. Als dokumentiertes Experiment archivieren.
4. **Für Rennengine 1.0 stattdessen:** PR #84 als wichtigste, bereits mehrfach geprüfte Korrektur weiter abnehmen, dabei für die Teamjagd klare Mindestqualitäten definieren (physische Frontarbeit, realistischer Catch/Fail, geordnete Fälle bei geänderter Rennlage). Keine Ad-hoc-Jagdwatt, keine geschenkte Position, kein Profil-Siegerbonus. Erst nach breiter sportlicher Regression und Abnahme merge/freeze.

**Geschützt:** `main` und `develop/manager-mvp` behalten ihren bisherigen Engine-Code unverändert. PR #84, #85 und #86 sind ungemergt.
