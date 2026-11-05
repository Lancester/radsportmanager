# Idee: Erholung zwischen Etappen und Managerentscheidungen

Stand 05.11.2026. Zukunftsidee aus dem Gespräch; keine bereits implementierte oder abschließend festgelegte Spielmechanik. Der große Vergleich der Einzelrennen ist davon unabhängig und muss nicht auf die Umsetzung warten.

## Ziel

Bei mehrtägigen Rennen, besonders dreiwöchigen Rundfahrten, sollen individuelle Belastung, Erholung zwischen Etappen und mögliche Restermüdung nachvollziehbar auf die folgenden Tage wirken. Ein Helfer mit viel Arbeit kann nach mehreren Etappen stärker ermüden als ein geschützter Kapitän; schwere und leichte Etappen sollen nach tatsächlicher Belastung der einzelnen Fahrer beurteilt werden. Ruhetage können Erholung ermöglichen, garantieren aber keine vollständige Wiederherstellung.

## Vorhanden und offen

Der aktuelle Einzelrennen-Code besitzt individuelle Heuristiken für Ermüdungsresistenz innerhalb eines Rennens (`durabilityFactor`) und W′-Wiederauffüllung bei geringerer Leistung im Rennen (`wPrimeRecoveryFactor`). Ergebnisse enthalten u. a. verbleibendes W′, Kohlenhydratstand und Leistungsverfügbarkeit. Bei jedem neuen Rennen werden Kurz- und Langzeitzustand jedoch initialisiert. **Es gibt derzeit keine Zustandsübergabe von Etappe zu Etappe, kein Nacht-Erholungsmodell und keine eigene mehrtägige Erholungseigenschaft.** Nicht sämtliche zur Fortsetzung erforderlichen internen Zustände sind bereits als fortsetzbarer Zustand verfügbar.

Vorgesehener Ansatz, noch fachlich auszuarbeiten: Belastungs- und Erholungszustand je Fahrer übergeben; kurzfristige W′-Erholung, Langzeitermüdung und Erholung zwischen Tagen fachlich unterscheiden; Ruhezeit, tatsächliche Belastung, Verpflegung und individuelle Erholungsfähigkeit als mögliche Einflüsse prüfen. Bei nicht ausreichender Erholung bleibt eine übertragene Belastung bestehen und kann sich über mehrere Etappen verändern. Die Modellgrößen und Wirkungen müssen noch untersucht und an geeigneten Daten sowie mehreren Renn- und Ruhe-Szenarien geprüft werden; keine pauschal unterstellten Leistungsboni.

## Verbindung zur Manager-Idee

Eine gesonderte, individuelle Eigenschaft für Erholung zwischen Tagen könnte später als Talent-/Entwicklungsmerkmal eine Rolle spielen. Welche Anteile tatsächlich trainierbar sind, ob und wie sie sich durch Alter und Saison entwickeln, ist offen und muss weder identisch zur W′-Erholung noch für alle Fahrer gleich sein.

Mögliche spätere Entscheidungen des Managers: Qualität und Zusammensetzung von medizinischer Betreuung, Ernährung und Logistik; Unterkunft und gegebenenfalls mitgeführtes Schlafmaterial wie individuelle Matratzen oder temperaturregulierte Bettwäsche. Solche Ausstattungen sind **Ideen**, keine zugesicherten, bereits belegten Leistungssteigerungen: Ihre Wirksamkeit, Kosten, Praktikabilität und mögliche Spielwirkung müssten vor einer Umsetzung kritisch recherchiert und verhältnismäßig gestaltet werden. Keine Pflicht, jede Nacht Mikroentscheidungen zu treffen; Personal und sportliche Leitung können Betreuung im Rahmen der Manager-Vorgaben autonom organisieren.

## Spätere Prüfung

Vor einer Einführung insbesondere folgende Fragen anhand mehrerer fiktiver Fahrer, Etappenfolgen und Ruhetage prüfen: baut sich Ermüdung bei hoher wiederholter Arbeit auf; kann sich ein Fahrer an leichten und Ruhetagen erholen; unterscheiden sich Tageserholung und kurzfristige W′-Erholung unabhängig; bleiben Gesamtwertung und Fahrertypen vielfältig? Änderungen nur mit Tests und dokumentierten Vergleichsläufen, ohne vorgegebene Sieger oder Mindestabstände.
