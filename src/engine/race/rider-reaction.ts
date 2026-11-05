/** Vorläufige individuelle Reaktion auf einen beobachteten Angriff.
 * Nur Wattanfrage, keine automatische Positions-/Tempokorrektur. */
export interface RiderReactionObservation {
  gapM:number;threat:number;reserveFraction:number;aggression:number;
  isTeammate:boolean;hasTeamDuty:boolean;currentIntent:string;draw:number;
}
export function decideRiderReaction(o:RiderReactionObservation):boolean{
  if(o.isTeammate||o.hasTeamDuty||o.gapM<0||o.gapM>150||
    o.reserveFraction<.20||['angriff','sprint','erholung','helferarbeit'].includes(o.currentIntent))
    return false;
  const proximity=Math.max(0,1-o.gapM/200);
  const chance=Math.min(1,(.04+.40*o.threat)*proximity*(.65+.35*o.aggression));
  return o.draw<chance;
}
