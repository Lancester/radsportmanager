# R-22: energiesparendes Hauptfeld, koordinierte Jagd und Zielgruppen-Kriterien

**Status:** experimentelle Einzelrenn-KI, kein freigegebenes Rennphysikmodell.
Keine Rundfahrt, keine Karriere, keine Ergebnis- oder Geschwindigkeitsboni.

## Warum ändern?

Der alte Fahrer-Regler verlangte von vielen Fahrern unabhängig vom
Pelotontempo eine hohe CP-Quote. Die erste gruppenbewusste Version
`cohesive` behielt nach km 25 noch 138 Fahrer im Hauptfeld
(gegenüber 39 unter `legacy`), löste aber 390 individuelle
Verfolgungsabsichten aus und ließ die Spitze deutlich davonfahren.

## Neuer, getrennt aktivierbarer Versuch

`RaceInput.groupRidingModel:'coordinated'` erweitert `cohesive`,
bleibt aber **nicht Standard**.

1. **Energie sparen:** Wer in einer ausreichend großen Gruppe
   mitfährt, fordert die physikalisch benötigte Leistung zum
   Halten von Geschwindigkeit/Abstand an – nicht automatisch
   `0.88×CP` oder `0.98×CP`. Windschatten, Steigung,
   aktuelle Geschwindigkeit und Gruppenbeschleunigung bestimmen
   die notwendige Leistung; CP/W′ und R-19 begrenzen sie.
   Unbeschäftigte Helfer bekommen keine unnötige dauerhafte
   Schutz-/Tempoarbeit mehr zugewiesen.
2. **Jagdmandat statt 22 paralleler Einzeljagden:** Die
   Hauptfeld-KI erkennt eine kleine physisch abgesetzte
   Fluchtgruppe und prüft, welche Sprint- oder bei hohem
   Rückstand zusätzlich GC-/ausgewogenen Teams noch
   geschützte Ziele und freie Helfer haben.
   Höchstens drei Teams übernehmen eine koordinierte Jagd;
   ein Auftrag läuft mindestens 150 s, nach Ende folgen
   120 s Pause vor einem neuen Auftrag.
   Physische Helfer müssen tatsächlich selbst nach vorne
   fahren und Watt aufbringen; keine Teleports.
   Die alte Prognoseschwelle darf einen
   bereits tatsächlich gemessenen Ausreißer-Vorsprung
   nicht pauschal als `chaseViable=false`
   unsichtbar machen.
3. **Angriffe bleiben möglich:** Offensive Fahrer können früh
   attackieren, wenn Position, Tages-CP und W′ das erlauben;
   auch Sprint/Teammissionen werden nicht überschrieben.

Die bisherigen Varianten `legacy` und `cohesive` bleiben
unverändert reproduzierbar. Die Sprintverfolgung ist **nicht
automatisch erfolgreich**; das Zielverhalten darf nicht vorgegeben
werden, sondern muss aus Watt, Taktik und Physik entstehen.

## Zielgruppen-KPI, besonders für Flachetappen

Die Engine hat eine eigenständige Funktion
`finishGroupMetrics`. Sie gruppiert tatsächliche Zielzeiten
mit einer **rein experimentellen** Grenze von maximal
**1,0 Sekunde zwischen unmittelbar nacheinander
eintreffenden Fahrern**. Das ist **keine offizielle UCI-Regel**
und darf nicht mit den 42-Meter-Abstandsgruppen während
des Rennens verwechselt werden.

Berichtet werden:
- **Größe der Siegergruppe**;
- **Größe der größten Zielgruppe** und ihr Anteil am Feld;
- **Rückstand der größten Zielgruppe auf den Sieger**;
- Anzahl Fahrer maximal **60 Sekunden** bzw. **180 Sekunden**
  nach Sieger sowie die Zahl zeitlich getrennter Zielgruppen.

**Entscheidender Qualitätsgedanke:** Ein Feld von
148 Fahrern, das 17 Minuten hinter drei Ausreißern
ankommt, ist NICHT dasselbe wie ein erfolgreicher
Massensprint. Feldgröße **und Zeitabstand** müssen
gemeinsam geprüft werden. Wir optimieren
nicht auf eine feste vorgeschriebene Gruppenzahl,
sondern messen realistische Verteilungen gegen
tatsächliche Flachetappen als externe Referenz.

## A/B/C-Test und Bedienung

Der vorhandene **ausschließlich manuelle** Workflow
[Gruppen-KI A/B (154 Fahrer)](https://github.com/Lancester/radsportmanager/actions/workflows/r22-group-ai-ab.yml)
vergleicht für dieselbe Quelle, Strecke, Seed und 22×7
Fahrer **drei Rennen**:

- `legacy`: ursprüngliche KI;
- `cohesive`: erste Gruppenpacing-KI;
- `coordinated`: neue energiesparende
  Gruppen-KI mit Mannschafts-Jagdkoordinator.

Die Summary zeigt Watt-Mittelwerte, Zielzeiten,
Gruppen **während** des Rennens sowie
die zusätzlichen **Zielgruppen-Kriterien**.
`report.json`, `checkpoints.csv` und
`finishers.csv` erlauben Nachprüfung.

Die wissenschaftliche Kalibrierung bleibt offen:
1. Ergebnisse für mehrere Seeds und alle vier Rennvorlagen;
2. Attacken-/Jagdverlauf, richtige Anzahl realer Ausreißer,
   Zeitrückstände und physisch tatsächliche Führungsarbeit;
3. Energieersparnis anhand Kurbelarbeit pro
   Fahrer und Gruppenposition statt nur einer
   durchschnittlichen Wattzahl;
4. reale Zeitgruppen und Flachetappen-Vergleichswerte;
5. GPX-/Wetterdaten und Modellierung von
   Nebeneinanderfahren/Überholen in der 1D-Projektion.

**Keine automatische Monte-Carlo-Kampagne** und keine
Parameteroptimierung allein für Lille 2025.
