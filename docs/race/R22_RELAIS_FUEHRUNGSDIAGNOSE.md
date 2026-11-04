# R-22: Messung realer Führungswechsel in der Pelotonjagd (04.11.2026)

## Anlass und Status

Die sechs bislang geprüften KI-Varianten zeigen einen Zielkonflikt: `front-gated` bringt einen beauftragten Verfolger häufiger tatsächlich an die Feldspitze, hat aber bei Lille/Seed 2026 nur 51 Fahrer in der größten Zielgruppe (398 s Rückstand). Wir dürfen **beauftragte** Jagdzeit nicht mit **wirklich gefahrener** Führungsarbeit oder reibungsloser Relaisrotation verwechseln.

**Dieser Schritt ist ausschließlich Diagnostik auf einem Feature-Branch, keine neue KI- oder Physikkalibrierung.** Standard `legacy`, bestehende A/B-Varianten, Aero, CP/W′, R-19, Bewegungsintegrator und die großen manuellen Workflows bleiben unverändert.

## Neue reproduzierbare Messgrößen

- `mainFieldChaserLeaderChanges`: Zahl der **unmittelbaren** Übergänge zwischen zwei verschiedenen wirklich vorne fahrenden, zur Jagd beauftragten Fahrern an der Front der aktuell größten physischen Gruppe. Ein Unterbruch ohne qualifizierten Jagdführer beendet die Phase, der spätere Neustart zählt **nicht** als direkte Ablösung. Daher ist diese Zahl kein Zähler aller taktischen Dienstübergaben.
- `longestMainFieldChaserStintS`: längste ohne Unterbrechung gemessene Jagd-Frontphase **eines** Fahrers (Sekunden). Diese Kennzahl ist eine Abstraktion aus der 1D-Längsposition, keine echte 2D-Wind- oder Rotationsmessung.
- Weiterhin zum Vergleich: `orderedRelayTeamSeconds`, `mainFieldFrontWorkWithAssignedChaserS`, die Zielgruppenkennzahlen, tatsächliche Attacken und Gruppen.

Die neuen Felder werden nur für `relays`, `relay-paced` und `front-gated` im `RaceResult.diagnostics` ausgegeben und im bestehenden manuellen A/B-Report dokumentiert. Die physische Klassifikation der Gruppe und die tatsächlichen Fahrerintents bleiben unverändert.

## Abnahme und nächster Schritt

Der Vollrenntest prüft die Grenzen der Zähler: nichtnegativ, ganzzahlig für Wechsel, längste Einzelphase niemals länger als gesamte echte Frontjagd. Er umfasst weiterhin sechs vollständige 154-Fahrer-Lille-Vergleichsrennen und alle vorhandenen Ergebnis-/Energieprüfungen. **CI-Status beim Verfassen noch offen; keine Erfolgsbehauptung.**

Nach erfolgreicher CI die Resultate für **mehrere Seeds und mindestens ein weiteres Rennprofil** mit dem bereits manuell startbaren Workflow vergleichen. Besonders untersuchen: längere wirkliche Einzelphasen bei weniger nervösen Team-Jagdwechseln, ohne dass mehr Energieverbrauch, zu große Zeitlücken oder neue ungewollte Feldteilungen entstehen. Erst danach die eng begrenzte Relais-/Rückkehr-KI ändern. Keine versteckte Tempo- oder Aufholhilfe und keine automatische Monte-Carlo-Kampagne.
