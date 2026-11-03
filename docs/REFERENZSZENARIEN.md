# Issue #1 – Anforderungen und Referenzszenarien der Rennsimulation

**Stand:** 03.11.2026 · **Status:** Erster fachlicher Entwurf zur gemeinsamen Abstimmung; keine validierte Engine und keine gemessenen Resultate.

**Ziel:** Vor dem Programmieren eine prüfbare Beschreibung erstellen: Was simulieren wir? Welche Ein-/Ausgaben gelten? Welche vereinfachten Tests muss die Engine bestehen? Was soll ausdrücklich **noch nicht** simuliert werden?

Verbindliche Grundsätze: offline spielbarer Einzelspieler-Radsportmanager; Teammanager plant und delegiert; sportliche Leiter führen Rennen autonom; keine Steuerung während des Rennens; Ergebnisse entstehen aus einem intern fortschreitenden Rennzustand, nicht aus einem nachträglichen Sieger-Würfelwurf.

## 1. Der Umfang der ersten Engine

### Stufe M0 – physikalischer Einzeltest

- Ein Fahrer auf einem Streckenabschnitt: Leistung, Gesamtmasse, Steigung, Wind, Rollwiderstand, Aerodynamik → Geschwindigkeit, Strecke und Zeit.
- Zunächst konstante Eingaben, dann abschnittsweise Profile.
- Reproduzierbar, numerisch stabil und mit Referenzrechnungen vergleichbar.

### Stufe M1 – individuelle Leistungsgrenzen

- Verschiedene Fahrerprofile, Leistungs-Dauer-Unterschiede, begrenzte Kurzzeitreserve, Ermüdung in einem definierten einfachen Modell.
- **Critical Power/W′ ist ein Kandidat**, nicht die abschließend festgelegte Lösung. Wiederauffüllung und mehrstündige Dauerbelastung verlangen eigene Prüfung.

### Stufe M2 – Gruppen und Windschatten

- Mehrere Fahrer auf derselben Strecke, Positionen und Abstände, vorläufig vereinfachte Gruppenbildung.
- Schutz im Windschatten, Führungsarbeit und Aufreißen einer Gruppe; keine 3D-CFD-Simulation.

### Stufe M3 – autonome Taktik

- Teams und sportliche Leiter mit Rollen und Rennzielen; Flucht, Nachführung, Kräfte sparen, Attacke, Schutz des Kapitäns.
- Entscheidungen hängen von der Rennsituation und der jeweils verfügbaren Information ab.

### Stufe M4 – vollständiger Prototyp und Bericht

- Fiktives 160-Fahrer-Feld über ungefähr 200 km, mit Streckenabschnitten, mehreren Teams, Ereignisprotokoll, Ergebnisliste und Rennbericht.
- Android-Laufzeit messen, danach Realismus und Zufallsstreuung systematisch prüfen.
- Kein Saisonmodus, Sponsoren, Transfers, 3D-Rennverlauf oder Live-Multiplayer in dieser Phase.

**Wichtig:** M0–M4 sind Entwicklungsschritte, keine gleichzeitigen Mindestvoraussetzungen des allerersten Programms. Ein valider M0-Test ist wertvoller als ein schnell entstandenes, aber unplausibles 160-Fahrer-Rennen.

## 2. Fachliche Mindestanforderungen

| ID | Bereich | Prüffähige Anforderung |
| --- | --- | --- |
| A-01 | Reproduzierbarkeit | Gleiche Daten + gleiche Engine-Version + gleicher Zufalls-Seed ergeben identische Ergebnisse und Ereignisfolgen. |
| A-02 | Einheiten | Alle Größen in SI-Einheiten; keine Vermischung von km/h und m/s, Prozentsteigung und Steigungsbruchteil, kJ und J. |
| A-03 | Physik | Leistung, Gesamtmasse, Steigung, Roll-/Luftwiderstand und Wind wirken physikalisch plausibel auf das Tempo. |
| A-04 | Physiologie | Leistungen sind an individuelle Grenzen und einen Zustandsverlauf gebunden, nicht unbegrenzt abrufbar. |
| A-05 | Windschatten | Vergleichbare geschützte Fahrer benötigen bei gleicher Geschwindigkeit und Rahmenbedingung weniger aerodynamische Leistung als isolierte Fahrer. |
| A-06 | Gruppen | Positionen, Abstände und Windschatten beeinflussen einander; keine bloße unabhängige Einzelfahrersimulation. |
| A-07 | Taktik | Vorgaben und KI-Entscheidungen verändern reale Aktionen und Belastungen, keine willkürlichen Siegerboni. |
| A-08 | Unsicherheit | Plausible Zufallseinflüsse verändern Voraussetzungen oder Ereignisse; kein nachträglicher Gewinnerwechsel. |
| A-09 | Bericht | Jeder berichtete Angriff, Gruppenriss, Einbruch oder Pannenvorfall muss in strukturierten Simulationsereignissen nachweisbar sein. |
| A-10 | Robustheit | Keine NaN-/Infinity-Werte, negative Zeit, unerlaubte negative Kurzzeitreserven oder unmögliche Ergebnisreihenfolgen. |
| A-11 | Performance | Gleiche Engine in Node.js und Browser/Web Worker; Laufzeit bei echten Android-Tests messen. |
| A-12 | Testbarkeit | Szenarien und Seed sind als versionierte, textbasierte Eingabedaten abbildbar; Regressionstests dokumentieren den genutzten Code-Commit. |

### Wichtige Abgrenzung

Die **physikalische Plausibilität** eines isolierten Fahrers kann mit Formeln und Referenzwerten geprüft werden. Ob sich **Gewinnerhäufigkeiten** in echten Rennen realistisch verhalten, ist eine spätere **statistische Kalibrierungsfrage**. Wir setzen keine scheinbar wissenschaftlichen Siegquoten ohne geeignete Daten fest.

## 3. Vorgeschlagenes Eingabe-/Ausgabemodell

Alle Zahlen zunächst in SI-Einheiten und als fiktive, explizit dokumentierte **Testszenarien**.

**Pflichtdaten beim isolierten Test M0:**

- `scenarioId`, `scenarioVersion`, `seed` (Seed bei rein deterministischem Test ohne Wirkung).
- `segments[]`: `lengthM`, `gradeFraction` (z. B. 0,07 für 7 %); optional `headingDeg`, `windAlongMps`.
- `environment`: `airDensityKgM3`, `rollingResistanceCrr`, optional `windCrossMps`.
- `riders[]`: `id`, `riderMassKg`, `bikeAndEquipmentMassKg`, `cdaM2`, `powerW` (für konstante M0-Leistung).

**Erweiterungen für M1–M4:**

- Fahrer: Leistungs-Dauer-Kurve, `criticalPowerW`, `wPrimeJ` (sofern Modell bestätigt), kumulative Ermüdung, Rolle, Team.
- Team: `teamId`, `directorId`, Strategie und Rennziel.
- Simulation: Gruppenposition, Abstand, geschützte Position, aktuelles Leistungsziel, Energiezustände, taktische Ereignisse.

**Pflichtausgabe:**

- `results[]`: `riderId`, `finishTimeS`, `rank`, gegebenenfalls `timeGapS`.
- `stateSummary[]`: relevante Endzustände der Fahrer, Energiewerte und Belastung.
- `events[]`: `eventType`, `simTimeS`, `distanceM`, beteiligte IDs, `causeCode`, dokumentierte Auswirkung.
- `metadata`: `scenarioId`, `scenarioVersion`, `seed`, `engineVersion`, `stepPolicy`, `durationMs`.

Bei der ersten Iteration werden noch nicht alle Felder benötigt. Validierung und Versionierung der Eingaben müssen von Anfang an vorgesehen sein.

## 4. Referenzszenarien

**Alle Beispielwerte sind frei gewählte Testparameter, keine bereits gemessenen oder auf Profiradsport kalibrierten Daten.** Erwartete Effekte sind zunächst **qualitativ oder mathematisch begründete Eigenschaften**. Exakte Zeit- und Siegesgrenzen werden erst nach fachlicher Prüfung festgelegt.

### R-01 – Ebene: Leistung gegen Luft- und Rollwiderstand (M0)

- **Strecke:** 20 km, 0 % Steigung, Windstille.
- **Fahrer:** 72 kg Körpermasse + 8 kg Rad/Ausrüstung, CdA = 0,30 m², Crr = 0,004, Luftdichte = 1,20 kg/m³.
- **Varianten:** konstante 250 W gegenüber 300 W; sonst identisch.
- **Erwartung:** 300 W führt bei gleichen Bedingungen zu höherem Tempo und kürzerer Fahrzeit. Erforderliche Leistung steigt mit Geschwindigkeit nicht linear; Luftwiderstand gewinnt bei höherem Tempo an Gewicht.
- **Prüfung:** Referenzberechnung der Leistungsbilanz und Einheitenkontrolle; keine unmöglichen Geschwindigkeiten.
- **Noch offen:** Wirkungsgrad, Beschleunigungsphase, genaue numerische Toleranz.

### R-02 – Berg: Masse, Leistung und Steigung (M0)

- **Strecke:** 8 km, konstant 7 % Steigung, kein Wind.
- **Fahrer A:** 60 kg Fahrer + 8 kg Material. **Fahrer B:** 80 kg Fahrer + 8 kg Material. Beide identische CdA/Crr und 300 W.
- **Erwartung:** Der leichtere Fahrer kommt bei gleichen Leistungen und sonstigen Bedingungen schneller nach oben; die Steigungsarbeit wird korrekt berücksichtigt.
- **Gegenprobe:** 0 % und 7 % bei sonst gleichen Eingaben; auf dem Anstieg steigt der Leistungsbedarf für dieselbe Geschwindigkeit.
- **Prüfung:** Mechanische Energiebilanz und plausibler Anstieg der Fahrzeit.
- **Noch offen:** Abfahrten, Leistung beim Bremsen, Grenzgeschwindigkeiten.

### R-03 – Windschatten und Führungswechsel (M2)

- **Strecke:** flacher gerader Abschnitt von 10 km, Windstille, definierte gemeinsame Geschwindigkeit.
- **Fahrer:** zunächst zwei, später vier technisch identische Fahrer; einer fährt vorn, einer direkt dahinter; weitere Positionen werden variiert.
- **Erwartung:** Der geschützte Fahrer benötigt bei derselben Geschwindigkeit weniger **aerodynamische** Leistung. Führungswechsel verändern, wer wie viel Energie spart. Bei großem Abstand verschwindet der Windschattenvorteil.
- **Prüfung:** Vergleich der benötigten Leistung, Positions- und Energiebilanz.
- **Noch offen:** numerische Windschattenfaktoren; Reihen-, Quer- und Großgruppenmodell, Seitenwind.

### R-04 – Wiederholte Attacken und begrenzte Kurzzeitreserve (M1)

- **Fahrer:** beispielhaft CP = 300 W, W′ = 20.000 J (Modellannahme, nicht geeicht).
- **Belastung:** 90 s mit 420 W; danach Erholungsfahrt; danach zweiter Angriff.
- **Erwartung für die *vereinfachte Entleerungsrechnung*:** `(420 - 300) W × 90 s = 10.800 J` verbraucht; rechnerisch 9.200 J verbleibend, **bevor** eventuelle Erholung eintritt. Reserve darf nicht negativ werden und nicht über den Anfangswert wachsen.
- **Prüfung:** Energiebilanz und deterministisches Verhalten; ein erneuter Angriff ist ohne ausreichende Erholung eingeschränkt.
- **Noch offen:** Erholungsfunktion, Grenzen des CP-/W′-Modells, Ernährung und Ermüdung über Stunden.

### R-05 – Fluchtgruppe gegen das Peloton (M3/M4)

- **Strecke:** fiktive überwiegend flache 200-km-Etappe; 160 Fahrer in mehreren Teams.
- **Situation:** Früh bildet sich eine kleine Fluchtgruppe. Das Feld entscheidet abhängig von Teamzielen, Abstand, Restdistanz und Ressourcen über die Nachführung.
- **Vergleich:** Gleiche Ausgangslage und möglichst gleiche Seeds, aber in einer Variante organisierte Nachführarbeit, in der anderen wenig Nachführarbeit.
- **Erwartung:** Nachführung verändert reale Leistungsabgabe und den zeitlichen Abstand; eine Flucht kann je nach Konstellation gelingen oder scheitern. **Keine garantierte Erfolgsquote**.
- **Prüfung:** Plausible Entwicklung des Abstands und dokumentierte taktische Entscheidungen.
- **Noch offen:** Gruppengeschwindigkeiten, Informationslatenz, Motivation und Zusammenarbeit in Ausreißergruppen.

### R-06 – Sprint nach Vorbelastung (M1/M3/M4)

- **Strecke:** flacher Zielsprint nach bereits 180 km simulierter Belastung.
- **Fahrer:** zwei Profile: hoher Kurzzeitleistungs-Peak vs. bessere Ausdauer, jeweils mit eigenem Vorermüdungszustand.
- **Erwartung:** Im ausgeruhten isolierten Sprint ist hohe Kurzzeitleistung vorteilhaft, aber die vorherige Beanspruchung, Windschattenposition und der Startzeitpunkt verändern das Ergebnis.
- **Prüfung:** Kein 180-km-Rennen ohne Wirkung auf die Endleistung; Strategie verändert den Sprintkontext.
- **Noch offen:** Positionierung in dichter Gruppe, Anfahrerzüge, Kurven und Sturzrisiken.

### R-07 – Seitenwind und mögliche Windkante (später M4)

- **Strecke:** flache offene Straße mit konstantem Seitenwind.
- **Situation:** Eine organisierte Gruppe fährt gestaffelt; ungünstig platzierte Fahrer verlieren Schutz.
- **Erwartung:** Position und Windrichtung verändern die aerodynamische Belastung. Ein Gruppenriss kann entstehen, ist aber nicht durch Zufall allein vorgegeben.
- **Prüfung:** Vergleich der aerodynamischen Belastungen, Ereignisprotokoll und Gruppenabstände.
- **Noch offen:** Straßenbreite, geometrische Staffelung, Windrichtung in globalem Bezugssystem.

### R-08 – Kontrolliertes Einzelzeitfahren (später M1/M4)

- **Strecke:** definierter 20-km-Kurs mit Steigung und Gegen-/Rückenwind, ohne fremde Fahrer.
- **Situation:** Fahrer wählt konstante oder variable Pacing-Strategie innerhalb desselben Energiemodells.
- **Erwartung:** Die Leistungsgleichung bleibt konsistent, der Pacing-Plan verändert Tempoverlauf und Energiereserven; keine unberechtigten Windschattenboni.
- **Prüfung:** Energiebilanz, Zwischenzeiten, Ergebnisreproduktion.
- **Noch offen:** Optimale Pacing-Heuristik und physiologische Kalibrierung.

## 5. Prüfplan und Akzeptanzkriterien

### Für **alle** Szenarien

- [ ] Szenariodatei ist versioniert und enthält sämtliche Startwerte und Einheiten.
- [ ] Gleiche Version + gleicher Seed → identische Ergebnisse; verschiedene Seeds dürfen bei aktivem Zufallsmodell variieren.
- [ ] Alle Fahrerzustände und Zeitangaben sind endlich und im gültigen Wertebereich.
- [ ] Ergebnisliste enthält jede startende und regulär finishende Person genau einmal; Ausfälle sind separat begründet.
- [ ] Ereignisse sind zeitlich und räumlich konsistent; der Bericht ergänzt keine unbelegten Ursachen.
- [ ] Ein Parameter wird gezielt verändert; daraus resultierende Effekte werden dokumentiert.
- [ ] Laufzeit und Speicherbedarf sind messbar; Zielschwellen werden nach Android-Messung festgelegt.

### Für den **ersten fachlichen Meilenstein (Issue #1)**

- [x] Mehr als fünf unterschiedliche Referenzszenarien sind beschrieben.
- [x] Der schrittweise Funktionsumfang M0–M4 ist festgehalten.
- [x] Mindestanforderungen und Ein-/Ausgabeentwurf sind dokumentiert.
- [x] Offene Modellannahmen und Forschungslücken sind erkennbar.
- [ ] Gemeinsame Prüfung der Priorität und Vereinfachungen durch den Nutzer als Radsportfan.
- [ ] Nach Rückmeldung: Freigabe der Tests R-01/R-02 als erste Implementierungsaufgaben.

**Issue #1 bleibt bis zur gemeinsamen fachlichen Abstimmung offen.** Die obigen Kästchen markieren Dokumentation, nicht einen bestandenen Softwaretest.

## 6. Was vorerst bewusst NICHT dazugehört

Echte Fahrerdaten, lizensierte Teams/Marken, Transfers, Saisons, Sponsoren, Stürze, Defekte, Rennfunk im Detail, Live-Online-Modus, Echtzeit-3D-Visualisierung und hochaufgelöste CFD.

Unfall-/Pannenereignisse können später als strukturierte Zufallsereignisse hinzukommen. Sie dürfen nicht zur künstlichen Korrektur unerwünschter Ergebnisse dienen.

## 7. Fachlich belastbare Startquellen und Grenzen

1. **Martin et al. (1998)**, *Validation of a Mathematical Model for Road Cycling Power*. Journal of Applied Biomechanics 14(3), 276–291. DOI: [10.1123/jab.14.3.276](https://doi.org/10.1123/jab.14.3.276). Bestätigt die grundsätzliche mechanische Leistungsmodellierung unter untersuchten Bedingungen, nicht automatisch ein Pelotonmodell.
2. **Blocken et al. (2018)**, *Aerodynamic drag in cycling pelotons: New insights by CFD simulation and wind tunnel testing*. Journal of Wind Engineering and Industrial Aerodynamics 179, 319–337. DOI: [10.1016/j.jweia.2018.06.011](https://doi.org/10.1016/j.jweia.2018.06.011). Großgruppen-Windschatten ist stark von Position und Gruppengeometrie abhängig. Die Ergebnisse gelten für die untersuchten Konfigurationen und werden nicht pauschal auf alle Rennen übertragen.
3. **Skiba et al. (2014)**, *Validation of a novel intermittent W′ model for cycling using field data*. International Journal of Sports Physiology and Performance 9(6), 900–904. DOI: [10.1123/ijspp.2013-0471](https://doi.org/10.1123/ijspp.2013-0471). Begründet die weitere Prüfung des W′-Ansatzes, nicht dessen unkritische Anwendung.
4. **Skiba & Clarke (2021)**, *The W′ balance model: Mathematical and methodological considerations*. International Journal of Sports Physiology and Performance 16(11), 1561–1572. DOI: [10.1123/ijspp.2021-0205](https://doi.org/10.1123/ijspp.2021-0205). Warnung vor unterschiedlichen Modellannahmen und Grenzen der W′-Wiederauffüllung.

## 8. Fragen für die nächste gemeinsame Fachrunde

1. Soll der erste fahrbare **Rennprototyp** mit *Einzelfahrer/Einzelzeitfahren* beginnen und danach die Gruppe ergänzen? (Technisch empfohlen.)
2. Welche der Rennarten machen nach deiner Radsporterfahrung am häufigsten unplausible Computersimulationen sichtbar: **Massensprint**, **Gebirgsankunft**, **Klassiker/Flucht**, oder **Windkante**?
3. Wollen wir später realistische **Anfahrer-/Positionskämpfe** im Sprint modellieren, obwohl sie deutlich schwieriger sind als reine Wattberechnungen?

Eine endgültige Festlegung dieser offenen Punkte ist für die jetzige Dokumentation noch nicht nötig.


## 9. Ergänzende Referenzszenarien zur Feldposition (03.11.2026)

Der Nutzer hat das Fahren im Feld als eigenständige Fahrerfähigkeit festgelegt. Neue Vorschläge:

- **R-09 – Positionierungsfähigkeit bei gleicher Physiologie:** Bei ansonsten gleichen Fahrern/Teams und gleichen Seeds soll höheres Positionskönnen **statistisch häufiger** zu günstigeren Positionen vor Schlüsselstellen oder geringerem Aufrückaufwand führen. Keine garantierten Siege und kein direkter Wattbonus.
- **R-10 – Enge Zufahrt vor einem Anstieg:** Frühes vs. spätes Aufrücken; Straßenbreite, Verkehr und Teamhilfe bestimmen die tatsächlich erreichbare Position. Gruppenriss und Energieeinsatz nachvollziehbar.
- **R-11 – Ziehharmonika-Effekt:** Enge Kurven und Beschleunigungswellen können für hintere Fahrer zusätzliche Belastungen verursachen; keine pauschale Strafe für jede hintere Position.

Vollständige Fachanforderung, Zustandsmodell, offene Entscheidungen und Quellen: [PELOTON_POSITIONIERUNG.md](PELOTON_POSITIONIERUNG.md).

Der bisherige Abschnitt mit acht Szenarien bleibt als ursprünglicher Entwicklungsstand erhalten; **jetzt sind elf Szenarien R-01 bis R-11 konzeptionell beschrieben**. Es wurde noch keines softwareseitig validiert.


## 10. R-01 – umgesetzter numerischer Ersttest (03.11.2026)

Der fachliche Ebenenfall **R-01** wurde als ausführbarer **stationärer** Einzelfahrertest begonnen. Herleitung, Annahmen, Referenzwerte, sieben lokale TypeScript-Tests, Einschränkungen und offene Punkte sind unter [physik/R01_EBENE.md](physik/R01_EBENE.md) dokumentiert.

- **250 W am Pedal** (η = 0,975): 37,938288 km/h, 31:37,82 min für 20 km.
- **300 W am Pedal** (η = 0,975): 40,545023 km/h, 29:35,80 min.
- Der vorläufige Antriebswirkungsgrad und andere Beispielparameter sind ausdrücklich **noch nicht final kalibriert**.
- 7/7 lokale Tests bestanden, **kein** GitHub-Actions-Lauf und noch **keine** Gesamt-Rennsimulation.

## 11. R-02 – tatsächlich berechneter Bergreferenzfall (03.11.2026)

Der stationäre Anstieg R-02 ist als gemeinsame physikalische Erweiterung von R-01 programmiert. Vollständige Rechnung, Annahmen, Kosten-/Materialausblick und neun neue Tests: [physik/R02_BERG.md](physik/R02_BERG.md).

- 8 km Straßenlänge, 7 % Steigung = **558,633 m Höhengewinn**, nicht genau 560 m.
- **60 kg Fahrer + 8 kg Material, 300 Pedal-W:** **19,342501 km/h**, **24:48,95**.
- **80 kg Fahrer + 8 kg Material, 300 Pedal-W:** **15,682984 km/h**, **30:36,39**.
- Kontrollvarianten: 2 kg leichtere Ausrüstung und geringeres CdA; bei 0 % exakt identische Resultate zu R-01.
- Lokal 9 neue Tests + 7 alte R-01-Tests bestanden. **Kein** Android- oder GitHub-Actions-Test.
- Alle Zahlen gelten für das stark vereinfachte, konstante stationäre Modell. Die Materialeffekte sind Demonstrationswerte, nicht produktbezogene Zusagen.


## 12. R-12 – dynamischer Fünf-Abschnitte-Kurs (03.11.2026)

Die stationären Szenarien R-01/R-02 wurden um einen **ersten dynamischen Einzeltest** ergänzt: Ebene (1 km, 250 W), +7 % Anstieg (1 km, 300 W), −7 % Abfahrt (1 km, 0 W), 200 m ausdrücklich befohlenes Bremsen (20 N, 0 W) und 800 m Wiederbeschleunigung auf der Ebene (250 W).

- Ausgangstempo 28,8 km/h; **keine** zurückgesetzte Geschwindigkeit an Abschnittsgrenzen.
- Fiktiver Fahrer und Material zusammen 80 kg; vorläufig η = 0,975.
- **4 km / 470,8713 s** Gesamtzeit, **60,68 km/h** Spitzengeschwindigkeit, netto 0 Höhenmeter.
- 15 neue lokale TypeScript-Tests bestanden; bisherige 16 stationäre Tests nicht erneut ausgeführt, deren Quelldateien unverändert.
- Die Bremskraft wird vorgegeben, **nicht** durch vorausschauende Kurven-KI bestimmt.
- Modell-/Kraftformeln, Eingaben, Grenzfälle, offene Fragen: [physik/DYNAMISCHE_STRECKE.md](physik/DYNAMISCHE_STRECKE.md).
- Umsetzung: [PR #15](https://github.com/Lancester/radsportmanager/pull/15), [Issue #14](https://github.com/Lancester/radsportmanager/issues/14) abgeschlossen.

Die bereits gelisteten elf Szenarien R-01 bis R-11 bleiben unverändert. R-12 ist ein **numerisch getestetes Physikbeispiel**, **keine** validierte realistische Rennsimulation.

## R-03 – erste tatsächliche Windschatten-Implementierung (03.11.2026)

Der vorher spezifizierte R-03-Test wurde als **einfaches Zweier-Szenario** mit 2 eigenständig bewegten, aber gemeinsam berechneten Fahrern begonnen.

- **Statischer Wattvergleich:** 11 m/s (39,6 km/h), ein fiktiver Fahrer mit 72+8 kg, CdA 0,30; 281,14 W im Wind versus 216,00 W dicht im Windschatten bei 0,5 m angenommenem Radabstand. Der Rollenanteil bleibt gleich.
- **Abstandskontrolle:** Windschatten nimmt mit wachsender Längslücke und seitlichem Versatz ab.
- **Dynamische Kontrolle:** beide Fahrer werden simultan aktualisiert, wachsende Lücke verändert die Abschirmung; natürliches Überholen auf seitlicher Spur erzeugt ein Ereignis; Überlappung in derselben Spur wird als Fehler gemeldet.
- **Getestet:** 15 neue lokale Tests plus 49 bisherige = 64 bestanden. Keine Renndaten-Kalibrierung, kein Android/Web-Worker-Benchmark, kein gesamtes Peloton.
- Die konkrete Reduktionskurve ist eine **parametrisierte Modellannahme**, noch kein aus Windkanal-Messdaten fit.
- Details in [physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md](physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md).
