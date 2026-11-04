# R-22: Was reißt das Peloton tatsächlich auseinander?

## Kernbefund

Die Begriffe **Attacke** und **Feldteilung** sind im bestehenden
Motor getrennt. Eine taktische Attacke verlangt eine absichtlich
erhöhte Leistung (`chooseRacePower` mit `cp+65+55*aggression`);
eine Feldteilung wird dagegen anhand der wirklich gefahrenen
Abstände diagnostiziert. Eine kleine Spitzengruppe wird bisher
schon dann als Flucht registriert, wenn sie über längere Zeit
75 m physische Lücke hat – **auch wenn niemand bewusst
attackiert hat**. Gerade das müssen wir messen.

Eine harte Simulationsregel „nur Attackierende dürfen eine
Lücke reißen“ wäre falsch: Ein Fahrer kann in echten Rennen
durch Ermüdung, Steigungen, Seitenwind, Fahrtechnik oder einen
unwillkürlich verpassten Anschluss abreißen. Unsere KI sollte
trotzdem **normalerweise Kraft sparen und mitfahren**,
statt ohne Mannschaftsauftrag eigene Zeitfahren zu starten.

## Experiment: Führungsarbeit nur bei tatsächlich erreichter Front

Bisher konnten beauftragte Jagdhelfer mit dem
Duty `fuehrung` deutlich mehr Watt verlangen,
obwohl sie physisch noch mitten im Hauptfeld
fuhren. Daraus können unbeabsichtigt neue
Lücken oder unnötige Sprints entstehen.

Die neue optionale KI `groupRidingModel:'front-gated'`
ändert keine Kraftgleichung, kein Cp/W′, keine
Position und keine Aero-Tabelle. Sie verwendet
die bisherige **physisch berechnete, dosierte**
Aufrückleistung für **jeden beauftragten
Verfolger, der mehr als 18 m hinter dem
führenden Fahrer seiner Gruppe liegt** –
auch wenn sein Auftrag bereits `fuehrung`
heißt. Erst an der tatsächlichen Feldfront
darf der beauftragte Führende seinen
härteren Jagd-Wattsollwert verlangen.
Die individuellen Leistungs- und
Energiegrenzen bleiben unverändert.

Die bisherige `relay-paced`-Variante und
alle anderen Varianten bleiben für
A/B-Regressionen erhalten. Die
professionell vollständig validierte
Gruppen-KI ist damit noch **nicht** erreicht.

## Neue Diagnose: Fluchten ohne bewusste Attacke

In `front-gated` zählt
`unprovokedBreakawayCount` eine
physisch bestätigte kleine Spitzengruppe,
in der **kein** Fahrer innerhalb der
letzten 180 Sekunden den
Rennintent `angriff` begonnen hat.
Das ist keine Behauptung, dass die
Lücke physikalisch unmöglich wäre.
Es hilft vielmehr zu erkennen, ob die
KI ungewollt eine Solofahrt produziert.

Zu prüfen:
- Wann wurde angegriffen, wann entstand die
  tatsächliche Lücke, wer war an der Spitze?
- Wurden die Verfolgungshelfer
  erst dann hart beansprucht, als sie
  **tatsächlich vorne** fuhren?
- Sinken die Zielrückstände und wächst
  die Sieger-/Hauptzielgruppe zugleich?
- Bleibt das Hauptfeld bei konstantem
  Tempo für schwächere Fahrer stabil,
  solange sie den Windschattenphysik-
  und CP-/W′-Leistungsbedarf erfüllen?

**Windschatten als offene wissenschaftliche Grenze:**
`formationAeroFactors` reduziert den
Luftwiderstandsanteil anhand tatsächlich
vorausliegender Fahrer in einer 24-m-Zone,
unterhalb mindestens Faktor 0,40.
Dieser Faktor darf weder durch Wunschwerte
der Zielgruppen noch durch künstliche
Lückenheilung manipuliert werden.
Ein realer Pelotonfahrer kann sich seitlich
positionieren; in unserem 1D-System
fehlt dies weiterhin. Reale 2D-/GPS- und
Windverhältnisse sind für endgültige
Kalibrierung noch notwendig.

Auch der bisherige Pacesetter-Kern kann
bei kleinen Gruppen unkoordiniert sein;
eine mögliche Folgeuntersuchung wäre,
Kleingruppen-Pacing bis auf zwei Fahrer
zu erweitern, aber nur nach konkreter
Prüfung der neuen Daten.

## Reproduktion

Manueller
[Gruppen-KI A/B Workflow](https://github.com/Lancester/radsportmanager/actions/workflows/r22-group-ai-ab.yml).
Der 154er-Vergleich wird um
`front-gated` als sechste
experimentelle Variante ergänzt.
Damit bleiben alle früheren Varianten
und ihre Seed-Baselines nachvollziehbar.

Das ist ausdrücklich eine
**Ursachenprüfung, kein Freigabe-Tuning**.

## Erster echter Test des Front-Gatings (Seed 2026)

[PR #61](https://github.com/Lancester/radsportmanager/pull/61)
nach erfolgreicher
[CI #41783133007](https://github.com/Lancester/radsportmanager/actions/runs/41783133007)
zusammengeführt, **257/257 Regressionstests erfolgreich**.
Für Lille 2025 (184,9 km, 154 Fahrer):

| Kriterium | Vorher `relay-paced` | `front-gated` |
| --- | ---: | ---: |
| Echte Jagd-Führungssekunden | 1.848 | **2.747** |
| Größte Zielgruppe | 67 | **51** |
| Rückstand größter Zielgruppe | 366 s | **398 s** |
| Max. Abstandsgruppen | 24 | **11** |
| Angezählte Fluchten | 1 | **1** |
| Fluchten ohne vorherige Attacken innerhalb 180 s | nicht erhoben | **0** |
| Individuelle Jagd-Intent-Wechsel | 464 | **441** |

Interpretation: Das Begrenzen der
starken Jagd-Wattanforderung auf
**wirklich an der Gruppenfront
fahrende Helfer** schafft deutlich
mehr reale Frontjagd und etwas
weniger dynamische Felderteilungen.
Die größte Zielgruppe ist allerdings
kleiner und langsamer relativ zum
Sieger. Damit ist die Variante
**nicht als neue Standard-KI geeignet**.

Zudem bestätigt ein neuer unabhängiger
physikalischer Kleintest:
Eine bewusst angreifende
Kapitäns-KI fordert tatsächlich
mehr als ihre CP an und mehr als
beim normalen Mitfahren.
Bei identischem Tempo
fordert die gruppenbewusste
KI im Windschatten weniger Watt
als ohne Abschirmung.
Das **beweist noch nicht**
die aerodynamische Kalibrierung:
Größenordnungen (0,40-Mindestfaktor,
24-m-Abschirmungsradius) sind
weiterhin Proxy-Werte.

**Offene Kernaufgabe:**
Den Übergang von KI-Mission zu
echtem Führungswechsel und das
übermäßig nervöse Jagdverhalten
(sowie tatsächliche Energieersparnis
der hinten geschützten Fahrer)
gesondert testen. Keine harte
Sperre für nicht-attackenbedingte
Abstände und keine GPX-/Wetter-
Referenzgenauigkeit behaupten.
