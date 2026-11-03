# R-15/R-16 – Mehrhelferteams und situative Rennintelligenz

**Stand: 04.11.2026. Fachumfang: AUSSCHLIESSLICH Rennengine.**
Der Nutzer hat ausdrücklich klargestellt, dass Rundfahrten,
Karrieremodus, Manageroberflächen, Personalverwaltung, Verträge,
Transfers und Saisons **nicht** in diese R-Engine-Schritte gehören.
R-15 und R-16 werden als zusammengehöriger Eingriff in die
autonomen Entscheidungen während eines **einzelnen Rennens** umgesetzt.

## Beschlossene Ziele

- **R-15:** Nicht mehr höchstens ein Helfer je Mannschaft. Je nach
  Rennlage dürfen **mehrere bis zu fünf verfügbare Helfer** einem
  gemeinsamen Ziel folgen. Ein Fahrer übernimmt nur dann die
  aktive Führung, wenn er tatsächlich nahe der Front seiner aktuell
  gefahrenen Abstandsgruppe liegt. Andere eingesetzte Helfer erhalten
  eigene, niedrigere Kurbelwatt-Anforderungen für Unterstützung
  bzw. Vorbereitung. Es wird niemand nach vorne teleportiert;
  auch eine Zuteilung garantiert keine physisch erzwungene
  Positionsverbesserung.
- **R-16:** Die Renn-KI wägt die tatsächliche führende
  Ausreißergröße, gemessene Lücke, den Geschwindigkeitsunterschied,
  die verbleibende Strecke, die Teamstrategie, Fahrerposition und
  W′-Reserve gegeneinander ab. Ein ausgewogenes Team kann bei
  mäßiger Bedrohung die Sprintmannschaft verfolgen lassen;
  bei steigender Bedrohung hilft es selbst. Offensivfahrer nutzen
  positions-/energiebasierte Angriffsmöglichkeiten statt ausschließlich
  zwei vorgegebener Rennkilometerfenster; angefangene Attacken
  bleiben für ein begrenztes Intervall aufrechterhalten.

## Code und Grenzen

- `src/engine/race/race-team-ai.ts`: `analyzeRaceSituation`
  und `decideIntelligentCrew`. Reine, validierte und
  deterministische Strategie- und Einsatzfunktionen.
- `RaceInput.tacticModel`: ohne Angabe oder
  `'r15-r16'` = neue Renn-KI; mit `'r14'` = bisheriger
  Einzelhelfer-Modus für echte A/B-Vergleiche. Das bestehende
  `RaceInput.aeroModel` ist davon **unabhängig**: R-13-Aero
  bleibt unangetasteter Standard.
- Es werden maximal fünf nahe, geeignete Helfer eingeplant,
  jedoch **nicht fünf separate virtuelle Beschleunigungen**
  vergeben. Genau ein tatsächlich frontnaher Fahrer erhält
  je Mannschaft den hochintensiven Führungswunsch;
  weitere erhalten defensivere Unterstützungs-Wattwünsche.
  Jeder Helfer fährt weiter im normalen `advanceMotionStep`,
  mit seinen CP/W′- und Aero-Bedingungen.
- Die R-15/R-16-Taktik nutzt 42-m-Abstandsgruppen als
  grobe **Taktikdiagnose**, die echte Formations-Aero
  nutzt weiterhin nur lokal tatsächlich vorausliegende Fahrer.
  `frontWorkRadiusM=18` m für überprüfbar frontnahe
  Führung, `maximumCrewDistanceFromGroupFrontM=105` m
  als obere Grenze für Teamzuteilung,
  `minimumReserve=0.18`,
  `minimumChaseReserve=0.27`,
  `relaySeconds=75` sind vereinfachte Spielmechanikwerte.
- Bei einer führenden Flucht muss die größte Abstandsgruppe
  mindestens vier Fahrer enthalten, die Spitze maximal sechs.
  Die Lücke muss mindestens 75 m betragen; gemessen wird
  die Lücke zwischen Fluchthintermann und Hauptfeldspitze.
  Für Verfolgung braucht es mindestens 1.200 m Restdistanz
  und eine gemessene Lücke unter 16 % der Reststrecke;
  schnelle, weit entfernte Fluchten werden nicht blind
  und garantiert eingeholt. Die Rennleitung darf
  bewusst Kräfte sparen.
- Sprintzug bei Sprintstrategie ab ca. 82 % der Strecke
  bzw. bis höchstens 10 km vor Ziel; der Kapitän/Sprinter
  erhält dadurch **keine** Gratisleistung. Die Zahl der
  eingesetzten Helfer richtet sich nach Phase,
  tatsächlicher Gruppennähe und W′.
- Angriffsentscheidungen setzen eine geeignete Position in
  einer Gruppe von mindestens vier Fahrern, relative
  Leistungsfähigkeit, hohe W′-Reserve und
  zeitlichen Abstand seit der letzten Attacke voraus;
  fortgesetzte Attacken brechen bei unzureichender Reserve ab.
- Jeder eingesetzte Fahrer hat weiterhin eine gemessene
  Strecke, eine physikalisch bestimmte Geschwindigkeit,
  CP/W′-Energieverbrauch und eine eventuelle tatsächliche
  Zielzeit. **Keine** unsichtbare Beschleunigung,
  Kollision-/Spur-Simulation, Zeitgutschrift oder
  künstliche Aufholhilfe.
- `team-pace`, `team-chase` und `sprint-train` protokollieren
  Entscheidungen; neue Diagnosen `multiHelperAssignments`,
  `maxSimultaneousTeamHelpers`,
  `sprintTrainAssignments` und `actualFrontWorkSteps`
  unterscheiden **erteilte Aufträge** und **nachgewiesene
  Frontnähe bei tatsächlichem Sekundenschritt**.
- Die vier einfachen Strategien des Rennprototyps
  bleiben vorerst unverändert. Keine neuen
  Karrieremodus-, Sportdirektoren- oder
  detaillierten Teambus-Einstellungen implementiert.

## Prüfung

`tests/r15-r16-crew-intelligence.test.mjs` enthält
isolierte Gegenbeispiele und Integrationsprüfungen:

- Mehrhelfer-Jagd mit mehreren Mannschaften; auch ein Team
  mit fünf Helfern kann bei dringlicher Rennlage mehr als
  einen davon gleichzeitig einsetzen.
- Sprintzug und Schutz des Sprinters, effektive Nähe zur
  Feldspitze, Ausschluss erschöpfter oder weit zurückliegender
  Fahrer, unabhängige Fahrer-/Team-Eingabereihenfolge.
- Keine Verfolgung des eigenen Ausreißers oder
  eines weit abgehängten Nachzüglers; kein sinnloses
  Nachsetzen einer uneinholbaren Flucht.
- Strategisches Abwarten eines ausgewogenen Teams,
  wenn andere Teams die Jagd übernehmen.
- Situative statt fest kilometergebundene Attacken,
  ungültige Werte/Taktikmodelle.
- Zwei volle Rennen mit physikalischer Energie-,
  CP/W′- und Ergebnisprüfung sowie deterministischem
  Wiederholungslauf und `r14`-Kontrollmodus.

`scripts/r15-r16-comparison.mjs` rechnet **sieben
identische 50-km-/30-Fahrer-Szenarien** jeweils mit
R-14 und mit R-15/R-16 durch: **14 reale
Simulationsläufe und 420 Zielankünfte**.
Die zusätzlichen GitHub-Actions-Prüfungen testen
TypeScript-Browser-ESM mit 30 fiktiven Fahrern,
ohne den vollwertigen Karriere-/Rundfahrtmodus
vorwegzunehmen.

**Ausdrückliche Abnahmegrenze:** Ein Teamauftrag,
auch über 3–5 Helfer, heißt nicht, dass in einem
1D-Modell bereits eine echte hintereinander
gestaffelte, seitlich differenzierte
Führungsformation oder ein verlässliches
Führungsüberholmanöver existiert. Die Grenzen
werden ehrlich als technische Abstraktion
dokumentiert. Keine 2D-Lenk-/Crash-Mikrophysik.

## Testergebnisse

Dieser Abschnitt wird erst nach Auswertung der finalen
GitHub-Actions-Tests und des finalen `main`-Builds
mit tatsächlich bestätigten Lauf-IDs und
Rennvergleichswerten ergänzt.

## Nächste ausschließlich rennmechanische Baustellen

Nach R-15/R-16 können wir innerhalb der
**Rennengine** echte Relaisablösung und Positionierung
vor dem geschützten Fahrer präziser nachweisen,
relative Mannschaftsleistung bei Flucht/Verfolgung
und taktischen Gegnerreaktionen weiter verfeinern
sowie das Verhalten in starken und gemischten
Fahrerfeldern prüfen. **Rundfahrten, Rennen
über mehrere Tage, Verträge, Trainingskalender,
Personalmanagement und Karrieremodus sind
ein separates späteres Spielsystem und hier
ausdrücklich außerhalb des Arbeitsumfangs.**
