# R-22: stabilisiertes Peloton als isolierter KI-Versuch (04.11.2026)

## Ursachenprüfung

Der vorhandene `group-riding.ts`-Regler ist erst ab acht Fahrern aktiv, schaltet bei einer unmittelbaren Vordermannlücke über 42 m ab und lässt Missionen `verfolgung` und `helferarbeit` die gewöhnliche Mitfahrwattregelung umgehen. Bei einer langen 1D-Gruppe koppelt er außerdem die Mitfahrer an die Geschwindigkeit der gesamten Gruppenfront statt an den unmittelbar vorausfahrenden Fahrer. In der physikalischen Kopplung liegen dagegen unterschiedliche Schwellen vor: 24 m für formationsabhängige Aeroabschirmung, 42 m für reine Abstandsgruppen. Diese Kombination bietet eine plausible Erklärung für Kaskaden ungewollter Trennungen.

## Umsetzung – ausdrücklich **nur opt-in**

`RaceInput.groupRidingModel='stable-pack'` benutzt die bisherigen, unveränderten Körper-, Aero-, CP/W′- und Bewegungsgleichungen, aber eine alternative lokale Wattregelung:
- Fahrer orientieren sich an tatsächlich gemessener Geschwindigkeit und Abstand zum direkt vorausfahrenden Fahrer. Die Wattanforderung besteht aus berechnetem Roll-, Steigungs- und Luftwiderstandsbedarf bei dessen Tempo sowie begrenztem Geschwindigkeits-/Abstandsfeedback.
- Abstandsregelung ab Zweiergruppen; auch bei einem sich öffnenden Loch bis 85 m darf ein Fahrer **durch eigene Pedalleistung** Anschluss suchen, wenn er gesundheitlich/physikalisch dazu in der Lage ist. 85 m bewirkt **keinen** zusätzlichen Windschatten – der 24-m-Aero-Radius bleibt unberührt.
- Angriffe und Sprints bleiben frei. Nur ein tatsächlich an der Gruppenfront fahrender Jagdhelfer darf den vollen Jagd-Wattwunsch verfolgen. Ein nominierter Verfolger im Feldinneren erhält statt dessen normale Mitfahrleistung plus höchstens 18 W Aufrückleistung, innerhalb einer W′-/CP-abhängigen Grenze.
- Die bisherige Standard-KI `legacy`, sämtliche sechs früheren Vergleichsmodi, ihre Ergebnisse und die explizit nur manuell startbaren langen Monte-Carlo-Workflows bleiben unverändert. Kein erzwungener Gleichstand, kein Zeit-/Positionsbonus, keine Änderung am Energieintegrator.

**Alle Koeffizienten sind experimentelle Reglerwerte**, keine wissenschaftlich validierte Regel für Profipelotons. Der Nutzen muss anhand von A/B-Resultaten geprüft werden, einschließlich der *Siegergruppe*, Größe/Rückstand der größten Zielgruppe, tatsächlich gezählter Frontarbeit, Flucht-/Attackenzuordnung und mittlerer Leistungsnachfrage. Eine Einzelmessung reicht nicht für die 1.0-Freigabe.

## Kontrolltest

`tests/r22-stable-pack.test.mjs` enthält eine explizite Modellprobe mit 30 Fahrern, konstanter Führungsleistung, 600 Simulationssekunden, realem Formationswindschatten und unverändertem Bewegungsintegrator. Ziel: keine unnötigen Lücken größer als 42 m bei ausreichender Leistungsfähigkeit und keine verdeckte Verletzung der Energiegleichung; Nachfahrer sollten durchschnittlich weniger Pedalwatt brauchen. Zusätzliche Tests prüfen kleine Anschlusslücken, bewusste Angriffe, Aufträge an Feldmitfahrer und vollständige 30-Fahrer-Rennen.

**CI und Erfolg oder Misserfolg des Kontrolltests sind vor dem GitHub-Actions-Lauf noch offen.** Bei Testfehlern Ursachen isolieren, nicht Prüfwerte weichzeichnen.

## Nächster Schritt

Nach grüner Regression zunächst eigenständig A/B mit realen Referenzstrecken (Lille und Boulogne) und mehr als einem Seed in manuell ausgelösten Vergleichsläufen. Nur bei konsistent besseren Zielgruppen und Verfolgungsdaten einen späteren Default-Wechsel vorschlagen – **nicht automatisch aktivieren**. Physische Fehler in CP/W′, R-19 oder Wind würden separat mit eigenem Gegenversuch geprüft.
