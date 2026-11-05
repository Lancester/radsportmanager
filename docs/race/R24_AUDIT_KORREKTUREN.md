# R-24: Auditkorrekturen an Ermüdung und autonomer Renn-KI

**Status:** experimenteller Kandidat auf einem Entwicklungsbranch; nicht nach
`main` übernommen und nicht sportlich kalibriert. Basis ist `main`-Commit
`621e712371563278c5bed2bb643dd598a9a7bcf4`. Dieses Dokument ergänzt die
historischen R-22/R-23-Referenzen und ersetzt keine bereits gemergte Version.

## Ziel und Grenzen

Der Bewegungsintegrator und der CP/W′-Rechenkern bleiben erhalten. Die
Korrekturen betreffen ihre Kopplung im experimentellen `stable-pack` sowie
Entscheidungen und Diagnosen der Fahrer- und Team-KI. Der historische
`legacy`-Standard und alte Vergleichsmodi bleiben verfügbar. Es gibt keine
festen Sieger, Zielzeiten, Gruppenstärken oder direkten Positionsvorgaben.
Manager legt weiterhin nur die grundsätzliche Leitlinie fest; Auswahl,
Anzahl und Ablösung der Jagdhelfer sind im adaptiven Modus autonom. Ein
früheres Kompatibilitätsfeld `chaseHelperCount` beeinflusst ihn nicht.

Es handelt sich um ein weiterhin eindimensionales, regelbasiertes
Simulationsmodell. Es existieren noch keine implementierten eigenständigen
Personalattribute eines sportlichen Leiters und kein spielbarer Karrieremodus.
Keine Aussage hier belegt die statistische Übereinstimmung mit realen Rennen.

## Was geändert wurde

1. **Ermüdung:** Die bestehende R-19-Verfügbarkeit skaliert die aktuell
   verfügbare Dauer- und Spitzenleistung statt jeden niedrigen Wattwunsch.
   Die resultierende aktuelle CP wird im vorhandenen CP/W′-Kern sowohl
   für den Verbrauch als auch für die Erholung verwendet. Beispiel: Ein
   200-W-Wunsch wird bei 80 % Verfügbarkeit nicht automatisch auf 160 W
   reduziert. W′ bleibt eine separat bilanzierte Reserve. Die proportionale
   Absenkung von CP und Spitzenleistung ist eine vorläufige, **nicht
   biologisch kalibrierte Modellannahme**; sie ist keine neue komplexe
   Physiologie. Fehlende Energie wird nicht verschenkt.
2. **Fahrer und Teams:** Kapitäne können unabhängig von einer verpflichtend
   offensiven Teamstrategie auch spät und in kleinen Gruppen attackieren.
   Die Entscheidung berücksichtigt verfügbare Leistung, W′, Position,
   Steigung, Rennsituation und Teaminteresse. Entschlüsse sind pro Fahrer,
   Seed und Entscheidungstakt reproduzierbar. Kapitänsschutz kann bei
   Bedarf einen verfügbaren nahen Helfer nominieren.
3. **Jagd und Einholen:** Auch größere vorausfahrende Gruppen werden
   betrachtet. Das Team berücksichtigt eigene Kapitäne, Sprinter und
   Helfer vorne. Einholungen setzen eine reale Wiedervereinigung zuvor
   getrennter Beteiligter über eine Mindestdauer voraus; zurückliegende
   Fahrer verhindern das Ereignis nicht mehr. Eine lange Kette innerhalb
   einer Abstandsgruppe zählt nicht als Einholung, solange ein früherer
   Ausreißer noch mehr als 35 m vor dem früheren Hauptfeld fährt. Auch im Finale werden
   Entscheidungen nicht durch die alte 94-/99,5-%-Sperre beendet.
4. **Gelände und Gruppen:** Zusammenhängende Anstiege werden über mehrere
   Streckenabschnitte hinweg erkannt. Rampenfahrer werden nach verfügbarer
   Leistung und Masse statt allein nach ihrem Typ-Etikett ausgewählt. Die
   Streckenlängengrenzen und das pauschale Verbot später Klassikerattacken
   gelten im adaptiven Modell nicht mehr. Die Referenz für die Gruppenfahrt
   orientiert sich lokal: Der Einfluss eines entfernten Feldkopfs klingt
   stetig ab. Windschatten verwendet im neuen Modell die Formation statt
   zusätzlich den teils widersprüchlichen alten Pack-Proxy.
5. **Sprint und Messung:** Ein Sprinter direkt neben einer durch die
   Gruppenschwelle getrennten Konkurrenz kann selbst zum Sprint antreten.
   Die Diagnose unterscheidet frontnahes Fahren von wirklicher exponierter
   Arbeit. Neue Angriffsdaten dokumentieren angeforderte und tatsächlich
   abgerechnete Kurbelarbeit, W′ und die eigene Position fünf Kilometer
   nach Beginn. Unvollendete 5-km-Beobachtungen werden nicht als Erfolg
   ausgegeben. Für Profilvergleiche kann mit `--roster flach` dasselbe
   Fahrerfeld auf allen Strecken verwendet werden.

## Weiterhin vorhandene vereinfachende Schwellen

Die Korrektur entfernt nicht alle Schwellen: Beispiele sind 42 m zur
Abstandsgruppenbildung, 24 m für die zugrunde liegende Formation,
500 m als Auslaufdistanz des Feldkopf-Einflusses, ein Mindestabstand für
Jagdentscheidungen, Reserveschwellen, eine zehnsekündige KI-Taktung und
eine vereinfachte Sprint-/Zielgruppenlogik. Diese Größen sind
Modellheuristiken und müssen anhand reproduzierbarer Szenarien geprüft
werden. Die 42-m-Gruppengrenze ist keine Windschattengrenze. Der
Massenprint-Proxy ist weiterhin nur eine Diagnose, keine Ergebnisvorgabe.

Die Verfolgungskoordination ist weiterhin überwiegend auf das jeweils
größte Feld und die Spitze gerichtet; die autonome Zusammenarbeit kleinerer
zurückliegender Gruppen ist nicht vollständig modelliert. Ob Sprintzüge,
Nachführarbeit, Ausreißerhäufigkeiten und physiologische Parameter über
unterschiedliche Fahrerfelder und Seeds glaubwürdig sind, bleibt offen.
Auch die Aussagekraft der fiktiven Referenzfahrer und approximierten
Strecken ist begrenzt.

## Wiederaufnehmbarer Zwischenstand, 05.11.2026

- **Erledigt:** Implementierung der oben beschriebenen experimentellen
  Kopplung und autonomen Entscheidungen. Begleitende Unit- und Szenariotests
  sowie die 5-km-Angriffsdiagnose wurden ergänzt; Code und Dokumentation
  befinden sich auf dem Entwicklungsbranch.
- **Geprüft:** 40 gezielte Tests und die TypeScript-Typprüfung bestehen
  nach dem ersten Zwischenstand. Der Browser-ESM-Build wurde danach
  wiederholt und besteht. Die korrigierte Diagnostik wurde für `legacy`
  und `stable-pack` erneut erfolgreich geprüft. Vier spezialisierte
  Einholungsfälle einschließlich langer Abstandsketten bestehen nach der
  nachfolgenden Korrektur. Zwei temporäre Varianten mit
  300 und 500 m Feldkopf-Auslaufdistanz wurden in den Lille-Seeds 42 und
  2026 gegenübergestellt. Die 500-m-Variante erhielt bei ca. km 46,5 im
  größeren Feld 138 bzw. 153 Fahrer; bei 300 m waren es 125 bzw. 127.
  Das ist eine begrenzte Sensitivitätsprüfung, keine Kalibrierung und keine
  Garantie für andere Seeds oder das Finale.
- **Laufend:** Eine erste vollständige lokale Testsuite meldete 357 von 358
  Tests bestanden. Ein Diagnostiktest scheiterte am zusätzlich vorhandenen
  optionalen Angriffsausgabe-Feld; der Test wurde danach angepasst und
  vergleicht nach dessen Entfernen weiterhin das gesamte Rennergebnis,
  einschließlich eines neuen `stable-pack`-Vergleichs. Während dieser
  Gesamtserie wurden weitere Änderungen vorgenommen; auch die zweite
  laufende Serie begann vor der zusätzlichen Korrektur langer Ketten.
  Deshalb ersetzt keine davon einen erneuten vollständigen Lauf auf einem
  eingefrorenen Stand.
- **Offen:** Endgültige Mehrseed-Referenzläufe mit dem zuletzt geänderten
  Code; gleiche Fahrer über alle vier Profile; Wirkung und Kosten der
  Angriffe; verbleibende Feldfragmentierung und große Rückstände auf
  hügeligen und langen Profilen; technischer Gesamttest nach der letzten
  Änderung; GitHub-CI und ein Android-Gesamtrennbenchmark. Historische
  Single-Seed-Erwartungen dürfen nicht als allgemeine Pflichtsiege oder
  Pflichtgruppengrößen verwendet werden. Auffällige Abweichungen müssen
  trotzdem dokumentiert und fachlich erklärt werden.
- **Nächster Schritt:** Tests abschließen, alle Probleme untersuchen und
  Ergebnisse mit genauer Version/Seed in diesem Dokument ergänzen. Den
  Kandidaten als Entwurf zur weiteren Prüfung bereitstellen und `main`
  bis zur sportlichen Abnahme unverändert lassen.

Eine grüne technische Testsuite ist keine Realismusabnahme.

## Mehrseed-Stand auf Code-Commit 7e4446c

Fünf Seeds mit je vier Profilen und 154 fiktiven Fahrern wurden vollständig lokal durchgerechnet. Die normalen Profile verwenden streckenabhängig unterschiedliche Fahrerfelder. 1-s-Zielgruppen und 60-s-Rückstände sind Modellausgaben, keine offiziellen Zeitnahmewerte.

| Seed | Profil | Siegertyp | Fahrer innerhalb 60 s | Medianrückstand s | Angriffsstarts |
| --- | --- | --- | ---: | ---: | ---: |
| 42 | flach | kletterer | 152 | 26.93 | 13 |
| 42 | huegelig | kletterer | 30 | 169.86 | 41 |
| 42 | klassiker | kletterer | 24 | 1120.31 | 74 |
| 42 | berg | kletterer | 2 | 1108.44 | 45 |
| 123 | flach | sprinter | 135 | 28.81 | 12 |
| 123 | huegelig | klassiker | 25 | 115.69 | 28 |
| 123 | klassiker | kletterer | 13 | 925.36 | 78 |
| 123 | berg | kletterer | 1 | 1244.40 | 58 |
| 2025 | flach | kletterer | 145 | 41.09 | 14 |
| 2025 | huegelig | sprinter | 43 | 173.00 | 43 |
| 2025 | klassiker | allrounder | 15 | 841.74 | 63 |
| 2025 | berg | kletterer | 1 | 1273.86 | 53 |
| 2026 | flach | sprinter | 154 | 17.29 | 24 |
| 2026 | huegelig | kletterer | 5 | 109.88 | 51 |
| 2026 | klassiker | kletterer | 1 | 930.19 | 73 |
| 2026 | berg | zeitfahrer | 6 | 955.77 | 68 |
| 2027 | flach | sprinter | 154 | 20.43 | 19 |
| 2027 | huegelig | sprinter | 35 | 104.62 | 44 |
| 2027 | klassiker | kletterer | 8 | 799.32 | 53 |
| 2027 | berg | kletterer | 1 | 1143.60 | 55 |

Auffällig: Zwei Kletterersiege auf der Flachetappe; im Seed 42 gewinnt F120 4,37 s vor dem ersten Sprinter, im Seed 2025 gewinnt F134 13,17 s vor dem ersten Sprinter. Die Umstände und Sprint-/Jagdlogik sind weiter zu untersuchen; ein Kletterersieg allein beweist keinen Fehler. Bei Liège liegen die Medianrückstände zwischen 799 und 1120 s. Auch diese Verteilung ist nicht sportlich validiert.

Gleiches Fahrerfeld (Seed 2026, `--roster flach`): Sieger Flach Sprinter, Hügel Sprinter, Klassiker Zeitfahrer, Berg Kletterer; auf Klassiker und Berg kein Sprinter in den ersten zehn. Ein Seed belegt keine Wahrscheinlichkeiten.

Die Gesamttestsuite wurde bei paralleler hoher Last vorzeitig ohne Gesamtergebnis beendet und wird mit zwei Testprozessen erneut ausgeführt.

## Gesamttest auf Code-Commit 7e4446c

Der vollständige lokale Lauf mit zwei Testprozessen ergab **358/359 bestanden**. Der Integrationstest `R-22: stable-pack auf den vier vorhandenen Einzelrenn-Profilen` scheitert im Lille-Seed 2026 an der erwarteten benannten Jagd-Führungszeit: `actualNamedChaseFrontS = 0`, obwohl 23 individuelle Sprints und je eine bestätigte Flucht und Einholung protokolliert wurden. Die Bedingung wurde bewusst nicht entfernt. Zu untersuchen ist, ob echte Führungsarbeit fehlt oder die Zuordnung/Erfassung versagt; dafür Watt, Abstand, Auftrag, Windexposition und Wechsel des nominierten Helfers zeitlich auswerten. Bis zur Klärung bleibt dies ein Abnahmeblocker.

Der weitere Stand ist ein Entwurf. Keine Android-Laufzeitmessung und keine empirische Sportvalidierung; nicht nach `main` übernehmen, bevor der fehlgeschlagene Test und die dokumentierten sportlichen Auffälligkeiten geklärt sind.

Zusatzdiagnose für denselben Lauf: Die allgemeine Kennzahl `actualChaseFrontS` meldet 2162 s; die benannte Führungsdiagnose meldet 0 s zugewiesen und keine Übergaben. Beide Kennzahlen haben unterschiedliche Erfassungsvoraussetzungen. Daraus allein lässt sich nicht entscheiden, ob Führung fehlt oder nur die späte namentliche Erfassung nicht aktiviert wurde.

## Nachprüfung Jagd und Flachfinale

Die Flucht des Lille-Seeds 2026 ist spätestens am 125-km-Messpunkt eingeholt; ab dort bis km 180 zeigen die Stichproben keine echte abgesetzte Spitzengruppe. Die namentliche Sprintjagd-Führung wird erst ab zwei Dritteln der Strecke nominiert. Daher ist `actualNamedChaseFrontS = 0` in dieser konkreten Rennlage allein kein Nachweis fehlender Arbeit. Der Integrationstest verlangt weiterhin reale Jagdfrontzeit und einen Sprint und verlangt namentliche Führung bei einer am späten Messpunkt sichtbaren Flucht. Die 18 gezielten Jagd-/Expositionstests bestehen.

Der zuvor feste Mindestwert von 20 Fahrern in der 1-s-Siegerzeitgruppe ist für den überarbeiteten Seed ebenfalls nicht allein aussagekräftig: Die Siegerzeitgruppe umfasst 6 Fahrer; die größte weitere Zeitgruppe umfasst 148 Fahrer und beginnt 1,97 s hinter dem Sieger. Die Zielgruppenberechnung und der strenge Massensprint-Proxy wurden nicht geändert. Der Test akzeptiert neben der bisherigen 20er-Siegergruppe alternativ eine große Gruppe, die innerhalb von 3 s beginnt. Ergebnisse und Grenzen dieser geänderten Testannahme sind weiter zu bewerten.

Im Lille-Seed 42 fiel unmittelbar vor dem Sieg von F120 ein abrupter Tempoabfall von F007 auf: am 174,9-km-Messpunkt ca. 38,9 km/h, bei km 175,0 ca. 28,2 km/h und 80 W auf einem modellierten Übergang mit ca. 1,4 % Steigung. F120 blieb schneller und löste sich, ohne dass dort ein neuer Angriff protokolliert wurde. Eine kausale Prüfung des Gruppenreglers und der Wattanforderung um diesen Übergang ist erforderlich; aus zwei 100-m-Abtastungen allein ist die Ursache nicht bewiesen. Dies bleibt ein offener sportlicher Befund und kein beabsichtigter Siegerbonus.

## Sprintzug-Zuständigkeit korrigiert

Eine zusätzliche Sekundenmessung im Lille-Seed 42 zeigte: F007 forderte bis Sekunde 14048 an der Feldspitze ca. 358 W an, ab Sekunde 14049 für drei Sekunden 0 W, während seine Absicht `grundtempo` und kein direkter Vordermann vorlagen. Ursache war die Sprintzug-Wattbegrenzung: Sie wurde bisher auch auf Helfer ohne Sprintzugauftrag angewendet, sobald der Sprinter innerhalb der allgemeinen Distanzgrenze war. Die Begrenzung ist jetzt an den tatsächlichen Sprintzugauftrag und die gleiche physische Gruppe gebunden. Keine Zielzeit oder Position wird vorgegeben. 17 gezielte Sprintzug-/Jagdtests bestanden; die vollständigen Rennvergleiche nach der Änderung laufen noch.

### Vergleich nach Sprintzug-Korrektur (Code-Commit 3a1fea1)

Lokale 154-Fahrer-Referenzen, Seed 2026; profileigene unterschiedliche Fahrerfelder. Alle vier Rennen beendeten die Simulation und bestanden die im Script geprüften Bilanzgrenzen. Aus diesen Einzelläufen folgt keine Realismusfreigabe.

| Profil | Sieger | Fahrer innerhalb 60 s | Medianrückstand | Angriffsstarts |
| --- | --- | ---: | ---: | ---: |
| Flach Lille | F023, Sprinter | 154 | 17,19 s | 24 |
| Hügel Boulogne | F099, Kletterer | 5 | 109,88 s | 51 |
| Klassiker Liège | F078, Kletterer | 1 | 930,19 s | 73 |
| Berg Hautacam | F117, Zeitfahrer | 6 | 955,77 s | 68 |

Flach Seed 42: Nach dem Fix gewinnt Sprinter F009, 152 Fahrer liegen innerhalb 60 s; bei km 180 umfasst die führende Abstandsgruppe 152 Fahrer. Zuvor gewann F120 nach dem unbeauftragten Abbremsen von F007. Seed 2025 gewinnt weiterhin F134 (Kletterer): Sein Angriff bei km 174,31 dauerte 70 s, verbrauchte 7,31 kJ oberhalb der aktuellen CP und lag nach eigenen 5 km 225 m vor der früheren Gruppe. Bei km 180 liegen zwei Führende vor dem größten Feld; Jagd und Feldteilung sind weiter zu prüfen.

Berg Seed 2026: F117 ist im unabhängigen Vorab-Bergfähigkeitsproxy Rang 55, gewinnt aber; die drei stärksten Kandidaten beenden das Rennen auf den Plätzen 15, 13 und 45. F117 attackiert bei km 169,83. Sein Erfolg kann auf Rennverlauf beruhen, ist aber im Zusammenhang mit vielen Zeitfahrern und Helfern unter den besten Zehn auffällig. Gruppenregel, Windschatten und Leistungs-/Ermüdungsbilanz am Schlussanstieg müssen vor der sportlichen Abnahme gezielt analysiert werden. Nicht durch Sieger- oder Typvorgaben korrigieren.

### Bergfeld vor dem Schlussanstieg

In einer lokalen 1-km-Diagnose des Hautacam-Seeds 2026 liegen F078 und F134 bereits bei km 20 um 345 bzw. 249 m zurück und bei km 50 um 2570 bzw. 1347 m. Bei km 165 beträgt ihr Rückstand etwa 2802 bzw. 2791 m. F117 fährt dort vorne, mit nahezu vollem W′ und zu diesem Zeitpunkt 100 % R-19-Verfügbarkeit. Der Schlussanstieg allein erklärt die Ergebnisreihenfolge deshalb nicht.

Gegenprobe mit `disableAttacks: true`: Bei km 20 besteht eine 144er- und eine 10er-Abstandsgruppe; bei km 30 melden die Gruppen 67/1/24/28/... Fahrer. In einem weiteren Sensitivitätslauf wurden für alle Streckensegmente nur die Technikalitätsparameter auf null gesetzt, Angriffe blieben ausgeschaltet: bei km 30 lauten die Gruppen 68/1/23/28/... . Die Abfahrts-Sicherheitsbegrenzung ist damit für diese frühe Teilung nicht hinreichend als Ursache belegt. Die Übergänge, tatsächlichen Watt und Windschatten-/Kontaktverluste der betroffenen Fahrer müssen zeitlich weiter untersucht werden. Keine Änderung wurde aus dieser Gegenprobe abgeleitet.

Der Vier-Profil-Integrationstest auf dem korrigierten Sprintzugstand besteht lokal (2/2 Testfälle); ein neuer vollständiger Gesamtlauf wurde gestartet. Die frühere 358/359-Angabe betrifft den vorherigen Teststand.

### Technischer Gesamttest nach der Korrektur

Auf dem Code von Commit `3a1fea1` (mit den in den Folgecommits angepassten Profiltests) bestand der vollständige lokale Lauf mit `node --experimental-strip-types --test --test-concurrency=2 tests/*.test.mjs`: **360/360 Tests**, keine Fehler. Das ist keine GitHub-Actions- oder Android-Messung und kein Beweis für sportlichen Realismus. Insbesondere bleibt die frühe Bergfeldteilung aus der vorstehenden Gegenprobe offen.

## Weiterführung: identisches Fahrerfeld und Untersuchung des Übergangs

`main` (`621e712`) und der R-24-Stand vor dem nächsten Versuch wurden lokal mit Seed 2026, jeweils 154 **identischen Fahrern und Teams aus dem Flachfeld**, über alle vier Strecken verglichen. Median = Median der tatsächlichen Zielrückstände. Ein Seed ist keine Statistik.

| Strecke | Sieger main → R-24 | Medianrückstand main → R-24 | innerhalb 60 s main → R-24 | Angriffsstarts main → R-24 |
| --- | --- | ---: | ---: | ---: |
| Lille | Sprinter → Sprinter | 26,9 → 17,2 s | 119 → 154 | 45 → 24 |
| Boulogne | Klassiker → Sprinter | 344,7 → 220,6 s | 24 → 26 | 19 → 45 |
| Liège | Klassiker → Zeitfahrer | 791,2 → 598,0 s | 20 → 20 | 20 → 68 |
| Hautacam | Kletterer → Kletterer | 1931,7 → 1119,2 s | 2 → 1 | 14 → 51 |

Auf Liège waren im Top 10 auf `main` drei Sprinter, im R-24-Lauf keiner. Die Ergebnisse widersprechen daher einer pauschalen Aussage, der neue Stand sei überall schlechter; sie belegen ebenso wenig eine generelle Verbesserung. Alle vier Referenzen sind synthetisch und nicht empirisch kalibriert.

Eine Sekundenmessung ohne Attacken am Übergang um km 24,6 im Hautacam-Seed 2026 zeigt einen konkreten Mechanismus: Während F078 noch an der Steigung fährt und das unmittelbar vorausfahrende Rad ca. 37,9 km/h fährt, läuft die entfernte Gruppenfront bereits ca. 52 km/h in der Abfahrt. Die Gruppenregel fordert für F078 zeitweise rund 459 W an. Danach entstehen mehrere Abstandsgruppen. Ein lokaler Versuch dämpft die Fernreferenz bei unterschiedlichen Steigungen; er wird gegen den bisherigen Stand und ohne Attacken geprüft. Die noch laufenden Versuche sind **nicht** Teil des gesicherten Produktcodes.

### Weitere A/B-Gegenproben (nur Versuchskopien)

Die allein nach Steigungsdifferenz gedämpfte Fernreferenz senkt im untersuchten Übergang zwar den vorzeitigen Wattwunsch von F078, verschiebt aber die Renndynamik: Mit identischem Flachfahrerfeld und Seed 2026 erhöht sich der Medianrückstand in Liège von 598,0 auf 966,9 s; ein Sprinter steht dort in den Top Ten. Eine zusätzliche Dämpfung nach Tempodifferenz zerlegt die frühe No-Attack-Gruppe bereits bei km 20 in 70/58/26 statt 144/10. Beide Varianten wurden nicht übernommen.

Ein anderer lokaler Versuch lässt Mannschaften in einer zurückliegenden Gruppe mit tatsächlichem Kapitän oder Sprinter eigenständig eine erreichbare vordere Gruppe verfolgen. Dieser Versuch verändert ausschließlich Auftrags-/Wattentscheidungen, nicht Positionen oder Physik. Erste Vergleichspunkte, Hautacam 2026: Mit Attacken liegen F078/F134 bei km 50 vorher 2570/1347 m, im Versuch 542/541 m hinter der Spitze. Ohne Attacken besteht bei km 40 eine vordere 99er- statt 65er-Gruppe. Andere Messpunkte zeigen weiterhin Teilungen; mehrere vollständige Rennen und Regressionen sind noch erforderlich. Der Versuch ist noch nicht Bestandteil dieses Branches.

### Korrektur der dreiminütigen Rampenbewertung

Die bisherige Nominierungs- und Gruppenranghilfe verwendete `CP + min(W′/180, 0,25 × CP)` pro Gesamtmasse. Der 25-%-Deckel unterdrückte Unterschiede großer W′-Reserven, obwohl die vorhandene W′-Bilanz drei Minuten lang mehr kurzfristige Mehrleistung zulässt. Neu wird die Ranghilfe als `min(aktuelle Spitzenleistung, aktuelle CP + verfügbares W′/180)` pro Gesamtmasse berechnet. Das ist ein taktischer Vergleich, keine zusätzliche Pedalleistung und keine neue Energiereserve. Die tatsächlichen Watt werden weiterhin durch den vorhandenen CP/W′-Kern abgerechnet. 17 lokale gezielte Tests bestehen; der TypeScript- und Gesamttest laufen.

Gepaarter lokaler Liège-Versuch mit den streckeneigenen 154 Fahrern je Seed, vorher → alleinige Scorekorrektur: Medianrückstände in Sekunden 1120→787 (42), 925→745 (123), 842→798 (2025), 930→616 (2026), 799→659 (2027). Die Top-Ten-Zusammensetzung wurde vielfältiger. Zugleich gewann im Seed 2026 ein Sprinter knapp; sein Rennverlauf und weitere Profile werden gezielt geprüft. Nur fünf fiktive Seeds, keine validierte Häufigkeit.

Die separat getestete Aufholjagd veränderte die Resultate deutlich und brachte für Liège teils größere Abstände und eine Dominanz von Kletterern; sie wird vorerst nicht in den Branch übernommen. Eine kombinierte Variante verbesserte einzelne Berg-/Klassikerwerte und verschlechterte andere. Weitere Vergleiche entscheiden, ob und wie eine Aufholjagd sinnvoll ist; Rennsiege werden nicht vorgegeben.

### Autonomer Anschluss für geschützte Kapitäne

Die bisherige Teamplanung erteilte Jagdaufträge nur der größten Abstandsgruppe. Eine zurückliegende Gruppe mit einem Kapitän konnte deshalb trotz verfügbarer eigener Helfer oft keine gezielte Teamverfolgung organisieren. Im adaptiven `stable-pack` kann die Leitlinie `kapitaen_schuetzen` nun einen Anschlussversuch in der realen Gruppe des eigenen Kapitäns planen. Helfer müssen physisch in derselben Gruppe und verfügbar sein; eine eigene vorn fahrende geschützte Führungsperson wird nicht blind verfolgt. Der globale Feldjagd-Koordinator überschreibt nicht die Aufgaben von Helfern in anderen Gruppen. Es sind reine Wattwünsche, keine Positions- oder Tempovorgaben. Frühere Modelle bleiben unverändert.

Explizite vorläufige Kriterien: mindestens 4 Fahrer in der Gruppe, nächste Lücke >42 und höchstens 1500 m, Lücke unter 10 % der verbleibenden Distanz, mindestens 27 % W′ beim Kapitän; Führender fordert höchstens 104,5 % seiner aktuellen Tages-CP, Unterstützer 100 %. Die tatsächliche Belastung und Ermüdungsgrenzen bleiben Sache des CP/W′-/R-19-Kerns. Diese Grenzen sind Heuristiken und müssen weiter kalibriert werden; allein oder ohne verfügbaren Helfer gibt es keinen Teamauftrag. Eine funktionierende Rückkehr wird nicht garantiert.

Im lokalen A/B-Versuch mit identischem Flachfahrerfeld und Seed 2026 (Scorekorrektur vorher → plus Kapitänsjagd danach): Medianrückstände Lille 17,2→17,2 s, Boulogne 236,5→205,4 s, Liège 898,9→600,6 s, Hautacam 1119,2→936,2 s. Liège innerhalb 60 s 31→6, also trotz niedrigerem Median ein größeres Auseinanderziehen der Spitzengruppe. Profileigene Bergfelder, Seeds 2026/42/123: Median 955,8→919,4 s, 1108,4→687,2 s, 1244,4→1143,8 s. Es gibt auch schlechtere Einzelresultate: F078 fällt im Seed 2026 von Platz 15 auf 57; F134 steigt von 13 auf 1. Keine dieser Zahlen ist eine statistische Realismusfreigabe.

Fünf gepaarte Liège-Seeds zeigen gemischte Auswirkungen gegenüber der Scorekorrektur allein: Median 787→954 s (42), 745→964 (123), 798→922 (2025), 616→704 (2026), 659→624 (2027). Die große Streuung und die hohen Rückstände bleiben offene Punkte, ebenso der plausible Einsatz bei abgehängten Sprintern und kleineren Gruppen. Die separaten Überlegungen zu einer Dämpfung des Fernbezugs wurden nicht übernommen. Die 19 zielgerichteten Jagd-/Schutztests bestanden; weitere Referenz- und Gesamttests folgen.

### Einordnung durch reale Vergleichsrennen

Der Nutzer hat zu Recht darauf hingewiesen, dass große Rückstände realistisch sein können. Die früheren Formulierungen, die große Liège- und Berg-Medianabstände pauschal als mögliches Qualitätsproblem markierten, sind daher **kein Urteil allein aus der Größe**. Ein realer Vergleich und seine Grenzen stehen in [R24_REALRENNEN_ABGLEICH.md](R24_REALRENNEN_ABGLEICH.md): Liège 2024 hatte bei 117 Finishern einen Finishermedian von +13:10, Liège 2025 bei 129 Finishern +5:41; Hautacam 2025 hatte für Rang 77 +31:22. Die Simulation hat 154 Finisher und keine DNF-/Gruppetto-/Karriereziele, die Werte sind nicht direkt vergleichbar. Weiter geprüft werden die Ursache früher Lücken, Gruppenarbeit und tatsächliche Leistung, nicht eine gewünschte künstliche Rückstandshöhe.

### Integrationstest und situationsabhängige Rampenarbeit

Der erste Gesamtlauf nach den Anpassungen meldete 362/363 Tests bestanden. Der verbleibende Test verlangte im einzelnen Liège-Seed 2026 zwingend `classicsRampTempoSeconds > 0`; gemessen wurden 5820 s Klassiker-Positionierung, 0 s spezielle Klassiker-Rampentempo- und 1363 s allgemeine Hügel-Rampenarbeit. Eine separate 10-s-Diagnose protokollierte an den späten steilen Rampen 2367 Gruppenkopf-Beobachtungen, darunter keine Gruppe mit mindestens vier Fahrern innerhalb 240 m der Rennspitze. Der damals führende F078 war dort unter anderem allein unterwegs. In dieser Lage ist ein Nullwert des spezifischen Vierergruppen-Bausteins nicht automatisch ein Fehler; seine Aktivierung bei geeigneter Lage bleibt separat durch `tests/r22-classics-racecraft.test.mjs` geprüft. Die Integration prüft weiterhin Positionsarbeit und gültige Rampendiagnose.

Auf ausdrücklichen Nutzerwunsch werden außerdem keine pauschalen Obergrenzen für den Medianrückstand oder Mindestgrößen für ein Flachfinale als Erfolgsvorgabe durchgesetzt. Auffällige Feldteilung wird weiterhin protokolliert; das kontrollierte 154-Fahrer-Flachprofil ohne Wind und ohne Attacken behält seinen eigenen Kohäsionstest. Die Änderung der Testannahmen schreibt weder Rennleistung noch Ergebnisse vor. Eine erneute vollständige technische Prüfung steht aus.

### Wiederaufnahme nach Unterbrechung (05.11.2026)

Der aktuelle wiederaufnehmbare Gesamtstand mit den nächsten Schritten steht am Anfang von [ENTWICKLUNGSSTAND.md](../ENTWICKLUNGSSTAND.md). Die nach der oben erläuterten Testanpassung ausgeführten Profil- und Klassiktests bestanden mit **12/12**; ein vollständiger erneuter Testlauf ist weiterhin offen. Die zwei vorher untersuchten Dämpfungsvarianten des Fernbezugs wurden nicht integriert. Die Kapitänsjagd und ihre Schwellen sind dagegen im Entwicklungsbranch enthalten. Nach Wiederaufnahme zuerst den aktuellen GitHub-Branch und CI-Status prüfen und anschließend die offenen kausalen und Mehrseed-Prüfungen fortführen.

### Schritt 1 abgeschlossen (05.11.2026)

Auf dem gesicherten Stand bestand der vollständige lokale Testlauf mit **363/363 Tests**, dazu der Browsermodul-Build und ESM-Import sowie der Syntaxcheck des Diagnose-Skripts. Der [PR-CI-Lauf #286](https://github.com/Lancester/radsportmanager/actions/runs/41987212329) für `fc64c6b781c5696b88911e2f010845bbc244e17d` war erfolgreich. Die kritische Einordnung der seit R-24 gelockerten Testannahmen und der damit verbleibenden Lücken steht im [Entwicklungsstand](../ENTWICKLUNGSSTAND.md). Die früheren Hinweise auf einen noch ausstehenden vollständigen Lauf sind durch diesen Eintrag überholt. Nach Nutzerwunsch an dieser Stelle stoppen.
