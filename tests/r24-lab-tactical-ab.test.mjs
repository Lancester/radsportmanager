import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateRace} from '../src/engine/race/race-simulator.ts';
import {buildLabRace,initialLabSettings} from '../src/labor/lab-settings.ts';
import {DEFAULT_TEAM_PLAN} from '../src/engine/race/team-tactical-plan.ts';

/** Identischer Seed, dieselbe Physik, dieselben Fahrer. Nur Vorabpläne wechseln.
 * Keine künstlichen Gewinner oder Ergebniskorrekturen.
 */
test('Rennlabor Taktik-A/B: alle Attacken unterbinden verändert einen vollen Rennlauf',()=>{
 const initial=initialLabSettings();initial.routeId='tdf25_boulogne';
 initial.seed=42;initial.timingRule='road-1s';
 const base=buildLabRace(initial).input;
 const normal=simulateRace(base);
 const forced=structuredClone(initial);
 forced.teams=base.teams.map(t=>({teamId:t.id,strategy:t.strategy,
   tacticalPlan:{...DEFAULT_TEAM_PLAN,attackRisk:'keine',
     chasePolicy:'vermeiden'}}));
 const testInput=buildLabRace(forced).input;
 assert.deepEqual(testInput.riders,base.riders);
 assert.deepEqual(testInput.segments,base.segments);
 const restricted=simulateRace(testInput);
 const attacks=x=>x.events.filter(e=>e.type==='attack').length;
 assert.ok(attacks(normal)>0,'Referenzrennen muss echte Attacken besitzen');
 assert.equal(attacks(restricted),0,'Attackenverbot gilt für jedes Team');
 assert.equal(normal.classification.length,154);
 assert.equal(restricted.classification.length,154);
 assert.notDeepEqual(normal.classification,restricted.classification,
   'Der Taktikplan muss einen messbar veränderten Rennverlauf ergeben');
 console.log('Taktik-A/B Boulogne Seed 42:',JSON.stringify({
   originalAttacks:attacks(normal),restrictedAttacks:attacks(restricted),
   originalWinner:normal.winnerId,restrictedWinner:restricted.winnerId,
   finishers:restricted.classification.length,
 }));
},{timeout:180000});
