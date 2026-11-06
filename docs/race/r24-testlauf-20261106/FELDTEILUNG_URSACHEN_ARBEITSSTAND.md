# Lille Seed 101: Ursachenprüfung – gesicherter Zwischenstand

Stand 06.11.2026. Der große Vergleich ist angehalten. Die [Feindiagnose](LILLE_101_FEINDIAGNOSE_FELDTEILUNG.md) und die dort gesicherten Ursprungsdaten bleiben unverändert.

## Diagnose-Zielidentität

Anschlussaufträge tragen jetzt die ID des tatsächlich geschützten Fahrers. Die Telemetrie verfolgt diese explizite ID und gibt sie als `protectedRiderId` aus. Für Kapitäne bleibt das bisherige Feld `captainId` als Kompatibilitätsangabe erhalten; bei Sprintern wird es nicht irreführend gesetzt. Alte Aufrufe ohne ID können weiterhin den Kapitän verwenden. Ein fremdes explizites Teamziel wird nicht stillschweigend auf den Kapitän umgebogen. Wenn das Team den geschützten Fahrer wechselt, endet der alte Versuch, bevor ein neuer eröffnet wird.

Dies erweitert ausschließlich die Informationen des vorhandenen Auftrags und die optionale Telemetrie. Es aktiviert keinen neuen Sprintanschluss und verändert keine angeforderten Watt. Der im vorherigen Experiment erkannte Fehler ist damit für explizit benannte Fahrer auf Modulebene abgedeckt. 19 gezielte Tests, darunter Sprintziel statt Kapitän, ungültiges Teamziel und Zielwechsel, sowie der TypeScript-Build bestanden. Ein 30-km-Transparenztest mit und ohne Diagnostik bestand ebenfalls auf dem aktuellen Stand; seine Ergebnisse sind nicht als vollständige Testsuite auszugeben.

## Erste Gegenprobe zum Mitfahr-Wattwunsch

Ein separater Versuch auf unverändertem Engine-Stand `772d1e910d01f991fe69f857e1291fb474978afe` erhöhte ausschließlich den heuristischen Deckel `R22_GROUP_RIDING.maximumFollowingCpFraction` von 1,12 auf 1,35. Dieser Wert betrifft den gewünschten Mitfahrwattwert im großen Gruppenregler; CP/W′ und die physikalische Abrechnung wurden nicht erhöht oder umgangen. Die Änderung war über das gesamte Rennen aktiv, ist keine übernommene Einstellung und darf nicht mit der Originalserie vermischt werden.

Im einen Lille-Lauf Seed 101 blieb mit diesem Versuch das Feld bei den 5-km-Messpunkten von km 55 bis km 95 in einer 154er-Abstandsgruppe; F023 gewann. Im Ausgangslauf befand sich F023 bei km 75 in einer 61er-Gruppe und kam als 67. mit 432,60 s Rückstand ins Ziel. Die gemeinsame Basiseingabe hatte denselben Hash; in beiden Läufen wurden alle 154 Fahrer klassiert und die Energiebilanz blieb innerhalb der bestehenden Toleranz.

Die Gegenprobe zeigt eine **Empfindlichkeit gegenüber dieser Heuristik**. Da der Eingriff von Anfang an wirkt, spätere Rennentscheidungen ändert und nur ein Seed vorliegt, belegt sie nicht, dass der Deckel an der konkreten Lücke die alleinige Ursache oder 1,35 sportlich richtig ist. Ein engerer Eingriff im Zeitfenster der beobachteten Lücke ist gestartet und muss separat dokumentiert werden. Keine Änderung an Rennparametern wurde auf dem Entwicklungsbranch übernommen.


## Zeitlich begrenzte Gegenprobe

Ein zweiter isolierter Engine-Checkout änderte denselben Mitfahrregler **nur zwischen Rennzeit 5650 und 5800 s** und nur bei einem Abstand von mindestens 24 m zum unmittelbar vorausfahrenden Fahrer: Der lokale Anforderungsdeckel wurde in dieser Situation von 1,12 auf 1,35 Tages-CP erhöht. Diese experimentelle Umschaltung ist keine allgemeine Änderung des Modells. Sie betrifft potenziell mehrere Fahrer und entscheidet weder direkt über Geschwindigkeit noch über die tatsächlich verfügbare physiologische Leistung.

Bis zum Eingriff stimmten alle 1.904 aufgezeichneten Ereignisse und alle 14 vorhandenen 5-km-Checkpoints exakt überein. Dies ist eine Kontrolle der vorliegenden Daten, keine Behauptung identischer nicht aufgezeichneter Zustände. Die beobachtende 5-s-Aufzeichnung des Versuchs stimmte in vollständiger Klassifikation, Ereignisliste und Diagnostik mit demselben uninstrumentierten Versuch überein.

Bei t=5690 s waren die ersten beobachteten Unterschiede im 5-s-Raster unter anderem:
- F132: 427,7 W statt 457,6 W angefordert und jeweils tatsächlich umgesetzt; der Ausgangsabstand zum nächsten Fahrer betrug 37,7 m.
- F111: 426,0 W statt 475,5 W angefordert und jeweils tatsächlich umgesetzt; der Ausgangsabstand betrug 26,9 m.

In der Ausgangsversion war F023 bei km 75 Teil einer 61er-Gruppe; im Versuch fuhr er zu diesem Zeitpunkt in einer 125er-Gruppe. Bei km 80 und 85 wurde diese Gruppe auch im Versuch wieder geteilt (F023 jeweils in einer 61er-Gruppe), bei km 90 war F023 wieder in einer 123er-Gruppe. Im Versuch gewann F023; im Ausgangslauf wurde er 67. mit 432,60 s Rückstand. In beiden Läufen wurden 154 Fahrer klassiert; der maximale absolute Energie-Residualwert lag im Versuch bei rund 0,000058 J.

Damit ist der begrenzte Mitfahrwunsch an großen Lücken in diesem Seed ein **konkreter kausaler Einfluss auf den beobachteten Rennverlauf**, nicht bloß eine Korrelation. Der Eingriff wirkt aber auf mehrere Fahrer und der spätere Verlauf kann sich danach verzweigen. Er belegt weder, dass genau ein einzelner Fahrer allein die Trennung verursacht, noch dass 135 % ein allgemein angemessener Grenzwert wären. Die wiederholte Teilung im Versuch unterstreicht, dass weiterhin Gruppendynamik und Anschlussentscheidungen zu prüfen sind.

## Datensicherung

Die vollständigen Ergebnisse des globalen und zeitlich begrenzten Experiments liegen in den numerisch zu verbindenden Dateien `lille101-cap-teil-00.b64` bis `-03.b64`. Nach Base64-Dekodierung beträgt die SHA-256-Prüfsumme des gzip-Streams `1da82fe5ab016bae31c90d06cdc1e93371fde61eca1dc090e6c90cfa0d1de893`; die JSONL-Inhalte enthalten Dateinamen, Einzelprüfsummen und Rohdaten. Alle vier Teile wurden nach dem Hochladen bytegleich überprüft. Die lokal begrenzten Änderungen sind als `lille101-cap-global.patch` und `lille101-cap-window.patch` gesichert und nicht auf den Engine-Branch angewendet.

Der 5-s-Ausschnitt des instrumentierten Zeitfensterversuchs von t=5650 bis 5750 s ist in `lille101-cap-window-trace.b64` gesichert; nach Base64-Dekodierung hat der gzip-Stream SHA-256 `b88d0b6602c817078e8fe13f5b8092afb03338b4d363961e9a263c20b18ce66b`. Derselbe Trace-Hook aus `lille101-trace.patch` wurde nach dem Zeitfenster-Patch verwendet. Ein weiterer Versuch mit Beschränkung auf die beobachteten Fahrer F111 und F132 läuft und ist getrennt auszuwerten.
