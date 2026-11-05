# R-24, Schritt 3: Gruppenübergang, Anschluss und Sprinter

Stand 05.11.2026. Nutzerhinweis: Sprinter können kurze Anstiege dank ihrer individuellen Kurzzeitleistung überstehen; das darf nicht für jeden Sprinter gleichermaßen gelten. Längere Anstiege, Vorbelastung und vorhandenes W′ müssen einen Unterschied machen. Keine pauschale Beschränkung nach Fahreretikett.

## Sekundenmessung beim Geländewechsel

Aktueller Enginecode des GitHub-Stands `4f7f2469f2adbd315d4b27c784b167092d23f90d`, Hautacam-Referenzfeld, Seed 2026, `stable-pack`, Attacken explizit aus. Die Momentwerte für F078 bei t=2098 s: Position ca. 24,35 km, Steigung +2,73 %, direkter Vordermann 5,3 m entfernt und praktisch ohne Beschleunigung; rechnerische Beschleunigungsprognose der entfernten Gruppenspitze ca. 0,68 m/s². Der angeforderte Wert betrug ca. 459 W, Tages-CP ca. 410 W. Zwei Sekunden später hatte das Vorderrad ca. 0,17 m/s² Beschleunigung, die Gruppenspitze ca. 0,57 m/s²; der Wattwunsch blieb ca. 459 W. Bei t=2120 s, als F078 bereits auf -4,17 % Gefälle fuhr, wurde ebenfalls ca. 459 W angefordert. Das sind einzelne Wattanfragen, keine gemessenen Zeitmittel oder Aussagen darüber, wie lange sie gehalten werden.

Korrektur der ersten Auswertung: Im untersuchten Fall einer 154er-Gruppe und ohne aktiven Jagdauftrag nutzt `stable-pack` den allgemeinen Gruppenregler. Dieser verwendet für Geschwindigkeit **und Beschleunigung** jeweils eine distanzabhängige Mischung aus Vorder- und Gruppenführerrad. Der separate Stable-Pack-Folgeregler verwendet hingegen die Geschwindigkeit des Vorderrads direkt. Die Messung belegt, dass die entfernte Referenz in der Übergangssituation erheblich vom Vorderrad abweicht. Sie beweist für sich allein nicht, welchen Anteil diese Mischung an der folgenden Feldteilung hat: Bewegungsmodell, Abstände, Regler, Aero und Teamaufträge wirken gleichzeitig.

## Gegenprobe: nur direkte Beschleunigung

In einer **isolierten Versuchskopie** wurde im `stable-pack` die Beschleunigungsreferenz ausschließlich vom Vorderrad bezogen. Die Änderungen wurden nicht in die Engine übernommen. Im Berg-Kontrolllauf ohne Attacken bestand bei km 30 vorne eine 100er- statt 67er-Gruppe; bei km 20 waren es aber 152/1/1 statt einer 154er-Gruppe. F078 fiel in diesem Fall im Ergebnis von Platz 1 auf 83. Diese Einzelplatzierung ist kein Beweis, dass die Regel physikalisch falsch ist; sie zeigt aber erhebliche Nebenwirkungen und keinen belastbaren Gesamtgewinn.

Vier weitere Rennen nutzen ein identisches, aus dem Flachprofil stammendes fiktives Fahrerfeld, identische Teams und Seed 2026. Vergleich aktuelle Engine → Versuch, jeweils Medianrückstand und Zahl innerhalb 60 s:

| Profil | Median aktuell → Versuch | innerhalb 60 s aktuell → Versuch |
| --- | ---: | ---: |
| Lille | 17,2 → 120,0 s | 154 → 27 |
| Boulogne | 205,4 → 118,7 s | 26 → 45 |
| Liège | 600,6 → 736,1 s | 6 → 1 |
| Hautacam | 936,2 → 1095,0 s | 2 → 1 |

Das sind einzelne synthetische Rennen, keine festgelegten sportlichen Sollwerte. Unterschiedliche Abstände sind für sich genommen weder ein Beweis für eine Verbesserung noch für eine Verschlechterung. Der separate kontrollierte 20-km-Flachtest ohne Wind und Attacken bestand in der Versuchskopie mit 154 Fahrern in der Zielgruppe. Trotzdem verändert die kleine Regleränderung die weiteren Rennverläufe stark. **Entscheidung: nicht übernehmen**, solange Verlauf und Ursachen nicht mit weiteren kontrollierten Szenarien erklärt werden können.

## Kapitäns-Anschluss im tatsächlichen Rennen

Im Berglauf mit Attacken registrierte die Engine für T12/F078 15 und für T20/F134 8 Ereignisse, deren Begründung den Anschluss für den abgehängten Kapitän nennt. Sie betreffen unterschiedliche Helfer und teils kurz aufeinanderfolgende Auftragswechsel; daraus dürfen weder 15 bzw. 8 vollständige Nachführaktionen noch ihre Dauer abgeleitet werden. Beispiele: T12-Helfer F080 und F084 erhielten bei ihrer Position um km 17,2/17,3 solche Aufträge; T20-Helfer F135 und F136 um km 24,5. Ereignisse belegen einen erteilten Startauftrag, nicht die tatsächlich an der Spitze gefahrene Leistung oder einen Erfolg.

Die vorhandenen gezielten Tests prüfen unter anderem, dass Helfer in der Kapitänsgruppe verfügbar sein müssen, die Lücke im Bereich liegt und der Auftrag keine Position verändert. Die praktische Wirksamkeit im Rennen ist damit nicht erwiesen. **Offen:** Auftragsdauer, effektive Führungsarbeit, Zielgruppe, Erfolg bzw. Abbruchursache und Auswirkungen auf F078 müssen integriert und ohne verdeckte Positionsänderungen gemessen werden. Bestehende Grenzen wie 4 Fahrer, 42–1500 m und 27 % Reserve sind vorläufig.

## Sprinter an kurzen und langen Anstiegen

Im 154er-Liège-Referenzfeld unterscheiden sich die frischen Fahrerwerte: Für drei Minuten `(CP + W′/180)/(Fahrer + Rad)` liegen die 15 Sprinter zwischen ca. 6,36 und 7,13 W/kg; F009 ist der stärkste Sprinter dieses künstlichen Feldes. Bei nominellen zehn Minuten mit derselben vereinfachten Obergrenze ergibt F009 ca. 5,31 W/kg. Im selben Feld erreicht F078 anhand seiner Werte ca. 7,09 W/kg für drei und ca. 6,15 W/kg für zehn Minuten. Diese Rechnungen setzen vollständig verfügbare Reserven und konstante Leistung voraus, ohne Tagesform, Windschatten, Tempoverlauf und Langzeitermüdung. Sie sind keine empirische Profi-Kalibrierung und keine berechneten Rennergebnisse.

Ein neuer gezielter Test berechnet 180 und 600 Sekunden mit dem vorhandenen CP/W′-Kern: Zwei einzelne Sprinter desselben Felds unterscheiden sich bei identischer Wattanforderung; verringerte Anfangsreserve begrenzt F009 früher; im konkreten 600-Sekunden-Beispiel erzielt F078 mehr Arbeit pro Gesamtmasse. Damit ist die gewünschte grundsätzliche Unterscheidung mechanisch prüfbar. **Nicht bewiesen:** wie häufig Sprinter in vollständigen Rennen tatsächlich mithalten oder ob die synthetische Leistungsverteilung realistisch ist. Keine Regel wurde an einen konkreten Sieger angepasst.

## Prüfung, Daten und offener Stand

Fünf gezielte Tests zu Anschlussjagd, lokaler Gruppenreferenz und Sprinter-Belastung bestanden. Der isolierte 154-Fahrer-Flachtest und vier weitere Stable-Pack-Tests bestanden auch mit der nicht übernommenen Versuchskopie. Der Enginecode blieb unverändert; ein neuer vollständiger Gesamttest war für die reine Ergänzung eines Tests und der Dokumentation nicht erforderlich. Die letzte vollständige Codeprüfung bestand zuvor 363/363.

[Messdaten und Patches](r24-schritt3-daten/) sichern die Sekundenmessung, Teamereignisse, die beiden Vier-Profil-Auswertungen und die exakten Änderungen für Instrumentierung und Versuch. Die Patches sind **Diagnosematerial und keine übernommenen Produktänderungen**; sie können auf einer Kopie des genannten Codes angewandt werden. Die vier Profilvergleiche verwendeten [r24-vierprofile-vergleich.mjs](../../scripts/r24-vierprofile-vergleich.mjs) mit gleichem Fahrerfeld (Aufruf `node --experimental-strip-types scripts/r24-vierprofile-vergleich.mjs "$PWD" 2026`); ihre Ergebnisse bleiben auf einen Seed begrenzt. Die Ereignisse können mit [r24-team-missions-trace.mjs](../../scripts/r24-team-missions-trace.mjs) und den Argumenten `"$PWD" berg` neu erzeugt werden.

**Noch nicht abschließend gelöst:** eine nachweislich verbessernde Korrektur des Geländeübergangs und die quantitative Beurteilung der Anschlussarbeit. Der Schritt wird für Nutzerfeedback an dieser Stelle unterbrochen; vor einer Änderung sind weitere kontrollierte Tests mit Sekundenverlauf, verschiedenen Geländewechseln und messbaren Auftragsdauern sinnvoll. Es wurden weder Lücken gedeckelt noch Ergebnisse vorgegeben.

## Fortsetzung: weitere Gegenproben und tatsächliche Anschlussarbeit

Zwei weitere Gegenproben wurden ausschließlich in Versuchskopien durchgeführt. Eine begrenzte Abweichung der Beschleunigungsreferenz zum Vorderrad ergab im Kontrolllauf ohne Attacken bei km 25 die Gruppen 71/27/56 statt einer 154er-Gruppe; bei km 30 war die führende Gruppe mit 67 Fahrern gleich groß. Eine zweite Variante verwendete nur beim konkreten Übergang, wenn der Gruppenführer bereits abwärts fährt und der Nachfolger noch aufwärts, das lokale Vorderrad: Bei km 25 blieb die 154er-Gruppe bestehen, bei km 30 war die führende Gruppe mit 63 Fahrern kleiner als beim ursprünglichen Wert 67. Diese einzelnen Gruppenmessungen beweisen für sich genommen keine sportliche Verschlechterung, zeigen aber auch keine robuste Lösung. Keine der beiden Varianten wurde übernommen.

Die Engine gibt nun **nur im Checkpoint-Diagnosemodus** zusätzlich `rejoinWork` aus: je Helfer die aufsummierten Sekunden unter einem als Kapitäns-Anschluss gekennzeichneten und tatsächlich aktiven Jagdauftrag, davon Sekunden an der physischen Gruppenspitze (höchstens 1 m hinter dem ersten Rad), sowie die jeweils tatsächlich gefahrene Kurbelarbeit in Joule. Dies sind Summen über das ganze Rennen, keine einzelnen Stintlängen; die Angabe belegt weder Erfolg noch eine kausale Wirkung des Auftrags. Der vorherige Begriff „Frontzone“ von 18 m gilt für die Teamplanung, nicht für diese strengere 1-m-Messung.

Im aktuellen Berglauf mit Attacken und Seed 2026 war T12-Helfer F080 insgesamt 2490 s beauftragt, davon 489 s an der Gruppenspitze; er fuhr unter dem Auftrag insgesamt ca. 512 kJ, davon ca. 150 kJ an der Spitze. F081 war 2620 s beauftragt, davon 98 s an der Spitze. Für T20 waren F137 insgesamt 1250 s beauftragt, davon 585 s an der Spitze. Dies sind mehrere mögliche Einsätze und keine garantierte Verbindung mit dem Kapitän über die gesamte Dauer. Der nachträgliche Vergleich mit dem vorherigen Rennen ergab exakt gleiche gespeicherte Rennereignisse, Klassifikation und Messpunkte. Ein gesonderter Integrationstest vergleicht Rennen mit und ohne Diagnosemodus und prüft Grenzen der Bilanz.

Nach Auswertung: Der Gruppenübergang bleibt ungelöst. Die ursprüngliche Aufgabenstellung, eine nachweislich bessere Änderung der Gruppenregel zu implementieren, ist damit **noch nicht vollständig erfüllt**. Die Anschlussarbeit ist erstmals anhand realer Watt und Zeiten sichtbar, doch Zielgruppe und Erfolg einer einzelnen Jagd sowie die Ursachen ihres Abbruchs sind noch nicht erfasst. Als nächste konkrete Arbeit verbleiben kontrollierte Situationen mit gleichmäßigem Gelände und Wechseln verschiedener Längen, Messung jedes Anschlussversuchs und Überprüfung seiner Zielgruppe; eine pauschale Grenzwertänderung wird vor weiterer Evidenz nicht eingesetzt.

### Technische Prüfung der Fortsetzung

Der erste Gesamtlauf meldete 363/364 Tests bestanden: Der vorhandene Nichtbeeinflussungstest kannte das neue zusätzliche Diagnosefeld noch nicht. Nach ausdrücklichem Ausnehmen dieses Diagnosefeldes aus dem Gesamtvergleich – die übrigen Daten werden weiterhin vollständig verglichen – bestand der anschließende vollständige Lauf mit **365/365 Tests**. Darin enthalten ist der neue Integrationstest, der ein Rennen mit und ohne Diagnosemodus vergleicht und eine nichtleere Anschlussbilanz prüft. Zusätzlich wurde das Browsermodul mit TypeScript gebaut und erfolgreich als ES-Modul geladen. Das ist eine technische Prüfung, keine sportliche Validierung.
