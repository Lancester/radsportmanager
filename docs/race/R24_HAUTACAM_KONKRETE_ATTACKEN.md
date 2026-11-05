# R-24: Konkrete Attacken und Grenzen der 5-km-Telemetrie

Stand 05.11.2026. Ergänzung zu R24_HAUTACAM_DETAILPRUEFUNG.md. Ausgangsdaten: zehn Entwicklungsläufe Hautacam/profile. Ein Ereignis zählt den Wechsel zur Angriffsabsicht eines einzelnen Fahrers, nicht automatisch eine radsportlich vollwertige Attacke. Kein Sollwert und keine Engineänderung.

## Verteilung

Zwischen 43 und 60 registrierte Angriffsversuche je Rennen verteilen sich auf 31 bis 43 verschiedene Fahrer. Ein Fahrer verzeichnet maximal fünf Versuche in einem Rennen; bei Seed 101 F057 fünf, F078 vier; bei Seed 777 F134, F078 und F015 je vier. Die Zahl aller Versuche darf nicht als Häufigkeit eines einzelnen Favoriten gelesen werden.

## Konkrete Fälle

- Seed 777 F134 km 20,7: Start in Gruppe 146, 96 m hinter der zu diesem Zeitpunkt aktiven Rennspitze. 70 s Angriffsabsicht, 7,3 kJ oberhalb effektiver CP. Fünf eigene Kilometer später ca. 484 m vor dem vordersten noch aktiven Mitglied seiner ursprünglichen Gruppe; später gewinnt er. Nach fünf km gemessen, kein Beweis einer lückenlosen Solofahrt oder Siegursache.
- Seed 777 F134 km 174,2: Angriff in Zweiergruppe, 70 s, 9,0 kJ über effektiver CP. Fünf km später 516 m vor dem zu diesem Zeitpunkt noch aktiven früheren Gruppenmitglied. Typus finale Bergattacke grundsätzlich verständlich; konkreter Wert und Bedingungen müssen nicht stimmen, nur weil Ausgang zum Szenario passt.
- Seed 42 F079 km 56,7: Start Gruppe 77, 799 m hinter aktiver Spitze, 60 s, 5,2 kJ über effektiver CP; fünf km später etwa 1 m hinter dem vordersten noch aktiven früheren Gruppenmitglied, in einer Gruppe von 50. Ein misslungener Versuch ist nicht an sich ein Fehler; anhand der gespeicherten Daten ist keine klare taktische Motivation dokumentiert.
- Seed 777 F078: vier Versuche bei km 73,2, 105,4, 116,7 und 175,6. Beim ersten nach fünf km praktisch kein Vorsprung vor dem vordersten früheren Gruppenmitglied; beim zweiten ca. 87 m Vorsprung, aber zur aktiven Rennspitze größerer Rückstand als zuvor; beim dritten ca. 27 m vor dem früheren Gruppenmitglied. Beim vierten ist der Fahrer zu Beginn alleine, gut 1,6 km hinter der aktiven Spitze. Ob dieser Versuch sportlich sinnvoll ist, bleibt mangels Ziel, Rennlage und Zeitverlauf offen. Er beendet das Rennen auf Platz 21.

## Messgrenze: Zieleinlauf der Spitze

Die Simulator-Telemetrie sucht die vorderste noch fahrende Person und vergleicht ehemalige Gruppenmitglieder nur, solange diese noch nicht im Ziel sind. Nach dem Zieleinlauf des Siegers kann die "aktive Spitze" daher nach hinten wandern. Beispiel F078, Seed 777: Nach seiner Attacke bei km 175,6 wird fünf km später der Abstand zur aktiven Spitze mit 0 m angegeben, obwohl Sieger F134 bereits über 200 Sekunden zuvor im Ziel war. Die Angabe bedeutet nicht, dass F078 die Rennspitze erreicht oder das Rennen gewonnen hat. Frühere Berichte mit Abständen zu Zeitpunkten nach Siegerankunft müssen entsprechend interpretiert werden.

In der bisherigen Zahl 66 von 482 für >50 m Abstand zum vordersten noch aktiven ehemaligen Gruppenmitglied sind fünf-Kilometer-Messungen nach Siegerankunft enthalten. Beschränkt auf Messungen vor der Siegerankunft bleiben 472 Versuche; bei 60 beträgt der Vorsprung >50 m, bei 307 ist der Wert nicht positiv. Auch diese Teilmenge ist keine allgemein gültige Erfolgsquote und beweist keinen lückenlosen Verlauf.

## Einordnung

Das reale Hautacam-Rennen 2025 hatte nach Veranstalterangaben nach einer Angriffswelle eine 52-köpfige Gruppe ab km 17: https://www.letour.fr/en/news/2025/stage-12/pogacars-stunning-response-at-hautacam/1329344 . Der Bericht bietet keine vergleichbare standardisierte Zahl aller individuellen Angriffsversuche. Die 43–60 Simulatorereignisse pro Rennen lassen sich deshalb nicht direkt als zu hoch oder richtig beweisen. Angriffe in verlorenen Gruppen oder ohne erkennbares Ziel sowie wiederholte erfolglose Versuche bleiben konkrete Verdachtsmomente; taktische Ziele, Nutzen, Zeiten und Verfolgergruppen sind genauer zu instrumentieren. Mehrere Angriffe eines Fahrers sind nicht grundsätzlich falsch, und eine starre Obergrenze von vier oder fünf ist nicht begründet.

Empfohlen: zuerst untersuchen, welche Entscheidung/Absicht die Beispiele auslöst und ob Ziel und Rennsituation vorliegen. Klärung der aktiven Spitze nach Zieleinlauf für Telemetrie und ggf. Rennentscheidungen getrennt prüfen. Keine Änderung allein zur Anpassung der Ereigniszahl.
