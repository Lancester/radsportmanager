# R-22: Favoriten vor dem Start bestimmen, anschließend Zielplätze prüfen

**Nutzerwunsch vom 04.11.2026:** Bei jedem ohnehin simulierten Referenzrennen soll erkennbar sein, ob die **physisch stärksten Fahrer ihres jeweiligen Profils** vorne landen. Beispiel: Wer ist vor dem Start nach seinen Werten der beste Kletterer, welchen Zielrang fährt er, wie weit ist er zurück? Dasselbe für Klassikerfahrer, Sprinter, Zeitfahrer und Allrounder. Das soll bei jeder folgenden KI-Iteration automatisch sichtbar sein.

## Methodik: keine nachträgliche Auswahl des Siegers

`src/engine/race/rider-strength-audit.ts` nutzt ausschließlich die **vor dem Start bestehenden** fiktiven Fahrerprofile (CP, W′, Masse, CdA und Sprintfähigkeit), niemals Zielplätze oder gefahrene Rennzeit, um die Rangliste zu berechnen. Erst *danach* werden die vorhandenen Ergebnisse zur Rangliste hinzugefügt. Die Favoritenberechnung **greift nicht in Renn-KI, Physik, Leistung, Position oder Zeitnahme ein**.

Für die Beurteilung werden bewusst **zwei Perspektiven** unterschieden:

1. **Stärkster Fahrer innerhalb jeder der fünf Kategorien**: Fahrer-ID, Typ, Rolle, gemessene Basis-CP und W/kg, Kategorie-Index, vorläufiger Stärkerang 1, tatsächlicher Zielrang und Rückstand. Zusätzlich die **Top 3** je Kategorie und deren mittlerer Zielrang bzw. wie viele davon insgesamt Top 10 erreichen.
2. **Profilspezifischer Gesamtfavorit aus ALLEN 154 Fahrern**, nicht nur aus der namensgleichen Kategorie: Auf einer Bergetappe kann beispielsweise ein sehr leichter Klassementfahrer der physisch beste Bergfahrer sein, auch wenn er ursprünglich nicht als `kletterer` eingeordnet wäre. Die Plätze der Top 3 und der Stärkerang des tatsächlich siegreichen Fahrers werden unabhängig beurteilt.

### Die fünf transparenten Fähigkeitsproxies

| Fahrerprofil | Gemessener Vorabindex | Warum nicht einfach die höchsten Watt? |
| --- | --- | --- |
| **Berg/Kletterer** | Berechnetes Solo-Tempo bei **8 % Steigung** und individueller Basis-CP, mit eigener Masse und CdA | Hohe absolute Watt allein benachteiligen leichte Kletterer |
| **Klassiker/Puncheur** | Vereinfachte verfügbare 3-Minuten-Leistung `(CP + W′ / 180 s) / (Fahrer- und Radmasse)` | Kurze harte Anstiege brauchen mehrminütige W/kg, nicht nur Endspurt-Watt |
| **Sprinter** | Dieselbe CP-/Sprintfähigkeitsabhängige **maximale Wattanforderung für den Zielsprint**, die die aktuelle Einzelrenn-KI kennt | Das misst eine modellierte Sprintfähigkeit, nicht garantiert den Sieg bei guter Position |
| **Zeitfahrer** | Solo-Flachtempo bei Basis-CP mit eigenem CdA | Aerodynamische Effizienz entscheidet mit |
| **Allrounder** | Gleichgewicht aus normiertem 0-%-Flachsolo- und 8-%-Bergsolo-Tempo | Erfordert eine transparente Kombination beider Stärken |

**Wichtig:** Das sind **diagnostische Leistungsindikatoren**, keine extern kalibrierten historischen Siegwahrscheinlichkeiten. Sie berücksichtigen nicht die konkrete Tagesform (±2 %), langfristige R-19-Ermüdung, taktische Position, Windschatten, Streckenverlauf über Stunden, Mannschaftsstärke, Stürze oder eine explizite Fähigkeit für wiederholte kurze Belastungen. Die Spielengine kann aufgrund dieser Einflüsse zu Recht andere Sieger hervorbringen. Ein scheinbar enttäuschender Stärkerang ist ein **Hinweis zur Diagnose**, kein automatisch fehlerhaftes Rennen.

## Neuer Ausgabeumfang – kein zusätzliches Rennen

Die bereits vorhandene kleine Profilprobe `scripts/r22-profile-smoke.mjs` schreibt pro vorhandener Etappe zusätzlich genau **einen** Datensatz `R22-FAVORITES` in die GitHub-Actions-Logs. Dessen Felder enthalten:

- `profileFavorite`, `profileTopThree`: 1./2./3. Gesamtfavorit für das passende Streckenmerkmal mit Stärkeindex, tatsächlichem Zielrang und Rückstand;
- `perCategory`: alle fünf Fahrertypen inklusive stärkstem Modellfahrer, Top 3, Zielplatzierung, Rückstand und Indexdefinition;
- `winnerProfileStrengthRank`: auf welchem *Vorfeld-Leistungsrang* der spätere Sieger vor Rennbeginn nach diesem vereinfachten Index lag;
- `topTenProfileStrengthPositions`: für die tatsächliche Top 10 ihre Vorab-Leistungsränge.

Die **einzigen** vollständigen Rennläufe bleiben Lille, Boulogne, Lüttich und Hautacam mit Seed 2026, je 154 fiktive Fahrer. Kein zweites Feld, kein größerer Seed-Horizont, keine Monte-Carlo-Serie.

## Wie wir den neuen Indikator für die KI-Entwicklung nutzen

- **Berg:** Liegen die stärksten 8-%-Kletterer erwartungsgemäß im vorderen Teil der Bergankunft? Falls nicht: Position, Tempo, W′, Ermüdung und Gegenjagd prüfen, statt den Favoriten künstlich auf Rang 1 zu setzen.
- **Klassiker:** Können die Besten nach 220 km Kraft sparen und mit ihrem vorhandenen 3-Minuten-Leistungspotenzial an den richtigen Rampen attackieren? Wer erreicht die entscheidende Rampe überhaupt in der Spitzengruppe?
- **Flach:** Haben nominell starke Sprinter eine reale Siegchance und kann ihr Team sie vorne platzieren? Es kann auch ein Allrounder oder Ausreißer gewinnen.
- **Hügelig:** Kommen die stärkeren Puncheure/Klassikerfahrer gut durch die kurzen Steigungen; nicht jeder muss die Gesamtwertung gewinnen.
- **Zeitfahrer/Allrounder:** Ihre Einzelleistung wird ebenfalls in allen vier Referenzrennen beobachtet – auch wenn diese Rennen keine Einzelzeitfahren sind.

**Abnahmeprinzip:** Vorab-Leistungsindikatoren sollen mit größerer Stichprobe tendenziell mit Rennleistung zusammenhängen. Sie sind **keine** festen Soll-Ränge für einen einzelnen Seed. Größere statistische Validierung bleibt wie vereinbart **erst am Ende** und bewusst manuell.

### Quellverweise und Tests

- `src/engine/race/rider-strength-audit.ts` – reine, nebenwirkungsfreie Favoritenberechnung;
- `scripts/r22-profile-smoke.mjs` – pro vorhandener Runde ein `R22-FAVORITES`-Datensatz;
- `tests/r22-rider-strength-audit.test.mjs` – Vorab-Rang unabhängig von gewählten Zielergebnissen, Berggewicht, 3-Minuten-W′-Leistung, allen vier Streckenprofilen und fehlerhaften Daten;
- `tests/r22-profile-smoke.test.mjs` – prüft die neuen Protokolle in allen vier ohnehin vorhandenen 154-Fahrer-Rennen.

Die KI-Gesamtübersicht unter [RENNFAHR_KI_GESAMTUEBERSICHT.md](RENNFAHR_KI_GESAMTUEBERSICHT.md) wird von dieser Diagnose ergänzt, nicht ersetzt. `legacy` bleibt Default; `stable-pack` bleibt experimentell und R-22 offen.
