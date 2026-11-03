# Dynamische Strecke – Beschleunigung, Bremsen und Abfahrt

**Stand: 03.11.2026 · Issue #14 / Teil von #2.** Erster lauffähiger dynamischer Einzelfahrer-Kern; noch kein vollständiger Rennsimulator.

## Ziel und Grenzen

Die bisherigen [R-01](R01_EBENE.md) und [R-02](R02_BERG.md) berechneten stationäres Tempo. Beim Übergang zwischen unterschiedlichen Streckenabschnitten darf die Geschwindigkeit aber nicht sofort auf den neuen Gleichgewichtswert springen. Der Fahrer behält seine Bewegungsenergie und beschleunigt oder verzögert entsprechend den wirkenden Kräften.

Neu sind mehrere Abschnitte mit jeweils eigener Strecke, Steigung, Pedalleistung und optionaler **vorgegebener** Bremskraft. Noch nicht umgesetzt: Wind, Windschatten, Kurvenkräfte, automatische Bremsentscheidungen, Ermüdung, rotierende Laufradträgheit und Peloton.

## 1. Welche Gleichungen gelten?

**Newtons zweites Gesetz entlang der Fahrtrichtung:**

m × dv/dt = F_Antrieb − F_Luft − F_Rollen − F_Steigung − F_Bremse

und zugleich: ds/dt = v.

Einheiten: m [kg], v [m/s], t [s], s [m], F [N].

Die einzelnen Kraftanteile lauten:

- Luftwiderstand: F_Luft = 0,5 × ρ × CdA × v²
- Rollwiderstand: F_Rollen = Crr × m × g × cos(α)
- Schwerkraft längs der Straße: F_Steigung = m × g × sin(α)
- Pedalantrieb bei ausreichender Geschwindigkeit: F_Antrieb = η × P_Pedal / v
- Bremse: F_Bremse = vorgegebene Bremskraft in Newton

Die Straßensteigung ist **gradeFraction = tan(α)**: 7 % bedeutet 0,07; −7 % bedeutet −0,07. Bei Abfahrt ist F_Steigung negativ und **wirkt daher in der Kräftebilanz antreibend**. Auch ohne Pedalleistung wird der Fahrer bergab schneller, solange die Widerstände kleiner als die Hangabtriebskraft sind.

Watt bezieht sich – wie ausdrücklich beschlossen – auf die Leistung **an der Kurbel/am Pedal**. η ist für den Test weiterhin vorläufig 0,975, aber parametrierbar.

### Sonderfall Anfahren mit null Geschwindigkeit

Bei v = 0 wäre P/v mathematisch unendlich. Deshalb verwenden wir im ersten Test das provisorische Kraftlimit:

F_Antrieb = min(F_max, η × P_Pedal / max(v, 0,001 m/s))

F_max ist vorläufig **180 N**. Das ist **keine** kalibrierte Beschreibung von Übersetzung, Kurbelmoment oder Trittfrequenz. In der Anfahrphase wird die verfügbare Pedalleistung möglicherweise nicht vollständig in Vortrieb umgesetzt.

## 2. Numerische Berechnung

Wir integrieren in kurzen Zeitschritten (maximal **0,25 Sekunden** als Testwert). Um Energie- und Geschwindigkeitsverhalten stabil zu halten, verwenden wir einen **impliziten Mittelpunktschritt**:

v_neu = max(0, v_alt + Δt/m × F_gesamt((v_alt + v_neu)/2))

Δs = (v_alt + v_neu)/2 × Δt.

Die unbekannte Endgeschwindigkeit wird durch Intervallhalbierung gesucht. Der letzte Zeitschritt eines Abschnitts wird verkürzt, bis der Übergang **exakt am definierten Meterpunkt** liegt. Die Geschwindigkeit wird bei einer Steigungsänderung **niemals auf den jeweiligen stationären Wert zurückgesetzt**.

Eine Begrenzung auf maximal zwei Millionen Zeitschritte verhindert endlose Rechnungen; Stillstand ohne Vortrieb vor dem Ziel wird als Fehler gemeldet. Die erlaubten Steigungen von −35 bis +35 % sind lediglich eine Eingabe-Schutzgrenze.

## 3. Energiekontrolle

Für jedes Teilstück werden die Arbeiten (Joule) bilanziert:

W_Antrieb − W_Luft − W_Rollen − W_Steigung − W_Bremse = ΔE_kin

mit ΔE_kin = 0,5 × m × (v_Ende² − v_Start²).

Der Höhenunterschied folgt aus der **Länge entlang der Straße**:

Δh = Streckenlänge × sin(arctan(gradeFraction))

Die Schwerkraftarbeit ist W_Steigung = m × g × Δh. Bergab ist sie negativ. Unser Test prüft, dass diese Bilanz numerisch für jeden Abschnitt mit sehr kleinen Restfehlern aufgeht.

## 4. Berechnetes Demonstrationsprofil

Fiktiver Fahrer: 72 kg Körpergewicht + 8 kg Material, CdA = 0,30 m², Crr = 0,004, ρ = 1,20 kg/m³, η = 0,975. Starttempo **28,8 km/h**. Die gewünschten Wattzahlen und die Bremskraft werden **für jeden Abschnitt vorgegeben**; sie stammen noch nicht aus einer Fahrer-KI.

| Teilstück | Strecke | Neigung | Pedalleistung | Bremskraft | Tempo von → auf | Dauer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ebene | 1.000 m | 0 % | 250 W | 0 N | 28,80 → 37,93 km/h | 98,06 s |
| Berg | 1.000 m | +7 % | 300 W | 0 N | 37,93 → 17,00 km/h | 202,42 s |
| Abfahrt | 1.000 m | −7 % | 0 W | 0 N | 17,00 → 60,68 km/h | 70,69 s |
| Bremsabschnitt | 200 m | 0 % | 0 W | 20 N | 60,68 → 22,55 km/h | 18,58 s |
| Erneute Ebene | 800 m | 0 % | 250 W | 0 N | 22,55 → 37,90 km/h | 81,12 s |

**Gesamt:** 4.000 m, **470,8713 s = 7:50,87 min**, Spitzentempo 60,68 km/h. Aufstieg und Abfahrt betragen jeweils betragsmäßig 69,829 m; netto 0 m.

Das sind **Modellberechnungen**, keine gemessenen Profifahrer-Werte. Der Bremsbefehl von 20 N ist ausdrücklich eine Testvorgabe, **keine automatische Kurvenerkennung** und keine reale Fahrempfehlung. Ein Versuch mit 70 N ließ den Fahrer vor dem Ende des Abschnitts vollständig stoppen. Dieser Grenzfall wurde erkannt; für die durchgehende Demo wurden 20 N gewählt.

## 5. Code und Tests

- Dynamischer TypeScript-Kern: src/engine/physics/dynamic-route.ts
- Neue Tests: tests/dynamic-route.test.mjs
- Programmaufruf: npm run test:route (Node.js 22.16)
- Demoaufruf in eigener Testumgebung: simulateDynamicRoute(DYNAMIC_ROUTE_EXAMPLE)
- Bestehende stationäre Module für R-01 und R-02 wurden **nicht verändert**.

**Tatsächlich lokal ausgeführt: 15 von 15 neue Dynamiktests bestanden.** Geprüft wurden Strecke, genaue Übergänge, kontinuierliche Geschwindigkeit, bergauf/bergab, Bremsarbeit, Energiebilanz, Null-Watt-Rollen, Anfahren, Stillstand, feste R-01/R-02-Gleichgewichtszustände, Zeitschrittkonvergenz, Segmentteilung, Eingabewerte und Reproduzierbarkeit.

Die bisherigen **16 R-01/R-02-Tests** bleiben im Projekt erhalten, wurden beim lokalen Dynamiktest jedoch **noch nicht erneut als Gesamtsuite ausgeführt**. Keine GitHub-Actions-Läufe oder Android-Benchmarks gestartet.

## 6. Offene Modellfragen – auch im Chat erläutern

1. **Kurven und vorausschauendes Bremsen:** Jetzt nur manuell pro Abschnitt vorgegeben, später soll der Fahrer Radius, Haftung und nächste Kurve rechtzeitig berücksichtigen. Ein bestimmtes Automatikmodell ist noch **nicht** beschlossen.
2. **Rotierende Laufradträgheit:** Die momentane Beschleunigung verwendet nur Fahrer-/Rad-Gesamtmasse, noch keine zusätzlich wirksame Drehträgheit. Später ergänzen und kalibrieren.
3. **Glättung von Straßenprofilen:** Neigung springt derzeit an Abschnittsgrenzen. Später feineres/interpoliertes Höhenprofil und echte Kurvenverläufe prüfen.
4. **Anfahr-/Bremskraft:** 180 N maximaler Antrieb und 20 N Bremsung sind reine Testannahmen, nicht geeichte Fahrertechnik.
5. **Sicheres Abfahrtstempo:** Keine automatische Geschwindigkeitsgrenze, Haftung, Kurvenradius oder Fahrer-Risikoprofil. Vor einer realitätsnahen Rennsimulation ergänzen.
6. **Physiologische Grenzen:** Vorgegebene Wattzahlen werden noch unabhängig von Ermüdung erreicht. Später Leistungs-Dauer-Kurve, Energieversorgung und Rennbelastung koppeln.
7. **Android-Leistung:** Der zuverlässige numerische Mittelpunktschritt benötigt viele Rechnungen. 160 Fahrer über 200 km sind noch nicht auf dem Telefon gemessen. Optimierung erst nach Benchmark.

**Nächster Schritt:** Im Chat die fachlichen Grenzen erklären, priorisieren und erst danach Kurven-/Bremsvorschau, Rotationsmasse oder andere physikalische Bausteine erweitern. Nicht stillschweigend als beschlossen darstellen.

## Wissenschaftlicher Bezug

Nee, P. J. & Herterich, J. G. (2022), *Modelling road cycling as motion on a curve*, Sports Engineering 25, Artikel 12: https://doi.org/10.1007/s12283-022-00376-3 . Die Arbeit behandelt die Dynamik aus Antrieb, Widerstand, Gravitation und Bremsung sowie Kurven. Unsere Implementierung ist **eine einfachere gerade Teilstrecken-Näherung**, nicht die Übernahme eines fertigen validierten Modells.

Martin et al. (1998), *Validation of a Mathematical Model for Road Cycling Power*, Journal of Applied Biomechanics 14(3), 276–291, DOI: https://doi.org/10.1123/jab.14.3.276 .
