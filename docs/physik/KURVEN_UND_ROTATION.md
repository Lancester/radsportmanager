# Kurvenvorschau und rotierende Laufradträgheit – erster Prototyp

**Stand: 03.11.2026 · Issue #16 · Status: 14 neue lokale TypeScript-Tests bestanden, noch keine Realweltdaten-Kalibrierung.**

Dieses Modell erweitert unsere Grundlagen zu [R-01](R01_EBENE.md), [R-02](R02_BERG.md) und [dynamischen Streckenabschnitten](DYNAMISCHE_STRECKE.md) um **ein vorausschauendes Bremsziel** vor einer Kurve und die **Rotationsenergie der Laufräder**. Es ist ein **eigenständiger Technik-Prototyp** in `src/engine/physics/corner-route.ts`. Die vorherige Datei `dynamic-route.ts` wurde bewusst nicht verändert. Die beiden Fahrmodelle müssen vor R-03 noch sauber zu einem gemeinsamen Kern zusammengeführt werden.

## 1. Neue Eingabewerte

Je Kurvenpunkt am Ende eines Straßenabschnitts:
- `radiusM`: Kurvenradius in m; enger bedeutet eine niedrigere Grenzgeschwindigkeit.
- `gripCoefficient`: Haftreibungsbeiwert der Straße/Reifen-Kombination, vorläufig für den Test **0,6 trocken / 0,4 nass** (Literaturbeispiele, keine allgemeingültigen Garantiewerte).
- `safetyFactor`: Vorsichtsfaktor, hier **0,7**, ausdrücklich noch nicht nach Fahrtechnik kalibriert.

Je Fahrer/Fahrrad:
- `wheelInertiaKgM2`: gesamte rotierende Trägheit beider Laufräder inklusive relevanter rotierender Teile, Beispiel **0,14 kg·m²** – nur fiktiver Eingabewert, noch keine Messung.
- `wheelRadiusM`: wirksamer Rollradius, Beispiel **0,34 m**.
- Alle bisherigen Größen bleiben erhalten: Masse von Fahrer+Rad, CdA, Crr, Luftdichte, Pedalwatt und Wirkungsgrad η.

Weitere vorläufige technische Annahmen: maximales Bremsvermögen **3 m/s² vor Berücksichtigung der Zusatzträgheit**, maximale Antriebskraft **180 N**, Reaktionsvorschau **0,5 s** und Integrationsschritt **0,25 s**. Diese Parameter werden erst mit geeigneten Daten und der KI-Fahrtechnik kalibriert.

## 2. Kurvengeschwindigkeit aus Seitenbeschleunigung

Für eine ebene, nicht überhöhte Kurve gilt:

`a_seitlich = v² / R`

Die Reifen müssen diese Querbeschleunigung über Seitenhaftung aufbauen. Unser bewusst einfaches Grenzmodell fordert:

`v²/R <= μ × g × cos(α) × S`

Daher:

**`v_Kurve_max = sqrt(R × μ × g × cos(α) × S)`**

Mit Radius 15 m, μ=0,6, Sicherheitsfaktor S=0,7 und α=0 ergibt sich **7,8615 m/s = 28,30 km/h**.

Bei gleicher Kurve, μ=0,4 (Test für nass), sind es **23,11 km/h**.

**Achtung:** Das ist **keine** vollständige Kurvenfahrphysik. Wir modellieren die Kurve als punktförmiges Geschwindigkeitsziel an einem Streckenabschnittsende. Fahrspur, Linienwahl, Kurvenbogenlänge, Schräglage, Straßengefälle quer zur Fahrbahn, kombinierte Brems-/Seitenkräfte und Gruppenverkehr fehlen noch. Auch sind echte Haftwerte von Reifen, Fahrbahn, Feuchtigkeit und Bedingungen abhängig.

## 3. Bremsvorschau vor dem Kurvenpunkt

Für aktuelle Geschwindigkeit `v`, gewünschtes Kurventempo `v_ziel` und verfügbare Nettoverzögerung `a` gilt bei angenähert konstanter Verzögerung der erforderliche Bremsweg:

**`s_Brems = (v² - v_ziel²) / (2 × a)`**, sofern `v > v_ziel`.

Der Fahrer beobachtet die nächste Kurve **auch über die Grenzen von Streckenabschnitten hinweg**. Beginnt sein verfügbarer Weg weniger zu werden als der benötigte Bremsweg zuzüglich eines vorläufigen Vorschauabstands (`v × 0,5 s + 1 m`), beendet er das Treten und bremst. Die benötigte Bremskraft wird fortlaufend an den verbliebenen Weg angepasst.

Die mögliche Bremskraft ist zusätzlich durch Reifenhaftung und eine parametrisierte Obergrenze beschränkt:

`F_Bremse_max = m × min(a_Bremse_max, μ × g × cos(α) × S)`

**Wichtig:** Die physische Gesamtmasse `m` begrenzt die verfügbare Reifenhaftkraft; die größere Beschleunigungsmasse aus Radrotation (`m_eff`) steht im Nenner der Geschwindigkeitsänderung. Bei einem unrealistisch kurzen Bremsweg **setzt die Engine die Geschwindigkeit nicht einfach herunter**, sondern meldet eine zu schnell erreichte Kurve als Fehler. Der Prototyp bietet noch keine Fehlerreaktion (Sturz, Abkommen, Verzögern im Kurvenbogen); das ist ein späteres Rennmodellthema.

## 4. Rotierende Laufräder und ihre Energie

Bisher:

`E_kin = 0,5 × m × v²`.

Mit rotierender Radträgheit:

`E_kin = 0,5 × m × v² + 0,5 × I × (v/r)² = 0,5 × (m + I/r²) × v²`

also:

**`m_eff = m + I/r²`**.

Bei fiktiven **m=80 kg**, **I=0,14 kg·m²** für beide Räder zusammen und **r=0,34 m** ergibt das **m_eff = 81,2111 kg**.

Die 1,2111 kg sind eine *äquivalente Beschleunigungsmasse*, **kein zusätzliches Gewicht**: Die Schwerkraft am Berg und die Normalkraft für die Reifenhaftung beruhen weiterhin auf der tatsächlichen Gesamtmasse 80 kg. Dieses Modell zeigt, warum schwere bzw. massenträge Laufräder bei häufigem Beschleunigen anders wirken können als ein gleich schwerer nicht rotierender Fahrradrahmen.

**Grenze:** Rotationsbeiträge von Antrieb/Kurbel, reale Laufrad-Massenträgheit, die Reifenaufstandsfläche und variable Radradien fehlen noch. Nicht als Kaufberatung für reale Laufräder verstehen.

## 5. Vollständig gerechnetes Mini-Beispiel

Ein fiktiver Fahrer (72 kg + 8 kg Rad/Ausrüstung, CdA=0,30 m², Crr=0,004, Luftdichte 1,20 kg/m³, η=0,975) startet mit **43,2 km/h**.

- 250 m gerade Zufahrt, 250 W Pedalleistung, danach Kurvenpunkt mit **15 m Radius**.
- Trockenbeispiel: μ=0,6, S=0,7; rechnerische Grenzgeschwindigkeit **28,30 km/h**.
- Erster messbarer Bremsvorgang im Modell ungefähr bei **236,93 m**, also rund **13,07 m vor der Kurve**. Die Einfahrt erfolgt mit **28,05 km/h**, ohne jeglichen Geschwindigkeitssprung an der Abschnittsgrenze.
- Nach dem Kurvenpunkt 350 m gerade, erneut 250 W; am Ende etwa **37,28 km/h**.
- Gesamtlänge 600 m; **berechnete Zeit 58,86 s**. Wirksame Beschleunigungsmasse **81,21 kg**.

Vergleich mit μ=0,4, sonst gleichen Parametern: maximal **23,11 km/h**, Einfahrtempo rund **22,81 km/h**; wegen des früheren bzw. stärkeren Bremsens steigt die Gesamtzeit dieses 600-m-Tests von **58,86 s auf etwa 60,77 s**.

**Diese Werte sind nur Ergebnisse des neuen, bewusst vereinfachten Prototyps.** Ob ein echter Rennfahrer so bremst, ist noch nicht durch Fahrdaten geprüft.

## 6. Tatsächlich lokal getestet

**14 von 14 neuen Tests bestanden** (Node.js 22.16, experimentelles TypeScript-Stripping), darunter:

1. Grenztempo aus Radius/Reibung; effektive Trägheitsmasse.
2. Vorausschauendes Bremsen und durchgängige Geschwindigkeit.
3. Engere Kurve, trockene/nasse Fahrbahn.
4. Schwereres Laufrad: geringere Beschleunigung; gleiche stationäre Gleichgewichtsgeschwindigkeit.
5. Mechanische Energiebilanz je Abschnitt.
6. Determinismus, Eingabevalidierung, unerreichbarer Kurvenpunkt (Fehler statt Teleportation).
7. Blick voraus über Abschnittsgrenzen, kleinere Zeitschritte, zweite Kurve hinter erster.

Der neue Kern wurde getrennt von den bisherigen R-01-/R-02-/Dynamiktests geprüft. **Noch kein vollständiger gemeinsamer Regressionstest auf allen alten Modulen und kein GitHub-Actions-Test.**

**Kleiner Node-Benchmark (kein Android-Test):** 160 isolierte Fahrer mit jeweils 600 m Demo-Kurs benötigten im lokalen Rechenlauf **rund 148 ms**. Das belegt **nicht**, dass 160 miteinander interagierende Fahrer über 200 km auf einem Smartphone entsprechend schnell berechnet werden können. Es ist noch keine gültige Hochrechnung, da Peloton und Renn-KI fehlen.

## 7. Nächste, noch offene Entscheidungen

- **Physikalischer Detailgrad der Kurve:** Kontrollpunkt als früher Prototyp oder später ein endlicher Kurvenbogen mit durchgehender Krümmung? **Empfehlung:** Für den späteren realistischen Pelotonbetrieb Kurvenbogen/Abstände ergänzen, fürs erste Physikfundament den Kontrollpunkt behalten.
- **Fahrerfähigkeit „Fahrtechnik“:** Wie verändert sie Wahrnehmung, Reaktionszeit, Linienwahl und Sicherheitsmarge? **Empfehlung:** Über tatsächlich erreichbare Positionen und Entscheidungen, **nicht** pauschal über Watt-/Siegerboni. Noch kein individuelles Skillmodell implementiert.
- **Nässe/Belag/Reifen:** Haftungsbeiwert später aus Zustand der Straße und den Reifen bestimmen. Zahlen 0,6/0,4 noch nicht als dauerhafte Spielstandards beschlossen.
- **Kombinierte Kräfte:** Spätere Kurvenphysik muss Bremskraft und seitlichen Grip gemeinsam begrenzen (Reibkreis). Im jetzigen Kontrollpunkt-Modell erfolgt Bremsen vor der Kurve; es ist **noch kein vollständiger Reibkreis im Kurvenbogen**.
- **Drehträgheit kalibrieren:** 0,14 kg·m² Beispiel für zwei Räder ist kein ermittelter Standardwert. Wahre Werte und Bedeutung von Rahmengewicht gegenüber Radmasse später prüfen.
- **Architektur vereinheitlichen:** Das Modul ist zunächst eigenständig statt die früheren R-01/R-02/Dynamik-API ungeprüft zu ändern. Vor R-03 in gemeinsame Rechenkernstruktur führen und die gesamte Testsuite ausführen.
- **Smartphone-Benchmark:** Echte 160 Fahrer/200 km mit Entscheidungen, Gruppendynamik, verschiedenen Situationen und Web Worker auf einem Android-Gerät messen. Der Node-Kurztest ist kein Ersatz.

## Quelle

Nee, P. J. & Herterich, J. G. (2022), *Modelling road cycling as motion on a curve*, Sports Engineering 25, 12. https://doi.org/10.1007/s12283-022-00376-3 – Open-Access-Arbeit mit dynamischer Kraftbilanz, Querbeschleunigungsgrenzen und vorausschauender Kurvenerkennung. **Unser Modell ist eine erheblich vereinfachte eigene Umsetzung, keine direkte wissenschaftliche Validierung.**
