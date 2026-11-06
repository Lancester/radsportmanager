# Lille Seed 101 – Diagnose von Feldteilung und Sprintteam

Stand 06.11.2026. Der Nutzer bat um eine genauere Auswertung des konkreten Flachlaufs. Der große Vergleich bleibt angehalten. Diese Untersuchung ist ein einzelner Seed, keine sportliche Kalibrierung und keine allgemeine Aussage über die Häufigkeit des Fehlers.

## Grundlage und technische Prüfung

- Gespeicherter Vergleich: Lille/common, 154 fiktive Fahrer, Seed 101, stable-pack; main Commit 621e712371563278c5bed2bb643dd598a9a7bcf4, neues Modell Engine-Stand 772d1e910d01f991fe69f857e1291fb474978afe.
- Der neue Modelllauf wurde mit vollständigen Checkpoints für alle Fahrer wiederholt. Seine gesamte Zielklassifikation und Ereignisliste stimmen exakt mit dem zuvor archivierten neuen Modelllauf überein. Der Hash gemeinsamer Basisdaten stimmt ebenfalls überein. Die gemeinsame Hashbasis schließt die späteren Ermüdungsattribute aus; der gleiche Seed bewirkt nicht notwendigerweise identische Zufallsentscheidungen bei veränderter Konfiguration.
- Ein weiterer kompletter Lauf verwendet dieselben Eingaben und dasselbe neue Modell mit `disableAttacks: true`. Alle 154 Fahrer erreichten in beiden Diagnose-Läufen das Ziel. Der höchste absolute Wert der Energie-Residualgröße beträgt rund 0,00022 J bzw. 0,00043 J. Das sind technische Prüfungen der implementierten Rechnung, kein Realismusnachweis.
- Die zeitlich angezeigten Gruppen sind Abstandsgruppen im eindimensionalen Modell. Die Checkpoints werden jeweils dann aufgenommen, wenn die Rennspitze die jeweilige Distanz erreicht. Geschwindigkeit, Watt und W′ sind Momentaufnahmen, keine Durchschnittswerte eines Streckenabschnitts.

## Was im neuen Modell geschieht

F023 ist der vorab leistungsstärkste Sprint-Proxy und ausgewiesene Sprinter des Sprintteams T04. Im Vergleich gewinnt F050 (Kletterer, Kapitän); F023 wird 67. mit 432,60 s Rückstand. Bei main wird F023 Zweiter mit 0,34 s Rückstand.

| Rennspitze | Gruppenentwicklung im neuen Modell | F023 und sein Team |
| --- | --- | --- |
| km 50 | Spitze 2 Fahrer, dahinter 152 | F023 und alle sechs Teamkollegen in der 152er-Gruppe. |
| km 60 | 2 / 4 / 121 / 20 / 7 | F023 in der 121er-Gruppe; Teamkollegen F022/F027 sind bereits in der 20er-Gruppe dahinter. |
| km 65 | 2 / 125 / 20 / 7 | F023 in der 125er-Gruppe. |
| km 70 | 2 / 4 / 60 / 61 / 20 / 7 | F023 in der 61er-Gruppe; F024 und F026 vorn in der 60er-Gruppe, F025 und F028 bei F023. Die Lücke zwischen dem letzten Fahrer der 60er- und dem ersten der 61er-Gruppe beträgt 49,2 m. |
| km 75 | 2 / 64 / 61 / 20 / 7 | F023 weiterhin in der 61er-Gruppe, F025/F028 ebenfalls. Zur vorherigen Gruppe bestehen 163,1 m. |
| km 80 | 3 / 63 / 61 / 20 / 7 | Die Lücke zur vorherigen Gruppe ist auf 453,6 m gestiegen. |
| km 100 | 66 / 61 / 20 / 7 | Die erste Gruppe ist nun größer als die 61er-Gruppe; zwischen beiden liegen rund 1.480 m. |

Bei km 70 und 75 zeigt der Checkpoint für F023 100 % W′, ungefähr 260 bzw. 262 W und 39,1 bzw. 38,4 km/h. F025/F028 sind in derselben Gruppe und zeigen 100 % W′. Die W′-Anzeige beweist nicht, dass diese Fahrer einen Anschluss allein oder kollektiv schaffen; sie zeigt nur, dass die Modellreserve am Messzeitpunkt nicht als erschöpft erfasst ist. Zwischen km 68,01 und 76,98 weist die verwendete vereinfachte Strecke eine mittlere Steigung von etwa 1,4 % auf. In der Ereignisliste sind von km 50 bis 75 keine neuen Angriffsbeginn-Ereignisse registriert; Angriffe und Jagdentscheidungen davor, laufende Effekte, Gelände sowie Gruppenregelung können dennoch relevant sein.

Bei km 70 war die 61er-Gruppe F023s die größte Abstandsgruppe; bei km 75 war die vorausfahrende 64er-Gruppe größer. Die übergreifende Rennspitze war in diesen Momenten jeweils eine separate Zweiergruppe. Somit ist die Frage, welche Gruppe die Renn-KI als Hauptfeld und welche konkrete Gruppe sie als Jagdziel ansieht, für die Analyse entscheidend.

## Mannschaftsentscheidung: konkreter Hinweis, keine abgeschlossene Ursache

Das Team T04 ist als `sprint` eingestellt, F023 hat die Rolle `sprinter`. In `decideIntelligentCrew` ist der besondere Anschlussauftrag `rejoin` ausdrücklich nur für Strategie `kapitaen_schuetzen` und Zielrolle `kapitaen` vorgesehen. Das ist eine nachgewiesene Regelgrenze: Ein abgeschnittener Sprinter eines Sprintteams fällt nicht unter genau diesen Auftrag.

Dieser Befund beweist **nicht**, dass T04 keine andere Hilfe leisten konnte oder dass diese Bedingung den Rückstand allein verursacht hat. Die normale Feldjagd und individuelle Reaktionen sind eigene Mechanismen. In der gespeicherten Ereignisliste wurden für T04 keine `team-chase`-Ereignisse aufgezeichnet; außerdem enthält die Anschlussauftragstelemetrie keinen Eintrag für T04. Es handelt sich um dokumentierte Aufträge/Ereignisse, nicht um einen lückenlosen Nachweis, dass kein T04-Helfer jemals Fahrtwind oder Leistung eingesetzt hat. Der vollständige Diagnoselauf enthält 3.032 Ereignisse und blieb unter der Ereignisobergrenze.

In der Teamplanung wird das größte Abstandsfeld als Hauptgruppe verwendet, während die Lagebewertung die vorderste Gruppe heranzieht; eine kleine Lücke kann deshalb bei wechselnden Gruppengrößen eine andere taktische Einordnung erhalten. Ob die konkrete Auswahl eines Jagdziels, Teaminteressen, Führungsleistung, Nachführregelung oder die 42-m-Abstandsgrenze ausschlaggebend war, ist mit diesen Daten noch nicht isoliert.

## Gegenprobe ohne Angriffe

| Messgröße | Normaler Lauf | Angriffe deaktiviert |
| --- | ---: | ---: |
| Protokollierte Angriffsbeginn-Ereignisse | 13 | 0 |
| Protokollierte Verfolgungsbeginn-Ereignisse | 1.786 | 0 |
| Gruppengröße F023 bei km 50 / 70 / 90 | 152 / 61 / 61 | 154 / 154 / 154 |
| Zielrang F023 | 67 | 1 |
| Gewinner | F050 | F023 |

Die Ausschaltung greift in den gesamten Rennverlauf ein und kann Zufallsentscheidungen, Teamjagd und Tempo verändern. Sie belegt, dass in diesem Einzelfall ohne Angriffe und mit den dadurch veränderten Folgeentscheidungen der frühe Feldzerfall ausbleibt. Sie belegt nicht, ob die Ursache ein Angriff selbst, die Reaktion darauf, die Teamjagd oder die Gruppenphysik ist. Die Gegenprobe ist keine Empfehlung, Angriffe abzuschalten.

## Nächste gezielte Prüfung

Einen zeitlich fein aufgelösten Vergleich ab km 60 aufzeichnen: Gruppenwechsel, Lückengröße, tatsächliche vordere Gruppe, Teamziele und -aufträge, Fahrerleistung, Windschutz und Tempo. Dabei gezielt untersuchen, ob und wann T04 die vorausfahrende 60er-/64er-Gruppe als Anschlussthema erkennt und welche Bedingung einer realistischen gemeinsamen Arbeit entgegensteht. Anschließend eine minimal begrenzte Anpassung an der Anschlussentscheidung für Sprintteams nur dann testen, wenn die feinere Telemetrie den Zusammenhang stützt; sie darf keine Geschwindigkeit schenken oder einen erfolgreichen Anschluss garantieren. Gezielt dieselben Seeds und weitere Kontrollen gegen den unveränderten Vorherstand vergleichen. Eine solche Änderung ist hier noch nicht vorgenommen.

## Reproduzierbarkeit und gesicherte Rohdaten

Diagnoseskript: `scripts/r24-lille101-diagnose.mjs`. Mit Node v24.22.1 und einem Checkout des obigen Engine-Stands:

```sh
node --experimental-strip-types scripts/r24-lille101-diagnose.mjs /PFAD/ZUM/ENGINE-CHECKOUT basis basis.json
node --experimental-strip-types scripts/r24-lille101-diagnose.mjs /PFAD/ZUM/ENGINE-CHECKOUT ohne-angriffe ohne-angriffe.json
```

Die vollständigen Diagnosedaten inklusive aller Checkpoints sind in vier Teilen `diagnose-lille101-teil-00.b64` bis `-03.b64` im selben Ordner gesichert. Zum Zusammenführen in numerischer Reihenfolge, Base64-Dekodieren und Entpacken:
```sh
cat diagnose-lille101-teil-00.b64 diagnose-lille101-teil-01.b64 diagnose-lille101-teil-02.b64 diagnose-lille101-teil-03.b64 | base64 -d > diagnose.jsonl.gz
gzip -dc diagnose.jsonl.gz > diagnose.jsonl
```
SHA-256 des komprimierten Streams: `a85c884105e9a2f5e350f4aa45a45d4b7e85f603d8deba88e5c2dc5d5807bd8f`. Jede JSONL-Zeile enthält `filename`, `sha256` und die ursprüngliche Datei als `raceRaw`. Die vier auf GitHub gespeicherten Teile wurden nach dem Hochladen bytegleich mit den lokalen Teilen verglichen.
