/** Situationsabhängiger Zwischenstand für die Eintagesrenn-KI.
 * Taktische Heuristik, weder kinematische Vorgabe noch garantierter Erfolg. */
export type PursuitAction='fortsetzen'|'schonen'|'aufgeben'|'erreicht';
export interface PursuitObservation {
  gapM:number|null;bestGapM:number;secondsWithoutProgress:number;
  ownSpeedMps:number;targetSpeedMps:number;remainingM:number;
  reserveFraction:number;aggression:number;assignedTeamDuty:boolean;
  /** Beharrlichkeit beeinflusst die Entscheidung, nicht die Leistung. */
  pursuitPersistence?:number;
  /** Einschätzung absehbaren Geländes; keine Voraussage von Gegnerzuständen. */
  favorableTerrainAhead:boolean;
}
export function evaluatePursuit(o:PursuitObservation):PursuitAction{
  if(o.gapM===null||o.assignedTeamDuty)return 'aufgeben';
  if(o.gapM<=15)return 'erreicht';
  if(o.remainingM<=0||o.gapM>=o.remainingM)return 'aufgeben';
  // Eine fast leere Reserve erlaubt ein freiwilliges Schonungsintervall,
  // nicht automatisch den endgültigen Abbruch.
  if(o.reserveFraction<.12)return 'schonen';
  const opening=Math.max(0,o.gapM-o.bestGapM);
  const worsening=o.targetSpeedMps>o.ownSpeedMps+.3;
  const poorProspect=opening>Math.max(300,o.remainingM*.04)&&worsening;
  // Verstreichen von Zeit genügt nie alleine für einen Abbruch.
  if(poorProspect&&!o.favorableTerrainAhead&&
    o.secondsWithoutProgress>180&&o.reserveFraction<
      (.25+.15*(1-(o.pursuitPersistence??o.aggression))))
    return 'aufgeben';
  if(o.favorableTerrainAhead&&o.reserveFraction<.45&&!worsening)
    return 'schonen';
  return 'fortsetzen';
}
