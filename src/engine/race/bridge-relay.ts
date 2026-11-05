/** Freiwilliges Aus-dem-Wind-nehmen nach realer gemeinsamer Führung.
 * Heuristik nur als Wattanfrage, keine garantierte Ablösung oder Position. */
export function cooperativeRelayYield(o:{sharedTarget:boolean;isRealFront:boolean;
  partnerGapM:number|null;frontSeconds:number;reserveFraction:number;
  cpW:number;requestedW:number}):number|null{
  if(!o.sharedTarget||!o.isRealFront||o.partnerGapM===null||o.partnerGapM<0||
    o.partnerGapM>12||o.reserveFraction<0||o.reserveFraction>1||o.cpW<=0)
    return null;
  // Bereits geleistete reale Führungszeit, flexibler mit Reserve; eine
  // günstigere Kooperation kann später durch Personal/Taktik ersetzt werden.
  const desiredTurnS=45+180*o.reserveFraction;
  if(o.frontSeconds<desiredTurnS)return null;
  const yieldPower=Math.min(o.requestedW,o.cpW*.78);
  return yieldPower<o.requestedW-1?yieldPower:null;
}
