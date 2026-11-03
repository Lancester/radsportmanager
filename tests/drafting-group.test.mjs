import test from 'node:test';
import assert from 'node:assert/strict';
import {aeroFactorsForGroup,simulateGroup,createEightRiderExample} from '../src/engine/physics/drafting-group.ts';
import {R03_DRAFT,requiredCrankPowerAtSpeedW} from '../src/engine/physics/drafting-pair.ts';
const near=(a,b,tol=1e-7)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=tol,`${a} statt ${b}`);
const base=()=>createEightRiderExample();
test('acht Fahrer mit gemeinsamer Uhr und 600 Zeitschritten',()=>{
  const r=simulateGroup(base());
  assert.equal(r.riders.length,8);near(r.elapsedS,120,1e-8);assert.equal(r.steps,600);
  assert.equal(r.snapshots[0].timeS,0);near(r.snapshots.at(-1).timeS,120,1e-8);
});
test('Führender im Wind, alle Hinterleute geschützt',()=>{
  const f=aeroFactorsForGroup(base().riders);
  near(f[0],1);
  assert.ok(f.slice(1).every(v=>v<1&&v>1-R03_DRAFT.maximumAeroReduction));
});
test('Mehrfachabschirmung stärker als einzelner Nachbar, aber gedeckelt',()=>{
  const x=[{positionM:10,lateralPositionM:0},{positionM:7,lateralPositionM:0},{positionM:4,lateralPositionM:0}];
  const combined=aeroFactorsForGroup(x)[2],single=aeroFactorsForGroup(x.slice(1))[1];
  assert.ok(combined<single&&combined>=1-R03_DRAFT.maximumAeroReduction);
});
test('Mit Lücke sinkt Windschattenwirkung',()=>{
  const x=base(),a=aeroFactorsForGroup(x.riders)[7];
  x.riders[7].positionM-=20;
  assert.ok(aeroFactorsForGroup(x.riders)[7]>a);
});
test('Seitlich versetzter Fahrer ist weniger geschützt',()=>{
  const x=base(),a=aeroFactorsForGroup(x.riders)[7];
  x.riders[7].lateralPositionM=3;
  assert.ok(aeroFactorsForGroup(x.riders)[7]>a);
});
test('Statische Watt-Auslegung hält ohne Befehl die Formation',()=>{
  const x=base();x.commands=[];x.durationS=35;
  const r=simulateGroup(x);
  r.riders.forEach((v,i)=>{near(v.speedMps,11,1e-6);near(v.positionM,x.riders[i].positionM+385,0.001)});
});
test('Ab Sekunde 30 entsteht beim letzten Fahrer eine echte Lücke',()=>{
  const r=simulateGroup(base()),s=r.snapshots;
  const before=s[0].riders[6].positionM-s[0].riders[7].positionM;
  const after=r.riders[6].positionM-r.riders[7].positionM;
  assert.ok(after>before+3,`Abstand ${after}`);
  assert.ok(r.events.some(e=>e.type==='gap-opened'&&e.riderId==='F8'));
});
test('Jeder Fahrer erfüllt seine mechanische Energiebilanz',()=>{
  for(const r of simulateGroup(base()).riders){
    assert.ok(Math.abs(r.energyResidualJ)<0.01,String(r.energyResidualJ));
    near(r.driveWorkJ-r.aeroLossJ-r.rollingLossJ,r.kineticEnergyChangeJ,0.01);
  }
});
test('Eingabereihenfolge ändert keine Fahrerresultate',()=>{
  const x=base(),y=base();y.riders.reverse();
  const a=simulateGroup(x),b=simulateGroup(y);
  const lookup=new Map(b.riders.map(r=>[r.id,r]));
  for(const rider of a.riders){
    near(rider.positionM,lookup.get(rider.id).positionM,1e-8);
    near(rider.aeroLossJ,lookup.get(rider.id).aeroLossJ,1e-8);
  }
});
test('Kleinere Integrationsschritte liefern ähnliche Ergebnisse',()=>{
  const x=base(),y=base();x.stepSeconds=.1;y.stepSeconds=.2;
  const a=simulateGroup(x),b=simulateGroup(y);
  for(let i=0;i<8;i++)near(a.riders[i].speedMps,b.riders[i].speedMps,.02);
});
test('Drei Fahrer gemeinsam sind ebenfalls erlaubt',()=>{
  const x=base();x.riders=x.riders.slice(0,3);x.commands=[];x.durationS=30;
  const r=simulateGroup(x);
  assert.equal(r.riders.length,3);near(r.elapsedS,30,1e-8);
});
test('Rückwärtige Fahrer verbessern Führenden im ersten Modell nicht',()=>{
  const x=base();near(aeroFactorsForGroup(x.riders)[0],1);
  near(aeroFactorsForGroup(x.riders.slice(0,3))[0],1);
});
test('Kollision in einer Spur führt zum Fehler',()=>{
  const x=base();x.riders[7].positionM=x.riders[6].positionM-.4;
  assert.throws(()=>simulateGroup(x),/Kollision/);
});
test('Fahrerzahl, IDs und fehlerhafte Eingaben werden zurückgewiesen',()=>{
  const changes=[
    x=>x.riders=x.riders.slice(0,2),
    x=>x.riders.push({...x.riders[7],id:'F9',positionM:-3.4}),
    x=>x.riders[1].id='F1',
    x=>x.riders[1].crankPowerW=-1,
    x=>x.riders[0].physical.dragAreaM2=0,
    x=>x.durationS=-1,
    x=>x.stepSeconds=2,
    x=>x.commands=[{timeS:1,riderId:'Z',crankPowerW:50}],
    x=>x.commands=[{timeS:1,riderId:'F8',crankPowerW:-1}],
  ];
  for(const change of changes){const x=base();change(x);assert.throws(()=>simulateGroup(x),RangeError)}
});
test('Deterministisch und Kommandozeitpunkt ist Sekunde 30',()=>{
  const a=simulateGroup(base()),b=simulateGroup(base());assert.deepEqual(a,b);
  const command=a.events.find(e=>e.type==='command');assert.ok(command);
  near(command.timeS,30,1e-8);
});
test('Windschatten wirkt auf Luftleistung, nicht auf Rollleistung',()=>{
  const x=base(),f=aeroFactorsForGroup(x.riders),r=x.riders[7].physical;
  const a=requiredCrankPowerAtSpeedW(r,11,1),b=requiredCrankPowerAtSpeedW(r,11,f[7]);
  assert.ok(b.crankPowerW<a.crankPowerW);
  near(a.rollingPowerW,b.rollingPowerW,1e-10);
});
