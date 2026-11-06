# R24 – Schlussprüfung Zielgruppen, Ergebniszeiten und absolute Kalibrierung (06.11.2026)

## Kernergebnis

**Die letzte begrenzte Engine-Abnahme ist erfolgreich durchgerechnet, aber die absoluten Rennzeiten sind noch nicht historisch genau kalibriert.** Die Engine kann als **grober Releasekandidat für ein manuell spielbares Browser-Einzelrennenlabor** verwendet werden. Ein Anspruch auf minutengenaue historische Rekonstruktion oder amtlich exakte Tour-Zeitwertung wäre falsch.

- Originale Physikresultate `RaceClassification.finishTimeS` und `gapS` bleiben unangetastet. Das neue isolierte Postprocessing `src/engine/race/finish-time-groups.ts` auf [Draft-PR #90](https://github.com/Lancester/radsportmanager/pull/90) ergänzt **gutgeschriebene** Gruppenzeiten, ohne einen einzigen Simulationsschritt zu verändern.
- [Actions #42244065657](https://github.com/Lancester/radsportmanager/actions/runs/42244065657): **4/4 CI-Jobs erfolgreich**, vier Seeds (42, 123, 314, 2026) × vier Referenzprofile × zwei Engineversionen = **32 vollständig abgeschlossene Rennläufe**, 154 Fahrer pro Rennen. 16 unabhängige Seed-Strecken-Paare; Vergleich PR84 vs Audit ist gepaart.
- Zusätzliche Unit-Tests: Kettengruppen (jeder Abstand zum unmittelbaren Vorfahrer), 1s und 3s, Ende genau bei Schwelle, Abschneiden auf volle Sekunden, unveränderte Reihenfolge/Rohzeiten, ungültige/duplizierte Fahrer. Der erste CI-Durchlauf scheiterte an einer falschen Test-Erwartung (104s-100s = 4s, nicht 3s); der zweite an der ungültigen Runner-Angabe `diagnosticLevel:'none'`. Beide Fehler betrafen ausschließlich Testskript/Fixture. Erst der dritte Durchlauf hat alle Tests und Rennläufe erfolgreich abgeschlossen; **die Engine war in allen drei Runden unverändert**.

## Zeitgruppenregeln (Rennresultat, nicht Rennphysik)

Das Modell lag bisher bei jeder Zielüberfahrt auf einer individuellen Zeit inkl. `gapS`. Für den Radsport ist jedoch erforderlich:

- Nach UCI werden nachfolgende Fahrer mit einer Lücke unter 1s zur jeweils unmittelbar vorherigen Zielüberfahrt in **dieselbe Zielgruppe** eingruppiert. Die Zeit dieser Gruppe ist die Zeit des ersten Fahrers. Bei Etappen, für die der Veranstalter das Sprintzonen-/Sprintgruppenprotokoll bestimmt (TdF 2025 **Etappe 1 Lille**), galt eine 3-s-Gruppenlücke; normale Etappen, Lüttich und Hautacam: 1s. Zeiten werden für offizielle Wertung auf volle Sekunden **abgerundet**. Rangfolge und individuelle Zielzeit bleiben erhalten.
- Implementierung: `scoreFinishGroups(finishers,'road-1s'|'bunch-3s')`, die Daten je Fahrer enthalten `rawGapS`, `creditedTimeS`, `creditedGapS`, `finishGroup`, `finishGroupSize` und `finishGroupLeaderId`; kein Eingriff in `simulateRace()`.
- **Explizite Grenze**: Drei-Sekunden-Sprintprotokoll kann eindeutig etablierte Fluchtgruppen ausnehmen; eine reine Liste der Zielüberfahrten enthält diese Rennenlage nicht sicher. Der jetzige 3-s-Modus ist daher ein **vereinfachtes Anzeige- und Bewertungsmodell**, nicht der offizielle vollständige UCI-Zeitnahmeservice. Rennberichte müssen „provisorische Gruppenwertung“ anzeigen. Zeitgutschriften, Juryentscheidungen, Sturz-/3-km-Ausnahmen, OTL und GC werden nicht berechnet.

Quellen: UCI Straßenrennen-Regeln und Sprintzonenprotokoll https://www.uci.org/regulations/3MyLDDrwJCJJ0BGGOFzOat ; Tour-de-France-Reglement 2025 (Artikel 14 Zeitnahme) https://www.xoo-cycling.ch/download/regulations/regulations_tour-de-france_2025.pdf

## Absolute Rennzeit gegen tatsächliche Siegerzeiten aus 2025

**Mittel über vier Seeds, gleiche fiktive Fahrer pro Paar; Werte in Sekunden relativ zur realen Siegerzeit. Positiv = Simulation langsamer.** Die Referenzkurse enthalten modellierte Übergänge, also sind nicht GPX-genau; reale Sieger und Startlisten sind andere Fahrer.

| Strecke | Historische Siegerzeit | Audit Fehler | PR84 Fehler | PR84 relativ |
| --- | --- | ---: | ---: | ---: |
| TdF 2025 Lille (flach) | **3:53:11** | **+658s (+10:58)** | **+658s (+10:58)** | **+4,70 % langsamer** |
| TdF 2025 Boulogne (Hügel) | **4:45:41** | **−41s (−0:41)** | **−142s (−2:22)** | **−0,83 % schneller** |
| Lüttich 2025 (Klassiker) | **6:00:09** | **−487s (−8:07)** | **−794s (−13:14)** | **−3,67 % schneller** |
| TdF 2025 Hautacam (Berg) | **4:21:19** | **+773s (+12:53)** | **+579s (+9:39)** | **+3,69 % langsamer** |

Historische Zeiten:
- Lille https://www.rte.ie/sport/results/cycling/tour-de-france/895458/results/4666782/
- Boulogne https://www.rte.ie/sport/results/cycling/tour-de-france/895458/results/4666783/
- Lüttich https://www.rte.ie/sport/results/cycling/liege-bastogne-liege/895815/
- Hautacam https://www.bbc.co.uk/sport/cycling/articles/c1e01p369nwo

**Wichtige Interpretation:** Es gibt keine einheitliche Abweichungsrichtung. Ein globales Geschwindigkeitstuning würde Lille/Hautacam zwar beschleunigen, aber Lüttich/Boulogne unrealistisch schneller machen. Abweichungen können aus synthetischen Streckenübergängen, Luft-/Roll-/Steigungsmustern, modellierten Teamtaktiken und fiktivem Fahrerfeld entstehen. Nicht per Strecken-ID korrigieren. Die Werte sind **Kalibrierungswarnungen, keine nachgewiesenen Physik-Bugs**.

## Auswirkung der Gruppenwertung

Mittel über vier Seeds, `Audit → PR84`:

| Profil | Anzahl gewerteter Zielzeitgruppen | Größte Zielzeitgruppe PR84 | Median Roh-Rückstand PR84 | Median Gruppen-Rückstand PR84 |
| --- | --- | ---: | ---: | ---: |
| Lille | 5,5 → **5,0** | 120,3 | **21,8 s** | **10,8 s** |
| Boulogne | 43,8 → **34,5** | 29,5 | **72,7 s** | **71,5 s** |
| Lüttich | 36,3 → **31,0** | 18,3 | **714,7 s** | **713,8 s** |
| Hautacam | 98,0 → **84,3** | 19,5 | **853,1 s** | **851,8 s** |

- Auf Lille wird die Gruppe erkennbar durch denselben gutgeschriebenen Zielrückstand zusammengefasst. Ein einzelner Ausreißer kann vor der größten späteren Gruppe gewinnen; Gruppengröße an der Spitze und die größte Ergebnisgruppe sind unterschiedliche Werte.
- Auf Bergen und Klassikern bleiben echte Sekundenlücken und kleine Zielgruppen erhalten, auch nach der 1-s-Wertung. Die pro-Sekunde-Physik wird **nicht** korrigiert.
- Keine Nutzer-Taktik wird durch die Ergebniswertung verändert, und eine neue Strategie erzeugt bei identischem Seed exakt gleiche physische Startbedingungen wie ihr Vergleich.

## Abnahme und weitere Produktentwicklung

1. **Technisch bestanden:** Rennlauf-Invarianten der vorherigen 32er Engine-Abnahme, neue Gruppenwertungs-Tests, sämtliche Schlussvergleichs-Simulationen und TS-Vorgaben. Die neue Zeitgruppenlogik ist ein separater, wiederverwendbarer Auswertungspfad, noch nicht ins Kern-RaceResult geschrieben.
2. **Grob sportlich geeignet als RC:** Angriffe/Verfolgung/W′/Fahrertypen/Formation grundsätzlich plausibel, Zielgruppenwertung vorhanden. **Nicht** als exakt kalibrierte Rennphysik oder UCI-amtliches Ergebnis ausgeben.
3. **Offene Kalibrierung für später:** absolute Geschwindigkeiten profilabhängig (−3,7% bis +4,7%), vor allem Lüttich zu schnell und Lille zu langsam; physische 1D-Spitzen-Exposition der Helfer; fehlende exakte GPX- und reale Starterdaten; Ausnahme eindeutig abgesetzter Gruppen bei 3-s-Regel. **Kein weiteres Tuning ohne konkretes Reproduktionsbeispiel.**
4. **Empfohlener nächster Arbeitsschritt:** einfacher offlinefähiger Browser-Einzelrennen-Simulator auf Basis exakt dieser Engine, der die vier Referenzkurse, Seed, vorhandene Teamstrategien und sinnvolle ausgewiesene Parameter, provisorische Zielgruppen, Favoriten und Ereignisbericht anzeigt. Konzept [EINZELRENNEN_TESTLABOR_KONZEPT_20261106.md](EINZELRENNEN_TESTLABOR_KONZEPT_20261106.md). Dieses Labor ist zugleich der beste Ort für nutzergeführte Szenario-Kalibrierung, ohne jede Änderung in den Motor zu übernehmen.
5. **Mergeentscheidung:** PR84 und der nachgelagerte Bewertungs-PR90 bleiben bis zur bewussten RC-Freigabe ungemergt. `main` und `develop/manager-mvp` Engine unberührt.

**Status:** Empfehlung `race-engine-1.0-rc1` für einen separat fixierten Referenzzweig, mit klaren dokumentierten Grenzen, nicht als finale empirisch kalibrierte 1.0.
