/**
 * R-08: gemeinsame, deterministische Reservierung mehrerer Spurwechsel.
 * Pläne werden aus demselben Anfangszustand geprüft; Reihenfolge ist nach
 * Fahrer-ID festgelegt, nicht nach Reihenfolge der Eingabedaten.
 * Die Prognose extrapoliert konstante Längsgeschwindigkeiten – keine
 * Garantie gegen späteres unerwartetes Bremsen anderer Fahrer.
 */
import {sweptRectCollision} from '../physics/lateral-motion.ts';
import type {LaneObservation} from './overtake-controller.ts';

export interface ReservedLaneMove {
  riderId:string;
  targetM:number;
  rateMps:number;
}
export interface LanePlanOptions {
  minLongM:number;
  minLateralM:number;
  stepS:number;
  horizonS:number;
  /** Mindestlängsabstand für zwei zeitgleich auf dieselbe Spur Zielende. */
  sameTargetReserveGapM:number;
}
const check=(name:string,v:number,good:boolean)=>{
  if(!Number.isFinite(v)||!good)throw new RangeError('Spurkoordination: '+name);
};
export const R08_RESERVATION:Readonly<LanePlanOptions>=Object.freeze({
  minLongM:1.8,minLateralM:1.25,stepS:0.1,horizonS:5,
  sameTargetReserveGapM:6,
});
function yAt(y0:number,move:ReservedLaneMove|undefined,t:number):number {
  if(!move)return y0;
  const difference=move.targetM-y0;
  return y0+Math.sign(difference)*Math.min(Math.abs(difference),move.rateMps*t);
}
/** True heißt: Plan ablehnen. Ein laufender, bereits reservierter
 * Seitenwechsel zählt als bewegliches Hindernis.
 */
export function lanePlanConflicts(
  obs:LaneObservation,proposal:ReservedLaneMove,
  existing:readonly ReservedLaneMove[],options:LanePlanOptions=R08_RESERVATION,
):boolean {
  if(!obs||!Array.isArray(obs.riders))throw new RangeError('Spurkoordination: Fahrer fehlen');
  check('roadHalfWidthM',obs.roadHalfWidthM,obs.roadHalfWidthM>0);
  for(const [k,v] of Object.entries(options)){
    check(k,v, v>0&&v<=20);
  }
  const ids=new Set(obs.riders.map(r=>r.id));
  if(!ids.has(proposal.riderId)||existing.some(m=>!ids.has(m.riderId)))
    throw new RangeError('Spurkoordination: unbekannter Fahrer');
  const plans=new Map(existing.map(m=>[m.riderId,m]));
  plans.set(proposal.riderId,proposal);
  for(const move of plans.values()){
    check('targetM',move.targetM,Math.abs(move.targetM)<=obs.roadHalfWidthM);
    check('rateMps',move.rateMps,move.rateMps>0&&move.rateMps<=2.5);
  }
  const own=obs.riders.find(r=>r.id===proposal.riderId)!;
  for(const other of existing){
    if(other.riderId===proposal.riderId)continue;
    const rider=obs.riders.find(r=>r.id===other.riderId)!;
    if(Math.abs(other.targetM-proposal.targetM)<options.minLateralM &&
       Math.abs(rider.positionM-own.positionM)<options.sameTargetReserveGapM)
      return true;
  }
  for(let t=0;t<options.horizonS-1e-9;){
    const dt=Math.min(options.stepS,options.horizonS-t);
    const x0=obs.riders.map(r=>r.positionM+r.speedMps*t);
    const x1=obs.riders.map(r=>r.positionM+r.speedMps*(t+dt));
    const y0=obs.riders.map(r=>yAt(r.lateralPositionM,plans.get(r.id),t));
    const y1=obs.riders.map(r=>yAt(r.lateralPositionM,plans.get(r.id),t+dt));
    if(sweptRectCollision(x0,x1,y0,y1,options.minLongM,options.minLateralM))
      return true;
    t+=dt;
  }
  return false;
}
