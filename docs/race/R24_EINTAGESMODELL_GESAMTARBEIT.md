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
