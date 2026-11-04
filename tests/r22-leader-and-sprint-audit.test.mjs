import test from 'node:test';
import assert from 'node:assert/strict';
import {ChaseLeaderTelemetry}
  from '../src/engine/race/chase-leader-telemetry.ts';
import {auditSprintFinish}
  from '../src/engine/race/sprint-finish-audit.ts';

test('R22: Führungswatt nur bei nominierter realer Jagdführung an ECHTER Hauptfeldspitze',()=>{
  const audit=new ChaseLeaderTelemetry();
  const base={leaderId:'H1',dt:1,inMainGroup:true,
    mainGroupSize:120,gapToActualMainFrontM:4,
    mission:'jagd',duty:'fuehrung',intent:'verfolgung',
    appliedPowerW:350,criticalPowerW:370};
  for(let i=0;i<680;i++)audit.observe(base);
  audit.observe({...base,gapToActualMainFrontM:26,
    appliedPowerW:370});
  audit.observe({...base,inMainGroup:false,
    gapToActualMainFrontM:0});
  audit.observe({...base,duty:'unterstuetzung'});
  audit.observe({...base,appliedPowerW:200});
  for(let i=0;i<25;i++)audit.observe(base);
  const report=audit.report();
  assert.equal(report.assignedSeconds,709);
  assert.equal(report.frontSeconds,706);
  assert.equal(report.cpNearFrontSeconds,705);
  assert.equal(report.longestFrontSeconds,680);
  assert.equal(report.longestCpNearSeconds,680);
  assert.equal(report.missed.tooFarSeconds,1);
  assert.equal(report.missed.notMainSeconds,1);
  assert.equal(report.missed.notLeadingSeconds,1);
  assert.equal(report.missed.belowCpNearSeconds,1);
  assert.equal(report.riders[0].riderId,'H1');
});

test('R22: Wechsel und Leerlauf zählen nicht als kontinuierliche Jagdfront',()=>{
  const audit=new ChaseLeaderTelemetry();
  const base={leaderId:'H1',dt:1,inMainGroup:true,
    mainGroupSize:50,gapToActualMainFrontM:0,
    mission:'jagd',duty:'fuehrung',intent:'verfolgung',
    appliedPowerW:320,criticalPowerW:350};
  for(let n=0;n<20;n++)audit.observe(base);
  audit.observe({...base,leaderId:null});
  for(let n=0;n<15;n++)audit.observe(base);
  audit.observe({...base,leaderId:'H2'});
  const res=audit.report();
  assert.equal(res.longestFrontSeconds,20);
  assert.equal(res.frontSeconds,36);
  assert.equal(res.riders.length,2);
});
test('R22: Massensprint-Proxy prüft Siegergruppe, nicht größte Verfolgergruppe',()=>{
  const team=new Map();
  const riders=Array.from({length:80},(_,i)=>{
    const id='F'+i;
    team.set(id,i<4?'sprinter':'allrounder');
    return {id,finishTimeS:i===0?10000:10040+i*.02};
  });
  let out=auditSprintFinish(riders,team);
  assert.equal(out.sprintersInTop10,4);
  assert.equal(out.winnerGroupSize,1);
  assert.equal(out.massSprintProxy,false);
  const close=riders.map((r,i)=>({...r,finishTimeS:10000+i*.05}));
  out=auditSprintFinish(close,team);
  assert.equal(out.winnerGroupSize,80);
  assert.equal(out.sprintersInTop10,4);
  assert.equal(out.massSprintProxy,true);
  const noSprinters=new Map(close.map(r=>[r.id,'allrounder']));
  assert.equal(auditSprintFinish(close,noSprinters).massSprintProxy,false);
});
