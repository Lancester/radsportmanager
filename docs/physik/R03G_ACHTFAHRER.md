# R-03G: Acht Fahrer gemeinsam – erster Schritt zur Pelotondynamik

**03.11.2026 · Entwicklungsprototyp für Issue #23 · Noch keine taktische Fahrer-KI**

## Ergebnis und Abgrenzung

Erstmals gibt es einen einzigen Simulationslauf für **3 bis 8 Fahrer**, die sich gegenseitig über Windschatten, Längsabstände und Geschwindigkeiten beeinflussen. Jeder Fahrer hat eigene Masse, CdA, Pedalleistung, Geschwindigkeit und Längs-/Seitenposition. **Alle verwenden denselben bereits vorhandenen physikalischen Integrator `advanceMotionStep` aus `motion-core.ts`.**

Es ist **noch kein vollständiges Peloton**: Der Test findet auf einer ebenen, windstillen Strecke statt. Die seitliche Spur wird vorgegeben und nicht automatisch verändert. Es gibt weder taktische KI noch Fahrertechnik-, Ermüdungs- oder Risikoentscheidungen.

## 1. Modell: Einflüsse mehrerer Vordermänner

Aus dem Zweiermodell übernehmen wir die bestehende Luftwiderstandsreduktion durch einen Vordermann:

`w_j = exp(−max(0, (x_j − x_i) − d_min) / L) × exp(−0,5 × ((y_j − y_i)/B)^2)`

Dabei sind `x_j > x_i` vorausfahrende Nachbarn; `d_min = 1,8 m` ist der vereinfachte Mindestabstand von Fahrerzentren. `L = 1,8 m` und `B = 0,75 m` sind vorläufige Längs-/Seitenskalen.

**Neu: Mehrere Vorderleute schützen denselben Fahrer.** Wir kombinieren sie nicht durch unbegrenzt aufsummierte Rabatte, sondern über eine begrenzte Vereinigung:

`f_Aero(i) = 1 − R_max × (1 − Produkt_j (1 − w_j))`

Mit dem vorläufigen `R_max = 0,35` liegt der Faktor immer zwischen **0,65 und 1**. In der Bewegungsgleichung gilt dann weiterhin:

`F_Luft = 0,5 × Luftdichte × CdA × Geschwindigkeit² × f_Aero`.

**Wichtig:** Diese Produktformel ist eine **technische Testheuristik**. Sie zeigt die notwendige Mehrfahrer-Kopplung, bildet aber **noch nicht** den durch CFD/Windkanal gemessenen Strömungszustand eines echten Pelotons ab. Insbesondere Einfluss von Hinterleuten auf Vordermänner, Wirbelschleppen, Seitenwind und Gruppendichte fehlen.

## 2. Zeitschritte und Kollisionen

Pro Zeitschritt (0,2 s in der Demo) geschieht:

1. Aus **allen bisherigen Positionen gleichzeitig** die Aero-Faktoren der acht Fahrer bestimmen.
2. Für **jeden Fahrer** mit derselben alten Uhrzeit und seinem Aero-Faktor den **vorhandenen Physikintegrator** aufrufen.
3. Prüfen, dass Fahrer auf derselben Spur sich nicht überschneiden oder unbemerkt aneinander vorbeispringen. Bei drohender Kollision **Fehler statt erfundener Ausweich-KI**.
4. Erst danach alle Positionen, Geschwindigkeiten und mechanischen Energiearbeiten gemeinsam übernehmen.
5. Erreicht die Lücke zwischen zwei benachbarten Fahrern mehr als eine vorläufige Schwelle (8 m im Beispiel), wird ein `gap-opened`-Ereignis **festgestellt**, nicht als KI-Entscheidung erzeugt.

Die Eingabereihenfolge der Fahrer darf keine Rechenpriorität erzeugen. Das wird separat geprüft.

## 3. Achtfahrer-Beispiel – eine entstehende Lücke

**Fiktive Testaufstellung:** Acht Fahrer mit je 72 kg Körpermasse + 8 kg Material, gleicher CdA=0,30 m², Crr=0,004, Luftdichte=1,2 kg/m³, 97,5 % vorläufigem Antriebswirkungsgrad. Alle starten mit **11 m/s = 39,6 km/h** in einer Reihe. Abstand der Fahrerzentren: **3,4 m**.

Für das Anfangsprofil legen wir jedem Fahrer aus seinem anfänglichen Windschatten genau die Pedalwattzahl fest, die bei 39,6 km/h benötigt wird. So ist die Formation zunächst stationär – **kein unsichtbarer Autopilot und keine nachträgliche Geschwindigkeitskorrektur**.

- **F1 (Führender)** fährt im Wind und benötigt im Basismodell ca. **281,14 W**.
- Der letzte Fahrer **F8** benötigt im Anfangswindschatten ca. **242,11 W**.
- **Ab Sekunde 30** erhält F8 den ausdrücklich vorgegebenen Befehl: **45 W weniger**. Die sieben Fahrer davor behalten ihre Wattvorgaben.
- Dadurch verliert F8 Geschwindigkeit, die Lücke zu F7 wächst und der Windschatteneffekt wird schwächer. Eine als „offene Lücke“ definierte 8-m-Schwelle wird im lokalen Kontrolllauf **um Sekunde 44** überschritten.
- Nach 120 Sekunden entsteht im lokalen vereinfachten Kontrolllauf eine Lücke von **rund 100 m**. F8 fährt dann rund **34,8 km/h**, die sieben anderen weiterhin ungefähr 39,6 km/h.

Diese Werte stammen aus einem **isolierten lokal getesteten Modell mit mathematisch entsprechender Bewegungsfunktion**. Vor endgültiger Übernahme müssen GitHub-Actions-Tests die **Integration mit dem tatsächlichen gemeinsamen Physikkern** bestätigen. **Das ist kein realistisch validiertes „Abgehängtwerden“**: 45 W Leistungsabfall, Positionen und 8-m-Ereignisschwelle wurden bewusst als Demonstration vorgegeben.

## 4. Was wurde tatsächlich programmiert?

- `src/engine/physics/drafting-group.ts`: 3–8 Fahrer, alle vorausfahrenden Nachbarn, gedeckelte Windschattenwirkung, synchroner Zeitschritt, Arbeitsbilanzen, Kollisionserkennung, Lückenereignisse, deterministische externe Wattbefehle.
- `tests/drafting-group.test.mjs`: **16 neue Tests**. Isoliert lokal unter Node.js 22.16 mit mathematisch entsprechendem Testintegrator bestanden. Die gesamte bestehende GitHub-Suite umfasst bislang **64 frühere Tests** und wird im Pages-Workflow zusammen mit den 16 neuen Prüfungen ausgeführt.
- `docs/benchmark/r03-worker.js`: neues **Achtfahrer-Gruppen-Preset** im Browser-Web-Worker; weiterhin die vorhandenen drei unabhängigen Zweier-Presets.
- `docs/index.html`: neuer Knopf „8 Fahrer gemeinsam · 120 s“.
- `package.json`: beide Original-TypeScript-Einstiegspunkte für Browser übersetzen. **Keine zweite handgeschriebene JavaScript-Physik.**
- `.github/workflows/r03-benchmark-pages.yml`: zusätzlicher kleiner ES-Modul-Smoketest für acht Fahrer; keine neuen periodischen oder großen Actions-Workflows.

## 5. Was sagt uns der Android-Test?

Der neue Test berechnet **acht sich wechselseitig beeinflussende Fahrer**. Das ist technisch eine andere Art Arbeit als zuvor 80 voneinander unabhängige Zweiergruppen.

Nach erfolgreicher GitHub-Pages-Veröffentlichung soll der Nutzer auf derselben öffentlichen URL das Preset **„NEU · 8 Fahrer gemeinsam · 120 s“** starten und den Ergebnisbericht mit `mode: "achtfahrer-gruppe"`, Git-Commit, drei gemessenen Rechenzeiten, Prüfsumme, Endlücke und Lückenereignis-Zeitpunkt hier im Chat teilen.

**Noch nicht gemessen:** tatsächliche Android-Rechenzeit dieses neuen Presets, Verhalten einer 160-Fahrer-Gesamtgruppe, 200-km-Etappenlaufzeit und Akku-/Temperaturwirkung. Das alte Android-Ergebnis **191,8 ms für 80 unabhängige Zweiergruppen** ist kein Gruppen-Benchmark.

## 6. Alle noch offenen fachlichen Entscheidungen

1. **Positionierung und Fahrtechnik:** Fahrer sollen später selbst entscheiden können, wie sie im Feld aufrücken, welche Lücke sie nutzen und wann sie sich vorne positionieren. Diese **Fahrer-KI ist noch nicht programmiert**. Zuerst physikalisch mögliche Spurbewegung und sichere Abstände modellieren.
2. **Echte Gruppen-Aerodynamik:** Die Produktformel und 35-%-Grenze sind noch nicht gegen 3–8-Fahrer-CFD-/Windkanaldaten kalibriert. Später Vordermann-Effekt, stärkere Innenfeldabschirmung und Seitenwind ergänzen.
3. **Abstandskontrolle und Kollisionen:** Der erste Prototyp erkennt unzulässige Überlappung und bricht ab. Im späteren Rennen müssen Fahrer auf drohende Kollisionen durch Bremsen, Ausweichen und Positionswahl reagieren – unter Berücksichtigung ihrer Fahrtechnik.
4. **Fahrerphysiologie:** Wattwerte sind noch externe Vorgaben und unabhängig von Ermüdung abrufbar; spätere Ausdauer-, W′-, Ernährungs- und Trainingsmodelle nötig.
5. **Simulationsleistung:** Vor einer 160er-Gruppe echte Android-Messungen mit 8, dann 20 Fahrern und nachvollziehbarer Nachbarschaftssuche; eventuell Zellen-/Nachbarlisten statt aller paarweisen Vergleiche.
6. **KI-Art:** Ich empfehle für die spätere Fahrerentscheidung zunächst **regelbasierte, nachvollziehbare Agenten mit situativen Bewertungen** statt eines neuronalen KI-Modells oder externer Online-KI. **Noch nicht beschlossen**; die Rennphysik soll in jedem Fall mechanisch berechnet bleiben.

**Nächster Schritt:** Den neuen GitHub-Pages-Lauf und sämtliche 80 Tests kontrollieren; danach den neuen Achtfahrer-Test auf Android durchführen, Messwerte prüfen und die nächste Ausbaustufe (selbsttätige sichere Positionsbewegung) gemeinsam priorisieren.


## GitHub-Integration und Pages-Bereitstellung bestätigt (03.11.2026)

**Pull Request:** [#26](https://github.com/Lancester/radsportmanager/pull/26) wurde mit Squash-Commit `5caca0213f1ece1d32ae7d8345b686909a5ba2a9` erfolgreich in `main` übernommen.

**Erfolgreicher GitHub-Actions-Lauf:** [#41683075141](https://github.com/Lancester/radsportmanager/actions/runs/41683075141) vom 03.11.2026, Job `deploy` – `status=completed`, `conclusion=success`. Die tatsächlichen Job-Logs bestätigen:
- **80 Tests ausgeführt, 80 bestanden, 0 fehlgeschlagen** (64 alte + 16 neue).
- Bestehende R-03-TypeScript-Engine plus neues Gruppenmodul für Browser erfolgreich übersetzt.
- ESM-Smoketest: sowohl Zweier- als auch **Achtfahrer-Modul erfolgreich** aus dem generierten JavaScript importiert; Achtfahrer-Test hat **600 Rechenschritte** abgeschlossen und eine Lücke erzeugt.
- GitHub-Pages-Upload und -Deployment erfolgreich. Bestätigter Link: **https://lancester.github.io/radsportmanager/**.

**Neuer Android-Testknopf:** `NEU · 8 Fahrer gemeinsam · 120 s`. Der Browser-Web-Worker lädt `drafting-group.js`, führt die gekoppelte Achtfahrer-Rechnung dreimal aus und zeigt Median-Rechenzeit, Prüfsumme, Lückenweite und Ereigniszeit. **Noch nicht tatsächlich vom Nutzer auf Android ausgeführt**; die obigen erfolgreichen Ergebnisse stammen aus dem GitHub-Runner, nicht vom Smartphone.

**Für den Nutzer:** Testseite öffnen, ausschließlich den neuen Achtfahrer-Knopf betätigen, Ergebnis kopieren und im Chat mitteilen. Die bisherigen unabhängigen Zweier-Tests bleiben unverändert verfügbar.

**KI weiterhin nicht enthalten:** Feste Spur, feste Startleistung, ein von außen veranlasster −45-W-Befehl für F8 nach 30 s. Reaktion, Windschatten, Position, Geschwindigkeit und Lückenereignis entstehen im dynamischen Physikmodell. Fahrertechnik, Positionsentscheidungen und Teamtaktik später als separate Agenten.
