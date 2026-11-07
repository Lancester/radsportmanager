# Rennlabor – Browser-MVP (erste Testversion)

**Branch:** `develop/renn-labor-mvp-20261106` auf Basis von `release/race-engine-1.0-rc1`. **Keine neue Rennphysik, keine Änderung am Releasekandidaten, kein Merge in `main`.** Die ursprünglichen TypeScript-Engine-Module werden durch den CI-Build unverändert für den Browser nach JavaScript übersetzt.

## Bereits implementiert
- 4 rekonstruierte Referenzszenarien (Lille, Boulogne, Lüttich, Hautacam), 2–22 Teams, frei gewählter deterministischer Seed, 5 Startfeld-Schwerpunkte.
- **22 individuelle Teamleitlinien** mit `ausgewogen`, `offensiv`, `sprint`, `kapitaen_schuetzen`.
- **11 Fahrerregler je Teilnehmer:** CP, W′, Masse, CdA, Aggression, Abfahrt, Sprint, Hinterradfinden, Verpflegung in g/h, Langzeitbelastbarkeit und W′-Regeneration. Einzelne Leistungsparameter wirken nur über die bestehenden Physiologieberechnungen.
- **Streckenumgebung:** Gegen-/Rückenwind, Seitenwind, Crr, Abfahrtskomplexität. Diese Werte gelten bewusst für alle Streckenabschnitte, nicht als historischer Wetterdatensatz.
- **Forschungsschalter:** Stable Pack und alle vorhandenen Vergleichsgruppenmodelle, Formations- bzw. Legacy-Aerodynamik, alte/neue Taktikregeln, Ausdauer ein/aus, Attacken deaktivieren, Zeitschritt 0,5/1 s.
- **Nur für Ergebnisanzeige:** 1-s-/3-s-Provisorische-Zielgruppenwertung. Die gewertete Gruppe verändert keine Fahrerposition, Energie oder Zieleinlaufreihenfolge.
- **Bericht:** Gesamtergebnis, Roh- und Gruppenzeit, Fahrerrollen, W′ im Ziel, Ereignisse der Renn-KI, alle 5 km Gruppenentwicklung, geänderte Variablen.
- **A/B-Wiederholung:** vorangegangenes und neues Rennen werden verglichen. Austausch reproduzierbarer Szenarien als JSON.
- Rechenmotor im WebWorker, kein Login, keine serverseitige Datenbank und keine KI-API. Android-Browser als vorrangige Zielplattform.

## Mein Team: Namen, Kapitän und persönlicher Rennbericht (07.11.2026)

- **Fiktive plausible Vor- und Nachnamen** statt `Fiktiver Profi F001`. Sie werden ohne externe Daten oder Netzwerkanfragen aus einem sprachlich gemischten Namenspool deterministisch berechnet. **Gleicher Seed und gleiche Fahrer-ID ergeben immer denselben Namen**. Alle 154 Namen sind innerhalb eines Testfeldes eindeutig; die IDs sowie sämtliche Leistungs- und Körperwerte bleiben unangetastet. Es sind ausdrücklich keine realen lizenzierten Profikader.
- **Mein Team auswählen**, danach einen der sieben Teamfahrer explizit als **Kapitän** bestimmen. Die andere bisherige Kapitänsrolle wird zu Helfer geändert; dem ausgewählten Fahrer wird die tatsächliche `RaceRole='kapitaen'` zugeteilt. Damit wirken Kapitänsschutz, Ziele und andere vorhandene KI-Entscheidungen physisch in der Engine. Kein Bonus auf CP/W′ oder Position.
- **Im normalen Modus werden nur die sieben Fahrer des eigenen Teams bearbeitet.** Konkurrenzteams laufen autonom. Andere Mannschaften bzw. alle Fahrer sind nur im aufklappbaren Entwicklermodus editierbar.
- **Teambericht vor Gesamtergebnis**: eigene sieben Endplatzierungen samt Namen, tatsächlicher Kapitänsrang, gutgeschriebener Zielrückstand, W′-Restreserve, an einigen 5-km-Checkpoints gemessene Kapitänsgruppe und Abstand zur Rennspitze sowie wirkliche, dem eigenen Team zugeordnete KI-Ereignisse (Angriffe, Jagd- und Sprintzugaufträge).
- **Streng faktischer Bericht:** Einzelne Team-Aufträge bedeuten nicht automatisch erfolgreiche Fluchten oder gemessene Windfrontarbeit. Berichtstexte stammen ausschließlich aus Klassifikation, vorhandenen `RaceEvent`-Einträgen und gemessenen Checkpoints; keine frei erfundenen Erklärungen. Das Modul `src/labor/team-report.ts` bleibt später im Manager wiederverwendbar.
- **Vergleich und JSON**: `myTeamId` und `captainId` ergänzen das vorhandene versionierte Einstellungsmodell; bestehende Version-1-Szenarien ohne diese zwei optionalen Felder behalten ihre bisherigen Standardrollen.

## Neue taktische Anweisungen pro Team (Taktikplan v1)

Neben den vier bewährten **Grundstrategien** gibt es sechs unabhängig kombinierbare Vorab-Anweisungen. Sie wirken tatsächlich im **gleichen originalen** Rennmotor und sind als wiederverwendbarer `TeamTacticalPlan` in `src/engine/race/team-tactical-plan.ts` definiert.

| Regler | Auswahl | Präzise Wirkung / Grenze |
| --- | --- | --- |
| Angriffslust des Teams | keine, vorsichtig, normal, aggressiv, sehr aggressiv | Kein Angriff / Wahrscheinlichkeit von realen KI-Angriffsentscheidungen skalieren. Stärke bleibt durch CP/W′ beschränkt |
| Zeitpunkt der Angriffe | flexibel, früh (0–30 %), Mitte (30–70 %), spät (ab 70 %), Finale (ab 86 %) | Neue Angriffsgelegenheiten nur im gewählten Rennabschnitt zulassen; **erzeugt keine Angriffe ohne Renngelegenheit** |
| Verfolgungsbereitschaft | nicht selbst jagen, nur gefährliche Fluchten, nach Rennlage, konsequent | Organisierte Verfolgung nur bei wirklich vorhandener Flucht und geeigneter Gruppe. Helferwahl/-anzahl bleibt autonom |
| Einsatztempo der Helfer | Kräfte sparen, normal, hoch | Begrenzt geänderte Wattwünsche bereits nominierter Helfer. Keine zusätzlichen Watt oder Positionsboni |
| Finale | situationsabhängig, Sprint bevorzugen, späte Attacke bevorzugen, Kapitän priorisieren | Im letzten Abschnitt die Angriffswahrscheinlichkeit senken bzw. erhöhen; „Kapitän“ favorisiert zusätzliche Schutzarbeit. **Ein Sprintzug benötigt weiterhin die Grundstrategie „Sprint“** |
| Kapitänsschutz | normal, besonders schützen | Mehr Schutzleistung von tatsächlich anwesenden, autonomen Teamhelfern, keine Positionsgarantie |

**Grundstrategie und Taktikplan ergänzen einander.** Beispiel: „Sprint“ + „keine eigenen Attacken“ + „konsequent jagen“ + „Kräfte sparen“ ist zulässig und kann auf eine tatsächlich vorhandene Flucht wirken. „Offensiv“ + „nur Finale angreifen“ schränkt Offensiv-Attacken auf das gewählte Zeitfenster ein, ohne sie zwangsweise auszulösen. Kombinationen können sich in ihrer Wirkung abschwächen.

Die KI **entscheidet weiterhin eigenständig über die Anzahl und Namen der eingesetzten Jagdhelfer**. Kein Regler „Anzahl Jagdhelfer“ ist enthalten oder vorgesehen. Alle Optionen werden pro Team in der Version-1-JSON-Szenariokonfiguration gespeichert. Fehlender Taktikplan bedeutet exakt das bisherige RC1-Verhalten.

**Kalibrierregel:** Die gezeigten Stufen sind vorläufige, begrenzte KI-Parameter und keine empirisch validierten Siegchancen. Sie sollen in kontrollierten A/B-Rennen mit gleicher Strecke und gleichem Seed geprüft werden. „Konsequent nachführen“ ist kein Befehl zur aussichtslosen Jagd ohne tatsächliche Flucht; „sehr aggressiv“ garantiert keinen Angriff.

## Stand der Validierung

CI: [Workflow Rennlabor Browser-Build](https://github.com/Lancester/radsportmanager/actions/workflows/r24-browser-labor.yml). Unter PR #91 gegen den gesicherten RC1. Die Paket-Generierung übersetzt den *gleichen* Quellcode des echten Simulators.

## Installation auf Android – **ohne Webspace**

**Empfohlen: die eigenständige Offline-APK.** [Erfolgreicher Android-Build](https://github.com/Lancester/radsportmanager/actions/runs/42253782776). Unter **Artifacts** `rennlabor-android-offline-apk` herunterladen und entpacken. Die enthaltene `app-debug.apk` auf dem Android-Handy öffnen und installieren; falls Android nachfragt, die Installation aus der verwendeten Dateimanager-/Browserquelle einmalig erlauben. Die App besitzt **keine INTERNET-Berechtigung**. Alle Dateien des Spiels – einschließlich unveränderter RC1-Engine, WebWorker, Berichte und UI – sind vollständig in der APK eingebettet. Es gibt keinen Webspace, keine API und keine Datenbank. Das Debug-APK ist für private Tests gedacht und kann später durch ein regulär mit dauerhaftem Schlüssel signiertes Paket abgelöst werden.

**Alternative: installierbare Offline-PWA.** Bei erstmaliger Bereitstellung über einen vertrauenswürdigen HTTPS-Link oder einen **lokalen HTTP-Server auf dem Handy** wird das gesamte Browserpaket per ServiceWorker gespeichert. Anschließend laufen Seitenaufruf und Rennberechnung **ohne Netz**. Ein permanenter Hostingdienst ist dazu nicht nötig. Das CI-Paket aus `rennlabor-browser-rc1` enthält eine App-Manifest-Datei, ServiceWorker und eine Build-Liste aller zu speichernden Dateien. `file://` kann wegen JS-Modulen und WebWorkern nicht als PWA-Quelle verwendet werden. Die APK benötigt diese Erstbereitstellung nicht.

Das Rennlabor ist weiterhin ein Browserprogramm; die APK verwendet Android WebView mit lokalen Assets unter `https://appassets.androidplatform.net/` – **keine echte Internetdomain**. Die Engine wird nicht in Java neuimplementiert und bleibt später für den Manager wiederverwendbar.

## Mobile Browser-Abnahme

[Actions #42250591219](https://github.com/Lancester/radsportmanager/actions/runs/42250591219) auf Ubuntu 24.04: Chromium emuliert **Pixel 7**, lädt 22 Team-Leitlinien und 11 individuelle Fahrerregler, keinerlei horizontaler Seitenüberlauf (412 px) und führt **zwei echte WebWorker-Rennen erfolgreich aus**:
- 2 Teams / 14 Fahrer: 1,85 Sekunden berechnete Workerzeit.
- 22 Teams / **154 Fahrer**: 14,6 Sekunden berechnete Workerzeit, alle 154 in Ergebnisliste, Rennbericht vorhanden.
- Das sind CI-Messungen in einem **emulierten mobilen Browser**, **kein** Benchmark auf dem echten Android-Gerät. Die tatsächliche Laufzeit kann abweichen.

**Wichtig:** Die Browseransicht ist nur aus dem **kompilierten** statischen Paket lauffähig. Die Quelldateien `docs/labor/app.js` und `worker.js` erwarten `docs/labor/generated/`; dies wird im GitHub-Actions-Build erstellt und als Download-Artefakt `rennlabor-browser-rc1` bereitgestellt. Für die PWA einmalig über HTTPS oder einen nur auf dem Gerät laufenden lokalen HTTP-Server bereitstellen; die APK ist einfacher und benötigt das nicht. Nicht direkt `index.html` als `file://` starten (ES-Module/WebWorker/CORS).

Die browseremulierten 14- und 154-Fahrer-Läufe sind erfolgreich; vor der endgültigen Alltagseinstufung fehlt noch der **Test auf einem echten Android-Telefon**. Kleine Testfelder helfen beim schnellen Prüfen der Einstellungen, sind aber nicht mit dem vollen Feld sportlich vergleichbar. Die **Offline-PWA wurde implementiert**: [Mobiler Offline-CI-Test](https://github.com/Lancester/radsportmanager/actions/runs/42253881080) mit 42 vorgeladenen Dateien, Webseiten-Neustart ohne Internet und neuem erfolgreichen 14-Fahrer-Rennen; zusätzlich kompletter 154-Fahrer-Lauf online. Die **native Android-APK wurde erfolgreich gebaut**, aber ein manueller Test auf einem echten Smartphone steht noch aus. GitHub Pages oder ein anderer Webspace sind **keine Voraussetzung**.

## Wichtige ehrliche Grenzen

- **Freie Texteingabe:** Noch kein freier natürlichsprachlicher Taktikparser. Die Benutzeroberfläche bietet ausschließlich echte, überprüfbare Variablen. Ein späterer Parser darf bekannte Wünsche nur auf diese nachweisbar wirksamen Einstellungen abbilden; unbekannte Befehle müssen als nicht unterstützt markiert werden.
- **Jagdhelferzahl:** `RaceTeam.chaseHelperCount` ist im Stable-Pack-Modell als *veraltete Vergleichs-API* dokumentiert; deshalb absichtlich nicht als funktionierender Regler vorhanden. **Diese Detailentscheidung bleibt bewusst vollständig bei der autonomen Renn-KI und ist weder jetzt noch im späteren Manager als Nutzerregler geplant.**
- **Keine Gameplay-Balance-Garantie:** Freies Drehen aller 11 Fahrerwerte, Aero-/Physikmodi und Wetterparameter kann absichtlich unrealistische Rennen erzeugen. Vergleichsbericht zeigt deshalb ausdrücklich angewandte Änderungen.
- Es gibt keine historisch genaue GPX-Rekonstruktion oder echten 2025er Profikader, keine online-basierten Echtzeit-Renninformationen. Ergebnis-Zeitgruppen sind eine bewusst einfache Auswertung ohne alle UCI-Ausnahmen.
- Erster Browser-MVP protokolliert existierende Events; er erzeugt keine frei erfundenen Angriffserklärungen und keine nachträglichen Positionen.

## Entwicklung später wiederverwenden

`src/labor/lab-settings.ts` ist eine **versionierte Schnittstelle (schemaVersion=1)** zwischen frei kombinierbaren Testeinstellungen und realer `RaceInput`-Struktur. Der Manager kann denselben Konverter aufrufen oder später seine Team-/Fahrerdaten an denselben Input-Adapter übergeben. `docs/labor/worker.js` führt ausschließlich die vorhandene Engine aus, `finish-time-groups.ts` berechnet ausschließlich die nachgelagerte Ergebniswertung. Report-, Statistik- und UI-Funktionen können später modular umgezogen werden, ohne den Simulator neu zu schreiben.

**Empfohlene nächste Abnahme:** Build- und Integrationstests grün → Paket auf Android probieren → mindestens Lille (Sprint), Lüttich (Attacke) und Hautacam (Bergselektion) je mit identischem Seed und geänderter Taktik testen → aktive UI-/Reporting-Fehler und fehlende Managementregler sammeln → erst dann Features erweitern.
