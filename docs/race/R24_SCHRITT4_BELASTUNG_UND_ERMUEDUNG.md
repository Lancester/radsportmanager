# R-24 Schritt 4: Belastung, Renn-KI und Ermüdungsmodell

Stand 05.11.2026. Ziel: Entscheidung über die Eignung des vorhandenen Modells, keine medizinische oder physiologische Individualprognose. Simulationen sind fiktiv, die vorhandenen Parameter sind Spielheuristiken und nicht individuell kalibrierte Werte von Profiathleten.

## Entscheidung

**CP/W′ als mechanisch bilanzierenden Kern behalten; Langzeitermüdung und W′-Erholung vor einer sportlichen Realismusfreigabe gezielt weiterentwickeln und anhand geeigneter Daten kalibrieren.** Das Modell ist als frühes entwickelbares Rennprototyp-Modell brauchbar, im aktuellen Stand aber nicht als validierte Simulation der individuellen Profi-Ermüdung anzusehen. Ein vollständiger Neubau von Bewegungsphysik, Renn-Engine und allen Regeln ist durch diese Prüfung nicht begründet. Ein komplexeres Modell ist nicht automatisch genauer, wenn dessen Parameter und Eingangsgrößen fehlen.

## Reproduzierbare Belastungskontrolle

[Skript r24-fatigue-audit.mjs](../../scripts/r24-fatigue-audit.mjs), synthetischer Fahrer CP 400 W, W′ 30 kJ, 90 g/h Kohlenhydrate sofern angegeben. Kennzahlen beruhen zum Teil auf vorgegebenen Wattbelastungen; die erste Versuchsreihe rechnet die Langzeitverfügbarkeit nicht zurück auf die Leistung. Die `coupled`-Reihe koppelt die tatsächlich verfügbare Leistung an die CP und begrenzt W′ real. Keine Zahlen als universelle Profiwerte verstehen.

- Vorher: Bei 300 W ohne Kohlenhydratzufuhr war die Langzeitverfügbarkeit nach 5400 s 100 %, nach 5401 s etwa 82,7 %. Das war ein diskontinuierliches Softwareverhalten, nicht ein Messwert. Nach der Korrektur liegt sie bereits bei 5400 s und 5401 s jeweils bei rund 82,7 %, ohne Sekundensprung. Der frühe Verlauf unterscheidet sich bewusst; die lineare Einblendung über die bereits vorhandenen 5400 s ist weiterhin eine unkalibrierte Vereinfachung.
- Gekoppelt, mit 90 g/h und Wunschleistung 300 W: Nach 4 h beträgt die verfügbare CP etwa 82,3 % des Anfangswerts; nach 6 h ca. 68 %, W′ ist dann leer und die bei 300 W angeforderte Leistung auf ca. 272 W begrenzt. Das ist ein synthetisches Dauerszenario ohne Pausen oder Windschatten; es kann nicht direkt mit einem echten Rennen gleichgesetzt werden.
- Bei 300 W konstant bleibt W′ im Grundkern erhalten. Bei wiederholtem Wechsel 20 s 500 W / 40 s 200 W und zunächst gleichem nominellem Mittel von 300 W wird W′ verbraucht und in den Pausen teilweise wiederhergestellt; nach 2 h verbleiben im Test ca. 1,8 kJ gegenüber 30 kJ bei konstanter Leistung. In der ungekoppelten Kontrollreihe unterscheiden sich die tatsächlich gefahrenen Leistungen später, sobald W′ leer ist.
- Lineare W′-Erholung bei CP 400 W, 30 kJ Anfangsdefizit und Faktor 0,22: Bei konstant 200 W nach etwa 682 s rechnerisch voll, bei 100 W nach 455 s. Dies ist eine mathematische Folge der Implementierung, keine empirische Vorhersage. W′ kann derzeit wieder vollständig werden, ohne dass seine Gesamtkapazität durch Langzeitbelastung reduziert wird.

### Gezielt korrigierter Sprung

Im experimentellen `stable-pack` wird die vorhandene 90-min-Schwelle nun nicht mehr als harte Freigabe verwendet: Die errechnete Langzeitwirkung wird anhand der verstrichenen Zeit bis zum bisherigen 90-min-Wert linear eingeblendet; danach ist der Multiplikator eins. Kohlenhydratbilanz und Belastungsakkumulation selbst bleiben erhalten. Die zeitliche Rampe ist eine bewusste Modellheuristik, keine Literaturkalibrierung. Andere Gruppenmodelle und der bestehende Standard des separaten R-19-Aufrufs behalten das bisherige Verhalten für reproduzierbare historische Vergleiche. Vor 90 Minuten können nun bereits Belastungsfolgen auftreten, wenn ihre übrigen Kriterien erfüllt sind. Ein Test prüft Stetigkeit bei 5399/5400/5401 s; die CP/W′-Bilanz und Bewegungsphysik bleiben erhalten.

## Angriffe und Verfolgung: beobachtete Beispiele

[Skript r24-effort-race-audit.mjs](../../scripts/r24-effort-race-audit.mjs), profiltypische fiktive Felder mit je 154 Fahrern, ein Seed 2026; die gemessenen Kennzahlen unten wurden nach der Korrektur im stabilen Modus erneut reproduziert. Eine Attacke ist ein registrierter Angriffswunsch; ein Abstand >42 m zum ehemaligen Gruppenvordersten nach fünf gefahrenen Kilometern ist ein diagnostischer Messpunkt, keine kausale Definition eines dauerhaft erfolgreichen Ausreißversuchs. `caughtBreakaways` zählt vom Modell erkannte Einholereignisse; nicht jedes einzelne ist einem bestimmten Teamhelfer zuzuordnen.

| Profil | Angriffswünsche | davon nach 5 km aus Gruppe ≥8 auswertbar | davon >42 m vor ehemaliger Gruppenfront | registrierte Fluchten / Einholungen |
| --- | ---: | ---: | ---: | ---: |
| Lille | 24 | 24 | 2 | 3 / 1 |
| Boulogne | 53 | 51 | 5 | 6 / 2 |
| Liège | 67 | 59 | 4 | 14 / 1 |
| Hautacam | 60 | 48 | 6 | 17 / 5 |

Beispiel Lille: F043 griff bei km 2,2 rund 70 s an, fuhr dabei rund 7,8 kJ oberhalb der jeweiligen effektiven CP und befand sich nach fünf weiteren Kilometern ungefähr 35 m hinter dem ehemaligen Gruppenführenden. F023 setzte in einem anderen Angriff rund 7,3 kJ oberhalb CP um, hatte aber am späteren 5-km-Messpunkt sein W′ wieder aufgefüllt. Das ist mit dem verwendeten Erholungsmodell vereinbar; die zwei Momentaufnahmen belegen weder den exakten Erholungsverlauf noch seine physiologische Genauigkeit.

Im Lille-Lauf war nominierter Feldjagdhelfer F003 insgesamt 710 s eingeteilt, davon 500 s in der bis 18 m definierten Führungszone, mittlere Leistung während dieser Zone ca. 366 W. Die längste ununterbrochene Zeit tatsächlich an der Windfront mit Aero-Faktor ≥0,95 betrug hingegen 54 s. Frontnähe und echte Windexposition sind unterschiedliche Größen; dieser Lauf beweist daher keine einzelne 20-minütige Soloführung. Modelltests erlauben längere echte Einsätze, doch Häufigkeit und taktische Wirkung im Rennen bleiben zu prüfen. Für andere Profile werden z. B. im Liège-Lauf für F109 insgesamt 1830 s unter Anschlussauftrag direkt an der Gruppenspitze erfasst; diese Gesamtsumme kann aus mehreren Episoden bestehen und ist weder zwingend hochintensive Arbeit noch eine durchgehende Einholung.

## Wissenschaftliche Einordnung und Grenzen

- Klaris et al., 2024: [12 nationale Elitefahrer, 6 h simuliertes Rennen](https://pubmed.ncbi.nlm.nih.gov/39011951/). Die 5-km-Zeitfahrleistung sank im Mittel von 412 auf 384 W, individuell um 2–14 %; das Sprintmaximum veränderte sich anders als die längere Zeitfahrleistung. Protokoll und individuelle Belastungen unterscheiden sich vom obigen konstanten Modellversuch; die Größen sind nicht direkt gegeneinander kalibrierbar. Ein identischer pauschaler Faktor für CP und Peak bildet diese mögliche Differenz nicht ausdrücklich ab.
- Bartram et al., 2018: [W′-Erholung bei vier Elitefahrern](https://pubmed.ncbi.nlm.nih.gov/29035607/). Die Autoren fanden in ihrem kleinen Stichproben-/Protokollrahmen teils schnellere Erholung als ein verbreitetes Modell prognostizierte und weisen auf die Notwendigkeit individueller Ansätze und weiterer Validierung hin. Daraus lässt sich weder die hiesige lineare Konstante direkt bestätigen noch pauschal als zu schnell beurteilen.
- [Langzeitbelastung und Leistungs-Dauer-Beziehung](https://pubmed.ncbi.nlm.nih.gov/30995104/) bei 14 Personen: Nach dem untersuchten 2-h-Protokoll zeigten sich Veränderungen an CP- und W′-bezogenen Größen; die Veränderungen erklärten sich in der Stichprobe nicht hauptsächlich aus der gemessenen Glykogenänderung. Diese Befunde begründen, neben Energiebilanz auch Belastungsverlauf und möglicherweise veränderliche W′-Kapazität zu prüfen; sie begründen keine sofortige Übernahme der Studienmittelwerte als Spielerparameter.
- Der aktuelle R-19-Baustein verwendet u. a. 1200 kcal initiale KH-Kapazität, feste 55 % KH-Anteil, eine Belastungsschwelle von 70 % der Referenz-CP, 0,65 Belastungsstunden bis zum Verschleißterm und maximal 40 % Leistungseinbuße. Die Werte und die neue Rampe sind offen gelegte Heuristiken. Sie bilden individuelle Substratnutzung, Belastungsform, Wiederholung und CP-/Sprint-/W′-Veränderungen nur eingeschränkt ab.

## Weiterer Bedarf

Vor einer Sportfreigabe: mehrere Belastungs- und Ernährungsprotokolle mit plausiblen Verläufen, individuelle Ermüdungsresistenz, getrennte Reaktionen von CP/Sprint und ggf. W′-Kapazität, realistische W′-Erholung bei unterschiedlichen Intensitäten sowie Mehrseed-Rennvergleiche. Das Modell soll unterschiedliche Fahrertypen zulassen und keine vorgegebenen Gewinner oder Rückstandsgrenzen erzwingen. Die Kausalität einzelner Jagden und die bislang offene Gruppendynamik im sanften Geländeübergang bleiben zusätzlich offen.

## Gepaarter Rennvergleich nach Glättung

Vier Strecken, drei Seeds (42/123/2026), identisches fiktives Flachfahrerfeld und Teams jeweils vorher/nachher. Bei Seed 2026 und 123 bleiben Sieger, Median, Fahrer innerhalb 60 s und Angriffszahl auf allen vier Profilen in diesen Zusammenfassungen gleich. Bei Seed 42 bleibt Lille-Sieger F009, der Median ändert sich von 17,81 auf 16,58 s und die Attackenzahl von 19 auf 18. Boulogne wechselt von F113 auf F015 (beide Sprinter); Median 71,78→89,29 s, innerhalb 60 s 58→27, Attacken 33→31. Liège und Hautacam behalten Sieger, Median und Zahl innerhalb 60 s, bei Hautacam ändern sich Attacken 45→44. Dies belegt Auswirkungen auf konkrete Rennverläufe und ist bei der Bewertung der frühen Ermüdung wichtig; weder die Änderung noch das vorherige Ergebnis ist allein aus diesen Zahlen sportlich validiert. Rohdaten im Unterordner `r24-schritt4-daten`.

Der erste vollständige Testlauf zeigte zwei historische Referenzabweichungen, weil die Glättung zunächst in alle Gruppenmodi hineinwirkte. Die Implementierung wurde auf `stable-pack` begrenzt; andere Gruppenmodi behalten das frühere Verhalten. Der anschließende vollständige lokale Lauf auf dem endgültigen Code bestand mit **371/371 Tests**; der TypeScript-Browser-Build und ESM-Import waren erfolgreich. Der [GitHub-PR-Lauf #299](https://github.com/Lancester/radsportmanager/actions/runs/42026550803) für Codecommit `af80b727189c00cad4824904e14df015411b689d` lief beim letzten Abruf noch.
