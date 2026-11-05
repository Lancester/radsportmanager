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
