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


## Erste reale 154-Fahrer-Befunde (Lille 184,9 km; Seed 2026)

### Versuch A: nur lokale Mitfahrwatt-Regelung
[GitHub Actions #41787319242](https://github.com/Lancester/radsportmanager/actions/runs/41787319242) bestand **261/261 Tests**. Im identischen A/B-Rennen ergab `stable-pack` eine **größte Zielgruppe von 27 Fahrern** mit **576,48 s** Rückstand; maximal **30** Abstandsgruppen und **0** registrierte Attacken. Das war keine ausreichende Verbesserung. Der Test deckte auf, dass das bloße Halten der aktuellen Vordermanngeschwindigkeit zu spät auf gemeinsame Beschleunigungsphasen reagiert.

### Versuch B: Leistungsbedarf für Gruppenbeschleunigung ergänzt
Der Regler fordert nun zusätzlich die mechanisch erforderliche Beschleunigungsarbeit aus der **berechneten Pacesetter-Beschleunigung** an, weiterhin über denselben CP/W′-/Bewegungskern. Nur der tatsächliche `isPacer`-Fahrer an der Gruppenfront erhält unmittelbar volle Jagd-Wattwünsche.

[GitHub Actions #41787836473](https://github.com/Lancester/radsportmanager/actions/runs/41787836473) hat **260/261 Tests** bestanden; der eine Fehltest verlangte irrtümlich volle Führung von einem als `isPacer:false` gekennzeichneten Fahrer und wurde als Testaufbaufehler korrigiert. Die in diesem Lauf **tatsächlich vollständig gerechnete** siebenfache 154-Fahrer-Diagnose ergab für die neue Variante:

| Kriterium | Versuch A | Versuch B |
| --- | ---: | ---: |
| Größte Zielgruppe | 27 | **88** |
| Rückstand dieser Zielgruppe | 576,48 s | **569,96 s** |
| Maximale Abstandsgruppen | 30 | **26** |
| Tatsächliche Jagd-Führungszeit | 762 s | **892 s** |
| Registrierte Attacken | 0 | **2** |

**Bewertung:** Der separate Physik-/KI-Beschleunigungsfix verbessert die Anfangskohäsion deutlich (bei Kilometer 5 in Versuch B zwei statt elf Abstandsgruppen). Aber selbst 88 Fahrer kommen **9:30 min** hinter dem Sieger an. So ist die KI für einen glaubwürdigen Massensprint **nicht freigegeben**. Die Folge-CI für den korrigierten Testaufbau ist separat abzuwarten. Keine Änderung des Defaults und keine Freigabe von R-23.

Die Ursache ist wahrscheinlich **nicht nur** die Nachfahrregelung. Zu prüfen sind, ohne heimliche Ergebnis-Boni: die Stärke der frühen Führungsbeschleunigung, tatsächliche Feldführungsposition, die reale Fahrerleistungsverteilung und die Reaktionsschwellen der jagenden Mannschaften. Der 600-s-Kontrolltest muss durch gestaffelte Fahrerprofile und längere, aber noch reproduzierbare Fahrgruppen ergänzt werden. Ein günstiger Einzelfall ist keine Validierung.
