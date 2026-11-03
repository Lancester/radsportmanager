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

**Status und Messergebnisse:** Die sieben R-13-Standardrennen und 213 Tests wurden tatsächlich auf GitHub Actions ausgeführt und bestanden; siehe nachfolgende Auswertung. Keine realen Profirenn-Ergebnisse behauptet.

**Offen in Issue #42:** Umsetzung sinnvoller autonomer Führung, Tempoarbeit, Mannschaftsrollen und Verfolgungsentscheidungen. Größere Abstände der abgehängten Fahrer sind hierfür **kein Fehlerkriterium**. Priorität bleibt Rennen und Spieltiefe, nicht neue Reifen-/Lenkphysik.


## Verifizierte Standardrennen mit korrigierten Gleichauf-Fahrern

[PR-Tests #41734021919](https://github.com/Lancester/radsportmanager/actions/runs/41734021919):
**213/213 Tests bestanden, 0 Fehler**, inklusive sieben neuer
vollständiger 50-km-Standardrennen mit je 30 klassifizierten Fahrern
(210 modellierte Zielankünfte). Die neuen Gruppenwerte unterscheiden
sich teils geringfügig von R-12, weil die ID-bedingten Scheinaerovorteile
bei identischen Positionen entfernt wurden.

| Rennfall | Max. 42-m-Abstandsgruppen | Median Gruppen bei 5-km-Snapshots | Median-Zielrückstand | Rückstand des Letzten | Mittlerer Aero-Faktor |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hügelig geschützt, Seed 2026 | 22 | 12 | 180,7 s | 604,6 s | 0,780 |
| Hügelig offensiv, Seed 2026 | 20 | 11 | 239,1 s | 712,1 s | 0,773 |
| Flach Sprint, Seed 2026 | **3** | **3** | **0,8 s** | 688,5 s | 0,502 |
| Hügelig geschützt, Seed 2027 | 20 | 10 | 237,6 s | 631,3 s | 0,786 |
| Hügelig offensiv, Seed 2027 | 25 | 9 | 231,8 s | 696,5 s | 0,738 |
| Flach Sprint, Seed 2027 | **4** | **3** | **1,5 s** | 938,6 s | 0,495 |
| Hügelig geschützt, F03 -12 % CP/FTP/W′, 2026 | 20 | 12 | 257,3 s | 707,2 s | 0,790 |

**Fachliche Beurteilung:** Die Flachrennen zeigen das gewünschte
dichte Hauptfeld mit teils sehr knapp zusammenliegenden Fahrern.
Dass ein isolierter Fahrer bis zu rund 11–16 Minuten verlieren kann,
ist **ausdrücklich erlaubt**. Dabei ist weder die genaue Höhe des
Rückstands als realistischer Profi-Rennwert bestätigt noch eine
künstliche Zeitangleichung eingebaut.

**Technischer Sicherheitsnachweis:** Die sieben Fälle werden auf
vollständige Zielklassifikation, Energiereste,
nichtnegative W′-Reserven, echte Flucht-/Einholungsabstände sowie
den aktiven Luftwiderstandsfaktor geprüft. Der explizite
`legacy`-Pfad reproduziert weiter die bisherige flache
30-Fahrer-Sprintreferenz (12 Maximalgruppen).
`'formation'`, ohne Modellangabe und historisches
`'formation-experiment'` liefern bei gleichem Seed
bitidentische Rennergebnisse.

**Schlussfolgerung für die Entwicklung:** R-13 ist damit eine
bewusst getroffene, technisch erfolgreiche *Spielmechanik-
Freigabe*, keine messwissenschaftliche Kalibrierung.
Ein nächster eigenständiger Schritt kann reale Führung,
Teamzusammenarbeit und Verfolgung behandeln, ohne die
natürlichen Unterschiede zwischen geschütztem Feld und
isolierten Fahrern künstlich zu verkleinern.
