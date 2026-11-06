import test from 'node:test';
import assert from 'node:assert/strict';
import {decideBreakawayWork,breakawayWorkInterest,willingBreakawayPartner,observeBreakawayRelay}
 from '../src/engine/race/breakaway-cooperation.ts';
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

test('Nur selbst arbeitsbereite und verfügbare Fahrer bieten eine Ablösung an',()=>{
 const inputs=[
  {teamStrategy:'offensiv',teamSprinterBehind:false,reserveFraction:.7,currentIntent:'grundtempo'},
  {teamStrategy:'sprint',teamSprinterBehind:true,reserveFraction:.7,currentIntent:'grundtempo'},
  {teamStrategy:'offensiv',teamSprinterBehind:false,reserveFraction:.1,currentIntent:'grundtempo'},
  {teamStrategy:'offensiv',teamSprinterBehind:false,reserveFraction:.7,currentIntent:'angriff'},
  {teamStrategy:'offensiv',teamSprinterBehind:false,reserveFraction:.7,currentIntent:'grundtempo',unavailable:true},
 ];
 assert.deepEqual(inputs.map(breakawayWorkInterest),['work','save','save',null,null]);
 const group=inputs.map((x,i)=>({id:'F'+i,positionM:99-i,
  offersWork:breakawayWorkInterest(x)==='work'}));
 assert.equal(willingBreakawayPartner({frontPositionM:100,candidates:group}),'F0');
 assert.equal(willingBreakawayPartner({frontPositionM:100,candidates:group.slice(1)}),null);
});
test('Eine entfernte oder vorausfahrende Person wird nicht als naher Nachfolger gewählt',()=>{
 const candidates=[{id:'weit',positionM:87,offersWork:true},
  {id:'vorne',positionM:101,offersWork:true},
  {id:'kein Interesse',positionM:99,offersWork:false},
  {id:'nah',positionM:89,offersWork:true}];
 assert.equal(willingBreakawayPartner({frontPositionM:100,candidates}),'nah');
 assert.equal(willingBreakawayPartner({frontPositionM:100,candidates:candidates.slice(0,3)}),null);
});

test('Ein Ablöseangebot wird nur bei tatsächlichem Positionswechsel als solcher erfasst',()=>{
 const base={sameTrackedGroup:true,elapsedS:5,formerPositionM:100,partnerPositionM:99};
 assert.equal(observeBreakawayRelay(base),'waiting');
 assert.equal(observeBreakawayRelay({...base,partnerPositionM:101}),'position-change');
 assert.equal(observeBreakawayRelay({...base,partnerPositionM:101,elapsedS:0}),'waiting');
 assert.equal(observeBreakawayRelay({...base,partnerPositionM:101,sameTrackedGroup:false}),'expired');
 assert.equal(observeBreakawayRelay({...base,partnerPositionM:101,elapsedS:121}),'expired');
});
