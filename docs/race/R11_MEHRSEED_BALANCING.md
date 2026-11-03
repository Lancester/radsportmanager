# R-11 – mehrere Seeds und Fahrerprofile: Balancing-Diagnose

**Stand: 03.11.2026 – R-11-Diagnose wirklich ausgeführt: sieben unterschiedliche vollständige 30-Fahrer-/50-km-Rennen, GitHub-Actions-Lauf #41728617720 erfolgreich. Die Rennphysik blieb unverändert.**

## Anlass und Umfang

Nach dem erfolgreich verifizierten R-10-Baustein (198/198 Tests im zuletzt
dokumentierten erfolgreichen vollständigen Lauf) treten im fiktiven hügeligen
30-Fahrer-/50-km-Rennen noch bis zu 20–22 getrennte Abstandsgruppen auf.
Wir dürfen daraus weder realistische Ausreißerverläufe noch eine verlässliche
Qualität der Teamtaktik ableiten. Vor neuen Regelparametern muss sichtbar werden,
**ob dieses Verhalten bei anderen Tagesformen, Profilen und Fahrerqualitäten bleibt**.

R-11 ist daher zunächst **Mess- und Regressionstechnik**, keine neue Gruppenphysik.
Die bestehenden src/engine/race/peloton.ts, race-tactics.ts, race-simulator.ts,
motion-core.ts und critical-power.ts werden **nicht geändert**.

## Neue Dateien

- `src/engine/race/race-audit.ts`: berechnet aus einem echten Rennergebnis
  Zielzeitspreizung, Median-Zielrückstand, Maximal- und Median-Gruppenzahl,
  Größe der größten beobachteten Gruppe, Anteil isolierter Fahrer über die
  5-km-Snapshots, Verfolgungsstarts, Fluchten und echte Einholungen sowie
  mittlere Kurbelwatt. Die Auswertung verändert keine Rennzustände.
- `tests/r11-race-balance.test.mjs`: testet zwei deterministische Seeds
  (2026, 2027) auf je zwei Strecken (wellig, flach); kontrolliert die
  Gruppen-/Fahrerbilanz, echte gemessene Fluchtlücken, vollständige
  Klassifikation, Pedalleistung und Energiebilanz. Ein Taktikvergleich
  prüft die tatsächlich geänderte Zielzeit. Ein gezielt abgeschwächtes
  Helferprofil F03 prüft die Wirkung der CP-/FTP-/W′-Eingabedaten.
  Zusätzlich werden inkonsistente Gruppen und unberechtigte
  Einholmeldungen zurückgewiesen.
- `scripts/r11-balance-diagnostics.mjs`: sieben kurze vollständige
  50-km-Simulationen (zwei Seeds × drei Kombinationen aus Strecke/Leitlinie,
  plus ein expliziter Fahrerprofil-Vergleich). Ausgabe als `R11-LAUF`,
  `R11-TAKTIKVERGLEICH` und `R11-PROFILVERGLEICH` mit JSON-Daten.

## Ausführung

Automatische Kleinregression nach Zusammenführung in main über `npm test`.
Der bisherige GitHub-Pages-Build soll unverändert weiterlaufen.

Die zusätzliche Diagnose ist **absichtlich manuell** und nicht als große
automatische Monte-Carlo-Testreihe eingerichtet:

```sh
node --experimental-strip-types scripts/r11-balance-diagnostics.mjs
```

Sie ist nur als kurzer, reproduzierbarer Vergleich gedacht. Die 7 Läufe
sind keine ausreichende Stichprobe für empirische Aussagen. Laufzeiten
eines GitHub-Runners sind **keine** Android-Laufzeiten.

## Interpretation

- `maximumGroups` misst das Maximum aller Simulationsschritte;
  `medianSnapshotGroups` nur die stichprobenartigen 5-km-Zwischenstände.
  Beide sind **Abstandsklassen**, keine sicher identifizierten sportlichen
  Formationen.
- `singletonRiderShare` ist der Anteil einzeln klassifizierter Fahrer
  über alle erfassten aktiven Fahrer der 5-km-Snapshots, kein Strecken-
  oder Zeitanteil des Fahrers.
- Die gezielte Veränderung von F03 um −12 % bei CP, FTP und W′ ist ein
  **künstlicher Sensitivitätstest**, kein behaupteter Trainingseffekt.
- Das Script gibt relative Unterschiede aus, **ohne** Sieger, Zielzeiten
  oder Gruppenzahlen zu erzwingen.
- Es gibt **keine** willkürliche Maximalgruppenzahl als Bestanden-Kriterium.
  Vollständigkeit und Konsistenz sind testbar, Rennrealismus noch nicht.

## Abnahme und nächster fachlicher Schritt

**Historischer Planungsstand vor dem R-11-Test:** zusätzliche Metriken, mehrere fiktive Eingangsszenarien,
Regression gegen falsche Lückeneinholungen. **Damals noch zu prüfen:** echte
GitHub-Actions-Ausführung einschließlich aller alten Tests und tatsächlicher
mehrfacher Rennresultate. Ohne bestätigten Testlauf keine Erfolgszahlen
für R-11 nennen.

Nach Sichtung der Ausgabe gezielt prüfen, **warum** sich die 30 Fahrer so stark
aufteilen: fehlende Abstimmung von Helfern mit Kapitänen, dauerndes
Einzelfahrer-Nachsetzen, Schwächen der Direkt-Vordermann-Abstandsregelung,
Windschattenberechnung und CP/W′-Reserveverläufe. Daraus eine *kleine*
taktische Verbesserung mit Kontrollvergleich ableiten, nicht blind
Wattwerte oder Gruppen-Schwellen anpassen. **Issue #42 bleibt offen.**

**Keine Änderung am Nutzerbeschluss:** vollständige Rennen und glaubwürdige
autonome Taktik vor weiterer Kurven-, Reifen- oder Lenk-Mikrophysik.


## Verifizierte technische Abnahme

- [PR #47](https://github.com/Lancester/radsportmanager/pull/47) mit den vier
  R-11-Regressionstests ist auf main übernommen.
- [Pull-Request-Tests #41727050681](https://github.com/Lancester/radsportmanager/actions/runs/41727050681):
  **202 bestanden, 0 Fehler**, einschließlich aller R-11-Tests und
  Syntaxprüfung des Diagnoseskripts.
- [main-Workflow #41727203475](https://github.com/Lancester/radsportmanager/actions/runs/41727203475):
  **202 bestanden, 0 Fehler**, drei ursprüngliche 50-km-Rennproben,
  TypeScript-Browser-Build, ESM-Smoke-Test und GitHub Pages erfolgreich.

**Grenze der Bestätigung:** 202 erfolgreiche Tests beweisen keinen
realitätsnahen Pelotonablauf. Der neue siebenläufige Mehr-Seed-Diagnoselauf
wurde **anschließend** unter Actions #41728617720 ausgeführt. Die Resultate
stehen im folgenden Abschnitt. Die 20–24 Maximalgruppen der hügeligen
R-11-Referenzen bleiben ein zu untersuchender Befund.


## R-11: tatsächlich gemessene sieben vollständige Rennen (03.11.2026)

**Verifizierte Ausführung:** [GitHub Actions #41728617720](https://github.com/Lancester/radsportmanager/actions/runs/41728617720), erfolgreich, mit `node --experimental-strip-types scripts/r11-balance-diagnostics.mjs`. Der CI-Job hat **exakt sieben `R11-LAUF`-Zeilen**, zwei Taktikvergleiche und einen Fahrerprofilvergleich ausdrücklich nachgezählt. Alle sieben 50-km-Rennen endeten mit **30 klassifizierten Fahrern**; damit 210 Zielankünfte über diese sieben wiederholten Testfelder. Kein Smartphone-Benchmark. Die gemessenen Runner-Zeiten pro Rennen lagen hier bei rund 0,53–0,83 s und sind nicht auf Android übertragbar.

Ein vorangegangener Probelauf [#41728273878](https://github.com/Lancester/radsportmanager/actions/runs/41728273878) wiederholte das unveränderte 2026-Referenzrennen versehentlich doppelt: acht Simulationsdurchläufe für sieben *unterschiedliche* Fälle. Dieser reine Diagnoseskriptfehler ist in der nachfolgenden Revision behoben. Der verifizierte finale Lauf #41728617720 enthält wirklich sieben Rennen. Die temporären Einmal-Workflows wurden **nicht** als permanente CI auf main aufgenommen.

| Fiktiver Fall (50 km, 30 Fahrer) | Max. Gruppen | Median Gruppen* | Alleinfahreranteil* | Letzter Rückstand | Verfolgungsstarts |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hügelig, schützen, Seed 2026 | 20 | 14 | 14,8 % | 581,4 s | 36 |
| Hügelig, offensiv, Seed 2026 | 22 | 12 | 15,9 % | 504,6 s | 21 |
| Flach, Sprint, Seed 2026 | 12 | 10 | 11,1 % | 420,9 s | 64 |
| Hügelig, schützen, Seed 2027 | **24** | 13 | 14,1 % | 544,9 s | 31 |
| Hügelig, offensiv, Seed 2027 | 20 | 11 | 12,2 % | 517,4 s | 25 |
| Flach, Sprint, Seed 2027 | 12 | 9 | 6,3 % | 334,1 s | 74 |
| Hügelig, schützen, Seed 2026, Helfer F03 mit −12 % CP/FTP/W′ | 23 | 13 | 20,0 % | 634,6 s | 25 |

*Median-Gruppenzahl und Alleinfahreranteil sind aus den neun 5-km-Snapshots gebildet, nicht aus jedem Zeitschritt. `maximumGroups` beobachtet alle Schritte. Die Klassifikation beruht auf der technischen 42-m-Trennschwelle, nicht auf physisch nachgewiesenen Radgruppen.*

**Zusätzliche Vergleiche:** Offensiv statt Kapitän schützen spart F01 im gleichen Hügel-Seed 2026 **3,783 s**, im Seed 2027 **30,491 s**; der Sieger bleibt in beiden Fällen F13. Die isolierte Abschwächung von Helfer F03 um 12 % bei CP, FTP und W′ verlängert seine Zielzeit um **330,095 s**; maximale Gruppen **20→23**, beobachteter Alleinfahreranteil **14,8→20,0 %**, letzter Zielrückstand **581,4→634,6 s**. Das ist ein **künstlicher Sensitivitätstest**, kein empirischer physiologischer Effekt. Kein einzelner Gruppenwert beweist allein einen Defekt.

### Codeprüfung: Warum der Windschatten wahrscheinlich eine wichtige Modellschwäche ist

Im **aktiven 30-Fahrer-Rennmodell** `src/engine/race/peloton.ts` gibt `decidePackInstruction` jedem Fahrer nur den **direkten Vordermann** als Beobachtung. Der Luftwiderstand wird bei engem Abstand maximal mit `aeroFactor=0.81` multipliziert, also nur **19 % Reduktion des aerodynamischen Widerstands**, nicht 19 % weniger Gesamt-Kurbelwatt. Der Effekt fällt zwischen 3 und 36 m auf null ab. **Mehr Fahrer im gleichen Gruppenverband, Gruppendichte und geschützte Mittelfeldposition erhöhen den Windschatten nicht.** Eine zweiköpfige Reihe und ein Fahrer tief im dichten 30er-Peloton erhalten bei gleichem Abstand zum direkten Vordermann denselben Faktor. Die 42-m-Abstandsklasse ist lediglich Diagnostik, kein 42-m-Windschattenradius.

Die ältere isolierte R-03-Gruppen-Demofunktion `src/engine/physics/drafting-group.ts` summiert bei bis zu acht Fahrern zwar die Beiträge mehrerer Vordermänner (gedeckelt durch ein anderes, vorläufiges Modell), **wird aber im 30-Fahrer-Vollrennen nicht verwendet**. Dies entspricht der beschlossenen Trennung von Laborphysik und skalierender, vorläufiger Rennfeldabstraktion (D-074 bis D-077); es ist keine vergessene Integration.

**Wissenschaftlicher Kontext:** Blocken et al., *Aerodynamic drag in cycling pelotons: New insights by CFD simulation and wind tunnel testing*, Journal of Wind Engineering and Industrial Aerodynamics 179 (2018), DOI [10.1016/j.jweia.2018.06.011](https://doi.org/10.1016/j.jweia.2018.06.011). Die bei kleinen Reihenverbänden berichteten 50–70 % Rest-Luftwiderstand unterscheiden sich wesentlich von bis zu 5–10 % Rest-Luftwiderstand an besonders geschützten Positionen in sehr dichten **121er-Pelotons**. Diese Extremwerte **nicht** ungeprüft als Parameter für unser 30-Fahrer-Eindimensionalmodell verwenden; Aero-Drag ist nicht gesamte Pedalleistung. Insbesondere wird die reale seitliche Abschirmung hier noch nicht modelliert.

**Fachliche Einordnung:** Die geringe und nicht von Gruppengröße/Position abhängige Aero-Entlastung ist ein plausibler, durch Codelektüre belegter **Mitverursachungs-Kandidat** für die Fragmentierung. Die sieben unveränderten R-11-Vollrennen **isolieren diesen Effekt nicht kausal**; auch CP/W′-Deckel, Fahrerleistungsstreuung, autonome Entscheidungen und ein bloßer Direkt-Vordermann-Regler können beitragen. Die Testfälle reichen nicht aus, ein quantitatives Verursachungsgewicht festzulegen.

### Konkreter nächster Vergleich – vorgeschlagen, nicht beschlossen

1. **Getrennter, schaltbarer Aerodynamik-Prototyp**, keine Änderung des bestehenden R-10-Referenzlaufs: Für jedes dichte Fahrerumfeld lokalen Windschutz anhand der Abstände und Anzahl nahe positionierter Vorderleute sowie vorläufiger Gruppendichte/-position abschätzen; mit klaren Grenzen der fehlenden 2D-Geometrie. Insbesondere **nicht** einfach die 42-m-Diagnosegruppen als Windschattenformationen behandeln. Unterschied zwischen 2–3 Fahrern und einem dichten Feld abbilden.
2. **Isolierte Kontrollszenarien** bei gleicher Geschwindigkeit, Leistung und Strecke: Einzelfahrer, Zweier-/Dreierflucht, längere Reihe, enges Peloton; Vorder- und tief geschützte Position vergleichen. Wirkungen ausschließlich über `aeroFactor` im vorhandenen `advanceMotionStep`, mit CP/W′-Kern.
3. **A/B-Tests mit exakt denselben sieben R-11-Eingaben** und festem Seed; nicht nur Maximalgruppen, sondern Median/Singles, Fahrerwatt, W′-Verlauf, Attacken, echte Einholungen und Zielabstände betrachten. Vergleich vorab gegen Literaturkorridor plausibilisieren; keine automatisch zugesicherten Siege oder Gruppen.
4. **Erst danach** besseres Zusammenspiel von Helfern, Kapitänen, Tempoarbeit und Verfolgung getrennt untersuchen. Die Werte für Windschutz und die genaue Nähe-/Dichteabstraktion sind **offen** und dürfen ohne fachliche Prüfung nicht als empirisch kalibriert gekennzeichnet werden.

**Beschlusslage:** D-074 bis D-077 bleiben unverändert. Eine gruppen- und positionsabhängige Aero-Abstraktion ist hier eine **fachliche Empfehlung / zu prüfen**, keine stillschweigend getroffene Grundsatzentscheidung. Issue #42 bleibt offen. R-01–R-08, Renn-CP/W′, Bewegungsintegrator und Rennseite bleiben durch diesen Diagnoseschritt unverändert.
