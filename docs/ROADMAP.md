# Roadmap – schrittweise Entwicklung

**Noch keine Terminzusagen.** Das Projekt ist ein Hobby, kein kommerzielles Produkt.

## Phase 0 – Projektwissen sichern

- Öffentliches Repository erstellen.
- Konzeptdokumente, Entscheidungen, Arbeitsanweisungen und Entwicklungsstand auf Deutsch einchecken.
- Erste kleine GitHub-Issues anlegen.
- Noch keinen schweren CI-/Monte-Carlo-Workflow ausführen.
- Lizenz für echte Open-Source-Nachnutzung auswählen.

## Phase 1 – Fachliches Fundament der Rennsimulation

- Erste testbare Referenzszenarien definieren: flach, Berg, Sprint, Fluchtgruppe, Seitenwind.
- Eingabe-/Ausgabedaten und deterministische Zufallsquelle spezifizieren.
- Rechenmodell aus Physik, Leistung, Ermüdung und Gruppenlogik ausarbeiten.
- Kriterien formulieren, wann ein Ergebnis als plausibel gilt.

## Phase 2 – Isolierte Rennengine

- Grundgerüst TypeScript + Tests.
- Erst zwei Fahrer, dann Gruppe, dann viele Teams.
- Bewegung/Leistung/Ermüdung, danach Windschatten und Taktik.
- Ereignislog, Ergebnisliste, nachvollziehbarer Bericht.
- Lokaler Benchmark am Android-Handy mit ca. 160 Fahrern und 200 km.

## Phase 3 – Validierung und Balancing

- Deterministische Regressionstests.
- Gezielte Monte-Carlo-Reihen über verschiedene Rennarten.
- Fachliche Gegenproben und statistischer Realitätsvergleich.
- Rechenzeit kontrollieren und nur nach Messung optimieren.

## Phase 4 – Teams und Karriere

- Personalverwaltung, sportliche Leiter, Trainer, Scouts, Mechaniker.
- Fahrer, Verträge, Sponsoren, Budgets und Teamziele.
- Trainings-/Fahrerentwicklung, Transfermarkt, KI-Konkurrenz.
- Saisonplan, Ranglisten, Karrierehistorie und langfristige Motivation.

## Phase 5 – Spielbare Smartphone-PWA

- Vue-UI, Offline-Cache, IndexedDB, Speicherstandversionierung.
- Spielstandexport/-import und Android-Tests.
- Deutsche Texte und öffentliche Testversion; Community-Feedback.

## Erste Aufgaben

1. Referenzszenarien und messbare Anforderungen definieren.
2. Physikalisches Basismodell erstellen.
3. Physiologie/Ermüdung fachlich abgrenzen.
4. Gruppendynamik und Windschatten modellieren.
5. Reproduzierbaren TypeScript-Prototyp aufsetzen.
6. Statistische Validierung und Android-Benchmark vorbereiten.

Einzelne Aufgaben in GitHub Issues führen; dieses Dokument enthält die übergeordnete Reihenfolge.

## Erreicht am 03.11.2026: dynamischer Teilstrecken-Prototyp

Nach R-01 (Ebene) und R-02 (Anstieg) existiert ein erster eigenständiger dynamischer Einzelfahrer-Rechenkern mit Streckenabschnitten, bergab antriebswirksamer Schwerkraft, Beschleunigung und **explizitem** Bremsen. 15 neue lokale Tests bestanden, Verweise in [physik/DYNAMISCHE_STRECKE.md](physik/DYNAMISCHE_STRECKE.md).

Als nächste kleinen Physikbausteine werden **vorausschauende Kurvengeschwindigkeiten**, **rotierende Trägheit**, **feinere Straßenprofile** und Wind/Windschatten vorgeschlagen; Reihenfolge und Modellkomplexität sind noch nicht entschieden. Weiterhin kein kompletter Rennsimulator oder Manager.

## Physik-Zwischenschritt abgeschlossen: erste Kurvenvorschau und Laufradträgheit (03.11.2026)

Ein separater Technikprototyp kann vor einer als Geschwindigkeitskontrollpunkt modellierten Kurve bremsen und berücksichtigt die rotierenden Laufräder bei Beschleunigungen. **14 lokale Tests bestanden.** Große Lücken: Kurvenbogen statt Punkt, Fahrtechnik/Grip, Gruppen, Wind und Physiologie.

**Als Nächstes bevorzugt:** (1) gemeinsame dynamische Engine aus bestehenden Teilmodulen formen und gesamte Regressionstests ausführen; (2) erstes kleines Windschatten-/Gruppenexperiment R-03; (3) Web Worker plus Android-Benchmark für echte Mobilmessungen. Kein automatisches Großrechnen auf GitHub.

## Aktueller Meilenstein und nächster Arbeitsschritt (03.11.2026)

**Abgeschlossen:** Der gemeinsame dynamische Physikkern vereinigt Strecken-/Kraftrechnung, Steigung, Abfahrt, manuelle Bremskraft, Kurvenvorschau und Laufradträgheit. **49 lokale Tests bestanden**, 4 davon neue Integrationstests. Die alten APIs laufen auf einem gemeinsamen Solver.

**Nächster fachlicher Schritt:** R-03 zuerst **zwei Fahrer** bei gleicher Geschwindigkeit und unterschiedlicher Position im Windschatten; anschließend Positionswechsel und kleine Gruppen mit physikalischen Energieunterschieden. Smartphone-/Web-Worker-Rechenleistung erst an einer frühen Gruppensimulation bewerten. Später: Fahrtechnik, Risikoprofil, fahrerisches Talent und Training (Issue #19) im Karrieremodus.

Die Performance-Messung mit 160 voneinander unabhängigen 4-km-Fahrten auf Node.js ist **kein** vollständiges 160-Fahrer-Rennen.
