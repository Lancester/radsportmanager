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

## Verifizierte technische Abnahme und sieben A/B-Rennvergleiche

[GitHub PR-Tests #41741852143](https://github.com/Lancester/radsportmanager/actions/runs/41741852143):
**232/232 Tests bestanden, 0 Fehler**, darunter neue
Fünfer-Helfer-, Gegnertaktik- und Vollrennenstests.
[Separater Vollrennen-/Browserlauf #41741844022](https://github.com/Lancester/radsportmanager/actions/runs/41741844022):
**14 vollständige 50-km-Rennen, 420 fiktive Zielankünfte**;
die sieben `R15-R16-VERGLEICH`-Datensätze und
`R15-R16-GESAMT` wurden ausdrücklich nachgezählt.
TypeScript-Browser-ESM kompiliert und ein echtes
30-Fahrer-/50-km-Rennen mit **drei gleichzeitig
eingeteilten Helfern in einem Team** erfolgreich
durchgeführt (Seed 2027, flach, Sprint).
Die einmalige GitHub-Action wurde nach der
Abnahme aus der PR entfernt; keine laufenden
zusätzlichen CI-/Serverkosten.

**Testszenario für besonders dringliche Verfolgung:**
Ein Sprintteam mit fünf geeigneten Helfern
kann **alle fünf zugleich** einteilen;
ein tatsächlich frontnaher Helfer erhält
Führungsarbeit, vier weitere erhalten
geringere Unterstützungs-Wattaufträge.
In den sieben Standardrennen war die maximale
gleichzeitige Zahl dagegen **drei**
(2027 flach) und nicht automatisch fünf.
Die Ablöse bleibt eine 1D-Abstraktion:
gemessene Frontnähe bedeutet noch keinen
garantierten positionellen Wechsel.

| Vergleichsrennen | R-14 max. Gruppen | R-15/R-16 max. Gruppen | R-14 medianer Zielrückstand | R-15/R-16 medianer Zielrückstand | R-15/R-16 max. aktive Teamhelfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hügelig, schützen, 2026 | 18 | 20 | 231,2 s | 63,9 s | 2 |
| Hügelig, offensiv, 2026 | 20 | 21 | 144,2 s | 186,0 s | 1 |
| Flach, Sprint, 2026 | 3 | 8 | 1,8 s | 1,3 s | 1 |
| Hügelig, schützen, 2027 | 20 | 23 | 198,3 s | 206,5 s | 2 |
| Hügelig, offensiv, 2027 | 23 | 18 | 249,5 s | 220,9 s | 2 |
| Flach, Sprint, 2027 | 5 | 4 | 1,3 s | 0,7 s | 3 |
| Hügelig, Helfer F03 −12 %, 2026 | 20 | 17 | 207,7 s | 101,3 s | 2 |

In **fünf der sieben** Standardfälle sind gleichzeitig
mehrere Helfer desselben Teams eingeteilt.
In **allen sieben** wurden tatsächlich
frontnahe Arbeitsschritte gemessen,
in **zwei** Sprintzug-Aufträge.
Der Median-Zielrückstand im
Flach-Sprint-Fall 2026 bleibt
trotz des größeren maximalen
Abstandsklassenwerts bei 1,3 s.
Letzter Zielrückstand dort:
R-14 **396,7 s**,
R-15/R-16 **369,8 s**.
Es gibt also keine automatische
Gleichsetzung von mehr Abstandsklassen
mit schlechterer Rennintelligenz;
die Reihenfolge und Energie der Fahrer
muss jeweils mit bewertet werden.

**Grenzen der Aussagekraft:** Die Flug- und
Gruppengrößen sind fiktive 30-Fahrer-1D-
Rennwerte, keine gemessenen Profi-Renndaten.
Manche Szenarien liefern im neuen Modell
mehr statt weniger Abstandsklassen;
es wird weder ein Sieger erzwungen noch
eine Rückstandsschranke eingebaut.
Ein Pilot-Test über 14 Rennen beweist
technische Stabilität und echte Änderungen
der Watt-/Energie-/Aero-/Ergebnisdynamik,
aber keine vollständige sportwissenschaftliche
Kalibrierung.

**Erst nach separater erfolgreicher main-CI:**
Merge-Commit und tatsächlichen Browser-Release
hier nachtragen.

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
