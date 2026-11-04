import test from 'node:test';
import assert from 'node:assert/strict';
import {decideClassicsApproach,decideClassicsRampTempo,
  CLASSICS_RACECRAFT,chooseClassicsNominee}
  from '../src/engine/race/classics-racecraft.ts';
const o={enabled:true,specialty:'klassiker',role:'helfer',
  isDesignatedRider:true,isSelectedGroupPacer:true,
  progress:.84,segmentProgress:.43,
  gradeFraction:.09,segmentLengthM:1600,
  physicalGroupSize:32,rankInPhysicalGroup:26,
  gapToGroupFrontM:68,gapToRaceFrontM:55,
  criticalPowerW:380,reserveFraction:.74,
  requestedPowerW:260,intent:'windschatten'};
test('Klassiker: positioniert sich mit echten CP-nahen Watt, kein Vorziehen durch Positionsbonus',()=>{
  const x=decideClassicsApproach({...o,progress:.75});
  assert.ok(x>o.requestedPowerW);
  assert.ok(x<=o.criticalPowerW*CLASSICS_RACECRAFT.positioningMaxCp);
  for(const specialty of ['kletterer','allrounder','zeitfahrer'])
    assert.ok(decideClassicsApproach({...o,specialty,
      progress:.75})!==null);
  assert.ok(x-o.requestedPowerW<=CLASSICS_RACECRAFT.positioningMaxExtraW);
  assert.ok(decideClassicsApproach({...o,requestedPowerW:380})-380<=
    CLASSICS_RACECRAFT.positioningMaxExtraW);
  assert.equal(decideClassicsApproach({...o,requestedPowerW:450}),null);
  for(const changed of [
    {enabled:false},{specialty:'sprinter'},{isDesignatedRider:false},
    {progress:.99},{progress:.1},{physicalGroupSize:8,rankInPhysicalGroup:5},
    {rankInPhysicalGroup:3},{gapToGroupFrontM:181},
    {reserveFraction:.05},{intent:'angriff'},{intent:'erholung'},
  ])assert.equal(decideClassicsApproach({...o,...changed}),null);
});
test('Klassiker: nur echter vorderer Rampenfahrer darf kontinuierliches Tempo beantragen',()=>{
  const requested=decideClassicsRampTempo({...o,rankInPhysicalGroup:4});
  assert.ok(requested>o.criticalPowerW);
  assert.ok(requested<=o.criticalPowerW*CLASSICS_RACECRAFT.selectionMaxCp);
  for(const specialty of ['klassiker','kletterer','allrounder',
    'zeitfahrer'])assert.ok(decideClassicsRampTempo({
      ...o,specialty,rankInPhysicalGroup:4})!==null);
  for(const changed of [
    {enabled:false},{specialty:'sprinter'},{isDesignatedRider:false},
    {isSelectedGroupPacer:false},{progress:.72},{progress:.99},
    {gradeFraction:.05},{segmentLengthM:13500},{segmentProgress:.02},
    {segmentProgress:.99},{physicalGroupSize:1,rankInPhysicalGroup:1},
    {gapToGroupFrontM:71},{gapToRaceFrontM:241},
    {reserveFraction:.05},{intent:'angriff'},
    {intent:'helferarbeit'},{intent:'erholung'}
  ])assert.equal(decideClassicsRampTempo({...o,rankInPhysicalGroup:4,...changed}),null);
  assert.throws(()=>decideClassicsRampTempo({...o,rankInPhysicalGroup:33}),RangeError);
});

test('Klassiker-KI senkt niemals die Gruppenwatt ab und ignoriert ungültige Positions- oder Physikdaten',()=>{
  for(const demand of [260,330,380,430]){
    const x=decideClassicsRampTempo({...o,rankInPhysicalGroup:4,
      requestedPowerW:demand});
    if(x!==null)assert.ok(x>demand);
    const ahead=decideClassicsApproach({...o,progress:.75,
      requestedPowerW:demand});
    if(ahead!==null){
      assert.ok(ahead>demand);
      assert.ok(ahead-demand<=CLASSICS_RACECRAFT.positioningMaxExtraW+1e-8);
    }
  }
  for(const invalid of [
    {criticalPowerW:0},{requestedPowerW:-1},
    {requestedPowerW:NaN},{reserveFraction:1.2},
    {physicalGroupSize:2,rankInPhysicalGroup:3},
    {rankInPhysicalGroup:0},{gapToGroupFrontM:-1},
    {progress:1.01},{segmentLengthM:0},
  ]){
    assert.throws(()=>decideClassicsApproach({...o,...invalid}),RangeError);
    assert.throws(()=>decideClassicsRampTempo({...o,...invalid}),RangeError);
  }
});
test('Klassiker: Team bevorzugt Puncheur nur bei fast gleicher physischer Rampenstärke',()=>{
  const c=[
    {id:'K',specialty:'klassiker',score:6.3},
    {id:'B',specialty:'kletterer',score:6.7},
    {id:'A',specialty:'allrounder',score:5.9},
    {id:'S',specialty:'sprinter',score:9.0},
  ];
  assert.equal(chooseClassicsNominee(c),'K',
    'ein körperlich fast gleich starker Klassikerspezialist wird nominiert');
  assert.equal(chooseClassicsNominee(c.map(x=>
    x.id==='K'?{...x,score:5.5}:x)),'B',
    'klar stärkerer Kletterer darf den Klassiker ablösen');
  assert.equal(chooseClassicsNominee([{id:'S',specialty:'sprinter',score:10}]),null);
  assert.equal(chooseClassicsNominee([...c].reverse()),'K');
  assert.equal(chooseClassicsNominee([]),null);
});

