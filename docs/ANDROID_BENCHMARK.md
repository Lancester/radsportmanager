# Android-Benchmark – R-03 im Web Worker

**Stand: 03.11.2026 · Issue #23 · Technischer Prototyp vorhanden, echte Android-Messung noch offen.**

## Was wir testen

Erstmals soll die bestehende **R-03-Zweierfahrt** nicht nur unter Node.js, sondern auf einem **echten Android-Smartphone in Chrome/Firefox** laufen. Es wird **kein anderer Rechenkern nachgebaut**: Der Workflow übersetzt exakt `src/engine/physics/drafting-pair.ts` samt seinen Importen (`motion-core.ts`, `steady-state.ts`) mit TypeScript 5.8.3 in Browser-JavaScript.

Die Berechnung läuft in einem **dedizierten Web Worker**. Die sichtbare HTML-Oberfläche bleibt separat und zeigt die echte gemessene Laufzeit an. Alle Daten werden nur lokal im Browser verarbeitet; es gibt **keinen Ergebnis-Upload** und keine Datenbank.

**Grenze:** Ein Test mit „160 Fahrern“ besteht hier noch aus **80 voneinander unabhängigen Zweiergruppen**, die nacheinander berechnet werden. Das ist ausdrücklich **keine gekoppelte 160-Fahrer-Pelotonsimulation** und auch keine 200-km-Etappe.

## Wer macht was?

**Der Assistent:** Erzeugt/prüft Browseroberfläche, Worker, Build-Skript, Tests und GitHub-Dokumentation; später wertet er die vom Nutzer mitgeteilten Messwerte aus und verbessert die Engine.

**Der Nutzer:** Aktiviert einmalig GitHub Pages für das **öffentliche** Repository und führt dann den Benchmark **auf seinem Android-Smartphone** aus. Ohne Zugriff auf das echte Smartphone kann der Assistent nicht so tun, als hätte er bereits eine Android-Messung durchgeführt.

## Einmalig GitHub Pages aktivieren

1. Auf dem Smartphone in GitHub `Lancester/radsportmanager` öffnen.
2. **Settings → Pages** öffnen (auf einem engen Smartphone-Bildschirm ggf. Menüs horizontal scrollen oder Desktop-Ansicht wählen).
3. Unter **Build and deployment → Source**: **GitHub Actions** auswählen, **nicht** „Deploy from a branch“. Es existiert bereits der kleine Workflow `.github/workflows/r03-benchmark-pages.yml`; bitte keinen zweiten erstellen.
4. Nach Aktivierung den Bereich **Actions → Android R-03 Benchmark (GitHub Pages)** prüfen. Der kleine Workflow wird auch bei Änderungen an den Benchmarkdateien ausgelöst. Falls der erste Lauf vor dem Aktivieren von Pages fehlgeschlagen ist: den Workflow über **Run workflow → main → Run workflow** einmal manuell starten.
5. Nach erfolgreicher Veröffentlichung sollte die Seite unter `https://lancester.github.io/radsportmanager/` erreichbar sein. **Der Link ist erst nach tatsächlicher Pages-Bereitstellung als live zu betrachten.** GitHub zeigt den bestätigten Veröffentlichungslink ebenfalls unter Settings → Pages.

Bei Fehlern den Fehlertext oder Screenshot der Actions-/Pages-Meldung in den Chat schicken, statt von einem erfolgreichen Deployment auszugehen.

## Benchmark durchführen

1. Die veröffentlichte Webseite direkt in **Chrome auf Android** öffnen, möglichst nicht nur im eingebetteten In-App-Browser.
2. Für einen fairen Vergleich: nicht parallel andere Apps/Spiele belasten, am besten Akku nicht im Energiesparmodus; Gerät und Chrome-Version nennen, soweit bekannt.
3. Nacheinander **Klein**, **Mittel** und **Groß** ausführen:
   - Klein: **1 unabhängiges Paar**, 12 virtuelle Sekunden; 3 Wiederholungen.
   - Mittel: **10 unabhängige Paare**, 120 virtuelle Sekunden pro Paar; 3 Wiederholungen.
   - Groß: **80 unabhängige Paare = 160 Fahrer**, 120 virtuelle Sekunden pro Paar; 3 Wiederholungen.
4. Die Anzeige meldet die **mittlere (Median-)Rechenzeit** aus drei Wiederholungen. Zwischen den Durchläufen wird auf einem Web Worker gerechnet, nicht auf dem UI-Thread.
5. Auf **„Ergebnis kopieren“** tippen und den Bericht hier im Chat einfügen. Der Bericht enthält außerdem die Simulations-Prüfzahl (Checksumme), Rechenschritte, Browserkennung, Zeitstempel und Git-Commit. **Nichts wird automatisch verschickt.**

Der Test lässt sich jederzeit über **„Test abbrechen“** stoppen; dabei wird der Worker beendet.

### Bedeutung der Ergebnisse

Eine geringere Rechenzeit ist besser. Die Ergebnis-Prüfzahl muss bei gleichen Eingaben **identisch** sein – die Laufzeit darf wegen Wärme, Taktfrequenz und Hintergrundlast schwanken. Falls sich die Prüfzahl unterscheidet, müssen wir die Ursache prüfen, bevor wir optimieren.

**Achtung zur Interpretation:** Auch wenn 80 Paare schnell berechnet werden, können ein großes Peloton mit Nachbarschaftssuche, Seitenwind, Positions-KI und Tausenden Rennkilometern ganz andere Kosten erzeugen. Hier messen wir nur einen ersten wichtigen Baustein.

## Architektur

- `docs/index.html` – sehr kleine mobile deutschsprachige Testoberfläche.
- `docs/benchmark/app.js` – Browser-Steuerung, Start/Stop/Kopierfunktion.
- `docs/benchmark/r03-worker.js` – importiert **kompilierte echte R-03-Engine**, misst Laufzeiten mit `performance.now()` und liefert Ergebnismeldungen.
- `docs/benchmark/generated/*.js` – **generierte** JavaScript-Versionen des vorhandenen TypeScript-Codes. Sie werden nur beim Build erzeugt, nicht per Hand nachprogrammiert.
- `npm run build:benchmark` – kompiliert das R-03-Modul und dessen TypeScript-Abhängigkeiten.
- `.github/workflows/r03-benchmark-pages.yml` – kleiner, pfadbegrenzter Workflow mit 10-Minuten-Timeout, **64 bestehenden Physiktests** und anschließender Pages-Veröffentlichung.

Die Seite benötigt keinerlei PHP, Datenbank, Benutzerkonten oder externe JavaScript-CDNs.

## Kosten und Sicherheit

Das Repository ist öffentlich. Laut GitHub-Dokumentation sind **standardmäßige GitHub-gehostete Runner in öffentlichen Repositories kostenlos**; das ist nicht mit den eingeschlossenen Minuten privater Repositories gleichzusetzen. Trotzdem löst die Veröffentlichung **kleine GitHub-Actions-Läufe** aus: Wir behaupten also nicht „gar keine Actions“.

Der Workflow läuft nur bei bestimmten Code-/Test-/Webseitenänderungen auf `main` oder auf manuelle Anforderung; kein periodischer Job und keine Monte-Carlo-Dauerlast. Mit 10-Minuten-Timeout und beschränktem Github-Token. Für die Pages-Veröffentlichung benötigt er ausschließlich die üblichen Berechtigungen `pages: write`, `id-token: write`, außerdem `contents: read`.

Da die Testseite öffentlich ist, darf sie **keine privaten echten Fahrerdaten, Zugangsdaten oder internen Dateien** veröffentlichen. Die Testdaten sind fiktiv. Browserkennung und Zeitstempel erscheinen ausschließlich lokal im Bericht, den der Nutzer nur selbst kopiert.

## Bisher tatsächlich getestet

- **64/64 bestehende lokale Node.js-Tests bestanden** und TypeScript 5.8.3 erfolgreich in Browser-JavaScript übersetzt.
- Die erzeugte Browser-JavaScript-Engine wurde lokal in einer simulierten Worker-Umgebung mit Node.js aufgerufen: **1 Paar / 12 s** und **80 Paare / 120 s** lieferten reproduzierbare Endwerte und einen Ergebnisbericht.
- **Kein echtes Android-Gerät**, keine echte Online-GitHub-Pages-Veröffentlichung und kein browsergrafischer Test in dieser Umgebung bestätigt. Ein Headless-Chromium-Aufruf des lokalen Testservers wurde von der Container-Umgebung blockiert. Das ist ein offener Prüfpunkt, kein bestandener Browser-Test.
- Die vorläufigen Aero-Koeffizienten aus R-03 sind weiterhin **nicht empirisch kalibriert**.

## Noch offene fachliche/technische Fragen

1. Was sind die tatsächlich gemessenen Zeiten und stabilen Checksum­men auf dem Android-Gerät?
2. Laufen 3–8 Fahrer mit gemeinsamer Nachbarschaftssuche und seitlicher Positionierung noch ausreichend schnell?
3. Wie beeinflussen sehr lange Rennen die Rechenzeit und Akku-/Wärmeentwicklung?
4. Müssen wir Integrationszeitschritt und Abstandsmodell adaptiv vereinfachen, ohne unphysikalische Sprünge?
5. Wie soll die Leistungs-Dauer-Kurve und später die Fahrer-KI in einen größeren Web Worker gekoppelt werden?

**Nächster Schritt:** Pages aktivieren und den Android-Bericht im Chat teilen. Danach Messergebnisse gemeinsam prüfen, gegen eine lokale Node-Referenz vergleichen und das echte 3–8-Fahrer-Gruppenmodell beginnen.

## Quellen

- GitHub: [Pages-Bereitstellung über GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- GitHub: [GitHub-Actions-Abrechnung](https://docs.github.com/en/billing/concepts/product-billing/github-actions)


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


## Alle drei echten Android-Benchmarks abgeschlossen (03.11.2026, Nachtrag)

**Messquelle:** Vom Nutzer direkt kopierte Ergebnisberichte der öffentlichen GitHub-Pages-Seite. Alle drei Berichte stammen aus **Browser-Physikversion `dffcf78`**, Testversion `r03-android-v1`, **Web Worker auf Android / Chrome 156**. Der übermittelte User-Agent ist datenschutzbedingt verallgemeinert (`Android 10; K`); daraus lässt sich das reale Gerätemodell oder seine tatsächliche Android-Version **nicht** sicher bestimmen.

| Kennzahl | Klein | Mittel | Groß |
| --- | ---: | ---: | ---: |
| Unabhängige Zweiergruppen | 1 | 10 | 80 |
| Insgesamt berechnete Fahrer | 2 | 20 | 160 |
| Virtuelle Sekunden je Paar | 12 | 120 | 120 |
| Integrationsschritte je Wiederholung (Paar-Schritte) | 60 | 6.000 | 48.000 |
| Rechenzeiten, ms (3 Wiederholungen) | 18,8 / 7,1 / 4,6 | 75,0 / 35,5 / 26,2 | 257,7 / 191,8 / 166,5 |
| **Median, ms** | **7,1** | **35,5** | **191,8** |
| Reproduzierbare Prüfsumme im Bericht | 276,626283 | 24.318,863289 | 194.550,906309 |
| Zeitpunkt des Nutzerberichts, UTC | 17:00:40.740 | 17:03:49.672 | 17:03:59.174 |

**Vergleich:** Zwischen 10 und 80 Zweiergruppen bleibt die simulierte Dauer je Paar gleich (120 s); die Zahl der Rechenschritte steigt **8-fach** (6.000 → 48.000), die Median-Laufzeit jedoch nur **5,40-fach** (35,5 → 191,8 ms). Umgerechnet sind das ca. **5,92 µs** bzw. **4,00 µs** je Paar-Zeitschritt, wobei Startkosten/JIT und andere Systemeffekte in der Laufzeit enthalten sind. Der kleine Test ist aufgrund anderer Simulationsdauer und stärkerer Startkosteneffekte nicht für eine lineare Skalierung geeignet.

**Konsistenzcheck:** Die längeren Tests benutzen dieselben simulierten Paare und dieselbe Zeitspanne. Die große Prüfsumme 194.550,906309 stimmt bis auf **0,000003** mit dem Achtfachen der mittleren Prüfsumme (194.550,906312) überein – eine mit der sechsstelligen Rundung verträgliche Abweichung. Der Web Worker selbst hat auch jeweils drei gleiche Prüfsummen je Test als Voraussetzung für einen Erfolgsbericht kontrolliert. **Ein unabhängiger Node-Vergleich exakt derselben Build-Version steht noch aus.**

**Was dieser Erfolg belegt:** Der Browser lädt und führt unsere kompilierte echte R-03-TypeScript-Engine im Android-Web-Worker aus; die vorgegebenen Szenarien werden reproduzierbar abgeschlossen. Die große Messung verarbeitet 80 Zweiergruppen über jeweils 120 virtuelle Sekunden in einem Median von rund **0,192 s realer Laufzeit**.

**Was nicht belegt ist:** Die 160 Fahrer fahren **nicht miteinander** im selben Feld, sondern in **80 unabhängig berechneten Paaren**. Kein gemeinsames Peloton, keine Mehrfach-Windschattennachbarschaft, keine taktische/Positions-KI, kein Querwind, keine Ausdauer-/Ermüdungsrechnung, keine 200-km-Strecke und keine Langzeitmessung bezüglich Akku, Wärme und Sperrbildschirm. Die reale Laufzeit könnte bei diesen Wechselwirkungen deutlich ansteigen. **Keine Extrapolation auf ein vollständiges Rennen.**

**Folge:** Der erste Android-Benchmark ist als Messmeilenstein **erledigt**. [Issue #23](https://github.com/Lancester/radsportmanager/issues/23) bleibt **offen**, weil seine nächste Entwicklungsstufe – eine echte gemeinsame 3–8-Fahrer-Gruppe mit Nachbarschaftsinteraktionen und darauf folgendem Android-Test – noch nicht umgesetzt ist. Für diesen Schritt zuerst ein kleines deterministisches 3-/8-Fahrer-Modell, danach Browser- und Android-Messungen auf identischem Szenario-Commit. **Keine weiteren Nutzerfragen für die bereits übermittelten Messwerte erforderlich.**


## Neuer Gruppen-Benchmark: Acht tatsächlich gekoppelte Fahrer (03.11.2026)

Der neue GitHub-Pages-Workflow [#41683075141](https://github.com/Lancester/radsportmanager/actions/runs/41683075141) ist erfolgreich durchgelaufen und hat **80/80 Tests**, beide kompilierten Browsermodule und die funktionierende Achtfahrer-Smokeprüfung bestätigt. Die aktualisierte Testseite ist auf https://lancester.github.io/radsportmanager/ veröffentlicht.

**Anleitung:** Auf Android in Chrome dieselbe Testseite öffnen. Den **vierten Knopf „NEU · 8 Fahrer gemeinsam · 120 s“** betätigen, dann auf **Ergebnis kopieren** tippen und den JSON-Bericht in den Chat einfügen. Keine erneute GitHub-Pages-Einstellung erforderlich.

Im Gegensatz zum bisherigen 160-Fahrer-Test aus 80 unabhängigen Paaren fährt die neue Achtfahrergruppe **auf einer einzigen Simulationsuhr**. Jeder Fahrer berücksichtigt die Windschattenwirkung sämtlicher Vorderleute über den provisorischen, gedeckelten Mehrfahrer-Aerofaktor. Bei Sekunde 30 reduziert F8 auf externe Vorgabe seine Pedalwatt um 45 W, und die entstehende Lücke wird vom Physikkern erkannt. Der neue Bericht enthält `mode=achtfahrer-gruppe`, die Laufzeiten aller drei Wiederholungen, `stepsPerRepeat=600`, `checksum`, `finalGapM`, `gapEvents` und `firstGapTimeS`.

**Status:** Die Browsermodule und GitHub-Pages-Bereitstellung wurden auf GitHub erfolgreich geprüft, aber ein **tatsächlich auf dem Android-Smartphone durchgeführter Achtfahrer-Benchmark liegt noch nicht vor**. Der Vergleich mit der 191,8-ms-Messung für 80 unabhängige Zweiergruppen darf deshalb nicht als direkte Hochrechnung verstanden werden.

**KI-Abgrenzung:** Noch keine autonome Renn-/Positions-KI. Die Wattvorgaben sind extern und die Spur ist fest; die körperliche Reaktion, Energie und Lücke folgen aus mechanischen Rechnungen.


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


## Neuer Vergleichsmodus R-05 · KI + Abstand + CP/W′ (03.11.2026)

Die bekannte Seite unter https://lancester.github.io/radsportmanager/ soll einen fünften Testknopf `NEU · KI + Abstand + CP/W′` erhalten. Er verwendet dieselbe Achtfahrergruppe mit dem bisherigen Lückenagenten, ergänzt um eine **optionale longitudinale Sicherheitsregel** und ein **eigenes CP/W′-Profil von F8**, wobei FTP separat als Datenfeld gespeichert wird.

Der Bericht ergänzt `wPrimeRemainingJ`, `wPrimeSpentJ`, `cpLimitedSeconds`, `safetyBrakeSeconds` sowie Ereignisanzahlen. **Vor bestätigter Actions-Veröffentlichung und tatsächlichem Android-Lauf sind diese neuen Werte nicht gemessen.** Die früheren 21,6/32,9-ms-Werte stammen weiterhin aus der R-04-Version.

Zur Bedeutung/den ausdrücklich noch fehlenden physiologischen Realitätsnachweisen: [R-05](physik/R05_ABSTAND_CP_WPRIME.md).


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


## Neu vorgesehen: R-06-Überholmanöver im Browser

Zusätzlicher Android-Test `achtfahrer-ueberholen` über 65 virtuelle Sekunden: F8 erhält **zuerst eine zeitlich begrenzte Querverschiebung**, danach einen separaten Watt-Befehl und kann auf ausreichend getrennter Spur tatsächlich überholen; Überholereignisse und Spurwechsel werden ausgegeben. **Noch keine autonome Spur-KI**. Das bestehende R-05-Preset meldet künftig zusätzlich durchschnittliche **tatsächlich gefahrene Kurbelwatt**, Zeit über FTP und entsprechende Arbeitsmenge. Dies sind reine Diagnosegrößen, keine vollständige Trainingssteuerung.

**Wichtig:** Die neue Browser-Version und die wirkliche Android-Zeit erst nach erfolgreichem GitHub-Pages-Deploy bzw. Nutzerlauf als bestätigt markieren; die früheren Benchmarks bleiben korrekt. [Technik](physik/R06_SICHERHEIT_SPUR_FTP.md).


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
