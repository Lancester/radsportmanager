# R-24: Feldkohäsion – erster ausgeführter A/B-Test (06.11.2026)

## Reproduzierbarer Test

- **Basis:** `develop/manager-mvp`, Audit-Engine seit Commit `1945e2d` unverändert.
- **Variante:** `experiment/r24-feldkohaesion-referenz-20261106`, Draft-PR [#82](https://github.com/Lancester/radsportmanager/pull/82). Bedingter Schutz der Beschleunigungsreferenz in `local-group-reference.ts`; keine Physik-/CP-/Aero-Änderung.
- **GitHub Actions:** [Lauf 42222177699](https://github.com/Lancester/radsportmanager/actions/runs/42222177699), **erfolgreich**. Test-Commit `ab290f97606007dc2cec7febaad13d389d58de76`.
- **Gezielte Unit-Tests:** 7/7 erfolgreich (neue 3 und vorhandene 4).
- **Simulationspaare:** 4 Kontrollstrecken × 2 Versionen = 8 berechnete 30-km-Simulationen; Seed 2026; gemeinsames künstliches Hautacam-Feld, 154 Fahrer, `stable-pack`, Attacken deaktiviert, Ausdauer deaktiviert, Teams `ausgewogen`. Daten als 7-Tage-Actions-Artefakt `r24-feldkohaesion-ab` und im Joblog. Runner: `scripts/r24-cohesion-ab.mjs` auf dem Versuchsbranch.

## Direkt beobachtetes Ergebnis

| Strecke | km 20 Basis/Variante größte Gruppe | km 25 Basis/Variante größte Gruppe | Gruppenspanne km 25 Basis/Variante |
| --- | --- | --- | --- |
| Ebene | 154 / 154 | 154 / 154 | 18,97 / 18,97 m |
| Anstieg→Ebene | 154 / 154 | 154 / 154 | 24,02 / 24,02 m |
| Anstieg→Abfahrt | 145 / 145 | 125 / 125 | 545,45 / 545,45 m |
| Anstieg→2 km Ebene→Abfahrt | 153 / 153 | 104 / 104 | 643,87 / 643,87 m |

- Alle 8 Durchläufe haben 154 klassierte Fahrer und 0 registrierte Attacken.
- Auf allen vier Strecken sind in der ausgegebenen Vergleichszusammenfassung der Sieger, der Medianrückstand, die Gruppen und Gruppenspannen an allen Messpunkten identisch. Daraus folgt **nicht**, dass jeder intern berechnete Zustand bytegleich oder die neue Bedingung niemals aktiviert wurde; diese Instrumentierung fehlt.
- Der Audit-Ausgangspunkt im aktuellen Branch unterscheidet sich von den älteren dokumentierten Kontrollläufen (z.B. dort Anstieg→Abfahrt bei km 20 127 statt jetzt 145 Fahrer). **Ältere Zahlen nicht ohne Commitkontrolle direkt als aktuelle Baseline ausgeben.**
- Eine breite Vollrenn-Serie mit Attacken wurde **nicht** gestartet, weil der vorab festgelegte kurzfristige Erfolgsnachweis auf den Kontrollstrecken ausblieb.

## Entscheidung

**Versuchsregel nicht übernehmen, PR #82 vorläufig als nicht ausreichend wirksam kennzeichnen und ungemergt behalten.** Die Unit-Tests prüfen die Bedingung isoliert, nicht den Nutzen im realen Rennmodell. Der ursprüngliche Feldzerfall ohne Attacken bleibt bestehen.

## Sinnvoller nächster, begrenzter Untersuchungsschritt

Falls vor dem Manager-Prototyp noch eine Korrekturrunde gerechtfertigt ist: **nur den ersten tatsächlich entstehenden 42-m-Gruppenriss** eines kontrollierten Anstieg→Abfahrt-Laufs instrumentieren. In beiden unmittelbar betroffenen Rädern pro Sekunde unterscheiden: Referenzregel/Zweig, angeforderte vs. angewandte Watt, CP/W′, lokale Steigung, reale Vorderradgeschwindigkeit/-beschleunigung, Gruppenreferenz und Luftwiderstand. Eine neue Heuristik erst nach beobachteter Ursache; sonst Feldzerfall als bekannte offene Einschränkung dokumentieren und zur spielbaren Schleife wechseln.

**Keine Produktengine-Änderung und kein Merge dieser Variante.**
