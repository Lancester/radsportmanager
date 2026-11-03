/**
 * R-07 – erste autonome, erklärbare Überholspur-Entscheidung.
 * Bewertet Sichtabstand und den künftigen Querversatz vor einem Manöver.
 * Keine neuronale KI, keine 2D-Fahrdynamik und keine Kollisionsgarantie.
 */
import {lateralAdvance,sweptRectCollision} from '../physics/lateral-motion.ts';

export interface OvertakeAgentConfig {
  riderId:string;
  candidateLanesM:number[];
  detectionGapM:number;
  minClearanceLongM:number;
  minClearanceLateralM:number;
  maxLateralSpeedMps:number;
  maneuverPredictionStepS:number;
  maxManeuverHorizonS:number;
  attackPowerW:number;
  /** Einfache, konservative Rückkehr vor die gesamte Heimatspur-Gruppe. */
  autoRejoin?:boolean;
  rejoinAfterPasses?:number;
  rejoinLeadGapM?:number;
}
export interface LaneObservation {
  riders:ReadonlyArray<{
    id:string; positionM:number; lateralPositionM:number; speedMps:number;
  }>;
  roadHalfWidthM:number;
}
export type OvertakeDecision =
  | {action:'stay';reason:string}
  | {action:'move';targetLateralPositionM:number;reason:string};

export const R07_F8_AGENT:Readonly<OvertakeAgentConfig>=Object.freeze({
  riderId:'F8',candidateLanesM:[2,-2],detectionGapM:12,
  minClearanceLongM:1.8,minClearanceLateralM:1.25,
  maxLateralSpeedMps:0.8,maneuverPredictionStepS:0.1,
  maxManeuverHorizonS:5,attackPowerW:360,
});
const check=(n:string,v:number,p:boolean)=>{if(!Number.isFinite(v)||!p)
  throw new RangeError('Überholagent: '+n);};
export function validateOvertakeAgent(c:OvertakeAgentConfig):void {
  if(!c||typeof c.riderId!=='string'||!c.riderId.trim())throw new RangeError('Überholagent: Fahrer-ID');
  if(!Array.isArray(c.candidateLanesM)||c.candidateLanesM.length<1||
    c.candidateLanesM.length>4)throw new RangeError('Überholagent: Spurvorschläge');
  for(const y of c.candidateLanesM)check('candidateLanesM',y,true);
  check('detectionGapM',c.detectionGapM,c.detectionGapM>c.minClearanceLongM);
  check('minClearanceLongM',c.minClearanceLongM,c.minClearanceLongM>0);
  check('minClearanceLateralM',c.minClearanceLateralM,c.minClearanceLateralM>0);
  check('maxLateralSpeedMps',c.maxLateralSpeedMps,c.maxLateralSpeedMps>0&&c.maxLateralSpeedMps<=2.5);
  check('maneuverPredictionStepS',c.maneuverPredictionStepS,
    c.maneuverPredictionStepS>=0.05&&c.maneuverPredictionStepS<=0.5);
  check('maxManeuverHorizonS',c.maxManeuverHorizonS,
    c.maxManeuverHorizonS>=1&&c.maxManeuverHorizonS<=15);
  check('attackPowerW',c.attackPowerW,c.attackPowerW>0&&c.attackPowerW<=1500);
  if(c.autoRejoin!==undefined&&typeof c.autoRejoin!=='boolean')
    throw new RangeError('Überholagent: autoRejoin');
  if(c.rejoinAfterPasses!==undefined&&
     (!Number.isSafeInteger(c.rejoinAfterPasses)||c.rejoinAfterPasses<1||c.rejoinAfterPasses>7))
    throw new RangeError('Überholagent: rejoinAfterPasses');
  if(c.rejoinLeadGapM!==undefined)
    check('rejoinLeadGapM',c.rejoinLeadGapM,
      c.rejoinLeadGapM>c.minClearanceLongM&&c.rejoinLeadGapM<=50);
}

/** Vorausberechnung mit KONSTANTEN aktuellen Geschwindigkeiten:
 * zurückhaltender Kollisionsfilter, keine Zukunftsgarantie. Nach
 * jedem realen Simulationsschritt greift die exakte swept-Prüfung.
 */
export function decideOvertakeLane(
  config:OvertakeAgentConfig,obs:LaneObservation,
):OvertakeDecision {
  validateOvertakeAgent(config);
  const half=obs?.roadHalfWidthM;
  check('roadHalfWidthM',half,half>=1&&half<=10);
  if(!Array.isArray(obs.riders)||obs.riders.length<2||obs.riders.length>8)
    throw new RangeError('Überholagent: 2 bis 8 Fahrer benötigt');
  const ids=new Set<string>();
  for(const r of obs.riders){
    if(!r||typeof r.id!=='string'||!r.id.trim()||ids.has(r.id))
      throw new RangeError('Überholagent: Fahrer-IDs');
    ids.add(r.id);
    check('positionM',r.positionM,true);
    check('lateralPositionM',r.lateralPositionM,Math.abs(r.lateralPositionM)<=half);
    check('speedMps',r.speedMps,r.speedMps>=0&&r.speedMps<100);
  }
  const own=obs.riders.find(r=>r.id===config.riderId);
  if(!own)throw new RangeError('Überholagent: Fahrer nicht in Gruppe');
  const leader=obs.riders.filter(r=>r.id!==own.id &&
    r.positionM>own.positionM &&
    Math.abs(r.lateralPositionM-own.lateralPositionM)<config.minClearanceLateralM)
    .sort((a,b)=>a.positionM-b.positionM)[0];
  if(!leader||leader.positionM-own.positionM>config.detectionGapM)
    return {action:'stay',reason:'Kein naher Vordermann auf eigener Spur'};
  for(const target of config.candidateLanesM){
    if(Math.abs(target)>half||Math.abs(target-own.lateralPositionM)<config.minClearanceLateralM)
      continue;
    const travelSeconds=Math.abs(target-own.lateralPositionM)/config.maxLateralSpeedMps;
    if(travelSeconds>config.maxManeuverHorizonS)continue;
    let safe=true;
    // Die ganze Querverschiebung plus einen kurzen Puffer prüfen, nicht
    // nur den Zielpunkt. Alle anderen werden mit momentanem v fortgeschrieben.
    const horizon=Math.min(config.maxManeuverHorizonS,travelSeconds+0.5);
    for(let t=0;t<horizon-1e-10;){
      const dt=Math.min(config.maneuverPredictionStepS,horizon-t);
      const signed= Math.sign(target-own.lateralPositionM);
      const startY=own.lateralPositionM+signed*Math.min(
        Math.abs(target-own.lateralPositionM),config.maxLateralSpeedMps*t);
      const endY=lateralAdvance(startY,target,config.maxLateralSpeedMps,dt,half);
      const xBefore=[own.positionM+own.speedMps*t];
      const xAfter=[own.positionM+own.speedMps*(t+dt)];
      const yBefore=[startY],yAfter=[endY];
      for(const r of obs.riders)if(r.id!==own.id){
        xBefore.push(r.positionM+r.speedMps*t);
        xAfter.push(r.positionM+r.speedMps*(t+dt));
        yBefore.push(r.lateralPositionM);yAfter.push(r.lateralPositionM);
      }
      if(sweptRectCollision(xBefore,xAfter,yBefore,yAfter,
        config.minClearanceLongM,config.minClearanceLateralM)){safe=false;break;}
      t+=dt;
    }
    if(safe)return {action:'move',targetLateralPositionM:target,
      reason:'Nahe Führung, Prognose der freien Überholspur ohne Konflikt'};
  }
  return {action:'stay',reason:'Keine konfliktfreie Überholspur im Prognosefenster'};
}
