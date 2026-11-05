# R-24, Schritt 2: Untersuchung einzelner Rennverläufe

Stand 05.11.2026. **Diagnose, keine Engineänderung und keine sportliche Freigabe.** Ausgewertet werden fiktive Referenzfelder mit Seed 2026. Das ist ein Einzelfall je Variante, kein Häufigkeitsnachweis. Vorher ist Codecommit `5dc47e6` (Rampenbewertung korrigiert, vor der Kapitänsjagd); aktuell ist der Enginecode des GitHub-Commits `9166b6dbbb8334e8f16c00331cb59337e0424965`. Zwischen beiden wurden neben Tests/Dokumentation die Kapitänsjagd und ihr Teamkoordinator geändert. Die Team- und Fahrerdaten sowie der Seed sind im jeweiligen Paar identisch. Kleine Unterschiede können den gesamten späteren Rennverlauf verändern; ein A/B-Ergebnis beweist nicht die unmittelbare Ursache jedes Ereignisses.

Messpunkte liegen etwa alle fünf Kilometer der **Rennspitze**. Ein zurückliegender Fahrer befindet sich deshalb bei einem Messpunkt unter Umständen auf einem ganz anderen Streckenabschnitt. Watt, Tempo und W′ sind Momentwerte; sie zeigen keine Durchschnittswerte und lassen aus sich allein keine Kausalität oder realistische Dauerleistung ableiten. Zwischen den Messpunkten kann viel geschehen. Gruppen sind nach dem modellierten räumlichen Abstand definiert, keine offiziellen Zielzeitgruppen.

## 1. Liège: Wie konnte der Sprinter gewinnen?

Der Fall betraf **den vorherigen Stand**, nicht das aktuelle Referenzrennen. F009 hat 77,2 kg, 384,3 W Profil-CP und 39,8 kJ W′; F078 hat 62,8 kg, 405,8 W Profil-CP und 16,9 kJ W′. Auf drei Minuten ergeben die modellierten Frischwerte einschließlich 7,7 kg Rad ungefähr 7,13 gegenüber 7,09 W/kg. Das ist eine Folge der verwendeten Fahrerprofile und der vorhandenen W′-Reserve, kein direkt vergebener Siegbonus. Die drei Minuten sind keine Zusage für längere Anstiege. Tagesform und vorhandene Reserven ändern den tatsächlich berechneten Rangwert.

| Messung | Vor Kapitänsjagd | Aktueller Stand |
| --- | --- | --- |
| Bei Führungs-km 100 | F009 2,9 km zurück; F078 4,1 km zurück | F009 nahe der Spitze; F078 1,45 km zurück |
| Bei Führungs-km 160 | F009 in der 32er-Spitzengruppe; F078 1,54 km zurück | Beide in der 92er-Spitzengruppe |
| Bei Führungs-km 180 | F009 in der 23er-Spitzengruppe; F078 1,82 km zurück | F078 an der Spitze; F009 1,88 km zurück |
| Bei Führungs-km 240 | F009 in einer 5er-Spitzengruppe, 49 % W′; F078 733 m zurück | F078 in der 2er-Spitzengruppe; F009 4,46 km zurück |
| Ergebnis | F009 gewinnt vor F036; F078 Platz 18 (+2:34) | F135 gewinnt vor F078; F009 Platz 15 (+8:31) |

Vor der Kapitänsjagd hat F009 im Messpunkt bei km 250 wieder 98 % W′; die letzten etwa zwei Kilometer sind jedoch keine dauerhafte Steigung, und die Momentleistung beträgt dort 73 W. Das Modell kann unter CP W′ wieder auffüllen. Die Wiederherstellung verwendet im Rennen aktuell einen pauschalen Wirkungsgrad von 0,22; ob Tempo und Ausmaß auf langer Distanz realistisch sind, ist **nicht** allein aus diesen Messpunkten nachgewiesen. Die langfristige Leistungsverfügbarkeit von F009 beträgt bei km 240 rund 96 %, bei km 250 rund 95 %. Die Langzeitermüdung war aktiv; 100 % an früheren Messpunkten bedeutet nicht, dass sie abgeschaltet war.

**Bewertung:** Der Sprintersieg entstand daraus, dass F009 nach einer früheren Rückstandsphase ab etwa km 160 an der Spitze verblieb, die letzten Anstiege in einer kleinen Gruppe überstand und danach sprinten konnte. Seine große W′-Reserve und der zeitweilige Windschatten sind prüfenswert. Es ist nicht belegt, dass sein Siegeffekt auf nur eine Ursache zurückgeht. Die im alten Zwischenstand verkürzte Formulierung, er sei durchgehend vorn gefahren, gilt nicht für das gesamte Rennen. Ein Sprinter-Etikett allein darf keinen Sieg ausschließen; die Frage ist, ob seine Leistungswerte, Anstiegsbelastung, Erholung und der Rennkontext zusammen plausibel sind.

## 2. Hautacam: frühe Teilung auch ohne Attacken

Im aktuellen Kontrolllauf sind Attacken ausdrücklich ausgeschaltet, übrige Team- und Gruppenregeln bleiben aktiv. Bei Führungs-km 20 sind alle 154 Fahrer in einer Abstandsgruppe, bei km 25 ebenfalls. Bei km 30 werden unter anderem Gruppen von 67, 1, 23 und 29 Fahrern registriert; F078 liegt dann rund 960 m, F134 rund 838 m hinter der Spitze. Bei km 40 besteht wieder eine 120er-Gruppe; die beiden sind in einer weiteren 21er-Gruppe. Eine Gruppenregistrierung ist eine Momentaufnahme, keine Garantie dauerhaft getrennter Gruppen.

Bei Führungs-km 25 liefert die Momentaufnahme für F078 ca. 459 W bei Tages-CP ca. 410 W und 92 % W′; F134 fährt ca. 448 W bei Tages-CP ca. 400 W und 96 % W′. Ein älterer detaillierter Sekundentakt-Versuch auf einem früheren R-24-Zwischenstand zeigte, dass der entfernte Gruppenführer bereits in der Abfahrt beschleunigte, während ein Nachfolger noch am Anstieg war. Dies ist ein **konkreter Verdachtsmechanismus**, aber die alten Sekundenwerte sind kein Beweis dafür, dass jede Lücke im aktuellen Lauf allein dadurch entsteht. Die frühere pauschale Dämpfung des Fernbezugs brachte in anderen Gegenproben neue Probleme und wurde nicht übernommen.

**Bewertung:** Weil die Teilung ohne Attacken auftritt, können Attacken nicht die notwendige Erklärung sein. Ob Geländeübergang, Gruppenregelung, Windschatten, Teamtempo und/oder Nachführverhalten in Kombination verantwortlich sind, muss im nächsten Schritt in einer aktuellen Sekundenmessung geklärt werden. Auch der synthetische Verlauf zwischen den echten Anstiegseckpunkten kann Einfluss haben.

## 3. Hautacam: Warum ändern sich F078 und F134 so stark?

| Messung | Vor Kapitänsjagd | Aktueller Stand |
| --- | --- | --- |
| Führungs-km 50 | F078 2,57 km zurück, F134 1,35 km zurück | F078 1,29 km zurück, F134 1,19 km zurück |
| Führungs-km 120 | F078 2,31 km zurück, F134 2,05 km zurück | F078 2,00 km zurück, F134 805 m zurück |
| Führungs-km 135 | Beide ca. 1,3 km zurück in derselben Vierergruppe | F134 in der 13er-Spitzengruppe, F078 2,55 km zurück |
| Führungs-km 145 | Beide rund 920 m zurück in derselben Gruppe | F134 allein an der Spitze, F078 2,16 km zurück |
| Ergebnis | Zeitfahrer F117 gewinnt; F134 Platz 13 (+3:33), F078 Platz 15 (+4:26) | Kletterer F134 gewinnt; F078 Platz 57 (+13:19) |

Im aktuellen Lauf wird bei F134 ein Angriffsereignis bei seiner eigenen Position km 144,44 registriert. Bei Führungs-km 135 zeigt die Momentaufnahme F134 bereits in der ersten Gruppe und F078 deutlich dahinter. F134 befindet sich dort auf einer Abfahrt (63,4 km/h, 54 W), während F078 noch am Anstieg fährt (24,5 km/h, 444 W): Die Momentwerte sind deshalb nicht direkt vergleichbar. Im Kontrolllauf ohne Attacken gewinnt dagegen F078, F134 wird Zwölfter. Das zeigt eine starke Abhängigkeit vom gesamten Rennverlauf, keine generelle Stärke-Reihenfolge.

**Bewertung:** Die neue Mannschaftsplanung verändert in diesem gepaarten Versuch bereits früh die Gruppenkonstellation; vor dem Col du Soulor gehören die zwei Kletterer im aktuellen Lauf unterschiedlichen Gruppen an. Daraus folgt noch nicht, dass der konkrete Kapitänsauftrag allein F134s Sieg oder F078s Rückstand verursachte. Die 5-km-Diagnose speichert weder laufenden Auftrag noch Fahrerentscheidung oder unmittelbaren Vordermann. Ob F078 wirklich ausreichend Unterstützung erhielt, ob eine Jagd sinnvoll/erreichbar war und wann F134 in die Spitzengruppe kam, lässt sich damit nicht abschließend beantworten.

## 4. Verdeckte bzw. vorläufige Modellgrenzen

- Die W′-Erholung erfolgt pro Sekunde anhand der Differenz zwischen effektiver CP und tatsächlicher Leistung mit Faktor 0,22. Dieses vereinfachte Modell ist keine validierte Aussage zu realen Profi-Erholungszeiten.
- R-19 verwendet unter anderem 90 Minuten Schonzeit, 1200 kcal simulierte Kohlenhydratkapazität, eine Belastungsschwelle von 70 % Referenz-CP sowie eine maximal 40%ige Leistungsreduktion. Das sind offen gelegte Heuristiken, keine individuell physiologisch kalibrierten Messwerte. Bei früheren Messpunkten mit 100 % Verfügbarkeit kann die Ermüdungsbilanz trotzdem laufen, ohne dass die definierten Schwellen bereits eine Leistungsminderung erzeugen.
- Die Kapitänsjagd selbst hat weitere explizite Schwellen (u. a. Gruppe mindestens 4, Lücke 42–1500 m, Kapitän mindestens 27 % W′), siehe [Auditkorrekturen](R24_AUDIT_KORREKTUREN.md). Die untersuchten Rennen belegen noch nicht, ob diese Grenzen sportlich richtig sind.
- Die Messwerte enthalten keine kontinuierliche Aufzeichnung von Fahrerentscheidungen oder Helferaufträgen. Aus Momentanwerten lässt sich weder die Dauer einer Leistungsspitze noch die tatsächliche Dauer eines Auftrags bestimmen.

## Reproduzierbarkeit und nächster Schritt

[Diagnoseskript](../../scripts/r24-schritt2-diagnose.mjs) und die fünf [Rohdatensätze](r24-schritt2-daten/) sind gesichert. Beispiel für den aktuellen Stand: `node --experimental-strip-types scripts/r24-schritt2-diagnose.mjs "$PWD" liege`. Mit `berg` und `berg-ohne-attacken` die Bergfälle ausführen; für Vorher-Vergleiche einen Checkout von `5dc47e6` als erstes Argument angeben. Die Skriptausgabe ist JSON. Ohne Codeänderung vorerst keine erneute komplette Testsuite nötig; das Skript wurde syntaktisch geprüft, die fünf Läufe wurden abgeschlossen und der aktuelle Berg-Kontrolllauf wurde anschließend bytegenau reproduziert.

Schritt 2 endet hier. Für Schritt 3 zuerst aktuelle Sekundenverläufe mit konkretem Vordermann, Gelände, Wattwunsch und tatsächlichem Auftrag um die frühe Teilung ergänzen; ferner nachvollziehen, wie F134 nach vorn gelangt und welche Hilfseinsätze F078 tatsächlich erhält. Danach Varianten und situationsabhängige Tests entwickeln. Vor einer Umsetzung das Feedback des Nutzers zu den sportlichen Beobachtungen berücksichtigen.
