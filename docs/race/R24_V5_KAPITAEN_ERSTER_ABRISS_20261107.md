# Rennlabor V5 – Kapitän verliert Hauptfeld: kausale Sekundenanalyse (07.11.2026)

**Status: Analyse gesichert, keine Engine-Korrektur freigegeben.** Experimenteller Diagnosezweig `experiment/rennlab-v5-kapitaen-abstand-20261107`, basierend auf V5 (#98) plus Teamkapitän-Metadatenfix (#99). **Nicht automatisch nach `develop/renn-labor-mvp-20261106`, `develop/manager-mvp` oder `main` mergen.**

## Reproduzierbarer Originalfall

- Lille 184,9 km, 22 Teams/154 Fahrer, Seed 2026, Team T01, Standardtechnik `stable-pack`, `formation`, `r15-r16`, Langzeitausdauer aktiv.
- F001 Petr Schulz: Teamkapitän, natürliche Stärke Sprinter, nominell CP **375,4 W**, **81,5 kg** + 7,7 kg Rad, CdA 0,2768, W′ 38.426 J.
- F004 Jakub Benoit: Sprintziel, natürliche Stärke Allrounder, CP **346,1 W**, **66,2 kg** + 7,7 kg Rad, CdA 0,2725, W′ 31.129 J. F002 freie Rolle.
- Ergebnis ohne Korrektur: F001 Platz **149**, +**759,2 s**; F004 Platz **128**, +**482,6 s**.
- In den Checkpoints bei km 60 ist F001 noch mit 4 eigenen Helfern in einer großen Gruppe, km 90 keine eigenen Helfer mehr in seiner 7er-Gruppe; W′ jeweils nahe/voll 100%.

## Messverfahren

`tests/r24-lab-v5-first-gap.test.mjs` und `tests/r24-lab-v5-critical-split.test.mjs` führen die komplette originale `simulateRace` aus. Ein optionaler, **rein beobachtender** `onTrace`-Callback misst dynamisch eigene/vordere Geschwindigkeit und Abstand, Fahrerposition, Gruppen-Pacesetter, Aero, angeforderte Taktik-/Gruppenwatt, tatsächlich physisch angewendete Watt, CP, W′ und Gelände. Der Test vergleicht `classification`, `events` und `snapshots` mit und ohne Tracing **bitgenau identisch**.

- [GitHub CI #42374188809](https://github.com/Lancester/radsportmanager/actions/runs/42374188809), **31/31 Tests erfolgreich**, inkl. onTrace-Bitgleichheit.
- [GitHub CI #42374712399](https://github.com/Lancester/radsportmanager/actions/runs/42374712399), **32/32 Tests erfolgreich**, reale Gruppen- und Sprintziel-Gegenprobe.
- [GitHub CI #42375209126](https://github.com/Lancester/radsportmanager/actions/runs/42375209126), **32/32 Tests erfolgreich**, F088-Frontdetails und Browser/Offline-Check.
- Keine zusätzliche Speed-/Positionsmanipulation und kein Energiebonus; auf dem Diagnosezweig nur Messinstrumentierung und Tests.

## 1. Früher Abstand zwischen F001 und F004 auf steilem Stück

Bei Rennen-km **41,07**, auf **7,6 % Steigung**, fährt F001 ca. 20,2 km/h, F004 22,3 km/h. F001 erbringt tatsächlich ca. **414 W** bei Tages-CP rund **370 W**, seine W′-Reserve beträgt 87,4 %. Sein unmittelbar vorausfahrendes Rad ist nur 0,5 m entfernt; F001 hat zu diesem Zeitpunkt **keinen isolierten Gruppenabriss**, aber 42,3 m zu F004.

Die unterschiedlich schweren Fahrertypen sind nicht identisch: F001 375,4/81,5 = **4,61 W/kg Fahrergewicht** gegen F004 346,1/66,2 = **5,23 W/kg**. Daher ist ein Abstand am 7,6-%-Anstieg **auch physikalisch plausibel**. Die 42,3 m zwischen zwei Personen sind nicht die 42-m-Trennstelle der Hauptgruppe.

## 2. Tatsächlicher struktureller Feldabriss bei Renn-km 70,95

Bei `t=5510 s`, Renn-km **70,95** (F001 selbst km ca. 69,6), wird aus der vorher zusammenhängenden 152er-Gruppe ein **vorausfahrender Block mit 145** und ein **hinterer Block mit 7 Fahrern** (andere Fahrer können getrennt davor liegen). Gruppenführer der hinteren 7er-Gruppe ist F088; der letzte Fahrer im vorderen Block ist F046.

| Zeit t | Lücke F046→F088 | F088 km/h | F088 tatsächliche W | F046 km/h | F046 tatsächliche W |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 5510 s | 43,8 m | 38,9 | 325 W | 41,6 | 290 W |
| 5520 s | 53,9 m | 37,8 | 325 W | 42,2 | 288 W |
| 5530 s | 67,4 m | 37,3 | 325 W | 42,5 | 283 W |
| 5540 s | 82,1 m | 37,1 | 325 W | 42,5 | 282 W |
| 5550 s | 94,9 m | 38,8 | 397 W | 42,1 | 269 W |

F088 besitzt eine aktuelle CP ca. **332 W** und noch **69 % W′** bei 5510 s; er arbeitet mit rund 98 % CP, **nicht absichtlich mit Null Watt**. Er ist aber an der Spitze einer separierten Gruppe dem Wind ausgesetzt, während F046 das Ende des großen Feldes bildet und für vergleichbares Tempo weit weniger Watt braucht. Ein Realismusurteil erfordert deshalb die **aerodynamischen Kraftunterschiede** und eine tatsächliche Mehrseed-Gegenprobe.

F001 selbst fährt bei 5510 s rund **40,6 km/h, 268 W bei Tages-CP 370 W und 100 % W′**. Sein *direktes* Vorderrad ist nur ca. 4 m entfernt. Er hat keinen eigenständigen Anschlussauftrag zur Hauptgruppe; er folgt F088 und den übrigen hinteren Fahrern. Bei 5540 s fordert F001 nur 257 W, fährt 37,0 km/h; F046 voraus fährt 42,5 km/h. Dies ist **kein physikalisches Leistungslimit F001**, sondern Resultat des aktuellen **lokalen Mitfahr-Zieles** und des langsamen Gruppenführenden.

## 3. Konkreter Widerspruch im Regler

`src/engine/race/peloton.ts`: `R10_PACK.groupSeparationM = 42`. Die Gruppe wird bei einer Lücke größer 42 m neu klassifiziert.

`src/engine/race/stable-pack.ts`: `STABLE_PACK.reconnectGapM = 85`. Bis **85 m** bleibt der vorausfahrende Fahrer noch als lokaler Mitfahrbezug gültig. Für den jetzigen Gruppenpacer greift `frontOfGroup && o.isPacer`: `Math.min(o.desiredPowerW,o.groupPacerPowerW)` statt einer ausdrücklichen Rejoin-Entscheidung. Sobald die Lücke >85 m ist, greift der `no_group`-Pfad, die verlangte Leistung springt bei F088 von etwa **325 auf 397 W**.

**Beobachtete Ursache:** Ein physisch abgetrennter 7er-Block wird bei 43–82 m Lücke noch als normale Mitfahrformation geregelt; er versucht nicht rechtzeitig, die vorausfahrende Gruppe zu erreichen. Damit entsteht ein **Bereich verspäteter Nachführentscheidung**. Die kräftigen Fahrer dahinter – darunter F001 – erhalten weiterhin nur wattbezogene Aufträge zum Halten des *eigenen langsameren Blockes*. Die W′-Reserven bleiben hoch, während der Block irreversibel zurückfällt.

**Wichtig:** Dass eine Abstandsgrenze inkonsistent ist, belegt den Mechanismus der Verspätung; es beweist noch nicht, dass ein pauschales Angleichen 85→42 m sportlich gute Resultate erzeugen würde. Der schutzwürdige Kapitän kann im richtigen Rennmoment auch bewusst Kräfte sparen; starke Fahrer dürfen von überlegenen Konkurrenten physiologisch abgehängt werden. Kein automatisches Vorziehen oder Wattgeschenk.

## 4. Sprintziel-A/B ohne Änderung der Körperwerte

Änderung nur des `sprintLeaderId` F004→F001 in der Laborkonfiguration; dadurch ändert sich F001 intern auch von `kapitaen` zu `sprinter`. Alle Basiswerte (CP, FTP, Masse, W′, CdA, Ausdauerfaktoren etc.) sind explizit identisch.

- Ursprünglich: F001 **149.**, F004 **128.**
- F001 als eigenes Sprintziel: F001 **150.**, F004 **123.**

**Fazit:** Bloßes Umsetzen des Sprintziels repariert den frühen Hinterfeldabriss **nicht**. Dieser Vergleich isoliert keine einzige KI-Regel, weil sich neben der Ziel-ID auch die wirksame Rollenbezeichnung verändert; keine allgemeine Erfolgsquote ableiten.

## Nächste begrenzte, noch NICHT umgesetzte Korrekturprobe

1. In der bestehenden Gruppen- und Team-KI einen **physisch gedeckelten, klar begrenzten Anschlussversuch** für neu entstehende Lücken prüfen. Die 42-m-Trennlogik und die 85-m-Reconnect-Logik müssen gemeinsam betrachtet werden; nicht einfach blind zwei Grenzwerte gleichsetzen. Das Hauptfeld darf nicht zu einer künstlichen Zwangsformation werden.
2. Nur konkrete Mehrleistung bis zur wirklichen CP/W′-/R-19-Verfügbarkeit anfordern. Teamtaktik, eigene Kapitänsrolle und gewählte Tagespriorität bestimmen, ob und wer nachführt; die KI darf absichtliche Ausreißer, ausrollende Helfer oder erschöpfte Fahrer nicht zwanghaft zurückholen.
3. Überprüfen, ob der geschützte Kapitän bei einem vorausfahrenden, deutlich langsameren fremden Rad mit eigener Leistung physisch zum Vorderblock aufschließen darf, statt als Passagier des lokalen Gruppenreglers eingefroren zu werden. Keine Seitenspur-/Kollisions-Mikrophysik ohne Nutzen.
4. Vorher/nachher über die konkrete Lille-Konfiguration und mehrere Seeds sowie Hügel-/Bergprofile prüfen: Zeitpunkt/Größe der ersten unprovozierten Feldtrennung, Power-A/B, W′-/Ausdauerbilanz, Anzahl Sprinter im vorderen Feld, Gewinner/Favoriten, Etappenergebnisse, reales Hilfsverhalten. Keine Sieg-/Rangplatzgarantie für F001, keine Rückregression des Sprintzugs.
5. Wenn die gezielte Probe nicht in mehreren Szenarien hilft, **zurücknehmen**, genau wie den zuvor unwirksamen Begleitauftrag (1→15 Teamtempoereignisse, aber kein sportlicher Nutzen).

**Beschlussstatus:** Mechanismus und Messdaten **getestet**; sportlich robuste Lösung **offen**. Die Release-Engine und `main` bleiben unverändert.
