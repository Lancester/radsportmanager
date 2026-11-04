# R-22 – Manager-Vorgabe: Anzahl der Jagdhelfer (technische Vorbereitung)

**Nutzerwunsch vom 04.11.2026:** Später im Manager vor bzw. während einer Etappe festlegen können, **wie viele eigene Helfer Ausreißer verfolgen**. Eine größere Helferzahl kann die Einholjagd unterstützen, lässt aber weniger Kräfte für den Sprintzug übrig. Die konkrete Spieloberfläche und eventuelle dynamische Funk-Anweisung werden **später** gebaut.

## Bereits implementierte sichere Simulationsschnittstelle

In `RaceTeam` steht das optionale Feld `chaseHelperCount?: number`, erlaubt sind **ganze Zahlen 0 bis 5**. Beispiel:

```ts
{
  id:'T04',
  name:'Beispiel-Sprintteam',
  strategy:'sprint',
  chaseHelperCount:3
}
```

Die Werte bedeuten:

- **Feld fehlt:** Die bisherige autonome KI wählt die Jagdhelfer wie zuvor. Alle bestehenden vier Test-Fixtures bleiben unverändert.
- **0:** Das Team beteiligt sich im passenden `stable-pack`-Sprintprofil nicht an der Jagd. Es kann den Sprinter weiterhin schützen und später einen Sprintzug vorbereiten.
- **1–5:** **Obergrenze** der tatsächlich verfügbaren, beauftragten Helfer für die Mannschaftsjagd. Die KI muss den Abstand zur realen Feldspitze, die Zugehörigkeit zur verfolgenden Gruppe, W′-Reserve und laufende Missionen weiterhin berücksichtigen. Weniger als angefordert kann real eingesetzt werden; es gibt niemals zusätzliche Fahrer.

Der Wert wird **ausschließlich** in langen, überwiegend flachen, explizit als `stable-pack` gefahrenen Sprintetappen an die Jagd-KI weitergereicht. Andere Rennprofile und die `legacy`-Renn-KI behalten ihr bisheriges Verhalten. Der Manager-Parameter ist keine Erlaubnis, mehr Watt aus demselben Fahrer herauszuholen, Positionen zu überspringen oder physikalische Grenzen aufzuheben.

## Geprüfte Pfade

- `src/engine/race/race-simulator.ts`: optionale teamgebundene Eingabe und zentrale Bereichs-/Ganzzahlvalidierung.
- `src/engine/race/peloton-chase.ts`: Team mit ausdrücklich **0** Helfern erhält kein koordiniertes Jagdmandat.
- `src/engine/race/race-team-ai.ts`: Bei ausdrücklich gewünschtem Helferlimit wird die Anzahl der echten `jagd`-Aufträge auf diese Zahl begrenzt.
- `tests/r22-manager-chase-count.test.mjs`: 0/1/2/3/4/5, fehlender Parameter, unzulässige negative/kommazahlige/überhöhte Werte, Vergleich ohne Opt-in. CI führt zusätzlich die bekannten vier Referenzrennen Seed 2026 mit 154 Fahrern und bestehenden Physikregressionen aus.

**Bewusste Abgrenzung:** Der Parameter legt eine **Mannschaftsstrategie** fest, nicht die tatsächliche Erfolgswahrscheinlichkeit einer Jagd. Lange 15–20-Minuten-Führungsphasen und die Einholrate früher Ausreißer werden getrennt im experimentellen [PR #74](https://github.com/Lancester/radsportmanager/pull/74) untersucht. Diese Versuche verschlechterten bisher teilweise die Feldstabilität und werden **nicht** mit der neuen Manager-Schnittstelle in `main` vermischt.

## Sinnvolle spätere Manager-Optionen

Die vorgeschlagene Oberfläche kann eine Auswahl `0–5 Jagdhelfer` im Taktikgespräch vor der Etappe anbieten, die später im Rennen über Funk angepasst werden darf. Zusätzlich könnten **Jagdintensität** (`Kräfte sparen / kontrolliert / alles investieren`) und **Zeitpunkt des Jagdbeginns** eigene Anweisungen werden. Ob und wann ein Helfer bewusst aufbraucht, muss aus seinen physischen Leistungs-/Ermüdungsdaten und der aktuellen Rennsituation folgen. Vor allem aber darf die Taktik nie das Ziel garantieren, die Flucht einzuholen.

**Status:** Simulationsfeld und Unit-Regression implementiert, Manager-UI noch **nicht** umgesetzt; die breitere empirische Abnahme vieler Seeds bleibt wie vom Nutzer gewünscht bis zum Ende der Renn-KI-Entwicklung zurückgestellt.
