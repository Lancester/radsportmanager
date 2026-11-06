# R24: Zwischenanalyse der vorhandenen Vergleichsrennen

Stand 06.11.2026. Der Nutzer wünschte eine Zwischenanalyse vor weiteren Rechnungen. Die laufende Serie wurde angehalten. Gesichert sind 112 Renndateien in 56 Paaren: Lille gemeinsames und Profilfeld je 10 Paare, Boulogne je 10, Lüttich gemeinsames Feld 10 und Profilfeld 6. Beide Lille-Felder sind identisch und dürfen nicht als unabhängige zweite Stichprobe gezählt werden. Hautacam und Zusatzszenarien fehlen in dieser Serie noch. Die zuvor separat archivierten sechs Einzelkontrollrennen bleiben davon getrennt.

## Technische Grundlage

Alle 24 Sicherungsblöcke und 112 Einzeldateien wurden mit dem Wiederherstellungsskript anhand ihrer Prüfsummen und Herkunft wiederhergestellt. Für die Auswertung wurden vollständige main/dev-Paare mit übereinstimmendem Hash der gemeinsamen Basiseingaben verwendet. Die neu gestarteten Läufe prüften Klassifikation und Energiebilanz innerhalb der implementierten Toleranz. Die gemeinsame Hashbasis enthält nicht alle später hinzugekommenen Ermüdungsattribute. Gleicher Seed garantiert keine identischen späteren Zufallsentscheidungen. Der Vergleich umfasst mehrere Modelländerungen gleichzeitig, daher erlaubt er keine eindeutige Ursachenzuordnung. Der letzte dokumentierte vollständige Standardtest hatte zwei Zeitüberschreitungen und ist nicht durch diese Rennläufe ersetzt.

## Erste Ergebnisse

| Profil/Feld | Paare | Sieger main | Sieger Eintagesmodell | 1-s-Siegergruppe Median main / neu |
| --- | ---: | --- | --- | ---: |
| Lille, gemeinsames Feld | 10 | 9 Sprinter, 1 Klassiker | 8 Sprinter, 2 Kletterer | 29 / 7 |
| Boulogne, gemeinsames Feld | 10 | 8 Klassiker, 1 Sprinter, 1 Zeitfahrer | 3 Klassiker, 4 Kletterer, 2 Sprinter, 1 Zeitfahrer | 1 / 1,5 |
| Boulogne, Profilfeld | 10 | 10 Klassiker | 2 Klassiker, 3 Kletterer, 4 Sprinter, 1 Zeitfahrer | 1,5 / 1,5 |
| Lüttich, gemeinsames Feld | 10 | 10 Klassiker | 5 Allrounder, 5 Kletterer | 1,5 / 3 |
| Lüttich, Profilfeld | 6 | 6 Klassiker | 1 Klassiker, 5 Kletterer | 2,5 / 1 |

Die Fahrertyp-Etiketten beweisen für sich weder einen Fehler noch die Fähigkeiten eines Fahrers im Detail. Die Siegergruppe entsteht aus nachberechneten individuellen Zielzeiten mit einer 1-s-Nachbarlücke; sie ist keine vollständige offizielle Zeitwertung. Bei Lille beträgt die mediane Siegergruppe unter einer 3-s-Nachbarregel 37 bei main und 42 beim neuen Modell. Wie groß das Feld tatsächlich beisammen ist, muss deshalb zusätzlich anhand von Gruppen und individuellen Ziellücken geprüft werden.

## Häufige Verfolgungsbeginne

Beim neuen Modell wurden durchschnittlich 2.193 Verfolgungsbeginne auf Lille/common, 1.906 auf Boulogne/common und 1.544 auf Lüttich/common registriert. Davon waren 1.755, 1.571 bzw. 1.211 ausdrücklich als Reaktion auf einen Angriff bezeichnet; 1.125, 939 bzw. 716 dieser Reaktionsbeginne lagen jeweils in den ersten 30 km. Es handelt sich um interne Zustandsbeginne, nicht um verschiedene Fahrer, dauerhafte Verfolgungen oder einen Nachweis erhöhter Leistung. Die alte Beschriftung ist nicht direkt vergleichbar. Die Wiederholung auf mehreren Profilen macht die Auswertung der Anlass-, Abbruch- und Wiederaufnahmebedingungen zu einer Priorität. Dafür konkrete Reaktionen, Dauer, Gruppenzugehörigkeit und tatsächliche Leistung untersuchen; keine pauschale Ereignisobergrenze einführen.

## Konkreter Flachlauf: Lille, Seed 101

Im neuen Modell gewinnt der als Kletterer gekennzeichnete Kapitän F050; der Sprintfavorit F023 wird 67. mit 432,6 s Rückstand. Bei km 50 befanden sich beide in derselben 152er-Gruppe; bei km 70 in verschiedenen Gruppen mit 60 beziehungsweise 61 Fahrern. Bei km 75 lag F050 im 64er-Verband und F023 in einer 61er-Gruppe. Bei km 100 betrug F023s Abstand zur Rennspitze rund 1,62 km und bei km 180 rund 5,41 km; seine W′-Reserve wurde an diesen Messpunkten mit 100 % angezeigt. Bei main wurde F023 im gleichen Seed Zweiter mit 0,34 s Rückstand und war bei km 75 in einem 147er-Feld.

Das ist ein konkreter Verdacht auf problematische Feldteilung bzw. unzureichenden Anschluss und nicht der Beweis, dass W′ oder eine einzelne Regel die Ursache ist. Checkpoints sind Momentaufnahmen; volle W′ bedeutet weder volle Langzeitreserve noch, dass ein Anschluss physisch möglich oder taktisch beschlossen war. Zuerst Geschwindigkeits- und Gruppenentwicklung, Gelände, Auslöser der Lücke, Verfolgungsbereitschaft, Leistung, Windschutz und Teamaufträge für F023 und Helfer eingrenzen. Ein regelbasierter Gegenversuch ohne Attacken ist eine geeignete ergänzende Kontrolle; das Ergebnis steht noch aus.

Im anderen Lille-Kletterersieg, Seed 31415, war derselbe Kapitän F050 bei km 150 bereits allein vorn und gewann 1,37 s vor einem Sprinter. Ein knapper Solosieg ist als solcher möglich; zu prüfen sind Entstehung der Flucht, Jagdarbeit und Tempoentwicklung. Die beiden Kletterersiege haben somit nicht automatisch dieselbe Ursache.

## Favoriten und weitere Prüfungen

Im Lüttich-Profilfeld wird F135 in allen sechs Läufen als nominell stärkster Profil-Proxy ausgewählt, seine Rolle ist aber Helfer; seine Ränge im neuen Modell sind 137, 138, 142, 143, 111 und 5. Daraus kann man ohne Team- und Rollenbetrachtung nicht auf ein Versagen eines geschützten Kapitäns schließen. Vorabfavoriten müssen neben dem Leistungsproxy anhand tatsächlich vorgesehener Rolle und Teamziel ausgewiesen werden; der Proxy selbst sollte transparent bleiben.

Vorrangig: (1) konkrete frühe Verfolgungszustände und Feldteilung in Lille/101 untersuchen, inklusive Gegenprobe; (2) Solo-/Jagdverlauf Lille/31415 untersuchen; (3) Favoritenbewertung und Rollen trennen; (4) Fahrerwerte und entscheidende Verläufe auf Boulogne und Lüttich prüfen. Danach kleine kausale Änderungen gezielt vor/nach mit identischen Eingaben testen und die bestehende Serie als historischen Vorher-Stand erhalten. Bei Änderungen sind neue Modellstände klar getrennt zu kennzeichnen; die aktuellen Ergebnisse dürfen nicht zu einer Serie mit geänderter Engine vermischt werden. Bis dahin keine Aussage, dass das Gesamtmodell sportlich validiert ist.
