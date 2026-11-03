# R-12 – Formationswindschatten als schaltbarer Vergleich, nicht als freigegebene Rennphysik

**Stand: 03.11.2026. Status: technischer Prototyp, tatsächliche Renn-/CI-Abnahme siehe Nachtrag unten.**

## Ziel und Ausgangsbefund

[R-11](R11_MEHRSEED_BALANCING.md) zeigte maximal 20–24 getrennte
42-m-*Abstandsgruppen* bei 30 Fahrern auf dem Hügelkurs. In der
bisherigen 30-Fahrer-Engine wird Windschutz nur aus dem Abstand zum
**unmittelbaren** Vordermann bestimmt, höchstens 19 % weniger
**Luftwiderstand** bei sehr kleinen Abständen. Kleine Fluchtgruppe und
hinterer Teil eines dichten Feldes werden daher praktisch identisch
behandelt. Das ist eine strukturelle Modelllücke, noch kein Beweis
für die Ursache der beobachteten Gruppenfragmentierung.

## Eingeführte Testvariante (noch nicht kalibriert)

`src/engine/race/formation-aero.ts` nutzt in einer eindimensionalen,
nach Fahrstrecke geordneten Liste statt nur eines Vordermanns **bis zu
zehn davor fahrende Nachbarn** mit Distanzgewichtung innerhalb von
**24 m**. Der erste enge Nachbar bringt eine vorläufige
Luftwiderstandsminderung um bis zu **34 %**, weitere davor
fahrende Nachbarn erhöhen den Schutz mit je höchstens **5,5
Prozentpunkten gewichtetem Nachbarbeitrag**. Der **Restluftwiderstand**
wird bei `aeroFactor >= 0.40` gedeckelt: höchstens **60 %
Reduktion des aerodynamischen Widerstands**, NICHT der gesamten
Pedalleistung. Alle Werte sind **technische Testheuristik**, keine
empirisch belegten 30-Fahrer-CFD-Parameter.

Der Fahrer ganz vorn hat in der Testvariante zunächst Faktor 1
(kein rückwärtiger Druck-/Windschatteneffekt). Fahrer tiefer innerhalb
einer dichten *Längsformation* erhalten stärkeren Schutz als ein
Hintermann einer 2er-Gruppe. **Aber:** Das Modell hat weiterhin keine
seitlichen Positionen; eine 30er-Reihe und ein breites 30er-Peloton
können mit gleichen Längskoordinaten nicht sauber unterschieden
werden. Auch die aktive Positionierungs-/Spurwechsel-KI von R-03–R-08
wird nicht in diesen Vollrennmodus übertragen.

### Strenge physikalische Trennung

- `RaceInput.aeroModel` ist optional. **Standard ohne Angabe ist
  exakt die alte R-10-Berechnung.** `'legacy'` wählt sie explizit;
  nur `'formation-experiment'` schaltet die Variante ein.
- Für die Testvariante wird der kleinste Faktor aus bisherigem
  R-10-Windschatten und lokalem R-12-Faktor verwendet. Damit verliert
  kein Fahrer den bisherigen Schutz als zufällige Folge des Tests.
- Der Faktor wirkt **nur im Luftwiderstand des unveränderten
  `advanceMotionStep`**. Die aus `race-tactics.ts` und `peloton.ts`
  angeforderten Watt bleiben gleich geregelt und werden unverändert
  durch `applyCpWprimeStep` begrenzt.
- **Keine** Setzung gleicher Geschwindigkeit, künstliches
  Zusammenschieben, Zeitgutschriften, Energieerzeugung oder
  neuer Sicherheits-/Lenk-/Reifen-Mechanismus.
- Zusätzliche Diagnosen `meanAeroFactor` und
  `minimumAeroFactor` erlauben nachprüfbare Vergleiche.

### Was die Fachliteratur belegt (nicht unsere Parameter)

Blocken et al. (2018), *Aerodynamic drag in cycling pelotons:
New insights by CFD simulation and wind tunnel testing*,
*Journal of Wind Engineering and Industrial Aerodynamics* 179,
DOI [10.1016/j.jweia.2018.06.011](https://doi.org/10.1016/j.jweia.2018.06.011):
Frühere Studien kleiner, hintereinander fahrender Gruppen zeigen
rund **50–70 % verbleibenden Luftwiderstand** eines Alleinfahrers;
in der Windkanal-/CFD-Studie mit dicht gepackten **121er-Pelotons**
wurden im hinteren Zentrum sogar **5–10 % verbleibender
Luftwiderstand** beobachtet. Die 121er-Extremwerte gelten nicht
automatisch für unser fiktives 30er-Feld und die stark vereinfachte
eindimensionale Auflösung. Sie belegen qualitativ, warum ein
positions-/größenabhängiger Effekt sinnvoll ist.

## Prüfplan und Grenzen

1. Isolierte Regressionen: Solofahrer, Zweier-, Dreiergruppe, enges
   30er-Feld, 24-m-Nachbarschaft statt 42-m-Gruppendiagnose,
   Eingabeumkehr, ungültige Werte, Legacy bitgenau unverändert.
2. Ein ganzes 50-km-A/B-Rennen auf vollständige Klassifikation,
   deterministische Physik- und CP/W′-Bilanz prüfen.
3. `scripts/r12-aero-comparison.mjs` läuft **manuell** über
   exakt dieselben sieben R-11-Eingaben mit jeweils beiden Modellen:
   **14 vollständige 50-km-Rennen, 420 Ergebniszeilen**,
   inklusive des einmaligen F03-Profils mit −12 % CP/FTP/W′.
4. Erst danach **mit ergebnisoffenem Vergleich** die beobachtete
   Gruppenfragmentierung, Einzelgruppen, Sieger/Zielabstände,
   Kurbelwatt, finale W′-Reserve, Angriffe, Fluchten und
   Einholungen beurteilen. Eine verminderte Gruppenanzahl allein
   darf niemals ein automatisches Abnahmekriterium sein.
5. Bei nachvollziehbarer Verbesserung eine fachliche Diskussion
   über Gruppendichte, seitliche Repräsentation und realistische
   Parameter führen. Danach erst Führung/Teamarbeit und
   Verfolgungs-KI getrennt anpassen.

**Beschlüsse:** D-074 bis D-077 bleiben unberührt. Die Werte
und ein mögliches Ersetzen des Legacy-Modells sind **nicht**
als beschlossen markiert. Issue #42 bleibt offen.


## Tatsächlicher A/B-Lauf und Ergebnis (03.11.2026)

Die **sieben Paare, insgesamt 14 vollständige 50-km-Rennen mit je 30
Fahrern (420 Zielankünfte)**, sind im echten [GitHub-Actions-Lauf
#41730692771](https://github.com/Lancester/radsportmanager/actions/runs/41730692771)
**erfolgreich** durchgerechnet worden. Der Lauf prüft ausdrücklich
sieben `R12-VERGLEICH`-Datensätze und eine `R12-GESAMT`-Auswertung.
Alle sieben R-11-Legacy-Maxima wurden im Script gegen die
früher gemessenen 20/22/12/24/20/12/23 überprüft. Ergebnis: keine
ungewollte Änderung des bisherigen Rennmodells.

| Fiktives 30-Fahrer-/50-km-Rennen | Maximalgruppen alt → Variante | Median-Gruppen* alt → Variante | letzter Zielrückstand alt → Variante | Kurbelwatt im Feld alt → Variante |
| --- | ---: | ---: | ---: | ---: |
| Hügelig geschützt 2026 | **20 → 21** | 14 → 9 | 581,4 → 619,7 s | 270,0 → 264,9 W |
| Hügelig offensiv 2026 | **22 → 20** | 12 → 10 | 504,6 → 721,7 s | 270,7 → 263,2 W |
| Flach Sprint 2026 | **12 → 3** | 10 → 3 | 420,9 → 689,5 s | 269,6 → 247,1 W |
| Hügelig geschützt 2027 | **24 → 20** | 13 → 12 | 544,9 → 605,0 s | 269,7 → 265,3 W |
| Hügelig offensiv 2027 | **20 → 22** | 11 → 11 | 517,4 → 718,2 s | 269,5 → 263,5 W |
| Flach Sprint 2027 | **12 → 4** | 9 → 3 | 334,1 → 937,5 s | 269,6 → 245,9 W |
| Hügelig, F03 geschwächt, 2026 | **23 → 23** | 13 → 13 | 634,6 → 691,0 s | 269,2 → 264,2 W |

*Median-Gruppen stammen aus den 5-km-Snapshots, nicht aus allen
Sekunden. 42-m-Abstandsgruppen sind keine nachgewiesenen
physikalischen 2D-Formationen.*

**Erreichte Verbesserung:** Auf der flachen Strecke geht das
beobachtete Gruppenmaximum stark zurück (12 → 3 bzw. 4) und die
gemessene Median-Zeitlücke zwischen allen Zielankünften (nicht
die Gruppentrennzahl) sinkt von **152,9 auf 0,8 s** (2026) bzw.
von **162,6 auf 1,5 s** (2027). Der Test bewirkt also
eindeutig einen **stärkeren gemeinsamen Verlauf eines großen Teils
des Feldes**. Die mittlere Kurbelwatt sinkt auf den flachen
Rennen um 22,5–23,7 W, und die mittlere verbleibende W′-Reserve
steigt deutlich: **10.075 → 17.649 J** bzw.
**9.766 → 17.560 J**. Der mittlere Aero-Faktor sinkt
dort von ca. **0,890 auf 0,502 bzw. 0,495**.

**Deutliche Probleme:** In **allen sieben** Vergleichen wird der
Rückstand des **letzten** Fahrers größer, teilweise dramatisch
(Flach 2027: **334,1 → 937,5 s**). Auch das Gruppenmaximum
ist nicht durchgängig besser: Hügelig geschützt 2026 20 → 21,
hügelig offensiv 2027 20 → 22. Der beobachtete
Alleinfahreranteil steigt in einem Hügelszenario von 12,2 auf
17,4 Prozent. Einzelne Sieger ändern sich durch veränderte
physikalische Energie-/Abstandsdynamik (z. B. Flach 2026
F25 → F14). Im Hügelrennen 2027 geschützt steigen
Verfolgungsstarts von 31 auf 42. **Die Variante kann große
Felder zusammenhalten und zugleich abgehängte Fahrer
unplausibel benachteiligen.** Es wäre fachlich falsch,
sie allein wegen geringerer Gruppenmaxima freizugeben.

### Interpretation und fachlicher nächster Schritt

- Der ursprüngliche **fehlende Formationsschutz ist als wirksamer
  Hebel bestätigt**: Verändert man ausschließlich den
  aerodynamischen Widerstandsfaktor, verändern sich reale
  Kurbelwatt-/W′-Bilanzen, Zielabstände und Gruppenformationen.
- **Noch keine Validierung des vorgeschlagenen Modells**:
  Der 24-m-/10-Nachbarn-Korridor und 40-%-Restwiderstandsdeckel
  sind willkürlich gewählte, offen deklarierte Testparameter;
  sie sind nicht an realen 30-Fahrer-Feldern kalibriert.
- Das **1D-Längskoordinatenproblem** bleibt: ein dichtes
  Peloton mit mehreren nebeneinander fahrenden Fahrern und eine
  sehr lange Einerreihe lassen sich nicht korrekt trennen.
  Der Start mit identischen Streckenpositionen vereinfacht
  diese Unterscheidung zusätzlich. Es gibt noch keine realen
  Führungswechsel und keine teamübergreifende Tempokontrolle.
- Die **Watt-Abstandsregelung ist weiterhin die alte R-10-Logik**,
  die bei erhöhtem Windschutz nur begrenzt nachregeln kann.
  Ein starker Schutz und eine nicht darauf abgestimmte
  autonome Verfolgung können sowohl Feldzusammenhalt als auch
  massive Verluste Abgehängter erzeugen.
- **Bewusst KEINE stille Freigabe für den Standardmodus**:
  `RaceInput.aeroModel` bleibt ohne Angabe bei
  `legacy`. Den Experiment-Modus weiterhin nur als
  Vergleichs-/Forschungsbaustein nutzen.
- **Nächste priorisierte Einzelaufgabe:** lokale
  Gruppendichte und Rollen/Führungsarbeit genauer
  repräsentieren, ohne 2D-Kollisions-Mikrophysik; die
  Modellgrenzen für Ausreißer, Peloton und einzeln
  Abgehängte gesondert prüfen. Danach Leistungspuffer
  und Gruppenanschluss-Logik mit der Aerodynamik
  **abgestimmt** testen. Dabei dieselben sieben R-11-Fälle
  plus isolierte 2er-/3er-Fälle als Kontrollbedingungen
  beibehalten; Werte nicht allein auf die Zahl der
  Gruppen optimieren.

**Teststatus:** Nach dem ersten A/B-Diagnoselauf:
[PR-Regression #41730702259](https://github.com/Lancester/radsportmanager/actions/runs/41730702259)
**209/209 Tests**, einschließlich sieben neuer R-12-Tests.
Der gesonderte [TypeScript-/Browser-Build #41730888302](https://github.com/Lancester/radsportmanager/actions/runs/41730888302)
war **erfolgreich**: TypeScript-Kompilierung und vollständiger
30-Fahrer-ESM-Lauf mit aktivierter Aero-Variante. Der temporäre
Workflow ist danach entfernt worden. GitHub-Runner-Laufzeiten
sind weiterhin **keine Android-Laufzeiten**.


## Nachfolgende verbindliche Nutzerentscheidung: R-13 (03.11.2026)

Die vorstehenden Abschnitte dokumentieren ausdrücklich die **historische
R-12-Test- und Bewertungsphase**. Der Nutzer hat anschließend die größere
Zielzeitspreizung zwischen einem stark geschützten Peloton und abgehängten
Einzelfahrern als **plausibel** bewertet und ausdrücklich beschlossen,
die mehrfahrerabhängige Aerodynamik **direkt als Rennstandard** zu
übernehmen, statt eine vollständige wissenschaftliche Kalibrierung
abzuwarten. Die historische Warnung vor automatisch als
Fehler bewerteten großen Rückständen ist dadurch fachlich eingeordnet.

`legacy` bleibt als explizite Vergleichsoption. Die neue Spielentscheidung
und die Gleichauf-/Abgehängtenkorrekturen sind in
[R-13: Formationswindschatten als Standard](R13_FORMATIONSWINDSCHATTEN_STANDARD.md)
dokumentiert. **Keine 1D-Physikheuristik als vollständig empirisch
bestätigte Windkanalabbildung bezeichnen.**
