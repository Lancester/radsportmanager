# R-22 – Sprinter früh im flachen Peloton positionieren (physische Wattstrategie)

**Datum:** 04.11.2026. **Auftrag des Nutzers:** Erkenntnis aus [R22_LILLE_SPRINTER_DIAGNOSE.md](R22_LILLE_SPRINTER_DIAGNOSE.md) aktiv umsetzen: Zielsprinter müssen früh in einen günstigeren Feldbereich aufrücken, damit sie nicht aus einem 154-Fahrer-Hauptfeld abgehängt werden, obwohl sie noch ausreichend W′ und CP besitzen. Keine direkte Positionskorrektur, kein freier Geschwindigkeitsbonus, keine Änderung der Grundphysik.

## 1. Ursprünglicher Fehler – tatsächlich gemessen

In der Lille-Referenz Seed 2026 (154 fiktive Fahrer, `groupRidingModel:'stable-pack'`) war **F023** nach Vorab-Sprintfähigkeit der stärkste Sprinter (Basis-CP 407,9 W, Tages-CP 406,66 W). Er lag bei **km 5 auf Platz 150**, km 20 Platz 149, km 100 Platz 126 und bei **km 120 nur noch in einer abgehängten 11er-Gruppe**, am Ziel auf Platz **150 / +267,50 s**. Seine W′-Reserve war im Ziel dennoch **91,2 %** – es gab keine frühzeitige W′-Erschöpfung. Team T04 hatte zwar Verfolgungsaufträge erteilt, aber keine wirksame frühzeitige Positionierung seines Sprinters.

## 2. Neue tatsächlich implementierte Funktion

**Quellen:** `src/engine/race/sprint-positioning.ts` und nachgeschaltete Wattforderung in `src/engine/race/race-simulator.ts`. `decideSprintPosition` arbeitet **rein anhand der tatsächlichen Gruppensituation**. Der Gruppenfahrregler bestimmt zunächst die physikalisch benötigte Wattzahl für das aktuelle Tempo; der zusätzliche Positionierungsregler darf davon ausgehend eine **begrenzt höhere individuelle Wattanforderung** stellen. Danach gelten weiterhin unverändert **R-19-Langzeitausdauer, Critical Power/W′, Aero und motion-core**. Es gibt keine direkte Korrektur von Geschwindigkeit, Zielzeit, Position oder Ergebnis.

Das Experiment ist streng begrenzt auf:
- **explizites `stable-pack`** und Strecke mindestens **140 km** mit höchstens **1.650 m berechneter positiver Gesamtsteigung** (Rennprofil aus Geometrie, *nicht* aus einem hardcodierten Streckennamen);
- aktive physische Gruppe mit mindestens **40** Fahrern; der Sprinter seines **Sprintteams** steht hinter dem **vorderen Drittel** der tatsächlich zusammenhängenden Gruppe (Zielschwelle 32 %, mindestens zwölf Fahrer davor);
- vor **85 %** der individuellen Renndistanz; W′-Reserve mindestens **32 %**; kein gerade aktiver Angriff, Sprint, Verfolgerauftrag, Helfereinsatz oder zwingende Erholung; reale unmittelbare Nachfahrerlücke maximal 42 m;
- Sprinter erhält bis zu **70 W Zusatzanforderung** über das für die Gruppe errechnete Mitfahrtempo, maximal **104 % Tages-CP**; wenn kein zusätzlicher realer Wattbedarf angefordert werden kann, wird nichts angewandt;
- **höchstens ein tatsächlicher naher Helfer pro Sprintteam** aus derselben physischen Gruppe, höchstens **24 m hinter** dem Sprinter, darf sich mit bis zu **30 W Zusatzanforderung** und einem absoluten Limit von **100 % seiner Tages-CP** annähern. Laufende Helfermissionen haben Vorrang. Ziel ist zunächst ein gemeinsamer günstigerer Gruppenbereich; ein ausgereifter, seitlicher Lead-out-Zug wird **nicht** behauptet.

**Realismusgrenze:** Das Feld bewegt sich weiterhin auf einer **1D-Rennlinie**. Überholen, Windschutz und Abstände entstehen durch die positionsabhängige 1D-Bewegung, ohne vollständige seitliche Überholspur oder Kollisionsmodell. Die Grenze „vorderes Drittel“ ist eine **taktische KI-Heuristik**, kein empirisch optimierter Pelotonplatz. Dieses Experiment beweist keine perfekten Sprintzüge oder reale individuelle Platzierbarkeit in einem dicht gedrängten 154er-Feld.

## 3. Erste vollständige Gegenprobe (vor Abschluss-Integration)

[GitHub Actions #41816164406](https://github.com/Lancester/radsportmanager/actions/runs/41816164406) – **285/285 Tests bestanden**, vier bestehende 154-Fahrer-Strecken, **genau Seed 2026**. Die unabhängige Vorab-Favoritenberechnung bleibt aktiv.

| Kriterium Lille | Vorheriger main-Stand PR #71 | Experiment frühe Positionierung |
| --- | ---: | ---: |
| **Stärkster Sprinter F023 im Ziel** | **150** | **41** |
| Zeitrückstand F023 | +267,50 s | **+17,53 s** |
| F023 bei km 20 | Rang 149 | **Rang 17** |
| F023 bei km 100 | Rang 126 | **Rang 45** |
| F023 bei km 120 | **Abgehängte Gruppe mit 11 Fahrern** | **Im zusammenhängenden Feld mit 148 Fahrern** |
| F023 bei km 160 | Rang 136, +2.802 m | **Rang 44, +384 m zur Rennspitze** |
| W′-Reserve F023 im Ziel | 91,2 % | **87,0 %** |
| Durchschnittliche Kurbelwatt F023 | 258,63 W | **218,85 W** |
| Größte Zielzeitgruppe | 86 | 81 |
| Rückstand dieser Gruppe | 15,77 s | 21,71 s |
| Fahrer innerhalb 60 s | 118 | **146** |
| Max. physische 42-m-Abstandsgruppen im Rennen | 16 | **11** |
| Angriffsevents | 49 | **42** |

**Auslegung:** F023 investiert früh gezielt physische Watt zum Positionsgewinn, fährt dann insgesamt sehr viel öfter im schützenden Feld statt spät abgehängt ohne Aero-Bonus. Trotz punktuell erhöhter Aufrückwatt ist seine **durchschnittliche Rennleistung niedriger**. Dass er Platz 41 statt 150 erreicht, ist deshalb nicht durch höhere erfundene Athletenleistung erklärt, sondern durch früher bessere Feldstellung und deutlich spätere/vermiedene Abspaltung. Die 42-m-Gruppenzahl ist ein interner Proxy, keine UCI-Gruppenzählung.

**Die drei weiteren Routen bleiben in demselben festen Seed exakt unverändert:**
- Boulogne 209,1 km: Klassiker-Sieger, 108 Angriffsevents, größte Zielgruppe 32 / +63,24 s;
- Liège 252 km: Sprinter-Sieger, 68 Angriffe, größte Zielgruppe 31 / +152,89 s;
- Hautacam 180,6 km: Kletterer-Sieger, 13 Angriffe, größte Zielgruppe 4 / +299,09 s.

**Noch ungelöst:** In Lille gewinnt weiterhin ein **Allrounder aus einer frühen, gut positionierten Spitzengruppe**. Der bestplatzierte Sprinter ist F114 auf **Platz 40**, F023 knapp dahinter. Die zeitliche/physische Feldpositionierung funktioniert deutlich besser; **Zusammenarbeit der Sprintteams bei der finalen Jagd und die wirksame Positionierung auf den letzten 10 km** bleiben eine eigenständige KI-Aufgabe. Nicht künstlich den „besten Sprinter“ zum Sieger setzen.

## 4. Prüflogik, Status und Folgeaufgaben

- `tests/r22-sprint-positioning.test.mjs`: physische Wattgrenzen, nicht erlaubte Flach-/Hügel-/Bergaktionen, schon vorn fahrende Fahrer, fehlende Reserve, aktive Teammissionen und maximal ein naher unterstützender Helfer; keine Performanceüberhöhung durch flache Idealfahrt.
- Die bisherigen `tests/r22-profile-smoke.test.mjs`, 154-Fahrer-20-km-No-Attack- und 30-Fahrer-Konstanttempo-Regressionen müssen weiter bestehen. Die neuen Diagnosezähler `sprintPositioningSeconds` und `sprintEscortSeconds` werden direkt in die vorhandenen `R22-PROFILE`- und `R22-LILLE-SPRINTER-AUDIT`-Logs aufgenommen.
- Erst mit einem erneuten grünen vollständigen PR-CI nach dieser letzten Diagnoselog-Erweiterung die Experiment-Implementierung auf `main` übernehmen. **Nicht** von erfolgreich bestandenem Unit-Test auf empirische Siegwahrscheinlichkeit schließen.
- Weitere schrittweise KI-Arbeit danach: tatsächliche Sprinter-/Helfer-Verfolgung und Sprintzug im letzten Renndrittel, ohne den gewonnenen pelotonstabilen Flachverlauf zu verschlechtern. Später separat Liège-Klassikerwirkung und Boulogne-Angriffshäufigkeit. **Große Multi-Seed-Abnahme erst am Ende und manuell.**


## 5. Verbindliche sportliche Korrektur durch den Nutzer – dreiphasiger Sprinter statt Frühpositionierung

**Nutzerkorrektur 04.11.2026: Die oben getestete frühe Top-17-Position bei Kilometer 20 ist zwar technisch möglich, aber **sportlich keine angemessene Zielstrategie**. Ein Sprinter fährt zunächst energiesparend und geschützt im Hauptfeld, beginnt typischerweise erst **im letzten Viertel** gezielt nach vorne zu kommen, und im Finale sind die *wirkliche* Position, tatsächlich nahe Helfer sowie die physische Sprintstärke entscheidend. Weiterer Nutzerhinweis: Nicht jeder Spitzen-Sprinter braucht einen eigenen Sprintzug. Manche finden eigenständig ein gutes **fremdes Hinterrad**. Ein fehlender Sprintzug verringert seine Chancen, darf aber keinen automatischen Sieg-Ausschluss verursachen.

Die ursprünglichen Abschnitte 2–4 dokumentieren den **historischen Version-A-Versuch** und sind nicht mehr die neueste KI-Definition. Diese Sektion **ersetzt die früheren pauschalen ersten-85%-Aufrückbedingungen**.

### Neue tatsächliche Entwicklungs-Implementierung auf PR #72

Die neue `sprint-positioning.ts` unterscheidet **drei Phasen** (taktische Heuristiken, nicht harte Radrenngesetze):

- **0–75 % Rennweg: mitfahren/schützen statt früh an die Spitze.** Bis 10 % des Rennens wird kein besonderer Aufrückauftrag vergeben; anschließend darf der Zielsprinter bei großen Gruppen lediglich im **hintersten etwa 12 %** eine sehr moderate, unter 97 % seiner CP begrenzte physische Kontaktpflegeleistung verlangen. Ein Platz im hinteren Mittelfeld ist sonst völlig akzeptabel. Frühzeitige Sprintzüge sind nicht aktiviert.
- **75–94 % Rennweg: gezielt nach vorne.** Als Ziel gilt das **vordere Viertel der tatsächlich gefahrenen Abstandsgruppe**. Mehrleistung nur aus realem Wattbudget und bei vorhandener W′-Reserve. Höchstens zwei **bereits tatsächlich nahe** Teamhelfer bekommen Begleitaufträge.
- **94 % bis Ende des Positionierungsvorgangs (spätestens 99,5 %): günstige Sprintausgangsstellung** im **vorderen Zehntel** der eigenen physischen Gruppe anstreben. Bis zu drei reale Teamhelfer dürfen aus maximal 30 m Umgebung begleiten. Bereits begonnene Attacken und der tatsächliche Zielsprint ab 250 m haben Vorrang. Die 1D-Beschränkung (keine Seitenlinie/Überholspur) bleibt unverändert.

**Neue Sprintzug-Tempokoordination `src/engine/race/sprint-leadout.ts`:** Tatsächlich vor dem Sprinter liegende Teamhelfer erhalten auf den letzten 10 km eine reine, widerstandsbasierte Begrenzung ihrer Wattanfrage, wenn sie zu weit vorausfahren. Das adressiert den im echten Vorabtest beobachteten Fehler, dass Helfer bei km 175 noch nah waren, bei km 180 aber ca. 67–74 m **vor** F023 in eine andere Abstandsgruppe gefahren waren. Kein direktes Abbremsen durch Positionstricks und keine künstliche Energierückerstattung; das tatsächliche Tempo folgt dem Bewegungsintegrator. Aktive Jagd-/Angriffs-/Erholungsaufträge haben Vorrang.

### Dritte, individuelle Fähigkeit: selbstständig ein geeignetes Hinterrad finden

Die Körper-/Leistungswerte `sprintSkill` und `criticalPowerW` bleiben unverändert; ein **neuer davon getrennter Fahrerwert** `wheelFindingSkill?:number` (**0..1**, optional für kompatible alte Spielstände, Validierung in `validateRace`) steht für die taktische Fähigkeit, einen schnellen Fahrer in realer Reichweite zu erkennen und sich an dessen Hinterrad zu hängen.

- Die fiktiven R-22-Profis erhalten deterministische unterschiedliche Werte, **unabhängig von ihrer bisherigen identischen .95-Sprintstärke**. Dies ist eine **nicht extern kalibrierte KI-Modellannahme**. Bei früheren/anderen Rennprofilen ohne Wert gilt standardmäßig `0.5`.
- `src/engine/race/sprint-wheel-choice.ts` prüft nur **tatsächlich vor dem eigenen Fahrer befindliche gegnerische Räder innerhalb der 24-m-Formationszone**, ihre wirkliche Geschwindigkeit und ihr Sprintvermögen. Der Sprinter darf dieses Rad nur durch **eigene, innerhalb CP/W′/R-19 begrenzte Wattarbeit** erreichen/halten. Es werden **keine** virtuellen Aero-Faktoren hinzugefügt. Physischer Windschatten entsteht nur durch die bereits bestehende Formation-Berechnung aus echten Positionen.
- Ein hohes `wheelFindingSkill` erlaubt frühere und präzisere Reaktion auf einen tatsächlich verfügbaren fremden Windschatten. Ein geringerer Wert kann dieselbe Gelegenheit ebenfalls nutzen, aber typischerweise später und mit weniger gezielter Wattnachfrage.
- **Eigener, real direkt vorausfahrender Teamhelfer hat Vorrang** vor dem fremden Hinterrad. Ohne eigenen Helfer wird die Sprintchance **nicht künstlich auf null** gesetzt.
- **Keine erfundene fixe Siegquote** („mit Sprintzug 30 %, ohne 10 %“). Bei realistischer späterer Mehrseed-Validierung wird die **empirische Häufigkeit** guter Sprintpositionen und Siege mit/nicht vorhandenem Lead-out analysiert – erst am Ende der schrittweisen KI-Arbeit, nicht durch ein hartcodiertes Ergebnislotto.

### Neue unabhängige Finale-Messwerte

Der bereits gespeicherte `sprintFinale`-Querschnitt der tatsächlich gefahrenen letzten 250 m führt **getrennt** `sprintSkill`, `wheelFindingSkill`, tatsächlichen Rang in der Gruppe, Größe dieser Gruppe, verfügbare W′-Reserve, **Anzahl realer Teamhelfer innerhalb 30 m** und Anzahl real **vor dem Sprinter** stehender Helfer. Neue Zähler der aktiven angewendeten Regler: `sprintPositioningSeconds`, `sprintEscortSeconds`, `leadoutPaceCoordinationSeconds`, `independentWheelFindingSeconds`.

**Wichtig:** Es sind beobachtbare Taktik- und Leistungsmerkmale und **keine** addierten Siegwatt oder Platzboni. Ein guter Sprintzug kann die Vorpositionierung und Energieschonung verbessern; der solo taktierende Sprinter bleibt konkurrenzfähig, wenn ein echtes geeignetes Fremdrad verfügbar und seine eigene Leistung ausreichend ist.

### Tatsächlich bestätigte Zwischenprobe vor der neuen Solo-Hinterrad- und Leadout-Erweiterung

[GitHub Actions #41817675032](https://github.com/Lancester/radsportmanager/actions/runs/41817675032): **286/286 Tests grün** mit den drei Phasen; Lille **F023 Platz 33, +11,08 s**, nach 20 km bewusst **Rang 134 statt verfrüht Rang 17**, nach 100 km **Rang 110**, späteres physisches Aufrücken; Boulogne/Liège/Hautacam unverändert. Das ist der **vorherige Zwischenstand**, nicht bereits ein Erfolg der **neu hinzugefügten** Solo-Hinterrad-/Leadout-Steuerung. Zusätzliche Diagnose [CI #41818209636](https://github.com/Lancester/radsportmanager/actions/runs/41818209636), ebenfalls **286/286 grün**: F023-Helfer F024 km175 noch -17,49 m, km180 +74,15 m vor F023 in einer anderen Abstandsgruppe. Daraus ergab sich die neue Tempo-Koordination.

**Gate für den aktuellen PR #72:** Erst nach vollständigem GitHub-CI mit *beiden* neuen getrennten Fähigkeiten und allen vier bekannten Einzelrennprofilen entscheidet die sportliche Ergebnisprüfung über die Integration. `legacy` bleibt Default, keine Physikänderung, kein automatischer Großlauf.
