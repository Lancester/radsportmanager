# GitHub-Einrichtung und Arbeitsweise

## Ist-Zustand am 03.11.2026

Das öffentliche Repository Lancester/radsportmanager auf main existiert. Die verbundene GitHub-App kann darauf lesen und schreiben. Bei Projektstart soll zunächst Dokumentation, **noch keine lauffähige Engine**, übernommen werden.

## Arbeiten nur mit Android

- ChatGPT für Planung, Code und Reviews.
- GitHub für sämtliche Dateien, Issues, Pull Requests und CI-Tests.
- Keine zusätzliche ALL-INKL-DB und kein eigener Laptop nötig.
- GitHub Actions kann Simulationstests auf GitHub-Rechnern durchführen; die echte PWA simuliert später lokal auf dem Smartphone.

## Kleiner und kontrollierbarer Workflow

1. In docs/ENTWICKLUNGSSTAND.md den nächsten Schritt lesen.
2. Issue mit konkreten Akzeptanzkriterien bearbeiten.
3. Bei Codeänderungen kleiner Branch und Pull Request.
4. Prüfung: reproduzierbare Tests, fachliche Plausibilität, gegebenenfalls Android-Tests.
5. Dokumentation aktualisieren und erst nach Prüfung mergen.
6. Hauptbranch main bleibt die verbindliche stabile Version.

## GitHub Actions: Kostenkontrolle

- Standard-GitHub-gehostete Runner sind für öffentliche Repositories normalerweise ohne Minutenabrechnung; Missbrauchs-, Joblaufzeit- und Ressourcenbegrenzungen gelten trotzdem.
- Große Monte-Carlo-Jobs ausschließlich manuell (workflow_dispatch), mit festem maximalem Umfang und timeout-minutes.
- Kleine Unit-Tests nur bei relevanten Änderungen/PRs; keine unnötigen Matrix-Kombinationen.
- Unvertrauenswürdigen PR-Code nicht mit Schreibrechten oder Secrets ausführen.
- Nicht GitHub als ständig laufende Spielserver-Infrastruktur missbrauchen.

## Öffentlichkeit und Lizenzen

- Öffentlich bedeutet: Code und Diskussionen sind für andere sichtbar; keine Schlüssel oder privaten Daten einchecken.
- Öffentlich ist **nicht automatisch** Open Source mit Nutzungserlaubnis; LICENSE noch auswählen.
- Keine geschützten Teamsponsoren-Logos oder fremde Datenbanken ohne Rechte verwenden.
- Erst fiktive Fahrer und Teams; reale Datenquellen und Lizenzfragen später prüfen.

## Wichtige Links

- GitHub-Repository: https://github.com/Lancester/radsportmanager
- GitHub Actions: https://docs.github.com/actions
- GitHub-Repositories: https://docs.github.com/repositories
