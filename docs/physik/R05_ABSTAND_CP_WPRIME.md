# R-05 · Abstandsregelung und CP/W′-Leistungsreserve

**Stand: 03.11.2026 · Sicherheits-/Physiologie-Prototyp · Testwerte, keine kalibrierte Komplettsimulation**

## Ziel

Auf den bestätigten Achtfahrer-Läufen (95/95 Tests; Android ohne/mit erster Regel-KI 21,6/32,9 ms) aufbauen, ohne bisherige Szenarien zu beschädigen. **Beide neuen Teilmodelle sind optional:** Alte Gruppenläufe ohne `followingSafety` und `physiology` bleiben das bisherige R-04-Referenzszenario.

## A · Physikalisch begründete Abstandsregelung

Die reine Regel in `src/engine/ai/following-safety.ts` betrachtet **den nächsten Fahrer derselben Spur**, den Abstand zwischen den vereinfachten Fahrerzentren, die beiden Geschwindigkeiten, Fahrer+Rad-Masse und eine vorläufige maximale Verzögerung.

Vereinfachte Testgeometrie: Fahrerlänge/Minimummittelpunktabstand **1,8 m**; gewünschter Zusatzabstand **0,7 m**; Reaktionszeit **0,25 s**; höchstens **3 m/s²** Bremsverzögerung. Für einen schneller fahrenden Hintermann schätzt sie den erforderlichen Abstand:

`d_erforderlich = d_min + (v_hinten − v_vorn) × Reaktionszeit + (v_hinten² − v_vorn²)/(2 × a_max)`

Die Differenzterme werden bei nicht auflaufendem Hintermann auf Null begrenzt. Diese Formel setzt stark vereinfacht **gleichbleibende Führendengeschwindigkeit** voraus; wenn der Führende plötzlich selbst stark bremst, muss später eine doppelseitige Brems-/Reaktionsbetrachtung folgen.

Regelablauf: zuerst **Antriebswatt auf 0 W reduzieren**, bei deutlicher Schließgefahr eine **begrenzte reale Bremskraft** verlangen. Beides wird an den **vorhandenen** `advanceMotionStep` in `motion-core.ts` übergeben. Dieser bilanziert ab jetzt optional auch **Bremsverlustarbeit**:

`ΔE_kin = W_Antrieb − W_Luft − W_Rollen − W_Gravitation − W_Bremse`.

**Nie teleportieren:** Die Regel setzt weder Position noch Tempo eigenständig. Ein schon physikalisch unzureichender Bremsweg oder eine verbliebene Kollision wird **weiterhin ausdrücklich als Fehler markiert**, nicht still korrigiert. Das ist eine erste longitudinale Warn- und Bremsregelung, **keine garantierte Kollisionsvermeidung**, kein Kurven- oder Reibkreisverhalten und **keine Seitenbewegung/Überhol-KI**.

## B · CP, W′ und FTP sauber unterscheiden

`src/engine/physiology/critical-power.ts` enthält eine individuelle Critical Power `criticalPowerW` (CP in **Pedalwatt**) und eine zu Beginn gespeicherte **W′-Reserve** (Joule). Die Leistung oberhalb von CP wird auf die vorhandene Reserve begrenzt:

`W′_neu = max(0, W′_alt − max(0, P_Pedal − CP) × Δt)`.

Reicht W′ nicht für den gesamten Zeitschritt, ist die **tatsächlich erlaubte Wattzahl**:

`P_erlaubt = min(P_Wunsch, CP + W′_rest / Δt)`.

Damit kann eine Fahrer-KI **nicht unbegrenzt hohe Leistung** verlangen. Nach vollständiger W′-Erschöpfung wird eine höhere Anforderung auf CP gekappt. Der Fahrer darf weiterhin CP anfordern; das ist eine **Modellvereinfachung** und keine Zusage, CP stundenlang zu halten.

**W′-Erholung (vorläufig!)**: Unter CP wird in dieser ersten Version `(CP − P) × Δt × Erholungsfaktor` bis höchstens zur ursprünglichen Reserve hinzugefügt. Der Faktor ist vorläufig 0,35 für den Testfahrer, frei festgelegt. Dies ist **kein empirisch validiertes W′bal-/Skiba-Rekonstitutionsmodell**. Gerade die Wiederauffüllung und die langfristige Ermüdung verlangen spätere sportwissenschaftliche Kalibrierung.

**FTP wird NICHT mit CP gleichgesetzt.** `ftpW` ist bereits als **optionaler, eigenständig gespeicherter Trainingsprofilwert** vorgesehen. Die sehr verbreitete FTP beschreibt eine geschätzte länger haltbare Schwellenleistung und kann sich individuell von CP unterscheiden. Empirische Studien zeigen hohe Korrelation, aber keine Austauschbarkeit. Für später vorgesehen: FTP-Testprotokoll, Leistungszonen, Trainingstagebuch/Trainingssteuerung, Entwicklung von FTP **und separat CP/W′**, Trainingseffekte auf Ermüdungsresistenz und Recovery.

Keine automatischen Hochrechnungen `FTP→CP` oder `CP→FTP` ohne explizit geprüfte individuelle Daten. **FTP-Werte des Nutzers werden nicht ungefragt als fiktive Profidaten ins öffentliche Repository geschrieben.**

## C · Integration mit Fahrer-KI

Verarbeitung pro gemeinsamen Zeitintervall:

1. Der bestehende **regelbasierte Lückenagent** wünscht Watt (z. B. um einer Lücke nachzusetzen).
2. Die neue **Sicherheitsinstanz** prüft die Schließgeschwindigkeit und fordert nötigenfalls `P=0` und eine physikalische Bremskraft.
3. Das **CP/W′-Modell** begrenzt die verbleibende gewünschte Leistung anhand realer Reserve.
4. Der **ursprüngliche Bewegungsintegrator** berechnet aus tatsächlich erlaubten Watt, Bremskraft, Luftwiderstand, Rollwiderstand und Masse die neue Geschwindigkeit/Position.
5. Die W′-Reserve und die mechanische Arbeit werden separat verbucht. Ereignisse kennzeichnen Sicherheits- und CP-Limit-Eingriffe.

Wichtig: Diese Befehle werden aus demselben alten Gruppenzustand abgeleitet und erst nach dem gemeinsamen Schritt gleichzeitig übernommen; weder ein Wattbonus noch ein magischer Tempo- oder Ergebnisbonus wird vergeben.

**Fiktive R-05-Demowerte** für F8: `CP=220 W`, `FTP=210 W`, `W′=1200 J`, Wiederauffüllfaktor `0,35`. **Keine echten Messdaten** und keine Aussage über realistische Elitefahrerwerte. Eine separate feste Grenze des bestehenden Lückenagenten beträgt `255 W`, solange CP/W′ es zulässt. Erst mit echter Leistungs-Dauer-Kalibrierung würden wir Fahrerprofile seriös variieren.

## D · Tests und Reifegrad

Neu: `tests/r05-safety-cp.test.mjs` mit Einzeltests für Schließgeschwindigkeit, frühe Leistungsrücknahme, echte Bremskraft, zu kurzen Bremsweg, positive Bremsarbeit und Energiegleichgewicht, W′-Entleerung/Deckelung/Wiederauffüllung, CP/FTP-Trennung, Unverändertheit alter Aufrufe, acht Fahrer mit KI/CP/Sicherheit, reale Drei-Fahrer-Bremsung und Determinismus.

**Prüfstatus:** Die Tests und die GitHub-Browser-Veröffentlichung müssen zunächst den echten CI-Lauf bestehen. Vorher keine Erfolgsbehauptung über Gesamtzahl, echte Android-Geschwindigkeit oder numerische Ergebnisse.

Das bisherige Browser-Frontend erhält einen getrennten Vergleichsmodus **„KI + Abstand + CP/W′“**. **Der Nutzer muss den neuen Test nach erfolgreichem GitHub-Pages-Deployment erst auf seinem Android-Handy ausführen.** Der vorherige echte Android-R-04-Benchmark ist davon unabhängig.

## E · Fachlich noch offen

- Grenzwert für sichere Abstände und Brems-/Reaktionsfähigkeit bei Nässe, Kurven, Gefälle und unterschiedlicher Fahrtechnik.
- Der Führende könnte plötzlich bremsen oder ausweichen: das jetzige **Einfachmodell garantiert keine Kollisionsfreiheit**.
- W′-Regeneration durch experimentell geprüfte individuelle Parameter, CP-Veränderung mit Rennzeit/Ermüdung und nachhaltige Leistung unterhalb CP.
- Training: Wie wirken Intervalle, ruhige Einheiten, Trainingslager und Regeneration auf FTP, CP, W′ und Langzeitresistenz?
- Echtzeitberechnung in größeren 20-/160-Fahrer-Gruppen, 2D-Spurwechsel, Teamtaktik, Verfolgung, Attacken, Streckenwechsel und Rennresultate.
- Vergleich `FTP` (praktisches Training) versus `CP/W′` (leistungsphysiologisches Entscheidungsmodell) nie anhand pauschaler Prozentfaktoren für jeden Fahrer verwechseln.

## Wissenschaftliche Quellen

- Poole et al. (2016): [*Critical Power: An Important Fatigue Threshold in Exercise Physiology*](https://pmc.ncbi.nlm.nih.gov/articles/PMC5070974/) – CP und W′ als zwei Parameter des Leistungs-Zeit-Zusammenhangs.
- Karsten et al. (2021): [*Relationship Between the Critical Power Test and a 20-min Functional Threshold Power Test in Cycling*](https://pmc.ncbi.nlm.nih.gov/articles/PMC7862708/) – FTP und CP korrelieren, sind aber nicht individuell austauschbar.
- Sreedhara et al. (2020): [*The Application of Critical Power, the Work Capacity above Critical Power (W′), and Its Reconstitution*](https://pmc.ncbi.nlm.nih.gov/articles/PMC7552657/) – Potential und Grenzen der W′-Rekonstruktion im Radtraining.
