# R-04 – Erster regelbasierter Fahrer-Agent: Lücke erkennen und nachsetzen

**Stand 03.11.2026 · Issue #27 · erster deterministischer Agent, keine neuronale KI**

## Wie ist diese „KI“ programmiert?

**Ohne externe KI- oder Machine-Learning-Bibliothek.** Wir verwenden eine **selbst geschriebene, nachvollziehbare Zustandsmaschine in TypeScript**. Sie ist vom bestehenden `motion-core.ts` bewusst getrennt.

**Fahrer-Beobachtung → Entscheidung → Wattanforderung → physikalische Wirkung**:

1. Der Agent sieht die aktuelle Lücke zum unmittelbar davor fahrenden Fahrer und beide Geschwindigkeiten.
2. Eine festgelegte Regel erkennt, ob die Lücke über den Schwellenwert von zunächst **5,0 m** wächst.
3. Falls genügend Abstand besteht, entscheidet er, **vorübergehend mehr Watt** zu treten, um den Anschluss wiederherzustellen.
4. Er darf höchstens **255 W** verlangen (demonstrativer Höchstwert); die Nachsetzzeit ist auf **30 s pro Anstrengungsphase** beschränkt, gefolgt von mindestens **20 s Erholungsfenster**. Diese Zeitbegrenzung ersetzt **noch kein CP/W′-Modell**.
5. Bei stark schrumpfender Lücke oder unter **4,2 m** wird das Nachsetzen beendet. Das ist eine **Sicherheitsvorschau**, noch keine automatische Bremse oder Kollisionsvermeidung.
6. Der **unveränderte gemeinsame Physikkern** berechnet aus tatsächlich befohlenen Watt, Aero-Faktor, Massenträgheit und Widerständen Geschwindigkeit, Position und Antriebsarbeit. Der Agent **ändert niemals direkt die Geschwindigkeit**.

**Wichtig:** Keine neuronale KI, kein Chatbot im Rennen, keine OpenAI-API, keine laufenden Kosten für KI-Inferenz. Die deterministischen Regeln sind schnelle TypeScript-Funktionen und laufen komplett **offline**.

## Softwarearchitektur

| Datei | Funktion |
| --- | --- |
| `src/engine/ai/gap-controller.ts` | **Reine Entscheidungsfunktion** `decideGapPower`, Eingabewerte/Parameter und Zustand `halten/nachsetzen/erholen` |
| `src/engine/physics/drafting-group.ts` | Optionales `gapAgents`-Feld; alle Agenten sehen denselben Anfangszustand des Zeitschritts; die Agentenbefehle werden an `advanceMotionStep` weitergegeben |
| `src/engine/physics/motion-core.ts` | **Unverändert**: Kraftgleichgewicht und numerische Bewegungssimulation |
| `tests/gap-controller.test.mjs` | 15 neue Regeln-/Integrationsprüfungen; außerdem alle bisherigen 80 Tests |
| `docs/benchmark/r03-worker.js` | Neuer Android-Test „8 Fahrer mit Regel-KI“ zusätzlich zum bisherigen Achtfahrer-Szenario |

Die alten Aufrufe von `simulateGroup` **ohne** `gapAgents` bleiben physikalisch unverändert. Auch die schon gemessenen Android-Ergebnisse des bisherigen Achtfahrer-Szenarios werden **nicht nachträglich umgeschrieben**.

## Beispiel: F8 verliert Anschluss und kann reagieren

Das Ausgangsszenario ist **dasselbe** wie zuvor: Acht Fahrer starten bei **39,6 km/h** in einer Reihe. Bei Sekunde **30** wird F8s Basispedalleistung durch einen äußeren Testbefehl um **45 W reduziert**. Ohne Agenten wurde bereits auf Android eine Endlücke von **100,414498 m** nach 120 virtuellen Sekunden gemessen.

**Mit Agent** beobachtet F8 nun einmal pro virtueller Sekunde den Abstand zu F7. Ist die Lücke ungefähr **5 m** und größer und die Distanz wächst, kann F8 **mehr Watt als seine aktuelle Basisvorgabe** verlangen – maximal 255 W. Der tatsächliche Tempo- und Distanzunterschied folgt **nur aus der Physik**. Die Entscheidungsereignisse bekommen einen nachvollziehbaren Grund, z. B. „Lücke wächst: kontrolliert nachsetzen“.

*Keine Erfolgsannahme vor dem integrierten Test:* Ob die Lücke wirklich kleiner wird, wie viel zusätzliche Antriebsarbeit entsteht und ob sicher gefahren wird, muss die GitHub-Testsuite samt physikalischer Gruppenengine prüfen. Geht die Gruppe auf derselben Spur physikalisch auf Kollision, ist das ein **Testfehler**, kein automatisches Ausweichen.

Der erste Test ist ein **isolierter Entscheidungsfall**, keine allgemeine Rennstrategie. Auch das externe 45-W-Testkommando ist kein angeblicher Leistungsdefekt; es ist bewusst nur ein vergleichbarer Anreiz für die Agentenreaktion.

## Warum keine fertige KI-Bibliothek?

Regeln wie „erkennt Lücke“, „prüft die Reserven“, „setzt nach“, „erholt sich“ sind mit einer kleinen **Zustandsmaschine** gut prüfbar. Eine umfangreiche KI-Bibliothek wäre jetzt zusätzliche Abhängigkeit ohne konkreten Nutzen; ein Sprachmodell wäre für deterministische, zeitsensitive Rennen unpraktisch, könnte unplausibel reagieren und müsste unter Umständen online rechnen.

**Später** sind **hierarchische Zustandsmaschinen oder Behavior Trees** für Angriffe, Führungswechsel, Teamaufgaben und Positionskämpfe denkbar – idealerweise weiterhin transparent und deterministisch. Es ist **noch nicht beschlossen**, welche Form sich bei größeren Szenarien bewährt. Reale dynamische KI kann zusätzlich auf einfache Heuristiken, situative Zielbewertungen und kontrollierte stochastische Unterschiede zurückgreifen. Alles muss mit der Physik und langfristigen Leistungsressourcen kompatibel bleiben.

## Was an den Agentenannahmen noch offen ist

1. **Physiologische Wattgrenze:** Derzeit 255 W als **vorläufiger Testdeckel** und 30 s Nachsetzzeit. Später muss CP/W′ und längerfristige Ermüdung entscheiden, ob diese Mehrleistung tatsächlich möglich ist.
2. **Wahrnehmung/Reaktionsfähigkeit:** Beobachtung einmal pro Sekunde, **noch kein individuelles** Können oder Wahrnehmungsfehler. Später Fahrertechnik, Rennübersicht, Positionierungsfähigkeit und Erfahrung.
3. **Abstandssicherheit:** Der Agent regelt nur Watt, **nicht Bremse oder Seitwärtsbewegung**; die heutige Kollisionserkennung kann eine ungültige Fahrt abbrechen. Später benötigt das Peloton eine realistische Brems-/Abstandsregelung.
4. **Taktik:** Der Fahrer versucht im ersten Modell immer, einer wachsenden Lücke zu folgen, solange der Leistungspuffer es erlaubt. Später müssen Rennsituation, Teamstrategie, Etappenlänge und Kräftehaushalt beeinflussen, ob Mitgehen sinnvoll ist.
5. **Gruppengröße:** Bislang maximal 8 Fahrer in der verbundenen Gruppenengine. Kein 160-Fahrer-Peloton, kein echtes 200-km-Rennen.
6. **Physikintegration:** Die Mehrfahrergruppe fährt bisher auf einer **flachen, windstillen Straße**. Dynamische Kurven/Abfahrten existieren in einem weiteren gemeinsamen Einzel-Fahrer-Kern, sind aber noch **nicht im Gruppen-Agenten-Rennen kombiniert**.
7. **Kalibrierung:** Windschattenreduktion in Gruppen und Entscheidungsschwellen sind vorläufige Testheuristiken.

## Reifegestand Rennsimulator

**Erste physikalische Grundlagen vorhanden**, inklusive R-01/R-02, dynamischer Abschnitte, Beschleunigung, Bremsung, Kurvenkontrollpunkten, Radträgheit, Windschatten für zwei und für 3–8 Fahrer sowie echten Android-Laufzeitmessungen.

**Noch keine vollständige Rennsimulation und kein spielbarer Teammanager:** Es fehlen dynamische 160-Fahrer-Feldlogik, sichere 2D-Positionierung und Kollision, echte Kurvenbögen im Peloton, Querwind, CP/W′/Ermüdung/Ernährung, verschiedene Fahrertypen und Ausrüstungsklassen, umfangreiche Fahrer- und Team-KI, Etappenabläufe inklusive Resultaten und Zeitabständen, Speicherstand, Team/Personal/Finanzen/Karriere und eine eigentliche Spieleoberfläche.

Die technische **Basisphase** ist weit fortgeschritten, aber **die Rennsimulation als Ganzes befindet sich noch in der frühen Prototypenphase**. Ohne definierte Gesamtanforderungen ist eine scheinpräzise Prozentzahl unzuverlässig.

## Test und Smartphone

Bisher waren **80/80 Tests** (Issue #23) erfolgreich. Diese Runde ergänzt **15 Agententests**. Erst ein erfolgreicher Gesamtlauf erlaubt die Aussage **95/95**. Der Android-Benchmark bekommt ein separates Preset **„8 Fahrer mit Regel-KI“**; dessen tatsächliche Handy-Rechenzeit ist erst nach einer echten Nutzer-Messung bekannt.

**Folgeschritt:** Resultate mit/ohne Agent vergleichen, dann sichere Abstands- und seitliche Positionsbewegung; anschließend eine sinnvollere Kombination aus Teamrollen, Fahrerfähigkeiten, Watt-/Ermüdungsmodell und Rennsituationen.
