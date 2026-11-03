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
