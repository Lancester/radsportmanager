/**
 * R-10: abstrakter Peloton-Geschwindigkeitsregler.
 *
 * Ein Fahrer versucht bei vorhandener kleiner Lücke die Geschwindigkeit
 * des unmittelbaren Vordermanns zu treffen. Er fordert NUR Kurbelwatt/
 * ggf. begrenzte Bremskraft an. Bewegung und tatsächliche W′-Kosten
 * übernimmt unverändert der gemeinsame Bewegungskern.
 *
 * Keine exakte 2D-Spurgeometrie und kein "alle fahren gleich schnell".
 */
import type {CornerRider} from '../physics/motion-core.ts';
import type {RaceIntent} from './race-tactics.ts';

export interface PelotonFollowingInput {
  frontGapM:number|null;
  frontSpeedMps:number|null;
  ownSpeedMps:number;
  gradeFraction:number;
  aeroFactor:number;
  rider:CornerRider;
  desiredPowerW:number;
  criticalPowerW:number;
  intent:RaceIntent;
}
export interface PelotonFollowingDecision {
  powerW:number;
  brakeForceN:number;
  following:boolean;
  reason:string;
}
export const PELOTON_PARAMETERS=Object.freeze({
  catchRangeM:32,
  desiredGapM:5.5,
  correctionPerGapMps:0.06,
  maxCloseSpeedMps:0.65,
  maxSlowdownMps:0.50,
  speedResponseSeconds:4,
  maximumBrakeForceN:240,
});
function clamp(x:number,low:number,high:number):number {
  return Math.max(low,Math.min(high,x));
}
function valid(name:string,v:number,ok:boolean):void {
  if(!Number.isFinite(v)||!ok)throw new RangeError('Peloton-Regler: '+name);
}
function requiredPowerAtSpeed(
  targetSpeedMps:number,gradeFraction:number,
  aeroFactor:number,r:CornerRider,
):number {
  const m=r.riderMassKg+r.equipmentMassKg;
  const normal=1/Math.hypot(1,gradeFraction);
  const sin=gradeFraction*normal;
  const drag=0.5*r.airDensityKgM3*r.dragAreaM2*aeroFactor*targetSpeedMps**2;
  const roll=r.rollingCoefficient*m*9.81*normal;
  const climb=m*9.81*sin;
  return Math.max(0,(drag+roll+climb)*targetSpeedMps/r.drivetrainEfficiency);
}
/** Erlaubt längs einer abstrakten Gruppe sichtbares Mitrollen, kein
 * Positions-/Geschwindigkeitssprung. Taktische Angriffe bleiben eigenständig.
 */
export function decidePelotonFollowing(x:PelotonFollowingInput):PelotonFollowingDecision {
  if(!x||!x.rider)throw new RangeError('Peloton-Regler: Fahrer fehlt');
  valid('ownSpeedMps',x.ownSpeedMps,x.ownSpeedMps>=0&&x.ownSpeedMps<100);
  valid('desiredPowerW',x.desiredPowerW,x.desiredPowerW>=0&&x.desiredPowerW<=2500);
  valid('criticalPowerW',x.criticalPowerW,x.criticalPowerW>0&&x.criticalPowerW<=1500);
  valid('gradeFraction',x.gradeFraction,Math.abs(x.gradeFraction)<=0.25);
  valid('aeroFactor',x.aeroFactor,x.aeroFactor>0&&x.aeroFactor<=1);
  const r=x.rider;
  for(const [name,value] of [
    ['riderMassKg',r.riderMassKg],['equipmentMassKg',r.equipmentMassKg],
    ['dragAreaM2',r.dragAreaM2],['rollingCoefficient',r.rollingCoefficient],
    ['airDensityKgM3',r.airDensityKgM3],['drivetrainEfficiency',r.drivetrainEfficiency],
  ] as const)valid(name,value,value>0);
  if(x.frontGapM!==null)valid('frontGapM',x.frontGapM,x.frontGapM>=0);
  if(x.frontSpeedMps!==null)
    valid('frontSpeedMps',x.frontSpeedMps,x.frontSpeedMps>=0&&x.frontSpeedMps<100);
  if(x.frontGapM===null||x.frontSpeedMps===null||
     x.frontGapM>PELOTON_PARAMETERS.catchRangeM ||
     x.intent==='angriff'||x.intent==='sprint'){
    return {powerW:x.desiredPowerW,brakeForceN:0,following:false,
      reason:'Freie Fahrt oder ausdrückliche Attacke'};
  }
  const p=PELOTON_PARAMETERS;
  const gapError=x.frontGapM-p.desiredGapM;
  const targetSpeed=Math.max(0,x.frontSpeedMps+clamp(
    gapError*p.correctionPerGapMps,
    -p.maxSlowdownMps,p.maxCloseSpeedMps));
  const acceleration=(targetSpeed-x.ownSpeedMps)/p.speedResponseSeconds;
  const m=r.riderMassKg+r.equipmentMassKg;
  const forceCorrection=m*acceleration;
  const correctionW=forceCorrection*Math.max(2,x.ownSpeedMps)/r.drivetrainEfficiency;
  const steadyW=requiredPowerAtSpeed(targetSpeed,x.gradeFraction,x.aeroFactor,r);
  // CP/W′ prüft später die tatsächliche Leistbarkeit des Wattwunsches.
  // Der begrenzte Planer kann kein unendliches "magisches" Nachsetzen verlangen.
  const powerW=clamp(steadyW+correctionW,0,
    Math.max(x.desiredPowerW,x.criticalPowerW+85));
  const dangerous=x.frontGapM<2.2 &&
    x.ownSpeedMps>x.frontSpeedMps+0.35;
  const brakeForceN=danger?Math.min(p.maximumBrakeForceN,
    m*Math.max(0,(x.ownSpeedMps-x.frontSpeedMps)/1.5)):0;
  return {powerW:brakeForceN?0:powerW,brakeForceN,following:true,
    reason:dangerous?'Bei geringer Lücke physikalisch bremsen':
      gapError>0?'Watt für kontrollierten Gruppenanschluss anpassen':
        'Antriebsleistung für Gruppenabstand zurücknehmen'};
}
