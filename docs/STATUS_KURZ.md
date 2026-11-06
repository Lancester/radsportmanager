# Aktueller Entwicklungsstand (Kurzfassung)

**Datum:** 06.11.2026. **Aktiver Arbeitsbranch:** `develop/manager-mvp`. Dieser Branch wurde aus Audit-Commit `1945e2d6b71289f90cca5dc8c793090a4af93341` erstellt. Der anschließende Dokumentationsabschluss hat die Rennengine nicht verändert.

## Gesichert / nachgewiesen

- Drei Vergleichs-Engines sind über Commit-SHAs eindeutig referenziert: `main` 621e712, Audit 1945e2d, Gesamtmodell 772d1e9.
- Der reproduzierbar dokumentierte Kurzvergleich umfasst 27 Rennen (Lille, Boulogne, Hautacam; je drei Seeds und drei Versionen). Die Auswahl des Audits ist **vorläufig** und keine vollständige sportliche Abnahme.
- Bisherige Branches, Code, Prüfdaten und lange Entwicklungstagebücher bleiben unverändert erhalten.
- Der neue [Branch-/Engine-Archivindex](ENGINE_UND_BRANCH_ARCHIV.md) dokumentiert das Inventar; der [Projektkurs](AKTUELLER_PROJEKTKURS.md) beschreibt die Arbeitsregeln.

## Nicht als erledigt ausgeben

- Kein vollständiger technischer Standardtestsatz oder Android-Benchmark **auf dem neuen MVP-Branch** im Zuge dieser Dokumentationsrunde durchgeführt.
- Keine der drei Varianten als abschließend sportlich realistisch kalibriert bestätigt.
- Noch kein spielbarer Manager, keine fortsetzbaren Etappen-/Regenerationszustände.
- Die bei der Sichtung offenen PRs #79 und #81 bleiben ohne automatische Übernahme.


## Aktuelle Feldkohäsionsdiagnose (06.11.2026)

[Gesicherter Sekundenbefund und begrenzter Folgeauftrag](race/R24_FELDZUSAMMENHALT_DIAGNOSE_20261106.md): Historisch nachgewiesene Leistungssprünge bei Geländeübergängen und anschließende Gruppenfragmentierung ohne Attacken. Ursache noch nicht kausal isoliert. **Keine Engine-Änderung und kein neuer Rennlauf** in dieser Runde; nächster Schritt nur temporäre Sekundeninstrumentierung, dann minimaler A/B-Versuch und Abnahmekriterien. Alte nicht erfolgreiche ±0,1-m/s²-Pauschalbegrenzung nicht übernehmen.


**Abgetrennter Versuch angelegt:** [Draft-PR #82](https://github.com/Lancester/radsportmanager/pull/82), Branch `experiment/r24-feldkohaesion-referenz-20261106`. Dort liegen eine eng begrenzte Referenzschutz-Regel, gezielte Testfälle und ein manueller A/B-Lauf-Runner. **Noch keine bestätigten Tests oder neue Rennresultate**, kein Merge und keine Änderung an der aktiven Audit-Engine. Experiment nur übernehmen, wenn gepaarte vollständige Rennen den Nutzen belegen.


**Erster A/B-Test abgeschlossen (06.11.):** [Bericht](race/R24_FELDKOHAESION_AB_TEST_20261106.md), [Actions 42222177699](https://github.com/Lancester/radsportmanager/actions/runs/42222177699). **7/7 Unit-Tests und 8 Kontrollsimulationsläufe erfolgreich**, aber in den vier paarigen 30-km-Szenarien **keine Verbesserung** der ausgewerteten Gruppen oder Resultate. Daher **PR #82 nicht mergen**; der vorzeitige Feldzerfall bleibt offen. Keine Vollrennserie gestartet. Nächster nur bei Bedarf: Ursache am ersten echten 42-m-Riss sekundengenau instrumentieren, statt die nicht wirksame Heuristik zu erweitern.


**Erster tatsächlicher Gruppenriss sekundengenau geprüft (06.11.):** [Ursachenbericht](race/R24_ERSTER_GRUPPENRISS_URSACHE_20261106.md), [erfolgreicher Actions-Lauf #42224059479](https://github.com/Lancester/radsportmanager/actions/runs/42224059479), [Diagnose-Draft-PR #83](https://github.com/Lancester/radsportmanager/pull/83). Erster Abstand >42 m bei km 17,875 zwischen F009/F107. F107 fährt trotz wachsender Lücke zeitweise 0 W, verliert danach den Formationswindschatten und erreicht erst spät den Deckel 112 % CP. Kein Reglerwechsel, kein Angriff und kein Wattabrechnungsfehler. **Korrekturoption: lokalen Widerspruchsschutz nur bei öffnender Lücke und zu stark negativer Fernbeschleunigungsprognose erweitern. Noch nicht implementiert; A/B-Nachweis erforderlich.**

**Neuer A/B-Korrekturversuch abgeschlossen (06.11.):** [Bericht](race/R24_NEGATIVE_BESCHLEUNIGUNG_AB_20261106.md), [Actions #42224822838](https://github.com/Lancester/radsportmanager/actions/runs/42224822838), [Draft-PR #84](https://github.com/Lancester/radsportmanager/pull/84). **24 kontrollierte + 6 vollständige Rennläufe** erfolgreich ausgeführt. In kontrollierten Anstieg-Abfahrt-Fällen verbessert sich die größte Gruppe bei km 25 für Seeds 2026/42/123 von 125/145/130 auf 154/154/154. In Vollrennen erhebliche Nebenwirkungen (Boulogne innerhalb 60 s 37→7; Hautacam Medianrückstand 706→908 s). **Nicht mergen, keine Abnahme der Sportrealistik.** Die bestehende Engine bleibt unverändert; vor weiteren Korrekturen Abwägung mit Priorität spielbarer Manager.

**Sportliche Gegenprobe zu PR #84 (06.11.):** [Detailbericht](race/R24_SPORTLICHE_GEGENPROBE_BH_20261106.md), [Actions #42225833684](https://github.com/Lancester/radsportmanager/actions/runs/42225833684) mit **12 vollständigen Rennläufen** (Boulogne und Hautacam × Seeds 42/123/2026 × Audit/Versuch, alle Jobs erfolgreich). Die zuvor auffälligen nur 7 Fahrer innerhalb 60 s in Boulogne Seed 2026 erklären sich durch eine tatsächliche Attacke F134 bei km 200,78 und eine 133er-Verfolgergruppe hinter dem Solo-Führenden bei km 205; **größte Gruppe ist nicht führende Gruppe**. Andere Seeds zeigen ganz andere Effekte, keine durchgängige Verschlechterung der Zielabstände. Die neue Referenzregel bleibt sportlich **nicht endgültig validiert**, PR #84 ungemergt, produktive Engine unverändert. Weitere Heuristiken vermeiden und zeitnah den spielbaren Manager priorisieren.

**Teamjagd-Physik erneut diagnostiziert (06.11.):** [Bericht](race/R24_JAGD_PHYSISCHE_GEGENPROBE_20261106.md), [Actions #42228532005](https://github.com/Lancester/radsportmanager/actions/runs/42228532005), [nur passiver Diagnose-Draft-PR #85](https://github.com/Lancester/radsportmanager/pull/85). **8 gepaarte volle Rennen** (Boulogne/Hautacam, Seeds 42/2026, Audit/PR84). Erstmals sind Jagd-Events und tatsächlich gefahrene Windfrontsekunden/Watt sauber getrennt: Boulogne 2026 Windfront 10274→771 Fahrer-s, Boulogne 42 hingegen 4503→5750 trotz weniger Jagd-Events; Hautacam 2026 7104→3595, Hautacam 42 7564→1764. Bezieht sich auf Front der jeweiligen lokalen Abstandsgruppe, noch **nicht** nachgewiesene Hauptfeldführung. Taktischer Codefund: 150-s-Mindestauftrag im Jagdkoordinator greift bei `adaptiveChase` derzeit nicht. **Noch kein kausaler Beleg für unerwünschte Jagd-Hektik; zunächst 10-s-Zustandswechsel gezielt prüfen, bevor ein neuer KI-Fix erlaubt ist.** Beide Engines im MVP/main unverändert, PR84 nicht gemergt.

## Nächste klar begrenzte Arbeitsaufgabe

1. Audit-Checkout auf dem neuen Branch: Build/Tests und vorhandene Baseline-Szenarien prüfen; Ausgangswerte einfrieren.
2. Höchstens zwei gezielte, testbare Korrekturrunden für frühe Feldteilung, häufige Reaktionswechsel und wirksame Jagd/Fluchtkooperation – **keine** neuen KI-Regelsammlungen.
3. Eintagesrenn-Kandidat mit mehreren Seeds/Fahrertypen, nachvollziehbaren Verlaufskriterien und Android-Laufzeit abnehmen oder präzise Restfehler dokumentieren.
4. Minimale Spielschleife aus Team, Rennziel, autonomer Simulation und Ergebnisbericht umsetzen.

**Für neue Chats:** Diese Datei und [Projektkurs](AKTUELLER_PROJEKTKURS.md) gelten für die aktuelle Arbeitsrichtung. `docs/ENTWICKLUNGSSTAND.md` und alte `START_HIER.md`-Abschnitte sind umfangreiche historische Journale und können überholte Zwischenstände enthalten. Die für die konkrete Arbeit sichtbaren Branch- und Teststände jedes Mal auf GitHub prüfen.
