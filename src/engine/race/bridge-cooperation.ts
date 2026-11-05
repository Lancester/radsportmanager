/** Taktische Teilnahme an einem bereits laufenden Anschlussversuch.
 * Sie schafft weder Position noch Energie oder erzwungene Zusammenarbeit. */
export function decideJoinBridge(o:{sameActualGroup:boolean;targetAhead:boolean;
  teamHasOtherDuty:boolean;teamHasRiderAhead:boolean;role:string;strategy:string;
  reserveFraction:number;aggression:number;currentIntent:string;draw:number}):boolean{
  if(!o.sameActualGroup||!o.targetAhead||o.teamHasOtherDuty||o.teamHasRiderAhead||
    o.reserveFraction<.25||o.role==='sprinter'||o.strategy==='sprint'||
    ['angriff','sprint','erholung','verfolgung','helferarbeit'].includes(o.currentIntent))
    return false;
  const intent=(o.strategy==='offensiv'?.16:.06)*(.5+.5*o.aggression);
  return o.draw<intent;
}
