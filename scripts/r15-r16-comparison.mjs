/**
 * R-15/R-16: sieben Paare echter 50-km-Rennen (R-14 vs neue Renn-KI).
 * Die Referenz nutzt identische Fahrer/Seeds/Aero und nur anderes tacticModel.
 */
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const cases=[
  {label:'huegelig-geschuetzt-2026',profile:'wellig',homeStrategy:'kapitaen_schuetzen',seed:2026},
  {label:'huegelig-offensiv-2026',profile:'wellig',homeStrategy:'offensiv',seed:2026},
  {label:'flach-sprint-2026',profile:'flach',homeStrategy:'sprint',seed:2026},
  {label:'huegelig-geschuetzt-2027',profile:'wellig',homeStrategy:'kapitaen_schuetzen',seed:2027},
  {label:'huegelig-offensiv-2027',profile:'wellig',homeStrategy:'offensiv',seed:2027},
  {label:'flach-sprint-2027',profile:'flach',homeStrategy:'sprint',seed:2027},
  {label:'huegelig-F03-schwach-2026',profile:'wellig',homeStrategy:'kapitaen_schuetzen',seed:2026,weak:true},
];
const results=[];
for(const entry of cases){
  const base=createRaceExample(entry);
  if(entry.weak){
    const r=base.riders.find(r=>r.id==='F03');
    if(!r)throw Error('F03 fehlt');
    r.criticalPowerW*=0.88;r.ftpW*=0.88;r.wPrimeJ*=0.88;
  }
  const old={...base,tacticModel:'r14'};
  const r14=simulateRace(old);
  const r16=simulateRace(base);
  const a=auditRace(r14),b=auditRace(r16);
  if(a.finishers!==30||b.finishers!==30)
    throw Error('Unvollständige Zielklassifikation '+entry.label);
  if(r14.diagnostics.multiHelperAssignments!==0||
    r16.diagnostics.multiHelperAssignments<1)
    throw Error('Teamzuteilung fehlt '+entry.label);
  for(const r of [...r14.classification,...r16.classification]){
    if(r.finalWPrimeJ<-1e-8||Math.abs(r.energyResidualJ)>0.05)
      throw Error('Physik-/CP-Wprime-Bilanz '+entry.label+' '+r.id);
  }
  const result={label:entry.label,
    old:{winner:a.winnerId,groups:a.maximumGroups,
      medianGapS:+a.medianGapS.toFixed(1),
      lastGapS:+a.finishSpreadS.toFixed(1)},
    coordinated:{winner:b.winnerId,groups:b.maximumGroups,
      medianGapS:+b.medianGapS.toFixed(1),
      lastGapS:+b.finishSpreadS.toFixed(1),
      assignments:r16.diagnostics.multiHelperAssignments,
      maxHelpers:r16.diagnostics.maxSimultaneousTeamHelpers,
      sprintTrain:r16.diagnostics.sprintTrainAssignments,
      frontWorkSteps:r16.diagnostics.actualFrontWorkSteps,
      chaseStarts:r16.diagnostics.teamChaseStarts,
      attacks:r16.diagnostics.attacks,
      aero:+r16.diagnostics.meanAeroFactor.toFixed(3)},
  };
  results.push(result);
  console.log('R15-R16-VERGLEICH',JSON.stringify(result));
}
console.log('R15-R16-GESAMT',JSON.stringify({
  races:results.length,totalRaceSimulations:results.length*2,
  classifiedFinishers:results.length*60,
  scenariosWithSeveralTeamHelpers:results.filter(x=>
    x.coordinated.maxHelpers>=2).length,
  scenariosWithActualFrontWork:results.filter(x=>
    x.coordinated.frontWorkSteps>0).length,
  scenariosWithSprintTrain:results.filter(x=>
    x.coordinated.sprintTrain>0).length,
}));
