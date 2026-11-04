/**
 * R-22 Ursachen-Audit: 154 Fahrer, gleicher Seed, drei bestehende Modelle.
 * Keine Physikänderung. 'legacy' ist alternativer Windschatten-Proxy,
 * NICHT ohne Windschatten. 'off' deaktiviert nur R19 Langzeitermüdung.
 */
import {mkdir,writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {createReferenceFixture,REFERENCE_ROUTES}
  from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';
const args={route:'tdf25_lille',seed:'2026',output:'artifacts/r22-causal'};
for(let i=2;i<process.argv.length;i+=2){
  const k=process.argv[i]?.slice(2);
  if(!k||!(k in args)||!process.argv[i].startsWith('--')||
    process.argv[i+1]===undefined)throw Error('Unbekanntes Audit-Argument');
  args[k]=process.argv[i+1];
}
const seed=Number(args.seed);
if(!Number.isSafeInteger(seed)||seed<0||seed>2147483647)
  throw Error('Seed ungültig');
if(!REFERENCE_ROUTES[args.route])throw Error('Route unbekannt');
if(!/^artifacts\/[a-zA-Z0-9_/-]{1,100}$/.test(args.output)||
  args.output.includes('..'))throw Error('Ausgabe ungültig');
const round=(n,d=2)=>+n.toFixed(d);
const med=v=>{
  const a=[...v].sort((x,y)=>x-y),m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
};
const variants=[
  {id:'baseline',name:'R19 plus Formation'},
  {id:'without_long_fatigue',name:'R19 off, CP/Wprime unverändert',
   enduranceModel:'off'},
  {id:'legacy_drafting',name:'Legacy-Aero, Windschatten bleibt vorhanden',
   aeroModel:'legacy'},
];
const results=[],checkpoints=[],riderCheckpoints=[],finishers=[];
for(const v of variants){
  const fixture=createReferenceFixture({routeId:args.route,seed});
  const input={...fixture.input,diagnosticLevel:'checkpoints',
    ...(v.enduranceModel?{enduranceModel:v.enduranceModel}:{}),
    ...(v.aeroModel?{aeroModel:v.aeroModel}:{})};
  const begin=performance.now();
  const result=simulateRace(input),audit=auditRace(result);
  if(result.finisherCount!==154||!result.checkpoints?.length)
    throw Error('Unvollständige Auditergebnisse');
  const winner=result.classification[0];
  const data={variant:v.id,seed,scenario:args.route,
    participants:result.finisherCount,
    winner:winner.id,
    winnerTimeS:round(winner.finishTimeS,1),
    winnerSpeedKmh:round(result.distanceM/winner.finishTimeS*3.6),
    medianGapS:round(audit.medianGapS,1),
    lastGapS:round(audit.finishSpreadS,1),
    maxGroups:audit.maximumGroups,
    maxEndurancePenaltyPct:round(result.diagnostics.maximumEndurancePenalty*100),
    meanAeroFactor:round(result.diagnostics.meanAeroFactor,4),
    meanCrankW:round(audit.averageCrankPowerW,1),
    attacks:audit.attackStarts,chases:audit.chaseStarts,
    confirmedBreakaways:audit.confirmedBreakaways,
    actualCatches:audit.actualCatches,
    checkpoints:result.checkpoints.length,
    runnerSeconds:round((performance.now()-begin)/1000),
  };
  results.push(data);
  console.log('R22-CAUSAL-RACE',JSON.stringify(data));
  const inputRiders=new Map(input.riders.map(r=>[r.id,r]));
  for(const row of result.classification){
    const r=inputRiders.get(row.id);
    finishers.push({variant:v.id,id:row.id,rank:row.rank,
      role:row.role,specialty:r.specialty,
      cpW:r.criticalPowerW,massKg:r.massKg,cda:r.dragAreaM2,
      wPrimeJ:r.wPrimeJ,carbsGPerHour:r.carbsGPerHour,
      finishTimeS:round(row.finishTimeS,1),gapS:round(row.gapS,1),
      meanPowerW:round(row.averageCrankPowerW,1),
      wPrimeRemainingPct:round(row.finalWPrimeJ/r.wPrimeJ*100,1),
      carbohydrateKcal:round(row.carbohydrateRemainingKcal,1),
      enduranceAvailabilityPct:round(row.endurancePowerAvailability*100,1),
      totalWorkMJ:round(row.driveWorkJ/1e6,3),
      brakeWorkMJ:round(row.brakeLossJ/1e6,3),
      energyResidualJ:round(row.energyResidualJ,5)});
  }
  for(const cp of result.checkpoints){
    const r=cp.riders;
    const summaries={variant:v.id,km:round(cp.km,2),
      elapsedS:cp.timeS,activeRiders:cp.activeRiders,
      groups:cp.groupCount,largestGroup:cp.largestGroup,
      frontToBackM:round(cp.frontToBackM),
      medianGapToLeaderM:round(med(r.map(x=>x.gapToLeaderM))),
      medianPowerW:round(med(r.map(x=>x.appliedPowerW)),1),
      medianCarbKcal:round(med(r.map(x=>x.carbohydrateKcal)),1),
      medianPenaltyPct:round(100-med(r.map(x=>x.enduranceAvailabilityPct)),1),
      medianWPrimeRemainingPct:round(med(r.map(x=>x.wPrimeRemainingPct)),1),
      medianAeroFactor:round(med(r.map(x=>x.aeroFactor)),3),
      leaderId:cp.leaderId};
    checkpoints.push(summaries);
    for(const x of r)riderCheckpoints.push({
      variant:v.id,km:summaries.km,riderId:x.riderId,
      teamId:x.teamId,specialty:x.specialty,role:x.role,
      positionM:round(x.positionM),gapToLeaderM:round(x.gapToLeaderM),
      groupIndex:x.groupIndex,groupSize:x.groupSize,
      speedKmh:round(x.speedKmh,1),powerW:round(x.appliedPowerW,1),
      dayCpW:round(x.dayCpW,1),
      wPrimeRemainingPct:round(x.wPrimeRemainingPct,1),
      carbKcal:round(x.carbohydrateKcal,1),
      carbUnmetKcal:round(x.carbohydrateUnmetKcal,1),
      enduranceAvailabilityPct:round(x.enduranceAvailabilityPct,1),
      aeroFactor:round(x.aeroFactor,3),segmentIndex:x.segmentIndex});
  }
}
const base=results[0];
const differences=results.slice(1).map(r=>({
  variant:r.variant,winnerTimeDeltaS:round(r.winnerTimeS-base.winnerTimeS,1),
  medianGapDeltaS:round(r.medianGapS-base.medianGapS,1),
  lastGapDeltaS:round(r.lastGapS-base.lastGapS,1),
  groupCountDelta:r.maxGroups-base.maxGroups,
}));
const route=createReferenceFixture({routeId:args.route,seed});
const elevation={
  referenceAscentM:route.route.referenceAscentM??null,
  modelledPositiveAscentM:route.modelledAscentM,
  modelledNetChangeM:Math.round(route.input.segments.reduce(
    (s,x)=>s+x.gradeFraction*x.lengthM,0)),
};
const report={scenario:route.route.name,seed,
  variants:results,differences,elevation,
  caveats:[
    'R19 off deaktiviert Langzeitermüdung, aber nicht CP/Wprime.',
    'Legacy-Aero enthält Windschatten und ist kein Ohne-Windschatten-Vergleich.',
    'Fahrer-Messpunkte alle 5 km der Spitze; Momentanwatt der letzten Sekunde.',
    'Gruppen werden aus maximal 42 m Fahrerabstand definiert.',
    'Streckenübergänge modelliert, kein originales vollständiges GPX.',
    'Ein Seed und drei Varianten: Empfindlichkeitsprüfung, keine Kalibrierungsfreigabe.',
  ]};
const csv=rows=>{
  const keys=Object.keys(rows[0]);
  return [keys.join(','),...rows.map(row=>
    keys.map(k=>String(row[k]??'')).join(','))].join('\n')+'\n';
};
const md=['# R-22 Ursachen-Audit: 154 Fahrer',
  '', '**Keine Physik-/Kalibrierungsparameter geändert.**','',
  '- Strecke: '+route.route.name,
  '- Seed: '+seed+', 22 Teams × 7 Fahrer.',
  '- Extern genannte Höhenmeter: '+String(elevation.referenceAscentM),
  '- Modellierte positive Steigungsmeter: '+elevation.modelledPositiveAscentM,
  '- Netto-Profiländerung: '+elevation.modelledNetChangeM,
  '',
  '| Variante | Siegerzeit s | km/h | Medianrückstand s | Letzter s | Max Gruppen | Max Ermüdung % | Mittelwatt |',
  '|---|---:|---:|---:|---:|---:|---:|---:|',
  ...results.map(r=>'| '+[r.variant,r.winnerTimeS,r.winnerSpeedKmh,
    r.medianGapS,r.lastGapS,r.maxGroups,r.maxEndurancePenaltyPct,
    r.meanCrankW].join(' | ')+' |'),
  '',
  '## Gepaarte Änderungen gegenüber Basis',
  ...differences.map(d=>'- '+d.variant+': Siegerzeit Δ '+d.winnerTimeDeltaS+
    ' s, Median Δ '+d.medianGapDeltaS+' s, Letzter Δ '+d.lastGapDeltaS+
    ' s, max. Gruppen Δ '+d.groupCountDelta),
  '',
  '## Verlauf der Basis (ausgewählte 5-km-Messpunkte)',
  '| km | Fahrer | Gruppen | größte Gruppe | Medianrückstand m | Median Watt | Median KH kcal | Median Ermüdung % |',
  '|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...checkpoints.filter(x=>x.variant==='baseline'&&
    [5,25,50,75,100,125,150,175,180].some(v=>Math.abs(x.km-v)<1))
    .map(x=>'| '+[x.km,x.activeRiders,x.groups,x.largestGroup,
      x.medianGapToLeaderM,x.medianPowerW,
      x.medianCarbKcal,x.medianPenaltyPct].join(' | ')+' |'),
  '',
  '## Methodische Grenzen',
  ...report.caveats.map(x=>'- '+x),
  '',
  'CSV: checkpoint-summary.csv, rider-checkpoints.csv, finishers.csv.',
  'JSON: report.json.'].join('\n')+'\n';
await mkdir(args.output,{recursive:true});
await Promise.all([
  writeFile(args.output+'/report.json',JSON.stringify(report,null,2)+'\n'),
  writeFile(args.output+'/checkpoint-summary.csv',csv(checkpoints)),
  writeFile(args.output+'/rider-checkpoints.csv',csv(riderCheckpoints)),
  writeFile(args.output+'/finishers.csv',csv(finishers)),
  writeFile(args.output+'/summary.md',md),
]);
console.log('R22-CAUSAL-SUMMARY',JSON.stringify(report));
