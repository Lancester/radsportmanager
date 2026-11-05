import test from 'node:test';
import assert from 'node:assert/strict';
import {sprintLeadoutEligible} from '../src/engine/race/sprint-leadout.ts';

test('R24: Sprintzug bremst keine nicht beauftragten oder getrennten Helfer',()=>{
  assert.equal(sprintLeadoutEligible(null,true),false);
  assert.equal(sprintLeadoutEligible('jagd',true),false);
  assert.equal(sprintLeadoutEligible('sprintzug',false),false);
  assert.equal(sprintLeadoutEligible('sprintzug',true),true);
});
