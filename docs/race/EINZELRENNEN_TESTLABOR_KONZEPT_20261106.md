# Einzelrennen-Testlabor – geplanter Browser-Zwischenschritt nach Engine 1.0

## Ziel

Vor dem langfristigen Radsportmanager eine **minimalistische, komplett offline im Browser laufende Einzelrennen-Simulation**, damit der Nutzer beliebige Teamstrategien, reproduzierbare Seeds und die vier bisherigen Referenzstrecken selbst ausprobieren kann. **Nicht** sofort den gesamten Managerbau beginnen. Das Testlabor dient zusätzlich zur individuellen Modellkalibrierung.

## Kleine erste Version (kein neues Simulationsmodell)

- **Rennen:** Lille 2025 (flach), Boulogne 2025 (hügelig), Lüttich–Bastogne–Lüttich 2025 (Klassiker), Hautacam 2025 (Berg). Die bisherige `createReferenceFixture()`-Route bleibt Grundlage. **Wichtiger Hinweis im UI:** veröffentlichte Distanzen und Anstiege, aber modellierte Zwischenprofile; fiktive Fahrer, keine historische 1:1-Nachbildung.
- **Auswahl:** Seed (damit exakt wiederholbar), eigenes Team aus 22 fiktiven Teams, Rennziel. Strategie zunächst nur mit wirklich vorhandenen, validierbaren Engine-Enums: `ausgewogen`, `offensiv`, `sprint`, `kapitaen_schuetzen`; optional `chaseHelperCount` 0–5, soweit in stable-pack tatsächlich verwendet. Keine unverkabelten Scheinregler.
- **Taktik-Eingabefeld:** Einfache natürlichsprachliche Wünsche wie „mit 3 Helfern die Flucht verfolgen, im Finale auf den Sprinter setzen“ nur als **lokaler, transparenter Parser** auf tatsächlich vorhandene strukturierte Einstellungen abbilden. Keine externe KI-/Netzpflicht, keine Behauptung freier taktischer Steuerung, wenn Engine die gewünschte Taktik nicht kennt. Vorschau der erkannten Anweisung vor dem Start; nicht unterstützte Ziele sichtbar melden. Alternativ direkte Dropdown- und Zahleneingaben als zuverlässiger Standard.
- **Start:** bestehende `simulateRace` aus der freigegebenen Engine via WebWorker, Oberfläche während der Berechnung bedienbar. Bei Simulation mit 154 Fahrern CPU-Laufzeit/Arbeitsspeicher auf Android prüfen; kein eingebauter Cloudserver nötig.
- **Ergebnis:** erste zehn Fahrer inkl. favorisierte Fahrertypen, gesamte Zielgruppen-Tabelle (Platz, Team, individuelle Roh-Zielzeit **getrennt** von gutgeschriebener Gruppenzeit), Sieger, Ausreißerattacken mit Gründen und CP/W′-Mehrarbeit, erfolgreiche/gescheiterte Jagden, wirkliche Helferstints und Energie, W′ und Langzeitermüdung, Gruppe der Spitze vs größte Verfolgergruppe an Zwischenkilometern. Verständlicher kurzer Rennbericht aus gemessenen Ereignissen, **kein frei erfundener Kommentar**.
- **Vergleichen:** „gleiche Strecke/gleicher Seed/andere Taktik“ sofort nebeneinander; gespeicherte JSON-Konfiguration als reproduzierbarer Testfall. UI kann lokale Einstellungen speichern, kein Konto/Server.
- **Manuelle Kalibrierung:** Zunächst Auswertungsschalter (1-s/3-s-Zielgruppenwertung, Rohzeiten anzeigen), ggf. kontrollierte Wind- und Streckenbedingungen als **Szenario** (nicht heimliche globale Physikparameter). Kritische CP/W′/Aero-Regler nur mit sichtbar markierter experimenteller Änderung und zurücksetzbarem Standard, sonst sind Vergleichsrennen nicht aussagekräftig. Kein verstecktes Strecken-spezifisches Winner-Tuning.
- **Bedienung:** mobilfreundlich, deutsch, PWA optional, offlinefähige lokale Berechnung, kein 3D-Rennen; einfache Tabellen, chronologischer Rennbericht und optional Profil-/Zeitabstandskurve.

## Nicht Teil der ersten Version

Karrieremodus, Transfers, Fahrerentwicklung über Saisons, Etappenrennen, Live-Eingriff während des Rennens, reale Fahrerlizenzen, Multiplayer, Benutzerkonto, kostenpflichtige API, generative KI als Pflicht.

## Technische Kopplung und Freigabe

- UI wird **erst nach** technischem Einfrieren des Engine-Releasekandidaten erstellt.
- `main` und freigegebene Engine schützen. Der Browserzugriff importiert den bestehenden, geprüften `src/engine/race/race-simulator.ts`-Kern plus `reference-fixtures.ts`; der Simulator ist die einzige Quelle der Physik, keine zweite JS-Neuimplementierung.
- Ergebnisse nach `finish-time-groups.ts` nur im separaten, später validierten Anzeige-/Wertungspfad transformieren.
- Mindestens: drei reproduzierbare Tests (ein Flachsprint mit gemeinsamer Gruppe, echte Soloflucht, schwere Bergselektion) sowie ein Android-Performancebenchmark; verglichene JSON-Konfigurationen müssen bei identischem Seed exakt dieselben Resultate liefern.
- Später stufenweise Teammanager-/sportliche-Leiter-Entscheidungen nachrüsten. Das Labor ist eigenständiges Spielgefühl- und Kalibrierwerkzeug, kein weggeworfener Prototyp.

**Stand:** Nutzeridee als nächste Produktstufe festgehalten, noch keine UI-Implementierung. Die aktuelle Schlussabnahme der Zielgruppen und absoluten Rennzeiten entscheidet über den Engine-1.0-Stand.
