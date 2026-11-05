# R-24: erste individuelle Ermüdungskalibrierung

Stand 05.11.2026, Entwicklungsbranch. Erste Spiel-/Simulationskalibrierung; kein validiertes oder individuelles physiologisches Messmodell. Sie erweitert den bestehenden CP/W′- und R-19-Kern und implementiert noch kein Karrieretraining.

## Individuelle Eigenschaften

`RaceRider` akzeptiert zwei optionale, voneinander unabhängige Werte:

- `durabilityFactor`: relative Widerstandsfähigkeit gegen langfristigen Verlust verfügbarer Leistung. 1 ist der vorläufige Referenzwert, mehr bedeutet bei sonst gleichem Zustand weniger Verluste. Der skalierte Verlust verändert sowohl effektive CP als auch Peak; eine empirisch gesonderte Reaktion ist noch nicht modelliert.
- `wPrimeRecoveryFactor`: relative Geschwindigkeit der W′-Wiederherstellung bei Leistung unter effektiver CP. 1 entspricht dem bisherigen Faktor 0,22; größere Werte erholen W′ unter vergleichbaren Umständen schneller. Das ist kurzfristige Reserveerholung, nicht das gesamte medizinische Regenerationsvermögen, keine automatische vollständige Erholung und keine Veränderung des W′-Gesamtspeichers oder der CP.

Beide Felder erlauben 0,7–1,3, Standard bei fehlendem Feld 1; sie gelten im experimentellen `stable-pack`. Die fiktiven Referenzfelder erhalten deterministisch verteilte Werte 0,85–1,15, unabhängig voneinander und vom Fahrertyp. Diese Verteilung ist eine Testannahme, kein aus Daten geschätztes Populationsmodell und keine Eigenschaft realer Fahrer. Die Attribute können später durch Talent, Alter oder Training verändert werden; diese Karrierefunktionen sind nicht implementiert und ihre Trainierbarkeit wird nicht vorausgesetzt.

## Erste Größenordnung der Langzeitermüdung

Im `stable-pack` wird der bisherige kombinierte R-19-Verlustterm mit `0,40 / durabilityFactor` skaliert und weiterhin bei maximal 40 % begrenzt. Der Faktor 0,40 ist ein ausdrücklich vorläufiger **Kalibrier-Startwert**, nicht direkt aus einer Studie abgeleitet. Anlass ist, dass das bisherige synthetische Dauerszenario einen sehr großen Verlust erzeugte. Individuelle Vergleichsstudien stützen Variabilität und unterschiedliche Belastungsreaktionen, aber erlauben keine Gleichsetzung verschiedener Protokolle oder direkte Bestimmung dieses Wertes. Die vorhandene KH-Bilanz und die 90-min-Einblendung bleiben bestehen; historische Gruppenmodelle behalten den bisherigen Verlust und die ursprüngliche Erholungsrate.

Kontrollbeispiel: CP 400 W, W′ 30 kJ, konstante Anforderung 300 W, 90 g/h Zufuhr, 6 h. Alle drei synthetischen Fahrer fahren im Modell über die 6 h 6480 kJ Kurbelarbeit; Unterschiede beim wirklichen Rennen können wiederum die Belastung verändern. Nach 4 h liegt die Verfügbarkeit bei `durabilityFactor` 0,85 / 1 / 1,15 bei 91,7 / 92,9 / 93,8 %; nach 6 h bei 84,9 / 87,2 / 88,9 %. Der simulierte KH-Speicher ist dann leer; alternative Substrate werden nur vereinfacht abgebildet. Das ist keine Laborvalidierung und nicht direkt mit dem in Schritt 4 dokumentierten 6-h-Rennprotokoll vergleichbar. Vorher errechnete der alte Referenzfaktor in diesem Beispiel 68 % nach 6 h.

W′-Gegenprobe: Startdefizit 30 kJ, CP 400 W und konstante Erholung bei 200 W. Bei `wPrimeRecoveryFactor` 0,85 / 1 / 1,15 ist der lineare Speicher nach 803 / 682 / 593 s rechnerisch voll. Diese exakte Vollerholung ist eine Eigenschaft des aktuellen linearen Modells; reale Erholung ist individuell und nicht vollständig so belegt. Die zwei Faktoren erlauben unterschiedliche Kombinationen: Ein Fahrer muss nicht in beiden Eigenschaften stark sein. In einem zusätzlichen 30-km-Rennen mit identischem Feld wurde der Erholungsfaktor aller Fahrer von 0,7 auf 1,3 geändert; die über alle Fahrer aufsummierte rekuperierte W′-Energie betrug 516,96 bzw. 520,33 kJ. Das belegt, dass die Eigenschaft tatsächlich in der Rennsimulation ankommt; der Unterschied ist kein isolierter empirischer Messwert, da Rennverläufe und Speicherfüllstände ebenfalls wirken.

## Studien und Aussagegrenzen

- [Klaris et al. 2024, 12 nationale Elitefahrer](https://pubmed.ncbi.nlm.nih.gov/39011951/): 6-h-Test mit individueller Streuung und unterschiedlichen Entwicklungen bei Sprint und 5-km-Zeitfahren. Die Studienbedingungen sind nicht identisch zu unserem konstanten 300-W-Kontrollfall.
- [Chorley et al. 2023, zehn trainierte Radfahrer](https://pubmed.ncbi.nlm.nih.gov/37470470/): W′-Wiederherstellung hängt von Erholungsleistung und -dauer ab; die Autoren untersuchen individuelle Modellanpassung. Daraus folgen keine direkt messbaren Werte für fiktive Fahrer.
- [Feldstudie mit Profiradfahrern](https://pubmed.ncbi.nlm.nih.gov/36521188/): individuelle Streuung der Leistung nach längerer Vorbelastung. Eine solche Eigenschaft erscheint als Managerkonzept sinnvoll; die tatsächlichen Verteilungen und Trainingseffekte bedürfen eigener Validierung. Keine Aussage über persönliche Leistungswerte realer Fahrer.

## Prüfung und offener Stand

16 gezielte Tests zu R-19, CP/W′, Unabhängigkeit der Faktoren, reproduzierbaren fiktiven Attributen und Eingabegrenzen bestanden. Der vollständige lokale Testlauf bestand mit **374/374**; der anschließend ergänzte Integrationstest zu fahrerspezifischer W′-Erholung bestand zusätzlich (4/4 in der gezielten Datei). Der Browser-Build und ESM-Import bestanden. Der [GitHub-PR-Lauf #302](https://github.com/Lancester/radsportmanager/actions/runs/42028147839) lief beim letzten Abruf noch. Die große Gegenüberstellung mit `main` ist der vereinbarte nächste Schritt, nicht aus diesem einen Szenario abzuleiten. Parameter, Interaktionen mit Wetter, Ernährung, Renn-KI und mögliche getrennte Ermüdung von CP, Sprint und W′ bleiben kritisch zu prüfen.

## Erste vier Rennen: vorheriger Branchstand gegenüber Kalibrierung

Ein Seed 2026, 154 fiktive Fahrer und Teams aus dem Flachfeld, auf allen vier Strecken gleich. Gegenüberstellung zum unmittelbar vorherigen Entwicklungsstand, **nicht** zum `main`. Alle physischen Fahrerwerte und Bedingungen sind gleich; zusätzlich eingeführte Fahrerfaktoren und der globale 0,40-Startwert verändern die Ermüdung. Die 0,85–1,15-Verteilungen sind fiktive, deterministische Testdaten. Mittel ist hier der Medianrückstand, keine Sollvorgabe.

| Profil | Sieger vorher → kalibriert | Median vorher → kalibriert | innerhalb 60 s vorher → kalibriert |
| --- | --- | ---: | ---: |
| Lille | F009 Sprinter → F009 Sprinter | 29,0 → 21,0 s | 137 → 132 |
| Boulogne | F036 Klassiker → F110 Zeitfahrer | 73,7 → 81,8 s | 67 → 22 |
| Liège | F099 Kletterer → F134 Kletterer | 908,3 → 648,4 s | 1 → 14 |
| Hautacam | F134 Kletterer → F134 Kletterer | 600,2 → 828,6 s | 2 → 1 |

Die Rennverläufe ändern sich deutlich; dies zeigt die Wirkung der Kalibrierung, belegt aber keinen allgemeinen Realismusgewinn. In Boulogne attackierte der siegreiche F110 bei seiner Position km 179,15 und lag bei den Momentaufnahmen der Rennspitze km 190 und 205 allein vorn; zweiter Fahrer +38,49 s. Eine Attacke und zwei Punktmessungen beweisen weder ein dauerhaftes Solo über jede Sekunde noch taktische Plausibilität; wie Verfolger, Tempo und Ermüdung dazu beitragen, bleibt im großen Vergleich zu prüfen. Ein Zeitfahrer kann ein Hügelrennen gewinnen, darf aber nicht über ein starres Wunschergebnis bevorzugt werden. Keine Sprinter in den Berg-Top-10 in diesem einen Lauf, keine Häufigkeitsaussage.

[Sieger-Rennverlauf](r24-kalibrierung-daten/boulogne-sieger-2026.json), [Kontrollwerte](r24-kalibrierung-daten/sensitivitaet.jsonl), [Vergleichsdaten](r24-kalibrierung-daten/). Der große Mehrseed-Vergleich mit `main` bleibt als separater Schritt ausdrücklich offen.
