# R-22 – manuell gestartete Monte-Carlo-Pilotkampagne

**Projektbeschluss:** Nach R-17 bis R-21 und vor einer
möglichen R-23-Freigabe soll die Rennengine
mit reproduzierbaren, großen Testserien
auf Plausibilität geprüft und erst dann
ursächlich kalibriert werden.
**Der Nutzer startet die Monte-Carlo-Serien
selbst über GitHub Actions**, nicht
über eine automatische Zeitplanung.

## Bedienung nach Merge in main

1. GitHub öffnen: Repository
   `Lancester/radsportmanager`, Tab **Actions**.
2. Links Workflow **R-22 – Monte-Carlo-Test manuell starten**
   auswählen. Den Button **Run workflow**
   verwenden und Branch `main` wählen.
3. Profil (`flach`, `huegelig`,
   `klassiker`, `berg`),
   Zahl der Seeds (3, 10, 25, 50 oder 100),
   Teams (5, 10 oder 22), Strecke
   (50, 60, 170, 200 oder 240 km) und
   Vergleich (`none` oder `carbs`)
   auswählen. Ein Seed wie `2026`
   erzeugt einen reproduzierbaren Startpunkt.
   Jeder Teamkader enthält sieben Fahrer.
4. Nach grünem Workflow die Registerkarte
   **Summary** öffnen: oben erscheint
   der kompakte Bericht (Tabellen/Statistik).
   Unter **Artifacts** die Datei
   **r22-monte-carlo-results** herunterladen,
   mit `races.csv`, `summary.json`
   und `summary.md`.
5. Ein gleicher Seed und identische
   Eingaben sollen dieselben sportlichen
   Zahlen liefern; **CPU-Laufzeit** kann
   zwischen Runnern variieren.
   Die Workflow-Retention beträgt 30 Tage;
   für langfristige Forschung Artefakte
   im Projekt dauerhaft sichern.

## Wofür dient der Pilot?

Nicht sofort auf perfekte Sieger-/Zeitabstände
optimieren, sondern **Baseline-Messungen** sammeln:
Median- und letzte Zielrückstände,
Maximalzahl der Gruppen, bestätigte
Fluchten und echte Einholungen,
Angriffstaktik, Relais, Frontarbeit,
Watt und maximale Ausdauerreduktion,
CPU-Zeit und W′-/Energiebilanz.

Die Variante `carbs` fährt das **identische**
Teamfeld mit **demselben Seed zweimal**:
zuerst 20 g Kohlenhydrate/h,
dann 100 g/h. Sie zeigt die
Sensitivität einer bestehenden
**Eingabegröße**, nicht die
wissenschaftlich optimale Ernährung.
So lässt sich eine Ursache isolierter
beurteilen als mit beliebigen anderen
Siegern, Teams oder Rennstrecken.

**Methodische Grenze:** Bisher verändert
der Seed nur die hashbasierte
CP-Tagesform pro Fahrer um etwa ±2 %.
Er variiert **nicht** automatisch Wetter,
Strecke, Fahrertypen, Teamkader,
Renntaktiken oder eine volle
Leistungspopulation. Der Pilot
ist deshalb eine technische
Monte-Carlo-**Teilkomponente**;
eine echte umfassende Zufallsfeld-
und Unsicherheitsstudie soll
in späteren R-22-Schritten folgen.

Ebenso fehlen im Pilot **unabhängige
reale Profi-Renndaten**; die Tabellen
beweisen nur die Reproduzierbarkeit
und Empfindlichkeit unseres Modells,
nicht dessen objektiven Realismus.
Kleine 3- bis 10-Läufe-Serien erlauben
keine belastbaren Erfolgsquoten.

## Konkrete Kalibrierungsparameter – noch nicht verändert

- R-19: Kohlenhydrat-Speichergröße,
  angenommener Anteil am Energiebedarf,
  Zufuhr, Ermüdungsschwelle und
  Abfallrate. **Nicht** die physische
  Erhaltung der W′-/mechanischen Arbeit.
- R-13: Abstand und Stärke des
  Formations-Windschattens; gruppenweite
  Dynamik und die Frage, ob Abgehängte
  plausibel große Rückstände erhalten.
- R-15–R-18: wann und wie viele Helfer
  jagen, wann Führungsarbeit rotiert,
  wann Fluchten gefährlich genug sind,
  wie viele Attacken realistisch sind.
- R-20: tatsächlicher Wind, Rollwiderstand,
  Körpergewicht/CdA und Leistungsprofile
  in den fiktiven Fahrerkadern.
- R-21: numerische Stabilität, Laufzeit
  und die Frage, ob große Felder
  bei 150–250 km plausible
  Gruppen-/Zielabstände produzieren.

**Grundsatz:** Parameter erst nach
transparenten Befunden, dedizierten
A/B-Tests und externen Referenzen
ändern. Gegen eine unabhängige
Testgruppe erneut prüfen; nicht
das Modell nach Wunschwerten
für einzelne Sieger einstellen.

## Begrenzungen und Kosten

- Workflow ist `workflow_dispatch`:
  **kein** `push`, `schedule` oder
  automatischer Auslöser.
- Pro manuellem Lauf bis 100 Seeds
  bzw. bei Ernährungssensitivität
  bis 200 volle Einzelrennen.
  Bei großen 154er-/200-km-Läufen
  kann das viele CI-Minuten
  verbrauchen. Die Aktion hat
  60 Minuten Zeitlimit und
  unterliegt dem eigenen
  GitHub-Actions-Kontingent.
- Erst kleine Versuche wie
  3 × 50–60 km oder ein
  paar 170-km-Läufe ausführen;
  danach größere Serien.
- Kein Upload persönlicher
  Fahrerdaten erforderlich;
  alle Referenzteams sind fiktiv.
  Keine Laufzeit- oder wissenschaftliche
  Zuverlässigkeitszusage für 100+
  Rennen ohne vorherige Messung.
