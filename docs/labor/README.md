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

## Stand der Validierung

CI: [Workflow Rennlabor Browser-Build](https://github.com/Lancester/radsportmanager/actions/workflows/r24-browser-labor.yml). Unter PR #91 gegen den gesicherten RC1. Die Paket-Generierung übersetzt den *gleichen* Quellcode des echten Simulators.

**Wichtig:** Die Browseransicht ist nur aus dem **kompilierten** statischen Paket lauffähig. Die Quelldateien `docs/labor/app.js` und `worker.js` erwarten `docs/labor/generated/`; dies wird im GitHub-Actions-Build erstellt und als Download-Artefakt `rennlabor-browser-rc1` bereitgestellt. Den Download als Ganzes auf einen HTTPS-Webspace laden oder per lokalen HTTP-Server öffnen; nicht direkt `index.html` als `file://` starten (ES-Module/WebWorker/CORS).

Bevor die App als täglich brauchbar bezeichnet wird, ist ein echter Android-Lauf mit 154 Fahrern und Benchmark der Worker-Rechenzeit nötig. Kleine Testfelder helfen beim schnellen Prüfen der Einstellungen, sind aber nicht mit dem vollen Feld sportlich vergleichbar. Für eine dauerhafte installierte PWA und öffentlichen/privaten GitHub-Pages-Deploy wäre separat ein Veröffentlichungsentscheid nötig. Es gibt **noch keinen zugesicherten Live-Hosting-Link**.

## Wichtige ehrliche Grenzen

- **Freie Texteingabe:** Noch kein freier natürlichsprachlicher Taktikparser. Die Benutzeroberfläche bietet ausschließlich echte, überprüfbare Variablen. Ein späterer Parser darf bekannte Wünsche nur auf diese nachweisbar wirksamen Einstellungen abbilden; unbekannte Befehle müssen als nicht unterstützt markiert werden.
- **Jagdhelferzahl:** `RaceTeam.chaseHelperCount` ist im Stable-Pack-Modell als *veraltete Vergleichs-API* dokumentiert; deshalb absichtlich nicht als funktionierender Regler vorhanden. Sobald die Manager-KI einen wirksamen Helferzuteilungsparameter besitzt, kann der Benutzer ihn ohne UI-Neubau ergänzen.
- **Keine Gameplay-Balance-Garantie:** Freies Drehen aller 11 Fahrerwerte, Aero-/Physikmodi und Wetterparameter kann absichtlich unrealistische Rennen erzeugen. Vergleichsbericht zeigt deshalb ausdrücklich angewandte Änderungen.
- Es gibt keine historisch genaue GPX-Rekonstruktion oder echten 2025er Profikader, keine online-basierten Echtzeit-Renninformationen. Ergebnis-Zeitgruppen sind eine bewusst einfache Auswertung ohne alle UCI-Ausnahmen.
- Erster Browser-MVP protokolliert existierende Events; er erzeugt keine frei erfundenen Angriffserklärungen und keine nachträglichen Positionen.

## Entwicklung später wiederverwenden

`src/labor/lab-settings.ts` ist eine **versionierte Schnittstelle (schemaVersion=1)** zwischen frei kombinierbaren Testeinstellungen und realer `RaceInput`-Struktur. Der Manager kann denselben Konverter aufrufen oder später seine Team-/Fahrerdaten an denselben Input-Adapter übergeben. `docs/labor/worker.js` führt ausschließlich die vorhandene Engine aus, `finish-time-groups.ts` berechnet ausschließlich die nachgelagerte Ergebniswertung. Report-, Statistik- und UI-Funktionen können später modular umgezogen werden, ohne den Simulator neu zu schreiben.

**Empfohlene nächste Abnahme:** Build- und Integrationstests grün → Paket auf Android probieren → mindestens Lille (Sprint), Lüttich (Attacke) und Hautacam (Bergselektion) je mit identischem Seed und geänderter Taktik testen → aktive UI-/Reporting-Fehler und fehlende Managementregler sammeln → erst dann Features erweitern.
