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


## Erster tatsächlich geprüfter Vierprofil-Durchlauf – 04.11.2026

**[PR #64](https://github.com/Lancester/radsportmanager/pull/64)** mit Commit `5bf802e978513af94a0456f7e5cb0d7d84be3795` in `main` übernommen. **[GitHub Actions #41796481506](https://github.com/Lancester/radsportmanager/actions/runs/41796481506): 264/264 Tests bestanden**. Der Probeumfang war genau **vier vollständige 154-Fahrer-Rennen**, je Profil ein fester Seed 2026 und ausschließlich `stable-pack` – keine Monte-Carlo-Serie.

| Rennprofil | Sieger | Sieger-Typ | Größte Zielgruppe / 154 | Rückstand größte Gruppe | Binnen 60 s | Attacken | Max. Abstandsgruppen | Gemessene nominierte Jagdfront (s) |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Lille/flach | F057 | Allrounder | 86 | 15,77 s | 118 | 49 | 16 | 2639 |
| Boulogne/hügelig | F036 | Klassiker | 32 | 63,24 s | 31 | **108** | 17 | 976 |
| Lüttich/Klassiker | F093 | **Sprinter** | 46 | **706,93 s** | 21 | 41 | **36** | 0 |
| Hautacam/Berg | F093 | **Sprinter** | 12 | **1351,80 s** | 17 | 18 | 25 | 0 |

**Winner-Trace-Diagnose aus denselben vier Rennen (kein weiterer Lauf):** F093 registrierte bei Lüttich und Hautacam **keinen eigenen Angriff**. In Lüttich ist er bei Kilometer ~240 unter den ersten sechs; vier Sprinter kommen auf die Plätze 1 bis 4. Auf Hautacam liegt F093 bereits bei km 165 an Rang 1; der Schlussanstieg mit 13,5 km Länge beginnt bei ~167,1 km, bei 170 und 180 km ist F093 weiterhin vorne. Ein Wert von null für `mainFieldFrontWorkWithAssignedChaserS` heißt ausschließlich: keine positive Zeit für **nominierte Jagdhelfer als tatsächlich vorne fahrende Fahrer des größten physischen Feldes** nach dieser speziellen Metrik, nicht: niemand fährt vorne oder verfolgt.

**Interpretation (Hypothese, noch unbewiesen):** Die breite Gruppe passt sich wahrscheinlich zu stark an das reale Tempo ihres jeweiligen Pacesetters an; reine Mitfahrt kann verhindern, dass besser geeignete Fahrer bei längeren Steigungen selbstständig eine vordere Position einnehmen. Gleichzeitig könnte fehlende koordinierte Mannschaftsjagd im späteren, bereits fragmentierten Rennen ihre sportlichen Vorteile verdecken. Die gerade bestehenden Werte **beweisen keinen Fehler im mechanischen Rechenkern**. Ein einzelner Seed rechtfertigt auch keine belastbaren Siegerquoten.

**Exakter nächster kleiner Schritt:** Berg-/Klassikerfahrer im Anfangs-, Schlüsselanstiegs- und Zielbereich anhand vorhandener Checkpoints, W′/CP, physischer Position und Leitlinie gegen F093 prüfen; dann eine **isolierte** experimentelle Verbesserung formulieren und wieder denselben Vierprofil-Test samt 154er-No-Attack-Kontrolle durchlaufen lassen. Für Lille dürfen die Fortschritte aus PR #63 nicht unbemerkt verloren gehen. Boulognes **108 Attacken** separat behandeln; nicht jetzt zugleich sämtliche KI-Parameter ändern.

**Dokumentationsregel:** Dies sind **technisch verifizierte Messwerte**, aber weiterhin **keine allgemeine Realitätsfreigabe**. Der große Multi-Seed-Check bleibt explizit auf die Schlussphase verschoben.
