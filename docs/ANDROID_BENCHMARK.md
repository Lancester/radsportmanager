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
