# Lille Seed 101: Ursachenprüfung – gesicherter Zwischenstand

Stand 06.11.2026. Der große Vergleich ist angehalten. Die [Feindiagnose](LILLE_101_FEINDIAGNOSE_FELDTEILUNG.md) und die dort gesicherten Ursprungsdaten bleiben unverändert.

## Diagnose-Zielidentität

Anschlussaufträge tragen jetzt die ID des tatsächlich geschützten Fahrers. Die Telemetrie verfolgt diese explizite ID und gibt sie als `protectedRiderId` aus. Für Kapitäne bleibt das bisherige Feld `captainId` als Kompatibilitätsangabe erhalten; bei Sprintern wird es nicht irreführend gesetzt. Alte Aufrufe ohne ID können weiterhin den Kapitän verwenden. Ein fremdes explizites Teamziel wird nicht stillschweigend auf den Kapitän umgebogen. Wenn das Team den geschützten Fahrer wechselt, endet der alte Versuch, bevor ein neuer eröffnet wird.

Dies erweitert ausschließlich die Informationen des vorhandenen Auftrags und die optionale Telemetrie. Es aktiviert keinen neuen Sprintanschluss und verändert keine angeforderten Watt. Der im vorherigen Experiment erkannte Fehler ist damit für explizit benannte Fahrer auf Modulebene abgedeckt. 19 gezielte Tests, darunter Sprintziel statt Kapitän, ungültiges Teamziel und Zielwechsel, sowie der TypeScript-Build bestanden. Ein 30-km-Transparenztest mit und ohne Diagnostik bestand ebenfalls auf dem aktuellen Stand; seine Ergebnisse sind nicht als vollständige Testsuite auszugeben.

## Erste Gegenprobe zum Mitfahr-Wattwunsch

Ein separater Versuch auf unverändertem Engine-Stand `772d1e910d01f991fe69f857e1291fb474978afe` erhöhte ausschließlich den heuristischen Deckel `R22_GROUP_RIDING.maximumFollowingCpFraction` von 1,12 auf 1,35. Dieser Wert betrifft den gewünschten Mitfahrwattwert im großen Gruppenregler; CP/W′ und die physikalische Abrechnung wurden nicht erhöht oder umgangen. Die Änderung war über das gesamte Rennen aktiv, ist keine übernommene Einstellung und darf nicht mit der Originalserie vermischt werden.

Im einen Lille-Lauf Seed 101 blieb mit diesem Versuch das Feld bei den 5-km-Messpunkten von km 55 bis km 95 in einer 154er-Abstandsgruppe; F023 gewann. Im Ausgangslauf befand sich F023 bei km 75 in einer 61er-Gruppe und kam als 67. mit 432,60 s Rückstand ins Ziel. Die gemeinsame Basiseingabe hatte denselben Hash; in beiden Läufen wurden alle 154 Fahrer klassiert und die Energiebilanz blieb innerhalb der bestehenden Toleranz.

Die Gegenprobe zeigt eine **Empfindlichkeit gegenüber dieser Heuristik**. Da der Eingriff von Anfang an wirkt, spätere Rennentscheidungen ändert und nur ein Seed vorliegt, belegt sie nicht, dass der Deckel an der konkreten Lücke die alleinige Ursache oder 1,35 sportlich richtig ist. Ein engerer Eingriff im Zeitfenster der beobachteten Lücke ist gestartet und muss separat dokumentiert werden. Keine Änderung an Rennparametern wurde auf dem Entwicklungsbranch übernommen.
