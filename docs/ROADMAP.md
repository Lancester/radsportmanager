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

## R-03 – Windschatten mit zwei Fahrern (03.11.2026)

Erster gekoppelter Zweier-Prototyp: Positions-/Abstandsdaten steuern eine parametrisierte **Aero-Reduktion** und beide Fahrer werden in gemeinsamen Zeitschritten berechnet. 64/64 lokale Tests bestanden. Mehr als zwei Fahrer, Wind, taktische KI und echte relative seitliche Bewegungen fehlen.

**Nächster technischer Meilenstein:** einen simplen Browser-/Web-Worker-Test der R-03-Engine auf **Android** ausführbar machen; dann positionsabhängiger Windschatten in einer **3–8-Fahrer-Gruppe** und langfristig adaptiv effizientere Simulation statt unnötig aufwändiger 0,2-s-Berechnung für alle 160 Fahrer. [R-03-Dokumentation](physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md).

## Smartphone-Meilenstein in Arbeit (03.11.2026)

Der erste deutschsprachige, statische Android-/Browser-Benchmark für **R-03-Zweierfahrten** ist als GitHub-Pages-Webseite vorbereitet. Er verwendet den **identischen kompilierten TypeScript-Rechenkern** und führt unabhängige Testpaare im Web Worker aus, während die UI bedienbar bleiben soll. GitHub-Pages-Freischaltung durch den Repo-Admin und der echte Android-Test stehen noch aus.

**Unmittelbar:** GitHub Pages → Source **GitHub Actions** aktivieren; App-Link/Build prüfen; Android 1/10/80-Paar-Test durchführen und Bericht auswerten. **Danach:** 3–8 tatsächlich gekoppelte Fahrer auf einer gemeinsamen Uhr mit gegenseitiger Position/Windschatten. Erst nach validierten Mobilwerten Optimierung und größere Gruppen.

[Anleitung](ANDROID_BENCHMARK.md) · [Issue #23](https://github.com/Lancester/radsportmanager/issues/23).

## Achtfahrer-Gruppenexperiment R-03G (03.11.2026)

Ein neuer, vorläufiger Physikbaustein verbindet **3–8 Fahrer auf derselben Simulationsuhr**, mit abstands-/seitenabhängiger Windschattenwirkung **aller vorausfahrenden Nachbarn**, Energiebericht und Lückenereignissen. Die KI trifft **noch keine Entscheidungen**; für den ersten Test sind Wattzahlen und Spur vorgegeben.

**Nächste Meilensteine:** (1) 80 GitHub-Tests inklusive echter Integration erfolgreich, (2) neuen Achtfahrer-Web-Worker-Test auf Android ausführen, (3) Positions-/Spurwechselkontrolle und individuelle Fahrtechnik vorbereiten, (4) später regelbasierte taktische Agenten und realistisch kalibrierte Feld-Aerodynamik ergänzen. [Dokumentation](physik/R03G_ACHTFAHRER.md).


## R-04: erster deterministischer Fahrer-Agent (03.11.2026)

Ein kleines TypeScript-Zustandsmodell (ohne KI-Bibliotheken) beobachtet eine Lücke und entscheidet befristet über zusätzliche Watt; alle Kräfte bleiben im gemeinsamen physikalischen Rechenkern. Die Achtfahrer-Testseite bekommt zwei sonst identische Versuche **ohne/mit Agenten**. Erst Github-Gesamttest und echter Android-Web-Worker-Lauf, dann Rechenleistung/Balancing bewerten.

**Anschließend:** sichere Abstands-/Kollisionsregelung samt erreichbarer seitlicher Positionen; CP/W′ und Ermüdung; Fahrerübersicht, Talente, Fahrtechnik, Risikobereitschaft und Teamstrategie. Die vollständige Rennengine bleibt eine frühe Prototypenphase; 160 Fahrer/200 km sind noch nicht als gekoppelte Rennsimulation vorhanden.

[Agentenentscheidung und offene Fragen](ai/LUECKENAGENT.md).


## R-05: erste physiologisch begrenzte Renn-KI mit Längsabstandsregler (03.11.2026)

Im nächsten Prototyp kann ein Agent eine Lücke schließen wollen, bekommt aber **zuerst** von einer Sicherheitsinstanz gegebenenfalls Wattreduzierung/physikalische Bremskraft und wird **danach** durch individuelle CP/W′-Reserve auf tatsächlich leistbare Watt begrenzt. **FTP** ist als separater Trainings-/Fahrerwert angelegt; das echte langfristige FTP-Trainingssystem fehlt noch.

**Nächste Nachweise:** Vollständigen GitHub-Testsatz samt Android-Browsermodul bestehen, dann den neuen R-05-Preset auf echtem Android-Gerät testen. **Danach** Seitenbewegung, Brems-/Kurvenhaftung, kalibrierte W′-Erholung und Ermüdung über Stunden. [Dokumentation](physik/R05_ABSTAND_CP_WPRIME.md).


## R-06: nächste Etappe gebündelt – Bremsende Gruppe, Seitenbewegung, FTP-Daten

Erster Radsportgruppenprototyp mit vorausschauender Sicherheitsreaktion auf **extern bekannte** Führungsbremsung, zeitlich stetiger **vorgegebener** seitlicher Bewegung und protokolliertem Überholen. Die tatsächliche Pedalleistung lässt sich für späteres Training als Zeit/Arbeit über dem **eigenständigen FTP-Wert** auswerten.

**Danach:** automatisierte Spurwahl als eigenständiges, testbares Modul; Fahrtechnik- und Reibkreis-/Kurven-Kopplung; realistische CP/W′-Erholung und Belastung unter CP; größere Fahrerfelder erst nach abgeschlossener Sicherheit/Performanceprüfung. [R-06](physik/R06_SICHERHEIT_SPUR_FTP.md).


## R-07 autonome Überholentscheidung (03.11.2026)

Erste autonome, nachvollziehbare Spursuche für F8 mit beidseitiger Konfliktprüfung, physikalisch stetigem Seitenwechsel und **erst danach** einer CP/W′-begrenzten Wattanforderung. Alternative freie Seite oder Verzicht bei zu engem Manöver. Direkter Vergleich zur identisch befohlenen externen Bewegung über 65 virtuelle Sekunden.

Nächster Meilenstein nach automatischer Abnahme: sichere Rückkehr ins Feld, bewegliche Lücken mit mehreren aktiven Fahrern, fahrtechnische Seitenbeschleunigung und Kurvenkopplung. [Details](ai/R07_UEBERHOLAGENT.md).


## R-08 – Wieder-Einscheren, koordinierte Spuragenten, Querbeschleunigung (03.11.2026)

Erster regelbasierter Rückwechsel nach ausreichend Überholungen und sicherem Vorrang vor der bisherigen Reihe; mehrere Agenten mit deterministischen, vorausschauend reservierten Spuren; optionale glatte seitliche Bewegung mit begrenzter Querbeschleunigung und vereinfachtem Kurvenkraftbudget.

**Folgende Stufen weiter offen:** dynamische Feldlücken/Reflexreaktionen und verlässliche Kollisionsvermeidung bei abruptem Bremsen, reale 2D-Lenk-/Kurven-/Reibkreisphysik, Taktik/Teamrollen, Ermüdung über lange Etappen, größerer gekoppelter Fahrermodus. [R-08](ai/R08_WIEDEREINSCHEREN_MULTIAGENT.md).


## Neue höchste Priorität: R-09 · Erste komplette Rennen statt weiterem Physik-Klein-Klein (03.11.2026)

**Beschlossener Richtungswechsel:** Der bisherige Physikkern hat seinen Zweck erfüllt. Er wird als Grundlage beibehalten; detaillierte Lenk-/Kurven-/Überhol-Simulation ist **zurückgestellt**. Keine weitere Verfeinerung bloß, weil sie technisch möglich ist.

**Schritt R-09 (in Umsetzung):** Eine kurze, aber **vollständige 50-km-Rennsimulation** mit 30 Fahrern/fünf Teams, Strecke mit wechselnden Steigungen und technischen Abfahrten, Teamleitlinien und autonom getroffenen Watt-/Taktikentscheidungen. Gemeinsamer bisheriger Bewegungskern und CP/W′-System, vereinfachte skalierbare Windschatten-/Gruppenlogik. Rennereignisse, echte Zielzeit und Klassifikation, Vergleich auf derselben Strecke/gleichem Seed. Smartphone-Web-Worker-Oberfläche und CI. Siehe [R-09](race/R09_ERSTES_RENNEN.md).

**Nächster fachlicher Schritt erst nach tatsächlichen Rennen:** Auswerten, warum bestimmte Fahrer gewinnen, ob Gruppen, Angriffe, Zielsprints und Abfahrten glaubwürdig sind und ob reale Leistungskriterien nötig sind. Taktik und sportliche-Leiter-Kompetenz sinnvoll vertiefen. Danach optional 60/160 Fahrer und länger Distanz – nur wenn Rechenzeit auf Android bekannt ist.

**Keine Priorität mehr:** Issue #39 (innenliegende Überhollücken, Details der Reifenhaftung, Querbeschleunigung) bleibt optional zurückgestellt, solange die vollständige Rennschleife noch nicht glaubwürdig ist.



## Wichtige Prioritätsänderung ab R-09: Rennsimulation zuerst (03.11.2026)

**Verbindlich nach Nutzerentscheidung:** Nicht immer weitere mikroskopische Lenk-, Reifen-, Überhol- und Kurvendetails entwickeln. Stattdessen schnell **vollständige, beobachtbare Rennen** mit Gruppen, Taktik, Anstiegen, Abfahrten, Zeitabständen, Zielresultaten und erkennbaren strategischen Konsequenzen ermöglichen.

1. **R-09 Erster kompletter Rennen-Prototyp:** 30 fiktive Fahrer / 5 Teams / 50 km (flach und wellig), vorab gesetzte vier Teamstrategien, lokale Web-Worker-Ausführung mit Ergebnisliste. Bisherigen Bewegungsintegrator + CP/W′ tatsächlich wiederverwenden. (Im Entwicklungsbranch implementiert; CI/Pages vor Bestätigung prüfen.)
2. **Rennplausibilität/Balancing:** Zielabstände, Gruppenbildung, Häufigkeit und Wirkung von Attacken, Topspeed/Berg/Abfahrt und Stabilität gegenüber Seed/Strategie vergleichen. Priorisierung anhand beobachteter Rennprobleme statt theoretischer Mikrophysik.
3. **Taktik-/Fahrer-KI vertiefen:** Helferarbeit, Kapitän, Verfolgung, Attacke, Kooperation und Energiemanagement, später sportliche Leiter. Ergebnisgetriebene Regressionstests, nicht immer neue Detailphysik.
4. **Zunächst 60, dann 100 und später bis 160 Fahrer** mit ähnlichem abstrahiertem Rennmodell und überprüfter Android-Laufzeit.
5. **Später Managerkarriere:** Kader, Personal, Training (FTP/CP/W′), Teams/Sponsoren/Finanzen, Saison-/Rennergebnisse, Speicherung.

Die R-03–R-08-Physiklabor-Module werden **behalten und weiterhin getestet**, aber Detailphysik ist kein Blocker für vollständige Rennsimulationen. Das Thema [Issue #39](https://github.com/Lancester/radsportmanager/issues/39) wird zugunsten echter Rennabläufe **vorerst zurückgestellt**. [R-09-Dokumentation](RENNPROTOTYP_R09.md).
