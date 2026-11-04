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


## Versuch C: funktionierende Koordination bewahren, Jagdhelfer gezielt nachregeln

Der zusätzliche [154-Fahrer-Isolationstest #41788638499](https://github.com/Lancester/radsportmanager/actions/runs/41788638499) deckte die entscheidende Trennung auf: Auf einer 20-km-Flachstrecke ohne offensive Teamleitlinien hielt die bisherige `coordinated`-KI **alle 154** Fahrer in einer Zielgruppe (maximal eine Abstandsgruppe). Der zunächst **für alle Mitfahrer** verwendete neue Regler erzeugte dagegen **17** Gruppen und nur 21 Fahrer in der größten Zielgruppe. Diese pauschale Änderung war falsch und wurde verworfen.

**Gezielte, aktuelle Variante:** Für normale Fahrer in Gruppen ab acht Teilnehmern wird deshalb wieder die bewährte `decideGroupRiding`-Wattanpassung genutzt. Nur Fahrer mit `verfolgung`-Intent und Fahrer kleinerer Gruppen verwenden das neue lokale Geschwindigkeits-/Beschleunigungs-Feedback. Auch ein beauftragter Helfer im Peloton muss erst physisch an die Führungsposition gelangen, bevor er die volle Jagdleistung einsetzen darf.

Der tatsächliche [CI-Lauf #41789070378](https://github.com/Lancester/radsportmanager/actions/runs/41789070378) bestätigt **262/262 Tests**, einschließlich sieben vollständiger Lille-Rennen und der zusätzlichen 154er-No-Attack-Kontrolle. Im no-attack-Kontrolllauf haben nun auch mit `stable-pack` **alle 154 Fahrer eine einzige Zielgruppe**, ohne physikalischen Zeitbonus.

### 184,9 km Lille, 154 fiktive Profis, Seed 2026 – gleiche Fahrer und Strecke

| KPI | Coordinated (bisher) | Front-gated (bisher) | Stable-pack (gezielt) |
| --- | ---: | ---: | ---: |
| Siegergruppe (1-s-Zeitgruppenproxy) | 3 | 3 | **6** |
| Größte Zielgruppe | 133 | 51 | **86** |
| Rückstand größte Zielgruppe | 929,37 s | 398,22 s | **15,77 s** |
| Fahrer innerhalb 60 s | 3 | 3 | **118** |
| Maximale Abstandsgruppen unterwegs | 5 | 11 | **16** |
| Tatsächliche Jagdführungszeit | nicht erhoben | 2747 s | **2639 s** |
| Registrierte Attacken | 18 | 22 | **49** |
| Mittlere Pedalleistung pro Fahrsekunde | 167,80 W | 194,54 W | **203,46 W** |

**Einordnung:** Eine konkurrenzfähige größere Zielgruppe ist jetzt erstmals vorhanden, ohne dass die restlichen Teilnehmer dorthin teleportiert oder physikalisch bevorzugt werden. Trotzdem sind 49 Attacken und 16 maximale Distanzgruppen Warnsignale für weitere taktische Abstimmung; nur ein Seed und ein Streckenprofil sind **keine Realitätsvalidierung**. Die sehr großen Rückstände älterer Varianten bleiben als reproduzierbare A/B-Referenz erhalten.

**Nächster isolierter Schritt:** identische A/B-Vergleiche auf Boulogne/Hautacam und mindestens Seed 2027 nur im schon vorhandenen ausdrücklich **manuellen** Workflow; nicht automatisch 100/500/1000 Läufe starten. Danach Attacken-Häufigkeit, tatsächliche Jagdführerwechsel und Energieermüdung gegen Gruppen-Zielresultate abwägen. Ein Default-Wechsel und R-23-Engine-Freigabe bleiben offen.


## Integrationsstatus

[PR #63](https://github.com/Lancester/radsportmanager/pull/63) nach erfolgreicher finaler [PR-CI #41789684647](https://github.com/Lancester/radsportmanager/actions/runs/41789684647) (**262/262 Tests**) mit Squash `8112633bec9e958bd10de70765429809eaa832f6` auf `main` übernommen. Die Variante **bleibt opt-in** und ersetzt `legacy` nicht. Die beschriebenen frühen Fehlerexperimente sind historische Ursachenbefunde, nicht der aktuelle Code. Bestehende A/B-Workflow-Großläufe bleiben **ausschließlich manuell** startbar. Für die nächsten Arbeitsschritte die 49 Attacken und 16 physischen Maximalgruppen über mehrere Seeds und Profile prüfen, nicht nur auf Lille/2026 optimieren.
