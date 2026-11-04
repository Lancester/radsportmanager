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
