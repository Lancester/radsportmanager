# Rennfahr-KI – Gesamtübersicht des aktuellen Entwicklungsstands

**Stand: 04.11.2026 – nach PR #65, Hauptbranch main.** Dieses Dokument beschreibt das **tatsächlich implementierte Verhalten** der Einzelrenn-Simulation, insbesondere der aktuellen experimentellen Variante **groupRidingModel = stable-pack**. Es ist keine Wunschliste und kein Pflichtenheft für spätere Karrieremodule.

**Wichtig:** Die zugrunde liegende Kraft-/Bewegungs-, Energie- und CP/W′-Physik wurde wiederholt intern getestet (insbesondere Berggegenprobe in PR #65), ist aber **ein vereinfachtes, nicht vollständig wissenschaftlich kalibriertes Straßenrennmodell**. Deshalb unterscheiden wir immer (a) physikalisches Grundgesetz, (b) gewählte Modellannahmen und (c) verhaltenssteuernde KI-Heuristik. Die tatsächliche Rennintelligenz ist **regelbasiert und deterministisch** – kein trainiertes neuronales Fahrermodell.

## 1. In einem Satz: Was bestimmt den Rennverlauf?

**Fiktive Fahrerprofile und Teamleitlinie → alle 10 Sekunden Taktik-/Teamentscheidung → pro Sekunde Gruppen-/Abstandsbeobachtung und angeforderte Kurbelwatt → R-19-Ausdauerbegrenzung und CP/W′ → unveränderter Bewegungsintegrator mit Masse, Steigung, Wind und Windschatten → tatsächlich gefahrene Positionen, Gruppen, Fluchten und Zielzeiten.**

Es gibt **keine** direkte KI-Zuweisung von Sieger, Position, Geschwindigkeit oder Zeitabstand. Wenn ein Fahrer beschleunigt, dann weil der KI-Wattwunsch innerhalb seines Leistungsvermögens tatsächlich in den Bewegungsintegrator eingeht. Die Parameter der KI beeinflussen daher aber sehr wohl *indirekt* die physikalisch gefahrenen Ergebnisse.

### Quellen-/Funktionskarte

| Aufgabe | Implementierung | Wichtige Funktion |
| --- | --- | --- |
| Rennablauf, Zustände, Zeit-/Positionsschritte | src/engine/race/race-simulator.ts | simulateRace, validateRace |
| Individuelle taktische Grundentscheidungen | src/engine/race/race-tactics.ts | chooseRacePower, stabilizeRaceDecision |
| Erkennung der realen Rennsituation, Helfer- und Teamaufträge | src/engine/race/race-team-ai.ts | analyzeRaceSituation, decideIntelligentCrew |
| Teamübergreifende Auswahl der jagenden Mannschaften | src/engine/race/peloton-chase.ts | coordinatePelotonChase |
| Ältere Teamtempo-Variante für R-14-Vergleich | src/engine/race/team-pacing.ts | decideTeamPace |
| Benachbarte Fahrerabstände und Abstandsgruppen | src/engine/race/peloton.ts | decidePackInstruction, pelotonGroups |
| Normales energie- und gruppenbewusstes Mitfahren | src/engine/race/group-riding.ts | decideGroupRiding |
| Separates Verhalten für echte Verfolger und Kleingruppen | src/engine/race/stable-pack.ts | decideStablePackRiding |
| Eigenes nachhaltiges Tempo von Bergkapitänen auf langen Anstiegen | src/engine/race/climb-tempo.ts | decideClimbTempo |
| Räumliche Formationsabschirmung | src/engine/race/formation-aero.ts | formationAeroFactors |
| Watt → tatsächliche Beschleunigung, Geschwindigkeit, Weg und Energie | src/engine/physics/motion-core.ts | advanceMotionStep |
| CP/W′-Belastung und Erholung | src/engine/physiology/critical-power.ts | applyCpWprimeStep |
| Modellierte Langzeit-Ausdauer/Kohlenhydratzufuhr | src/engine/race/endurance.ts | advanceEndurance, endurancePowerAvailability |
| Neutraler Gruppen-/Zeit-/Energieaudit | src/engine/race/race-audit.ts | auditRace |
| Experimentelle Gruppierung nach Zielzeiten | src/engine/race/finish-groups.ts | finishGroupMetrics |
| Reproduzierbare Flach-/Hügel-/Klassiker-/Berg-Strecken, fiktive Profis | src/engine/race/reference-fixtures.ts | createReferenceFixture |
| Vier kleine End-to-end-Profilregressionen | scripts/r22-profile-smoke.mjs, tests/r22-profile-smoke.test.mjs | 4 × 154 Fahrer, Seed 2026 |

## 2. Welche Fähigkeiten haben die Fahrer heute?

### A. Unterschiedliche Fähigkeiten und individuelle Identität

Jeder Fahrer besitzt **absolute Critical Power (CP)**, FTP als Profilwert, **W′-Kapazität**, Körper- und Radmasse, Luftwiderstandsfläche (CdA), Sprint- und Abfahrtsfähigkeiten sowie Aggressivität. Die R-22-Referenzfelder kennen außerdem die fiktiven Spezialisierungen **Sprinter, Kletterer/GC, Klassikerfahrer, Zeitfahrer und Allrounder**. Ein numerisch kleiner Tagesformfaktor wird deterministisch aus Fahrer-ID und Seed gebildet. Die Unterschiede wirken primär durch **Gewicht, CP/W′, CdA und die daraus folgende reale Fahrgeschwindigkeit**, nicht durch direkte Archetyp-Zeitboni. Sprinter haben für bestimmte Entscheidungen höhere Sprintfähigkeit; die aktuelle spezielle Langpass-Regel erkennt Kapitäne mit Spezialisierung „kletterer“.

*Realismusgrenze:* Die Fahrertypen beruhen auf publizierten Profi-Mittelwerten und modellierter Streuung – keine echten Leistungsdaten oder historischen Starterlisten. FTP ist derzeit kein unabhängiger zweiter Motor. Tagesform, Ermüdung und Verpflegung sind vereinfachte Modellannahmen.

### B. Persönliche Entscheidungszustände

Die zentrale Funktion chooseRacePower kennt diese Absichten: **Grundtempo, Windschatten, Angriff, Verfolgung, Sprint, Erholung und Helferarbeit**.

- **Grundtempo / Windschatten:** ohne Sondermission orientiert sich die Wattforderung an der individuellen CP, grundsätzlich bei ca. 98 % CP in ungeschützter und bei ca. 88 % CP in geschützter Position, bevor die nachgeschaltete Gruppen-KI den Bedarf an das gemeinsam gefahrene Tempo anpasst.
- **Angriff:** eine offensiv ausgerichtete Mannschaft kann über ihren Kapitän eine Attacke auslösen, sofern Rennphase, tatsächliche Position, Gruppengröße, aktuelle Reserve und Wiederholungsabstand passen. In der R-22-Versuchskonfiguration beginnen mögliche frühe Attacken bereits nach etwa 180–250 Sekunden und vor rund 13 % der Distanz; andere Gelegenheiten sind bis etwa 88 % geöffnet. Die zentrale wiederholte Angriffschance ist durch mindestens **900 Sekunden** seit der letzten Attacke desselben Fahrers begrenzt. Die Wattanforderung liegt typischerweise über CP; **W′ bezahlt** die tatsächliche Mehrleistung. Eine begonnene Attacke kann etwa **40 Sekunden** als Angriffsabsicht fortgeführt werden.
- **Sprints:** in den letzten **250 Metern** kann ein Kapitän oder Sprinter hohe, von Sprintfähigkeit und W′-Reserve abhängige Watt verlangen. Eine Sprintentscheidung ist also mehr als nur die Zahl „Sprinter“ im Datenmodell, aber kein vollständiges 2D-Sprintzug-/Spurwahlmodell.
- **Erholung:** bei sehr kleiner W′-Reserve (unter etwa 8 %) fordert die Individual-KI bewusst weniger Leistung an. Während des Rennens kann die Reserve physisch/physiologisch nach dem hinterlegten CP/W′-Modell regenerieren.

**Wichtig:** Die Absicht allein sagt **nicht**, dass ein Angriff tatsächlich eine räumlich getrennte Flucht wird; der Bewegungsintegrator und die tatsächlich gemessenen Lücken entscheiden darüber.

### C. Gruppenfahren, Windschatten und Watt sparen

Es gibt **zwei verschiedene Begriffe von Gruppe**, die nicht verwechselt werden dürfen:

1. **Physische Abstandsgruppe im Modell:** Aufeinanderfolgende Fahrer mit höchstens **42 m** Abstand zählen in eine gemeinsame 1D-Abstandsgruppe. Das ist eine heuristische Diagnose-/Planungsschwelle, kein echter aerodynamischer Schutz bis 42 m.
2. **Formations-Windschatten:** Vorausfahrende Fahrer innerhalb von **24 m** können den reinen Luftwiderstand verringern (höchstens zehn betrachtete Vordermänner; derzeit Faktoruntergrenze 0,40). In derselben 42-m-Gruppe kann ein weit zurückliegender Fahrer somit bereits **keinen** Windschatten vom Vorderfahrer mehr bekommen.

Im regulären Gruppenregler decideGroupRiding richten sich Mitfahrer größerer Gruppen (ab **8 Fahrern**) am *tatsächlich führenden* Pacesetter aus: dessen aktuelle Geschwindigkeit, dessen aus Kurbelwatt/Kräften abgeschätzte Beschleunigung, der unmittelbare Nachfahrerabstand und die eigene mögliche Leistung bestimmen die Wattanforderung. Ein beschatteter Fahrer spart dadurch Watt; bei voller W′-Reserve ist die Folgewattforderung auf rund **112 % CP** gedeckelt. Ein echtes hohes Tempo kann trotzdem schwächere Fahrer abhängen – es gibt **keine** magnetische Gruppenzusammenhaltung.

Bei kleinen Gruppen, aktiven Missionen und zu großen Abständen können bewusst andere Regeln greifen. Daher ist das **Beibehalten** des bereits funktionierenden großen Gruppenreglers zentral: Die frühere pauschale Ersetzung erzeugte nachweislich ungewollten Feldzerfall.

### D. Die aktuelle zusätzliche stable-pack-Verfolger-KI

**stable-pack ersetzt NICHT alle Mitfahrerregeln.** Für normale Fahrer in Gruppen von mindestens acht gilt weiterhin die koordinierte Normalregelung aus group-riding.ts. Der separate decideStablePackRiding wird bei **Verfolgungsauftrag** oder in **kleinen Gruppen unter acht** verwendet:

- Referenz ist die tatsächliche Geschwindigkeit des **unmittelbar vorausfahrenden** Fahrers und die abgeschätzte Beschleunigung des Pacesetters.
- Physisch aus Roll-, Luft- und Steigungswiderstand errechnete Watt zum Halten des Tempos werden um begrenzte Geschwindigkeits- und Abstandskorrekturen ergänzt.
- Eine Lücke bis **85 m** kann durch echte Pedalarbeit geschlossen werden, **ohne** zusätzlichen Aero-Schutz jenseits des 24-m-Windschattenbereichs.
- Verfolger im Feldinneren erhalten höchstens **18 W** zusätzliche Aufrückanforderung, begrenzt durch CP/W′; erst ein tatsächlich führender und als Pacesetter erfasster Helfer darf volle Verfolgungswatt anfordern.
- Eine **bewusste Attacke oder ein Sprint** wird nicht pauschal weggeregelt.

Das gilt nur für explizit ausgewählte Experimente; es gibt **keinen** allgemeinen Zwang zum „Anschließen“.

### E. Neue Bergfahrer-KI nach PR #65

decideClimbTempo löst ein Problem der Gruppen-KI: Ein leichter, besonders leistungsfähiger Kletterer soll am langen Pass nicht automatisch im Tempo eines schwereren Vordermanns bleiben, wenn er selbst **dauerhaft stärker bergauf fahren kann**.

**Aktuell wirkliche Bedingungen (alle gemeinsam):**

- Nur groupRidingModel **stable-pack**;
- Spezialisierung **kletterer** und Mannschaftsrolle **kapitaen**;
- Steigung **mindestens 5,5 %** und *modellierter gesamter Streckenabschnitt* **mindestens 5.000 m** lang;
- physische Gruppe mindestens **4 Fahrer**, höchstens **220 m** hinter deren Front und nicht selbst bereits Pacesetter;
- W′-Reserve mindestens **12 %**, mehr als 250 m verbleibende Rennstrecke, gerade keine Attacke/Sprint/Erholung/Teammission;
- der Leistungsbedarf zum Halten des Pacesetter-Tempos wird vorsichtig **ohne Windschatten** berechnet; die eigene nachhaltige Leistung muss mindestens **22 W darüber** liegen;
- angefordert wird dann maximal **98 % der eigenen Tages-CP** und höchstens **80 W über dem ungeschützten Haltebedarf**.

Dadurch können Bergkapitäne **durch eigene Watt** vorfahren. Die W′-/R-19- und Bewegungsgrenzen gelten weiterhin; keine Teleportation und kein automatischer „Kletterer gewinnt“-Bonus. Bei Lille/Boulogne/Lüttich des festgelegten Seeds bleibt diese Langpass-Regel vollständig inaktiv.

*Einschränkung:* Die 5-km-Grenze bezieht sich derzeit auf die **modellierte Länge des aktuellen Streckenabschnitts**, nicht auf eine detailliert laufend erkannte ununterbrochene Passrampe. Es gibt noch keine ausgereifte, für alle Fahrertypen koordinierte Anstiegs-/Positionsstrategie. Kletterer auf kurzen, giftigen Klassikerrampen werden von **dieser** Regel ausdrücklich nicht unterstützt.

## 3. Was leisten die Mannschaften und sportlichen Leiter?

### A. Leitlinien vor dem Start

Jedes Team hat zunächst eine von vier allgemeinen Strategien:

| Leitlinie | Verhalten im jetzigen Modell | Was fehlt noch? |
| --- | --- | --- |
| **ausgewogen** | Hauptfahrer schützen, bei geeigneter Rennlage nur selektiv an der Jagd teilnehmen | individuelle Zielgewichtungen und anspruchsvolle Opportunitätskosten |
| **offensiv** | Kapitän kann bei eröffneter Gelegenheit angreifen, Schwerpunkt Fluchtverhalten | abgestimmte Team-Fluchtplanung und realistische Angriffsökonomie |
| **sprint** | Sprinter schützen, bei kleinen Fluchten Jagdinteresse und späte Sprintzüge | echte Wind-/Spurposition im Sprint und ausgefeilte Lead-outs |
| **kapitaen_schuetzen** | Teamkapitän schützen, geeignete Helfer vorn einsetzen und bei gefährlicher Flucht jagen | komplexe Berghelfer-Taktik, temporäre Ziele nach Rennlage |

Die Teampläne sind bislang **einzelrennenbezogen**: kein Teambus-Dialog, keine Mitarbeiter-/Trainer-KI, keine Live-Anweisungen eines Managers und keine mehrtägige Gesamtwertung.

### B. Rennen lesen – mit bewusst einfachen Schätzungen

analyzeRaceSituation sortiert Fahrer nach physischer Position, erkennt eine kleine Spitzengruppe vor dem größten Feld und misst tatsächliche Lücke und Geschwindigkeiten. Eine **120-Sekunden-Fortschreibung** der gemessenen Relativgeschwindigkeit schätzt, wie sich der Abstand bei unverändertem Tempo entwickeln könnte. Das ist keine allwissende perfekte Zeitprognose oder Einholgarantie.

Eine relevante Ausreißergruppe hat in der derzeitigen Heuristik meist höchstens **6 Fahrer**, eine trennende Lücke von mindestens etwa **75 m** und ein größeres verfolgendes Feld. Größere, ganz anders zusammengesetzte Rennsituationen sind noch nicht gleich gut abgedeckt.

### C. Teamübergreifend entscheiden, WER jagen soll

coordinatePelotonChase wählt bei einer verfolgungswürdigen abgesetzten Spitze **bis zu drei** Teams aus, nach objektivierter Rennlage und vorhandenen Helfern:

- Sprintteams mit eigenem Sprinter priorisiert;
- Kapitäns- und ausgewogene Teams bei dringlicherer Lage;
- kein blindes Mitjagen sämtlicher Mannschaften;
- aktive Jagdmandate mit mindestens **150 s** Haltezeit sowie **120 s** Wartezeit nach Ende;
- Jagd im R-22-Modell nur bei genügend großem Hauptfeld und tatsächlich messbarer Flucht.

**Noch offen:** Auch ein formal koordinierter Jagdbeschluss führt nicht automatisch zu einem stabil geführten Peloton; diese Übertragung von Plan auf tatsächliche Frontarbeit ist einer der wichtigen verbliebenen KI-Forschungspunkte.

### D. Rollenvergabe: Helfer, Kapitän, Ablösung

decideIntelligentCrew wählt geeignet platzierte Helfer mit ausreichender W′-Reserve. Die Pläne unterscheiden **Jagd, Sprintzug und Schutz** sowie **Führung oder Unterstützung**.

- Echte **Frontposition und Stellung vor dem geschützten Fahrer** werden berücksichtigt; ein Helfer im Feldinneren zählt nicht einfach als erfolgreicher Anführer.
- Bei physischem Relaismodus werden mit einem Suchradius und tatsächlicher Position mehrere Helfer für aktive Unterstützung berücksichtigt; die Hilfe findet nicht per Positionssprung statt.
- Ein führender Helfer kann nach **75 s** für Ablösung vorgesehen sein, soweit geeignete Kandidaten wirklich vorne sind. Der Simulator führt seinen früheren Führungszustand mit.
- Ein Sprintzug wird in der jetzigen Teamlogik vor allem auf den **letzten 10 km** für eine passende Sprintmannschaft mit genügend großer Gruppe aktiviert.
- Nicht mit einer Mission beauftragte Feldfahrer sollen sich bei koordinierten Varianten grundsätzlich schonen.

**Keine echte 2D-Reihenfolge:** Seitenwechsel, Blockieren, Lenken, Ellbogenarbeit, Windkante, fahrdynamisches Überholen und Kollisionsvermeidung werden nicht realistisch im Raum simuliert. Das ist eine große strukturelle Grenze der 1D-Simulation.

## 4. Wie oft trifft die KI Entscheidungen und wann wechselt ein Zustand?

- **Alle 10 Simulationssekunden:** neues taktisches Urteil, aktuelle kleine Fluchten, interessierte Jagdteams, Helferzuweisungen, mögliche Attacken, Sprint/Erholung; frühere Team-/Angriffs-/Jagd-Zustände bleiben teilweise als Hysterese erhalten.
- **Jede Simulationssekunde:** aktuelle Positionen/Abstände neu sortieren, Windschutz je Fahrer berechnen, physische Gruppen erkennen, Pacesetter-/Wattbedarf und Abstandsfeedback ermitteln, bei stable-pack gegebenenfalls Bergtempo anfordern; anschließend Ausdauer und CP/W′ anwenden, tatsächlich gefahrene Strecke/Tempo/Arbeit fortschreiben.
- **Bei 5-km-Fortschritt:** optionale Checkpoint-Diagnose mit Positions-, Leistungs-, W′-, Aero- und Gruppenzuständen. Daneben gibt es ereignisorientierte Protokolle für Angriffe, Fluchten und Einholungen.

Die KI sieht keine Zukunft: Sie benutzt aktuelle und teilweise fortgeschriebene Rennbeobachtungen. Ein Fahrer kann aus realer Überlastung zurückfallen oder sich an einem Anstieg lösen.

## 5. Welche Rennformen sind schon plausibel, wo bestehen offene KI-Probleme?

### Verifizierte Profil-Smoketests – genau ein Seed, je 154 fiktive Profis

Diese Zahlen gelten ausschließlich für **stable-pack mit der Bergkapitän-Erweiterung aus PR #65**, Seed 2026:

| Referenz | Gewinnerprofil | Siegergruppe (1-s-Proxy) | Größte Zielgruppe | Rückstand größte Zielgruppe | Attacken | Maximum 42-m-Abstandsgruppen unterwegs |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Lille 184,9 km, flach | Allrounder | 6 | 86 | 15,77 s | 49 | 16 |
| Boulogne 209,1 km, hügelig | Klassiker | 1 | 32 | 63,24 s | **108** | 17 |
| Liège 252,0 km, Klassiker | **Sprinter** | 18 | 46 | 706,93 s | 41 | 36 |
| Hautacam 180,6 km, Bergankunft | **Kletterer** | 1 | 4 | 299,09 s | 13 | **36** |

**Vorsicht bei Kennzahlen:** „maximale 42-m-Abstandsgruppen“ bedeutet die zu irgendeiner Simulationssekunde höchste Zahl physisch getrennter Längsgruppen, **nicht** Zahl der Zielgruppen oder ihre Größe und **nicht** Zahl der Gruppen am Schlussanstieg. Eine Einzelgruppe ist mitgezählt. „Zielgruppe“ wird derzeit aus Zielzeiten mit höchstens **1 Sekunde Unterschied zwischen aufeinanderfolgenden Ankünften** abgeleitet. Das ist ausdrücklich ein interner Proxy und **keine** offizielle UCI-Gruppenzählung. Ein einzelner extrem kleiner Siegerpulk bei einer Bergankunft ist nicht automatisch unplausibel.

**Befund:** Die flache Jagd/der Rückstand haben sich gegenüber den alten Verfolgungsmodellen stark verbessert. Die Bergphysik erlaubt leichten Fahrern korrekt schneller zu steigen, und die neue Bergkapitän-KI nutzt das auf langen Pässen. **Weiter unplausibel bzw. ungeprüft:** zu viele Attacken auf Boulogne; Sprinter dominieren das anspruchsvolle Liège-Rennen; eine sportliche Plausibilitätsprüfung der Aufsplitterung während der Bergankunft fehlt. Kein mehrprofiliges Multi-Seed-Ergebnis und kein historisch reproduzierter Sieger.

### Empirischer Gegencheck – tatsächlich große Bergselektion ist normal

2025 entstanden auf großen Bergetappen auch im echten Profiradsport sehr große Lücken:

| Echte Etappe | Rückstand Rang 2 | Rang 10 | Rang 20 |
| --- | ---: | ---: | ---: |
| Tour 2025 Etappe 12, Auch–Hautacam | 2:10 | 7:26 | 11:47 |
| Tour 2025 Etappe 18, Col de la Loze | 1:45 | 3:26 | 11:20 |
| Tour 2025 Etappe 19, La Plagne | 0:02 | 3:54 | 6:46 |
| Vuelta 2025 Etappe 20, Bola del Mundo | 0:11 | 1:30 | 4:32 |

Veröffentlichte Etappenergebnisse:
- Hautacam: https://www.rte.ie/sport/results/cycling/tour-de-france/895458/results/4666793/
- Col de la Loze: https://www.rte.ie/sport/results/cycling/tour-de-france/895458/results/4666799/
- La Plagne: https://www.rte.ie/sport/results/cycling/tour-de-france/895458/results/4666800/
- Bola del Mundo: https://www.rte.ie/sport/results/cycling/vuelta-a-espana/895826/results/4673193/
- Hautacam Live-Rennbericht: https://www.cyclingnews.com/races/tour-de-france-2025/stage-12/live-report/ – am Col du Soulor war das Favoriten-Peloton bereits auf 14 Fahrer reduziert.

**WICHTIGE KORREKTUR DER BISHERIGEN ERWARTUNG:** Es ist **falsch**, aus „36 Abstandsgruppen auf Hautacam“ unmittelbar zu folgern, die KI zerlege das Feld unnatürlich. Ein reales schweres Bergrennen ist ebenfalls stark fragmentiert. Zum Vergleich benötigt die Engine künftig eine **positionsabhängige Zeitreihe bei jedem relevanten Anstieg** (z. B. vor/nach Soulor, vor/auf Hautacam), Zahl der Fahrer in der Führungs-/größten Gruppe, Größenverteilung und Lückenabstände. Echte Zielzeiten können nicht eins zu eins in 42-m-Längsgruppen umgerechnet werden.

Die hier wiedergegebenen realen Abstände sind ein **illustrativer Vier-Rennen-Vergleich**, keine repräsentative statistische Verteilung. Wir sollten die Gruppenzahl am Berg **nicht künstlich auf einen niedrigen Zielwert trimmen**.

## 6. Was ist physikalisches Gesetz, was Modellannahme und was noch KI-Tuning?

| Kategorie | Beispiele | Status |
| --- | --- | --- |
| **Physikalisches Gesetz / Energieerhaltung** | Schwerkraft aus m·g·Steigung, Roll-/Luftwiderstand, verfügbare Kurbelarbeit, tatsächliche Bewegung | Wiederholt durch unabhängige stationäre/dynamische Tests geprüft; Rechenkern nicht geändert |
| **Physiologisches / aerodynamisches Modell** | CP/W′-Beschränkung und Erholung, R-19-Langzeitfaktor, 1D-Formationswindschatten bis 24 m mit hypothetischen Koeffizienten | Intern konsistent geprüft, **Parameter und biologische Genauigkeit nicht abschließend validiert** |
| **KI-Heuristik** | 42-m-Gruppe, 8-Fahrer-Gruppenmodus, Attackenfenster, 900-s-Wiederholungsabstand, 3 jagende Teams, 75-s-Relais, Kletterkapitän-Schwelle 5 km/5,5 % | Regelbasiert und getestete Software, **nicht empirisch optimal** |
| **Bewusst noch nicht simuliert** | 2D-Fahrerlinien, echte Windkanten, Überholmikrostrategie, Sturz-/Defekt-/Verpflegungstaktik, umfassende individuelle Karriereinteressen, KI-Sportdirektor-Dialog, Rennkalender und Gesamtwertung | Nicht Teil der aktuellen Einzelrenn-Engine; keine Features behaupten, die der Code nicht besitzt |

## 7. Verbindliche nächste KI-Schritte

1. **Zuerst Klassiker-KI auf Liège:** Kurze, steile Anstiege, passende Klassiker-/Puncheur-Profile, gezielte Positionierung und wirtschaftliche Attacken prüfen. Keine allgemeine Berg-CP-Extrawatt-Regel blind auf jede 1-km-Rampe anwenden. Kausale Gegenprobe gegen alle vier Einzelrennprofile, besonders Lille. Ob neue Spezialtaktik nötig ist, erst anhand der aktuellen Fahrerpositionen und Wattanforderungen entscheiden.
2. **Danach separat die 108 Angriffe auf Boulogne verstehen:** Häufigkeit, Gründe, echte Gruppenbildung und Kosten in W′ statt nur Eventzähler. Eine vergebliche Attacke ist nicht automatisch ein spielerisches Problem, viele wiederholte identische Versuche derselben Fahrer womöglich schon.
3. **Berg-Zerfall neu beurteilen:** Anstiegsbezogene Gruppen und Zeitabstände mit plausiblen realen Bergankunften vergleichen, ohne „möglichst wenige Gruppen“ als Ziel festzulegen. Schwerkraftphysik nicht verändern, solange keine Gegenprobe einen Fehler ergibt.
4. **Erst nach der schrittweisen Kalibrierung:** große Mehrseed-/Mehrprofil-Validierung **nur bewusst manuell** starten. Keine automatische 36-/60-/500-/1000-Rennen-Serie in der regulären CI. Keine Änderung am Standardmodell ohne ausdrückliche Freigabe.

**Regressions-Leitlinien:** 30 Fahrer / 600 s bei konstantem Führungstempo und 154 Fahrer / 20 km ohne offensive Attacken dürfen nicht unbemerkt wieder fragmentieren. Auf flachen Strecken zählt nicht nur die Größe der größten Gruppe, sondern besonders deren Rückstand auf den Sieger. Auf Bergankünften dürfen dagegen viele kleinere Gruppen und hohe Zeitabstände selbstverständlich vorkommen.

## 8. Aktueller GitHub-Status

- **Verbindliches Ausgangsmodell zur Weiterentwicklung:** groupRidingModel = stable-pack, inklusive eigenem Langpass-/Kletterkapitän-Verhalten aus PR #65.
- **Tatsächlicher Standard in main:** groupRidingModel = legacy, solange kein gesonderter Modellwechsel beschlossen wurde.
- **Bisherige Modi bleiben für Vergleichbarkeit vorhanden:** cohesive, coordinated, relays, relay-paced, front-gated. Nicht alle Teile dieser Modi laufen gleichzeitig in stable-pack; etwa die ältere Funktion decideChaseApproach wird im Rennsimulator nur für relay-paced/front-gated aufgerufen.
- **Testbelege:** PR #64 (264/264), PR #65 (271/271) – https://github.com/Lancester/radsportmanager/pull/64 und https://github.com/Lancester/radsportmanager/pull/65 .
- **R-22 noch offen; R-23 nicht freigegeben.**

Dieses Dokument bitte bei jeder substanziellen KI-Änderung aktualisieren: *Was ist aktiv? Welche Konstante gilt? Welcher Modus benutzt sie tatsächlich? Was ist nur Diagnose oder Testannahme?*
