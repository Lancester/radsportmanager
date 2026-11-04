# R-17 bis R-21 – gemeinsam umgesetzte Rennengine-Erweiterung

**Fachgrenze:** Das Paket implementiert ausschließlich die
Simulation **eines einzelnen Rennens**. `flach`, `huegelig`,
`klassiker` und `berg` bezeichnen **Testprofile eines
Eintagesrennens**. Keine Rundfahrten, Rennen über mehrere
Tage, Gesamtwertung, Verträge, Mitarbeiter, Transfers
oder Karrieremodus.

Siehe den [verbindlich beschlossenen Fahrplan](ROADMAP_R17_R23_VERBINDLICH.md).
R-22 und R-23 sind separate, **noch ausstehende** Schritte.

## R-17: Positions- und schichtbewusste Helferführung

`race-team-ai.ts` nimmt `previousLeaders` als echten
zeitlichen Entscheidungszustand entgegen; die aktuelle
Führungszuordnung `leaderByTeam` wird im nächsten
10-s-Takt weitergeführt. Schichten dauern modellhaft
75 s und können bei fehlender tatsächlicher Frontposition
oder fehlender W′-Reserve enden. Der Nachfolger darf
die Führung **nur dann** übernehmen, wenn seine
simulierte Streckenposition nachweislich vor dem
geschützten Fahrer und innerhalb von 18 m der aktuellen
Gruppenspitze liegt. Helfer ohne Frontposition erhalten
statt dessen einen Wattwunsch zur Unterstützung bzw.
für den allmählichen Aufschluss.

`relayChanges` zählt die tatsächlich gewechselten
frontnahen Führungsaufträge. `actualFrontWorkSteps`
zählt nur Modellsekunden, in denen der Führungshelfer
wirklich vor dem zu schützenden Ziel und zugleich
frontnah fährt. Beide Zähler sind **keine** Belege
für Spurwechsel oder gegenseitige 2D-Überholvorgänge.

## R-18: Zeitabhängige Rennlage und Gegnerarbeit

Die aktuelle kleine Fluchtgruppe und das größere
Feld werden über gemessene Abstandsgruppen getrennt
(die 42-m-Klasse beeinflusst den Windschatten NICHT).
Zusätzlich zu gemessenem `gapM` und
`relativeSpeedMps` wird `projectedGapM` als
**120-Sekunden-Fortschreibung** derselben
Gruppengeschwindigkeiten ermittelt.
Die Verfolgungspriorität berücksichtigt diese
Projektion, Reststrecke und die Teamstrategie.
Ausgewogene Teams können weiterhin zunächst
andere Mannschaften verfolgen lassen.
Das ist **keine Garantie**, dass der prognostizierte
Abstand auch nach realen Angriffen oder bei
veränderter Steigung eintreten wird.
R-18 verwendet keine künstliche Positionierung
und keinen eingestellten Soll-Zielabstand.

## R-19: Langfristige Ermüdung und Verpflegung

Neues separates Modul `race/endurance.ts`.
Es führt einen fiktiven Kohlenhydratspeicher,
Zufuhr in g/h, tatsächlichen Verbrauch,
unbefriedigten Bedarf, Überlauf und eine
aus den geleisteten Wattleistungen fortgeschriebene
Langzeitbelastung. Ab 90 Minuten Rennzeit
kann eine steigende Ermüdungsstrafe die
**angeforderte** Leistung senken,
maximal um 40 %. Die Rechnung passiert
**vor** dem unveränderten CP/W′-Kern;
W′-Rest und mechanische Energiebilanzen
werden nicht mit Kohlenhydratenergie verrechnet.
`RaceInput.enduranceModel='off'` bietet
einen reproduzierbaren isolierten Vergleich
ohne dieses Zusatzmodell, Standard = `'long'`.
`RaceRider.carbsGPerHour` ist optional,
Standard 65 g/h, zulässig 0–110 g/h.

**Grenze:** 1.200 kcal Speicher, 0,245 mechanischer
Wirkungsgrad, 55 % zugerechnete Kohlenhydrat-
Energienachfrage, Schwellen und Abfallrate sind
vorläufige **Testheuristiken**, keine klinische
oder sportwissenschaftliche Kalibrierung.
Alternative Energieträger werden nicht
physiologisch detailliert berechnet.
Es gibt keine magischen Energiegutschriften.

## R-20: Fahrertypen und Straßen-/Windeinflüsse

`RaceRider.specialty` erlaubt die Kennzeichnung
`sprinter`, `kletterer`, `klassiker`,
`zeitfahrer`, `allrounder`. Die Kennzeichnung
selbst vergibt **keinen Bonus**.
Die vier Testprofile unterscheiden ihre Fahrer
durch echte Masse, CP, W′, CdA, Sprint- und
Abfahrtsparameter.

Optional pro Streckenabschnitt:
`rollingCoefficient`, `headwindMps`,
`crosswindMps`. Wind wird über eine
relative Luftströmung und damit die
**bereits vorhandenen mechanischen
Luftwiderstandskräfte** berücksichtigt;
Seitenwind schwächt die rein längsgerichtete
Windschattenannahme. Rollwiderstand gelangt
direkt in `advanceMotionStep`.
Es gibt keine direkten Zeit- oder
Geschwindigkeitsboni. Die unveränderten
Eingaben ohne Zusatzparameter liefern das
bisherige Referenz-Verhalten.

**Grenze:** 1D-Rennstrecke, keine
2D-Echelon-/Seitenwindstaffel, kein
Kopfsteinpflaster-Schlagmodell,
keine detaillierte Fahrerlateralposition.
Auch Umweltwerte sind vorläufige Heuristiken.

## R-21: große Felder und lange Einzelrennen

Die maximale Feldgröße in `validateRace` und
`formationAeroFactors` wurde von 60 auf
**210 Fahrer** erweitert; weiterhin maximal
30 Teams, 300 km pro Einzelrennen und
60 Streckenabschnitte. Die Grenzen
bleiben explizit validiert.

Neues `race/long-race-fixtures.ts` erzeugt
reproduzierbare **fiktive**, einzelne
Flach-, Hügel-, Klassiker- und Bergrennen.
Standardmäßig **22 Teams × 7 Fahrer = 154**
mit physikalisch unterschiedlichen
Spezialisten und 170–240 km langen
Strecken. Das ist ein Referenzfeld
für die spätere große Testkampagne,
kein Grand-Tour-Karrieremodus.

Der 50-km-Referenzlauf mit 30 Fahrern
bleibt weiterhin über
`createRaceExample()` verfügbar.
`tacticModel='r14'` behält die alte
Taktik zum A/B-Vergleich und
`aeroModel='legacy'` die ältere Aerodynamik.
Kein Teil des Physik-/CP/W′-Kerns
wurde für große Felder ersetzt.

Bei langen Rennläufen wurde außerdem die
frühere kleine Grenze des Ereignisprotokolls
korrigiert, damit gezählte Fluchten
und protokollierte Fluchtereignisse
auch bei großen Feldern übereinstimmen.

## Geprüfte Eingangsbedingungen und vorläufige Referenzmessungen

- `tests/r17-r21-race-engine.test.mjs` prüft
  Führungs-Stabilität und Frontpositionswechsel,
  Zeitlückenprognose, Ernährungs-/W′-/mechanische
  Energiebilanz, Wind- und Streckeneinfluss,
  reproduzierbare Referenzrennen und große Felder.
- `scripts/r21-scale-diagnostics.mjs`
  prüft echte komplette lange Einzelrennen,
  vollständige Klassifikationen und
  mechanische Energie-Bilanz je Fahrer,
  dazu Flucht-/Gruppendiagnosen und CPU-Zeit.
- Der abgenommene erste Großfeldlauf umfasste
  **154 Fahrer, 22 Teams, 200 km flach**,
  mit **7,83 s Berechnungszeit**
  im GitHub-Actions-Testhost.
  70 Fahrer, 170 km bergig wurden
  in **4,84 s** durchgerechnet.
  Das sind Einzelmessungen auf einem
  CI-Runner und keine Garantien
  für langsame Mobilgeräte.
- Der 154-Fahrer-Flachlauf erreichte
  **21 maximal getrennte Abstandsgruppen**,
  Median-Zielrückstand **753 s** und
  letzten Rückstand **5034,7 s**.
  Die großen Rückstände sind ein
  dokumentiertes offenes
  **Kalibrierungsthema für R-22**,
  nicht automatisch ein Anlass für
  Zeitgutschriften oder zufällige
  Zusammenhalte-Boni.

**Noch nicht als wissenschaftlich realistisch freigegeben:**
Langzeitermüdung, Zufuhrmengen,
Windschatten- und Fahrtzeitverteilung,
Gruppendynamik und Spezialistenwirkung.
Eine vollständige professionell fundierte
Kalibrierung wird bewusst **nicht**
vorgezogen: Sie erfolgt in R-22
mit voneinander getrennten
Referenz- und unabhängigen Validierungsrennen.

## Verbindliche nächste Phase

**R-22:** Multi-Seed-/Monte-Carlo-Tests
über flache 180–220-km-Rennen,
Hügelrennen 180–210 km,
Klassiker 220–260 km,
Bergrennen als *einzelne* 150–200-km-Rennen;
große Teams (22×7 = 154 Fahrer),
erst 100 Läufe, anschließend 500/1000+
nach gemessener Rechenzeit. Gegen
externe Renn-/Leistungsstatistiken
kalibrieren, nicht auf feste Sieger
oder kleine Abstände forcieren.

**R-23:** Dokumentiertes
Freigabegate zur Rennengine 1.0
**nach** R-22, nur bei erfüllten
Qualitätskriterien und ohne
offene kritische Modellfehler.
