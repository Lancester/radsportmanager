import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
const hash=b=>createHash('sha256').update(b).digest('hex');
test('Wiederherstellung prüft Sicherungsblöcke und erhält Originaldateien bytegenau',()=>{
 const tmp=mkdtempSync(join(tmpdir(),'r24-restore-test-'));
 try{
  const blocks=join(tmp,'blocks'),out=join(tmp,'out');mkdirSync(blocks);
  const manifest={format:1};writeFileSync(join(blocks,'vergleich-manifest.json'),JSON.stringify(manifest));
  const manifestId=hash(JSON.stringify(manifest));
  const records=['main','dev'].map(version=>{
   const raceRaw=JSON.stringify({comparisonProvenance:manifestId+':'+version,seed:42});
   return {version,filename:version+'-common-test-42.json',sha256:hash(raceRaw),raceRaw};
  });
  const payload=gzipSync(records.map(r=>JSON.stringify(r)).join('\n')+'\n');
  const name='block-001.jsonl.gz.b64';writeFileSync(join(blocks,name),payload.toString('base64'));
  writeFileSync(join(blocks,name+'.json'),JSON.stringify({name,manifest_id:manifestId,
   compressed_sha256:hash(payload),races:records.map(x=>x.filename)}));
  const run=()=>spawnSync('python3',[resolve('scripts/r24-grossvergleich-wiederherstellen.py'),
   '--blocks',blocks,'--output',out],{encoding:'utf8'});
  const first=run();assert.equal(first.status,0,first.stderr);
  for(const r of records)assert.equal(readFileSync(join(out,r.filename),'utf8'),r.raceRaw);
  const second=run();assert.equal(second.status,0,second.stderr);assert.match(second.stdout,/0 Originaldateien/);
  writeFileSync(join(out,records[0].filename),'anderer Inhalt');
  const conflict=run();assert.notEqual(conflict.status,0);assert.match(conflict.stderr,/abweichend/);
  assert.equal(readFileSync(join(out,records[0].filename),'utf8'),'anderer Inhalt');
  writeFileSync(join(blocks,name),Buffer.from('defekt').toString('base64'));
  const bad=run();assert.notEqual(bad.status,0);assert.match(bad.stderr,/Blockprüfsumme/);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
