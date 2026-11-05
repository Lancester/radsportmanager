# Gesamtüberarbeitung Eintagesrennmodell – Arbeitsstand

Auftrag 05.11.2026: Die gemeinsam beschlossenen Regeln als zusammenhängendes Eintagesrennmodell überarbeiten, danach gebündelt technisch prüfen und einen großen reproduzierbaren sportlichen Vergleich gegen bisherige Modelle durchführen. Wichtige Zwischenschritte und Grenzen sichern und dem Nutzer kontrolliert mitteilen. Einzeln nachvollziehbare Umsetzungsschritte bedeuten keine geforderte Nutzerfreigabe oder vollständige Rennsimulation nach jeder kleinen Änderung.

Grundlage: Experiment mit mehrminütiger Anschlusslogik sowie die gemeinsame Regelbeschreibung auf docs/r24-rennki-regeluebersicht. Referenzen sind die 22 gemeinsamen Entscheidungen und R24_UMSETZUNGSABGLEICH.md.

Geplante zusammenhängende Bereiche:
1. Rennen und Teamziele mit Fahrerrollen, Favoriteneinschätzung, frühen Fluchten und gemeinsamer Rennlage.
2. Angriffsabsichten, Reaktionen, Führung/Teamjagd, mehrere Fahrer beim Nachsetzen und realistische zeitlich dosierte, geländeabhängige Anschluss-/Abbruchentscheidungen.
3. Feldverhalten und berg-/abfahrts- und sprintbezogene Fahrweise, individuelle Taktik und W′/Ermüdung im Rahmen vorhandener Physik.
4. Rennbedingungen und Ereignisse, Material, Ergebnisgruppen und aussagekräftige Begründungen/Rennberichte entsprechend vereinbarten Eintagesregeln; Rundfahrt-/Karrierefunktionen als Anschlussstellen, nicht als bereits fertige Systeme ausgeben.
5. Technische Prüfungen und abschließender gepaarter Mehrseed-Vergleich gegenüber festgehaltenen Ständen, vier Profilen, Fahrerfeldern, Favoriten, Gruppen, Rennverläufen, Energie und Gegenproben. Keine Ergebnisse oder Testfreigabe vorwegnehmen.

Status: Gesamtüberarbeitung begonnen, aber noch nicht abgeschlossen. Separater Entwicklungsbranch erstellt; erste Verfolgungs- und Teamjagdänderungen als Zwischenstand gesichert. Die hier genannten Bereiche sind ein Arbeitsprogramm, keine Behauptung vorhandener Implementierung. Der volle Rennvergleich beginnt erst nach Überarbeitung; gezielte technische Prüfungen dienen der sicheren Entwicklung und sind von diesem abschließenden sportlichen Test zu unterscheiden.

## Erster gesicherter Zwischenstand: Verfolgung und Teaminteresse

- Der reine automatische Abbruch eines individuellen Anschlussversuchs nach 120 s ohne neuen Bestabstand ist ersetzt durch eine experimentelle Einschätzung von Lücke, ihrer Entwicklung, Reserve, verbleibender Strecke, Tempo, Teamauftrag und in unmittelbarer Entfernung vorliegendem passendem Gelände. Ein Fahrer kann zunächst Kräfte schonen. Zeit ohne Fortschritt löst nicht allein die Aufgabe aus. Die einzelne Heuristik ist ein Anfang, noch keine vollständige sportliche Abbildung der gemeinsam vereinbarten Gelände- und Gruppentaktik.
- Ein offensiv eingestelltes Team ohne eigene Vertretung in einer als grundsätzlich erreichbar eingestuften Spitzengruppe kann auch ohne bestehende unmittelbare Dringlichkeit Interesse an der Verfolgung zeigen. Tatsächlich verfügbare Fahrer, Teamarbeit und sonstige Bedingungen bleiben relevant. Die konkrete Heuristik enthält vorläufige technische Schwellen und ist noch sportlich zu prüfen; es ist nicht die fertige vollständige Strategie- und Teamplanlogik.
- 13 gezielte technische Tests für diese Regeln und zugehörige Funktionen bestanden. Das ist keine Gesamttestsuite und kein sportlicher Rennvergleich. Weitere vereinbarte Bereiche sind noch offen.
- Dieser Abschnitt ist ein Wiederaufnahmepunkt, kein Abschluss des Auftrags. Die Gesamtüberarbeitung ist fortzusetzen, bevor der breite Rennvergleich durchgeführt wird.

### Technische Integrationskontrolle der Anschlussfunktion

Ein bestehender Test war zunächst fehlgeschlagen, weil er den ganz bestimmten Fahrer F036 als erfolgreichen Verfolger im festen Rennen erwartete. Durch die veränderten Teamentscheidungen verlief das Rennen anders. Ein gezielter technischer Kontrolllauf mit gleichem Hautacam/profile-Seed 777 zeigte jedoch andere tatsächlich protokollierte erfolgreiche Anschlussversuche über zehn Minuten, einschließlich beobachteter Nachführabsicht und geprüfter Energiebilanz. Der Test prüft nun diese benötigte Eigenschaft statt eine bestimmte Fahrer-ID und bestand. Der Kontrolllauf ist kein Mehrseed-Vergleich und keine sportliche Validierung. Die Ergebnisse dürfen nicht als Erfüllung des Gesamtauftrags ausgegeben werden.

Aktuell weiterhin ausstehend: weitere Team-/Fahrertaktik, Gefährlichkeitsbeurteilung, gruppierte Nachführarbeit, individuelle Bergfahrweise, Sprintregeln und die weiteren vereinbarten Bereiche; danach Gesamttests und sportlicher Vergleich.

## Weitere gesicherte Entwicklungsschritte

- Zielauswertung: konfigurierbare benachbarte Zeitlücke, separate individuelle Zielzeiten und gewertete Gruppenzeiten. Experimenteller Default 1 s, keine Behauptung eines vollständigen offiziellen Regelwerks. Testet Reihenfolge, Lücken, Gruppe und Konfiguration.
- Rennbericht: separate Funktion strukturiert tatsächlich vorhandene Ereignisse, Ergebnis und optional vorab benannte Favoriten; sie wird noch nicht als fertige Nutzeroberfläche oder vollständig eingebundener Managerbericht ausgegeben.
- Gegnergefahr: erste relative Einschätzung anhand nomineller, als bekannt angenommener körperlicher Fähigkeiten und grobem Streckenprofil, ohne Zugriff auf fremde aktuelle W′. Der Teamjagd-Koordinator kann dadurch eine geeignete Flucht zunächst akzeptieren oder bei als gefährlich eingestufter Spitze früher Interesse anmelden. Die Schwellen und Gewichte sind experimentell, subjektive Fehleinschätzung und detaillierte Einzelreaktionen noch nicht vollständig. Beides wurde auf Modulebene/Teamentscheidung gezielt technisch geprüft, nicht sportlich kalibriert.
- Diese Punkte sind Teilimplementierungen, nicht Abschluss der gesamten vereinbarten Überarbeitung. Insbesondere gemeinsame Nachführgruppen, Fluchttaktik, dynamische Abwägung einzelner Fahrer, Sprint, Bergrhythmus, mentale Einflüsse, Ereignisse und die weiteren im Abgleich genannten Themen bleiben offen.

## Sprintposition: Teilstand

Im sprintfreundlichen stable-pack-Pfad erhält der einzelne Sprinter eine vorläufige positions-/geschwindigkeitsbasierte Vorbereitung statt nur der alten prozentualen Phasengrenze. Die verfügbare Zeit bis zum Ziel, Abstand zur Gruppenfront und Hinterradfindefähigkeit beeinflussen den voraussichtlichen Positionierungsbedarf. Für ältere Aufrufe ohne diese Angaben bleibt das alte Verhalten erhalten. In dem neuen Pfad kann auch eine kleinere tatsächliche Gruppe berücksichtigt werden.

Die numerischen Schätzungen sind ungeeichte Heuristiken. Die Teamhelfer-Auswahl und andere Sprint-/Zugpfade enthalten weiterhin ältere Phasenbedingungen; Sprint aus sonstigen Profilen oder vollständige realistische Spurwahl sind damit nicht abgeschlossen. Sieben zielgerichtete Sprinttests liefen erfolgreich. Kein Mehrseed-Vergleich und keine Sportfreigabe.


## Fortsetzung: Einzelreaktionen und gemeinsame Verfolgung

- Fahrer können aufgrund einer beobachteten Attacke eines gefährlichen Gegners eine eigene Verfolgung erwägen. Die Einschätzung nutzt bekannte Eigenschaften, verfügbare Kräfte und die aktuelle Lage; ein erfolgreicher Anschluss wird dadurch nicht garantiert. Die Regel und ihre Gewichte sind vorläufig.
- Fahrer mit einem gemeinsamen Ziel können sich einem tatsächlich existierenden Anschlussversuch anschließen. Ein experimenteller Führungswechsel senkt unter bestimmten Bedingungen den Leistungswunsch des bisherigen Führenden, damit ein naher Mitfahrer möglicherweise übernehmen kann. Ob die vorhandene eindimensionale Gruppenphysik daraus in Rennen zuverlässige und sinnvolle Wechsel erzeugt, ist ausdrücklich noch offen; die isolierten Tests belegen das nicht.
- Nach diesen Änderungen bestanden 47 gezielte technische Tests aus mehreren Bereichen. Ein zusätzlicher technischer Berg-Kontrolllauf samt Integrationstest bestätigte weiterhin mindestens einen erfolgreichen Anschlussversuch von über zehn Minuten; die vier isolierten Kooperationstests bestanden ebenfalls. Dies ist keine vollständige Testsuite und kein Vergleich der sportlichen Ergebnisse.

## Noch ausstehend und Wiederaufnahme

Die Gesamtüberarbeitung ist nicht fertig. Insbesondere müssen die tatsächliche Zusammenarbeit im Rennverlauf, differenzierte individuelle Berg- und mentale Eigenschaften, die verbliebenen starren Sprint- und Angriffsbedingungen, weitere Teamstrategien sowie vereinbarte Ereignisse und Randbedingungen geprüft und gegebenenfalls ergänzt werden. Die Berichtsoberfläche ist noch nicht eingebunden. Einzelne vereinbarte spätere Funktionen und Rundfahrtregeln sind gesondert einzuordnen. Vor dem Mehrseed-Vergleich sind vollständige technische Prüfungen und eine kritische Prüfung der Aussagekraft aller Kennzahlen erforderlich. Keine bisherige Prüfung belegt die sportliche Realitätsnähe des Gesamtmodells.


## Fortsetzung: Bergangriffe und unterschiedliche Entscheidungen

- Zusätzlich zur bisherigen Finalbedingung kann eine kleine bereits bestehende Spitzengruppe am Anstieg auch weit vor dem Ziel als Anlass für einen Siegversuch dienen. Das ist eine begrenzte zusätzliche Heuristik, keine vollständige Abschaffung aller starren Strecken-, Steigungs- oder Gruppenschwellen. Ob daraus ein Angriff wird, hängt weiterhin von der Angriffsentscheidung, eigener Position und Kraft ab.
- `pursuitPersistence` ist ein optionaler Fahrerwert (0 bis 1) für die Entscheidung, ob ein aussichtsarmer Anschlussversuch eher fortgesetzt wird; ein Teamauftrag und fast leere Reserve bleiben übergeordnet. Ohne Eingabe gilt aus Kompatibilitätsgründen bisher die vorhandene Angriffslust. Der Wert erzeugt keine Leistung und ist noch nicht kalibriert.
- `climbingAttackPreference` ist eine optionale taktische Neigung (0 bis 1), die die Angriffswahrscheinlichkeit am Berg innerhalb der vorhandenen Angriffslogik beeinflusst. Die physische Leistungsfähigkeit bleibt unverändert; ohne Eingabe ist das Verhalten unverändert. Keine fertige allumfassende Bergfahrertyp- oder Tempo-KI. Die bestehenden Testfelder erhalten noch keine neuen individuellen Werte; für einen fairen Vergleich müssen identische Eingaben für alle verglichenen Versionen dokumentiert werden.
- 16 gezielte Tests zu diesen Angriffsmöglichkeiten und den Verfolgungsentscheidungen bestanden; zusätzlich bestanden 19 gezielte Prüfungen zur Verfolgung und bestehenden Rennsimulation. Ein einzelner technischer Hautacam-Lauf mit Seed 777 meldete 32 Anschlussanfänge, darunter 16 als gemeinsam gemeldete, und zwei Angebote einer Ablösung. Das beweist weder tatsächliche Übernahmen noch eine sportlich stimmige Anzahl. Die gesamte technische Testsuite wurde erneut gestartet; ihr Ergebnis muss nach Abschluss gesondert dokumentiert werden.
- Noch offen bleiben insbesondere verlässliche Prüfung tatsächlicher Führungswechsel in der Rennphysik, weitere flexible Situationen statt enger Schwellen, realistisch verteilte Fahrerwerte, Zusammenspiel mit Teamaufträgen, die weiteren vereinbarten Themen und der große sportliche Vergleich.


## Prüfbarkeit der Ablösung

Das Ereignis für ein Ablöseangebot nennt jetzt den angesprochenen Fahrer. Ein zusätzliches Ereignis erfasst, wenn dieser Fahrer anschließend bei gleichem Verfolgungsziel und in derselben realen Gruppe tatsächlich vor dem bisherigen Führenden liegt. Das belegt einen Positionswechsel, aber nicht automatisch, wie lange oder wie wirksam der Fahrer anschließend Führung leistet. Das Angebot selbst darf weiterhin nicht als Erfolg gezählt werden.

Im technischen Kontrolllauf Hautacam, Seed 777, traten bei 32 erfassten Anschlussanfängen 16 gemeinsam gemeldete Anschlüsse und zwei Ablöseangebote auf. In beiden Fällen wurde anschließend der entsprechende Positionswechsel registriert: F103 und F100 wechselten ihre Reihenfolge und boten sich später erneut eine Ablösung an. Dies ist nur ein einzelner Kontrolllauf und weder repräsentativ noch eine Kalibrierung der Gruppenarbeit. 19 gezielte Tests für diese Änderungen und das vorhandene Rennmodell bestanden. Ein umfassender Testlauf wurde schon vor den jüngsten Änderungen gestartet, daher ist sein Ergebnis nicht als vollständige Prüfung des endgültigen Stands auszugeben. Weitere Prüfung und die Gesamtüberarbeitung bleiben offen.


Der zusätzliche reproduzierbare Integrationstest auf dem aktuellen Stand prüfte im selben Berglauf sowohl einen erfolgreichen Anschluss von über zehn Minuten als auch mindestens einen beobachteten Positionswechsel nach passendem Ablöseangebot; er bestand. Ein breiter Lauf mit 405 bestandenen Tests wurde während weiterer Änderungen durchgeführt und ist daher kein vollständiger Nachweis für einen unveränderten Endstand. Eine erneute Gesamtsuite auf dem eingefrorenen Code wurde gestartet; deren Ergebnis ist gesondert zu ergänzen.

Zusätzlich bestand auf dem aktuellen Quellcode der TypeScript-Build mit TypeScript 5.8.3 für den Rennsimulator, seine Abhängigkeiten, die beiden Physik-Einstiege und den Rennbericht. Die erzeugten Dateien waren nur temporär; daraus folgt keine sportliche Validierung.

Der anschließend ohne zwischenzeitliche Quellcodeänderungen durchgeführte Gesamtlauf der vorhandenen technischen Tests auf diesem Stand endete mit 405 bestandenen, 0 fehlgeschlagenen Tests (lokal, Node 24). Gemeinsam mit dem erfolgreichen TypeScript-Build ist das eine technische Kontrolle, keine Freigabe der sportlichen Plausibilität. Der große gepaarte Mehrseed-Rennvergleich wurde noch nicht durchgeführt; die oben genannten offenen Umsetzungsbereiche bleiben offen.


## Fortsetzung: Teamjagd, frühe Attacken und Sprinthelfer

- Im adaptiven Jagdkoordinator konnten neu interessierte Teams bisher nicht zu einer laufenden Jagd hinzukommen, solange ein bisheriges Team weiter jagte. Das wurde korrigiert; verfügbare Helfer und das jeweilige Teaminteresse bleiben Voraussetzungen.
- Eine vorherige Jagd erzeugt für das adaptive Modell keine allgemeine 120-s-Sperre mehr. Eine neue Flucht kann bei geeignetem Teaminteresse unmittelbar neu bewertet werden. Im älteren Vergleichsmodus bleibt die ursprüngliche Regel erhalten. Keine Erfolgsgarantie oder kostenlose Leistung.
- Eine bestehende kleine Spitzengruppe nahe der Rennspitze kann auch auf der Ebene weit vor dem Ziel Grund für einen Siegversuch bieten, sofern kein eigener Fahrer weiter vorausliegt. Dies ist ein begrenzter heuristischer Anlass, keine vollständig flexible Taktik oder Erfolgsgarantie. Die bisherige allgemeine Drei-Minuten-Angriffssperre des adaptiven Angriffsentscheids wurde entfernt; Motivation, Position, Reserve und physische Machbarkeit gelten weiterhin. Weitere harte Schwellen müssen geprüft werden.
- Die Auswahl naher Sprinthelfer verwendet im sprintfreundlichen stable-pack-Modell nun dieselbe vorläufige Einschätzung der verfügbaren Zeit und Position wie die Sprintpositionierung, auch für kleinere Gruppen. Die bisherige 75-%-Schwelle und die 40-Fahrer-Mindestgröße entfallen in diesem Auswahlpfad. Andere Sprintregeln und die Beschränkung auf als sprintfreundlich erkannte Rennen bleiben bestehen.
- 22 gezielte Tests für Angriff, Teamjagd und Sprintpositionierung bestanden. Ein zwischenzeitlicher Integrationslauf nach den Jagdänderungen bestand 19 Prüfungen einschließlich Berglauf. Ein technischer Lille-Kontrolllauf mit 154 Fahrern gelang nach der Sprintänderung; er wurde vor der letzten Änderung an der Drei-Minuten-Sperre gestartet und gilt nicht als aktueller finaler Stand. Technische Integrationskontrollen auf dem jüngsten Stand laufen noch. Ein TypeScript-Build gelang vor der Änderung an der Drei-Minuten-Sperre.
- Alle genannten Zahlenwerte und Entscheidungen sind unkalibrierte Heuristiken. Die Gesamtüberarbeitung und der große sportliche Vergleich bleiben offen; das vorherige Ergebnis mit 405 technischen Tests gilt nur für den älteren dort beschriebenen Stand.

Auf dem nach diesen Änderungen gesicherten Stand bestanden 15 weitere technische Integrationsprüfungen, einschließlich des mehrminütigen Berg-Anschlusses samt beobachtetem Wechsel. Ein technischer Lille-Lauf (154 Fahrer, Seed 2026) lief bis ins Ziel und wies Positionierungs- und Helferaktivität aus. Der TypeScript-Build des Simulators und Rennberichts bestand. Ein Gesamtlauf der technischen Tests auf diesem Stand wurde gestartet und muss nach Abschluss dokumentiert werden. Diese Einzelkontrollen ersetzen weder die vollständige Umsetzung noch den breiten sportlichen Modellvergleich.

Der Gesamtlauf der vorhandenen technischen Tests auf dem seit der jüngsten Überarbeitung unveränderten Quellcode ist abgeschlossen: 409 bestanden, 0 fehlgeschlagen. Der TypeScript-Build bestand ebenfalls. Diese technische Prüfung ist keine Aussage, dass die gesamte Überarbeitung abgeschlossen oder sportlich kalibriert ist. Der dokumentierte große Modellvergleich steht noch aus.


## Fortsetzung: Kapitän, Helfer und Reaktionen

- Ein geschützter Kapitän darf mit einem einzigen anwesenden, ausreichend belastbaren Helfer einen Anschluss versuchen; die frühere Mindestgröße von vier Fahrern wurde für diesen Fall auf zwei reduziert. Niedrige kurzfristige Reserve des Kapitäns sperrt einen Helferauftrag nicht mehr automatisch. Das reale Tempo und die verfügbare Energie können den Anschluss weiterhin verhindern.
- Der zuvor absolut begrenzende Abstand von 1500 m entfällt bei diesem Teamauftrag. Eine vorläufige, ebenfalls vereinfachende Grenze relativ zur Reststrecke bleibt bestehen; sie ist keine verlässliche Vorhersage von Erfolg oder erreichbarem Terrain.
- Auch bei als sprintfreundlich eingestuften Rennen dürfen mehrere verfügbare Helfer dem zurückliegenden Kapitän beim Anschluss helfen. Die bisherige Begrenzung auf einen Helfer in dieser Rennphase bleibt bei der regulären Feldjagd erhalten. Die tatsächliche Führungsarbeit und ihre Lastverteilung müssen im Rennverlauf noch detaillierter geprüft werden.
- Bei Reaktion auf einen Gegner kann ein Kapitän bereits zur Jagd eingeteilte eigene Helfer berücksichtigen, sofern sie tatsächlich in derselben Gruppe nahe vor ihm fahren. Sie verringern die Neigung zu einer sofortigen eigenen Reaktion; ein gefährlicher Gegner kann dennoch eine solche Reaktion auslösen. Heuristische Gewichtung, keine automatische Einsparung oder Garantie, dass die Helfer den konkreten Gegner einholen.
- 25 technische Prüfungen zur Team- und Anschlusslogik und zwei gezielte Integrationsprüfungen für Berganschluss und Telemetrie bestanden nach der Kapitänsänderung; der TypeScript-Build bestand zu diesem Zeitpunkt ebenfalls. Nach der anschließenden Änderung der individuellen Reaktion bestanden 14 gezielte Modulprüfungen. Die früheren 409 Gesamttests gelten nur für den älteren Stand. Ein vollständiger Test- und Sportvergleich des aktuellen Gesamtstands steht aus.


## Sprintzug-Teamplan: weiterer Teilstand

Der Teamplan nutzt für den Sprintzug im adaptiven Modus bei sprintfreundlichem stable-pack-Profil die gleiche vorläufige Schätzung aus Restdistanz, Tempo, Position und Hinterradfindefähigkeit wie die im letzten Schritt angepasste Einzelpositionierung. Die festen 82- und 94-Prozent-Grenzen entfallen in diesem Planungspfad; ältere Vergleichsmodi behalten ihr Verhalten. Der eigene Sprinter und tatsächlich anwesende Helfer müssen in einer realen Gruppe sein. Die Sprintentscheidung auf anderen Profilen und die weitere Koordination sind damit nicht allgemein fertig.

26 gezielte Tests zu Teamplanung, Sprint, Anschluss und Jagd bestanden; der TypeScript-Build für den aktuellen Simulator und Rennbericht bestand. Ein vollständiger technischer Testlauf des gegenwärtigen Stands wurde gestartet. Keine der Prüfungen ersetzt den noch ausstehenden reproduzierbaren Vergleich und die sportliche Kalibrierung.

Der auf dem seit dem Sprintzug-Teamplan unveränderten Quellcode durchgeführte vollständige technische Testlauf endete mit 413 bestandenen und 0 fehlgeschlagenen Tests. Der TypeScript-Build bestand ebenfalls. Die technische Prüfung validiert nicht die sportliche Realitätsnähe; die vollständige Überarbeitung und der große Mehrseed-Modellvergleich stehen weiterhin aus.


## Geländeausblick beim Anschluss

Die frühere pauschale 8-km-Grenze für einen Geländeausblick wurde durch eine vorläufige Einschätzung ersetzt: Der Fahrer betrachtet persönliche Berg- beziehungsweise Abfahrtsfähigkeiten, die Strecke bis zum Gelände, den aktuellen Abstand und eine Fortschreibung der momentan beobachteten Geschwindigkeiten. Wenn der Gegner nach dieser vereinfachten Momentaufnahme das Ziel bereits vor Erreichen des Geländes erreichen würde, wird es nicht als spätere Anschlussmöglichkeit gewertet. Geschätzte künftige Tempi und Vorsprünge sind unsicher; vor allem bei Geländewechseln können sie stark vom wirklichen Verlauf abweichen. Knappe Reserven können vor einer so eingeschätzten Gelegenheit auch bei aktuell wachsender Lücke vorübergehend geschont werden. Kein Positions-, Tempo- oder Energiebonus.

16 gezielte Tests zu Gelände, Anschlussmotiven und Gegnerreaktion bestanden; aktuelle technische Integrations- und Buildprüfungen laufen. Sportliche Kalibrierung und Mehrseed-Vergleich stehen aus.

## Verbleibende große Arbeitsbereiche

- Fluchtgruppen: situationsbezogene Zusammenarbeit, Verweigerung von Führungsarbeit und Interessenkonflikte zwischen Teams und Fahrern; bisher kein vollständiger Nachweis.
- Weitere Team-/Angriffsentscheidungen und Gegenreaktionen: harte Schwellen reduzieren, tatsächliche Führungsarbeit, realistische Teamziele und nachvollziehbare Motivation im Rennverlauf prüfen.
- Sprint-, Berg- und Abfahrtstaktik über verschiedene Profile und kleinere Gruppen; individuelle Fahrweisen und mentale Eigenschaften sinnvoll befüllen und kalibrieren.
- Ereignisse und Bedingungen: Stürze und Defekte mit angemessenen Folgen fehlen; Wind ist vereinfacht vorhanden, Regen und detaillierte Seitenwindstaffeln sowie Materialverwaltung sind nicht vollständig. Einzelheiten, die über ein Rennen hinausgehen, gehören zum späteren Karrieremodell.
- Darstellung: den vorhandenen Berichtsbaustein in eine benutzbare Ausgabe integrieren; wettbewerbsspezifische Wertungen und Sonderregeln bleiben gesondert zu klären.
- Nach der Überarbeitung: vollständige technische Prüfung und dokumentierter gepaarter Vergleich der Modelle auf vier Profilen über mehrere Seeds, einschließlich Ursachenprüfung auffälliger Verläufe und Kalibrierung.

Diese Liste ist eine Gliederung der offenen Arbeit, keine prozentuale Fertigstellungsmessung. Viele Bereiche sind teilweise implementiert und müssen zusammen getestet werden; ihre Restdauer und die Ergebnisse des späteren Vergleichs sind nicht zuverlässig vorherzusagen.


## Später aufgeschlossene Fahrer in der Fluchterkennung

Die Fluchterkennung ergänzt einen später aufgeschlossenen Fahrer, wenn er sich tatsächlich nahe bei einem bereits erfassten Ausreißer und vor dem ursprünglichen Hauptfeld befindet. Damit bleibt die Flucht in diesem Fall aktiv, selbst wenn die ursprünglich erfassten Ausreißer zurückfallen. Die räumliche Zuordnung bleibt eine vereinfachte Heuristik; insbesondere bei langen Abstandsgruppen und stark wechselnden Gruppen muss sie weiter überprüft werden. Es handelt sich um Fluchterkennung, nicht um die vollständige Zusammenarbeit innerhalb der Flucht.

25 gezielte technische Prüfungen für Fluchterkennung, Angriffsziele, Teamjagd und Geländeentscheidungen bestanden. Ein zunächst aufgedeckter Konflikt mit einer langen Abstandskette wurde behoben und der bestehende Test anschließend bestanden. Aktuelle Integrations- und Buildprüfungen laufen; der frühere Gesamtlauf mit 413 Tests bezieht sich auf den vorherigen Stand.
