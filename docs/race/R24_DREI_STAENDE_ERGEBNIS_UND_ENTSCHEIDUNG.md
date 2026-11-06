# R24: Kurzvergleich – Ergebnis und Wahl der spielbaren Grundlage

Stand 06.11.2026. Grundlage ist der vorab dokumentierte [Arbeitsplan](R24_DREI_STAENDE_KURZVERGLEICH.md).

## Umfang und Aussagekraft

Alle 27 geplanten Rennen sind vorhanden: drei Modellstände, Lille, Boulogne und Hautacam, je Seeds 42, 123 und 2026 und das gemeinsame fiktive Lille-Feld. 16 Läufe konnten anhand der Sicherungen wiederverwendet werden, elf wurden für diesen Vergleich neu simuliert. Die elf neuen Originaldateien wurden aus den neun Sicherungsblöcken wiederhergestellt und bytegleich mit den Arbeitsdateien verglichen. Je 3er-Vergleich stimmt der Hash der gemeinsamen Basiseingaben; jeder Lauf wurde auf 154 klassierte Fahrer, Energieresiduum innerhalb 0,05 J, nichtnegative End-W′ und notwendige Ergebnisfelder geprüft. Kein Lauf erreichte die Ereignisobergrenze.

Die Engine-Stände sind **main** `621e712371563278c5bed2bb643dd598a9a7bcf4`, **Audit** `1945e2d6b71289f90cca5dc8c793090a4af93341` und **Gesamtmodell** `772d1e910d01f991fe69f857e1291fb474978afe`. Die in älteren Punkt-2-Notizen angegebene Audit-Commit-ID ist nicht auflösbar, aber die gesamte Engine von `1945e2d` stimmt mit dem Engine-Inhaltshash des Punkt-2-Manifests überein. Inputs und Testplan der elf Neuaufgaben wurden vor und nach jedem Block gegen diese Engine-Inhaltshashes und den Runner geprüft.

Die Stände unterscheiden sich auch in Ermüdungsattributen und anderen Details. Die gemeinsamen Hashes schließen `durabilityFactor` und `wPrimeRecoveryFactor` explizit aus, die main nicht kennt. Unterschiedliche Ablaufpfade können trotz gleichem Seed unterschiedliche Zufallsentscheidungen bewirken. Daher handelt es sich nicht um einen isolierten Taktik-A/B-Test. Alle Rennen verwenden ein gemeinsames fiktives Feld, und drei Seeds pro Profil sind eine kleine bewusste Auswahl; Wiederholungen und eine reale unabhängige Validierung fehlen. 154 Finisher sind kein Beleg für realistische Ausfälle. Nichts wurde auf einen bestimmten Gewinner oder Zielabstand getrimmt.

## Überblick über die Rennverläufe

Die Werte sind der Median aus drei Rennen je Stand und Profil. Die größte Gruppe bei km 50 ist die vom Modell anhand von 42-m-Nachbarabständen gebildete Abstandsgruppe am Messpunkt der Rennspitze, nicht notwendigerweise das offizielle Hauptfeld. Verfolgungen zählen registrierte Zustandsbeginne; wiederholte Meldungen desselben Fahrers sind möglich, und ältere Versionen verwenden teilweise andere Beschreibungen.

| Profil / Kennzahl | main | Audit | Gesamtmodell |
| --- | ---: | ---: | ---: |
| Lille: größte Abstandsgruppe bei km 50 | 147 | 140 | 140 |
| Lille: 1-s-Siegergruppe | 26 | 32 | 7 |
| Lille: 3-s-Siegergruppe | 26 | 32 | 40 |
| Lille: Angriffsbeginn-Ereignisse, Mittel | 53,0 | 22,7 | 18,7 |
| Lille: Verfolgungsbeginn-Ereignisse, Mittel | 214 | 69 | 2.221 |
| Boulogne: größte Abstandsgruppe bei km 100 | 105 | 118 | 152 |
| Boulogne: Verfolgungsbeginn-Ereignisse, Mittel | 7,7 | 225,7 | 2.015,7 |
| Hautacam: größte Abstandsgruppe bei km 50 | 55 | 48 | 43 |
| Hautacam: mittlerer individueller Zielrückstand, Median über Rennen | 1.680,7 s | 785,7 s | 759,9 s |
| Hautacam: Verfolgungsbeginn-Ereignisse, Mittel | 3,0 | 168,3 | 1.696,3 |

Der Hautacam-Rückstand ist der Median der 154 individuellen Zielrückstände, anschließend der Median über drei Rennen; es ist keine vorgegebene Sollgröße. Die 1-s- und 3-s-Gruppen sind nachberechnete Gruppen aus individuellen Zielzeiten, keine vollständige offizielle UCI-Wertung. Die Empfindlichkeit auf Lille verdeutlicht, dass die 7er-Siegergruppe des Gesamtmodells nicht allein als kleines Hauptfeld ausgegeben werden darf. Bei km 50 ist das Bergfeld in allen drei Ständen bereits stark in Abstandsgruppen geteilt; das ist angesichts des konkreten Profils näher zu untersuchen, nicht allein aus dieser Zahl als Fehler nachgewiesen. Eine ältere getrennte Berg-Gegenprobe zeigte auch ohne Angriffe frühe Teilungen und ist ein zusätzlicher Prüfhinweis.

## Sieger und vorab aussichtsreiche Fahrer

Reihenfolge der Seeds jeweils 42 / 123 / 2026. Der vorab erstellte Leistungsproxy betrachtet körperliche Profilwerte; für die folgende Auswahl wurden die drei stärksten Fahrer mit Rolle Kapitän oder Sprinter aus dem gesamten Feld ausgewählt. Diese rollenbewusste Liste ist **keine kalibrierte Siegchance**, beachtet konkrete Teamaufträge, Form und Renndynamik nicht vollständig und kann einen von seinem Team anderweitig eingesetzten Fahrer enthalten. Die Daten sind in [favoriten-rollen.json](r24-kurzvergleich-20261106/favoriten-rollen.json) gespeichert.

| Profil | Vorab-Proxy (Rolle) | main: Ränge | Audit: Ränge | Gesamtmodell: Ränge |
| --- | --- | --- | --- | --- |
| Lille | F023 (Sprinter) | 21 / 1 / 2 | 2 / 8 / 2 | 2 / 25 / 2 |
| Lille | F043 (Kapitän) | 61 / 41 / 137 | 44 / 73 / 139 | 1 / 66 / 142 |
| Lille | F078 (Kapitän) | 71 / 65 / 50 | 71 / 62 / 78 | 62 / 67 / 70 |
| Boulogne | F134 (Kapitän) | 67 / 23 / 36 | 1 / 74 / 68 | 36 / 55 / 94 |
| Boulogne | F009 (Sprinter) | 52 / 57 / 12 | 79 / 60 / 23 | 113 / 28 / 83 |
| Boulogne | F085 (Kapitän) | 117 / 148 / 80 | 76 / 46 / 86 | 42 / 56 / 115 |
| Hautacam | F134 (Kapitän) | 1 / 1 / 1 | 1 / 1 / 1 | 1 / 1 / 1 |
| Hautacam | F085 (Kapitän) | 113 / 135 / 124 | 5 / 89 / 3 | 84 / 91 / 18 |
| Hautacam | F064 (Kapitän) | 4 / 33 / 2 | 4 / 3 / 2 | 78 / 2 / 4 |

Auf Lille gewannen bei main zwei als Sprinter und ein als Klassikerfahrer eingestufter Fahrer, im Audit zwei Sprinter und ein Kletterer, im Gesamtmodell drei Sprinter. Ein einzelner Kletterersieg ist nicht für sich ein Modellfehler. Auf Boulogne gewann bei main dreimal derselbe Klassikerfahrer; im Audit gewannen ein Kletterer, ein Sprinter und ein Zeitfahrer, im Gesamtmodell zwei Klassikerfahrer und ein Zeitfahrer. Auf Hautacam gewann in allen neun Läufen F134. Das ist mit einem besonders starken fiktiven Fahrer vereinbar, zeigt aber wenig Siegervielfalt bei diesem Feld und diesen Seeds. Auffällige niedrige Ränge der anderen vorab starken Fahrer erfordern eine separate Betrachtung der Teamziele und des Rennverlaufs.

## Technische Prüfungen

Auf dem Audit-Checkout bestanden TypeScript 5.8.3 `--noEmit` für den Rennsimulator und seine Abhängigkeiten sowie zehn gezielte Tests zu Ermüdungskontinuität, individuellen Ausdauerwerten, Referenzfeldern und lokalem Gruppenregler. Der Test der individuellen Erholung simulierte ein Rennen. Die 27 Läufe und diese zehn Tests ersetzen keinen neu durchgeführten vollständigen technischen Standardtest; der ist vor einer stabilen Veröffentlichung noch auszuführen. Die parallelen Laufzeiten entstanden unter wechselnder Rechnerlast und eignen sich nicht als fairer Performance- oder Android-Vergleich.

## Entscheidung für den ersten spielbaren Stand

**Empfehlung und Arbeitsentscheidung: Audit-Engine `1945e2d` als vorläufige Rennbasis für den ersten spielbaren Manager-Prototyp verwenden.** Die Auswahl begründet sich mit dem insgesamt überprüfbaren Zwischenstand, ohne die im Gesamtmodell systematisch viel häufigeren Verfolgungsbeginn-Ereignisse zu übernehmen. Die Spitzensprinter auf Lille und drei vorab starke Bergfahrer auf Hautacam bleiben in der kleinen Stichprobe vielfach konkurrenzfähig. Gleichzeitig hatte das Gesamtmodell in dieser Auswahl drei Sprint-Sieger auf Lille, während im Audit ein Kletterer gewann. Das ist ein Gegenargument und ein konkreter offener Prüfpunkt, kein Freibrief für das Audit-Modell.

Die Auswahl ist eine pragmatische Arbeitsbasis und keine wissenschaftliche oder sportliche Abnahme. Insbesondere bleiben frühe Gruppenbildung am Berg, Helfer-/Kapitänsziele, realistische Jagddauer und Gruppenkohäsion auf flachen Strecken offen. Die Rolle der hohen Verfolgungsbeginne im Gesamtmodell muss differenziert untersucht werden; die Anzahl allein misst keine Dauer und keine Energie. Einfache, begrenzte Korrekturen sollen anhand mehrerer Profile und klarer Gegenproben bewertet werden.

Kein Git-Branch wurde zurückgesetzt und kein Inhalt gelöscht. Der bestehende Gesamtbranch und alle 22 Entscheidungen, späteren Taktikansätze, Diagnosekorrekturen und Prüfdaten bleiben erhalten. Spätere Änderungen werden gezielt übernommen, wenn sie das Spiel tatsächlich verbessern und ohne unnötige Regelkopplung geprüft sind; eine pauschale Behauptung, sämtliche späteren KI-Regeln seien bereits im Audit vorhanden, wäre falsch.

## Etappenrennen und Zuständigkeiten

Die untersuchten Motoren besitzen Eingaben für Teams, Fahrer, Rollen, Strategien und unterschiedliche Streckensegmente sowie Ergebnisse mit individuellen Renn- und Belastungswerten. Sie berechnen gegenwärtig aber ein einzelnes Rennen und initialisieren interne W′- und Ausdauerzustände beim Start neu. Eine sichere Übergabe aller notwendigen Zustände zwischen Etappen, Regeneration, Gesamtwertung, Zeitlimits, Ausfälle und mehrtägige Teamziele sind nicht bereits implementiert.

Für den ersten Architekturentwurf genügt es, über dem ausgewählten Rennmotor eine noch zu entwickelnde Etappen-/Rundfahrtverwaltung vorzusehen: Tagesziel und Kader als Eingabe, Etappenergebnis und relevante Belastungszustände als Ausgabe, danach Auswertung, Erholung und nächster Tag. Ob der Manager das Ziel selbst vorgibt oder der sportliche Leiter anhand seiner Fähigkeiten und der Managerstrategie empfiehlt bzw. auswählt, bleibt eine offene Spieldesignentscheidung. Diese Trennung ist eine begründete Architekturannahme, kein Nachweis, dass vorhandene Schnittstellen schon unverändert ausreichen oder eine zweite Engine niemals nötig wäre.

## Nächster Abschnitt

1. Audit-Engine als klar versionierte Arbeitsgrundlage in die neue spielbare Anwendung einbinden, ohne den bestehenden Gesamtbranch zu überschreiben.
2. Eine minimale Managerschleife implementieren: Team und Fahrer, Rennen, Ziel-/Rollenwahl, autonomer Simulationslauf, Ergebnis und aus tatsächlich aufgezeichneten Daten erzeugter Bericht.
3. Vor einer breiten Realismusfreigabe den frühen Feldzerfall kontrolliert untersuchen, die Sprint-/Bergfavoriten und Reaktionen mit mehreren Seeds prüfen und Android-Rechenzeit messen. Etappenübergaben und ein genaueres sportlicher-Leiter-Modell werden danach entwickelt.

Alle Einzeldaten und Kennzahlen: [Manifest und Sicherungsblöcke](r24-kurzvergleich-20261106/), [Auswertung](r24-kurzvergleich-20261106/auswertung.json), [Favoriten](r24-kurzvergleich-20261106/favoriten-rollen.json).
