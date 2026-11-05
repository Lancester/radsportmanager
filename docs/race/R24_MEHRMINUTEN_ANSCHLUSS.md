# R-24: Mehrminütige Anschlussversuche

Stand 05.11.2026. Getrenntes Experiment auf experiment/r24-mehrminuten-anschluss, aus experiment/r24-anschluss-teamauftrag; kein Merge in main oder Auditbranch. Nutzerkorrektur: Ein Anschluss darf nicht davon abhängen, dass eine Gruppe in einer Minute erreicht wird. Ein langes gleichmäßiges Nachführen muss möglich sein.

## Umsetzung

- Die starre 60-s-Erreichbarkeitsprüfung und bisherige 500-m-Grenze für das Ziel „Gruppe erreichen“ wurden entfernt. Die Vorauswahl erprobt mehrere mechanisch plausible Leistungsniveaus mit aktueller lokaler Steigung, Wind, Zielfahrertempo, CP, W′ und Länge bis Ziel. Bei unter/nahe CP kann das Vorhaben auch mehrere Minuten benötigen. Eine planbare Mehrleistung über CP wird mit einem vorläufigen Ausgabebudget aus 35 % des aktuell verfügbaren W′ abgewogen; dies ist eine unkalibrierte Taktikannahme, keine physiologische Grenze.
- Nach Beginn bleibt ein konkreter Zielfahrer gespeichert. Nach dem kurzen Antritt kann auf eine eigene Verfolgungsabsicht mit angeforderter dosierter Leistung übergegangen werden. Bewegung, Luftwiderstand, Windschatten und CP/W′-Bilanz bleiben dem vorhandenen Rennmotor überlassen. Der Anschluss löst keine Positions- oder Zeitmanipulation aus.
- Beendigung beim Erreichen des Zielfahrers, bei dessen Zielankunft, zu niedrigem W′, einem Teamauftrag oder länger ausbleibendem Fortschritt. Letzteres prüft, ob sich der beste Abstand innerhalb von 120 s um 10 m verbessert. Dies ist eine provisorische Abbruchheuristik, keine Höchstdauer des Anschlusses; sie kann bei Tempowechsel oder wechselndem Gelände sinnvolle Fortsetzungen unterbrechen und muss geprüft werden.
- Start und Beendigung werden mit Zielfahrer, Abstand und angenommener Zeit im Ereignisprotokoll erfasst. Zielwechsel, wechselnde Geschwindigkeit, unterschiedliche Streckenabschnitte und längere Abschätzungen sind noch nicht genau vorhergesagt. Der Modellwert ist ausdrücklich keine garantierte Anschlusszeit.
- Noch kein gemeinsamer Taktikvertrag für mehrere nachsetzende Fahrer und keine echte abgestimmte Staffel. Mehrere Fahrer können physisch dieselbe Gruppe erreichen und vorhandenen Windschatten nutzen; daraus folgt nicht, dass sie den koordinierten Plan des Nutzers („drei Fahrer wechseln sich ab“) bereits beherrschen. Auch Gruppenerfolg muss gesondert untersucht werden.

## Belegte zehnminütige Nachführarbeit

Hautacam/profile, Seed 777, F036: Start Anschluss zu F015 bei eigener Position 172,7 km, Anfangsabstand etwa 611 m, damalige Prognose 971 s. Nach 60 s erfolgte der Ereigniswechsel zur individuellen Verfolgung; 990 s später wurde der Zielfahrer erreicht. Gesamtdauer vom Beginn bis zum Erreichen 1.050 s = 17:30 min. Beobachtet ist das im Protokoll; 971 s war eine Momentanprognose, keine genaue Vorhersage. Mechanische und W′-Bilanz des Rennens werden separat geprüft. Der Lauf allein belegt keine generelle sportliche Validität.

## Acht gepaarte Vergleichsläufe

Zwei Seeds je Profil, gleicher Input und Fahrerhash gegenüber dem 60-s-Experiment; unterschiedliche Rennpfade. Maximalgruppe ist nach der technischen 1-s-Nachbarlücke gebildet und nicht zwingend die Siegergruppe.

| Profil Seed | Attacken alt → lang | größte Zielgruppe alt → lang | Sieger alt → lang |
|---|---:|---:|---|
| Hautacam 42 | 27 → 46 | 9 → 7 | F134 → F106 |
| Hautacam 777 | 38 → 36 | 13 → 10 | F134 → F134 |
| Lille 42 | 11 → 13 | 106 → 108 | F023 → F009 |
| Lille 777 | 12 → 12 | 110 → 86 | F106 → F009 |
| Boulogne 42 | 27 → 33 | 15 → 22 | F148 → F015 |
| Boulogne 777 | 19 → 28 | 28 → 15 | F106 → F015 |
| Lüttich 42 | 18 → 33 | 43 → 13 | F134 → F113 |
| Lüttich 777 | 18 → 32 | 18 → 13 | F092 → F135 |

110 begonnene und abgeschlossene protokollierte Anschlussversuche über die acht Läufe, davon 83 mit mehr als 60 s Gesamtdauer und vier mit mehr als 600 s Gesamtdauer. Gesamtdauer umfasst die Anfangsattacke; sie misst nicht zwangsläufig durchgehende reale Frontarbeit. „Erreicht“ bedeutet Distanz zum konkret gewählten Zielfahrer ≤15 m oder Überholen, keine vollständige taktische Bewertung. Doppelzählung eines Fahrers über mehrere Rennen und Versuche ist möglich.

[Vergleichskennzahlen](r24-grossvergleich-daten/mehrminuten-anschluss-vergleich.json) und [Auszüge](r24-grossvergleich-daten/mehrminuten-anschluss-rennauszuege.json) sichern Ereignisse, Zieleinläufe, Gruppen und Angriffsspuren; sie sind keine vollständigen Rohdaten. Verwendetes Diagnosewerkzeug aus 8923aa7e51edfd640843bfc0b4811f8988b61929.

## Prüfungen

30 gezielte Tests bestanden. Sie prüfen u. a. mehr als zehnminütig prognostizierte Anschlüsse auf Ebene und bergauf, Energieschätzung, Teamauftrag und den deterministischen 17:30-min-Anschluss im Vollrennen einschließlich nichtnegativem W′ und Energiebilanz. Acht vollständige Referenzrennen auf vier Profilen erfolgreich mit passenden Input-Hashes und Diagnosewerkzeug-Bilanz. Kein vollständiger Testlauf der gesamten Testsuite für diese Fassung. Keine Sportfreigabe.

## Nächste Prüfung

Den stark veränderten Lüttich-Lauf mit 13 Fahrern in der 1-s-Siegergruppe und die deutlich vermehrten Angriffszahlen sportlich prüfen. Prognose und Zielgruppenverlauf messen; insbesondere Gruppenjagd mit sich abwechselnden Fahrern separat konzipieren und gezielt simulieren. Danach breitere Mehrseed-Vergleiche einschließlich Favoriten, Windschatten, Feld und Profilen. Die offene R24-Gesamtauswertung bleibt bestehen.
