import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateOpponentThreat} from '../src/engine/race/opponent-assessment.ts';
const rider=(id,cp,mass,cda,sprint)=>({id,knownCpW:cp,massKg:mass,
  bikeMassKg:7.5,dragAreaM2:cda,sprintSkill:sprint});
const strong=rider('climber',400,60,.26,.4);
const tt=rider('tt',400,78,.22,.3);
const sprinter=rider('sprint',360,78,.29,.95);
const field=[strong,tt,sprinter];
test('berg- und flachgefährliche Gegner werden unterschiedlich eingeschätzt',()=>{
 const estimate=(opponent,profile)=>estimateOpponentThreat({opponent,field,profile,situation:'flucht'});
 assert.ok(estimate(strong,'berg')>estimate(tt,'berg'));
 assert.ok(estimate(tt,'flach')>estimate(strong,'flach'));
});
test('Sprintgefahr ist von der Gefährlichkeit einer Soloflucht getrennt',()=>{
 const score=(opponent)=>estimateOpponentThreat({opponent,field,profile:'flach',situation:'sprint'});
 assert.ok(score(sprinter)>score(tt));
});
