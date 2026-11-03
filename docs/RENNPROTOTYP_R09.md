# R-09 – Erster vollständiger Rennprototyp: 30 Fahrer, 50 km, Teamtaktik

**Entwicklungsschwerpunkt ab November 2026: Vom isolierten Manöver zu vollständigen, auswertbaren Rennen.**

## Die verbindliche Richtungsentscheidung

**Ein Radsportmanager ist kein exakter Fahrradlenk- oder Reifensimulator.** Die technisch anspruchsvollen R-03–R-08-Experimente bleiben als Regressions- und Physiklabor im Repository erhalten. Sie werden jedoch nicht immer weiter verfeinert, bevor wir echte Rennen beurteilen können.

**Ab jetzt bevorzugt:** Rennen über echte Distanzen mit realen Zeitabständen, unterschiedlichen Streckenprofilen, Leistung, Windschatten, Gruppen, Fahrer- und Teamentscheidungen, Zielankunft, Ergebnisliste und nachvollziehbaren Auswirkungen vorab gesetzter Strategien. Details wie Lenkwinkel, Schräglage, zentimetergenaue Spurwahl und exakte Kollisionen sind **für den spielbaren Manager bewusst nicht vorrangig**.

## Was wurde wiederverwendet, und was nicht?

| Bisherige Arbeit | Verwendung in R-09 |
| --- | --- |
| **Gemeinsamer Physikintegrator** `advanceMotionStep` aus `motion-core.ts` | **Direkt übernommen** für jeden Fahrer: Bewegung, Antrieb, Luftwiderstand, Rollwiderstand, Steigung und Bremsarbeit |
| **CP/W′-Modell** `critical-power.ts` | **Direkt übernommen** als Obergrenze tatsächlicher Kurbelwatt, W′-Verbrauch und vereinfachte Erholung unter CP |
| **FTP** | Eigenständiger Fahrerwert; als Basis für spätere Trainingssteuerung geführt, **nicht mit CP gleichgesetzt** |
| **R-03–R-08-Gruppenphysik, Lücken-KI und Spurüberhol-KI** | **Nicht direkt im Rennsolver für 30 Fahrer**: bleiben als kleinere präzisere Labortests und Wissens-/Regressionstests erhalten |
| **Windschatten** | Als **vereinfachte Gruppenheuristik** im neuen skalierbaren Rennsolver, nicht als exakte Mehrkörper-Aerodynamik |
| **Kurven/Abfahrten** | Fahrtechnik + technische Schwierigkeit bestimmen ein vorsichtiges **physikalisches Bremstempo** bei Abfahrten; kein Lenkwinkel/3D-Kurvenmodell |
| **Team- und Fahrer-KI** | Neue, **regelbasierte** Watt-Entscheidungen nach zugewiesener Rolle und vorab gewählter Teamstrategie |

Es ist daher korrekt: **Der bisherige Code wird nicht weggeworfen.** Aber nicht *jedes* Labor-Modul wird zwanghaft in ein 50-km-Rennen eingebaut. Aufwendige mikroskopische Kollisions-/Spurmodelle würden gerade die Simulation von 30 bis später 160 Fahrern unnötig teuer und fragil machen.

## Erste vollständige Rennausführung

- `src/engine/race/race-simulator.ts` verarbeitet ein **abgeschlossenes** Rennen aus 1–60 Streckenabschnitten, 2–60 Fahrern und 1–30 Teams.
- Die erste Demo: **30 erfundene Fahrer, 5 erfundene Teams, 50 km**, flaches oder hügeliges Streckenprofil.
- Jeder Fahrer erhält eine eigene CP, W′, FTP, Masse, Stirnfläche, Fahrtechnik, Sprintstärke und Risikoneigung; der Seed erzeugt eine kleine reproduzierbare Tagesformstreuung.
- Pro gemeinsamer Zeitschrittberechnung wird Pedalleistung aus **Rollen-/Teamstrategie** angefordert und durch CP/W′ begrenzt. `advanceMotionStep` berechnet die tatsächlich zurückgelegte Strecke und neue Geschwindigkeit.
- Eine vereinfachte Abstandsheuristik bildet **Windschatten** ab. **Gruppen** werden anhand aufeinanderfolgender Längsabstände gebildet, nicht mittels realer zweidimensionaler Spurpositionen.
- Die **hügelige Strecke** enthält echte Steigungs-/Gefällewerte sowie eine technische Abfahrtsbewertung. Schwache Abfahrer müssen früher bremsen – eine Fahrtechnikfähigkeit wirkt damit auf echte Zeitabstände, nicht auf einen fiktiven Minutenbonus.
- Alle Fahrer fahren bis zum **tatsächlichen Zielpunkt**; der Zeitpunkt wird innerhalb des letzten Zeitschritts interpoliert. Ausgabe: Platzierung, Zielzeit, Sekundenrückstand, durchschnittliche Watt, verbleibende W′, mechanische Energie, Rennereignisse und Abstandsgruppen.
- Die Startoberfläche erlaubt die Leitlinien **Kapitän schützen, Offensiv, Sprint, Ausgewogen** für ein fiktives Heimteam.
- Ein direkter **Taktikvergleich** simuliert zweimal dieselbe Strecke, dasselbe Fahrerfeld und denselben Seed. **Nur** die Leitlinie des Heimteams wechselt.

### Die Team-KI

`src/engine/race/race-tactics.ts` ist eine kleine regelbasierte Entscheiderfunktion. Je nach Fahrerrolle, Rennfortschritt, Abstand, Windschatten und W′-Reserve entscheidet sie über **Grundtempo, geschütztes Fahren, Helferarbeit, zeitlich begrenzte Attacke, Verfolgung, Erholung und Sprint**.

**Keine neuronale KI, keine kostenpflichtigen Bibliotheken und kein Online-Modell.** Der Agent fordert **nur Pedalwatt** an. Die Physik und CP/W′ entscheiden, ob daraus ein Zeitgewinn entsteht. Ein offensives Team kann ein anderes Ergebnis erreichen, aber gewinnt nicht automatisch.

### Was das Modell noch NICHT kann

- Gruppen gelten zunächst als **Abstandscluster auf einer Streckenkoordinate**. Einzelne Fahrer werden nicht realistisch innerhalb des Feldes positioniert, und es gibt **keine** Kollisions-/Sturzsimulation in einem 30-Fahrer-Rennen.
- Windschatten und Mehrfahrerformationen sind **heuristisch**, noch nicht empirisch kalibriert.
- Teamrollen sind einfach, **sportliche Leiter treffen noch keine mehrstufigen strategischen Zwischenentscheidungen**.
- CP/W′-Wiederauffüllung ist ein bewusst vereinfachtes Modell. Der aktuelle Prototyp kennt **noch keine komplette Ernährung, Temperatur, Langzeitermüdung, mehrtägige Rennbelastung oder Trainingsanpassung**.
- Die Abfahrtsgeschwindigkeit ist ein Modell aus **Technik-Schwierigkeit, Können und physikalischer Bremskraft**. Keine exakte Kurven-/Reifen-/Lenkdynamik.
- Keine vollständige Rennserie, Transfers, Mitarbeiter, Sponsoren, Karriere, Speichern/Laden, Live-Rennbild oder eigene Fahrer-/Teamkonfiguration im Browser.
- Die Tagesformverteilung ist bewusst klein, reproduzierbar und **nicht** aus echten Renndaten kalibriert.
- Das Modell kann daher Rennabläufe **vergleichbar und technisch belastbar berechnen**, aber **noch nicht als realistisch validierte Profirennsimulation** bezeichnet werden.

## Test- und Abnahmeregel

1. Die bestehenden **169 Physik-/Agententests** müssen unangetastet bestehen.
2. Der neue Renn-Testblock bestätigt vollständige Zielankunft aller 30 Fahrer auf zwei 50-km-Strecken, eindeutige Platzierungen, Energie- und W′-Bilanz, deterministischen Seed und variable Ergebnisse bei Strategieänderung.
3. Im bestehenden GitHub-Pages-Workflow werden der Original-TypeScript-Rennsolver und seine Transitivabhängigkeiten **für den Browser kompiliert**. Der Smoke-Test lässt ein vollständiges Rennen durchlaufen.
4. Die veröffentlichte Seite unter **https://lancester.github.io/radsportmanager/rennen.html** startet Rennen in einem **lokalen Web Worker**, damit Android weiter nutzbar ist.
5. **Keine Erfolgsbehauptung über CI/Pages oder Android-Laufzeit vor erfolgreicher Prüfung.** Die in der GitHub-Node-Umgebung gemessene Laufzeit ist keine echte Android-Messung.

## Nächste große Entwicklungspakete, ohne Mikromanöver-Klein-Klein

1. **Rennplausibilität prüfen:** Verteilung der Zielabstände, Unterschiede Berg-/Sprinter-/Abfahrtsstärke, stabile Gruppenbildung, Sieger/Attacken und Rennlogik; aus echten Rennen später empirisch kalibrieren.
2. **Fahrer- und Team-KI verbessern:** Fahreraufgaben, Kapitän-Unterstützung, Windschatten-/Verfolgungslogik, Attacken aus Rennsituation, Regeneration und Energieeinsatz. Vergleich mit identischem Seed.
3. **Feldgröße auf 60, 100, 160 steigern**, erst nach Performance- und Balancingnachweisen; dennoch weiterhin abstrahierte Pelotonstruktur.
4. **Manager-Rahmen:** Rennen im Kalender, Kader, Mitarbeiter und sportliche Leiter, Trainingsplanung mit separatem FTP und CP/W′, Finanz- und Karriereschicht.

**Kernregel:** Neue Physikdetails nur dann priorisieren, wenn sie ein beobachtbares Problem in einem vollständig gefahrenen Rennen lösen.
