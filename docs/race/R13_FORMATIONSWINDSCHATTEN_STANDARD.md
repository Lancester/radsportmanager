# R-13 – Formationswindschatten im regulären Rennen

**Entscheidung des Nutzers vom 03.11.2026:** Der mehrfahrer- und positionsabhängige Windschatten aus R-12 wird nach dem durchgeführten A/B-Vergleich jetzt **aktiv als Standard** eingesetzt. Der gegenüber einem dicht fahrenden Feld deutlich wachsende Rückstand eines abgehängten Einzelfahrers ist physikalisch und sportlich plausibel und **kein** Grund, das Feld mit unsichtbaren Hilfen zusammenzuhalten.

## Umsetzung

- `RaceInput.aeroModel` ist optional. **Ohne Angabe = Formationswindschatten**; `'formation'` wählt ihn ausdrücklich. Die bereits in R-12 getestete Zeichenfolge `'formation-experiment'` bleibt als **gleichwertiger Alias** verfügbar.
- `'legacy'` ist nur noch der bewusste Rückfall-/Vergleichsmodus. Damit bleiben die veröffentlichten R-10-/R-11-Werte mit identischem Seed reproduzierbar, aber der normale Rennbetrieb verwendet den neuen Schutz.
- `formation-aero.ts` gewichtet mehrere nahe vorausfahrende Fahrer innerhalb der lokalen 24-m-Nachbarschaft (bis zu zehn **wirklich** vorausliegende Fahrer) und deckelt den verbleibenden Luftwiderstand bei 0,40. Kleiner 2er-/3er-Trupp und tiefe Position in dichter Formation haben verschiedene Aero-Faktoren. **Weder 24 m noch die 42-m-Abstandsklassen sind eine feste Gruppe.**
- Korrektur aus der Testabnahme: Fahrer auf **identischer** Längskoordinate dürfen nicht nur wegen der sortierten ID als vorne liegend gezählt werden; solche Gleichauf-Fahrer verbrauchen auch das Limit der zehn tatsächlichen Vorderleute nicht. Wichtig am gemeinsam gestarteten Feld.
- Ein einzelner Fahrer ohne tatsächlich nahe Vorderleute erhält Faktor 1 und keinen fiktiven Gruppenschutz. Wenn die Feldgruppe bei gleicher Motorleistung weniger Luftwiderstand hat, wächst der Abstand auf natürliche Weise. Kein Zwangswiederanschluss, kein Tempo-, Watt-, Positions- oder Zeitbonus.
- `src/engine/physics/motion-core.ts`, `src/engine/physiology/critical-power.ts`, Bremsen, Strecken und Teamstrategie bleiben unverändert. `advanceMotionStep` erhält weiterhin ausschließlich den Aero-Faktor, Kurbelwatt wird weiterhin über CP/W′ begrenzt. **Es wird keine alte Arbeit aus R-01–R-08 verworfen.**
- Die Browser-Rennseite erklärt die neue Default-Regel ohne zusätzlichen Schalter und nutzt sie beim Start des nächsten Rennens.

## Fachliche Grenzen – keine Sperre für das Spiel

Die bekannte [R-12-Vergleichsreihe](R12_FORMATIONSAERODYNAMIK.md) zeigte unter gleichen 30-Fahrer-/50-km-Eingaben mehr Schutz im Feld, weniger Luft-/Pedalleistungsbedarf und teilweise größere Rückstände der Schwächsten. **Diese größeren Rückstände werden nicht mehr automatisch als Fehlverhalten bewertet**: Ein isolierter Fahrer kann gegen das aerodynamisch geschützte Peloton stark Zeit verlieren. Der Nutzer möchte die Variante mit diesen Spielmechaniken verwenden, ohne auf eine vollständige wissenschaftliche Kalibrierung zu warten.

Die technischen Parameter sind weiterhin vereinfachte, nicht empirisch exakt bestätigte 30-Fahrer-1D-Formelwerte. Das bedeutet *nicht*, dass das Programm vor dem Weiterspielen gesperrt wird. Ein Peloton hat tatsächlich mehrere Fahrer nebeneinander; die vorliegende Simulation kennt nur die Längskoordinate. Auch Windrichtung, Querdichte, ausgearbeitete Führungswechsel und echte Teamkommunikation sind noch nicht berücksichtigt. Diese Aspekte werden bei Bedarf als **neue Funktionstiefe** entwickelt, nicht als pauschale Reduktion aller Zielrückstände. R-01–R-08 werden nicht durch ein komplettes 2D-Feld ersetzt.

## Reproduzierbare Abnahme

- R-12-Referenz bleibt mit `aeroModel='legacy'` verfügbar; das R-12-Skript kann auch weiterhin die ursprünglichen sieben alten Fälle gegen die historische Formationsvariante vergleichen.
- `tests/r12-formation-aero.test.mjs`: neues Defaultmodell identisch mit explizitem `'formation'` und historischem Alias, explizites Legacy reproduziert die ursprüngliche Sprintreferenz, kein Phantomvordermann bei Gleichstand, kein Windschatten für weit zurückgefallene Einzelfahrer.
- `tests/r13-default-races.test.mjs`: **sieben vollständige 50-km-Rennen** mit unverändertem Standardparameter, zwei Seeds × drei Team-/Streckenfälle und einem bewusst um 12 % geschwächten Helfer F03. Für alle 210 Zielankünfte werden Ranglisten, Gruppen, CP-/W′-Reserve, negative Energiereste und korrekte Flucht-/Einholmeldungen geprüft.
- Haupt-CI: `npm test`, TypeScript-Browser-Build, ESM-Smoke-Test und GitHub Pages. Nur Ergebnisse nach tatsächlich bestätigtem Job als erfolgreich beschreiben.

**Status und Messergebnisse:** Die folgenden Testresultate und die finalen GitHub-Actions-Links werden nach bestätigter Ausführung dokumentiert. Keine realen Profirenn-Ergebnisse behauptet.

**Offen in Issue #42:** Umsetzung sinnvoller autonomer Führung, Tempoarbeit, Mannschaftsrollen und Verfolgungsentscheidungen. Größere Abstände der abgehängten Fahrer sind hierfür **kein Fehlerkriterium**. Priorität bleibt Rennen und Spieltiefe, nicht neue Reifen-/Lenkphysik.
