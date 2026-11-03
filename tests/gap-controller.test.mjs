import test from 'node:test';
import assert from 'node:assert/strict';
import {decideGapPower,initialGapState,validateGapConfig,F8_GAP_AGENT} from '../src/engine/ai/gap-controller.ts';
import {simulateGroup,createEightRiderExample,createEightRiderAgentExample} from '../src/engine/physics/drafting-group.ts';
const cfg=()=>({...F8_GAP_AGENT});
const obs=(gapM,basePowerW=197)=>({
 timeS:40,gapM,leaderSpeedMps:11,ownSpeedMps:10.6,basePowerW,
});
test('Agent hält Watt und beobachtet eine kleine Lücke',()=>{
 const d=decideGapPower(cfg(),obs(3.4),initialGapState());
 assert.equal(d.state.mode,'halten');assert.equal(d.powerW,197);
});
test('Agent entscheidet bei wachsender Lücke eigenständig nachzusetzen',()=>{
 const d=decideGapPower(cfg(),obs(6),initialGapState());
 assert.equal(d.state.mode,'nachsetzen');assert.ok(d.powerW>197);
 assert.ok(d.reason.includes('Lücke'));
});
test('Agent setzt keine beliebigen Watt ein',()=>{
 const d=decideGapPower(cfg(),obs(80),initialGapState());
 assert.equal(d.powerW,255);
});
test('Agent beendet Nachsetzen bei geschlossener Lücke',()=>{
 const old=decideGapPower(cfg(),obs(6),initialGapState()).state;
 const d=decideGapPower(cfg(),obs(3.9),old);
 assert.equal(d.state.mode,'halten');assert.equal(d.powerW,197);
});
test('Sicherheitsvorausschau stoppt bei rasch schrumpfendem Abstand',()=>{
 const state={...initialGapState(),mode:'nachsetzen'};
 const d=decideGapPower(cfg(),{...obs(4.6),ownSpeedMps:12.5},state);
 assert.equal(d.state.mode,'halten');
});
test('Nachsetzdauer begrenzt, danach Erholungsfenster',()=>{
 const prior={mode:'nachsetzen',pursuitSeconds:30,cooldownUntilS:0};
 const d=decideGapPower(cfg(),obs(8),prior);
 assert.equal(d.state.mode,'erholen');assert.equal(d.powerW,197);
 assert.equal(d.state.cooldownUntilS,60);
 const inRest=decideGapPower(cfg(),{...obs(8),timeS:50},d.state);
 assert.equal(inRest.state.mode,'erholen');
 const afterRest=decideGapPower(cfg(),{...obs(8),timeS:60},inRest.state);
 assert.equal(afterRest.state.mode,'nachsetzen');
});
test('Ohne Vordermann keine Nachsetzentscheidung',()=>{
 const d=decideGapPower(cfg(),{...obs(null),leaderSpeedMps:null},initialGapState());
 assert.equal(d.state.mode,'halten');assert.equal(d.powerW,197);
});
test('Ungültige Agentenparameter und Messwerte werden abgewiesen',()=>{
 for(const edit of [
  c=>c.releaseGapM=9,c=>c.maxPursuitPowerW=-1,
  c=>c.maxPursuitSeconds=0,c=>c.minimumSafeGapM=5,c=>c.cooldownSeconds=-2,
 ]){
  const c=cfg();edit(c);assert.throws(()=>validateGapConfig(c),RangeError);
 }
 assert.throws(()=>decideGapPower(cfg(),{...obs(6),basePowerW:NaN},initialGapState()),RangeError);
});
test('Agentenentscheidung ist rein und deterministisch',()=>{
 const c=cfg(),o=obs(6),s=initialGapState();
 const a=decideGapPower(c,o,s),b=decideGapPower(c,o,s);
 assert.deepEqual(a,b);assert.equal(s.mode,'halten');
});
test('Ohne Agent bleibt der vollständige alte Gruppenlauf identisch',()=>{
 const x=createEightRiderExample(),y=createEightRiderAgentExample();delete y.gapAgents;
 assert.deepEqual(simulateGroup(x),simulateGroup(y));
});
test('Agenten-Versuch führt echte Wattentscheidungen aus, ohne Physik zu verändern',()=>{
 const without=simulateGroup(createEightRiderExample());
 const withAgent=simulateGroup(createEightRiderAgentExample());
 const events=withAgent.events.filter(e=>e.type==='agent-decision');
 assert.ok(events.some(e=>e.agentMode==='nachsetzen'),JSON.stringify(events));
 assert.ok(withAgent.riders[7].agentPursuitSeconds>0);
 assert.ok(withAgent.riders[7].agentExtraDriveWorkJ>0);
 const baseGap=without.riders[6].positionM-without.riders[7].positionM;
 const agentGap=withAgent.riders[6].positionM-withAgent.riders[7].positionM;
 assert.ok(agentGap<baseGap-0.1,`KI-Lücke ${agentGap} versus Basis ${baseGap}`);
 assert.ok(agentGap>1.8);
 for(const r of withAgent.riders)assert.ok(Math.abs(r.energyResidualJ)<0.05,
  `${r.id}: Restenergie ${r.energyResidualJ}`);
});
test('Die Entscheidung verändert ausschließlich F8, nicht die sieben vorderen Fahrer',()=>{
 const a=simulateGroup(createEightRiderExample());
 const b=simulateGroup(createEightRiderAgentExample());
 for(let i=0;i<7;i++){
  assert.ok(Math.abs(a.riders[i].positionM-b.riders[i].positionM)<1e-6,
    `Fahrer F${i+1} beeinflusst`);
 }
});
test('Der Agentenlauf liefert gleiche Daten bei gleicher Eingabe',()=>{
 assert.deepEqual(simulateGroup(createEightRiderAgentExample()),
  simulateGroup(createEightRiderAgentExample()));
});
test('Unbekannte oder doppelte Agenten werden abgewiesen',()=>{
 const x=createEightRiderAgentExample();
 x.gapAgents[0].riderId='Unbekannt';
 assert.throws(()=>simulateGroup(x),RangeError);
 const y=createEightRiderAgentExample();
 y.gapAgents.push({...F8_GAP_AGENT});
 assert.throws(()=>simulateGroup(y),RangeError);
});
test('Mit höchstens Basisleistung kann kein Nachsetzen versprochen werden',()=>{
 const x=createEightRiderAgentExample();
 x.gapAgents[0].maxPursuitPowerW=10;
 assert.throws(()=>simulateGroup(x),RangeError);
});
