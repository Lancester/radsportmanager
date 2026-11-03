# R-14 – autonome Helferrotation, Teamtempo und situative Verfolgung

**Stand: 04.11.2026 – Implementierung geprüft auf GitHub Actions; Hauptzweig-Abnahme siehe späterer Nachtrag.**

## Ziel und Beschlusslage

Nach D-080/D-081 ist der mehrfahrerabhängige Formationswindschatten
der **reguläre** Rennmodus. Ein schwacher Einzelfahrer kann gegenüber einem
geschützten Hauptfeld deutlich zurückfallen. Solche Abstände dürfen
**nicht** durch Geschwindigkeits-, Positions- oder Zielzeitboni
verschleiert werden.

R-14 macht die bisher rudimentäre Tempoarbeit und Verfolgung von
R-09/R-10 **teamabhängig** und nachvollziehbar. Der Spieler legt die
Strategie weiterhin vor Rennbeginn fest. Die Fahrer setzen diese
mit begrenzten, prüfbaren Kurbelwatt-Anforderungen autonom um.
Noch keine eigenen Sportdirektoren, Trainings-/Vertragsmodelle oder
simulierten Funkbefehle.

## Technische Umsetzung

- `src/engine/race/team-pacing.ts`: rein deterministische
  `decideTeamPace`-Funktion mit zwei Ausgaben: `fuehrung`
  (Helfertempo für Kapitän bzw. bei Sprint-Strategie Sprinter) und
  `verfolgung` (gegen eine belegte Flucht).
- Pro Team **höchstens ein** Helfer zur selben 10-Sekunden-
  Entscheidungsrunde als aktiver Tempoarbeiter ausgewählt. Nur Helfer
  in derselben **taktischen** Abstandsklasse (42-m-Trennschwelle),
  höchstens 35 m vom geschützten Fahrer, mit wenigstens 20 %
  verbleibender W′-Reserve kommen infrage. Bei mehreren geeigneten
  Helfern wird die Führungsaufgabe alle **90 Sekunden** nach
  stabiler ID-Rotation verteilt. Die 42 m sind ausschließlich
  eine *taktische Abstandsklasse*, kein Windschattenradius.
- Verfolgung nur, wenn eine kleine Gruppe mit höchstens sechs Fahrern
  eine **gemessene** Lücke von mindestens 75 m und höchstens
  400 m zu einer größeren Hauptgruppe von mindestens vier Fahrern
  aufweist, und die Rennphase zwischen ca. 12 % und 92 % liegt.
  Der zu schützende Fahrer muss tatsächlich in der Hauptgruppe
  fahren; nur ein Helfer aus dieser Gruppe mit wenigstens 30 %
  W′-Reserve und innerhalb von 55 m von deren Spitze wird
  eingesetzt. Die eigene Fluchtgruppe wird nicht verfolgt.
- Aufträge sind **nur Wattwünsche**: Tempoarbeit höchstens hier
  `CP × 1,06`, koordinierte Verfolgung hier `CP × 1,095`.
  Das sind nachvollziehbare, vorläufige Spielregeln und keine
  behaupteten physiologischen Optimalwerte. Der CP/W′-Kern
  begrenzt die tatsächlich mögliche Leistung; Bremsen, Steigung,
  Luftwiderstand und Geschwindigkeitsentwicklung bleiben in
  `advanceMotionStep` und `critical-power.ts`.
- Zielsprint, Attacke oder Erholung aus der bestehenden
  `race-tactics.ts` haben Vorrang. Die früher für jedes einzelne
  Teammitglied unabhängig gestartete Helfer-Verfolgung und
  unkoordinierte Führungsarbeit sind **nur im aktiv koordinierten
  Rennmodus** deaktiviert; die Funktion `chooseRacePower` ohne
  diesen Kontext bleibt für alte isolierte Tests kompatibel.
- Der Rennsimulator schreibt echte `team-pace`- und
  `team-chase`-Ereignisse (mit Fahrer-/Team-ID),
  und Zähler `teamPaceStarts` sowie `teamChaseStarts`.
  Die nach Echtzeit getroffenen Entscheidungen werden nicht
  nachträglich an ein erhofftes Rennergebnis angepasst.
- Kein Aufholbonus für isoliert abgehängte Fahrer;
  die im gültigen Rennen entstehenden größeren Rückstände
  bleiben erlaubt.

## Prüfumfang und tatsächliche Messung

[PR-Regression #41737911881](https://github.com/Lancester/radsportmanager/actions/runs/41737911881)
**221 von 221 Tests erfolgreich, 0 Fehler**. Acht neue R-14-Tests
umfassen zwei vollständige 50-km-Rennen mit CP/W′-/Energie- und
Ereignisprüfung sowie isolierte Beispielfelder zur Helferrotation,
Eingabereihenfolge, tatsächlicher Flucht, erschöpften Fahrern,
viel zu großer Lücke und einem weit abgeschlagenen Solo-Fahrer.

Der zusätzliche [Actions-Lauf #41738013741](https://github.com/Lancester/radsportmanager/actions/runs/41738013741)
hat **sieben vollständige Rennen mit je 30 fiktiven Fahrern über
50 km** (210 Zielankünfte), die realen protokollierten
Teamereignisse und den TypeScript-/ESM-Browserlauf tatsächlich
ausgeführt. Die temporäre CI dafür wurde danach wieder entfernt.

| R-14-Standardszenario | Aktive Führungsdienst-Starts | Koordinierte Verfolgungsstarts | Max. Abstandsgruppen | Median-Zielrückstand | Letzter Rückstand |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hügelig, schützen, 2026 | 182 | 6 | 18 | 231,2 s | 648,4 s |
| Hügelig, offensiv, 2026 | 110 | 7 | 20 | 144,2 s | 618,3 s |
| Flach, Sprint, 2026 | 223 | 0 | 3 | 1,8 s | 396,7 s |
| Hügelig, schützen, 2027 | 164 | 9 | 20 | 198,3 s | 522,9 s |
| Hügelig, offensiv, 2027 | 84 | 2 | 23 | 249,5 s | 546,6 s |
| Flach, Sprint, 2027 | 185 | 0 | 5 | 1,3 s | 437,8 s |
| Hügelig, F03 −12 % CP/FTP/W′, 2026 | 97 | 6 | 20 | 207,7 s | 671,4 s |

Der Flachlauf 2026 hat **keine bestätigte Ausreißergruppe**;
eine koordinierte Verfolgung wäre also erfunden und bleibt mit
null entsprechend aus. In allen fünf hügeligen Fällen sind bestätigte
Ausreißergruppen vorhanden; die konkreten Einholungsereignisse
treten nicht zwangsläufig auf (beispielsweise Hügel schützen
2026: eine Flucht, keine Einholung; Hügel schützen 2027:
eine Flucht und eine Einholung). Das ist ausdrücklich **keine
Erfolgsgarantie** für eine Teamjagd.

**Einordnung der Messwerte:** Der Vergleich mit R-13 kann
durch neue, tatsächlich über CP/W′ ausgeführte Wattarbeit
Sieger, Gruppen- und Zielabstände verändern. Ein gutes
Ergebnis ist kein künstlich festgelegter Sollwert und ein
größerer Einzelrückstand kein Fehler. Die Starts sind
*Auftragsanfänge*, nicht nachgewiesene Führungspositionen
auf einer echten 2D-Straße. Eine Helferarbeit ist nur dann
wirklich im Wind, wenn sie im dynamischen Rennverlauf
tatsächlich nach vorne führt. Es gibt bislang keine
seitliche Spurwahl oder physisch modellierte Staffelfahrt.

## Noch offene nächste Ausbaustufe

Die erste Team-Koordination ist noch **regelbasiert**:
Rotationsrhythmus und Leistungsschwellen sind fest;
es werden keine Rennsituationen antizipiert, keine
dynamische strategische Teamfunkkommunikation,
keine echten sportlichen Leiter und keine vollständige
taktische Interaktion zwischen mehreren Teams modelliert.
Die Verfolgung sucht nur eine **bestätigte** kleine Flucht vor
einer Hauptgruppe, nicht jedes denkbare Rennen und
nicht die rein defensive Rettung eines verlorenen Kapitäns.

Nächste sinnvolle Entwicklung innerhalb Issue #42:
prüfbare tatsächlich gefahrene **Führungspositionen**,
Helfer vor den geschützten Fahrer positionieren und
Führungswechsel anhand zurückgelegter Strecke,
W′-Verfügbarkeit und aktueller Rennlage steuern.
Danach stärkere Teamplanung im Teambus.
**R-01–R-08 bleiben erhalten; keine Detail-Lenkphysik
ohne nachgewiesenen Nutzen.**

**Keine Realweltbehauptung:** Alle Testfahrer und
50-km-Rennergebnisse sind fiktiv. 221 grüne Tests
beweisen die technische Funktion, nicht einen
vollständig validierten Profi-Rennverlauf.
