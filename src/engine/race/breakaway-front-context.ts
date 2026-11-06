/** Grobe technische Einordnung aus 1D-Längspositionen, ohne Spurmodell.
 * Sehr dicht gleichauf liegende Fahrer machen die Führungsposition unklar;
 * dies ist keine Aussage über seitlichen Abstand oder eine Kollision. */
export function classifyBreakawayFront(o:{group:readonly {id:string;positionM:number}[];
  trackedIds:ReadonlySet<string>}):{status:'ambiguous'|'no-partner'|'eligible';
  partnerId:string|null}{
  const front=o.group[0];
  if(!front||!o.trackedIds.has(front.id))return {status:'no-partner',partnerId:null};
  // Vorläufige technische Toleranz, kein sportliches Gesetz zur Gruppengröße.
  const ambiguityBandM=.5;
  if(o.group.slice(1).some(r=>front.positionM-r.positionM<=ambiguityBandM))
    return {status:'ambiguous',partnerId:null};
  const partner=o.group.slice(1).find(r=>o.trackedIds.has(r.id)&&
    front.positionM-r.positionM<=15);
  return partner?{status:'eligible',partnerId:partner.id}:
    {status:'no-partner',partnerId:null};
}
