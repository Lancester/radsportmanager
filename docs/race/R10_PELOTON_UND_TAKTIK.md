# R-10 – Peloton, Fluchtgruppen und taktische Stabilität vor weiterem Mikrophysik-Ausbau

**Stand 03.11.2026 · Ausgangspunkt ist R-09 mit 183/183 bestandenen Tests und drei vollständig simulierten 50-km-Rennen.**

## Warum R-10?

Die ersten vollständigen 30-Fahrer-Rennen sind technisch vollständig und schnell, aber die Diagnosen aus [R-09](R09_ERSTES_RENNEN.md) zeigen, dass sich das Feld in zu viele einzelne Fahrer auflöst:

| Ausgangsrennen | Max. Abstandsgruppen | Gruppenaufteilungsereignisse | Verfolgungswechsel |
| --- | ---: | ---: | ---: |
| Hügelig, T1 schützt Kapitän | **30** | **135** | **319** |
| Hügelig, T1 offensiv | **29** | **147** | **155** |
| Flach, T1 Sprint | **15** | **52** | **415** |

Dies ist ein fachliches **Warnsignal**, keine reale Rennstatistik. Wir müssen nun das große Ganze verbessern: Gruppen-Zusammenhalt, Windschatten, Flucht und Verfolgung – ohne wieder Reifen-, Lenk- oder Kurvendetails zu modellieren.

## Schritt 1: Regelbasiertes Gruppen-Tempo statt magischer Abstandsverschiebungen

Neue reine Datei `src/engine/race/peloton.ts`:

- Fahrer sehen **den direkt davor fahrenden Nachbarn** (Abstand und Relativgeschwindigkeit).
- Näherer Vordermann reduziert den Luftwiderstand im **abstrakten, offengelegten Windschatten-Modell**. Der Reduktionsfaktor beginnt bei **0,81** und nähert sich bis **36 m** Distanz wieder 1. Es handelt sich **nicht um empirisch validierte CFD-Daten**.
- Ein nicht attackierender Fahrer darf seinen vorherigen **Pedalwatt-Wunsch** um einen **begrenzt** positiven/negativen Korrekturwert ändern (zunächst −80 bis +72 W), um den Abstand zu stabilisieren oder Anschluss zu suchen. Die Korrektur ergibt sich aus Relativgeschwindigkeit und Abstand, nicht aus einem garantierten Platz in der Gruppe. Für eine fast erschöpfte W′-Reserve sind zusätzliche Watt untersagt.
- Gezielte Attacken und Sprints werden **nicht** auf ein Gruppentempo zurückgeregelt.
- Der vorhandene Kern `advanceMotionStep` berechnet **jede tatsächlich gefahrene Geschwindigkeit und Position** aus Pedalwatt, Steigung und Widerständen. `applyCpWprimeStep` begrenzt vorher jede gewünschte Mehrleistung. **Kein Teleportieren, kein Setzen gleicher Gruppengeschwindigkeiten, keine erfundenen Zeitgutschriften.**

Die Fahrer fahren weiterhin entlang **einer abstrahierten gemeinsamen Streckenkoordinate**. Das ist **kein fahrdynamisch kollisionsfreies 2D-Peloton**. Auch bei besserer Gruppenbildung dürfen wir die R-01–R-08-Detailphysik nicht als integriert im 30-Fahrer-Rennlauf bezeichnen.

## Schritt 2: Ruhigere Verfolgungstaktik

Die erste Renn-KI wollte teilweise alle zehn Sekunden von „Verfolgen“ zu „Erholen“ wechseln und anschließend direkt wieder verfolgen. Die neue `stabilizeRaceDecision`-Funktion sorgt für:

- Verfolgungsphasen von zunächst mindestens **50 Sekunden**, solange noch ausreichend W′ vorhanden ist.
- Nach einer beendeten Verfolgung eine **90-Sekunden-Pause**, ehe dieselbe Rolle die nächste Verfolgung beginnen kann.
- Bei fast leerer W′ greift die Reserveerholung weiter **sofort**; die Mindestdauer wird dann nicht erzwungen.
- Ein Helfer startet die besondere Verfolgungsregel erst bei einem größeren Rückstand (vorläufig über **60 m**, statt schon bei über 25 m), ausreichender Reserve und vor dem späten Finale.

Die Werte sind **vorläufige Balancing-Parameter**. Ziel ist nachvollziehbarere Entscheidungslogik, nicht das gezielte künstliche Herstellen eines bestimmten Siegers.

## Schritt 3: Echte, zeitlich anhaltende Fluchtgruppen erfassen

Die bloße Schwankung der Gruppenzahl wird nicht mehr bei jedem einzelnen Simulationsschritt als dramatisches Rennereignis gezählt. Stattdessen:

- Die einfache Abstandsgruppenklassifikation verwendet nun **42 m** Trennung als vorläufige Diagnosegrenze.
- Protokollierte „Feld geteilt“-Meldungen haben einen Mindestabstand von **75 Sekunden**, um nicht ständig denselben Gruppenwechsel zu erzählen.
- Eine „Fluchtgruppe“ wird erst dann als Ereignis erkannt, wenn vorne höchstens sechs Fahrer und mindestens **75 m** Abstand zur nächsten Gruppe über mindestens **40 Sekunden** bestehen. Ein solches Ereignis entsteht aus den **wirklich gefahrenen Abständen**; es ist kein vordefiniertes Attacken-Drehbuch.
- Auch ein tatsächlicher Wiederanschluss wird erst nach ausreichend stabiler Schließung erneut gemeldet.
- Die Zwischenergebnisse enthalten **alle Gruppengrößen**, statt die Darstellung auf die ersten acht zu begrenzen. Zeit/Rang/Angriff werden weiterhin von der Physik bestimmt.

Die Gruppenzahlen sind **nur eine abstrahierte Abstands-Diagnostik**. Sie beweisen weder eine echte Rennformation noch automatisch ein sportlich realistisches Ausreißerverhalten.

## Tests und laufende Rennvergleichsdiagnose

- Neue `tests/r10-peloton.test.mjs`-Prüfungen sichern Windschatten-Funktion, Wattdeckel, Angriffsfreiheit, W′-Reserve, stabile Verfolgung, Eingabereihenfolge und vollständige, energieerhaltende 50-km-Rennen.
- Eine eigene **Balancing-Regression** überprüft, dass die Maximalzahl der Abstandsgruppen und die Verfolgungswechsel **gegenüber den tatsächlich dokumentierten R-09-Ausgangsläufen sinken**. Dies ist eine Diagnose des Fortschritts, **kein Beweis empirischer Realitätsnähe**.
- `scripts/r09-race-diagnostics.mjs` vergleicht weiter dieselben drei vollständigen Rennen (wellig geschützt, wellig offensiv, flach Sprint) mit demselben Seed und schreibt zusätzlich die vollständigen Gruppenstatistiken, Flucht- und Wiedereinholereignisse.
- Browser-`docs/rennen.html` mit `docs/race/app.js` zeigt die bestätigten Fluchtereignisse, Verfolgungsstarts und Gruppenentwicklung. Der bestehende GitHub-Pages-Workflow soll alle alten und neuen Tests sowie das **originale Browser-ESM-Modul** überprüfen.

**Bis GitHub Actions wirklich erfolgreich ist, sind keine neuen Zahlen oder tatsächliche Android-Laufzeiten bestätigt.**

## Bewusst offen

- Wir müssen beurteilen, ob Gruppen *zu leicht* oder *zu schwer* zusammenbleiben, und ob verschiedene Strecken und Fahrerprofile sinnvolle Unterschiede erzeugen. Maximale Gruppenanzahl allein ist kein Realismusmaßstab.
- Aktuelle Gruppenarbeit ist nur eine **wattbasierte Regelung**; sie enthält noch keine sportlichen Leiter, aktiven Team-Führungswechsel und echte Formation von Windkante/Querwind.
- W′-Wiederherstellung und Langzeitermüdung sind weiterhin eine **nicht kalibrierte** Heuristik.
- Rennresultate müssen gegen plausible Straßenrennen und unterschiedliche Fahrerfelder geprüft werden, bevor 160 Fahrer oder 200 km als ausgereifte Simulation gelten.
- Die ganze Detailphysik der R-01–R-08-Experimente bleibt unverändert testbar. Sie wird nicht als Kernvoraussetzung für jedes Rennen erzwungen.

**Leitsatz: Glaubwürdige ganze Rennen und taktische Entscheidungen zuerst.**


## R-10 vollständig verifiziert: drei Rennläufe und 197/197 Tests (03.11.2026)

**Code- und Testabnahme:** [PR #45](https://github.com/Lancester/radsportmanager/pull/45) wurde auf `main` übernommen. Der reale [GitHub-Actions-Lauf #41717402354](https://github.com/Lancester/radsportmanager/actions/runs/41717402354) ist vollständig **erfolgreich**: **197/197 Tests, 0 Fehler**, drei komplette 50-km-Rennen, originale TypeScript-Browserübersetzung, ESM-Smoke-Test und Pages-Veröffentlichung.

**Vergleich mit den drei dokumentierten R-09-Referenzrennen (30 Fahrer, 50 km, Seed 2026):**

| Rennen | Max. Abstandsgruppen R-09 → R-10 | Gruppen-Trennereignisse R-09 → R-10 | Verfolgungsstarts R-09 → R-10 | bestätigte Fluchten / wieder eingeholt |
| --- | ---: | ---: | ---: | ---: |
| Hügelig, Kapitän schützen | **30 → 20** | **135 → 26** | **319 → 36** | **1 / 1** |
| Hügelig, T1 offensiv | **29 → 22** | **147 → 27** | **155 → 21** | **2 / 1** |
| Flach, T1 Sprint | **15 → 12** | **52 → 13** | **415 → 64** | **2 / 1** |

Die **Verfolgungsstarts sind massiv zurückgegangen**, und Fahrer können dank begrenzter, tatsächlich physikalisch ausgeführter Wattkorrektur besser als Gruppe zusammenfahren. Gruppenaufteilungen werden seltener und reale, über Zeit bestätigte Fluchten und Einholungen erscheinen im Rennprotokoll. **Das ist eine Verbesserung des vorherigen Prototyps, noch keine Realitätsvalidierung.** Auf dem Hügelkurs entstehen weiterhin zeitweise **20–22 Abstandsgruppen**. Auch die maximalen Zielrückstände bleiben hoch. Ein glaubwürdiges Peloton ist noch nicht fertig.

Der R-10-GitHub-Runner meldete beispielsweise für den hügeligen geschützten Lauf F13 als Sieger mit **4.464,8 s** Fahrzeit, **581,4 s** Rückstand des letzten Fahrers; der Vergleich T1 offensiv ändert F01s Zielzeit bei identischem Seed um **3,783 s**. Ein Teamstrategie-Effekt existiert also, darf aber nicht als bereits perfekt ausbalanciert gelten.

**Wiederverwendung ausdrücklich bestätigt:** Vollrennen verwenden unverändert `motion-core.ts` (`advanceMotionStep`) und `critical-power.ts`; der neue `peloton.ts` ergänzt ausschließlich begrenzte Wattwünsche und abstrahierten Windschatten. **R-03 bis R-08 bleiben unveränderte Labortests**, werden nicht als komplettes 2D-Peloton in die 30-Fahrer-Simulation hineinkopiert.

**Für die kommenden Arbeiten:** Noch nicht 160 Fahrer oder 200 km als ausgereift ausgeben. Nächste sachliche Abnahme: qualitative Abstands-/Attacken-/Verfolgungslogik über mehrere Fahrerprofile und Strecken, danach erst größere Fahrerfelder (60 → 100 → 160) und tatsächlicher Android-Gesamtrennbenchmark. **Keine neue Detail-Lenkphysik ohne beobachteten Rennnutzen.**


## R-10 – endgültige Abnahme und Fluchtkorrektur (03.11.2026)

**Aktuell verifizierter Code:** [PR #45](https://github.com/Lancester/radsportmanager/pull/45) führte die neue Peloton-/Taktiklogik ein; [PR #46](https://github.com/Lancester/radsportmanager/pull/46) beseitigte eine irreführende Einholmeldung. Der abschließende [GitHub-Actions-Run #41717987913](https://github.com/Lancester/radsportmanager/actions/runs/41717987913) ist **vollständig erfolgreich: 198 Tests, 198 bestanden, 0 fehlgeschlagen**, drei reale 50-km-Testsimulationen, TypeScript-Browser-Build und Pages-Veröffentlichung.

**Drei vollständige Vergleichsrennen mit identischem Seed 2026 (je 30 fiktive Fahrer und 50 km):**

| Rennen | Maximale Abstandsgruppen: R09 → R10 | Verfolgungsstarts: R09 → R10 | Bestätigte Flucht / tatsächlich eingeholt nach R10 |
| --- | ---: | ---: | ---: |
| Hügelig, Kapitän schützen | **30 → 20** | **319 → 36** | **1 / 1** |
| Hügelig, T1 offensiv | **29 → 22** | **155 → 21** | **1 / 0** |
| Flach, T1 Sprint | **15 → 12** | **415 → 64** | **1 / 0** |

**Warum die geänderten Fluchtzahlen wichtig sind:** Der ursprüngliche PR #45 verwendete „nicht mehr mindestens 75 m Fluchtvorsprung“ irrtümlich als gleichbedeutend mit „eingeholt“. PR #46 meldet einen erfolgreichen Wiederanschluss erst bei tatsächlich auf **höchstens 35 m** geschlossener Lücke über den verlangten Zeitraum. Ereignisse tragen jetzt die jeweils gemessene `gapM` für später nachprüfbare Rennberichte. Die weiter oben festgehaltenen älteren R-10-Fluchtzahlen **2/1** in zwei Szenarien gehören ausdrücklich zur **Zwischenversion vor dieser Korrektur**, nicht zum heutigen Stand.

**Weitere reale Diagnosen aus dem endgültigen GitHub-Runner:** Hügelig „Kapitän schützen“: Sieger **F13**, Siegerzeit **4.464,8 s**, letzter Rückstand **581,4 s**, maximal **20** Abstandsgruppen und **26** protokollierte Gruppenaufteilungen. Hügelig T1 offensiv: maximal **22** Gruppen und **21** Verfolgungsstarts. Flach: maximal **12** Gruppen und **64** Verfolgungsstarts. Die tatsächlichen Renn-Ergebnisse folgen weiterhin dem vorherigen `motion-core.ts`-Physikintegrator und CP/W′, nicht einem Ergebnisbonus.

**Nicht als sportlich abschließend validieren:** Zwar weniger Chaos als in R-09, aber **20–22** Gruppen im hügeligen 30-Fahrer-Rennen und bis zu neun Minuten Zeitspreizung sind noch kritisch. Bei identischer Tagesform veränderte die offensive Nordwind-Leitlinie die Zielzeit von Kapitän F01 nur um rund **3,78 Sekunden**. Das zeigt den nächsten fachlichen Bedarf: Teamarbeit und Verfolgung **qualitativ** verbessern, tatsächliche Gruppenbildung/Attacken gegen realistische Rennabläufe plausibilisieren, und erst danach größeren Feldern/Langdistanzen Priorität geben. **Keine zusätzliche Detail-Lenk- oder Reifenphysik ohne nachgewiesenen Spielnutzen.**

**Browser:** https://lancester.github.io/radsportmanager/rennen.html läuft im bestehenden Web Worker. Veröffentlicht und im GitHub-Runner getestet; **echte Android-Laufzeit des 50-km-Rennens weiterhin unbekannt**.
