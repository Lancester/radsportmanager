/**
 * R-22: kontrollierte Vergleichsmatrix für die bereits existierenden
 * vier Referenz-Einzelrennen. Ausschließlich manuell über workflow_dispatch
 * oder bewusst lokalen CLI-Aufruf starten; NICHT aus der PR-CI starten.
 *
 * Gleiches Feld/gleicher Seed/gleiche Physik pro Vergleich:
 * coordinated vs front-gated vs stable-pack. Nur KI-Modus variiert.
 * Ausschließlich Diagnose; keine neuen Rennergebnis-Boni.
 */
import {mkdir,writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {createReferenceFixture,REFERENCE_ROUTES}
  from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';
import {finishGroupMetrics} from '../src/engine/race/finish-groups.ts';

const ROUTES=Object.keys(REFERENCE_ROUTES);
const MODELS=['coordinated','front-gated','stable-pack'];
const options={route:'all',seedCount:'3',startSeed:'2026',
  output:'artifacts/r22-multiroute-validation',plan:false};
for(let i=2;i<process.argv.length;i++){
  const k=process.argv[i];
  if(k==='--plan'){options.plan=true;continue;}
  const target={'--route':'route','--seed-count':'seedCount',
    '--start-seed':'startSeed','--output':'output'}[k];
  if(!target||!process.argv[i+1]||process.argv[i+1].startsWith('--'))
    throw new Error('R22-MATRIX: ungültige Option '+k);
  options[target]=process.argv[++i];
}
const seedCount=Number(options.seedCount);
const startSeed=Number(options.startSeed);
if(!Number.isSafeInteger(seedCount)||seedCount<1||seedCount>5)
  throw new Error('R22-MATRIX: Seed-Anzahl muss 1–5 sein');
if(!Number.isSafeInteger(startSeed)||startSeed<0||
  startSeed>2147483647-seedCount+1)
  throw new Error('R22-MATRIX: Start-Seed außerhalb 0–2147483647');
if(options.route!=='all'&&!ROUTES.includes(options.route))
  throw new Error('R22-MATRIX: unbekannte Referenzstrecke');
if(!/^artifacts\/[a-zA-Z0-9_/-]+$/.test(options.output)||
  options.output.includes('..'))
  throw new Error('R22-MATRIX: Ausgabepfad ungültig');
const routes=options.route==='all'?ROUTES:[options.route];
const seeds=Array.from({length:seedCount},(_,i)=>startSeed+i);
const plan={protocol:'r22-stable-pack-2026-11',routes,seeds,
  models:MODELS,totalRaces:routes.length*seeds.length*MODELS.length,
  participantsPerRace:154,trigger:'manual-only',
  estimatedRaceCountLimit:60,commit:process.env.GITHUB_SHA??null};
if(plan.totalRaces>60)throw new Error('R22-MATRIX: Rennlimit überschritten');
console.log('R22-MATRIX-PLAN '+JSON.stringify(plan));
if(options.plan)process.exit(0);

const rounded=n=>+n.toFixed(2);
const median=values=>{
  const s=[...values].sort((a,b)=>a-b),m=Math.floor(s.length/2);
  return s.length%2?s[m]:(s[m-1]+s[m])/2;
};
const csvEscape=v=>{
  const s=String(v??'');
  return /[",\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;
};
const toCsv=rows=>{
  if(!rows.length)return '';
  const keys=Object.keys(rows[0]);
  return [keys.join(','),...rows.map(r=>
    keys.map(k=>csvEscape(r[k])).join(','))].join('\n')+'\n';
};
const rows=[];
const startedAt=performance.now();
for(const routeId of routes){
  for(const seed of seeds){
    // NEU für jeden Seed, aber für ALLE drei KI-Varianten exakt identisch.
    const fixture=createReferenceFixture({routeId,seed});
    const profileById=new Map(fixture.input.riders.map(r=>[r.id,r.specialty]));
    for(const model of MODELS){
      const start=performance.now();
      const result=simulateRace({...fixture.input,
        groupRidingModel:model,diagnosticLevel:'checkpoints'});
      if(result.finisherCount!==154||result.classification.length!==154)
        throw new Error('R22-MATRIX: Rennen unvollständig '+routeId+'/'+seed+'/'+model);
      if(result.classification.some(r=>
        Math.abs(r.energyResidualJ)>.05||r.finalWPrimeJ<0))
        throw new Error('R22-MATRIX: Energie-/Wprime-Invariante '+routeId+'/'+seed+'/'+model);
      const groups=finishGroupMetrics(result.classification);
      const audit=auditRace(result);
      const checkpoints=result.checkpoints??[];
      const byProgress=f=>checkpoints.find(c=>c.km>=fixture.route.distanceKm*f)??checkpoints.at(-1);
      const near25=byProgress(.25),near50=byProgress(.5),near75=byProgress(.75);
      const winnerSpecialty=profileById.get(result.winnerId);
      const topTen=result.classification.slice(0,10).map(r=>profileById.get(r.id));
      const leaderWork=result.diagnostics.mainFieldFrontWorkWithAssignedChaserS??0;
      const changes=result.diagnostics.mainFieldChaserLeaderChanges??0;
      const largestGapS=rounded(groups.largestGroupGapToWinnerS);
      const row={
        routeId,profile:fixture.route.kind,distanceKm:fixture.route.distanceKm,
        seed,model,participants:154,winnerId:result.winnerId,
        winnerSpecialty,winnerSpeedKmh:rounded(
          result.distanceM/result.classification[0].finishTimeS*3.6),
        winnerFinishGroup:groups.winnerGroupSize,
        largestFinishGroup:groups.largestGroupSize,
        largestFinishGroupSharePct:groups.largestGroupSharePct,
        largestFinishGroupGapS:largestGapS,
        within60sOfWinner:groups.within60sOfWinner,
        within180sOfWinner:groups.within180sOfWinner,
        finishGroupCount:groups.groups.length,
        medianFinishGapS:rounded(audit.medianGapS),
        lastFinishGapS:rounded(audit.finishSpreadS),
        maximumDistanceGroups:audit.maximumGroups,
        groupAt25Pct:near25?.largestGroup??null,
        groupAt50Pct:near50?.largestGroup??null,
        groupAt75Pct:near75?.largestGroup??null,
        medianWprimeAt50Pct:near50?rounded(median(
          near50.riders.map(r=>r.wPrimeRemainingPct))):null,
        avgCrankPowerW:rounded(audit.averageCrankPowerW),
        maxEndurancePenaltyPct:rounded(
          result.diagnostics.maximumEndurancePenalty*100),
        meanAeroFactor:rounded(result.diagnostics.meanAeroFactor),
        attacks:audit.attackStarts,chases:audit.chaseStarts,
        breakaways:audit.confirmedBreakaways,catches:audit.actualCatches,
        unprovokedBreakaways:result.diagnostics.unprovokedBreakawayCount??null,
        actualChaseFrontS:leaderWork,
        directChaseLeaderChanges:changes,
        longestChaseStintS:result.diagnostics.longestMainFieldChaserStintS??0,
        top10Sprinters:topTen.filter(x=>x==='sprinter').length,
        top10Climbers:topTen.filter(x=>x==='kletterer').length,
        runtimeS:rounded((performance.now()-start)/1000),
      };
      if(!Number.isFinite(row.winnerSpeedKmh)||
        !Number.isFinite(row.largestFinishGroupGapS))
        throw new Error('R22-MATRIX: nicht-finite Rennkennzahlen');
      rows.push(row);
      console.log('R22-MATRIX-RACE '+JSON.stringify(row));
    }
  }
}
const summary=[];
for(const routeId of routes){
  for(const model of MODELS){
    const selected=rows.filter(x=>x.routeId===routeId&&x.model===model);
    const medianLargestGap=median(selected.map(x=>x.largestFinishGroupGapS));
    const medianWinnerGroup=median(selected.map(x=>x.winnerFinishGroup));
    summary.push({
      routeId,profile:REFERENCE_ROUTES[routeId].kind,model,
      seeds:selected.length,
      medianWinnerFinishGroup:rounded(medianWinnerGroup),
      medianLargestFinishGroup:rounded(median(selected.map(x=>x.largestFinishGroup))),
      minLargestFinishGroup:Math.min(...selected.map(x=>x.largestFinishGroup)),
      maxLargestFinishGroup:Math.max(...selected.map(x=>x.largestFinishGroup)),
      medianLargestGroupGapS:rounded(medianLargestGap),
      worstLargestGroupGapS:Math.max(...selected.map(x=>x.largestFinishGroupGapS)),
      medianWithin60s:rounded(median(selected.map(x=>x.within60sOfWinner))),
      medianAttacks:rounded(median(selected.map(x=>x.attacks))),
      medianMaxDistanceGroups:rounded(median(selected.map(x=>x.maximumDistanceGroups))),
      medianActualChaseFrontS:rounded(median(selected.map(x=>x.actualChaseFrontS))),
      medianChaseLeaderChanges:rounded(median(selected.map(x=>x.directChaseLeaderChanges))),
      medianTop10Sprinters:rounded(median(selected.map(x=>x.top10Sprinters))),
      medianTop10Climbers:rounded(median(selected.map(x=>x.top10Climbers))),
    });
  }
}
const compare=[];
for(const routeId of routes)for(const seed of seeds){
  const old=rows.find(r=>r.routeId===routeId&&r.seed===seed&&r.model==='coordinated');
  const before=rows.find(r=>r.routeId===routeId&&r.seed===seed&&r.model==='front-gated');
  const stable=rows.find(r=>r.routeId===routeId&&r.seed===seed&&r.model==='stable-pack');
  compare.push({
    routeId,seed,profile:stable.profile,
    stableMinusCoordinatedLargestFinishGroup:
      stable.largestFinishGroup-old.largestFinishGroup,
    stableMinusCoordinatedLargestGroupGapS:
      rounded(stable.largestFinishGroupGapS-old.largestFinishGroupGapS),
    stableMinusFrontGatedLargestGroupGapS:
      rounded(stable.largestFinishGroupGapS-before.largestFinishGroupGapS),
    stableMinusFrontGatedWithin60s:
      stable.within60sOfWinner-before.within60sOfWinner,
    stableMinusFrontGatedAttacks:stable.attacks-before.attacks,
  });
}
const md=[
  '# R-22: Mehrprofil-/Mehrseed-A/B für stable-pack',
  '',
  '**Explorative Diagnose, keine automatische Sportrealismus-Freigabe.**',
  '',
  'Rennanker und Anstiege sind aus veröffentlichten Profilen übernommen;',
  'die Zwischenprofile sind synthetisch modelliert und NICHT GPS-genau.',
  'Alle Fahrer sind fiktiv. Es werden einzelne vollständige Rennen verglichen,',
  'keine Etappenwertung, keine Rundfahrt und kein Karriere-Manager.',
  '',
  '## Versuchsplan',
  '- Auslösung: bewusst manuell; keine Push- oder Zeitplan-Kampagne',
  '- Varianten: '+MODELS.join(', '),
  '- Seed(s): '+seeds.join(', '),
  '- Profile: '+routes.map(id=>REFERENCE_ROUTES[id].name).join('; '),
  '- Umfang: '+rows.length+' komplette Rennen / jeweils 154 Fahrer',
  '- Commit: '+(plan.commit??'nicht von GitHub Actions übergeben'),
  '- Rechenzeit Script: '+rounded((performance.now()-startedAt)/1000)+' Sekunden',
  '',
  '## Streckenweise Verteilung (Mediane über Seeds, keine historische Kalibrierung)',
  '| Profil | Modell | Seeds | Siegergruppe | Größte Zielgruppe | Rückstand größte Gruppe s | Binnen 60 s | Attacken | Max. Gruppen | echte Jagdführung s | direkte Wechsel | Top-10 Sprinter / Kletterer |',
  '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |',
  ...summary.map(r=>'| '+[
    r.profile+' ('+r.routeId+')',r.model,r.seeds,
    r.medianWinnerFinishGroup,r.medianLargestFinishGroup,
    r.medianLargestGroupGapS,r.medianWithin60s,
    r.medianAttacks,r.medianMaxDistanceGroups,
    r.medianActualChaseFrontS,r.medianChaseLeaderChanges,
    r.medianTop10Sprinters+' / '+r.medianTop10Climbers,
  ].join(' | ')+' |'),
  '',
  '## Identische Seed-Paare – stable-pack gegen frühere KI',
  '| Strecke | Seed | Δ größte Zielgruppe vs coordinated | Δ Rückstand s vs coordinated | Δ Rückstand s vs front-gated | Δ Fahrer binnen 60s vs front-gated | Δ Attacken vs front-gated |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...compare.map(c=>'| '+[
    c.routeId,c.seed,c.stableMinusCoordinatedLargestFinishGroup,
    c.stableMinusCoordinatedLargestGroupGapS,
    c.stableMinusFrontGatedLargestGroupGapS,
    c.stableMinusFrontGatedWithin60s,
    c.stableMinusFrontGatedAttacks,
  ].join(' | ')+' |'),
  '',
  '## Vor der nächsten KI-Änderung prüfen',
  '1. Flach: Kampf ums Ziel, größte Gruppe UND Rückstand, Attacken und Führungswechsel.',
  '2. Hügelig/Klassiker: Selektion und Ausreißer dürfen auftreten, aber nicht wegen Regelfehlern.',
  '3. Berg: Kletterer/GC-Typen sollten häufiger vorne mitfahren; **kein** erzwungener Massensprint.',
  '4. Verlauf 25/50/75 %, W′-Reserve, Leistung, Aero und Langzeiterholung prüfen.',
  '5. Keine einzelnen Seeds oder Ziele auf einen gewünschten Sieger überoptimieren.',
  '6. R-22/Issues #42 und #54 bleiben offen; Standard bleibt legacy; R-23 nicht freigeben.',
  '',
  'Weitere Messwerte einschließlich einzelner Seeds stehen in races.csv',
  'und report.json. Die 1-s-Zielgruppen sind Diagnoseproxies, keine UCI-Wertung.',
].join('\n')+'\n';
const output={plan,status:'exploratory-not-calibrated',
  routeMetadata:routes.map(id=>REFERENCE_ROUTES[id]),
  rows,summary,pairedComparisons:compare,
  elapsedS:rounded((performance.now()-startedAt)/1000)};
await mkdir(options.output,{recursive:true});
await Promise.all([
  writeFile(options.output+'/report.json',JSON.stringify(output,null,2)+'\n'),
  writeFile(options.output+'/races.csv',toCsv(rows)),
  writeFile(options.output+'/summary.csv',toCsv(summary)),
  writeFile(options.output+'/paired-comparisons.csv',toCsv(compare)),
  writeFile(options.output+'/summary.md',md),
]);
console.log('R22-MATRIX-RESULT '+JSON.stringify({
  totalRaces:rows.length,elapsedS:output.elapsedS,
  routes,seeds,summary}));
