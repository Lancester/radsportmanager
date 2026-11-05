# R-24: Orientierung an realen Rennverläufen

Stand 05.11.2026. Dieser Abgleich ist eine fachliche Orientierung, **keine** zu erzwingende Zielvorgabe und keine statistische Validierung. Die vier R-22-Profile verwenden reale Distanzen und einzelne dokumentierte Anstiege, dazwischen aber modellierte Übergänge sowie fiktive Fahrer und Teams. Wetter, Rennsituation, Teamziele und Teilnehmer unterscheiden sich von den Originalrennen.

## Was reale Abstände zeigen

| Reales Rennen | Beobachtung | Einordnung |
| --- | --- | --- |
| Liège–Bastogne–Liège 2024 | Sieger Pogačar; Platz 2 +1:39, Platz 10 +2:02. Rang 59 +13:10, Rang 77 +17:08. 117 von 175 Startern im Ziel. | Der Median der 117 Zielankömmlinge ist Rang 59 mit +13:10. Ausgeschiedene fehlen darin. |
| Liège–Bastogne–Liège 2025 | Sieger Pogačar; Plätze 2/3 +1:03, Platz 10 +1:10. Rang 65 und Rang 77 jeweils +5:41. 129 von 175 Startern im Ziel. | Der Median der 129 Zielankömmlinge ist Rang 65 mit +5:41. Die Zielzeit des letzten gewerteten Fahrers war +16:47. |
| Tour 2025, Lille, Etappe 1 | Philipsen gewinnt; 33 Fahrer werden mit Siegerzeit gewertet, Rang 77 mit +0:39. | Feldteilungen sind auch im Flachen möglich. Offizielle Gruppenzeiten und simulierte individuelle Zeiten sind nicht dasselbe. |
| Tour 2025, Boulogne, Etappe 2 | Van der Poel gewinnt vor Pogačar und Vingegaard; Rang 77 +3:22. | Auch bei einem hügeligen Etappenfinale können Gruppen mehrere Minuten zurückliegen. |
| Tour 2025, Hautacam, Etappe 12 | Pogačar gewinnt vor Vingegaard (+2:10); Rang 10 +7:26 und Rang 77 +31:22. | Große Rückstände sind bei einer schweren Bergankunft normal. Helfer und Nicht-Gesamtklassementfahrer verfolgen oft andere Tagesziele. |

Quellen: [Lüttich 2024 Ergebnisliste und Ausfälle, RTÉ](https://www.rte.ie/sport/results/cycling/liege-bastogne-liege/889501/), [Lüttich 2024 Rangliste, L’Équipe](https://www.lequipe.fr/Cyclisme-sur-route/liege-bastogne-liege/annee-2024/page-classement-individuel/general), [Lüttich 2025 Ergebnisliste und Ausfälle, RTÉ](https://www.rte.ie/sport/results/cycling/liege-bastogne-liege/895815/), [Lüttich 2025 Rangliste, L’Équipe](https://www.lequipe.fr/Cyclisme-sur-route/liege-bastogne-liege/annee-2025/page-classement-individuel/general), [Lille 2025, L’Équipe](https://www.lequipe.fr/Cyclisme-sur-route/course-en-direct/tour-de-france-2025/etape-1-live/22080/classement), [Boulogne 2025, L’Équipe](https://www.lequipe.fr/Cyclisme-sur-route/tour-de-france/annee-2025/page-classement-individuel/2eme-etape-lauwin-planque-boulogne-sur-mer), [Hautacam 2025, ProCyclingStats](https://www.procyclingstats.com/race/tour-de-france/2025/stage-12-gc/result/).

## Vergleichsregeln

- Keine Mindest- oder Höchstzeitabstände vorgeben. Große Rückstände sind sportlich nicht per se ein Fehler; auch kleine nicht. Geprüft werden Ursache, Zeitpunkt und Verteilung über viele Läufe.
- In echten Eintagesrennen steigen viele Fahrer aus, während der Referenzsimulator alle 154 als Finisher ausweist. Ein Median über 154 Finisher ist daher nicht direkt mit einem Median über 117 oder 129 echte Finisher gleichzusetzen. Für einen faireren Vergleich Rangquantile, Starter, Ausfälle und unterschiedliche Feldzusammensetzung mit angeben; aktuell fehlende DNF-Modellierung ausdrücklich markieren.
- Rundfahrten sind anders als Eintagesrennen: Gesamtwertung, Helferaufgaben, Zeitlimit, Gruppetto und Weiterfahren für kommende Tage verändern das Verhalten. Offizielle gleiche Gruppentagezeiten, eventuelle Zeitneutralisation und die experimentelle 1-s-Nachbargruppenregel des Simulators nicht gleichsetzen.
- Pogačar ist ein sehr starker Kletterer und gewann beide aufgeführten Klassiker. Ein Sieg durch einen Kletterer ist für Liège deshalb **kein** Gegenbeweis für Realismus. Auch Zeitfahren und Klettern sind Fähigkeiten, keine exklusiven starren Etiketten.
- Kleine Seed-Stichproben mit fiktiven Daten und ungefähren Profilen liefern Hinweise, keine belastbaren Wahrscheinlichkeiten. Insbesondere die frühe Teilung eines kontrollierten Feldes ohne Angriffe ist nach Ursache und Situation zu untersuchen; sie darf weder allein aufgrund eines Endabstands verworfen noch durch künstlichen Zusammenhalt kaschiert werden.
