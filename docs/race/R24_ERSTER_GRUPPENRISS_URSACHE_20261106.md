# R-24 – Ursachenprüfung: erster physischer Gruppenriss (06.11.2026)

## Durchführung und Reproduzierbarkeit

- **Ausgangscode:** `develop/manager-mvp`, unveränderte Audit-Engine. Diagnoseänderungen ausschließlich im **nicht gemergten** [Draft-PR #83](https://github.com/Lancester/radsportmanager/pull/83), Branch `experiment/r24-first-gap-trace-20261106`.
- **GitHub-Actions-Läufe:** [#42223916077](https://github.com/Lancester/radsportmanager/actions/runs/42223916077) (erste 12-Sekunden-Stichprobe) und [#42224059479](https://github.com/Lancester/radsportmanager/actions/runs/42224059479) (90-Sekunden-Fenster, bis zum Ereignis 5-Sekunden- plus letzte 12 Sekunden 1-Sekunden-Abtastung). TypeScript-Prüfung und kontrollierter Lauf erfolgreich. Log und 7-Tage-Artefakt unter zweitem Actions-Lauf; keine komplette Testsuite oder Sportvalidierung.
- **Test:** 30 km, 10 km Ebene → 5 km +4 % → 5 km −4 % → 10 km Ebene, `stable-pack`, 154 fiktive Fahrer aus Hautacam-Referenzfeld, Seed 2026, Teams `ausgewogen`, Attacken ausgeschaltet, Langzeitermüdung ausgeschaltet, 0 technische Abfahrtsbegrenzung. 154 Finisher; 0 Attacken. Nicht mit älteren Testläufen auf anderen Audit-Code-Commits unbesehen gleichsetzen.
- **Nur Messung:** `diagnosticFirstSplit` greift nicht in Watt-/Bewegungsentscheidungen ein. Für die unmittelbar benachbarten Fahrer an der **ersten neuen 42-m-Lücke** protokolliert es vorherige Abstände, Gruppenregler, Soll-/Istleistung, effektive CP, W′, Windschattenfaktor, Beschleunigungsreferenz und Steigung.

## Erster Riss

- `t = 1609 s`, Rennspitze `km = 17,875`, direkte Lücke **43,19 m** zwischen vorausfahrendem **F009** und zurückfallendem **F107**.
- **Kein Reglerwechsel** bei F107: In allen protokollierten Sekunden vor der Trennung durchgehend `group-riding`, keine Attacke oder Helfermission.
- Sollleistung und tatsächlich abgerechnete Leistung sind bei F107 gleich. Keine fehlgeschlagene Wattabrechnung. Aktuelle CP ca. **331,5 W**, Gruppenregler begrenzt nach seiner eigenen Regel die freiwillige Folgeleistung auf **1,12 × CP = 371,28 W**; W′ ist vor dem Abriss vorhanden, wird beim dauerhaften Fahren über CP verbraucht.
- Die kritische Entwicklung beginnt **vor** dem 42-m-Riss und **vor** dem vollständigen Windschattenverlust:

| Zeit | Lücke F107→F009 | Aero-Faktor F107 | Soll-/Ist-Watt F107 | W′ F107 |
| ---: | ---: | ---: | ---: | ---: |
| 1555 s | 1,27 m | 0,400 | 0 / 0 W | 22,9 kJ |
| 1565 s | 3,68 m | 0,416 | 0 / 0 W | 22,9 kJ |
| 1575 s | 7,55 m | 0,528 | 18,8 / 18,8 W | 22,9 kJ |
| 1585 s | 15,70 m | 0,708 | 289,2 / 289,2 W | 22,9 kJ |
| 1590 s | 20,38 m | 0,905 | 371,28 / 371,28 W | 22,8 kJ |
| 1595 s | 25,61 m | 1,000 | 371,28 / 371,28 W | 22,6 kJ |
| 1608 s | 41,86 m | 1,000 | 371,28 / 371,28 W | 22,0 kJ |

- F009 unmittelbar davor fährt im selben Abschnitt überwiegend mit 0 bis wenig angeforderten Watt im engen Windschatten (Aero-Faktor zunächst 0,40, später ~0,61); er ist bei t=1608 ca. 18,45 m/s schnell, F107 nur ca. 17,11 m/s. Dass F009 trotz 0-W-Phasen auf der Abfahrt schneller rollt, ist im physikalischen Modell mit unterschiedlichen lokalen Aero-/Positionsverhältnissen möglich.
- Bei F107 ist die **prognostizierte Beschleunigung der Gruppenfront** oft deutlich stärker negativ (etwa −0,25 bis −0,32 m/s²) als die reale Beschleunigung des Vorderrads (etwa −0,02 bis −0,05 m/s²). Der **gemischte Referenzwert** bleibt stark negativ und reduziert die Wattanforderung. Beispiel t=1575: Vorderrad −0,05, Gruppenfront −0,25, gemischt −0,23 m/s²; trotz bereits 7,55 m Lücke fordert F107 nur 18,8 W.
- Der vorhandene Widerspruchsschutz in `local-group-reference.ts` greift nur, wenn das Vorderrad **nicht verzögert** (`localAcceleration>=0`). Bei leicht negativer lokaler Beschleunigung und stark negativer Fernreferenz greift er **nicht**.

## Bewertung

**Mit dieser Testkonfiguration nachgewiesene Kette:** Der Regler fordert in der frühen Phase eines wachsenden Abstands auf der Abfahrt sehr wenig bzw. null Leistung; der Abstand vergrößert sich, der lokale Formationswindschatten schwächt sich über den 24-m-Bereich vollständig ab; anschließend wird der Fahrer auf seinen freiwilligen Gruppenregler-Deckel von 112 % CP begrenzt und verliert weiter Anschluss. Der erste 42-m-Riss erfordert weder eine Attacke noch eine Umschaltung auf `stable-pack-follow` oder eine fehlerhafte Energiebuchung.

**Kausale Einschränkung:** Die Daten zeigen die gesamte zeitliche Abfolge, beweisen aber noch nicht, dass ausschließlich die Fernbeschleunigungsreferenz den späteren Abstand verursacht. Auch die 1D-Pack-Anordnung (154 Fahrer in extrem geringer Längenausdehnung) und das Windschatten-Fading verstärken die Kette. Ein einzelner Test und ein Fahrer beweisen keine allgemeinen Rennwahrscheinlichkeiten.

## Kleinste begründete Korrekturoption – noch NICHT implementiert

Den **bestehenden lokalen Widerspruchsschutz gezielt erweitern**, statt die ganze Gruppenregel umzustellen: Wenn der unmittelbare Vordermann schneller ist (Lücke öffnet sich) und seine gemessene lokale Verzögerung **geringer** als die prognostizierte Fernverzögerung ist, bei der Folgeleistungsberechnung vorübergehend seine lokale Beschleunigung zugrunde legen. Entscheidend: Der alte Schutz behandelt nur `localAcceleration >= 0`; dies kann in der Versuchskopie auf lokale *weniger starke Verzögerung* erweitert werden. Kein Rad wird teleportiert, keine Geschwindigkeit oder Energie verschenkt.

**Vorbehalt:** Auch die frühere globale Umstellung auf Vorderradbeschleunigung und pauschale ±0,1-m/s²-Begrenzung änderten Vollrennen teilweise erheblich und wurden abgelehnt. Deshalb muss die neue Bedingung auf das tatsächlich **öffnende** Vorderrad und **negative** Fernverzögerung beschränkt werden. Nicht ungetestet in MVP übernehmen.

**Kleinster Abnahmetest:** Ein einziger bedingter Regelversuch, gepaarte Kontrolle des Anstieg→Abfahrt-Tests sowie Ebene und Anstieg→Ebene (Seed 2026), dann Seeds 42/123 und wenigstens kleine Vollrenn-Negativkontrollen. Bericht: erster 42-m-Riss, Aero-/Leistungs-Zeitreihe und Gruppenverteilungen; keine fixierten Sieger, keine bloße größere 42-m-Schwelle. Bei Widerspruch oder schlechten Nebeneffekten nicht mergen.

## Entscheidung zum bisherigen Versuch

[PR #82](https://github.com/Lancester/radsportmanager/pull/82) (Schutz gegen stark **positive** Fernbeschleunigung) ergab in vier paarigen Rennen keine Änderungen. Der jetzt gemessene erste Gruppenriss hängt vielmehr mit **stark negativer** Fernverzögerungsreferenz beim Wegrollen zusammen. Den vorherigen Versuch nicht übernehmen. Beide Versuche/Diagnosebranches bleiben bis zur Entscheidung archiviert.
