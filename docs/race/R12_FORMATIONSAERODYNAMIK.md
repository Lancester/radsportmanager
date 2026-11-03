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
