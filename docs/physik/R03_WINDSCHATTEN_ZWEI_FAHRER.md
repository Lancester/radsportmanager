# R-03 – Windschatten und erste gemeinsame Zweierfahrt

**Stand: 03.11.2026 · GitHub Issue #21 · zwei Fahrer tatsächlich gemeinsam simuliert, Modellparameter noch nicht kalibriert.**

## 1. Ziel und Stand

Nach R-01 (Ebene), R-02 (Berg), dynamischen Strecken, Kurven und dem gemeinsamen Physikkern simulieren wir erstmals **zwei Fahrer auf derselben Uhr**. Sie besitzen eigene Positionen, Geschwindigkeiten und Wattzahlen. Die Position des jeweils anderen beeinflusst den **aerodynamischen Widerstand**.

Damit ändern sich bei gleicher Pedalleistung die tatsächlichen Geschwindigkeiten. Umgekehrt kann bei vorgegebener gleicher Geschwindigkeit die nötige Pedalleistung verglichen werden. Ein Ergebnis wird **nicht** über einen künstlichen Windschatten- oder Siegerbonus vergeben.

**Explizite Grenzen:** Der Prototyp arbeitet auf der **Ebene bei Windstille**, mit vereinfachten longitudinalen und lateralen Fahrerpositionen. Keine natürliche Seitenbewegung, keine selbstständig planende Fahrer-KI, keine Leistungs-Dauer-Grenze, keine echten Gruppen von mehr als zwei Personen und keine automatische Kollisionsvermeidung.

## 2. Die physikalische Grundgleichung

Wir verwenden weiterhin den **gemeinsamen dynamischen Physikkern** aus `motion-core.ts`:

`m_eff · dv/dt = F_Antrieb − F_Luft − F_Rollen`

Bei Windstille gilt:

`F_Luft = 0,5 · rho · CdA · v² · f_Windschatten`

**Wichtig:** Der Faktor `f_Windschatten` wirkt **ausschließlich auf die Luftwiderstandskraft**, nicht auf Rollwiderstand, Masse, Pedalleistung, Ermüdung oder die Geschwindigkeit direkt.

Auf der Ebene ist:

`P_Pedal = (0,5 · rho · CdA · v³ · f_Windschatten + Crr · m · g · v) / eta`

Dabei bleiben die bekannten Werte `rho`, `CdA`, `Crr`, `m`, `g`, `eta` und Watt **am Pedal**.

Die Führungsperson erhält im ersten Zweifahrermodell `f=1` (Vereinfachung). Der Hintermann erhält `f < 1`, sofern er ausreichend dicht und seitlich ausgerichtet dahinter fährt.

## 3. Unser bewusst einfaches Abschirmungsmodell

**Noch keine empirisch kalibrierte Funktion:** Wir benutzen eine glatte, numerisch stabile Abstandsnäherung:

`f = 1 − R_max · exp(−d_Rad / L) · exp(−0,5 · (y / B)²)`

- `R_max = 0,35`: **vorläufig maximal 35 % weniger aerodynamischer Widerstand** direkt hinter dem Führenden.
- `d_Rad = max(0, |x_vorn−x_hinten|−1,8 m)`: vereinfachter Abstand zwischen den Rädern; die Positionen sind fiktive Fahrerzentren.
- `L = 1,8 m`: vorläufige exponentielle Längsabfallskala.
- `y`: seitlicher Abstand; `B = 0,75 m`: vorläufiger Seitenabfallparameter.
- `f=1`: kein Windschatten. Der Hintermann kann durch größere Lücke oder Versatz nur weniger geschützt sein.

Die Anzahl **1,8 m** als Mindestabstand der Fahrerzentren und die seitliche Überholschwelle **1,25 m** sind **rein technische Testannahmen**, keine verifizierte realistische Pelotongeometrie.

**Wichtig zur Forschung:** Blocken et al. (2018) berichten für kleine direkt hintereinander fahrende Gruppen häufig aerodynamische Widerstandsanteile im Bereich von ungefähr 50 bis 70 % des isolierten Fahrers. Bei **dicht gepackten Pelotons aus 121 Fahrern** wurden wesentlich kleinere Werte für bestimmte *innere Positionen* gefunden; diese Ergebnisse dürfen **nicht** pauschal auf unsere Zweiergruppe übertragen werden. Derzeit ist unsere konkrete exponentielle Abstandsfunktion **eine Testheuristik, keine direkt aus einer Messreihe gefittete Kurve**.

## 4. Statischer Watt-Vergleich bei exakt gleichem Tempo

Wie zuvor: **72 kg Fahrer + 8 kg Material**, `CdA=0,30 m²`, `Crr=0,004`, Luftdichte `rho=1,20 kg/m³`, Wirkungsgrad `eta=0,975`.

**Geschwindigkeit: 11 m/s = 39,6 km/h.** Der Hintermann fährt in derselben Spur und hat einen **0,5 m Radabstand** hinter dem Führenden. Das entspricht **2,3 m Abstand der modellierten Fahrerzentren**.

| Rechengröße | Allein / im Wind | Hintermann, geschützt |
| --- | ---: | ---: |
| Windschatten-Faktor (nur Aero) | 1,0000 | **0,7349** |
| Luftwiderstandsleistung | 239,58 W | 176,06 W |
| Rollwiderstandsleistung | 34,53 W | 34,53 W |
| Notwendige Pedalleistung | **281,14 W** | **216,00 W** |

Die Ersparnis ist also **65,14 W am Pedal** bzw. rund **23,2 % der gesamten Pedalleistung**. Der Luftwiderstand sinkt um rund **26,5 %**. Die beiden Prozentwerte sind ausdrücklich **nicht identisch**, da der Rollwiderstand unvermindert bleibt und die Antriebsverluste getrennt berücksichtigt werden.

Kontrollvarianten mit größerem Abstand (ansonsten identisch):

| Abstand Fahrerzentren | Aero-Faktor | Pedalleistung Hintermann |
| --- | ---: | ---: |
| 2,3 m | 0,7349 | 216,00 W |
| 3,3 m | 0,8479 | 243,76 W |
| 5,3 m | 0,9499 | 268,84 W |
| 10,3 m | 0,9969 | 280,37 W |
| weit getrennt | nahe 1,0 | nahe 281,14 W |

Diese Zahlen sind **Modellergebnisse** mit selbst gesetzten Abschirmungsparametern, keine direkt gemessenen Wattwerte von realen Fahrern.

## 5. Zwei Fahrer dynamisch auf gemeinsamer Uhr

Datei: `src/engine/physics/drafting-pair.ts`. Beide Fahrer besitzen Positionswerte (Längsposition in Metern, seitliche Position), Geschwindigkeit und eine zeitabhängige Wattvorgabe.

Je Zeitschritt (standardmäßig **0,2 s**):

1. **Gleichzeitiger Snapshot** beider Positionen und Spuren.
2. Daraus bestimmen wir für beide Fahrer ihre Aero-Faktoren (vorne: im ersten Modell 1).
3. Beide Fahrer berechnen ihren neuen Zustand mit `advanceMotionStep` aus **demselben existierenden Physikintegrator**.
4. **Erst danach** werden beide Positionen und Energiebilanzen gemeinsam aktualisiert. Damit hat kein Fahrer einen künstlichen Vorteil, weil er zuerst berechnet wurde.
5. Bei natürlichem Überholen auf separater Spur wird ein **Führungswechsel** protokolliert. Bei Überlappung in derselben Spur **bricht das Modell mit klarem Kollisionsfehler ab**, statt automatisch auszuweichen oder Geschwindigkeiten zu teleportieren.

**Szenarische Befehle** (Wattänderung oder seitlicher Spurenwechsel zu einer festen Zeit) sind möglich, werden aber noch **nicht** von einer Fahrer-KI getroffen. Ein sprunghafter Spurwechsel ist momentan nur Testeingabe, **keine physikalische Lateralbewegung**.

### Kurzes dynamisches Beispiel

A startet bei Streckenposition 10 m, B bei 7,7 m (2,3 m Zentrumabstand). Beide fahren anfangs 11 m/s. A tritt mit **255 W**, B mit **170 W**. Über **12 s** wird das Paar gemeinsam berechnet:

- A fährt vorne und erzielt am Ende rund **10,77 m/s**.
- B bleibt hinten, erreicht am Ende rund **10,38 m/s**.
- Abstand wächst wegen der geringeren Leistung von ungefähr **2,30 m auf 4,27 m**.
- Damit nimmt die Abschirmung von B im Verlauf tatsächlich ab.
- Beide mechanischen Energiebilanzen bleiben im Test innerhalb von weniger als 0,001 Joule Restfehlern.

Ein separates Szenario lässt B nach einem **realen Längsüberholen auf seitlich versetzter Spur** die Führung übernehmen und protokolliert den Wechsel bei ungefähr **6,4 s**. Es gibt noch **keine** automatische Führungswechsel-Taktik.

## 6. Tests und lokale Leistungsprüfung

**Tatsächlich lokal ausgeführt, Node.js 22.16.0:**

- **15 neue R-03-Tests bestanden:** reduzierte Luftkraft, unveränderter Rollwiderstand, Abstand und Seitenversatz, gleicher-Speed-Wattvergleich, umgekehrte Führung, synchrone Zeitschritte, mechanische Energiebilanzen, wachsende Lücke, natürliches Überholen auf seitlicher Spur, explizite Kollisionsmeldung, Kommandozeit, Zeitschrittabgleich, Determinismus und Eingabevalidierung.
- **49 bisherige Tests unverändert ebenfalls bestanden.**
- **Gesamt 64 von 64 Tests bestanden**, 0 Fehler.
- Statische TypeScript-Typprüfung über alle Physikmodule mit **TypeScript 5.8.3** bestanden.

Befehle: `npm test`, `npm run test:r03`; der manuelle Kurzbenchmark ist über `npm run bench:r03` möglich.

**Manueller Node-Kurzbenchmark (je 12 s virtuelle Zweierfahrt, 3 Durchläufe, Median):**

| Unabhängig wiederholte Zweierfahrten | Rechenzeit |
| ---: | ---: |
| 1 | ca. 0,82 ms |
| 10 | ca. 8,39 ms |
| 100 | ca. 41,15 ms |

**Ganz wichtig:** Das sind wiederholte **kleine Zweierfahrten** auf einer lokalen CPU, **kein vollständiges 160-Fahrer-Peloton** mit gemeinsamer Rennphysik auf Android. Kein GitHub-Actions-Lauf, kein Web-Worker-Benchmark, kein Smartphone-Test.

## 7. Fachliche Entscheidungen – noch offen!

1. **Windschatten-Kurve kalibrieren:** Die aktuellen Maximalreduktion 35 % und Abstands-/Seiten-Skalen sind **nur vorläufige Testwerte**, auch wenn sie eine plausible Größenordnung demonstrieren. Wir sollten sie später anhand von Studien und geeigneten Messdaten kalibrieren.
2. **Querwind und Nachbarschaft:** Sobald Wind aus seitlicher Richtung kommt, entscheidet die reale Windrichtung über den besten Platz. Das heutige Zweiermodell ist windstill; wir erweitern es schrittweise um einen relativen Windvektor und mehrere Nachbarn.
3. **Lateralbewegung und sichere Überholung:** Ein Fahrer darf nicht einfach seitlich teleportieren. Für das spätere echte Peloton brauchen wir eine erreichbarkeits- und sicherheitsgeprüfte Bewegung in mehreren Spuren bzw. einer 2D-Näherung. Dazu gehört das bereits beschlossene individuelle Positionskönnen.
4. **Hintermann beeinflusst Führenden:** Auch der Vordermann kann aerodynamisch geringfügig von einem folgenden Fahrer profitieren. Das ist in dieser ersten Stufe bewusst weggelassen und muss vor realistischer Kalibrierung geprüft werden.
5. **Energie und Physiologie:** Derzeit werden nur mechanische Arbeiten berechnet. Es gibt noch **keine** Ermüdung und keine physiologischen Reserven; 170/255 W sind frei gewählte, konstant vorgegebene Leistungen.
6. **Android-Laufzeit:** TypeScript und Web Worker werden jetzt an einem **echten Android-Gerät** geprüft, sobald der Browser-Testzugang eingerichtet ist. Vorher keine Aussage „160 Fahrer über 200 km laufen sicher auf dem Smartphone“.

**Empfohlener nächster Schritt:** Zuerst ein einfacher, auf dem Android-Browser ausführbarer Worker-Benchmark mit derselben R-03-Engine und nachvollziehbaren Resultaten. Danach eine kleine **3–8-Fahrer-Gruppe** mit gemeinsamer Zeitachse und Windschatten-Nachbarschaften. Erst anschließend R-09: Können, Positionen und taktisch sinnvolle Positionswechsel.

## Quellen

- Blocken et al. (2018), *Aerodynamic drag in cycling team time trials*, Journal of Wind Engineering and Industrial Aerodynamics 182, 128–145, DOI **10.1016/j.jweia.2018.09.015**. Untersucht unter anderem 2–9 hintereinander fahrende Radfahrer und verschiedene Abstände; bestätigt den erheblichen Windschatteneffekt, **nicht unsere frei gewählte exponentielle Formel**.
- Blocken et al. (2018), *Aerodynamic drag in cycling pelotons: New insights by CFD simulation and wind tunnel testing*, Journal of Wind Engineering and Industrial Aerodynamics 179, 319–337, DOI **10.1016/j.jweia.2018.06.011**. Peloton-Ergebnisse aus 121 Fahrern dürfen nicht mit einer Zwei-Personen-Gruppe verwechselt werden.
