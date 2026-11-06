/** Freiwilliges Aus-dem-Wind-nehmen nach realer gemeinsamer Führung.
 * Heuristik nur als Wattanfrage, keine garantierte Ablösung oder Position. */
export function cooperativeRelayYield(o:{sharedTarget:boolean;isRealFront:boolean;
  partnerGapM:number|null;frontSeconds:number;reserveFraction:number;
  cpW:number;requestedW:number;
  /** Wenn gesetzt: Vergleich mit Beginn dieser tatsächlichen Führungsphase. */
  initialReserveFraction?:number}):number|null{
  if(!o.sharedTarget||!o.isRealFront||o.partnerGapM===null||o.partnerGapM<0||
    o.partnerGapM>12||o.reserveFraction<0||o.reserveFraction>1||o.cpW<=0)
    return null;
  if(o.initialReserveFraction!==undefined){
    if(!Number.isFinite(o.initialReserveFraction)||o.initialReserveFraction<0||
      o.initialReserveFraction>1)return null;
    // Ein kurzer Puffer verhindert nervöses Umschalten; es gibt keine
    // Höchstführungsdauer. Entscheidend ist die eigene Reserveentwicklung.
    const spent=Math.max(0,o.initialReserveFraction-o.reserveFraction);
    if(o.frontSeconds<20||(o.reserveFraction>=.38&&spent<.12))return null;
  }else{
    // Kompatibilität für bisherige Anschlussversuche ohne Startzustand.
    const desiredTurnS=45+180*o.reserveFraction;
    if(o.frontSeconds<desiredTurnS)return null;
  }
  const yieldPower=Math.min(o.requestedW,o.cpW*.78);
  return yieldPower<o.requestedW-1?yieldPower:null;
}

/** Nur beobachteter Positionswechsel; kein Beleg für spätere Führungsdauer. */
export function observedRelayFrontChange(o:{sameGroup:boolean;sameTarget:boolean;
  formerFrontPositionM:number;partnerPositionM:number}):boolean{
  return o.sameGroup&&o.sameTarget&&
    o.partnerPositionM>o.formerFrontPositionM;
}
