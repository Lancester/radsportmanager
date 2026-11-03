/** R-03G: 3–8 physikalisch gekoppelte Fahrer auf EINER Simulationsuhr.
 * Pedalwatt und feste Spur sind Vorgaben, keine KI-Entscheidungen.
 * Windschatten-Kombination ist vorläufige Heuristik, nicht empirisch kalibriert.
 */
import { advanceMotionStep } from './motion-core.ts';
import {sweptRectCollision,lateralAdvance,detectPasses,R06_LANE_LIMITS} from './lateral-motion.ts';
import type {LaneCommand} from './lateral-motion.ts';
import {emptyFtpWork,accumulateFtpWork,meanCrankPowerW} from '../physiology/ftp-work.ts';
import type {FtpWorkState} from '../physiology/ftp-work.ts';
import {decideGapPower, initialGapState, validateGapConfig, F8_GAP_AGENT} from '../ai/gap-controller.ts';
import {decideOvertakeLane,validateOvertakeAgent,R07_F8_AGENT} from '../ai/overtake-controller.ts';
import type {OvertakeAgentConfig} from '../ai/overtake-controller.ts';
import type {GapAgentConfig, GapAgentState} from '../ai/gap-controller.ts';
import {decideFollowingSafety,validateFollowingSafety} from '../ai/following-safety.ts';
import type {FollowingSafetyOptions} from '../ai/following-safety.ts';
import {applyCpWprimeStep,initialCpState,validateCpProfile,R05_F8_PROFILE} from '../physiology/critical-power.ts';
import type {CpWprimeProfile,CpWprimeState} from '../physiology/critical-power.ts';
import type { CornerRider } from './motion-core.ts';
import { R03_DRAFT, requiredCrankPowerAtSpeedW } from './drafting-pair.ts';
import type { DraftingParameters, PairedRiderInput } from './drafting-pair.ts';

export type GroupRiderInput = PairedRiderInput;
export interface GroupCommand {
  timeS:number; riderId:string; crankPowerW:number;
  /** Explizites Test-Bremskommando, KEIN KI-Spurwechsel. */
  brakeForceN?:number;
}
export interface GroupInput {
  riders: GroupRiderInput[]; durationS: number; stepSeconds?: number;
  sampleEveryS?: number; parameters?: DraftingParameters;
  gapEventThresholdM?: number; commands?: GroupCommand[];
  /** Regelbasierte Agenten (optional); ohne dieses Feld bleibt R-03G unverändert. */
  gapAgents?: GapAgentConfig[];
  agentDecisionEveryS?: number;
  /** Nur bei Angabe wird aktive Abstands-/Bremskontrolle eingeschaltet. */
  followingSafety?: FollowingSafetyOptions;
  /** Nicht angegebene Fahrer behalten das bisherige unbegrenzte Watt-Testmodell. */
  physiology?: CpWprimeProfile[];
  /** Zeitlich vorgegebene Seitenbewegung mit begrenzter Quer-Geschwindigkeit. */
  laneCommands?:LaneCommand[];
  roadHalfWidthM?:number;
  /** Nur bei Angabe entscheidet ein Fahrer selbst über eine einzelne freie Überholspur. */
  overtakeAgents?:OvertakeAgentConfig[];
}
export interface GroupRiderSummary {
  id: string; positionM: number; speedMps: number; lateralPositionM: number;
  crankPowerW: number; aeroLossJ: number; rollingLossJ: number; driveWorkJ: number;
  kineticEnergyChangeJ: number; energyResidualJ: number; shelteredTimeS: number;
  /** Tatsächlich zuletzt vom Agenten gewählte Kurbelwatt, nicht der Basistestbefehl. */
  lastAppliedPowerW: number;
  agentPursuitSeconds: number;
  agentExtraDriveWorkJ: number;
  brakeLossJ: number;
  safetyBrakeSeconds: number;
  cpLimitedSeconds: number;
  wPrimeRemainingJ?: number;
  wPrimeSpentJ?: number;
  wPrimeRecoveredJ?: number;
  averageCrankPowerW?:number;
  timeAboveFtpS?:number;
  workAboveFtpJ?:number;
  autonomousOvertakes?:number;
  autonomousLaneM?:number;
}
export interface GroupSnapshot {
  timeS: number;
  riders: Array<{id: string;positionM: number;speedMps: number;
    lateralPositionM: number;aeroFactor: number}>;
  openGaps: number;
}
export interface GroupEvent {
  timeS: number; type: 'gap-opened' | 'command' | 'agent-decision' | 'safety' | 'cp-limit' | 'lane-command' | 'lane-complete' | 'overtake' | 'agent-lane-choice'; riderId: string;
  leaderId?: string; gapM?: number;
  agentMode?: string; powerW?: number; reason?: string; brakeForceN?: number;
  passedRiderId?:string; lateralPositionM?:number;
}
export interface GroupResult {
  elapsedS: number; steps: number; riders: GroupRiderSummary[];
  snapshots: GroupSnapshot[]; events: GroupEvent[];
}
const finite = (key: string, val: number, ok: boolean): void => {
  if (!Number.isFinite(val) || !ok) throw new RangeError('Ungültiger Wert: ' + key);
};
function checkParameters(p: DraftingParameters): void {
  finite('maximumAeroReduction',p.maximumAeroReduction,p.maximumAeroReduction>=0&&p.maximumAeroReduction<1);
  finite('decayLengthM',p.decayLengthM,p.decayLengthM>0);
  finite('lateralScaleM',p.lateralScaleM,p.lateralScaleM>0);
  finite('minimumCenterDistanceM',p.minimumCenterDistanceM,p.minimumCenterDistanceM>0);
  finite('overtakingLaneSeparationM',p.overtakingLaneSeparationM,p.overtakingLaneSeparationM>0);
}
function checkRider(r: GroupRiderInput, ids: Set<string>): void {
  if (!r || typeof r.id!=='string'||!r.id.trim()||ids.has(r.id)||!r.physical)
    throw new RangeError('Fahrer-ID fehlt, doppelt oder Physikparameter fehlen');
  ids.add(r.id);
  finite('positionM',r.positionM,true);
  finite('speedMps',r.speedMps,r.speedMps>=0&&r.speedMps<100);
  finite('lateralPositionM',r.lateralPositionM,true);
  finite('crankPowerW',r.crankPowerW,r.crankPowerW>=0);
  const p=r.physical;
  finite('riderMassKg',p.riderMassKg,p.riderMassKg>0);
  finite('equipmentMassKg',p.equipmentMassKg,p.equipmentMassKg>=0);
  finite('dragAreaM2',p.dragAreaM2,p.dragAreaM2>0);
  finite('rollingCoefficient',p.rollingCoefficient,p.rollingCoefficient>=0);
  finite('airDensityKgM3',p.airDensityKgM3,p.airDensityKgM3>0);
  finite('drivetrainEfficiency',p.drivetrainEfficiency,p.drivetrainEfficiency>0&&p.drivetrainEfficiency<=1);
  finite('wheelInertiaKgM2',p.wheelInertiaKgM2??0,(p.wheelInertiaKgM2??0)>=0);
  finite('wheelRadiusM',p.wheelRadiusM??0.34,(p.wheelRadiusM??0.34)>0.1);
}
/** Kollision auch bei übersprungenem Überholpunkt innerhalb eines Zeitschritts erkennen. */
function collisionOrOvertake(oldPositions:number[],newPositions:number[],laterals:number[],p:DraftingParameters):boolean {
  for(let i=0;i<oldPositions.length;i++)for(let j=i+1;j<oldPositions.length;j++){
    if(Math.abs(laterals[i]-laterals[j])>=p.overtakingLaneSeparationM)continue;
    const a=oldPositions[i]-oldPositions[j],b=newPositions[i]-newPositions[j];
    if(Math.abs(a)<p.minimumCenterDistanceM-1e-9||
       Math.abs(b)<p.minimumCenterDistanceM-1e-9||a*b<=0)return true;
  }
  return false;
}
/** Wirkung sämtlicher Vorderleute; Schutz höchstens maximumAeroReduction.
 * Näherung: 1 − R_max × (1 − Π_j(1 − Einfluss_j)).
 * Diese Vereinigung ist keine addierte Summe beliebiger Watt-Boni.
 */
export function aeroFactorsForGroup(
  riders:readonly Pick<GroupRiderInput,'positionM'|'lateralPositionM'>[],
  p:DraftingParameters=R03_DRAFT,
):number[]{
  checkParameters(p);
  if(!Array.isArray(riders)||riders.length<1||riders.length>8)
    throw new RangeError('1 bis 8 Fahrerpositionen für diesen Aero-Kontrolltest');
  const positions=riders.map(r=>r?.positionM),laterals=riders.map(r=>r?.lateralPositionM);
  riders.forEach((r,i)=>{
    if(!r)throw new RangeError('Fahrerposition fehlt');
    finite('positionM '+i,r.positionM,true);finite('lateralPositionM '+i,r.lateralPositionM,true);
  });
  if(collisionOrOvertake(positions,positions,laterals,p))
    throw new RangeError('Kollision: überlappende Fahrer derselben Spur');
  return riders.map((r,i)=>{
    let unshielded=1;
    for(let j=0;j<riders.length;j++){
      if(j===i||riders[j].positionM<=r.positionM)continue;
      const distance=riders[j].positionM-r.positionM;
      const freeDistance=Math.max(0,distance-p.minimumCenterDistanceM);
      const offset=Math.abs(riders[j].lateralPositionM-r.lateralPositionM);
      const influence=Math.exp(-freeDistance/p.decayLengthM)*
        Math.exp(-0.5*(offset/p.lateralScaleM)**2);
      unshielded*=1-influence;
    }
    return 1-p.maximumAeroReduction*(1-unshielded);
  });
}
function adjacentGaps(riders:GroupRiderInput[]):Map<string,{leaderId:string;gapM:number}> {
  const sorted=[...riders].sort((a,b)=>b.positionM-a.positionM);
  const gaps=new Map<string,{leaderId:string;gapM:number}>();
  for(let i=1;i<sorted.length;i++)gaps.set(sorted[i].id,{
    leaderId:sorted[i-1].id,gapM:sorted[i-1].positionM-sorted[i].positionM});
  return gaps;
}
/** Nächster Vordermann derselben (vereinfachten) Spur für Agent/Sicherheit.
 * Fahrer auf klar getrennter Spur werden nicht als Hindernis behandelt.
 */
function nearestSameLane(riders:GroupRiderInput[],p:DraftingParameters):
  Map<string,{leaderId:string;gapM:number}> {
  const result=new Map<string,{leaderId:string;gapM:number}>();
  for(const r of riders){
    let best:GroupRiderInput|undefined;
    for(const other of riders){
      if(other.id===r.id||other.positionM<=r.positionM)continue;
      if(Math.abs(other.lateralPositionM-r.lateralPositionM)>=p.overtakingLaneSeparationM)continue;
      if(!best||other.positionM<best.positionM)best=other;
    }
    if(best)result.set(r.id,{leaderId:best.id,gapM:best.positionM-r.positionM});
  }
  return result;
}
function snapshot(t:number,riders:GroupRiderInput[],factors:number[],threshold:number):GroupSnapshot {
  const sorted=[...riders].sort((a,b)=>b.positionM-a.positionM);
  let openGaps=0;
  for(let i=1;i<sorted.length;i++)
    if(sorted[i-1].positionM-sorted[i].positionM>threshold)openGaps++;
  return {timeS:t,riders:riders.map((r,i)=>({id:r.id,positionM:r.positionM,
    speedMps:r.speedMps,lateralPositionM:r.lateralPositionM,aeroFactor:factors[i]})),openGaps};
}
export function simulateGroup(input:GroupInput):GroupResult {
  if(!input||!Array.isArray(input.riders)||input.riders.length<3||input.riders.length>8)
    throw new RangeError('R-03G benötigt 3 bis 8 Fahrer');
  finite('durationS',input.durationS,input.durationS>0&&input.durationS<=1200);
  const stepSeconds=input.stepSeconds??0.2;
  finite('stepSeconds',stepSeconds,stepSeconds>=0.02&&stepSeconds<=1);
  const sampleEveryS=input.sampleEveryS??5;
  finite('sampleEveryS',sampleEveryS,sampleEveryS>0&&sampleEveryS<=300);
  const params=input.parameters??R03_DRAFT;
  checkParameters(params);
  const threshold=input.gapEventThresholdM??8;
  finite('gapEventThresholdM',threshold,threshold>params.minimumCenterDistanceM);
  const ids=new Set<string>(),riders=input.riders.map(r=>structuredClone(r));
  riders.forEach(r=>checkRider(r,ids));
  const commands=[...(input.commands??[])].sort((a,b)=>a.timeS-b.timeS);
  const roadHalfWidthM=input.roadHalfWidthM??R06_LANE_LIMITS.roadHalfWidthM;
  finite('roadHalfWidthM',roadHalfWidthM,roadHalfWidthM>=1&&roadHalfWidthM<=10);
  const laneCommands=[...(input.laneCommands??[])].sort((a,b)=>a.timeS-b.timeS);
  const laneTargets=new Map<string,{target:number;rate:number}>();
  for(const lane of laneCommands){
    if(!ids.has(lane.riderId))throw new RangeError('Unbekannter Spurfahrauftrag');
    finite('lane.timeS',lane.timeS,lane.timeS>=0&&lane.timeS<=input.durationS);
    finite('lane.target',lane.targetLateralPositionM,
      Math.abs(lane.targetLateralPositionM)<=roadHalfWidthM);
    const rate=lane.maxLateralSpeedMps??R06_LANE_LIMITS.defaultLateralSpeedMps;
    finite('lane.maxLateralSpeedMps',rate,rate>0&&rate<=2.5);
  }
  if(input.laneCommands){
    for(const r of riders)finite('Anfangsposition ausserhalb Straße',
      r.lateralPositionM,Math.abs(r.lateralPositionM)<=roadHalfWidthM);
  }
  const externalBrakes=new Map<string,number>();
  const autoLanes=new Map<string,{
    config:OvertakeAgentConfig;mode:'search'|'moving'|'passing';target?:number
  }>();
  for(const config of input.overtakeAgents??[]){
    validateOvertakeAgent(config);
    if(!ids.has(config.riderId)||autoLanes.has(config.riderId))
      throw new RangeError('Unbekannter oder doppelter Überholagent');
    autoLanes.set(config.riderId,{config,mode:'search'});
  }
  if(autoLanes.size&&input.laneCommands?.some(c=>autoLanes.has(c.riderId)))
    throw new RangeError('Kein externer Spurauftrag für autonom fahrenden Agenten');
  const agentEveryS=input.agentDecisionEveryS??1;
  finite('agentDecisionEveryS',agentEveryS,agentEveryS>=0.2&&agentEveryS<=10);
  const agentConfigs=input.gapAgents??[];
  if(!Array.isArray(agentConfigs))throw new RangeError('gapAgents muss eine Liste sein');
  const controllers=new Map<string,{config:GapAgentConfig;state:GapAgentState;powerW:number}>();
  for(const config of agentConfigs){
    validateGapConfig(config);
    if(!ids.has(config.riderId)||controllers.has(config.riderId))
      throw new RangeError('Unbekannter oder doppelter Fahrer-Agent');
    const rider=riders.find(r=>r.id===config.riderId)!;
    if(config.maxPursuitPowerW<rider.crankPowerW)
      throw new RangeError('Agenten-Höchstleistung unter der aktuellen Basisleistung');
    controllers.set(config.riderId,{config,state:initialGapState(),powerW:rider.crankPowerW});
  }
  if(input.followingSafety) validateFollowingSafety(input.followingSafety);
  const physiology=new Map<string,{profile:CpWprimeProfile;state:CpWprimeState;limited:boolean}>();
  for(const profile of input.physiology??[]){
    validateCpProfile(profile);
    if(!ids.has(profile.riderId)||physiology.has(profile.riderId))
      throw new RangeError('Unbekanntes oder doppeltes CP/Wprime-Profil');
    physiology.set(profile.riderId,{profile,state:initialCpState(profile),limited:false});
  }
  const safetyState=new Map<string,boolean>();
  const ftpStats=new Map<string,FtpWorkState>();
  for(const [id,p] of physiology)if(p.profile.ftpW!==undefined)
    ftpStats.set(id,emptyFtpWork());
  for(const c of commands){
    if(!ids.has(c.riderId))throw new RangeError('Unbekannte Fahrer-ID im Befehl');
    finite('command.timeS',c.timeS,c.timeS>=0&&c.timeS<=input.durationS);
    finite('command.crankPowerW',c.crankPowerW,c.crankPowerW>=0);
    if(c.brakeForceN!==undefined)
      finite('command.brakeForceN',c.brakeForceN,c.brakeForceN>=0&&c.brakeForceN<=1500);
  }
  aeroFactorsForGroup(riders,params);
  const summaries:GroupRiderSummary[]=riders.map(r=>({
    id:r.id,positionM:r.positionM,speedMps:r.speedMps,
    lateralPositionM:r.lateralPositionM,crankPowerW:r.crankPowerW,
    driveWorkJ:0,aeroLossJ:0,rollingLossJ:0,kineticEnergyChangeJ:0,
    energyResidualJ:0,shelteredTimeS:0,lastAppliedPowerW:r.crankPowerW,
    agentPursuitSeconds:0,agentExtraDriveWorkJ:0,
    brakeLossJ:0,safetyBrakeSeconds:0,cpLimitedSeconds:0,
    ...(physiology.has(r.id)?{
      wPrimeRemainingJ:physiology.get(r.id)!.state.remainingWPrimeJ,
      wPrimeSpentJ:0,wPrimeRecoveredJ:0}:{}),
    ...(ftpStats.has(r.id)?{averageCrankPowerW:0,timeAboveFtpS:0,workAboveFtpJ:0}:{}),
    ...(autoLanes.has(r.id)?{autonomousOvertakes:0}:{}),
  }));
  const events:GroupEvent[]=[],snapshots:GroupSnapshot[]=[];
  let t=0,steps=0,nextSample=sampleEveryS,cmdIndex=0,laneCmdIndex=0;
  let nextAgentDecision=(controllers.size||autoLanes.size)?0:Infinity;
  while(t<input.durationS-1e-10){
    while(cmdIndex<commands.length&&commands[cmdIndex].timeS<=t+1e-10){
      const cmd=commands[cmdIndex++],index=riders.findIndex(r=>r.id===cmd.riderId);
      riders[index].crankPowerW=cmd.crankPowerW;
      if(cmd.brakeForceN!==undefined)externalBrakes.set(cmd.riderId,cmd.brakeForceN);
      events.push({timeS:t,type:'command',riderId:cmd.riderId});
    }
    while(laneCmdIndex<laneCommands.length&&laneCommands[laneCmdIndex].timeS<=t+1e-9){
      const cmd=laneCommands[laneCmdIndex++];
      laneTargets.set(cmd.riderId,{target:cmd.targetLateralPositionM,
        rate:cmd.maxLateralSpeedMps??R06_LANE_LIMITS.defaultLateralSpeedMps});
      events.push({timeS:t,type:'lane-command',riderId:cmd.riderId,
        lateralPositionM:cmd.targetLateralPositionM});
    }
    if((controllers.size||autoLanes.size) && nextAgentDecision<=t+1e-9){
      const gaps=nearestSameLane(riders,params);
      const byId=new Map(riders.map(r=>[r.id,r]));
      for(const r of riders){
        const controller=controllers.get(r.id);
        if(!controller)continue;
        const nearest=gaps.get(r.id);
        const leader=nearest?byId.get(nearest.leaderId):undefined;
        const decision=decideGapPower(controller.config,{
          timeS:t, gapM:nearest?.gapM??null,
          leaderSpeedMps:leader?.speedMps??null,
          ownSpeedMps:r.speedMps,basePowerW:r.crankPowerW,
        },controller.state);
        controller.state=decision.state;
        controller.powerW=decision.powerW;
        if(decision.stateChanged)events.push({timeS:t,type:'agent-decision',riderId:r.id,
          leaderId:leader?.id,gapM:nearest?.gapM,
          agentMode:decision.state.mode,powerW:decision.powerW,reason:decision.reason});
      }
      for(const r of riders){
        const auto=autoLanes.get(r.id);
        if(!auto||auto.mode!=='search')continue;
        const decision=decideOvertakeLane(auto.config,{
          riders,roadHalfWidthM
        });
        if(decision.action==='move'){
          laneTargets.set(r.id,{target:decision.targetLateralPositionM,
            rate:auto.config.maxLateralSpeedMps});
          auto.mode='moving';auto.target=decision.targetLateralPositionM;
          events.push({timeS:t,type:'agent-lane-choice',riderId:r.id,
            lateralPositionM:decision.targetLateralPositionM,reason:decision.reason});
        }
      }
      // Dieselbe Uhr für Lücken- und Spur-Agenten, kein versteckter zweiter Solver.
      nextAgentDecision+=agentEveryS;
    }
    const factors=aeroFactorsForGroup(riders,params);
    if(steps===0)snapshots.push(snapshot(t,riders,factors,threshold));
    const nextCommand=commands[cmdIndex]?.timeS??Infinity;
    const nextLane=laneCommands[laneCmdIndex]?.timeS??Infinity;
    const dt=Math.min(stepSeconds,input.durationS-t,nextCommand-t,nextLane-t,
      nextSample-t,nextAgentDecision-t);
    if(!(dt>1e-11)){
      if(nextSample<=t+1e-10){nextSample+=sampleEveryS;continue;}
      throw new RangeError('Zeitschritt unter numerischer Grenze');
    }
    const previous=adjacentGaps(riders);
    const sameLaneBefore=nearestSameLane(riders,params);
    // ZUERST entscheiden alle Fahrer aus demselben alten Zustand.
    // Sicherheitsbefehle übersteuern den Agenten, CP/W′ limitiert danach.
    const currentById=new Map(riders.map(r=>[r.id,r]));
    const actualPowers:number[]=[];
    const appliedBrakes:number[]=[];
    for(const r of riders){
      let requestedPowerW=controllers.get(r.id)?.powerW??r.crankPowerW;
      const auto=autoLanes.get(r.id);
      if(auto?.mode==='passing')requestedPowerW=Math.max(
        requestedPowerW,auto.config.attackPowerW);
      let brakeForceN=externalBrakes.get(r.id)??0;
      if(brakeForceN>0)requestedPowerW=0;
      if(input.followingSafety){
        const ahead=sameLaneBefore.get(r.id);
        const leader=ahead?currentById.get(ahead.leaderId):undefined;
        if(ahead&&leader&&
           Math.abs(leader.lateralPositionM-r.lateralPositionM)<
             params.overtakingLaneSeparationM){
          const decision=decideFollowingSafety({
            centerGapM:ahead.gapM,ownSpeedMps:r.speedMps,
            leaderSpeedMps:leader.speedMps,
            massKg:r.physical.riderMassKg+r.physical.equipmentMassKg,
            ...((externalBrakes.get(leader.id)??0)>0?{
              leaderDecelerationMps2:(externalBrakes.get(leader.id)??0)/
                (leader.physical.riderMassKg+leader.physical.equipmentMassKg)
            }:{}),
          },input.followingSafety);
          if(decision.tooLateToGuarantee)
            throw new RangeError('Bremsweg unzureichend: '+r.id+' folgt '+leader.id);
          if(!decision.powerAllowed)requestedPowerW=0;
          brakeForceN=Math.max(brakeForceN,decision.brakeForceN);
          const engaged=!decision.powerAllowed||brakeForceN>0;
          if(engaged!==Boolean(safetyState.get(r.id))){
            events.push({timeS:t,type:'safety',riderId:r.id,
              leaderId:leader.id,gapM:ahead.gapM,powerW:requestedPowerW,
              brakeForceN,reason:decision.reason});
            safetyState.set(r.id,engaged);
          }
        }
      }
      const phys=physiology.get(r.id);
      if(phys){
        const result=applyCpWprimeStep(phys.profile,phys.state,requestedPowerW,dt);
        phys.state=result.state;requestedPowerW=result.appliedPowerW;
        if(result.limited!==phys.limited){
          events.push({timeS:t,type:'cp-limit',riderId:r.id,
            powerW:requestedPowerW,
            reason:result.limited?'Wprime erschöpft: Leistung gedrosselt':'Leistungsreserve wieder verfügbar'});
          phys.limited=result.limited;
        }
      }
      actualPowers.push(requestedPowerW);appliedBrakes.push(brakeForceN);
    }
    // Physik EINES unveränderten Integrators, inklusive mechanischer Bremsarbeit.
    const changes=riders.map((r,i)=>advanceMotionStep({
      speedMps:r.speedMps,stepSeconds:dt,crankPowerW:actualPowers[i],
      brakeForceN:appliedBrakes[i],
      rider:r.physical,gradeFraction:0,aeroFactor:factors[i],
    }));
    const oldPositions=riders.map(r=>r.positionM);
    const laterals=riders.map(r=>r.lateralPositionM);
    const newPositions=riders.map((r,i)=>r.positionM+changes[i].distanceM);
    const newLaterals=riders.map(r=>{
      const lane=laneTargets.get(r.id);
      return lane ? lateralAdvance(r.lateralPositionM,lane.target,
        lane.rate,dt,roadHalfWidthM) : r.lateralPositionM;
    });
    if(sweptRectCollision(oldPositions,newPositions,laterals,newLaterals,
      params.minimumCenterDistanceM,params.overtakingLaneSeparationM))
      throw new RangeError('Kollision bei dynamischer Quer- oder Längsbewegung');
    const passes=detectPasses(riders.map(r=>r.id),oldPositions,newPositions,
      laterals,newLaterals,params.overtakingLaneSeparationM);
    for(let i=0;i<riders.length;i++){
      const r=riders[i],u=changes[i],s=summaries[i];
      r.positionM=newPositions[i];r.speedMps=u.endSpeedMps;
      const lane=laneTargets.get(r.id);
      if(lane&&Math.abs(newLaterals[i]-lane.target)<1e-9&&
         Math.abs(r.lateralPositionM-lane.target)>1e-9){
        events.push({timeS:t+dt,type:'lane-complete',riderId:r.id,
          lateralPositionM:lane.target});
        laneTargets.delete(r.id);
        const auto=autoLanes.get(r.id);
        if(auto?.mode==='moving'&&Math.abs(auto.target!-lane.target)<1e-9){
          auto.mode='passing';
          s.autonomousLaneM=lane.target;
        }
      }
      r.lateralPositionM=newLaterals[i];
      s.lateralPositionM=r.lateralPositionM;
      s.driveWorkJ+=u.driveWorkJ;s.aeroLossJ+=u.aeroLossJ;
      s.brakeLossJ+=u.brakeLossJ;
      if(appliedBrakes[i]>0)s.safetyBrakeSeconds+=dt;
      const cp=physiology.get(r.id);
      if(cp){
        s.cpLimitedSeconds=cp.state.powerLimitedSeconds;
        s.wPrimeRemainingJ=cp.state.remainingWPrimeJ;
        s.wPrimeSpentJ=cp.state.spentAboveCpJ;
        s.wPrimeRecoveredJ=cp.state.recoveredJ;
      }
      const ftp=ftpStats.get(r.id);
      if(ftp&&cp?.profile.ftpW!==undefined){
        const next=accumulateFtpWork(ftp,actualPowers[i],cp.profile.ftpW,dt);
        ftpStats.set(r.id,next);
        s.averageCrankPowerW=meanCrankPowerW(next);
        s.timeAboveFtpS=next.secondsAboveFtp;
        s.workAboveFtpJ=next.workAboveFtpJ;
      }
      s.rollingLossJ+=u.rollingLossJ;s.kineticEnergyChangeJ+=u.kineticEnergyChangeJ;
      s.energyResidualJ+=u.energyResidualJ;
      if(factors[i]<1-1e-6)s.shelteredTimeS+=dt;
      const controller=controllers.get(r.id);
      if(controller){
        s.lastAppliedPowerW=actualPowers[i];
        if(controller.state.mode==='nachsetzen'){
          controller.state.pursuitSeconds+=dt;
          s.agentPursuitSeconds+=dt;
          // Überschussarbeit am Antrieb nur als Näherungsdiagnose:
          // genaue Differenz zum Baseline-Rennen ist separat zu vergleichen.
          const extra=Math.max(0,actualPowers[i]-r.crankPowerW);
          s.agentExtraDriveWorkJ+=extra*r.physical.drivetrainEfficiency*dt;
        }
      } else s.lastAppliedPowerW=actualPowers[i];
    }
    t+=dt;steps++;
    for(const pass of passes){
      events.push({timeS:t,type:'overtake',
        riderId:pass.riderId,passedRiderId:pass.passedRiderId});
      const s=summaries.find(x=>x.id===pass.riderId);
      if(s&&autoLanes.has(pass.riderId))
        s.autonomousOvertakes=(s.autonomousOvertakes??0)+1;
    }
    const nextGaps=adjacentGaps(riders);
    for(const [id,gap] of nextGaps){
      const was=previous.get(id);
      if(gap.gapM>threshold&&(!was||was.gapM<=threshold))
        events.push({timeS:t,type:'gap-opened',riderId:id,
          leaderId:gap.leaderId,gapM:gap.gapM});
    }
    if(t>=nextSample-1e-10||t>=input.durationS-1e-10){
      snapshots.push(snapshot(t,riders,aeroFactorsForGroup(riders,params),threshold));
      nextSample+=sampleEveryS;
    }
    if(steps>200_000)throw new RangeError('Schrittlimit erreicht');
  }
  for(const [i,r] of riders.entries()){
    summaries[i].positionM=r.positionM;summaries[i].speedMps=r.speedMps;
    summaries[i].crankPowerW=r.crankPowerW;
  }
  return {elapsedS:t,steps,riders:summaries,snapshots,events};
}
/** Acht Fahrer in einer Reihe, initial 39,6 km/h.
 * Extern festgelegtes Testereignis: Fahrer F8 reduziert ab Sekunde 30
 * um 45 Watt. Keine KI entscheidet das.
 */
export function createEightRiderExample(durationS=120):GroupInput {
  const physical:CornerRider={riderMassKg:72,equipmentMassKg:8,dragAreaM2:0.30,
    rollingCoefficient:0.004,airDensityKgM3:1.2,drivetrainEfficiency:0.975};
  const riders:GroupRiderInput[]=Array.from({length:8},(_,i)=>({
    id:'F'+(i+1),physical:{...physical},positionM:(7-i)*3.4,
    speedMps:11,lateralPositionM:0,crankPowerW:0,
  }));
  const factors=aeroFactorsForGroup(riders);
  riders.forEach((r,i)=>{
    r.crankPowerW=requiredCrankPowerAtSpeedW(physical,11,factors[i]).crankPowerW;
  });
  return {riders,durationS,stepSeconds:0.2,sampleEveryS:5,
    gapEventThresholdM:8,commands:[{timeS:30,riderId:'F8',
      crankPowerW:riders[7].crankPowerW-45}]};
}

/** Gleiche physikalische Ausgangslage wie R-03G, aber F8 hat jetzt
 * einen kleinen, selbst entscheidenden regelbasierten Lückenagenten.
 * Einziger Eingriff des Agenten: befohlene Kurbelwatt innerhalb der Limits.
 */
export function createEightRiderAgentExample(durationS=120):GroupInput {
  const input=createEightRiderExample(durationS);
  return {...input,gapAgents:[{...F8_GAP_AGENT}],agentDecisionEveryS:1};
}

/** Vorläufiger kombinierter R-05-Test: F8 mit Entscheidung, Sicherheitsregler
 * und eigenständiger CP/W′-Reserve; FTP separat als späteres Trainingsattribut.
 */
export function createEightRiderR05Example(durationS=120):GroupInput {
  const input=createEightRiderAgentExample(durationS);
  return {...input,followingSafety:{
    minimumCenterGapM:1.8,desiredExtraGapM:0.7,reactionSeconds:0.25,
    maximumDecelerationMps2:3,approachTimeS:1,
  },physiology:[{...R05_F8_PROFILE}]};
}

/** Demonstration einer physisch stetigen, von außen vorgegebenen Überholspur.
 * F8 wechselt zunächst auf die freie, rechte Spur und erhöht erst danach
 * seine Watt. Weder ein Spur-Agent noch eine 2D-Kurvenphysik sind enthalten.
 */
export function createEightRiderPassExample(durationS=65):GroupInput {
  const example=createEightRiderExample(durationS);
  return {...example,commands:[{timeS:10,riderId:'F8',crankPowerW:500}],
    laneCommands:[{timeS:3,riderId:'F8',targetLateralPositionM:2,
      maxLateralSpeedMps:0.8}],roadHalfWidthM:3};
}

/** R-07: F8 sieht selbst eine nahe Führung, prüft (+2 m/-2 m) und
 * fordert erst NACH vollendetem Spurwechsel mehr Watt an.
 * CP=300 W/W′=12 kJ/FTP=285 W: frei erfundene Demonstrationswerte.
 * Keine echte Fahrertechnik-/Kurvenauslegung, kein automatisches Wiedereinscheren.
 */
export function createEightRiderAutoPassExample(durationS=65):GroupInput {
  const input=createEightRiderExample(durationS);
  return {...input,commands:[],gapAgents:[],
    followingSafety:undefined,
    overtakeAgents:[{...R07_F8_AGENT,candidateLanesM:[...R07_F8_AGENT.candidateLanesM]}],
    physiology:[{riderId:'F8',criticalPowerW:300,ftpW:285,
      wPrimeCapacityJ:12000,recoveryEfficiency:0.3}],
    roadHalfWidthM:3};
}
/** Kontrolllauf: gleiche CP/W′-Reserve, exakt dieselben Watt- und Spurvorgaben,
 * aber via externem Zeitplan statt autonomer Spurentscheidung.
 */
export function createEightRiderTimedPassWithCpExample(durationS=65):GroupInput {
  const input=createEightRiderAutoPassExample(durationS);
  return {...input,overtakeAgents:[],laneCommands:[{
    timeS:0,riderId:'F8',targetLateralPositionM:2,maxLateralSpeedMps:0.8,
  }],commands:[{timeS:2.5,riderId:'F8',crankPowerW:360}]};
}
