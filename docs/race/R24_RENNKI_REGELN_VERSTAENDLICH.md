# Renn-KI: ausformulierte Regelübersicht zum Versuchsstand

Diese Übersicht ist für die sportliche Durchsicht gedacht. Sie beschreibt den **Codezustand des Versuchsbranches `experiment/r24-mehrminuten-anschluss` beim Commit [04ea73a](https://github.com/Lancester/radsportmanager/commit/04ea73a1543e574c273c7c8cbb08bd196803d25d)**. Es handelt sich um eine Beschreibung des vorhandenen Programms, nicht um eine Behauptung, dass jede Regel realistisch oder schon abgenommen ist.

Die zuletzt verglichenen Rennen verwendeten ausdrücklich den experimentellen Modus **`stable-pack`**. Es gibt im Code auch ältere Modi und alternative Regeln. Wo diese andere Entscheidungen treffen, sind sie keine automatisch zusätzlich aktiven Regeln. `main` und der R-24-Auditbranch entsprechen nicht automatisch diesem Versuchsstand.

## Lesehilfe

- **Aktiv**: Diese Entscheidung wird unter den angegebenen Bedingungen im gewählten Codepfad verwendet.
- **Bedingt**: Sie greift nur bei bestimmten Strecken, Rollen, Modi oder Rennlagen.
- **Testannahme**: Eine Grenze oder ein Faktor im Programm, keine aus der Realität bewiesene Grenze.
- **Noch offen**: Eine gewünschte Fähigkeit ist in der beschriebenen Form nicht oder noch nicht vollständig modelliert.

Die Regeln verlangen in der Regel **Kurbelwatt**. Daraus berechnet der Motor mit Physik und Energiebilanz die Bewegung. Ein Entscheid garantiert weder Überholen noch Gruppenzugehörigkeit, Anschluss oder Sieg.

### Wichtige Stellen im Code

| Thema | Quelldatei |
|---|---|
| Wie alles zusammengeschaltet wird | [race-simulator.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/race-simulator.ts) |
| Grundentscheidung für Angriffe, Sprint und Erholung | [race-tactics.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/race-tactics.ts), [adaptive-attack.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/adaptive-attack.ts) |
| Angriffsziele und Anschlussprognose | [attack-purpose.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/attack-purpose.ts) |
| Mannschaftsaufträge und Jagd | [race-team-ai.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/race-team-ai.ts), [peloton-chase.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/peloton-chase.ts) |
| Gruppenfahrt, Luftwiderstand und Kräfte | [stable-pack.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/stable-pack.ts), [formation-aero.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/formation-aero.ts) |
| Sprint | [sprint-positioning.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/sprint-positioning.ts), [sprint-wheel-choice.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/sprint-wheel-choice.ts), [sprint-leadout.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/sprint-leadout.ts), [final-sprint.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/final-sprint.ts) |
| Berg und Klassiker | [climb-tempo.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/climb-tempo.ts), [classics-punch.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/classics-punch.ts), [classics-racecraft.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/classics-racecraft.ts), [hilly-racecraft.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/hilly-racecraft.ts) |
| Ermüdung und Helferablösung | [endurance.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/endurance.ts), [effort-capacity.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/effort-capacity.ts), [chase-helper-fatigue.ts](https://github.com/Lancester/radsportmanager/blob/04ea73a1543e574c273c7c8cbb08bd196803d25d/src/engine/race/chase-helper-fatigue.ts) |

# 1. Was weiß der Fahrer und wie oft entscheidet er?

**1.1 Rolle.** Ein Fahrer hat im Rennmodell die Rolle Kapitän, Sprinter oder Helfer. Das ist nicht dasselbe wie sein Fahrertyp: Ein Fahrer hat außerdem optional ein Profil wie Kletterer, Klassikerfahrer oder Zeitfahrer. Einige Regeln nutzen die Rolle, andere konkrete Leistungswerte, und einzelne Sprintregeln prüfen ausdrücklich das Typ-Etikett.

**1.2 Teamstrategie.** Vier Leitlinien sind im Rennmodell vorgesehen: ausgewogen, offensiv, Sprint und Kapitän schützen. Sie beeinflussen Aufgaben und Angriffsneigung. Daraus folgt nicht, dass ein fertiger Karriere-Manager mit detaillierter Teambus-Besprechung bereits vorhanden ist.

**1.3 Zustand.** Entscheidungen verwenden abhängig von der jeweiligen Regel unter anderem die Position, Gruppengröße und Abstände; Renndistanz und Reststrecke; Geschwindigkeit und Steigung; Teamrolle und Strategie; CP, W′ und deren aktuellen Zustand; Aggressivität, Sprintstärke und teilweise Technikwerte.

**1.4 Entscheidungstakt.** Die übergreifende Renn- und Teamtaktik wird im Simulator im Abstand von **10 Sekunden** neu bewertet. Die Bewegungs- und Energieberechnung läuft typischerweise in **1-Sekunden-Schritten**; der konfigurierbare Wert liegt zwischen 0,2 und 1 s. Diese beiden Zeiten sind nicht gleichbedeutend.

**1.5 Reproduzierbarer Zufall.** Die adaptive Attackenentscheidung nutzt einen aus Seed, Fahrer-ID und Zeit abgeleiteten Zufallswert. Gleiche Eingaben und gleicher Code erlauben einen reproduzierbaren Lauf. Derselbe Seed hält nach Codeänderungen nicht alle späteren Ereignisse synchron.

# 2. Wie werden Gruppen und Windschatten behandelt?

**2.1 Abstandsgruppen.** Für Team- und Gruppensituationen werden Fahrer nach ihrer Position sortiert. Eine Lücke von mehr als **42 Metern zwischen benachbarten Fahrern** trennt in der entsprechenden Gruppenerkennung Gruppen. Weil jeweils Nachbarn betrachtet werden, kann eine lange Kette insgesamt erheblich länger als 42 m sein. Die Grenze ist eine technische Annahme, keine offizielle Ergebniszeitregel.

**2.2 Hauptfeld.** In den Teamregeln wird grundsätzlich die **größte erkannte Gruppe** als Hauptgruppe behandelt. Sie muss nicht die führende Gruppe sein und muss auch nicht die Siegergruppe sein.

**2.3 Windschatten.** Im gewählten Modell zählen tatsächlich vorausfahrende Fahrer innerhalb von **24 m** für einen vereinfachten Schutzfaktor. Mehr Vorausfahrende können den berechneten Luftwiderstand stärker senken; der Faktor wird bei **0,40** begrenzt. Die 24 m und die Stärke der Abschirmung sind Modellannahmen. Sie bedeuten nicht, dass jeder Fahrer genau 60 % Gesamtleistung spart: Der Faktor wirkt auf den aerodynamischen Widerstand.

**2.4 Gruppenfahrt.** Ein nicht besonders beauftragter Fahrer orientiert seinen Wattwunsch am vorausfahrenden Rad, dessen Tempo und Beschleunigung, dem Abstand sowie seinen eigenen Widerständen. Eine Lücke oder ein Tempounterschied kann zusätzliche Leistung anfordern. Die tatsächlich mögliche Leistung wird begrenzt; ein Fahrer kann also abreißen.

**2.5 Gruppenführung.** Tatsächlich vorne fahrende Personen können Tempo anfordern. Mitfahrer werden nicht automatisch auf dieselbe Geschwindigkeit gesetzt. Im stabilen Gruppenregler gelten eigene Fälle für Attacke, Sprint, Verfolgung, Führung und normales Mitfahren.

**2.6 Grenzen.** Die Simulation ist hier im Wesentlichen längs der Strecke angeordnet. Echte seitliche Fahrspuren, Windkanten als vollständiges 2D-Phänomen, präzises Überholen im Pulk und reale Positionskämpfe sind damit nicht vollständig abgebildet.

# 3. Grundentscheidungen und Energie

**3.1 Kräfte sparen.** Ohne besonderen Auftrag verlangt die Grundlogik im Windschatten weniger Watt als ungeschützt. Zusätzlich berechnet der Gruppenregler den Leistungsbedarf zum tatsächlichen Mitfahren.

**3.2 Erholung bei fast leerem W′.** In der Grundentscheidung kann bei weniger als **8 %** W′ ein Erholungswunsch unterhalb CP entstehen. Je nach bereits aktivierter Speziallogik und Reihenfolge wirken weitere Bedingungen; das ist kein allgemeiner Nachweis vollständiger Erholung.

**3.3 CP und W′.** Vereinfacht steht CP für eine Dauerleistungsgröße und W′ für verfügbare kurzfristige Arbeit oberhalb dieser Größe. Mehrleistung kostet Reserve; unter passenden Bedingungen kann sie sich wieder auffüllen. Die tatsächlichen Watt werden im Physiologiekern begrenzt.

**3.4 Langzeitbelastung und Verpflegung.** Ein separates, vorläufiges Modell bilanziert Kohlenhydrataufnahme, -verbrauch und Langzeitbelastung. Über die Zeit können verfügbare Watt sinken. Im `stable-pack`-Pfad wird die Wirkung über **90 Minuten** eingeblendet und durch individuelle Faktoren beeinflusst. Werte und Formeln sind Spiel- bzw. Kalibrierungsannahmen, keine medizinisch validierte Abbildung eines Profis.

**3.5 Abfahrt.** Bei hinreichend negativem Gefälle und technischer Abfahrt kann eine sichere Geschwindigkeit aus Streckencharakter und Abfahrtstechnik bestimmt werden. Wird sie überschritten, kann gebremst werden. Das ist ein vereinfachtes Tempolimit, keine detailgetreue Kurven- und Risikosimulation.

# 4. Welche Motivation kann ein Angriff haben?

Die folgenden drei Ziele stammen aus der experimentellen Erweiterung. Sie gelten für neue `stable-pack`-Angriffe, sofern der jeweilige Codepfad benutzt wird.

**4.1 Flucht gründen.** Ein Fahrer kann dieses Ziel erhalten, wenn er in der als Hauptgruppe erkannten Gruppe ist, diese mindestens vier Personen umfasst, er nahe genug an der aktiven Spitze liegt, keine bereits etablierte Flucht erkannt wird und kein Teamkollege ausreichend weit voraus ist. Ein als zu schützender Bergfavorit eingestufter Fahrer erhält dieses frühe Ziel nicht.

**4.2 Einer Gruppe nachsetzen.** Der Fahrer kann eine tatsächlich vorausfahrende nächste Gruppe als Ziel erhalten, wenn eine Lücke von mindestens **30 m** erkannt und die Anschlussprognose als möglich bewertet wird. Die früheren festen Grenzen „in 60 Sekunden“ und „höchstens 500 m“ stehen in dieser Fassung nicht mehr in dieser Zielprüfung.

**4.3 Auf Sieg angreifen.** Die Fassung bezeichnet eine Situation vorläufig als entscheidend, wenn höchstens **60 km** fehlen; alternativ auch bei mindestens halbem Rennfortschritt, mindestens **5 %** Steigung und höchstens **90 km** Reststrecke. Zusätzlich sind höchstens **2 km** Abstand zur aktiven Rennspitze und mehr als ein Fahrer in der eigenen Gruppe vorgesehen. Das ist eine grobe Heuristik, keine echte garantierte Siegaussicht.

**4.4 Teamauftrag.** Ein Helfer mit einem aktuell vergebenen Auftrag für Schutz, Jagd oder Sprintzug erhält in diesem experimentellen Pfad kein neues eigenmächtiges Angriffsziel. Ein sinnvoller bewusster Wechsel vom Auftrag zum Angriff ist noch nicht als ausgearbeitete taktische Entscheidung modelliert.

**4.5 Nach Zieleinlauf des Siegers.** Die Zielauswahl verhindert hier neue Angriffe nach dem Zieleinlauf des ersten Fahrers. Andere legitime spätere Rennziele, etwa Platzkämpfe oder Zeitlimits, sind dadurch noch nicht vollständig abgebildet.

**4.6 Keine Attacke aus dem Nichts?** Ein protokolliertes Ziel ist nun vorgesehen; die bisherige Zielauswahl ist aber noch einfach. Ein Etikett wie „Sieg angreifen“ beweist nicht, dass der Fahrer alle taktischen Folgen, Konkurrenten und Teaminteressen richtig eingeschätzt hat.

# 5. Wann startet ein Fahrer einen Angriff?

**5.1 Motivation reicht nicht allein.** Nachdem ein mögliches Ziel bestimmt wurde, prüft die adaptive Regel weitere Bedingungen wie Reserve, letzte Attacke, Rolle, Position und physische Überlegenheit. Erst dann entscheidet ein reproduzierbarer Zufallswert über den Versuch.

**5.2 Zeit und Reserve.** Ein neuer allgemeiner adaptiver Angriff ist unter anderem vor **180 s** Renndauer, bei höchstens **250 m** Reststrecke, unter **28 % W′** oder innerhalb von **120 s** nach dem letzten Angriff gesperrt. Fahrer mit bestimmten aktuellen Absichten wie Sprint, Erholung, Verfolgung oder Helferarbeit starten nicht gleichzeitig diesen neuen allgemeinen Angriff. Begonnene Angriffe haben eine eigene Fortsetzungsprüfung.

**5.3 Wirkliche Mehrleistung.** Der Code schätzt, ob der Fahrer bei der momentanen Situation ohne Windschatten mindestens einen kleinen Leistungsüberschuss gegenüber dem Halten des Gruppentempos anfordern könnte. Dafür verwendet er CP, W′, Gelände und Widerstände. Eine positive Entscheidung verleiht aber keine direkte Geschwindigkeit.

**5.4 Wer attackiert eher?** Steigung, Rennphase, Abstand zur Spitze und Gruppenfront, Aggressivität, verfügbare Reserve, Teamstrategie, Fahrerrolle und ein Teamkollege voraus beeinflussen die Wahrscheinlichkeit. Die Codefaktoren gewichten Kapitäne höher als Helfer oder Sprinter; das sind nicht empirisch kalibrierte Häufigkeiten.

**5.5 Dauer und Häufigkeit.** Ein begonnenes adaptives Angriffsintervall kann je nach Aggressivität grob **40 bis 70 s** dauern; weitere Regeln und Reserven beeinflussen die tatsächliche Entscheidung. Das ist keine Höchstdauer für das nachfolgende Aufschließen. Es gibt keine allgemeine feste Zahl „maximal fünf Attacken“.

**5.6 Bergfavoriten zu Rennbeginn.** Für eine Strecke mit einem späten langen Anstieg wird ein vorläufiger Favoritenschutz berechnet: Ein Kapitän gilt nach dieser Heuristik als geschützt, wenn sein nominelles CP pro Fahrer- plus Radmasse mindestens **97 %** des besten so bewerteten Kapitäns erreicht. Der Anstieg muss mindestens **4 km** lang sein und höchstens **60 km** vor dem Ziel enden. Das ist keine Gesamtwertung und keine umfassende Prognose für alle Strecken. Die 97-%-Schwelle ist eine hinterfragbare Regel.

**5.7 Kein allgemeines 88-%-Angriffsverbot im beschriebenen adaptiven Pfad.** Die ältere allgemeine Angriffsdatei enthält eigene historische Schwellen; sie darf nicht ungeprüft als zusätzliches starres Verbot im hier beschriebenen `stable-pack`-Pfad gelesen werden.

# 6. Wie funktioniert ein längerer Anschlussversuch?

**6.1 Ziel.** Als Ziel wird ein real vorausfahrender Fahrer aus der nächsten erkannten Gruppe gewählt. Der Abstand bezieht sich auf dessen Position, nicht nur auf ein Gruppenetikett.

**6.2 Prognose.** Die KI vergleicht mehrere Leistungsniveaus und schätzt aus der momentanen Zielgeschwindigkeit und lokalen Bedingungen, ob ein Anschluss vor dem Ziel unter ihrem Energiebudget möglich erscheint. Die Prognose nimmt vereinfacht gleichbleibende Bedingungen an; das spätere Zieltempo, Beschleunigung, Windschattenwechsel und das folgende Streckenprofil können anders sein.

**6.3 W′-Planung.** Für zusätzliche Arbeit oberhalb CP sieht die Prognose vorläufig maximal **35 % des gerade vorhandenen W′** vor. Das ist ein konservatives, noch nicht validiertes taktisches Budget, keine Naturgrenze. Es darf bei der sportlichen Überarbeitung ausdrücklich hinterfragt werden.

**6.4 Nach dem Antritt.** Wird ein solcher Versuch gestartet, kann nach der Angriffsphase eine individuelle Verfolgungsabsicht folgen. Der Wattwunsch bleibt der physischen Berechnung unterworfen. Die Zielzeit ist eine Schätzung, keine Höchstdauer und kein Erfolgsgeschenk.

**6.5 Wann endet er?** Der Versuch endet unter anderem bei Zielnähe bzw. Überholen, wenn der Zielfahrer nicht mehr aktiv ist, bei weniger als **20 % W′**, einem neuen Helferauftrag oder wenn innerhalb von **120 s** kein neuer bester Abstand um mindestens **10 m** erreicht wird. Diese 120-s-Regel ist eine vorläufige Abbruchheuristik und kann bei wechselndem Gelände oder zwischenzeitlich gleichbleibender Lücke zu streng sein.

**6.6 Was ist noch nicht gelöst?** Mehrere Fahrer können physisch zusammenfahren und Windschatten erhalten. Ein ausdrücklicher gemeinsamer Plan „drei Fahrer setzen nach und wechseln sich ab“ ist in dieser neuen individuellen Anschlusslogik noch nicht als eigene koordinierte Taktik nachgewiesen.

# 7. Welche Mannschaft jagt eine Spitzengruppe?

**7.1 Lageerkennung.** Das Modell erkennt Gruppen und prüft, ob eine führende Gruppe mit Abstand vor der größten Gruppe fährt. Je nach aktivem Modus werden Gruppengröße, Distanz, Relativgeschwindigkeit und verbleibende Strecke betrachtet.

**7.2 Interesse statt automatischer Jagd.** Im adaptiven Koordinator werden Teams mit geeigneter Strategie, tatsächlich im Hauptfeld anwesendem Ziel- und Helferpersonal und ausreichender Reserve ausgewählt. Ein Sprintteam mit Sprinter und Helfern wird typischerweise bevorzugt. Weitere Teams können bei erhöhter Dringlichkeit mitarbeiten.

**7.3 Eigenes Personal vorne.** Wenn der eigene Kapitän oder Sprinter bereits in der vorderen Gruppe ist, soll das Team sie im adaptiven Jagdkoordinator nicht blind zurückholen. Ist ein eigener Helfer vorne, kann dies eine Jagd ebenfalls verhindern, solange sie nicht als besonders dringend bewertet wird.

**7.4 Dringlichkeit.** Der Code nutzt unter anderem den aktuellen Abstand im Verhältnis zur Reststrecke und eine grobe **120-s-Projektion** aus den momentanen Gruppengeschwindigkeiten. Diese Projektion ist eine Annahme, keine Sicherheit darüber, wer das Rennen gewinnt.

**7.5 Zahl der Teams.** Der Koordinator wählt üblicherweise höchstens **drei Teams**, im bestimmten späten sprintfreundlichen Finale höchstens **vier**. Diese Obergrenze ist eine technische Heuristik und sollte nicht mit einer echten taktischen Grenze verwechselt werden.

**7.6 Helferzahl.** Die Mannschaftsplanung wählt geeignete verfügbare Helfer anhand der aktuellen Situation. Die ältere Schnittstelle für eine vom Manager fest eingestellte Jagdhelferzahl ist im adaptiven Pfad nicht als freie aktuelle Managerentscheidung gleichzusetzen.

**7.7 Wirkliche Führung.** Für bestimmte Jagdregeln soll ein Helfer nur dann mehr Tempo machen, wenn er tatsächlich sinnvoll in der Nähe der Gruppe bzw. an der Front eingesetzt ist. Fahrer weiter hinten müssen zunächst aufrücken. Ein Teamauftrag teleportiert niemanden nach vorn.

**7.8 Ablösung und Belastung.** Führungsrollen werden anhand von Verfügbarkeit und Zeitverlauf vergeben und können wechseln. Im besonderen späten Sprintjagd-Modell kann real geleistete ungeschützte Führungsarbeit gezählt werden. Bei hoher Belastung und bestimmten Zeit-/Reservebedingungen darf ein Helfer seine Leistung bewusst absenken und zurückfallen. Die speziellen Werte, etwa mindestens **12 Minuten** echte Frontarbeit für die entsprechende Auslöseprüfung und die Prüfung längerer Einsätze bis etwa **20 Minuten**, gelten nur unter den dort genannten Bedingungen – nicht als allgemeine Pflichtablösung aller Fahrer.

# 8. Wie wird ein abgehängter Kapitän unterstützt?

**8.1 Anschluss mit Helfern.** Ein Team mit Strategie „Kapitän schützen“ kann in einem passenden adaptiven Szenario Helfer in der Gruppe des Kapitäns einsetzen, um zur unmittelbar vorausfahrenden Gruppe aufzuschließen.

**8.2 Bedingungen.** Die vorhandene Teamregel verlangt unter anderem eine Gruppe von mindestens **vier** Personen, eine erkennbare Lücke zur Vordergruppe und ausreichende Kapitänsreserve. Als vorläufige Grenzen stehen dort unter anderem höchstens **1.500 m** und eine Lücke von unter **10 %** der verbleibenden Strecke. Das sind Grenzen dieser konkreten Teamregel – nicht die zuvor entfernte 500-m-/60-s-Grenze des individuellen Angriffs.

**8.3 Tatsächliche Unterstützung.** Helfer werden nur ausgewählt, wenn sie entsprechend Rolle, Position und Reserve verfügbar sind. Ihre Arbeit geschieht als Wattanfrage. Der Kapitän ist nicht automatisch wieder angeschlossen.

**8.4 Nicht blind zurückholen.** Die Teamlogik berücksichtigt, ob ein eigener relevanter Fahrer bereits voraus ist; das soll verhindern, eine eigene taktische Situation mechanisch zu zerstören.

# 9. Was geschieht bei langen Anstiegen und hügeligen Rennen?

**9.1 Langes Bergtempo.** Im `stable-pack`-Pfad kann ein geeigneter Kapitän an einem langen steilen Anstieg eigenständig mehr Tempo beantragen, wenn er gruppennah fährt, genügend Reserve hat und rechnerisch auch ohne Windschatten einen Leistungsüberschuss besitzen könnte. Die vorläufige Erkennung verlangt unter anderem **5,5 % Steigung**, **5 km Anstieg** und eine Gruppe mit mindestens vier Fahrern.

**9.2 Keine Typ-Garantie.** Im verwendeten fähigkeitsbasierten Pfad ist der konkrete Leistungsüberschuss entscheidend; das Etikett „Kletterer“ allein vergibt keinen Sieg oder automatische Extrawatt. Die Rolle Kapitän ist in dieser speziellen Bergregel trotzdem eine Voraussetzung.

**9.3 Hügel-Tempo.** Für als hügelig erkannte Profile kann ein geeigneter, in der jeweiligen Gruppe nominierter Fahrer an einer passenden Rampe erhöhtes Tempo verlangen. Profilgeometrie, Position, Rolle und Reserve zählen. Das ist ein Tempowunsch und nicht zwingend eine registrierte Attacke.

**9.4 Klassikerrampen.** Bei genügend erkannten kurzen steilen Anstiegen kann ein nach Leistungsfähigkeit nominierter Fahrer aufrücken und gegebenenfalls an einer Rampe attackieren oder Tempo machen. Die Kurzrampen-Erkennung nutzt dort unter anderem **7,5 %**, **800–2.500 m** Länge und mindestens **vier** solche Anstiege. Ein einzelner Kandidat pro Gruppe wird über die aktuelle Leistungsfähigkeit ausgewählt; Abstände und W′ bleiben relevant. In der aktiven Aufrufvariante sind frühere starre Rennlängen- und späte Angriffsgrenzen teilweise ausdrücklich gelockert.

**9.5 Attacke und Tempo nicht verwechseln.** Tempoverschärfung, bloßes Nachfahren, ein eingeleiteter Angriff und tatsächlich erfolgreicher Abstand sind unterschiedliche Dinge. Die reinen Ereigniszähler beantworten für sich nicht, ob der Rennverlauf plausibel war.

# 10. Sprint und Sprintzug

**10.1 Wann ist die besondere Sprintlogik aktiv?** Im `stable-pack`-Versuch gilt ein Rennen als sprintfreundlich, wenn es mindestens **140 km** lang ist und die berechneten positiven Höhenmeter höchstens **1.650 m** betragen. Diese harten Profilgrenzen sind technische Annahmen; ein echtes Rennen knapp daneben kann natürlich trotzdem im Sprint enden.

**10.2 Feldkontakt.** Der nominierte Sprinter soll im frühen Rennen grundsätzlich Kräfte sparen. Befindet er sich sehr weit hinten im großen Feld, kann ein begrenzter Wattwunsch helfen, den Anschluss zu halten.

**10.3 Aufrücken.** Ab etwa **75 %** des Rennens kann der Sprinter versuchen, sich weiter vorn zu positionieren; ab **94 %** wird ein Platz im vorderen Teil angestrebt. Diese Prozentwerte sind Phasen des Modells und zu prüfen, keine realen Vorschriften für jedes Rennen.

**10.4 Begleitung.** Geeignete Helfer in räumlicher Nähe können einen Sprinter begleiten. Ein Sprintzugauftrag ist an die wirkliche Gruppenzugehörigkeit gebunden; ein Helfer soll nicht beliebig weit vor seinem Sprinter wegfahren.

**10.5 Sprintzug und Jagd.** Im späten Sprintfinale können Jagd und Vorbereitung des Sprintzugs gleichzeitig organisiert werden, soweit die Teamplanung geeignete Fahrer findet. Nicht jeder Helfer erfüllt beide Aufgaben beliebig.

**10.6 Ohne eigenen Zug.** Ein Sprinter kann anhand seiner Hinterradfinde-Fähigkeit ein echtes vorausfahrendes Rad auswählen, auch das eines Gegners. Der Code prüft reale Nachbarn und deren Lage; er vergibt keinen sofortigen Positionsbonus. Das ist eine vereinfachte 1D-Hinterradwahl, keine vollständige Spurwahl.

**10.7 Sprintstart.** Der besondere Endspurt berücksichtigt individuelle Vorliebe für frühen/späten Beginn, Position, Windschatten, Geschwindigkeit, Gegenwind und Reserve. Sein mögliches Fenster liegt im Modul etwa zwischen **540 und 95 m** vor dem Ziel, wobei die individuelle Auslösung daraus abgeleitet wird. Der Pfad ist an sprintfreundliche Rennen und die dortigen Aufrufbedingungen gebunden.

**10.8 Sprintleistung.** Ein individuelles Spitzenleistungsprofil fällt über die Zeit ab; die vorhandene Energiebilanz begrenzt die Leistung. Ein besserer Sprintwert oder Zug garantiert keinen Sieg.

**10.9 Andere Rennlagen.** Die allgemeine Grundlogik kennt zusätzlich einen einfacheren Sprintentscheid ab **250 m** für passende Rollen und Reserve. Welche Regel im konkreten Rennen tatsächlich greift, hängt vom Modus und Sprintpfad ab. Man darf die beiden Startregeln nicht als gleichzeitig universell geltende Vorgaben verstehen.

# 11. Was passiert mit Favoriten und Rennergebnissen?

**11.1 Vorab-Favoritenliste.** Die Diagnose berechnet vereinfachte Fähigkeitsindizes für verschiedene Streckentypen und vergleicht sie mit den Zielplätzen. Die Liste ist keine kalibrierte Siegquote und berücksichtigt Teamrolle, Rennverlauf und Langzeitermüdung nur begrenzt.

**11.2 Favoritenliste und Rennentscheidung unterscheiden.** Die diagnostische Vorabrangliste ist laut Code als Analysewerkzeug gedacht. Daneben gibt es die oben beschriebene einfache 97-%-Bergfavoriten-Heuristik im experimentellen Angriffsentscheid. Sie sind nicht identisch.

**11.3 Zielgruppen.** Für die Auswertung werden aus individuellen Zielzeiten nachträglich Gruppen anhand von Nachbarlücken von mindestens **1 s** oder **3 s** bestimmt. Das ist eine Vergleichsmethode, keine vollständige Nachbildung aller offiziellen Straßenrenn- und Sonderwertungsregeln.

**11.4 Renndiagnostik.** Angriffsereignisse, Ziele, Gruppen, ausgewählte Zwischenstände, Arbeit und Reserven können protokolliert werden. Ein Angriff ist zunächst ein Wechsel der Fahrerabsicht. Ein Erfolg muss anhand des tatsächlichen weiteren Verlaufs beurteilt werden.

**11.5 Grenze der aktiven Spitze.** Wenn der Sieger bereits im Ziel ist, kann sich „aktive Rennspitze“ auf den vordersten noch fahrenden Fahrer beziehen. Ein danach gemessener Abstand von null bedeutet nicht automatisch, dass dieser Fahrer den Sieger eingeholt hat.

# 12. Was fehlt oder ist noch nicht ausreichend nachgewiesen?

1. **Rundfahrt und Gesamtwertung:** Es gibt hier noch keine vollständige taktische Berücksichtigung von Gelbem Trikot, Gesamtabständen, verbleibenden Etappen oder dem Unterschied zwischen Etappensieg und Klassementziel.
2. **Konkreter Teamplan vor dem Rennen:** Detaillierte Manager-Vorgaben und ein ausgearbeiteter Teambus-Dialog sind nicht durch die vier grundlegenden Teamstrategien ersetzt.
3. **Gemeinsame Nachführgruppe:** Mehrere Fahrer können physisch im Windschatten fahren; ein explizites gemeinsames Nachsetz-Ziel mit taktisch gewählten Führungswechseln ist für den neuen individuellen Anschluss noch nicht als fertig nachgewiesen.
4. **Abschätzen von Anschlusschancen:** Konstantes Zieltempo und lokales Gelände sind Vereinfachungen. Langstreckenprognose und Abbruchbedingung können falsche Entscheidungen erzeugen.
5. **Konkurrenten und taktischer Nutzen:** Die KI kennt keine vollständige menschliche Abwägung aller Rivalen, keine sichere Zukunftsprognose und keinen garantierten Ausgang einer Attacke.
6. **Technik und Ereignisse:** 1D-Gruppenfahrt, vereinfachter Windschatten und Abfahrtsregel bilden nicht jede reale Seitenposition, Windkante, Sturz- oder Defektsituation ab.
7. **Kalibrierung:** Zeiten, Abstände, %-Grenzen, Wahrscheinlichkeiten und Energieparameter sind an vielen Stellen vorläufig. Bestandene Softwaretests beweisen nicht, dass die Rennverläufe realistisch sind.
8. **Aktueller Stand:** Die mehrminütige Anschlussregel ist ein separater Versuch. Es gab gezielte Tests und einzelne Paarvergleiche, aber noch keine vollständige Sportfreigabe oder abgeschlossene Gesamtauswertung.

## Vorschlag für die gemeinsame Durchsicht

Zuerst die **festen Schwellen** und ihre sportlichen Folgen prüfen: insbesondere Bergfavoritenschutz bei 97 %, Teamjagd mit maximal drei bzw. vier Teams, die Ziel-/Abbruchheuristik beim Anschluss, Sprintprofil- und Positionierungsgrenzen sowie besondere Berg- und Klassikerregeln. Anschließend einzelne Rennsituationen gegen diese Regeln halten. Eine auffällige Schwelle ist nicht automatisch falsch; entscheidend ist, ob sie plausible Situationen unnötig ausschließt oder unplausible erzeugt.
