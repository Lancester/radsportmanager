# R-22: Physikalische Bergprüfung und gezielte Kletter-KI

**Datum 04.11.2026; Status:** unabhängige Physikprüfung abgeschlossen, KI weiterhin experimentell; nach Abschluss jedes PR-CI-Laufs aktualisieren. Gilt nur für `groupRidingModel:'stable-pack'`; der bisherige Standard `legacy` und die Physikmodule bleiben unverändert.

## 1. Ausgangsproblem und Prüfung vor jeder KI-Korrektur

Aus den vier kleinen Referenzrennen (PR #64) gewann der fiktive Sprinter F093 sowohl Liège–Bastogne–Liège als auch die Hautacam-Bergankunft, obwohl auf beiden Strecken keine eigene Attacke erfasst wurde. Es musste erst geklärt werden, ob Masse/Steigung/CP/W′ im Rechenkern falsch umgesetzt sind.

**Physikalischer Ansatz** (vgl. Martin et al., *Validation of a Mathematical Model for Road Cycling Power*, J Appl Biomech 1998, DOI 10.1123/jab.14.3.276, https://pubmed.ncbi.nlm.nih.gov/28121252/):

`P_Kurbel = v / η × [m·g·(sin(atan(Steigung)) + Crr·cos(atan(Steigung))) + 0,5·ρ·CdA·AeroFaktor·v²]`

Der effektive Beschleunigungswiderstand berücksichtigt im tatsächlichen `advanceMotionStep()` ebenfalls rotierende Laufradträgheit, wenn diese parametrisiert wird. Das `rider`-Profil der Einzelrennen benutzt dabei keine zusätzliche Radträgheit (standardmäßig 0). Der 1D-Gruppenwindschutz reduziert **nur den aerodynamischen Anteil**, nicht die Schwerkraft. `critical-power.ts` trennt Critical Power und W′; `endurance.ts` ist eine zusätzliche, ausdrücklich **vorläufige** Langzeit-Wattbegrenzung.

## 2. Rechnerische und dynamische Gegenprobe

`tests/r22-climb-physics.test.mjs` prüft die Leistungsbilanz unabhängig mit einer separat implementierten stationären Gleichung **gegen den vorhandenen echten Bewegungsintegrator**. Vier Kontrollgruppen:

1. Statik/Dynamik: 7,8 % Steigung, bei konstanter CP und ohne Wind, Übereinstimmung der Endgeschwindigkeit innerhalb 0,03 km/h.
2. Dynamische 13,5-km-Bergetappe: Kletterer und GC-Fahrer gewinnen anhand echter Masse/Leistung deutlich gegen Sprinter, ohne Reifen-/Zeitbonus.
3. Steigung gegenüber Ebene und Windschatten: Gravitationsarbeit stimmt mit m·g·sin(atan(Steigung)) überein; Windschatten reduziert nur Luftenergieverluste, **nicht** Höhenarbeit.
4. CP/W′: oberhalb CP werden Joule aus der begrenzten W′-Reserve entnommen, bei Unterschreiten CP kann sie konservativ regenerieren; wenn W′=0, keine Power über CP.

Die verwendeten **fiktiven** Mittelprofile (R-22-Referenzdaten) ergeben für 7,8 % bergauf bei voller, unveränderter CP und Luftwiderstand ohne Windschatten näherungsweise:

| Profil | Gesamtmasse | Critical Power | stationäre Geschwindigkeit |
| --- | ---: | ---: | ---: |
| Sprinter | 87,9 kg | 381,3 W | 17,9 km/h |
| Kletterer | 70,9 kg | 354,1 W | 20,1 km/h |
| GC | 71,5 kg | 388,6 W | 21,6 km/h |

**CI #41797896614**: **268/268 Tests grün**, einschließlich vier neuer Bergphysik-Tests. Physischer Code nicht verändert.

**Bewertungsgrenze:** Das beweist innere Konsistenz der vereinfachten Physik, **keine vollständige externe Kalibrierung** einer professionellen Bergfahrt. Insbesondere absolute CP, die R-19-Ermüdung, Höhe/Luftdichte, 1D-Gruppe, synthetische Übergänge der Rennprofile und die Leistungssteuerung im Renntempo bleiben Modellannahmen. Die häufige Nutzung eines an der tatsächlichen Gruppe führenden Fahrers als alleinige Geschwindigkeitsreferenz war dagegen ein konkreter **KI-Plausibilitätsmangel**.

## 3. Isolierte Kletter-KI – nur experimental stable-pack

`src/engine/race/climb-tempo.ts`: Ein Kletterer/Klassementfahrer kann am Berg **aus eigener physisch verfügbarer Kurbelwatt** schneller als der Pacesetter fahren, statt bloß dessen Geschwindigkeit zu übernehmen. Explizite Bedingungen: nennenswerte Steigung, ausreichend langer Anstieg, innerhalb des tatsächlich zusammenhängenden Feldes, innerhalb begrenzter Distanz zur physischen Gruppenfront, Reserve vorhanden und kein Sprint/Angriff/Erholungs- oder Team-Jagdauftrag. Die nötige Leistung zur Fahrt bei Gruppengeschwindigkeit wird **unabgeschirmt** berechnet. Nur wenn die nachhaltige eigene Leistung diesen Bedarf um mindestens einen kleinen Puffer übertrifft, wird eine eigene höhere Wattanfrage an den bestehenden Physik-/CP/W′-/R-19-Kern gestellt.

Der Regler erzeugt **keine** Geschwindigkeits-, Positions-, Energie- oder Zeitgutschrift und ändert nicht die normale Feldregelung. Physisch zu stark geforderte Fahrer müssen selbst aus ihrer W′-/Endurance-Reserve bezahlen oder bleiben zurück.

`tests/r22-climb-tempo.test.mjs` prüft: CP-Begrenzung, kein Flachbonus, keine Begünstigung schwerer Sprinter, keine Überholhilfe ohne tatsächlichen Wattüberschuss und keine zusätzlichen Automatismen während Sprint/Attacke/Erholung.

## 4. Tatsächlich durchgerechnete kleinere Iterationen (je vier Profile × Seed 2026)

| Versuch / GitHub Actions | Lille: größte Gruppe, Rückstand | Boulogne: Gruppe, Rückstand | Lüttich: Gewinner, Gruppe, Rückstand | Hautacam: Gewinner, Gruppe, Rückstand |
| --- | --- | --- | --- | --- |
| Baseline PR #64, [#41796481506](https://github.com/Lancester/radsportmanager/actions/runs/41796481506) | 86 / 15,77 s | 32 / 63,24 s | Sprinter / 46 / 706,93 s | Sprinter / 12 / 1351,80 s |
| A: jede Steigung ab 5,5 %, [#41798294519](https://github.com/Lancester/radsportmanager/actions/runs/41798294519), **271/271 grün** | 115 / **78,34 s** (Flachverschlechterung) | 22 / 122,16 s | Sprinter / 21 / 503,23 s | Kletterer / 4 / 657,48 s |
| B: nur Anstiege ab 3 km, [#41798829969](https://github.com/Lancester/radsportmanager/actions/runs/41798829969), **271/271 grün** | **86 / 15,77 s unverändert** | **32 / 63,24 s unverändert** | Sprinter / 31 / 520,72 s | **Kletterer / 2 / 0,0 s** |

**Schluss:** Die Kletterregel kann physikalisch plausibel den Bergsieger beeinflussen, ist aber zu breit für kurze Hügel; deshalb Variante A verworfen. Variante B schont Lille/Boulogne, hinterlässt jedoch starke Kleingruppenbildung auf Hautacam (**44 maximale Abstandsgruppen**, statt 25 in der Baseline) und eine späte Auswahl, bei der nur zwei Fahrer in der Sieger-Zielgruppe ankommen.

## 5. Drei weitere klein dosierte Berg-KI-Varianten – echte Resultate

Alle drei Varianten verlangen **mindestens 5 km langen Anstieg**, **mindestens 5,5 % Steigung** und einen tatsächlich innerhalb seiner Gruppe fahrenden Kletterer/Klassementfahrer mit Rolle **`kapitaen`**. Der gesamte Geschwindigkeits- und Energiegewinn wird ausschließlich aus eigener Pedalleistung über den unveränderten Rechenkern gefahren.

| Version / Actions | Maximale zusätzliche Wattanfrage zum ungeschützten Mitfahren | Nachhaltige CP-Grenze | Hautacam größte Zielgruppe + Rückstand | Fahrer binnen 60 s | Max. Abstandsgruppen | Top-10-Fahrertypen |
| --- | ---: | ---: | --- | ---: | ---: | --- |
| C [#41799290398](https://github.com/Lancester/radsportmanager/actions/runs/41799290398), **271/271** | bis zu 80 W | 98 % CP | **4 Fahrer / 299,09 s** | 2 | 36 | **Plätze 1–4 Kletterer** |
| D [#41799737582](https://github.com/Lancester/radsportmanager/actions/runs/41799737582), **271/271** | bis zu 45 W | 96 % CP | 7 Fahrer / 16,13 s | 21 | 38 | Sieger Kletterer, viele Allrounder/Zeitfahrer |
| E [#41800109314](https://github.com/Lancester/radsportmanager/actions/runs/41800109314), **271/271** | bis zu 60 W | 97 % CP | 9 Fahrer / **1230,74 s** | 2 | 34 | Sieger Kletterer, drei weitere Kletterer in Top 10 |

**In ALLEN drei Fällen** bleiben Lille, Boulogne und Lüttich **exakt unverändert** im Vergleich zu PR #64 (Lille 86 Fahrer / 15,77 s; Boulogne 32 / 63,24 s; Lüttich Sprinter / 46 / 706,93 s). In allen drei Fällen gewinnen auf Hautacam keine Sprinter mehr; die sportliche Zusammensetzung/Abstände der Siegergruppe variiert aber stark.

**Begründete vorläufige Auswahl: Version C.** Im ersten einfachen Seed 2026 erzeugt sie die stärkste glaubhafte Bergfahrer-Selektion (Top 4 Kletterer), ohne die drei anderen Etappenarten anzutasten. Die weiche Variante D lässt 21 Fahrer innerhalb einer Minute bei deutlich schwächerer Kletterdominanz ankommen; Variante E macht die größte Gruppe wieder 20,5 Minuten hinter dem Sieger, vergleichbar dem alten Problem. Beides sind ernsthafte Nachteile. Aus diesen Zahlen allein lässt sich keine allgemeine Sportrealismus-Güte oder optimale Taktik ableiten.

**Unverändert problematisch:** Hautacam hat noch 36 maximale Distanzgruppen (ursprünglich 25), obwohl ein langes Bergprofil selektiv sein darf; der Sieger liegt erheblich vor der größten Zielgruppe. Lüttich bleibt mit Sprintersieg, vier Sprintern auf den ersten vier Plätzen und großen Abständen unplausibel; dort sollte später eine separate Klassiker-/Puncheur-KI analysiert werden, statt die Bergpass-Regel blind auf 1-km-Hügel zu kopieren. Boulogne zeigt weiterhin 108 Attacken. Auch das ist nicht Teil dieses isolierten Bergphysik-Pakets.

## 6. Auswahl und nächste Schritte

Die **auf die Bergkapitäne begrenzte Version C** ist im Quellcode wiederhergestellt:
`minimumClimbLengthM=5000`, `minimumGrade=0.055`,
`sustainedCpFraction=0.98`, `maximumBoostW=80`,
weiterhin nur `stable-pack`, kein Default-Wechsel. Damit können GC-Fahrer auf langen Pässen physisch selbst Tempo machen, ohne zeitliche oder positionale Sonderbehandlung.

Nach einer finalen grünen PR-CI erfolgt die Aufnahme als **experimenteller Schritt** in `main`. R-22 ist ausdrücklich nicht abgeschlossen. **Als nächstes** zuerst die Klassiker-/Puncheur-KI für Lüttich in einem separaten kleinen Testschritt untersuchen; Boulognes Attackenhäufigkeit sowie Hautacams Gruppenverteilung getrennt diagnostizieren. Erst am Ende eine größere, bewusst manuelle Mehrseed-Validierung. Kein neuen Physikkern bauen, keine Karriere, keine R-23-Freigabe.
