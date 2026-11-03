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
