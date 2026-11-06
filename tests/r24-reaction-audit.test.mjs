import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeReactions} from '../scripts/r24-reaction-audit.mjs';
test('Reaktionsauswertung zählt Ereignisse, getrennte Fahrer und Distanzen',()=>{
 const race={route:'test',seed:42,preRace:{top10:[{riderId:'A'}]},
  classification:[{id:'A',rank:3}],events:[
   {type:'attack',riderId:'F',timeS:5,km:1},
   {type:'chase',riderId:'A',timeS:10,km:2,description:'A: Reaktion auf Angriff von F'},
   {type:'chase',riderId:'B',timeS:10,km:2,description:'B: Reaktion auf Angriff von F'},
   {type:'chase',riderId:'A',timeS:30,km:32,description:'A: Reaktion auf Angriff von F'},
   {type:'chase',riderId:'A',timeS:40,km:33,description:'Teamtempo'}]};
 const x=summarizeReactions(race);
 assert.equal(x.attackStarts,1);assert.equal(x.chaseStarts,4);assert.equal(x.reactionStarts,3);
 assert.equal(x.reactionDistinctRiders,2);assert.equal(x.maxReactionStartsSameTime,2);
 assert.deepEqual(x.reactionStartsBy30Km,[{fromKm:0,toKm:30,starts:2},{fromKm:30,toKm:60,starts:1}]);
 assert.deepEqual(x.mostFrequentTargets,[{attackerId:'F',starts:3,distinctRiders:2}]);
 assert.deepEqual(x.favorites,[{riderId:'A',finishRank:3,attackStarts:0,reactionStarts:2}]);
 assert.throws(()=>summarizeReactions({}),/Ereignisliste/);
});
