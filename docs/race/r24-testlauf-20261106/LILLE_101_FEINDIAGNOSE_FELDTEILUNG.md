# Lille Seed 101 – Feinanalyse der Feldteilung

Stand 06.11.2026. Der große Test bleibt angehalten. Untersucht wird der auf [Lille Seed 101](LILLE_SEED_101_FELDTEILUNG_DIAGNOSE.md) beobachtete Feldzerfall. Ziel ist, die Entstehung der Lücke und die Teamreaktion einzugrenzen, nicht bereits eine Kalibrierung zu behaupten.

## Vorgehen und Transparenzkontrolle

Die ursprüngliche Engine von Commit `772d1e910d01f991fe69f857e1291fb474978afe` wurde in einem separaten lokalen Checkout mit einem rein beobachtenden Diagnose-Hook versehen. Im Bereich von km 54 bis 78 der Rennspitze erfasste er alle fünf Sekunden alle Fahrer, Abstandsgruppen, Geschwindigkeiten, Wattwünsche, tatsächlich berechnete Watt, Windschattenfaktoren, Taktikzustände und Teamaufträge. Der Rennlauf wurde vollständig zu Ende berechnet. **Zielklassifikation, Ereignisliste und Diagnostik waren vollständig identisch mit dem uninstrumentierten Lauf.** Der Hook manipulierte weder Positionen noch Leistung oder Zufallsentscheidungen.

Die Schritte betrachten ein 1D-Modell. Die 42-m-Grenze ist eine interne Definition benachbarter Abstandsgruppen und kein offizieller Zeitwert und keine reale Straßenbreite. Die Formation-Aero-Heuristik berücksichtigt vorausfahrende Räder nur innerhalb von 24 m; sie ist nicht sportlich validiert. Für den hier relevanten Streckenabschnitt war kein Seitenwind eingetragen.

## Konkrete Abfolge

Es gab zunächst vorübergehende Trennungen: F023 und F050 wurden bei t=5160 s für wenige Sekunden und bei t=5450 s für rund 70 s verschiedenen Gruppen zugeordnet; dazwischen und danach kamen sie jeweils wieder in dieselbe Abstandsgruppe. Die hier bis mindestens zum letzten Feindiagnosepunkt bei km 77,96 nicht mehr geschlossene Trennung begann im 5-s-Raster bei t=5715 s, als die Rennspitze km 72,61 erreichte. Zu diesem Zeitpunkt befand sich die betroffene Feldhälfte auf einem modellierten Anstieg von etwa 1,4 %.

- Bei t=5680 s lag zwischen F057 und F132 innerhalb einer 125er-Gruppe bereits eine Lücke von 38,7 m. Der vordere Fahrer F057 war abgeschirmt (Aero-Faktor 0,4); F132 hatte in der Heuristik keinen vorausfahrenden Nachbarn innerhalb der 24-m-Zone mehr (Faktor 1). F132 fuhr etwa 362 W bei einer Tages-CP von rund 382 W und nahezu voller W′-Reserve.
- Der Fahrer F063 übernahm an der Front dieser 125er-Gruppe einen Teamjagd-Führungsauftrag. Seine Momentangeschwindigkeit stieg von rund 39,3 km/h bei t=5680 s auf 44,7 km/h bei t=5715 s; bei t=5690 s und 5700 s wurden rund 514 und 502 W abgerechnet. Die Geschwindigkeit verschiedener Fahrer und eine Teamentscheidung in dieser 1D-Simulation sind kein unmittelbarer Beleg für eine real so gefahrene Renndynamik.
- F132 verlangte und fuhr bei t=5690 und t=5700 jeweils rund 428 W bei Tages-CP rund 382 W. Das entspricht dem in diesem Mitfahrpfad vorhandenen Anforderungsdeckel von etwa 112 % CP, obwohl seine W′-Reserve noch bei rund 99 bzw. 98 % lag. Der Punkt belegt einen Deckel des **Wattwunsches**, nicht eine generell fehlende physiologische Fähigkeit oberhalb dieses Wertes.
- Die Lücke schloss sich kurzfristig bis rund 37,7 m und wurde dann bei der Beschleunigung wieder größer. Die konkrete Reihenfolge der Fahrer unmittelbar an der Grenze wechselte. Bei t=5710 s waren es noch rund 41,6 m; bei t=5715 s wurden rund 43,1 m erreicht und das 125er-Feld wurde als 64er- und 61er-Abstandsgruppe erfasst.
- Die hintere Gruppe mit F023 hatte zunächst weitere Fahrer mit Teamjagd-Aufgaben. Der jeweilige tatsächlich an der Front fahrende Fahrer wechselte. Bei t=5750 s lag die Lücke bereits bei rund 62,9 m; der vorderste Fahrer der hinteren Gruppe fuhr ungefähr 351 W bei rund 358 W Tages-CP und ohne lokalen Windschatten. Die vordere Gruppe fuhr weiter schneller. Nach dem 5-km-Schnappschuss waren es bei km 80 rund 454 m und bei km 100 etwa 1.480 m.

**Befund:** In diesem Einzelfall beobachtet man eine Jagdbeschleunigung, eine bereits stark ausgezogene Formation, fehlende lokale Abschirmung am Lückenrand, einen begrenzten Mitfahr-Wattwunsch und anschließend eine echte wachsende Positionslücke. Die 42-m-Schwelle ändert die Gruppenzuordnung und damit potenziell auch taktische Entscheidungen; sie erzeugt nicht selbst durch Teleportation einen Abstand. Ob in diesem Fall der Leistungsdeckel, die Dynamik des Mitfahrreglers, die Gruppenneuzuordnung, Teamaufträge oder deren Zusammenspiel die entscheidende notwendige Ursache ist, ist noch nicht isoliert. Die Untersuchung rechtfertigt eine kontrollierte Prüfung; sie beweist weder, dass jede Feldteilung unplausibel ist, noch dass allein die physikalische Windschattenrechnung falsch ist.

Die 1D-Geometrie ist relevant: nahe beieinander liegende Längskoordinaten bilden kein wirkliches räumliches Feld und erlauben keine seitliche Windstaffel oder reale Spurwechsel. Eine pauschal größere Gruppengrenze oder künstliche Geschwindigkeitskopplung wäre keine belegte Lösung.

## Isolierter Versuch: Anschluss für Sprintteams

In einem **gesonderten lokalen Experiment** wurde ausschließlich die Bedingung des bestehenden Anschlussauftrags erweitert, sodass auch ein Sprintteam seinen Sprinter unterstützen kann; andere Voraussetzungen wie erreichbare vorherige Gruppe, Gruppenposition und verfügbare Helfer blieben erhalten. Der Versuch wurde nicht in den Entwicklungsbranch übernommen.

| Wert | Original | Experiment |
| --- | ---: | ---: |
| F023 Zielrang / Rückstand | 67 / 432,60 s | 32 / 52,00 s |
| Gruppe F023 bei km 75 | 61 Fahrer | 120 Fahrer |
| Gruppe F023 bei km 85 | 61 Fahrer | 124 Fahrer |
| Angriffsbeginn-Ereignisse | 13 | 15 |
| Verfolgungsbeginn-Ereignisse | 1.786 | 2.096 |
| Sieger | F050 | F134 |
| Klassierte Fahrer | 154 | 154 |

In der Variante werden F025 und F028 in T04 zu Aufträgen mit `isRejoin` eingeteilt. Die Arbeitsdiagnostik verzeichnet für F025 390 s zugewiesene Arbeit, davon 254 s an der definierten Gruppenfront; für F028 210 s zugewiesen und 0 s an dieser Front. Diese Werte beschreiben die implementierte Messung und beweisen für sich keine wirksame dauerhafte Zusammenarbeit.

Die Variante zeigt in **diesem** Seed einen veränderten Rennverlauf und geringeren Rückstand von F023, aber keine Aussage über eine allgemeine Verbesserung. Die geänderte Entscheidung wirkt schon früh und kann spätere Entscheidungen sowie Zufallsabläufe verändern. Sie isoliert daher nicht die Ursache der ersten Feldteilung. Außerdem bleibt das Siegen eines Kletterers und die hohe Zahl interner Verfolgungsbeginne erklärungsbedürftig; ein Ergebnis auf Platz 32 ist keine vollständige sportliche Validierung.

## Entdeckter Diagnosefehler im Experiment

Die bestehende `RejoinAttemptTelemetry` sucht pro Team fest nach der Rolle `kapitaen`. Im Versuch mit Sprintteam T04 zeigen die `isRejoin`-Aufträge zwar die für den Sprinter F023 ausgewählten Helfer F025/F028; die Telemetrie erfasst aber F022 als `captainId` und berechnet Lücken zu dessen Gruppe. Diese Zahlen beziehen sich daher nicht zuverlässig auf den unterstützten Sprinter und dürfen nicht als Nachweis eines Anschlusses für F023 verwendet werden. Der Ereignistext nennt ebenfalls „Kapitän“. Im unveränderten Modell war dieser Diagnosepfad auf Kapitänsaufträge begrenzt; der Fehler wird durch das Sprint-Experiment offengelegt. Vor einer Übernahme müssen Ziel-ID, Gruppenziel und Text korrekt aus dem tatsächlichen Auftrag hergeleitet und mit passenden Tests belegt werden.

Auf dem experimentellen Code bestanden 13 vorhandene Tests zur Kapitäns- und Teamjagdlogik. Diese Bestandsprüfungen enthalten keine hinreichende Überprüfung des neuen Sprintfalls oder der korrekten Zielzuordnung; sie sind keine Freigabe der Variante. Der vollständige Standardtest bleibt unverändert offen.

## Wiederaufnahme und Rohdaten

- Ursprünglicher Seed: `772d1e910d01f991fe69f857e1291fb474978afe`. Die beobachtende Änderung liegt als `lille101-trace.patch`, der isolierte Sprintversuch als `lille101-sprintprobe.patch` in diesem Ordner. Sie sind Versuchsdokumente und verändern den Branch-Code nicht.
- `scripts/r24-lille101-trace-runner.mjs` erzeugt nach Anwenden des Trace-Patches auf einem isolierten Checkout die 5-s-Messung. `scripts/r24-lille101-diagnose.mjs` erzeugt mit einem Checkout der experimentell gepatchten Engine den vollständigen Gegenprobenlauf.
- Die in Reihenfolge 00–03 zusammenzufügenden Dateien `lille101-fein-teil-XX.b64` enthalten als gzip-komprimiertes JSONL den vollständigen Gegenprobenlauf und den 5-s-Ausschnitt t=5600–5800 s. Der komprimierte Stream hat SHA-256 `597354d085acf0e3325dd08223f2c4c189389fd74bf74c8bf5b3a5842695dec8`; die JSONL-Zeilen tragen Dateinamen, Einzel-SHA-256 und Rohtext. Nach dem Hochladen wurden alle vier GitHub-Teile bytegleich mit dem lokalen Stand verglichen.
- Nächste Arbeit: Zielidentität und Ereignistext für geschützte Fahrer in einem gesonderten kleinen Schritt korrekt abbilden und auf Modul- und Integrationsebene prüfen; darüber hinaus den Mitfahrregler und den Übergang zwischen Windschattenbereich und Gruppengrenze mit gepaarten kontrollierten Gegenproben untersuchen. Eine generelle Änderung von Grenzwerten oder ein Erfolg des Sprint-Anschlussauftrags ist bisher nicht belegt.
