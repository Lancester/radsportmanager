# Verbindlicher Entwicklungsfahrplan Rennengine R-17 bis R-23

**Beschlossen am 04.11.2026 vom Nutzer.** Dieses Dokument legt
den Reihenfolgeplan fest; es behauptet ausdrücklich nicht, dass ein
Arbeitspaket allein durch seine Nennung schon erfolgreich umgesetzt ist.

## Unverrückbare Trennung

**Rennengine = Simulation eines einzelnen Straßenradrennens** mit
Rennprofil, Fahrern, Teamtaktik, Leistung, Ausreißern, Ergebnis und
physikalischen Diagnosen. Die Rennengine darf auch Eintagesrennen
mit 200 km oder Klassikern als *ein einzelnes Rennen* berechnen.

**Nicht Teil der Rennengine:** Rundfahrten mit Etappen-/Gesamtwertung,
Karrieremodus, Transfermarkt, Verträge, Sponsoren, Kalender, Vereinsbudget,
Teammitarbeiter als Managerfiguren, Training über Monate/Jahre und
umfassende Teambus-/Sportdirektoren-Bedienoberflächen.

## Gemeinsames Implementierungspaket: R-17 bis R-21

Der Nutzer hat die Umsetzung aller fünf Schritte **in einem Arbeitsgang**
beauftragt, ohne einzelne Rückfragen oder separaten Freigabeprozess
zwischen den Schritten.

| Schritt | Rennengine-Auftrag | Ehrliches Abnahmekriterium |
| --- | --- | --- |
| **R-17** | Positionsbewusste Führungsarbeit, echte Frontnähe, Ablösung und Bereitschaft mehrerer Helfer statt nur Auftragszähler | Physische Position am Rennort prüfbar; keine Teleportation oder Geschwindigkeitsboni. Ein real tatsächlich näher an der Spitze fahrender Helfer kann nach Position/W′ die Führung übernehmen; nicht vorne fahrende Helfer sind Unterstützer. |
| **R-18** | Situative Teamtaktik: gefährliche Flucht, vorausschauende Jagd, konkurrierende Teaminteressen und koordinierte Entscheidungen | Angriffe, Verfolgung, Mitfahren und Aufgabenteilung sind auf tatsächliche Gruppen-/Zeit-/Restdistanz-Informationen zurückzuführen. Keine Erfolge garantiert. |
| **R-19** | Lange Renndauer: transparentes Ermüdungs-/Verpflegungsmodell, ohne CP/W′ oder Energiebilanz zu manipulieren | Bei gleicher Belastung sinkt die langfristig nutzbare Leistung nachvollziehbar; Verpflegung federt den Verlust begrenzt ab und ist mengenmäßig bilanziert. Kurze Referenzrennen behalten plausible Werte. |
| **R-20** | Fahrertypen, Profil, Wind und Streckenuntergrund als rennmechanische Testparameter | Unterschiedliche Spezialisten/Umweltparameter wirken durch physische Leistung, Roll-/Aero-/Steigungsbedingungen auf gleiche Bewegungsphysik. Keine pauschalen Zeitboni oder erzwungenen Sieger. |
| **R-21** | Große Felder, 150–250-km-Eintagesrennen, Performance, Reproduzierbarkeit und automatisierte Belastungstests | U. a. 22 × 7 = 154 Teilnehmer als realistische WorldTour-Testgröße; komplette Zielankünfte, stabile Energiebilanz, reproduzierbare Seeds, gemessene Rechenzeit und transparenter Ressourcenumfang. |

**Qualitätsregel:** Physikkern, CP/W′, Formations-Aero und Ergebnisrechnung
nur ändern, wenn anhand gezielter Tests begründet; nicht durch
unerklärte Positions-, Watt-, Geschwindigkeits- oder Ergebnisboni
nachjustieren. Keine Rückstände künstlich begrenzen.

## Danach und ausdrücklich separat: R-22 und R-23

**R-22: Intensive Rennengine-Validierung und Endkalibrierung.**
Erst nach Funktionsabnahme R-17–R-21. Reproduzierbare
Monte-Carlo-Serien mit mehreren Seeds und unterschiedlichen
Fahrerteams über reale Größenordnungen, insbesondere:
- **Flachrennen:** 180–220 km, Feld-/Windschattendynamik, Fluchtquote,
  organisierte Verfolgung und realistische Endspurts.
- **Hügelrennen:** 180–210 km, gemischte Leistungsgruppen,
  Fluchtentscheidungen und kleine Zielgruppen.
- **Klassiker:** 220–260 km, lange Belastung, wiederholte
  Leistungsspitzen, wechselnde Formationen und Untergründe.
- **Bergetappe als EINZELrennen:** 150–200 km, Höhenmeter,
  Bergselektion und Kapitän-/Helferarbeit.
- **Felder:** mindestens 22 Teams à 7 Fahrer
  als vereinbarter Referenzfall (154 Fahrer),
  plus weitere Feldgrößen und Fahrertypverteilungen.
- **Monte-Carlo:** beginnend 100, später 500 bis
  1.000+ Läufe je Profil abhängig von gemessener Laufzeit.
- **Auswertung:** Ausreißer- und Einholquoten,
  Gruppen-/Zielabstände, Tempo/Watt, Zeit, Geschwindigkeits-
  und Energieverteilung, Helferwirkung, Ermüdung,
  Leistungs-/Fahrertypkorrelation, Fehlerrate,
  Laufzeit und Reproduzierbarkeit.
- **Kalibrierungsprinzip:** Plausibilität zuerst gegen
  unabhängige reale Renn- und Leistungsdaten prüfen;
  Trainings-/Kalibrierfälle strikt von Validierungsfällen
  trennen. Keine Parameterverstellung nur, damit einzelne
  erhoffte Sieger oder Gruppenabstände entstehen.

**R-23: Gate zur Rennengine 1.0.** Erst wenn R-22
definierte und dokumentierte Qualitätskriterien erfüllt:
physikalische Korrektheit, taktisch vielfältige plausible
Rennverläufe, stabile Vollrennen, reproduzierbare Ergebnisse,
angemessene Performance und keine offenen kritischen Bugs.
R-23 ist eine **Freigabeentscheidung**, keine Vorab-Zusage.

## Projektstatus

R-15/R-16: in `main`, durch 232 Tests, 14 × 50 km A/B
und Browser-CI geprüft.
R-17–R-21: **gemeinsam beauftragt und in Arbeit**.
R-22/R-23: danach, **noch nicht ausgeführt**.
