import test from 'node:test';
import assert from 'node:assert/strict';
import {createRaceReport} from '../src/engine/race/race-report.ts';
const classification=[{id:'a',teamId:'T1',rank:1,finishTimeS:100,groupTimeS:100,groupGapS:0},
  {id:'b',teamId:'T2',rank:2,finishTimeS:100.4,groupTimeS:100,groupGapS:0},
  {id:'c',teamId:'T1',rank:3,finishTimeS:103,groupTimeS:103,groupGapS:3}];
const events=[{type:'attack',timeS:20,km:2,riderId:'a',teamId:'T1',description:'Angriff'},
  {type:'breakaway',timeS:35,km:3,description:'Fluchtgruppe'},
  {type:'finish',timeS:100,km:10,riderId:'a',teamId:'T1',description:'Ziel'}];
test('Bericht nutzt Reihenfolge, Gruppenzeiten und vorher benannte Favoriten',()=>{
 const r=createRaceReport({result:{classification,events},favorites:[{riderId:'c',preRaceRank:1}]});
 assert.equal(r.winner.riderId,'a');assert.equal(r.results[1].groupTimeS,100);
 assert.deepEqual(r.favorites,[{riderId:'c',preRaceRank:1,finishRank:3,groupGapS:3}]);
 assert.deepEqual(r.events.map(e=>e.type),['attack','breakaway']);
});
test('Teamfilter und abgeschnittener Bericht behaupten keine weiteren Ursachen',()=>{
 const r=createRaceReport({result:{classification,events},focusTeamId:'T1',eventLimit:1});
 assert.deepEqual(r.results.map(x=>x.riderId),['a','c']);
 assert.equal(r.events[0].description,'Angriff');assert.equal(r.eventCount,2);
 assert.equal(r.truncated,true);
});
