# R24 Rennlabor V5: Lille – identischer Eingabesatz auf Main, Audit, V5
**Datum:** 07.11.2026. **Status:** Simulation auf GitHub ausgeführt, Dokumentation – keine Korrektur der Engine, kein Merge.

## Warum dieser Vergleich?

Der Nutzer berichtet, dass auf der nominell flachen Lille-Etappe Kapitän F001 weit abgeschlagen ankommt und im Alltagstest zu häufig kleine Gruppen anstatt Massensprints gewinnen. Bevor weitere Taktik-KI entwickelt wird, sollen eingefrorenes Main, Audit und der V5-Entwicklungsstand direkt verglichen werden. **Kein neuer Entwicklungsbranch:** verwendet wird der bestehende `experiment/rennlab-v5-kapitaen-abstand-20261107`; `main`, Audit und `develop` bleiben unverändert.

## Testquellen / exakte Referenzen

- Main: `621e712371563278c5bed2bb643dd598a9a7bcf4`
- Audit: `1945e2d6b71289f90cca5dc8c793090a4af93341`
- V5: Gleiches Engine-Verhalten wie `feature/rennlab-tabs-rollen-live-20261107` plus **rein beobachtende** optionale Trace-API und separat gesicherter Standardkapitäns-Metadatenfix.
- CI: [Dreifachvergleich + Browser / 32 bestandene Tests](https://github.com/Lancester/radsportmanager/actions/runs/42377472774), Skript `tests/r24-lille-main-audit-v5-comparison.mjs`.
- Der exakt gleiche `RaceInput` wird je Engine aus JSON neu instanziiert, SHA-256 = `da308273cd7d0bbb792b0b60e555289c046296e9a6f9af3e06eb47d2789fdff0`, Lille 184,9 km, Seed 2026, 154 Fahrer / 22 Teams, `stable-pack`, `formation`, `r15-r16`, `endurance long`, 1-s-Schritte, volle Checkpoint-Diagnose.
- T01 `sprint`; F001 Petr `kapitaen` (CP 375,4 W; 81,5 kg), F004 Jakub `sprinter` (CP 346,1 W; 66,2 kg). F002 **`helfer`**. Die getrennten `captainId`/`sprintLeaderId` sind im JSON enthalten, aber **Main/Audit kennen diese neueren Steuerfelder nicht** und verwenden ihre ältere Rollen-KI. Es ist also ein fairer, bytegleicher Eingangstest der Versionen, **kein vollständiger semantisch identischer V5-Managerauftrag** und kein isolierter KI-A/B-Test. Es werden trotz gleichem Input unterschiedliche Ausdauer-/KI-Verfahren angewandt.

## Direkter Dreifachvergleich Seed 2026

| Merkmal | Main | Audit | V5 |
|---|---:|---:|---:|
| Kapitänsgruppe km 50 | 140 | 14 | 11 |
| Kapitänsgruppe km 70 | 149 | 14 | 11 |
| Kapitänsgruppe km 75 | 154 | 15 | 11 |
| Kapitänsgruppe km 90 | 138 | 15 | 11 |
| Kapitänsgruppe km 120 | 126 | 14 | 11 |
| Kapitänsgruppe km 150 | 11 | 14 | 11 |
| Kapitänsgruppe km 180 | 12 | 14 | 11 |
| F001 Platz | **141** | **144** | **149** |
| F001 Rückstand Sekunden | **94,9** | **751,0** | **758,5** |
| F004 Platz | 74 | 117 | **5** |
| F004 Rückstand Sekunden | 25,2 | 27,5 | **0,7** |
| Größte Abstandsgruppe bei km 180 | 131 | 134 | 131 |
| Fahrer <=1 s hinter Sieger | 5 | 5 | 5 |
| Fahrer <=3 s hinter Sieger | 23 | 29 | 29 |
| Fahrer <=30 s hinter Sieger | 130 | 132 | 131 |
| Größte 1-s-verkettete Zielgruppe | 62 | 100 | 72 |
| Sprinterspezialisten in Top 10 | 7 | 6 | 6 |
| Sieger | F009 (Sprinter) | F009 (Sprinter) | F023 (Sprinter) |
| Angriffsbeginne | 45 | 29 | 24 |
| Verfolgungsbeginne | 182 | 235 | 40 |

**Wertung der Gruppen:**
- `largestGroup` bei km 180 bezeichnet die größte räumliche Gruppe gemäß 42-m-Nachbarabständen. `frontGroup` ist die räumlich führende Gruppe; sie kann separat kleiner sein.
- `<=3 s` ist ein Zeitfenster relativ zur Siegerzeit, **keine amtliche UCI-Zeitgruppenberechnung**; 1-s-verkettete Gruppen sind eine andere rechnerische Kennzahl. Keine Aussage über individuelle Fahrer innerhalb der vordersten 30 Sekunden als „ein einziger Sprintzug“.
- Bei km 180 fährt in allen drei Varianten eine Gruppe mit ~131–134 Fahrern in der Rennspitze. Unter den Top 10 dominieren Sprinter, es gewinnt **keine isolierte Ausreißergruppe**. **Dieses eine Rennen belegt daher nicht die behauptete zu hohe Ausreißersiegquote**; sie bleibt für weitere Seeds/profiltypische Sprintetappen zu prüfen.
- **Der frühe Kapitänsabriss tritt in Audit und V5 auf, nicht erst nach V5.** Main hält F001 bis km 120 in einer sehr großen Gruppe, verliert ihn bis km 150 aber ebenfalls – die Probleme sind also älter und können nicht allein mit der jüngsten Auswahl-/UI-Änderung erklärt werden.

## Gleiche wesentliche Regler in allen drei Ständen

Direkt überprüft: In **allen drei** GitHub-Referenzen besitzen `src/engine/race/peloton.ts` und `src/engine/race/stable-pack.ts` **identische Git-Blob-SHAs**:
- `peloton.ts`: `9c1b1b9c9a9aadb6f3018a7351ff8561d7321216`; `groupSeparationM: 42`.
- `stable-pack.ts`: `8b01eadda08925170d7ad462744dda09d9219689`; `reconnectGapM: 85`.
Das bedeutet: der bei F088 beobachtete **42-/85-m-Regelversatz ist nicht erst in V5 eingeführt** worden. **Er ist eine plausible konkrete Ursache im aktuellen Test, aber die größere Abweichung zwischen Main/Audit kann nicht allein von diesem identischen Modul herrühren.** Im Audit existiert zusätzlich `local-group-reference.ts`, das im fixierten Main noch nicht vorhanden ist; darüber hinaus unterscheiden sich weitere KI-/Ausdauermodule. Eine gezielte Ursache der Veränderung Main→Audit darf nur durch zusätzliche isolierte Gegenproben behauptet werden.

## Kritischer V5-Originalvergleich mit freier Rolle – ausdrücklich andere Konfiguration

Die bisherige V5-Screenshot-Reproduktion [GitHub-Lauf 42372061388](https://github.com/Lancester/radsportmanager/actions/runs/42372061388) hat `F002:'frei'` (ansonsten gleicher Seed, Streckenprofil, Team T01 `sprint`, F001 Kapitän, F004 Sprintziel): F001 **149**, +759,2 s und F004 **128**, +482,6 s.

Für den **dreifach kompatiblen** Test musste `F002:'helfer'` gewählt werden, da `main` die Rolle `frei` in `validateRace` **explizit ablehnt**. Damit ist V5 F001 **149**, +758,5 s, F004 **5**, +0,7 s.

Dies ist eine auffällig große Auswirkung einer einzelnen Rollenänderung in V5. Die ursprüngliche V5-Aufstellung wurde **nicht** heimlich als „auf allen Engines identisch“ ausgegeben. Für alle drei neuen Läufe ist die Eingabe hingegen nachweislich bytegleich. Die Taktikwirkung und Nichtlinearität sind ein **eigener Audit-Punkt**, kein Beleg dafür, dass mehr Helfer grundsätzlich bessere Ergebnisse bringen oder Massensprints regelmäßig entstehen.

## Älterer 27-Rennen-Bericht als ergänzender Häufigkeitsindikator

Der vorab gesicherte [Kurzvergleich](https://github.com/Lancester/radsportmanager/blob/feature/r24-eintagesmodell-gesamt/docs/race/R24_DREI_STAENDE_ERGEBNIS_UND_ENTSCHEIDUNG.md) nutzte je 3 Seeds × Main/Audit/Gesamtmodell, mit einem **anderen gemeinsamen historischen Eingabesatz**. Dort auf Lille bei Seed 2026 `winner1s` Main 26, Audit 32, historisches Gesamtmodell 7; über drei Seeds gewannen:
- Main: 2 Sprinter, 1 Klassiker
- Audit: 2 Sprinter, 1 Kletterer
- historisches Gesamtmodell: 3 Sprinter.

Es gibt also **bisher keine ausreichend große repräsentative empirische Stichprobe**, aus der „zu viele Ausreißersiege“ quantifiziert werden könnten. Insbesondere nicht aus einem einzelnen glücklichen oder unglücklichen Seed.

## Konsequenz / verbindliche Arbeitsweise

1. **Keine neuen Branches/Engines für dieses Problem.** Dieses Dokument und der neue Runner verbleiben im bestehenden Diagnosezweig; aktiver Langzeit-Entwicklungsstand wird ausdrücklich nicht stillschweigend geändert. Offene Draft-PR #99 (Metadatenfix) und #101 (Diagnose) bleiben bis zu einer bewussten Konsolidierungsentscheidung getrennt, kein Merge nach main.
2. Bevor der 42/85-m-Reconnect-Mechanismus verändert wird, **den isolierten Unterschied Main→Audit im Kapitänsverhalten eingrenzen**. Die beiden relevanten Reglerdateien selbst sind unverändert. Insbesondere lokale Gruppenreferenz, KI-Auftragsprioritäten, Physiologie-/Langzeitausdauer und Formation untersuchen.
3. Für die Häufigkeit von Massensprints **eine gezielt ausgewählte Stichprobe** flacher, sprintfreundlicher Profile und mehrerer Seeds mit Vorab-Kriterien: erfolgreiche Flucht/Einholen, Größe der führenden/geschlossenen Gruppe in den letzten 10 km, Sieger-Fahrertyp und Ergebnisabstände; Standard-Kader und Rollen nicht zwischen Versionen heimlich verändern.
4. Für F001 insbesondere Kontrollläufe `F002 frei` vs. `F002 helfer` bzw. gedrosselter/keiner Teamjagd, plus Verlauf der Missionen und Positionen: **Warum wird das Sprintziel so viel stärker beeinflusst, der Kapitän aber kaum?** Keine Siegergarantie, keine Watt-/Energie-/Positionsboni.
5. Erst nach statistisch und physikalisch plausibler A/B-Wirkung **eine kleine Korrektur** übernehmen. Die bewährte Motorik, CP/W′ und Referenzcommits bleiben unverändert.

**Schlussfolgerung:** Es gibt ein **altes gravierendes Problem der Kapitäns-Feldkohäsion**, das bereits die Audit-Engine betrifft. Dieses Lille-Rennen mit kompatibler T01-Aufstellung endet aber in allen drei Versionen in einer größeren Sprintkonstellation. Als nächstes ist eher ein präziser Regressionstest **Main vs. Audit** und ein mehrseediger Sprint-Verlaufstest nötig als ein weiteres Regelpaket.
