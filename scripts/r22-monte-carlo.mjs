/**
 * R-22 – manuell aus GitHub Actions startbare, reproduzierbare
 * Monte-Carlo-Pilotkampagne. Es werden KEINE Parameter automatisch
 * kalibriert oder Rennergebnisse erzwungen.
 *
 * Aufruf:
 * node --experimental-strip-types scripts/r22-monte-carlo.mjs
 *   --profile flach --runs 3 --teams 10 --roster 7
 *   --distance 60 --seed 2026 --output artifacts/r22
 *   --comparison carbs
 */
import {mkdir,writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {createLongRaceFixture}
  from '../src/engine/race/long-race-fixtures.ts';
import {createReferenceFixture,REFERENCE_ROUTES,
  REFERENCE_TEAM_COMPOSITIONS}
  from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const args={scenario:'legacy',profile:'flach',runs:'3',teams:'10',roster:'7',
  distance:'60',seed:'2026',output:'artifacts/r22',comparison:'none'};
const accepted=new Set(Object.keys(args));
for(let i=2;i<process.argv.length;i+=2){
  const key=process.argv[i]?.replace(/^--/,'');
  if(!key||!accepted.has(key)||!process.argv[i].startsWith('--')||
    process.argv[i+1]===undefined)throw new Error('Ungültiges R22-Argument');
  args[key]=process.argv[i+1];
}
const int=(name,min,max)=>{
  const v=Number(args[name]);
  if(!Number.isSafeInteger(v)||v<min||v>max)
    throw new RangeError('R22 '+name+' muss zwischen '+min+' und '+max+' liegen');
  return v;
};
const runs=int('runs',1,100);
if(args.scenario!=='legacy'&&!REFERENCE_ROUTES[args.scenario])
  throw new RangeError('R-22: Referenzszenario unbekannt');
const preset=args.scenario==='legacy'?null:REFERENCE_ROUTES[args.scenario];
const teams=preset?22:int('teams',1,30);
const roster=preset?7:int('roster',1,8);
const distanceKm=preset?preset.distanceKm:int('distance',10,300);
const firstSeed=int('seed',0,2147483647-runs);
if(teams*roster<2||teams*roster>210)
  throw new RangeError('R22: 2–210 Fahrer');
if(!['flach','huegelig','klassiker','berg'].includes(args.profile))
  throw new RangeError('R22: unbekanntes Profil');
if(!['none','carbs'].includes(args.comparison))
  throw new RangeError('R22: unbekannter Vergleich');
if(!/^artifacts\/[a-zA-Z0-9_/-]{1,100}$/.test(args.output)||
  args.output.includes('..')||args.output.includes('//'))
  throw new RangeError('R22: Ausgabe nur relativ unter artifacts/');
const cohort=teams*roster;
const metrics=[];
const planned=runs*(args.comparison==='carbs'?2:1);
const start=performance.now();
for(let offset=0;offset<runs;offset++){
  const seed=firstSeed+offset;
  for(const variant of args.comparison==='carbs'?
    ['low_carbs','high_carbs']:['baseline']){
    const input=preset?
      createReferenceFixture({routeId:preset.id,seed}).input:
      createLongRaceFixture({profile:args.profile,seed,
        teams,rosterSize:roster,distanceKm});
    if(variant!=='baseline'){
      for(const rider of input.riders)
        rider.carbsGPerHour=variant==='low_carbs'?20:100;
    }
    const before=performance.now();
    const result=simulateRace(input);
    const audit=auditRace(result);
    if(audit.finishers!==cohort||
      result.classification.some(r=>
        !Number.isFinite(r.finishTimeS)||
        r.finalWPrimeJ<0||
        r.carbohydrateRemainingKcal<0||
        Math.abs(r.energyResidualJ)>.05||
        Math.abs(1200+r.carbohydrateIngestedKcal-
          r.carbohydrateConsumedKcal-r.carbohydrateOverflowKcal-
          r.carbohydrateRemainingKcal)>.1))
      throw new Error('R22: ungültige Renn-/Energiebilanz '+seed+' '+variant);
    const row={
      profile:preset?.kind??args.profile,scenario:preset?.id??'legacy',
      variant,seed,
      distanceKm,teams,rosterSize:roster,participants:cohort,
      winner:result.winnerId,
      winnerTimeS:+result.classification[0].finishTimeS.toFixed(1),
      medianGapS:+audit.medianGapS.toFixed(1),
      lastGapS:+audit.finishSpreadS.toFixed(1),
      maxGroups:audit.maximumGroups,
      medianSnapshotGroups:audit.medianSnapshotGroups,
      confirmedBreakaways:audit.confirmedBreakaways,
      caughtBreakaways:audit.actualCatches,
      chaseStarts:audit.chaseStarts,
      attackStarts:audit.attackStarts,
      relays:result.diagnostics.relayChanges,
      frontWorkSteps:result.diagnostics.actualFrontWorkSteps,
      peakEndurancePenaltyPct:+(100*
        result.diagnostics.maximumEndurancePenalty).toFixed(2),
      meanCrankW:+audit.averageCrankPowerW.toFixed(1),
      runtimeSeconds:+((performance.now()-before)/1000).toFixed(2),
    };
    metrics.push(row);
    console.log('R22-RACE',JSON.stringify(row));
  }
}
const sorted=xs=>[...xs].sort((a,b)=>a-b);
const mean=xs=>xs.reduce((sum,n)=>sum+n,0)/xs.length;
const quantile=(xs,p)=>{
  const arr=sorted(xs),i=(arr.length-1)*p,k=Math.floor(i);
  return arr[k]+(arr[Math.min(arr.length-1,k+1)]-arr[k])*(i-k);
};
const group=variant=>{
  const v=metrics.filter(r=>r.variant===variant);
  const summary={variant,races:v.length,
    medianGapS:{mean:+mean(v.map(r=>r.medianGapS)).toFixed(1),
      p10:+quantile(v.map(r=>r.medianGapS),.1).toFixed(1),
      p50:+quantile(v.map(r=>r.medianGapS),.5).toFixed(1),
      p90:+quantile(v.map(r=>r.medianGapS),.9).toFixed(1)},
    finishSpreadS:{mean:+mean(v.map(r=>r.lastGapS)).toFixed(1),
      p10:+quantile(v.map(r=>r.lastGapS),.1).toFixed(1),
      p50:+quantile(v.map(r=>r.lastGapS),.5).toFixed(1),
      p90:+quantile(v.map(r=>r.lastGapS),.9).toFixed(1)},
    averageGroups:+mean(v.map(r=>r.maxGroups)).toFixed(1),
    averageBreakaways:+mean(v.map(r=>r.confirmedBreakaways)).toFixed(2),
    averageCatches:+mean(v.map(r=>r.caughtBreakaways)).toFixed(2),
    averageFatiguePenaltyPct:+mean(v.map(r=>r.peakEndurancePenaltyPct)).toFixed(1),
  };
  return summary;
};
const variants=[...new Set(metrics.map(r=>r.variant))];
const summary={scenario:{profile:preset?.kind??args.profile,
  fixture:preset?.id??'legacy',routeName:preset?.name??null,
  fidelity:preset?.fidelity??'old-fictitious-fixture',
  sources:preset?.sources??[],distanceKm,teams,
  rosterSize:roster,participants:cohort,firstSeed,
  runs,comparison:args.comparison},
  fullRaceSimulations:planned,
  finishers:planned*cohort,
  wallClockSeconds:+((performance.now()-start)/1000).toFixed(2),
  variants:variants.map(group),
  /** Die Seedspanne beeinflusst bislang nur die reproduzierbare ±2% Tagesform.
   * Andere Fahrereigenschaften/Teams bleiben fix: nicht mit vollständiger
   * Populationsunsicherheit verwechseln. */
  limitation:'Seeds ändern derzeit nur die hashbasierte Tagesform der CP (±2 Prozent), nicht die taktischen Regeln oder die Mannschaftszusammensetzung.',
  status:'Technischer Pilot – keine empirische Profi-Kalibrierung',
};
if(variants.length===2){
  const low=metrics.filter(r=>r.variant==='low_carbs');
  const high=metrics.filter(r=>r.variant==='high_carbs');
  const diffs=high.map((r,i)=>({
    seed:r.seed,winnerTimeDeltaS:+(r.winnerTimeS-low[i].winnerTimeS).toFixed(1),
    medianGapDeltaS:+(r.medianGapS-low[i].medianGapS).toFixed(1),
    fatigueDeltaPp:+(r.peakEndurancePenaltyPct-
      low[i].peakEndurancePenaltyPct).toFixed(2),
  }));
  summary.pairedNutritionSensitivity={details:diffs,
    meanWinnerTimeDeltaS:+mean(diffs.map(d=>d.winnerTimeDeltaS)).toFixed(1),
    meanMedianGapDeltaS:+mean(diffs.map(d=>d.medianGapDeltaS)).toFixed(1)};
}
await mkdir(args.output,{recursive:true});
const keys=Object.keys(metrics[0]);
const csv=[keys.join(','),...metrics.map(row=>
  keys.map(k=>String(row[k])).join(','))].join('\n')+'\n';
await Promise.all([
  writeFile(args.output+'/races.csv',csv),
  writeFile(args.output+'/summary.json',JSON.stringify(summary,null,2)+'\n'),
  ...(preset?[writeFile(args.output+'/reference-scenario.json',JSON.stringify((()=>{
    const fixture=createReferenceFixture({routeId:preset.id,seed:firstSeed});
    return {route:fixture.route,modelledAscentM:fixture.modelledAscentM,
      exactElevationReconstruction:false,
      segmentCount:fixture.input.segments.length,
      segments:fixture.input.segments,
      teams:fixture.teamFoci,
      teamCompositions:REFERENCE_TEAM_COMPOSITIONS,
      riders:fixture.input.riders,
      riderSource:'https://pmc.ncbi.nlm.nih.gov/articles/PMC12400862/',
      warning:'Fiktive literaturbasierte CP/Wprime/CdA-Verteilungen; kein realer Fahrerdatensatz, keine GPX-genauen Übergänge.',
    };
  })(),null,2)+'\n')]:[]),
  writeFile(args.output+'/summary.md',[
    '# R-22 Monte-Carlo-Pilot',
    '',
    '**Status: technische Stichprobe, keine Realismusfreigabe.**',
    '',
    `- Rennszenario: ${preset?.name??args.profile}; ${distanceKm} km; ${teams} Teams × ${roster} Fahrer.`,
    `- Streckendaten: ${preset?'Publizierte Strecke/Anstiege mit ausdrücklich modellierten Zwischenabschnitten (KEIN Original-GPX)':'historische rein fiktive Teststrecke'}.`,
    `- Fahrerkader: ${preset?'Literaturbasierte fiktive Profi-Typen und 22 aufgabenspezifische Teams':'historischer vereinfachter Testkader'}.`,
    `- Starts: ${planned} vollständige Rennen, ${planned*cohort} klassifizierte Fahrer.`,
    `- Seed: ${firstSeed} bis ${firstSeed+runs-1}.`,
    `- Berechnungszeit: ${summary.wallClockSeconds} s im ausgeführten CI-Runner.`,
    '',
    '| Variante | Rennen | Medianrückstand Mittel [s] | Medianrückstand p10–p90 [s] | Maximalrückstand Mittel [s] | Ø max. Gruppen | Ø Fluchten | Ø Einholungen | Ø max. Ermüdung [%] |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...summary.variants.map(v=>
      `| ${v.variant} | ${v.races} | ${v.medianGapS.mean} | ${v.medianGapS.p10}–${v.medianGapS.p90} | ${v.finishSpreadS.mean} | ${v.averageGroups} | ${v.averageBreakaways} | ${v.averageCatches} | ${v.averageFatiguePenaltyPct} |`),
    '',
    args.comparison==='carbs'?
      `Gepaarte Verpflegungssensitivität: mittlere Änderung der Siegerzeit (100 gegenüber 20 g/h): ${summary.pairedNutritionSensitivity.meanWinnerTimeDeltaS} s; mittlere Änderung des Medianrückstands: ${summary.pairedNutritionSensitivity.meanMedianGapDeltaS} s.`:'',
    '',
    '> Keine realen Renndaten verglichen. Kleine Stichproben können extreme Streuungen erzeugen.',
    '',
    `**Modellgrenze:** ${summary.limitation}`,
    '',
  ].join('\n')),
]);
console.log('R22-SUMMARY',JSON.stringify(summary));
