# R-10 – Peloton, Fluchtgruppen und taktische Stabilität vor weiterem Mikrophysik-Ausbau

**Stand 03.11.2026 · Ausgangspunkt ist R-09 mit 183/183 bestandenen Tests und drei vollständig simulierten 50-km-Rennen.**

## Warum R-10?

Die ersten vollständigen 30-Fahrer-Rennen sind technisch vollständig und schnell, aber die Diagnosen aus [R-09](R09_ERSTES_RENNEN.md) zeigen, dass sich das Feld in zu viele einzelne Fahrer auflöst:

| Ausgangsrennen | Max. Abstandsgruppen | Gruppenaufteilungsereignisse | Verfolgungswechsel |
| --- | ---: | ---: | ---: |
| Hügelig, T1 schützt Kapitän | **30** | **135** | **319** |
| Hügelig, T1 offensiv | **29** | **147** | **155** |
| Flach, T1 Sprint | **15** | **52** | **415** |

Dies ist ein fachliches **Warnsignal**, keine reale Rennstatistik. Wir müssen nun das große Ganze verbessern: Gruppen-Zusammenhalt, Windschatten, Flucht und Verfolgung – ohne wieder Reifen-, Lenk- oder Kurvendetails zu modellieren.

## Schritt 1: Regelbasiertes Gruppen-Tempo statt magischer Abstandsverschiebungen

Neue reine Datei `src/engine/race/peloton.ts`:

- Fahrer sehen **den direkt davor fahrenden Nachbarn** (Abstand und Relativgeschwindigkeit).
- Näherer Vordermann reduziert den Luftwiderstand im **abstrakten, offengelegten Windschatten-Modell**. Der Reduktionsfaktor beginnt bei **0,81** und nähert sich bis **36 m** Distanz wieder 1. Es handelt sich **nicht um empirisch validierte CFD-Daten**.
- Ein nicht attackierender Fahrer darf seinen vorherigen **Pedalwatt-Wunsch** um einen **begrenzt** positiven/negativen Korrekturwert ändern (zunächst −80 bis +72 W), um den Abstand zu stabilisieren oder Anschluss zu suchen. Die Korrektur ergibt sich aus Relativgeschwindigkeit und Abstand, nicht aus einem garantierten Platz in der Gruppe. Für eine fast erschöpfte W′-Reserve sind zusätzliche Watt untersagt.
- Gezielte Attacken und Sprints werden **nicht** auf ein Gruppentempo zurückgeregelt.
- Der vorhandene Kern `advanceMotionStep` berechnet **jede tatsächlich gefahrene Geschwindigkeit und Position** aus Pedalwatt, Steigung und Widerständen. `applyCpWprimeStep` begrenzt vorher jede gewünschte Mehrleistung. **Kein Teleportieren, kein Setzen gleicher Gruppengeschwindigkeiten, keine erfundenen Zeitgutschriften.**

Die Fahrer fahren weiterhin entlang **einer abstrahierten gemeinsamen Streckenkoordinate**. Das ist **kein fahrdynamisch kollisionsfreies 2D-Peloton**. Auch bei besserer Gruppenbildung dürfen wir die R-01–R-08-Detailphysik nicht als integriert im 30-Fahrer-Rennlauf bezeichnen.

## Schritt 2: Ruhigere Verfolgungstaktik

Die erste Renn-KI wollte teilweise alle zehn Sekunden von „Verfolgen“ zu „Erholen“ wechseln und anschließend direkt wieder verfolgen. Die neue `stabilizeRaceDecision`-Funktion sorgt für:

- Verfolgungsphasen von zunächst mindestens **50 Sekunden**, solange noch ausreichend W′ vorhanden ist.
- Nach einer beendeten Verfolgung eine **90-Sekunden-Pause**, ehe dieselbe Rolle die nächste Verfolgung beginnen kann.
- Bei fast leerer W′ greift die Reserveerholung weiter **sofort**; die Mindestdauer wird dann nicht erzwungen.
- Ein Helfer startet die besondere Verfolgungsregel erst bei einem größeren Rückstand (vorläufig über **60 m**, statt schon bei über 25 m), ausreichender Reserve und vor dem späten Finale.

Die Werte sind **vorläufige Balancing-Parameter**. Ziel ist nachvollziehbarere Entscheidungslogik, nicht das gezielte künstliche Herstellen eines bestimmten Siegers.

## Schritt 3: Echte, zeitlich anhaltende Fluchtgruppen erfassen

Die bloße Schwankung der Gruppenzahl wird nicht mehr bei jedem einzelnen Simulationsschritt als dramatisches Rennereignis gezählt. Stattdessen:

- Die einfache Abstandsgruppenklassifikation verwendet nun **42 m** Trennung als vorläufige Diagnosegrenze.
- Protokollierte „Feld geteilt“-Meldungen haben einen Mindestabstand von **75 Sekunden**, um nicht ständig denselben Gruppenwechsel zu erzählen.
- Eine „Fluchtgruppe“ wird erst dann als Ereignis erkannt, wenn vorne höchstens sechs Fahrer und mindestens **75 m** Abstand zur nächsten Gruppe über mindestens **40 Sekunden** bestehen. Ein solches Ereignis entsteht aus den **wirklich gefahrenen Abständen**; es ist kein vordefiniertes Attacken-Drehbuch.
- Auch ein tatsächlicher Wiederanschluss wird erst nach ausreichend stabiler Schließung erneut gemeldet.
- Die Zwischenergebnisse enthalten **alle Gruppengrößen**, statt die Darstellung auf die ersten acht zu begrenzen. Zeit/Rang/Angriff werden weiterhin von der Physik bestimmt.

Die Gruppenzahlen sind **nur eine abstrahierte Abstands-Diagnostik**. Sie beweisen weder eine echte Rennformation noch automatisch ein sportlich realistisches Ausreißerverhalten.

## Tests und laufende Rennvergleichsdiagnose

- Neue `tests/r10-peloton.test.mjs`-Prüfungen sichern Windschatten-Funktion, Wattdeckel, Angriffsfreiheit, W′-Reserve, stabile Verfolgung, Eingabereihenfolge und vollständige, energieerhaltende 50-km-Rennen.
- Eine eigene **Balancing-Regression** überprüft, dass die Maximalzahl der Abstandsgruppen und die Verfolgungswechsel **gegenüber den tatsächlich dokumentierten R-09-Ausgangsläufen sinken**. Dies ist eine Diagnose des Fortschritts, **kein Beweis empirischer Realitätsnähe**.
- `scripts/r09-race-diagnostics.mjs` vergleicht weiter dieselben drei vollständigen Rennen (wellig geschützt, wellig offensiv, flach Sprint) mit demselben Seed und schreibt zusätzlich die vollständigen Gruppenstatistiken, Flucht- und Wiedereinholereignisse.
- Browser-`docs/rennen.html` mit `docs/race/app.js` zeigt die bestätigten Fluchtereignisse, Verfolgungsstarts und Gruppenentwicklung. Der bestehende GitHub-Pages-Workflow soll alle alten und neuen Tests sowie das **originale Browser-ESM-Modul** überprüfen.

**Bis GitHub Actions wirklich erfolgreich ist, sind keine neuen Zahlen oder tatsächliche Android-Laufzeiten bestätigt.**

## Bewusst offen

- Wir müssen beurteilen, ob Gruppen *zu leicht* oder *zu schwer* zusammenbleiben, und ob verschiedene Strecken und Fahrerprofile sinnvolle Unterschiede erzeugen. Maximale Gruppenanzahl allein ist kein Realismusmaßstab.
- Aktuelle Gruppenarbeit ist nur eine **wattbasierte Regelung**; sie enthält noch keine sportlichen Leiter, aktiven Team-Führungswechsel und echte Formation von Windkante/Querwind.
- W′-Wiederherstellung und Langzeitermüdung sind weiterhin eine **nicht kalibrierte** Heuristik.
- Rennresultate müssen gegen plausible Straßenrennen und unterschiedliche Fahrerfelder geprüft werden, bevor 160 Fahrer oder 200 km als ausgereifte Simulation gelten.
- Die ganze Detailphysik der R-01–R-08-Experimente bleibt unverändert testbar. Sie wird nicht als Kernvoraussetzung für jedes Rennen erzwungen.

**Leitsatz: Glaubwürdige ganze Rennen und taktische Entscheidungen zuerst.**
