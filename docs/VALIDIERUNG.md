# Tests, Realismus, Kalibrierung und Performance

**Status:** 198/198 automatische Tests, drei vollständige 50-km-Rennverläufe und echte GitHub-Runner-Diagnosen; **noch keine reale Android-Gesamtrennmessung oder empirische Profirennkalibrierung**.

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


## Verifizierter R-05-Abschluss auf GitHub (03.11.2026)

**In `main` übernommen:** [PR #31](https://github.com/Lancester/radsportmanager/pull/31), Squash-Commit `579f68a27e3dcf9c4b80b17d4cf22ebd2fd3d0bd`.

**Verifizierter Github-Actions-/GitHub-Pages-Lauf:** [#41698413046](https://github.com/Lancester/radsportmanager/actions/runs/41698413046) erfolgreich; Job-Logs bestätigen **116 Tests / 116 bestanden / 0 Fehler** (95 bisherige und **21 neue R-05-Tests**). TypeScript-Browser-Übersetzung, existierende Zwei-/Achtfahrer-Kontrollläufe und neuer R-05-Gruppen-Smoke-Test bestanden. GitHub-Pages-Veröffentlichung auf https://lancester.github.io/radsportmanager/ erfolgreich.

**Vergleich bei acht gemeinsam fahrenden Fahrern, je 120 virtuelle Sekunden (Node.js im GitHub-Runner; nicht auf Android gemessen):**

| Szenario | Endlücke F7 → F8 | W′-Limit |
| --- | ---: | --- |
| F8 ohne KI (alter Test) | 100,414498 m | keines |
| F8 mit bisherigem Lückenagent ohne CP/W′ | 53,846536 m | keines |
| F8 mit Lückenagent, aktiver Abstandsregel und CP/W′ | **68,951942 m** | **37,8 s leistungslimitiert** |

In R-05 hat F8 im **frei erfundenen** Profil `CP=220 W`, `FTP=210 W` und anfänglich `W′=1200 J`. Seine Rest-W′ beträgt am Rennende **8,012079 J**. Die größere Lücke als im bisherigen KI-Lauf ist **plausibel und gewollt**, weil der Fahrer wegen der begrenzten Reserven nicht unbegrenzt den vom Agenten geforderten Wattwert leisten kann.

**Sicherheitsregler:** Im vorliegenden Achtfahrerbeispiel bleibt F8 hinter dem Feld zurück, deshalb erfolgt **0 s Bremsung**. Die **aktive Bremskraft/Abstandsreaktion** wurde aber in einem **gesonderten echten Drei-Fahrer-Auflauf-Szenario** getestet und ihre mechanische Bremsverlustarbeit bilanziert. Ein schon zu kurzer Bremsweg führt weiterhin zu explizitem Fehler, nicht zu Bewegungsteleportation. **Keine garantierte Kollisionsvermeidung oder autonome 2D-Spursteuerung.**

**Browser:** Der neue fünfte Knopf `NEU · KI + Abstand + CP/W′` wurde über GitHub Pages veröffentlicht. **Noch kein tatsächlicher Android-R-05-Messbericht**, daher keine Rechenzeit auf dem Smartphone angegeben oder auf 160 Fahrer hochgerechnet. Der Nutzer kann später den neuen Preset anwählen und die JSON-Ergebnisse schicken.

**Wissenschaftliches Profil:** FTP bleibt bewusst **separat von CP** (beide korrelieren, sind aber nicht austauschbar). Die hier verwendete lineare W′-Wiederherstellung ist eine **nicht kalibrierte Testheuristik** und nicht das validierte W′bal-/Skiba-Modell. Auch CP-Leistung unterhalb der Schwelle ist **nicht garantiert unbegrenzt haltbar**; langfristige Ermüdung/Ernährung/Training stehen aus.

**Nächste fachliche Entwicklungsoption:** Dynamisch sichere Bremsreaktionen auch bei abrupt verzögerndem Vordermann, danach 2D-Positionen/Reibkreis/Kurven und individuell kalibrierte CP/W′-Wiederherstellung; für den späteren Manager separate FTP-Tests, Trainingszonen und periodisierte Trainingssteuerung.


## Erster echter Android-R-05-Benchmark – KI, Abstand und CP/W′ (03.11.2026)

**Quelle:** Vom Nutzer aus der veröffentlichten GitHub-Pages-Testseite übermittelter vollständiger JSON-Bericht. Das ist ein **tatsächlicher Lauf auf Android im Chrome-Web-Worker**, keine Node-Hochrechnung. Buildstand `579f68a` (GitHub-Merge `579f68a27e3dcf9c4b80b17d4cf22ebd2fd3d0bd`), `benchmarkVersion=r05-android-v4`, Modus `achtfahrer-sicher-cp`, Chrome 156. Der User-Agent nennt eine generische Android-Kennung, aus der sich die tatsächliche OS-Version oder das konkrete Gerät nicht zuverlässig ablesen lassen.

| Gemessene/berichtete Kennzahl | R-05 auf Android |
| --- | ---: |
| Fahrer / gemeinsame Simulationszeit | 8 / 120 s |
| Gemeinsame Rechenschritte pro Wiederholung | 600 |
| Rechenzeiten (drei Läufe) | 29,7 / 21,5 / 15,8 ms |
| **Median** | **21,5 ms** |
| Simulationsprüfsumme (in 3 Wiederholungen identisch) | **10591,625031** |
| Endlücke F7 → F8 | **68,951942 m** |
| Erstes erkanntes Lückenereignis | **45,8 s** |
| Endtempo F8 | **36,095269 km/h** |
| Agenten-Zustandswechsel / erste Nachsetzentscheidung | 4 / bei **39 s** |
| Kumulierte Zeit im Nachsetzmodus | **60 s** (mehrere max. 30-s-Phasen) |
| Zusätzliche mechanische Antriebsarbeit durch den Agenten (Modellwert) | **2089,034151 J** |
| W′-Startreserve des fiktiven F8 | **1200 J** |
| Kumulativer W′-Verbrauch oberhalb CP | **1432,350286 J** |
| Abgeleitete kumulative W′-Regeneration unter CP | **240,362365 J** |
| **W′-Rest nach 120 s** | **8,012079 J** |
| Zeit mit tatsächlicher CP/W′-Leistungsbegrenzung | **37,8 s** |
| Bremszeit / Sicherheitsereignisse | **0 s / 0** |
| CP-Leistungsbegrenzungsereignisse | **4** |
| Berichtzeitpunkt (UTC) | `2026-11-03T19:03:13.370Z` |

**Bilanzprüfung:** W′-Rest ≈ 1200 J − 1432,350286 J + 240,362365 J = 8,012079 J. **Der kumulierte Verbrauch darf über der Anfangskapazität liegen**, weil die Reserve zwischen Belastungen wieder (vorläufig heuristisch) regeneriert wird. `agentExtraWorkJ` (2089 J) ist **nicht** dasselbe wie der W′-Verbrauch oberhalb CP (1432 J); es wird gegenüber der ursprünglichen Wattvorgabe und mit berücksichtigt eingestelltem Antriebswirkungsgrad berechnet.

**Vergleich mit anderen tatsächlich gemessenen Android-Läufen, jeweils 8 Fahrer über 120 s:** Ohne KI betrug F8s Lücke **100,414498 m**, mit R-04-Regelagent ohne CP/W′-Limit **53,846536 m**, mit R-05-Agent und CP/W′ **68,951942 m**. R-05 erhält somit einen Teil des Vorteils gegenüber keiner KI (rund **31,46 m** kleinere Lücke), während physiologische Grenzen den Anschluss gegenüber dem unbegrenzten Agenten um **15,11 m** erschweren. **Die Android-Mediane 21,6 / 32,9 / 21,5 ms dürfen bei nur drei streuenden Messungen nicht als stabile Rangfolge der Algorithmusgeschwindigkeiten gedeutet werden.**

**Sicherheit:** Keine Bremsung in diesem **Abreißszenario**, weil F8 langsamer wird. Der separate bestandene Drei-Fahrer-Bremstest und 116/116 erfolgreich geprüfte GitHub-Tests belegen nur den vorhandenen begrenzten Längsabstandsschutz. **Keine Garantie kollisionsfreier Rennen**, kein automatischer 2D-Spurwechsel, kein Mehrfahrer-Kurven-/Reibkreis-Modell.

**Messmeilenstein erfüllt:** R-05-Worker mit CP/W′ und aktiver Abstandsregelung ist tatsächlich auf Android lauffähig. **Nicht** mit einem validierten physiologischen W′bal-Modell oder mehrstündiger 160-Fahrer-Rennsimulation verwechseln. Die gemessene W′-Regeneration beruht weiterhin auf einer frei gewählten Testheuristik; `ftpW` ist bewusst separat von `criticalPowerW`. Offene technische Nachfolgeaufgaben siehe Issues [#30](https://github.com/Lancester/radsportmanager/issues/30) und [#32](https://github.com/Lancester/radsportmanager/issues/32).


## R-06 – Prüfpaket für Führungsbremsung, seitliche Bewegung und FTP (03.11.2026)

Neue Datei `tests/r06-safety-lane-ftp.test.mjs`: stetige Querverschiebung, swept-Zweiachs-Kollision beim Überspringen eines Zwischenzeitpunkts, gefahrloses Nebeneinander, Achtfahrer-Überholereignis, Grenzen der Straßenbreite und deterministische Wiederholung; beim bekannten Führungsbremsbefehl frühzeitige Sicherheitsreaktion und Bremsarbeitsbilanz; getrennte FTP-Kurbelwattstatistik **nach** CP/W′-Limit. Die gesamte Suite umfasst zuvor **116 Tests**. Der neue Erfolg ist **erst nach Actions-Ergebnis** zu bestätigen.

Der neue browserseitige Überholtest ist noch **keine tatsächliche Android-Messung**. [Vollständige technische Grenzen](physik/R06_SICHERHEIT_SPUR_FTP.md).


## R-06 gebündelt: 134/134 Tests und Browser-Überholen verifiziert (03.11.2026)

**Implementiert und nach echtem CI-Lauf geprüft:**
- [PR #33](https://github.com/Lancester/radsportmanager/pull/33) fügte **drei Teilentwicklungen** hinzu: vorausschauende Längsabstandsreaktion auf *explizit bekannte* Führungsbremsung, stetige Querverschiebung mit swept-Zweiachs-Konflikterkennung und echtem Überholereignis sowie eine aus **tatsächlich angewendeter Kurbelwatt** berechnete FTP-Statistik.
- [PR #34](https://github.com/Lancester/radsportmanager/pull/34) korrigierte einen durch den neuen starken Bremsfall aufgedeckten **echten Integrator-Randfall**: Bei Stillstand *innerhalb* eines Zeitschritts darf nur die wirksame Zeit bis zur vollständigen Verzögerung in den Bremsweg und die Energiegleichung eingehen. Zusätzlich wurde ein gezielter Stillstands-Energietest ergänzt. **Keine künstliche Positions-/Geschwindigkeitsverschiebung**.
- Endgültiger geprüfter Merge-Commit `4a4b2d18f09577b9359f2ef8885f519443965cab`.
- Verifizierter [GitHub-Actions-Lauf #41703325010](https://github.com/Lancester/radsportmanager/actions/runs/41703325010) vollständig `success`: **134 Tests ausgeführt, 134 bestanden, 0 fehlgeschlagen**, TypeScript-Browser-Übersetzung, originale R-03/R-04/R-05-Tests, neuer R-06-ESM-Smoketest sowie **GitHub-Pages-Deployment** erfolgreich.
- Der echte übersetzte Achtfahrer-Überholtest (`createEightRiderPassExample(65)`) meldet im Runner **7 Überholereignisse** von F8 auf der getrennten Spur, abschließende Seitenposition **y=2 m**. Das ist ein **extern vorgegebener** Spur- und 500-W-Leistungsbefehl als Test, **keine autonome Überhol-KI**. Keine verifizierte realistische Überholzeit eines echten Profi-Pelotons.
- Im früheren R-05-Profil ergibt die neu integrierte FTP-Diagnose **90 s oberhalb des fiktiven FTP-Wertes** während 120 s Fahrzeit. Diese Zahl ist **nur eine Pedalwatt-Messgröße**, keine Aussage über realistische metabolische Ermüdung oder einen Trainingseffekt. Das CP/W′-Limit und die getrennte FTP-Kennzahl bleiben bestehen.
- **Wiederholungs-/Regressionscheck:** R-05-Smoketest liefert weiter F8-Endlücke **68,951942 m**, Rest-W′ **8,012079 J**, CP-begrenzte Zeit **37,8 s**; frühere Android-Messungen werden nicht überschrieben.
- GitHub Pages ist veröffentlicht: **https://lancester.github.io/radsportmanager/**. Neuer optionaler Preset **„NEU · 8 Fahrer überholen · 65 s“**, daneben die bisherigen Tests. **Noch kein echter Android-Rechenzeitbericht** zum neuen R-06-Test, deshalb keine Smartphone-Laufzeit oder Hochrechnung vorwegnehmen.

**Weiter bewusst offen:** Garantiert kollisionsfreie Fahrt bei unvorhergesehener Führungsbremsung, Lenkwinkel/Querbeschleunigung/Fahrtechnik und Kurven-/Reibkreis-Kopplung, echte autonome Spurwahl/Überholtaktik, realistische W′-Wiederauffüllung und FTP-Trainingssteuerung, gemeinsame 160-Fahrer-/200-km-Rennsimulation und Managerspiel. Diese Weiterarbeiten nicht als bereits erledigt darstellen. Grundlagen, Testgeometrie und Grenzen: [R-06](physik/R06_SICHERHEIT_SPUR_FTP.md).


## R-07 – neues Testpaket autonomes Überholen (03.11.2026)

Neue automatisierte R-07-Prüfungen: richtige Wahl einer freien Überholspur, Alternative bei belegter bevorzugter Seite, **kein Manöver bei beidseitiger Blockade**, Prognose eines von hinten aufrückenden Fahrers, Straßenbreiten-Limit, Argumentvalidierung, echte Achtfahrer-Integration mit `agent-lane-choice`/`lane-complete`/`overtake`, **identische Physik und W′-Rest** für den zeitlich identisch vorgegebenen Kontrolllauf, CP/W′-Erschöpfung, alte R-03G-Regressionen und deterministische Wiederholungen.

**Kein Test-Erfolg vor Bestätigung des GitHub-Runners.** Frühere Messwerte (134/134 Tests, R-06-Überholungen) bleiben unabhängig von R-07 gültig. Browserpreset `autoPassing` ist neu und muss nach Pages-Build auf einem echten Android-Gerät gemessen werden. [R-07-Design](ai/R07_UEBERHOLAGENT.md).


## R-07 auf GitHub vollständig geprüft: 150/150 Tests, autonome Spur und CP (03.11.2026)

**Implementierung und Merge:** [PR #36](https://github.com/Lancester/radsportmanager/pull/36), Squash-Commit `254a256faef510d35b9b18cc568ab9a89ebf009e` erfolgreich in `main`.

**Vollständig verifizierter GitHub-Actions-Lauf:** [#41705987015](https://github.com/Lancester/radsportmanager/actions/runs/41705987015), `conclusion=success`. Reale Logs: **150 Tests ausgeführt, 150 bestanden, 0 Fehler**, TypeScript-Browser-Kompilierung, alle älteren R-03/R-04/R-05/R-06-Prüfungen, neuer R-07-ESM-Smoke-Test und GitHub-Pages-Bereitstellung erfolgreich.

**Kontrolllauf in der GitHub-Node-Laufzeit (keine Android-Zeitmessung):**
- F8 trifft in der 65-s-Achtfahrergruppe **genau eine autonome Spurentscheidung**. Zielspur y=2 m, nach abgeschlossenem stetigem Wechsel **erst dann** Wattanforderung.
- Physischer Gruppenlauf registriert **7 Überholereignisse** von F8 gegenüber F1–F7 auf getrennter Spur.
- Nach CP/W′-Leistungsbegrenzung bleiben am Ende **8.250 J W′** des **rein fiktiven** Ausgangsprofils (CP 300 W, W′ 12.000 J, FTP 285 W).
- Der identisch physikalisch gesteuerte **manuelle** Kontrolllauf (vorher fest vorgegebene Spur bei 0 s, dieselben 360 W ab 2,5 s) unterscheidet sich in der F8-Endposition nur um **0,000009218 m**. Die winzige Abweichung ist numerisch plausibel; keine künstliche Beschleunigung oder Positionsteleportation.
- Verifizierte Android-Webseite https://lancester.github.io/radsportmanager/ enthält jetzt einen **zusätzlichen**, separat auswählbaren Button `NEU · 8 Fahrer · autonome Überhol-KI`; alte Tests bleiben verfügbar.
- **Noch kein echter R-07-Android-Benchmark übermittelt**, daher keine Aussage zur Rechenzeit auf dem Smartphone oder einer 160-Fahrer-Gruppe.

**Drei erfüllte technische Ziele im gebündelten Paket:** autonome, nachvollziehbare Wahl unter mehreren Seiten / Verzicht bei Blockade; vorausschauende swept-Konfliktprüfung mit tatsächlicher stetiger Querbewegung; physikalisch konsistente, begrenzte Angriffswatt mit CP/W′, FTP-Telemetrie und realer Abstandsregel. Die Prognose selbst setzt vorläufig konstante aktuelle Geschwindigkeiten der Nachbarn voraus.

**Verbleibende Grenzen:** Noch kein selbstständiges Wiedereinscheren, keine koordinierte dynamische Spurwahl vieler Fahrer, keine fahrtechnische Querbeschleunigung/Lenkung/Kurven-Reibkreisphysik, keine Garantie kollisionsfreier Feldfahrt, keine kalibrierte CP/W′-Regeneration und kein vollständiges Rennen/Managerspiel. Genau diese Grenzen nicht als erreicht ausgeben. [R-07-Dokumentation](ai/R07_UEBERHOLAGENT.md).


## R-08 – neue, noch zu verifizierende Rejoin-/Multi-Agent-/Querdynamik-Prüfungen (03.11.2026)

`tests/r08-rejoin-multi-steering.test.mjs` mit **19 neuen Tests**: reservierte/alternative Spuren, kreuzende Bewegungen, fehlender Wiedereinscher-Vorsprung, kontrollierte Rückkehr, reproduzierbare gleichzeitige Fahrerentscheidungen unabhängig von der Eingabereihenfolge, physikalischer CP/W′-Energieerhalt, definierte Querbeschleunigungs- und Kurven-Haftungsgrenzen sowie bitgenaue R-07-Regressionen. Zusammen mit bisher 150 sind **169 erwartete Tests**, noch **kein bestandenes Ergebnis vor GitHub-Run**.

Die bisherige Android-Seite erhält zwei zusätzliche, eigenständige Presets. **Ohne echten Gerätebericht keinerlei neue Android-Laufzeit angeben.** [Modellgrenzen](ai/R08_WIEDEREINSCHEREN_MULTIAGENT.md).



## R-08 GitHub-Abnahme: 169/169 und zwei echte KI-Szenarien (03.11.2026)

**Implementierung:** [Pull Request #38](https://github.com/Lancester/radsportmanager/pull/38) mit Merge-Commit `f4052cc149ae6897b2acacd3b377c6e46f7ed80a` auf `main` übernommen.

**Automatische Abnahme:** [GitHub-Actions-Lauf #41710587230](https://github.com/Lancester/radsportmanager/actions/runs/41710587230), `completed/success`. Der tatsächliche Job-Log bestätigt **169 Tests / 169 bestanden / 0 fehlgeschlagen**, erfolgreiche Browser-TypeScript-Kompilierung, alle bisherigen R-03–R-07-Smoke-Tests, neue R-08-ESM-Gruppentests und erfolgreiches **GitHub-Pages-Deployment** nach https://lancester.github.io/radsportmanager/.

**Drei in diesem Paket technisch erreichte Meilensteine:**
1. **Autonomes Wiedereinscheren:** Im Achtfahrer-Referenztest wählt F8 nach **7 physikalischen Überholungen** und genügend Vorsprung **einmal** die sichere Rückkehr, und die Fahrt beendet den Seitenwechsel wieder bei **y=0 m**; Event-Zahlen `rejoinChoices=1` / `autonomousRejoins=1`. Der Test benutzt eine sehr konservative Strategie: nur **vor** der gesamten Reihe, nicht zwischen anderen Fahrern.
2. **Koordinierte autonome Spurwahl von zwei Fahrern:** F7 erhält **y=+2 m**, F8 **y=−2 m**, obwohl beide zunächst dieselbe bevorzugte Seite wollen. Der simulierte Mehrfahrer-Gruppenlauf meldet **12 physikalisch berechnete Überholereignisse**. Die Spurreservierung wird nach **stabiler Fahrer-ID**, nicht Eingabe-Array-Reihenfolge ausgewertet; die betreffenden Regressionstests sind bestanden.
3. **Glatter Seitenwechsel mit Querbeschleunigungsgrenze:** Im R-08-Mehrfahrer-Referenzlauf betrug die größte vom Modell erfasste Querbeschleunigung der beiden aktiven Fahrer **0,7850666666666671 m/s²**, also unter der fiktiven Obergrenze **1,5 m/s²**. Das Kurven-Gripbudget ist bisher nur eine konstante-Radius-Prüfung für den Seitenwechsel, **keine realistische, gekoppelte Kurvenfahrt**.

**Browser:** Die bestehende Testseite hat jetzt zusätzlich die Knöpfe **„NEU · Überholen + Wiedereinscheren“** (115 simulierte Sekunden) und **„NEU · Zwei KI-Fahrer gleichzeitig“** (70 simulierte Sekunden). Beide verwenden die aus dem Original-TypeScript gebauten Module in einem Web Worker. **Noch keine echten Android-Laufzeiten** für diese zwei neuen Szenarien vorliegend. Kein Smartphone-Ergebnis erfinden; der GitHub-Runner ist kein Android-Gerät.

**Grenzen:** Ein Konflikt in der Vorhersage führt zur Zurückhaltung, aber eine unerwartete Änderung der Geschwindigkeit/Spur anderer Fahrer kann im laufenden, eigentlichen Solver weiterhin einen Sicherheitsfehler auslösen. Keine voll gekoppelte Fahrrad-Lenk-/Kurvendynamik, keine intelligenten mittigen Peloton-Lücken und noch keine vollständige Fahrerfeld-/Renn-KI mit 160 Fahrern. FTP, CP/W′ und langfristiges Training sind weiterhin nicht sportwissenschaftlich kalibriert.

**Nächste Aufgaben:** Wiedereinscheren in variierende, tatsächlich sichere Lücken; bewegliche Hindernisse und gemeinsames Aushandeln geplanter Spurwechsel; tatsächliche 2D-Lenk-/Kurven-/Bremshaftungsphysik und später ein vollständiges Rennfeld. [R-08-Modell](ai/R08_WIEDEREINSCHEREN_MULTIAGENT.md).


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


## R-11: zusätzliche Diagnose vor dem nächsten taktischen Balancing (03.11.2026)

Die dokumentierten R-10-Ergebnisse sind die bislang bestätigte Basis. Für Issue #42
ergänzt [R-11 Mehr-Seed-Balancing](race/R11_MEHRSEED_BALANCING.md)
eine **noch zu prüfende** Regression auf zwei Seeds, Flach-/Hügelstrecke,
Variationen der Teamleitlinie und des fiktiven CP/FTP/W′-Fahrerprofils.
Die neue Auswertung prüft intern vollständige Klassifikationen, physikalische
Energiebilanzen, Fahrerzahlen pro Gruppensnapshot und die gemessenen Lücken
bei bestätigten Fluchten und Einholungen. Sie erstellt zusätzlich isolierte
Gruppen-/Zeit-/Leistungsdiagnosen.

**Keine Kalibrierung:** Ein guter Testlauf bedeutet nur, dass die Simulation
konsistent rechnet; 20–22 Gruppen, Ergebnisabstände und Teamtaktik benötigen
weiterhin eine gesonderte sportliche Plausibilitätsprüfung. Sieben manuell
ausführbare Läufe dürfen weder als empirische Aussage noch als 160-Fahrer- oder
Android-Leistungsnachweis dargestellt werden.


### R-11 tatsächlich abgenommener Teststand (03.11.2026)

[PR #47](https://github.com/Lancester/radsportmanager/pull/47) ist in main;
[Actions #41727050681](https://github.com/Lancester/radsportmanager/actions/runs/41727050681)
hat die **vier neuen R-11-Tests und die gesamte Suite mit 202/202**
bestanden. [Actions #41727203475](https://github.com/Lancester/radsportmanager/actions/runs/41727203475)
bestätigt anschließend auf main erneut **202/202**, die drei alten
vollständigen Renn-Diagnoseläufe, Browser-Build und Pages.

**Abnahmeumfang:** mathematische/technische Konsistenz, nicht echte
Rennrealistik. Die ergänzte manuelle Sieben-Läufe-Diagnose ist noch
nicht ausgeführt oder in Zahlen ausgewertet. Die Hauptkritik am R-10-
Peloton bleibt unverändert; der nächste Balancing-Schritt folgt erst
auf eine nachvollziehbare Mehr-Seed-Auswertung.


## R-11: bestätigte Diagnoseausführung und Einordnung (03.11.2026)

Die in den vorherigen R-11-Abschnitten ausdrücklich **damals noch
ausstehende** Sieben-Rennen-Diagnose wurde inzwischen ausgeführt:
[Actions #41728617720](https://github.com/Lancester/radsportmanager/actions/runs/41728617720)
ist **erfolgreich**. Der Lauf hat alle **sieben** `R11-LAUF`-Datensätze
und die zwei Taktik-/einen Profilvergleich tatsächlich erzeugt und
deren Anzahl geprüft. Jede Simulation umfasst 30 Fahrer über 50 km
mit kompletter Klassifikation. Ein anfänglicher doppelter Referenzlauf
in [#41728273878](https://github.com/Lancester/radsportmanager/actions/runs/41728273878)
wurde aus dem Skript entfernt. Keine veränderte Renn-Physik.

Die sieben Ergebnisse zeigen **maximal 20–24 Abstandsgruppen**
bei hügeligen Rennen und **12 Gruppen** bei flachen Rennen.
Im fiktiven Profilkontrast mit −12 % CP/FTP/W′ für F03 ändern sich
seine Zielzeit um +330,095 s, das Gruppenmaximum 20→23 und der
beobachtete Singleton-Anteil 14,8 %→20,0 %. Seed-spezifisch
ändert die offensive Strategie F01s Zeit um 3,783 s beziehungsweise
30,491 s. Alle Detailwerte: [R-11-Fachdokument](race/R11_MEHRSEED_BALANCING.md).

**Validierungsgrenze:** Diese Messungen sind echte *Modellberechnungen*,
aber **keine Validierung** gegenüber externen Rennen, kein statistisches
Populationsergebnis und keine Android-Performance. Ein fehlender
Gruppen-/Positions-Effekt im 30er-Aeromodell ist durch Codeprüfung
belegt, aber ein Beitrag der Aero-Abstraktion zur beobachteten
Fragmentierung ist ohne kontrollierten Variantenvergleich **nicht
quantifiziert**. Die nächste Abnahme sollte deshalb ein sauberer
A/B-Vergleich für 2–3er-Flucht und dichtes 30er-Feld bei gleicher
Motorik/CP/W′ und denselben R-11-Seeds sein. Die 42-m-Diagnosegrenze
ist kein aerodynamischer Einflussradius.


## R-12: tatsächlicher A/B-Vergleich der Formationswindschatten-Variante (03.11.2026)

- [PR-Tests #41730702259](https://github.com/Lancester/radsportmanager/actions/runs/41730702259):
  **209/209 Tests**, inklusive sieben zusätzlicher R-12-Prüfungen zu
  solo/2er/3er/30er-Formation, Distanz, deterministischer
  Eingabesortierung, ungültigen Werten, bitidentischem
  `legacy` und vollständigem 50-km-A/B-Rennen mit Energie-/
  CP/W′-Bilanz.
- [Einmaliger A/B-Lauf #41730692771](https://github.com/Lancester/radsportmanager/actions/runs/41730692771):
  **14 vollständige 50-km-Rennen**, jeweils dieselben sieben
  R-11-Fälle mit alter und neuer Aerodynamik. Die sieben
  gemessenen Legacy-Maximalgruppen stimmen exakt mit der
  früheren Referenz überein. Alle 420 Fahrer erreichten im Modell
  das Ziel.
- [Build-/Browserkontrolle #41730888302](https://github.com/Lancester/radsportmanager/actions/runs/41730888302):
  TypeScript-ESM-Build und 30-Fahrer-Rennen mit aktivierter
  `formation-experiment`-Variante erfolgreich. Der hierfür
  einmalige Workflow wurde aus dem Feature-Branch entfernt.
- Aero-Restfaktor der neuen Variante kann bis 0,4 sinken;
  er ist **kein** kalibrierter Messwert. Die 42-m-Gruppen-
  Grenze aus R-10 ist davon strikt getrennt.

**Befund:** Auf dem Flachprofil verbessert sich zwar der
Peloton-Zusammenhalt in der 42-m-Abstandsdiagnose von
12 auf 3–4 maximale Gruppen und die mediane Zielzeitlücke
sinkt deutlich, aber der letzte Rückstand wächst in
**allen sieben** Vergleichen; Flach 2027 334,1 → 937,5 s.
Vier der sieben Maximalgruppenwerte werden kleiner,
zwei größer, einer bleibt gleich. Der Hügelkurs
bleibt uneinheitlich. **Die Experimentvariante wird nicht
als freigegebene Rennphysik, empirisches Ergebnis oder
qualitativ abschließend verbessertes Gesamtmodell bewertet.**
Alle Fälle und W′-/Wattwerte: [R-12-Fachdokument](race/R12_FORMATIONSAERODYNAMIK.md).

**Weiter offen:** realistische Dichte/Querspur im Peloton,
Mindestabstand, tatsächlicher Team-Führungswechsel,
Feld-Verfolgungslogik, abgehängte Fahrer und unabhängige
Realrenndaten. Kein Android-50-km-Vergleich.


## R-13: Vorgesehene Prüfung der Freigabe des Formationswindschattens (03.11.2026)

Neue Testentscheidung: reguläres Rennen verwendet ohne
`aeroModel` das bisherige R-12-Formationsmodell; `legacy`
ist nur noch die explizite A/B-Referenz. Große Rückstände von
ohne direkten Schutz abgehängten Fahrern sind kein
automatisches Abnahmedefizit.

Zu prüfen: sieben vollständige 30-Fahrer-/50-km-Rennen mit dem
neuen Standard unter den sieben R-11-Eingaben; CP-/W′- und
Energiebilanz; bestätigte Flucht- und Einholabstände; Original
`legacy`-Referenz; deterministische gleichauf stehende
Fahrer und isolierte Nachzügler; unveränderte Browser-ESM-
Übersetzung und GitHub-Pages-Lauf. Ergebnisse nur nach realer
CI-Ausführung dokumentieren. Siehe
[R-13-Fachdokument](race/R13_FORMATIONSWINDSCHATTEN_STANDARD.md).

Grenze: technische Korrektheit und plausible Wirkungsrichtung
sind prüfbar; die konkrete Formel ist eine für das Spiel
gewählte Abstraktion, keine bestätigte Messkurve eines
30er-Profi-Pelotons. Kein erfundener positiver Einholbonus,
keine direkte Speed-/Zielzeitkorrektur.


### R-13: endgültiger main-CI- und Browser-Nachweis (03.11.2026)

[Merge-PR #50](https://github.com/Lancester/radsportmanager/pull/50),
`main`-Code `5764f090863d53ed7517d3f32bc615f105a951ce`:
[Actions #41734418472](https://github.com/Lancester/radsportmanager/actions/runs/41734418472)
**vollständig erfolgreich**, **213 Tests/213 bestanden/0
fehlgeschlagen**, drei vollständige 50-km-Renndiagosen,
TypeScript-ESM-/Browser-Smoketest und GitHub-Pages-Deployment.
Die zusätzlichen sieben kompletten Default-Rennen wurden in
[PR-Actions #41734281038](https://github.com/Lancester/radsportmanager/actions/runs/41734281038)
ebenfalls erfolgreich absolviert, einschließlich
Gleichauf-/Abgehängten- und Legacy-Regressionskontrollen.
Weitere Messwerte: [R-13-Fachnotiz](race/R13_FORMATIONSWINDSCHATTEN_STANDARD.md).

**Wichtig:** Der Nutzen für das spielerische Peloton und seine
energetischen Konsequenzen sind technisch nachgewiesen; daraus
folgt weiterhin keine vollständige Messvalidierung gegenüber
Profi-Rennen. Die Nutzerentscheidung ist dennoch **verbindlich
umgesetzt** – dieses empirische Restthema blockiert den
Rennbetrieb nicht. Großer Abstand eines tatsächlich isolierten
Fahrers zum Feld ist **kein** pauschaler Mangel.


## R-14 – echte Teamtempo-/Verfolgungsereignisse und Vollrennen (04.11.2026)

**Gültige Tests auf dem Feature-Branch:**
[GitHub PR-Actions #41737911881](https://github.com/Lancester/radsportmanager/actions/runs/41737911881)
**221/221 Tests, null Fehler**. Acht neue Tests prüfen
Helferrotation (maximal ein Teamarbeiter), Unabhängigkeit
von Eingabereihenfolge, räumliche Nähe zum Kapitän/Sprinter,
Energiegrenzen, belegte Ausreißerjagd, keine Verfolgung
eigener Flucht oder weit abgehängter Einzelfahrer,
ungültige Eingaben und zwei vollständige 50-km-Rennen
mit überprüfter Ereignis- und Energiebilanz.

**Zusätzliche Ausführung:**
[Actions #41738013741](https://github.com/Lancester/radsportmanager/actions/runs/41738013741)
hat sieben vollständige Rennvarianten mit je 30 Fahrern
durchgerechnet, die sieben `R14-RENNDIAGNOSE`-Datensätze
sowie eine Abschlusszeile ausdrücklich nachgezählt
und einen TypeScript-Browser-Build samt ESM-30-Fahrer-Rennen
erfolgreich bestätigt. Kein Android-50-km-Benchmark.
Das einmalige Build-Workflow-Skript wurde nach
dem Erfolg aus dem Feature-Branch wieder entfernt.

**Messgrenzen:** Die Ereigniszähler sind ausgewählte
*Auftragsanfänge*, nicht ein verifizierter tatsächlicher
Spur-/Führungswechsel. Die 42-m-Taktikklassen sagen nichts
über Seitenposition aus und sind ausdrücklich keine
Aero-Abschattung. Der Mehrfahrerwindschatten,
`advanceMotionStep` und CP/W′-Energiefluss
bleiben wie in R-13. Alle neuen Fahrzeiten und
Gruppenwerte sind fiktive Modellberechnungen
ohne externe Profi-Rennvalidierung. Die Jagd
muss nicht erfolgreich sein. Sehr große
Rückstände tatsächlicher Nachzügler sind
**kein** automatischer Fehler.

Detailtabelle aller sieben Situationen und
offene Arbeiten im
[R-14-Fachdokument](race/R14_TEAM_FUEHRUNG_VERFOLGUNG.md).


### R-14: verbindliche finale Abnahme auf main (04.11.2026)

[PR #51](https://github.com/Lancester/radsportmanager/pull/51)
übernommen, Commit `83d3e912a118903dc8cf523e6c724aef4e7d5e2f`.
[Main-Actions #41738747990](https://github.com/Lancester/radsportmanager/actions/runs/41738747990)
hat **221/221 Tests**, **0 Fehler**, drei komplette
50-km-Rennen, TypeScript-Browser-Build und ESM-Smoke-Test,
sowie Pages-Veröffentlichung vollständig erfolgreich
abgeschlossen. Die separat ausgeführten
[sieben vollständigen R-14-Rennen #41738013741](https://github.com/Lancester/radsportmanager/actions/runs/41738013741)
mit je 30 Fahrern bestätigen die Teamtempo- und
Verfolgungszähler, Energiereste und CP/W′-Grenzen.
Zusätzliche Browseransicht zeigt nun Teamtempo-
und Verfolgungsstarts. Kein Android-Performance-
Nachweis; keine externe Profi-Rennkalibrierung.
Tatsächlich erreichte Führungspositionen bleiben
separates zu testendes Spielverhalten.


## R-15/R-16: getrennte Physik- und Renn-KI-Prüfung (04.11.2026)

Die neue Rennlogik erteilt **ausschließlich**
Watt-Anforderungen. Der vorhandene
Physik- und CP/W′-Kern bleibt unverändert.
Ein ohne Nahwindschatten abgehängter
Fahrer erhält keine künstliche
Beschleunigung oder Ergebnisangleichung.

Isolationstests erfassen mehrere Helfer
und bis zu fünf Helfer desselben Teams
bei Dringlichkeit, physische Frontposition,
W′-Grenzen, teamfremde Konkurrenz,
taktisches Überlassen der Jagd,
ungünstige Fluchtlücken, dynamische
Attacken und reihenfolgestabile Entscheidungen.
Integrationstests führen komplette
30-Fahrer-/50-km-Rennen mit dem
neuen Standard sowie explizitem
R-14-Vergleich aus und prüfen
CP/W′-/Energierest und Klassifikation.

Ein gesondertes einmaliges
GitHub-Actions-Skript führt sieben
identische Fälle mit beiden Taktikmodellen
aus (14 vollständige Rennen,
420 Zielankünfte), prüft
TypeScript-ESM-Browser-Build und
reale 30-Fahrer-Ausführung.
Die fachliche Freigabe erfolgt erst nach
erfolgreichen tatsächlichen
CI-Logs; hohe mögliche Rückstände
sind nicht automatisch zu korrigieren.
Eine Auftragszuweisung ist noch kein
belegter 2D-Führungswechsel.
[Siehe R-15/R-16-Fachnotiz](race/R15_R16_MEHRHELFER_RENNINTELLIGENZ.md).
