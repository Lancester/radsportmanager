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
