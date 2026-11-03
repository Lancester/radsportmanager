# Positionsverhalten und Peloton-Modell

**Stand: 03.11.2026 · Issue #1 · Fachliche Erweiterung**

## 1. Verbindlich gewünschtes Spielverhalten

Der Nutzer hat als Radsportfan für das Spielkonzept ausdrücklich festgelegt:

- **Fahren im Feld ist eine eigenständige Fahrerfähigkeit.** Fahrer unterscheiden sich darin, wie gut sie ihre Position im Feld finden, halten und vor kritischen Stellen verbessern.
- Diese Fähigkeit hat **indirekte physische Konsequenzen**: Ein geschickter Fahrer vermeidet unnötige Vorstöße in den Wind, ständiges Bremsen/Beschleunigen und ungünstige Positionen; ein ungeschickter Fahrer muss unter Umständen größere Anstrengungen unternehmen, um dieselbe Position zu erreichen.
- Feldposition ist nicht gleich Rang oder Reihenfolge. Es macht einen Unterschied, ob ein Fahrer in einer geschützten vorderen Reihe, auf der windzugewandten Außenkante, mitten im Feld oder weit hinten fährt.
- Vor Kurven, Verengungen, Pflaster, Anstiegen und möglichen Windkanten versuchen viele Teams, ihre Fahrer rechtzeitig nach vorn zu bringen.
- Am hinteren Feldende steigt bei Spaltungen, Kurven/Tempowechseln und Positionskämpfen die Gefahr, den Anschluss zu verlieren.
- Fahrer, Mannschaftskameraden und sportliche Leiter agieren in ihren Zuständigkeiten eigenständig. Der Spieler gibt vor dem Rennen nur Ziele und taktische Leitlinien vor.

**Wichtig:** Die spätere Frage nach der mathematischen Genauigkeit des Positionsmodells ist *noch nicht abschließend beschlossen*.

## 2. Bevorzugte Architektur: physikalisch fundiertes agentenbasiertes Modell

**Keine Alternative „Physik ODER KI“**, sondern vier gekoppelte Komponenten:

1. **Entscheidungen / regelbasierte Agenten-KI:** Was versucht der Fahrer? Position halten, aufrücken, zurückfallen, Kapitän schützen, in Flucht gehen, Kräfte sparen?
2. **Physiologie:** Wie viel Leistung kann er unter Berücksichtigung seiner Leistungsdauer-Kurve, aktueller Ermüdung und zeitlich begrenzter Reserven abrufen?
3. **Physik:** Wie hängen Leistung, Geschwindigkeit, Steigung, Wind, Aerodynamik und Windschatten zusammen?
4. **Dynamik des Feldes:** Welche Positionen sind frei, wie bewegen sich Gruppen, welche Abstände entstehen und wie beeinflussen sich die Fahrer gegenseitig?

Die Entscheidungsschicht ist zunächst **klassisch programmiertes Verhalten**, kein großes generatives Sprachmodell. Sie berechnet keine Sieger direkt. Spielergebnisse entstehen aus den berechneten Zuständen des Rennens.

## 3. Vorgeschlagenes Positionsmodell (noch zu validieren)

### Drei miteinander verknüpfte räumliche Größen

- **Absoluter Fortschritt auf der Strecke** in Metern, damit Zeitabstände und Gruppenrisse entstehen können.
- **Relative Längsposition** innerhalb einer Gruppe (z. B. ungefähre Reihe, Entfernung zur Gruppenfront).
- **Laterale Position** auf der verfügbaren Straßenbreite (geschützte Mitte, Seitenrand, windzugewandte Seite, Staffel).

Weitere Zustandsdaten:
- Gruppe, Zielposition, aktuelle Teamrolle, Erschöpfung, notwendige Aufrückarbeit, aktuelle aerodynamische Abschirmung;
- Gruppenform, Straßengeometrie/-breite, Windrichtung, Geschwindigkeit, Engstellen und Streckenmerkmale.

**Nicht zwingend erforderlich:** Jede Rad-/Lenkerbewegung in Zentimetergenauigkeit oder eine vollständige 3D-Strömungsrechnung. Eine hinreichend genaue *2D-/spurähnliche Näherung mit kontinuierlicher Streckenposition* kann vorerst genügen.

### Besonders wichtiger Zielkonflikt

- **Feldmitte oder hintere geschützte Position:** Aerodynamisch sehr günstig; Antritte/Engstellen weiter vorne werden eventuell übersehen, Einordnen bei hohem Tempo ist schwierig.
- **Vorderer Feldbereich hinter Helfern:** Taktisch gut positioniert, oft ordentlich geschützt; das Erreichen/Halten dieser Position muss Leistung und Organisationsaufwand kosten.
- **Ganz vorne im Wind:** Kann nötig sein, verbraucht aber mehr Energie.
- **Außenrand / Windseite:** Abhängig von Windrichtung und Nachbarn gegebenenfalls geringerer Schutz.
- **Weit hinten:** Kann bei gleichmäßiger Fahrt energieeffizient sein, aber bei Brems- und Beschleunigungswellen oder Gruppenrissen hohe Folgekosten erzeugen.

**Nicht pauschal behaupten:** „Hinten ist immer am anstrengendsten“ oder „vorn ist immer energetisch günstiger“. Die wissenschaftlichen Daten zeigen gerade den Zielkonflikt zwischen Aerodynamik und Renntaktik.

## 4. Wie eine einzelne Berechnungsphase aussehen könnte

**Reihenfolge pro Zeit-/Distanzschritt ist ein Architekturvorschlag:**

1. Vorausschauen: Welche Rennphase, Straßenverengung, Kurve, Anstieg, Pflaster oder Seitenwindzone kommt?
2. Agenten treffen eine Zielentscheidung, z. B. „vor der Verengung in die ersten 25 Positionen, hinter Mannschaftskameraden“.
3. Prüfen: Welche Bewegung ist angesichts von Feldtempo, Straßenbreite, anderen Fahrern, Reaktionsfähigkeit und verfügbarer Leistung überhaupt möglich?
4. Für realisierte Positionen das lokale Abschirmungs-/Luftwiderstandsmodell aus Nachbarschaft, Wind und Gruppendichte bestimmen.
5. Physik und Physiologie gemeinsam berechnen: Energieeinsatz, Geschwindigkeit, Abstände, Ermüdung, Positionsänderung.
6. Gruppen und Kontakte aktualisieren. Eventuell entsteht eine Lücke, wird geschlossen oder eine Gruppe reißt ab.
7. Relevante Ereignisse in einer reproduzierbaren Struktur protokollieren.

Bei Implementierung müssen zeitgleiche Entscheidungen ohne willkürlichen Vorteil durch Berechnungsreihenfolge aufgelöst werden (z. B. Absichtsermittlung zuerst für alle, dann gemeinsame Bewegungsauflösung).

## 5. Fahrerfähigkeit „Positionierung im Peloton“

**Festgelegter fachlicher Effekt**, technische Umsetzung noch offen:

Ein fahrerindividuelles Positionsvermögen bestimmt beispielsweise:
- rechtzeitiges Erkennen wichtiger Rennstellen;
- Auswahl günstiger, erreichbarer Positionen;
- Fähigkeit, vorhandene Lücken zu nutzen;
- Halten eines Platzes trotz Konkurrenz;
- unnötigen Energieeinsatz und Gegenbewegungen vermeiden;
- geringere Wahrscheinlichkeit, bei Tempowechseln ungünstig zu stehen.

**Wichtig:** Nicht einfach „Positionierungswert 90 → minus 10 % Watt“. Ein guter Fahrer profitiert durch **bessere Entscheidungen, geringere unnötige Belastung und tatsächlich bessere physikalische Feldposition**. Individuelle Risikobereitschaft, Fahrtechnik, Erfahrung und Teamunterstützung könnten später getrennte Eigenschaften werden.

Sportliche Leiter können über Rennziele, Antizipation und Helferkoordination beeinflussen, wann ein Kapitän aufrücken soll. Gute Helfer können ihn schützen; das kostet andere Teammitglieder Kraft.

## 6. Neue Referenzszenarien für Issue #1

**R-09: Positionskönnen bei identischer Physiologie** (frühestens nach M2)

- Zwei fiktive Fahrer mit denselben Watt-, Körper- und Aero-Werten und gleicher Teamunterstützung fahren in einem wechselhaften Peloton.
- Nur die Positionierungsfähigkeit ist verschieden; beide erhalten dieselben übergeordneten Ziele und vergleichbare Situationen.
- **Erwarteter statistischer Trend:** Der geschicktere Fahrer befindet sich vor Schlüsselstellen häufiger in einer taktisch geeigneten Position oder erreicht sie mit geringerem Energieaufwand.
- **Keine Garantie pro Rennen**, kein direkter Geschwindigkeits- oder Ergebnisbonus aufgrund des Skills. Reproduzierbare Seeds, positionsbezogene Energie- und Distanzprotokolle.

**R-10: Verengung vor entscheidendem Anstieg**

- Ein Peloton nähert sich einer schmalen Straße und anschließend einem Anstieg. Mehrere Teams konkurrieren um die vorderen Reihen; unterschiedliche Helferqualitäten und Positionierungsfähigkeiten.
- Varianten: Frühes Aufrücken vs. spätes Aufrücken, gleiche physiologische Basis und möglichst gleiche Seeds.
- **Erwartung:** Frühes, erfolgreiches Positionieren kann den Anschluss und die Reaktion auf Selektion erleichtern; es kostet Zeit und Energie. Spätes Aufrücken wird bei Verengung und dichter Konkurrenz schwieriger.
- **Kontrolle:** In einem Vergleich ohne Verengung sollten die reinen positionsbedingten Engpasseffekte abnehmen.
- **Nicht erzwingen:** Position 1 darf nicht immer gewinnen; hintere Fahrer dürfen unter geeigneten Bedingungen weiterhin aufschließen.

**R-11: Ziehharmonika-Effekt am hinteren Feldende** (später, zunächst konzeptionell)

- Eine Gruppe durchfährt mehrere enge Kurven. Vorne wird verzögert und beschleunigt; dieselbe Störung breitet sich zeitversetzt durch die Gruppe aus.
- **Erwartung:** Hintere Fahrer erleben je nach Gruppendynamik verstärkte Stop-and-go-Belastung. Das ist kein pauschaler Energie-Malus für jede hintere Position.
- **Prüfung:** Vergleich mit identischer geradeaus verlaufender Straße, kontrollierte Kurven-/Bremsereignisse, korrekte Zeit- und Energiebilanz.

## 7. Offene Modellfragen

- Positionsauflösung: Grobe Gruppenbereiche, diskrete Reihen/Lanes oder kontinuierliche 2D-Approximation?
- Verfügbare Straßenbreite und seitliche Positionskosten bei Wind.
- Konkurrenz um freie Positionen und wie eine Position erreichbar bleibt, ohne dass Fahrer „teleportieren“.
- Aerodynamischer Einfluss von Gruppenform, Nähe und Querwind; wie werden Messstudien für dynamische Gruppen vereinfacht?
- Verbindung zwischen Risiko (Sturz/Defekt) und physikalisch berechneter Position, ohne willkürliche Strafen.
- Wie viele kleine Schritte braucht ein 160-Fahrer-Rennen, damit das Modell auf Android schnell genug bleibt?
- Wie kalibriert man das eigenständige Positionierungskönnen im Verhältnis zu Taktik, Erfahrung und Fahrtechnik?

## 8. Fachliche Quellen

- **Blocken et al. (2018):** *Aerodynamic drag in cycling pelotons: New insights by CFD simulation and wind tunnel testing*. Journal of Wind Engineering and Industrial Aerodynamics 179, 319–337. DOI: [10.1016/j.jweia.2018.06.011](https://doi.org/10.1016/j.jweia.2018.06.011). CFD-/Windkanalstudie mit 121 Fahrern in definierten statischen Gruppenkonfigurationen. Große Positionsunterschiede des *aerodynamischen Widerstands*; **nicht** direkt Gesamtleistung oder ein allgemeiner dynamischer Rennbonus.
- **Determinants of Cycling Performance (2020):** Überblick in *Sports Medicine – Open*, [DOI 10.1186/s40798-020-00252-z](https://doi.org/10.1186/s40798-020-00252-z). Diskutiert Energieersparnis durch Windschatten und die Nachteile weit hinten liegender Positionen.
- **Ratamero (2015):** *Modelling peloton dynamics in competitive cycling: A quantitative approach*, Communications in Computer and Information Science 464, 42–56. [DOI 10.1007/978-3-319-17548-5_4](https://doi.org/10.1007/978-3-319-17548-5_4). Agentenbasierte Modelle für dynamische Gruppen als Forschungsrichtung, nicht als fertige Spiele-Engine.
- **Velo (2019):** [How wide American roads shape the race](https://velo.outsideonline.com/news/tour-of-california-how-wide-american-roads-shape-the-race/). Sportliche Praxis: Straßenbreite verändert Aufwand und Bedeutung des Positionierens.
- **Cycling Sports Medicine review (2020):** Fachliche Aussagen nicht als feste Koeffizienten übernehmen; reale Tests und Kalibrierung bleiben erforderlich.

## 9. Umsetzungspfad

1. Bestehende M0-Referenzen **R-01 Ebene / R-02 Anstieg** zuerst physikalisch prüfen.
2. Positionsdatentyp und Bewegungs-/Abstandsmodell spezifizieren, ohne die gesamte Simulationsengine zu blockieren.
3. Einfaches Abschirmungsmodell und Tests **R-03 Windschatten**.
4. Unterschiedliche Positionierungsfähigkeiten und reale Bewegungs-/Leistungskosten: **R-09**.
5. Straßenverengung und Position vor dem Anstieg: **R-10**, anschließend **R-11**.
6. Erst danach größere Rennen und Monte-Carlo-Kalibrierung.

**Status:** Anforderung zur eigenständigen Fahrerfähigkeit beschlossen; Positionsauflösung, Parameter und Algorithmen zunächst fachlicher Vorschlag, nicht validiert.

## Zwischenstand R-03 (03.11.2026)

Der erste gekoppelte Zweierprototyp besitzt tatsächlich **longitudinale und laterale Positionen**, einen abhängigen Luftwiderstand und kann eine Lücke wachsen lassen oder einen auf separater Spur erfolgenden Führungswechsel protokollieren. Das ist die erste reale technische Kopplung, nicht schon eine realistische Pelotonbewegung.

**Noch nicht vorhanden:** automatische seitliche Positionswahl, fahrerisches Können, eigenständiges Gruppensplitting, Helferformationen, Querwind/Windkanten, mehr als zwei Fahrer und vollständige Kollisions-/Risiko-KI. [Die Windschatten-Physik ist ausführlich erklärt](physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md).
