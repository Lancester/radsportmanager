# R-24: Abgleich der gemeinsamen Regeln mit dem Versuchsstand

Stand 05.11.2026. Grundlage: [gemeinsame Entscheidungen](R24_GEMEINSAME_RENNKI_ENTSCHEIDUNGEN.md) und [verständliche Regelübersicht](R24_RENNKI_REGELN_VERSTAENDLICH.md). Referenz ist der experimentelle Rennmotor aus Commit 04ea73a1543e574c273c7c8cbb08bd196803d25d, nicht automatisch main. Die Tabelle ist eine Arbeitsgrundlage, keine Vollständigkeits- oder Sportfreigabe. Status „teilweise“ bedeutet: Es gibt einen entsprechenden Ansatz, nicht dass dieser die vereinbarte Regel bereits erfüllt.

| Nr. | Vereinbarter Bereich | Erste Einordnung | Zentrale Abweichung oder offene Arbeit |
|---:|---|---|---|
| 1 | Frühe Flucht und Teamziel | teilweise | Motiv vorhanden; differenzierter Teamplan und situationsgerechte Auswahl der Fahrer fehlen als gesicherter vollständiger Ablauf. |
| 2 | Bestehende Flucht und erneute Bildung | teilweise | Jagd und Nachsetzen vorhanden; bewusstes Zurückholen für einen erneuten Fluchtversuch ist nicht als vollständiges Teamziel nachgewiesen. |
| 3 | Flucht zunächst akzeptieren | teilweise | Teaminteressen und Dringlichkeit fließen ein; situationsbezogene Bewertung der eigenen Siegchancen und aller Ausreißer noch begrenzt. |
| 4 | Verfolgung dosieren | teilweise | Teamjagd, Helfer und reale Leistungswünsche vorhanden; Zusammenarbeit, variable Führungszeiten und Kräfteplanung umfassend prüfen. |
| 5 | Zusammenarbeit in Flucht | offen/teilweise | Gruppenfahrt vorhanden; ausdrückliche teamübergreifende Zusammenarbeit, Nichtmitarbeiten und Interessenkonflikte noch nicht als vollständige Taktik belegt. |
| 6 | Nachführen mit Gelände | teilweise | Individuelles mehrminütiges Nachsetzen experimentell vorhanden; gemeinsame Planung und Vorschau auf Gelände fehlen als vollständige Funktion. |
| 7 | Verfolgung dosieren/aufgeben | Abweichung | Vorläufige Abbruchregel bei ausbleibendem Fortschritt nach 120 s durch situationsabhängige Bewertung ersetzen. |
| 8 | Angriff um Sieg | teilweise | Motiv vorhanden; feste Rennphase und Entfernung zur Spitze prüfen, echte situationsbezogene taktische Abwägung ergänzen. |
| 9 | Reaktion auf Angriff und Helfer | teilweise | Individuelle Reaktion und Teamaufträge vorhanden; Gegnergefährlichkeit, Helferabstimmung und physische Reaktion genauer ausarbeiten. |
| 10 | Gegnergefährlichkeit | offen/teilweise | Diagnostische Favoritenliste und einfache Bergfavoritenheuristik vorhanden; dynamische, unvollkommene und situationsbezogene Einschätzung nicht vollständig. |
| 11 | Sprintvorbereitung | teilweise | Positionierung, Zug, Radwahl und Sprint vorhanden; feste Phasengrenzen und Berücksichtigung kleiner Gruppen prüfen. |
| 12 | Bergfahren | teilweise | Physik, Kraft und Temporegeln vorhanden; Anlass und Reaktionen sowie Zusammenspiel von Helfern und Gruppen prüfen. |
| 13 | Unterschiedliche Bergfahrweisen | offen/teilweise | Physische Fähigkeiten und Aggressionswert vorhanden; taktische Vorliebe und flexible Wahl eines Fahrstils noch nicht als vereinbarte Gesamtfunktion nachgewiesen. |
| 14 | Abfahrtstechnik und Risiko | teilweise | Vereinfachte Abfahrtstechnik und Bremsung vorhanden; getrennte situationsabhängige Risikowahl nicht vollständig belegt. |
| 15 | Feldposition/Windschatten | teilweise | 1D-Gruppenordnung und Windschattenmodell vorhanden; Feldpositionierungskompetenz und Grenzen der 42-m-Gruppenerkennung prüfen. |
| 16 | Stürze/Defekte | offen | Gewünschte Ereignisse und Folgen noch nicht als vollständig implementiertes, kalibriertes System belegt; langfristige Verletzungsmechanik später. |
| 17 | Wind/Wetter | teilweise | Wind in der Fahrphysik vereinfacht vorhanden; Regen und umfassende seitliche Windstaffeln nicht als fertig annehmen. |
| 18 | Fahrerwerte/Tagesform | teilweise | CP, W′, Fahrerparameter und Tagesvariation vorhanden; sportliche Kalibrierung und spätere Entwicklung/Vorbelastung offen. |
| 19 | Mentale Komponente | offen/teilweise | Aggressionsneigung vorhanden; getrennte mentale und situationsbezogene Entscheidungsmerkmale noch nicht vollständig. |
| 20 | Material | teilweise | Masse und Luftwiderstand als Eingangsgrößen vorhanden; vollständige Auswahl und Materialmanagement nicht fertig. |
| 21 | Zielreihenfolge und Gruppenzeit | teilweise | Nachberechnung der Gruppen für Diagnosen vorhanden; vollständige wettbewerbsspezifische Zeitwertung und Sonderfälle noch offen. |
| 22 | Rennbericht | teilweise | Ereignisse und Diagnosen vorhanden; benutzerfreundliche Aufbereitung und belegbare Begründungen müssen noch ergänzt werden. |

## Vorgehen

Erst die zusammenhängenden Regeln als Entwicklungsziel und die wichtigsten Überschneidungen prüfen. Dann die Eintages-Renn-KI auf einem eigenen Entwicklungszweig in überprüfbaren Schritten anpassen. Längerfristige Karriere-, Rundfahrt- und Managementfunktionen als Anschlussstellen vorsehen. Nicht während der gemeinsamen Regelbesprechung neue Renntests durchführen. Nach Umsetzung technisches Testprogramm und gepaarte sportliche Mehrseed-Vergleiche auf allen vier Profilen einschließlich Favoriten, Zielgruppen und Rennverläufen. Keine Modell- oder Sportfreigabe ohne deren Prüfung.
