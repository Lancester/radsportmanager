# R-01: Physiktest auf der Ebene (20 km, Windstille)

**03.11.2026 · Erster Rechenkern · Status: numerisch lokal getestet, noch keine reale Kalibrierung.**

Bezug: [Issue #1](https://github.com/Lancester/radsportmanager/issues/1) und [Issue #2](https://github.com/Lancester/radsportmanager/issues/2). Als unabhängige Referenz wurden numerische Lösungen mit Python/SciPy (Brent-Methode) errechnet. Eine kleine TypeScript-Implementierung nutzt dagegen **Intervallhalbierung**. Für den ersten Schritt werden *keine GitHub Actions* gebraucht.

## 1. Konkrete Forschungsfrage

Wie schnell fährt **ein einzelner fiktiver Fahrer** mit 250 bzw. 300 Watt **am Pedal** über 20 km ebene, windstille Strecke? Die Geschwindigkeit gilt als bereits stationär und ist über die gesamte Distanz konstant. Damit testen wir ausschließlich den Zusammenhang zwischen Watt, Widerstand, Geschwindigkeit und Fahrzeit.

**Keine Aussage über** echten Start aus dem Stand, Dauerleistungsfähigkeit, Ermüdung, Gruppenposition, Windschatten, Fahrtechnik oder KI-Entscheidungen.

## 2. Festgelegte Rechenannahmen

| Eigenschaft | Wert | Einheit / Bedeutung |
| --- | ---: | --- |
| Strecke | 20.000 | m |
| Fahrermasse | 72 | kg |
| Rad und Ausrüstung | 8 | kg |
| Gesamtmasse | 80 | kg |
| CdA | 0,30 | m² (Widerstandsfläche, vorläufige Fahrhaltung) |
| Crr | 0,004 | dimensionslos (Rollwiderstand) |
| ρ (Luftdichte) | 1,20 | kg/m³ |
| g | 9,81 | m/s² |
| Steigung | 0 | % |
| Wind | 0 | m/s |
| Pedalleistung | 250 bzw. 300 | W |
| Antriebswirkungsgrad η | **0,975** | **vorläufige Modellannahme**, noch nicht als Standard beschlossen |

Wir unterscheiden ausdrücklich zwischen **Pedalleistung** (was ein Kurbel-/Pedalmessgerät misst) und **am Hinterrad verfügbarer Leistung**. Dazu gilt `P_Rad = η × P_Pedal`. Der Wirkungsgrad ist für spätere Ausrüstungsmodelle veränderbar; 97,5 % ist ein dokumentierter Platzhalter, nicht ein für alle Bedingungen gemessener Wert.

## 3. Formeln: Kräfte und Leistung

**A: Luftwiderstandskraft**

`F_Luft = 0,5 × ρ × CdA × v²`

**B: Rollwiderstandskraft auf der Ebene**

`F_Roll = Crr × m × g`

**C: Mechanische Leistung als Kraft mal Geschwindigkeit**

`P = F × v`, daher

`P_Luft = 0,5 × ρ × CdA × v³`

`P_Roll = Crr × m × g × v`

**Gesamte Leistungsbilanz:**

`η × P_Pedal = 0,5 × ρ × CdA × v³ + Crr × m × g × v`

Mit unseren Testparametern:

`η × P_Pedal = 0,180 × v³ + 3,1392 × v` mit `v` in m/s.

Die aerodynamische **Kraft** steigt quadratisch mit Geschwindigkeit, die dazu nötige **Leistung** kubisch. Das ist der entscheidende nichtlineare Effekt.

Für R-01 verzichten wir bewusst auf Steigung, Wind, Beschleunigung, Radlagerverluste als separaten Term und variable Fahrerposition. Diese Modellteile müssen später ergänzt oder bewertet werden. Bei Gegen-/Rückenwind ist die Luftgeschwindigkeit nicht mit der Geschwindigkeit über Grund identisch!

## 4. Numerische Lösung der Geschwindigkeit

Die Formel liefert die benötigte Radleistung bei **bekannter** Geschwindigkeit. Wir suchen aber die Geschwindigkeit für eine **bekannte** Radleistung. Dazu verwenden wir Intervallhalbierung:

1. Beginne mit einem Geschwindigkeitsbereich, dessen unteres Ende zu wenig und dessen oberes Ende zu viel Widerstandsleistung erfordert.
2. Berechne die Widerstandsleistung in der Mitte.
3. Ist sie kleiner als die Radleistung, muss die Geschwindigkeit größer sein; sonst kleiner.
4. Halbiere den Bereich erneut. Im Programm 80 Wiederholungen.
5. Ergebnisse: `v_km/h = v_m/s × 3,6`; `t_s = 20.000 / v_m/s`.

Weil die Widerstandsleistung für positive Geschwindigkeiten und diese Modellparameter streng wächst, ist die stationäre positive Lösung eindeutig. Eine kleine mathematische Fehlertoleranz bedeutet **keine** reale Messgenauigkeit.

## 5. Unabhängig berechnete Referenzwerte

**Bei η = 97,5 %:**

| Messgröße (berechnet!) | 250 W am Pedal | 300 W am Pedal |
| --- | ---: | ---: |
| Verfügbare Radleistung | 243,750 W | 292,500 W |
| Geschwindigkeit | **37,938288 km/h** | **40,545023 km/h** |
| Geschwindigkeit | 10,538413 m/s | 11,262506 m/s |
| Luftwiderstandsleistung | 210,667813 W | 257,144740 W |
| Rollwiderstandsleistung | 33,082187 W | 35,355260 W |
| Antriebsverlust | 6,25 W | 7,50 W |
| Zeit über 20 km | **31:37,82 min** | **29:35,80 min** |

Rechnerische Zeitersparnis für 50 W zusätzliche Pedalleistung: **122,02 s = rund 2:02 min**. Das entspricht einer um etwa **6,9 %** höheren Geschwindigkeit bei **20 %** höherer Leistung.

**Kontrollvariante bei η = 100 % (idealer, verlustfreier Antrieb):**

| | 250 W am Rad | 300 W am Rad |
| --- | ---: | ---: |
| Geschwindigkeit | 38,291667 km/h | 40,918632 km/h |
| Zeit über 20 km | 31:20,30 min | 29:19,59 min |

Damit wird deutlich: Wir dürfen die an der Kurbel gemessenen 250 W nicht mit den am Hinterrad verfügbaren 243,75 W verwechseln.

### Leistungsbilanz bei 250 W

Die 250 W am Pedal teilen sich im Modell auf in:

- 6,25 W Verluste im Antrieb;
- 210,67 W Luftwiderstand;
- 33,08 W Rollwiderstand.

Summe: **250,00 W**. Der Luftwiderstand macht dabei etwa 86,4 % der **Radleistung**, nicht der gesamten Pedalleistung, aus.

## 6. Weitere Gegenproben

Bei 250 W am Pedal und η = 0,975:

| Änderung (alle anderen Parameter gleich) | Geschwindigkeit | 20-km-Zeit |
| --- | ---: | ---: |
| Basis, CdA 0,30 und 80 kg | 37,94 km/h | 31:37,82 |
| CdA auf 0,25 m² gesenkt | 40,19 km/h | 29:51,50 |
| Gesamtmasse auf 90 kg erhöht | 37,70 km/h | 31:49,69 |

Das sind **frei gewählte mathematische Sensitivitätsbeispiele**, keine gemessenen Unterschiede realer Radfahrer. Auf einer ebenen Strecke wirkt die Aerodynamik hier deutlich stärker als zehn Kilogramm zusätzliches Gewicht. Bei Steigung wird der Masseeinfluss viel größer; das prüfen wir in R-02.

## 7. Was wir tatsächlich implementiert haben

- Datei `src/engine/physics/r01-flat.ts`: reine TypeScript-Funktion `simulateR01` und überprüfbare `powerAtWheelW`-Berechnung.
- `R01_BASE`: explizite Anfangswerte; Resultat umfasst Tempo, Zeit, Luft-/Rollwiderstands- und Radleistung.
- Datei `tests/r01-flat.test.mjs`: **sieben** lokale Tests mit unabhängigen Referenzzahlen, Leistungsbilanz, kubisch/linearer Abhängigkeit, Einfluss von CdA/Masse, Wirkungsgrad, Reproduzierbarkeit und Plausibilitätsprüfung der Eingaben.
- `package.json`: `npm run test:r01` – benötigt Node.js mit integrierter TypeScript-Unterstützung, keine externen npm-Abhängigkeiten.
- **Lokal geprüft:** 7/7 Tests bestanden unter Node.js 22.16. Keine GitHub Actions/Monte-Carlo-Ausführung eingerichtet.

**Abgrenzung:** Ein bestandener numerischer Referenztest belegt, dass wir die gewählte Gleichung korrekt auswerten, **nicht** dass die gesamte zukünftige Rennsimulation validiert wurde.

## 8. Fachliche Fragen zur Besprechung

1. **ENTSCHEIDEN / bestätigt am 03.11.2026:** Fahrerleistung wird in **Watt am Pedal / an der Kurbel** definiert. Der Antriebswirkungsgrad wird separat angewandt.
2. Ist ein veränderlicher CdA-Wert für Körperhaltung/Ausrüstung sinnvoll? Ich empfehle **ja**, später zusätzlich gruppenabhängige Abschirmung.
3. Sollen wir für die ersten Referenzfälle die vereinfachte **stationäre Fahrt** beibehalten und **Beschleunigung erst danach** ergänzen? Das halte ich zur Fehlereingrenzung für sinnvoll.

**Noch zu besprechen:** Frage 2 (variabler CdA/Körperhaltung) und Frage 3 (stationär beginnen, Beschleunigung später). Außerdem ist der Wert 97,5 % für den Antriebswirkungsgrad weiterhin nur eine beispielhafte Annahme – die grundsätzliche Trennung von Pedal- und Radleistung ist hingegen beschlossen.

## 9. Quellen und Grenzen

- Martin, J. C. et al. (1998), *Validation of a Mathematical Model for Road Cycling Power*, Journal of Applied Biomechanics 14(3), 276–291, DOI: [10.1123/jab.14.3.276](https://doi.org/10.1123/jab.14.3.276), [PubMed](https://pubmed.ncbi.nlm.nih.gov/28121252/). Unser R-01 ist bewusst eine vereinfachte Teilbilanz des umfassenderen Modells.
- Kurchin, R. (2020), [Bike Power and Hills](https://rkurchin.github.io/posts/2020/05/ftp): praxisnahe Herleitung der Widerstandskräfte, der Rolle von Steigung und des Antriebswirkungsgrads.

**Nächster Schritt:** Nach fachlicher Rückmeldung R-01 bewerten und den Einzeltest R-02 (konstante Steigung) ergänzen. Issue #1 und Issue #2 bleiben bis zur gemeinsamen Freigabe und weiterführenden Prüfungen offen.
