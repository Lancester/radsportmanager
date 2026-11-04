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
