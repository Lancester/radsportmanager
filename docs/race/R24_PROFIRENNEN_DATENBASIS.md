# R-24: Profirennen als Vergleichsbasis vor dem Simulationstest

Stand: 05.11.2026. Diese Auswahl dient als **sportliche Orientierung, nicht als Kalibrierungsziel oder statistisch repräsentative Stichprobe**. Sie wurde bewusst nach den vorhandenen und diskutierten Profiltypen sowie nach zugänglichen Ergebnissen und Rennberichten zusammengestellt. Die Rennen sind nicht zufällig ausgewählt; darunter sind besonders starke Favoriten und einzelne extreme Verläufe. Ein Simulator muss keines dieser konkreten Ergebnisse nachstellen.

## Beobachtungen

Alle Rückstände beziehen sich auf die offizielle Tages- bzw. Eintageswertung gegenüber dem jeweiligen Sieger. Gleiche offizielle Zeiten sind keine exakte Messung physischer Abstände. Rang 77 ist ein ergänzender fester Referenzrang, **kein allgemein gültiger Median**.

| Profil | Rennen | Ergebnis und Rennverlauf | Aussage für den Vergleich |
| --- | --- | --- | --- |
| Flach, Wind | Tour 2025, Etappe 1, Lille | Philipsen gewinnt; 33 Fahrer mit Siegerzeit, Rang 77 +0:39. Im Finale kam es zu Windteilungen. [1] | Ein flaches Rennen kann sich teilen, ohne dass jede Teilung ein Modellfehler wäre. Wind und Zeitpunkt berücksichtigen. |
| Flach, Sprint | Tour 2024, Etappe 16, Nîmes | Philipsen gewinnt den Massensprint. Ein Soloausreißer wurde 25 km vor dem Ziel gestellt; im Finale gab es einen Sturz. [2] | Kontrolle und Einholen sind ebenso plausible Verläufe. Sturz und Wertungsregeln erschweren die Deutung der offiziellen Zeiten. |
| Hügelig, kurzes Finale | Tour 2025, Etappe 2, Boulogne | Van der Poel vor Pogačar und Vingegaard; Rang 77 +3:22. [3] | Unterschiedliche Fähigkeiten an kurzen Anstiegen können sich auswirken; mehrere Minuten Rückstand sind möglich. |
| Viele Anstiege, Bergankunft | Tour 2025, Etappe 10, Le Mont-Dore | Simon Yates siegt aus einer Ausreißergruppe, Arensman +0:09; Pogačar und Vingegaard +4:51. [4] | Ausreißer können gegen Favoriten gewinnen; Rennsituation und Gesamtwertung beeinflussen das Ergebnis. Nicht unmittelbar mit einem isolierten Eintagesrennen gleichsetzen. |
| Schwerer Klassiker | Lüttich–Bastogne–Lüttich 2024 | Pogačar gewinnt nach Attacke an der Redoute rund 34,5 km vor dem Ziel; Bardet +1:39, Platz 10 +2:02, Rang 77 +17:08. 117 von 175 Startern im Ziel; Median der Finisher +13:10. [5] | Große Rückstände und ein kletterstarker Sieger sind bei diesem Profil möglich. Ausfälle beachten. |
| Schwerer Klassiker | Lüttich–Bastogne–Lüttich 2025 | Pogačar gewinnt; Plätze 2 und 3 +1:03, Rang 77 +5:41. 129 von 175 Startern im Ziel; Median der Finisher +5:41. [6] | Auf ähnlichem Kurs ein deutlich anderer Rückstand im hinteren Feld als 2024; keine fixe Zielzeit ableiten. |
| Lange Bergankunft | Tour 2025, Etappe 12, Hautacam | Pogačar gewinnt, Vingegaard +2:10, Rang 10 +7:26 und Rang 77 +31:22. [7] | Sehr große Abstände sind möglich; sie müssen jedoch durch Verlauf und Belastung erklärbar sein. |
| Lange Bergankunft | Tour 2024, Etappe 15, Plateau de Beille | Pogačar gewinnt vor Vingegaard +1:08 und Evenepoel +2:51. [8] | Unterschiedliche Abstände an der Spitze schwerer Bergetappen sind plausibel. |
| Anstieg, Abfahrt und flaches Finale | Mailand–Sanremo 2024 | Philipsen gewinnt vor Matthews und Pogačar; die ersten drei erhalten dieselbe Zeit. [9] | Ein sprintschneller Fahrer kann nach schwierigen Anstiegen vorne bleiben; seine konkrete Leistungsfähigkeit und Renndynamik zählen. |
| Anstieg, Abfahrt und flaches Finale | Mailand–Sanremo 2025 | Van der Poel gewinnt vor Ganna und Pogačar; Platz 4 +0:43. [10] | Ein selektiver Anstieg mit anschließender Abfahrt und flachem Finale kann auch eine sehr kleine Spitzengruppe ergeben. |

Mailand–Sanremo ist mit 288 bzw. 289 km und den Anstiegen Cipressa und Poggio nur eine **grobe qualitative Referenz** für den diskutierten Übergang Anstieg–Abfahrt; es bildet kein vereinfachtes synthetisches Profil exakt ab. Die beiden Tour-Bergankünfte unterscheiden sich ebenfalls erheblich in Streckenführung, Rennphase und Vorgeschichte.

## Ableitungen für den späteren Test

1. Vorab die zwei Code-Stände, Profile, Fahrerfelder, Seeds, Einstellungen und Messdefinitionen festhalten. Identische Inputs verwenden, soweit die Versionen es erlauben; verbleibende Unterschiede dokumentieren.
2. Nicht nur Sieger und Endabstand untersuchen: Zeitpunkt und Ort von Angriffen, Zusammensetzung von Spitzengruppe und Feld, Führungs- und Verfolgungsarbeit, Trennungen und Wiederzusammenschlüsse sowie Belastung und Reserven der Fahrer nachverfolgen.
3. Verteilungen über mehrere Seeds betrachten, einschließlich ungewöhnlicher, aber plausibler Rennen. Ein Seed ist dabei ein reproduzierbarer Startwert des Zufallszahlengenerators, keine reale Wetter- oder Streckenvariante. Welche Ereignisse dadurch tatsächlich variieren, muss anhand der jeweiligen Implementierung überprüft werden.
4. Das Modell nicht auf einen gewünschten Sieger, Fahrertyp, Gruppenabstand oder realen Einzelwert trimmen. Ein guter Sprinter kann kurze Anstiege überstehen, ohne dass dies für jeden Sprinter auf jedem Profil gelten muss. Ein Kletterer kann einen hügeligen Klassiker und ein guter Zeitfahrer eine Bergetappe gewinnen, wenn seine weiteren Eigenschaften und der Rennverlauf es tragen.
5. Zeitangaben vergleichbar machen: In echten Straßenrennen werden Zeitgruppen nach Regeln gewertet; bei Etappen können Sonderregeln für Zwischenfälle und Gesamtwertung hinzukommen. Die simulierte Gruppenzuordnung ist eine andere Messmethode. Gleiche offizielle Zeit belegt deshalb weder exakte Abstände noch eine identische Gruppenstruktur während des Rennens.
6. Starterzahl, reale Ausfälle, Feldstärke, Fahrerrollen und Gewichtung angeben. Die erwähnte Simulationsreferenz mit 154 Finishern enthält keine entsprechenden Ausfälle; ihre Medianwerte sind daher nicht direkt mit den Medianen der tatsächlichen Finisher vergleichbar. Platzquantile und absolute Ränge können ergänzen, lösen das Problem aber nicht vollständig.
7. Rundfahrtetappen unterliegen Vorbelastung, Gesamtwertung, Zeitlimit und Aufgaben für spätere Tage. Die Einzelrennen-Simulation bildet dies nicht vollständig ab. Wetter, Stürze, Defekte, Ernährung und reale Teams können ebenfalls abweichen.
8. Ergebnisse und Abweichungen nach Ursachen bewerten; kleine, gezielt ausgewählte Fallzahlen erlauben keine verlässlichen Aussagen über echte Häufigkeiten. Den Vergleich erst nach gemeinsamer Festlegung von Profilen, Laufzahl und Auswertung starten.

## Quellen

1. [Lille 2025, Etappenergebnis L’Équipe](https://www.lequipe.fr/Cyclisme-sur-route/course-en-direct/tour-de-france-2025/etape-1-live/22080/classement); [Rennbericht](https://www.letour.fr/en/news/2025/stage-1).
2. [Nîmes 2024, offizieller Rennbericht](https://www.letour.fr/en/news/2024/stage-16/sprint-masterclass-from-philipsen-in-nimes/1322785); [Etappenergebnis RTÉ](https://www.rte.ie/sport/results/cycling/tour-de-france/888023/results/4346509/).
3. [Boulogne 2025, offizieller Rennbericht](https://www.letour.fr/en/news/2025/van-der-poel-keeps-the-dream-going/1325713); [Etappenergebnis L’Équipe](https://www.lequipe.fr/Cyclisme-sur-route/tour-de-france/annee-2025/page-classement-individuel/2eme-etape-lauwin-planque-boulogne-sur-mer).
4. [Le Mont-Dore 2025, Etappenergebnis RTÉ](https://www.rte.ie/sport/results/cycling/tour-de-france/895458/results/4666791/); [Rennbericht Cyclingnews](https://www.cyclingnews.com/races/tour-de-france-2025/stage-10/results/).
5. [Lüttich 2024, Ergebnis und Ausfälle RTÉ](https://www.rte.ie/sport/results/cycling/liege-bastogne-liege/889501/); [Ergebnisliste und Rennbericht](https://www.bikeraceinfo.com/classics/Liege-Bastogne-Liege/2024-liege-bastogne-liege.html).
6. [Lüttich 2025, Ergebnis und Ausfälle RTÉ](https://www.rte.ie/sport/results/cycling/liege-bastogne-liege/895815/); [Ergebnisliste Sportschau](https://www.sportschau.de/live-und-ergebnisse/radsport/co691/liege-bastogne-liege/ma10758371/ergebnisse).
7. [Hautacam 2025, offizieller Rennbericht](https://www.letour.fr/en/news/2025/stage-12/pogacars-stunning-response-at-hautacam/1329344); [Etappenergebnis ProCyclingStats](https://www.procyclingstats.com/race/tour-de-france/2025/stage-12-gc/result/).
8. [Plateau de Beille 2024, offizieller Rennbericht](https://www.letour.fr/en/news/2024/its-pogacar-again-on-plateau-de-beille/1322529).
9. [Mailand–Sanremo 2024, Veranstalter](https://www.milanosanremo.it/en/news/jasper-philipsen-won-the-milano-sanremo-2024/).
10. [Mailand–Sanremo 2025, Veranstalter](https://www.rcssportsandevents.it/en/mathieu-van-der-poel-wins-the-milano-sanremo-2025/).

Die bereits dokumentierten Vergleichswerte und weitergehenden Einschränkungen stehen in [R24_REALRENNEN_ABGLEICH.md](R24_REALRENNEN_ABGLEICH.md). Diese neue Zusammenstellung erweitert sie, ersetzt sie aber nicht. Es wurde im Rahmen dieser Recherche kein Simulationsvergleich gestartet und kein Engine-Code geändert.
