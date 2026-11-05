#!/usr/bin/env python3
"""Wiederaufnahme der R-24-Reihe; vorhandene vollständige Dateien werden erhalten."""
import argparse,concurrent.futures,json,subprocess,sys
from pathlib import Path

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--main-root',required=True,type=Path)
p.add_argument('--dev-root',required=True,type=Path)
p.add_argument('--before-root',type=Path,help='optionaler Stand vor Ermüdungskalibrierung')
p.add_argument('--output',type=Path,default=Path('artifacts/r24-grossvergleich'))
p.add_argument('--workers',type=int,default=4)
p.add_argument('--dry-run',action='store_true')
a=p.parse_args();root=Path(__file__).resolve().parent.parent
if a.workers<1:p.error('workers muss positiv sein')
for path in [a.main_root,a.dev_root]+([a.before_root] if a.before_root else []):
 if not (path/'src/engine/race/race-simulator.ts').exists():p.error('Kein Engine-Checkout: '+str(path))
a.output.mkdir(parents=True,exist_ok=True)
seeds=[11,42,101,123,777,2025,2026,2027,9001,31415]
routes=['tdf25_lille','tdf25_boulogne','lbl25_liege','tdf25_hautacam']
tasks=[]
def add(version,checkout,route,roster,seed,extra=False):
 target=a.output/f'{version}-{roster}-{route}-{seed}.json'
 if target.exists():
  try:d=json.loads(target.read_text())
  except (OSError,ValueError) as e:raise SystemExit(f'Vorhandenes Ergebnis ungültig: {target}: {e}')
  if (d.get('route'),d.get('seed'),d.get('roster'))!=(route,seed,roster):raise SystemExit(f'Vorhandenes Ergebnis gehört nicht zur Aufgabe: {target}')
  return
 script=root/'scripts'/('r24-grossvergleich-szenario.mjs' if extra else 'r24-grossvergleich.mjs')
 tasks.append((target,['node','--experimental-strip-types',str(script),str(checkout.resolve()),route,str(seed),roster,str(target.resolve())]))
for route in routes:
 for roster in ('common','profile'):
  for seed in seeds:
   for version,checkout in [('main',a.main_root),('dev',a.dev_root)]:add(version,checkout,route,roster,seed)
for route in ['synthetic_crosswind','synthetic_transition']:
 for seed in seeds:
  for version,checkout in [('main',a.main_root),('dev',a.dev_root)]:add(version,checkout,route,'common',seed,True)
if a.before_root:
 for route in ['tdf25_lille','tdf25_boulogne']:
  for seed in [11,123]:add('before',a.before_root,route,'common',seed)
print(f'{len(tasks)} fehlende Läufe; maximal {a.workers} gleichzeitig.',flush=True)
if a.dry_run:sys.exit(0)
def run(t):
 target,cmd=t
 with target.with_suffix('.log').open('w') as log,target.with_suffix('.err').open('w') as err:
  result=subprocess.run(cmd,cwd=root,stdout=log,stderr=err,check=False)
 return target,result.returncode
failed=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as pool:
 for target,code in pool.map(run,tasks):
  print(('OK ' if code==0 else 'FEHLER ')+str(target),flush=True)
  if code:failed.append(target)
if failed:raise SystemExit(f'{len(failed)} Läufe fehlgeschlagen; .err-Dateien prüfen')
