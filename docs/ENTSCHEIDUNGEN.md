# Entscheidungen und offene Fragen

**Stand der Entscheidungen: 04.11.2026.** Beschlossen = ausdrücklich festgelegt; Favorit = vielversprechend, noch zu prüfen; Offen = nicht entschieden; Nicht Ziel = bewusst nicht vorgesehen.

## Aktueller verbindlicher Stand – R-23 integriert und Work-Gesamtaudit vorbereitet (04.11.2026)

**Fertig nach `main` gemergt:** PR [#74](https://github.com/Lancester/radsportmanager/pull/74) (Sprint/Jagd), [#76](https://github.com/Lancester/radsportmanager/pull/76) (Klassiker) und [#78](https://github.com/Lancester/radsportmanager/pull/78) (Hügel-KI + generische Angriffe ohne starre 88-%-Sperre). Letzter Code-Merge-Commit `f7333421`; [CI #41904933020](https://github.com/Lancester/radsportmanager/actions/runs/41904933020) **330/330 Tests erfolgreich**, 154 fiktive Fahrer je Profil, **ein Seed 2026**. `legacy`, physikalischer Motion-Core, CP/W′, R-19 und Aero-Kern unverändert.

**Sportliche Referenz (ein Seed, nicht kalibriert):** Lille F149 Sprinter, 8 Sprinter Top10, 26 Fahrer Siegerzeitgruppe, 45 Attacken. Boulogne F001 Klassiker, 35 Attacken statt 108 (19 früh, 0 Mitte, 16 auf späten Rampen), Median +129,70 s statt +81,41 s. Liège F057 Klassiker, 0 Sprinter Top10, 53 Attacken. Hautacam F078 Kletterer, 0 Sprinter Top10, 13 Attacken. Lille, Liège und Hautacam wurden durch PR #78 in allen bisherigen Referenzkennzahlen exakt erhalten. Am 1,1-km-Haut-Pichot sind **zehn Angriffsereignisse** auffällig: Das sind Wattwünsche, nicht zehn bestätigte erfolgreiche Ausreißgruppen; ein explizites 5-km-Checkpoint-/W′-Audit ist in PR #78 ergänzt.

**Produktentscheidung:** PR [#75](https://github.com/Lancester/radsportmanager/pull/75) (manuelle 0–5-Jagdhelferzahl) ist **ohne Merge geschlossen**. Manager gibt die Leitlinie vor, sportliche Leiter bestimmen Helferzahl und Ablösung autonom.

**Nächste Priorität:** **Unabhängiger kritischer Work-Gesamtaudit vor weiteren Renn-KI-/Manager-Features.** Vollständiger Auftrag: [`docs/race/KI_GESAMTAUDIT_WORK_BRIEFING.md`](https://github.com/Lancester/radsportmanager/blob/main/docs/race/KI_GESAMTAUDIT_WORK_BRIEFING.md). Insbesondere übersehene starre Prozentfenster, Taktikprioritäten, 10–30er-Spitzengruppen, große Zeitabstände, tatsächliche Angriffsfolgen, CP/W′-/Windschatteninvarianten, Mehrseed-Stabilität und Android-Laufzeit prüfen. Ältere Aussagen wie „PR #74/#76/#78 ungemergt“ sind historische Journalnotizen, **nicht** der aktuelle Stand. Keine Sport-Realismusabnahme aus nur einem Seed ableiten.

### Aktueller Merge-Status der Renn-KI (keine neue Grundsatzentscheidung)

**Verbindlicher Integrationsstand 04.11.2026:** PR [#74](https://github.com/Lancester/radsportmanager/pull/74) (Sprintteamjagd, realer Helfereinsatz, individueller Zielsprint, bessere Feldkohäsion) **und** PR [#76](https://github.com/Lancester/radsportmanager/pull/76) (Klassiker-KI) sind nacheinander **nach `main` gemergt**. Code-Merge-Commits `568f2341` und `8b478639`. Die *kombinierte* CI [#41890188739](https://github.com/Lancester/radsportmanager/actions/runs/41890188739) war mit **324/324 Tests erfolgreich, 0 Fehler**, inklusive vier 154-Fahrer-Referenzrennen, No-Attack-/30er-, Physik- und Integrationschecks.

**Sportlicher Stand:** Lille, Seed 2026, 5 km vor Ziel **115 Fahrer** in der führenden physischen Gruppe statt zuvor 25; 8 Sprinter Top10, 26 Fahrer in 1-s-verknüpfter Siegerzeitgruppe, 2 Fluchten eingeholt, 1.425 s CP-nahe reale Feldjagd, 22 individuelle Sprintantritte. **Der konservative 30er-Massenprint-Proxy ist weiterhin false**, und aus einem Seed keine Massensprint-Häufigkeit ableiten. Liège: Klassiker F057 Sieger, **0 Sprinter in Top10**, gezielte Rampentempo-/Positionierungsarbeit; mögliche größere Zeitabstände später statistisch kalibrieren. Boulogne und Hautacam gegenüber ihrer Referenz unverändert. **Keine Änderungen** an `legacy`-Default, CP/W′, R-19, Motion-Core oder Aero. **PR #75 (Managerwahl 0–5 Jagdhelfer) bleibt offen und ungemergt.** Nächstes getrenntes KI-Thema: hügelige Etappen (Boulogne 108 Attacken im Seed 2026), danach PR #75 und Multi-Seed-Kalibrierung.

**Wichtig bei älteren Notizen:** Frühere, weiter unten stehende Aussagen wie „PR #74/#76 noch offen“ beschreiben ihren historischen damaligen Zustand und sind **seit dieser Integration überholt**. Die KI wurde technisch integriert, **nicht** als wissenschaftlich/mehrseed-statistisch vollständig kalibriert deklariert.

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


## D-080/D-081 – Formationswindschatten und natürliche Rückstände (03.11.2026)

| ID | Status | Entscheidung | Grenze |
| --- | --- | --- | --- |
| D-080 | **Vom Nutzer ausdrücklich beschlossen – R-13** | Das zuvor schaltbar verglichene Formationswindschattenmodell wird **Standard für neue Rennläufe**, auch auf der Rennseite. Einzelne Fahrer ohne Windschutz dürfen gegenüber einem geschützten Feld erheblich zurückfallen. Keine künstliche Aufhol- oder Ergebnisangleichung. | Die konkrete 1D-Heuristik ersetzt nicht jede physikalische Eigenschaft eines echten mehrspurigen Pelotons; empirische Vollkalibrierung ist **keine Voraussetzung für die Implementierung**. |
| D-081 | **Beschlossen: reproduzierbare Rückfalloption** | `RaceInput.aeroModel` ohne Angabe bzw. `'formation'` nutzt neuen Standard. `'formation-experiment'` bleibt aus Kompatibilität als Alias; `'legacy'` bewahrt die alte R-10-/R-11-Referenz. Gleiche Längspositionen zählen nicht als voreinander fahrende Personen, der mechanische CP/W′-Kern bleibt gleich. | D-074 bis D-079 bleiben als historische Begründung/Testergebnisse erhalten; dies ist eine **neue**, ausdrückliche Entscheidung. Offene Führungs-/Verfolgungsmechanik bleibt Issue #42. |

Ausführliche [R-13-Umsetzung und Abnahme](race/R13_FORMATIONSWINDSCHATTEN_STANDARD.md).


## D-082 bis D-084: autonome Teamführung und situative Verfolgung (04.11.2026)

| Entscheidung | Status | Umsetzung und Grenzen |
| --- | --- | --- |
| D-082 – Helferrotation | **Technischer Prototyp umgesetzt** | Je Team höchstens ein geeigneter Helfer zurzeit für begrenzte Führungsarbeit, geschützter Fahrer Kapitän oder bei Sprintstrategie Sprinter; körperliche Nähe und W′-Reserve erforderlich. Zeitbasierte 90-s-Rotation. Die Entscheidung fordert ausschließlich Kurbelwatt, noch kein belegter physischer Führungsspurwechsel. |
| D-083 – koordinierte Fluchtverfolgung | **Technischer Prototyp umgesetzt** | Nur bestätigte kleine Spitzengruppe (1–6) mit 75–400 m Vorsprung vor einem substanziellen Feld und eigenem Teamziel in diesem Feld. Keine Jagd auf die eigene Flucht oder auf isoliert abgehängte Solofahrer; nur geeignete Helfer mit W′-Reserve werden eingesetzt. Physischer Erfolg ist offen, **keine** Aufholgarantie. |
| D-084 – physikalische Integrität und nächste Priorität | **Beschlossen bzw. beibehalten** | Der R-13-Formationswindschatten bleibt Standard; Leistungsanforderungen passieren unverändert CP/W′ und `advanceMotionStep`. Keine Ergebnis-, Positions-, Speed- oder Energieboni. Nächste Ausbaustufe: überprüfbare tatsächlich gefahrene Helfer-Führungspositionen, intelligente Teamtaktik und langfristig Sportdirektoren; keine Detail-Lenk-Mikrophysik. |

Methodik, reale Runner-Abnahmen und Grenzen:
[R14_TEAM_FUEHRUNG_VERFOLGUNG.md](race/R14_TEAM_FUEHRUNG_VERFOLGUNG.md).


## D-085 bis D-087 – Rennengine strikt getrennt; Mehrhelfer und Renn-KI (04.11.2026)

| ID | Status | Entscheidung | Abgrenzung |
| --- | --- | --- | --- |
| D-085 | **Nutzergrenze verbindlich** | R-15 und R-16 sowie folgende R-Engine-Schritte entwickeln allein die autonome **Rennsimulation eines einzelnen Rennens**. | Rundfahrten, Kalender, Verträge, Trainingsplanung, Transfers, Team-/Sportdirektorenverwaltung und Karrieremodus werden hier ausdrücklich **nicht** umgesetzt. |
| D-086 | **Technisch implementiert als R-15** | Statt maximal eines Helfers kann ein Team bei passender Lage mehrere bis zu fünf geeignete Helfer einsetzen, mit eigener Führungs-/Unterstützeraufgabe, Frontpositionsprüfung und CP/W′-Belastungsgrenzen. | Auftragszuweisung ist keine unsichtbare Positionsveränderung und kein Beweis einer vollständigen 2D-Staffelfahrt. |
| D-087 | **Technisch implementiert als R-16** | Flucht-/Verfolgungs-/Angriffsentscheidungen anhand gemessener Gruppengröße, Abstand, Reststrecke, Relativtempo, Rennposition, Strategie und W′; opportunistische statt starrer Angriffsfenster. | Kein Ergebnisbonus, keine Einholgarantie. Bestehende `tacticModel='r14'`-Variante bleibt für A/B reproduzierbar; neuer Standard `r15-r16`. |

[Detailmodell und Prüfkonzept](race/R15_R16_MEHRHELFER_RENNINTELLIGENZ.md).


## D-088 bis D-093 – verbindlicher Abschlussfahrplan der EINZELRENN-Rennengine (04.11.2026)

| ID | Status | Verbindliche Entscheidung | Grenze |
| --- | --- | --- | --- |
| D-088 | **Nutzerbeschluss** | R-17 bis R-21 als **ein gemeinsames Umsetzungspaket** in GitHub und nicht nach jeder R-Nummer separat abstimmen. | R-22 und R-23 sind ausdrücklich **danach** und nicht automatisch im Funktionspaket enthalten. |
| D-089 | **Technisch implementiert (R-17)** | Frontposition nur vor dem eigenen Kapitän/Sprinter und in tatsächlicher Gruppenfrontnähe anerkennen; Helferschichten über Zeit weiterführen und bei schlechter Position oder zu wenig W′ ablösen. | Keine 2D-Spur und kein künstliches Nach-vorne-Setzen. |
| D-090 | **Technisch implementiert (R-18)** | Aktuelle und über 120 s fortgeschriebene Fluchtlücke bestimmt zusammen mit Reststrecke und Teaminteressen die Jagd. | Prognose keine Einholgarantie. |
| D-091 | **Technisch implementiert als fiktive R-19-Heuristik** | Bilanzierte Kohlenhydratverfügbarkeit und Verpflegung sowie zusätzliche Langzeit-Ermüdung als reine Begrenzung der **Wattanforderung**; A/B `enduranceModel='off'`. | Kein neu kalibrierter physiologischer CP/W′-Kern; nie fiktive mechanische Energie. |
| D-092 | **Technisch implementiert (R-20)** | Fahrertypen durch Masse, CP/W′ und CdA; Wind und Untergrund nur via Luft-/Rollwiderstand desselben physikalischen Integrators. | Keine Wettersieg-Boni, keine 2D-Windkante/Kopfsteinpflaster-Mikrophysik. |
| D-093 | **Technisch implementiert, sportliche Kalibrierung offen (R-21)** | Feld bis 210 Fahrer, Testfelder 22 Teams × 7 Fahrer und vollständige **170–240-km-Einzelrennen**; reproduzierbare CPU-/Gruppen-/Energie-/Eventmessungen. | 154 × 200-km technisch erfolgreich ist **nicht** gleich sportlich realistisch. Erst R-22 massenhaft validieren/kalibrieren; R-23 anschließend Freigabe bewerten. |

**Nutzergrenze erneut verbindlich:** Profiklassiker,
Flach-/Hügel-/Bergrennen **als eigenständige
Einzelrennen** gehören in Rennengine-Tests;
Rundfahrten mit Etappen-/Gesamtwertung,
Karrieremodus, Sponsoren, Verträge, Transfers,
Trainingskalender und Mitarbeiterverwaltung
gehören NICHT in die Rennengine.

[Roadmap und spätere R-22/R-23-Gates](race/ROADMAP_R17_R23_VERBINDLICH.md).
[Technische R-17–R-21-Umsetzung](race/R17_R21_ENGINE_ABSCHLUSS.md).


## D-094 bis D-097 – R-22A/B/C und verkürzte Monte-Carlo-Maske (04.11.2026)

| ID | Entscheidung | Grenze |
| --- | --- | --- |
| D-094 – historische Streckenanker | Vier belegte 2025-Rennstrecken mit echten Distanzen und klassifizierten Anstiegen statt willkürlicher 6×28-km-Blöcke; Gesamthöhenmeter bei drei Strecken als Makro-Anker. | **Keine echte GPX-/DEM-Rekonstruktion**: gekennzeichnete Modellübergänge und keine Behauptung exakter Steigungskurven. |
| D-095 – wissenschaftlich basierte Profitypen | CP, W′, Gewicht und CdA aus einer publizierten 144er-Profikohorten-Auswertung für stabile **fiktive** Fahrer mit expliziter Streuung. | Individuelle Profidaten nicht verfügbar; Klassiker/FTP/Verpflegungsannahmen separat und nicht als gemessen deklarieren. |
| D-096 – rennabhängige Siebenerteams | 22 Teams mit Sprinter-, Berg-/GC-, Klassiker-, Ausreißer- und Allrounder-Fokus; der Anteil wird von Flach/Hügel/Klassiker/Berg abhängig gesetzt. | Fiktive Kader und Rennziele, **keine echten historischen Starterlisten** und keine Karrieretransfers. |
| D-097 – schlanke manuelle Maske | Workflow verlangt nur Referenzszenario, Zahl der Seeds, optionalen A/B-Vergleich und Start-Seed. Rennlänge und **154 Starter** automatisch. Vollständiges Quellen-/Kader-/Streckenmanifest zum Bericht. | Ausschließlich manuell (`workflow_dispatch`), alte CLI-Legacy-Tests bleiben; keine automatische Monte-Carlo-Zeitplanung. |

**Technische Vollrennen-Abnahme:** vier
Referenz-Szenarien 2025 mit je 154
Fahrern und 616 klassifizierten Zielankünften,
[GitHub Actions #41768768694](https://github.com/Lancester/radsportmanager/actions/runs/41768768694)
vollständig erfolgreich. Die
teils hohen Gruppen-/Zielabstände
und Sieger nach Fahrertyp bleiben
**offene R-22-Kalibrierungsbefunde**,
keine fertige Profi-Realismusfreigabe.
R-23 nicht begonnen.
[Gesamtdokumentation](race/R22ABC_REFERENZSTRECKEN_PROFIFELDER.md).


## R-22: weiterer experimenteller Peloton-KI-Vergleich (04.11.2026)

**Status: technischer Versuch, KEINE Änderung einer Grundsatzentscheidung.** Der dokumentierte Nutzerhinweis betrifft den plausiblen Zusammenhalt eines im Windschatten gleichmäßig fahrenden Hauptfeldes: Nicht jeder Fahrer soll ohne eigene Attacke oder physisch ausreichenden Leistungsunterschied abreißen.

- **Beschlossen und unverändert:** unveränderter Bewegungsintegrator, Aero-Standard (Formation), CP/W′, R-19; keine künstlichen Geschwindigkeits-, Positions-, Energie- oder Einholboni; keine Karriere, keine automatische große Monte-Carlo-Serie. Das aktuelle Standard-`groupRidingModel` bleibt `legacy`.
- **Experimentell umgesetzt:** Zusätzlicher, ausdrücklich zu wählender Modus `stable-pack`. Die erwiesenermaßen funktionierende gruppenbewusste Mitfahr-KI bleibt für das normale Peloton erhalten. Ein lokaler physischer Anschluss-/Beschleunigungsregler wird ausschließlich bei Verfolgern und Kleingruppen geprüft.
- **Gemessen, noch nicht kalibriert:** [262 erfolgreiche Tests](https://github.com/Lancester/radsportmanager/actions/runs/41789070378), 154 Fahrer ohne Angriffe auf 20 km vollständig in einer Zielgruppe. Lille 184,9 km/Seed 2026: größte Zielgruppe 86, Rückstand 15,77 s, 118 binnen 60 s; dagegen 49 Attacken, 16 maximalen Abstandsgruppen.
- **Offene Entscheidung:** Änderung der Standard-KI oder der Angriffs-/Verfolgungsparameter ist **nicht** beschlossen. Erst weitere manuelle A/B-Prüfung auf mehreren Seeds und unabhängigen Streckenprofilen samt Energie-/W′-/Windschnitt-/Zielgruppenbefunden. R-22 nicht fertig, R-23 gesperrt.

[Technische und methodische Einzelheiten](race/R22_STABILES_PELOTON.md).


### R-22 Integrationsstatus nach PR #63 (04.11.2026)

**Nur technischer experimenteller Modus in main, keine neue Grundsatzentscheidung:** `groupRidingModel:'stable-pack'` ist nach 262 grünen Tests explizit auswählbar. `legacy` bleibt Standard; D-074 bis D-097 und die bestehende Physik bleiben gültig. Der Modus ist nicht als realistisch kalibrierte neue Standard-KI beschlossen. R-22 bleibt offen und R-23 ist nicht freigegeben. [PR #63](https://github.com/Lancester/radsportmanager/pull/63), [Ergebnisse](race/R22_STABILES_PELOTON.md).


## D-098 bis D-101 – Profilweises Weiterentwickeln vor großer Validierung (04.11.2026)

Der Nutzer hat den ersten größeren Mehrseed-Plan ausdrücklich **zurückgestellt**: keine 36/60 Rennen als Einstieg. Es werden zunächst die **bereits vorhandenen vier Etappenprofile** in kleinen Einzelprüfungen durch den Assistenten verglichen und die KI schrittweise verbessert. Erst **am Ende der KI-Kalibrierung** folgt die große statistische Validierung.

| ID | Status | Vereinbartes Vorgehen | Grenze |
| --- | --- | --- | --- |
| D-098 | **Nutzerbeschluss** | `stable-pack` dient als Ausgangsbasis für weitere **gezielte** KI-Verbesserungen, nicht den Rennsimulator neu schreiben. | Der standardmäßig aktive Modus bleibt `legacy` bis zur gesonderten Abnahme. |
| D-099 | **Nutzerbeschluss** | Bereits vorhandene Referenzstrecken **Lille (flach), Boulogne (hügelig), Lüttich (Klassiker), Hautacam (Berg)** verwenden. Zunächst pro Profil **ein** identischer Seed und **nur `stable-pack`**, ohne neue Strecken oder großes A/B-/Seedraster. Der Assistent führt die kleinen Tests im normalen GitHub-PR-Testlauf selbst aus. | Vier Einzelrennen, 154 Fahrer je Strecke. Die veröffentlichten Steigungen/Streckenanker enthalten modellierte Übergänge, keine exakten GPX-Daten. |
| D-100 | **Nutzerbeschluss** | Nach jedem kleinen Profilvergleich Ursachen für auffällige Zielabstände, Feldzerfall, Attacken, Jagdführungswechsel oder Berg-/Sprinterverhalten bestimmen und gezielt **eine** KI-Ursache verbessern. Bestehende Physik und normale Mitfahrregelung bewahren. | Keine erfundenen Zeiten, Positionskorrekturen, Energiegutschriften oder unbegründeten Physikparameter-Änderungen. Test-Plausi ist nicht Realitätskalibrierung. |
| D-101 | **Nutzerbeschluss** | Größere Mehrseed-/Monte-Carlo-Validierung **erst zum Abschluss**, wenn die grundlegenden Verhaltensprobleme der vier Profile behoben sind. | Große Reihen nur bewusst manuell und begrenzt via GitHub Actions, keine automatisch gestarteten 36/60-Rennen-Workflows. R-22 offen, R-23 nicht freigegeben. |

Konkreter Ablauf: [R22_KLEINE_PROFILTESTS.md](race/R22_KLEINE_PROFILTESTS.md). Der erste kleine Vergleich läuft über `scripts/r22-profile-smoke.mjs` und `tests/r22-profile-smoke.test.mjs` direkt in der PR-CI, mit festen Eingaben `all / seed 2026`. Der frühere 36-/60-Rennen-Matrixvorschlag wurde **aus dem Branch entfernt**, nicht gestartet und **nicht beschlossen**.


## D-102 – Bergphysik zuerst prüfen, dann schrittweise Kletter-KI weiterentwickeln (04.11.2026)

**Expliziter Nutzerbeschluss:** Vor weiteren Berg-KI-Korrekturen die physikalischen Steigungs-, Masse-, Roll-/Luftwiderstands-, Windschatten- und CP/W′-Zusammenhänge anhand unabhängiger Modell- und Dynamiktests prüfen. Nur wenn sie korrekt wirken, die **experimentelle** `stable-pack`-KI für Kletterer gezielt anpassen. Der Assistent darf mehrere kleine KI-Iterationen einschließlich vorhandener vier Profilrennen ohne weitere Rückfragen durchführen, dokumentiert aber Ergebnisse, verworfene Varianten und Grenzen. Große Mehrseed-Validierung bleibt wie in D-101 **auf die Schlussphase verschoben**.

**Technischer Zwischenbefund:** Die unabhängige 13,5-km-/7,8%-Gegenprobe in [R22_BERGPHYSIK_UND_KLETTER_KI.md](race/R22_BERGPHYSIK_UND_KLETTER_KI.md) bestätigt im gemeinsamen Bewegungskern den erwarteten Bergvorteil leichter Kletterer und bessere Leistung von GC-Fahrern; [CI #41797896614](https://github.com/Lancester/radsportmanager/actions/runs/41797896614) 268/268. Der Kern bleibt unverändert; die untersuchte Ursache ist überwiegend die an einen Gruppenpacer gebundene KI-Leistungsanforderung. Kein neuer Default, keine Ergebnis- oder Positionsboni. R-22 weiter offen, R-23 nicht freigegeben.


## D-103 – Berggruppen nicht künstlich zusammenschieben; KI transparent dokumentieren (04.11.2026)

**Nutzerhinweis und daraus abgeleitete fachliche Leitlinie:** Bei wirklich schweren Schlussanstiegen sind viele kleine Gruppen und große Zeitabstände zu erwarten. Frühere pauschale Formulierungen, die maximal 36 physische Abstandsgruppen auf Hautacam ohne weitere Analyse als unrealistisch bewerteten, werden **nicht** als künstliches Reduktionsziel verwendet. Für die spätere Prüfung werden schlüsselanstiegsbezogene **Gruppengrößen, tatsächliche Lücken, Zeitpunkt des Zerfalls, Leistungs-/W′-Verlauf und Zielabstände** ausgewertet. Die interne 42-m-Gruppenzählung und die 1-s-Zielzeitgruppen sind getrennte **Simulationsproxies**, keine echten UCI-Daten. Dokumentierte Vergleichsetappen 2025 im neuen [Rennfahr-KI-Gesamtüberblick](race/RENNFAHR_KI_GESAMTUEBERSICHT.md).

**Nutzerwunsch an Dokumentation:** Eine verständliche, aktuelle und mit den tatsächlichen Quellmodulen abgeglichene Gesamtübersicht sämtlicher implementierter **Rennfahr-KI-Entscheidungen** als dauerhaftes Dokument führen. Trennung zwischen geprüfter Bewegung/Physik, vorläufigen Modellparametern und unkalibrierter taktischer KI; nie Funktionen als umgesetzt beschreiben, die nur für einen anderen Testmodus oder spätere Karrieremodule geplant sind. `legacy` bleibt Standard, `stable-pack` Entwicklungsbasis. Zuerst Klassiker-KI weiterentwickeln, große Multi-Seed-Validierung wie D-101 nur ganz am Schluss.


## D-104 – Vorab-Favoritenranking pro Fahrertyp als verpflichtende KI-Diagnose (04.11.2026)

**Neuer Nutzerbeschluss:** Bei jeder erneuten kleinen Referenzrenn-Berechnung den vor Rennstart **objektiv leistungsstärksten Fahrer** für Kletterer, Klassiker, Sprinter, Zeitfahrer und Allrounder sowie seine tatsächliche Zielplatzierung/Rückstand dokumentieren. Zusätzlich das gesamte Fahrerfeld anhand eines zum jeweiligen Streckenprofil passenden, **ergebnisunabhängig** berechneten Leistungsindexes bewerten: Top-3-Vorabfavoriten, ihre Ziellagen und Stärkerang des Rennsiegers. Die reine Diagnose in `src/engine/race/rider-strength-audit.ts` verändert **weder** Rennphysik **noch** KI-Entscheidung. Stärkenindizes sind bewusst vereinfachte CP-/W′-/W/kg-/CdA-/Sprintfähigkeits-Proxies, **keine** empirischen Siegwahrscheinlichkeiten oder zwanghaft zu erfüllenden Endränge. Vier unveränderte Referenzrennen, je Seed 2026; kein automatischer Großlauf. [Methodik](race/R22_FAHRERSTAERKE_FAVORITEN_AUSWERTUNG.md).


## D-106 – Selektive Klassiker-KI nach Technikabnahme freigeben, Lille-Sprinter physisch/strategisch diagnostizieren (04.11.2026)

**Expliziter Nutzerauftrag:** Zuvor offenen selektiven Team-Puncheur-Versuch **freigeben** und sofort **Lille-Favorit F023** auswerten. Wegen fehlender GitHub-Actions-Auslösung beim ursprünglichen PR #70 wurde dessen Code einschließlich Korrektur des veralteten Helfer-Tests im neuen [PR #71](https://github.com/Lancester/radsportmanager/pull/71) mit `R22-LILLE-SPRINTER-AUDIT` geprüft und nach **281/281 grünen Regressionstests** in `main` übernommen; #70 als ersetzt geschlossen. Diese Freigabe betrifft weiterhin nur das **experimentelle** `stable-pack`-Modell und ist keine Behauptung vollständiger Sportrealismus-Abnahme. Liège: Sprintersieg, 68 registrierte Attacken, stärkster Klassiker F003 nur Platz 122 – weitere selektive KI-Verbesserung nötig.

**Neuer konkreter Lille-Befund statt Vermutung:** F023 besitzt sehr hohe CP/Sprintspezialisierung, beendet das Rennen aber auf Platz 150 (+267,50 s) mit noch **~91 % W′-Reserve**. Er fährt bereits ab Rennbeginn weit hinten, ist bei km 100 noch in einer großen Gruppe, verliert bis km 120 aber den Anschluss an das Vorderfeld und erreicht das Ziel weit abgehängt. Seine Mannschaft agiert bei der Jagd, aber ohne frühzeitiges strategisches Aufrücken/Schützen des Sprintkapitäns. Daraus folgt als neuer isolierter KI-Arbeitsschritt **physisch echte frühe Positions-/Teamaufträge für Sprinter** statt bloßer Leistungsboni oder pauschaler Feldzusammenhaltung. Genaues Ergebnis, Checkpoints, Teamereignisse und Grenzen in [R22_LILLE_SPRINTER_DIAGNOSE.md](race/R22_LILLE_SPRINTER_DIAGNOSE.md). Keine Änderung der wiederholt geprüften Grundphysik; Vierprofileinzeltests und No-Attack-Kontrolltest, große Mehrseedvalidierung nur am Ende. R-22 offen.


## D-107 – Sprintteams schützen ihre Sprinter früh durch echte Gruppenwatt statt Nachholen kurz vor Ziel (04.11.2026)

**Explizite Nutzerfreigabe:** Auf Lille-Befund (stärkster Sprinter F023 bisher Rang 150 trotz ~91 % W′-Reserve) zielgerichtet eine eigene frühe Peloton-Positionierungs-KI implementieren. Der bloße späte Sprintzug reicht nicht aus, wenn der Sprinter schon viele Kilometer vorher den Anschluss verliert. Im `stable-pack`-Experiment werden körperlich geeignete Sprinter auf langen weitgehend flachen Etappen **rechtzeitig physisch** an die vorderen Teile einer realen großen Abstandsgruppe geführt, durch individuell begrenzte **Wattanforderungen**, mit begrenzter realer Begleitung durch **höchstens einen** nahen Helfer. Nicht in allen Profilen und nicht durch Setzen von positionM, Zeit oder Geschwindigkeit. `legacy`, Aero, CP/W′, R-19 und Bewegungskern bleiben unangetastet. [Reale CI-Vergleichszahlen (Lille 150→41, drei andere Referenzprofile unverändert)](race/R22_FRUEHE_SPRINTERPOSITIONIERUNG.md), [PR #72](https://github.com/Lancester/radsportmanager/pull/72). Ziel nach erfolgreichem finalem CI in `main` integrieren, danach gesondert die Feldjagd bis zum Sprint verbessern. Keine großen Mehrseed-Kampagnen, R-22 bleibt offen.

## R-22 – technische Jagdführungsiteration, ohne neue Grundsatzentscheidung (04.11.2026)
**Keine Beschlussänderung.** Der dokumentierte Nutzerwunsch nach längeren echten Nachführphasen wird innerhalb des experimentellen `stable-pack` auf langen flachen Rennen geprüft: ein gemeinsamer, tatsächlich fahrender Jagdführender; andere Teams unterstützen im Windschatten statt zehnsekündlich neue Führungsspitzen zu schaffen. Nur Wattaufträge und regelbasierte Auswahl, keine Änderungen an Formations-Aero, CP/W′, R-19, Position, Tempo oder Zielzeit. PR #74 bleibt ungemergt bis zum konkreten Vierprofil-/No-Attack-Vergleich; PR #75 (Manager 0–5 Jagdhelfer) separat; `legacy` Standard und D-098–D-107 unverändert. Vorheriger CI-Befund: [#41839310989](https://github.com/Lancester/radsportmanager/actions/runs/41839310989), 309/309, aber nur 102 s längste physische Jagdfront. Neue Testergebnisse müssen nachgetragen werden.

### R-22 – verifizierte technische Iteration der experimentellen Sprintteamjagd (04.11.2026)
Keine neue Grundsatzentscheidung. Die globale Führungskoordination aus PR #74 hat mit [CI #41854711585](https://github.com/Lancester/radsportmanager/actions/runs/41854711585) **310/310** technische Tests bestanden. Ein Seed, Lille: physische Front-Jagdphase 102→634 s, Hauptfeld-Führungswechsel 203→187, aber F023 auf Rang 11 statt 4 und noch keine verausgabten Helfer. Der physische Frontdiagnosewert ist nicht identisch mit *kontinuierlicher CP-naher tatsächlicher Führungswattarbeit des persönlich beauftragten* Leaders. Die sportliche Freigabe bleibt offen. D-098 bis D-107, `legacy` als Standard, langsame Vierprofil-Validierung, Physikstabilität sowie getrennte Manager-Option PR #75 bleiben unangetastet. Details [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 9.

### R-22 – taktische Klarstellung zu kurzen Führungswechseln (04.11.2026)
**Explizite Nutzerpräzisierung; keine Überschreibung bisheriger Grundsatzentscheidungen:** Mehrere Helfer dürfen ein konstantes Jagdtempo durch abwechselnde kurze, auch ca. 10-s-lange **tatsächliche** Führungen sicherstellen, sofern jeder physisch an die Spitze kommt und echte Antriebsleistung erbringt; ebenso bleiben lange Einzel-Führungsphasen und späteres bewusstes Zurückfallen möglich. Nicht als reale Rotation zählen zehnsekündig wechselnde Aufträge unter Fahrern weit hinter der Feldfront. Nur in PR #74 als physisch bereits vollzogene Kurzrotation nach Aufrücken implementiert, *keine* vollständig autonome Zweier-Staffel. Bestehende Entscheidungen zu Manager 0–5 Jagdhelfern (eigener PR #75), `legacy`-Default, Physik, R-19 und Diagnostik bleiben unangetastet. [Testlauf #41861080773](https://github.com/Lancester/radsportmanager/actions/runs/41861080773) 316/316, der Massensprint-Proxy für Lille weiterhin false (25 in Siegergruppe, 1 Sprinter in Top 10). Siehe [R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md), Abschnitt 14.

### R-22 – expliziter Nutzerauftrag zur individuellen Sprintwahl (04.11.2026)
**Präzisierung/Erweiterung:** Start des Zielsprints ist *kein* für alle Fahrer fest vorgegebener Ort (insbesondere nicht alle bei 400 m). Der Sprinter entscheidet situationsbezogen anhand eigener Früh-/Spätneigung, Wind, tatsächlichem Windschatten und realer Rennposition, wann er in den Wind geht. Separate individuelle **Sprint-Peak-Watt** und **zeitlich haltbare Sprintleistung** sollen den verfügbaren Kurzeinsatz abbilden, ohne CP/W′-Bilanz, R-19, Bewegung/Zeiten oder physikalische Aerodynamik zu umgehen. In PR #74 implementiert als neue optionale Fahrerwerte `sprintLaunchPreference`, `sprintPeakPowerW`, `sprintDecayTimeS` und rein wattbasierter `final-sprint.ts`-Regler. **Keine Ergebnisvorgabe oder künstlicher Sprintersieg;** Massensprintwahrscheinlichkeit soll sich später aus Rennen und Seeds ergeben, statt fest erzwingbar zu sein. Erst vier Referenzstrecken mit gleichen 154 fiktiven Fahrern/Seed2026 prüfen, insbesondere **kein Einfluss** auf Berg-/Klassiker-/Hügeletappe. Alte 250-m-Regel außerhalb Opt-in unverändert. GitHub CI [#41864359250](https://github.com/Lancester/radsportmanager/actions/runs/41864359250) noch queued; keine Resultate behaupten. [Detail Abschnitt 16](race/R22_SPRINTTEAM_JAGD_UND_UEBERGABE.md).

### R-22 – Prüfergebnis, keine neue Grundsatzentscheidung (04.11.2026)
**Neuer realer CI-Lauf der individuellen Final-Sprint-KI:** [Actions #41864359250](https://github.com/Lancester/radsportmanager/actions/runs/41864359250) mit **321/322 bestandenen Tests**. Ein neuer, fachlich inkonsistenter Unit-Testfall nutzte `groupSize=1` bei `rankInGroup=14`; die KI lehnte das korrekt mit `RangeError` ab. Testdaten auf `rankInGroup=1` korrigiert, Codefix `f678a9d`; [vollständiger Wiederholungslauf #41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) bei Dokumentationsstand **noch queued**, also **noch nicht grün**.
Die bereits vollständig ausgeführten 4 Rennprofile (154 Fahrer, Seed 2026) zeigen für Lille **8 Sprinterspezialisten in Top 10**, Sieger **Sprinter F009**, zuvor bester Sprintfavorit **F023 Platz 2 (+0,19 s)** statt Platz 20; **22 individuelle Sprintstarts**, Top-10-Sprinter z.B. bei 192,4/232,4/266,6/318,2/351,5 m, tatsächlich anliegende Spitzenwatt der Top-10-Sprinter ca. 1.239–1.381 W. **24 Fahrer in Siegerzeitgruppe**, darum vorläufiger konservativer Proxy `massSprintProxy=false` trotz 8 Sprintern in den Top 10; die 30er-Schwelle bedarf fachlicher Überprüfung, ohne sie nachträglich für diesen Lauf zu verschieben. **Boulogne, Liège und Hautacam unverändert**, jeweils 0 individuelle Sprintstarts. Ein positiver Sportbefund aus einem Seed ist **keine Wahrscheinlichkeit oder Gesamtfreigabe**. Keine Änderung am Bewegungskern, CP/W′, R-19, an `main`, `legacy` oder separatem PR #75; PR #74 weiterhin nicht mergen.

### R-22 Sprint-Finaletest abgeschlossen, noch kein Merge-Beschluss (04.11.2026)
**Verifizierter Abschluss des isolierten Sprint-KI-Arbeitsschritts (04.11.2026):** [Actions #41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) **322/322 Tests erfolgreich, 0 Fehler**. Code-Commit `f678a9d` korrigierte ausschließlich den unmöglichen Testzustand (Einzelgruppe, Rang 14 → Rang 1); kein Eingriff in das Sprintmodell. Lille (154 Fahrer, Seed 2026): **22 reale individuelle Sprintantritte**, **8 Sprinterspezialisten Top 10**, Sieger F009 (Sprinter), stärkster F023 **2. Platz +0,19 s** (vorher Platz 20), **24 Fahrer Siegerzeitgruppe**. Top10-Sprintstarts unterschiedlich, z.B. 192/232/267/286/318/352 m, reale Spitzenwatt ca. 1.239–1.381 W. Boulogne, Liège, Hautacam numerisch unverändert und jeweils 0 individuelle Sprintstarts. **Das isolierte Feature ist technisch abgeschlossen**, `main` nicht verändert. **Gesamt-R-22 sportlich offen**, weil der konservative `massSprintProxy=false` wegen 24 statt mindestens 30 Fahrern in der Siegerzeitgruppe bleibt (nicht nachträglich am erfolgreichen Ergebnis ausrichten); Liège hat weiterhin 6 Sprinter in Top10 und bedarf eigener Klassiker-KI-Optimierung. PR #74 offen und *nicht* mergen; PR #75 separat. Ein einzelner Seed ist keine Massensprint-Häufigkeitskalibrierung.

### R-22 – technische Klassiker-Iteration, ohne neue Nutzerentscheidung (04.11.2026)
**Klassiker-KI, erster experimenteller Vierprofil-Erfolg (04.11.2026):** Getrennte [Entwurfs-PR #76](https://github.com/Lancester/radsportmanager/pull/76), Code c57e01d + Testaudit 815f16c, basiert auf dem noch offenen PR #74, **nicht auf main gemergt**. Neu ist src/engine/race/classics-racecraft.ts: (1) vor den späten Schlüsselrampen physisch mit eigener CP-naher Antriebsarbeit in DER ECHTEN Abstandsgruppe aufrücken, statt Klassikerspezialisten als weit zurückliegende Helfer zu belassen; (2) an ausgewählten steilen Schlussrampen EINEN nach aktueller körperlicher Stärke geeigneten vorderen Klassikerfahrer pro physischer Gruppe moderat oberhalb CP länger Tempo machen lassen. Beide Entscheidungen sind reine begrenzte Wattanfragen; jeder Fahrer bleibt an W′, R-19, Masse/Steigung/Aero, realem Abstand und Bewegungskern gebunden. Die alte selektive einzelne 180-s-Attacke bleibt erhalten, falls sportlich gerechtfertigt; kein Klassikersieg/Positionssprung/Siegbonus programmiert. Regel gilt nur für lange rampenreiche Klassiker im experimentellen stable-pack; **legacy-Standard sowie Sprint-/Bergmodelle unangetastet**.
**Bestätigte CI [#41870445572](https://github.com/Lancester/radsportmanager/actions/runs/41870445572), 324/324 Tests grün, 0 Fehler**, darunter 154-Fahrer-Lille/Boulogne/Liège/Hautacam mit genau Seed 2026, 30er und No-Attack-Regression. Gegenüber verifizierter vorheriger Basis [#41866705161](https://github.com/Lancester/radsportmanager/actions/runs/41866705161) bleiben Lille, Boulogne und Hautacam in **allen bisherigen Ergebnisfeldern** exakt unverändert (neue Diagnosefelder und Laufzeit ausgenommen). Liège: zuvor 6 Sprinter unter Top 10, Sprinter F114 Sieger, stärkster Klassiker F003 Rang 122, drittstärkster Klassiker F049 Rang 107, 24 Fahrer Siegerzeitgruppe → **0 Sprinter Top10**, Sieger Klassikerspezialist **F057**, **F003 Rang 2 (+0,73 s), F049 Rang 3 (+0,78 s)**, **3 Fahrer in Siegerzeitgruppe**. Tatsächlich angefordert: **5.878 Fahrer-Sekunden Positionsarbeit**, **487 Fahrer-Sekunden selektives Rampentempo** von F003 und F049; separate klassische Rampenattacken 45→39, alle energetisch/physikalisch begrenzt. Der mediane Zielrückstand in Liège wächst allerdings von **265,01 s auf 667,12 s** – fachlich noch zu bewerten, nicht als vollständig kalibrierten Realismus ausgeben. **Ein Seed ist kein Beleg realistischer Siegwahrscheinlichkeiten**; PR #76 als Draft, keine Mergefreigabe. Bestehende R-22-Feldjagd/Sprint-KI in PR #74 und Manager-Helferwahl in PR #75 bleiben eigenständige offene Arbeiten.

### R-22 Klassiker – Abnahmeentscheidung für die isolierte Funktion (04.11.2026)
**Abschluss des isolierten R-22-Klassiker-KI-Entwicklungsschritts (04.11.2026):** Fachlicher Zielstand ist die ursprüngliche realitätsnähere Selektion aus PR #76 (Codebasis `815f16c`, abschließender Code-Commit `18fe59f`). **Verifizierter finaler vollständiger Testlauf [GitHub Actions #41875836222](https://github.com/Lancester/radsportmanager/actions/runs/41875836222): 324/324 erfolgreich, 0 Fehler**, einschließlich vier Referenzrennen mit je 154 fiktiven Fahrern/Seed 2026 sowie bisheriger No-Attack-, 30er-, CP/W′- und R-19-Regressionen. Liège: Klassiker F057 Sieger; Top10 **7 Klassiker, 2 Zeitfahrer, 1 Allrounder, 0 Sprinter**, stärkster Klassiker F003 **Platz 2 (+0,73s)**, drittstärkster F049 **Platz 3 (+0,78s)**, Siegerzeitgruppe 3, 5.878 Fahrer-Sekunden zusätzlichen Positionswatt-Wunsches und 487 Fahrer-Sekunden gezieltem Rampentempo-Watt-Wunsch. Lille, Boulogne und Hautacam **in allen bisherigen Ergebniskennzahlen unverändert**; `legacy`-Default sowie Physikkern, Formationsaerodynamik, W′, R-19, Bewegung und eigener PR #75 unverändert. Keine Gewinner-/Watt-/Zeit-/Positionsboni. Der Medianrückstand von 667,12 s (+11:07) und frühe Rückstände des hinteren Feldes (Rang 77 bereits etwa 1,0 km bei km190, 3,85 km bei km215) sind ausdrücklich ein offener *R-22-Gesamtkalibrierungsbefund*, kein Beweis umfassend realistischen Feldverhaltens. Originalimplementierung mit gemessenen Gruppenpositionen und W′-abhängigen echten Taktik-Wattwünschen wurde nach Gegenversuchen bewusst **beibehalten**: Eine pauschale +40-W-Regel allein lieferte 24.867 statt 5.878 nominierte Fahrer-Sekunden Aufrückarbeit und zehn Klassikerspezialisten unter zehn; die anschließende fahrertypübergreifende Nominierung ließ den stärksten klassiker F003 wieder auf Platz 119–124 zurückfallen. Diese Varianten wurden verworfen, nicht auf main gebracht. **Isolierte Klassiker-Funktion technisch abgeschlossen und zur Begutachtung bereit; PR #76 baut noch auf PR #74 auf und wird nicht nach main gemergt.** Spätere Mehrseed-/Feldgruppen-Häufigkeitskalibrierung gehört zur R-22-Gesamtabnahme, nicht zu einem künstlich auf Klassikersieger getrimmten Feature. Details in [R22_KLASSIKER_KI_ABNAHME.md](race/R22_KLASSIKER_KI_ABNAHME.md).

### R-22: sportlich begründete Feinjustierung des Sprintzuges (04.11.2026)
**R-22 PR #74, gezielte Reparatur des Zielsprintfeldes (04.11.2026):** Der zunächst offene vermeintliche Jagdfehler ließ sich durch **reale Checkpoints** genauer eingrenzen: Die Feldjagd hatte die Ausreißer bei km 170 schon eingeholt, aber in der letzten Anfahrt hatte die bisherige Sprintpositionierung `leadoutFrontShare=.10` mehrere Sprintteams gleichzeitig aus einem 120er-Hauptfeld nach vorne beschleunigt: Bei km 180 waren nur **25 Fahrer in der ersten** und **90 Fahrer in der größten physischen Gruppe**. Die konservative Zielgruppen-Heuristik `massSprintProxy` blieb mit 24 Fahrern in der Siegerzeitgruppe unter dem Schwellenwert 30. **Nicht die erfolgreiche Jagd künstlich verschärfen.**
**Gezielte KI-Änderung:** In `src/engine/race/sprint-positioning.ts` reicht den Sprintteams ab 94 % Streckenfortschritt jetzt das **vordere Fünftel** (`leadoutFrontShare=.20`) statt das erste Zehntel, bevor sie zusätzliche Positionierungswatt anfordern. Ein guter Fahrer darf natürlich aus eigener Leistung die Spitze und den Sprint gewinnen; die Regel nimmt nur unnötige Extra-Watt bei ohnehin bereits guter Position zurück. Kein Positions-, Gruppen-, Zeit-, CP/W′-, R-19- oder Aero-Eingriff; vor 94 % bleibt alles unverändert. Ergänzend `R22-LILLE-FINALE-FIELD` erfasst beim bereits vorhandenen Vierprofil-Smoke die reale Feldgruppe bei km 165/170/175/180; der neue Szenarioregressionstest verlangt im einmaligen Lille-Seed 2026 mindestens 80 Fahrer in der ersten zusammenhängenden Gruppe 5 km vor dem Ziel (keine allgemeine Massenprintquote).
**Vollständiger erster CI [#41881059600](https://github.com/Lancester/radsportmanager/actions/runs/41881059600) auf Codecommit `248e8dd`: 322/322 Tests grün**, vier Profile (154 Fahrer, jeweils Seed 2026), 30er und No-Attack-Gates. Lille: **erste physische Gruppe bei km 180 = 115 statt 25 Fahrer**, größte physische Gruppe ebenfalls 115; 5 km vorher bei km 175 120 Fahrer zusammen. Sieger Sprinter F149 statt F009, **8 Sprinter Top10 unverändert**, Siegerzeitgruppe **26 statt 24 Fahrer**, größte Zielzeitgruppe 71 Fahrer bei **+20,73 s statt +43,64 s**; 119 statt 117 Fahrer binnen +60 s. **Jagdwerte unverändert und weiter belegt:** 2 Fluchten eingeholt, 1.425 s namentlich gemessene CP-nahe Feldkopf-Jagd, längster kontinuierlicher Führungsblock 514 s, 1 Helfer nach 984 s Frontarbeit bewusst zurückgefallen, 22 individuelle Sprintantritte. **Boulogne, Liège, Hautacam exakt unverändert**. Der neue reine Test-/Dokumentationsstand nach `248e8dd` war zum Zeitpunkt dieser Notiz noch nicht separat CI-verifiziert.
**Grenze:** Der konservative **30er-Siegerzeitgruppen-Proxy bleibt `false`**. Keine Schwellenabsenkung, um Testerfolg vorzutäuschen; aus diesem einen Seed keine allgemeine Wahrscheinlichkeit für Massensprints ableiten. Die konkrete Fehlselektion vor den letzten 5 km ist aber sportlich und physikalisch messbar deutlich verbessert. **PR #74 weiterhin offen und ungemergt; PR #75 getrennt, PR #76 als abhängiger Klassiker-PR, `main` unverändert**. Vor eventueller Integration den vollständigen CI-Lauf des neuesten Test-/Dokumentationsstands prüfen und auf echte Feldgruppen/Sprint-KI achten.
