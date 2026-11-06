import test from 'node:test';
import assert from 'node:assert/strict';
import {coordinatePelotonChase} from '../src/engine/race/peloton-chase.ts';

const previous={active:['T10'],sinceS:100,cooldownUntilS:0};
const riders=[
  {id:'C',teamId:'T10',role:'kapitaen',positionM:1000,speedMps:12,criticalPowerW:380,reserveFraction:.9,aggression:.5},
  {id:'H1',teamId:'T10',role:'helfer',positionM:990,speedMps:12,criticalPowerW:350,reserveFraction:.85,aggression:.4},
  {id:'H2',teamId:'T10',role:'helfer',positionM:985,speedMps:12,criticalPowerW:340,reserveFraction:.8,aggression:.4},
  {id:'H3',teamId:'T10',role:'helfer',positionM:982,speedMps:12,criticalPowerW:345,reserveFraction:.8,aggression:.4},
  {id:'L',teamId:'T99',role:'kapitaen',positionM:1603,speedMps:12,criticalPowerW:390,reserveFraction:.8,aggression:.4},
];
const situation={leadingBreakaway:true,gapM:603,breakawaySize:1,mainGroupSize:4,
 relativeSpeedMps:0,projectedGapM:550,gapFractionOfRemaining:.0089,chaseViable:true,
 leadingRiderIds:['L']};
const make=(patch={})=>({
 timeS:110,remainingM:68000,progress:.68,
 mainGroupIds:new Set(['C','H1','H2','H3']),riders,teams:[{id:'T10',strategy:'kapitaen_schuetzen'}],
 situation,previous,sprintFinaleMode:false,adaptiveChase:true,...patch,
});
test('R24: bleibender Teamauftrag gegen kurzzeitiges Urgency-Flattern',()=>{
 const x=coordinatePelotonChase(make());
 assert.deepEqual([...x.chasingTeamIds],['T10']);
 assert.equal(x.state.sinceS,100);
});
test('R24: nach 150 s ohne aktuelle Dringlichkeit regulär beenden',()=>{
 const x=coordinatePelotonChase(make({timeS:260}));
 assert.deepEqual([...x.chasingTeamIds],[]);
});
test('R24: eingefangene Spitze beendet die Jagd unmittelbar',()=>{
 const x=coordinatePelotonChase(make({situation:{...situation,leadingBreakaway:false,gapM:0}}));
 assert.deepEqual([...x.chasingTeamIds],[]);
});
test('R24: keine körperlich einsatzfähigen Helfer – keine Phantomjagd',()=>{
 const weak=riders.map(x=>x.teamId==='T10'&&x.role==='helfer'?{...x,reserveFraction:.2}:x);
 const x=coordinatePelotonChase(make({riders:weak}));
 assert.deepEqual([...x.chasingTeamIds],[]);
});
test('R24: Kapitän des Teams vorn – kein eigener Verfolgungsauftrag',()=>{
 const x=coordinatePelotonChase(make({situation:{...situation,leadingRiderIds:['C']}}));
 assert.deepEqual([...x.chasingTeamIds],[]);
});
test('R24: kein Hauptfeldmitglied – kein Auftrag',()=>{
 const x=coordinatePelotonChase(make({mainGroupIds:new Set(['L'])}));
 assert.deepEqual([...x.chasingTeamIds],[]);
});
