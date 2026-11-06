#!/usr/bin/env python3
"""Small resumable R24 three-engine comparison with provenance validation."""
import argparse,base64,concurrent.futures,gzip,hashlib,importlib.util,json,os,subprocess
from pathlib import Path
ROOT=Path('/workspace/scratch/2d2a2956c99e/radsportmanager'); BASE=ROOT.parent; OUT=BASE/'kurzvergleich';SRC=BASE/'r24-pruefwiederherstellung'
ROOTS={'main':BASE/'r24-main','audit':BASE/'r24-audit','dev':BASE/'r24-dev'}
EXPECTED={'main':'4afdf3d734548be50b7e95f3672200ce4bbdf179daa3a0b4ec23d0ad91dc21a6','audit':'2c6f7f154f98a86627952d10ab556b8e2bea50b39bb2a0b850b304ac12ae40b8','dev':'cda3f93d7a7f6e4822b4b2fa0eb01410cd99ce50dd4a33ebe3cdcf5865b48492'}
SCRIPT=ROOT/'scripts/r24-grossvergleich.mjs'; SH='b7299c1ec8deef61b145a1bb61a746f0d5ca1689f7a8fa32add2d9d9dbdf0be5'; ROUTES=['tdf25_lille','tdf25_boulogne','tdf25_hautacam'];SEEDS=[42,123,2026];VERSIONS=['main','audit','dev']; SERIES='r24-kurzvergleich-20261106-v1'
def sha(b):return hashlib.sha256(b).hexdigest()
spec=importlib.util.spec_from_file_location('p',ROOT/'scripts/r24-comparison-provenance.py');p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
def verify_sources():
 assert subprocess.check_output(['node','--version'],text=True).strip()=='v24.22.1'
 assert sha(SCRIPT.read_bytes())==SH
 for v,root in ROOTS.items():
  h=p.tree_hash(root/'src/engine');assert h==EXPECTED[v],f'{v}: {h}'
def check(d,v,route,seed):
 assert (d.get('route'),d.get('roster'),d.get('seed'))==(route,'common',seed)
 assert len(d['classification'])==154 and all(abs(x['energyResidualJ'])<=.05 and x['finalWPrimeJ']>=0 for x in d['classification'])
 assert d['fingerprints']['commonInputs'] and len(d['events'])<100000
 assert d['groups1s'] and d['groups3s'] and d['preRace'] and d['favorites']
def filename(v,r,s):return f'{v}-common-{r}-{s}.json'
def init():
 OUT.mkdir(exist_ok=True); manifest={'series':SERIES,'engines':EXPECTED,'runner_sha256':SH,'node':'v24.22.1','routes':ROUTES,'seeds':SEEDS,'roster':'common','reuse':{}}
 for route in ROUTES[:2]:
  for seed in SEEDS:
   for v in ['main','dev']:
    f=SRC/filename(v,route,seed);raw=f.read_bytes();d=json.loads(raw);check(d,v,route,seed)
    assert d['comparisonProvenance'].endswith(':'+v)
    (OUT/f.name).write_bytes(raw);manifest['reuse'][f.name]={'source':'200er-Reihe, vollständig wiederhergestellt','sha256':sha(raw),'provenance':d['comparisonProvenance']}
 for route,short in [('tdf25_lille','lille'),('tdf25_hautacam','hautacam')]:
  pth=ROOT/'docs/race/r24-grossvergleich-daten'/f'vergleich-punkt2-{short}42-vorher.jsonl.gz.b64';mp=pth.with_name(f'vergleich-punkt2-{short}42-manifest.json');mm=json.loads(mp.read_text());assert mm['engines']=={'main':EXPECTED['main'],'audit':EXPECTED['audit'],'neu':EXPECTED['dev']} and mm['node_version']=='v24.22.1' and mm['scripts']['r24-grossvergleich.mjs']==SH
  for line in gzip.decompress(base64.b64decode(pth.read_bytes(),validate=True)).splitlines():
   row=json.loads(line);v={'neu':'dev'}.get(row['version'],row['version']);d=row['race'];check(d,v,route,42)
   if route=='tdf25_lille' and v!='audit':
    already=json.loads((OUT/filename(v,route,42)).read_bytes());assert already['classification']==d['classification'] and already['events']==d['events'] and already['fingerprints']['commonInputs']==d['fingerprints']['commonInputs'];continue
   raw=json.dumps(d,ensure_ascii=False,separators=(',',':')).encode();name=filename(v,route,42);(OUT/name).write_bytes(raw);manifest['reuse'][name]={'source':str(pth.relative_to(ROOT)),'archive_sha256':sha(pth.read_bytes()),'manifest_sha256':sha(mp.read_bytes()),'sha256':sha(raw),'provenance':d.get('comparisonProvenance')}
 assert len(manifest['reuse'])==16
 (OUT/'kurzvergleich-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
def run(v,r,s):
 name=filename(v,r,s);env={**os.environ,'R24_COMPARISON_PROVENANCE':SERIES+':'+v};log=OUT/(name+'.log');err=OUT/(name+'.err')
 with log.open('w') as a,err.open('w') as b:code=subprocess.call(['node','--experimental-strip-types',str(SCRIPT),str(ROOTS[v]),r,str(s),'common',str(OUT/name)],cwd=ROOT,env=env,stdout=a,stderr=b)
 if code:raise RuntimeError(name+' failed: '+err.read_text()[-2000:])
 d=json.loads((OUT/name).read_bytes());check(d,v,r,s);assert d['comparisonProvenance']==SERIES+':'+v
 return name
a=argparse.ArgumentParser();a.add_argument('--init',action='store_true');a.add_argument('--max-new',type=int,default=3);a.add_argument('--workers',type=int,default=3);args=a.parse_args();verify_sources()
if args.init:
 if (OUT/'kurzvergleich-manifest.json').exists():raise SystemExit('manifest exists')
 init()
m=json.loads((OUT/'kurzvergleich-manifest.json').read_text());assert m['series']==SERIES and m['engines']==EXPECTED and m['runner_sha256']==SH
for name,info in m['reuse'].items():assert sha((OUT/name).read_bytes())==info['sha256']
tasks=[]
for r in ROUTES:
 for s in SEEDS:
  for v in VERSIONS:
   f=OUT/filename(v,r,s)
   if f.exists():
    d=json.loads(f.read_bytes());check(d,v,r,s)
    if f.name not in m['reuse']:assert d.get('comparisonProvenance')==SERIES+':'+v
   else:tasks.append((v,r,s))
print('Fehlende Läufe:',len(tasks),'davon jetzt:',min(len(tasks),args.max_new),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
 fut=[pool.submit(run,*x) for x in tasks[:args.max_new]]
 for f in concurrent.futures.as_completed(fut):print('OK',f.result(),flush=True)
verify_sources()
for route in ROUTES:
 for seed in SEEDS:
  paths=[OUT/filename(v,route,seed) for v in VERSIONS]
  if all(x.exists() for x in paths):
   values=[json.loads(x.read_bytes())['fingerprints']['commonInputs'] for x in paths];assert len(set(values))==1,(route,seed,values)
print('Block geprüft.',flush=True)
