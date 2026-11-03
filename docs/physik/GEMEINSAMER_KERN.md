# Gemeinsamer dynamischer Physikkern – Zusammenführung der bisherigen Modelle

**Stand: 03.11.2026 · Issue #18 · PR der aktuellen Änderung.**

## Warum diese Umstellung?

Bisher hatten wir zwei voneinander getrennte Implementierungen für die **dynamische Fahrt**:
- `dynamic-route.ts`: mehrere Streckenabschnitte, Anstieg, Abfahrt, Beschleunigung, explizite Bremskraft.
- `corner-route.ts`: vorausschauendes Kurvenbremsen und rotierende Laufradträgheit.

Beide rechneten ähnliche Kräfte und Geschwindigkeitsschritte jeweils selbst aus. Das birgt das Risiko, dass nach Änderungen unterschiedliche Physik in beiden Programmen steckt.

**Neu:** Die gesamte dynamische Zeitschrittrechnung und Kräftebilanz liegen in **einer** Datei: `src/engine/physics/motion-core.ts`. Beide alten Dateien sind nur noch **schlanke, kompatible Adapter**, sodass die bisherigen Testaufrufe erhalten bleiben.

**Ausdrückliche Abgrenzung:** `steady-state.ts` mit den Referenzgleichungen aus R-01/R-02 bleibt bewusst separat. Der *stationäre* Solver dient zur unabhängigen Kontrolle der Gleichgewichtsgeschwindigkeit und ist nicht eine zweite dynamische Simulation.

## Was beherrscht der gemeinsame Kern?

Ein einzelner Fahrer kann jetzt mit einer konsistenten Physikberechnung:
- aufeinanderfolgende Straßenabschnitte fahren und seine Geschwindigkeit kontinuierlich fortschreiben;
- mit Pedalwatt beschleunigen und durch Luft-/Rollwiderstand verzögern;
- bergauf gegen die Schwerkraft arbeiten und bergab ohne Treten schneller werden;
- durch **explizit angegebene Bremskraft** verzögern;
- vor einem Kurvenpunkt aus Radius, Reibwert und Sicherheitsfaktor ein zulässiges Einfahrtstempo ableiten und rechtzeitig bremsen;
- die rotierende Trägheit der Laufräder als zusätzliche **wirksame Beschleunigungsmasse** berücksichtigen;
- für jeden Abschnitt einen nachvollziehbaren Energie- und Zeitbericht ausgeben.

Alle Eigenschaften können jetzt **innerhalb eines einzigen Simulationslaufs gemeinsam** vorkommen. Beispielsweise: 300 m bergauf, 300 m bergab vor enger Kurve, 100 m manuelle Bremsung und anschließend 200 m Wiederbeschleunigung. Ein solcher kombinierter Fall ist durch einen neuen Integrationstest abgedeckt.

## Prinzip der Modellkopplung

Aus momentaner Geschwindigkeit, Streckensteigung, Rad-/Fahrermasse, CdA, Crr, Pedalwatt, optionaler Drehträgheit und Reifengrip wird für einen kleinen Zeitschritt die resultierende Kraft berechnet:

`F_netto = F_Antrieb − F_Luft − F_Rollen − F_Steigung − F_Bremse`

Die zeitliche Geschwindigkeitsänderung folgt aus:

`m_eff × dv/dt = F_netto`

mit `m_eff = m + I/r²` für zusätzliche rotierende Trägheit. Die Steigungskraft selbst bleibt **m × g × sin(alpha)** mit der realen Masse `m`, nicht der wirksamen Zusatzmasse.

Vor einer Kurve wird die benötigte Bremsstrecke geschätzt und mit dem verfügbaren Abstand verglichen. Der Fahrer muss eine physikalisch erreichbare Verzögerung ausführen: Die Geschwindigkeit wird **nicht** unmittelbar auf das Kurvenlimit gesetzt. Das ist weiterhin nur die vereinfachte *Kurvenpunkt*-Darstellung ohne geometrischen Kurvenbogen.

## API und Dateien

| Datei | Aufgabe |
| --- | --- |
| `src/engine/physics/motion-core.ts` | **Einziger dynamischer Solver**; vereinte Kräfte, numerische Integration, Kurvenvorschau, manuelle Bremsung, Energiebilanzen |
| `src/engine/physics/dynamic-route.ts` | Bestehende dynamische API; leitet an den gemeinsamen Kern weiter und behält die bisherige Ergebnisstruktur und das bisherige Standard-Schrittlimit von 2 Mio. bei |
| `src/engine/physics/corner-route.ts` | Bestehende Kurven-API; leitet an denselben Kern weiter |
| `src/engine/physics/steady-state.ts` | Separater stationärer Referenzsolver aus R-01/R-02 |
| `tests/unified-motion.test.mjs` | **Vier neue Integrationstests** für die gemeinsame Engine |
| `benchmarks/isolated-riders.mjs` | **Nur manuell ausführbarer** Kurzbenchmark, ohne GitHub Actions |

Der neue Kern besitzt keine UI- oder Browserabhängigkeit und lässt sich später prinzipiell in einem Web Worker ausführen.

## Tatsächlich ausgeführte Tests

Alle **49 Tests** wurden **gemeinsam in einem lokalen Lauf** mit Node.js **22.16.0** ausgeführt:

| Suite | Tests | Ergebnis |
| --- | ---: | --- |
| R-01 stationäre Ebene | 7 | 7 bestanden |
| R-02 stationärer Berg | 9 | 9 bestanden |
| Dynamische Streckenabschnitte | 15 | 15 bestanden |
| Kurven und Laufradträgheit | 14 | 14 bestanden |
| **Neue gemeinsame Integration** | **4** | **4 bestanden** |
| **Gesamt** | **49** | **49 bestanden, 0 Fehler** |

Zusätzlich wurde die **statische TypeScript-Typprüfung** mit `tsc 5.8.3` erfolgreich ausgeführt (ohne JavaScript-Ausgabe).

**Reproduzierbare lokale Befehle:**
- `npm test` für alle 49 Tests;
- `npx tsc --noEmit --target ES2022 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions src/engine/physics/*.ts` (nur bei lokal vorhandenem TypeScript-Compiler);
- `node --experimental-strip-types benchmarks/isolated-riders.mjs` für eine **bewusst manuelle** Performance-Messung.

Noch **kein** GitHub-Actions-Testlauf, Browser-/Web-Worker-Lauf oder Android-Test.

## Erste kleine Leistungsprüfung – kein Smartphone-Benchmark

Auf der lokalen Node.js-Umgebung mit **22.16.0**, nach Warm-up und jeweils drei Messwiederholungen, ergaben sich ungefähr folgende **Median-Laufzeiten**:

| Anzahl voneinander unabhängiger Fahrer | Strecke je Fahrer | Gesamtrechenschritte | Median |
| ---: | ---: | ---: | ---: |
| 1 | 4 km | 1.886 | 7,14 ms |
| 20 | 4 km | 37.720 | 126,15 ms |
| 160 | 4 km | 301.760 | **960,46 ms** |

**Bitte keinesfalls mit einem 160-Fahrer-Rennen gleichsetzen!** Diese Tests rechnen jeden Fahrer unabhängig. Es fehlen Windschatten, Feldpositionen, Gruppenbildung, autonome KI und alle 200-km-Etappenabschnitte. Außerdem war dies **kein Android-Gerät**. Eine lineare Hochrechnung auf 200 km oder ein Urteil über Smartphone-Spielbarkeit wäre derzeit unzulässig.

Die Zahlen zeigen nur: Die gewählte TypeScript-Grundidee ist vorläufig **nicht offensichtlich unbrauchbar**, aber reale Performance kann erheblich schlechter sein. Wir benötigen ein echtes Android-Profiling und wahrscheinlich eine effizientere Ausführung als pro Fahrer 35 Intervallhalbierungen je 0,25 Sekunden.

## Offene Grenzen und Entscheidungen

1. **Kurvenmodell:** Kurvenkontrollpunkt vs. echte Kurvenbogenlänge und kontinuierliche Krümmung. Die realitätsnähere Lösung ist noch nicht umgesetzt.
2. **Fahrerisches Können:** Der Nutzer wünscht später Talent, Fahrtechnik, Risikobereitschaft und gezieltes Abfahrtstraining. Es soll durch bessere Entscheidungen, Linien und Fehlerwahrscheinlichkeiten wirken, nicht über pauschale Wattboni. Details sind offen (eigenes Issue #19).
3. **Reifen und Reibkreis:** Das aktuelle Kurvenpunktmodell kombiniert Längs- und Querhaftung noch nicht über einen vollständigen Reibkreis.
4. **Physiologie:** Leistungs-Dauer-Grenzen, Ermüdung und Ernährung müssen vor realistischen langen Rennen gekoppelt werden.
5. **Feldposition/Windschatten:** Noch keine Nachbarschafts- und Gruppenberechnung; nächster fachlicher R-03-Schritt.
6. **Rechenaufwand:** Echte Android- und Web-Worker-Tests mit Rechenzeit-/Speicherprofil notwendig. Die bisherigen 160 unabhängigen Fahrer liefern nur eine untere Komplexitätsidee, **keine Garantiezahl**.
7. **Parameter:** 0,25-s-Schritt, 180 N Anfahrkraft und weitere Werte sind bewusst nicht kalibriert.

**Nächster Schritt nach Abschluss dieses Issues:** Kleine **R-03-Zweiergruppe mit physikalisch begründetem Windschatten**, anschließend Positionswechsel und erst dann eine größer werdende Gruppe. Gleichzeitig einen reproduzierbaren Android-/Web-Worker-Benchmark vorbereiten. Fachliche Annahmen weiterhin im Chat vollständig diskutieren.
