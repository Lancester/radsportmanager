# Eintagesrennmodell: Gesamtstand und offene Arbeit vor dem großen Vergleich

Stand: 06.11.2026. Arbeitszweig: `feature/r24-eintagesmodell-gesamt`. Diese Übersicht fasst den Entwicklungsstand aus den gemeinsam besprochenen 22 Bereichen zusammen. **Teilweise** bedeutet: Es gibt einen Ansatz, aber die vereinbarten Regeln sind nicht vollständig umgesetzt oder sportlich geprüft. **Experimentell** bedeutet: nicht allgemein freigegeben; das Fluchtgruppenexperiment ist standardmäßig ausgeschaltet. Die Übersicht ist keine Sportfreigabe.

Grundlagen: [gemeinsam vereinbarte Entscheidungen](https://github.com/Lancester/radsportmanager/blob/docs/r24-rennki-regeluebersicht/docs/race/R24_GEMEINSAME_RENNKI_ENTSCHEIDUNGEN.md), [laufender Arbeitsstand](R24_EINTAGESMODELL_GESAMTARBEIT.md) und [Fluchtgruppen-Kontrolllauf](R24_FLUCHTGRUPPEN_KONTROLLLAUF.md).

## Was der Entwicklungszweig mitnimmt

Der Gesamtzweig baut auf dem vorherigen Audit-Entwicklungszweig auf. Bei einem Vergleich der Branches wurden keine Dateien des Audit-Zweigs entfernt. Die Kerndateien für Critical Power/W′, Ausdauer, ermüdungsabhängige Leistungskapazität, Bewegungsphysik und Formationswindschatten wurden gegenüber dem Audit-Branch als identisch geprüft. Die zentralen Aufrufe im Rennsimulator blieben dabei erhalten. Die KI und die Rennorganisation erzeugen teilweise andere Leistungswünsche; dadurch können tatsächliche Kräfte, W′, Ermüdung, Geschwindigkeiten und Ergebnisse trotz gleicher Berechnungskerne anders verlaufen.

Gegenüber `main` enthielt der frühere Audit-Branch bereits eigene Änderungen, unter anderem zur Ermüdung. Einzelne Taktikregeln und ihre Grenzen wurden im Gesamtzweig geändert oder ersetzt; darüber hinaus wurden Diagnostik, Zielgruppen-Zeiten und ein Berichtsbaustein ergänzt.

## Übersicht der 22 vereinbarten Bereiche

| Nr. | Thema | Stand | Bereits vorhanden und wichtige offene Grenze |
|---:|---|---|---|
| 1 | Frühe Flucht und Teamziel | Teilweise | Fluchtabsicht und Teamstrategien vorhanden; differenzierte Fahrerauswahl und echter Teamplan nicht vollständig. |
| 2 | Bestehende Flucht, Nachsetzen und neue Flucht | Teilweise | Teams können Nachsetzen bzw. bei geeignetem Interesse auch eine Gruppe jagen; eine vollständig begründete Strategie für erneute Fluchtbildung ist noch nicht belegt. |
| 3 | Flucht akzeptieren | Teilweise | Teamziel und nominell geschätzte Gegnergefahr können einfließen; vollständige Chancenbewertung und Beobachtung anderer Teams fehlen. |
| 4 | Feldjagd dosieren | Teilweise | Teamaufträge, Helferauswahl und gemessene Frontarbeit vorhanden; Belastung, tatsächlich funktionierende Ablösung und Entscheidungen mehrerer Teams im Rennen weiter prüfen. |
| 5 | Zusammenarbeit in der Flucht | Experimentell | Fahrer bewerten eigenständig ihre Mitarbeit; ein Führender bietet nur bei nahem, arbeitsbereitem Partner eine Ablösung an. Beobachtete Positionswechsel und tatsächliche Frontarbeit werden getrennt erfasst. Sportliche Plausibilität und Lastenverteilung bleiben offen; standardmäßig ausgeschaltet. |
| 6 | Gemeinsames Nachführen und Gelände | Teilweise | Mehrminütiges Nachführen und gemeinsame Ziele sind möglich; Geländeausblick ist eine grobe Momentanschätzung. Zusammenarbeit und echte Führungswechsel benötigen weitere Prüfung. |
| 7 | Verfolgung fortsetzen, dosieren oder aufgeben | Teilweise | Kein rein zeitgesteuerter 120-s-Abbruch mehr; Abstandsentwicklung, Kräfte und Gelände wirken ein. Die Bewertung enthält weiterhin provisorische Schwellen und unvollständige Vorausschau. |
| 8 | Angriff auf Sieg | Teilweise | Situative Angriffsziele und einige frühere Grenzen geändert; weitere Distanz- und Phasenschwellen sowie Siegchancen müssen geprüft werden. |
| 9 | Reaktionen und Schutz des Kapitäns | Teilweise | Reaktionen auf erkennbare Gegner und Helferaufträge vorhanden; auch ein Helfer kann einen zurückliegenden Kapitän unterstützen. Abstimmung und tatsächliche Entlastung müssen im Rennen geprüft werden. |
| 10 | Gegnergefahr | Teilweise | Relative Schätzung aus nominellen Fähigkeiten und Profil, ohne fremdes aktuelles W′. Sie ist eine grobe Heuristik und noch keine vollständige dynamische Einschätzung. |
| 11 | Sprint und Vorbereitung | Teilweise | Positionsbedarf, Helfer, Hinterrad und Sprintbeginn teilweise situationsabhängig; einige Pfade sind auf sprintfreundliche Profile begrenzt und nicht allgemein fertig. |
| 12 | Längere Anstiege | Teilweise | Vorhandene Physik, Reserven und Bergtempo werden genutzt; Reaktionen, Helfer und gleichmäßiges eigenes Fahren im Gesamtmodell prüfen. |
| 13 | Individuelle Bergfahrweise | Teilweise | Optionale taktische Angriffsvorliebe am Berg, getrennt von physischer Fähigkeit; ein ausdrücklich optionales fiktives Testfeld vergibt stabile Werte. Keine sportliche Kalibrierung. |
| 14 | Abfahrtstechnik und Risiko | Teilweise | Technik und Bremsung vorhanden; eine eigenständige situationsabhängige Risikowahl und ihre Folgen sind nicht vollständig umgesetzt. |
| 15 | Feldposition und Windschatten | Teilweise | Bestehende 1D-Position und Windschattenphysik; fehlende seitliche Spuren begrenzen Überhol- und Frontinterpretation. Keine vollständige 2D-Fahrbahn behaupten. |
| 16 | Stürze und Defekte | Experimenteller Testfall | Ein ausdrücklich vorgegebener Defekt bewirkt Anhalten, Reparatur und Weiterfahrt über die bestehende Physik; währenddessen ist der Fahrer nicht als Helfer verfügbar. Zufällige Defekte, Stürze, Aufgabe und gezielte Unterstützung fehlen. Langfristige Verletzungsfolgen gehören zum späteren Karrieremodell. |
| 17 | Wind und Wetter | Teilweise | Vereinfachter Wind wirkt physikalisch; Regen, nasse Kurven und vollständige seitliche Windstaffeln sind nicht fertig. |
| 18 | Fahrerwerte und Tagesform | Teilweise | Individuelle Leistung, Gewicht, Reserven, Ausdauer und Tagesform bereits vorhanden; Verteilung, Zusammenspiel und sportliche Kalibrierung prüfen. Karriereentwicklung später. |
| 19 | Mentale und taktische Eigenschaften | Teilweise | Beharrlichkeit bei der Verfolgung und Bergangriffsneigung optional; ein ausdrücklich optionales Testfeld vergibt fiktive stabile Werte. Ohne Aktivierung bisherige Vorgaben. Weitere mentale Eigenschaften und sportlich belastbare Werteverteilung fehlen. Keine Watt- oder Siegboni. |
| 20 | Material und Fahrphysik | Teilweise | Masse, Luft- und Rollwiderstand wirken in der bestehenden Physik. Eine vollständige Materialauswahl bzw. Managementfunktion ist später zu entwickeln. |
| 21 | Zielreihenfolge und Gruppenzeiten | Teilweise | Individuelle Zielzeiten und konfigurierbare gewertete Gruppenzeiten vorhanden; experimenteller 1-s-Standard ist kein vollständiges wettbewerbsspezifisches Regelwerk. |
| 22 | Nachvollziehbarer Rennbericht | Teilweise | Struktur und Textausgabe aus tatsächlichen Ergebnissen/Ereignissen, vorab gelieferten Favoriten und optional gemessener Frontarbeit vorhanden. Keine fertige Oberfläche, keine automatische Vorab-Favoritenwahl und keine vollständige Ursachenerkennung. |

## Was vor dem großen Test noch zu tun ist

1. **Fluchtgruppe und Gruppenerkennung:** Eigenes Arbeitsinteresse, Nähe und beobachtete Positionswechsel werden im Experiment berücksichtigt. Weitere Vergleichsläufe und konkrete Verläufe auswerten: wirkliche Lastenverteilung, Dauer und Unsicherheit durch die 1D-Gruppenbildung. Das Experiment erst dann für den Vergleich festlegen. 0,5 m, fünf Sekunden und das 120-s-Zuordnungsfenster sind vorläufige Diagnoseannahmen, keine echten Rennvorschriften.
2. **Taktische Zusammenhänge:** Motive von Attacken und Reaktionen, Kapitäns- und Helferverhalten sowie die aus den Regeln entstehende Angriffshäufigkeit kontrollieren. Nicht mit einer willkürlichen Angriffshöchstzahl Ergebniswerte erzwingen.
3. **Individuelle Fahrweisen und Eintages-Ereignisse:** Ein optionales fiktives Testprofil mit stabilen taktischen Eigenschaften ist vorbereitet; für den großen Vergleich müssen die genutzten Eigenschaften und dieselben Fahrereingaben je Version festgelegt werden. Sprint, Berg und Abfahrt auf unterschiedlichen Profilen berücksichtigen. Ein vorgegebener mechanischer Defekt ist als technischer Testfall vorhanden; zufällige Defekte, Stürze, Aufgabe und gezielte Hilfe fehlen. Für einen fairen Modellvergleich müssen Ereignisse und identische Eingaben kontrollierbar sein. Ältere Versionen unterstützen die neue Defekteingabe nicht: Der gemeinsame Versionsvergleich muss deshalb zunächst ohne diese Eingabe stattfinden; ein Defektvergleich ist zunächst innerhalb der neuen Version möglich. Weitere Karrierefolgen bleiben später.
4. **Berichte und Datenqualität:** Favoriten vor Rennstart dokumentieren, Ergebnisgruppen und tatsächliche Ereignisse/Führungsarbeit ausgeben, Unsicherheit kennzeichnen und keine Ursachen erfinden. Die Genauigkeit und Vollständigkeit der vorhandenen Telemetrie vor ihrer Auswertung prüfen.
5. **Technischer Abschluss und Laufzeit:** Die Vergleichsreihe besitzt nun ein Manifest zur Wiederaufnahme und speichert benötigte Fahrerdaten pro Rennen. Aktuellen Build und vollständigen Testsatz prüfen, die zwei bislang zeitüberschrittenen Langtests und die Laufzeit gegenüber einer unter gleichen Bedingungen gemessenen Vorversion untersuchen. Vorherige Teilerfolge nicht als neuen vollständigen Standardlauf ausgeben.
6. **Großer sportlicher Vergleich:** Erst nach zusammenhängender Überarbeitung die dokumentierten Versionen, Profile, Fahrerfelder, Seeds, Ereigniseinstellungen und Auswerteregeln festhalten. Alle relevanten Rennen auswerten, Favoriten und Zielgruppen sowie Angriffe, Flucht, Jagd, Kräfte und auffällige Verläufe betrachten. Unterschiede und mögliche notwendige Nachkalibrierung transparent darstellen.

Nicht Voraussetzung für den ersten Eintagesvergleich sind eine vollständig spielbare Karriere, Gesamtwertung über mehrere Tage, Personal- und Materialverwaltung oder eine vollständige 2D-Simulation. Der Verzicht darauf bedeutet nicht, dass vereinbarte Eintagesregeln als erledigt gelten.

## Prüfstand und Grenzen

- Auf einem früheren Stand liefen 427 technische Tests und der Build erfolgreich.
- Beim nachfolgenden Paket bestanden im normalen Gesamtlauf 428 von 430 Tests; zwei lange Tests überschritten das feste interne Zeitlimit von 240 s. Beide bestanden später einzeln mit unveränderten Prüfaussagen und erweitertem Zeitrahmen. Ein vollständiger Standardlauf ohne Zeitüberschreitung wurde für diesen Stand nicht nachgewiesen.
- Der neueste Zwischenstand wurde mit gezielten Tests und TypeScript-Build kontrolliert; ein neuer Gesamtlauf und der sportliche Mehrseed-Vergleich sind offen.
- Der erste Test einer Laufzeitoptimierung auf einem 30-km-Ausschnitt mit 154 Fahrern und drei Wiederholungen je Version zeigte identische Ergebnisdaten, aber keinen zuverlässigen Geschwindigkeitsvorteil. Die kompliziertere Änderung an der Fluchterkennung wurde deshalb zurückgenommen. Eine kleine Vermeidung doppelter Berechnungen bei der Gegnerbewertung bleibt; der Einfluss auf die langen Tests ist ungeklärt.
- Ein einzelner Seed oder bestandener technischer Test beweist keine realistischen Rennergebnisse. Der große Vergleich muss echte Unterschiede und ihre Ursachen offenlegen.


## Ergänzung: optionale taktische Eigenschaften im Referenzfeld

`createReferenceFixture({ ..., tacticalTraits: 'varied' })` ergänzt fiktive, individuell unterschiedliche Werte für Beharrlichkeit beim Anschluss und die Vorliebe für Angriffe am Berg. Ihre Berechnung nutzt feste fahrerbezogene Kennungen; ein anderer Tagesform-Seed verändert sie nicht. Die Werte sind unkalibrierte Testannahmen, keine bekannten Eigenschaften realer Profis. Ohne diese explizite Option bleiben die vorherigen Referenzfahrer und ihr Verhalten erhalten. Beim Vergleich müssen dieselben Eingabefelder und Fahrer für alle Versionen vorbereitet und dokumentiert werden; ältere Modelle können unbekannte taktische Eigenschaften nicht automatisch nutzen.

Tests prüften, dass sich die beiden Eigenschaften unterscheiden können, dieselben Fahrer über mehrere Seeds dieselben Werte erhalten und alle übrigen Fahrerwerte einschließlich CP, W′ und Masse identisch zum jeweiligen Ausgangsfeld bleiben. Ein kurzer Lauf mit 35 Fahrern und aktivierten Testwerten war reproduzierbar und bestand die Energiebilanzprüfung. 18 gezielte Prüfungen und der TypeScript-Build einschließlich Referenzfeld bestanden auf diesem Ergänzungsstand. Dies ist keine sportliche Kalibrierung und kein vollständiger technischer Gesamttest.


## Ergänzung: kontrollierter Defekt als technisches Szenario

Mit `plannedMechanicalIncidents` können Fahrer, Zeitpunkt und Reparaturdauer ausdrücklich vorgegeben werden. Ohne Eingabe ist das Szenario ausgeschaltet. Der Fahrer bremst über den vorhandenen Bewegungsintegrator ab; die Reparatur beginnt erst nach dem Stillstand, danach kann er wieder anfahren. Die bestehenden Berechnungen für Energie, Erholung und Bewegung bleiben erhalten; Zeitverlust entsteht durch den tatsächlichen Rennverlauf. Während der Reparatur werden in der autonomen Helfer- und Feldjagdplanung keine Helferaufträge an den betroffenen Fahrer vergeben. Ereignisse werden im Bericht angezeigt. Die Zeitauflösung hängt von der Simulationsschrittweite ab.

Das ist **kein fertiges Pannenmodell**: Wahrscheinlichkeit, Art und realistische Dauer eines Defekts werden nicht automatisch bestimmt; Stürze, Rennaufgabe, gezieltes Warten oder Unterstützen durch Teamkollegen und Materialwagen fehlen. Der Fahrer verbleibt auf der eindimensionalen Strecke; ein räumliches Ausweichen an den Straßenrand wird nicht simuliert. Für den Test ist höchstens ein vorgegebener Defekt je Fahrer zulässig.

21 gezielte Tests zu Defekt, Helferplanung, Jagd, Bericht und optionalen Eigenschaften sowie der TypeScript-Build bestanden. In einem technischen 10-km-Lauf mit 30 Fahrern trat ein Defekt nach 60 s ein, der Fahrer stand nach fünf weiteren Sekunden und fuhr nach 45 s Reparatur wieder an. Alle 30 kamen ins Ziel; der betroffene Fahrer war 50,07 s hinter der Siegergruppe. Das ist ein Einzelfall und kein Nachweis realistischer Pannenfolgen. Ein neuer vollständiger Standardtest und der große sportliche Vergleich wurden nicht durchgeführt.

Ein 30-km-Kontrolllauf mit 154 Fahrern und Seed 777 lieferte bei ausgeschaltetem Defekt in drei Wiederholungen exakt denselben vollständigen Ergebnishash wie der zuvor dokumentierte Stand. Das prüft diesen konkreten Standardfall, nicht alle möglichen Rennen.


## Vorbereitung der nächsten Vergleichsreihe

Das Startskript sichert bei neuen Reihen ein Manifest mit Inhaltsprüfsummen beider Engine-Verzeichnisse und der verwendeten Start- und Rennskripte, Testplan und Node-Version. Jedes neue Rennergebnis enthält eine zur Reihe und Version passende Kennung. Bei Wiederaufnahme werden diese Angaben und wesentliche Ergebnisfelder kontrolliert. Eine gleichzeitig laufende zweite Instanz wird auf Linux durch eine Dateisperre abgehalten. Werden Änderungen am Quellstand nach einer Laufserie erkannt, wird die Reihe als ungültig markiert. Die Kontrolle belegt nicht automatisch sportliche Plausibilität und kann nach einem abrupten Prozessabbruch nicht rückwirkend alle zwischenzeitlichen Änderungen erkennen.

Historische Ergebnisse ohne Manifest bleiben erhalten; das Startskript übernimmt sie nicht automatisch in eine neue Reihe. Für eine neue Reihe muss daher ein neues leeres Ausgabeverzeichnis verwendet werden. Die Auswertung kann historische Ergebnisse weiterhin lesen, deren zugehöriger Programmstand lässt sich dadurch aber nicht nachträglich nachweisen.

Neue Renn-JSONs enthalten die für die Auswertung benötigten Fahrertypen und W′-Kapazitäten je Fahrer. Die Auswertung ermittelt zusätzlich die mittlere Anzahl der Fahrertypen unter den ersten Zehn und, wo Angriffs-Telemetrie vorliegt, den Median der Anzahl aufgezeichneter Angriffsbeginn-Ereignisse des vorab ermittelten Profilfavoriten. Fehlende Telemetrie wird nicht als null Attacken ausgegeben. Diese Angriffe sind registrierte Zustandswechsel, keine automatisch als gelungen oder taktisch sinnvoll bestätigten Aktionen. Eine konkrete Untersuchung von Anlass, Verlauf, Dauer und Energie bleibt erforderlich.

Technisch geprüft wurden ein simulierter Abbruch mit Fortsetzung der 200 Aufgaben (Strecken, Felder und Seeds mit einer Test-Engine), die Ablehnung veränderter Quellen bzw. falsch zugeordneter Dateien sowie die Datenausgabe und Auswertung mit künstlichen Rennresultaten. Die 200 Aufgaben waren keine echten Rennen. Der große sportliche Vergleich, ein aktueller vollständiger Testsatz und die Laufzeitprüfung der Langtests sind weiterhin offen.


## Weiterarbeit: Mitarbeit und Ablösung in der Flucht

Im standardmäßig deaktivierten Fluchtexperiment bewertet jeder Fahrer sein eigenes Interesse und seine eigene Verfügbarkeit. Ein Fahrer mit geringer Reserve oder mit eigenem Sprinter dahinter kann Mitarbeit ablehnen; Fahrer in laufender Attacke, Verfolgung, Helferaufgabe, Sprint oder Defekt gelten dafür nicht als verfügbar. Der Führende bietet eine Ablösung nur an, wenn ein erfasster, tatsächlich nahe fahrender Teilnehmer Interesse an der Arbeit signalisiert. Das ist ein Leistungswunsch und keine Garantie für eine Übernahme. Das Experiment verwendet weiterhin vorläufige Schwellen; keine seitliche Fahrbahn wird modelliert.

Die Diagnose unterscheidet jetzt das Angebot von einem danach beobachteten Längspositionswechsel innerhalb derselben erfassten Fluchtgruppe. Ein Ereignis wird höchstens 120 s einem Angebot zugeordnet; diese Grenze verändert das Fahrerverhalten nicht. Ein solcher Positionswechsel beweist weder ein taktisches Einverständnis noch eine nachhaltig übernommene Führungsarbeit. Das bisherige Diagnosekriterium für längere, am Übergang nicht unklare Frontpositionen bleibt davon getrennt.

Im technischen Hautacam-Kontrolllauf mit 154 Fahrern, Seed 777 und eingeschaltetem Experiment kamen alle ins Ziel; die geprüfte Energiebilanz blieb innerhalb der Toleranz. In der definierten Frontsituation wurden 10.644 Fahrer-Sekunden und 37 Positionswechsel mit je mindestens fünf Sekunden pro Abschnitt gemessen, nur zwei davon nach der 0,5-m-Heuristik am Übergang nicht als unklar. 16 Ablöseangebote und 13 nach einem Angebot beobachtete Positionswechsel wurden protokolliert. Diese Zahlen verwenden unterschiedliche Kriterien; die 13 dürfen nicht als 13 eindeutig nachgewiesene, dauerhafte Ablösungen interpretiert werden. Die Diagnoseumschaltung für neue Führungsphasen wurde zugleich korrigiert, daher sind die Anzahlen der protokollierten Arbeits-/Schonungsereignisse mit dem früheren Lauf nicht direkt vergleichbar.

Ein 60-km-Flachkontrolllauf lieferte zwar 154 Zieleinläufe, aber keine gemessene gemeinsame Frontphase und eignet sich daher nicht als Beleg für Ablösungen. Bei ausgeschaltetem Experiment lieferte ein anderer 30-km-Kontrolllauf in drei Wiederholungen denselben vollständigen Ergebnishash wie zuvor. 22 gezielte Tests und der TypeScript-Build bestanden; ein vollständiger Standardtest und der große sportliche Vergleich bleiben ausstehend.

Ein zweiter vollständiger technischer Hautacam-Lauf mit Seed 42 ergab ebenfalls 154 Zieleinläufe und eine Energiebilanz innerhalb der Prüftoleranz. Er zeigte 5.696 Front-Fahrer-Sekunden, 17 längere Positionswechsel, davon einen nach der bestehenden 0,5-m-Heuristik am Übergang nicht unklar, sowie 12 Ablöseangebote und 11 nach einem Angebot beobachtete Längspositionswechsel. Auch dies ist kein Nachweis sportlich realistischer Zusammenarbeit; beide Läufe nutzen dasselbe Streckenprofil. Der Diagnoseablauf unterstützt die explizite Angabe eines Seeds.
