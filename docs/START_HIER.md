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
