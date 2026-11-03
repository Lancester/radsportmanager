# R-02 – Stationäre Bergauffahrt mit Schwerkraft

**Stand: 03.11.2026 · Implementiert als isolierter Physikbaustein, keine vollständige Rennsimulation.**

Bezug: [Issue #1](https://github.com/Lancester/radsportmanager/issues/1), [Issue #2](https://github.com/Lancester/radsportmanager/issues/2), [R-01 Ebene](R01_EBENE.md).

## 1. Was wurde für R-02 beschlossen?

In der gemeinsamen Besprechung wurden die drei zuvor offenen R-01-Empfehlungen bestätigt:

- **CdA soll später variieren**, insbesondere durch Körperhaltung, Ausrüstung und später die Abschirmung im Feld. Hier ist CdA schon ein frei konfigurierbarer **Eingabeparameter pro Rechenlauf**; ein dynamischer Haltungswechsel während eines Laufs ist noch nicht programmiert.
- **Zunächst stationäre Fahrt ohne Beschleunigung** rechnen; Beschleunigung in späterer Engine-Phase hinzufügen. Damit lassen sich die Grundlagen isoliert prüfen.
- **97,5 % Antriebswirkungsgrad als vorläufiger Testparameter**, nicht als wissenschaftlich gesicherter Universalwert. Der Wert bleibt veränderbar.

Die ältere Entscheidung bleibt bestehen: **Watt am Pedal/der Kurbel**, Antriebsverluste getrennt.

**Zusätzliche vom Nutzer gewünschte Spielmechanik:** Ein kleines Team kann sich später bessere Materialien leisten. Leichter Rahmen, Reifen, Laufräder, aerodynamischer Rahmen, Helm und Zeitfahranzug sollen sich nicht in pauschalen Prozent-Boni niederschlagen, sondern physikalische Eigenschaften wie **Masse, CdA, Rollwiderstand und möglicherweise Antriebswirkungsgrad** verändern. Investitionen kosten Geld, müssen zum Reglement und Einsatzprofil passen und lohnen sich je nach Streckenart unterschiedlich. Preise, konkrete Produktwerte und Balancing sind noch nicht festgelegt.

## 2. Ziel und Eingabewerte

Wie schnell sind zwei Fahrer auf **8 km Straße mit konstant 7 % Steigung**, jeweils allein und ohne Wind, mit konstant **300 W Pedalleistung**? Beide haben identisches CdA und Material.

| Größe | Fahrer A | Fahrer B | Einheit |
| --- | ---: | ---: | --- |
| Körpermasse | 60 | 80 | kg |
| Materialmasse | 8 | 8 | kg |
| Gesamtmasse | 68 | 88 | kg |
| Pedalleistung | 300 | 300 | W |
| Radleistung bei η=0,975 | 292,5 | 292,5 | W |
| Strecke entlang Straße | 8.000 | 8.000 | m |
| Steigung | 0,07 | 0,07 | Anstieg pro horizontale Distanz |
| CdA | 0,30 | 0,30 | m² |
| Rollwiderstand Crr | 0,004 | 0,004 | – |
| Luftdichte ρ | 1,20 | 1,20 | kg/m³ |
| Erdbeschleunigung g | 9,81 | 9,81 | m/s² |

**Wichtig:** Gleiche 300 W sind ein bewusster Kontrollvergleich. In echten Fahrerpopulationen sind absolute Leistung, Körpermasse, Talent und Leistungsdauer nicht unabhängig. R-02 erzeugt keine Aussage darüber, welcher Körpertyp generell der bessere Bergfahrer ist.

## 3. Formeln, Geometrie und Einheiten

**A: Straßensteigung vs. Winkel**

Die häufig als 7 % bezeichnete Steigung entspricht `gradeFraction = 0,07`. Das ist `tan(alpha) = Höhenänderung / horizontale Distanz`, keine Angabe in Grad!

Daher:

`alpha = atan(0,07)`

`sin(alpha) = 0,07 / sqrt(1 + 0,07^2)`

`cos(alpha) = 1 / sqrt(1 + 0,07^2)`

**B: Kraft zum Überwinden der Schwerkraft**

`F_Steigung = m × g × sin(alpha)`

`P_Steigung = m × g × sin(alpha) × v`

**C: Rollwiderstand auf dem Anstieg**

`F_Rollen = Crr × m × g × cos(alpha)`

`P_Rollen = Crr × m × g × cos(alpha) × v`

**D: Luftwiderstand bei Windstille**

`P_Luft = 0,5 × rho × CdA × v^3`

**E: Gesamte stationäre Leistungsbilanz am Hinterrad**

`eta × P_Pedal = 0,5 × rho × CdA × v^3 + (Crr × m × g × cos(alpha) + m × g × sin(alpha)) × v`

Wir berechnen die positive stationäre Geschwindigkeit `v` durch **80 Schritte Intervallhalbierung**, genauso wie in R-01. Daraus folgen `v_kmh = v × 3,6`, `Zeit = Strecke / v`.

**F: Höhe / Höhenenergie**

Weil `distanceM` die **Länge entlang der Fahrbahn** ist, ergeben die 8.000 m bei 7 % Steigung exakt `8.000 × sin(atan(0,07)) = 558,6330 m` Höhenunterschied, nicht exakt 560 m. Die Höhenenergie muss `m × g × Höhe` entsprechen. Die numerische Gleichung verwendet daher `sin(alpha)` und nicht die ungenauere Näherung `0,07`.

## 4. Referenzwerte (unabhängig mit Python/SciPy brentq ermittelt)

**Ergebnisse (berechnete Modellwerte, keine realen Fahrdaten):**

| Größe | Fahrer A (60+8 kg) | Fahrer B (80+8 kg) |
| --- | ---: | ---: |
| Geschwindigkeit | **19,342501 km/h** | **15,682984 km/h** |
| Fahrzeit 8 km | **24:48,95** | **30:36,39** |
| Fahrzeit in Sekunden | 1488,949154 | 1836,385244 |
| Schwerkraftleistung | 250,279142 W | 262,611953 W |
| Luftwiderstandsleistung | 27,919193 W | 14,881650 W |
| Rollwiderstandsleistung | 14,301665 W | 15,006397 W |
| Leistung am Rad | 292,500000 W | 292,500000 W |
| Gesamtleistung Pedal | 300 W | 300 W |

**Zeitunterschied:** 347,4361 Sekunden (5:47,44) zugunsten des leichteren Fahrers. Dass der schwere Fahrer bei seiner geringeren Geschwindigkeit **weniger Luftwiderstandsleistung** benötigt, ist kein Vorteil der Masse, sondern die Folge seines geringeren Tempos. Der Schwerkraftwiderstand ist bei einem fest vorgegebenen Tempo deutlich höher.

Beim leichten Fahrer gehen rund **250,28 W von 300 Pedal-Watt** in Schwerkraftarbeit, außerdem 27,92 W in Luftwiderstand, 14,30 W in Rollwiderstand und 7,50 W in den Antrieb. Auf diesem Anstieg dominiert Schwerkraft, anders als bei R-01 auf der Ebene.

## 5. Ausrüstungsvarianten als kontrollierte Tests

Vergleich mit Fahrer A, weiterhin 300 W, 7 %, 8 km:

| Nur diese eine Änderung | Zeit | Gewinn ggü. Basis |
| --- | ---: | ---: |
| Basis: Materialmasse 8 kg; CdA=0,30 | 24:48,95 | – |
| Materialmasse 6 kg, sonst gleich | 24:15,87 | **33,08 s** |
| CdA=0,25 m², sonst gleich | 24:28,57 | **20,38 s** |

**Wichtige Grenze:** Die Änderungen sind zur Demonstration bewusst groß gewählt. **Weder** 2 kg Gewichtsersparnis durch ein einzelnes Produkt **noch** eine CdA-Verbesserung um 0,05 m² durch einen einzelnen Zeitfahranzug gelten hier als realistische Standardwerte.

Die Aerodynamik beeinflusst auch am Berg die Zeit; je schneller die Fahrt oder je flacher die Strecke, desto mehr kann sie relativ zu Masseunterschieden bedeuten. Außerdem kann eine besonders tiefe Haltung die physiologisch abrufbare Leistung verändern – noch nicht in R-02 enthalten.

**Später im Manager:** Materialkategorien sollen eigene Parameter besitzen (Masse, CdA-Beitrag, Crr-Einfluss, Kosten, Haltbarkeit, zulässiger Einsatz), und der effektive CdA ergibt sich aus Fahrer/Körperhaltung/Rad/Ausrüstung/Anströmung. Ein Kauf erzeugt **keinen direkten Geschwindigkeitsbonus**. Konkrete Katalogdaten, Hersteller und Preise sind noch offen.

## 6. Was wurde tatsächlich programmiert?

- **Neues gemeinsames Modul:** `src/engine/physics/steady-state.ts` mit `wheelPowerRequiredW` und `solveSteadyRide` für konstante Steigung und Nullwind.
- **R-02-Konfiguration:** `src/engine/physics/r02-climb.ts` mit 60-kg-Fahrer, 8-kg-Material, 300 W, 7 %, 8 km.
- **R-01 auf gemeinsame Grundlage umgestellt:** `src/engine/physics/r01-flat.ts`. Öffentliche R-01-Funktionen und Ergebnisse bleiben erhalten.
- **Tests:** `tests/r02-climb.test.mjs` mit **9 neuen Tests**; die bisherigen **7 R-01-Tests** werden ebenfalls ausgeführt.
- **Testaufruf:** `npm test` (Node.js 22.16), alternativ `npm run test:r01` oder `npm run test:r02`; keine zusätzlichen Pakete notwendig.

**Lokal tatsächlich geprüft:** **16 von 16 Tests bestanden**, darunter unabhängige Referenzwerte, Leistungs- und Energiegleichgewicht, Höhenmeter, monotone Steigungseffekte, leichtere Ausrüstung, aerodynamisches Material, Eingabevalidierung und R-01-Rückwärtskompatibilität. Keine GitHub Actions oder Smartphone-Benchmarks ausgeführt.

Das beweist, dass die stationäre Modellgleichung konsistent implementiert wurde. Es **beweist nicht**, dass ein realer Radfahrer 300 Watt beliebig lange halten kann oder die spätere Renntaktik plausibel funktioniert.

## 7. Was noch fehlt und welche Fragen offenbleiben

Diese Punkte sind **keine jetzt notwendige Nutzerentscheidung**, sondern dokumentierte nächste Modellschritte:

- **Beschleunigung/Verzögerung:** bereits beschlossen, erst nach stationären Einzeltests ergänzen.
- **Abfahrten:** erfordern potentielle Beschleunigung durch Schwerkraft, freien Lauf, Bremsen, Kurven und Geschwindigkeitsgrenzen; **negative Steigungen werden in dieser ersten Version ausdrücklich abgelehnt**, statt falsche Resultate zu liefern.
- **Wind:** Gegen-, Rücken- und Seitenwind sowie Fahrerposition und variable aerodynamische Abschirmung folgen in gesonderten Tests.
- **Physiologie:** der Fahrer darf später keine 300 W beliebig lange leisten; Leistungs-Dauer-Profil, Ermüdung und Verpflegung bestimmen seine Grenzen.
- **Spielmaterial:** realistische Gewichts-/CdA-/Crr-Wirkungen, Verfügbarkeit, Kosten, Eignung, Reglement und Abnutzung erst später kalibrieren.
- **Streckenprofil:** bisher nur ein einzelner konstanter Abschnitt; später aufeinanderfolgende Abschnitte und Übergänge.
- **Fachliche Rückmeldung:** Sind die Verständlichkeit der Formeln und die Materialbeispiele für die weitere gemeinsame Entwicklung passend?

## 8. Fachquellen

1. Martin, J. C. et al. (1998), *Validation of a Mathematical Model for Road Cycling Power*, Journal of Applied Biomechanics 14(3), 276–291, [DOI 10.1123/jab.14.3.276](https://doi.org/10.1123/jab.14.3.276). Unser Modell ist ein vereinfachter stationärer Ausschnitt.
2. Blocken et al. (2020), *Bicycle aerodynamics: History, state-of-the-art and future perspectives*, Journal of Wind Engineering and Industrial Aerodynamics, [DOI 10.1016/j.jweia.2020.104134](https://doi.org/10.1016/j.jweia.2020.104134). Übersicht zur vollständigen mechanischen Bilanz und aerodynamischen Modellen.
3. [Individual aerodynamic and physiological data are critical to optimise cycling time trial performance](https://doi.org/10.1007/s12283-023-00446-0), Sports Engineering (2024). Aeroposition und physiologische Leistungsabgabe sind nicht unabhängig.

**Nächster Schritt:** Nach fachlicher Sichtung R-02 dokumentiert abschließen, danach eine kleine Folgeuntersuchung zur stationären Leistungsbilanz bei wechselnder Streckensteigung und anschließend **dynamisches Beschleunigungs-/Abfahrtsmodell** vor Gruppen- und KI-Simulation. Die konkrete Reihenfolge letzterer Technikschritte ist ein Vorschlag, keine ungefragte verbindliche neue Entscheidung.
