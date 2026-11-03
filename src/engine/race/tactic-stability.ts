/**
 * R-10: Mindestdauer taktischer Entscheidungen gegen nervöses Pendeln.
 * Ein fast erschöpfter Fahrer darf sofort in die Erholung wechseln,
 * ein Zielsprint ebenso; gewöhnliche Verfolgung/Erholung benötigt
 * dagegen eine erkennbare, mehrere Sekunden anhaltende Handlung.
 */
import type {TacticDecision} from './race-tactics.ts';
export interface StableTacticState {
  decision:TacticDecision;
  changedAtS:number;
}
export interface StableTacticResult {
  state:StableTacticState;
  changed:boolean;
}
const MIN_HOLD_S=80;
const RECOVERY_REJOIN_FRACTION=0.24;
export function stabilizeTactic(
  raw:TacticDecision,previous:StableTacticState,
  timeS:number,reserveFraction:number,
):StableTacticResult {
  if(!raw||!previous?.decision ||
    !Number.isFinite(raw.desiredPowerW)||raw.desiredPowerW<0||
    !Number.isFinite(timeS)||timeS<0||
    !Number.isFinite(previous.changedAtS)||previous.changedAtS>timeS||
    !Number.isFinite(reserveFraction)||reserveFraction<0||
    reserveFraction>1+1e-8)
    throw new RangeError('Renn-Taktikruhe: ungültiger Zustand');
  const old=previous.decision;
  if(raw.intent===old.intent){
    // Wattbedarf darf im gleichen stabilen Zustand neu geschätzt werden.
    return {state:{decision:raw,changedAtS:previous.changedAtS},changed:false};
  }
  const urgentSprint=raw.intent==='sprint';
  const urgentRecovery=raw.intent==='erholung'&&reserveFraction<0.075;
  if(old.intent==='erholung'&&!urgentSprint&&reserveFraction<RECOVERY_REJOIN_FRACTION){
    return {state:previous,changed:false};
  }
  // Eine echte Attacke als bewusster Rennmoment, nicht an einem
  // zufälligen 80-s-Intervall verhindern.
  const offensive=raw.intent==='angriff'&&reserveFraction>0.3;
  if(!urgentSprint&&!urgentRecovery&&!offensive&&
    timeS-previous.changedAtS<MIN_HOLD_S)
    return {state:previous,changed:false};
  return {state:{decision:raw,changedAtS:timeS},changed:true};
}
