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
