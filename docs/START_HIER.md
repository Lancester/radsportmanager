# START HIER – Arbeitsanweisung für alle zukünftigen Chats

**Projekt:** Radsportmanager. **Sprache:** Deutsch. **Verbindlicher Projektstand:** GitHub, nicht einzelne Chat-Unterhaltungen.

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
