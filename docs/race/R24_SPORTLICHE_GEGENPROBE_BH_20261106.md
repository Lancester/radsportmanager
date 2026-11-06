# R-24: Sportliche Einordnung von PR #84 – Boulogne und Hautacam (06.11.2026)

## Anlass und Setup
Vorausgehender Test [R24_NEGATIVE_BESCHLEUNIGUNG_AB_20261106.md](R24_NEGATIVE_BESCHLEUNIGUNG_AB_20261106.md) zeigt stärkere Gruppenbindung bei kontrollierten Geländeübergängen, aber deutlich veränderte Vollrennen. Der Versuch befindet sich **nur** auf `experiment/r24-negative-accel-fix-20261106`, [Draft-PR #84](https://github.com/Lancester/radsportmanager/pull/84). Die unveränderte Audit-Engine ist `develop/manager-mvp`.

Für diese Einordnung neue paarige Vollrennen (2 Profile × 3 Seeds × 2 Versionen = **12 Rennsimulationen**, 154 Fahrer pro Rennen, unveränderte CP/W′-/Aero-/Bewegungsmodelle; Attacken, Team-KI und Langzeitermüdung aktiv). Alle Paare nutzen jeweils denselben Strecken- und Fahrerdatensatz, Teamstrategien und Seed. Voller CI-Lauf: [GitHub Actions 42225833684](https://github.com/Lancester/radsportmanager/actions/runs/42225833684), alle drei parallelisierten Jobs **success**. Die Joblogs und die GitHub-Artefakte `r24-sport-impact-42`, `-123`, `-2026` enthalten die detaillierten Ausgaben (`R24_SPORT_AB`). Runner: `scripts/r24-sport-impact-ab.mjs` auf PR #84.

**Messbegriffe getrennt ausweisen:** `largestGroup` ist die größte räumlich zusammenhängende 42-m-Abstandsgruppe **irgendwo** auf der Strecke; `groupSizes[0]` ist die **führende** Gruppe. `within60` zählt Finisher innerhalb 60 s des Siegers. Eine große `largestGroup` bei km 205 kann daher mit einem entkommenen Solofahrer und weitgehend kompakten Verfolgern koexistieren.

## Ergebnisse über drei Seeds

Notation jeweils **Audit → Versuch**.

| Rennen | Seed | Sieger | Medianrückstand | innerhalb 60 s | `chase`-Ereignisse |
| --- | ---: | --- | ---: | ---: | ---: |
| Boulogne | 42 | F015 → F015 | 170,79 → 53,45 s | 26 → 94 | 276 → 171 |
| Boulogne | 123 | F015 → F078 | 56,96 → 68,55 s | 82 → 69 | 149 → 197 |
| Boulogne | 2026 | F078 → F134 | 123,54 → 101,87 s | 37 → 7 | 643 → 102 |
| Hautacam | 42 | F036 → F015 | 681,30 → 619,00 s | 2 → 14 | 177 → 89 |
| Hautacam | 123 | F078 → F134 | 833,95 → 803,82 s | 1 → 2 | 226 → 189 |
| Hautacam | 2026 | F078 → F015 | 705,85 → 908,23 s | 1 → 3 | 235 → 73 |

*Hinweis:* `chase`-Ereignisse zählen Intentwechsel bzw. protokollierte Jagdauslösungen und belegen keine eigenständigen physischen Führungsstints oder qualitative Jagdarbeit. Die unregelmäßige Zahlenspanne ist keine sportliche Sollgröße. Die 12 neuen Rennläufe umfassen 2026 erneut und sind **nicht 12 zusätzliche unabhängige Seeds**.

## Boulogne: 7 Finisher in 60 s – konkret erklärter Spezialfall

Seed 2026:
- Audit Sieger F078 (Sprinter), ein anderer Fahrertyp liegt direkt auf Platz zwei. Versuch Sieger **F134 (Kletterer)**; auf der echten steilen Schlusssequenz eines hügeligen Referenzprofils ist ein Sieg eines ausreichend starken Bergfahrers nicht automatisch unplausibel.
- Im Versuch startet F134 laut Ereignislog bei **km 200,78** eine Attacke. Bei Führungskilometer **205** liegt **eine Person vorn**, während die *größte nachfolgende* Abstandsgruppe **133 Fahrer** zählt. Audit bei km 205: führende Gruppe **37**, größte Gruppe **42**. Die 133 Fahrer sind **nicht die führende Gruppe**.
- Versuchs-Zielabstände: Platz 2 mit **+52,00 s**, Plätze 3–7 bei rund **+55 bis +60 s**; 98 weitere Fahrer mit +60 bis +119 s (Minuten-Bin 1). Das erklärt **7 innerhalb einer Minute**, obwohl viele Fahrer kompakt nachkommen. Kein Beweis eines allgemein zu kleinen Hauptfelds.
- Versuch F134 bei km 205 bereits mit ungefähr **51 % W′** (Checkpoint), im Ziel **3,30 kJ W′**; mit erkennbar geleisteter körperlicher Mehrarbeit. Diese Messungen beweisen keine individuelle Kausalität, machen einen rein kostenlosen Positionssprung aber unwahrscheinlich.
- **Verbleibende Frage:** Sind +52 s Solo-Vorsprung nach dieser Schlussphase sportlich und physiologisch richtig kalibriert? Kein empirischer Referenzabgleich mit echter vergleichbarer Fahrerqualität. F134 gewinnt in Audit Seed 2026 nicht, obwohl sein Profil stark ist.
- Im Seed 42 ändert sich die Zahl innerhalb 60 s dagegen **26→94**, im Seed 123 **82→69**. Auch die Siege und Favoriten reagieren seedabhängig. **Kein systematischer Befund, dass der Fix stets größere Zielabstände erzeugt.**

## Hautacam: unterschiedliche Effekte und große Streuung

- Seeds 42/123: Medianrückstand verbessert sich **681→619 s** bzw. **834→804 s**. Seed 2026: Verschlechterung **706→908 s**.
- Seed 42 gewinnt bei beiden Versionen ein Kletterer; in der Variante sind alle zehn Top-10-Fahrer Kletterer. Das stimmt mit dem Profil grundsätzlich überein, beweist aber keine korrekte Leistungs-/Teamkalibrierung.
- Bei Seed 2026 bleibt das Führungsfeld bei km 30 statt 53 nun **139 Fahrer**, also weniger voreilige Fragmentierung. Bei km 180 ist die **größte** Abstandsgruppe 26→39, während das über den gesamten aktiven Rest verteilte 1D-Feld eine Spanne von ungefähr **11→16 km** erreicht. Große Feldspannung bleibt trotz besserem frühem Zusammenhalt möglich und ist gerade am Berg nicht aus einem einzelnen Wert sportlich zu bewerten.
- Alle drei Seeds haben in der Variante weniger dokumentierte Jagdereignisse (177→89, 226→189, 235→73). **Dies kann mit stabileren Gruppen und seltener ausgelösten Aufträgen zusammenhängen, ist aber noch keine kausale Bestätigung oder Bewertung der Team-KI.**

## Technische Grenze

- **Die korrigierte lokale Referenz ist wirksam:** bereits durch 3-Seed-Kontrollversuche belegt und in Vollrennen mit anders zusammengesetzten Gruppen sichtbar.
- Die Korrektur ist **nicht automatisch sportlich falsch**, nur weil Sieger, Zielzeitgruppen oder die Medianrückstände stark reagieren. Beispiel Boulogne 2026: 133er Verfolgergruppe hinter dem Solosieger erklärt einen wesentlichen scheinbaren Widerspruch.
- Umgekehrt ist das starke A/B-Verhalten auch **keine Sportfreigabe**: Mehrfach entstehen sehr weite Feldspannungen und die Jagd-/Attackenereignisse verändern sich substanziell; reale Kalibrierung und taktischer Konsistenzcheck fehlen.
- Die 1D-Gruppenrepräsentation kann 154 Fahrer innerhalb weniger Meter abbilden; **physisch realistische Packgeometrie** wird so nicht nachgewiesen. Nicht Zielgruppen künstlich zusammenziehen und keine Sieger-/Zeitvorgaben in den Kern einbauen.

## Empfehlung und Entscheidung

**PR #84 vorerst als vielversprechenden, aber nicht validierten Diagnose-Fix behalten; nicht mergen.** Die erste Kritik „7 innerhalb 60 s = schlimmere Peloton-Fragmentierung“ trifft auf Boulogne Seed 2026 **nicht** zu. Die jetzige Stichprobe ist jedoch zu klein, um die allgemeine sportliche Plausibilität zuverlässig zu bewerten.

Für den Weg zum spielbaren Manager: Spätestens jetzt fachliche Begrenzung setzen. Zwei saubere Optionen: (1) Nur wenn notwendig ein *einmaliger* kurzer Abnahmetest mit weiteren Seeds/Standardkennzahlen, besonders erste echte Lücke, führende vs. größte Gruppe, Winner-Favoriten und physische Jagdstints, dann entscheiden; (2) die aktuelle Audit-Engine als begrenzte MVP-Grundlage belassen und die Rennkohäsion als bekannte Schwäche markieren, um nicht weiter in komplexe Feinabstimmung zu versinken. **Keine weitere KI-Architektur, keine neuen Heuristiken pro Streckenprofil.**
