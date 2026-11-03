# Tests, Realismus, Kalibrierung und Performance

**Status:** Teststrategie, noch keine Messdaten.

## Warum testen?

Realistisch wirkende einzelne Siege reichen nicht aus. Das Modell muss über viele Rennen plausible Leistungsunterschiede, Etappenarten, Zeitabstände, Gruppendynamiken und Ausreißerchancen erzeugen. Sportliche Entscheidungen müssen einen messbaren, erklärbaren Effekt haben.

## Teststufen

1. **Unit-Tests:** Physikformeln, Leistungsgrenzen, Energiebuchhaltung, Seed-Generator, Eingabevalidierung und Berichtsdaten.
2. **Integrationstests:** Mehrere Fahrer und Teams interagieren, Gruppen splitten, das Ziel wird korrekt erreicht, keine Zeit-/Energiefehler.
3. **Deterministische Regressionstests:** Fester Seed + fester Input ergibt dasselbe Ergebnis; Codeänderungen mit Goldens prüfen.
4. **Monte-Carlo-Reihen:** Identisches Szenario mit verschiedenen Seeds 100, 1.000, 10.000 oder mehr Male rechnen, statistische Verteilungen analysieren.
5. **Realitätsvergleich:** Plausibilitätskriterien und – soweit rechtlich nutzbar – echte Renndaten. Parameter nicht blind auf gewünschte Sieger optimieren.
6. **Android-Benchmark:** Laufzeit, Speicherbedarf, UI-Reaktionsfähigkeit, Akkubelastung und Verhalten bei Unterbrechung.

## Beispiele für statistische Kennzahlen

- Sieganteile nach Leistungsprofil und Streckentyp.
- Top-10-Häufigkeit, Zeitabstände, Ausreißererfolge, Sprint-/Bergplatzierungen.
- Korrelation sportlicher Leistung und Platzierung unter vergleichbaren Bedingungen.
- Auswirkung von Taktik, Teamstärke, Windschatten, Versorgung und Ermüdung.
- Anzahl unrealistischer Zustände (negative Energie, unphysikalische Geschwindigkeit, unerreichbares Ziel).
- Rechenzeit pro Rennen und Skalierung von 20 bis 160+ Fahrern.

## Gegenproben

Nur eine Variable verändern und bei sonst identischen Seeds vergleichen:
- Mehr Leistungsvermögen sollte statistisch helfen, aber keinen Sieg garantieren.
- Stärkere Steigung soll passende Fahrer begünstigen.
- Geschützter Fahrer soll im plausiblen Kontext Energie sparen.
- Höherer Ermüdungszustand soll Leistung begrenzen.
- Fehlerhafte Taktik soll unter plausiblen Bedingungen messbar schaden.

## Testgrößen – vorläufig

| Stufe | Rennen | Ausführung |
| --- | ---: | --- |
| Schneller Check | 10–100 | Automatisch bei PR, nur wenige Tests |
| Größere Regression | ~1.000 | Gezielte Entwicklungsläufe |
| Monte Carlo | 10.000–100.000 | Manuell, mit Laufzeitlimit |

Die tatsächlichen Mengen erst nach Benchmarks definieren. Keine unbegrenzte Dauerlast auf GitHub Actions.

## Ergebnisbericht

Ein automatischer Testbericht soll Testversion, Seed-Bereich, Code-Commit, Szenario, Anzahl Rennen, Kennzahlen, Konfidenz/Unsicherheit, Ausreißer und offene Probleme enthalten. **Beispielzahlen sind nie Messwerte.**

## Abnahmeprinzip

Ein Rennen darf überraschend ausgehen. Entscheidend ist, dass die Engine plausible Ursachen dafür kennt und die langfristigen Verteilungen realistisch sind. Die Teststrategie selbst wird nach ersten Experimenten weiterentwickelt.


## Konkrete Testszenarien und Messkriterien

Siehe **[REFERENZSZENARIEN.md](REFERENZSZENARIEN.md)**, Abschnitte 3 bis 5, für:
- die acht Testfälle **R-01 bis R-08** mit Beispielparametern;
- reproduzierbare Vergleichsbedingungen (feste Eingaben, Seed und Engine-Version);
- qualitative, physikalisch begründete Erwartungen ohne erfundene Siegerquoten;
- die übergreifenden Anforderungen **A-01 bis A-12**;
- den Unterschied zwischen **dokumentierten Testfällen** und tatsächlich **bestandenen Tests**.

**Reihenfolge:** Zuerst R-01 (Ebene) und R-02 (Berg) mit deterministischer Physik; später R-04 (Ermüdung), R-03 (Windschatten) und R-05/R-06 (Renn-KI). Diese Reihenfolge ist vorläufig und wird gemeinsam abgestimmt.

**Noch keine Messdaten:** Monte-Carlo-Testzahlen, Benchmarkzeiten und statistische Verteilungen sind weiterhin offen.


## R-01 – erste tatsächlich ausgeführte Referenztests (03.11.2026)

In [physik/R01_EBENE.md](physik/R01_EBENE.md) ist die stationäre 20-km-Ebenenrechnung beschrieben. Die kleinen TypeScript-Tests in `tests/r01-flat.test.mjs` wurden **lokal unter Node.js 22.16 ausgeführt: 7 von 7 bestanden**. Die numerischen Erwartungswerte stammen aus einer unabhängig ausgeführten Python/SciPy-Brent-Lösung. Die Prüfung umfasst 250/300 W, Luft-/Rollleistung, Wirkungsgrad, CdA- und Massengegenproben, Determinismus und ungültige Eingaben.

**Nicht behauptet:** Validierung gegen reale Rennleistungsdaten; tatsächliche Leistungsmessung; Android-Benchmark; Gruppen-, Ermüdungs- oder Monte-Carlo-Prüfung. Keine Actions-Minuten benötigt.

## R-02 – stationäre Bergreferenzen und Regressionstests (03.11.2026)

Die gemeinsame Physikfunktion wurde mit **16 lokalen Node.js-Tests** geprüft: **7 R-01** + **9 R-02**, alle bestanden. Referenzwerte für R-02 wurden mit Python/SciPy-Brent unabhängig vom TypeScript-Solver berechnet.

Neue Prüfpunkte: 60/80-kg-Vergleich bei gleichen 300 Pedal-W, 7-%-Geometrie und Höhenenergie, Einzelleistungsbilanz (Luft + Rollen + Schwerkraft = Hinterrad), monotone Steigungen, Abgleich bei 0 % mit R-01, getrennte Ausrüstungsparameter CdA/Masse, Reproduzierbarkeit und ungültige Eingaben.

Ausführliche Werte: [physik/R02_BERG.md](physik/R02_BERG.md). Es wurden weder ein realer Profi-Radfahrer noch Wind, Beschleunigung, Peloton oder eine Monte-Carlo-Simulation kalibriert. Testzeit lokal unter 1 s; **keine** Actions-Läufe erforderlich.

## Dynamische Route – lokaler Teststand (03.11.2026)

15 neue dynamische Node.js-Tests bestanden. Die unveränderten 16 früheren R-01/R-02-Tests wurden dabei nicht erneut ausgeführt. Prüfungen: Übergänge exakt am Abschnittsende, ununterbrochene Geschwindigkeit, Verhalten auf Ebene/Berg/Abfahrt, manuelle Bremsung, mechanische Arbeits-/Höhenbilanz, Start aus dem Stillstand, eindeutige Reproduzierbarkeit und Zeitauflösungs-Konvergenz. Referenzbeispiel: 4 km, **470,8713 s**, Höhendifferenz 0 m.

Dokumentation: [physik/DYNAMISCHE_STRECKE.md](physik/DYNAMISCHE_STRECKE.md). Neue Testdatei: tests/dynamic-route.test.mjs, mit npm run test:route oder in der gesamten npm-test-Suite ausführbar. Keine GitHub-Actions-Durchläufe und noch kein Android-Benchmark.

## Kurvenvorschau und Radrotation: 14 neue lokale Tests (03.11.2026)

Der separat ausgeführte Test `npm run test:corners` überprüft Radius-/Gripgrenzen, frühzeitiges Bremsen, das Fehlen von Geschwindigkeits-Sprüngen, nasse Fahrbahn, unterschiedliche Radträgheit, stationäre Geschwindigkeit, Abschnitts-Energiebilanz, reproduzierbare Resultate, Inputvalidierung, unerreichbare Bremswege, Kurvenvorschau über Abschnittsgrenzen, Zeitschrittänderung und zwei Kurven.

**14 von 14 neuen Tests lokal erfolgreich.** Die alten stationären/dynamischen Tests wurden **nicht erneut** als gemeinsame Suite ausgeführt; **kein** GitHub-Actions-Test. Quelle und Benchmarkgrenzen: [physik/KURVEN_UND_ROTATION.md](physik/KURVEN_UND_ROTATION.md).

## Erste tatsächlich gemeinsame Gesamtsuite und Benchmarks (03.11.2026)

Erstmals wurden alle bisherigen Physikmodule nach ihrer Zusammenführung in **einem lokalen Testlauf** geprüft:

- R-01: 7 bestanden; R-02: 9 bestanden; dynamische Strecken: 15 bestanden; Kurven/Rotation: 14 bestanden; **gemeinsame Integration: 4 bestanden**.
- **Gesamt 49 von 49 Tests bestanden**, keine Fehler, Node.js 22.16.0. Zusätzlich TypeScript-Typprüfung mit `tsc 5.8.3` erfolgreich.
- Benchmark auf lokaler Node-Umgebung: jeweils drei Läufe; Median **7,14 ms für 1**, **126,15 ms für 20** und **960,46 ms für 160 voneinander unabhängige Fahrer über je 4 km**. Ohne Gruppendynamik/KI und ohne Android ist das keine Messung eines Rennens.
- Keine GitHub Actions oder Cloud-Lasttests gestartet.

Detaillierte Testabnahme und Grenzen: [physik/GEMEINSAMER_KERN.md](physik/GEMEINSAMER_KERN.md).

## R-03 – erste gekoppelte Zweierfahrer-Tests (03.11.2026)

**Vollständige lokale Suite erfolgreich:** 64/64, davon **15 neue R-03-Tests** und **49 vorherige Regressionstests**, keine Fehler, Node.js 22.16.0. TypeScript 5.8.3 Typprüfung ebenfalls bestanden.

Neue Checks: Luftwiderstandsreduktion vs. unveränderter Rollwiderstand, vordere/hintere Position, Längs- und Seitenabstand, statische Wattreferenzen bei 39,6 km/h, synchrone Integrationsschritte, Kräfte-/Energiebilanzen, Lückenzunahme, Führungswechsel, Kollisionserkennung, szenarische Leistungsänderung, Zeitschrittkonvergenz, identische Wiederholung und Eingabevalidierung.

**Benchmark (rein lokal, kein Android):** 1, 10 und 100 wiederholte 12-s-Zweierläufe haben in 3 Node-Messläufen Medianlaufzeiten von ca. **0,82 / 8,39 / 41,15 ms**. Dies sind *unabhängige Zweierfahrten*, keine miteinander wechselwirkenden 200-km-Gruppen.

Noch fehlend: empirisch kalibrierte Windschattenparameter, Querwind, 3+ Fahrer, 2D-Bewegung, Leistungs-Dauer-Profil und echte Android-/Web-Worker-Laufzeitmessung. Herleitung und Quellengrundlage: [physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md](physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md).

## Browser-/Android-Benchmark zunächst technisch vorbereitet (03.11.2026)

**Geprüft:** 64/64 bisherige Node.js-Tests, TypeScript-Übersetzung der originalen R-03-Engine nach Browser-JavaScript, manueller Worker-Aufruf in einer kontrollierten Node-Testumgebung mit reproduzierbaren Prüfsummen auch für 80 unabhängige Paare/120 s (ein einzelner lokaler solcher Lauf ca. 0,43 s). **Nicht geprüft:** tatsächliches Android-Gerät, echter Browser-Web-Worker, veröffentlichtes Pages-Deployment und große, interagierende Gruppen.

Ein kleiner GitHub-Pages-Workflow soll bei relevantem Commit genau dieselben 64 Tests wiederholen und die Browserseite veröffentlichen. Die tatsächliche GitHub-Ausführung wird erst nach erfolgreichem Workflowlauf als bestanden verbucht. Die Android-Messwerte werden nach Nutzerbericht in die Validierungsdokumentation aufgenommen.

[Android-Testanleitung und Testgrenzen](ANDROID_BENCHMARK.md).


## Erster tatsächlich durchgeführter Android-Test (03.11.2026)

**Ergebnis vom Nutzer direkt aus dem Android-Browser übermittelt:** Die veröffentlichte GitHub-Pages-Webseite und ihr Web Worker führen die R-03-Physik tatsächlich auf Android aus. Die frühere Formulierung, dass es noch keinen echten Android-Lauf gibt, ist damit für den **kleinen Test** überholt. **Mittlerer und großer Test sind weiterhin offen.**

| Messgröße | Erster Android-Test |
| --- | --- |
| Veröffentlichter Git-Stand | `dffcf78` (Fix-Commit aus PR #25) |
| Browser | Chrome 156 auf Android (User-Agent meldet eine reduzierte Android-Kennung, keine verifizierte OS-Version) |
| Zeitpunkt des Berichts (UTC) | 2026-11-03T17:00:40.740Z |
| Testumfang | 1 Zweiergruppe, 2 Fahrer, 12 virtuelle Sekunden |
| Rechenschritte | 60 pro Wiederholung |
| Wiederholungen | 3 |
| Rechenzeiten | **18,8 ms / 7,1 ms / 4,6 ms** |
| Median | **7,1 ms** |
| Simulations-Prüfsumme | **276,626283** (innerhalb der drei Wiederholungen gleich) |
| Laufzeitumgebung | **Web Worker im Android-Browser** |

**Interpretation:** Echter erster Machbarkeitsnachweis für die R-03-Zweierfahrt auf Android, inklusive vom Browser zurückgelieferter, reproduzierbarer Prüfzahl und messbarer Laufzeit. Der deutliche Unterschied zwischen den drei Messungen könnte mit JIT-Warm-up, Caches oder Systemschwankungen zusammenhängen; er ist **nicht** als Ursache verifiziert. Die Prüfsumme wurde bisher nur zwischen den Wiederholungen auf diesem Gerät als gleich bestätigt, **noch nicht separat gegen eine unabhängige Node-Referenz derselben Buildversion verglichen**.

**Nicht daraus ableiten:** Keine Zusage für 20 oder 160 Fahrer in realen Gruppen, keine Aussage über 200 km, Akku-/Temperatur-/Speicherkosten und keine Web-Worker-Verhaltensprüfung bei Sperrbildschirm oder langer Laufzeit. Der Test mit 160 Fahrern auf der Webseite besteht vorerst aus **80 unabhängigen Zweiergruppen**.

**Nächste Messung:** Auf derselben Webseite den **mittleren Test (10 Paare, jeweils 120 virtuelle Sekunden)** und dann den **großen Test (80 Paare, jeweils 120 virtuelle Sekunden)** ausführen, jeweils Berichte im Chat teilen. Die Zeiten über verschiedene Größen sind interessanter als eine lineare Hochrechnung aus dem kleinen Test.


## Android-Web-Worker-Messreihe vollständig (03.11.2026)

**Echte, vom Nutzer auf Android/Chrome 156 ausgeführte Messungen** mit R-03-Browserversion `dffcf78`. Je Test drei Läufe, der Median wird angezeigt.

| Unabhängige Paare / Fahrer | Virtuelle Zeit je Paar | Paar-Zeitschritte | Rohzeiten (ms) | Median (ms) | Prüfsumme |
| --- | ---: | ---: | --- | ---: | ---: |
| 1 / 2 | 12 s | 60 | 18,8 / 7,1 / 4,6 | **7,1** | 276,626283 |
| 10 / 20 | 120 s | 6.000 | 75 / 35,5 / 26,2 | **35,5** | 24.318,863289 |
| 80 / 160 | 120 s | 48.000 | 257,7 / 191,8 / 166,5 | **191,8** | 194.550,906309 |

Die Prüfsummen der beiden 120-s-Tests stimmen bis auf 0,000003 mit einer achtfachen Skalierung überein. Die Resultate sind vom Browser-internen Reproduzierbarkeitscheck bestätigt; ein separat ausgeführter Node-Referenzvergleich **derselben Version** fehlt noch. Zwischen 10 und 80 Paaren: 8-fache Rechenarbeit bei ca. 5,40-facher Medianzeit. Die höhere Leistung pro Schritt kann u. a. durch JIT-/Warm-up und andere Laufzeiteffekte entstehen; Ursache nicht unabhängig untersucht.

**Abgrenzung:** Test mit 160 Fahrern bedeutet 80 **unabhängige Zweiergruppen**, nicht ein gekoppeltes Peloton. Keine Validierung einer 200-km-Etappe, komplexer Feldpositionierung, Querwind, KI, Batterieverbrauch oder thermischer Drosselung. Der echte Android-Web-Worker-Funktionstest ist damit bestanden; die realistische Gruppen-/Langzeitprüfung steht aus. Vollständiger Messbericht: [ANDROID_BENCHMARK.md](ANDROID_BENCHMARK.md).

## Achtfahrergruppe R-03G: neuer lokaler Prüfblock (03.11.2026)

**16 neue isolierte lokale Tests erfolgreich** unter Node.js 22.16 und TypeScript 5.8.3, derzeit **mit mathematisch entsprechendem lokalen Bewegungsintegrator**. Geprüft: acht Fahrer synchron, Mehrfachabschirmung, stärkere Abschirmung durch mehrere Vorderleute (gedeckelt), Abstand/Seitenversatz, stationäre Anfangsformation, Lücke durch fest befohlenen Leistungsabfall, Energiegleichgewicht für alle Fahrer, unabhängige Rechenreihenfolge, Zeitschrittweite, Drei-Fahrer-Fall, keine rückwärts gerichtete Schutzwirkung, Kollisionserkennung, Eingabevalidierung, deterministische Ergebnisse und kein Rollwiderstandsbonus.

**Noch ausstehend:** Vollständige Testsuite mit **dem echten** vorhandenen `motion-core.ts` über GitHub Actions: bisher 64 Regressionstests plus 16 neue = **80 erwartete** Tests; Ergebnis erst nach tatsächlicher Ausführung bestätigen. Auch der echte Android-Gruppenworker ist noch nicht gemessen.

[Gruppenmodell und alle Grenzen](physik/R03G_ACHTFAHRER.md).


## GitHub-Integration und Pages-Bereitstellung bestätigt (03.11.2026)

**Pull Request:** [#26](https://github.com/Lancester/radsportmanager/pull/26) wurde mit Squash-Commit `5caca0213f1ece1d32ae7d8345b686909a5ba2a9` erfolgreich in `main` übernommen.

**Erfolgreicher GitHub-Actions-Lauf:** [#41683075141](https://github.com/Lancester/radsportmanager/actions/runs/41683075141) vom 03.11.2026, Job `deploy` – `status=completed`, `conclusion=success`. Die tatsächlichen Job-Logs bestätigen:
- **80 Tests ausgeführt, 80 bestanden, 0 fehlgeschlagen** (64 alte + 16 neue).
- Bestehende R-03-TypeScript-Engine plus neues Gruppenmodul für Browser erfolgreich übersetzt.
- ESM-Smoketest: sowohl Zweier- als auch **Achtfahrer-Modul erfolgreich** aus dem generierten JavaScript importiert; Achtfahrer-Test hat **600 Rechenschritte** abgeschlossen und eine Lücke erzeugt.
- GitHub-Pages-Upload und -Deployment erfolgreich. Bestätigter Link: **https://lancester.github.io/radsportmanager/**.

**Neuer Android-Testknopf:** `NEU · 8 Fahrer gemeinsam · 120 s`. Der Browser-Web-Worker lädt `drafting-group.js`, führt die gekoppelte Achtfahrer-Rechnung dreimal aus und zeigt Median-Rechenzeit, Prüfsumme, Lückenweite und Ereigniszeit. **Noch nicht tatsächlich vom Nutzer auf Android ausgeführt**; die obigen erfolgreichen Ergebnisse stammen aus dem GitHub-Runner, nicht vom Smartphone.

**Für den Nutzer:** Testseite öffnen, ausschließlich den neuen Achtfahrer-Knopf betätigen, Ergebnis kopieren und im Chat mitteilen. Die bisherigen unabhängigen Zweier-Tests bleiben unverändert verfügbar.

**KI weiterhin nicht enthalten:** Feste Spur, feste Startleistung, ein von außen veranlasster −45-W-Befehl für F8 nach 30 s. Reaktion, Windschatten, Position, Geschwindigkeit und Lückenereignis entstehen im dynamischen Physikmodell. Fahrertechnik, Positionsentscheidungen und Teamtaktik später als separate Agenten.


## Erste echte Android-Messung der gekoppelten Achtfahrergruppe (03.11.2026)

**Tatsächlicher Nutzerbericht vom Android-Smartphone, nicht von Node.js oder GitHub Actions:** Der neue gekoppelte Achtfahrer-Test wurde erfolgreich im veröffentlichten **Web Worker** ausgeführt. Szenario-/Build-Version `r03-android-v2`, Commit **`5caca02`** (entspricht dem verifizierten Merge-Commit `5caca0213f1ece1d32ae7d8345b686909a5ba2a9`), Chrome **156** unter Android. Der User-Agent `Android 10; K` erlaubt **keine** sichere Bestimmung der konkreten Hardware oder Android-Version.

| Kennzahl | Gemessen bzw. vom Worker zurückgemeldet |
| --- | ---: |
| Fahrermodus | **8 Fahrer gemeinsam** (`achtfahrer-gruppe`) |
| Virtuelle Zeit | **120 s** |
| Gemeinsame Schritte je Wiederholung | **600** à 0,2 s |
| Drei reale Rechenzeiten | **52,9 / 26,8 / 19,7 ms** |
| **Median** | **26,8 ms** |
| Ergebnis-Prüfsumme | **10560,145488** (innerhalb aller 3 Wiederholungen identisch) |
| Endlücke zwischen F7 und F8 | **100,414498 m** |
| Erfasste Lückenereignisse | **1** |
| Zeitpunkt der ersten offenen Lücke | **44 s** virtuelle Zeit |
| Letztes Tempo von F8 | **34,762058 km/h** |
| Zeitpunkt des Berichts (UTC) | **2026-11-03T17:26:40.842Z** |

**Plausibilitätskontrolle:** In der Demo haben zunächst acht Fahrer auf einer Ebene feste Wattzahlen und Abstände. Nach **30 virtuellen Sekunden** wird bei F8 **durch ein vorgegebenes Testkommando**, nicht durch KI, die Leistung um 45 W gesenkt. F8 fällt durch die dynamische Kraftrechnung zurück, die Windschattenwirkung wird bei wachsender Lücke kleiner und die Lücke überschreitet bei **Sekunde 44** die vorläufige Meldeschwelle von **8 m**. Das im Android-Bericht festgestellte **100,414498-m-Ergebnis** passt zum zuvor lokal geprüften Gruppentest. Die ursprüngliche GitHub-Actions-Testserie mit **80/80 bestandenen Tests** und erfolgreich ausgelieferter Webseite ist separat verifiziert.

**Bedeutung:** Erster tatsächlich auf Android ausgeführter **gekoppelter** Mehrfahrerphysiktest – im Unterschied zu den bisherigen **80 unabhängigen Zweiergruppen**. Der Lauf dauerte auf diesem Browser im Median nur rund **0,027 reale Sekunden**, um **120 virtuelle Sekunden** mit acht dynamisch wechselwirkenden Fahrern zu berechnen.

**Grenzen:** Die drei Laufzeiten streuen erheblich; beispielsweise können JIT-Warm-up und Hintergrundlast dazu beitragen, die Ursache ist aber nicht diagnostiziert. Der 160-Fahrer-Vergleichstest mit 191,8 ms berechnete **80 getrennte Zweiergruppen** und ist **kein direkter Skalierungsvergleich**. Gruppen-Aerodynamik bleibt heuristisch (max. 35 % Luftwiderstandsreduktion), keine selbständige Fahrtechnik, taktische KI, Spurwechsel- oder Kollisionsvermeidung, kein Querwind, keine Ermüdung, keine 200-km-Etappe, keine Akku-/Temperatur- oder Sperrbildschirm-Messung. **Daher keine belastbare Prognose für 160 miteinander interagierende Fahrer.**

**Nächste fachliche Entwicklungsentscheidung:** Vor größerem Peloton zuerst eine begrenzte **regelbasierte Reaktion** auf sich öffnende Lücken (z. B. mehr Leistung aufbringen oder zurückfallen), danach sichere seitliche Positionsbewegung und die schon beschlossenen individuellen Fähigkeiten (Fahrtechnik, Positionierung, Risiko). **Das ist ein Vorschlag, keine bisher implementierte oder vom Nutzer beschlossene KI.** Der Physikkern bleibt für tatsächlich gefahrene Geschwindigkeiten maßgeblich.


## R-04: erste Agenten-/Gruppenintegration in Prüfung (03.11.2026)

**Vorheriger bestätigter Stand:** 80/80 Github-Actions-Tests; Achtfahrer-Gruppenlauf auf Android 26,8 ms Median ohne KI.

**Neu im Branch:** `tests/gap-controller.test.mjs` mit **15 zusätzlichen Tests**, unter anderem Wahrnehmung einer wachsenden Lücke, maximale Watt-/Zeitgrenze, Rücknahme des Nachsetzens, Erholungsfenster, Eingabevalidierung, Determinismus, echte F8-Lückenreaktion und Energiegleichgewicht mit dem gemeinsamen Physikkern. Ein vollständig erfolgreicher Build würde **95/95** bedeuten. **Noch keine Erfolgsmeldung, bis GitHub Actions alle 95 Tests tatsächlich ausführt.** Ebenfalls neu: ESM-Smoke-Test, der zwei ansonsten identische Achtfahrer-Gruppen mit/ohne Agent vergleicht. Android-Ergebnisse müssen neu erhoben werden, vor allem Endlücke/Agentenereignisse/Rechenzeit.

[Formeln, Grenzen und Softwarearchitektur](ai/LUECKENAGENT.md).


## Verifizierter Abschluss der R-04-Implementierung (03.11.2026)

**Code:** [PR #28](https://github.com/Lancester/radsportmanager/pull/28) integrierte den neuen `src/engine/ai/gap-controller.ts` und die optionale Agentenkopplung an `drafting-group.ts`. [PR #29](https://github.com/Lancester/radsportmanager/pull/29) korrigierte nach dem tatsächlichen ersten fehlgeschlagenen Browser-Build nur die TypeScript-Ausgabepfade (durch `../ai` ist der gemeinsame Quellpfad jetzt `src/engine`; im Browser liegt der übersetzte Rechenkern unter `generated/physics/`).

**Bestätigter GitHub-Actions-Erfolg:** [Run #41692857294](https://github.com/Lancester/radsportmanager/actions/runs/41692857294), Squash-Commit `5b4e737e8f7917d37037cc3d098455c448da56b7`, `conclusion=success`, Node.js/TypeScript-Übersetzung, Agenten-ESM-Smoke-Test und GitHub-Pages-Deployment erfolgreich.

- **95 Tests**, davon **95 bestanden, 0 Fehler** (80 bisherige + 15 neue Regeln-/Agenten-Tests).
- Im echten kompilierten Browsermodul werden dieselben 8 Fahrer über **120 virtuelle Sekunden / 600 Schritte** simuliert. Beide Rennvarianten nutzen exakt dieselbe Physik und dieselbe anfängliche Formation.
- **Ohne KI** beträgt die Endlücke F7→F8 **100,41449796114853 m**.
- **Mit regelbasierter KI bei F8** beträgt die Endlücke **53,84653579082055 m**, also rund **46,57 m weniger**.
- **4 protokollierte Agentenzustandswechsel** im integrierten Smoke-Test.
- Die ursprüngliche externe −45-W-Vorgabe für F8 ab Sekunde 30 bleibt in beiden Szenarien erhalten; der Agent darf darauf befristet durch eine höhere eigene Wattanforderung reagieren. Es gibt keine direkte Änderung von Strecke oder Tempo.

**Veröffentlicht:** https://lancester.github.io/radsportmanager/ – bisheriger Vergleichsknopf `8 Fahrer · ohne KI · 120 s` und neu `NEU · 8 Fahrer · mit Regel-KI`. **Noch nicht** auf dem realen Android-Smartphone mit dem Agenten gemessen; die früheren 26,8 ms waren der **ohne-KI-Gruppenbenchmark**, nicht dieses neue Szenario.

**Fachliche Einordnung:** Die Agentenentscheidung ist deterministisch und transparent, aber noch ein **sehr kleiner Einzelfall**. Weder physiologische Leistungs-Dauer-Grenzen noch sichere Abstands-/Spurentscheidungen, umfassende taktische Fahrer-KI, komplette Gruppenkurven, Querwind oder ein gemeinsames 160-Fahrer-200-km-Rennen sind vorhanden. Die gesamte Rennengine bleibt eine **frühe Prototypenphase**, der Manager selbst ist noch nicht spielbar.

**Unmittelbarer nächster Schritt:** Der Nutzer führt beide Achtfahrer-Presets auf demselben Android-Gerät aus und übermittelt die neuen JSON-Berichte, besonders `agentPursuitS`, `agentDecisionCount`, `agentExtraWorkJ`, `finalGapM` und `medianMs`. Danach zuerst Abstandssicherung und CP/W′-Modellplanung, um wattgetriebene Kollisionen und unrealistische Dauerleistungen zu vermeiden.


## Android-Vergleich: erste Fahrer-Regel-KI gegen reine Physik bestanden (03.11.2026)

**Quelle: zwei vom Nutzer unmittelbar aus der veröffentlichten GitHub-Pages-Webseite auf demselben Android-Gerät kopierte JSON-Berichte.** Browser-Engine-Commit `5b4e737` (GitHub-Merge `5b4e737e8f7917d37037cc3d098455c448da56b7`), `r04-android-v3`, Chrome 156 / Android, Web Worker. Prüfsummen wurden durch die Webseite jeweils über drei identische Simulationswiederholungen verglichen. Das Gerät lässt sich aus dem abstrahierten User-Agent nicht sicher identifizieren.

| Kennzahl | Acht Fahrer **ohne KI** | Acht Fahrer **mit Regel-KI bei F8** |
| --- | ---: | ---: |
| Virtuelle Simulationszeit | 120 s | 120 s |
| Gemeinsame Rechenschritte | 600 | 600 |
| Rechenzeiten (3 Wiederholungen) | 24,4 / 21,6 / 14,3 ms | 42,1 / 32,9 / 22,3 ms |
| **Median-Rechenzeit** | **21,6 ms** | **32,9 ms** |
| Prüfsumme | 10560,145488 | 10606,739017 |
| Endlücke F7→F8 | 100,414498 m | 53,846536 m |
| Ein Lückenereignis bei | 44,0 s | 45,8 s |
| Endtempo F8 | 34,762058 km/h | 37,732002 km/h |
| Protokollierte Agenten-Zustandswechsel | – | 4 |
| Erster Nachsetzbeginn | – | 39,0 s |
| Gesamtdauer im Zustand `nachsetzen` | – | 60 s |
| Modellierte zusätzliche Antriebsarbeit | – | **3367,38807 J** (ca. 3,37 kJ) |
| Zeitpunkt des Nutzerberichts UTC | 18:33:26.889 | 18:33:38.673 |

**Physikalischer/spielerischer Vergleich:** Das identische Achtfahrer-Szenario endet mit KI bei F8 um **46,567962 m (46,38 %) geringerer Lücke** und ungefähr **2,970 km/h höherem Endtempo**. Die KI setzt dafür zusätzliche Pedalleistung ein, nicht einen Positions- oder Temposprung. Die **3367 J** sind die vom aktuellen Code summierte, näherungsweise zusätzliche mechanische Antriebsarbeit aus dem Agenten-Wattaufschlag während der Nachsetzintervalle; **noch keine vollständig modellierte physiologische W′-Erschöpfung**. Die Nachsetzzeit **60 s ist die Summe mehrerer Phasen**; die Regelgrenze von **30 s gilt pro Nachsetzphase**, nicht insgesamt über die ganzen 120 s. Der Wert `agentDecisionCount=4` zählt protokollierte **Zustandswechsel**, nicht sämtliche im 1-s-Takt ausgewerteten Entscheidungen.

**Rechenleistung:** Die Mediane unterscheiden sich um **11,3 ms**, hier rund **52,3 %**. Wegen nur drei Wiederholungen pro Variante, schwankender Rohzeiten und nicht randomisierter Ausführungsreihenfolge ist dieser Prozentsatz **keine stabile isolierte Messung der reinen Agentenkosten**. Auch die physikalische Trajektorie des F8 ändert sich und damit dessen Berechnungen. Dennoch zeigt der Vergleich: Das zusätzliche kleine regelbasierte Entscheidungssystem läuft in diesem Test auf Android in wenigen Millisekunden.

**Technischer Abnahmestand:** Reale Browser-Web-Worker-Ausführung beider Varianten bestätigt; zuvor [95/95 GitHub-Tests und erfolgreicher Pages-Publish](https://github.com/Lancester/radsportmanager/actions/runs/41692857294) bestanden. **Erste Agentenmeilenstein-Messung abgeschlossen**, aber weiterhin **keine autonome Spur- und Kollisionsvermeidung, kein CP/W′/Ermüdungsmodell, keine Gruppen-Berg-/Kurvenfahrt, kein 160-Fahrer-Peloton oder kompletter Manager**. Die Aero-Abschirmung im Gruppenmodell ist nicht empirisch kalibriert.

**Empfohlene nächste technische Arbeit:** Sichere Abstandsregelung mit physikalisch begründeter Bremsung/Leistungsrücknahme, noch bevor Fahrer vollautomatisch Positionswechsel und Angriffe fahren. Danach CP/W′/Ermüdung integrieren, damit zusätzliche Watt nicht unbegrenzt zur Verfügung stehen.


## In Prüfung: R-05 · longitudinaler Sicherheitsschutz und CP/W′ (03.11.2026)

**Vorheriger geprüfter Stand:** 95/95 GitHub-Actions-Tests plus Android-R-04-Workerlauf.

**Zusätzlich im Branch:** `tests/r05-safety-cp.test.mjs` mit Sicherheits- und Physikprüfungen (Frühreaktion, physikalische Bremskraft samt Arbeitsbilanz, bewusst zu später Bremsweg, Drei-/Achtfahrer-Integration, CP-/W′-Deckelung, Erholung unter CP, separate FTP und deterministische Energie-/Positionsdaten). **Eine Gesamtanzahl von 115+ Tests erst nach tatsächlichem Actions-Lauf bestätigen.** Die Browserseite bekommt einen neuen separaten R-05-Test.

**Nicht als bestanden ausgeben:** Vollständiges physikalisch sicheres Überholen, reale CP/W′-Kalibrierung, Ermüdung über viele Stunden, Android-R-05-Lauf oder ganzes 160-Fahrer-Peloton. [Herleitung](physik/R05_ABSTAND_CP_WPRIME.md).
