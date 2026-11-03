# R-11 – mehrere Seeds und Fahrerprofile: Balancing-Diagnose

**Stand: 03.11.2026 – Implementierung im Arbeitsbranch, GitHub-Actions-Abnahme ausstehend.**

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

**Erledigt im Branch:** zusätzliche Metriken, mehrere fiktive Eingangsszenarien,
Regression gegen falsche Lückeneinholungen. **Noch zu prüfen:** echte
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
