/** R-22 A/B: dasselbe 154-Fahrer-Einzelrennen, Seed und Strecke;
 * allein Fahrerverhalten "cohesive" gegenüber bisheriger KI.
 * Kein Tuning von Aero-, CP/W′- oder R19-Parametern.
 */
import {mkdir,writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {createReferenceFixture,REFERENCE_ROUTES}
  from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';
import {finishGroupMetrics} from '../src/engine/race/finish-groups.ts';

const args={route:'tdf25_lille',seed:'2026',output:'artifacts/r22-group-ai'};
for(let i=2;i<process.argv.length;i+=2){
  const k=process.argv[i].replace(/^--/,'');
  if(!(k in args)||!process.argv[i].startsWith('--')||
    !process.argv[i+1])throw new Error('R22 Gruppen-A/B Parameterfehler');
  args[k]=process.argv[i+1];
}
if(!REFERENCE_ROUTES[args.route])throw new Error('R22 unbekannte Route');
const seed=Number(args.seed);
if(!Number.isSafeInteger(seed)||seed<0||seed>2147483647)
  throw new Error('R22 Seed ungültig');
if(!/^artifacts\/[\w/-]+$/.test(args.output)||args.output.includes('..'))
  throw new Error('R22 Ausgabepfad ungültig');
const f=createReferenceFixture({routeId:args.route,seed});
const runs=[],checkpoints=[],finishes=[];
const rounded=n=>+n.toFixed(2);
for(const model of ['legacy','cohesive','coordinated']){
  const t=performance.now();
  const result=simulateRace({...f.input,
    groupRidingModel:model,diagnosticLevel:'checkpoints'});
  const audit=auditRace(result);
  if(result.finisherCount!==154)throw new Error('unvollständiger A/B-Lauf');
  const finishGroups=finishGroupMetrics(result.classification);
  const row={
    model,seed,route:args.route,participants:result.finisherCount,
    winnerFinishGroup:finishGroups.winnerGroupSize,
    largestFinishGroup:finishGroups.largestGroupSize,
    largestFinishGroupSharePct:finishGroups.largestGroupSharePct,
    within60sOfWinner:finishGroups.within60sOfWinner,
    finishGroupCount:finishGroups.groups.length,
    winner:result.winnerId,
    winnerTimeS:rounded(result.classification[0].finishTimeS),
    speedKmh:rounded(result.distanceM/
      result.classification[0].finishTimeS*3.6),
    medianGapS:rounded(audit.medianGapS),
    lastGapS:rounded(audit.finishSpreadS),
    maximumGroups:audit.maximumGroups,
    attacks:audit.attackStarts,
    chases:audit.chaseStarts,
    breakaways:audit.confirmedBreakaways,
    catches:audit.actualCatches,
    maxEndurancePenaltyPct:
      rounded(result.diagnostics.maximumEndurancePenalty*100),
    meanAeroFactor:rounded(result.diagnostics.meanAeroFactor),
    runtimeS:rounded((performance.now()-t)/1000),
  };
  runs.push(row);
  console.log('R22-GROUP-AI',JSON.stringify(row));
  for(const x of result.checkpoints??[]){
    const gaps=x.riders.map(r=>r.gapToLeaderM).sort((a,b)=>a-b);
    const m=Math.floor(gaps.length/2);
    const medianGapM=gaps.length%2?gaps[m]:(gaps[m-1]+gaps[m])/2;
    const cp={model,km:rounded(x.km),timeS:x.timeS,
      riders:x.activeRiders,groups:x.groupCount,
      largestGroup:x.largestGroup,
      medianGapM:rounded(medianGapM),
      maxGapM:rounded(x.frontToBackM),
      medianAeroFactor:rounded((()=>{
        const a=x.riders.map(r=>r.aeroFactor).sort((a,b)=>a-b);
        const i=Math.floor(a.length/2);
        return a.length%2?a[i]:(a[i-1]+a[i])/2;
      })())};
    checkpoints.push(cp);
  }
  for(const r of result.classification){
    const input=f.input.riders.find(x=>x.id===r.id);
    finishes.push({model,rank:r.rank,id:r.id,
      specialty:input.specialty,role:r.role,
      cpW:input.criticalPowerW,massKg:input.massKg,
      gapS:rounded(r.gapS),avgW:rounded(r.averageCrankPowerW)});
  }
}
const base=runs[0],experiment=runs[2];
const delta={winnerTimeS:rounded(experiment.winnerTimeS-base.winnerTimeS),
  medianGapS:rounded(experiment.medianGapS-base.medianGapS),
  lastGapS:rounded(experiment.lastGapS-base.lastGapS),
  maximumGroups:experiment.maximumGroups-base.maximumGroups,
  largestFinishGroup:experiment.largestFinishGroup-base.largestFinishGroup,
  within60sOfWinner:experiment.within60sOfWinner-base.within60sOfWinner};
const csv=rows=>[Object.keys(rows[0]).join(','),
  ...rows.map(r=>Object.values(r).join(','))].join('\n')+'\n';
const report={status:'exploratory-not-calibrated',route:f.route.name,seed,
  variants:runs,delta,
  note:'A/B verändert nur Fahrverhalten; Aero- und Physikparameter, CP/Wprime und Langzeitermüdung sind identisch. Keine historische Race-Reproduktion.',
};
const md=[
  '# R-22 Gruppen-KI: A/B mit 154 Fahrern',
  '',
  '**Experiment, nicht endgültig kalibriert.**',
  '',
  'Identische Fahrer, Referenzstrecke, Seed; die neue KI strebt',
  'bei größeren Gruppen das gemeinsame Tempo an, statt durchgehend',
  'eine fahrerindividuelle CP-Fraktion einzufordern. Nur Watt-Anfragen.',
  '',
  '| Modell | Sieger km/h | Median-Rückstand s | Max. Gruppen | Größte Zielgruppe (1s) | Siegergruppe (1s) | Binnen 60s | Attacken |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...runs.map(r=>'| '+[r.model,r.speedKmh,r.medianGapS,
    r.maximumGroups,r.largestFinishGroup,r.winnerFinishGroup,
    r.within60sOfWinner,r.attacks].join(' | ')+' |'),
  '',
  '## Delta experimentelle KI − bisherige KI',
  '- Siegerzeit: '+delta.winnerTimeS+' s',
  '- Median-Rückstand: '+delta.medianGapS+' s',
  '- Letzter: '+delta.lastGapS+' s',
  '- Maximale Gruppen: '+delta.maximumGroups,
  '- Größte Zielgruppe Δ: '+delta.largestFinishGroup,
  '- Fahrer binnen 60s Δ: '+delta.within60sOfWinner,
  '- Zielgruppe: maximal 1 s zwischen benachbarten Zielankünften; keine UCI-Offizialmessung.',
  '',
  '## Messpunkte',
  '| km | Gruppen bisher | Gruppen neu | größte Gruppe bisher | größte Gruppe neu | Median-Abstand bisher m | Median-Abstand neu m |',
  '| ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...checkpoints.filter(x=>x.model==='legacy'&&
    [5,25,50,75,100,125,150,175,180].some(k=>Math.abs(k-x.km)<1))
    .map(x=>{
      const y=checkpoints.find(a=>a.model==='cohesive'&&
        Math.abs(a.km-x.km)<.2);
      return '| '+[x.km,x.groups,y?.groups??'–',
        x.largestGroup,y?.largestGroup??'–',
        x.medianGapM,y?.medianGapM??'–'].join(' | ')+' |';
    }),
  '',
  '> Nur ein Seed. Keine künstlichen Positions-, Tempo- oder Zeitboni.',
  '> Die 42-m-Abstandsgruppen sind reine Diagnostik.',
].join('\n')+'\n';
await mkdir(args.output,{recursive:true});
await Promise.all([
  writeFile(args.output+'/report.json',JSON.stringify(report,null,2)+'\n'),
  writeFile(args.output+'/summary.md',md),
  writeFile(args.output+'/checkpoints.csv',csv(checkpoints)),
  writeFile(args.output+'/finishers.csv',csv(finishes)),
]);
console.log('R22-GROUP-AI-REPORT',JSON.stringify(report));
console.log('R22-GROUP-AI-CHECKPOINTS',JSON.stringify(checkpoints.filter(x=>
  [5,25,50,75,100,125,150,175,180].some(k=>Math.abs(k-x.km)<1))));
