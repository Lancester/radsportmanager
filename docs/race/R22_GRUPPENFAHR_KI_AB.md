# R-22: Gruppenkohäsion als Aufgabe der Fahrer-KI

## Warum überhaupt dieser Versuch?

Im ersten 154-Fahrer-Ursachen-Audit [PR #57](https://github.com/Lancester/radsportmanager/pull/57)
zeigte die Lille-Referenz bereits bei Kilometer 5 sechs,
bei Kilometer 25 zwölf und bei Kilometer 50 29 Gruppen,
**ohne zusätzliche R-19-Ermüdung**.
Die alte Rennlogik lässt fast alle Fahrer fortdauernd
nach ihrer individuellen CP fahren (beispielsweise
0,88 × CP im Windschatten, 0,98 × CP vorn).
Sie hält das von den Nachbarn gefahrene
Gruppentempo nur über eine relativ kleine und
begrenzte Wattkorrektur des nächsten Vordermanns.
Insbesondere bei unterschiedlichen Fähigkeiten
führt das dazu, dass ein starker Fahrer im Windschatten
unbeabsichtigt dauernd beschleunigen kann,
obwohl er eigentlich im Feld bleiben möchte.

Eine reale große Rennformation ist kein Verband
von 154 Einzelzeitfahrern:
Fahrer fahren mit, sparen Energie, arbeiten vorn,
wechseln sich ab und vermeiden nutzlose
Vorstöße, während einzelne Angreifer und
bei Gefahr organisierte Teams eigenständig handeln.

## Experimentelle Implementierung

Das neue explizite Modell
`groupRidingModel: 'cohesive'`
setzt **nur Wattanforderungen**:

- Ab **acht physikalisch verbundenen Fahrern**
  orientieren sich normale Mitfahrer
  an der tatsächlich gemessenen Geschwindigkeit
  und dem Abstand ihres unmittelbaren Vordermanns.
- Die dafür erforderliche Halteleistung wird
  aus den schon vorhandenen Kräfteannahmen
  (Luft- und Rollwiderstand, Steigung, Masse,
  aerodynamische Abschirmung, Gegen-/Seitenwind)
  berechnet. Dazu kommt eine begrenzte
  Wattkorrektur bei Tempodifferenz und Lücke.
- Ein einzelner tatsächlich vorn fahrender
  **Pacesetter** bestimmt die physisch berechenbare
  Gruppenbeschleunigung. Andere Fahrer
  fordern die für dieselbe Beschleunigung
  notwendige Leistung an, statt ihre eigene
  CP-Prozentzahl unabhängig durchzuziehen.
  Der Pacesetter ist durch seine reale CP
  und die Leistungsfähigkeit der Gruppe begrenzt.
  Die Wattanforderung kann im Grundtempo bis
  zur aktuellen CP reichen; ein Wechsel der
  Führungsposition entsteht nur durch Bewegung.
- **Angriffe, aktive Teamverfolgung, Helferarbeit
  und Zielsprints haben Vorrang**; sie werden
  nicht durch den Gruppenfahrmodus ersetzt.
  Der frühere künstliche Schutz, der Attacken
  bis 18 % der Distanz verbot, wird **nur im
  Experiment** teilweise aufgehoben:
  Nach etwa 180 Sekunden und rund 1,5 %
  Distanz sind offensive Angriffe grundsätzlich
  möglich, sofern Position, CP und W′ dies
  tatsächlich erlauben.
- CP/W′, Langzeitermüdung, Bremsen,
  Bewegung, Windschattenfaktoren und
  Rennergebnisberechnung werden nicht verändert.
  Kein Erzwingen von Position, Tempo,
  Abstand, Gruppenzugehörigkeit oder Sieg.

## Methodische Trennung

Die aktuelle `simulateRace`-Voreinstellung
bleibt **`groupRidingModel:'legacy'`**,
bis die neue Gruppen-KI nach gemessenen
A/B-Versuchen auf mehreren Rennprofilen
abgenommen werden kann.

`scripts/r22-group-ai-ab.mjs`
berechnet zwei volle 154-Fahrer-Einzelrennen
mit **identischem Seed und identischem
fiktivem Teamfeld**:

- `legacy`: bisheriges Verhalten
  als unveränderte Referenz.
- `cohesive`: neue Gruppenfahr-KI.

Verglichen werden
Siegergeschwindigkeit, Median- und
Letztrückstände, maximale Gruppenzahl,
Attacken, Verfolgungen, Gruppen
und Medianabstände je 5 km sowie
Watt, Aero-Faktor, R-19 und
CP-/W′-Energiebilanz.

**Zentrale Hypothese:** Wenn frühe Fragmentierung
hauptsächlich durch unkoordiniertes
individuelles Dauerfahren entsteht,
sollten bei gleichem Seed und identischen
Physikparametern mehr Fahrer im
zusammenhängenden Hauptfeld bleiben.

**Noch ungeklärt:** Das Modell ist ein
1D-Proxy und kann seitliches
Vorbeifahren, echte Windschattenpositionen
und komplexe Sprintzüge nicht exakt abbilden.
Die Gruppen-Pacesetter-Leistungsgrenzen
und die Beschleunigungs-Wattregel sind
noch nicht empirisch validierte WorldTour-Werte.
Ein einzelner A/B-Lauf kann weder den
optimalen Wert noch die allgemeine
Realitätstauglichkeit beweisen.

Das ist ein **experimenteller KI-Schritt**, nicht
die finale Kalibrierung von R-22 oder R-23.

## Iterationshistorie (nicht als endgültige Kalibrierung missverstehen)

**Versuch 1:** Regelung anhand individueller
Vordermann-Geschwindigkeit,
Führung mit 86 % CP;
[Lauf #41776176137](https://github.com/Lancester/radsportmanager/actions/runs/41776176137):
154-Fahrer-Lille, Seed 2026,
Sieger 49,2 km/h, **75 statt 50 Maximalgruppen**.
Der Feldzerfall wurde schlimmer.

**Versuch 2:** Einführung eines gemeinsamen
physisch führenden Pacesetters
mit eigener Beschleunigungsanforderung;
[Lauf #41776572051](https://github.com/Lancester/radsportmanager/actions/runs/41776572051):
Sieger nur 41,3 km/h, ein beinahe
durchgehend geschlossenes Feld,
keine Attacken, 2 Maximalgruppen.
Der Feldzusammenhalt war zu stark
und das Rennverhalten zu passiv.

**Versuch 3 – derzeitiger experimenteller Branch:**
Pacesetter darf im Grundtempo bis
zur aktuellen CP arbeiten, statt starr
auf 86 % CP begrenzt zu sein. Frühe
Angriffsmöglichkeiten für offensive
Fahrer werden geöffnet. **Der ursprüngliche
Standard `legacy` bleibt unverändert**;
erst nach kontrollierten Tests an
mehreren Strecken wird eine
Freigabeentscheidung getroffen.

Es werden keine Speed-, Watt-, Zeit-
oder Gruppenboni gewährt. Jede
Differenz zwischen Varianten entsteht
aus physischen Pedal-Wattanfragen
und unverändertem Bewegungsintegrator.

## Gemessenes Ergebnis der dritten Iteration (04.11.2026)

[GitHub-Testlauf #41776944085](https://github.com/Lancester/radsportmanager/actions/runs/41776944085):
**252/252 Tests erfolgreich**, insbesondere zwei
vollständige 154-Fahrer-Referenzrennen über
184,9 km (Lille 2025), Seed 2026.
Die bisherigen Legacy-Ergebnisse bleiben
**identisch**, die neue Physik ist ausschließlich
über `groupRidingModel:'cohesive'` aktivierbar.

| Kennzahl | Bisherige Fahrer-KI | Experimentelle Gruppen-KI |
| --- | ---: | ---: |
| Siegergeschwindigkeit | 52,75 km/h | **46,01 km/h** |
| Median-Zielrückstand | 663,6 s | **823,5 s (schlechter)** |
| Letzter Rückstand | 4023,5 s | **1220,3 s** |
| Maximal getrennte Gruppen | 50 | **18** |
| Attacken | 2 | **16** |
| Individuelle Verfolgungs-Intent-Wechsel | 7 | **390** |
| Stärkste Gruppe bei km 5 | 106 | **150 Fahrer** |
| Stärkste Gruppe bei km 25 | 39 | **138 Fahrer** |
| Stärkste Gruppe bei km 50 | 26 | **138 Fahrer** |
| Stärkste Gruppe bei km 100 | 31 | **138 Fahrer** |

**Befund:** Die gemeinsame Fahrerpacing-Regel
verbessert die frühe Feldkohäsion
stark, und offensivere frühe
Attacken finden tatsächlich statt.
Das Tempo ist gegenüber der alten
Renn-KI deutlich moderater.
**Aber** die großen späteren Rückstände
und die sehr hohe Zahl individueller
Verfolgungswechsel zeigen,
dass die autonome Teamtaktik
und das Zusammenspiel zwischen
Ausreißergruppen und Hauptfeld
noch nicht fertig modelliert sind.

Achtung: Die `chases`-Zahl zählt
**individuelle Wechsel in die
Verfolgungsabsicht**, nicht 390
verschiedene koordiniert gestartete
Mannschaftsjagden.
Die neuen Gruppen müssen auf weiteren
Seeds und allen vier Profilen
getestet werden. Kein einzelner
Lille-Seed darf als optimierter
Realismusbeleg gelten.

**Abnahme:** Als **experimenteller
A/B-Schalter** geeignet, aber **nicht
als neue Standard-Renn-KI freigegeben**.
Bis zur besseren Steuerung von
Flucht und Peloton bleibt die
Voreinstellung `legacy`.
