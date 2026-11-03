/**
 * R-09 – erster vollständig durchgerechneter Rennprototyp.
 *
 * BEWUSSTE SKALENTRENNUNG:
 *  - 3–8-Fahrer-Detailexperimente bleiben in physics/drafting-group.ts.
 *  - Hier benutzen 2–60 Fahrer eine abstrakte, gemeinsame Rennstrecke.
 *  - Keine millimetergenaue Lenkung, keine simulierte Kollision/Spurwahl.
 *  - Geschwindigkeit/Steigung/Antriebsarbeit weiterhin aus motion-core.ts,
 *    Leistungsreserve aus physiology/critical-power.ts.
 *  - KI über Teamleitlinie / Fahrerrolle, keine Ergebnislotterie.
 */
import {advanceMotionStep} from '../physics/motion-core.ts';
import type {CornerRider} from '../physics/motion-core.ts';
import {initialCpState,applyCpWprimeStep} from '../physiology/critical-power.ts';
import type {CpWprimeState,CpWprimeProfile} from '../physiology/critical-power.ts';
import {chooseRacePower,stabilizeRaceDecision} from './race-tactics.ts';
import {decidePackInstruction,pelotonGroups} from './peloton.ts';
import {formationAeroFactors} from './formation-aero.ts';
import type {RaceRole,RaceStrategy,RaceIntent,TacticDecision} from './race-tactics.ts';

export interface RaceSegment {
  name:string; lengthM:number; gradeFraction:number;
  /** 0..1; in technischer Abfahrt senkt Fahrtechnik das nötige Bremstempo. */
  descentTechnicality:number;
}
export interface RaceTeam {
  id:string;name:string;strategy:RaceStrategy;
}
export interface RaceRider {
  id:string;name:string;teamId:string;role:RaceRole;
  criticalPowerW:number;ftpW:number;wPrimeJ:number;
  massKg:number;bikeMassKg:number;dragAreaM2:number;
  descentSkill:number;sprintSkill:number;aggression:number;
}
export interface RaceInput {
  title:string;
  segments:RaceSegment[];teams:RaceTeam[];riders:RaceRider[];
  seed:number;
  /** Standard: Formations-Windschatten. 'legacy' bewahrt den R-10-Vergleich.
   * 'formation-experiment' bleibt als Alias für R-12-Vergleichsdaten erhalten. */
  aeroModel?:'formation'|'legacy'|'formation-experiment';
  stepSeconds?:number;
  maxRaceTimeS?:number;
}
export type RaceEventType =
  'start'|'attack'|'chase'|'sprint'|'recovery'|'segment'|'group-split'|'breakaway'|'breakaway-caught'|'finish';
export interface RaceEvent {
  timeS:number;km:number;type:RaceEventType;
  riderId?:string;teamId?:string;description:string;
  /** Abstandsereignisse behalten den tatsächlich gemessenen Gruppenspalt. */
  gapM?:number;
}
export interface RaceSnapshot {
  timeS:number;km:number;leaderId:string;activeRiders:number;
  groupSizes:number[];leadingGapM:number;
}
export interface RaceClassification {
  rank:number;id:string;name:string;teamId:string;role:RaceRole;
  finishTimeS:number;gapS:number;averageCrankPowerW:number;
  finalWPrimeJ:number;spentWPrimeJ:number;recoveredWPrimeJ:number;
  distanceM:number;finalSpeedKmh:number;peakSpeedKmh:number;
  brakeLossJ:number;driveWorkJ:number;energyResidualJ:number;
}
export interface RaceResult {
  title:string;distanceM:number;durationS:number;steps:number;seed:number;
  classification:RaceClassification[];
  events:RaceEvent[];snapshots:RaceSnapshot[];
  winnerId:string;finisherCount:number;
  /** Klein gehaltene, überprüfbare Testdiagnosen. */
  diagnostics:{attacks:number;chases:number;sprints:number;
    groupSplits:number;maximumGroups:number;teams:number;
    breakaways:number;caughtBreakaways:number;paceSupportSteps:number;
    meanAeroFactor:number;minimumAeroFactor:number};
}
interface State {
  rider:RaceRider;physical:CornerRider;profile:CpWprimeProfile;
  physiology:CpWprimeState;dayCpW:number;positionM:number;
  speedMps:number;peakMps:number;finishTimeS:number|null;
  segmentIndex:number;decision:TacticDecision;intent:RaceIntent;
  driveWorkJ:number;brakeLossJ:number;energyResidualJ:number;
  crankWorkJ:number;intentSinceS:number;lastChaseEndS:number;
}
const ensure=(label:string,n:number,condition:boolean)=>{
  if(!Number.isFinite(n)||!condition)throw new RangeError('Rennsimulation: '+label);
};
function hashForm(seed:number,id:string):number {
  let h=(seed>>>0)^2166136261;
  for(let i=0;i<id.length;i++){
    h=Math.imul(h^id.charCodeAt(i),16777619)>>>0;
  }
  h^=h>>>16;h=Math.imul(h,2246822507)>>>0;
  return 0.98+0.04*(h/4294967296);
}
export function validateRace(x:RaceInput):void {
  if(!x||typeof x.title!=='string'||!x.title.trim())throw new RangeError('Rennsimulation: Renntitel fehlt');
  if(!Array.isArray(x.segments)||x.segments.length<1||x.segments.length>60)
    throw new RangeError('Rennsimulation: 1–60 Streckenabschnitte');
  let totalM=0;
  for(const s of x.segments){
    if(!s||typeof s.name!=='string'||!s.name.trim())
      throw new RangeError('Rennsimulation: Abschnittname');
    ensure('Länge',s.lengthM,s.lengthM>=100&&s.lengthM<=100000);
    ensure('Steigung',s.gradeFraction,Math.abs(s.gradeFraction)<=0.20);
    ensure('Abfahrtskomplexität',s.descentTechnicality,
      s.descentTechnicality>=0&&s.descentTechnicality<=1);
    totalM+=s.lengthM;
  }
  ensure('Gesamtstrecke',totalM,totalM>=1000&&totalM<=300000);
  if(!Array.isArray(x.teams)||x.teams.length<1||x.teams.length>30||
     !Array.isArray(x.riders)||x.riders.length<2||x.riders.length>60)
    throw new RangeError('Rennsimulation: 1–30 Teams und 2–60 Fahrer');
  const teamIds=new Set<string>();
  for(const t of x.teams){
    if(!t||typeof t.id!=='string'||!t.id.trim()||teamIds.has(t.id)||
       typeof t.name!=='string'||!t.name.trim()||
       !['ausgewogen','offensiv','sprint','kapitaen_schuetzen'].includes(t.strategy))
      throw new RangeError('Rennsimulation: Team oder Leitlinie ungültig');
    teamIds.add(t.id);
  }
  const riderIds=new Set<string>();
  for(const r of x.riders){
    if(!r||typeof r.id!=='string'||!r.id.trim()||riderIds.has(r.id)||
       typeof r.name!=='string'||!r.name.trim()||!teamIds.has(r.teamId)||
       !['kapitaen','sprinter','helfer'].includes(r.role))
      throw new RangeError('Rennsimulation: Fahrerprofil oder Teamzuordnung');
    riderIds.add(r.id);
    ensure('CP',r.criticalPowerW,r.criticalPowerW>=100&&r.criticalPowerW<=700);
    ensure('FTP',r.ftpW,r.ftpW>=100&&r.ftpW<=700);
    ensure('W′',r.wPrimeJ,r.wPrimeJ>=1000&&r.wPrimeJ<=100000);
    ensure('Fahrermasse',r.massKg,r.massKg>=40&&r.massKg<=130);
    ensure('Radmasse',r.bikeMassKg,r.bikeMassKg>=4&&r.bikeMassKg<=20);
    ensure('CdA',r.dragAreaM2,r.dragAreaM2>=0.16&&r.dragAreaM2<=0.55);
    for(const k of ['descentSkill','sprintSkill','aggression'] as const)
      ensure(k,r[k],r[k]>=0&&r[k]<=1);
  }
  if(x.aeroModel!==undefined &&
    x.aeroModel!=='legacy'&&x.aeroModel!=='formation'&&
    x.aeroModel!=='formation-experiment')
    throw new RangeError('Rennsimulation: aeroModel ungültig');
  if(!Number.isSafeInteger(x.seed)||x.seed<0||x.seed>2147483647)
    throw new RangeError('Rennsimulation: Seed (0..2^31−1)');
  ensure('stepSeconds',x.stepSeconds??1,(x.stepSeconds??1)>=0.2&&(x.stepSeconds??1)<=1);
  ensure('maxRaceTimeS',x.maxRaceTimeS??30000,
    (x.maxRaceTimeS??30000)>=300&&(x.maxRaceTimeS??30000)<=60000);
}
function buildStates(x:RaceInput):State[] {
  return [...x.riders].sort((a,b)=>a.id.localeCompare(b.id)).map(r=>{
    const dayCpW=r.criticalPowerW*hashForm(x.seed,r.id);
    const profile:CpWprimeProfile={
      riderId:r.id,criticalPowerW:dayCpW,wPrimeCapacityJ:r.wPrimeJ,
      ftpW:r.ftpW,recoveryEfficiency:0.22,
    };
    const physical:CornerRider={
      riderMassKg:r.massKg,equipmentMassKg:r.bikeMassKg,
      dragAreaM2:r.dragAreaM2,rollingCoefficient:0.004,
      airDensityKgM3:1.2,drivetrainEfficiency:0.975,
    };
    return {rider:r,physical,profile,dayCpW,
      physiology:initialCpState(profile),positionM:0,speedMps:10,
      peakMps:10,finishTimeS:null,segmentIndex:0,
      decision:{desiredPowerW:dayCpW,intent:'grundtempo',reason:'Rennstart'},
      intent:'grundtempo',driveWorkJ:0,brakeLossJ:0,energyResidualJ:0,
      crankWorkJ:0,intentSinceS:0,lastChaseEndS:-1e9};
  });
}
function splitGroups(active:State[]):State[][] {
  const packed=pelotonGroups(active.map(s=>({id:s.rider.id,
    positionM:s.positionM,state:s})));
  return packed.map(group=>group.map(g=>g.state));
}
function segmentFor(s:State,boundaries:number[]):number {
  while(s.segmentIndex<boundaries.length-1 &&
    s.positionM>=boundaries[s.segmentIndex]-1e-8)s.segmentIndex++;
  return s.segmentIndex;
}
/** Technische Abfahrt: Fahrtechnik verändert eine plausible
 * Ziel-/Bremsgeschwindigkeit. Kein versteckter kinematischer Tempobonus.
 */
export function descentSafeSpeedMps(technicality:number,skill:number):number {
  ensure('technicality',technicality,technicality>=0&&technicality<=1);
  ensure('skill',skill,skill>=0&&skill<=1);
  return 18+6*skill-6*technicality;
}
export function simulateRace(x:RaceInput):RaceResult {
  validateRace(x);
  const totalM=x.segments.reduce((v,s)=>v+s.lengthM,0);
  const boundaries:number[]=[];
  let sum=0;
  for(const segment of x.segments){sum+=segment.lengthM;boundaries.push(sum);}
  const states=buildStates(x);
  const byId=new Map(states.map(s=>[s.rider.id,s]));
  const teams=new Map(x.teams.map(t=>[t.id,t]));
  const captainByTeam=new Map(x.teams.map(t=>[t.id,
    states.find(s=>s.rider.teamId===t.id&&s.rider.role==='kapitaen')]));
  const events:RaceEvent[]=[{timeS:0,km:0,type:'start',
    description:`${states.length} Fahrer starten auf ${(totalM/1000).toFixed(1)} km`}];
  const snapshots:RaceSnapshot[]=[];
  const dt=x.stepSeconds??1;
  let t=0,steps=0,nextTacticS=0,nextSnapshotM=5000;
  let oldGroups=1,maximumGroups=1,lastSection=0;
  let lastGroupEventS=-Infinity;
  let breakawaySinceS:number|null=null,catchSinceS:number|null=null;
  let breakawayActive=false;
  let aeroFactorSum=0,aeroFactorSamples=0,minimumAeroFactor=1;
  const counters={attacks:0,chases:0,sprints:0,groupSplits:0,
    breakaways:0,caughtBreakaways:0,paceSupportSteps:0};
  while(states.some(s=>s.finishTimeS===null)){
    if(t>=(x.maxRaceTimeS??30000))throw new RangeError('Rennsimulation: Zeitlimit überschritten');
    const active=states.filter(s=>s.finishTimeS===null);
    const ordered=[...active].sort((a,b)=>b.positionM-a.positionM||
      a.rider.id.localeCompare(b.rider.id));
    const leader=ordered[0];
    const frontGap=new Map<string,number|null>();
    const frontSpeed=new Map<string,number|null>();
    for(let i=0;i<ordered.length;i++){
      frontGap.set(ordered[i].rider.id,i===0?null:
        Math.max(0,ordered[i-1].positionM-ordered[i].positionM));
      frontSpeed.set(ordered[i].rider.id,i===0?null:ordered[i-1].speedMps);
    }
    // Regulärer Windschatten mit lokaler Mehrfahrer-Abschirmung.
    // Nur explizites 'legacy' schaltet für alte A/B-Referenzen zurück.
    // R-12-'formation-experiment' bleibt als identischer Alias bestehen.
    const formationFactors=x.aeroModel!=='legacy'?
      formationAeroFactors(ordered.map(s=>({id:s.rider.id,
        positionM:s.positionM}))):null;
    if(t>=nextTacticS-1e-9){
      for(const s of states){
        if(s.finishTimeS!==null)continue;
        const cap=captainByTeam.get(s.rider.teamId);
        const teamCaptainGap=cap && cap.rider.id!==s.rider.id ?
          Math.abs(cap.positionM-s.positionM):null;
        const obs={
          role:s.rider.role,strategy:teams.get(s.rider.teamId)!.strategy,
          criticalPowerW:s.dayCpW,
          aggression:s.rider.aggression,sprintSkill:s.rider.sprintSkill,
          progress:Math.min(1,s.positionM/totalM),
          remainingM:Math.max(0,totalM-s.positionM),
          frontGapM:frontGap.get(s.rider.id)??null,teamCaptainGapM:teamCaptainGap,
          deficitToLeaderM:Math.max(0,leader.positionM-s.positionM),
          reserveFraction:s.physiology.remainingWPrimeJ/s.profile.wPrimeCapacityJ,
        };
        const proposal=chooseRacePower(obs);
        const decision=stabilizeRaceDecision({
          previous:s.decision,proposal,timeS:t,
          previousSinceS:s.intentSinceS,
          lastChaseEndS:s.lastChaseEndS,
          reserveFraction:obs.reserveFraction,
        });
        const before=s.intent;
        if(before!==decision.intent){
          if(before==='verfolgung')s.lastChaseEndS=t;
          s.intentSinceS=t;
        }
        s.decision=decision;s.intent=decision.intent;
        if(before!==decision.intent && events.length<1000){
          const kind=decision.intent==='angriff'?'attack':
            decision.intent==='verfolgung'?'chase':
            decision.intent==='sprint'?'sprint':
            decision.intent==='erholung'?'recovery':null;
          if(kind!==null){
            if(kind==='attack')counters.attacks++;
            if(kind==='chase')counters.chases++;
            if(kind==='sprint')counters.sprints++;
            events.push({timeS:t,km:s.positionM/1000,
              type:kind,riderId:s.rider.id,teamId:s.rider.teamId,
              description:`${s.rider.name}: ${decision.reason}`});
          }
        }
      }
      nextTacticS+=10;
    }
    const next=new Map<string,ReturnType<typeof advanceMotionStep>>();
    const powers=new Map<string,number>();
    for(const s of active){
      const index=segmentFor(s,boundaries);
      const segment=x.segments[index];
      const pack=decidePackInstruction({
        frontGapM:frontGap.get(s.rider.id)??null,
        frontSpeedMps:frontSpeed.get(s.rider.id)??null,
        ownSpeedMps:s.speedMps,
        desiredPowerW:s.decision.desiredPowerW,
        criticalPowerW:s.dayCpW,
        tacticalIntent:s.intent,
        reserveFraction:s.physiology.remainingWPrimeJ/s.profile.wPrimeCapacityJ,
      });
      const aeroFactor=formationFactors?
        Math.min(pack.aeroFactor,formationFactors.get(s.rider.id)!):
        pack.aeroFactor;
      aeroFactorSum+=aeroFactor;aeroFactorSamples++;
      minimumAeroFactor=Math.min(minimumAeroFactor,aeroFactor);
      let commanded=pack.requestedPowerW;
      if(Math.abs(pack.addedPowerW)>0.5)counters.paceSupportSteps++;
      let brakeForceN=0;
      if(segment.gradeFraction<-0.012&&segment.descentTechnicality>0){
        const limit=descentSafeSpeedMps(segment.descentTechnicality,s.rider.descentSkill);
        if(s.speedMps>limit){
          commanded=0;
          brakeForceN=(s.rider.massKg+s.rider.bikeMassKg)*
            Math.min(2.7,Math.max(0.1,(s.speedMps-limit)*1.8));
        }
      }
      const cp=applyCpWprimeStep(s.profile,s.physiology,commanded,dt);
      s.physiology=cp.state;
      powers.set(s.rider.id,cp.appliedPowerW);
      next.set(s.rider.id,advanceMotionStep({
        speedMps:s.speedMps,stepSeconds:dt,
        crankPowerW:cp.appliedPowerW,rider:s.physical,
        gradeFraction:segment.gradeFraction,aeroFactor,brakeForceN,
      }));
    }
    for(const s of active){
      const before=s.positionM;
      const step=next.get(s.rider.id)!;
      s.positionM+=step.distanceM;
      s.speedMps=step.endSpeedMps;
      s.peakMps=Math.max(s.peakMps,s.speedMps);
      s.driveWorkJ+=step.driveWorkJ;
      s.brakeLossJ+=step.brakeLossJ;
      s.energyResidualJ+=step.energyResidualJ;
      s.crankWorkJ+=powers.get(s.rider.id)!*dt;
      if(s.positionM>=totalM){
        const fraction=step.distanceM>0?
          Math.max(0,Math.min(1,(totalM-before)/step.distanceM)):1;
        s.finishTimeS=t+fraction*dt;
        s.positionM=totalM;
        if(events.length<1100)events.push({
          timeS:s.finishTimeS,km:totalM/1000,type:'finish',
          riderId:s.rider.id,teamId:s.rider.teamId,
          description:`${s.rider.name} erreicht das Ziel`,
        });
      }
    }
    t+=dt;steps++;
    const inRace=states.filter(s=>s.finishTimeS===null);
    if(inRace.length){
      const best=inRace.reduce((a,b)=>a.positionM>=b.positionM?a:b);
      const segIndex=segmentFor(best,boundaries);
      if(segIndex!==lastSection){
        lastSection=segIndex;
        if(events.length<1100)events.push({timeS:t,km:best.positionM/1000,
          type:'segment',description:`Spitze erreicht Abschnitt: ${x.segments[segIndex].name}`});
      }
      const groups=splitGroups(inRace);
      maximumGroups=Math.max(maximumGroups,groups.length);
      // Abstandsgruppen sind nur Diagnose; keinen Abstand künstlich
      // zusammenziehen. Meldungen erst nach einer Mindestdauer.
      if(groups.length>oldGroups&&t>=90&&t-lastGroupEventS>=75&&
         events.length<1100){
        counters.groupSplits++;
        lastGroupEventS=t;
        events.push({timeS:t,km:best.positionM/1000,type:'group-split',
          description:`Feld geteilt: ${groups.length} Abstandsgruppen`});
      }
      oldGroups=groups.length;
      // Flucht als PERSISTENTE tatsächlich gefahrene Lücke erkennen.
      const leadGap=groups.length>1?
        groups[0].at(-1)!.positionM-groups[1][0].positionM:0;
      const escaped=groups.length>1&&groups[0].length<=6&&
        leadGap>=75&&best.positionM>1000;
      if(!breakawayActive){
        if(escaped){
          if(breakawaySinceS===null)breakawaySinceS=t;
          if(t-breakawaySinceS>=40){
            breakawayActive=true;catchSinceS=null;counters.breakaways++;
            if(events.length<1100)events.push({timeS:t,
              km:best.positionM/1000,type:'breakaway',
              gapM:leadGap,description:`Fluchtgruppe (${groups[0].length} Fahrer) hat ${leadGap.toFixed(0)} m Vorsprung`});
          }
        }else breakawaySinceS=null;
      }else{
        if(groups.length<2||leadGap<=35){
          if(catchSinceS===null)catchSinceS=t;
          if(t-catchSinceS>=40){
            breakawayActive=false;breakawaySinceS=null;catchSinceS=null;
            counters.caughtBreakaways++;
            if(events.length<1100)events.push({timeS:t,
              km:best.positionM/1000,type:'breakaway-caught',gapM:leadGap,
              description:`Fluchtgruppe eingeholt: Abstand nur noch ${leadGap.toFixed(0)} m`});
          }
        }else catchSinceS=null;
      }
      if(best.positionM>=nextSnapshotM){
        snapshots.push({timeS:t,km:best.positionM/1000,leaderId:best.rider.id,
          activeRiders:inRace.length,
          groupSizes:groups.map(g=>g.length),
          leadingGapM:groups.length>1?
            groups[0].at(-1)!.positionM-groups[1][0].positionM:0});
        nextSnapshotM+=5000;
      }
    }
  }
  const sorted=[...states].sort((a,b)=>a.finishTimeS!-b.finishTimeS!||
    a.rider.id.localeCompare(b.rider.id));
  const winTime=sorted[0].finishTimeS!;
  const classification:RaceClassification[]=sorted.map((s,i)=>({
    rank:i+1,id:s.rider.id,name:s.rider.name,teamId:s.rider.teamId,
    role:s.rider.role,finishTimeS:s.finishTimeS!,
    gapS:s.finishTimeS!-winTime,
    averageCrankPowerW:s.crankWorkJ/s.finishTimeS!,
    finalWPrimeJ:s.physiology.remainingWPrimeJ,
    spentWPrimeJ:s.physiology.spentAboveCpJ,
    recoveredWPrimeJ:s.physiology.recoveredJ,
    distanceM:totalM,finalSpeedKmh:s.speedMps*3.6,
    peakSpeedKmh:s.peakMps*3.6,
    brakeLossJ:s.brakeLossJ,driveWorkJ:s.driveWorkJ,
    energyResidualJ:s.energyResidualJ,
  }));
  // s.finishTimeS ist bei exakt linear interpoliertem Zielstraßenpunkt
  // sub-sekündlich, während die CP/Arbeit des letzten Intervalls als
  // konservative volle Schrittbilanz geführt wird (Fehler <1 s).
  return {title:x.title,distanceM:totalM,
    durationS:Math.max(...sorted.map(s=>s.finishTimeS!)),
    steps,seed:x.seed,classification,events,snapshots,
    winnerId:sorted[0].rider.id,finisherCount:sorted.length,
    diagnostics:{...counters,maximumGroups,teams:x.teams.length,
      meanAeroFactor:aeroFactorSum/aeroFactorSamples,
      minimumAeroFactor}};
}

/** Ausdrücklich fiktives, lizenzfreies 5-Teams-/30-Fahrer-Testszenario. */
export function createRaceExample(options?:{
  profile?:'wellig'|'flach';
  homeStrategy?:RaceStrategy;seed?:number;
}):RaceInput {
  const profile=options?.profile??'wellig';
  if(!['wellig','flach'].includes(profile))
    throw new RangeError('Rennsimulation: Profil unbekannt');
  const strategies:RaceStrategy[]=[
    options?.homeStrategy??'kapitaen_schuetzen',
    'offensiv','sprint','ausgewogen','offensiv',
  ];
  const names=['Nordwind','Bergwerk','Tempo','Horizont','Stern'];
  const teams:RaceTeam[]=names.map((name,i)=>({id:`T${i+1}`,name,
    strategy:strategies[i]}));
  const riders:RaceRider[]=[];
  for(let t=0;t<5;t++)for(let j=0;j<6;j++){
    const i=t*6+j;
    const role:RaceRole=j===0?'kapitaen':j===1?'sprinter':'helfer';
    const climbPotential=(i*7%11)/10;
    riders.push({
      id:`F${String(i+1).padStart(2,'0')}`,
      name:`Fahrer ${String(i+1).padStart(2,'0')}`,
      teamId:`T${t+1}`,role,
      criticalPowerW:role==='kapitaen'?302+(t*9)%24:
        role==='sprinter'?285+(t*11)%20:261+(j*9+t*3)%35,
      ftpW:role==='kapitaen'?287+(t*9)%24:
        role==='sprinter'?272+(t*11)%20:247+(j*9+t*3)%35,
      wPrimeJ:role==='sprinter'?23000:role==='kapitaen'?19000:14500+j*1200,
      massKg:role==='sprinter'?76+t%3:68+(j*3+t)%9,
      bikeMassKg:8,dragAreaM2:0.275+0.008*((i*3)%5),
      descentSkill:Math.min(1,0.30+0.60*climbPotential),
      sprintSkill:role==='sprinter'?0.77+0.035*t:0.2+0.07*(j%4),
      aggression:0.32+0.12*((i*3)%5),
    });
  }
  const segments:RaceSegment[]=profile==='wellig'?[
    {name:'Anfahrt',lengthM:10000,gradeFraction:0,descentTechnicality:0},
    {name:'Erster Anstieg',lengthM:4000,gradeFraction:0.04,descentTechnicality:0},
    {name:'Technische Abfahrt',lengthM:5000,gradeFraction:-0.04,descentTechnicality:0.85},
    {name:'Talstraße',lengthM:12000,gradeFraction:0,descentTechnicality:0},
    {name:'Schlussanstieg',lengthM:3000,gradeFraction:0.06,descentTechnicality:0},
    {name:'Abfahrt zum Ziel',lengthM:4000,gradeFraction:-0.05,descentTechnicality:0.65},
    {name:'Finale',lengthM:12000,gradeFraction:0,descentTechnicality:0},
  ]:[
    {name:'Startgerade',lengthM:15000,gradeFraction:0,descentTechnicality:0},
    {name:'Wellen',lengthM:10000,gradeFraction:0.005,descentTechnicality:0},
    {name:'Leichtes Gefälle',lengthM:10000,gradeFraction:-0.005,descentTechnicality:0},
    {name:'Flaches Finale',lengthM:15000,gradeFraction:0,descentTechnicality:0},
  ];
  return {title:profile==='wellig'?'Fiktives Hügelland-Rennen':'Fiktives Flachrennen',
    teams,riders,segments,seed:options?.seed??2026,stepSeconds:1,
    maxRaceTimeS:18000};
}
