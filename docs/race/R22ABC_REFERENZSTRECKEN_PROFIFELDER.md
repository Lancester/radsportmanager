# R-22A/B/C – Quellenbasierte Streckenanker, Profi-Typen und Teamfelder

**Status: Referenzdatensatz Version 1, noch KEINE endgültig kalibrierte
Rennsimulation.** Einmalige Rennstrecken, keine Rundfahrten-
Gesamtwertung, kein Karrieremodus. Das alte rein fiktive
`createLongRaceFixture` und die bisherigen Tests bleiben erhalten.

## R-22A: Vier nachvollziehbare Strecken

| Schnellwahl in GitHub | Historisches Rennen | Länge | Eckpunkte | Geometriedaten |
| --- | --- | ---: | --- | --- |
| Flach | TdF 2025, 1. Etappe Lille–Lille | **184,9 km** | Lorette, Cassel, Mont Noir | Verifizierte Renndistanz und Anstiege; Zwischenstücke modelliert |
| Hügelig | TdF 2025, 2. Etappe Lauwin-Planque–Boulogne | **209,1 km** | Cavron-Saint-Martin, Haut Pichot, Saint-Étienne-au-Mont, Outreau, Finale | Verifizierte Renndistanz und Anstiege; Zwischenstücke modelliert |
| Klassiker | Liège–Bastogne–Liège 2025 | **252 km** | Saint-Roch, Haussire, Stockeu, Rosier, Redoute, Roche-aux-Faucons und weitere | Verifizierte Renndistanz und Anstiege; Zwischenstücke modelliert |
| Berg | TdF 2025, 12. Etappe Auch–Hautacam | **180,6 km** | Labatmale, Soulor, Bordères, Hautacam | Verifizierte Renndistanz und Anstiege; Zwischenstücke modelliert |

Quellen und methodische Grenzen für jede Route stehen im
versionierten Modul `src/engine/race/reference-fixtures.ts`.
Beispielverweise:

- [TdF Grand Départ 2025 – offizielle Renncharakteristik](https://www.letour.fr/en/the-race/grands-departs/grand-depart-2025)
- [TdF 2025 Etappe 1 – zeit- und ortsbezogene Anstiegsdetails](https://sanluca.cc/races/g5Vgvv7ZY)
- [TdF 2025 Etappe 2 – offizielle Beschreibung](https://www.letour.fr/de/aktuelles/2025/etappe-2/lang-und-schwer/1325323)
- [Liège–Bastogne–Liège 2025, 252 km und Anstiege](https://www.cyclingnews.com/races/liege-bastogne-liege-2025/map/)
- [TdF 2025 Etappe 12 – Höhenprofil-/Streckendetails](https://www.velowire.com/article/1220/en/the-tour-de-france-2025-race-route-on-openstreetmap-maps-and-in-google-earth--stage-profiles-and-time--route-schedules.html)

### WICHTIGE DATENQUALITÄTSGRENZE

**Es liegt bislang kein originaler, vollständig positions- und
höhenaufgelöster GPS-/GPX-Track im Projekt vor.** Die genannten
Anstiege sind als feste Abschnitte mit Länge und mittlerer
Steigung enthalten. Die dazwischen liegenden Abschnitte werden
explizit als `Modellierter Übergang` bezeichnet. Sie
bestehen aus kürzeren wechselnden Steigungs-Proxies
und bilden **keinen Kilometer für Kilometer authentischen
Höhenverlauf**. Das ist deutlich besser belegbar als
die bisherigen sechs beliebigen langen 170-km-Bergblöcke,
ersetzt aber **nicht** das für endgültige Endkalibrierung
benötigte georeferenzierte GPX-/DEM-Profil.

Auch der `referenceAscentM` aus Quellen ist eine
**separate externe Ziel-/Referenzgröße**, NICHT der
numerisch aus unseren Proxy-Abschnitten errechnete
Höhengewinn. In `reference-scenario.json` werden beide
ohne Gleichsetzung ausgegeben. Die publizierten
Höhenmeter können je nach Quelle/Glättungsmethode
abweichen, wie bei Etappe 2.

Winddaten sind nicht automatisch die historische
Windlage am Renntag. Reifen, Kurven und die
tatsächliche seitliche Feldformation werden
weiterhin nicht als echter 2D-GPX-Fahrweg simuliert.
Keine Rundfahrt-Gesamtwertung implementiert.

## R-22B: wissenschaftlich nachvollziehbare fiktive Fahrerprofile

Grundlage: Open-Access-Veröffentlichung
[Optimal body mass normalization of power output for accurate
prediction of estimated cycling performance over complex
time-trial courses](https://pmc.ncbi.nlm.nih.gov/articles/PMC12400862/),
**Tabelle 1**. Diese verwendet modellierte CP-/W′-
Parameter und typische Morphologiewerte aus zuvor
veröffentlichten Profilen von **144 männlichen
WorldTour-/Pro-Continental-Fahrern**.

| Ausgangstyp | Körpermasse | CP | W′ | CdA |
| --- | ---: | ---: | ---: | ---: |
| Kletterer | 63,2 kg | 354,1 W | 23,0 kJ | 0,264 m² |
| Sprinter | 80,2 kg | 381,3 W | 38,6 kJ | 0,285 m² |
| Zeitfahrer | 72,6 kg | 395,3 W | 22,0 kJ | 0,276 m² |
| GC-Fahrer (Elite-Kletterer) | 63,8 kg | 388,6 W | 18,1 kJ | 0,265 m² |
| Allrounder | 69,5 kg | 361,1 W | 30,1 kJ | 0,272 m² |

**Klassikerfahrer** haben in diesem Paper kein
eigenes Referenzprofil: Unsere 71 kg/368 W/
30 kJ/0,274 m² sind ausdrücklich **abgeleitete
Spieltestannahmen**. Auch `ftpW=0,97×CP`,
Fähigkeitswerte, Tagesverpflegung und
Kader-Rollen sind **nicht aus dem Paper
gemessene** individuelle Werte.

Die 154 fiktiven Fahrer erhalten stabil
reproduzierbare, begrenzte Streuung
um diese publizierten Typmittel
mithilfe von fahrer-ID-basiertem Hash.
**Ein neuer Monte-Carlo-Seed verändert
nur die bisherige Engine-Tagesform**
(±2 % CP), nicht willkürlich Gewicht,
Rolle, CdA oder Zugehörigkeit.
So bleiben gepaarte Vergleichsrennen
hinsichtlich der Fahrerkader identisch.

Es werden weder echte Fahreridentitäten
noch private Leistungsdaten verwendet.

## R-22C: Mannschaftsaufstellung

Ein vollständiges Referenzfeld hat
**22 Teams à 7 Fahrer = 154**.
Die Teamtypen sind feste, **fiktive**
Profi-Rennkonstellationen und **nicht**
historische tatsächliche Starterlisten:

| Teamfokus | Anzahl Teams | Beispielspezialisierungen |
| --- | ---: | --- |
| Sprint | 5 | Sprinterkapitän, zweiter Sprinter, Klassiker-/Tempohelfer |
| Berg/GC | 6 | GC-Kapitän, weitere Kletterer, Zeitfahrer-/Allroundhelfer |
| Klassiker | 4 | Klassikerkapitän, Sprinter, weitere Klassikerfahrer |
| Ausreißer | 3 | Offensives Allround-/Klassiker-/Zeitfahrerteam |
| Ausgewogen | 4 | GC-Kapitän, Sprinter, Kletterer und Vielseitige |

Alle Fahrereigenschaften sind konkrete
CP/W′/Masse/CdA-/Fähigkeitswerte, keine
Sieg- oder Streckenboni. Es werden
keine Teams künstlich im gleichen Leistungs-
oder Gewichtsniveau gehalten.
Teamrollen in der bestehenden Engine
bleiben Kapitän/Sprinter/Helfer.
Einige Berg-/Ausreißerteams haben
bewusst keinen dedizierten Sprinter.

## Die neue GitHub-Monte-Carlo-Maske

Repository → **Actions** → **R-22 – Monte-Carlo-Test manuell starten**
→ **Run workflow**. Neuer verkürzter Ablauf:

1. **Rennvorlage wählen:** Flach Lille 184,9 km,
   Hügelig Boulogne 209,1 km,
   Klassiker Lüttich 252 km oder
   Berg Hautacam 180,6 km.
2. **Seeds:** 3 (empfohlener Test),
   10, 25, 50 oder 100.
3. **Vergleich:** `none` oder `carbs`
   (20-vs.-100-g/h-A/B mit doppelt
   so vielen Rennen).
4. **Erster Seed:** Standard 2026.

**Kein manuelles Eintippen von Fahrerzahl,
Teams, Distanz oder Teamaufstellung nötig:**
die Referenz wählt automatisch **22×7=154**,
Strecke und individuelle Fahrerdaten.
Der Workflow läuft weiterhin
**ausschließlich auf manuellen Auslöser**
(`workflow_dispatch`), nicht automatisch
beim Push oder periodisch.

GitHub-Actions-Report:
`summary.md`, `summary.json`,
`races.csv` und für die neuen
Szenarien `reference-scenario.json`
mit vollständig ausgewiesenen
Streckenabschnitten, Modell-/Referenz-
Höhenmetern, Quellen und allen
154 Fahrereingaben und Teamzusammenstellungen.

**Alte Tests werden nicht kaputtgeändert:**
`scripts/r22-monte-carlo.mjs --profile berg
--teams 5 --roster 7 --distance 170 ...`
kann mit `--scenario legacy` weiterhin
die ursprüngliche fiktive Testumgebung
verwenden. Die GitHub-Schnellwahl dagegen
hat ausschließlich die vier
quellenbasierten 154-Fahrer-Referenzen.

## Stand, nächster Schritt und echte Abnahme

Das ist eine **verbesserte und dokumentierte Eingabebasis**,
keine automatische Kalibrierung von R-19.
Alle bisherigen CP-/W′-, Endurance- und
Formations-Aero-Parameter bleiben technisch
unverändert, um die Wirkung der verbesserten
Eingabedaten gesondert sehen zu können.

**Vor abschließender R-22-Endkalibrierung:**
echte GPS-/GPX- oder gemessene
Höhenprofil-Daten mit Lizenznachweis
importieren; Steigungsabschnitte auf
die tatsächlichen Höhenmeter
und Kilometer prüfen; professionelle
Leistungs-/Gruppenergebnisse als
unabhängige Validierungsziele
versionieren. Erst danach
physiologische Parameter begründet
ändern. R-23 Freigabe ist damit
ausdrücklich **noch nicht erreicht**.
