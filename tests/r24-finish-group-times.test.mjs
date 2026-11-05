import test from 'node:test';
import assert from 'node:assert/strict';
import {assignFinishGroupTimes} from '../src/engine/race/finish-groups.ts';

test('Zielreihenfolge und Zeit der Gruppe bleiben getrennt',()=>{
  const r=assignFinishGroupTimes([{id:'c',finishTimeS:102.2},{id:'a',finishTimeS:100},
    {id:'d',finishTimeS:102.7},{id:'b',finishTimeS:100.9}],1);
  assert.deepEqual(r.map(x=>x.id),['a','b','c','d']);
  assert.deepEqual(r.map(x=>x.groupIndex),[1,1,2,2]);
  assert.deepEqual(r.map(x=>x.groupTimeS),[100,100,102.2,102.2]);
  assert.deepEqual(r.map(x=>x.finishTimeS),[100,100.9,102.2,102.7]);
});
test('Grenze ist konfigurierbar und exakte Nachbarlücke beginnt neue Gruppe',()=>{
  const riders=[{id:'a',finishTimeS:10},{id:'b',finishTimeS:11},{id:'c',finishTimeS:12}];
  assert.deepEqual(assignFinishGroupTimes(riders,1).map(x=>x.groupIndex),[1,2,3]);
  assert.deepEqual(assignFinishGroupTimes(riders,2).map(x=>x.groupIndex),[1,1,1]);
  assert.throws(()=>assignFinishGroupTimes(riders,0),RangeError);
});
