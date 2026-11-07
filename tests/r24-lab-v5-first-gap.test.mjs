import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLabSettings,buildLabRace} from '../src/labor/lab-settings.ts';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {DEFAULT_TEAM_PLAN} from '../src/engine/race/team-tactical-plan.ts';

test('V5: ersten Kapitaensanschlussverlust sekundenweise aufloesen ohne Einfluss auf Rennergebnis',()=>{
  const s=initialLabSettings();
  s.routeId='tdf25_lille';s.seed=2026;s.teamCount=22;
  s.myTeamId='T01';s.captainId='F001';s.sprintLeaderId='F004';
  s.riderRoles={F002:'frei',F004:'sprinter'};
  s.teams=[{teamId:'T01',strategy:'sprint',
    tacticalPlan:{...DEFAULT_TEAM_PLAN,finale:'sprint'}}];
  const {input}=buildLabRace(s);
  const trace=[];
  const out=simulateRace(input,undefined,'T01',{
    riderIds:new Set(['F001','F004','F002','F003','F005','F006','F007']),
    fromKm:30,toKm:115,everySeconds:1,
    onSample:r=>trace.push(r),
  });
  const byTime=new Map();
  for(const row of trace){
    let group=byTime.get(row.timeS);
    if(!group){group=new Map();byTime.set(row.timeS,group);}
    group.set(row.id,row);
  }
  const couples=[...byTime.entries()].sort((a,b)=>a[0]-b[0]).map(([timeS,rows])=>{
    const c=rows.get('F001'),spr=rows.get('F004');
    return c&&spr?{timeS,c,spr,gap:spr.positionM-c.positionM}:null;
  }).filter(Boolean);
  assert.ok(couples.length>1000,'mehrere tausend originale Rennsekunden');
  const atTime=time=>couples.reduce((best,x)=>
    Math.abs(x.timeS-time)<Math.abs(best.timeS-time)?x:best,couples[0]);
  const sustained=(check,durationS=30)=>couples.find((r,i)=>
    check(r)&&couples.slice(i,i+durationS).length===durationS&&
    couples.slice(i,i+durationS).every(check));
  const departure=sustained(x=>x.gap>42);
  const lostWheel=sustained(x=>x.c.frontGapM!==null&&x.c.frontGapM>42,12);
  const summary=r=>({
    t:r.timeS,km:+r.c.raceKm.toFixed(2),captainKm:+(r.c.positionM/1000).toFixed(2),
    separationM:+r.gap.toFixed(1),wheelGapM:r.c.frontGapM===null?null:+r.c.frontGapM.toFixed(1),
    capSpeedKmh:+(r.c.speedMps*3.6).toFixed(1),
    wheelSpeedKmh:r.c.frontSpeedMps===null?null:+(r.c.frontSpeedMps*3.6).toFixed(1),
    sprSpeedKmh:+(r.spr.speedMps*3.6).toFixed(1),
    capTacticalW:+r.c.requestedTacticalW.toFixed(0),
    capPackW:+r.c.packRequestedW.toFixed(0),
    capGroupW:+r.c.groupRequestedW.toFixed(0),
    capFinalW:+r.c.finalRequestedW.toFixed(0),
    capActualW:+r.c.appliedPowerW.toFixed(0),
    capCpW:+r.c.dayCpW.toFixed(0),
    capAero:+r.c.aeroFactor.toFixed(3),
    capWPrimePct:+r.c.wPrimePct.toFixed(1),
    groupSize:r.c.groupSize,
    groupLeader:r.c.groupPacerId,
    groupLeaderSpeed:r.c.groupPacerSpeedMps===null?null:+(r.c.groupPacerSpeedMps*3.6).toFixed(1),
    groupPredictedAcc:r.c.groupPacerAccelerationMps2===null?null:+r.c.groupPacerAccelerationMps2.toFixed(3),
    grade:r.c.gradeFraction,intent:r.c.intent,crew:r.c.crewMission,
  });
  const groupByKm=k=>couples.reduce((best,x)=>
    Math.abs(x.c.raceKm-k)<Math.abs(best.c.raceKm-k)?x:best,couples[0]);
  const keyTimes=[30,35,40,45,50,55,60,65,70,75,80,85,90,100,110];
  const lowPower=couples.filter(x=>
    x.c.frontGapM!==null&&x.c.frontGapM>3&&
    x.c.frontSpeedMps!==null&&x.c.frontSpeedMps>x.c.speedMps+.05&&
    x.c.appliedPowerW<x.c.dayCpW*.45&&x.c.wPrimePct>50);
  const buckets=[];
  for(let km=30;km<110;km+=5){
    const chunk=couples.filter(x=>x.c.raceKm>=km&&x.c.raceKm<km+5);
    const mean=(key)=>chunk.reduce((sum,x)=>sum+x.c[key],0)/Math.max(1,chunk.length);
    buckets.push({km,rows:chunk.length,meanActualW:+mean('appliedPowerW').toFixed(0),
      meanGroupW:+mean('groupRequestedW').toFixed(0),
      meanSpeedKmh:+(mean('speedMps')*3.6).toFixed(1),
      meanAero:+mean('aeroFactor').toFixed(3),
      lowPowerSeconds:chunk.filter(x=>
        x.c.appliedPowerW<x.c.dayCpW*.45&&
        x.c.frontSpeedMps!==null&&x.c.frontSpeedMps>x.c.speedMps+.05).length,
      endSeparationM:+(chunk.at(-1)?.gap??0).toFixed(0)});
  }
  console.log('CAPTAIN_FIRST_SEPARATION',JSON.stringify(departure?summary(departure):null));
  console.log('CAPTAIN_FIRST_WHEEL_LOSS',JSON.stringify(lostWheel?summary(lostWheel):null));
  console.log('CAPTAIN_TIMELINE',JSON.stringify(keyTimes.map(k=>summary(groupByKm(k)))));
  console.log('CAPTAIN_LOW_POWER_COUNT',lowPower.length);
  console.log('CAPTAIN_LOW_POWER_SAMPLES',JSON.stringify(
    lowPower.filter((x,i)=>i%Math.max(1,Math.floor(lowPower.length/14))===0)
      .slice(0,15).map(summary)));
  console.log('CAPTAIN_BUCKETS',JSON.stringify(buckets));
  console.log('CAPTAIN_FINISH',JSON.stringify(
    out.classification.filter(x=>x.teamId==='T01').map(x=>({
      id:x.id,rank:x.rank,gap:+x.gapS.toFixed(1),
      meanW:+x.averageCrankPowerW.toFixed(0),
      endWPrimeKJ:+(x.finalWPrimeJ/1000).toFixed(1)
    }))));
  const duplicate=simulateRace(input);
  assert.deepEqual(out.classification,duplicate.classification,'Trace darf Ergebnisse nicht aendern');
  assert.deepEqual(out.events,duplicate.events,'Trace darf Rennereignisse nicht aendern');
  assert.deepEqual(out.snapshots,duplicate.snapshots,'Trace darf Renn-Snapshots nicht aendern');
},{timeout:240000});
