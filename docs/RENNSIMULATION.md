# Rennsimulation – fachliches und technisches Kernkonzept

**Status:** Forschungs- und Konzeptphase. Noch keine ausführbare Engine, keine validierten Modellparameter.

## Grundprinzip

Nicht einen Sieger mit einem einzelnen Gesamtwert auslosen, sondern ein virtuelles Rennen mit Zustandsänderungen und Entscheidungen simulieren. Aus den Zuständen entstehen Reihenfolge, Zeitabstände, Energiebilanz und strukturierte Ereignisse. Ein Bericht erklärt anschließend die tatsächlich berechneten Rennvorgänge.

## Vier Schichten

### A. Physik

Eingaben: Masse von Fahrer und Rad, Leistung, Streckenlänge, Steigung, Kurven, Wind, Luftdichte, Rollwiderstand, Aerodynamik und Position innerhalb einer Gruppe.

Vereinfachte Leistungsbilanz für konstante Fahrt:

P ≈ (1/2) * ρ * CdA * v_rel² * v + m*g*(sin(α) + Crr*cos(α))*v

Für realistische Dynamik zusätzlich Beschleunigung, Wirkungsgrade und die vektorielle Windrichtung berücksichtigen. Gerade Windschatten und Abstände innerhalb von Gruppen dürfen nicht als unabhängige Einzelfahrerberechnung modelliert werden.

### B. Physiologie

- Individuelle Leistungs-Dauer-Profile statt nur numerischer Berg-/Sprintattribute.
- Kurzzeitige Leistungsspitzen, dauerhaft abrufbare Leistung, lange Belastung und kumulative Ermüdung.
- Critical Power / W′ als mögliche Teilkomponente: Für Belastung oberhalb CP sinkt die begrenzte W′-Reserve vereinfacht proportional zu (Leistung – CP) * Zeit.
- Erholung unterhalb CP ist komplex; Langzeitausdauer, Verpflegung, Tagesform und Vortagsbelastung benötigen ergänzende Modelle.
- Parameter und Bandbreiten noch nicht kalibriert.

### C. Taktik und KI

- Sportliche Leiter erhalten Ziele, eigenen Kader, Informationen und Bewertungsfähigkeiten.
- Fahrer handeln innerhalb von Rollen und körperlichen Möglichkeiten.
- Aktionen: Flucht ermöglichen/verfolgen, Kapitän schützen, Tempoarbeit leisten, attackieren, Kräfte sparen, Sprint vorbereiten.
- Qualität der Entscheidungen hängt von Informationsstand, Mitarbeiterkompetenz und Rennen ab; keine „KI-Magie“ oder pauschalen Geschwindigkeitsboni.

### D. Zufall und Unsicherheit

- Plausible Streuung bei Tagesform, Rennsituationen, Ausfällen und Reaktionen.
- Favoriten sollen häufig gewinnen, aber nicht immer.
- Kein nachträgliches Würfeln des Siegers, nachdem das Rennen bereits berechnet wurde.
- Zufallsquelle mit explizitem Seed für identisch reproduzierbare Testläufe.

## Vorgeschlagene Engine-Schleife

1. Rennszenario laden: Strecke, Wetter, Teams, Fahrer, Sportdirektoren, Rollen, Seed.
2. Fahrerzustände initialisieren: Position, Energiereserven, Ermüdung, Gruppen, Taktik.
3. Für jeden virtuellen Schritt: aktuelle Rennsituation erfassen.
4. KI bewertet Optionen und setzt taktische Absichten.
5. Realistisch mögliche Leistungsabgabe aus physiologischem Zustand begrenzen.
6. Gruppendynamik und Physik gemeinsam lösen: Positionen, Tempo, Abstände, Windschatten.
7. Energiereserven, Ermüdung, Gruppen und besondere Ereignisse aktualisieren.
8. Wiederholen, bis alle Fahrer im Ziel sind.
9. Ergebnisse, Zustandsänderungen und Ereignisse zurückgeben.

Die Schrittweite (Zeit, Strecke, adaptiv) muss später auf Genauigkeit und Laufzeit getestet werden. Keine sekündliche 3D-Darstellung nötig.

## Erwartete Datenstrukturen

**Eingabe:** RaceDefinition, CourseSegment[], Weather, Team[], Rider[], Director[], Strategy[], Seed.

**Ausgabe:** Ergebnisliste, Zeitabstände, Team- und Fahrerzustände, Energiebilanzen, chronologische Event[]-Liste, Laufzeitinformationen.

**Beispiel für ein Event (rein illustrativ):**

- Typ: attack
- Distanz: 242.3 km
- Akteur: rider-17
- Kontext: 8.2 % Steigung, definierte Gruppensituation
- Folge: zwei Fahrer folgen

Der Bericht setzt solche Events in natürliche Sprache um. Er darf keine erfundenen Rennursachen hinzufügen, die die Engine nicht ermittelt hat.

## Erste technische Stufe

- 160 fiktive Fahrer, ca. 200 km, einfache Höhendaten, Leistungsprofil und Grundtaktik.
- Ausgabe als Ergebnisliste, Ereignisprotokoll und Rechenzeit.
- Noch kein Transfermarkt, keine Sponsoren, kein Saisonmodus, keine 3D-Ansicht.
- Gemeinsamer Engine-Code soll im Browser/Worker und unter Node.js/GitHub Actions nutzbar sein.

## Größte Forschungsrisiken

Pelotondynamik, Windschatten in dichten/gesplitteten Gruppen, Reaktion auf Seitenwind, Sprintpositionierung, Verfolgungsarbeit, Langzeitermüdung, Verpflegung, taktisches Verhalten sowie Kalibrierung für Klassiker, Bergetappen, Sprints und Rundfahrten.

**Abnahmekriterium für Weiterentwicklung:** Nicht bloß „läuft“, sondern nachvollziehbare, reproduzierbare und im statistischen Vergleich fachlich vertretbare Ergebnisse.


## Konkrete Anforderungen und Referenzszenarien (Issue #1)

Die ausführliche, versionierte Fachspezifikation liegt in **[REFERENZSZENARIEN.md](REFERENZSZENARIEN.md)**.

Sie enthält:
- die schrittweisen Entwicklungsstufen **M0** (Einzelfahrerphysik) bis **M4** (voller Rennprototyp mit Bericht);
- zwölf prüfbare Anforderungen **A-01 bis A-12**;
- acht Szenarien **R-01 bis R-08** für Ebene, Berg, Windschatten, wiederholte Attacken, Fluchtgruppe/Peloton, Sprint, Seitenwind und Einzelzeitfahren;
- erste Eingabe-/Ausgabedaten mit SI-Einheiten und die Grenzen der bisherigen Modellannahmen.

**Status:** Entwurf zur fachlichen Abstimmung; keine Simulation implementiert oder validiert. Wir beginnen bewusst bei überprüfbarer Einzelfahrerphysik, bevor Gruppen und Taktik ergänzt werden.


## Neue Anforderung: Positionsverhalten im Peloton (03.11.2026)

Die Fähigkeit, sich im Feld sinnvoll zu bewegen, gehört verbindlich zum Fahrermodell. Sie soll nicht als pauschaler Watt- oder Siegbonus umgesetzt werden, sondern die **tatsächlich erreichte Position**, die **Kosten des Aufrückens/Haltens** und daraus folgende **aerodynamische und taktische Konsequenzen** beeinflussen.

Bevorzugt wird eine Kopplung aus **regelbasierter Agenten-KI** (Ziele/Entscheidungen), **Physiologie** (abrufbare Leistung), **Physik** (Tempo/Widerstand) und **Gruppendynamik** (Positionen/Abstände). Die endgültige räumliche Auflösung ist noch offen.

Details, wissenschaftliche Quellen und Referenzszenarien **R-09 bis R-11**: [PELOTON_POSITIONIERUNG.md](PELOTON_POSITIONIERUNG.md).
