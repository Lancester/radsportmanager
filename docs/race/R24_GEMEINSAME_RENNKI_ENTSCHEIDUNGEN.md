# Gemeinsame Entscheidungen: Renn-KI

Stand: 05.11.2026. Entscheidungen werden vor weiteren Tests gemeinsam durchgesprochen. Dieses Dokument beschreibt vereinbarte Ziele; es ist kein Nachweis ihrer Implementierung.

## 1. Frühe Flucht und Teamziel — vereinbart

- Ein Sprintteam schützt normalerweise seinen Sprinter und kann dennoch einen geeigneten Helfer in eine frühe Flucht schicken.
- Ein Team mit starkem Bergfavoriten kann einen Helfer in die frühe Flucht schicken, während der Favorit selbst zu Beginn normalerweise seine Kräfte für später spart.
- Ein offensiv ausgerichtetes Team darf gezielter mehrere Fahrer für frühe Fluchtversuche einsetzen.
- Dies sind taktische Tendenzen und Teamziele, keine starre Pflicht: Teilnahme, Auswahl und Einsatz hängen von der tatsächlichen Rennsituation und den Fähigkeiten und Aufgaben der Fahrer ab. Keine Erfolgsgarantie.
- Keine Aussage, dass bereits eine fertige Auswahl, Koordination oder ein detaillierter Teamplan im Programm existiert.

Nächster Diskussionspunkt: Zusammenspiel und Verfolgung von Teams nach Etablierung einer Fluchtgruppe. Die Gesamtwertungslogik bleibt für spätere Rundfahrten zu berücksichtigen; die aktuelle Besprechung konzentriert sich auf Eintagesrennen.

## 2. Bereits entstandene Spitzengruppe und erneute Fluchtbildung — vereinbart

- Die Teamentscheidung hängt vom eigenen Rennziel, der Beteiligung eigener Fahrer und deren Chancen auf diesem Profil ab.
- Ist ein aussichtsreicher eigener Fahrer vorne, kann das Team zunächst die Arbeit anderen überlassen. Hat ein Sprintteam einen Fahrer mit geringer Siegchance in der Flucht, kann es trotz eigener Beteiligung später ein Interesse am Zusammenschluss haben.
- Ein Team ohne Fahrer vorne kann versuchen, gezielt einen Fahrer nachzuschicken, wenn die Rennlage und eine Aussicht auf Anschluss dies sinnvoll machen. Ein Sprintteam kann stattdessen je nach Situation das Feld organisieren.
- Der Nutzer ergänzt: Besonders in der anfänglichen Phase einer Rundfahrtetappe, aber auch sonst je nach Rennlage, kann ein Team eine erste Flucht bewusst zurückholen, weil es unbedingt mit einem eigenen Fahrer in der späteren Flucht vertreten sein möchte. Die anschließende Fluchtbildung kann länger dauern und wiederholte Versuche umfassen.
- Eine taktische Möglichkeit, keine Pflicht: Jagd und Nachsetzen müssen physisch erfolgen und Energie kosten; ihre Erfolgsaussichten sind nicht garantiert. Dauer, Anzahl von Fluchtgruppen und Teamaktionen nicht mit festen Sollwerten vorgeben.
- Die genaue Entscheidung zwischen Nachsetzen, Zurückholen und Abwarten sowie Umsetzung und Kalibrierung sind gemeinsam weiter auszuarbeiten; noch kein Implementierungsnachweis.

## 3. Flucht akzeptieren und Feldtempo — vereinbart

- Jedes Team bewertet die Spitzengruppe aus seinem eigenen Rennziel heraus; eine gemeinsame einheitliche Entscheidung aller Teams wird nicht vorausgesetzt.
- Ein Team kann auch ohne eigenen Fahrer eine kleine Gruppe zunächst bewusst fahren lassen, insbesondere ein Sprintteam, das seine Chancen auf einen Massensprint wahren und sie später einholen will. „Später einholbar“ ist eine Einschätzung und kein garantiertes Ergebnis.
- Beurteilt werden unter anderem eigene Fahrer und ihre Chancen, Größe und voraussichtliche Stärke der Fluchtgruppe, aktuelle Lücke und deren Entwicklung, verbleibende Strecke, verfügbare Helfer und Reserven sowie das Verhalten und die Arbeit anderer Teams.
- Wenn andere Teams ausreichend arbeiten, kann ein Team zunächst Kräfte sparen und später bei Bedarf helfen. Es kann ein kontrolliertes Feldtempo geben; das Feld muss nicht stehenbleiben oder sofort Vollgas fahren.
- Der Abstand entsteht physisch aus dem tatsächlichen Tempo beider Gruppen und kann anders verlaufen als erwartet. Keine feste erlaubte Zeitspanne, garantierte Einholung oder vorgegebene Gruppengröße.
- Diese Regeln sind gemeinsam beschlossene Ziele; sie sind noch nicht vollständig implementiert oder sportlich validiert. Vor weiteren Tests werden die Regeln gemeinsam durchgesprochen.

## 4. Verfolgung organisieren und dosieren — vereinbart

- Interessierte Teams können zunächst ein kontrolliertes Feldtempo fahren, um den Vorsprung zu begrenzen, ohne die Flucht sofort einholen zu müssen.
- Bei wachsender Gefahr, knapp werdender Reststrecke oder anderer veränderter Rennlage können interessierte Teams die Arbeit verstärken und weitere verfügbare Helfer einsetzen.
- Helfer können sich in der Führung abwechseln. Die tatsächlich geleistete ungeschützte Führungsarbeit kostet Energie; eine Führung darf bei passender Leistungsfähigkeit und Rennlage auch mehrere Minuten oder länger dauern. Keine allgemeine feste Pflichtdauer.
- Sprintteams wägen den Aufwand gegen die benötigten Kräfte für Sprintvorbereitung und Finale ab. Andere Teams können sich beteiligen, abwarten oder nicht mitarbeiten, abhängig von ihrem jeweiligen Ziel und der Rennlage.
- Die Team-KI bestimmt zunächst autonom, wie viele verfügbare Helfer sie einsetzt; der Spieler muss dies nicht während des Rennens festlegen.
- Gruppen- und Fahrertempo, Einholen, Erschöpfung und mögliche Niederlage entstehen durch tatsächliche simulierte Kräfte, Windschatten, individuelle Fähigkeiten und Reserven. Einholen ist nicht garantiert.
- Taktische Zielvorstellung; keine Aussage, dass jede Einzelheit schon umgesetzt oder validiert ist. Weiterhin zuerst Regeln gemeinsam besprechen, dann Entwicklungsmodell ändern und erst danach testen.

## 5. Zusammenarbeit in der Fluchtgruppe — vereinbart

- Ausreißer können zunächst ein gemeinsames Interesse am Vorsprung haben, verfolgen aber zugleich individuelle und teambezogene Ziele.
- Sie können Führungsarbeit übernehmen und sich abwechseln; Windschatten und Erholung entstehen durch tatsächliche Positionen, Geschwindigkeit, Leistung und vorhandenes Energiemodell.
- Umfang und Dauer der Führung können sich nach Fähigkeiten, Position, Reserven und Rennlage unterscheiden. Ein erschöpfter Fahrer kann kürzer oder nicht mehr mitarbeiten; die Gruppe muss nicht auf ihn warten.
- Ein Fahrer kann aus Team- oder Eigeninteresse Arbeit verweigern bzw. reduzieren, etwa weil sein Team hinten für einen Sprinter fährt oder er Kräfte spart. Dies beeinflusst den Rennverlauf physisch und garantiert keinen bestimmten Sieger.
- Vor dem Ziel können Interessen auseinandergehen: etwa gemeinsames Ankommen bei Sprintchance oder eine frühere Attacke eines anderen Fahrers. Ungleiche Beteiligung kann die Flucht schwächen; Erfolg oder Scheitern ist nicht vorgegeben.
- Zielbeschreibung, keine Zusicherung einer bereits fertig umgesetzten teamübergreifenden Kooperation oder Führungstaktik. Regeln zunächst gemeinsam besprechen, anschließend Modell ändern und erst danach testen.

## 6. Individuelles und gemeinsames Nachführen mit Gelände — vereinbart

- Fahrer können allein oder mit anderen versuchen, zu einer vorausfahrenden Gruppe aufzuschließen. Treffen mehrere Fahrer mit passendem Ziel zusammen, können sie zusammenarbeiten und sich abwechseln; die tatsächliche Arbeit und der Windschatten werden physisch und energetisch bilanziert.
- Fahrerstärke, momentane Position, Tempo, Reserven, Team- und Eigeninteresse und die voraussichtliche Erreichbarkeit bestimmen, ob und wie lange sich die Nachführarbeit lohnt. Keine starre Höchstdauer von einer oder zehn Minuten, kein garantierter Anschluss.
- Ein starker Fahrer kann längere Führungsanteile übernehmen; überforderte Fahrer können kürzer führen, nicht mitarbeiten oder zurückfallen. Fahrer prüfen den Verlauf und können ihr Engagement anpassen.
- Nutzer ergänzt: Auch das vor ihnen liegende Gelände und die persönlichen Stärken sollen die Entscheidung beeinflussen. Ein guter Bergfahrer kann auf einen bevorstehenden geeigneten Anstieg warten und dort seine Leistungsfähigkeit zum Anschluss einsetzen; ein guter Abfahrer kann eine Abfahrt als Chance einschätzen und dort nachführen bzw. mehr Risiko in Betracht ziehen.
- Geländeausblick ist eine unsichere taktische Einschätzung, keine Kenntnis zukünftiger exakter Fahrleistungen, automatischer Positionen oder garantierten Überholens. Das Gelände und Gegner müssen erreichbar bleiben; das Warten kann auch scheitern. Sicherheits- und Risikoverhalten sowie die tatsächlich fahrbare Geschwindigkeit und Kräfte sind im Modell zu berücksichtigen; es dürfen keine Gratisboni entstehen.
- Die Stärke einer taktischen Gelände-Vorausschau kann später durch Eigenschaften des Fahrers/sportlichen Leiters begrenzt werden; eine präzise Ausgestaltung ist noch gemeinsam zu klären und nicht als bereits vereinbartes Attribut zu behaupten.
- Diese Punkte beschreiben das vereinbarte Ziel. Der bisherige individuelle Versuchsanschluss bildet die abgestimmte Zusammenarbeit und verlässliche Vorausschau noch nicht vollständig ab. Erst die übrigen Regeln gemeinsam besprechen, dann das Entwicklungsmodell ändern und anschließend testen.

## 7. Verfolgung fortsetzen, dosieren oder aufgeben — vereinbart

- Ein Fahrer bricht eine Verfolgung nicht allein deswegen ab, weil der Abstand eine feste Zeit lang unverändert bleibt. Die im experimentellen Stand vorhandene 120-s-Regel für ausbleibenden Fortschritt soll als starres Einzelkriterium durch eine situationsabhängige Bewertung ersetzt werden.
- Die KI berücksichtigt die Entwicklung der Lücke, die verbleibenden Kräfte und den erwarteten Energieaufwand, das eigene Renn- und Teamziel, Hilfe bzw. Mitarbeit anderer, verbleibende Strecke und erreichbares bevorstehendes Gelände.
- Die KI berücksichtigt individuelle Stärken und ggf. passende Fahrereigenschaften: Ein Fahrer kann auf einen nahen Anstieg oder eine Abfahrt setzen, auch wenn er gegenwärtig nicht aufholt. Die Einschätzung ist unvollkommen, und das Warten oder die Verfolgung kann scheitern.
- Zwischen voller Nachführarbeit und Aufgabe liegen dosierte Weiterfahrt, Schutz im Windschatten und vorübergehendes Kräftesparen; der Fahrer kann später im passenden Gelände erneut nachsetzen.
- Ein Fahrer kann die Verfolgung aufgeben oder reduzieren, wenn die Lage, Kräfte, Teamaufgabe und Aussichten dies nahelegen. Er muss nicht bis zur völligen Erschöpfung jagen. Motivation und spätere Aufgaben können seine Risikobereitschaft beeinflussen.
- Keine Erfolgsgarantie, keine festen Sollzeiten; Wattanfragen, tatsächliche Position und Energiebilanz verbleiben im bestehenden Modell.
- Gemeinsam vereinbarte Zielbeschreibung, keine Aussage, dass die 120-s-Regel bereits geändert, die künftige KI umgesetzt oder getestet ist.

## 8. Angriffe um den Sieg — vereinbart

- Fahrer wägen ihre Siegchance anhand persönlicher Fähigkeiten, Team- und Eigenzielen, Rennlage, verbleibender Strecke, verfügbaren Kräften und gegenwärtigem und vorausliegendem Gelände ab.
- Ein schneller Sprinter kann eine gemeinsame Ankunft bevorzugen, muss aber auf gefährliche Angriffe reagieren können. Ein Fahrer mit geringerer Sprintchance kann versuchen, sich vor dem Ziel, z. B. auf für ihn geeignetem Gelände, zu lösen.
- Favoriten dürfen situativ auch weit vor dem Finale attackieren, wenn die Situation und die Kräfte dafür sprechen. Kein starres Verbot bis zu einem festgelegten Kilometer; auch frühe Attacken benötigen nachvollziehbare Motivation.
- Rivalen können beispielsweise unmittelbar reagieren, dosiert nachführen oder die Verantwortung dem Team bzw. anderen Fahrern überlassen. Diese Tendenzen und Prioritäten sind noch weiter gemeinsam auszuarbeiten.
- Ein Angriff kann scheitern, Energie kosten und späteres Mitfahren erschweren. Das Ergebnis entsteht aus tatsächlicher Bewegung, Gruppendynamik und Energiebilanz, ohne Positions- oder Siegbonus.
- Gemeinsam vereinbarte Zielvorstellung; noch nicht als vollständig umgesetzt oder validiert behauptet. Erst Regeln gemeinsam durchgehen, dann Entwicklungsmodell anpassen und danach testen.

## 9. Reaktionen auf Attacken und Schutz des Kapitäns — vereinbart

- Fahrer reagieren abhängig von eigener Position, Kraft und Reserve, Team- und Eigenziel, kommendem Gelände und der geschätzten Gefährlichkeit des Angreifers. Sie können direkt folgen, dosiert nachführen, auf Helfer oder andere Teams vertrauen, abwarten oder aus tatsächlichem Leistungs- und Positionsmangel den Anschluss verlieren.
- Der Nutzer betont: Greift ein für dieses Rennen als besonders gefährlich wahrgenommener Favorit an, sollen deutlich mehr Fahrer bzw. Teams Interesse an unmittelbarer Reaktion haben als bei einem als weniger aussichtsreich eingeschätzten Fahrer. Es ist eine Einschätzung, keine sichere Kenntnis und keine direkte Positions- oder Tempogutschrift; der unterschätzte Fahrer kann gewinnen, auch Favoriten können scheitern.
- Ein Kapitän kann zunächst verfügbare geeignete Helfer zur Verfolgung einsetzen, um möglichst Kräfte und insbesondere kurzfristige Reserven zu schonen. Wo sinnvoll, kann die gemeinsame Arbeit mit mehreren Helfern die Last aufteilen und dem Kapitän ein gleichmäßigeres Tempo ermöglichen.
- Auch mehrere Helfer garantieren weder gleichmäßiges Tempo noch eine vollständig geschonte Reserve oder das Einholen: sie müssen real in Reichweite und einsetzbar sein, Führung übernehmen und Kräfte aufwenden. Gelände, Attackenstärke, Windschatten, Kräfte und Verhalten anderer bestimmen den Verlauf; bei Bedarf kann der Kapitän selbst reagieren und auch in den hohen Belastungsbereich kommen oder den Anschluss verlieren.
- Die Zahl der Helfer wählt in diesem Stadium die Team-KI anhand der Rennlage; keine verpflichtende Manager-Live-Steuerung. Zusätzliche Daten über Reputation, Teamziele, Gesamtwertung und detaillierte Fahrer-/Personal-Eigenschaften sind später konzeptionell möglich, aber noch nicht als vorhandene Funktion behauptet.
- Vereinbarte sportliche Zielbeschreibung; Umsetzung und Prüfung stehen aus. Regeln zunächst gemeinsam durchgehen, dann Entwicklungsmodell ändern und danach testen.

## 10. Gefährlichkeit eines Gegners einschätzen — vereinbart

- Ein Fahrer ist nicht in jedem Rennen und jeder Situation gleich gefährlich. Die KI bewertet seine bekannte bzw. geschätzte Eignung für Strecke und verbleibendes Gelände, insbesondere Flucht-/Solofähigkeit, Sprint und Bergstärke.
- Sie berücksichtigt Art der Entscheidung (z. B. früher Angriff oder gemeinsamer Sprint), verbleibende Strecke, den aktuellen Abstand und dessen Entwicklung, Gruppenzusammensetzung, Team- und Eigenziel sowie aus dem Rennverlauf beobachtbares Verhalten.
- Ein starker Zeitfahrer kann mit einem späten Soloangriff für Sprintteams gefährlich sein, auch wenn er kein Sprintfavorit ist; ein geschützter Sprinter kann bei gemeinsamer Ankunft gefährlich sein, auch ohne selbst zu attackieren.
- Die Einschätzung ist unvollkommen und entwickelt sich im Rennen. Andere Fahrer kennen nicht automatisch exakte interne Energiereserven oder den Ausgang des Rennens; fehlende Information, Fehleinschätzung und unerwartete Leistungen bleiben möglich.
- Für spätere Rundfahrten soll Gefährlichkeit für Etappensieg und Gesamtwertung getrennt betrachtet werden; die Gesamtwertungslogik ist noch nicht implementiert. Ein späteres Bekanntheits-/Bewertungssystem ist keine bereits existierende Funktion.
- Keine garantierten Siegquoten, künstlichen Bonuspositionen oder Resultatvorgaben. Die sportliche Zielbeschreibung muss erst konkretisiert, implementiert und geprüft werden.

## 11. Sprintvorbereitung und Sprint — vereinbart

- Sprinter und Team versuchen zunächst im Feld zu bleiben und unnötige Arbeit zu vermeiden, sofern die Rennlage dies erlaubt.
- Wird ein Sprint wahrscheinlich, suchen Sprinter und geeignete Helfer rechtzeitig eine gute Position. Der Zeitpunkt hängt von Strecke, Renntempo, Konkurrenz, Fahrern und Rennlage ab; kein immer gleicher verpflichtender Prozentwert.
- Das Team wägt die Verfolgung von Ausreißern gegen verbleibende Kräfte für Sprintzug und Finale ab. Zu wenige oder verbrauchte Helfer können dazu führen, dass der Sprinter ohne vollständigen Zug auskommen muss.
- Ein Sprinter kann auch ohne eigenen Zug das Hinterrad eines geeigneten Rivalen suchen; ob dies gelingt, hängt von tatsächlicher Position, Möglichkeiten und Fahrerfähigkeiten ab, ohne Positionsbonus oder Siegversprechen.
- Den Sprintbeginn beeinflussen Position, Tempo, Wind, Reserven, Fahrereigenschaften und Konkurrenz. Fehler und unpassendes Timing sind möglich.
- Grundsätze gelten auch für eine kleinere Gruppe. Ablauf und sinnvolle Unterstützung können sich gegenüber einem Massensprint unterscheiden.
- Sportliche Zielbeschreibung; Regeln sind noch nicht vollständig umgesetzt oder validiert. Die vorhandene vereinfachte 1D-Gruppenposition begrenzt realistische Spurwahl und Einklemmen. Vor weiteren Tests die Regeln gemeinsam durchgehen.

## 12. Fahren an längeren Anstiegen — vereinbart

- Das gefahrene Tempo entsteht aus tatsächlicher Führungsarbeit und der physikalischen Bewegung. Jeder Fahrer fordert die Leistung an, die zum Mitfahren nötig ist; wer sie nicht aufbringen oder durchhalten kann, kann zurückfallen.
- Fahrer können Attacken unmittelbar beantworten oder ein gleichmäßigeres eigenes Tempo wählen und eine zeitweilige Lücke akzeptieren. Individuelle Fähigkeiten, Masse, W′, bisherige Ermüdung, taktisches Ziel und die Rennsituation wirken zusammen.
- Geeignete, tatsächlich anwesende Helfer können ihren Kapitän unterstützen, bis ihr Einsatz endet oder ihre Kräfte nachlassen. Eigenes Tempo oder ein Antritt des Kapitäns bleibt möglich.
- Bergstärke bzw. ein Fahreretikett gibt keinen automatischen Positions- oder Siegbonus. Auch ein Sprinter kann abhängig von individuellen Werten und tatsächlichem Tempo mitfahren; spätere Abfahrt und Flachstrecke können erneuten Anschluss ermöglichen.
- Sportliche Zielbeschreibung, noch kein Nachweis vollständiger Umsetzung oder Validierung. Erst Regeln gemeinsam durchgehen, dann Modell ändern und testen.

## Offene Diskussionsidee: verschiedene Bergfahrertypen

- Nutzer fragt, ob sich Fahrer unterscheiden sollten, die besonders gut gleichmäßiges Tempo fahren oder halten, und Fahrer, die bewusst wiederholt attackieren und Konkurrenten durch Tempowechsel belasten können, vergleichbar mit beobachtetem offensivem Fahrstil.
- Zu klären sind die Trennung zwischen körperlicher Fähigkeit und taktischer Neigung, die Rolle von tatsächlichem Energieverbrauch und Erholung, Reaktionen der Gegner sowie das Risiko eigener Erschöpfung. Noch keine konkreten Parameter, zusätzliche Attribute oder Implementierung vereinbart.

## 13. Unterschiedliche Fahrweisen am Berg — vereinbart

- Körperliche Fähigkeiten (z. B. langfristig fahrbare Leistung, kurzfristige Mehrleistung und W′, Erholungs- und Ermüdungsverhalten) und taktische Neigung (z. B. gleichmäßiges Tempo oder wiederholte Tempowechsel) sollen getrennt betrachtet werden.
- Fahrer können situativ von einer bevorzugten Fahrweise abweichen; kein starres Typ-Etikett, keine garantierte Attacke, keine Sieggarantie und kein gratis Leistungs- oder Positionsbonus.
- Ein Fahrer kann am Anstieg gleichmäßig hoch fahren, um Leistung auf Dauer durchzusetzen. Ein anderer kann situativ wiederholt antreten, wenn er darin eine taktische Chance sieht, z. B. eine Lücke oder eine Schwächung der Verfolger; auch andere Fahrweisen sind möglich.
- Tempowechsel erzeugen körperliche Belastung für Angreifer und reagierende Fahrer anhand der tatsächlich gefahrenen Leistung. W′-Verbrauch, Erholung und langfristige Ermüdung sollen im bestehenden Modell abgebildet und überprüft werden; kein automatischer zusätzlicher Ermüdungsabzug für Gegner allein wegen eines Angriffs.
- Wiederholte Attacken können für den Angreifer ebenso negative Folgen haben; Gegner entscheiden situativ, ob sie direkt reagieren, dosiert nachfahren oder eigenes Tempo fahren.
- Exakte zusätzliche Attribute, Datenmodell, Parameter, Individualverteilung und erforderliche Erweiterungen der bisherigen Energiebilanz sind noch nicht beschlossen bzw. getestet. Sportliche Zielbeschreibung, Implementierung nach gemeinsamer Regelbesprechung und vor späterer Testphase.

## 14. Abfahrtstechnik und Risiko — vereinbart

- Abfahrtstechnik und Risikobereitschaft werden sportlich getrennt betrachtet: Ein guter Abfahrer kann sich zurückhalten, ein risikofreudiger Fahrer ist nicht automatisch technisch stark.
- Streckencharakter und fahrerische Fähigkeiten beeinflussen, welches Tempo ein Fahrer auf einer Abfahrt fahren kann. Ziel, Renndynamik und verbleibende Strecke können beeinflussen, wie viel Risiko er eingeht.
- Ein Fahrer kann eine Abfahrt als Gelegenheit zum Angriff oder Anschluss ansehen. Zeit und Position ergeben sich aus tatsächlichem Fahrverhalten, Strecke und Verhalten anderer, nicht aus einem automatischen Bonus oder garantierten Erfolg.
- Mögliche negative Folgen von Risiko einschließlich Sturz und deren Auswirkungen sollen gesondert besprochen werden; daraus folgt keine Annahme, dass das bestehende Modell sie bereits abbildet.
- Zielbeschreibung, noch keine Festlegung zusätzlicher Attribute, Parameter, Sturzmodellierung oder Implementierung. Vor weiteren Tests Regeln gemeinsam besprechen.

## 15. Feldpositionierung und Windschatten — vereinbart

- Die Position eines Fahrers im Feld beeinflusst Windschutz, erforderliche Leistung und seine Möglichkeiten, auf Attacken, Gruppenbewegungen und kommende Anstiege zu reagieren. Im Windschatten spart ein Fahrer abhängig von realer Lage und Umgebung Arbeit; Tempo und Gelände zählen.
- Vorrücken setzt eine geeignete Gelegenheit und physisch erbrachte Leistung voraus; es ist keine kostenlose Änderung der Rennposition. Ein hohes Gruppentempo und andere Fahrer können das Vorrücken erschweren.
- Die Fähigkeit, ein Rad zu finden und Position zu halten, darf zwischen Fahrern variieren. Ungeschickte Fahrer können Position verlieren und zusätzliche Arbeit aufwenden müssen; ein Ergebnis ist nicht vorgegeben.
- Die KI wägt ab, wann eine vordere Position zum Rennziel, Teamauftrag und kommenden Gelände passt und wann energiesparendes Mitfahren günstiger ist. Nicht alle Fahrer streben zu jeder Zeit an die Spitze.
- Eine Lücke kann beispielsweise durch Attacken, Tempoverschärfung und Wind entstehen. Reaktion, Anschluss oder Zurückfallen ergeben sich aus tatsächlicher Position, Leistung, Energie und Gruppenfahrt, nicht aus einer Gratisversetzung.
- Das bestehende vereinfachte 1D-Modell bildet keine realistischen seitlichen Fahrspuren und komplexe Überholmanöver vollständig ab. Die sportlichen Effekte sollen im Rahmen der realen Modellmöglichkeiten nachvollziehbar entstehen; eine bestimmte 2D-Implementierung ist nicht beschlossen.
- Gemeinsam vereinbartes Ziel, noch keine vollständige Implementierung oder Sportfreigabe. Die technische 42-m-Gruppengrenze ist bei der späteren Prüfung als Modellannahme separat zu beurteilen.

## 16. Stürze und Defekte — vereinbart

- Stürze und Defekte können in Rennen vorkommen, sollen aber nicht ständig auftreten oder Ergebnisse beliebig machen. Es sind keine festen Ereignisse oder vorbestimmten Ausfälle zu erzwingen.
- Ereignisse können unterschiedlich schwere Folgen haben: Zeitverlust und Weiterfahrt, notwendige Unterstützung oder bei schwereren Fällen eine Aufgabe. Ein Defekt soll nicht automatisch zum Ausfall führen.
- Bei Stürzen können unter anderem aktuelle Rennsituation, Streckencharakter, Feldposition, Fahrerfähigkeiten und individuelles Risikoverhalten eine Rolle spielen. Auch Pech und nicht kontrollierbare Ereignisse bleiben möglich.
- Ein Anschluss nach Sturz oder Defekt hängt unter anderem von realem Zeitverlust, Gelände, Geschwindigkeit, verfügbaren Helfern, Fahrerzustand und Entscheidungen ab und ist nicht garantiert.
- Verletzungsdauern und Folgen über ein Rennen hinaus können für einen späteren Karrieremodus relevant werden; Ausmaß, konkrete Mechanik und Detailtiefe sind gesondert zu entscheiden.
- Diese Zielvorstellung ist kein Nachweis, dass Stürze, Defekte, Verletzungen oder deren reale Wahrscheinlichkeiten im gegenwärtigen Rennmotor bereits implementiert und kalibriert sind. Die weitere Regelbesprechung geht Änderungen und Tests voraus.

## 17. Wind und Wetter — vereinbart

- Gegenwind, Rückenwind und Seitenwind beeinflussen die physischen Fahrbedingungen, den Leistungsbedarf und die taktische Bedeutung von Windschatten und Position. Die Wirkung auf Flucht, Verfolgung und Feld ergibt sich aus tatsächlich simulierten Gruppen und Kräften; es gibt keine automatische Einholung oder keinen vorgegebenen Fluchterfolg je nach Windrichtung.
- Seitenwind kann die Feldpositionierung wichtiger machen und unter passenden Umständen Gruppenteilungen begünstigen. Eine Windkante oder Teilung entsteht nicht bei jedem Seitenwind automatisch.
- Regen und nasse Straßen können später die Einschätzung von Abfahrten, Kurven und Risiko beeinflussen. Detaillierung und Zusammenhang mit Stürzen sind noch zu konkretisieren.
- Fahrer und Teams sollen die Bedingungen bei ihren Entscheidungen berücksichtigen können, ohne deren weitere Entwicklung und Auswirkungen perfekt vorherzusehen.
- Das bisherige Modell berücksichtigt Wind nur vereinfacht; eine vollständige zweidimensionale Windstaffel ist nicht als bereits umgesetzt zu behaupten. Technische Umsetzung und Tiefe werden an den Modellmöglichkeiten geprüft.
- Gemeinsam vereinbarte sportliche Zielbeschreibung; zusätzliche Wetterfähigkeiten und deren Effekte sind nicht sämtlich umgesetzt oder validiert.

## 18. Fahrerwerte und Tagesform — vereinbart

- Fahrer besitzen dauerhafte bzw. längerfristige Fähigkeiten, etwa Dauerleistung, kurzfristige Reserve, Masse, Sprint- und Bergfähigkeit sowie Technik und taktische Fähigkeiten; diese Eigenschaften und taktische Vorlieben dürfen sich unterscheiden.
- Tagesform kann die Rennleistung gegenüber dem individuellen üblichen Niveau etwas beeinflussen. Ein Favorit bleibt grundsätzlich stark, sein Sieg ist aber nicht garantiert; Stärke, Verteilung und Korrelation der Schwankungen sind noch zu bestimmen und zu validieren.
- Belastung, Erholung und Verpflegung können die im Rennen tatsächlich verfügbaren Kräfte verändern; früh geleistete Arbeit und energiesparende Fahrweise haben nachvollziehbare Auswirkungen.
- Rennergebnisse sollen aus dem Zusammenwirken von Fähigkeiten, Teamarbeit, Taktik, Rennlage, Physik und individueller Form entstehen; keine vorab ausgelosten Sieger oder alles dominierenden Zufallseffekte.
- Für den späteren Karrieremodus werden Training, Entwicklung und Vorbelastung berücksichtigt; genaue langfristige Regeln werden gesondert vereinbart.
- Die Frage einer mentalen Komponente wird als nächstes gemeinsam behandelt; Umfang, Werte, Bedingungen und Effekte sind noch nicht beschlossen. Beschreibung ist kein Nachweis vollständig umgesetzter Funktionen.

## 19. Mentale und taktische Eigenschaften — vereinbart

- Mentale Faktoren sollen vor allem Verhalten und Entscheidungen beeinflussen, nicht als automatischer zusätzlicher Watt-, Positions- oder Siegbonus wirken. Körperliche Leistung bleibt durch tatsächlich verfügbare Fähigkeiten, Reserven, Belastung und Physik begrenzt.
- Mögliche Einflüsse sind unter anderem Beharrlichkeit bei Nachführarbeit, Ruhe/Entscheidungsverhalten unter Druck, Mut und Risikobereitschaft, Selbstvertrauen bzw. Einschätzung der eigenen Möglichkeiten sowie Verhalten gegenüber Teamaufträgen und eigenen Chancen.
- Eine Eigenschaft führt nicht automatisch zu einer einzigen besten Entscheidung: Beharrlichkeit kann einen Anschluss ermöglichen oder unnötige Energie kosten; Abwarten kann klug sein oder eine Chance verspielen.
- Fahrer sollen abhängig von Rennlage, Teamziel, Reserve, Gelände und persönlicher Neigung unterschiedlich reagieren können. Fehler und Fehleinschätzungen sind möglich, Ergebnisse bleiben offen.
- Für spätere Karriereentwicklung können sich z. B. Selbstvertrauen oder Motivation über Rennen hinweg ändern; Mechanismen, betroffene Attribute und Stärke sowie der Einfluss von Team und Personal werden gesondert besprochen.
- Konkrete Attribute, Wertebereiche, Verteilungen, Effekte und Implementierung sind noch nicht festgelegt oder validiert. Zielvorstellung; Regeln zunächst gemeinsam durchgehen, dann Entwicklungsmodell ändern und danach testen.

## 20. Material und Fahrphysik — vereinbart

- Aerodynamische Eigenschaften von Fahrrad/Komponenten, Kleidung und Fahrerposition können den Luftwiderstand und den physisch notwendigen Leistungsbedarf beeinflussen. Ein Materialvorteil ist kein pauschaler Ergebnis- oder Siegbonus.
- Fahrer- und Fahrradmasse wirken über die Fahrphysik; bei längeren Anstiegen kann die Masse besonders relevant sein. Gewicht ergibt keine künstliche pauschale Zeitgutschrift.
- Reifen und Streckenuntergrund können den Rollwiderstand und damit den Leistungsbedarf beeinflussen. Streckenprofil und Bedingungen sollen bei der Materialwahl relevant sein.
- Es gibt keine für jeden Fahrer und jede Strecke automatisch beste Ausstattung. Konkrete individuelle Parameter, Wechselwirkungen, Auswahlmöglichkeiten, Kosten und Implementierung sind noch festzulegen und zu prüfen.
- Für einen späteren Karrieremodus können Ausstattungswahl, Materialentwicklung und zuständiges Personal gesondert vertieft werden; daraus folgt nicht, dass diese Managerfunktion derzeit bereits besteht.
- Die vorhandene Rennphysik berücksichtigt bereits einzelne Eingangsgrößen wie Masse und Luftwiderstand, aber kein vollständiges fertiggestelltes Materialmanagement. Gemeinsam vereinbarte Zielbeschreibung, noch keine vollständige Umsetzung oder Validierung.
