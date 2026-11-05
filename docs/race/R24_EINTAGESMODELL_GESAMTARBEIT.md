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
