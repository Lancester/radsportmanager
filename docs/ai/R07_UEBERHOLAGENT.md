# R-07 · Erste autonome Überholspur und physikalisch begrenzter Angriff

**Entwicklungsstand 03.11.2026** · Ausgangspunkt: R-06 mit 134/134 bestandenen Tests, 8 gemeinsam fahrenden Fahrern und bisher ausschließlich von außen vorgegebenen Spurwechseln.

## Drei zusammenhängende technische Fortschritte

### 1. Reine, erklärbare Überholentscheidung

Neu: `src/engine/ai/overtake-controller.ts`. Die regelbasierte `decideOvertakeLane`-Funktion erhält Fahrerpositionen, Geschwindigkeiten und Straßenbreite, **aber keinen direkten Zugriff auf Physik- oder Renderdaten**.

Der Fahrer prüft zuerst, ob innerhalb von **12 m** ein Vordermann auf derselben Spur liegt. Dann betrachtet er in einer festgelegten Reihenfolge zwei freie Kandidaten (im Beispiel **+2 m, −2 m**) und bewertet die zeitlich gestreckte Seitenbewegung für die erwarteten nächsten bis zu **5 s** in **0,1-s-Prognoseschritten**.

Die Entscheidung verwendet die bereits entwickelte `sweptRectCollision`-Konfliktprüfung für jedes Teilintervall. Dabei werden die **momentanen** Geschwindigkeiten der übrigen Fahrer als konstant fortgeschrieben. Ist die bevorzugte Seite blockiert, versucht er die andere; sind beide blockiert, entscheidet er ausdrücklich **nicht** zu überholen. Überschreitet ein Spurziel die Straßenbreite, kommt es ebenfalls nicht infrage.

**Wichtig:** Dies ist eine **beschränkte Prognose**, kein mathematischer Beweis zukünftiger Kollisionsfreiheit. Andere Fahrer könnten plötzlich bremsen, beschleunigen oder selbst die Spur wechseln. Während des tatsächlichen Rennens bleibt die genauere swept-Prüfung aus dem Physikkern aktiv und kann eine Simulation bei einem unlösbaren Konflikt abbrechen.

### 2. Gemeinsame Uhr und tatsächliche Angriffsdynamik

Neu: Optionales `GroupInput.overtakeAgents` in `src/engine/physics/drafting-group.ts`. Alle Fahrer bleiben auf **derselben Uhr**. Die erste automatische Entscheidung setzt nur ein **seitliches Ziel**; die vorhandene, geschwindigkeitsbegrenzte Bewegung erzeugt die wirkliche Querposition. **Erst nachdem die Seite vollständig erreicht ist**, fordert der Agent in einer simplen Prototypenregel eine höhere Pedalleistung an.

Der neue Solver trennt die Zustände **`search → moving → passing`**. Ein eigener Integrationsschnitt wird genau am Ende des Seitenwechsels gesetzt. So gibt es keinen versteckten Zeitbonus und keine Leistungserhöhung während des noch nicht abgeschlossenen Überholvorgangs.

Der Agent wünscht **360 W** im Demolauf. Ein optionales Profil mit **CP = 300 W**, **W′ = 12.000 J** und eigenständiger **FTP = 285 W** begrenzt diese Anforderung innerhalb des vorhandenen physikalischen Leistungsmodells. Diese Zahlen sind **frei erfundene, zum Test geeignete Leistungswerte**, kein realistisches Profi-Fahrerprofil.

Zusätzlich ist die bestehende R-05-Abstandsregelung eingebunden, solange ein Vordermann auf derselben Spur liegt. Die Entscheidungskette bleibt: **Spurentscheidung → Leistungswunsch → Abstandsschutz → CP/W′-Grenze → ursprünglicher numerischer Physikintegrator**.

**Keine automatische Rückkehr ins Feld**, keine Teamtaktik oder eigenständige Wahl des Angriffsziels. Für diese erste Stufe kann genau ein Fahrer eine Überholspur wählen und darauf bleiben. Die Aerodynamik bleibt die vorläufige Mehrfahrer-Heuristik.

### 3. Referenzvergleich statt erfundener Performance

Zwei **identisch parametrierte** 65-s-Szenarien:
- `createEightRiderAutoPassExample`: F8 entscheidet **eigenständig**, auf welcher Seite er überholt. Er fordert seine Angriffswatt erst nach vollständig vollendetem Spurwechsel an.
- `createEightRiderTimedPassWithCpExample`: F8 erhält genau denselben Spurbefehl bei **0 s** und denselben Leistungsbefehl bei **2,5 s**, aber von außen. Die CP/W′-Daten und die gesamte Fahrphysik sind identisch.

Ein Test vergleicht **Position, Geschwindigkeit und W′-Rest** und lehnt Abweichungen über der numerischen Toleranz ab. Ein weiterer Test muss zeigen, dass die autonome Variante tatsächlich mindestens F7 überholt und das Ergebnis bitgenau reproduzierbar bleibt. Eine freie Seite und zwei blockierte Seiten werden ebenfalls unabhängig überprüft.

**Neuer Android-Preset:** `NEU · 8 Fahrer · autonome Überhol-KI` auf https://lancester.github.io/radsportmanager/. Der Worker soll die echten TypeScript-Module ausführen und Rechenzeit, Anzahl KI-Spurentscheidungen, physische Überholvorgänge, verbleibende W′ und tatsächlich gefahrene Pedalleistung zurückgeben.

**Prüfstatus vor CI:** Code und neue Tests vorbereitet; Gesamttest und Browser-Deployment sind **erst nach dem tatsächlichen erfolgreichen GitHub-Actions-Lauf** als erledigt zu bezeichnen. Vor einem realen Nutzerlauf existiert **noch kein neuer Android-Median**.

## Grenzen und weitere Entscheidungen

**Nicht als fertiger Rennsimulator ausgeben:** Die neue Spurwahl steuert eine kinematische Querbewegung mit 0,8 m/s – noch keine Radfahrphysik mit Lenkwinkel, Schräglage, Querbeschleunigung, Reibkreis, Kurven, Nässe oder fahrerspezifischer Fahrtechnik. Das CP/W′-Wiederauffüllen ist nicht sportwissenschaftlich kalibriert, die FTP-Diagnose noch kein echtes Trainingssystem.

Für den nächsten Entwicklungsblock zu prüfen: (1) sicherer **Rückwechsel ins Feld**, (2) echte **Mehrfahrer- und beidseitige Spurwahl** bei beweglichen Hindernissen, (3) Querbeschleunigung und Kurven-Kollisionsvermeidung, (4) länger haltbare Belastung unter CP samt Trainingseffekten. Keine eigenmächtige Änderung der festgelegten Spielmechanik.

Alle alten R-03 bis R-06-Szenarien bleiben ohne `overtakeAgents` ausdrücklich unverändert.
