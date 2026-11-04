# R-22: Lille 2025 – Warum der stärkste Sprinter F023 nur Platz 150 belegt

**Stand: 04.11.2026, verifiziert aus experimentellem `stable-pack`, Seed 2026, 154 fiktive Fahrer.** Der Bericht diagnostiziert **nur dieselbe bereits vorhandene Einzelrenn-Simulation**; keine neuen Seeds oder weiteren Rennen. Grundlage: [PR #71](https://github.com/Lancester/radsportmanager/pull/71), [CI #41814392330](https://github.com/Lancester/radsportmanager/actions/runs/41814392330): **281/281 Tests bestanden, 0 Fehler**. PR #71 nach `main` integriert, Squash `369077b2f5a3a424d2959947b547a58a20a67d51`.

## 1. Fahrer vor dem Start und Ergebnis

| Kennzahl | F023 (bester modellierter Sprinter) | F078 (bestplatzierter Sprinter) | F057 (Sieger) |
| --- | ---: | ---: | ---: |
| Kategorie/Rolle | Sprinter / Sprinter | Sprinter / Kapitän | Allrounder / Kapitän |
| Teamstrategie | Sprint | Sprint | Offensiv |
| Basis-CP | 407,9 W | 398,2 W | 373,3 W |
| Tages-CP | 406,66 W | 402,20 W | 375,29 W |
| Sprint-Skill | 0,95 | 0,95 | 0,45 |
| Zielrang | **150** | **45** | **1** |
| Zielrückstand | **267,50 s** (4:27,50) | **23,32 s** | **0 s** |
| Ø tatsächliche Kurbelwatt | 258,63 W | 176,53 W | 300,65 W |
| Verbleibende W′-Reserve im Ziel | **34.539,30 / 37.886 J = 91,2 %** | 32.960 / 35.996 J = 91,6 % | 29.294,56 / 31.470 J = 93,1 % |
| R-19-Langzeit-Leistungsverfügbarkeit im Ziel | 87 % | 100 % | 80 % |

**Kernaussage:** F023 ist **nach dem vor dem Rennen berechneten Sprint-Fähigkeitsindex** der stärkste Sprinter im Testfeld, aber nicht der am besten platzierte. Er verliert **nicht aufgrund früh aufgebrauchter W′-Joule**. Die relativ geringe Durchschnittsleistung von 259 W bei Tages-CP ~407 W sowie über weite Strecken 100 % W′ sprechen gegen ein durchgehend zu hohes persönliches Tempo als primäre Ursache. Die spätere R-19-Reduktion auf 87 % im Ziel liegt zeitlich **nach** der entscheidenden frühen und mittleren Positionsproblematik.

## 2. Position und Abstand zur absoluten Rennspitze

| Checkpoint | F023 Rennrang (154) | Abstand zum aktuell Führenden | Physische Gruppensituation | W′-Reserve |
| --- | ---: | ---: | --- | ---: |
| km 5 | 150 | 60,28 m | zusammenhängende 154er-Gruppe | 100 % |
| km 20 | 149 | 222,84 m | physische Gruppe mit 150 Fahrern hinter vier Fahrern vorne | 100 % |
| km 40 | 146 | 521,47 m | Gruppe mit 140 Fahrern | 100 % |
| km 60 | 132 | 628,93 m | große Gruppe mit 148 Fahrern | 100 % |
| km 100 | 126 | 582,81 m | Gruppe mit 136 Fahrern | 98,69 % |
| km 120 | **126** | **1.275,02 m** | nur noch **11er-Gruppe** | 100 % |
| km 140 | 126 | 1.020,08 m | 11er-Gruppe | 100 % |
| km 160 | 136 | 2.802,31 m | 12er-Gruppe | 100 % |
| km 170 | 138 | 3.993,86 m | 29er-Gruppe | 100 % |
| km 180 | 150 | 3.739,34 m | isolierter Fahrer zum Checkpoint | 97,35 % |
| Ziel km 184,9 | **150** | Rückstand **267,50 s** | Rennentscheidung vorn längst gefallen | ~91,2 % W′ im Ziel |

**Wichtige Begriffsabgrenzung:** Die Abstände in Metern sind zur jeweils **absoluten Rennspitze** (manchmal kleine Ausreißergruppe), nicht stets zur vorderen Kante des Hauptfelds. Daher sind 500–600 m Rückstand im Laufe eines flachen Rennens bei einer Flucht nicht allein ein Problem. **Der wirklich kritische Befund** ist seine **Platzierung fast durchgehend im hinteren Feldbereich** und die **kleine physische 11er-Gruppe ab km 115–120**, während die anfangs große Gruppe weiter vorn fährt. Ein möglicher Positionsfehler wird durch große räumliche Lücken sehr viel schwerer korrigierbar.

## 3. Was die Team-KI tatsächlich macht – und was nicht

- F023 gehört zum Sprintteam **T04**. Dessen Helfer F024–F028 erhielten um Kilometer **41–49** mehrere **Team-Verfolgungsaufträge**. Es gibt im Ereignisprotokoll jedoch keinen Nachweis, dass diese Helfer den Sprinter vor dem entscheidenden Feldriss tatsächlich **in den vorderen Bereich zurückbringen**.
- Der allgemeine `decideGroupRiding`-Regler regelt Watt zum **Mitfahren beim vorhandenen Gruppentempo**, nicht zur strategisch bevorzugten vorderen Positionierung eines Zielsprinters. Gerade ein kräftiger Sprinter kann daher sparsam **weit hinten** bleiben und physisch real den Kontakt verlieren, sobald die Gruppe auseinanderreißt.
- Die bestehende `decideIntelligentCrew`-Logik sieht einen Sprintzug in der aktuellen Modellierung erst auf den **letzten etwa 10 km** vor. Ein so spät einsetzender Zug kann einem Sprinter nicht helfen, der bereits km 115–120 in einer abgehängten kleinen Gruppe steckt.
- F023 startete in den frühen Checkpoints schon auf Rang 150 und hatte an km 100 noch Rang 126, obwohl er bei fast voller W′-Reserve blieb. Er braucht **kein künstlich höheres CP-/Sprintskill-Profil**, sondern eine sinnvollere **frühzeitige Positions- und Schutzentscheidung**.
- Der tatsächliche Sieger F057 liegt bereits um km 5 auf **Rang 2** und bleibt fast das gesamte Rennen vorn. Er unternimmt in der Einzelrennen-KI zahlreiche Angriffe, darunter ungefähr im Abstand von **900 s** wiederkehrende Vorstöße. Das bleibt ein **separates** Thema der Attacken-/Fluchtökonomie, sollte nicht in demselben Patch wie die Sprinterposition verändert werden.

## 4. Weitere Profil-Regression nach Freigabe der selektiven Klassiker-KI

Die neue selektive Klassiker-Variante ist über [PR #71](https://github.com/Lancester/radsportmanager/pull/71) nach `main` integriert, auf Grundlage des früheren, wegen fehlender CI-Auslösung nicht separat freigegebenen PR #70 (als ersetzt geschlossen). Gemessen in [CI #41814392330](https://github.com/Lancester/radsportmanager/actions/runs/41814392330) – **281/281 grün**:

| Referenz | Siegerprofil | Attacken | Größte Zielzeitgruppe | Rückstand dieser Gruppe |
| --- | --- | ---: | ---: | ---: |
| Lille | Allrounder | 49 | 86 | 15,77 s |
| Boulogne | Klassiker | 108 | 32 | 63,24 s |
| Liège | Sprinter | **68** | 31 | 152,89 s |
| Hautacam | Kletterer | 13 | 4 | 299,09 s |

**Gegenüber PR #69** sind Lille, Boulogne und Hautacam für diesen Seed unverändert. Liège hat nun 68 registrierte Angriffe und 45 spezialisierte Punch-Ereignisse von 15 Fahrern auf den drei Schlüsselrampen (15 × La Redoute, 15 × Forges, 15 × Roche-aux-Faucons). Der Sieger bleibt Sprinter und der körperlich stärkste Klassikerfahrer **F003** landet auf **Platz 122** (zuvor 120). **Die neue Freigabe ist technisch bestanden, aber sportlich noch keine eindeutige Verbesserung der Lüttich-Selektion**; die Team-Puncheur-Nominierung allein genügt also nicht. Nicht als gelöst behaupten.

## 5. Nächster gezielter KI-Arbeitsschritt (noch nicht umgesetzt)

**Frühzeitiger Schutz des Sprinters – ohne ihn teleportieren zu lassen:**

1. In großen Flachfeldern die geeigneten Zielsprinter identifizieren und **früh vor dem Rennfinale** realistische vordere Positionierung als Teamziel vorsehen. Physisch durch tatsächliche Watt/relativen Geschwindigkeitsüberschuss und vorhandenen Windschatten, **nicht** durch direkte Positionstransformation.
2. Zuerst messen, ob ein kontrollierter Aufrückwunsch in einem 154-Fahrer-Peloton wirklich möglich ist, ohne das Feld per übertriebenem Beschleunigen zu zerreißen. 20-km-No-Attack- und 30er-Konstanttempo-Regressionsfälle müssen bestehen.
3. Sprint-Helfer sollen bei echter Gefahr einer Abspaltung auch dann zusammenarbeiten, wenn der Zielsprinter weit hinter dem Pacesetter liegt – und selbst genügend Energie sparen.
4. **Erst dann** prüfen, ob die stärksten Sprinter in Lille tendenziell besser platziert sind. Vier bestehende Referenzprofile, **ein Seed**, inkl. `R22-FAVORITES` und `R22-LILLE-SPRINTER-AUDIT`. Keine Multi-Seed-Reihe vor Abschluss der KI-Verbesserungen.
5. Lüttich-Klassiker-KI separat weiterentwickeln: passende starke Fahrer müssen die entscheidende Rampe erreichen und einen Angriff **nicht nur im Event-Log** beginnen, sondern gegebenenfalls mit physisch bezahlter Dauerleistung eine echte, auf den Folgekilometern nachhaltige Lücke erzeugen.

**Leitlinie:** R-22 offen, `legacy` Standard unverändert, `stable-pack` nur experimentell. Die bereits überprüften grundlegenden Steigungs-/CP/W′- und Bewegungsmodelle bleiben unverändert.
