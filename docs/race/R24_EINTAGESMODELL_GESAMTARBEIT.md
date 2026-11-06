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

Auf dem Stand nach Geländeausblick und Fluchterkennung bestanden zusätzlich der TypeScript-Build sowie zwei technische Integrationsprüfungen mit einem langen Berg-Anschluss und der Anschluss-Telemetrie. Dies ersetzt weder einen neuen vollständigen Gesamttest noch die sportliche Auswertung.


## Experiment: Mitarbeit in der Fluchtgruppe – noch nicht freigegeben

Ein erster Ansatz lässt den tatsächlich an der Spitze einer erfassten, vom Hauptfeld abgesetzten Fluchtgruppe fahrenden Fahrer Führungsarbeit als Wattanfrage anbieten oder begrenzen. Ein Fahrer kann sich zum Beispiel bei niedriger Reserve oder bei eigenem Sprinter im Feld zurückhalten. Nur tatsächlich nahe, ebenfalls erfasste Begleiter werden berücksichtigt. Ein möglicher Wechsel erfolgt über reale Leistung und Position, nicht über eine Positionsgutschrift. Die Interessen- und Leistungsschwellen sind grobe, nicht kalibrierte Heuristiken.

Im ersten technischen Kontrolllauf griff der Ansatz zu häufig und erzeugte 4029 Ereignisse; nach stärkerer Begrenzung der Gruppensituation und Ereignisdokumentation blieben in diesem einzelnen Lauf noch 156 Arbeits-/Schonungsereignisse. Ein bestehender Berg-Integrationstest fand mit aktivem Ansatz keine der zuvor beobachteten passenden Ablösungen beim Nachführen; daraus folgt noch nicht, dass kein Wechsel möglich ist, aber die Auswirkung muss untersucht werden. Der Ansatz ist deshalb ausschließlich über `experimentalBreakawayCooperation: true` zuschaltbar und standardmäßig deaktiviert. Er ist weder eine fertige noch eine sportlich freigegebene Fluchttaktik.

Mit deaktiviertem Experiment bestanden neun gezielte Tests einschließlich des Berg-Integrationstests. Der TypeScript-Build bestand. Ein technischer gepaarter Kontrolllauf desselben Bergprofils/Seeds mit und ohne experimentelle Kooperation ist gestartet, um die Veränderung der tatsächlich erfassten Ereignisse besser einzugrenzen. Dies ist nicht der vereinbarte große Modellvergleich. Weiterhin offen sind wirkliche Führungsdauer, Lastenverteilung, sportliche Plausibilität, taktische Unterschiede und ein belastbarer Nachweis für Wechsel und Zusammenarbeit in der Flucht.

Der gepaarte technische Kontrolllauf ist unter `docs/race/R24_FLUCHTGRUPPEN_KONTROLLLAUF.md` gesichert. Auf dem gleichen Bergprofil/Seed veränderte das zugeschaltete Experiment die Zahl der erkannten Fluchten von 8 auf 14 und der protokollierten Attacken von 39 auf 38; es erfasste 137 Arbeits- und 19 Schonungsabsichten, aber keinen Nachführ-Ablösewechsel im entsprechenden Kontrollszenario. In beiden Fällen erreichten 154 Fahrer das Ziel. Bereits ohne Experiment wurden bis zu 40 Fahrer umfassende Gruppen als Flucht gemeldet. Diese Beobachtungen sind ein Hinweis auf nötige Untersuchung, keine repräsentative sportliche Bewertung oder ein Beweis für einen bestimmten Fehler. Experiment bleibt deaktiviert.


## Fluchtfront gemessen und Fluchtmeldungen nach Zielankunft korrigiert

Die optionale Diagnostik erfasst für tatsächlich führende Fahrer Zeit, abgerechnete Kurbelarbeit, Windschutz-Proxy und zusammenhängende Führungsabschnitte sowie Gruppengröße und Längsausdehnung beim Erkennen einer Flucht. Sie greift nicht in die Rennphysik ein; ein unabhängiger Transparenztest bestätigte unveränderte Ergebnisse und Ereignisse. Auch eine echte Frontposition beweist für sich keine taktisch vereinbarte Zusammenarbeit.

Im gepaarten technischen Hautacam-Lauf zeigte die neue Messung ohne Experiment eine anerkannte 40er-Spitzengruppe auf 11,4 m Längsausdehnung und mit Experiment eine 38er-Gruppe auf 2,9 m. Dies sind Positionen des vereinfachten 1D-Modells, keine reale Straßenbelegung; daraus lässt sich keine genaue Seitenposition oder echte Kollision ableiten. Für sportliche Entscheidungen und wechselnde Führung ist diese Begrenzung erheblich. Die detaillierten Messwerte und das reproduzierbare Skript stehen in `R24_FLUCHTGRUPPEN_KONTROLLLAUF.md` und `scripts/r24-breakaway-audit.mjs`.

Ein konkreter Fehler wurde behoben: Nach der ersten Zielankunft wurden zurückliegende Gruppen teils erneut als Rennflucht gemeldet. Im gleichen Kontrolllauf sank die Zahl der erkannten Fluchten dadurch von 8 auf 4 ohne und von 14 auf 5 mit Experiment. Dies ist eine Korrektur der Erkennung, nicht der Beweis einer realistischen Anzahl. Das experimentelle Fluchtkooperationsmodell bleibt deaktiviert, weil die Gruppengeometrie und die gemessene Wirkung noch bewertet werden müssen.

11 gezielte Tests, ein zusätzlicher Diagnostik-Transparenztest und der TypeScript-Build bestanden auf diesem Stand. Der zuletzt vollständig bestandene Gesamtlauf mit 413 Tests gehört zu einem älteren Stand; ein neuer Gesamtlauf und der breite sportliche Vergleich stehen aus.


## Fluchterkennung und unklare Frontlage – zusammenhängende Weiterarbeit

- Bei der Bestätigung einer Flucht wird die Beobachtungszeit nicht mehr auf eine völlig andere, neu entstandene Spitzengruppe übertragen. Schließen Fahrer zu einer bestehenden Kandidatengruppe auf und mindestens ein zuvor beobachteter Fahrer bleibt, bleibt die Beobachtungszeit erhalten.
- Die experimentelle Flucht-Zusammenarbeit erkennt sehr enge Längspositionen an der Spitze als nicht eindeutig. Bei mindestens einem weiteren Fahrer innerhalb von 0,5 m Längsdifferenz wird die besondere Führungsentscheidung vorläufig nicht ausgelöst. Das ist eine vorsichtige technische Heuristik des 1D-Modells, keine Aussage über seitlichen Abstand, Kollision oder eine festgelegte sportliche Gruppengröße. Das gesamte Experiment bleibt standardmäßig ausgeschaltet.
- Die optionale Frontdiagnostik erfasst die Dauer solcher mehrdeutigen Situationen und aufeinanderfolgende, tatsächlich im Modell beobachtete Frontpositionen. Für die Auswertung werden auch Wechsel gezählt, bei denen beide Abschnitte mindestens fünf Sekunden dauerten. Ob die Front genau am Übergang mehrdeutig war, wird separat festgehalten. Ein Positionswechsel ist kein Beleg für eine bewusste taktische Absprache. Die 0,5-m- und 5-s-Schwellen sind nachvollziehbare vorläufige Messannahmen und keine Realitätskalibrierung.
- 17 gezielte Tests, der technische Build und ein Kontrolllauf zur unveränderten Diagnose liefen erfolgreich. Ein vollständiger Testsatz sowie ein gepaarter Berg-Kontrolllauf auf dem jüngsten Stand laufen. Der experimentelle Fluchtansatz wird nicht als abgeschlossen oder freigegeben ausgegeben; weitere echte Zusammenarbeit, Teaminteressen und sportliche Prüfung bleiben offen.


Der anschließende vollständige technische Testlauf auf dem seit seinem Start unveränderten Code endete mit **427 bestandenen, 0 fehlgeschlagenen Tests**. Der TypeScript-Build war ebenfalls erfolgreich. Im gepaarten Hautacam-Kontrolllauf (ein Seed) wurden in der definierten Frontsituation ohne Experiment 2213 von 10152 Sekunden und mit Experiment 1802 von 6670 Sekunden als im 0,5-m-Längsband unklar erfasst. Im Experiment wurden 16 Arbeits- und keine Schonungsabsichten protokolliert; die Schonungsentscheidung wurde bisher nur isoliert getestet. Unter der zusätzlichen Auswertungsschwelle von mindestens fünf Sekunden je Seite wurden 17 bzw. 31 Positionswechsel gezählt; bei jeweils drei war der unmittelbare Übergang nach der 0,5-m-Heuristik nicht unklar. Positionswechsel sind keine nachgewiesenen taktischen Absprachen. Unterschiedliche Rennverläufe und ein einzelner Seed erlauben keine allgemeine oder kausale sportliche Bewertung.

Rohdaten: `docs/race/r24-flucht-frontwechsel-seed-777.jsonl`; Erläuterung: `docs/race/R24_FLUCHTGRUPPEN_KONTROLLLAUF.md`. Das Experiment bleibt deaktiviert. Offene Aufgaben: die lange 1D-Abstandsgruppe, unterschiedliche sportliche Ziele und tatsächliche Zusammenarbeit insbesondere auch in kleineren Fluchtgruppen weiter prüfen; dann die weiteren vereinbarten Modellbereiche ausarbeiten und den großen Vergleich durchführen.


## Fortsetzung: Nachführen, Führungsdauer und Rennbericht

- Ein Helfer eines Sprintteams kann sich einem vorhandenen gemeinsamen Anschluss anschließen, wenn der eigene Sprinter nicht in derselben Gruppe ist, keine vorrangige Teamaufgabe besteht und die übrigen Voraussetzungen erfüllt sind. Die Bereitschaft ist vorläufig geringer als bei einem offensiven Team; ein geschützter Sprinter in der Gruppe und sonstige Aufgaben begrenzen den Einsatz. Physische Position, Leistung und tatsächlicher Anschluss bleiben maßgeblich.
- Im weiterhin standardmäßig deaktivierten Fluchtkooperationsexperiment wurde die automatische zeitabhängige Ablöseanforderung ergänzt: Ist die Reserve seit Beginn der echten Frontphase stabil, gibt es keine pauschale Höchstführungsdauer; ein Rückgang oder niedriger Wert kann nach einem kurzen 20-s-Stabilisierungspuffer ein Ablöseangebot auslösen. Die vorläufigen Schwellen betreffen taktische Entscheidungen, nicht die körperlichen Modelle. Bei bisherigen Anschlussversuchen ohne erfassten Startzustand bleibt die ältere Logik bestehen. Noch kein Nachweis sportlich geeigneter Führungswechsel.
- Der Rennberichtsbaustein kann nun optionale gemessene Fluchtfrontarbeit und eine kompakte Textausgabe der gewerteten Ergebnisse, vorab angegebenen Favoriten und aufgezeichneten Ereignisse bereitstellen. Fehlende Diagnostik wird ausdrücklich von einer Messung ohne erfasste Frontarbeit unterschieden. Die Messung erfasst nur die definierte Situation; Frontposition belegt keine Absprache. Das Kommando `node scripts/r24-race-report.mjs ergebnis.json [favoriten.json] [teamId]` erzeugt die Ausgabe aus vorhandenen Daten. Eine fertige Benutzeroberfläche oder automatische Vorab-Favoritenauswahl ist damit nicht implementiert.
- 13 gezielte Tests und ein TypeScript-Build bestanden für den Zwischenstand; ein kurzer technischer Lauf erzeugte erfolgreich einen lesbaren Bericht aus dem tatsächlichen Rennergebnis und einer vor dem Lauf angelegten Favoritenliste. Weitere technische Integrationstests und ein gepaarter Kontrolllauf laufen. Das frühere Ergebnis von 427 technischen Tests bezieht sich auf den vorherigen Stand; die sportliche Kalibrierung und der große Modellvergleich stehen aus.


### Kontrollen für das Paket Nachführen, Fluchtführung und Rennbericht

Auf dem aktuellen Paketstand bestand der TypeScript-Build. 12 gezielte Integrations- und Funktionstests liefen erfolgreich, darunter der bestehende Berglauf mit mehr als zehnminütigem Anschluss und beobachteter Position nach Ablöseangebot sowie die Diagnostikprüfung. Im kurzen technischen Berichtskontrolllauf wurden zwei Fahrer vor dem Start rein zur Funktionsprüfung als Favoriten eingetragen; dies war keine sportliche Favoritenbewertung. Die Textausgabe wurde aus dem tatsächlichen gespeicherten Ergebnis erzeugt. Eine Benutzeroberfläche besteht weiterhin nicht.

Der gepaarte technische Hautacam-Kontrolllauf (154 Fahrer, Seed 777) lief mit deaktiviertem und aktiviertem Fluchtkooperationsexperiment bis ins Ziel; die geprüfte Energiebilanz blieb bei beiden innerhalb der Toleranz. Ohne Experiment wurden in der definierten Frontsituation 10.152 Sekunden erfasst, 17 aufeinanderfolgende Positionen mit mindestens fünf Sekunden je Seite, davon drei am Übergang gemäß der 0,5-m-Heuristik nicht als unklar. Mit Experiment waren es 10.655 Sekunden, 38 solche Positionswechsel und zwei am Übergang gemäß Heuristik nicht als unklar; 12 Arbeits- und vier Schonungsabsichten wurden protokolliert. Absichten sind keine gemessenen tatsächlichen taktischen Absprachen und die Läufe unterscheiden sich im Verlauf. Ein einzelner Seed erlaubt keine repräsentative, kausale oder sportliche Bewertung. Vollständige Rohdaten: `docs/race/r24-reserve-bericht-kontrolllauf-seed-777.jsonl`.

Wichtig: Die neue Ablöseentscheidung im Experiment nutzt vorläufig vor allem Veränderung und Stand der W′-Reserve und einen 20-s-Stabilisierungspuffer. Sie bildet langfristige Ermüdung, Interesse des möglichen übernehmenden Fahrers und taktische Situation noch nicht vollständig ab; keine pauschale Höchstdauer bedeutet keine bereits realistisch kalibrierte individuelle Führungsdauer. Das Experiment bleibt bis zu weiteren Prüfungen standardmäßig deaktiviert.

Der vollständige technische Testsatz auf dem neuen Paketstand läuft separat. Die vereinbarte Gesamtüberarbeitung einschließlich sinnvoller Zusammenarbeit der Flucht, weiterer Rennregeln und des breiten sportlichen Vergleichs bleibt unvollständig.

Der vollständige technische Testsatz auf dem Paketstand endete zunächst mit 428 bestandenen von 430 Tests. Zwei lange automatisierte Rennvergleichstests erreichten jeweils ihr festes Zeitlimit von 240 Sekunden (`ETIMEDOUT`); dies ist noch weder ein bestandener Test noch ein Nachweis eines inhaltlichen Modellfehlers. Sie liefen im Gesamttest unter paralleler Last. Die betroffenen Tests werden einzeln erneut geprüft und ihre Ergebnisse nachgetragen; bis dahin darf kein vollständig bestandener Gesamtlauf behauptet werden.

Auch die anschließende Einzelwiederholung des Gruppenkontrolltests `r22-group-ai-ab` erreichte das unveränderte interne Zeitlimit von 240 Sekunden (`ETIMEDOUT`). Die Prüfung ist damit weiterhin nicht bestanden; eine reine Lastkonkurrenz im Gesamtlauf ist als alleinige Erklärung nicht belegt. Der weitere betroffene Profiltest wird einzeln geprüft. Langsame Laufzeit bzw. erforderliche Performance-Untersuchung sind offen; keine frühere Gesamtlauf-Freigabe auf diesen Stand übertragen.

Die Einzelwiederholung des Profiltests `r22-profile-smoke` erreichte ebenfalls das unveränderte interne Zeitlimit von 240 Sekunden (`ETIMEDOUT`); ein weiterer Test dieser Datei bestand. Beide betroffenen langen Prüfungen wurden somit auch ohne parallele Testläufe nicht innerhalb ihrer üblichen Grenze abgeschlossen. Zur Trennung von Laufzeit und inhaltlichen Testaussagen wird eine lokale Kopie des Gruppentests mit unveränderten Assertions, aber einem Zeitlimit von 600 Sekunden ausgeführt. Das ändert die Repository-Tests nicht und kann den bestehenden Zeitlimitbefund nicht aufheben. Das Ergebnis ist nachzutragen; die Ursache der Laufzeit und der Vergleich zur Vorversion sind bislang ungeklärt.

Die lokale Wiederholung des Gruppentests mit unveränderten Assertions und ausschließlich auf 600 Sekunden vergrößertem Zeitrahmen bestand nach 272,8 Sekunden. Die normale Testversion mit 240 Sekunden bleibt in dieser Umgebung zeitüberschritten; der längere Lauf belegt die inhaltlichen Assertions, aber nicht das Einhalten der ursprünglichen Laufzeitgrenze. Der Profiltest wird nun ebenso einzeln mit erweitertem Zeitrahmen geprüft. Ein Laufzeitvergleich gegen den vorherigen Branch unter gleichen Bedingungen bleibt ausstehend.


Auch die lokale Einzelwiederholung des Vier-Profil-Tests mit unveränderten Assertions und auf 600 Sekunden erweitertem Zeitrahmen bestand; sie dauerte rund 238,9 Sekunden. Im vorangegangenen Gesamtlauf und der ersten Einzelwiederholung war dieselbe Prüfung am normalen internen 240-s-Limit abgebrochen. Zusammen mit dem erweiterten Gruppentest bestehen somit alle inhaltlichen Prüfaussagen der beiden zuvor zeitüberschrittenen Tests in ihren gesonderten Wiederholungen. Dennoch bleibt der ursprüngliche Gesamtlauf mit 428 bestandenen und zwei Zeitüberschreitungen dokumentiert: Ein vollständig bestandener Standardlauf unter der normalen Zeitgrenze wurde nicht nachgewiesen. Laufzeitschwankung und möglicher Performanceeinfluss des Entwicklungsstands sind ohne gepaarten Messvergleich nicht geklärt.

Das Paket aus bedingter Unterstützung beim Anschluss, reserveabhängiger experimenteller Führungsdauer und lesbarem Rennbericht ist auf diesem Branch gesichert. Das Fluchtkooperationsexperiment bleibt deaktiviert, die offenen sportlichen Regeln und die angekündigte große gepaarte Rennserie bleiben ausstehend.


## Gesamtübersicht und jüngste Modellarbeit

Die vollständige, verständliche Übersicht aller 22 vereinbarten Bereiche mit vorhandenem Stand und offenen Aufgaben vor dem großen Test steht in [R24_GESAMTUEBERSICHT_VOR_GROSSTEST.md](R24_GESAMTUEBERSICHT_VOR_GROSSTEST.md). Sie unterscheidet Teilstand, ausgeschaltetes Experiment und offene Eintages- bzw. spätere Karrierethemen.

Die Textausgabe des Rennberichts zeigt zusätzlich die gerundete gewertete Siegerzeit. Bei der Gegnerbewertung wurde dieselbe unveränderte Vergleichsgröße nicht mehr unnötig doppelt berechnet; ein Grenzfall der Fluchterkennung bei der 15-m-Nähe wurde zusätzlich geprüft. 28 gezielte Tests und der TypeScript-Build bestanden. Ein reproduzierbarer 30-km-Kontrolllauf mit 154 Fahrern und vollständigem Ergebnishash war in drei Wiederholungen vor und drei nach den untersuchten Änderungen bitgleich. Eine umfangreichere Änderung an der Fluchterkennung wurde mangels zuverlässig messbaren Geschwindigkeitsvorteils zurückgenommen. Die gemessenen Zeiten schwankten deutlich, unter anderem nach Rücknahme zwischen 3,664 und 19,855 Sekunden; daraus ist weder ein belastbarer Leistungsgewinn noch die Ursache der früheren Zeitüberschreitungen ableitbar.

Ein neuer vollständiger technischer Standardlauf und der große sportliche Mehrseed-Vergleich wurden auf dem jüngsten Stand nicht durchgeführt. Der zuvor beschriebene Lauf mit 428 bestandenen und zwei zeitüberschrittenen Tests sowie deren verlängerte Einzelwiederholungen bleiben der zuletzt dokumentierte vollständige technische Prüfdurchlauf; die Regeln sind insgesamt nicht vollständig.

Ergänzend verfügt das Referenzfeld jetzt über die ausdrücklich optionale Einstellung `tacticalTraits: 'varied'`. Sie erzeugt fiktive, fahrerbezogen stabile und unkalibrierte Werte für Verfolgungsbeharrlichkeit und Bergangriffsneigung, ohne den Standarddatensatz oder körperliche Werte zu ändern. 18 gezielte Tests einschließlich eines reproduzierbaren 35-Fahrer-Kontrolllaufs sowie der TypeScript-Build mit Referenzfeldern bestanden. Die einheitlichen Eingaben für den späteren Versionsvergleich und die sportliche Plausibilität der Werte sind noch festzulegen. Die [Gesamtübersicht](R24_GESAMTUEBERSICHT_VOR_GROSSTEST.md) ist entsprechend aktualisiert.


## Kontrolliertes Defektszenario

Ein ausdrücklich vorgegebenes mechanisches Ereignis kann zu einem einstellbaren Zeitpunkt ausgelöst werden. Es bremst den Fahrer mit der vorhandenen Bewegungsberechnung ab, startet die vorgegebene Reparatur erst im Stillstand und lässt den Fahrer anschließend wieder am Rennen teilnehmen. Der tatsächliche Zeitverlust entsteht im Rennverlauf. Während des Defekts werden betroffene Helfer in der autonomen Helfer- und Feldjagdplanung nicht disponiert; der Rennbericht nennt die beobachteten Defektphasen. Das Szenario ist standardmäßig ausgeschaltet.

21 gezielte Tests und der TypeScript-Build bestanden. Ein technischer Lauf über 10 km mit 30 Fahrern und 45 s Reparatur dauerte bis zur Weiterfahrt ab dem Auslösen 50 s; der betroffene Fahrer kam 50,07 s hinter der Siegergruppe ins Ziel. Ein einzelner Lauf ist keine sportliche Kalibrierung. Zufallsereignisse, Sturz, Aufgabe, gezielte Unterstützung und das Verlassen der eindimensionalen Fahrbahn fehlen. Der alte Zweig kennt die Eingabe nicht, deshalb muss der allgemeine Versionsvergleich zunächst ohne sie erfolgen. Der frühere vollständige Standardlauf mit 428 bestandenen und zwei zeitüberschrittenen Tests ist nicht durch einen neuen vollständigen Lauf ersetzt worden. Details und weitere offene Aufgaben stehen in der [Gesamtübersicht](R24_GESAMTUEBERSICHT_VOR_GROSSTEST.md).

Ein 30-km-Kontrolllauf mit 154 Fahrern und Seed 777 lieferte bei ausgeschaltetem Defekt in drei Wiederholungen exakt denselben vollständigen Ergebnishash wie der zuvor dokumentierte Stand. Das prüft diesen konkreten Standardfall, nicht alle möglichen Rennen.


## Vergleichsreihe vor Vermischung schützen und Auswertung vorbereiten

Für neue Reihen wurde die Wiederaufnahme an Inhaltsprüfsummen der Engine-Verzeichnisse und der ausgeführten Testskripte, den Testplan und die Node-Version gebunden. Jedes Ergebnis trägt eine Kennung der Reihe und Modellversion; Ergebnisse ohne passendes Manifest werden nicht in eine neue Serie übernommen. Eine Linux-Dateisperre verhindert den parallelen Start im selben Verzeichnis. Die Erkennung von während der Laufserie veränderten Dateien markiert die Reihe als ungültig; nach abruptem Abbruch sind zwischenzeitliche Änderungen nicht vollständig rückwirkend nachweisbar. Ältere Dateien bleiben erhalten, brauchen für einen neuen Vergleich aber ein separates Verzeichnis.

Die beiden Rennskripte speichern pro Ergebnis Fahrertyp und W′-Kapazität. Damit funktioniert die Auswertung neuer Ergebnisse ohne separate `rosters.json`; für alte Ergebnisse bleibt diese gegebenenfalls erforderlich. Ergänzt wurden die mittlere Verteilung der Fahrertypen in den Top 10 und die mediane Anzahl aufgezeichneter Angriffsbeginn-Ereignisse des vorab bestimmten Profilfavoriten, soweit Telemetrie vorhanden ist. Die Zählung beweist weder Angriffsqualität noch einen erfolgreichen Vorstoß.

Geprüft: simulierter Abbruch und Wiederaufnahme einer 200-Aufgaben-Reihe mit einer Test-Engine, geänderte Quellen, falsch zugeordnete Datei, fehlendes Manifest, Ausgabedaten und Auswertung künstlicher Ergebnisse; dazu gezielte Berichts- und Angriffstelemetrietests. Diese Tests waren keine echte große Rennserie. Modell- und Laufzeitprüfung sowie der vollständige aktuelle Testsatz sind weiter offen.


## Flucht: freiwilliges Arbeitsangebot und beobachteter Positionswechsel

Die experimentelle Fluchtlogik wurde um die eigene Arbeitsbereitschaft der Teilnehmer erweitert. Ein Führender verringert für ein Ablöseangebot nur dann freiwillig die Leistung, wenn ein tatsächlich naher, erfasster Partner aufgrund seiner eigenen Teamlage und Reserve mitarbeiten möchte und verfügbar ist. Ein Positionswechsel wird anschließend getrennt vom Angebot beobachtet; er ist keine Garantie einer dauerhaften Ablösung. Die Zuordnung ist auf 120 s begrenzt und verändert nur die Diagnose. Das Experiment bleibt standardmäßig deaktiviert.

Im vollständigen Hautacam-Kontrolllauf mit Seed 777 und 154 Fahrern wurden 16 Angebote und 13 nach Angebot beobachtete Positionswechsel erfasst. In der bestehenden Frontdiagnose fanden sich 10.644 Front-Fahrer-Sekunden und 37 Positionswechsel mit mindestens fünf Sekunden je Abschnitt, darunter nur zwei nach der vorhandenen 0,5-m-Heuristik am Übergang eindeutig. Diese Metriken haben unterschiedliche Kriterien; eine realistische, dauerhafte Ablösung ist damit nicht nachgewiesen. Alle kamen ins Ziel und die Energiebilanz war innerhalb der Prüftoleranz. Ein 60-km-Flachlauf zeigte keine messbare gemeinsame Frontphase. Bei deaktiviertem Experiment blieb ein 30-km-Lauf in drei Wiederholungen bitgleich zum dokumentierten Ausgangsstand. 22 gezielte Tests und TypeScript-Build bestanden; Gesamtstandardtest, weitere Sportprüfung und großer Vergleich fehlen. Siehe [Gesamtübersicht](R24_GESAMTUEBERSICHT_VOR_GROSSTEST.md).

Ein zweiter vollständiger technischer Hautacam-Lauf mit Seed 42 ergab ebenfalls 154 Zieleinläufe und eine Energiebilanz innerhalb der Prüftoleranz. Er zeigte 5.696 Front-Fahrer-Sekunden, 17 längere Positionswechsel, davon einen nach der bestehenden 0,5-m-Heuristik am Übergang nicht unklar, sowie 12 Ablöseangebote und 11 nach einem Angebot beobachtete Längspositionswechsel. Auch dies ist kein Nachweis sportlich realistischer Zusammenarbeit; beide Läufe nutzen dasselbe Streckenprofil. Der Diagnoseablauf unterstützt die explizite Angabe eines Seeds.


## Erste Vergleichsrennen zu Angriffen und Reaktionen

Auf Lille und Hautacam wurde jeweils Seed 42 mit gemeinsamem 154-Fahrer-Feld über main, Audit und den neuen Stand simuliert. Gemeinsame Basis-Hashes je Strecke stimmten überein; Entwicklungsattribute sind aus dem gemeinsamen Hash ausgenommen. Im neuen Stand wurden auf beiden Profilen über 1.400 als Angriffreaktion bezeichnete Verfolgungsbeginne gezählt; über 900 davon auf den ersten 30 km. Das sind einzelne Zustandsbeginne und keine unabhängigen Fahrer oder nachgewiesenen Dauerverfolgungen. Der Befund rechtfertigt die nächste konkrete Prüfung der Mannschaftsziele und Kapitänsschonung in der Reaktionswahl. Ein fixes Angriffslimit oder eine unkalibrierte Ergebnisvorgabe wurde nicht eingeführt. Details und vollständige archivierte Daten: [Zwischenstand Angriffsreaktionen](R24_ANGRIFFSREAKTION_ZWISCHENSTAND.md).

Der Datenstand umfasst sechs echte Rennläufe, nicht den vollen großen Mehrseed-Vergleich. 16 gezielte Tests bestanden; ein neuer vollständiger Standardtest wurde nicht ausgeführt.
