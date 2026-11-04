# R-22 – Profilweises Verbessern statt großer Vorab-Validierung

**Verbindliche Nutzerentscheidung vom 04.11.2026:** Zuerst mit der neuen experimentellen `stable-pack`-KI ganz praktisch auf unseren **bereits vorhandenen** vier unterschiedlichen Rennprofilen arbeiten. Der Assistent führt kleine Tests direkt über GitHub durch und behebt gezielt beobachtete Fehler. **Die große Mehrseed-/Monte-Carlo-Validierung kommt erst am Ende**, wenn die KI auf allen vier Rennarten einigermaßen schlüssig funktioniert.

## Unsere vier festen Referenzrennen

| Rennart | Referenz (modellierte Strecke nach veröffentlichten Ankern) | Distanz |
| --- | --- | ---: |
| Flach | `tdf25_lille`, Tour de France 2025, Lille | 184,9 km |
| Hügelig | `tdf25_boulogne`, Tour de France 2025, Boulogne | 209,1 km |
| Klassiker | `lbl25_liege`, Liège–Bastogne–Liège 2025 | 252,0 km |
| Berg | `tdf25_hautacam`, Tour de France 2025, Hautacam | 180,6 km |

`src/engine/race/reference-fixtures.ts` enthält die Referenzprofile, fiktive auf die Rennart abgestimmte Mannschaften und 154 Fahrer pro Einzelrennen. Keine neuen Teststrecken bauen. Bekannte Anstiege und Distanzen sind Quellenanker, Verbindungsstücke sind modellierte, **nicht GPS-genaue** Profile. Die Fahrer sind keine historischen Profi-Identitäten.

## Einfache Arbeitsroutine – ohne weitere Rückfragen, solange keine Grundsatzentscheidung erforderlich ist

1. **Mit vier Einzelrennen beginnen**, immer `stable-pack`, derselbe feste Seed (2026), ansonsten dieselben vorhandenen Profil-/Teameinstellungen.
2. **Ergebnisse direkt diagnostizieren:** Sieger-Fahrertyp, größte Zielgruppe und deren Rückstand, Fahrer binnen 60 s, Feldgruppen bei 25/50/75 %, Attacken, reale Jagdführung/Führungswechsel, Leistungs- und W′-Indikatoren.
3. **Ein konkretes Problem bestimmen:** Beispielsweise Feldzerfall ohne starken Führungsimpuls, zu viele Attacken, mangelhafte Jagd oder unrealistische Berggruppen. Welche Rennart sollte sich unterscheiden? Ein kleineres Berg-Hauptfeld ist **nicht** automatisch ein Fehler.
4. **Nur gezielt an der KI ändern** und denselben kleinen Vierprofil-Vergleich wiederholen. Auch den bestehenden 30er-/600-s-Konstanttempo-Test und die 154er-/20-km-Feldprobe ohne Attacken behalten.
5. **Messdaten und Fehlschläge im GitHub-Entwicklungsstand dokumentieren.** Vor jeder nächsten Änderung die Ursache und die falsifizierbare Gegenprobe festhalten. Nicht auf einzelne Sieger „hintrimmen“.
6. **Erst am Schluss**, nachdem Flach-, Hügel-, Klassiker- und Bergrennen in Grundzügen plausibel funktionieren, gemeinsam die aufwändigere mehrere-Seeds-/Statistik-Validierung planen und **nur bewusst manuell** starten.

## Technische Umsetzung jetzt

- `scripts/r22-profile-smoke.mjs`: vier vollständige Rennen bei `--route all --seed 2026`, nur `stable-pack`. Alternativ **eine** einzelne Referenzstrecke mit `--route tdf25_hautacam` und bewusst anderem `--seed`; keine automatische Saatvariation.
- `tests/r22-profile-smoke.test.mjs`: GitHub-Regression startet diese vier Einzelrennen und prüft physikalische und strukturelle Invarianten. Zahlen und Auffälligkeiten werden in den GitHub-Actions-Logs unter `R22-PROFILE` festgehalten.
- Der bereits vorhandene manuelle Workflow `.github/workflows/r22-group-ai-ab.yml` mit längerem A/B-Experiment bleibt unverändert; er wird **hier nicht ausgelöst**. Die zuvor vorgeschlagene 36-/60-Rennen-Matrix wurde ausdrücklich zurückgenommen und nicht in die Implementierung übernommen.

**Kein Defaultwechsel:** `groupRidingModel:'legacy'` bleibt Standard, `stable-pack` bleibt die experimentelle Entwicklungsbasis. Bewegungsphysik, CP/W′, Formations-Aero und R-19 bleiben unverändert, bis konkrete Tests Änderungen begründen. R-22/Issues #42 und #54 offen, R-23 noch nicht freigegeben.

**Erste feste Referenz aus PR #63:** Lille, Seed 2026, `stable-pack`: 86 in der größten Zielgruppe, deren Rückstand 15,77 s, 118 Fahrer innerhalb 60 s – aber 49 Attacken. Das ist nur ein einzelner Referenzpunkt, keine Realitätsabnahme.

**Nächster Schritt nach diesem PR:** Die gemessenen vier Profile vergleichen und dann gezielt die erste nachgewiesene Unplausibilität der neuen KI beheben. Keine Kosten-/CI-Ausweitung oder große Validierung vorher.
