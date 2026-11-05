import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluatePursuit} from '../src/engine/race/pursuit-evaluation.ts';
const base={gapM:400,bestGapM:400,secondsWithoutProgress:360,
  ownSpeedMps:10,targetSpeedMps:10,remainingM:35000,reserveFraction:.7,
  aggression:.5,assignedTeamDuty:false,favorableTerrainAhead:false};
test('gleichbleibende Lücke allein stoppt auch nach mehreren Minuten nicht',()=>{
  assert.equal(evaluatePursuit(base),'fortsetzen');
  assert.equal(evaluatePursuit({...base,secondsWithoutProgress:1200}),'fortsetzen');
});
test('favourables Gelände und geringe Reserve erlauben Dosieren statt Abbruch',()=>{
  assert.equal(evaluatePursuit({...base,favorableTerrainAhead:true,
    reserveFraction:.3}),'schonen');
  assert.equal(evaluatePursuit({...base,reserveFraction:.05}),'schonen');
});
test('stark wachsende Lücke, Erschöpfung und fehlende Chance können Aufgabe auslösen',()=>{
  assert.equal(evaluatePursuit({...base,gapM:2400,bestGapM:400,
    targetSpeedMps:11,reserveFraction:.15}), 'aufgeben');
  assert.notEqual(evaluatePursuit({...base,gapM:2400,bestGapM:400,
    targetSpeedMps:11,reserveFraction:.15,favorableTerrainAhead:true}), 'aufgeben');
});
test('erreichtes Ziel und vorrangiger Auftrag beenden den individuellen Plan',()=>{
  assert.equal(evaluatePursuit({...base,gapM:5}),'erreicht');
  assert.equal(evaluatePursuit({...base,assignedTeamDuty:true}),'aufgeben');
});
test('Beharrlichkeit kann unabhängig von Angriffslust die Abwägung verändern',()=>{
  const difficult={...base,gapM:2400,bestGapM:400,targetSpeedMps:11,
    reserveFraction:.32,aggression:.5};
  assert.equal(evaluatePursuit({...difficult,pursuitPersistence:0}),'aufgeben');
  assert.equal(evaluatePursuit({...difficult,pursuitPersistence:1}),'fortsetzen');
  assert.equal(evaluatePursuit({...difficult,pursuitPersistence:1,
    assignedTeamDuty:true}),'aufgeben');
  assert.equal(evaluatePursuit({...difficult,pursuitPersistence:1,
    reserveFraction:.05}),'schonen');
});
