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


## 7. Versuch C: Frühe Kraftreserven sparen, erst in Führungsgruppe auf Schlüsselrampen attackieren

**Technisch tatsächlich gerechnet:** [CI #41806781796](https://github.com/Lancester/radsportmanager/actions/runs/41806781796) **274/274 Tests bestanden**, vollständige vier Referenzrennen, Seed 2026. In `stable-pack` unterdrückt die Einzelrennen-KI für **Klassiker-Kapitäne auf dem langen rampenreichen Klassikerprofil** die allgemeinen opportunistischen Frühattacken. Dadurch bleiben ihre Reserven/ihre normale Fahrweise bis zu den späten Schlüsselanstiegen erhalten. Die gezielte neue, 180 s dauernde `decideClassicsPunch`-Entscheidung bleibt bestehen. Es wurden keinerlei globale Physik- oder Ergebnisboni hinzugefügt.

| Kennzahl | Vor Classics-KI (PR #65) | Versuch B: 180s-Punch ohne frühes Schonen | **Versuch C: zusätzlich frühes Schonen** |
| --- | ---: | ---: | ---: |
| Sieger Lüttich | Sprinter | Sprinter | **Sprinter** (noch offen) |
| Attacken Lüttich | 41 | 67 | **52** |
| Größte Zielgruppe | 46 Fahrer | 36 Fahrer | **33 Fahrer** |
| Rückstand größte Zielgruppe | 706,93 s | 487,33 s | **109,75 s** |
| Fahrer binnen 60 s | 21 | 21 | **27** |
| Maximalgruppen unterwegs | 36 | 39 | **35** |
| Klassikerfahrer in den ersten acht | 1 | 1 | **3** |

**Wichtige tatsächliche Positionsdiagnose bei Kilometer ~215, vor La Redoute:**
- F001 (Klassiker) nur **5,47 m** hinter absoluter Spitze; F036 nur **9,27 m**; F113 nur **8,56 m**. Drei der zehn Klassikerkapitäne stehen also auf relevante Weise **tatsächlich vorne**, statt mehrere Kilometer entfernt.
- Zum Vergleich: Im vorigen Versuch lag F008 bereits **5.127 m** hinter Spitze. Dieser Fehler wurde nicht durch mehr Watt auf der Rampe behoben, sondern durch bessere **taktische Schonung und Aufrechterhaltung der Gruppenposition vorher**.
- Die späteren Attacken bleiben auf die real modellierten Rampen beschränkt: **10 auf La Redoute**, **9 auf Forges**, **10 auf Roche-aux-Faucons** durch zehn Klassikerspezialisten. Kein Spezialangriff auf den frühen Anstiegen.

**Interpretation:** Der Nutzerhinweis auf **Kraftausdauer und Attacken auf kurzen steilen Rampen** war genau richtig; fehlende passende Position vor den Rampen war zusätzlich ein wesentlicher KI-Fehler. Aber auch mit besserer Anfangsposition gewinnen noch Sprinter. Das kann an zu wenig selektiver Rampen-Mehrleistung oder der zu starken Verfolgung auf den anschließenden Flach-/Abfahrtsstücken liegen. **Nicht allein den gewünschten Sieger erzwingen.**

**Nächster konkreter KI-Schritt nach Integration:** Nicht alle zehn Klassiker-Kapitäne gleichzeitig an jeder Rampe losfahren lassen. Einzelner, energie- und rennlagebewusster Angriffsentscheid basierend auf eigener mehrminütiger W/kg-Leistung, konkretem Gruppenpacer und verfügbarer W′/R-19-Reserve; anschließend Verfolgungs-/Kleingruppendynamik auf den letzten 35 km diagnostizieren. Bei Bedarf erst dann die eigenständige *repeated hard effort fatigue resistance* als physiologisches Profilmerkmal mit separater Validierung diskutieren. Die 42-m-Abstandsgruppen, Windschatten, CP/W′-Kern, R-19 und `legacy`-Default bleiben unverändert.

**Freigabegrad:** Sportlich ein echter, aber **vorläufiger** Fortschritt auf einem einzelnen Lüttich-Seed. Größere Mehrseed-/Monte-Carlo-Prüfungen erst wie beschlossen am Ende der KI-Phase.


## 8. Neue gezielte Variante D: Echte Leistungsfavoriten statt automatisch zehn gleichzeitiger Attacken

Auf Grundlage des integrierten Vorab-Favoritenchecks aus [PR #68](https://github.com/Lancester/radsportmanager/pull/68) (und seiner Kombination mit der Klassen-KI in [PR #69](https://github.com/Lancester/radsportmanager/pull/69)) fällt auf: Der objektiv stärkste Klassikerfahrer F003 ist auf der Lüttich-Referenz nur als **Helfer** eingetragen und endet unter dem bisherigen Klassiker-Modell auf Platz **120**, obwohl drei andere Klassikerspezialisten in den Top 8 landen. Die ursprüngliche Rampen-KI ließ **nur fest eingetragene Kapitäne** Spezialattacken fahren. Das ist eine *taktische* Limitation, kein Einwand gegen die CP/W′-/Steigungsphysik.

**Isolierter nächster Versuch:** Bei einem langen, mit mehreren kurzen steilen Anstiegen versehenen Rennen wird je Team der vorab stärkste tatsächliche Klassikerfahrer anhand seiner verfügbaren **3-Minuten-Leistung pro Gesamtgewicht** (`(Tages-CP + min(W′/180 s, 0,25·CP)) / (Körpermasse+Rad)`) bestimmt. Er darf auf den Schlüsselrampen attackieren, auch wenn seine ursprüngliche `role` `helfer` heißt. Er **wird dabei nicht umklassifiziert** und bekommt keine zusätzliche Watt- oder Positionsgutschrift. Für einen neuen Angriff wird aus den Kandidaten derselben realen 42-m-Abstandsgruppe nur der **momentan stärkste verfügbare** Fahrer ausgewählt (aktuelle W′, R-19-Verfügbarkeit, tatsächlich erreichbare Frontposition), außerdem darf der Beginn nicht mehr als 1.000 m hinter der absoluten Rennspitze liegen. Ein physisch begonnener Angriff darf trotz eigener späterer Soloposition aus dem vorhandenen W′-Budget fortgesetzt werden.

**Falsifizierbare Erwartungen:** Weniger nahezu simultane Attacken derselben Gruppe; bessere Beteiligung tatsächlich starker Rampenspezialisten (insbesondere Helfer F003, sofern Position/Reserven passen); weiterhin keine Ergebnisseingriffe in Lille, Boulogne oder Hautacam. Danach den bereits vorhandenen Vierprofil-Smoke mit dem objektiven Vorab-Favoritencheck auswerten. **Vor CI keine Erfolgsaussage oder Aufnahme in main.**
