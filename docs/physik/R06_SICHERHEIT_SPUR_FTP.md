# R-06 · Gebündelte Weiterentwicklung: Führungsbremsung, erste Überholbewegung und FTP-Leistungsdaten

**03.11.2026 · Drei getrennte, eng zusammengehörige technische Schritte.**

## Überblick

Die bisherige R-05-Gruppenengine kann acht Fahrer physikalisch gekoppelt berechnen, eine Lücke erkennen und begrenzte Wattwünsche unter CP/W′ übergeben. Die nächste Version ergänzt **drei überprüfbare Bausteine**, ohne vollständige Fahrerfeld-/Kurvenphysik vorzutäuschen:

1. **Vorausschau beim Bremsen des Vordermanns** mit explizit bekanntem Bremsbefehl und eigener maximaler Verzögerung.
2. **Stetiges seitliches Verschieben** mit begrenzter Quergeschwindigkeit, Straßenbreite und Prüfung der gesamten Bewegung zwischen zwei Zeitschritten. Ein extern vorgegebenes Manöver kann einen anderen Fahrer wirklich überholen.
3. **FTP-Telemetrie aus tatsächlich geleisteten Kurbelwatt** als Trainingsdaten-Basis. Noch kein Trainingseffekt-/Trainingsplaner.

## Schritt 1: Vorausschauende Abstandsregelung

Die Sicherheitsregel `src/engine/ai/following-safety.ts` kann eine ausdrücklich verlangte Verzögerung des Vordermanns berücksichtigen, nicht nur dessen momentan gemessenes Tempo. Dazu wird innerhalb des vorhandenen Vorschauhorizonts die mögliche Führendengeschwindigkeit abgeschätzt. Anhand von Reaktionsweg und zwei Bremswegen wird eine konservative Leistungsrücknahme oder Bremskraft verlangt.

`src/engine/physics/drafting-group.ts` kennt dafür zusätzlich optionale `GroupCommand.brakeForceN`-Kommandos. Sie gehen durch den **gleichen Bewegungsintegrator** wie alle übrigen Kräfte; die mechanische Energiegleichung enthält Bremsverlustarbeit. So lässt sich ein kontrollierter Fall „F7 bremst, F8 reagiert“ testen, statt nur die Lückenbildung eines zurückfallenden F8.

**Wichtig:** Der Bremsbefehl des Vordermanns ist in diesem Prototyp **szenarisch vorab bekannt**. Daraus folgt keine reale Vorhersehbarkeit fremder Bremsmanöver. Bei physikalisch schon zu geringem Restabstand kann die Simulation weiterhin einen Fehler melden. **Keine garantiert kollisionsfreie Steuerung, kein Verkehrs-/Sicherheitsprodukt.** Fahrtechnik, Reaktionsträgheit, Reibkreis, Kurven und Nässe bleiben offen.

## Schritt 2: Stetige Querverschiebung und Überholen

Der neue, separat testbare Baustein `src/engine/physics/lateral-motion.ts` begrenzt die seitliche Bewegung pro Zeitintervall:

`|Δy| ≤ seitliche_Geschwindigkeitsgrenze × Δt`

Im Beispiel gelten **0,8 m/s** als reine technische Quer-Sollgeschwindigkeit, **±3 m** Straßenhalbbereich, **1,8 m** minimale Längs- und **1,25 m** minimale Querzentrumstrennung. Alle Werte sind Testgeometrie, **keine empirisch validierten Radfahrer-Abmessungen oder Kurvenanforderungen**.

**Statt nur an den Endpunkten** wird die lineare Bewegung innerhalb eines Zeitschritts auf gleichzeitige Unterschreitung von Längs- und Querabstand geprüft („swept AABB“). Dadurch darf ein Fahrer auf einer getrennten Spur mit gleicher Längsposition überholen, aber nicht unbemerkt während eines Zeitschritts durch einen anderen kreuzen. Ein echtes Überholen erzeugt ein eigenes `overtake`-Ereignis mit beiden Fahrer-IDs.

In der neuen Achtfahrer-Demo fährt F8 zuerst von y=0 auf y=2,0 m; erst danach bekommt er einen externen 500-W-Testbefehl und kann F7 auf getrennter Spur überholen. Das ist **keine selbstgewählte Attacke**. Seitenbewegung wird im ersten Schritt nur kinematisch begrenzt; Lenkeinschlag, Schräglage, Querbeschleunigung, Fahrtechnik-Risiko und zusätzliche Energiearbeit für das Ausweichen sind **noch nicht** modelliert.

## Schritt 3: FTP-Statistik aus real angewendeten Watt

`src/engine/physiology/ftp-work.ts` berechnet pro Fahrer mit gemessenem/gespeichertem `ftpW` aus tatsächlich angewendeter Pedalleistung:

- `averageCrankPowerW`: mittlere Pedalleistung über die simulierte Zeit.
- `timeAboveFtpS`: Zeit in Zeitschritten, deren tatsächlich erlaubte Leistung **größer als** FTP war.
- `workAboveFtpJ`: Zeitintegral der Leistung **über dem FTP-Zahlenwert** in Joule.

Die Werte stammen **nach** Sicherheits- und CP/W′-Begrenzung aus dem echten Integrator-Wattwunsch; unerfüllte KI-Anforderungen zählen nicht. FTP bleibt separat von CP.

**Keine Gleichsetzung mit physiologischer Überforderung:** Zeit über FTP oder Arbeit über FTP sind nur mathematische Diagnosegrößen, keine eigenständig validierte Ermüdung, FTP-Trainingszonen, TSS oder Trainingseffekt-Prognose. Ein vollwertiges Trainingssystem bleibt [Issue #32](https://github.com/Lancester/radsportmanager/issues/32).

## Prüfplan und Browser

- `tests/r06-safety-lane-ftp.test.mjs` prüft diskrete/übersprungene Kreuzung, nebeneinander Überholen, Seitengeschwindigkeitslimit, Fehler bei unmöglichen Spuraufträgen, deterministischen Achtfahrer-Überholtest, vorausschauendes Reagieren auf Bremsbefehl und die unabhängige FTP-Leistungsstatistik.
- Bestehende **116 Tests** bleiben zu bestehen; die gesamte neue Testsuite darf erst nach echtem GitHub-Actions-Lauf als erfolgreich bezeichnet werden.
- Auf der Android-Testseite wird ein zusätzlicher Knopf **„8 Fahrer überholen · 65 s“** veröffentlicht. Bestehende v1–v4-Szenarien bleiben erhalten, im neuen R-05-Bericht kommen drei FTP-Diagnosewerte hinzu.
- Der Test muss erst im GitHub-Runner die Original-TypeScript-Module kompilieren und ausführen. Eine **reale Android-Rechenzeit** des neuen Überholtests liegt erst vor, wenn der Nutzer ihn auf dem Smartphone startet.

## Entwicklungseinordnung und weitere Entscheidungen

Diese drei Bausteine sind eine **kleine Erweiterung der Testphysik**, kein kompletter 160-Fahrer-Rennsimulator. Weiter offen: eine **wirklich autonome** Wahl geeigneter Spuren und Überholmomente, dynamische Radspur mit Lenkwinkel/Querbeschleunigung, sichere Durchfahrt durch Kurven und beim bremsenden Feld, korrekte Interaktion mehrerer paralleler Reihen, Seitenwind, realistische Ermüdungs- und W′-Wiederauffüllung sowie echtes mehrstündiges Rennen.

Vorgeschlagene nächste Reihenfolge: nach Android-Überholmessung zuerst eine **einfache, erklärbare automatische Spurwahl für einen einzigen Fahrer** mit sicherer Konfliktprüfung; danach ein Strecken-/Kurvenexperiment auf demselben physikalischen Mehrfahrer-Kern. Fachliche Entscheidungen zu Fahrtechnik/Risiko und Rennpräsentation vor einer größeren 160-Fahrer-KI mit dem Nutzer klären.


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
