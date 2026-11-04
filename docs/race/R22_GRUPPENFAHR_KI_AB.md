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
- Fahrer in den vorderen 14 m einer ausreichend
  großen Gruppe vermeiden grundlos permanent
  98 % ihrer eigenen CP als Führungsleistung
  abzurufen. Als **experimenteller und noch
  unkalibrierter Wert** werden
  maximal 86 % CP für die gewöhnliche
  Führung angefordert.
- **Angriffe, aktive Teamverfolgung, Helferarbeit
  und Zielsprints haben Vorrang**; sie werden
  nicht durch den Gruppenfahrmodus ersetzt.
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
Die 86-%-CP-Tempopriorität ist kein
empirisch validierter WorldTour-Parameter.
Ein einzelner A/B-Lauf kann weder den
optimalen Wert noch die allgemeine
Realitätstauglichkeit beweisen.

Das ist ein **experimenteller KI-Schritt**, nicht
die finale Kalibrierung von R-22 oder R-23.
