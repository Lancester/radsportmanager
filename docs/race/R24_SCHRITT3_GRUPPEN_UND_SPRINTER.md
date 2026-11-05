# R-24, Schritt 3: Gruppenübergang, Anschluss und Sprinter

Stand 05.11.2026. Nutzerhinweis: Sprinter können kurze Anstiege dank ihrer individuellen Kurzzeitleistung überstehen; das darf nicht für jeden Sprinter gleichermaßen gelten. Längere Anstiege, Vorbelastung und vorhandenes W′ müssen einen Unterschied machen. Keine pauschale Beschränkung nach Fahreretikett.

## Sekundenmessung beim Geländewechsel

Aktueller Enginecode des GitHub-Stands `4f7f2469f2adbd315d4b27c784b167092d23f90d`, Hautacam-Referenzfeld, Seed 2026, `stable-pack`, Attacken explizit aus. Die Momentwerte für F078 bei t=2098 s: Position ca. 24,35 km, Steigung +2,73 %, direkter Vordermann 5,3 m entfernt und praktisch ohne Beschleunigung; rechnerische Beschleunigungsprognose der entfernten Gruppenspitze ca. 0,68 m/s². Der angeforderte Wert betrug ca. 459 W, Tages-CP ca. 410 W. Zwei Sekunden später hatte das Vorderrad ca. 0,17 m/s² Beschleunigung, die Gruppenspitze ca. 0,57 m/s²; der Wattwunsch blieb ca. 459 W. Bei t=2120 s, als F078 bereits auf -4,17 % Gefälle fuhr, wurde ebenfalls ca. 459 W angefordert. Das sind einzelne Wattanfragen, keine gemessenen Zeitmittel oder Aussagen darüber, wie lange sie gehalten werden.

Die Berechnung für `stable-pack` verwendet für die Geschwindigkeit des Mitfahrers das direkte Vorderrad; die **Beschleunigungsreferenz** ist jedoch eine distanzabhängige Mischung aus Vorder- und Gruppenführerrad. Die Messung belegt, dass die entfernte Referenz in der Übergangssituation erheblich vom Vorderrad abweicht. Sie beweist für sich allein nicht, welchen Anteil diese Mischung an der folgenden Feldteilung hat: Bewegungsmodell, Abstände, Regler, Aero und Teamaufträge wirken gleichzeitig.

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
