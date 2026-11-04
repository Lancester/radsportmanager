# R-22 Ursachen-Audit – Messung statt sofortiger Kalibrierung

## Untersuchungsfrage

Der manuelle Lauf #41773569558 mit **154 fiktiven Profifahrern**
auf der an Lille 2025 angelehnten 184,9-km-Strecke zeigte
über drei Seeds durchschnittlich ~52,7 km/h
Siegergeschwindigkeit, ca. 9:37 min
Medianrückstand, etwa 56:54 min Letztrückstand
und 42–50 maximale 42-m-Abstandsgruppen.
Dies sind Simulationsergebnisse, **noch keine
isolierten Kausalbefunde**.

## Technischer Ansatz

Der neue optionale Parameter `diagnosticLevel:'checkpoints'`
zeichnet bei jedem 5-km-Schnappschuss der Führung
**alle noch fahrenden 154 Teilnehmer** auf:

- Position in Metern, Abstand zum Führenden und
  aktuelle Gruppen-ID/-größe. Eine Gruppe hat maximal
  42 m Abstand zwischen benachbarten Fahrern.
- Momentane Geschwindigkeit, gerade angelegte
  Leistung und effektive Tages-CP.
- Restanteil W′, Kohlenhydratspeicher,
  bislang unbefriedigter Kohlenhydratbedarf und
  aktuelle R-19-Leistungs-Verfügbarkeit.
- Aktueller Aero-Reduktionsfaktor, Fahrerrolle,
  Typ und Streckenabschnitt.

**Die Messung ist optional.**
Ohne Diagnose bleiben Ergebnisstruktur, Rechenweg
und Physik unverändert; mit Diagnose dürfen sich
Zielzeiten/Ergebnisse ebenfalls nicht ändern.

## Gepaarte Gegenproben – identischer Seed und Starterliste

`scripts/r22-causal-audit.mjs` berechnet
**drei vollständige 154-Fahrer-Rennen**:

1. **baseline:** gegenwärtige R-19 Langzeitermüdung
   und R-13/R-20 Formationsaerodynamik.
2. **without_long_fatigue:** dieselbe Rennengine,
   nur `enduranceModel:'off'`: **nicht**
   ohne CP/W′, diese bleiben aktiv.
3. **legacy_drafting:** gleiche Ausdauer,
   `aeroModel:'legacy'`: die ältere
   Windschatten-Näherung **nicht** vollständig
   abgeschaltete Aerodynamik.

Es handelt sich um eine **Sensitivitäts-
bzw. Mechanismenprüfung**, nicht um
den empirischen Beweis einer einzigen
Ursache. Beide Änderungen können
Gruppendynamik und KI indirekt rückkoppeln.

## Aufruf und Dateien

In GitHub: **Actions → R-22 – Ursachen-Audit (154 Fahrer)
→ Run workflow**. Wähle Referenzrennen
(Lille, Boulogne, Lüttich oder Hautacam)
und Start-Seed, standardmäßig Lille/2026.

Das erzeugt unter **Summary** den Kurzbericht.
Im Artefakt `r22-ursachen-audit` liegen:

| Datei | Inhalt |
| --- | --- |
| `summary.md` | Gegenüberstellung, Delta und einige 5-km-Werte |
| `report.json` | Auswertungszahlen, Unterschiede und Methodenhinweise |
| `checkpoint-summary.csv` | Zeit, Gruppen, Median-Watt, KH-/W′-Verlauf je 5 km |
| `rider-checkpoints.csv` | Alle verfügbaren Fahrer je 5 km, Leistung und Gruppenzuordnung |
| `finishers.csv` | Zielzeit, CP, Gewicht, Aerodynamik und Energiebilanz aller Fahrer |

`node --experimental-strip-types scripts/r22-causal-audit.mjs
--route tdf25_lille --seed 2026
--output artifacts/r22-causal`
erzeugt dieselben Dateien lokal.

**Grenzen:** Leistung und Aero sind Momentanwerte
der letzten Simulationssekunde, keine 5-km-
Intervalldurchschnittswerte. Bereits ins Ziel
gefahrene Teilnehmer werden nicht mehr
in Gruppenmomentaufnahmen gezählt.
Außerdem entsprechen die Übergangssteigungen
nicht den exakten historischen GPX-Profilen.
Der `legacy`-Aero-Modus enthält weiterhin
Windschatten. Aus Einzelseeds lässt sich
keine belastbare Verteilungsvalidierung ableiten.

## Bewertung und nächster Schritt

Vor der **Änderung** von R-19/CP/W′/
R-13 sollten wir nachweisen:

1. Zu welchem Kilometer die Gruppen
   erstmals auseinanderfallen;
   ob der einzelne Windschatten-Proxy
   diese Trennung stark beeinflusst.
2. Wann die R-19-Strafe beginnt,
   wie viel KH und W′ noch verfügbar
   sind und ob das Abschalten von
   R-19 die Renndynamik wesentlich verändert.
3. Ob die Fahrerpositionen bereits
   lange vor dem R-19-Beginn dauerhaft
   fragmentieren: dann ist R-19
   nicht der alleinige Auslöser.
4. Wie viel schneller/langsamer
   dieselbe Strecke unter beiden
   Kontrollvarianten wird;
   zugehörige Risiken und
   nichtlineare Rückwirkungen
   transparent dokumentieren.

**Keine ungeprüften temporären
Geschwindigkeits-, Leistungs- oder
Ergebnisboni und keine sofortige
Freigabe R-23.**

## Erster tatsächlich ausgeführter 154-Fahrer-Kausaltest (04.11.2026)

Der [CI-Test #41774718299](https://github.com/Lancester/radsportmanager/actions/runs/41774718299)
mit Seed 2026 auf 184,9 km Lille-Streckenproxy lief erfolgreich:
**249/249 Tests; alle drei Vollrennen mit je 154 Zielankünften**.
Das Zuschalten der 5-km-Messungen verändert nach
Regressionstest die sportlichen Ergebnisse **nicht**.

| Kennzahl | Baseline | R19 aus | Alte Aero |
| --- | ---: | ---: | ---: |
| Siegerzeit | 12619,2 s | 12198,5 s | 14859,8 s |
| Siegergeschwindigkeit | 52,75 km/h | 54,57 km/h | 44,79 km/h |
| Median-Zielrückstand | 663,6 s | 517,6 s | 617,2 s |
| Letzter Rückstand | 4023,5 s | 3623,5 s | 1796,3 s |
| Maximal beobachtete Gruppen | 50 | 37 | 60 |
| Max. R19-Leistungsstrafe | 32 % | 0 % | 32,94 % |
| Mittlerer Aero-Faktor | **0,5897** | 0,5441 | **0,8902** |
| Mittelwert angelegte Leistung | 307,8 W | 329,2 W | 312,8 W |

**Interpretation:** Die zusätzliche Langzeitermüdung
verlangsamt den Sieger in diesem gepaarten
Einzelszenario um **420,7 s (~7 min)**;
sie ist also nicht die Ursache der bereits
zu hohen Spitzengeschwindigkeit.
Sie verstärkt jedoch den Median- und
Schlussrückstand (im A/B um 146 bzw. 400 s).

Die ältere Windschatten-Näherung
verlangsamt den Sieger um **2240,6 s
(~37 min)** bei einem erheblich
höheren mittleren Aero-Faktor
(0,89 statt 0,59). Das ist ein
**starkes Indiz für eine zu starke
Formations-Abschirmung** im
aktuellen 1D-Modell. Es beweist
nicht, dass der alte Aero-Modus
realistisch wäre: dessen Gruppenzahl
liegt sogar höher (60 statt 50).
Eine ursächliche Aero-Kalibrierung
darf deshalb nicht auf einfache
Umschaltung zum alten Modell
reduziert werden.

Das fiktive Streckenproxy weist
**1065 m positive Höhenmeter** und
ungefähr **−14 m Nettohöhenänderung**
auf. Seine historischen Streckenanker
stimmen nur teilweise mit
originalen Profilpunkten überein;
die selbst erzeugte Zwischengeometrie
kann ein Vergleichstempo beeinflussen.

**Nächster fachlicher Schritt:** Die
5-km-Zeitreihe nutzen, um den Zeitpunkt
und die Dynamik der Feldtrennung im
Verhältnis zum R-19-Anstieg
zu bestimmen, bevor R-13/R-19-
Parameter verändert werden.
Zum endgültigen Fit werden
exakte Strecke, tatsächliche
Windbedingungen, Zielgruppen
und unabhängige Test-Profile benötigt.

## Kausale Gruppen-Zeitreihe: Vollständiger echter Audit, Seed 2026

[GitHub Actions PR-Test #41774943026](https://github.com/Lancester/radsportmanager/actions/runs/41774943026)
hat **249/249 Tests bestanden**, inklusive Regression
gegen die unveränderte Referenz-Ergebniszeit 12619,2 s
und drei vollständiger 154-Fahrer-Sensitivitätsrennen.
[PR #57](https://github.com/Lancester/radsportmanager/pull/57)
wurde nach grüner CI in `main` übernommen.
Der Code kann nun in GitHub unter
**Actions → R-22 – Ursachen-Audit (154 Fahrer)**
mit beliebiger der vier Referenzstrecken
und eigenem Seed manuell gestartet werden.

**Wesentliche Messung:** Die Gruppen entstehen
bereits **vor** dem Einsetzen der zusätzlichen
R-19-Langzeitermüdung, also kann diese
den frühen Feldzerfall nicht verursachen:

| Km an der Spitze | Gruppen | Größte Gruppe | Median-Abstand zur Spitze | Median-KH [kcal] | Median R-19-Strafe | Median Aero-Faktor |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 | 6 | 106 | 155 m | 1171 | 0 % | **0,400** |
| 25 | 12 | 39 | 740 m | 1058 | **0 %** | **0,400** |
| 50 | 29 | 26 | 2223 m | 907 | **0 %** | 0,501 |
| 75 | 18 | 48 | 2333 m | 761 | **0 %** | **0,400** |
| 100 | 18 | 31 | 3621 m | 629 | 4,1 % | **0,400** |
| 125 | 34 | 30 | 3290 m | 497 | 9,9 % | 0,517 |
| 150 | 42 | 28 | 6228 m | 365 | 15,8 % | 0,662 |
| 175 | 39 | 24 | 7517 m | 255 | 20,7 % | 0,621 |
| 180 | 40 | 23 | 7758 m | 235 | 21,8 % | 0,608 |

**Aero-Faktor 0,40** entspricht im bestehenden
Modell einer Reduktion des berechneten
Luftwiderstandsanteils auf 40 % des
ungeschützten Werts. Der momentan vielen
Fahrern zugeteilte starke Windschatten
erklärt plausibel einen Teil des
hohen Tempos, aber nicht automatisch
den gesamten Feldzerfall. Andere
mögliche Ursachen: instabile
Vordermann-/Positionsrückkopplung,
Leistungsspreizung im fiktiven Feld
und unzulänglich modelliertes
Gruppenfahren im 1D-System.

**Kontrollprobe zu R-19:** Ohne zusätzliche
Langzeitermüdung nimmt die maximale
Gruppenzahl von 50 auf 37 ab,
der Sieger wird um 420,7 s schneller
und Median- und Letztrückstand
fallen um 146 bzw. 400 s.
R-19 verschärft also die spätere
Fragmentierung, verursacht aber
nicht den frühen Feldzerfall.

**Kontrollprobe zum Aero-Modus:** Bei Wechsel
auf den alten Windschattenmodus
steigt der über alle Fahrer-Sekunden
gemittelte Aero-Faktor von 0,5897
auf 0,8902; Siegerzeit verlängert
sich um 2240,6 s. Die maximale
Gruppenzahl **steigt** zugleich
von 50 auf 60. Das zeigt:
**Eine pauschale Aero-Abschwächung allein
wäre keine ausreichende Korrektur
der Feldkohäsion.**

**Nebenbefund:** Der Median des
W′-Füllstands liegt bei mehreren
Messpunkten nahe 100 %. Daraus
allein lässt sich keine
CP/W′-Fehlkalibrierung ableiten,
aber die W′-Erholung und effektive
Leistungsanforderung gehören
in den nächsten gezielten Audit.

### Technische nächste Schritte, noch NICHT durchgeführt

1. **Aero-Validierung** separat gegen
   gemessene Windschattenstärken,
   nach Position und gruppennaher
   Fahreranzahl, mit 1D/2D-Grenzen.
2. **Feldkohäsion** separat testen:
   Watt-Anforderung bei Relativtempo
   und Abständen, Verfolgen/Abreißen,
   keine künstlichen Teleports oder
   Ergebnisboni.
3. **CP/W′-/R-19-Mechanismen** mit
   physiologischen Labordaten
   und einer wirklich zeitaufgelösten
   Leistungsdiagnostik prüfen.
4. Danach **realistischere GPX-Route,
   mehrere Seeds und zurückgehaltene
   Vergleichsrennen** für Abnahme.

**Keine physiologischen oder aerodynamischen
Kalibrierungsparameter wurden durch
diesen Audit verändert.**
