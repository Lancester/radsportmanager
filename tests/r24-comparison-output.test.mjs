import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

// Die kleine Test-Engine prüft den Datenfluss; sie ist keine Rennsimulation.
test('Vergleichsskripte speichern Fahrerdaten und Auswertung benötigt keine separate Fahrerliste',()=>{
  const tmp=mkdtempSync(join(tmpdir(),'r24-output-'));
  try{
    const dir=join(tmp,'src/engine/race');mkdirSync(dir,{recursive:true});
    writeFileSync(join(dir,'reference-fixtures.ts'),`export function createReferenceFixture({seed}){return {route:{kind:'flach',distanceKm:185},input:{segments:[{lengthM:185000}],teams:[],riders:[{id:'A',specialty:'sprinter',wPrimeJ:20000}],seed}}}`);
    writeFileSync(join(dir,'rider-strength-audit.ts'),`export const categoryStrength=()=>[{riderId:'A'}]; export const buildRiderFavoritesAudit=()=>({profileTopThree:[{riderId:'A'}],profileFavorite:{riderId:'A',finishRank:1}});`);
    writeFileSync(join(dir,'race-simulator.ts'),`export const simulateRace=()=>({winnerId:'A',classification:[{id:'A',finishTimeS:100,gapS:0,energyResidualJ:0,finalWPrimeJ:10000,endurancePowerAvailability:1,carbohydrateRemainingKcal:500}],events:[],diagnostics:{attacks:0,breakaways:0,caughtBreakaways:0},checkpoints:[]});`);
    const scripts=resolve('scripts');
    const env={...process.env,R24_COMPARISON_PROVENANCE:'test:main'};
    for(const [script,route] of [['r24-grossvergleich.mjs','tdf25_lille'],['r24-grossvergleich-szenario.mjs','synthetic_crosswind']]){
      const out=join(tmp,route+'.json');
      execFileSync(process.execPath,['--experimental-strip-types',join(scripts,script),tmp,route,'11','common',out],{env});
      const data=JSON.parse(readFileSync(out,'utf8'));
      assert.deepEqual(data.riderLookup.A,{specialty:'sprinter',wPrimeJ:20000});
      assert.equal(data.comparisonProvenance,'test:main');
    }
    const d=JSON.parse(readFileSync(join(tmp,'tdf25_lille.json'),'utf8'));
    // Unmarkierte historische Ergebnisse ohne Manifest bleiben auswertbar.
    d.comparisonProvenance=null;
    for(let i=1;i<10;i++){
      const id='B'+i;d.riderLookup[id]={specialty:i<=6?'kletterer':'allrounder',wPrimeJ:20000};
      d.classification.push({...d.classification[0],id,finishTimeS:100+i,gapS:i});
    }
    d.diagnostics.attackTraces=[{riderId:'A'},{riderId:'A'},{riderId:'B1'}];
    writeFileSync(join(tmp,'main-common-tdf25_lille-11.json'),JSON.stringify(d));
    writeFileSync(join(tmp,'dev-common-tdf25_lille-11.json'),JSON.stringify(d));
    const analysis=JSON.parse(execFileSync('python3',[join(scripts,'r24-grossvergleich-auswertung.py'),tmp],{encoding:'utf8'}));
    assert.equal(analysis.paired,1);
    assert.equal(analysis.summary[0].versions.main.winnerTypes.sprinter,1);
    assert.equal(analysis.summary[0].versions.main.medianOfFinishWPrimePct,50);
    assert.deepEqual(analysis.summary[0].versions.main.meanTop10BySpecialty,{allrounder:3,kletterer:6,sprinter:1});
    assert.equal(analysis.summary[0].versions.main.medianFavoriteAttackStarts,2);
    writeFileSync(join(tmp,'vergleich-ungueltig.txt'),'invalid');
    assert.throws(()=>execFileSync('python3',[join(scripts,'r24-grossvergleich-auswertung.py'),tmp],{stdio:'pipe'}));
  }finally{rmSync(tmp,{recursive:true,force:true});}
});
