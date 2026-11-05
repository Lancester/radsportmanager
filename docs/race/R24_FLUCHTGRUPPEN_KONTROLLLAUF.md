# R24: Technischer Kontrolllauf Fluchtgruppenexperiment

Codezustand: Commit `50b7fa6de886e7ac569c25fb510fcd82d2ac0d19` des Gesamtbranches. Hautacam-Referenz, 154 Fahrer, Seed 777, stable-pack, ansonsten identische Eingaben. Zwei lokale Läufe, einzig das optionale Merkmal `experimentalBreakawayCooperation` wurde umgeschaltet. Dies ist ein einzelner technischer Kontrolllauf, kein sportlicher Mehrseed-Vergleich und keine Freigabe.

| Messung | Experiment aus | Experiment an |
|---|---:|---:|
| Zielankünfte | 154 | 154 |
| Sieger-ID | F078 | F134 |
| Ereignisse Flucht erkannt | 8 | 14 |
| Ereignisse Flucht eingeholt | 3 | 4 |
| Angebote Führungsarbeit / Begrenzung | 0 / 0 | 137 / 19 |
| Anschlussversuche begonnen | 22 | 17 |
| Angebote Nachführ-Ablösung | 1 | 0 |
| Beobachtete Positionswechsel nach Angebot | 1 | 0 |
| Attackenereignisse | 39 | 38 |

Die protokollierten Arbeits-/Schonungsereignisse sind taktische Absichten, keine gemessene tatsächliche Führungszeit. Dass sich der Sieger ändert, ist allein kein Fehlernachweis. Das Fehlen des beobachteten Nachführwechsels bei diesem Seed erklärt das Scheitern eines bestehenden Integrationschecks; ein anderer Verlauf kann der Grund sein, es belegt weder einen physikalischen Defekt noch die Funktionsfähigkeit der Zusammenarbeit.

Auffälligkeit: Die Fluchterkennung protokolliert bereits ohne Experiment im Beispiel eine Gruppe von 40 Fahrern und weitere Gruppen von 39 bzw. 33 Fahrern als Flucht; mit Experiment Gruppen von 38–40 Fahrern. Eine große Spitzengruppe kann sportlich vorkommen, aber die 1D-Abstandsgruppen und Zusammensetzung müssen geprüft werden, bevor das Experiment auf ihnen verlässlich angewendet werden kann. Die hohe Zahl an Arbeitsabsichten und die Wirkung der Änderungen bedürfen genauer Ursachenanalyse.

Das Experiment bleibt standardmäßig deaktiviert. Nächste Schritte: echte zeitlich aufgelöste Gruppenzusammensetzung und Abstände auswerten, tatsächliche Führungsarbeit und Energie statt Absichtsereignissen messen, eine geeignete Gruppensituation für die freiwillige Zusammenarbeit ableiten, Teaminteressen und Erschöpfung prüfen, Anschlusswechsel mit geeigneten gezielten Szenarien erneut testen und erst danach über eine Aktivierung oder den großen Vergleich entscheiden.
