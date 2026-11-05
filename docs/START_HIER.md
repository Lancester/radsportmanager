# START HIER – Arbeitsanweisung für alle zukünftigen Chats

**Hinweis für diesen Entwicklungsbranch:** Der R-24-Auditkandidat und seine
offenen Prüfungen sind in [R24_AUDIT_KORREKTUREN.md](race/R24_AUDIT_KORREKTUREN.md)
beschrieben. Er ist experimentell und noch nicht nach `main` übernommen.
Der unten folgende R-23-Abschnitt bleibt die Beschreibung von `main`.

**Projekt:** Radsportmanager. **Sprache:** Deutsch. **Verbindlicher Projektstand:** GitHub, nicht einzelne Chat-Unterhaltungen.

## Aktueller verbindlicher Stand – R-23 integriert und Work-Gesamtaudit vorbereitet (04.11.2026)

**Fertig nach `main` gemergt:** PR [#74](https://github.com/Lancester/radsportmanager/pull/74) (Sprint/Jagd), [#76](https://github.com/Lancester/radsportmanager/pull/76) (Klassiker) und [#78](https://github.com/Lancester/radsportmanager/pull/78) (Hügel-KI + generische Angriffe ohne starre 88-%-Sperre). Letzter Code-Merge-Commit `f7333421`; [CI #41904933020](https://github.com/Lancester/radsportmanager/actions/runs/41904933020) **330/330 Tests erfolgreich**, 154 fiktive Fahrer je Profil, **ein Seed 2026**. `legacy`, physikalischer Motion-Core, CP/W′, R-19 und Aero-Kern unverändert.

**Sportliche Referenz (ein Seed, nicht kalibriert):** Lille F149 Sprinter, 8 Sprinter Top10, 26 Fahrer Siegerzeitgruppe, 45 Attacken. Boulogne F001 Klassiker, 35 Attacken statt 108 (19 früh, 0 Mitte, 16 auf späten Rampen), Median +129,70 s statt +81,41 s. Liège F057 Klassiker, 0 Sprinter Top10, 53 Attacken. Hautacam F078 Kletterer, 0 Sprinter Top10, 13 Attacken. Lille, Liège und Hautacam wurden durch PR #78 in allen bisherigen Referenzkennzahlen exakt erhalten. Am 1,1-km-Haut-Pichot sind **zehn Angriffsereignisse** auffällig: Das sind Wattwünsche, nicht zehn bestätigte erfolgreiche Ausreißgruppen; ein explizites 5-km-Checkpoint-/W′-Audit ist in PR #78 ergänzt.

**Produktentscheidung:** PR [#75](https://github.com/Lancester/radsportmanager/pull/75) (manuelle 0–5-Jagdhelferzahl) ist **ohne Merge geschlossen**. Manager gibt die Leitlinie vor, sportliche Leiter bestimmen Helferzahl und Ablösung autonom.

**Nächste Priorität:** **Unabhängiger kritischer Work-Gesamtaudit vor weiteren Renn-KI-/Manager-Features.** Vollständiger Auftrag: [`docs/race/KI_GESAMTAUDIT_WORK_BRIEFING.md`](https://github.com/Lancester/radsportmanager/blob/main/docs/race/KI_GESAMTAUDIT_WORK_BRIEFING.md). Insbesondere übersehene starre Prozentfenster, Taktikprioritäten, 10–30er-Spitzengruppen, große Zeitabstände, tatsächliche Angriffsfolgen, CP/W′-/Windschatteninvarianten, Mehrseed-Stabilität und Android-Laufzeit prüfen. Ältere Aussagen wie „PR #74/#76/#78 ungemergt“ sind historische Journalnotizen, **nicht** der aktuelle Stand. Keine Sport-Realismusabnahme aus nur einem Seed ableiten.

## Aktuell integrierter R-22-Renn-KI-Stand (04.11.2026)

**Verbindlicher Integrationsstand 04.11.2026:** PR [#74](https://github.com/Lancester/radsportmanager/pull/74) (Sprintteamjagd, realer Helfereinsatz, individueller Zielsprint, bessere Feldkohäsion) **und** PR [#76](https://github.com/Lancester/radsportmanager/pull/76) (Klassiker-KI) sind nacheinander **nach `main` gemergt**. Code-Merge-Commits `568f2341` und `8b478639`. Die *kombinierte* CI [#41890188739](https://github.com/Lancester/radsportmanager/actions/runs/41890188739) war mit **324/324 Tests erfolgreich, 0 Fehler**, inklusive vier 154-Fahrer-Referenzrennen, No-Attack-/30er-, Physik- und Integrationschecks.

**Sportlicher Stand:** Lille, Seed 2026, 5 km vor Ziel **115 Fahrer** in der führenden physischen Gruppe statt zuvor 25; 8 Sprinter Top10, 26 Fahrer in 1-s-verknüpfter Siegerzeitgruppe, 2 Fluchten eingeholt, 1.425 s CP-nahe reale Feldjagd, 22 individuelle Sprintantritte. **Der konservative 30er-Massenprint-Proxy ist weiterhin false**, und aus einem Seed keine Massensprint-Häufigkeit ableiten. Liège: Klassiker F057 Sieger, **0 Sprinter in Top10**, gezielte Rampentempo-/Positionierungsarbeit; mögliche größere Zeitabstände später statistisch kalibrieren. Boulogne und Hautacam gegenüber ihrer Referenz unverändert. **Keine Änderungen** an `legacy`-Default, CP/W′, R-19, Motion-Core oder Aero. **PR #75 (Managerwahl 0–5 Jagdhelfer) bleibt offen und ungemergt.** Nächstes getrenntes KI-Thema: hügelige Etappen (Boulogne 108 Attacken im Seed 2026), danach PR #75 und Multi-Seed-Kalibrierung.

**Wichtig bei älteren Notizen:** Frühere, weiter unten stehende Aussagen wie „PR #74/#76 noch offen“ beschreiben ihren historischen damaligen Zustand und sind **seit dieser Integration überholt**. Die KI wurde technisch integriert, **nicht** als wissenschaftlich/mehrseed-statistisch vollständig kalibriert deklariert.

## Neue verbindliche Priorität – Rennsimulation vor Detailphysik (03.11.2026)

**Ausdrücklicher Nutzerbeschluss:** Keine weitere feinere Kurven-, Lenk-, Kollisions- und Überhol-Mikrophysik ohne nachgewiesenen Nutzen für das Managerspiel. Stattdessen zuerst **vollständig simulierbare Rennen mit echter Zielklassifikation**, Streckenprofilen, Teams, strategischen Leitlinien, autonomer Fahrer-KI und Berichten entwickeln. Die R-01–R-08-Physikmodule bleiben unangetastet und als isolierte Vergleichs-/Spezialbausteine verfügbar; die skalierende Rennsimulation nutzt **denselben Bewegungsintegrator und CP/W′-Kern**, jedoch eine **eigene, ausdrücklich vorläufige Gruppen-/Windschattenabstraktion**.

**Arbeitsweise:** Zuerst nachvollziehbare vollständige Rennen (30 Fahrer, 50 km), dann Balancing und taktische Glaubwürdigkeit prüfen; erst danach 60/160 Fahrer und längere Rennen. Zweite und dritte Priorität: intelligente Team- und Fahrertaktik und ausreichend schnelle Android-Ausführung. Keine parallele, nicht beauftragte Ausarbeitung von Millimeter-Spuren, Lenkwinkeln oder Reifenmodellen. Neue Priorität geht älteren R-08-/Issue-#39-Vorschlägen vor.

Die erste Rennoberfläche ist unter `docs/rennen.html` geplant; Code unter `src/engine/race/`. **Vor GitHub-Actions-Erfolg keine fertige Rennsimulation behaupten.**

## Reihenfolge beim Einstieg

1. Diese Datei und docs/ENTWICKLUNGSSTAND.md lesen.
2. docs/ENTSCHEIDUNGEN.md lesen; Beschlüsse, bevorzugte Ansätze und offene Fragen auseinanderhalten.
3. Für die aktuelle Aufgabe docs/SPIELKONZEPT.md, docs/RENNSIMULATION.md, docs/TECHNIK.md und docs/VALIDIERUNG.md berücksichtigen.
4. Aktuellen Branch main, offene Issues, Pull Requests und gegebenenfalls Actions-Tests prüfen.
5. Nur den nächsten vereinbarten Schritt bearbeiten, keine ungefragten grundlegenden Neudesigns.

## Verbindliche Arbeitsregeln

- **Deutsch als Projektsprache:** Issues, Pull Requests, Dokumentation, Testzusammenfassungen und spätere Spieltexte.
- **Keine falschen Erfolgsmeldungen:** Code, Tests, ZIPs, Releases und Merges nur als erledigt bezeichnen, wenn tatsächlich überprüft.
- Beschlussstatus kennzeichnen: **beschlossen / favorisiert / zu prüfen / offen / verworfen**. Beispiele, hypothetische Werte und fachliche Annahmen nicht als validiert darstellen.
- Kleine, nachvollziehbare Änderungen; Code möglichst auf Feature-Branches mit Pull Request; main stabil halten.
- Nach jeder abgeschlossenen Arbeit docs/ENTWICKLUNGSSTAND.md aktualisieren: erledigt, geprüft, noch offen, exakter nächster Schritt, Issue/PR/Commit.
- Bei Chatabbruch zunächst GitHub inspizieren und nicht blind dieselben Änderungen erneut durchführen.
- **Nutzer braucht die GitHub-Dateien nicht selbst durchzuarbeiten:** Jede Arbeitsrunde liefert eine verständliche Chat-Zusammenfassung mit Ergebnissen, Annahmen und Konsequenzen.
- **Alle neu aufgeworfenen entscheidungsrelevanten Fragen auch im Chat transparent stellen**, nicht nur in einer Dokumentationsdatei vermerken. Explizit beschlossene Punkte von offenen Vorschlägen trennen; aus Schweigen keine Zustimmung ableiten.
- Keine Zugangsdaten, private Nutzerdaten oder fremde geschützte Logos/Daten in das öffentliche Repository hochladen.
- Mobil zuerst: Alles möglichst via Android-Handy, GitHub und Webbrowser; kein lokaler Laptop oder eigene Serverdatenbank voraussetzen.
- Kosten kontrollieren: kleine Tests automatisch, große Monte-Carlo-Testläufe ausschließlich manuell; Ressourcenlimits setzen.

## Text zum Einfügen in einen neuen Chat

Lies bitte zuerst im GitHub-Repository Lancester/radsportmanager die Dateien docs/START_HIER.md, docs/ENTWICKLUNGSSTAND.md und docs/ENTSCHEIDUNGEN.md. Prüfe main, offene Issues/PRs und den letzten Teststand. Arbeite auf Deutsch am dokumentierten nächsten Schritt weiter. Gehe nicht ohne Rücksprache über festgelegte Grundsatzentscheidungen hinweg. Aktualisiere nach der Arbeit die Dokumentation.


## R-09: drei vollständige Rennen als Plausibilitätsdiagnose (03.11.2026)

Die neue Rennsimulation wurde **ausdrücklich nicht als realistisch kalibriertes Profirennen** freigegeben. Ein kurzer Diagnoselauf von drei vollständigen Rennen steht jetzt dauerhaft als reproduzierbares Script unter `scripts/r09-race-diagnostics.mjs`. [PR #41](https://github.com/Lancester/radsportmanager/pull/41) ist integriert; der tatsächlich erfolgreiche [GitHub-Actions-Lauf #41715064254](https://github.com/Lancester/radsportmanager/actions/runs/41715064254) bestätigt **183/183 Tests, 0 Fehler, drei komplette Rennläufe, Browser-Build und Pages-Deployment**.

| 50-km-Profil (je 30 Fahrer, Seed 2026) | Sieger | Siegerzeit | letzter Rückstand | beobachtete Maximum-Abstandsgruppen | protokollierte Gruppenaufteilungen / Verfolgungswechsel |
| --- | --- | ---: | ---: | ---: | ---: |
| Hügelig – Kapitän schützen | F07 | 4.433,0 s | 577,2 s | **30** | 135 / 319 |
| Hügelig – Team Nordwind offensiv | F13 | 4.446,4 s | 561,7 s | **29** | 147 / 155 |
| Flach – Team Nordwind Sprint | F07 | 4.181,5 s | 367,8 s | **15** | 52 / 415 |

Die drei Läufe waren auf GitHub-Runner etwa **374–549 ms** Rechenzeit, **keine Android-Messung**. Hügelig „Kapitän schützen“: F07 siegt nach rund **1:13:53 h**, 30 Fahrer erreichen das Ziel bis ca. **1:23:30 h**. Die durchschnittliche tatsächlich gefahrene Kurbelwatt über alle Fahrer beträgt ca. **271,4 W**. Über drei Szenarien 10–15 Sprint- und Angriffsevents; diese Modellzahlen sind nicht als repräsentative Profirennstatistik auszugeben.

**Wichtige Bewertung:** Die körperlichen/energetischen Zahlen werden aus denselben bisher verwendeten Kernen berechnet. Die derzeitige größere Rennfeldabstraktion führt allerdings zur **starken Feldfragmentierung** (im Hügelkurs zeitweise 30 einzelne Abstandsgruppen für 30 Fahrer) und **sehr vielen Wechseln zur Verfolgung**. Das ist **nicht ausreichend glaubwürdig**, um schon taktische Rennergebnisse zu bewerten. Gruppenaufteilungen zählen Übergänge der einfachen Abstandsklassifikation und sind noch keine sauber modellierten Fluchtgruppen. Die Windschatten-Heuristik ist noch nicht die validierte Gruppendynamik.

**Taktik wirkt numerisch:** Bei identischem Seed und Profil fuhr F01 mit offensiver statt Kapitän-schonender Leitlinie rund **61,254 s schneller** (4.575,293 s → 4.514,039 s), belegte in beiden Fällen Rang 5. Die Änderung kann sogar den Sieger ändern (F07 vs. F13), obwohl nur Team Nordwind eine andere Strategie erhielt – plausible indirekte Wechselwirkung ist möglich, noch nicht gegen reale Rennen kalibriert.

**Neue höchste Priorität:** [Issue #42 – echtes Peloton, Gruppen-Zusammenhalt, Ausreißer/Verfolgung und taktisches Balancing](https://github.com/Lancester/radsportmanager/issues/42). Zuerst die 30-Fahrer-/50-km-Gruppenlogik glaubwürdig machen; erst danach größere Felder und lange Rennen. **Weitere Lenk- und Kurven-Mikrophysik aus Issue #39 zurückstellen**, solange deren Nutzen für die Rennqualität nicht nachgewiesen ist.

**Ehrliche App-Beschreibung:** Die neue `docs/rennen.html`-Seite erklärt nun korrekt, dass die Fahrer vorerst nach einfachen Taktikregeln autonom handeln. **Eigenständige sportliche Leiter und Personalmanagement existieren im Rennprototyp noch nicht.**


## R-10 vollständig verifiziert: drei Rennläufe und 197/197 Tests (03.11.2026)

**Code- und Testabnahme:** [PR #45](https://github.com/Lancester/radsportmanager/pull/45) wurde auf `main` übernommen. Der reale [GitHub-Actions-Lauf #41717402354](https://github.com/Lancester/radsportmanager/actions/runs/41717402354) ist vollständig **erfolgreich**: **197/197 Tests, 0 Fehler**, drei komplette 50-km-Rennen, originale TypeScript-Browserübersetzung, ESM-Smoke-Test und Pages-Veröffentlichung.

**Vergleich mit den drei dokumentierten R-09-Referenzrennen (30 Fahrer, 50 km, Seed 2026):**

| Rennen | Max. Abstandsgruppen R-09 → R-10 | Gruppen-Trennereignisse R-09 → R-10 | Verfolgungsstarts R-09 → R-10 | bestätigte Fluchten / wieder eingeholt |
| --- | ---: | ---: | ---: | ---: |
| Hügelig, Kapitän schützen | **30 → 20** | **135 → 26** | **319 → 36** | **1 / 1** |
| Hügelig, T1 offensiv | **29 → 22** | **147 → 27** | **155 → 21** | **2 / 1** |
| Flach, T1 Sprint | **15 → 12** | **52 → 13** | **415 → 64** | **2 / 1** |

Die **Verfolgungsstarts sind massiv zurückgegangen**, und Fahrer können dank begrenzter, tatsächlich physikalisch ausgeführter Wattkorrektur besser als Gruppe zusammenfahren. Gruppenaufteilungen werden seltener und reale, über Zeit bestätigte Fluchten und Einholungen erscheinen im Rennprotokoll. **Das ist eine Verbesserung des vorherigen Prototyps, noch keine Realitätsvalidierung.** Auf dem Hügelkurs entstehen weiterhin zeitweise **20–22 Abstandsgruppen**. Auch die maximalen Zielrückstände bleiben hoch. Ein glaubwürdiges Peloton ist noch nicht fertig.

Der R-10-GitHub-Runner meldete beispielsweise für den hügeligen geschützten Lauf F13 als Sieger mit **4.464,8 s** Fahrzeit, **581,4 s** Rückstand des letzten Fahrers; der Vergleich T1 offensiv ändert F01s Zielzeit bei identischem Seed um **3,783 s**. Ein Teamstrategie-Effekt existiert also, darf aber nicht als bereits perfekt ausbalanciert gelten.

**Wiederverwendung ausdrücklich bestätigt:** Vollrennen verwenden unverändert `motion-core.ts` (`advanceMotionStep`) und `critical-power.ts`; der neue `peloton.ts` ergänzt ausschließlich begrenzte Wattwünsche und abstrahierten Windschatten. **R-03 bis R-08 bleiben unveränderte Labortests**, werden nicht als komplettes 2D-Peloton in die 30-Fahrer-Simulation hineinkopiert.

**Für die kommenden Arbeiten:** Noch nicht 160 Fahrer oder 200 km als ausgereift ausgeben. Nächste sachliche Abnahme: qualitative Abstands-/Attacken-/Verfolgungslogik über mehrere Fahrerprofile und Strecken, danach erst größere Fahrerfelder (60 → 100 → 160) und tatsächlicher Android-Gesamtrennbenchmark. **Keine neue Detail-Lenkphysik ohne beobachteten Rennnutzen.**


## Aktueller nächster Arbeitsschritt nach R-10 (03.11.2026)

R-11 erweitert zunächst die **Messbasis statt die Physik**: zwei Seeds,
flache/hügelige 50-km-Strecken, Teamtaktik-Kontrast und fiktive Fahrerprofile
mithilfe von `src/engine/race/race-audit.ts`,
`tests/r11-race-balance.test.mjs` und dem **manuell** ausführbaren
`scripts/r11-balance-diagnostics.mjs`. Die Methodik liegt in
[docs/race/R11_MEHRSEED_BALANCING.md](race/R11_MEHRSEED_BALANCING.md).
Erst PR-Testabnahme und Auswertung der Diagnosen, danach gezieltes
Helfer-/Kapitän-/Peloton-Balancing. R-01 bis R-08 nicht neu entwerfen;
Issue #42 behält Priorität. Noch keine R-11-Testzahlen als verifiziert ausgeben.


## R-11 bestätigt, weitere Rennqualität offen (03.11.2026)

[PR #47](https://github.com/Lancester/radsportmanager/pull/47) ist in main.
Der [GitHub-Actions-Lauf #41727203475](https://github.com/Lancester/radsportmanager/actions/runs/41727203475)
bestätigt **202/202 Tests**, drei Referenzrennen, Browser-Build und Pages.
Neue R-11-Tests decken mehrere Seeds, Strecken, ein verändertes Fahrerprofil
und prüfbare Flucht-/Einholmeldungen ab. **Die zusätzliche manuelle
7-Rennen-Diagnose wurde noch nicht ausgewertet.** Nächste Arbeitsaufgabe:
diese ausführen und anhand der Ergebnisse eine kleine taktische
Helfer-/Kapitän-/Peloton-Verbesserung priorisieren. 20–22 Gruppen auf dem
Hügelkurs bleiben kritisch. Kein 160-Fahrer- oder Android-Leistungsnachweis.


## Jüngste R-11-Diagnose und verbindliche Reihenfolge für Folgeschritte (03.11.2026)

**Die manuelle R-11-Renndiagnose ist jetzt tatsächlich ausgeführt und ausgewertet:**
[GitHub Actions #41728617720](https://github.com/Lancester/radsportmanager/actions/runs/41728617720)
ist erfolgreich und enthält **genau sieben unterschiedliche vollständige
30-Fahrer-/50-km-Rennen**. Das frühere Diagnoseskript hatte versehentlich
den 2026-Basisfall zweimal gerechnet; der Doppelaufruf ist korrigiert.
Hügelrennen erreichen in den zwei Seeds bis zu **20–24 Abstandsgruppen**,
Flachrennen maximal **12**. Schwächerer Helfer F03 (−12 % CP/FTP/W′)
verliert **330,095 Sekunden**; Teamtaktik ändert F01 je nach Seed um
**3,783 oder 30,491 Sekunden**. Messmethodik unter
[docs/race/R11_MEHRSEED_BALANCING.md](race/R11_MEHRSEED_BALANCING.md).

**Wichtiger Codebefund:** Der aktuelle 30er-Rennwindschatten betrachtet nur
den **direkt davor fahrenden Fahrer** und höchstens **19 % weniger
aerodynamischen Widerstand**, unabhängig von einer dichten 30er-Gruppe.
Ein Mehr-Vordermann-Modell existiert nur in älteren isolierten
Achtfahrer-Testbausteinen. Die Windschatten-Abstraktion ist daher ein
plausibler wesentlicher Grund für unrealistische Gruppentrennungen,
aber ihr quantitativer Einfluss ist noch **nicht kausal isoliert**.

**Neue nächste Priorität innerhalb Issue #42:** Zuerst einen
**separaten, vergleichbaren Entwurf** einer lokal dichte- und
positionsabhängigen Aero-Abstraktion für kleine Fluchtgruppen versus
dichtes Peloton fachlich prüfen und gegen R-10/R-11 messen.
Nicht einfach den 42-m-Diagnoseabstand als Windschattenabstand verwenden;
keine blind übernommenen 121er-Peloton-CFD-Extremwerte.
Anschließend Teamtempo- und Helfertaktik verbessern.
**Noch keine neue Grundsatzentscheidung und keine Aero-Parameterfreigabe.**
D-074 bis D-077 bleiben gültig. Keine neue Detail-Lenkphysik.


## R-12: schaltbarer Formationswindschatten geprüft – nicht als Standard freigegeben (03.11.2026)

Die zum [Issue #42](https://github.com/Lancester/radsportmanager/issues/42)
gewünschte **größen-/positionsabhängige Aero-Abstraktion** liegt jetzt
als bewusst **experimentelle Option** `RaceInput.aeroModel='formation-experiment'`
in `src/engine/race/formation-aero.ts` vor. Sie betrachtet bis zu
zehn nahe Vordermänner innerhalb von 24 m und ist auf
`aeroFactor >= 0.40` gedeckelt. Detaillierte
[Umsetzung und sieben A/B-Vergleiche](race/R12_FORMATIONSAERODYNAMIK.md).
**Standard `legacy` bleibt R-10 und bitgenau unverändert.**

[GitHub-Actions-Vergleich #41730692771](https://github.com/Lancester/radsportmanager/actions/runs/41730692771)
hat **14 komplette 50-km-Rennen (7 Paare mit 30 Fahrern)** ausgeführt.
Ergebnis: Flach deutlich weniger Abstandsklassen (12 → 3/4) und
mehr geschützte Fahrer; aber der letzte Zielrückstand **steigt in
allen sieben Fällen**, teils stark (Flach 2027 334,1 → 937,5 s).
Hügelverläufe sind gemischt. Das ist ein **Fortschritt im Verständnis
des Models, aber keine sportliche Freigabe**.

[PR-Actions #41730702259](https://github.com/Lancester/radsportmanager/actions/runs/41730702259)
bestätigt **209/209 Regressionstests**. Der ergänzte
[TypeScript-/Browser-Abnahmelauf #41730888302](https://github.com/Lancester/radsportmanager/actions/runs/41730888302)
war ebenfalls erfolgreich, inklusive 30-Fahrer-ESM-Lauf.
Der temporäre Workflow wurde wieder entfernt; es wurde
**kein** täglich wiederholter Großtest eingerichtet.

**Nächster fachlicher Schritt:** Modelle räumlich/formationell
prüfen: Unterschied zwischen einer langen Einerreihe und einem
breiten Feld, echte Führung-/Tempoarbeit und Reaktion Abgehängter.
Erst durch getrennte A/B-Tests entscheiden, welche Dichteparameter
für den realen Rennmodus taugen. Keine 121er-Peloton-Extremwerte
ungeprüft übernehmen. R-01–R-08 und CP/W′-Kerne unverändert;
keine Mikrolenkphysik.


### Verifikation R-12 auf main (03.11.2026)

Nach [PR #49](https://github.com/Lancester/radsportmanager/pull/49)
bestätigt der vollständig erfolgreiche
[Actions-Lauf #41731492676](https://github.com/Lancester/radsportmanager/actions/runs/41731492676)
**209/209 Tests**, die alten Referenzrennen, TypeScript-ESM und
Pages. Neues Formations-Aero **nur opt-in**,
`legacy` weiterhin Standard. Alle **14 A/B-Rennen** separat
[erfolgreich ausgeführt](https://github.com/Lancester/radsportmanager/actions/runs/41730692771).
**Nicht** aus geringer Gruppenanzahl einen fertigen realistischen
Pelotonmodus ableiten. Exakter nächster Schritt ist die
Abgestimmtheit von Gruppenschutz, Tempoarbeit und Abgehängten,
nicht wieder detaillierte Lenkphysik.


## R-13 – neue verbindliche Regel: Formationswindschatten ist Rennstandard (03.11.2026)

Der Nutzer hat den zuvor in [R-12](race/R12_FORMATIONSAERODYNAMIK.md) schaltbar getesteten
Gruppenwindschatten ausdrücklich **zur regulären Rennmechanik erklärt**.
Ein schwacher oder abgehängter Fahrer kann gegen das aerodynamisch besser
geschützte Peloton **erheblich Zeit verlieren** – das ist nicht automatisch
ein Fehler. **Keine künstliche Aufholhilfe oder Ergebnisangleichung**
implementieren.

**Technik:** `RaceInput.aeroModel` ohne Angabe verwendet nun
mehrere Vordermänner innerhalb von 24 m (bis zu zehn tatsächlich
weiter vorn fahrende Nachbarn) und einen weiterhin als Modellannahme
ausgewiesenen Aero-Faktor von mindestens 0,40. `'formation'` aktiviert
denselben Standard ausdrücklich; `'formation-experiment'` bleibt
ein historischer Alias und `'legacy'` erhält das bisherige
R-10-/R-11-Modell zum A/B-Vergleich. Einzeln Abgehängte ohne nahe
Vorderleute erhalten keinen Feldbonus. Gleichauf-Fahrer gelten nicht
mehr aufgrund der internen ID-Reihenfolge als Vordermänner.

**Keine** Änderung an CP/W′-Kern, Bewegungsintegrator, Fahrtechnik,
R-01–R-08, Teamrollen oder Ergebnisrechnung. Auch die Browserseite
nutzt den neuen Default. Die Grundlagen und die aktuelle Testabnahme
stehen in [R13_FORMATIONSWINDSCHATTEN_STANDARD.md](race/R13_FORMATIONSWINDSCHATTEN_STANDARD.md).

**Nächster Entwicklungsauftrag nach R-13:** Nicht Rückstände
wegkalibrieren, sondern glaubwürdige autonome Führung, gezielte
Teamtempoarbeit, Verfolgung und Wechsel zwischen Fluchtgruppe und
geschütztem Peloton verbessern. Keine neue Detail-Lenkphysik
vor funktionierendem Rennmanagement. Issue #42 bleibt hierfür offen.


### R-13 abschließend in main verifiziert (03.11.2026)

[PR #50](https://github.com/Lancester/radsportmanager/pull/50)
ist übernommen. [GitHub-Actions #41734418472](https://github.com/Lancester/radsportmanager/actions/runs/41734418472)
ist **erfolgreich abgeschlossen: 213/213 Tests, drei
50-km-Standardrennen, TypeScript-ESM-Build und GitHub Pages**.
Der neue Formationswindschatten ist **jetzt regulärer Default** –
auch auf der Browser-Rennseite. Einzeln abgehängte Fahrer
können gegenüber einem windgeschützten Feld großen Rückstand
erleiden. **Kein künstlicher Aufholbonus und keine
Freigabesperre wegen fehlender empirischer Vollkalibrierung**.
Der alte `legacy`-Modus bleibt explizit wählbar.
Alle sieben aktuellen Standardrennen und die gleichauf-
Sortierkorrektur: [R-13](race/R13_FORMATIONSWINDSCHATTEN_STANDARD.md).
Nächster Arbeitsschritt: autonome Teamführung und gezielte
Verfolgung, Issue #42.


## R-14: autonome Mannschaftsführung und Verfolgung eingebaut (04.11.2026)

**Nächste Rennspielfunktion nach R-13 umgesetzt:** In der
50-km-Rennsimulation bestimmen fünf Teams jetzt auf jeder
10-Sekunden-Entscheidungsrunde autonom je einen geeigneten
Helfer zur Tempoarbeit bzw. zur gezielten Verfolgung kleiner
Fluchtgruppen. Bei mehreren Helfern wird der Dienst
zeitbasiert rotiert (90 s); erschöpfte Helfer,
weit entfernte Teamkollegen und die eigene Ausreißergruppe
werden nicht zum falschen Nachsetzen verpflichtet.

**Richtiger Wirkmechanismus:** Aufträge sind ausschließlich
Wattwünsche und werden über den unveränderten
CP/W′-Kern und `advanceMotionStep` ausgeführt.
Keine Zielzeit-, Geschwindigkeits- oder Positionsboni.
Der normale Formationswindschatten aus R-13 bleibt
bestehen; Einzelne ohne Deckung dürfen weiter
große Rückstände sammeln. 42 m ist taktische
Abstandsklasse, **nicht** Windschattenreichweite.

**Abgenommene technische Tests (Feature-Branch):**
[GitHub PR-Tests #41737911881](https://github.com/Lancester/radsportmanager/actions/runs/41737911881)
**221/221 Tests**, darunter acht neue R-14-Prüfungen.
[Echte sieben 30-Fahrer-/50-km-Rennläufe #41738013741](https://github.com/Lancester/radsportmanager/actions/runs/41738013741)
erfolgreich sowie Browser-TypeScript/ESM-Test.
Die neue Rennseite zeigt Teamtempo-/Verfolgungszähler
und ausgewählte, nachvollziehbare Helferereignisse.

**Alle sieben Messungen, klare verbleibende Grenzen:**
[R14_TEAM_FUEHRUNG_VERFOLGUNG.md](race/R14_TEAM_FUEHRUNG_VERFOLGUNG.md).

**Nächste fachliche Priorität:** tatsächlich ausgefahrene
Führungspositionen und Helfer vor Kapitänen, weniger schematische
Führungswechsel, genauere situations- und kraftabhängige
Mehrteamstrategie. Noch keine selbstständigen Sportdirektoren
oder vollständige Karriere und keine Lenkmikrophysik.
Issue #42 bleibt offen.


### R-14 auf main endgültig verifiziert (04.11.2026)

[PR #51](https://github.com/Lancester/radsportmanager/pull/51) ist
mit Commit `83d3e912a118903dc8cf523e6c724aef4e7d5e2f`
in `main`. [GitHub Actions #41738747990](https://github.com/Lancester/radsportmanager/actions/runs/41738747990)
ist **vollständig erfolgreich**: **221/221 Tests**, die
drei vollständigen Standard-Rennläufe mit der neuen Team-KI,
TypeScript-ESM-Browser-Build, Smoke-Test und erfolgreiche
GitHub-Pages-Veröffentlichung. Der zusätzliche
[Sieben-Rennen-Test #41738013741](https://github.com/Lancester/radsportmanager/actions/runs/41738013741)
bestätigte zuvor 210 modellierte Zielankünfte.
**Aktueller Spielstand:** automatische, begrenzte
Teamtempoarbeit, Helferrotation und situative
Fluchtverfolgung. Keine automatische Aufholhilfe;
keine neuen Reifen-/Lenkdetails. Nächste offene Aufgabe:
tatsächliche Führungspositionen und anspruchsvollere
autonome Sportdirektor-/Teamtaktik, Issue #42.


## R-15 und R-16: Mehrhelfer und situative Renn-KI (04.11.2026)

**Eindeutige neue Projektgrenze vom Nutzer:** R-15 und R-16
gehören **ausschließlich in die Rennengine**. Keine Rundfahrten,
Karrieremodus-, Vertrags-, Personal-, Transfer- oder
Sportdirektorenverwaltung in diesen Arbeitsschritten.

**R-15:** Ein einzelnes Team kann bis zu fünf geeignete Helfer
gleichzeitig für eine gemeinsame Jagd, Sprintvorbereitung oder
Schutzaufgabe einteilen. Der tatsächlich vorne arbeitende
Fahrer muss die echte Vorderposition in seiner
Abstandsgruppe haben; Unterstützer erhalten andere
Wattanforderungen und keine künstliche Spur-/Positionsgutschrift.
Erschöpfung und Abstände begrenzen die Beteiligung.
Die Aufträge unterscheiden sich von nachgewiesener
Führungszeit in den Diagnosen.

**R-16:** Situative Entscheidung aus echter Fluchtgruppengröße,
gemessener Distanz, relativer Gruppengeschwindigkeit,
Reststrecke, eigenen Fahrerpositionen, Teamstrategie
und W′. Ausgewogene Mannschaften dürfen bei moderater
Gefahr eine Sprintmannschaft arbeiten lassen.
Angriffe der offensiven Kapitäne sind an Position,
Kräfte und Erholung gebunden, nicht an zwei
fest vorgegebene Rennkilometerfenster.

**Wichtig:** `RaceInput.tacticModel` ohne Angabe verwendet
R-15/R-16. `'r14'` ist bewusst reproduzierbarer
Vergleich. `aeroModel` und R-13-Formationswindschatten
bleiben völlig unabhängig davon. `advanceMotionStep`,
CP/W′, sämtliche Detail-Physikbausteine und die
Ergebnisbildung wurden nicht durch Boni verändert.
Alle Aufgaben sind Wattentscheidungen innerhalb
eines einzelnen vollständigen Rennens. Vier grobe
Rennleitlinien reichen als Testoberfläche vorerst.

**Code:** `src/engine/race/race-team-ai.ts` und
Integration in `race-simulator.ts`.
Ausführliche Methodik, reale 14-Rennen-A/B-Prüfungen
und Einschränkungen in
[R15_R16_MEHRHELFER_RENNINTELLIGENZ.md](race/R15_R16_MEHRHELFER_RENNINTELLIGENZ.md).

**Noch offen innerhalb der Rennengine:** präzisere
tatsächliche Übernahme der Frontposition und Relaisablöse
(ohne 2D-Lenk-Mikrophysik), bessere taktische
Gegnerreaktionen und stabile unterschiedliche
Rennverläufe. Separate, spätere Spielsysteme
nicht hier beginnen.


### R-15/R-16 – finaler geprüfter main-Stand (04.11.2026)

**[PR #52](https://github.com/Lancester/radsportmanager/pull/52)
gemergt**, Commit `26a195b540c0c39d1ca5911198fd058bcd6be70b`.
[Main-Actions #41742236444](https://github.com/Lancester/radsportmanager/actions/runs/41742236444)
**vollständig erfolgreich: 232/232 Tests, 0 Fehler,
drei volle 50-km-Rennen, Browser-ESM-Build und
GitHub-Pages-Veröffentlichung**.
Zuvor wurden im [einmaligen A/B-Lauf #41741844022](https://github.com/Lancester/radsportmanager/actions/runs/41741844022)
**14 komplette Rennen und 420 Zielankünfte** geprüft.

**Verbindlicher aktueller Rennmodus:** Mehrhelferteams,
Sprintzüge, frontnah geprüftes Tempo, situationsabhängige
Verfolgung und Angriffe. Bisherige R-14-Taktik optional
mit `tacticModel='r14'`; normaler Standard R-15/R-16.
Auch eine fünfköpfige Helfergruppe wurde isoliert getestet;
in den sieben 30-Fahrer-Referenzrennen wurden
maximal drei Helfer eines Teams gleichzeitig eingesetzt.
**Rundfahrten, Karrieremodus und Managerpersonal
gehören ausdrücklich nicht zu dieser Rennengine.**
Nächster reiner Rennengine-Schritt: realere Positionsübernahme
und Ablösearbeit, nicht neue Karrierefeatures.


## Beschlossenes gemeinsames Rennengine-Paket R-17 bis R-21 und danach R-22/R-23 (04.11.2026)

**Vom Nutzer ausdrücklich beauftragt:** R-17, R-18, R-19,
R-20 und R-21 ohne Einzel-Freigaben zu einem gemeinsamen
Rennengine-Arbeitspaket zusammenfassen.
**Verbindlicher vollständiger Fahrplan:**
[ROADMAP_R17_R23_VERBINDLICH.md](race/ROADMAP_R17_R23_VERBINDLICH.md).

**R-17:** vorne positionierte Helfer, mindestens physisch
vor dem geschützten Kapitän/Sprinter, stabile 75-s-
Schichtzuordnung, echte positions-/W′-bedingte Ablösen
und getrennte Diagnose von Wattauftrag und tatsächlich
frontnah gefahrenen Modellsekunden.

**R-18:** vorausschauendere Rennlage aus gemessenen
Flucht- und Feldgeschwindigkeiten: 120-s-Projektion
der Lücke, reale Reststrecke und konkurrierende
Mannschaftsstrategie statt garantiertem Einholen.

**R-19:** eigenes bilanzierbares Langzeit-
Kohlenhydrat-/Ermüdungsmodell, kontrollierbare
Verpflegung in g/h; nach 90 min mögliche
Wattbegrenzung, unveränderter CP/W′-/
Bewegungs-/mechanischer Energie-Kern.
`enduranceModel='off'` erlaubt A/B.

**R-20:** Fahrertypen ohne Ergebnisbonus
über tatsächliche physische Masse/CP/W′/CdA;
Gegen-/Rücken-/Seitenwind und Straßenroll-
Widerstand wirken durch denselben Physikkern.

**R-21:** 210 erlaubte Fahrer, 30 Teams,
300 km maximale Einzelrenndistanz;
realistische 22×7=154-Fahrer-Stresstests
mit **Flach (200 km), Hügelig (200 km),
Klassiker (240 km), Berg als einzelnes
170-km-Rennen**. Alle sind
Einzelrennen der Rennengine,
**keine Rundfahrt und kein Karrieremodus**.
Dazu reproduzierbare Belastungs-/CPU-Tests
und vollständiges Ereignisprotokoll.

**Erster Großfeld-Audit:** 154 Fahrer und 200 km
flach wurden erfolgreich im GitHub-Runner in
ca. **7,8 s** berechnet. In späteren vollständigen
Tests wurden alle vier Profile mit 154 Fahrern
durchgerechnet. Deren massive teils
>30-minütige Median-Zielrückstände (Hügel,
Klassiker, Berg) sind ausdrücklich **offene
Realismus-/Kalibrierungsfragen**,
keine Erfolge allein wegen grüner Tests.
Rückstände nie mit künstlichen Boni glätten.

**R-22 (DANACH):** intensive unabhängige
Monte-Carlo-Validierung, 100/500/1000+
Läufe je Flach-/Hügel-/Klassiker-/Bergprofil
mit großen UCI-ähnlichen Feldern und
200-km-Größenordnung; Vergleiche mit echten
Profi-Daten und Trennung von Kalibrierungs-
und Validierungsläufen.

**R-23 (DANACH):** dokumentierte Freigabe
Rennengine 1.0 erst, wenn R-22 tatsächlich
plausible Taktik-, Energie-, Gruppen-, Feld-,
Ermüdungs- und Laufzeitverteilungen sowie
technische Stabilität nachweist.

[Technisches Gesamtdokument](race/R17_R21_ENGINE_ABSCHLUSS.md).
**Vorgabe zur Fortsetzung:** Keine Etappen-/Rundfahrten-,
Karriere-, Vertrags-, Transfer-, Saison-, Trainingskalender-
oder Managerpersonalentwicklung vor dem späteren
separaten Karrieremodus.


### R-17–R-21: vollständig erfolgreich gemergt und veröffentlicht (04.11.2026)

**[PR #53](https://github.com/Lancester/radsportmanager/pull/53)**
ist in `main`, Squash-Commit
`9a8aeacf5e8afe3dfa6f8324229fea7cfd4529b7`.
**[Reguläre main-CI #41745212283](https://github.com/Lancester/radsportmanager/actions/runs/41745212283):
241/241 Tests bestanden, 0 Fehler; drei
30er-50-km-Vollrennen, Browser-/TypeScript-ESM,
Smoke-Test und GitHub-Pages erfolgreich.**
**[Einmalige Langstreckenabnahme #41744830294](https://github.com/Lancester/radsportmanager/actions/runs/41744830294):**
Flach 200, Hügel 200, Klassiker 240, Berg 170 km
jeweils mit **154 Fahrern** sowie Berg 170 km
mit 70 Fahrern, **686 echte Zielankünfte**, vollständige
CP/W′-/Mechanik-/Kohlenhydrat- und Event-Audits.
Der einmalige Workflow ist entfernt;
`npm run test:scale` bleibt dauerhaft nutzbar.

**Aktueller fachlicher Stand:** R-17–R-21 als
gemeinsamer Funktionsumfang fertig, **keine finale
sportwissenschaftliche Kalibrierung behaupten**.
**Nächster beauftragter Schritt ausschließlich
Rennengine = [R-22 Issue #54](https://github.com/Lancester/radsportmanager/issues/54):
Monte-Carlo-Testmatrix, 100/500/1000+ Seeds, unabhängige
Realrenn-Vergleichsdaten, ursächliche Korrektur
der teils großen Gruppen-/Zielabstände.**
**R-23** bleibt gesonderte Freigabeprüfung für
Rennengine 1.0. **Keine Rundfahrten und
kein Karrieremodus in R-22.**


## R-22 Pilot 0.1 – GitHub Actions auf manuellen Start umgestellt (04.11.2026)

[PR #55](https://github.com/Lancester/radsportmanager/pull/55)
ist mit Squash `d5e763cad6d0dea4e6a23ec0ae24c3da2c8cf7e2`
in `main` übernommen.
**[Reguläre main-CI #41763646503](https://github.com/Lancester/radsportmanager/actions/runs/41763646503):
242/242 Tests, drei Referenzrennen, TypeScript-/Browserbuild und
GitHub-Pages-Deployment erfolgreich.**

**Neuer nutzbarer GitHub-Workflow:** `Actions → R-22 – Monte-Carlo-Test manuell starten → Run workflow`.
Er wird **ausschließlich durch den Nutzer ausgelöst**, nicht über
Push, Zeitplan oder Automatisierung. Eingaben: Rennprofil,
3/10/25/50/100 Seeds, 5/10/22 Teams × 7 Fahrer, Distanz
50/60/170/200/240 km, Seed, optional gepaarte 20-vs-100-g/h-
Verpflegungssensitivität. Ausgaben: `summary.md`, `races.csv`,
`summary.json` als 30-Tage-Actions-Artefakt plus GitHub Run Summary.
[Bedienung und Methodik](race/R22_MONTE_CARLO_PILOT.md).

**Pilotmessung tatsächlich ausgeführt:**
[PR-Tests #41763527407](https://github.com/Lancester/radsportmanager/actions/runs/41763527407)
haben zwei Seeds (2026/2027) × zwei Verpflegungszustände
über 170 km Bergprofil mit jeweils 35 Fahrern durchgerechnet:
**vier vollständige Rennen, 140 Zielankünfte**.
Die angenommene höhere KH-Zufuhr verkürzte
die modellierte Siegerzeit im gepaarten Mittel
um **2932 s (~49 min)**, was ausdrücklich als
**Warnsignal möglicher starker R-19-Überempfindlichkeit**
gilt, NICHT als echter physiologischer Renneffekt.

**R-22 ist noch nicht beendet.** Der Seed variiert
bislang nur die tagesformabhängige CP um ±2 %.
Er variiert weder Wetter noch Fahrerkader oder
taktische Zufallsentscheidungen. Externe
Profirenn-Validierungsdaten, breit angelegte
Monte Carlo, ursächliche Kalibrierung und
Held-out-Tests stehen noch aus.
[R-22 Issue #54](https://github.com/Lancester/radsportmanager/issues/54)
bleibt offen. **R-23 Freigabe unzulässig vor R-22-Abnahme.**
Weiterhin ausschließlich **Einzelrenn-Engine**;
keine Rundfahrten oder Karriere.


## R-22A/B/C – historische Referenzstrecken, neue Profi-Testfelder und GitHub-Schnellwahl (04.11.2026)

**R-22A:** vier **einzelne Straßenrennen** als neue Version-1-Testvorlagen:
TdF 2025 Lille–Lille (184,9 km/1065 modellierte hm),
TdF 2025 Lauwin-Planque–Boulogne (209,1 km/2164 hm),
Liège–Bastogne–Liège 2025 (252 km/3346 **modellierte,
nicht unabhängig belegte** hm) und TdF 2025 Auch–Hautacam
(180,6 km/3850 hm). Die Distanzen und benannten
Anstiege sind publiziert; die Übergänge wurden
ausdrücklich **als Proxies modelliert**.
Veröffentlichte Gesamthöhenmeter bei Lille,
Boulogne und Hautacam werden im Übergangsmodell
reproduziert; **kein exakter Original-GPX/DEM-Track**
oder empirisch verifiziertes gesamtes Höhenprofil.

**R-22B:** 154 reproduzierbare fiktive Profis,
physiologische Typmittel für Masse/CP/W′/CdA
aus publizierter Open-Access-Studie über
144 professionelle Radsportfahrer. Fiktive
Rider-ID-basierte Streuung statt realer
Fahreridentitäten. Abgeleitete Klassiker-
und FTP-/Fähigkeits-/Verpflegungsannahmen
werden eindeutig als Hypothesen geführt.

**R-22C:** 22 fiktive Profiteams à 7 Fahrer;
szenarioabhängig unterschiedliche Anteile von
Sprint-, GC-/Berg-, Klassiker-, Ausreißer-
und ausgewogenen Mannschaften; real
unterschiedliche Spezialistenprofile
statt überall ein identischer
Kletterer/Sprinter/fünf-Helfer-Kader.

**GitHub-Maske:** `Actions → R-22 – Monte-Carlo-Test manuell starten`:
**nur vier Angaben**: (1) eines der vier
lesbar beschrifteten Szenarien, (2) 3/10/25/50/100
Seeds, (3) optional none/carbs als
Vergleich, (4) Start-Seed.
Die Streckenlänge, 22 Mannschaften und
154 Fahrer werden automatisch gewählt.
Keine automatischen Monte-Carlo-Durchläufe;
nur `workflow_dispatch` durch den Nutzer.
Bei jedem Lauf zusätzlich `reference-scenario.json`
mit Segmenten, Quellen, Fahrerwerten
und vollständiger Teamzusammenstellung.

**Verifizierter technischer Smoke-/Stresstest:**
[vier echte 154-Fahrer-Einzelrennen, 616 Klassifikationen](https://github.com/Lancester/radsportmanager/actions/runs/41768768694)
mit Flucht-/Energie-/CP/W′-Audits vollständig
erfolgreich; dazu bestehende Regressionen.
Sportliche Realismusabweichungen bleiben
weiter Gegenstand von **R-22**:
u. a. einzelne Kletterer als Gewinner
aller vier Referenzrennen, weiterhin
viele Gruppen und teils große Rückstände.
Es wurde **kein** neuer Rennzeitbonus,
kein „automatisches Balancing“ und
keine Veränderung am CP-/Physikkern eingeführt.

[Technische Referenzdokumentation](race/R22ABC_REFERENZSTRECKEN_PROFIFELDER.md).
**Weiterhin getrennt:** keine Etappen-/Gesamtwertung,
Karriere, Verträge oder Teammitarbeiter.


## Neu: R-22 Gruppen-KI als klar getrenntes A/B-Experiment

[PR #58 erfolgreich zusammengeführt](https://github.com/Lancester/radsportmanager/pull/58).
Der optionale `groupRidingModel:'cohesive'`
berücksichtigt gemeinsames Gruppentempo,
physisch berechnete Wattanforderungen
und frühe offensive Attacken.
Er ersetzt **nicht** die
standardmäßig weiter geltende
Legacy-KI: die 154-Fahrer-Tests
zeigen eine große Verbesserung
des Hauptfeld-Zusammenhalts,
aber weiter auffällige
Teamverfolgung und Medianrückstände.

[Manueller Workflow: R-22 Gruppen-KI A/B](https://github.com/Lancester/radsportmanager/actions/workflows/r22-group-ai-ab.yml)
startet auf Wunsch zwei 154-Fahrer-
Rennen mit identischer Strecke/Seed
(alt und experimentell),
inklusive 5-km-CSV-Vergleich und
GitHub Summary. Keine regelmäßigen
oder automatischen Langstreckenläufe.
[Ergebnisse/Begründung](race/R22_GRUPPENFAHR_KI_AB.md).


## R-22: Ergänzung zu Gruppen-KI (04.11.2026)

[PR #59](https://github.com/Lancester/radsportmanager/pull/59)
ergänzt `groupRidingModel:'coordinated'`
als **experimentelle** Variante
neben Legacy/Cohesive. Die
Fahrer ordnen sich einer
gemeinsamen Gruppenfahrt unter,
sparen dabei Pedalenergie und
ausgewählte interessierte Teams
koordinieren ihre echte Ausreißerjagd,
statt ziellos allesamt zu reagieren.
Der unveränderte **Standard bleibt
`legacy`** bis zur fachlichen Abnahme.

Das wichtige neue Kriterium für
flache Rennen sind **nicht nur
Zwischengruppen**, sondern Zielgruppen:
Siegergruppe, größte Zielgruppe
und deren Rückstand auf den Sieger,
Fahrer innerhalb 60 Sekunden.
Der erste 154er-Lille-Test
mit koordinierter KI hielt
**133 Fahrer** im Zielpulk,
aber **15:29 min hinter der
Siegergruppe**. Deshalb ist die
Ausreißerjagd noch nicht
realistisch kalibriert.
[Auswertung](race/R22_HAUPTFELD_JAGD_ZIELGRUPPEN.md).

[GitHub Actions: drei KI-Varianten
manuell vergleichen](https://github.com/Lancester/radsportmanager/actions/workflows/r22-group-ai-ab.yml).


## Aktueller experimenteller R-22-Branch – kein stillschweigender Default-Wechsel (04.11.2026)

**[Draft-PR #63](https://github.com/Lancester/radsportmanager/pull/63)** untersucht den vom Nutzer bemerkten unplausiblen Feldzerfall bei langem, konstantem Führungstempo. Der alte `group-riding.ts`-Nachfahrregler setzt acht Fahrer voraus und reagiert bei >42 m oder bestimmten Teamaufträgen wieder individuell. Daher wurde `groupRidingModel:'stable-pack'` ausschließlich als zuschaltbarer KI-Versuch implementiert. Der Versuch koppelt Nachfahrer über physisch berechnete Leistungsanforderung, lokale Vordermann-Geschwindigkeit und Pacesetter-Beschleunigung; kein künstliches Positionieren, keine Veränderung von CP/W′/R-19/Aero-/Bewegungsphysik.

[CI #41788228190](https://github.com/Lancester/radsportmanager/actions/runs/41788228190) bestätigt **261/261 Tests**, sieben vollständige 154-Fahrer-Lille-Varianten. Die 600-s-Konstantführungsprobe besteht. Das stärkere Großfeld-A/B bleibt aber **unbefriedigend**: nach Beschleunigungsfix 88 in größter Zielgruppe, ca. 570 s hinter Sieger, maximal 26 Abstandsgruppen, 28 Fahrer innerhalb einer Minute. Vorher nur 27 Fahrer in größter Zielgruppe. Verbleibende Fehlerursachen: frühes Lead-Pacing, Fahren schwächerer Profis, W′/R-19 und Jagdreaktionen gezielt isolieren. **Nicht in main übernehmen**, bevor A/B auf mehreren Seeds/Profilen deutlich plausibler ist. R-23 bleibt gesperrt. Alle Details [R22_STABILES_PELOTON.md](race/R22_STABILES_PELOTON.md).

**Verbindlich:** Hauptbranch-Standard `legacy` und alle bestehenden Modelle unverändert; kein automatischer Großtest, keine Karriereentwicklung, keine Änderung der Grundsatzentscheidungen.


### Präzisierung: R-22 Peloton-Stabilisierung (04.11.2026)

Der frühe breit angesetzte `stable-pack`-Regler war ungeeignet (17 Gruppen sogar ohne Angriffe). Die geprüfte Fassung bewahrt **für gewöhnliche Feldfahrer den funktionierenden koordinierten Mitfahrregler**; physikalisches lokales Nachregel-Feedback nur noch für Jagdhelfer oder kleine Gruppen. [262/262 Tests #41789070378](https://github.com/Lancester/radsportmanager/actions/runs/41789070378) erfolgreich. 154 Fahrer ohne Attacken über 20 km vollständig in einer Zielgruppe; Lille 184,9 km, Seed 2026: größte Zielgruppe **86 Fahrer, nur 15,77 s Rückstand**, **118 innerhalb 60 s**. Warnsignale: 49 Attacken, bis 16 Distanzgruppen; nur ein Profi-Lille-Seed. [Draft-PR #63](https://github.com/Lancester/radsportmanager/pull/63) bleibt **opt-in-Experiment**, keine neue Default-Grundsatzentscheidung. Keine große automatische Monte-Carlo-Serie. [Fachnotiz](race/R22_STABILES_PELOTON.md).


### R-22: Opt-in Peloton-Verfolger-KI in main – KEIN Defaultwechsel (04.11.2026)

Die Endfassung von [PR #63](https://github.com/Lancester/radsportmanager/pull/63) ist **nach 262/262 erfolgreichen Tests** ([PR-CI #41789684647](https://github.com/Lancester/radsportmanager/actions/runs/41789684647)) mit Squash-Commit `8112633bec9e958bd10de70765429809eaa832f6` in `main` integriert. **Das ist ausschließlich ein opt-in-Experiment** `groupRidingModel:'stable-pack'`; unveränderter Standard bleibt `legacy`. Die früher in diesem Dokument ausgesprochene Nicht-Merge-Warnung galt dem fehlerhaften pauschalen Frühversuch und einer damals noch fehlenden Abnahme. Die endgültige Fassung behält die bewährte normale Mitfahr-KI und korrigiert gezielt Verfolger und Kleingruppen. Lille 154 Fahrer/Seed 2026: 86 Fahrer in größter Zielgruppe, deren Rückstand 15,77 s, 118 Fahrer binnen 60 s; 154er-/20-km-Kontrolle ohne Attacken geschlossen. **Nicht sportlich fertig kalibriert:** 49 Attacken, 16 maximale Gruppen; weitere manuelle Profile/Seeds sind erforderlich. R-22 offen, R-23 gesperrt. [Details](race/R22_STABILES_PELOTON.md).


## Aktueller R-22-Arbeitsbeschluss: zuerst kleine Profiltests, große Validierung erst am Ende (04.11.2026)

**Neuester ausdrücklicher Nutzerbeschluss – gilt vor älteren Vorschlägen am Ende dieser Datei:** `stable-pack` ist die Entwicklungsbasis, aber **vorerst keine 3–5 Seeds × vier Profile × mehrere KI-Varianten** und keine große Monte-Carlo-Serie. Wir benutzen die bereits implementierten vier Rennen Lille (flach), Boulogne (hügelig), Liège (Klassiker), Hautacam (Berg). Zunächst je ein vollständiges 154-Fahrer-Rennen mit `stable-pack` und identischem Seed 2026. Der Assistent führt diese vier Fälle **direkt im normalen PR-Testlauf** aus, diagnostiziert Zielgruppen/Zeitabstände, Attacken, Jagd- und Führungswechsel, Energie/W′ und Fahrertypen, verbessert dann gezielt die offensichtlichen KI-Schwächen und wiederholt nur kleine Checks. Erst **zum Abschluss** der KI-Entwicklung größere Mehrseed-Validierung planen (manuell und ressourcengedeckelt). Kein Defaultwechsel, keine neue Physik ohne Gegenbeweis, R-22 bleibt offen. **Verbindlicher Fahrplan:** [R22_KLEINE_PROFILTESTS.md](race/R22_KLEINE_PROFILTESTS.md). Große 36/60-Rennen-Matrix war ein verworfener Vorschlag, **wurde nicht gestartet**.


### R-22 – neuester überprüfter Vierprofil-Status (04.11.2026)

[PR #64](https://github.com/Lancester/radsportmanager/pull/64) nach **264/264 grünem CI** ([Lauf #41796481506](https://github.com/Lancester/radsportmanager/actions/runs/41796481506)) in `main` integriert. Der ausdrücklich vereinbarte **kleine** KI-Test mit Seed 2026 und nur `stable-pack` auf Lille (flach), Boulogne (hügelig), Lüttich (Klassiker) und Hautacam (Berg) hat die ersten Profilresultate geliefert. Lille größte Zielgruppe 86/15,77 s, Boulogne 32/63,24 s, Lüttich 46/706,93 s, Hautacam 12/1351,80 s; beim Hügelrennen 108 Attacken. **Sprinter F093 gewann Lüttich und Hautacam ohne eigene registrierte Attacke**, auf Hautacam führte er bereits vor dem finalen 13,5-km-Anstieg. Daher als nächstes **kleine, gezielte** Prüfung, ob Kletterer/Klassikerfahrer an Anstiegen ihre physikalisch vorhandenen Vorteile durch tatsächliche Positionierung und selektive Wattarbeit nutzen können – nicht blind die Feld-KI neu schreiben. **Keine große Vorabvalidierung, kein Defaultwechsel, keine neue Physik ohne Gegenprobe.** [Verbindlicher Ablauf und Messungen](race/R22_KLEINE_PROFILTESTS.md).


## Neueste R-22-Prüfung: Bergphysik unabhängig von KI, danach kleine Bergkapitän-Iterationen (04.11.2026)

**Nutzerauftrag:** Bergphysik **vor** der Fahrer-KI prüfen, dann mehrere kleine selbständige KI-Verbesserungen. Der gemeinsame mechanische `advanceMotionStep` und `critical-power.ts` wurden mit analytischen Steigungs-/W/kg-Vergleichen, 13,5 km bei 7,8 %, Windschatten-nur-Luftwiderstand und CP/W′-Bilanz gegengeprüft ([268/268 Tests](https://github.com/Lancester/radsportmanager/actions/runs/41797896614)); der erwartete Vorteil leichter Kletterer ist im Physikkern **vorhanden**. Physik unverändert lassen. Die individuelle, ausschließlich experimentelle `stable-pack`-Kletter-KI kann am Berg eigene physisch mögliche Kurbelwatt verlangen, statt nur die Gruppenfront nachzufahren. Erste Variante bei allen kurzen 5,5%-Hügeln verschlechterte Lille; zweite nur auf ≥3-km-Anstiegen hält Lille/Boulogne unverändert und führt Kletterer auf Hautacam zum Sieg, fragmentiert dort aber das Feld zu stark. **Dritter kleiner Versuch** beschränkt den Impuls auf ≥5-km-Pässe und Kapitäne, CI-/Ergebnisabnahme noch offen. **Nicht ungesehen zur Standard-KI machen.** Vollständige Hypothesen und Gegenproben [R22_BERGPHYSIK_UND_KLETTER_KI.md](race/R22_BERGPHYSIK_UND_KLETTER_KI.md), Stand in [ENTWICKLUNGSSTAND.md](ENTWICKLUNGSSTAND.md). Große Mehrseed-Rennen erst ganz am Ende, nur manuell. R-22 offen, R-23 gesperrt.


### Aktueller R-22-Berg-Paketstand nach fünf gemessenen Iterationen (04.11.2026)

Die anfangs breite Berg-KI (A) verschlechterte Lille, wurde verworfen. Die zuletzt gewählte Fassung **C** wirkt nur bei langen ≥5-km-Pässen und auf **Kletterer/GC-Kapitäne**: keine Änderung an normalen Feldern, keine Ergebnis-/Watt-/Positionsgutschrift. Unabhängige Steigungs-/CP/W′-/Schwerkraft-/Aero-Dynamiktests [268/268](https://github.com/Lancester/radsportmanager/actions/runs/41797896614) grün, vier komplette Rennprofile für C [271/271](https://github.com/Lancester/radsportmanager/actions/runs/41799290398) grün. **Lille, Boulogne, Lüttich unverändert**, Hautacam nun **Kletterer auf Plätzen 1–4** statt Sprinter. Maximal 36 Gruppen auf Hautacam weiterhin kritische Kalibrierungsfrage. Die weicheren Varianten D/E brachten zu viele Nichtkletterer vorne bzw. wieder große 20-min-Rückstände und wurden verworfen. Finaler PR-Status: [PR #65](https://github.com/Lancester/radsportmanager/pull/65) anhand letzter CI prüfen. Nächster **kleiner** KI-Schritt nach Aufnahme: Klassikerrennen/Lüttich, danach Angriffshäufigkeit in Boulogne, danach Berggruppenkohäsion. **Nicht** zurück zur automatischen Großvalidierung. [Genaue Fachnotiz](race/R22_BERGPHYSIK_UND_KLETTER_KI.md), [Entwicklungsstand](ENTWICKLUNGSSTAND.md). Standard `legacy` bleibt, R-22 offen, R-23 gesperrt.


### Verifizierte Integration nach Bergphysik- und Kletter-KI-Prüfung (04.11.2026)

[PR #65](https://github.com/Lancester/radsportmanager/pull/65) mit **271/271 grünem PR-CI** ([#41800807951](https://github.com/Lancester/radsportmanager/actions/runs/41800807951)) per Squash `d8ec5cbf5b1eb9f7de62162f2a7ec523a50d0d14` in `main` aufgenommen. Damit ist der oben als „noch offen“ bezeichnete PR-Test **abgeschlossen**; die gültige Fassung ist der **dritte getestete Bergkapitän-Modus C**, nicht die später wieder verworfenen weicheren Varianten D/E. Die Physik konnte ihre vereinfachten Bergvergleichstests bestehen und wurde nicht geändert; `stable-pack` bleibt nur opt-in, `legacy` bleibt Default.

**Aktuelle Werte Seed 2026:** Lille 86 / 15,77 s, Boulogne 32 / 63,24 s, Lüttich 46 / 706,93 s (alle unverändert); Hautacam Top 4 Kletterer und größte Gruppe 4 / 299,09 s, noch 36 max. Distanzgruppen. **Exakt nächste Aufgabe:** die kurze steile Klassiker-Selektion bei Liège verbessern, **nicht** den Pyrenäen-Langpass-Mechanismus ohne Beleg wieder verallgemeinern. Danach Boulogne-Attacken/Hautacam-Kohäsion getrennt bearbeiten. Keine große Vorabvalidierung. [Fachbericht](race/R22_BERGPHYSIK_UND_KLETTER_KI.md), [Entwicklungsstand](ENTWICKLUNGSSTAND.md).


## Aktueller Überblick zur gesamten Rennfahr-KI – neuer Leseeinstieg (04.11.2026)

**Auf ausdrücklichen Nutzerwunsch angelegt:** [RENNFAHR_KI_GESAMTUEBERSICHT.md](race/RENNFAHR_KI_GESAMTUEBERSICHT.md). Diese technische und verständliche Bestandsaufnahme erklärt die **tatsächlich aktive** Kombination aus individueller Fahrer-KI, Angriffen/Sprint/Erholung, koordinierten Teamaufträgen, Jagd- und Relaisregeln, normalem Gruppenfahren, speziellem `stable-pack` für Verfolger/Kleingruppen und gezielter Kletterkapitäns-KI. Sie trennt geprüfte Grundgleichungen, noch unkalibrierte Modellannahmen und reine KI-Heuristiken; nennt Grenzen des 1D-Rennsimulators und verweist auf die Quellmodule.

**Neue empirische Einordnung:** Bei realen Tour-/Vuelta-Bergetappen 2025 entstehen sehr große Zeitabstände und zahlreiche kleinere Fahrergruppen. Die bislang auf Hautacam gemessenen **36 maximalen 42-m-Abstandsgruppen** sind für sich allein **kein** Beweis für zu starken künstlichen Feldzerfall. Entscheidend sind die **Anstiegszeitreihen**, die Größe der tatsächlichen Favoriten-/Spitzengruppen, echte Attacken und sportlich erklärbare Zeitrückstände. Die interne 1-s-Zielzeitgruppenregel entspricht nicht einer offiziellen UCI-Zählung. Bitte deshalb **kein globales „weniger Berggruppen“-Ziel** einführen. [Quellen und vier echte Vergleichsetappen](race/RENNFAHR_KI_GESAMTUEBERSICHT.md#5-welche-rennformen-sind-schon-plausibel-wo-bestehen-offene-ki-probleme).

**Unverändert:** Zuerst gezielte Klassiker-/Puncheur-KI auf Lüttich erarbeiten (echte Attacken an kurzen steilen Anstiegen, nicht garantierte Siegertypen), anschließend Boulogne-Attacken und Berggruppenentwicklung getrennt beurteilen. `legacy` weiterhin Default, `stable-pack` opt-in, R-22 offen, R-23 gesperrt; große Statistik erst am Schluss und manuell.


### Neues verpflichtendes Diagnosefeld: Vorabstärkste Fahrer und tatsächliche Platzierungen (04.11.2026)

Der Nutzer möchte künftig bei jedem kleinen `stable-pack`-Vergleich sehen, ob die stärksten modellierten **Kletterer, Klassikerfahrer, Sprinter, Zeitfahrer, Allrounder** tatsächlich vorne landen. [R22_FAHRERSTAERKE_FAVORITEN_AUSWERTUNG.md](race/R22_FAHRERSTAERKE_FAVORITEN_AUSWERTUNG.md) erklärt die **unabhängig vom Ergebnis** berechneten körperlich/taktischen Fähigkeitsproxies (8-%-Bergsolo-CP-Tempo, Drei-Minuten-CP/W′ pro Gesamtkg, Sprint-Wattanfrage, Solo-Aero/CP-Flachtempo, Allround-Kombination). `scripts/r22-profile-smoke.mjs` schreibt für alle **vier schon vorhandenen** Rennen und den festen Seed 2026 `R22-FAVORITES` mit dem stärksten Fahrer je Kategorie, seiner Zielplatzierung/Zielrückstand sowie dem gesamtfeldweiten Streckenprofil-Top-3 und dem Vorabstärkerang des Rennsiegers. Keinerlei Ergebnismanipulation und keine Pflicht zum Favoritensieg; große Statistik erst am Ende. Diese Metrik künftig bei Änderungen an Klassikerattacken, Feldfahren und Bergetappen ebenfalls betrachten.


## Neuester bestätigter Stand 04.11.2026 – Klassiker-PR #71 integriert, Lille-Sprintursache gemessen

**Nutzer hat die Freigabe des zuvor in PR #70 blockierten selektiven Klassiker-Experiments und eine Lille-Auswertung angefordert.** Der reparierte Integrations-[PR #71](https://github.com/Lancester/radsportmanager/pull/71) wurde mit **281/281 grünen Tests** ([CI #41814392330](https://github.com/Lancester/radsportmanager/actions/runs/41814392330)) in `main` aufgenommen (Squash `369077b2f5a3a424d2959947b547a58a20a67d51`). Alter PR #70 als **ersetzt geschlossen**. `legacy` weiterhin Default, `stable-pack` experimentell. Die neue selektive Team-Puncheur-KI ist technisch grün, aber **Liège gewinnt nach wie vor ein Sprinter, F003 (stärkster Klassiker) Platz 122**, Spezialattacken 45 von 15 Fahrern; sie ist sportlich noch nicht ausreichend. Kein Siegerbonus eingeführt.

**Detaillierter Lille-Befund:** [R22_LILLE_SPRINTER_DIAGNOSE.md](race/R22_LILLE_SPRINTER_DIAGNOSE.md). Stärkster vorab modellierter Sprinter **F023** im Sprintteam T04: Rang 150, +267,50 s, obwohl Tages-CP ~406,66 W und im Ziel **91,2 % W′-Reserve** vorhanden. Bereits km 5 Rang 150, km 100 Rang 126 noch in großem 136er-Feld, km 120 in abgehängter **11er-Gruppe** bei ~1,275 km Rückstand auf Rennspitze, km 160 +2,802 km. Die Teamaufträge um km 41–49 änderten die hintere Position nicht. **Primär fehlende frühzeitige Positionierung / Sprinter-Schutz im großen 1D-Feld, keine frühzeitige W′-Erschöpfung**. Auf `main` existiert nun eine reine Diagnose `R22-LILLE-SPRINTER-AUDIT` aus derselben Vierprofil-Runde, außerdem `R22-FAVORITES`. Nächster kleiner Schritt: **echte sprinterorientierte Feldpositionierung und kooperierende Teamarbeit mit begrenzter realer Kurbelwatt**, nicht künstliche Position, nicht neue Physik. No-Attack-20-km-Regressionsfall und vier Profile schützen, große Multi-Seed-Validierung erst ganz am Ende.


### R-22: Frühe Sprinterpositionierung – eigenständiger experimenteller Fortschritt (04.11.2026)

Auf Nutzerauftrag in [PR #72](https://github.com/Lancester/radsportmanager/pull/72) umgesetzt: Im **opt-in `stable-pack`** dürfen Sprinter von Sprintteams auf langen überwiegend flachen Strecken im zusammenhängenden großen Feld durch begrenzte **echte Kurbelwatt-Mehrarbeit** aus dem hinteren Feld ins vordere Drittel gelangen. Höchstens ein physisch naher Helfer des Sprintteams kann mit begrenztem Wattbeitrag folgen. Keine Veränderung von Positionen durch Software, Fahrertypen-Wattwerten, R-19, CP/W′, Windschatten oder Bewegungsintegrator; `legacy` Standard unverändert.

**Erste CI [#41816164406](https://github.com/Lancester/radsportmanager/actions/runs/41816164406): 285/285 Tests**, vier bestehende 154-Fahrer-Referenzrennen Seed 2026. **Lille stärkster Sprinter F023: von Rang 150 / +267,50 s auf Rang 41 / +17,53 s;** bereits km 20 Rang 17 statt 149, km 120 noch im 148er-Feld statt 11er-Gruppe; 146 statt 118 Fahrer innerhalb 60 s, 11 statt 16 maximale 42-m-Gruppen. Boulogne, Liège, Hautacam **in diesem Seed exakt unverändert**. Sieger Lille weiterhin Allrounder; Sprintfinale/-jagd noch nicht gelöst. [Genaue physische Beschreibung, reproduzierbarer Testbericht](race/R22_FRUEHE_SPRINTERPOSITIONIERUNG.md).

**Nächster Schritt:** Nach letztem CI-Durchlauf mit den neuen reinen Positionierungsdiagnosen (`sprintPositioningSeconds`, `sprintEscortSeconds`) PR #72 in `main` freigeben. Weiterhin kein großer Monte-Carlo-Vorlauf; andere Strecken dürfen nicht durch eine globale Sprinterregel verändert werden.


### Aktuell freigegebener Stand, 04.11.2026: Sprintphasen und Hinterradtalent in main

**Freigabe [PR #73](https://github.com/Lancester/radsportmanager/pull/73), [CI #41820155850](https://github.com/Lancester/radsportmanager/actions/runs/41820155850) 295/295 grün, Squash `11e02f2f2cbc1be0d247facc55d14f0734e852f2`.** Frühere Frühaufück-Version aus #72 wurde durch #73 ersetzt und #72 geschlossen. **Verbindliches aktuelles experimentelles `stable-pack`:** Sprinter bleiben zunächst im Feld, rücken erst ab dem letzten Rennviertel gezielt auf, erhalten in der Schlussphase echte begrenzte Sprintzug-Helferwatt (Helfer sollen nicht >70 m abreißen) und besitzen eine **vom Sprintskill unabhängige Fähigkeit `wheelFindingSkill`**, bei fehlendem eigenen Sprintzug ein echtes gegnerisches Hinterrad zu wählen und durch eigene Wattarbeit dort zu bleiben. Kein frei erfundener Aero-/Sieg-/Positionsbonus.

**Gemessene Lille-Verbesserung:** vorab stärkster Sprinter F023 nun **Platz 5 / +8,18s**, statt Platz 150/+267,50s ursprünglich; bei km20 noch Platz134, 3 echte Helfer innerhalb30m vor Sprintauslösung, vom Sprintskill .95 getrenntes Hinterradtalent .976. **Lille-Sieger bleibt nicht Sprinter** (diesmal Klassiker F036), Helfer wurden im Finale nicht als `sprintzug`-Crewmission gezählt; weitere Teamjagd-/Leadout-Verbesserungen offen. Boulogne/Liège/Hautacam exakt unverändert im Seed 2026. Genaue Messwerte, Grenzen und Quellfunktionen: [R22_FRUEHE_SPRINTERPOSITIONIERUNG.md](race/R22_FRUEHE_SPRINTERPOSITIONIERUNG.md), Abschnitt 6. `legacy` bleibt Default, `stable-pack` experimentell, R-22 offen, keine große automatische Statistik vor Ende der KI-Entwicklung.

### Aktuelle Arbeitsübergabe, 04.11.2026: R-22 lange physische Jagdfront
PR #74 ist **nicht** in `main`; PR #75 ist ein getrennter offener Manager-Schnittstellen-Versuch. Der letzte geprüfte PR-#74-Lauf [#41839310989](https://github.com/Lancester/radsportmanager/actions/runs/41839310989) war technisch grün (309/309), aber Jagdführungen blieben physisch maximal 102 s ununterbrochen, mit 203 Wechseln. Nächster Versuch in #74: ein gemeinsamer tatsächlich vorhandener Jagdführender, Unterstützung im Windschatten, physisch begrenzte Ablösung. Details und neues CI-Gate in [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 7. **Keine Merge-Freigabe** oder Änderung der Grundsatzentscheidungen damit verbunden.

### Verifizierter Abschluss dieser Arbeitsrunde (04.11.2026)
Experimenteller PR #74 mit Code-Commit `a9b92f5`, [Actions #41854711585](https://github.com/Lancester/radsportmanager/actions/runs/41854711585): **310/310 grün**. Im Lille-Profil steigt die längste gemessene Feldkopf-Jagdfront 102→634 s und Wechsel sinken 203→187, **ABER** F023 Rang 4→11, Ausreißer bei km170 544 m voraus, keine echte langandauernde erschöpfte Helferablösung; 634 s sind noch **kein** belegter namentlicher Hochleistungs-Dauerstint. Drei andere Profile unverändert. Sportliche Abnahme ausstehend; **PR #74 nicht mergen**, `legacy` Standard, PR #75 separat. Neuer nächster Schritt: echte fortlaufende Leader-Watt/Position-Statistik und Feld-/Sprintereffekte, siehe [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 9.

### Aktuelle Übergabe: kurzes physisch echtes Nachführrelais zulassen (04.11.2026)
**Verifizierter Folgeversuch vom 04.11.2026:** Im experimentellen PR #74 wurde der 180-s-Aufrücker-Schutz (sportlich unbrauchbar) auf **50 s für noch nicht vorne fahrende Nachrücker** verkürzt. Zusätzlich dürfen in der späten Sprintteam-Jagd ab 90 % Rennfortschritt **echte kurze Rotationen bereits nach 10 s** stattfinden, wenn beide verfügbaren Jäger tatsächlich innerhalb von 18 m der physisch gemessenen Hauptfeldspitze fahren und der Übernehmende mindestens 2 m real voraus liegt. Kein Phantomwechsel in 80–140 m Entfernung; keine direkte Änderung an Position, Geschwindigkeit oder Energie. Zwei bewusst abwechselnde Fahrer mit eigenen Watt sind eine zulässige alternative Taktik zur langen Einzelführung, aber die KI organisiert den Wechsel bislang **nicht aktiv als eigenes Zweier-Staffelprogramm**.
[Actions #41861080773](https://github.com/Lancester/radsportmanager/actions/runs/41861080773), Codehead `53ac3ef`: **316/316 grün** inkl. neuer Einheitenprüfung `echte zehnsekündige Ablösung` und vier Profil-Smokes mit 154 Fahrern/Seed 2026. Lille: bei km170 Flucht tatsächlich eingeholt (im verworfenen 180-s-Test noch ~410 m Vorsprung), **1 physisch verausgabter Jagdhelfer**, **78 s bewusstes Ausrollen**; echte namentliche Jagdfront insgesamt **1.425 s**, davon längster kontinuierlicher CP-naher Führungsstint **514 s**, mittlere reale Führungswatt ca. **342,78 W**. Lille-Sieger **Sprinter F044**, aber nur **1 Sprinter unter den Top 10**; Siegerzeitgruppe **25 Fahrer mit 8 Sprinterspezialisten**. Größte Zielzeitgruppe **69 Fahrer**, erst **43,21 s** hinter dem Sieger. Der vorsichtige Massensprint-Proxy (mindestens 30 in Siegergruppe plus mindestens 2 Sprinter Top 10) bleibt daher **false**; **F023 Platz 20 (+1,17 s)**. Andere drei Referenzprofile unverändert.
**Grenze:** Ein einzelner Seed ist weder eine aussagekräftige Massensprint-Wahrscheinlichkeit noch die sportliche Kalibrierung des Modells. In Lille wurde keine komplette bewusst gesteuerte Zehnsekunden-Zweierstaffel beobachtet; der neue Regressionstest belegt nur, dass eine schon physisch vollzogene Kurzrotation korrekt erkannt und nicht blockiert wird. Später müssen dynamische Zweier-Führungsorganisation, Erholung im Windschatten und Sprinter im finalen vorderen Feld systematisch geprüft werden, ohne Ergebnisse künstlich auf Sprintersiege zu trimmen. `main`, Default-`legacy`, Formations-Aero, CP/W′, R-19 und PR #75 unverändert; **R-22 sportlich offen, keine Merge-Freigabe**.
Nächste Arbeitsrunde in [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 14.

### Übergabe 04.11.2026: individuelle Final-Sprint-KI (Test ausstehend)
**R-22 experimenteller individueller Endspurt (04.11.2026), nur PR #74:** Bisher gab es auf allen Etappen einen pauschalen Antritt erst bei 250 m mit `CP + 180 W + 210 W × sprintSkill` – weder individuelle Startdistanz noch angemessene kurzzeitige Sprintwatt. CP/W′ und R-19 waren bereits physisch modelliert und bleiben unverändert. Die neue `src/engine/race/final-sprint.ts` berechnet für jeden real im Rennfeld fahrenden Sprinterspezialisten aus **individueller Früh-/Spätstartneigung `sprintLaunchPreference`**, tatsächlich geschütztem Hinterrad, Position und Distanz zur Front seiner aktuellen physischen Gruppe, eigenem vs. Gruppenfronttempo, Gegenwind und W′-Reserve, **ob genau jetzt der Sprint ausgelöst werden soll**. Die KI entscheidet pro tatsächlich gefahrenem Zeitschritt und merkt sich den einmaligen Start; es gibt **KEIN gemeinsames 400-m- oder 250-m-Startsignal**. Danach fordert sie individuelle anfangs hohe, zeitlich abfallende Kurbelwatt an: optionale unabhängige Fahrerwerte **`sprintPeakPowerW` und `sprintDecayTimeS`**, in der fiktiven Referenzfahrt gestreut, aber **noch nicht kalibriert**. Alle Watt laufen wie bisher erst durch R-19, den echten CP/W′-Verbrauch und `advanceMotionStep`; keine hinzugefügte Geschwindigkeit, Position oder physikalische Sonderenergie. Die alte automatische 250-m-Auslösung wird ausschließlich für die davon erfassten Sprinterspezialisten des experimentellen langen flachen `stable-pack` unterdrückt, damit echte Spätstarter nicht doch unbeabsichtigt vorzeitig sprinten. Auf Boulogne, Liège, Hautacam, `legacy` und anderen Modellen gilt weiterhin der unveränderte alte Pfad.
**Teststatus:** Neue isolierte Unit-Tests prüfen unterschiedliche Früh-/Spät-Antritte, variierende Wind-/Gruppensituationen, maximale anliegende und abfallende Wattleistung, getrennte Dauer, echten W′-Verbrauch und das Entfernen der pauschalen 250-m-Automatik nur im Opt-in-Modus. Der Vierprofiltest 154 Fahrer/Seed 2026 und vollständiger Regressionstest wurden nach Code-Commit `a9f6bd0` angestoßen: [GitHub Actions #41864359250](https://github.com/Lancester/radsportmanager/actions/runs/41864359250) – **noch in Warteschlange; daher KEINE behaupteten Siege, Top10-Quoten, Massenprints oder grüne Gesamtvalidierung für diese Version**. Ergebnis erst nach realem Test protokollieren. Letzter bestätigter Vorher-Wert: [#41861080773](https://github.com/Lancester/radsportmanager/actions/runs/41861080773) 316/316, Lille 1 Sprinter in Top10, 25 Fahrer Siegerzeitgruppe, F023 Rang20. R-22 bleibt sportlich offen; **PR #74 nicht mergen**, getrennte Manager-PR #75 und `main` unverändert.
Umsetzungsdetails: [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 16.

### Nächste Übergabe: vier Profilresultate, ein Unit-Test korrigiert (04.11.2026)
**Neuer realer CI-Lauf der individuellen Final-Sprint-KI:** [Actions #41864359250](https://github.com/Lancester/radsportmanager/actions/runs/41864359250) mit **321/322 bestandenen Tests**. Ein neuer, fachlich inkonsistenter Unit-Testfall nutzte `groupSize=1` bei `rankInGroup=14`; die KI lehnte das korrekt mit `RangeError` ab. Testdaten auf `rankInGroup=1` korrigiert, Codefix `f678a9d`; [vollständiger Wiederholungslauf #41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) bei Dokumentationsstand **noch queued**, also **noch nicht grün**.
Die bereits vollständig ausgeführten 4 Rennprofile (154 Fahrer, Seed 2026) zeigen für Lille **8 Sprinterspezialisten in Top 10**, Sieger **Sprinter F009**, zuvor bester Sprintfavorit **F023 Platz 2 (+0,19 s)** statt Platz 20; **22 individuelle Sprintstarts**, Top-10-Sprinter z.B. bei 192,4/232,4/266,6/318,2/351,5 m, tatsächlich anliegende Spitzenwatt der Top-10-Sprinter ca. 1.239–1.381 W. **24 Fahrer in Siegerzeitgruppe**, darum vorläufiger konservativer Proxy `massSprintProxy=false` trotz 8 Sprintern in den Top 10; die 30er-Schwelle bedarf fachlicher Überprüfung, ohne sie nachträglich für diesen Lauf zu verschieben. **Boulogne, Liège und Hautacam unverändert**, jeweils 0 individuelle Sprintstarts. Ein positiver Sportbefund aus einem Seed ist **keine Wahrscheinlichkeit oder Gesamtfreigabe**. Keine Änderung am Bewegungskern, CP/W′, R-19, an `main`, `legacy` oder separatem PR #75; PR #74 weiterhin nicht mergen.

### Bestätigter Sprint-Finaletest: 322/322 grün (04.11.2026)
**Verifizierter Abschluss des isolierten Sprint-KI-Arbeitsschritts (04.11.2026):** [Actions #41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) **322/322 Tests erfolgreich, 0 Fehler**. Code-Commit `f678a9d` korrigierte ausschließlich den unmöglichen Testzustand (Einzelgruppe, Rang 14 → Rang 1); kein Eingriff in das Sprintmodell. Lille (154 Fahrer, Seed 2026): **22 reale individuelle Sprintantritte**, **8 Sprinterspezialisten Top 10**, Sieger F009 (Sprinter), stärkster F023 **2. Platz +0,19 s** (vorher Platz 20), **24 Fahrer Siegerzeitgruppe**. Top10-Sprintstarts unterschiedlich, z.B. 192/232/267/286/318/352 m, reale Spitzenwatt ca. 1.239–1.381 W. Boulogne, Liège, Hautacam numerisch unverändert und jeweils 0 individuelle Sprintstarts. **Das isolierte Feature ist technisch abgeschlossen**, `main` nicht verändert. **Gesamt-R-22 sportlich offen**, weil der konservative `massSprintProxy=false` wegen 24 statt mindestens 30 Fahrern in der Siegerzeitgruppe bleibt (nicht nachträglich am erfolgreichen Ergebnis ausrichten); Liège hat weiterhin 6 Sprinter in Top10 und bedarf eigener Klassiker-KI-Optimierung. PR #74 offen und *nicht* mergen; PR #75 separat. Ein einzelner Seed ist keine Massensprint-Häufigkeitskalibrierung.

### Neueste Übergabe: experimentelle Klassiker-KI validiert, PR #76 (04.11.2026)
**Klassiker-KI, erster experimenteller Vierprofil-Erfolg (04.11.2026):** Getrennte [Entwurfs-PR #76](https://github.com/Lancester/radsportmanager/pull/76), Code c57e01d + Testaudit 815f16c, basiert auf dem noch offenen PR #74, **nicht auf main gemergt**. Neu ist src/engine/race/classics-racecraft.ts: (1) vor den späten Schlüsselrampen physisch mit eigener CP-naher Antriebsarbeit in DER ECHTEN Abstandsgruppe aufrücken, statt Klassikerspezialisten als weit zurückliegende Helfer zu belassen; (2) an ausgewählten steilen Schlussrampen EINEN nach aktueller körperlicher Stärke geeigneten vorderen Klassikerfahrer pro physischer Gruppe moderat oberhalb CP länger Tempo machen lassen. Beide Entscheidungen sind reine begrenzte Wattanfragen; jeder Fahrer bleibt an W′, R-19, Masse/Steigung/Aero, realem Abstand und Bewegungskern gebunden. Die alte selektive einzelne 180-s-Attacke bleibt erhalten, falls sportlich gerechtfertigt; kein Klassikersieg/Positionssprung/Siegbonus programmiert. Regel gilt nur für lange rampenreiche Klassiker im experimentellen stable-pack; **legacy-Standard sowie Sprint-/Bergmodelle unangetastet**.
**Bestätigte CI [#41870445572](https://github.com/Lancester/radsportmanager/actions/runs/41870445572), 324/324 Tests grün, 0 Fehler**, darunter 154-Fahrer-Lille/Boulogne/Liège/Hautacam mit genau Seed 2026, 30er und No-Attack-Regression. Gegenüber verifizierter vorheriger Basis [#41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) bleiben Lille, Boulogne und Hautacam in **allen bisherigen Ergebnisfeldern** exakt unverändert (neue Diagnosefelder und Laufzeit ausgenommen). Liège: zuvor 6 Sprinter unter Top 10, Sprinter F114 Sieger, stärkster Klassiker F003 Rang 122, drittstärkster Klassiker F049 Rang 107, 24 Fahrer Siegerzeitgruppe → **0 Sprinter Top10**, Sieger Klassikerspezialist **F057**, **F003 Rang 2 (+0,73 s), F049 Rang 3 (+0,78 s)**, **3 Fahrer in Siegerzeitgruppe**. Tatsächlich angefordert: **5.878 Fahrer-Sekunden Positionsarbeit**, **487 Fahrer-Sekunden selektives Rampentempo** von F003 und F049; separate klassische Rampenattacken 45→39, alle energetisch/physikalisch begrenzt. Der mediane Zielrückstand in Liège wächst allerdings von **265,01 s auf 667,12 s** – fachlich noch zu bewerten, nicht als vollständig kalibrierten Realismus ausgeben. **Ein Seed ist kein Beleg realistischer Siegwahrscheinlichkeiten**; PR #76 als Draft, keine Mergefreigabe. Bestehende R-22-Feldjagd/Sprint-KI in PR #74 und Manager-Helferwahl in PR #75 bleiben eigenständige offene Arbeiten.

### R-22: Klassiker-KI isoliert abgeschlossen, 324/324 grün (04.11.2026)
**Abschluss des isolierten R-22-Klassiker-KI-Entwicklungsschritts (04.11.2026):** Fachlicher Zielstand ist die ursprüngliche realitätsnähere Selektion aus PR #76 (Codebasis `815f16c`, abschließender Code-Commit `18fe59f`). **Verifizierter finaler vollständiger Testlauf [GitHub Actions #41875836222](https://github.com/Lancester/radsportmanager/actions/runs/41875836222): 324/324 erfolgreich, 0 Fehler**, einschließlich vier Referenzrennen mit je 154 fiktiven Fahrern/Seed 2026 sowie bisheriger No-Attack-, 30er-, CP/W′- und R-19-Regressionen. Liège: Klassiker F057 Sieger; Top10 **7 Klassiker, 2 Zeitfahrer, 1 Allrounder, 0 Sprinter**, stärkster Klassiker F003 **Platz 2 (+0,73s)**, drittstärkster F049 **Platz 3 (+0,78s)**, Siegerzeitgruppe 3, 5.878 Fahrer-Sekunden zusätzlichen Positionswatt-Wunsches und 487 Fahrer-Sekunden gezieltem Rampentempo-Watt-Wunsch. Lille, Boulogne und Hautacam **in allen bisherigen Ergebniskennzahlen unverändert**; `legacy`-Default sowie Physikkern, Formationsaerodynamik, W′, R-19, Bewegung und eigener PR #75 unverändert. Keine Gewinner-/Watt-/Zeit-/Positionsboni. Der Medianrückstand von 667,12 s (+11:07) und frühe Rückstände des hinteren Feldes (Rang 77 bereits etwa 1,0 km bei km190, 3,85 km bei km215) sind ausdrücklich ein offener *R-22-Gesamtkalibrierungsbefund*, kein Beweis umfassend realistischen Feldverhaltens. Originalimplementierung mit gemessenen Gruppenpositionen und W′-abhängigen echten Taktik-Wattwünschen wurde nach Gegenversuchen bewusst **beibehalten**: Eine pauschale +40-W-Regel allein lieferte 24.867 statt 5.878 nominierte Fahrer-Sekunden Aufrückarbeit und zehn Klassikerspezialisten unter zehn; die anschließende fahrertypübergreifende Nominierung ließ den stärksten klassiker F003 wieder auf Platz 119–124 zurückfallen. Diese Varianten wurden verworfen, nicht auf main gebracht. **Isolierte Klassiker-Funktion technisch abgeschlossen und zur Begutachtung bereit; PR #76 baut noch auf PR #74 auf und wird nicht nach main gemergt.** Spätere Mehrseed-/Feldgruppen-Häufigkeitskalibrierung gehört zur R-22-Gesamtabnahme, nicht zu einem künstlich auf Klassikersieger getrimmten Feature. Details in [R22_KLASSIKER_KI_ABNAHME.md](race/R22_KLASSIKER_KI_ABNAHME.md).

### R-22: Feldteilung vor Sprintfinale behoben, PR #74 (04.11.2026)
**R-22 PR #74, gezielte Reparatur des Zielsprintfeldes (04.11.2026):** Der zunächst offene vermeintliche Jagdfehler ließ sich durch **reale Checkpoints** genauer eingrenzen: Die Feldjagd hatte die Ausreißer bei km 170 schon eingeholt, aber in der letzten Anfahrt hatte die bisherige Sprintpositionierung `leadoutFrontShare=.10` mehrere Sprintteams gleichzeitig aus einem 120er-Hauptfeld nach vorne beschleunigt: Bei km 180 waren nur **25 Fahrer in der ersten** und **90 Fahrer in der größten physischen Gruppe**. Die konservative Zielgruppen-Heuristik `massSprintProxy` blieb mit 24 Fahrern in der Siegerzeitgruppe unter dem Schwellenwert 30. **Nicht die erfolgreiche Jagd künstlich verschärfen.**
**Gezielte KI-Änderung:** In `src/engine/race/sprint-positioning.ts` reicht den Sprintteams ab 94 % Streckenfortschritt jetzt das **vordere Fünftel** (`leadoutFrontShare=.20`) statt das erste Zehntel, bevor sie zusätzliche Positionierungswatt anfordern. Ein guter Fahrer darf natürlich aus eigener Leistung die Spitze und den Sprint gewinnen; die Regel nimmt nur unnötige Extra-Watt bei ohnehin bereits guter Position zurück. Kein Positions-, Gruppen-, Zeit-, CP/W′-, R-19- oder Aero-Eingriff; vor 94 % bleibt alles unverändert. Ergänzend `R22-LILLE-FINALE-FIELD` erfasst beim bereits vorhandenen Vierprofil-Smoke die reale Feldgruppe bei km 165/170/175/180; der neue Szenarioregressionstest verlangt im einmaligen Lille-Seed 2026 mindestens 80 Fahrer in der ersten zusammenhängenden Gruppe 5 km vor dem Ziel (keine allgemeine Massenprintquote).
**Vollständiger erster CI [#41881059600](https://github.com/Lancester/radsportmanager/actions/runs/41881059600) auf Codecommit `248e8dd`: 322/322 Tests grün**, vier Profile (154 Fahrer, jeweils Seed 2026), 30er und No-Attack-Gates. Lille: **erste physische Gruppe bei km 180 = 115 statt 25 Fahrer**, größte physische Gruppe ebenfalls 115; 5 km vorher bei km 175 120 Fahrer zusammen. Sieger Sprinter F149 statt F009, **8 Sprinter Top10 unverändert**, Siegerzeitgruppe **26 statt 24 Fahrer**, größte Zielzeitgruppe 71 Fahrer bei **+20,73 s statt +43,64 s**; 119 statt 117 Fahrer binnen +60 s. **Jagdwerte unverändert und weiter belegt:** 2 Fluchten eingeholt, 1.425 s namentlich gemessene CP-nahe Feldkopf-Jagd, längster kontinuierlicher Führungsblock 514 s, 1 Helfer nach 984 s Frontarbeit bewusst zurückgefallen, 22 individuelle Sprintantritte. **Boulogne, Liège, Hautacam exakt unverändert**. Der neue reine Test-/Dokumentationsstand nach `248e8dd` war zum Zeitpunkt dieser Notiz noch nicht separat CI-verifiziert.
**Grenze:** Der konservative **30er-Siegerzeitgruppen-Proxy bleibt `false`**. Keine Schwellenabsenkung, um Testerfolg vorzutäuschen; aus diesem einen Seed keine allgemeine Wahrscheinlichkeit für Massensprints ableiten. Die konkrete Fehlselektion vor den letzten 5 km ist aber sportlich und physikalisch messbar deutlich verbessert. **PR #74 weiterhin offen und ungemergt; PR #75 getrennt, PR #76 als abhängiger Klassiker-PR, `main` unverändert**. Vor eventueller Integration den vollständigen CI-Lauf des neuesten Test-/Dokumentationsstands prüfen und auf echte Feldgruppen/Sprint-KI achten.
