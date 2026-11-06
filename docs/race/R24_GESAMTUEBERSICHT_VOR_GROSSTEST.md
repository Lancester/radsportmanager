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
| 5 | Zusammenarbeit in der Flucht | Experimentell | Erste Führung bzw. Schonung nur bei ausdrücklich eingeschaltetem Experiment; reale Lastenverteilung, freiwillige Wechsel, Team- und Eigeninteressen nicht sportlich validiert. Standardmäßig ausgeschaltet. |
| 6 | Gemeinsames Nachführen und Gelände | Teilweise | Mehrminütiges Nachführen und gemeinsame Ziele sind möglich; Geländeausblick ist eine grobe Momentanschätzung. Zusammenarbeit und echte Führungswechsel benötigen weitere Prüfung. |
| 7 | Verfolgung fortsetzen, dosieren oder aufgeben | Teilweise | Kein rein zeitgesteuerter 120-s-Abbruch mehr; Abstandsentwicklung, Kräfte und Gelände wirken ein. Die Bewertung enthält weiterhin provisorische Schwellen und unvollständige Vorausschau. |
| 8 | Angriff auf Sieg | Teilweise | Situative Angriffsziele und einige frühere Grenzen geändert; weitere Distanz- und Phasenschwellen sowie Siegchancen müssen geprüft werden. |
| 9 | Reaktionen und Schutz des Kapitäns | Teilweise | Reaktionen auf erkennbare Gegner und Helferaufträge vorhanden; auch ein Helfer kann einen zurückliegenden Kapitän unterstützen. Abstimmung und tatsächliche Entlastung müssen im Rennen geprüft werden. |
| 10 | Gegnergefahr | Teilweise | Relative Schätzung aus nominellen Fähigkeiten und Profil, ohne fremdes aktuelles W′. Sie ist eine grobe Heuristik und noch keine vollständige dynamische Einschätzung. |
| 11 | Sprint und Vorbereitung | Teilweise | Positionsbedarf, Helfer, Hinterrad und Sprintbeginn teilweise situationsabhängig; einige Pfade sind auf sprintfreundliche Profile begrenzt und nicht allgemein fertig. |
| 12 | Längere Anstiege | Teilweise | Vorhandene Physik, Reserven und Bergtempo werden genutzt; Reaktionen, Helfer und gleichmäßiges eigenes Fahren im Gesamtmodell prüfen. |
| 13 | Individuelle Bergfahrweise | Teilweise | Optionale taktische Angriffsvorliebe am Berg vorhanden, getrennt von physischer Fähigkeit; Werte sind noch nicht regulär für Testfahrer festgelegt oder kalibriert. |
| 14 | Abfahrtstechnik und Risiko | Teilweise | Technik und Bremsung vorhanden; eine eigenständige situationsabhängige Risikowahl und ihre Folgen sind nicht vollständig umgesetzt. |
| 15 | Feldposition und Windschatten | Teilweise | Bestehende 1D-Position und Windschattenphysik; fehlende seitliche Spuren begrenzen Überhol- und Frontinterpretation. Keine vollständige 2D-Fahrbahn behaupten. |
| 16 | Stürze und Defekte | Offen | Grundlegende Ereignisse und Folgen im Eintagesrennen fehlen noch. Langfristige Verletzungsfolgen gehören zum späteren Karrieremodell. |
| 17 | Wind und Wetter | Teilweise | Vereinfachter Wind wirkt physikalisch; Regen, nasse Kurven und vollständige seitliche Windstaffeln sind nicht fertig. |
| 18 | Fahrerwerte und Tagesform | Teilweise | Individuelle Leistung, Gewicht, Reserven, Ausdauer und Tagesform bereits vorhanden; Verteilung, Zusammenspiel und sportliche Kalibrierung prüfen. Karriereentwicklung später. |
| 19 | Mentale und taktische Eigenschaften | Teilweise | Beharrlichkeit bei der Verfolgung und Bergangriffsneigung optional; ohne Eingaben bisherige Vorgaben. Weitere mentale Eigenschaften und glaubwürdige Werteverteilung fehlen. Keine Watt- oder Siegboni. |
| 20 | Material und Fahrphysik | Teilweise | Masse, Luft- und Rollwiderstand wirken in der bestehenden Physik. Eine vollständige Materialauswahl bzw. Managementfunktion ist später zu entwickeln. |
| 21 | Zielreihenfolge und Gruppenzeiten | Teilweise | Individuelle Zielzeiten und konfigurierbare gewertete Gruppenzeiten vorhanden; experimenteller 1-s-Standard ist kein vollständiges wettbewerbsspezifisches Regelwerk. |
| 22 | Nachvollziehbarer Rennbericht | Teilweise | Struktur und Textausgabe aus tatsächlichen Ergebnissen/Ereignissen, vorab gelieferten Favoriten und optional gemessener Frontarbeit vorhanden. Keine fertige Oberfläche, keine automatische Vorab-Favoritenwahl und keine vollständige Ursachenerkennung. |

## Was vor dem großen Test noch zu tun ist

1. **Fluchtgruppe und Gruppenerkennung:** Die Grenzen der 1D-Gruppenbildung prüfen; kooperative Arbeit, Verweigerung, Leistungs-/Energieaufwand und tatsächlich beobachtbare Wechsel anhand geeigneter Situationen weiterentwickeln. Das Experiment erst dann für den Vergleich festlegen. 0,5 m und fünf Sekunden sind vorläufige Diagnoseannahmen, keine echten Rennvorschriften.
2. **Taktische Zusammenhänge:** Motive von Attacken und Reaktionen, Kapitäns- und Helferverhalten sowie die aus den Regeln entstehende Angriffshäufigkeit kontrollieren. Nicht mit einer willkürlichen Angriffshöchstzahl Ergebniswerte erzwingen.
3. **Individuelle Fahrweisen und Eintages-Ereignisse:** Einheitliche, nachvollziehbare Testeingaben für neue taktische Eigenschaften vorbereiten; Sprint, Berg und Abfahrt auf unterschiedlichen Profilen berücksichtigen. Vereinbarte grundlegende Sturz-/Defektfolgen fehlen noch. Für einen fairen Modellvergleich müssen Zufallsereignisse und identische Eingaben kontrollierbar sein; weitere Karrierefolgen bleiben später.
4. **Berichte und Datenqualität:** Favoriten vor Rennstart dokumentieren, Ergebnisgruppen und tatsächliche Ereignisse/Führungsarbeit ausgeben, Unsicherheit kennzeichnen und keine Ursachen erfinden. Die Genauigkeit und Vollständigkeit der vorhandenen Telemetrie vor ihrer Auswertung prüfen.
5. **Technischer Abschluss und Laufzeit:** Aktuellen Build und vollständigen Testsatz prüfen, die zwei bislang zeitüberschrittenen Langtests und die Laufzeit gegenüber einer unter gleichen Bedingungen gemessenen Vorversion untersuchen. Vorherige Teilerfolge nicht als neuen vollständigen Standardlauf ausgeben.
6. **Großer sportlicher Vergleich:** Erst nach zusammenhängender Überarbeitung die dokumentierten Versionen, Profile, Fahrerfelder, Seeds, Ereigniseinstellungen und Auswerteregeln festhalten. Alle relevanten Rennen auswerten, Favoriten und Zielgruppen sowie Angriffe, Flucht, Jagd, Kräfte und auffällige Verläufe betrachten. Unterschiede und mögliche notwendige Nachkalibrierung transparent darstellen.

Nicht Voraussetzung für den ersten Eintagesvergleich sind eine vollständig spielbare Karriere, Gesamtwertung über mehrere Tage, Personal- und Materialverwaltung oder eine vollständige 2D-Simulation. Der Verzicht darauf bedeutet nicht, dass vereinbarte Eintagesregeln als erledigt gelten.

## Prüfstand und Grenzen

- Auf einem früheren Stand liefen 427 technische Tests und der Build erfolgreich.
- Beim nachfolgenden Paket bestanden im normalen Gesamtlauf 428 von 430 Tests; zwei lange Tests überschritten das feste interne Zeitlimit von 240 s. Beide bestanden später einzeln mit unveränderten Prüfaussagen und erweitertem Zeitrahmen. Ein vollständiger Standardlauf ohne Zeitüberschreitung wurde für diesen Stand nicht nachgewiesen.
- Der neueste Zwischenstand wurde mit gezielten Tests und TypeScript-Build kontrolliert; ein neuer Gesamtlauf und der sportliche Mehrseed-Vergleich sind offen.
- Der erste Test einer Laufzeitoptimierung auf einem 30-km-Ausschnitt mit 154 Fahrern und drei Wiederholungen je Version zeigte identische Ergebnisdaten, aber keinen zuverlässigen Geschwindigkeitsvorteil. Die kompliziertere Änderung an der Fluchterkennung wurde deshalb zurückgenommen. Eine kleine Vermeidung doppelter Berechnungen bei der Gegnerbewertung bleibt; der Einfluss auf die langen Tests ist ungeklärt.
- Ein einzelner Seed oder bestandener technischer Test beweist keine realistischen Rennergebnisse. Der große Vergleich muss echte Unterschiede und ihre Ursachen offenlegen.
