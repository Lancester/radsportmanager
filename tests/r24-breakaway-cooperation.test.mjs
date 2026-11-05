import test from 'node:test';
import assert from 'node:assert/strict';
import {decideBreakawayWork} from '../src/engine/race/breakaway-cooperation.ts';
const base={isTrackedEscape:true,isActualFront:true,nearbyTrackedCompanions:1,
 teamStrategy:'offensiv',teamSprinterBehind:false,reserveFraction:.8,
 criticalPowerW:350,requestedPowerW:300,currentIntent:'grundtempo'};
test('Ein vorn fahrender Ausreißer kann aus gemeinsamem Interesse arbeiten',()=>{
 const d=decideBreakawayWork(base);
 assert.equal(d?.intent,'work');assert.ok(d.powerW>base.requestedPowerW);
});
test('Sprinterteam und erschöpfte Fahrer können Mitarbeit reduzieren',()=>{
 for(const x of [{...base,teamStrategy:'sprint',teamSprinterBehind:true},
  {...base,reserveFraction:.1}]){
  const d=decideBreakawayWork(x);assert.equal(d?.intent,'save');
  assert.ok(d.powerW<=x.requestedPowerW);
 }
 assert.equal(decideBreakawayWork({...base,teamStrategy:'sprint',
  teamSprinterBehind:false})?.intent,'work');
});
test('Keine Führungsanweisung ohne reale gemeinsame Spitzensituation',()=>{
 for(const x of [{...base,isActualFront:false},{...base,isTrackedEscape:false},
  {...base,nearbyTrackedCompanions:0},{...base,currentIntent:'angriff'}])
  assert.equal(decideBreakawayWork(x),null);
});
