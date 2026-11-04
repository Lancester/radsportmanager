import test from 'node:test';
import assert from 'node:assert/strict';
import {decideClassicsApproach,decideClassicsRampTempo,
  CLASSICS_RACECRAFT} from '../src/engine/race/classics-racecraft.ts';
const o={enabled:true,specialty:'klassiker',role:'helfer',
  isDesignatedRider:true,isSelectedGroupPacer:true,
  progress:.84,segmentProgress:.43,
  gradeFraction:.09,segmentLengthM:1600,
  physicalGroupSize:32,rankInPhysicalGroup:26,
  gapToGroupFrontM:68,gapToRaceFrontM:55,
  criticalPowerW:380,reserveFraction:.74,
  requestedPowerW:260,intent:'windschatten'};
test('Klassiker: positioniert sich mit echten CP-nahen Watt, kein Vorziehen durch Positionsbonus',()=>{
  const x=decideClassicsApproach({...o,progress:.55});
  assert.ok(x>o.requestedPowerW);
  assert.ok(x<=o.criticalPowerW*CLASSICS_RACECRAFT.positioningMaxCp);
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
