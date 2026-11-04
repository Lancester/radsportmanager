# R-22: Verbindlicher Validierungs- und Verbesserungsfahrplan ab stable-pack

**Vereinbart am 04.11.2026.** Schwerpunkt dieser Phase ist die **Renn-KI**, nicht ein neuer Physikkern oder bereits der Karrieremodus. Diese Datei gilt zusammen mit
[START_HIER.md](../START_HIER.md), [ENTWICKLUNGSSTAND.md](../ENTWICKLUNGSSTAND.md)
und [ENTSCHEIDUNGEN.md](../ENTSCHEIDUNGEN.md).

## 1. Beschlossene Entwicklungsrichtung

Wir entwickeln die in [PR #63](https://github.com/Lancester/radsportmanager/pull/63)
ergänzte `groupRidingModel:'stable-pack'`-Variante **gezielt weiter**. Vorhandene
physikalische Modelle, die 1D-Rennskala, der Formationswindschatten und die bisher
funktionierende normale Gruppenfahrregelung bleiben zunächst erhalten.
`stable-pack` ist das **Ausgangsmodell für weitere Experimente**, nicht automatisch
die freigegebene Standard-KI (Default derzeit weiterhin `legacy`).

Es wird **nichts neu geschrieben, nur weil ein bestimmter Seed ungünstig endet**.
Jeder Änderungsversuch formuliert eine konkrete Fehlerhypothese und eine
messbare Gegenprobe; nur eine fachlich und statistisch vertretbare Verbesserung
bleibt Bestandteil der neuen Experimental-KI.

## 2. Vorhandene Referenz-Einzelrennen – unverändert wiederverwenden

| Referenz-ID | Rennart | Rennvorbild | Distanz |
| --- | --- | --- | ---: |
| `tdf25_lille` | Flach | TdF 2025, Lille → Lille | 184,9 km |
| `tdf25_boulogne` | Hügelig | TdF 2025, Lauwin-Planque → Boulogne | 209,1 km |
| `lbl25_liege` | Klassiker | Liège–Bastogne–Liège 2025 | 252,0 km |
| `tdf25_hautacam` | Berg | TdF 2025, Auch → Hautacam | 180,6 km |

Alle vier besitzen **22 modellierte Teams mit je sieben fiktiven
Fahrern** und ihre eigene, auf das Rennprofil abgestimmte Teamkomposition.
Publizierte Renndistanzen und Anstiege sind Anker; die verbindenden Segmente
sind **synthetische Streckenproxies**, kein originaler GPX- oder Wetterverlauf.

Quelle und Implementierung:
`src/engine/race/reference-fixtures.ts` und
[race/R22ABC_REFERENZSTRECKEN_PROFIFELDER.md](R22ABC_REFERENZSTRECKEN_PROFIFELDER.md).
Keine erneute Teststreckenentwicklung und keine erfundenen historischen Starterlisten.

## 3. Prüfablauf für jeden R-22-Verbesserungsschritt

1. **Baseline erfassen:** Auf allen vier Referenzstrecken mit denselben
   Start-Seeds (zunächst 2026–2028) die drei Varianten
   `coordinated`, `front-gated`, `stable-pack` auswerten.
   Modell, Physik, Route und Fahrer bleiben pro Seed-Tripel identisch.
   Die fünf unterschiedlichen Seeds 2026–2030 sind eine spätere
   Stichproben-Erweiterung – **keine** automatische Dauertestserie.
2. **Diagnose vor Optimierung:** Am wichtigsten: Siegergruppe,
   größte Zielgruppe, deren Rückstand zum Sieger, Fahrer binnen 60 s;
   ergänzend Gruppenverlauf bei 25/50/75 %, echte Führungssekunden,
   Anzahl direkter Führungswechsel, Attacken und real bestätigte
   Fluchten/Einholungen. Leistungs-/CP-/W′-/Ermüdungsdaten und
   Sieger-/Top-10-Fahrertypen müssen die Interpretation unterstützen.
3. **Konkrete Ursache isolieren:** Unterschied zwischen echter Attacke,
   langem konstantem Gruppenfahren, energetischem Abreißen, zu vielen
   Führungswechseln oder fehlerhafter Jagdkoordination. Physik- oder
   Aerofehler nur mit separater Gegenprobe behaupten.
4. **Kleine Korrektur in eigenem Branch:** Eine kausal begründete
   Regelung oder Teilfunktion verändern. Keine Ergebnis-, Zeit-,
   Geschwindigkeits-, Energie- oder Positionsgutschriften. Keine
   stillen Änderungen am Standard `legacy`, an R-01–R-08,
   CP/W′, Formationsaero oder R-19.
5. **Regressionsgates:** Kurze physikalische Kontrollfälle (insbesondere
   30 Fahrer / 600 s konstantes Tempo und 154 Fahrer / 20 km ohne
   Attacken), Unit-Tests, vollständiges Renn-A/B mit unverändertem Seed.
   Ein grüner Unit-Test allein ist **kein** Beweis für Sportrealismus.
6. **Über mehrere Profile bestätigen:** Gezielte manuelle
   Mehrseed-Matrix erneut ausführen. Eine Verbesserung in Lille,
   die Berg oder Klassiker offensichtlich verschlechtert, wird
   nicht ungeprüft als Fortschritt übernommen.
7. **Ergebnis dokumentieren:** Alten und neuen Zahlenstand,
   Lauf-ID, Commit, Hypothese, widerlegte Ansätze, Einschränkungen
   und exakten nächsten Schritt in `docs/ENTWICKLUNGSSTAND.md`
   und bei Bedarf in dieser Datei festhalten.

### Profilspezifische Fragen – ohne erfundene harte Siegquoten

- **Flach:** Bleibt ein größeres, möglichst konkurrenzfähiges Hauptfeld?
  Gelingt Einholen bei vorhandener Teamhilfe ohne künstliche
  Geschwindigkeitsanpassung? Nicht nur größte Zielgruppe, sondern
  **deren Rückstand** bewerten.
- **Hügelig:** Entstehen echte, dauerhafte Teilungen an sinnvollen Stellen
  und selektive finale Rennphasen? Keine Entkopplung schon bei
  ruhiger Fahrt durch Regelungsfehler.
- **Klassiker:** Sind Angriffe und Reduktion der Führungsgruppen
  nachvollziehbar, ohne wiederholtes blindes Sprinten und
  bedeutungslose Tausende von Führungswechseln?
- **Berg:** Berg- und Klassementfahrer sollen anhand ihrer
  physisch modellierten Eigenschaften häufig vorne mitfahren;
  kleinere Gruppen sind **erwartbar**. Wir erzwingen **keinen**
  Massensprint oder eine bestimmte Fahrer-ID.

Besonders zu beobachten: Der eine vollständig geprüfte
Lille-Lauf/Seed 2026 hatte bei `stable-pack` die größte
Zielgruppe mit 86 Fahrern nur 15,77 s hinter der Spitze,
118 binnen 60 s, **aber 49 Attacken und 16 maximale
Zwischengruppen**. Diese Zahlen sind die **Startdiagnose**,
kein Zielwert für jeden anderen Rennverlauf.

## 4. Neuer manueller Vergleich – Kosten und Bedienung

GitHub Actions:
[`r22-stable-pack-validation.yml`](https://github.com/Lancester/radsportmanager/actions/workflows/r22-stable-pack-validation.yml)

Der Workflow verwendet das bewusst **manuell** startbare Script
`scripts/r22-validation-matrix.mjs`, mit drei Eingaben:

- **Strecke:** `all` (vier Profile) oder eine vorhandene Strecke.
- **Seed-Anzahl:** 1–5; Startwert 3. Je Seed/Profil genau drei
  vollständige Rennen mit 154 Fahrern. Das Maximum ist
  **4 Profile × 5 Seeds × 3 KI-Varianten = 60 Rennen**.
- **Start-Seed:** Startwert `2026`, fortlaufend bis
  `start_seed + seed_count - 1`.

**Standard für die erste Diagnose:** Vier Strecken, drei Seeds =
**36 vollständige 154-Fahrer-Rennen**. Für einen gezielten
Einzelfall genügt eine Strecke mit einem Seed = drei Rennen.
Die Profilvariante ist nicht mit mehreren Eingabemasken zu verwechseln.

**Workflow-Schutz:** ausschließlich `workflow_dispatch`;
keine Push-/PR-/Schedule-Triggers. Ein Job mit 45-Minuten-Limit,
maximal 60 Rennen und Bericht-Artefakten für 30 Tage.
Große Diagnose-Reihen werden nur bewusst vom Nutzer auf
GitHub gestartet, **nicht** heimlich als normale CI
ausgeführt. Die gewöhnliche PR-CI prüft lediglich
Parametervalidierung/Workflow-Metadaten und bereits
vorhandene kleine Regressionen.

Lokale/technische Aufrufe für die vorhandene Entwicklungsumgebung:

```bash
node --experimental-strip-types scripts/r22-validation-matrix.mjs \
  --route all --seed-count 3 --start-seed 2026 --plan
node --experimental-strip-types scripts/r22-validation-matrix.mjs \
  --route all --seed-count 3 --start-seed 2026 \
  --output artifacts/r22-multiroute-validation
```

`--plan` berechnet **keine** Rennen und bestätigt die
Seed-/Routen-/Rechenlimits. Der echte Aufruf erzeugt:

- `summary.md`: komprimierte Vergleichstabellen für Actions
- `report.json`: Reproduktionsmetadaten, Einzelergebnisse,
  Aggregation, gepaarte Seed-Differenzen
- `races.csv`: je Seed × Strecke × KI die physikalisch
  durchgerechneten Ziel-/Gruppen-/Kraft-/Taktikdaten
- `summary.csv`: streckentypische Mediane, Bereiche und Auffälligkeiten
- `paired-comparisons.csv`: identische Seeds, differenzierte
  Gegenüberstellung `stable-pack` vs. beide ältere Modi

**Wichtig:** Ohne tatsächlich gestarteten Workflow gibt es noch
**keine Mehrseed-/Mehrprofil-Messergebnisse**. Eine
vorhandene grüne PR-Regression belegt nur, dass der
Validierungsplan ausführbar vorbereitet und die kleinen
Tests erfolgreich sind, nicht die Realismus-Validierung.

## 5. Abbruch- und Abnahmebedingungen

- Technisch falsch (nicht alle 154 im Ziel, negative W′,
  relevante Energie-Residualabweichung, unstabile Ergebnisse
  bei gleichem Seed, unerlaubt viele Jobs): **nicht freigeben**,
  zuerst technische Ursache beheben.
- Sportlich schlechter bei mehreren Referenzprofilen:
  gezielte Korrektur zurücknehmen oder isolieren, nicht
  einen guten Lille-Seed als ausreichenden Beleg verwenden.
- Plausibel verbesserte Verteilungen und saubere Physik:
  erst dann einzelne KI-Funktion weiter verfeinern.
- Für einen Wechsel des tatsächlichen Standards auf
  `stable-pack` sind zusätzlich mehr Seeds und externe
  sportliche Plausibilitätsvergleiche erforderlich.
  **R-22 und [Issue #54](https://github.com/Lancester/radsportmanager/issues/54)
  bleiben offen. R-23 noch gesperrt.**

## 6. Nächster konkreter Schritt

Nach erfolgreicher PR-Testprüfung die neue Diagnose-
Infrastruktur integrieren; die erste große Matrix **nur manuell**
für `all / 3 / 2026` starten, ihre tatsächlichen
Profilresultate und die vorrangige noch fehlerhafte
KI-Teilfunktion dokumentieren. Erst danach gezielte
Änderungen an Attacken-Hysterese, körperlicher
Leistungsreaktion oder Jagd-Führungswechseln vornehmen.
