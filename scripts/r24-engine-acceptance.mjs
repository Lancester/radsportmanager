/**
 * R24 – fixierter Engine-1.0-Abnahmetest: unveränderter Audit vs PR84.
 * Der Workflow kopiert denselben rein passiven Diagnose-Rennsimulator
 * in beide Checkouts. Die sportmechanische Differenz bleibt ausschließlich
 * local-group-reference.ts. Keine Ergebnis-Sonderbehandlung und kein Tuning.
 *
 * node --experimental-strip-types scripts/r24-engine-acceptance.mjs AUDIT VARIANTE SEED ROUTE
 */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const [auditDir,variantDir,seedArg,routeId]=process.argv.slice(2);
const routes=['tdf25_lille','tdf25_boulogne','lbl25_liege','tdf25_hautacam'];
if(!auditDir||!variantDir||!seedArg||!routes.includes(routeId))
  throw Error('Syntax: AUDIT VARIANTE SEED tdf25_lille|tdf25_boulogne|lbl25_liege|tdf25_hautacam');
const seed=Number(seedArg);if(!Number.isSafeInteger(seed)||seed<0)throw Error('Invalid seed');
const load=(dir,n)=>import(pathToFileURL(resolve(dir)+'/src/engine/race/'+n+'.ts').href);
const [fixtures,base,variant]=await Promise.all([
  load(auditDir,'reference-fixtures'),load(auditDir,'race-simulator'),
  load(variantDir,'race-simulator'),
]);
const f=fixtures.createReferenceFixture({routeId,seed});
const x={...f.input,groupRidingModel:'stable-pack',diagnosticLevel:'checkpoints'};
const riders=new Map(f.input.riders.map(r=>[r.id,r]));
const digits=v=>v===null||v===undefined?null:Number.isFinite(v)?+v.toFixed(2):null;
const quant=(xs,p)=>xs[Math.min(xs.length-1,Math.max(0,Math.round((xs.length-1)*p)))];
const sum=arr=>arr.reduce((a,b)=>a+b,0);
const report=r=>{
  const finish=[...r.classification].sort((a,b)=>a.gapS-b.gapS);
  const type=id=>riders.get(id)?.specialty??'unbekannt';
  const checkpoints=r.checkpoints??[];
  const atFraction=p=>checkpoints.reduce((best,c)=>
    Math.abs(c.km/r.distanceM*1000-p)<Math.abs(best.km/r.distanceM*1000-p)?c:best,
    checkpoints[0]);
  const checkpointSummary=c=>{
    if(!c)return null;
    const front=c.groupSizes[0]??0,main=c.largestGroup;
    const winnerRow=c.riders.find(z=>z.riderId===r.winnerId);
    return {
      km:digits(c.km),front,largest:main,groups:c.groupCount,
      spanKm:digits(c.frontToBackM/1000),
      within60M:c.riders.filter(z=>z.gapToLeaderM<=60).length,
      within300M:c.riders.filter(z=>z.gapToLeaderM<=300).length,
      winnerPositionGroup:winnerRow?.groupIndex??null,
      winnerWPrimePct:winnerRow?digits(winnerRow.wPrimeRemainingPct):null,
    };
  };
  const a=r.diagnostics.attackTraces??[];
  const spentAttack=a.filter(z=>z.appliedAboveEffectiveCpJ>1000);
  const successful5km=a.filter(z=>z.afterFiveKm&&z.afterFiveKm.gapToRaceFrontM<0);
  const initialFresh=a.filter(z=>z.initialGapToRaceFrontM<43);
  const chase=r.diagnostics.chasePhysicalAudit;
  const decisions=r.diagnostics.chaseDecisionAudit;
  const leader=r.diagnostics.namedChaseLeader;
  const winType=type(r.winnerId);
  const top=r.classification.slice(0,10);
  const energyAnomaly=finish.filter(z=>!Number.isFinite(z.averageCrankPowerW)||
    !Number.isFinite(z.finalWPrimeJ)||z.finalWPrimeJ < -1||
    !Number.isFinite(z.endurancePowerAvailability)||
    z.endurancePowerAvailability<0||z.endurancePowerAvailability>1.0001);
  const classifications=r.classification.map(z=>z.id);
  const unique=new Set(classifications).size;
  const frontNearFinish=checkpoints.at(-1);
  return {
    winner:r.winnerId,winnerType:winType,finishers:r.finisherCount,
    completionOk:r.finisherCount===f.input.riders.length&&
      unique===f.input.riders.length&&
      energyAnomaly.length===0,
    physicalAnomalyCount:energyAnomaly.length,
    durationS:digits(r.durationS),
    finishGap:{medianS:digits(quant(finish.map(z=>z.gapS),.5).gapS),
      p75S:digits(quant(finish.map(z=>z.gapS),.75).gapS),
      within5S:finish.filter(z=>z.gapS<=5).length,
      within30S:finish.filter(z=>z.gapS<=30).length,
      within60S:finish.filter(z=>z.gapS<=60).length,
      within120S:finish.filter(z=>z.gapS<=120).length,
      within300S:finish.filter(z=>z.gapS<=300).length},
    top10:top.map(z=>({id:z.id,type:type(z.id),gapS:digits(z.gapS)})),
    top10TypeCounts:top.reduce((m,z)=>{const k=type(z.id);m[k]=(m[k]??0)+1;return m},{}),
    top10Sprinters:top.filter(z=>type(z.id)==='sprinter').length,
    top10Climbers:top.filter(z=>type(z.id)==='kletterer').length,
    eventCounts:{attacks:r.diagnostics.attacks,
      breakaways:r.diagnostics.breakaways,
      caught:r.diagnostics.caughtBreakaways,
      groupSplits:r.diagnostics.groupSplits,
      chaseOrders:r.diagnostics.chases,
      sprintStarts:r.diagnostics.sprints},
    attackPhysics:{total:a.length,aboveCp:spentAttack.length,
      startedInPack:initialFresh.length,
      clearlyAheadAfter5Km:successful5km.length,
      meanAppliedAboveCpJ:digits(a.length?sum(a.map(z=>z.appliedAboveEffectiveCpJ??0))/a.length:0),
      maxPeakAppliedW:digits(Math.max(0,...a.map(z=>z.peakAppliedW??0)))},
    chasePhysical:chase?{
      assignments:chase.assignedRiderSeconds,
      nearFront:chase.nearFrontRiderSeconds,
      windFront:chase.windFrontRiderSeconds,
      highPowerWindFront:chase.highPowerWindFrontRiderSeconds,
      windFrontEnergyMJ:digits(chase.windFrontEnergyJ/1e6),
      longestWindFrontStintS:chase.longestWindFrontStintS,
    }:null,
    chaseDecisions:decisions?{
      changes:decisions.changes,starts:decisions.starts,
      stops:decisions.stops,earlyStops:decisions.shortStopsWhileGapValid,
    }:null,
    sprintPhysical:leader?{
      assignedS:leader.assignedSeconds,
      exposedCpNearS:leader.exposedCpNearSeconds,
      longestExposedCpNearS:leader.longestExposedCpNearSeconds,
    }:null,
    fatigue:{
      medianAvailablePct:digits(quant(finish.map(z=>z.endurancePowerAvailability).sort((a,b)=>a-b),.5)*100),
      minAvailablePct:digits(Math.min(...finish.map(z=>z.endurancePowerAvailability))*100),
      meanCarbUnmetKcal:digits(sum(finish.map(z=>z.carbohydrateUnmetDemandKcal))/finish.length),
      medianWPrimeEndKJ:digits(quant(finish.map(z=>z.finalWPrimeJ).sort((a,b)=>a-b),.5)/1000),
      meanPowerW:digits(sum(finish.map(z=>z.averageCrankPowerW))/finish.length),
    },
    checkpoint25:checkpointSummary(atFraction(.25)),
    checkpoint50:checkpointSummary(atFraction(.50)),
    checkpoint75:checkpointSummary(atFraction(.75)),
    checkpointNearFinish:checkpointSummary(frontNearFinish),
  };
};
const a=report(base.simulateRace(x)),b=report(variant.simulateRace(x));
if(!a.completionOk||!b.completionOk)
  throw Error('STOP: Fahrer-/Energie-Invariante verletzt '+JSON.stringify({routeId,seed,a:a.completionOk,b:b.completionOk}));
console.log('R24_ACCEPT '+JSON.stringify({routeId,seed,
  routeKind:f.route.kind,distanceKm:f.route.distanceKm,fieldSize:f.input.riders.length,
  scenario:'proxies: published climbs and synthetic transitions; not a GPX reconstruction',
  audit:a,experiment:b}));
