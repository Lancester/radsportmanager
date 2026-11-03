# Tests, Realismus, Kalibrierung und Performance

**Status:** Teststrategie, noch keine Messdaten.

## Warum testen?

Realistisch wirkende einzelne Siege reichen nicht aus. Das Modell muss über viele Rennen plausible Leistungsunterschiede, Etappenarten, Zeitabstände, Gruppendynamiken und Ausreißerchancen erzeugen. Sportliche Entscheidungen müssen einen messbaren, erklärbaren Effekt haben.

## Teststufen

1. **Unit-Tests:** Physikformeln, Leistungsgrenzen, Energiebuchhaltung, Seed-Generator, Eingabevalidierung und Berichtsdaten.
2. **Integrationstests:** Mehrere Fahrer und Teams interagieren, Gruppen splitten, das Ziel wird korrekt erreicht, keine Zeit-/Energiefehler.
3. **Deterministische Regressionstests:** Fester Seed + fester Input ergibt dasselbe Ergebnis; Codeänderungen mit Goldens prüfen.
4. **Monte-Carlo-Reihen:** Identisches Szenario mit verschiedenen Seeds 100, 1.000, 10.000 oder mehr Male rechnen, statistische Verteilungen analysieren.
5. **Realitätsvergleich:** Plausibilitätskriterien und – soweit rechtlich nutzbar – echte Renndaten. Parameter nicht blind auf gewünschte Sieger optimieren.
6. **Android-Benchmark:** Laufzeit, Speicherbedarf, UI-Reaktionsfähigkeit, Akkubelastung und Verhalten bei Unterbrechung.

## Beispiele für statistische Kennzahlen

- Sieganteile nach Leistungsprofil und Streckentyp.
- Top-10-Häufigkeit, Zeitabstände, Ausreißererfolge, Sprint-/Bergplatzierungen.
- Korrelation sportlicher Leistung und Platzierung unter vergleichbaren Bedingungen.
- Auswirkung von Taktik, Teamstärke, Windschatten, Versorgung und Ermüdung.
- Anzahl unrealistischer Zustände (negative Energie, unphysikalische Geschwindigkeit, unerreichbares Ziel).
- Rechenzeit pro Rennen und Skalierung von 20 bis 160+ Fahrern.

## Gegenproben

Nur eine Variable verändern und bei sonst identischen Seeds vergleichen:
- Mehr Leistungsvermögen sollte statistisch helfen, aber keinen Sieg garantieren.
- Stärkere Steigung soll passende Fahrer begünstigen.
- Geschützter Fahrer soll im plausiblen Kontext Energie sparen.
- Höherer Ermüdungszustand soll Leistung begrenzen.
- Fehlerhafte Taktik soll unter plausiblen Bedingungen messbar schaden.

## Testgrößen – vorläufig

| Stufe | Rennen | Ausführung |
| --- | ---: | --- |
| Schneller Check | 10–100 | Automatisch bei PR, nur wenige Tests |
| Größere Regression | ~1.000 | Gezielte Entwicklungsläufe |
| Monte Carlo | 10.000–100.000 | Manuell, mit Laufzeitlimit |

Die tatsächlichen Mengen erst nach Benchmarks definieren. Keine unbegrenzte Dauerlast auf GitHub Actions.

## Ergebnisbericht

Ein automatischer Testbericht soll Testversion, Seed-Bereich, Code-Commit, Szenario, Anzahl Rennen, Kennzahlen, Konfidenz/Unsicherheit, Ausreißer und offene Probleme enthalten. **Beispielzahlen sind nie Messwerte.**

## Abnahmeprinzip

Ein Rennen darf überraschend ausgehen. Entscheidend ist, dass die Engine plausible Ursachen dafür kennt und die langfristigen Verteilungen realistisch sind. Die Teststrategie selbst wird nach ersten Experimenten weiterentwickelt.


## Konkrete Testszenarien und Messkriterien

Siehe **[REFERENZSZENARIEN.md](REFERENZSZENARIEN.md)**, Abschnitte 3 bis 5, für:
- die acht Testfälle **R-01 bis R-08** mit Beispielparametern;
- reproduzierbare Vergleichsbedingungen (feste Eingaben, Seed und Engine-Version);
- qualitative, physikalisch begründete Erwartungen ohne erfundene Siegerquoten;
- die übergreifenden Anforderungen **A-01 bis A-12**;
- den Unterschied zwischen **dokumentierten Testfällen** und tatsächlich **bestandenen Tests**.

**Reihenfolge:** Zuerst R-01 (Ebene) und R-02 (Berg) mit deterministischer Physik; später R-04 (Ermüdung), R-03 (Windschatten) und R-05/R-06 (Renn-KI). Diese Reihenfolge ist vorläufig und wird gemeinsam abgestimmt.

**Noch keine Messdaten:** Monte-Carlo-Testzahlen, Benchmarkzeiten und statistische Verteilungen sind weiterhin offen.


## R-01 – erste tatsächlich ausgeführte Referenztests (03.11.2026)

In [physik/R01_EBENE.md](physik/R01_EBENE.md) ist die stationäre 20-km-Ebenenrechnung beschrieben. Die kleinen TypeScript-Tests in `tests/r01-flat.test.mjs` wurden **lokal unter Node.js 22.16 ausgeführt: 7 von 7 bestanden**. Die numerischen Erwartungswerte stammen aus einer unabhängig ausgeführten Python/SciPy-Brent-Lösung. Die Prüfung umfasst 250/300 W, Luft-/Rollleistung, Wirkungsgrad, CdA- und Massengegenproben, Determinismus und ungültige Eingaben.

**Nicht behauptet:** Validierung gegen reale Rennleistungsdaten; tatsächliche Leistungsmessung; Android-Benchmark; Gruppen-, Ermüdungs- oder Monte-Carlo-Prüfung. Keine Actions-Minuten benötigt.

## R-02 – stationäre Bergreferenzen und Regressionstests (03.11.2026)

Die gemeinsame Physikfunktion wurde mit **16 lokalen Node.js-Tests** geprüft: **7 R-01** + **9 R-02**, alle bestanden. Referenzwerte für R-02 wurden mit Python/SciPy-Brent unabhängig vom TypeScript-Solver berechnet.

Neue Prüfpunkte: 60/80-kg-Vergleich bei gleichen 300 Pedal-W, 7-%-Geometrie und Höhenenergie, Einzelleistungsbilanz (Luft + Rollen + Schwerkraft = Hinterrad), monotone Steigungen, Abgleich bei 0 % mit R-01, getrennte Ausrüstungsparameter CdA/Masse, Reproduzierbarkeit und ungültige Eingaben.

Ausführliche Werte: [physik/R02_BERG.md](physik/R02_BERG.md). Es wurden weder ein realer Profi-Radfahrer noch Wind, Beschleunigung, Peloton oder eine Monte-Carlo-Simulation kalibriert. Testzeit lokal unter 1 s; **keine** Actions-Läufe erforderlich.

## Dynamische Route – lokaler Teststand (03.11.2026)

15 neue dynamische Node.js-Tests bestanden. Die unveränderten 16 früheren R-01/R-02-Tests wurden dabei nicht erneut ausgeführt. Prüfungen: Übergänge exakt am Abschnittsende, ununterbrochene Geschwindigkeit, Verhalten auf Ebene/Berg/Abfahrt, manuelle Bremsung, mechanische Arbeits-/Höhenbilanz, Start aus dem Stillstand, eindeutige Reproduzierbarkeit und Zeitauflösungs-Konvergenz. Referenzbeispiel: 4 km, **470,8713 s**, Höhendifferenz 0 m.

Dokumentation: [physik/DYNAMISCHE_STRECKE.md](physik/DYNAMISCHE_STRECKE.md). Neue Testdatei: tests/dynamic-route.test.mjs, mit npm run test:route oder in der gesamten npm-test-Suite ausführbar. Keine GitHub-Actions-Durchläufe und noch kein Android-Benchmark.
