/** R-03G: 3–8 physikalisch gekoppelte Fahrer auf EINER Simulationsuhr.
 * Pedalwatt und feste Spur sind Vorgaben, keine KI-Entscheidungen.
 * Windschatten-Kombination ist vorläufige Heuristik, nicht empirisch kalibriert.
 */
import { advanceMotionStep } from './motion-core.ts';
import {decideGapPower, initialGapState, validateGapConfig} from '../ai/gap-controller.ts';
import type {GapAgentConfig, GapAgentState} from '../ai/gap-controller.ts';
import type { CornerRider } from './motion-core.ts';
import { R03_DRAFT, requiredCrankPowerAtSpeedW } from './drafting-pair.ts';
import type { DraftingParameters, PairedRiderInput } from './drafting-pair.ts';

export type GroupRiderInput = PairedRiderInput;
export interface GroupCommand { timeS: number; riderId: string; crankPowerW: number }
export interface GroupInput {
  riders: GroupRiderInput[]; durationS: number; stepSeconds?: number;
  sampleEveryS?: number; parameters?: DraftingParameters;
  gapEventThresholdM?: number; commands?: GroupCommand[];
  /** Regelbasierte Agenten (optional); ohne dieses Feld bleibt R-03G unverändert. */
  gapAgents?: GapAgentConfig[];
  agentDecisionEveryS?: number;
}
export interface GroupRiderSummary {
  id: string; positionM: number; speedMps: number; lateralPositionM: number;
  crankPowerW: number; aeroLossJ: number; rollingLossJ: number; driveWorkJ: number;
  kineticEnergyChangeJ: number; energyResidualJ: number; shelteredTimeS: number;
  /** Tatsächlich zuletzt vom Agenten gewählte Kurbelwatt, nicht der Basistestbefehl. */
  lastAppliedPowerW: number;
  agentPursuitSeconds: number;
  agentExtraDriveWorkJ: number;
}
export interface GroupSnapshot {
  timeS: number;
  riders: Array<{id: string;positionM: number;speedMps: number;
    lateralPositionM: number;aeroFactor: number}>;
  openGaps: number;
}
export interface GroupEvent {
  timeS: number; type: 'gap-opened' | 'command' | 'agent-decision'; riderId: string;
  leaderId?: string; gapM?: number;
  agentMode?: string; powerW?: number; reason?: string;
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
  for(const c of commands){
    if(!ids.has(c.riderId))throw new RangeError('Unbekannte Fahrer-ID im Befehl');
    finite('command.timeS',c.timeS,c.timeS>=0&&c.timeS<=input.durationS);
    finite('command.crankPowerW',c.crankPowerW,c.crankPowerW>=0);
  }
  aeroFactorsForGroup(riders,params);
  const summaries:GroupRiderSummary[]=riders.map(r=>({
    id:r.id,positionM:r.positionM,speedMps:r.speedMps,
    lateralPositionM:r.lateralPositionM,crankPowerW:r.crankPowerW,
    driveWorkJ:0,aeroLossJ:0,rollingLossJ:0,kineticEnergyChangeJ:0,
    energyResidualJ:0,shelteredTimeS:0,lastAppliedPowerW:r.crankPowerW,
    agentPursuitSeconds:0,agentExtraDriveWorkJ:0,
  }));
  const events:GroupEvent[]=[],snapshots:GroupSnapshot[]=[];
  let t=0,steps=0,nextSample=sampleEveryS,cmdIndex=0;
  let nextAgentDecision=controllers.size?0:Infinity;
  while(t<input.durationS-1e-10){
    while(cmdIndex<commands.length&&commands[cmdIndex].timeS<=t+1e-10){
      const cmd=commands[cmdIndex++],index=riders.findIndex(r=>r.id===cmd.riderId);
      riders[index].crankPowerW=cmd.crankPowerW;
      events.push({timeS:t,type:'command',riderId:cmd.riderId});
    }
    if(controllers.size && nextAgentDecision<=t+1e-9){
      const gaps=adjacentGaps(riders);
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
      // Kein zweiter, vom Bewegungsintegrator unabhängiger Zeitschritt.
      nextAgentDecision+=agentEveryS;
    }
    const factors=aeroFactorsForGroup(riders,params);
    if(steps===0)snapshots.push(snapshot(t,riders,factors,threshold));
    const nextCommand=commands[cmdIndex]?.timeS??Infinity;
    const dt=Math.min(stepSeconds,input.durationS-t,nextCommand-t,nextSample-t,
      nextAgentDecision-t);
    if(!(dt>1e-11)){
      if(nextSample<=t+1e-10){nextSample+=sampleEveryS;continue;}
      throw new RangeError('Zeitschritt unter numerischer Grenze');
    }
    const previous=adjacentGaps(riders);
    // Alle acht Fahrer aus demselben Zustand berechnen, DANN gleichzeitig übernehmen.
    const changes=riders.map((r,i)=>advanceMotionStep({
      speedMps:r.speedMps,stepSeconds:dt,
      crankPowerW:controllers.get(r.id)?.powerW??r.crankPowerW,
      rider:r.physical,gradeFraction:0,aeroFactor:factors[i],
    }));
    const oldPositions=riders.map(r=>r.positionM);
    const laterals=riders.map(r=>r.lateralPositionM);
    const newPositions=riders.map((r,i)=>r.positionM+changes[i].distanceM);
    if(collisionOrOvertake(oldPositions,newPositions,laterals,params))
      throw new RangeError('Kollision: kein automatisches Überholen in gleicher Spur');
    for(let i=0;i<riders.length;i++){
      const r=riders[i],u=changes[i],s=summaries[i];
      r.positionM=newPositions[i];r.speedMps=u.endSpeedMps;
      s.driveWorkJ+=u.driveWorkJ;s.aeroLossJ+=u.aeroLossJ;
      s.rollingLossJ+=u.rollingLossJ;s.kineticEnergyChangeJ+=u.kineticEnergyChangeJ;
      s.energyResidualJ+=u.energyResidualJ;
      if(factors[i]<1-1e-6)s.shelteredTimeS+=dt;
      const controller=controllers.get(r.id);
      if(controller){
        s.lastAppliedPowerW=controller.powerW;
        if(controller.state.mode==='nachsetzen'){
          controller.state.pursuitSeconds+=dt;
          s.agentPursuitSeconds+=dt;
          // Überschussarbeit am Antrieb nur als Näherungsdiagnose:
          // genaue Differenz zum Baseline-Rennen ist separat zu vergleichen.
          const extra=Math.max(0,controller.powerW-r.crankPowerW);
          s.agentExtraDriveWorkJ+=extra*r.physical.drivetrainEfficiency*dt;
        }
      } else s.lastAppliedPowerW=r.crankPowerW;
    }
    t+=dt;steps++;
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
