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
