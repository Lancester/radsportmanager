import test from 'node:test';
import assert from 'node:assert/strict';
import {createRaceReport,formatRaceReport} from '../src/engine/race/race-report.ts';
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
 assert.match(formatRaceReport(r),/Gewertete Siegerzeit: 0:01:40/);
});
test('Teamfilter und abgeschnittener Bericht behaupten keine weiteren Ursachen',()=>{
 const r=createRaceReport({result:{classification,events},focusTeamId:'T1',eventLimit:1});
 assert.deepEqual(r.results.map(x=>x.riderId),['a','c']);
 assert.equal(r.events[0].description,'Angriff');assert.equal(r.eventCount,2);
 assert.equal(r.truncated,true);
});
test('Gemessene Frontarbeit ist von nicht durchgeführter Messung unterscheidbar',()=>{
 const absent=createRaceReport({result:{classification,events}});
 assert.equal(absent.breakawayFrontWork,null);
 assert.match(formatRaceReport(absent),/Keine Frontmessung aufgezeichnet/);
 const measured=createRaceReport({result:{classification,events,diagnostics:{
  breakawayFrontWork:{riders:[{riderId:'c',teamId:'T1',frontSeconds:120,
    crankWorkJ:36000,windExposedSeconds:110}]} }},focusTeamId:'T1'});
 assert.equal(measured.breakawayFrontWork[0].frontSeconds,120);
 assert.match(formatRaceReport(measured),/c \(T1\): 2:00 min:s, 36 kJ/);
 assert.match(formatRaceReport(measured),/Frontposition belegt keine Absprache/);
 const zero=createRaceReport({result:{classification,events,diagnostics:{
  breakawayFrontWork:{riders:[]}}}});
 assert.deepEqual(zero.breakawayFrontWork,[]);
 assert.match(formatRaceReport(zero),/keine Frontarbeit aufgezeichnet/);
});

test('Bericht unterscheidet Angebot und beobachteten Positionswechsel',()=>{
 const relay=[{type:'breakaway-relay-request',timeS:40,km:4,description:'Angebot'},
  {type:'breakaway-relay-position-change',timeS:45,km:4.1,description:'Positionswechsel'}];
 const result=createRaceReport({result:{classification,events:relay}});
 assert.deepEqual(result.events.map(e=>e.type),
  ['breakaway-relay-request','breakaway-relay-position-change']);
});
