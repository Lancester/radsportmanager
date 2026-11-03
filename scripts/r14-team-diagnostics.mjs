/**
 * R-14: 7 vollständige fiktive Rennen mit neuer Teamkoordinierung.
 * Gegen R-13 anhand derselben dokumentierten Seeds/Strategien vergleichen,
 * ohne Zielzeiten oder Gruppen künstlich auf Sollwerte einzustellen.
 * Aufruf: node --experimental-strip-types scripts/r14-team-diagnostics.mjs
 */
import {createRaceExample,simulateRace}
  from '../src/engine/race/race-simulator.ts';
import {auditRace} from '../src/engine/race/race-audit.ts';

const cases=[
  {label:'huegelig-geschuetzt-2026',profile:'wellig',
    homeStrategy:'kapitaen_schuetzen',seed:2026},
  {label:'huegelig-offensiv-2026',profile:'wellig',
    homeStrategy:'offensiv',seed:2026},
  {label:'flach-sprint-2026',profile:'flach',
    homeStrategy:'sprint',seed:2026},
  {label:'huegelig-geschuetzt-2027',profile:'wellig',
    homeStrategy:'kapitaen_schuetzen',seed:2027},
  {label:'huegelig-offensiv-2027',profile:'wellig',
    homeStrategy:'offensiv',seed:2027},
  {label:'flach-sprint-2027',profile:'flach',
    homeStrategy:'sprint',seed:2027},
  {label:'huegelig-F03-schwach-2026',profile:'wellig',
    homeStrategy:'kapitaen_schuetzen',seed:2026,weakenF03:true},
];
for(const entry of cases){
  const input=createRaceExample(entry);
  if(entry.weakenF03){
    const f03=input.riders.find(r=>r.id==='F03');
    if(!f03)throw Error('F03 fehlt');
    f03.criticalPowerW*=0.88;
    f03.ftpW*=0.88;
    f03.wPrimeJ*=0.88;
  }
  const r=simulateRace(input),a=auditRace(r);
  if(r.finisherCount!==30)throw Error('Unvollständige Zielankunft: '+entry.label);
  const pace=r.events.filter(e=>e.type==='team-pace');
  const chase=r.events.filter(e=>e.type==='team-chase');
  if(pace.length!==r.diagnostics.teamPaceStarts||
     chase.length!==r.diagnostics.teamChaseStarts)
    throw Error('Team-Ereigniszähler stimmt nicht: '+entry.label);
  console.log('R14-RENNDIAGNOSE',JSON.stringify({
    label:entry.label,seed:entry.seed,profile:entry.profile,
    winner:a.winnerId,finishers:r.finisherCount,
    maximumGroups:a.maximumGroups,
    medianGroups:a.medianSnapshotGroups,
    singletonShare:+a.singletonRiderShare.toFixed(3),
    medianFinishGapS:+a.medianGapS.toFixed(1),
    lastGapS:+a.finishSpreadS.toFixed(1),
    meanCrankW:+a.averageCrankPowerW.toFixed(1),
    teamPaceStarts:r.diagnostics.teamPaceStarts,
    teamChaseStarts:r.diagnostics.teamChaseStarts,
    chaseStarts:r.diagnostics.chases,attacks:r.diagnostics.attacks,
    confirmedBreakaways:a.confirmedBreakaways,catches:a.actualCatches,
    meanAeroFactor:+r.diagnostics.meanAeroFactor.toFixed(3),
  }));
}
console.log('R14-ZUSAMMENFASSUNG',JSON.stringify({
  races:cases.length,finishers:cases.length*30,
  note:'Spielmechaniktest; keine Profi-Rennkalibrierung oder Android-Zeitmessung',
}));
