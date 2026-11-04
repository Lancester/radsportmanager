import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceChaseHelperLoad,initialChaseHelperLoad,
  spentHelperRetreatPower,decideCommittedChasePull,CHASE_HELPER_SPENT}
  from '../src/engine/race/chase-helper-fatigue.ts';

const sample={
  enabled:true,progress:.76,timeS:11000,dt:1,
  teamStrategy:'sprint',role:'helfer',
  mission:'jagd',duty:'fuehrung',
  distanceFromRealGroupFrontM:5,physicalGroupSize:110,
  criticalPowerW:350,appliedCrankPowerW:325,
  reserveFraction:.92,enduranceAvailability:.87,
};
test('R22: only REAL, late high-intensity group-front watts can retire a chase helper',()=>{
  let state=initialChaseHelperLoad();
  let retirements=0,retireTime=-1;
  for(let k=0;k<1400;k++){
    const r=advanceChaseHelperLoad(state,{...sample,timeS:11000+k});
    state=r.state;
    if(r.retireNow){retirements++;retireTime=11000+k;}
  }
  assert.equal(retirements,1,'once spent, no repeated triggers');
  assert.equal(state.spent,true);
  assert.ok(state.realFrontSeconds>=CHASE_HELPER_SPENT.minimumRealFrontSeconds);
  assert.ok(state.realFrontSeconds>=1100,
    'kontrollierte Jagd darf rund 20 min an der Front dauern');
  assert.ok(state.highLoadJ>=CHASE_HELPER_SPENT.highLoadTriggerJ);
  assert.equal(state.retreatStartS,retireTime+1);
  assert.equal(state.retreatUntilS-state.retreatStartS,
    CHASE_HELPER_SPENT.retreatSeconds);
});
test('R22: only truly applied power, NEVER the desired watts, count as hard chase load',()=>{
  let x=initialChaseHelperLoad();
  for(let k=0;k<1000;k++){
    const r=advanceChaseHelperLoad(x,{...sample,timeS:12000+k,
      appliedCrankPowerW:250});
    x=r.state;
    assert.equal(r.retireNow,false);
  }
  assert.equal(x.spent,false);
  assert.equal(x.highLoadJ,0);
});
test('R22: no artificial helper withdrawal before final third, without actual front work or on other race modes',()=>{
  for(const changes of [
    {enabled:false},
    {progress:.60},
    {teamStrategy:'offensiv'},
    {role:'sprinter'},
    {mission:'sprintzug'},
    {duty:'unterstuetzung'},
    {distanceFromRealGroupFrontM:20},
    {physicalGroupSize:3},
  ]){
    const r=advanceChaseHelperLoad(initialChaseHelperLoad(),
      {...sample,...changes,appliedCrankPowerW:700});
    assert.equal(r.retireNow,false);
    assert.equal(r.state.realFrontSeconds,0);
    assert.equal(r.state.highLoadJ,0);
  }
});
test('R22: an exhausted helper stops pedaling, physically slows, then returns to normal Watt regime',()=>{
  let state=initialChaseHelperLoad();
  for(let k=0;k<1400&&!state.spent;k++){
    state=advanceChaseHelperLoad(state,{...sample,timeS:11000+k}).state;
  }
  assert.ok(state.spent);
  const first=spentHelperRetreatPower(state,state.retreatStartS,
    350,325);
  const later=spentHelperRetreatPower(state,
    state.retreatStartS+CHASE_HELPER_SPENT.initialFreewheelSeconds+3,
    350,325);
  assert.ok(first!==null&&later!==null);
  assert.ok(first<later);
  assert.ok(first<=350*CHASE_HELPER_SPENT.initialCpFraction);
  assert.ok(later<=350*CHASE_HELPER_SPENT.laterCpFraction);
  assert.equal(spentHelperRetreatPower(state,state.retreatUntilS,
    350,325),null);
  assert.equal(spentHelperRetreatPower(state,state.retreatStartS-1,
    350,325),null);
  // The tactic returns only watts; no position, velocity or free energy.
  assert.deepEqual(Object.keys(state).sort(),[
    'highLoadJ','realFrontSeconds','retreatStartS','retreatUntilS','spent'
  ]);
});

test('R22: CP-naher, langer Jagdeinsatz fordert tatsächlich höhere Watt gegen eine Flucht',()=>{
  const base={
    enabled:true,progress:.78,strategy:'sprint',role:'helfer',
    mission:'jagd',duty:'fuehrung',groupSize:112,
    distanceFromGroupFrontM:2,escapeGapM:470,
    remainingM:44000,cpW:350,reserveFraction:.87,
    enduranceAvailability:.86,originalRequestedW:300,
  };
  const target=decideCommittedChasePull(base);
  assert.ok(target!==null&&target>300);
  assert.ok(target<=350*1.20,
    'Requested watts are still CP/Wprime limited in the engine');
  assert.ok(target*.86>=350*.97,
    'Actual target is at least about 97 percent CP');
  assert.equal(decideCommittedChasePull({...base,role:'sprinter'}),null);
  assert.equal(decideCommittedChasePull({...base,mission:'sprintzug'}),null);
  assert.equal(decideCommittedChasePull({...base,progress:.60}),null);
  assert.equal(decideCommittedChasePull({...base,escapeGapM:20}),null);
  assert.equal(decideCommittedChasePull({...base,
    distanceFromGroupFrontM:30}),null);
  assert.equal(decideCommittedChasePull({...base,
    reserveFraction:.1}),null);
});
test('R22: near 20-minute sustained effort versus short Wprime exhaustion',()=>{
  const base={...sample,appliedCrankPowerW:325};
  let steady=initialChaseHelperLoad();
  for(let sec=0;sec<1000;sec++){
    const step=advanceChaseHelperLoad(steady,{...base,timeS:10000+sec});
    steady=step.state;
    assert.equal(step.retireNow,false,
      'sustainable 0.93 CP chase should not retire in the first 1000 seconds');
  }
  let fired=false;
  for(let sec=1000;sec<1300;sec++){
    const step=advanceChaseHelperLoad(steady,{...base,timeS:10000+sec});
    steady=step.state;
    if(step.retireNow){fired=true;break;}
  }
  assert.ok(fired,'near-20-minute steady helper eventually yields');
  // Athletes already losing Wprime may stop sooner, but still NOT
  // after just 100 seconds of real front work.
  let hard=initialChaseHelperLoad();
  let hardSec=0;
  for(;hardSec<1100&&!hard.spent;hardSec++){
    hard=advanceChaseHelperLoad(hard,{
      ...base,timeS:11000+hardSec,appliedCrankPowerW:390,
      reserveFraction:hardSec<650?.4:.12,
    }).state;
  }
  assert.ok(hard.spent);
  assert.ok(hard.realFrontSeconds>=CHASE_HELPER_SPENT.minimumRealFrontSeconds);
});
