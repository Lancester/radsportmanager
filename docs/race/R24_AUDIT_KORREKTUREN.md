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
   Fahrer verhindern das Ereignis nicht mehr. Auch im Finale werden
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
  nach den letzten Anpassungen. Ein Browser-ESM-Build bestand vor diesen
  Anpassungen und wird wiederholt. Zwei temporäre Varianten mit
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
  Gesamtserie wurden weitere Änderungen vorgenommen; deshalb ersetzt sie
  keinen erneuten vollständigen Lauf auf einem eingefrorenen Stand.
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
