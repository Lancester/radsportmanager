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
