# R-22: Helfer physisch zur Hauptfeldspitze führen – vierter KI-Versuch

## Warum diese Prüfung?

Die vorherige Variante `coordinated` hielt in Lille (184,9 km,
154 Fahrer, Seed 2026) bis zu 133 Fahrer als große Zielgruppe
zusammen. **Sie kamen aber 929 s hinter dem Sieger an.**
Die Hauptgruppe rollte relativ sparsam, holte den entscheidenden
Vorsprung aber nicht auf.

Wir dürfen eine große Zielgruppe **nicht** als gute Flachetappe
bewerten, wenn sie weit hinter einer kleinen Spitzengruppe liegt.

## Technische Hypothese

Der aktuelle 1D-Integrator hat kein automatisches seitliches
Überholen. Teamhelfer, die nicht an der Spitze stehen,
können zwar einen Verfolgungsbefehl erhalten, müssen sich aber
aus eigener Pedalleistung durch das Feld nach vorne arbeiten.
Bislang kamen für die Team-KI nur Helfer im Bereich von 105 m
vor dem Mannschaftsziel infrage.

Die neue, **ausdrücklich experimentelle** Variante
`groupRidingModel:'relays'` prüft:

- Bei einer vom koordinierenden Team-Manager bestätigten
  Verfolgung dürfen bis zu vier verfügbare Helfer mit höchstens
  300 m Rückstand auf die jeweilige Gruppenfront für
  Führungsarbeit ausgewählt werden.
- Ein Helfer, der noch aufrücken muss, fordert dafür bis zu
  110 % seiner Tages-CP an; ein **tatsächlich führender**
  Helfer bis zu 115 % CP, begrenzt durch den unveränderten
  CP/W′-, R-19- und Bewegungsphysik-Kern.
- Ohne aktives Jagdmandat gelten die bestehenden
  energiesparenden Gruppen- und Mannschaftsregeln.
- Die Gruppenbeschleunigung folgt der **tatsächlichen**
  Geschwindigkeit und Wattanforderung des physisch
  führenden Fahrers. Es gibt keine Teleports, garantierten
  Gruppenanschlüsse oder Geschwindigkeitsboni.

**Wichtig:** 110/115 % CP und 300 m sind vorläufige
Experimentwerte, noch nicht durch Sportwissenschaft
validiert. Dauerhaft solche Leistungen zu verlangen, ist
physiologisch nicht möglich – die vorhandene W′-/Ermüdungsengine
muss die Grenzen setzen. Die vierte Variante soll zuerst
zeigen, ob die tatsächliche Aufrückarbeit überhaupt
das Strukturproblem lösen kann.

## Neu gemessene Kennzahl

`orderedRelayTeamSeconds`: In welchen Sekunden
hat mindestens ein Team im Peloton einen
gültigen Verfolgungsauftrag?

`mainFieldFrontWorkWithAssignedChaserS`: In
welchen dieser Sekunden ist der **tatsächliche
vorderste Fahrer der größten aktiven Renn-Gruppe**
aus einem jagenden Team und hat wirklich
`intent='verfolgung'`?

Letzteres misst echte Arbeit an der 1D-Feldspitze,
keinen lediglich erteilten Auftrag.

## Vergleich und Abnahme

Die bisherige **manuell** startbare
[Gruppen-KI A/B](https://github.com/Lancester/radsportmanager/actions/workflows/r22-group-ai-ab.yml)
testet nun vier Modelle über 184,9 km,
22 Teams × 7 Fahrer, gleichen Seed:

1. `legacy`
2. `cohesive`
3. `coordinated`
4. `relays`

Ausgewertet werden nicht nur die Gruppen unterwegs,
sondern **Siegergruppe, größte Zielgruppe und ihr
Rückstand**, Fahrer binnen 60 s, Anzahl tatsächlicher
Führungssekunden, Attacken und mittlere Fahrerleistung.

**Die neue Variante wird NICHT Standard**, solange
die Daten nicht zeigen, dass Fluchtgruppe und
Hauptfeld sowohl taktisch als auch physisch
plausibel funktionieren. Ein Erfolg auf Lille allein
ist ebenfalls keine Validierung für alle
vier Rennprofile.

## Erste Messung der vierten Variante: ein konkreter struktureller Engpass

[GitHub-Test #41781460429](https://github.com/Lancester/radsportmanager/actions/runs/41781460429)
hat **254/254 Tests** bestanden. Beim identischen Lille-Test
(184,9 km, 154 Fahrer, Seed 2026) waren Jagdteams insgesamt
**6.870 Sekunden beauftragt**. Allerdings stand nur in
**109 Sekunden tatsächlich ein beauftragter Verfolger
an der Spitze des größten zusammenhängenden Felds**.

| Ergebnis | Bisher coordinated | Aufrücken mit 110/115 % CP |
| --- | ---: | ---: |
| Größte Zielgruppe | 133 | 116 |
| Rückstand größte Zielgruppe | 929 s | **775 s** |
| Max. Gruppen unterwegs | 5 | 8 |
| Attacken | 18 | 36 |
| Mittlere Leistung | 168 W | 182 W |
| Physische Führungszeit im Hauptfeld (Jagd) | nicht separat erhoben | **109 s** |

Dass nur 109 von 6.870 Jagd-Auftragssekunden
physisch an der Spitze umgesetzt wurden,
zeigt, dass das bloße Nominieren starker Helfer
noch **keine funktionierende Relaisführung** ergibt.
Der Rückstand bleibt für einen Massensprint
viel zu hoch.

### Fünfter A/B/C/D/E-Versuch: dosiertes Aufrücken

Statt dass ein nur unterstützender Helfer
starr hohe CP-Leistung anfordert
und womöglich aus der Formation
herausbeschleunigt, soll er nun erst
die physikalisch notwendige Leistung
zum Mitfahren anfordern und mit
**höchstens 42 W Zusatzleistung**
sowie einem Gesamtdeckel bei
102,5 % seiner Tages-CP kontrolliert
nach vorn gelangen.

Diese Mechanik ist **nur**
unter `groupRidingModel:'relay-paced'`
aktiv. Sie verändert keine
Fahrerposition direkt, überschreibt
keine W′-/R-19-Leistungslimits
und bewahrt die bisherigen vier
Varianten zur A/B-Vergleichbarkeit.

**Die absoluten Wattgrenzen sind experimentell**,
nicht empirisch validiert. Wir müssen nach
vollständigem Test sehen, ob damit
mehr tatsächliche Führungssekunden
im Hauptfeld entstehen und gleichzeitig
der Rückstand der größten Zielgruppe
sinkt. Falls nicht, braucht die 1D-Engine
eine differenziertere realistische
Relais-/Überholungsmechanik; mehr
Watt zu verlangen allein wäre
dann keine passende Lösung.

## A/B/C/D/E-Ergebnis: kontrolliertes Aufrücken ist wirksam, aber nicht ausreichend

[GitHub-CI #41781971739](https://github.com/Lancester/radsportmanager/actions/runs/41781971739):
**255/255 Tests grün**, einschließlich **fünf kompletter
154-Fahrer-Rennen** auf Lille 184,9 km, Seed 2026,
mit unverändertem CP/W′-, Aero- und R-19-Kern.

| Kennzahl | Coordinated | Relays (110/115 % CP) | Relay-paced (dosiert) |
| --- | ---: | ---: | ---: |
| Sieger km/h | 44,76 | 45,41 | 44,76 |
| Größte Zielgruppe | 133 | 116 | **67** |
| Rückstand dieser Gruppe | 929 s (15:29) | 775 s (12:55) | **366 s (6:06)** |
| Maximalgruppen unterwegs | 5 | 8 | 24 |
| Wirkliche Hauptfeld-Jagdführungszeit | nicht erhoben | 109 s | **1.848 s** |
| Beauftragte Jagdzeit (ein Team oder mehr) | nicht erhoben | 6.870 s | 11.430 s |
| Individuelle Jagd-Intent-Wechsel | 123 | 84 | **464** |
| Mittlere Kurbelwatt | 168 | 182 | 208 |

**Wichtig:** Die neue kontrollierte Aufrückregel
vervielfacht die tatsächliche körperlich erarbeitete
Feldführungszeit um etwa den Faktor 17 und reduziert
den Rückstand der größten Zielgruppe von 12:55
auf 6:06 Minuten. Das ist ein starker technischer
Mechanismusbeleg. Trotzdem ist es
**keine plausible Massensprint-Reproduktion**:
das große Feld zerfällt wieder in deutlich mehr
Gruppen, und 464 einzelne Jagd-Intent-Wechsel
sind kein glaubwürdiger organisierter Mannschaftsablauf.

**Nicht als neue Default-KI übernehmen.**
Die drei Effekte müssen entkoppelt werden:
Helfer an die Spitze bringen, ihnen dort
physisch mögliche zeitlich begrenzte
Führungsarbeit zuweisen, und nach
einem Wechsel oder einer gestellten Flucht
die großen Felder stabil weiterfahren lassen.
Die 1D-Lage- und Überholmodellierung
bleibt ein wichtiger Engpass.
Keine Optimierung nur auf diesen
einen historischen Referenzseed.
