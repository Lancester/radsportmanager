# R-24 – Zwei offene Sport-Abnahmepunkte: Sprintführungsarbeit und Lüttich (06.11.2026)

## Entscheidung in Kurzform

**Beide Ursachen fachlich eingegrenzt und durch tatsächlich gelaufene A/B-Diagnosen überprüft; keine neue Enginekorrektur freigegeben.** Die frühere R-24-Abnahme bleibt technisch grün, PR #84 ist weiter der wichtigste Korrekturkandidat und weiterhin **ungemergt**. Die beiden jetzt geprüften Punkte sind für eine grob funktionierende Einzelrennengine besser bewertbar; für voll kalibrierte Windfront-Positionsphysik und realistische Verteilungen fehlt noch Evidenz.

## Reproduzierbare Ausführung

- Basis: `develop/manager-mvp` (Audit) gegen `experiment/r24-negative-accel-fix-20261106` (Kandidat PR #84). Weitere unveränderte Engineschichten identisch.
- Neue **rein beobachtende** Diagnose auf [Draft-PR #88](https://github.com/Lancester/radsportmanager/pull/88), `experiment/r24-sprint-classics-diagnosis-20261106`, Skript `scripts/r24-final-two-diagnosis.mjs`.
- [Actions #42241205564](https://github.com/Lancester/radsportmanager/actions/runs/42241205564): beide Jobs erfolgreich; Seeds 123 und 314 × (Lille + Lüttich) × (Audit + PR84) = **8 vollständige, paarige Rennläufe**. Sportmechanik unverändert; roher CSV-/JSONL-Beleg in `r24-last-two-123` / `r24-last-two-314`.
- Zusätzlich engster Sprint-Wiederanschluss-Versuch auf [Draft-PR #89](https://github.com/Lancester/radsportmanager/pull/89), `experiment/r24-sprint-front-reacquire-20261106`. Einzige Engineänderung `race-simulator.ts`: der bereits nominierte Jagdhelfer darf innerhalb des vorhandenen `decideChaseApproach`-Reglers auch bei `crewDuty==='fuehrung'` zur eigenen Feldfront aufarbeiten, statt nur bei `unterstuetzung`. Keine zusätzlichen Positions- oder Energieboni. [Actions #42242142183](https://github.com/Lancester/radsportmanager/actions/runs/42242142183), beide Jobs einschließlich TypeScript-/gezielten Tests erfolgreich; **4 zusätzliche Lille-Rennläufe** (2 Seeds × PR84 unverändert/PR89).
- Die zwei Seeds sind **keine unabhängige neue 8-Seed-Kalibrierung**; sie wiederholen bewusst bereits auffällige Fälle aus dem früheren 4-Seed-Abnahmetest.

## 1. Lille: Unterschied zwischen nominierter Führung und wirklich windoffener Front

Die bisherige Messgröße `namedChaseLeader.longestExposedCpNearSeconds` verlangt **gleichzeitig**: Teamauftrag `jagd`, Duty `fuehrung`, tatsächliche Intention `verfolgung`, Position bis 18 m zur größten Abstandsgruppenfront, zusätzlich **exakt bis 1 m zur realen Position des vordersten Fahrers**, Windschattenfaktor >= 0,95, tatsächlich >=86 % der verfügbaren effektiven CP. Es ist ein **strenger Windfront-Ausweis**, kein Synonym für gesamte Führungsarbeit oder die 15–20 min eines Teamauftrags.

**PR84-Einzelbelege:**

| Lille | Seed 123 | Seed 314 |
| --- | ---: | ---: |
| Nominierte Jäger-Sekunden | 2940 | 630 |
| CP-nahe tatsächlich innerhalb 18 m zur Front gefahrene Fahrer-s | **1476** | **440** |
| Längster kontinuierlicher CP-naher Frontabschnitt | **560 s** | **436 s** |
| Kumulierte echt exponierte und CP-nahe Frontzeit | 976 s | 202 s |
| Längster kontinuierlicher *windoffener* Abschnitt | **23 s** | **10 s** |
| Nominierte Sekunden mit Rückstand >18 m | 1450 s | 93 s |
| Hauptsächliche Handoff-Gründe | 21× hinter 72-m-Zone, 5× eingeholte Flucht, 1× Helfer verausgabt | 4× keine verfolgte Flucht |

**Fachliche Deutung:** Fahrer leisten nachweislich 7–9 Minuten CP-nahe Arbeit innerhalb der 18-m-Zone; das frühere Urteil „Helfer fahren nur 10–23 Sekunden“ war zu pauschal. Zugleich ist die echte *ununterbrochene Windfront-Exposition* auffällig kurz. Es kann an häufigen Positionsübernahmen in einer einzigen 1D-Spur, an real rollenden Vorderfahrern oder am konservativen 1-m-/Aero-Filter liegen. **Eine durchgängige physische Führung von 15–20 min ist nicht nachgewiesen.** Nicht durch Umdeutung der Messdefinition als gelöst ausgeben.

**Minimalversuch PR89:** Seed 123 und 314 unveränderte Frontsekunden, Expositionssekunden, längste Windfrontstints, Gewinner und Jagdhandovers zwischen PR84 und PR89; bei Seed 314 mittlerer Zielrückstand höchstens um 0,01s anders. Die Zusatzbedingung ist **praktisch unwirksam**. **Nicht übernehmen, nicht mergen.** Der eigentliche Flaschenhals ist nicht auf diesen einzelnen 10-s-Duty-Zustand reduzierbar.

**Die PR84-Engine hat bereits physisch andauernde Arbeit** (z. B. 560 s CP-nah). Für grobe Einzelrennen ist das ein sinnvoller Fortschritt; für eine spätere realistische Rotation und Einzelhelfer-/Windschutzfunktion ist echtes, kontinuierliches 1D-Spitzenfahren noch offener Feinschliff. Weitere heuristische 'Frontboni' vermeiden. Falls vor finaler 1.0-Freigabe erneut angerührt: Instrumentierung der tatsächlich am Wind wechselnden Fahrer *pro Sekunde* und Energie-/Windfaktor statt neue Mandats- oder Watt-Sonderregeln.

## 2. Lüttich: Leistungsprofile, realer Vergleich und Modellgrenzen

- Gleiches fiktives Feld, 154 Fahrer: **32 Kletterer, 36 Klassikerfahrer** (der Rest aus Sprintern/Allroundern/Zeitfahrern).
- Mittlere CP/kg in der fiktiven Lüttich-Aufstellung: Kletterer ca. **5,76 W/kg**, Klassiker ca. **5,16 W/kg**; mit Radgewicht in der denominator ca. **5,13 vs 4,66 W/kg**. Da das modellierte Profil 252 km und rund **3346 positive Höhenmeter** aufweist, ist nachhaltige Kletterer-Stärke über viele selektive Anstiege ein echter, kraftgesetzlich begründeter Effekt. Die Figureneigenschaft `specialty` löst keine verborgene Sieg-Zeitgutschrift aus.
- `rampSpecialistByTeam` wird nach berechneter **3-Minuten-Leistung pro Gesamtgewicht**, nicht nach der Bezeichnung `klassiker` gewählt. `decideClassicsApproach` und `decideClassicsRampTempo` verlangen reale Gruppe/Position/Reserve und fordern nur anliegende Watt, keine Teleportation.
- Seed 123, PR84: Sieger F134 (Kletterer, **6,41 CP-W/kg**) früh ab km ~175 in einer echten Einzelspitze. Weitere starke Fahrer liegen beim checkpoint km 210 rund 2,17 km hinter ihm, km 235 ca. 2,93 km. `classicsRampTempoSeconds=0` im PR84-Lauf (Audit desselben Seeds: 732 s). **Nicht automatisch fehlerhaft:** Der Rampenpacer verlangt eine mindestens vierköpfige Gruppe und einen tatsächlich ausgewählten Fahrer nahe der Spitze; ein Solo-Führender erhält keinen künstlichen Gruppenpacer-Bonus. Lange Abstände im Ziel werden stark vom Solorennverlauf geprägt.
- Seed 314, PR84: Kletterer F078 gewinnt; Kletterer Top 4 mit anschließend Klassiker auf Rang 5. Aber `classicsRampTempoSeconds=622`, beteiligte Typen **Klassiker, Allrounder und Kletterer**. Die Klassikerregel ist also aktiv und kein pauschaler nur-Kletterer-Bonus.
- 4-Seed-Abnahme zuvor: Lüttich im Mittel PR84 4/4 Kletterer-Sieger, mittlerer Median-Zielrückstand **714,7 s**, Audit 530,1 s. Seed 123 besonders starke Streuung. Die vier Seeds genügen nicht, um das quantitativ zu kalibrieren.
- **Realitätsabgleich (nicht als exakte Sollwertliste):** Lüttich 2025 gewann **Tadej Pogačar**, bei ProCyclingStats als `Climber` eingeordnet; auch Platz 2 und 3 waren dort `Climber`. Gleichzeitig erreichten echte Klassiker-/Hügelspezialisten vordere Plätze. Der 79. der realen Ausgabe 2025 hatte ca. **+5:44**, Platz 83 +8:11, Rang 103 +14:27; die fiktive PR84-Engine hat bei ihrem eigenen, anderen 154er-Fahrerfeld auf Position 77 im Mittel etwa +11:55. **Das ist ein offener Kalibrierungshinweis**, aber wegen unterschiedlicher Startlisten, Geometriedaten, Finishers und Gruppenwertungsregeln **kein valider direkter Faktor-2-Beweis**.
  - Quellen: https://www.procyclingstats.com/race/liege-bastogne-liege/2025/result und https://www.domestiquecycling.com/en/cycling-races/liege-bastogne-liege/2025/race-results/
- Derzeit **keinen Typ-/Siegbonus und keine heimliche Streckenabhängigkeit** einführen. Falls die Quantifizierung vor Freeze wirklich nötig ist, der folgende saubere Kalibrierungsschritt ist, (1) tatsächliche Zielzeiten mit Gruppengleichzeit und unterschiedlich klassierten Fahrern zu vergleichen, (2) GPX-nähere reale Steigungsübergänge und typübergreifende realistische CP/W′/CdA-Daten zu nutzen, (3) gleiche Seeds zu testen. Ansonsten die Mittelwert-Abweichung als bekannte technische Limitation deklarieren.

## Nächste Gesamtentscheidung

- **PR #89:** Minifix ohne Nutzen. Verwerfen/Archiv lassen, nicht mergen.
- **PR #84:** Bleibt als technische Kohäsionsverbesserung gut belegt, aber Gesamtmerge erst nach Entscheidung über verbleibende vorrangige Sportziele. Die beiden hier betrachteten Warnsignale begründen aktuell **keinen zusätzlichen algorithmischen Fix auf Verdacht**.
- **MVP-Grobfunktion:** Felder, physische Attacken, echte Jagdenergie und physiologische Selektion funktionieren; Teamjagd ist auch über Minuten aktiv. Die wichtigsten verbleibenden Punkte sind die strikt windoffene Einzelhelfer-Position und die echte Rennenzeitkalibrierung. Nicht PR84 in `main` mergen, bevor die bewusste Übergabe von der vorläufigen Audit-Engine auf PR84 abgesprochen und CI-Linien konsolidiert sind. Für Etappenrennen CP/W′-State und Recovery später bewusst weiterreichen.
- Nur wenn große neue Fakten auftauchen weiter heuristisch umbauen; sonst Experiment als `engine-1.0-rc` mit klaren Grenzen abnehmen.

**Sicherung:** Dieser Bericht auf `develop/manager-mvp` dauerhaft gespeichert. Alle Diagnoselogs kurzfristig in CI, reproduzierbare Tools längerfristig in PR88/89. `main` und `develop/manager-mvp` in ihren Engines unverändert.
