# R-22 – Warum Klassikerfahrer auf kurzen steilen Rampen attackieren sollten

**Nutzerbeobachtung, 04.11.2026:** Klassikerspezialisten versuchen an kurzen, steilen Anstiegen zu attackieren, weil sie die dafür nötige hohe Leistung pro Kilogramm länger und häufig wiederholt nach vielen Rennstunden halten können. Das ist **nicht** dasselbe wie reine Sprintspitzenleistung oder die gleichmäßige 20- bis 40-min-Bergkapitänsleistung. Diese Unterscheidung ist verbindliche Leitlinie für das derzeit nur experimentelle `stable-pack`-Modell.

## Was die Engine bereits physisch kann

Die unveränderte `critical-power.ts` begrenzt Mehrleistung oberhalb individueller CP durch die zur Verfügung stehenden W′-Joule. Die Steigung und das Gewicht werden in `motion-core.ts` real berechnet. In `endurance.ts` nimmt nach langem Rennen die Leistung abhängig von modellierter Belastung/Verpflegung ab; die Parameter sind derzeit **keine validierte sportphysiologische Profi-Kalibrierung**.

Theoretische obere Leistungskurve **vor** Maximalleistungs-, Ermüdungs- oder Taktikgrenzen, bei komplett nutzbarer W′-Kapazität:

`P(t) = CP + W′ / t`, jeweils pro Fahrer-plus-Rad-Masse. Das ist ein vereinfachter CP/W′-Envelope, **keine** garantierte über 2 bis 5 Minuten real abrufbare Leistung.

| Referenzprofil (mit 7,7 kg Rad) | CP | W′ | Gesamtmasse | P/W bei 2 min | P/W bei 3 min | P/W bei 5 min |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Sprinter | 381,3 W | 38,6 kJ | 87,9 kg | 8,00 W/kg | 6,78 W/kg | 5,80 W/kg |
| Klassikerfahrer | 368 W | 30,0 kJ | 78,7 kg | 7,85 W/kg | 6,79 W/kg | 5,95 W/kg |
| GC-/Bergkapitän | 388,6 W | 18,1 kJ | 71,5 kg | 7,54 W/kg | 6,84 W/kg | 6,28 W/kg |

**Befund:** Unser Modell bildet den Vorteil leichterer Klassikerfahrer und Kletterer bei mehrminütigen Rampen bereits teilweise ab. Bei **2 min** kann der Sprinter dank größerer W′-Reserve sogar noch Vorteile besitzen. **Nicht modelliert als eigener Fahrertypwert** ist die Fähigkeit, nach vielen Rennstunden mehrmals eine solche Attacke zu fahren, ohne überproportional an Effektivität zu verlieren (Fatigue Resistance / Wiederholbarkeit). Alle Archetypen nutzen heute die gleichen allgemeinen R-19-Ermüdungsfaktoren und die gleiche konservative W′-Wiederaufladeformel.

**Keine vorschnelle Lösung:** Einen künstlichen `klassikerSpeedBonus` zu addieren wäre unphysikalisch. Falls die wiederholte Hochintensitätsleistung später einen eigenständigen Parameter braucht, muss dieser als transparente *Leistungs-/Ermüdungsfähigkeit* mit Testverteilung eingeführt und durch tatsächlichen Energieverbrauch bezahlt werden – nicht als Ergebnis- oder Zeitbonus.

## Aktueller experimenteller KI-Prozess (PR #67)

`src/engine/race/classics-punch.ts` erlaubt nur auf einem langen, von mehreren kurzen, steilen Rampen geprägten Einzelrennen einer passenden Klassiker-Kapitänenrolle, bei ausreichender Position und W′-Reserve, eigene physische Attacken. Solche Fahrer sollen nicht passiv einem Sprinter-/Gruppenpacer folgen. Es wird kein Fahrer nach vorne versetzt; die angeforderte Leistung läuft vollständig über R-19, CP/W′ und den realen Bewegungsintegrator.

**Version A:** begrenzte ca. 95-s-Attacke, [GitHub CI #41804815598](https://github.com/Lancester/radsportmanager/actions/runs/41804815598): **274/274 Tests**, aber Liège wieder Sprinter auf Plätzen 1–4; Angriffszahl 68 statt Basis 41. Die anderen drei Etappen unverändert. Das ist **keine sportlich erfolgreiche Lösung**, obwohl softwaretechnisch korrekt.

**Version B – isoliert getestet:** Dieselbe physische Leistung und dieselben Auswahlbedingungen, aber bis zu **180 s zusammenhängende Rampenarbeit**, solange der Fahrer den passenden Streckenabschnitt nicht verlassen hat und noch Reserve besitzt. Bestehende Anstiegs-/W′-/Kühlungsbedingungen und die Logik, eine bereits physisch abgesetzte Attacke fortzuführen, bleiben erhalten. [CI #41805601728](https://github.com/Lancester/radsportmanager/actions/runs/41805601728): **274/274 Tests erfolgreich**, aber Liège wieder **vier Sprinter auf Plätzen 1–4**; größte Zielgruppe 36 Fahrer, 487,33 s hinter Sieger und 67 registrierte Attacken. Lille, Boulogne und Hautacam unverändert. **Eine bloß längere Attacke löst das sportliche Problem noch nicht.**

Die Zeitgrenze `continueAttackS` ist **eine heuristische KI-Entscheidungsdauer** und noch keine empirisch verifizierte optimale Klassikerbelastung. Bei 368 W CP und dem aktuellen `maxAttackCpFraction=1.25` sind das höchstens etwa 92 W oberhalb CP und für 180 s maximal rund 16,6 kJ W′, wenn die volle Anforderung tatsächlich erbracht wird. Die reale Wattforderung kann wegen Steigung, Tempo, R-19 und übriger Grenzen niedriger sein.

**Entscheidendes Abnahmekriterium:** Mehr Attacken oder selbst ein einzelner Klassiker-Sieger reichen nicht. Es muss auf den echten kurzen Rampen eine nachvollziehbare physische Ablösung/Verfolgung stattfinden, ohne die bereits vorhandenen Lille-, Boulogne- und Hautacam-Ergebnisse zu beschädigen. Eine eventuelle stärkere Wiederholbarkeit oder Dauerhaftigkeit klassischer Puncher ist ein späterer, gesondert zu begründender Parameter, **kein** stillschweigender Boost.

## Folgeuntersuchung

1. Ermitteln, auf **welchen** Rampen die Event-Logs tatsächlich angreifen lassen und welche Watt-/W′-Reserven vor/nach den Anstiegen vorliegen.
2. Prüfen, ob Gegner sofort mit derselben Leistung folgen, ob eine echte Lücke entsteht und ob der Vorstoß auf dem folgenden Flach-/Abfahrtsabschnitt überdauert.
3. Nur dann entscheiden, ob es einer anderen **Wattanfrage**, einer rennstrategischen Solo-/kleine-Gruppe-Weiterfahrlogik oder später einer modellierten **wiederholten Kraftausdauerfähigkeit** bedarf.
4. Wie beschlossen nur einen festen Seed auf allen vier vorhandenen Profilen für kleine KI-Schritte; die große Mehrseed-Validierung erst nach der inhaltlichen Korrektur und nur bewusst manuell.

**Wichtig:** Die Sonderregel gilt ausschließlich für `stable-pack`; das standardmäßig unveränderte `legacy` sowie die überprüfte grundlegende Steigungs- und Energiephysik bleiben erhalten. PR #67 wird nur übernommen, falls die CI grün ist und die konkret gemessene Rennen-Verbesserung den Eingriff rechtfertigt.

## 5. Nächste Diagnose aus demselben Einzelrennen

Im vorhandenen `scripts/r22-profile-smoke.mjs` wird nun zusätzlich `R22-CLASSICS-PUNCH-AUDIT` für Liège ausgegeben (kein weiteres Experiment und kein weiterer Seed): **je modelliertem Anstieg** Zahl der tatsächlich ausgelösten speziellen Puncheur-Attacken; für einzelne Fahrer Abstand zur Spitze, Gruppengröße und W′-Reserve unmittelbar vor sowie etwa **5 km nach** der Attacke; außerdem spätere Zielplatzierung. Vor einer weiteren Modifikation soll aus diesen Messwerten getrennt werden: zu geringe Ausgangsdifferenz der Fahrerprofile, zu hohe energetische Kosten oder zu wirksame/zu einfache Gegenverfolgung. Ein eventuell zusätzlicher Kraftausdauer-Parameter darf nur kontrolliert, explizit und mit Energieabbuchung eingeführt werden.


## 6. Neue entscheidende Ursache: Attacken aus bereits abgehängten Gruppen

Die zusätzliche **reale** 154er-Lüttich-Diagnose aus [CI #41806132151](https://github.com/Lancester/radsportmanager/actions/runs/41806132151), **274/274 Tests**, zeigt:

- **26 spezielle Klassiker-Attacken** von **9 unterschiedlichen Fahrern**, tatsächlich an den späten Schlüsselrampen: **9 × La Redoute**, **8 × Côte des Forges**, **9 × Roche-aux-Faucons**; keine solchen Spezialangriffe auf frühen Rampen.
- Ein großer Teil der Spezialangriffe wird bei Kilometer ~216,7 von Fahrern gestartet, die am Checkpoint km 215 bereits **über 5 km hinter der absoluten Rennspitze** liegen. Beispiel F008: vor La Redoute ~5.127 m hinter Spitze, danach bei km 225 ~5.985 m; Zielrang 41, +468,65 s. Er attackiert also in der falschen, bereits abgehängten Gruppe – **kein Defizit in der externen Schwerkraftformel**.
- F141 lag vor La Redoute ~832 m zurück, 5 km danach ~1.285 m zurück, Zielrang 27. Das zeigt: Der Attackenzeitpunkt stimmt, aber die Positionierung/Vorbelastung der Fahrer vorher nicht.
- W′ der meisten gemessenen Fahrer lag bei km 215 wieder bei 100 %; die mangelnde Anschlusslage ist **nicht** allein durch aktuell leeres W′ erklärbar. Frühere Überbelastung, fehlende Gruppenkohäsion und taktische Soloentscheidungen müssen getrennt geprüft werden.

**Neue kleine Hypothese zur Widerlegung:** Offensiv fahrende Klassiker-Kapitäne attackieren zu oft früh beziehungsweise an ungeeigneten Orten und verlieren damit eine konkurrenzfähige Gruppe, ehe sie die entscheidenden Rampen erreichen. Statt den Watt-/W′-Bonus weiter aufzudrehen, wird in `stable-pack` bei einem langen, von mehreren kurzen Rampen geprägten Klassiker die **allgemeine frühzeitige `attackOpportunity` für diese Kapitäne deaktiviert**. Ihre spezielle **späte**, physisch durch CP/W′ begrenzte `decideClassicsPunch`-Attacke bleibt erhalten. Die übrigen Fahrer/Teamstrategien, normale Gruppenregelung und andere Referenzprofile bleiben unverändert. Der neue Vierprofil-Vergleich ist in CI zu prüfen; bei unverändertem Fehlverhalten keine automatische Freigabe.

**Entscheidendes Kriterium:** Nicht „ein Klassiker muss gewinnen“, sondern die geeigneten Klassikerfahrer sollen möglichst **noch im relevanten Vorderfeld** zur Schlüsselrampe gelangen, und erst dann eigenständig nachweisbare physische Lücken fahren. Eine triviale Sonderregel, die mehrere Kilometer Rückstand einfach entfernt, ist ausdrücklich ausgeschlossen.
