# R-08 – Wiedereinscheren, zwei koordinierte Fahrer und begrenzte Querdynamik

**Stand: 03.11.2026 · gebündelte Entwicklungsrunde nach R-07.**

Die bisherigen **150 GitHub-Tests** und die Android-Workerseite für acht miteinander fahrende Fahrer sind die unveränderte Referenz. Die neuen Bausteine sind optional und betreffen noch **kein 160-Fahrer-Peloton und keine vollständige Radfahrdynamik**.

## 1. Wiedereinscheren nach physikalischem Überholen

`src/engine/ai/rejoin-controller.ts` implementiert die konservative, deterministische `decideRejoin`-Regel:

- Nur wenn der Fahrer mindestens eine vorher festgelegte Anzahl anderer Fahrer **tatsächlich physikalisch passiert** hat.
- Im R-08-Achtfahrer-Test wartet F8 bis zu **sieben** protokollierte Überholungen.
- Für die Rückkehr auf die ursprüngliche Spur muss ein **Mindestvorsprung von acht Metern** vor **allen Fahrern der Heimatspur** vorhanden sein.
- Die geplante seitliche Rückkehr wird im gesamten Vorhersagefenster auf Konflikte mit anderen Fahrern und bereits reservierten Spurwechseln geprüft.
- Im erfolgreichen Fall ist die seitliche Rückkehr wieder **eine echte zeitlich stetige Bewegung**. Keine Position wird teleportiert, und während der Rückkehr entfällt der Angriffswatt-Aufschlag. Ein abgeschlossenes Wiedereinscheren wird separat protokolliert.

**Bewusste Begrenzung:** Zunächst nur Rückkehr **vor die gesamte bestehende Reihe**, nicht intelligentes Einfädeln in winzige Lücken mitten im Feld. Bei geringer Sicherheit bleibt der Fahrer auf der Überholspur. Rückkehrentscheidung, Anzahl der Überholungen und gewählte Seite sind im Ereignisprotokoll sichtbar.

## 2. Zwei Fahrer mit gleichzeitig unabhängigen Spurentscheidungen

`src/engine/ai/lane-coordination.ts` ist eine reine, kleine Reservierungsfunktion. Die Agenten betrachten denselben alten Gruppenzustand. Bereits akzeptierte Bewegungsziele sowie aktive Spurwechsel werden bei weiteren Kandidaten berücksichtigt.

Die Entscheidung erfolgt in **fester Reihenfolge der stabilen Fahrer-IDs**, nicht nach der Reihenfolge der Fahrer im Eingabearray. Dies ist eine erste reproduzierbare Konfliktregel, keine Simulation von Fahrerpsychologie oder Vorfahrtsrecht.

Konfliktabschätzung: zweiachsige `sweptRectCollision`-Prüfung über **bis zu 5 s in 0,1-s-Stücken**, aktuell konstante Längsgeschwindigkeiten der Nachbarn und lineare geplante Querbewegungen. Für zwei nahe Fahrer, die **gleichzeitig dieselbe Zielspur** erreichen wollen, wird im Beispiel ein zusätzlicher vorläufiger Reservierungsabstand von **6 m** angenommen. Bei blockierter Seite darf ein Fahrer eine andere freie Seite wählen; sonst verschiebt er die Entscheidung.

Im Demonstrationslauf bekommen **F7 und F8** eigene, getrennte Regelagenten sowie individuelle CP/W′-Profile. Geprüft wird unter anderem, dass ihre Spurentscheidungen beim Vertauschen der Array-Reihenfolge gleich bleiben.

**Wichtig:** Die Vorhersage kennt keine plötzlich auftretenden Beschleunigungs-/Bremsentscheidungen anderer Fahrer; deshalb wird die tatsächliche Bewegung *weiter* nach jedem gemeinsamen Simulationsschritt mit der echten swept-Zweiachsprüfung überprüft. Bei unvermeidbaren Kollisionen bleibt das Verhalten ein expliziter Simulationsfehler, nicht ein unsichtbarer Sicherheits-Trick.

## 3. Seitliche Beschleunigung und erstes Kurven-Haftungsbudget

`src/engine/physics/steering-limits.ts` berechnet eine erste **kinematische** seitliche Bewegung mit begrenzter Geschwindigkeit und Beschleunigung. Für zeitlich glatte Spuren nutzt die neue optionale Steuerung ein kubisches Profil:

`y(u) = y_0 + (y_ziel - y_0)(3u² - 2u³)`, `0 ≤ u ≤ 1`.

Daraus werden die tatsächlichen Grenzen `v_y,max = 1,5|Δy|/T` und `a_y,max = 6|Δy|/T²` kontrolliert. Der Plan wird mit einer Mindestdauer erzeugt, bei der beide Limits eingehalten werden; seitliches Tempo beginnt und endet bei null. Der **alte** lineare R-06-/R-07-Modus bleibt ausdrücklich unverändert.

Optional kann ein vereinfachter konstanter Kurvenradius `R` die verfügbare seitliche Beschleunigung über `v²/R` und ein testweises Gesamtbudget begrenzen. Bei Überschreitung der Grenze erfolgt **eine explizite Fehlermeldung**, keine unsichtbare Reifenhaftung oder künstliche Verzögerung. Das bisherige Längsmodell rechnet weiterhin eine **flache, gerade Streckenkoordinate x**, keinen echten gebogenen Straßenverlauf. Es gibt noch kein voll gekoppeltes Fahrradmodell mit Lenkwinkel, Schräglage, vollständigem Reifenreibkreis, Nässe, Anpressung oder Sturzrisiko.

**Vereinbarte Testwerte** (keine empirische Kalibrierung): 0,8 m/s Querhöchstgeschwindigkeit, max. 1,5 m/s² Querbeschleunigung, 3 m/s² Modellgrip und fiktiver Kurvenradius 80 m. Der Kurvenbezug ist erst eine **Warn-/Budgetrechnung**, kein vollwertiges Bergab-/Kurvenpeloton.

## Vergleichsszenarien und technische Abnahme

- `createEightRiderRejoinExample(115)`: F8 überholt autonom und versucht, **nach sieben Überholungen und ausreichendem Vorsprung** wieder auf y=0 zurückzukehren.
- `createEightRiderMultiAgentExample(70)`: F7 und F8 planen gleichzeitig und müssen sich dank gemeinsamer Reservierung gegen denselben seitlichen Korridor absichern. Die neue Querdynamik ist in diesem Beispiel aktiv.
- Alle bisherigen `R03–R07`-Tests und Android-Presets bleiben ohne die neuen optionalen Felder verfügbar.
- Eigene Tests unter `tests/r08-rejoin-multi-steering.test.mjs` prüfen Rückkehrverweigerung bei zu wenig Überholungen/Vorsprung, mehrere kollidierende Spurpläne, alternative Spur, Vorhersage trotz vertauschter Fahrerreihenfolge, CP/W′-Energiebilanz und tatsächlich begrenzte Seitenbeschleunigung.
- Bestehender, einziger GitHub-Pages-Workflow führt die gesamte Node-Testserie und zusätzliche Browser-ESM-Smokes aus. **Die GitHub-Tests gelten erst nach tatsächlichem erfolgreichem CI-Lauf als bestanden.**
- Zwei zusätzliche Android-Presets `achtfahrer-wiedereinscheren` und `achtfahrer-mehrfach-ki` liefern anschließend Ergebnisdaten und Laufzeit. **Noch keine tatsächlichen Android-Laufzeiten** des neuen Szenarios bekannt.

## Weiter offen, vor einem vollwertigen Managerspiel

1. Sicheres Einfädeln in freiwerdende **Lücken** statt nur vor die gesamte Reihe, vorausschauende Koordination dutzender Fahrer und Konfliktauflösung bei unerwartetem Verhalten.
2. Echte zweidimensionale Fahrradphysik, Lenkwinkel, Schräglage, S-Kurven, Reifenhaftung, Gefälle und Querwind gemeinsam im Rennsolver.
3. Individuelle Fahrtechnik, Risikobereitschaft und wahrgenommene Rennübersicht als **KI-Input** statt pauschaler Bonusprozentwerte.
4. Kalibrierte CP/W′-Erholung und nachhaltige Leistung unter CP; FTP-Trainingsplaner, Ernährung, Erholung und Fahrerentwicklung.
5. Größere zusammenhängende Fahrerfelder und komplette Renndistanzen mit realistischen Ergebnissen, Managerentscheidungen vor dem Rennen und autonom fahrenden sportlichen Leitern.

**Kein ML-Framework, keine Cloud-Abhängigkeit, keine fremden Rennfahrerprofile oder Nutzerdaten im Repository.**



## R-08 GitHub-Abnahme: 169/169 und zwei echte KI-Szenarien (03.11.2026)

**Implementierung:** [Pull Request #38](https://github.com/Lancester/radsportmanager/pull/38) mit Merge-Commit `f4052cc149ae6897b2acacd3b377c6e46f7ed80a` auf `main` übernommen.

**Automatische Abnahme:** [GitHub-Actions-Lauf #41710587230](https://github.com/Lancester/radsportmanager/actions/runs/41710587230), `completed/success`. Der tatsächliche Job-Log bestätigt **169 Tests / 169 bestanden / 0 fehlgeschlagen**, erfolgreiche Browser-TypeScript-Kompilierung, alle bisherigen R-03–R-07-Smoke-Tests, neue R-08-ESM-Gruppentests und erfolgreiches **GitHub-Pages-Deployment** nach https://lancester.github.io/radsportmanager/.

**Drei in diesem Paket technisch erreichte Meilensteine:**
1. **Autonomes Wiedereinscheren:** Im Achtfahrer-Referenztest wählt F8 nach **7 physikalischen Überholungen** und genügend Vorsprung **einmal** die sichere Rückkehr, und die Fahrt beendet den Seitenwechsel wieder bei **y=0 m**; Event-Zahlen `rejoinChoices=1` / `autonomousRejoins=1`. Der Test benutzt eine sehr konservative Strategie: nur **vor** der gesamten Reihe, nicht zwischen anderen Fahrern.
2. **Koordinierte autonome Spurwahl von zwei Fahrern:** F7 erhält **y=+2 m**, F8 **y=−2 m**, obwohl beide zunächst dieselbe bevorzugte Seite wollen. Der simulierte Mehrfahrer-Gruppenlauf meldet **12 physikalisch berechnete Überholereignisse**. Die Spurreservierung wird nach **stabiler Fahrer-ID**, nicht Eingabe-Array-Reihenfolge ausgewertet; die betreffenden Regressionstests sind bestanden.
3. **Glatter Seitenwechsel mit Querbeschleunigungsgrenze:** Im R-08-Mehrfahrer-Referenzlauf betrug die größte vom Modell erfasste Querbeschleunigung der beiden aktiven Fahrer **0,7850666666666671 m/s²**, also unter der fiktiven Obergrenze **1,5 m/s²**. Das Kurven-Gripbudget ist bisher nur eine konstante-Radius-Prüfung für den Seitenwechsel, **keine realistische, gekoppelte Kurvenfahrt**.

**Browser:** Die bestehende Testseite hat jetzt zusätzlich die Knöpfe **„NEU · Überholen + Wiedereinscheren“** (115 simulierte Sekunden) und **„NEU · Zwei KI-Fahrer gleichzeitig“** (70 simulierte Sekunden). Beide verwenden die aus dem Original-TypeScript gebauten Module in einem Web Worker. **Noch keine echten Android-Laufzeiten** für diese zwei neuen Szenarien vorliegend. Kein Smartphone-Ergebnis erfinden; der GitHub-Runner ist kein Android-Gerät.

**Grenzen:** Ein Konflikt in der Vorhersage führt zur Zurückhaltung, aber eine unerwartete Änderung der Geschwindigkeit/Spur anderer Fahrer kann im laufenden, eigentlichen Solver weiterhin einen Sicherheitsfehler auslösen. Keine voll gekoppelte Fahrrad-Lenk-/Kurvendynamik, keine intelligenten mittigen Peloton-Lücken und noch keine vollständige Fahrerfeld-/Renn-KI mit 160 Fahrern. FTP, CP/W′ und langfristiges Training sind weiterhin nicht sportwissenschaftlich kalibriert.

**Nächste Aufgaben:** Wiedereinscheren in variierende, tatsächlich sichere Lücken; bewegliche Hindernisse und gemeinsames Aushandeln geplanter Spurwechsel; tatsächliche 2D-Lenk-/Kurven-/Bremshaftungsphysik und später ein vollständiges Rennfeld. [R-08-Modell](ai/R08_WIEDEREINSCHEREN_MULTIAGENT.md).
