import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLabRace,initialLabSettings} from '../src/labor/lab-settings.ts';

test('LAB: gespeicherte Eingaben reproduzierbar, Original unverändert',()=>{
 const settings=initialLabSettings();
 const a=buildLabRace(settings),b=buildLabRace(settings);
 assert.deepEqual(a.input,b.input);assert.equal(a.input.teams.length,22);
 assert.equal(a.input.riders.length,154);assert.equal(a.input.groupRidingModel,'stable-pack');
});
test('LAB: Wind und Fahrer-Änderung landen in tatsächlichen Sim-Eingaben',()=>{
 const original=buildLabRace(initialLabSettings()).input;
 const settings=initialLabSettings();
 settings.wind={headwindMps:3,crosswindMps:4};
 settings.teams=[{teamId:'T01',strategy:'offensiv'}];
 settings.riders=[{id:'F001',criticalPowerPct:110,wPrimePct:120,massOffsetKg:-2,
   dragAreaPct:90,aggression:.8,sprintSkill:.9,carbsGPerHour:85}];
 const next=buildLabRace(settings);
 assert.equal(next.input.teams[0].strategy,'offensiv');
 assert.equal(next.input.segments[0].headwindMps,3);
 assert.equal(next.input.segments[0].crosswindMps,4);
 assert.ok(next.input.riders[0].criticalPowerW>original.riders[0].criticalPowerW);
 assert.ok(next.input.riders[0].ftpW>original.riders[0].ftpW);
 assert.ok(next.input.riders[0].wPrimeJ>original.riders[0].wPrimeJ);
 assert.ok(next.input.riders[0].massKg<original.riders[0].massKg);
 assert.ok(next.input.riders[0].dragAreaM2<original.riders[0].dragAreaM2);
 assert.deepEqual(buildLabRace(settings),next);
});
test('LAB: alle Referenzprofile, Teamzahlen, Taktikmodelle',()=>{
 for(const routeId of ['tdf25_lille','tdf25_boulogne','lbl25_liege','tdf25_hautacam']){
  const s=initialLabSettings();s.routeId=routeId;s.teamCount=4;
  s.engine.groupRidingModel='legacy';s.engine.enduranceModel='off';
  const {input}=buildLabRace(s);
  assert.equal(input.riders.length,28);
  assert.equal(input.enduranceModel,'off');
  assert.equal(input.groupRidingModel,'legacy');
 }
});
test('LAB: ungültige oder unbekannte Änderungen niemals still übernehmen',()=>{
 let s=initialLabSettings();s.wind.headwindMps=99;
 assert.throws(()=>buildLabRace(s),/Gegenwind/);
 s=initialLabSettings();s.riders=[{id:'F001',criticalPowerPct:900}];
 assert.throws(()=>buildLabRace(s),/criticalPowerPct/);
 s=initialLabSettings();s.teams=[{teamId:'T99',strategy:'sprint'}];
 assert.throws(()=>buildLabRace(s),/Teamauftrag/);
 s=initialLabSettings();s.riders=[{id:'F001',nonsense:22}];
 assert.throws(()=>buildLabRace(s),/unbekannter Fahrerregler/);
});
