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
