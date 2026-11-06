#!/usr/bin/env python3
"""Save only complete new R24 races as individually hashed restore blocks."""
import base64,gzip,hashlib,json
from pathlib import Path
BASE=Path('/workspace/scratch/2d2a2956c99e');OUT=BASE/'kurzvergleich';DEST=BASE/'kurz-bloecke';DEST.mkdir(exist_ok=True)
def sha(b):return hashlib.sha256(b).hexdigest()
m=(OUT/'kurzvergleich-manifest.json').read_bytes();manifest=json.loads(m); done=set()
for f in DEST.glob('block-*.json'):
 d=json.loads(f.read_text());assert d['manifest_sha256']==sha(m);done.update(d['files'])
records=[]
for f in sorted(OUT.glob('*-common-*.json')):
 if f.name in done or f.name in manifest['reuse']:continue
 raw=f.read_bytes();r=json.loads(raw);v=f.name.split('-')[0]
 assert r['comparisonProvenance']==manifest['series']+':'+v and len(r['classification'])==154 and all(abs(x['energyResidualJ'])<=.05 and x['finalWPrimeJ']>=0 for x in r['classification'])
 others=[OUT/f'{x}-common-{r["route"]}-{r["seed"]}.json' for x in ['main','audit','dev']]
 for x in others:
  if x.exists():assert json.loads(x.read_bytes())['fingerprints']['commonInputs']==r['fingerprints']['commonInputs']
 records.append({'filename':f.name,'sha256':sha(raw),'raw':raw.decode()})
for off in range(0,len(records),3):
 a=records[off:off+3];used=[int(f.stem.split('-')[1]) for f in DEST.glob('block-*.json')];name=f'block-{max(used,default=0)+1:03d}';z=gzip.compress(''.join(json.dumps(x,separators=(',',':'),ensure_ascii=False)+'\n' for x in a).encode(),compresslevel=9,mtime=0);enc=base64.b64encode(z);(DEST/(name+'.b64')).write_bytes(enc);(DEST/(name+'.json')).write_text(json.dumps({'manifest_sha256':sha(m),'compressed_sha256':sha(z),'base64_chars':len(enc),'files':[x['filename'] for x in a]},indent=2)+'\n');print(name,'races',len(a),flush=True)
print('Neu gesichert:',len(records),flush=True)
