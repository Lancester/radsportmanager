# R-24: Zwischenstand Hautacam

Stand 05.11.2026. Auswertung aller 40 gesicherten Hautacam-Läufe. Nur beschreibende Zwischenbilanz, keine Sportfreigabe und keine isolierte Wirkung einer einzelnen Codeänderung. Vergleichsstände, stable-pack, Seeds und Grenzen siehe R24_GROSSVERGLEICH_ARBEITSSTAND.md.

Für jedes der 20 Paare wurde die Gleichheit der commonInputs-Hashes und die Zielankunft von 154 Fahrern geprüft. Die Felder common und profile sind unterschiedliche Szenarien und keine unabhängigen Zufallsziehungen. Seed-Reihenfolge: 11, 42, 101, 123, 777, 2025, 2026, 2027, 9001, 31415.

| Feld | Version | Siege nach ID | Siegergruppe 1 s / 3 s | Größte Gruppe 1 s / 3 s | Rückstand Rang 77 | Attacken | Ausreißer / eingeholt |
|---|---|---|---|---|---|---|---|
| common | main | F134: 6, F050: 3, F099: 1 | 1.0 / 1.0 | 5.0 / 8.5 | 1670.4 s | 10.0 | 1.0 / 1.0 |
| common | dev | F134: 8, F050: 2 | 1.0 / 1.0 | 7.5 / 23.5 | 803.5 s | 45.0 | 9.0 / 1.5 |
| profile | main | F134: 5, F022: 2, F078: 2, F015: 1 | 1.0 / 1.0 | 5.0 / 12.0 | 1289.7 s | 11.0 | 1.0 / 1.0 |
| profile | dev | F134: 6, F036: 2, F078: 2 | 1.0 / 1.0 | 12.5 / 23.5 | 803.4 s | 51.5 | 9.0 / 2.0 |

Alle Zahlen außer Sieghäufigkeiten sind Mediane über zehn Läufe. Gruppentrennung bei Nachbarlücke von mindestens 1 bzw. 3 Sekunden; die größte Gruppe muss nicht die Siegergruppe sein. Ereigniszähler sind engine-interne Diagnosen, keine unmittelbar mit Profirennen vergleichbaren Definitionen.

## Vorabfavoriten

Die Vorabrangliste ist ein vereinfachter Leistungsproxy und keine kalibrierte Siegprognose; Rollen, Teamarbeit und lange Ermüdung sind nur begrenzt abgebildet. Platzreihenfolge entspricht den oben genannten Seeds.

### common

| Vorabrang | Fahrer | Rolle | main: Zielplätze | dev: Zielplätze |
|---|---|---|---|---|
| 1 | F134 | kapitaen | 2, 1, 2, 1, 1, 1, 1, 2, 1, 28 | 21, 1, 1, 1, 3, 1, 1, 1, 1, 1 |
| 2 | F085 | kapitaen | 94, 113, 117, 135, 88, 112, 124, 108, 103, 96 | 50, 5, 15, 89, 14, 32, 3, 107, 10, 58 |
| 3 | F135 | helfer | 118, 125, 97, 128, 128, 135, 116, 125, 113, 123 | 153, 139, 127, 123, 138, 115, 140, 123, 137, 130 |

### profile

| Vorabrang | Fahrer | Rolle | main: Zielplätze | dev: Zielplätze |
|---|---|---|---|---|
| 1 | F078 | kapitaen | 17, 15, 2, 20, 67, 2, 1, 14, 25, 1 | 18, 73, 8, 1, 21, 2, 1, 3, 2, 2 |
| 2 | F134 | kapitaen | 1, 16, 3, 1, 1, 1, 2, 16, 1, 2 | 1, 2, 1, 2, 1, 1, 4, 1, 1, 4 |
| 3 | F106 | kapitaen | 15, 29, 36, 11, 9, 23, 26, 31, 19, 4 | 5, 11, 3, 7, 4, 4, 8, 2, 3, 3 |

## Auffälligkeiten und nächste Prüfung

- Profilfeld: F078 (Vorabrang 1) wird im Entwicklungsstand bei Seed 42 nur 73.; F134 (Vorabrang 2) gewinnt dort nicht, wird aber Zweiter. Die Momentaufnahmen zeigen F078 bereits bei km 15 rund 188 m hinter der Spitze und bei km 20 rund 329 m; das erklärt noch nicht, weshalb er zurückfällt oder später nicht anschließt. Die Gruppen sind Momentaufnahmen, keine Nachweise durchgehender Fahrgemeinschaften.
- Die medianen Zähler der Attacken steigen deutlich, während Rang-77-Rückstände kleiner ausfallen. Kausalität und sportliche Angemessenheit sind damit nicht bewiesen; Ereignisdefinitionen, Terrain und einzelne Attacken müssen geprüft werden.
- Im profiltypischen Feld steigt die mediane größte Zielgruppe von 5 auf 12,5 bei 1 s; bei 3 s von 12 auf 23,5. Die Siegergruppe liegt nach beiden Messgrenzen in beiden Versionen median bei einer Person. Beides sind nachberechnete Gruppen, keine vollständige UCI-Zeitwertung.
- Zum Realvergleich: Hautacam 2025 war Rang 77 offiziell bei +31:22. Verschiedene Felder, reale Ausfälle, Rundfahrt-Vorgeschichte und andere Gruppenwertung erlauben kein direktes Sollwerturteil. Quelle und weitere Referenzen: R24_PROFIRENNEN_DATENBASIS.md.
- Noch offen: detaillierte Verlaufskontrolle einzelner Auffälligkeiten und Belastung, Auswertung aller weiteren Profile, Vergleichsszenarien und Gesamturteil. Die lokale Vor-Kalibrierungsversion a33c32c ist gemäß Wiederaufnahme bisher nicht reproduziert; Wirkungen einzelner Änderungen nicht zuschreiben.
