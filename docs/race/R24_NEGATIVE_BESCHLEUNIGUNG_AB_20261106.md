# R-24: A/B-Test lokale negative Beschleunigung – Ergebnisse 06.11.2026

## Technischer Versuch
- Branch `experiment/r24-negative-accel-fix-20261106`, [Draft-PR #84](https://github.com/Lancester/radsportmanager/pull/84); **nicht gemergt**. Basis `develop/manager-mvp`, Audit-Engine.
- Einzige Engineänderung `src/engine/race/local-group-reference.ts`: Bisheriger Schutz vor stark negativer Gruppenfrontbeschleunigung greift jetzt auch bei **lokal schwächer negativer** Vorderradbeschleunigung, sofern der Vordermann schneller als der Fahrer fährt. Keine direkte Änderung an Position, Tempo, CP/W′, Aero.
- Runner `scripts/r24-negative-accel-ab.mjs` mit getrennten Checkouts; [GitHub Actions #42224822838](https://github.com/Lancester/radsportmanager/actions/runs/42224822838), beide Jobs **success**. Achtung: `success` belegt die technische Ausführung, nicht die sportliche Plausibilität.
- Gezielte bestehende und neue Referenz-Unit-Tests im CI bestanden. Gepaarte Kontrollrennen: 4 Profile × 3 Seeds × 2 Engines = **24 Simulationsläufe**. Gepaarte vollständige Rennen: 3 Referenzstrecken × 1 Seed × 2 Engines = **6 Simulationsläufe**. Insgesamt 30 Rennläufe. Alle Szenarien 154 Fahrer pro Lauf. Kontrollrennen ohne Attacken und Langzeitermüdung, alle Teams ausgewogen. Vollrennen mit regulären Teamstrategien, Attacken und Ermüdung, jeweils streckenspezifisches Referenzfeld. Die beiden A/B-Seiten verwenden in ihrem jeweiligen Paar exakt dieselben Eingaben.
- Logs und 7-Tage-Artefakte der Actions-Jobs sind die Rohdatenbelege.

## Kontrollierte Anstieg-Abfahrt (größte zusammenhängende Gruppe bei km 25; Gesamtfeld 154)

| Seed | Audit | Versuch |
|---|---:|---:|
| 2026 | 125 | 154 |
| 42 | 145 | 154 |
| 123 | 130 | 154 |

- Längerer Übergang (Anstieg→2 km Ebene→Abfahrt) bei km 25: Audit 104, 146, 153; Versuch jeweils **154**.
- Nur Ebene: in allen drei Seeds gleiche ausgegebene Ergebnisse und 154er Gruppe.
- Anstieg→Ebene: weiterhin 154er Gruppen, aber teils veränderte Klassifikation/Medianwerte. **Nicht alle Rennen vollständig identisch.**
- Die Kontrollverbesserung ist deutlich und über drei Seeds konsistent. Sie beweist keine realistische Pelotondynamik, da die 1D-Abstandsgruppe mit 154 Fahrern auf wenigen Metern unphysikalisch komprimiert sein kann.

## Vollständige Rennen (Seed 2026, echte Rennen nur streckencharakteristisch nachgebildet)

| Kennzahl | Audit | Versuch |
|---|---:|---:|
| Lille Sieger | F009 | F023 |
| Lille Medianrückstand | 20,98 s | 24,12 s |
| Lille innerhalb 60 s | 132 | 140 |
| Lille Attacken / Fluchtgruppen | 26 / 6 | 24 / 3 |
| Boulogne Sieger | F078 | F134 |
| Boulogne Medianrückstand | 123,54 s | 101,87 s |
| Boulogne innerhalb 60 s | 37 | **7** |
| Boulogne Attacken / Fluchtgruppen | 53 / 5 | 55 / 7 |
| Hautacam Sieger | F078 | F015 |
| Hautacam Medianrückstand | 705,85 s | **908,23 s** |
| Hautacam innerhalb 60 s | 1 | 3 |
| Hautacam Attacken / Fluchtgruppen | 55 / 20 | 59 / 19 |

Besondere Auffälligkeit: Boulogne bei Führungs-km 205 größte Abstandsgruppe 42 (Audit) versus 133 (Versuch), zugleich nur 7 statt 37 Fahrer innerhalb 60 s im Ziel; die Gruppengröße an einem Streckenpunkt und Ziel-Zeitgruppen sind **unterschiedliche Größen**. Hautacam bei Führungs-km 30 größte Abstandsgruppe 53 vs 139; bei km 180 26 vs 39, Medianrückstand aber höher. Die Rennen verändern sich wesentlich und nicht konsistent in eine eindeutige sportliche Richtung.

## Schlussfolgerung und Entscheidung

**Die anfängliche Gruppenfragmentierung in den kontrollierten Anstieg-Abfahrt-Szenarien wurde mit der lokalen Änderung unter den drei geprüften Seeds beseitigt.** Gleichzeitig verändern sich die Vollrennen einschließlich Rangliste, Fluchten und Verteilung der Zielabstände teils stark; insbesondere Boulogne verliert in der Variante innerhalb-60-s-Finisher, Hautacam gewinnt größere Medianrückstände. Die ursächliche Wirkung auf jedes einzelne Vollrenn-Ereignis wurde noch nicht isoliert. Kein pauschaler Nachweis realistischeren Rennverlaufs.

**Daher PR #84 derzeit NICHT mergen.** `main` und `develop/manager-mvp` bleiben in der Rennengine unverändert. Die neuen Messdaten stützen, dass die Beschleunigungsreferenz ein relevanter Hebel ist, aber der gegenwärtige Fix ist **nicht sportlich abgenommen**. Vor weiteren Einzelheuristiken bewusst entscheiden, ob noch eine kalibrierte Eingrenzung nötig ist oder mit bekannter Feldkohäsionsschwäche die erste spielbare Managerschleife priorisiert wird. Keine Siegerkalibrierung, kein Parametertuning pro Strecke.
