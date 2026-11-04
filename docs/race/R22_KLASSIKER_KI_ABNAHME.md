# R-22 Klassiker-KI: Abnahme des isolierten Entwicklungsbausteins

**Datum:** 04.11.2026  
**Pull Request:** [#76](https://github.com/Lancester/radsportmanager/pull/76) auf dem noch offenen [PR #74](https://github.com/Lancester/radsportmanager/pull/74), **nicht** auf main gemergt.  
**Verifizierter Codehead:** `18fe59f528e66f4be4ec2a63742aa91ad6f94d94`  
**Verifizierter CI-Lauf:** [#41875836222](https://github.com/Lancester/radsportmanager/actions/runs/41875836222) – **324 von 324 Tests grün, 0 Fehler**. Der zusätzliche Gruppen-Zwischenstands-Audit ist Teil dieses erfolgreichen Laufs.

## Ziel und tatsächliche Implementierung

Im experimentellen `stable-pack`-Modus darf der vor Rennstart nach realen Drei-Minuten-Leistungswerten nominierte Klassikerspezialist eines Teams vor den späten Steilrampen mit eigenen, im 1D-Rennraum gefahrenen Watt nach vorn aufrücken. Er kann an einer steilen Rampe in vorderer tatsächlicher Position gegenüber seiner physischen Gruppe über längere Zeit ein begrenztes CP-/W′-gedeckeltes Tempo anfordern, auch ohne automatisch eine Maximalattacke auszulösen. Zusätzlich bleiben die bestehenden gezielten, begrenzt weiterlaufenden W′-Attacken möglich; mehr als ein aktuell geeigneter nominierter Rampenangreifer je Gruppe wird nicht gleichzeitig neu ausgelöst.

Umgesetzt in `src/engine/race/classics-racecraft.ts`, `src/engine/race/classics-punch.ts` (bestehende Attacken) und `src/engine/race/race-simulator.ts`. Neue Regeln gelten **nur** bei langen, steilrampenreichen Klassikern; sie greifen nicht bei Lille, Boulogne oder Hautacam und nicht im Standard- bzw. Legacy-Modus. Die Regeln geben lediglich Wattanforderungen ab. CP/W′, R-19, Aerodynamik, physischer Windschatten, Bewegungsintegrator und Zielzeitlogik wurden nicht verändert. **Weder ein Fahrertyp noch ein Rang oder Sieg wird im Code erzwungen.**

## Ergebnis: vier reproduzierbare Rennen, je 154 Fahrer, Seed 2026

| Kennzahl | Vor der Klassiker-KI auf PR #74 | Letzter geprüfter Klassiker-Code |
| --- | ---: | ---: |
| Lille: Sprinter in Top10 | 8 | **8 (unverändert)** |
| Boulogne: Sieger | F036, Klassiker | **F036 (unverändert)** |
| Liège: Sieger | F114, Sprinter | **F057, Klassiker** |
| Liège: Sprinter in Top10 | 6 | **0** |
| Liège: Top10-Fahrertypen | 6 Sprinter, 3 Klassiker, 1 Allrounder | **7 Klassiker, 2 Zeitfahrer, 1 Allrounder** |
| Liège: stärkster Klassikerspezialist F003 | 122. | **2. (+0,73 s)** |
| Liège: drittstärkster F049 | 107. | **3. (+0,78 s)** |
| Liège: Siegerzeitgruppe | 24 | **3** |
| Liège: Median-Zielrückstand | 265,01 s | **667,12 s** |
| Hautacam: Sieger | F078, Kletterer | **F078 (unverändert)** |

Liège hatte im abgeschlossenen Lauf **5.878 Fahrer-Sekunden zusätzliche angeforderte Positionierungs-Watt** und **487 Fahrer-Sekunden angefordertes Rampentempo** (F003/F049). Das ist ein Audit des angeforderten Mehrantriebs; die physikalisch tatsächlich ausgeführte Leistung wird unverändert durch W′-/R-19- und Bewegungsmodell begrenzt. Die bestehenden Tests prüfen Energiebilanzen und Zielklassifikationen.

### Schlüsselstellen und Selektion

| km | Fahrer der ersten physischen Gruppe | Abstand des Rang-77-Fahrers zum Führenden |
| ---: | ---: | ---: |
| 190 | 53 | ca. 1.002 m |
| 205 | 48 | ca. 1.734 m |
| 215 | 48 | ca. 3.854 m |
| 220 | 40 | ca. 3.327 m |
| 230 | 1 | ca. 3.729 m |
| 240 | 4 | ca. 4.372 m |
| 245 | 22 | ca. 6.336 m |

**Wichtig:** Der hintere Feldteil liegt also teils **schon vor der Côte de la Redoute** weit zurück. Daraus kann man den größeren Medianrückstand nicht allein dem zusätzlichen Rampentempo zuschreiben. Dieser Befund ist für die spätere Gesamtuntersuchung von allgemeiner Gruppendynamik, Angriffen und Verfolgung zu behalten. Er ist kein Beleg, dass ein Median von +11:07 historisch exakt passt.

## Verworfen: übermäßig pauschale Varianten

Die Gegenversuche auf derselben PR wurden ausdrücklich **nicht** übernommen:

1. Die rein additive Aufrückanforderung von höchstens +40 W über bereits ermittelte Gruppenwatt führte bei breitem 40–87%-Fenster zu **24.867 statt 5.878** zusätzlichen Fahrer-Sekunden und sehr einseitiger Top10-Komposition. Der Zeitpunkt der Aufrückarbeit war nicht überzeugend.
2. Eine vollständig fahrertypoffene Team-Nominierung aus dem jeweils höchsten 3-Minuten-W/kg-Wert verbesserte die Typenmischung, ließ aber F003 wieder **Platz 119–124** erreichen und sorgte teils für früh weit abgesetzte Solisten. Auch eine kleine Präferenz für beinahe gleich starke Klassiker korrigierte die unausgewogene Positionierung nicht.

Die **bereits bewährte, technisch grüne Kernregel** wurde deshalb mit unveränderten Sportresultaten wiederhergestellt, während die zusätzlichen Gruppen-Telemetrie- und Regressionstests beibehalten wurden. Keine Nachjustierung auf einen Wunsch-Sieger und keine Veränderung am Physikmotor.

## Gate und Folgeschritte

**Abgeschlossen:** isolierte Klassiker-Renn-KI, dokumentierte taktische Wattentscheidungen, reproduzierbare Regression und Profilisolation.  
**Weiter offen, bewusst separat:** quantitative Mehrseed-Kalibrierung, stark auseinandergezogenes Gesamtfeld und präzise Häufigkeiten unterschiedlicher Sieger-/Gruppenverläufe; außerdem R-22 Flachfeld-Massensprintindikator, Boulogne-Attackenzahl und Verfolgerkoordinierung. Die Gesamtsimulation ist damit **nicht** endgültig realismusvalidiert.

PR #76 ist auf PR #74 gestapelt und bleibt von `main` getrennt. Die Managerwahl in PR #75 wird nicht verändert.

## Nachtrag – Integration in den Hauptbranch (04.11.2026)

**Verbindlicher Integrationsstand 04.11.2026:** PR [#74](https://github.com/Lancester/radsportmanager/pull/74) (Sprintteamjagd, realer Helfereinsatz, individueller Zielsprint, bessere Feldkohäsion) **und** PR [#76](https://github.com/Lancester/radsportmanager/pull/76) (Klassiker-KI) sind nacheinander **nach `main` gemergt**. Code-Merge-Commits `568f2341` und `8b478639`. Die *kombinierte* CI [#41890188739](https://github.com/Lancester/radsportmanager/actions/runs/41890188739) war mit **324/324 Tests erfolgreich, 0 Fehler**, inklusive vier 154-Fahrer-Referenzrennen, No-Attack-/30er-, Physik- und Integrationschecks.

**Sportlicher Stand:** Lille, Seed 2026, 5 km vor Ziel **115 Fahrer** in der führenden physischen Gruppe statt zuvor 25; 8 Sprinter Top10, 26 Fahrer in 1-s-verknüpfter Siegerzeitgruppe, 2 Fluchten eingeholt, 1.425 s CP-nahe reale Feldjagd, 22 individuelle Sprintantritte. **Der konservative 30er-Massenprint-Proxy ist weiterhin false**, und aus einem Seed keine Massensprint-Häufigkeit ableiten. Liège: Klassiker F057 Sieger, **0 Sprinter in Top10**, gezielte Rampentempo-/Positionierungsarbeit; mögliche größere Zeitabstände später statistisch kalibrieren. Boulogne und Hautacam gegenüber ihrer Referenz unverändert. **Keine Änderungen** an `legacy`-Default, CP/W′, R-19, Motion-Core oder Aero. **PR #75 (Managerwahl 0–5 Jagdhelfer) bleibt offen und ungemergt.** Nächstes getrenntes KI-Thema: hügelige Etappen (Boulogne 108 Attacken im Seed 2026), danach PR #75 und Multi-Seed-Kalibrierung.

**Wichtig bei älteren Notizen:** Frühere, weiter unten stehende Aussagen wie „PR #74/#76 noch offen“ beschreiben ihren historischen damaligen Zustand und sind **seit dieser Integration überholt**. Die KI wurde technisch integriert, **nicht** als wissenschaftlich/mehrseed-statistisch vollständig kalibriert deklariert.
