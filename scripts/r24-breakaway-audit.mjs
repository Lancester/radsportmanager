/** Reproduzierbarer technischer Kontrolllauf, kein sportlicher Mehrseed-Test. */
import {createReferenceFixture} from '../src/engine/race/reference-fixtures.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
const fixture=createReferenceFixture({routeId:'tdf25_hautacam',seed:777});
for(const enabled of [false,true]){
  const result=simulateRace({...fixture.input,groupRidingModel:'stable-pack',
    diagnosticLevel:'checkpoints',experimentalBreakawayCooperation:enabled});
  const audit=result.diagnostics.breakawayFrontWork;
  const formations=result.diagnostics.breakawayFormations.map(g=>({timeS:g.timeS,
    km:+g.km.toFixed(2),size:g.size,lengthM:+g.lengthM.toFixed(1),
    maxGapM:+g.maximumAdjacentGapM.toFixed(1),gapToMainM:+g.gapToMainM.toFixed(1)}));
  console.log(JSON.stringify({enabled,winner:result.winnerId,
    finisherCount:result.finisherCount,formations,frontRiders:audit.riders.length,
    totalFrontSeconds:audit.riders.reduce((n,v)=>n+v.frontSeconds,0),
    totalFrontCrankJ:audit.riders.reduce((n,v)=>n+v.crankWorkJ,0),
    windExposedSeconds:audit.riders.reduce((n,v)=>n+v.windExposedSeconds,0),
    topRiders:audit.riders.slice(0,5),longestStints:audit.stints.slice(0,5),
    energyValid:result.classification.every(c=>Math.abs(c.energyResidualJ)<.05),
    workEvents:result.events.filter(e=>e.type==='breakaway-work').length,
    saveEvents:result.events.filter(e=>e.type==='breakaway-save').length}));
}
