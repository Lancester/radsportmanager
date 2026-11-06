#!/usr/bin/env python3
"""Wiederaufnahme der R-24-Reihe; vorhandene vollständige Dateien werden erhalten."""
import argparse,concurrent.futures,fcntl,importlib.util,json,os,subprocess,sys
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
seeds=[11,42,101,123,777,2025,2026,2027,9001,31415]
routes=['tdf25_lille','tdf25_boulogne','lbl25_liege','tdf25_hautacam']
extra_routes=['synthetic_crosswind','synthetic_transition']
roots={'main':a.main_root,'dev':a.dev_root}
if a.before_root:roots['before']=a.before_root
helper=root/'scripts/r24-comparison-provenance.py'
spec=importlib.util.spec_from_file_location('comparison_provenance',helper)
provenance=importlib.util.module_from_spec(spec);spec.loader.exec_module(provenance)
script_paths=[Path(__file__),helper,root/'scripts/r24-grossvergleich.mjs',
 root/'scripts/r24-grossvergleich-szenario.mjs']
plan={'seeds':seeds,'routes':routes,'extra_routes':extra_routes,
 'rosters':['common','profile'],'before_seeds':[11,123] if a.before_root else []}
try:
 if not a.dry_run:
  a.output.mkdir(parents=True,exist_ok=True)
  lock=(a.output/'.vergleich.lock').open('a')
  try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
  except BlockingIOError:raise ValueError('In diesem Ausgabeverzeichnis läuft bereits eine Vergleichsreihe.')
 node_version=subprocess.check_output(['node','--version'],text=True).strip()
 expected=provenance.build_manifest(roots,script_paths,plan,node_version)
 run_id=provenance.check_or_prepare(a.output,expected,a.dry_run)
except (OSError,ValueError,subprocess.CalledProcessError) as e:
 raise SystemExit('Vergleich nicht gestartet: '+str(e))
tasks=[]
def add(version,checkout,route,roster,seed,extra=False):
 target=a.output/f'{version}-{roster}-{route}-{seed}.json'
 if target.exists():
  try:d=json.loads(target.read_text())
  except (OSError,ValueError) as e:raise SystemExit(f'Vorhandenes Ergebnis ungültig: {target}: {e}')
  if (d.get('route'),d.get('seed'),d.get('roster'),d.get('comparisonProvenance'))!=(route,seed,roster,run_id+':'+version):raise SystemExit(f'Vorhandenes Ergebnis hat falsche Aufgabe oder Herkunft: {target}')
  if (not isinstance(d.get('classification'),list) or not d['classification'] or
      not isinstance(d.get('events'),list) or not isinstance(d.get('diagnostics'),dict) or
      not isinstance(d.get('preRace'),dict) or not isinstance(d.get('riderLookup'),dict) or
      not isinstance(d.get('favorites'),dict) or not d.get('groups1s') or not d.get('groups3s') or
      not isinstance(d.get('fingerprints'),dict) or not d['fingerprints'].get('commonInputs')):
   raise SystemExit(f'Vorhandenes Ergebnis unvollständig: {target}')
  return
 script=root/'scripts'/('r24-grossvergleich-szenario.mjs' if extra else 'r24-grossvergleich.mjs')
 tasks.append((target,version,['node','--experimental-strip-types',str(script),str(checkout.resolve()),route,str(seed),roster,str(target.resolve())]))
for route in routes:
 for roster in ('common','profile'):
  for seed in seeds:
   for version,checkout in [('main',a.main_root),('dev',a.dev_root)]:add(version,checkout,route,roster,seed)
for route in extra_routes:
 for seed in seeds:
  for version,checkout in [('main',a.main_root),('dev',a.dev_root)]:add(version,checkout,route,'common',seed,True)
if a.before_root:
 for route in ['tdf25_lille','tdf25_boulogne']:
  for seed in [11,123]:add('before',a.before_root,route,'common',seed)
print(f'{len(tasks)} fehlende Läufe; maximal {a.workers} gleichzeitig.',flush=True)
if a.dry_run:sys.exit(0)
def run(t):
 target,version,cmd=t
 env={**os.environ,'R24_COMPARISON_PROVENANCE':run_id+':'+version}
 with target.with_suffix('.log').open('w') as log,target.with_suffix('.err').open('w') as err:
  result=subprocess.run(cmd,cwd=root,stdout=log,stderr=err,check=False,env=env)
 return target,result.returncode
failed=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as pool:
 for target,code in pool.map(run,tasks):
  print(('OK ' if code==0 else 'FEHLER ')+str(target),flush=True)
  if code:failed.append(target)
# Ein veränderter Quellstand während der Laufserie macht alle Ergebnisse
# ungeeignet für eine verlässliche Wiederaufnahme oder Auswertung.
try:
 unchanged=provenance.build_manifest(roots,script_paths,plan,node_version)==expected
except OSError:
 unchanged=False
if not unchanged:
 (a.output/'vergleich-ungueltig.txt').write_text('Quellstand oder Testskripte während der Serie verändert. Nicht auswerten.\n',encoding='utf-8')
 raise SystemExit('Quellstand oder Testskripte wurden während der Serie verändert; Ergebnisse nicht auswerten.')
if failed:raise SystemExit(f'{len(failed)} Läufe fehlgeschlagen; .err-Dateien prüfen')
