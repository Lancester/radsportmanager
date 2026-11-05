# R-24: Experiment Angriffsmotivation

Stand 05.11.2026. Experiment auf separatem Branch, aus feature/r24-rennki-audit; keine Änderung an main oder am Audit-Branch. Motivation auf ausdrücklichen Wunsch: Frühe Flucht gründen, zu einer vorausfahrenden Gruppe aufschließen, oder im entscheidenden Rennabschnitt um den Sieg angreifen. Keine feste Maximalzahl an Angriffen.

## Umsetzung und Grenzen

- Neue Entscheidungsfunktion wählt anhand sichtbarer Rennlage ein Ziel; neue Angriffe im stable-pack-Modus erhalten das Ziel im Ereignistext. Eine bestehende Attacke kann innerhalb der alten Logik weiterlaufen.
- Geschützte Bergfavoriten werden für Etappen mit langem spätem Anstieg anhand relativer nomineller CP pro Gesamtmasse unter Kapitänen gewählt (mindestens 97 % des stärksten). Sehr frühe Flucht-/Anschlussangriffe dieser Fahrer werden begrenzt. Dieser Leistungsproxy ist eine vorläufige Annahme und keine Gesamtwertung oder fertige sportliche Favoritenerkennung.
- Fluchtgründung berücksichtigt Hauptgruppe, bereits etablierte Flucht und vorausfahrende Teamkollegen. Anschluss erfordert eine messbare vordere Gruppe und zunächst eine Distanz von 30–500 m. Ein Siegangriff ist vorläufig bei ≤60 km Rest oder selektivem Anstieg in zweiter Hälfte bei ≤90 km Rest und innerhalb von 2 km zur aktiven Spitze möglich. Diese Grenzwerte sind Heuristiken, keine validierten Wahrscheinlichkeiten und keine garantierte Gewinnchance.
- Neue Angriffe werden nach Zielankunft des Siegers nicht mehr aus dem reinen Ziel „Sieg“ oder wegen wandernder aktiver Spitze ausgelöst; weitere Rennziele nach Siegerankunft sind hier noch nicht modelliert.
- Die Motivation wird nur für neu begonnene stable-pack-Angriffe in dieser Fassung geprüft. Sie ersetzt weder Teamstrategie noch kontinuierliche Bewertung der Erfolgschance während eines Angriffs. Es fehlt u. a. eine explizite Rennsituation mit echter Gesamtwertung, vorab festgelegtem Etappenziel, Bergpunkten, Mannschaftsauftrag und dynamischer Interessenlage. Ein protokollierter Motivname belegt nicht automatisch sportliche Sinnhaftigkeit.
- Bestehende Phasen- und Angriffswahrscheinlichkeiten, Leistungsphysik, W′ sowie separate Verfolgungslogik bleiben erhalten. Keine Sieger-, Gruppen- oder Zeitvorgabe.

## Paarkontrollen

Gleicher gemeinsamer und vollständiger Fahrer-Eingabehash pro Paar. Referenz ist Entwicklungsstand 1945e2d6b71289f90cca5dc8c793090a4af93341, nicht main. Je ein Seed pro Nicht-Bergprofil, zwei Hautacam-Seeds. Unterschiedliche Rennverläufe und Zufallspfade trotz gleichen Seeds möglich.

| Profil / Feld / Seed | Attacken bisher → Experiment | Sieger bisher → Experiment | größte 1-s-Zielgruppe bisher → Experiment |
|---|---:|---|---:|
| Hautacam / Bergfeld / 42 | 49 → 44 | F036 → F134 | 5 → 5 |
| Hautacam / Bergfeld / 777 | 53 → 37 | F134 → F134 | 14 → 10 |
| Lille / gemeinsam / 42 | 19 → 13 | F009 → F114 | 98 → 104 |
| Boulogne / Profilfeld / 42 | 46 → 32 | F015 → F015 | 20 → 18 |
| Lüttich / Profilfeld / 42 | 62 → 44 | F134 → F092 | 31 → 20 |

Im Bergfeld startete F134 in beiden Ausgangsläufen früh (<50 km) je eine Attacke, im Experiment keine. Die gesamte Angriffszahl sank nicht einheitlich stark; 44 und 37 sind keine Sollwerte. Für alle 170 experimentellen Attackenereignisse in den fünf Rennen war einer der drei Motivnamen im Ereignistext vorhanden; das beweist noch keine korrekte taktische Begründung.

F078: Seed 42 Rang 73 → 28, Seed 777 Rang 21 → 66; F134 gewinnt beide Experimente. Dies ist ein wichtiges Warnsignal: Nicht allein nach Zahl oder gewünschtem Sieger beurteilen. Boulogne Profilfavorit F135 Rang 43 → 130 (dieser Proxy ist bereits ohne Nachweis als Wettfavorit bewertet). Andere Profile und weitere Seeds müssen betrachtet werden.

Gesicherte [Vergleichskennzahlen](r24-grossvergleich-daten/angriffsmotivation-vergleich.json) und [Auszüge der fünf experimentellen Rennen](r24-grossvergleich-daten/angriffsmotivation-rennauszuege.json): Zielklassifikationen, Angriffereignisse, Angriffsspuren und Zielgruppen, nicht alle Rohtelemetrie. Vergleichsdaten siehe vorhandene Archive. Diagnosewerkzeug scripts/r24-grossvergleich.mjs aus 8923aa7e51edfd640843bfc0b4811f8988b61929 verwenden.

## Prüfung

Gezielte Motivationstests: 3/3; adaptive Attackentests: 4/4 erfolgreich. Die vollständige Testsuite läuft bei Erstellen dieses Zwischenstands noch; Ergebnis gesondert nachtragen. Keine Sportfreigabe.

## Fortsetzung

Vor weiterer Änderung die Fehlplatzierungen und Gruppenverläufe untersuchen, tatsächliche gruppenbezogene Motivation und Teamaufträge genauer erfassen und mehr gepaarte Seeds auf allen vier Profilen testen. Das offene Gesamtziel des ursprünglichen R-24-Großvergleichs bleibt bestehen.
