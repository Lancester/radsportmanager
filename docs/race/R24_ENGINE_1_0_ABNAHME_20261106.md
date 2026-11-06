# R-24 – Rennengine-1.0-Abnahmetest (06.11.2026)

**Gesamturteil: technische Abnahme bestanden, sportliche Abnahme noch NICHT vollständig bestanden. PR #84 nicht mergen.** Die neue Gruppenreferenz ist aussichtsreich und verbessert das Problem des künstlichen Feldzerfalls, aber es bleiben konkrete Kalibrierungspunkte bei Sprintteam-Führungsarbeit und Klassikern. Dieses Ergebnis ist keine Freigabe des Managers oder der Engine 1.0.

## Teststand und Reproduzierbarkeit

- Testscript `scripts/r24-engine-acceptance.mjs` und Workflow `.github/workflows/r24-engine-acceptance.yml` auf [Draft-PR #87](https://github.com/Lancester/radsportmanager/pull/87), Branch `experiment/r24-engine-acceptance-20261106`.
- **Audit:** `develop/manager-mvp` (unveränderte bisherige Modellbasis); **Versuch:** [Draft-PR #84](https://github.com/Lancester/radsportmanager/pull/84), lokale Beschleunigungsreferenz in `src/engine/race/local-group-reference.ts`.
- Vergleich `develop/manager-mvp` → PR #84 zeigt **nur eine einzige modifizierte Engine-Quelldatei**: `src/engine/race/local-group-reference.ts`; sonst hinzugefügte Tests/Skripte/Workflows, keine Änderungen an CP/W′, Rennsimulation, Team-KI oder Aero.
- Beide Checkouts erhalten im Workflow denselben rein passiven Diagnose-Simulator aus [Draft-PR #85](https://github.com/Lancester/radsportmanager/pull/85). `peloton-chase.ts` und `race-simulator.ts` werden vor dem Start bytegenau verglichen; der lokale Referenzunterschied wird geprüft.
- Vier fixe Seeds **42, 123, 314, 2026**; vier profiltypische Referenzstrecken **Lille 184,9 km (flach)**, **Boulogne 209,1 km (hügelig)**, **Liège–Bastogne–Liège 252 km (Klassiker)** und **Hautacam 180,6 km (Berg)**. Jeweils **154 fiktive Fahrer / 22 Teams**, gleiche Startbedingungen und Rennstrategie pro A/B-Paar; Angriffe, Team-KI, Ermüdung, CP/W′, Formation und Windschatten aktiv.
- **16 eindeutige Seed×Strecken-Paare**, also **32 verschiedene A/B-Rennsimulationen** pro Durchlauf. Erste technische Ausführung [Actions #42236615692](https://github.com/Lancester/radsportmanager/actions/runs/42236615692), 4/4 Jobs erfolgreich. Zwei Fehler **im Messskript**, nicht in der Rennengine, wurden korrigiert (Median fälschlich als null und Erfolg einer Attacke fälschlich relativ zur aktuellen Rennspitze statt zur ursprünglichen Gruppe). Komplette 32 Simulationsläufe mit korrigierten Metriken nochmals ausgeführt: [Actions #42237671835](https://github.com/Lancester/radsportmanager/actions/runs/42237671835), **4/4 Jobs erfolgreich**. Die Wiederholung ist **kein zusätzlicher unabhängiger Seed**.
- Rohdaten aller korrigierten Paare: Actions-Artefakte `r24-engine-abnahme-42`, `-123`, `-314`, `-2026`, Retention 14 Tage. Das GitHub-Workflowprotokoll und dieser Bericht sind längerfristig nachvollziehbar.
- Die vier Profile sind ausdrücklich **synthetische Übergangsmodelle mit veröffentlichten Strecken-/Anstiegs-Eckdaten, keine GPX-exakten historischen Rennen**. Fiktive Fahrer, keine tatsächliche Favoritenliste der 2025er Profis. Aggregation erfolgt über nur vier Seeds; Abweichungen weder überinterpretieren noch auf echte Ausfall-/Siegwahrscheinlichkeiten übertragen.

## Technische Gates – bestanden

- **32/32 Rennsimulationen** der korrigierten Abnahme beendet und 154/154 Fahrer klassiert.
- **0** Verletzungen der geprüften Werte-Invarianten (einmalige Fahrer-IDs, endliche mittlere Watt und W′-Endwerte, W′-Endwert nicht negativ, endliche Ausdauer-Verfügbarkeit im Bereich 0–1).
- Gepaarte identische Szenarien reproduzierbar; keine heimliche Positions-/Geschwindigkeits-/Sieg-Gutschrift.
- Angriffstelemetrie zeigt real angeforderte und angewandte Leistung über effektiver CP. Eine mehr als 42 m lange Trennung von der **ursprünglichen Gruppe** nach 5 km ist für manche Angriffe tatsächlich nachweisbar.
- Die gruppierte Jagdtelemetrie misst echte Kurbelarbeit/physische Windexposition – **an Fronten der lokalen 42-m-Gruppen**, nicht zwangsläufig nur am Hauptfeldkopf.

## Sportliche Hauptkennzahlen

Je Eintrag **Mittelwert über vier Seeds**, `Audit → PR #84`. `größte Gruppe` meint den letzten 5-km-Checkpoint nahe dem Ziel und ist nicht zwangsläufig die *führende* Gruppe.

| Prüfgröße | Lille (flach) | Boulogne (Hügel) | Lüttich (Klassiker) | Hautacam (Berg) |
| --- | --- | --- | --- | --- |
| Sieger-Fahrertypen Audit | 3× Sprinter, 1× Kletterer | 3× Kletterer, 1× Sprinter | 3× Kletterer, 1× Allrounder | 4× Kletterer |
| Sieger-Fahrertypen PR84 | 3× Sprinter, 1× Kletterer | 3× Kletterer, 1× Sprinter | **4× Kletterer** | 4× Kletterer |
| Sprinter unter Top 10 | **5,8 → 6,5** | 0,8 → 0,5 | 0 → 0 | 0 → 0 |
| Kletterer unter Top 10 | 1,8 → 1,8 | 1,8 → 2,3 | **2,5 → 4,3** | 7,5 → **9,0** |
| Größte Gruppe nahe Ziel | **101,8 → 129,5** | **77,3 → 120,3** | 30,3 → 28,3 | 24,8 → 31,5 |
| Median-Zielrückstand, s | **41,8 → 21,8** | **124,5 → 72,7** | **530,1 → 714,7** | 790,9 → 853,1 |
| Finisher innerhalb +60 s | 106,3 → **138,0** | 37,5 → **60,0** | 3,5 → 7,5 | 1,8 → 5,8 |
| Attacken registriert | 25,5 → 27,0 | 49,3 → 49,5 | 66,8 → 70,5 | 53,5 → 54,8 |
| Angriffe mit >42 m Abstand zur ursprünglichen Gruppe nach 5 km | 1,5 → 1,5 | 5,0 → 3,5 | 8,8 → 5,8 | 5,3 → 5,3 |
| Jagdauftrag an windoffener Abstandsgruppenfront, Fahrer-s | 5338 → 4111 | 4705 → 2493 | 6466 → 7070 | 7058 → 4241 |
| Median Ausdauer-Leistungsverfügbarkeit bei Zieleinlauf | 100 → 100 % | 100 → 100 % | 94,9 → 95,2 % | 93,7 → 94,2 % |

**Die Größen sind keine direkten Realprofi-Kalibrierziele.** Ein kleinerer Zielmedian kann aus einer stärker zusammenhängenden Verfolgergruppe hinter einem Solosieger entstehen. Mehr tatsächliche Gruppenarbeit ist nicht per se besser. Für 42-m-Kohäsion sind Führungsgruppe und größte Gruppe stets getrennt zu betrachten.

## Bewertung nach Profil

### Lille – vorläufig positiv, aber Sprintteam-Arbeit auffällig kurz

- PR84 verbessert die größte Gruppe bei Zielnähe deutlich (101,8→129,5) und erhöht die Anzahl der Sprinter in den Top 10 (5,8→6,5). 3/4 Sieger sind in beiden Versionen Sprinter; der vierte Seed 123 wird weiterhin von einem Kletterer gewonnen. Dies kann ein Außenseitersieg sein, kein automatischer Fehler.
- **Echter Sprintteam-Frontbeleg ist kurz:** Der spezielle `namedChaseLeader`-Audit misst in den PR84-Lille-Seeds als jeweils längsten ununterbrochenen, exponierten CP-nahen Abschnitt nur **11 s (Seed 42), 23 s (123), 117 s (2026), 10 s (314)**. Die allgemeinere Jagdwindfrontmessung (auch andere Abstandsgruppen) hat maximal 271 s. Damit ist die früher gewünschte realistische **lange Führungsarbeit mit stabilen Einzelhelfer-Stints** nicht nachgewiesen und bedarf einer begrenzten, gezielten Prüfung. Keine garantierten 15–20 Minuten für jedes Rennen erzwingen.
- Physische Teamarbeit ist vorhanden, aber unterschiedliche Rollen, Sprintzug und Feldjagd sind getrennt zu messen. PR84 nicht allein wegen großer Gruppen freigeben.

### Boulogne – vorläufig positiv, mit erwarteter Varianz

- Größte Gruppe nahe Ziel 77,3→120,3, Medianrückstand 124,5→72,7 s; Jagdarbeit wird in vielen, aber nicht allen Seeds geringer.
- Siegerverteilung insgesamt gleich (3 Kletterer/1 Sprinter). Besonders in Seed 2026 fährt F134 nach einer echten späten Attacke als Solosieger vor einer großen 133er Verfolgergruppe; nur 7 Fahrer innerhalb 60 s ist **kein Beleg für zerfallendes Hauptfeld**.
- Der Rückenwind-/Abstandsnachführkonflikt ist besser, aber das Feld bleibt im 1D-Modell geometrisch stark komprimiert.

### Lüttich – sportliche Kalibrierung offen / Warnsignal

- Alle vier PR84-Seeds werden von Kletterern gewonnen, die Klettererquote in den Top10 steigt von 2,5 auf 4,3. Bei den synthetischen Anstiegen ist Kletterer-Erfolg plausibel, aber eine überstarke systematische Begünstigung der Kletterer gegenüber Klassikerfahrern muss geprüft werden; der heutige Test allein ist kein empirischer Beweis.
- Medianrückstand steigt **530→715 s**, d. h. die Verteilung zieht sich trotz ungefähr gleich großer Abstandsgruppen im Zieleinlauf deutlich auseinander. Seed 123: **435→796 s**. Dies ist ein ernstzunehmendes Kalibrierungssignal, nicht zwingend ein Fehler in der Beschleunigungsregel.
- Die Zahl der dauerhaft >42 m abgesetzten ursprünglichen Angreifer nach 5 km sinkt im Mittel 8,8→5,8, während registrierte Fluchten über `breakaway`-Ereignisse zunehmen (6,5→11,0). Die beiden Metriken messen **unterschiedliche Dinge** (ursprüngliche Gruppenzugehörigkeit vs. erkannte Fluchtlage); nicht als Widerspruch oder reales Scheitern einer bestimmten Attacke verkaufen.

### Hautacam – Bergselektion technisch und sportlich grob plausibel

- 4/4 Kletterersieger in beiden Versionen; PR84 9/10 statt 7,5/10 Kletterer unter den Top10.
- Frühes unmotiviertes Zerfallen ist reduziert, echte Selektion bleibt bestehen. Größte Zielnähegruppe 24,8→31,5; Medianrückstand 791→853 s, mit streuenden Seeds. Ob zu große Selektion entsteht, braucht externe Vergleichsmaßstäbe, aber keine Engine-Invariante wird verletzt.

## Freigabebeschluss

**PR #84 bleibt ein sinnvoller Kandidat, aber keine endgültige Rennengine-1.0-Freigabe. Nicht zusammenführen.**

**Zwei prioritäre, begrenzte offene Abnahmefragen:**

1. **Flache Sprintteamjagd:** Die exponierten CP-nahen Front-Stints sind teilweise nur 10–23 s. Zunächst unterscheiden, ob nominierte Helfer die Front nicht erreichen, ob Arbeit durch lokale Regeln zu häufig rotiert, oder ob schlicht keine verfolgungswürdige Spitze mehr besteht. Kein pauschaler Watt- oder Positionsbonus. Nur bei kausalem Fehler kleiner Fix und 4-Seeds-A/B-Gegenprobe.
2. **Klassikerprofil und Zielzeitstreuung:** Lüttich über die Checkpoints/Ermüdung/Attacken überprüfen, ob vergrößerte Rückstände eine physikalisch nachvollziehbare Selektion oder ein Modellfehler sind. Wenn kein eindeutiger Fehler, als Kalibrierung für später dokumentieren, nicht auf konkrete Gewinner trimmen.

**Weitere Einschränkungen:** Individuelle vor dem Rennen vorhergesagte Topfavoriten und ihre *exakten* Schlussplatzierungen wurden im jetzigen Runner nicht als eigenständiger Score ausgewertet; nur Fachtypen/Top-10-Profil, Sitzungs- und Gruppentelemetrie. Vier Seeds liefern keine robusten Profiradsport-Wahrscheinlichkeiten. Außerdem bleiben echte Etappen-Rennprofile ohne GPX-exakte Übergänge und 1D-Feldgeometrie ein bewusstes Grundmodell.

**Sicherungsstatus:** Engine-Code auf `main` und `develop/manager-mvp` unverändert. Die Dokumentation, Runner, Rohdaten, PR #84 und PR #87 sind für spätere Chats referenziert. Nächster Schritt ist **keine neue Managerfunktion**, sondern die zwei obigen begrenzten Abnahmefragen.
