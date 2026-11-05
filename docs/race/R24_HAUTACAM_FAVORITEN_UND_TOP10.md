# R-24: Hautacam – Favoriten und Fahrertypen

Ergänzung zum Zwischenstand, 05.11.2026. Zehn Seeds je Feld und Version; Seed-Reihenfolge: 11, 42, 101, 123, 777, 2025, 2026, 2027, 9001, 31415. Daten: hautacam-common-10-seeds.jsonl.gz und hautacam-profile-10-seeds.jsonl.gz. Fahrertypen anhand der Referenz-Fixtures des Branches zugeordnet, jeweils pro Seed. Einträge zählen Platzierungen, nicht verschiedene Personen; 100 Top-10-Platzierungen pro Feld und Version.

| Feld | Version | Kletterer | Zeitfahrer | Klassiker | Allrounder | Sprinter |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Bergfeld | main | 50 | 28 | 8 | 14 | 0 |
| Bergfeld | dev | 84 | 13 | 2 | 1 | 0 |
| gemeinsames Feld | main | 46 | 20 | 17 | 16 | 1 |
| gemeinsames Feld | dev | 38 | 33 | 21 | 8 | 0 |

Bergfeld: Kletterer in den einzelnen Top 10 auf main 7, 1, 4, 5, 9, 3, 5, 1, 8, 7; auf dev 7, 7, 9, 10, 9, 9, 7, 8, 9, 9. Alle 40 Sieger sind gemäß jeweiligem Feld als Kletterer klassifiziert. Das Bergfeld umfasst 46 Kletterer, 22 Zeitfahrer, 29 Klassiker, 48 Allrounder und 9 Sprinter; das gemeinsame Feld 25, 22, 29, 55 und 23. Eine Kategorie beschreibt die Zuordnung, die tatsächlichen Stärken variieren individuell.

## Favoriten im Bergfeld

Die vereinfachte Vorabrangliste ist keine kalibrierte Siegwahrscheinlichkeit; Teamrolle und langfristige Belastung sind nur eingeschränkt enthalten.

| Fahrer | Vorabrang | main: Platzierungen | dev: Platzierungen |
| --- | --- | --- | --- |
| F078 | 1 | 17, 15, 2, 20, 67, 2, 1, 14, 25, 1 | 18, 73, 8, 1, 21, 2, 1, 3, 2, 2 |
| F134 | 2 | 1, 16, 3, 1, 1, 1, 2, 16, 1, 2 | 1, 2, 1, 2, 1, 1, 4, 1, 1, 4 |
| F106 | 3 | 15, 29, 36, 11, 9, 23, 26, 31, 19, 4 | 5, 11, 3, 7, 4, 4, 8, 2, 3, 3 |

## Zeitabstände im Bergfeld

Median über zehn Rennen, gerundet auf Sekunden; physisch simulierte Einzelzeiten, keine vollständige offizielle Straßenrennwertung.

| Zielplatz | main | dev |
| --- | --- | --- |
| 2 | +0:04 | +1:42 |
| 10 | +3:19 | +4:39 |
| 77 | +21:30 | +13:23 |
| 154 | +46:57 | +42:03 |

Unterschiede sind keine isolierten Wirkungen einzelner Codeänderungen. Keine Aussage über Plausibilität oder Ursachen ohne weitere Verlaufskontrolle. Die reale Hautacam-Tour-Etappe 2025 enthält andere Fahrer, Vorgeschichte und Wertungsregeln.
