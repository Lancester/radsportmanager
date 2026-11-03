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
