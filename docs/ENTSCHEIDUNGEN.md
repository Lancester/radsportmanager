# Entscheidungen und offene Fragen

**Stand: 03.11.2026.** Beschlossen = ausdrücklich festgelegt; Favorit = vielversprechend, noch zu prüfen; Offen = nicht entschieden; Nicht Ziel = bewusst nicht vorgesehen.

| ID | Status | Entscheidung | Grund |
| --- | --- | --- | --- |
| D-001 | Beschlossen | Offlinefähiger Einzelspieler-Radsportmanager mit langfristiger Karriere | Kein Multiplayer-Publikum nötig |
| D-002 | Beschlossen | Spieler agiert als Geschäftsführer/Teammanager | Realistische Zuständigkeiten |
| D-003 | Beschlossen | Sportliche Leiter werden eingestellt und betreuen Rennen autonom | Personal hat echten Nutzen |
| D-004 | Beschlossen | Taktik-/Zielbesprechung vor dem Rennen | Strategische Mitwirkung ohne Live-Steuerung |
| D-005 | Beschlossen | Kein aktiver 3D- oder Fahrersteuerungsmodus als Kernziel | Fokus auf Management und Simulation |
| D-006 | Beschlossen | Interner Rennverlauf wird berechnet; Ergebnis und erklärbarer Rennbericht | Plausibilität und Transparenz |
| D-007 | Beschlossen | Isolierte Rennengine vor vollständigem Manager | Größtes Risiko zuerst bearbeiten |
| D-008 | Beschlossen | Kostenarmes Hobbyprojekt, möglichst nur Android-Smartphone notwendig | Alltagstaugliche Entwicklung |
| D-009 | Beschlossen | GitHub öffentlich von Beginn an; Dokumentation als verbindlicher Projektstand | Wissenssicherung und Communitychance |
| D-010 | Beschlossen | Projektkommunikation, Dateien und Aufgaben auf Deutsch | Verständlichkeit |
| D-011 | Favorit | TypeScript-Engine; Vue 3/Vite; Web Worker; IndexedDB; PWA | Gemeinsamer Code für Browser und Node |
| D-012 | Favorit | Zeitschritt- oder abschnittsbasierte Simulation | Rennereignisse statt bloßer Ergebnislotterie |
| D-013 | Favorit | Leistung aus Physik + Physiologie + Taktik + plausibler Ungewissheit | Realistische Ursachen und Effekte |
| D-014 | Zu prüfen | Critical Power und W′ für kurzzeitige Belastung | Teilmodell, nicht ausreichend für lange Rennen |
| D-015 | Favorit | Vorläufig fiktive Fahrer/Teams | Lizenz- und Datenrisiken vermeiden |
| D-016 | Favorit | Standard-GitHub-Actions für CI, große Monte-Carlo-Serien nur manuell | Kostenarm und reproduzierbar |
| D-017 | Offen | Endgültiger Name und visuelle Identität | Noch keine Namensentscheidung |
| D-018 | Offen | MIT, GPL oder andere Open-Source-Lizenz | Vor erster freier Nachnutzung klären |
| D-019 | Offen | Verwendung realer Fahrer-/Renndaten | Nutzungsrechte und Datenqualität |
| D-020 | Offen | Finales Ermüdungs-, Windschatten- und KI-Modell | Forschung und Tests erforderlich |
| D-021 | Offen | Genaue wirtschaftliche Systeme und Saisonstruktur | Erst später gestalten |
| D-022 | Optional | Ranglisten, Herausforderungen, Spieler-Vergleiche | Kein benötigter Live-Multiplayer |
| D-023 | Nicht Ziel | Gemeinsame Online-Liga mit Echtzeit-Gegnern | Hoher Aufwand ohne Nutzen für Singleplayer |
| D-024 | Nicht Ziel | Monetarisierung, verpflichtende Registrierung, Backend-Datenbank | Hobbyprojekt und Offlinebetrieb |

## Übergreifende Produktprinzipien

1. **Emergente Geschichten statt Skriptfolgen:** Talente, Rivalitäten, Transfers und Teamwechsel aus konsistenten Systemen.
2. **Strategische Entscheidungen statt Mikromanagement:** Jede Funktion muss spielerischen Mehrwert schaffen.
3. **Erklärbare Ergebnisse:** Der beste Fahrer gewinnt oft, aber nicht automatisch; Überraschungen haben nachvollziehbare Ursachen.
4. **Realistische Größenordnung und effiziente Ausführung:** Das Modell darf auf einem Smartphone funktionieren, ohne in Beliebigkeit zu enden.
5. **Keine versteckten Faktenbehauptungen:** Parameter erst nach Messung, Fachrecherche und Kalibrierung festschreiben.

Neue Beschlüsse mit Datum, Begründung und gegebenenfalls Bezug auf Issue/PR hier ergänzen.


## Ergänzung zur Feldpositionierung (03.11.2026)

| ID | Status | Entscheidung | Grund |
| --- | --- | --- | --- |
| D-025 | **Beschlossen** | Fahren und Positionieren im Peloton ist eine eigenständige Fahrerfähigkeit, die Einfluss auf reale Position, Bewegungsaufwand, Energieverbrauch und Risiko von Gruppenrissen hat. | Sportlich plausibel und wichtig für Klassiker und Schlüsselstellen. |
| D-026 | **Beschlossen** | Vor Kurven, Verengungen, Anstiegen und Windkanten wird um Positionen gekämpft; Teamhilfe, Fahrerfähigkeit und begrenzte Straßenbreite beeinflussen, wer rechtzeitig vorne ist. | Keine beliebige oder kostenlose Positionsänderung. |
| D-027 | **Favorit** | Kombination aus physikalischer Bewegung/Leistung, Physiologie und regelbasierter agentenbasierter Entscheidungs-KI. | Taktik entscheidet das Gewollte; physikalische und physiologische Grenzen das Erreichte. |
| D-028 | **Zu prüfen** | Peloton als approximiertes 2D-/Reihenmodell mit kontinuierlichem Streckenfortschritt und dynamischen Nachbarschaften. | Detailgenauigkeit muss gegen Plausibilität und Android-Rechenzeit abgewogen werden. |

Verbindliche fachliche Anforderung und vorgeschlagene Umsetzung: [PELOTON_POSITIONIERUNG.md](PELOTON_POSITIONIERUNG.md). **Wichtig:** Noch keine numerischen Skillboni, Aero-Koeffizienten oder Positionsregeln als validiert betrachten.


## Offene R-01-Modellkonvention (03.11.2026)

| ID | Status | Entscheidung | Grund |
| --- | --- | --- | --- |
| D-029 | **Beschlossen (03.11.2026)** | Fahrerleistung wird grundsätzlich als **Pedal-/Kurbel-Watt** definiert; Verluste im Antrieb werden separat bei der Übertragung ans Hinterrad berechnet. | Explizit vom Nutzer bestätigt, wie Powermeter; saubere Energiebilanz. |
| D-030 | **Beschlossen als Testkonvention, nicht kalibriert (03.11.2026)** | Für R-01/R-02 wird vorläufig `η = 0,975` genutzt; `η` bleibt frei parametrierbar und wird später fachlich kalibriert. `η = 1` ist ein theoretischer Kontrollfall. | Vom Nutzer bestätigt, ohne daraus einen universellen Wirkungsgrad zu behaupten. |

Die Rechnung und die übrigen offenen Fragen stehen unter [physik/R01_EBENE.md](physik/R01_EBENE.md). **D-029 und die R-01-Empfehlungen sind bestätigt:** 97,5 % als vorläufiger Testwert, variable CdA-Parameter für spätere Ausrüstung und Körperhaltung sowie zunächst stationäre Einzeltests, Beschleunigung später. Der endgültig realistisch kalibrierte Wirkungsgrad bleibt offen. Die Zahlen von R-01 sind Testwerte, keine kalibrierten Standardwerte.

## R-02 und Materialinvestitionen: bestätigte Grundrichtung (03.11.2026)

| ID | Status | Entscheidung | Grund |
| --- | --- | --- | --- |
| D-031 | **Beschlossen** | CdA des Fahrers/Rads darf abhängig von Körperhaltung, Ausstattung und später Pelotonposition variieren. | Aerodynamik ist physikalische Eigenschaft, kein pauschaler Bonus. |
| D-032 | **Beschlossen** | Für die ersten Einzelreferenzen stationäre Fahrten; **Beschleunigung und Bremsen später ausdrücklich ergänzen**. | Zunächst isolierte und prüfbare Gleichungen. |
| D-033 | **Beschlossen** | Verbesserte Ausrüstung soll im Karrieremodus **käuflich und budgetabhängig** sein: kleine Teams besitzen anfangs weniger hochwertige Optionen. Wirkung über Masse, CdA, Crr und ggf. Wirkungsgrad, nicht über direkte Ergebnisboni. | Wirtschaftliche Entscheidungen wirken realistisch und streckenabhängig. |
| D-034 | **Zu prüfen** | Produktgruppen, konkrete Werte, Preise, Reglement, Haltbarkeit und Wechselwirkungen (z. B. Aero-Position vs. abrufbare Leistung). | Recherche und Balancing fehlen. |

**Umsetzung bisher:** R-02 besitzt konfigurierbare Materialmasse und CdA und berechnet deren physikalische Wirkung. Noch **kein Shop, kein Team-Budget und keine dynamischen Haltungswechsel**. Fachliche Herleitung: [physik/R02_BERG.md](physik/R02_BERG.md).

## Dynamische Streckenabschnitte (03.11.2026)

| ID | Status | Festlegung | Begründung |
| --- | --- | --- | --- |
| D-035 | **Beschlossen** | Nach R-02 werden kontinuierliche Geschwindigkeit und Position auf wechselnden Streckenabschnitten, **Beschleunigung, Verzögerung, Abfahrten und Bremsen** umgesetzt. | Expliziter Nutzerauftrag, physikalische Kontinuität vor Pelotonmodell. |
| D-036 | **Technische Testannahme – zu kalibrieren** | 0,25-s-Schritt, impliziter Mittelpunktschritt, 180-N-Anfahrkraftlimit und vorgegebene Test-Bremskraft. | Mathematisch stabiler kleiner Prototyp; nicht als reale Fahrertechnik oder finaler Simulationsstandard bewiesen. |
| D-037 | **Favorit – offen** | Kurven-/Engstellen-Bremsentscheidungen später vorausschauend und fahrerabhängig mit physikalischen Grenzen berechnen. | Taktische und fahrtechnische Qualität wird relevant. |
| D-038 | **Zu prüfen** | Rotierende Laufradträgheit, Profilglättung, Haft-/Kurvenlimits, physische Leistungsdauer und Smartphone-Rechenleistung ergänzen. | Relevante Lücken zum realitätsnahen Rennbetrieb. |

Ausführliche Herleitung, 4-km-Demo, 15 Tests und **alle offenen Punkte**: [physik/DYNAMISCHE_STRECKE.md](physik/DYNAMISCHE_STRECKE.md). Die offenen Fragen müssen gemäß [START_HIER.md](START_HIER.md) auch mit dem Nutzer im Chat besprochen werden.

## Kurvenvorschau und Laufradrotation (03.11.2026)

| ID | Status | Festlegung | Begründung |
| --- | --- | --- | --- |
| D-039 | **Beschlossen: Entwicklungsrichtung** | Vorausschauendes Bremsen vor Kurven und rotierende Laufradträgheit ergänzen, bevor R-03 (Gruppen/Windschatten) beginnt. | Expliziter Nutzerauftrag; keine Geschwindigkeits-Sprünge und nachvollziehbare Fahrtechnik. |
| D-040 | **Testmodell, noch zu kalibrieren** | Kurve vorläufig als punktförmiges Geschwindigkeitsziel nach Radius, Grip und Sicherheitsfaktor (derzeit 0,7). | Prüffähiger erster Schritt; kein voller Kurvenbogen oder Reifen-Reibkreis. |
| D-041 | **Testmodell, noch zu kalibrieren** | Laufradträgheit über m_eff = m + I/r² nur in Beschleunigung und kinetischer Energie; tatsächliche Masse bleibt für Schwerkraft/Reifenhaftung. | Vermeidet doppelte Anrechnung der Laufradmasse, mechanisch konsistent. |
| D-042 | **Offen** | Individuelle Fahrtechnik/Kurvenlinie, Regen/Reifen, Reibkreis und genaue Trägheitsparameter. | Nicht als fertiges Rennmodell ausgeben. |

Der erste **getrennte Prototyp** und die offene Fragenliste liegen unter [physik/KURVEN_UND_ROTATION.md](physik/KURVEN_UND_ROTATION.md). Vor R-03 die verschiedenen Teilmodelle mit gemeinsamer Testsuite integrieren.

## Gemeinsame Physik-Engine und Fahrerkompetenzen (03.11.2026)

| ID | Status | Entscheidung | Begründung |
| --- | --- | --- | --- |
| D-043 | **Beschlossen: Softwarearchitektur** | Ein gemeinsamer dynamischer TypeScript-Rechenkern berechnet die Kräfte und Geschwindigkeitsentwicklung; alte dynamische und Kurven-APIs sind nur Adapter. Die separaten R-01-/R-02-Gleichgewichtstests bleiben. | Eine konsistente Physikbasis, überprüfbare Referenzen und einfachere Erweiterbarkeit. |
| D-044 | **Beschlossen: Spielkonzept für später** | **Fahrtechnik und Risikobereitschaft** eines Fahrers beeinflussen Kurven, Abfahrten, Linienwahl und Gefahr von Fahrfehlern. | Explizite Anforderung des Nutzers, glaubwürdiger Manager statt reine Wattwertung. |
| D-045 | **Beschlossen: Spielkonzept für später** | **Individuelles fahrerisches Talent und spezielle Trainingseinheiten** sollen die Entwicklung von Fahrtechnik und Abfahrtsvermögen beeinflussen. | Langfristiger Talent-/Trainer-/Trainingsnutzen im Karrieremodus. |
| D-046 | **Offen: Umsetzung und Balancing** | Konkrete Werte, Trainingsgrenzen, Fehler-/Sturzrisiken, Reaktionszeiten, Risikoprofil und Fahrtechnik-Kalibrierung. | Nicht als bestehende Engine-Eigenschaften oder pauschale Wattboni interpretieren. |

Im aktuellen Code ist davon **noch keine Fahrer-KI oder ein Trainingssystem** implementiert. Die Risiken werden erst anhand überprüfbarer Situations- und Wahrscheinlichkeitsmodelle ausgearbeitet, siehe [Issue #19](https://github.com/Lancester/radsportmanager/issues/19).

Die einheitliche dynamische Architektur, Testausführung und ehrliche Messgrenzen stehen in [physik/GEMEINSAMER_KERN.md](physik/GEMEINSAMER_KERN.md).

## R-03: erste gekoppelte Zweierfahrt (03.11.2026)

| ID | Status | Inhalt | Begründung |
| --- | --- | --- | --- |
| D-047 | **Beschlossen: Umsetzungsschritt** | Zunächst 2 Fahrer gemeinsam auf derselben Simulationsuhr mit Abstand und Position; danach schrittweise auf kleine Gruppen erweitern. | Kontrollierbarer Einstieg in die Pelotondynamik. |
| D-048 | **Technische Testannahme – nicht kalibriert** | Windschatten als **multiplikativer Faktor nur auf den Luftwiderstand**, anfängliche Maximalreduktion 35 % und exponentielle Abnahme mit Längs-/Seitenabstand. | Isolierbarer, physikalisch richtiger Wirkmechanismus; konkrete Reduktionskurve ist eine vorläufige Heuristik. |
| D-049 | **Technische Abgrenzung** | Fahrer können in diesem ersten Zweierprototyp **nicht** selbstständig Spur und Taktik wählen. Kollisionen in gleicher Spur werden als Fehler gemeldet, Überholen auf versetzter Spur funktioniert als Test. | Keine versteckte „Magie“ oder erfundene KI. |
| D-050 | **Offen** | Aero-Kurven durch Messdaten kalibrieren, Hintermann-Effekt auf Führenden, Querwind, echte Lateralbewegung, mehrgliedrige Gruppen und Smartphone-Benchmark. | Wesentliche Voraussetzungen für eine glaubwürdige vollständige Rennsimulation fehlen. |

Fachliche Erklärung und **alle noch offenen Fragen**: [physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md](physik/R03_WINDSCHATTEN_ZWEI_FAHRER.md). Die spätere individuelle Positionierungsfähigkeit ist bereits als Spielanforderung beschlossen, aber **noch nicht im Code**.

## R-03G: echte Achtfahrer-Kopplung und KI-Abgrenzung (03.11.2026)

| ID | Status | Entscheidung | Erläuterung |
| --- | --- | --- | --- |
| D-051 | **Beschlossen: jetziger Umsetzungsschritt** | 3–8 Fahrer mit **einer gemeinsamen Uhr**, Positions-/Abstandswechselwirkungen und physikalischem Aero-Faktor statt 80 isolierter Paare simulieren. | Nutzerauftrag, kontrollierbare Grundlage für das spätere Peloton. |
| D-052 | **Testheuristik – nicht kalibriert** | Jeder hintere Fahrer wird vorläufig von **allen vor ihm fahrenden Nachbarn** abgeschirmt; Beiträge werden mittels gedeckelter Produktformel kombiniert (max. 35 % Aero-Reduktion). | Erste stabile Mehrfahrer-Kopplung; nicht als empirisches Peloton-Windschattenmodell ausgeben. |
| D-053 | **Technische Abgrenzung** | In der Achtfahrer-Demo sind **Spuren und Pedalwatt vorgegeben**. Der Leistungsabfall von F8 ab Sekunde 30 ist ein festes Testkommando, **keine KI-Entscheidung**. | Physik und Entscheidungslogik sauber trennen. |
| D-054 | **Favorit – mit Nutzer noch zu entscheiden** | Später regelbasierte, nachvollziehbare **Fahreragenten** zur Positionswahl, Risikoabwägung, Teamtaktik und Reaktion auf Lücken nutzen, ohne die mechanische Rennphysik zu ersetzen. | Erklärbares Rennverhalten und Leistung auf Android; noch keine autonome KI programmiert. |

Details, Formel, aktuelle Ergebnisse und **alle offenen Fragen**: [physik/R03G_ACHTFAHRER.md](physik/R03G_ACHTFAHRER.md). Die schon beschlossenen Spielerattribute Fahrtechnik, Risikobereitschaft und trainierbares Talent bleiben separate spätere Entwicklungsaufgaben.


## R-04: erste regelbasierte Fahrerentscheidungen (03.11.2026)

| ID | Status | Inhalt | Begründung |
| --- | --- | --- | --- |
| D-055 | **Beschlossen für diesen Prototyp** | Erste **erklärbare TypeScript-Zustandsmaschine**, die eine wachsende Lücke wahrnimmt, eine zeitlich begrenzte höhere Pedalleistung anfordert und danach wieder in einen Erholungszustand wechselt. | Expliziter Auftrag des Nutzers; einfache KI ohne Cloud und ohne schweres ML-Framework. |
| D-056 | **Technische Trennung** | Regelagent gibt **nur Wattwünsche** zurück, die bestehende dynamische Physik berechnet **unverändert** die tatsächlichen Kräfte, Geschwindigkeit und Abstände. | Keine Geschwindigkeitsteleportation und nachvollziehbare Ergebnisse. |
| D-057 | **Testwerte, nicht kalibriert** | In der ersten F8-Demo: Triggerlücke 5 m, Rücknahmeschwelle 4,2 m, höchstens 255 W, maximal 30 s Nachsetzen am Stück und 20 s Erholungsfenster. | Vorläufige Regelparameter; kein CP/W′- oder echtes Ermüdungsmodell. |
| D-058 | **Offen** | Sichere Brems-/Spur- und Kollisionsvermeidung, individuelle Reaktionszeiten, physiologische Reserven, Fähigkeiten, taktisches Bewerten („Mitgehen oder nicht?“), Team-KI/Behavior Trees. | Erst nach isoliertem Test entscheiden, was der vollständige Manager braucht. |

Details: [ai/LUECKENAGENT.md](ai/LUECKENAGENT.md). Keine neuronale KI oder externe KI-Bibliothek verwendet.


## R-05 · Abstandsregelung, CP/W′ und FTP (03.11.2026)

| ID | Status | Inhalt | Einordnung |
| --- | --- | --- | --- |
| D-059 | **Beschlossen – Prototyp** | Vor autonomer Überhol-KI einen **optionalen longitudinalen Sicherheitsregler** mit Relativgeschwindigkeit, Mindestabstand, Leistungsrücknahme und physikalischer Bremskraft einbauen. | Kein Geschwindigkeits- oder Positionssprung; derzeit keine Garantie bei zu spätem Bremsen. |
| D-060 | **Beschlossen – Datenmodell** | **FTP**, **Critical Power (CP)** und **W′** separat in Fahrerprofilen berücksichtigen. FTP darf nicht stillschweigend mit CP gleichgesetzt werden. | FTP bleibt wichtig für spätere Trainingssteuerung; CP/W′ begrenzen jetzt testweise die mögliche Rennleistung. |
| D-061 | **Testparameter – nicht kalibriert** | R-05-Abstand: min. 1,8 m Zentrumabstand, 0,7 m Zusatz, 0,25 s Reaktionszeit, höchstens 3 m/s² Verzögerung. W′-Wiederauffüllung: einfache lineare Faktorheuristik. | Konkrete Realitäts- und Sportwissenschaftskalibrierung steht aus. |
| D-062 | **Offen** | Physiologische W′-Erholung/CP nach langem Rennen, FTP-Testprotokoll/Trainingszonen, sichere Kurven-/Gefällebremsung, 2D-Positionen und 160 Fahrer. | Vor realistischer Vollrenn- und Trainingssimulation weiterentwickeln. |

Ausführliche Erklärung und Quellen: [physik/R05_ABSTAND_CP_WPRIME.md](physik/R05_ABSTAND_CP_WPRIME.md).


## R-06: gebündelte Schritte – Führungsbremsung, seitliches Überholen, FTP-Diagnostik (03.11.2026)

| ID | Status | Inhalt | Grenzen |
| --- | --- | --- | --- |
| D-063 | **Beschlossen – kleiner Physikprototyp** | Bekannten externen Bremsbefehl eines Vordermanns in die vorausschauende Längsabstandsberechnung einbeziehen. | Keine Vorhersage unbekannter Bremsmanöver und keine Kollisionsfreiheit garantiert. |
| D-064 | **Beschlossen – vorgegebenes Überhol-Testmanöver** | Querverschiebung mit Maximalgeschwindigkeit und Straßenbegrenzung, zweiachsige kontinuierliche Kollisionsprüfung, Überholereignis. | Vorgabe ist extern; noch keine automatische Spurwahl, Lenkwinkel, Kurven-/Haftungsmodell. |
| D-065 | **Beschlossen – Diagnose statt Ermüdungsbehauptung** | Tatsächlich erreichte Kurbelwatt relativ zur separat gespeicherten FTP aggregieren: Mittelwert, Zeit über FTP, Arbeit über FTP. | Keine automatische FTP→CP-Gleichsetzung, kein TSS oder erfundener Trainingseffekt. |

[Technik und verbleibende Entscheidungen](physik/R06_SICHERHEIT_SPUR_FTP.md).


## R-07 · Erste autonome Überholspur (03.11.2026)

| Entscheidung | Status | Inhalt |
| --- | --- | --- |
| D-066 | **Umsetzung des Nutzerauftrags – technischer Prototyp** | Statt externer Spurkommandos wählt F8 bei naher Führung erstmals selbstständig unter zwei vorgeschlagenen Spuren. Er verweigert ein Manöver, wenn beide Prognosen einen Konflikt anzeigen. |
| D-067 | **Technikregel, nicht kalibriert** | Kandidaten ±2 m, Querbewegung 0,8 m/s, Prognose in 0,1-s-Schritten mit konstanter aktueller Geschwindigkeit, maximal 5 s. Keine unbedingte Sicherheitsgarantie. |
| D-068 | **Physikalische Integrität** | Erst nach komplettem Seitenwechsel Angriffswatt, dann CP/W′-Deckel und Abstandsregel vor `advanceMotionStep`. Kein Positions-/Tempobonus, kein externer KI-Dienst. |
| D-069 | **Offen** | Zeitpunkt des Überholens mit Taktik/Teamrolle, Wiedereinscheren, Fahrtechnik/Risiko, dynamische Kurven-/Haftungsphysik und intelligente Feldpositionswahl. |

[Technische Beschreibung R-07](ai/R07_UEBERHOLAGENT.md).


## R-08 – drei gebündelte Simulationsbausteine (03.11.2026)

| Nr. | Status | Entscheidung | Grenze |
| --- | --- | --- | --- |
| D-070 | **Prototyp technisch umgesetzt** | Autonomes Wiedereinscheren zunächst nur **vor die gesamte Heimatspurreihe**, nach belegten Überholungen und 8 m Sicherheitsvorsprung. | Noch kein intelligentes Einscheren in kleine Feldlücken. |
| D-071 | **Prototyp technisch umgesetzt** | Zwei oder mehr Fahrer können zugleich Entscheidungen treffen; geplante Seitenwechsel werden nach stabiler Fahrer-ID reserviert und bei Konflikten Alternativspuren geprüft. | Konstante v-Prognose, keine allgemeine Kollisionsgarantie oder ausgefeiltes Vorfahrtsrecht. |
| D-072 | **Prototyp technisch umgesetzt** | Für neue Szenarien optionale glatte Querbewegung mit expliziten v-/a-Grenzen und vorläufigem Kurven-Haftungsbudget. | Kein vollständiges gekoppeltes Fahrrad-Lenk-, Kurven- und Reifenmodell. |
| D-073 | **Noch offen** | Sichere Rückkehr zwischen Fahrer, echte Kurvendynamik, automatisches Reagieren auf bewegliche Hindernisse, Fahrerfähigkeiten und Teamstrategie. | Erst nach nachgewiesener Gesamtintegration weiterentwickeln. |

[Ausführliche technische Einordnung](ai/R08_WIEDEREINSCHEREN_MULTIAGENT.md).


## D-074 bis D-077: Prioritätswechsel zu echten Rennen (03.11.2026)

| ID | Status | Entscheidung | Abgrenzung |
| --- | --- | --- | --- |
| D-074 | **Vom Nutzer ausdrücklich beschlossen** | Die nächsten Entwicklungsschritte liefern **vollständige Rennsimulationen** statt immer genauerer Kurven-, Lenk- und Überholbewegungen. Zuerst 30 Fahrer/50 km, Mannschaften, Strecken, Taktik, Ergebnisliste; später Skalierung und Kalibrierung. | Die R-01–R-08-Experimente bleiben im Repository, werden jedoch nicht ungefragt weiter vertieft. |
| D-075 | **Beschlossen** | **Physikalische Gleichungen und CP/W′ aus bestehenden Modulen weiterverwenden**; fürs Rennfeld zunächst vereinfachte Abstandsgruppen-/Windschattenberechnung mit klar gekennzeichneten Grenzen, ohne vollständige 2D-Kollision. | Nicht behaupten, dass alle Detailmodule im Rennmodus aktiv wären. |
| D-076 | **Beschlossen als erste Teststufe** | Teams setzen ihre Leitlinie vor dem Start, Fahrer handeln mit begrenzten Wattwünschen eigenständig; Angriffe, Verfolgung, Windschatten, Erholung, Zielsprints erzeugen physikalisch nachvollziehbare Unterschiede. | Noch keine vollständige sportliche-Leiter- oder Trainings-/Transfersimulation; Parameter fiktiv. |
| D-077 | **Vorläufiger Arbeitsplan** | Browser-Worker-Rennen über 50 km, vollständige Zeitrangliste und Rennbericht; identischer Seed ermöglicht Vergleich zweier Leitlinien. Danach sportliches Balancing, Gruppenphysik-Validierung und schrittweise größere Fahrerfelder. | Die fiktiven Ergebniswerte sind nicht gegen echte Profi-Renndaten validiert. |



## Noch offene Fachfrage nach R-11: differenzierter Peloton-Windschatten (03.11.2026)

**Status: zu prüfen, nicht beschlossen.** Der nach D-074 bis D-077
beschlossene vorläufige Gruppenansatz ist weiterhin unverändert im
Rennmodus. Nach der tatsächlich durchgeführten
[R-11-Mehr-Seed-Diagnose](race/R11_MEHRSEED_BALANCING.md)
(maximal 20–24 Abstandsgruppen bei 30 hügeligen Fahrern) zeigt
die **Codeprüfung**, dass der Rennmodus maximal 19 % aerodynamischen
Widerstandsnachlass **nur anhand des direkten Vordermanns** gewährt.
Ein Unterschied zwischen einer kleinen Fluchtgruppe und einer tief
geschützten Position in einem dichten großen Peloton ist noch nicht
vorhanden. Das isolierte R-03-Labormodell mit mehreren Vorderleuten
bleibt vorhanden, ist aber **nicht** Teil des Vollrennmodus.

**Vorgeschlagene Abklärung vor einer neuen Parameter-/Architekturentscheidung:**
lokales Feld-Dichte-/Positionsmodell ohne vollständige 2D-Lenkphysik
als **separate, schaltbare Testvariante** entwerfen, Aerodynamik für
Einzelfahrer, kleine Fluchtgruppe und dichteres Peloton testen,
gegen dasselbe motion-core-/CP/W′-Modell und identische sieben R-11-
Rennen vergleichen. Kein direktes Übernehmen extremer Windkanal-
Referenzfaktoren für 121 Fahrer in ein nur längskoordinatenbasiertes
30er-Modell. Sportlich sinnvolle neue Faktorwerte bleiben **offen**.
Die beschlossene Priorität vollständiger Rennen vor Mikrophysik
wird dadurch **nicht verändert**.


## D-078/D-079 – Experimentierauftrag, keine neue Kalibrierungsentscheidung (03.11.2026)

| ID | Status | Gegenstand | Grenze |
| --- | --- | --- | --- |
| D-078 | **Beschlossen: kontrollierter Umsetzungsschritt** | Das R-10-Windschattenmodell bleibt als **bitidentischer Standard** erhalten. Daneben wird die `formation-experiment`-Variante mit mehreren lokal vorgelagerten Fahrern für sieben identische R-11-Fälle testbar gemacht. Auswirkungen müssen ausschließlich aus unverändertem `advanceMotionStep` und CP/W′ kommen; keine kinematischen Zeit- oder Positionsboni. | Der erfolgreiche technische A/B-Test ist kein Beschluss, die Variante zum Standard zu machen. |
| D-079 | **Offen: fachliche Kalibrierung** | 24-m-Radius, zehn Vorderleute, 34 % erster gewichteter Anteil, 5,5 % weitere gewichtete Beiträge und Rest-Aero-Faktor 0,40 sind **Testheuristiken**, keine bestätigten Profi-Rennwerte. | R-12 hält auf Flachstrecken zwar deutlich mehr Fahrer zusammen, erhöht jedoch in allen sieben Vergleichsrennen den Rückstand des letzten Fahrers. Ein neues offizielles Windschattenmodell oder neue Gesamt-Pelotonarchitektur ist **nicht beschlossen**. |

[R-12-Umsetzung, verifizierte 14 Rennläufe, Vor-/Nachteile](race/R12_FORMATIONSAERODYNAMIK.md).
**Priorität:** echte glaubwürdige Rennverläufe und autonome Taktik
vor Detail-Lenkphysik. Zuerst isoliert lokale Formation, Gruppenführung,
Abgehängten-/Verfolgungsdynamik prüfen; dann Parameterentscheidung.
