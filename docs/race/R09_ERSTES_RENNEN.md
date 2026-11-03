# R-09 – Erster vollständiger 50-km-Rennprototyp

**Datum: 03.11.2026 · Beschlossener Fokuswechsel zu Taktik und ganzen Rennen**

## Warum wir jetzt anders vorgehen

Der Nutzer möchte einen **Radsportmanager, keine minutiöse Fahrrad- und Kurvenphysiksimulation**. Die physikalischen R-01–R-08-Komponenten bleiben bestehen. Wir testen jetzt erstmals ein **vollständiges virtuelles Rennen vom Start bis zur Ergebnisliste**, damit wir das Modell am Renngeschehen statt an einzelnen Mikromanövern beurteilen können.

## Neue Architektur

```
VOR DEM START: sportliche Leitlinie der Teams
    ↓
Renn-KI: chooseRacePower() – Fahrerrolle, Strecke, Situation, W′
    ↓
CP/W′: applyCpWprimeStep() – tatsächliche erlaubte Pedalleistung
    ↓
Bestand: advanceMotionStep() – Geschwindigkeit/Distanz aus Newton und Leistung
    ↑
aktuelle Steigung, Luftwiderstand, Abfahrtsbremsung,
vereinfacht geschätzter Windschatten durch vorausfahrende Fahrer
    ↓
Gruppen, Rennereignisse, Zeit bis zur Ziellinie, Rangliste
```

**Wiederverwendeter Code:** `src/engine/physics/motion-core.ts` und `src/engine/physiology/critical-power.ts`. Das Grundprinzip der aerodynamischen Kräfte bleibt erhalten.

**Bewusst nicht automatisch verwendet:** `drafting-group.ts` und die R-06–R-08-Echtzeit-Spur-/Kollisionsagenten. Diese bleiben **eigene isolierte Referenzen**, aber die neue erste Rennsimulation berechnet zunächst **abstrakte Abstandsgruppen**, nicht 30 physikalisch garantierte 2D-Kollisionen. Dafür verwendet sie eine **vereinfachte, derzeit nicht kalibrierte Windschattenannahme anhand des Abstandes zum vorderen Fahrer** (bei sehr kurzer Lücke maximal 30 % Reduktion des aerodynamischen Widerstands). Diese Heuristik ist **nicht identisch** mit der komplexeren R-03G-Aerokombination. Wir müssen sie anhand plausibler Gruppenabstände untersuchen.

## Erster Spiel-/Testumfang

- **30 fiktive, lizenzfreie Fahrer**, fünf fiktive Teams mit jeweils sechs Fahrern.
- **50 km** als leichter zu validierende erste Rennlänge.
- Zwei Kursprofile: **wellig** (Ebene, Anstieg, technische Abfahrt, Talstraße, Schlussanstieg, Abfahrt, Finale) und **flach**.
- Fahrer besitzen CP/W′, eigenständigen FTP-Wert, Masse, CdA, Fahrtechnik für Abfahrten, Sprintstärke und Angriffslust.
- Der Spieler bestimmt **vor dem Rennen** eine Leitlinie für Team Nordwind: `kapitaen_schuetzen`, `offensiv`, `sprint` oder `ausgewogen`. Andere Teams agieren eigenständig mit festen fiktiven Leitlinien.
- Taktische Regelentscheidung etwa alle **10 virtuellen Sekunden**, Physikschritt etwa **1 s** – bewusst weniger mikroskopisch als der Achtfahrer-0,2-s-Solver. Es gibt **keine direkte Wattsteuerung durch den Spieler während des Rennens**, passend zur Geschäftsführer-/Sportdirektorenrolle.
- Erste Aktionen: Grundtempo/Windschatten, Helferarbeit, zeitlich begrenzte Attacken, Verfolgung, Erholungsphasen und Zielsprint. **Nur Leistungswünsche** – die Physik entscheidet über Geschwindigkeit und real erzielte Abstände.
- Technische Abfahrten: Fahrtechnik bestimmt eine vorläufige **sichere Zielgeschwindigkeit**; oberhalb davon werden Kurbelwatt reduziert und echte Bremskräfte über den gemeinsamen Physikkern angewendet. **Keine Lenkwinkel-, Schräglagen- oder Kurven-3D-Simulation**.
- Zielzeiten werden beim Überschreiten der Enddistanz **innerhalb des letzten Zeitschritts interpoliert**. Alle Fahrer werden klassifiziert; differenzierte Rückstände und Einzelfahrer-W′-Bilanz werden ausgegeben.
- Seedgesteuerte, kleine **deterministische fiktive Tagesformvariation** (±2 % CP). Gleicher Seed und identisches Rennen ergeben identische Klassifikationen, anderer Seed verändert den Rennverlauf. **Kein nachträgliches Auslosen des Siegers**.
- Kleine, chronologische Ereignisliste (`attack`, `chase`, `sprint`, `recovery`, `segment`, `group-split`, `finish`) und Meilenstein-Snapshots alle 5 km.

## Was der Spieler schon ausprobieren kann

`https://lancester.github.io/radsportmanager/rennen.html`

Eine mobile Seite mit Rennauswahl, Teambus-/Leitlinienentscheidung, vollständiger Ergebnisliste, Teamkennzeichnung, Rennereignissen und Gruppenübersicht. Besonders wichtig ist der Knopf **„Zwei Taktiken vergleichen“**: gleicher Seed, gleiche Fahrer, gleiche Strecke, aber einmal „Kapitän schützen“ und einmal „offensiv fahren“. Es werden **zwei vollständige Rennen** berechnet, keine manipulierten Tabellenpositionen.

Alle Berechnungen erfolgen **lokal im Browser-Web-Worker**, derzeit ohne Spielstand, Registrierung, Serverdatenbank und ohne Offline-Service-Worker. Die Veröffentlichung erfolgt nach bestandenem GitHub-Build über denselben bisherigen Pages-Workflow.

## Klare Grenzen der Aussagekraft

**Ein vollständiger Renndurchlauf ist nicht gleich eine realistische Profirennsimulation.**

- Windschatten eines großen Feldes derzeit nur als Abstandsheuristik, ohne 2D-Peloton-Positionen und dynamische, physikalisch gesicherte Überholspuren.
- Abstandsgruppen werden aus Fahrerdistanzen gebildet, nicht aus koordinierter taktischer Zusammenarbeit oder gemeinsamem Gruppenpace.
- **Angriff und Verfolgung** folgen einfachen regelbasierten Fahrerentscheidungen, noch keinem übergreifenden Sportdirektoren-Knowhow und keinem ausgehandelten Flucht-/Peloton-Spiel.
- **CP und W′** sind fiktive Profile mit linearer, nicht wissenschaftlich kalibrierter Wiederauffüllung. Gerade über eine Rennstunde oder mehr fehlt die Ermüdung **unter CP**, die Ernährung, die Rennerfahrung und der Einfluss von Vortagen.
- Fahrtechnik beeinflusst in Abfahrten bisher **nur die notwendige Bremsung**, keine reale Risiko-/Sturzentscheidung.
- Streckenabschnittswechsel werden mit Zeitschrittapproximation statt exaktem adaptivem Grenzschnitt gerechnet. Energiegleichung stammt weiterhin aus dem vorhandenen Integrator; das verkürzte Zielintervall des letzten Schritts wird für die Zeit interpoliert.
- Die Zielzeiten und sportlichen Resultate sind fiktiv und bislang **nicht mit echten Rennstatistiken kalibriert**. Neue Testfälle sollen insbesondere Plausibilität von Gruppensplits, Fluchten, Favoriten, Sprints, Zeitabständen und Leistungsprofilen prüfen.

## Abnahme und nächster Meilenstein

- `tests/r09-race.test.mjs` prüft vollständiges Finish aller Fahrer, steigend geordnete Zielzeiten, Distanz, Energie-/W′-Bilanz, veränderte Strategien, Abfahrtbremsen, Seed-Reproduzierbarkeit, Teamreihenfolge, Ereignisse, Fehlerfälle und Rennen auf beiden Profilen.
- GitHub Actions soll **alle bisherigen 169 Tests** plus neue Rennprüfungen, TypeScript-Browser-Build, Node-ESM-Vollrenn-Smoke und Pages-Deployment bestätigen. Vorher **keine erfolgreichen Testzahlen behaupten**.
- **Nächste fachliche Arbeit nach echtem Test:** mehrere Rennläufe vergleichen, unplausible große Zeitabstände/Attacken-/Gruppendynamik identifizieren und gezielt korrigieren. Danach größere Felder (60, später 160) und längere Rennen hinsichtlich Android-Performance messen, **nicht blind wieder mikroskopische Spurmodelle ausbauen**.

Dies ist ein **bescheidener, aber funktionaler Renn-Kern**; er soll erstmals über das tatsächlich entstehende Manager-Spielerlebnis und bessere taktische Entscheidungen Aufschluss geben.


## R-09: drei vollständige Rennen als Plausibilitätsdiagnose (03.11.2026)

Die neue Rennsimulation wurde **ausdrücklich nicht als realistisch kalibriertes Profirennen** freigegeben. Ein kurzer Diagnoselauf von drei vollständigen Rennen steht jetzt dauerhaft als reproduzierbares Script unter `scripts/r09-race-diagnostics.mjs`. [PR #41](https://github.com/Lancester/radsportmanager/pull/41) ist integriert; der tatsächlich erfolgreiche [GitHub-Actions-Lauf #41715064254](https://github.com/Lancester/radsportmanager/actions/runs/41715064254) bestätigt **183/183 Tests, 0 Fehler, drei komplette Rennläufe, Browser-Build und Pages-Deployment**.

| 50-km-Profil (je 30 Fahrer, Seed 2026) | Sieger | Siegerzeit | letzter Rückstand | beobachtete Maximum-Abstandsgruppen | protokollierte Gruppenaufteilungen / Verfolgungswechsel |
| --- | --- | ---: | ---: | ---: | ---: |
| Hügelig – Kapitän schützen | F07 | 4.433,0 s | 577,2 s | **30** | 135 / 319 |
| Hügelig – Team Nordwind offensiv | F13 | 4.446,4 s | 561,7 s | **29** | 147 / 155 |
| Flach – Team Nordwind Sprint | F07 | 4.181,5 s | 367,8 s | **15** | 52 / 415 |

Die drei Läufe waren auf GitHub-Runner etwa **374–549 ms** Rechenzeit, **keine Android-Messung**. Hügelig „Kapitän schützen“: F07 siegt nach rund **1:13:53 h**, 30 Fahrer erreichen das Ziel bis ca. **1:23:30 h**. Die durchschnittliche tatsächlich gefahrene Kurbelwatt über alle Fahrer beträgt ca. **271,4 W**. Über drei Szenarien 10–15 Sprint- und Angriffsevents; diese Modellzahlen sind nicht als repräsentative Profirennstatistik auszugeben.

**Wichtige Bewertung:** Die körperlichen/energetischen Zahlen werden aus denselben bisher verwendeten Kernen berechnet. Die derzeitige größere Rennfeldabstraktion führt allerdings zur **starken Feldfragmentierung** (im Hügelkurs zeitweise 30 einzelne Abstandsgruppen für 30 Fahrer) und **sehr vielen Wechseln zur Verfolgung**. Das ist **nicht ausreichend glaubwürdig**, um schon taktische Rennergebnisse zu bewerten. Gruppenaufteilungen zählen Übergänge der einfachen Abstandsklassifikation und sind noch keine sauber modellierten Fluchtgruppen. Die Windschatten-Heuristik ist noch nicht die validierte Gruppendynamik.

**Taktik wirkt numerisch:** Bei identischem Seed und Profil fuhr F01 mit offensiver statt Kapitän-schonender Leitlinie rund **61,254 s schneller** (4.575,293 s → 4.514,039 s), belegte in beiden Fällen Rang 5. Die Änderung kann sogar den Sieger ändern (F07 vs. F13), obwohl nur Team Nordwind eine andere Strategie erhielt – plausible indirekte Wechselwirkung ist möglich, noch nicht gegen reale Rennen kalibriert.

**Neue höchste Priorität:** [Issue #42 – echtes Peloton, Gruppen-Zusammenhalt, Ausreißer/Verfolgung und taktisches Balancing](https://github.com/Lancester/radsportmanager/issues/42). Zuerst die 30-Fahrer-/50-km-Gruppenlogik glaubwürdig machen; erst danach größere Felder und lange Rennen. **Weitere Lenk- und Kurven-Mikrophysik aus Issue #39 zurückstellen**, solange deren Nutzen für die Rennqualität nicht nachgewiesen ist.

**Ehrliche App-Beschreibung:** Die neue `docs/rennen.html`-Seite erklärt nun korrekt, dass die Fahrer vorerst nach einfachen Taktikregeln autonom handeln. **Eigenständige sportliche Leiter und Personalmanagement existieren im Rennprototyp noch nicht.**
