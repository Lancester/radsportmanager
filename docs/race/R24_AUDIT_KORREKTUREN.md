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
