#!/usr/bin/env python3
"""Vollständigen 10-Seed-Block paarweise prüfen und als JSONL.gz/CSV sichern."""
import csv,gzip,json,statistics,sys
from pathlib import Path
import importlib.util
spec=importlib.util.spec_from_file_location('comparison_provenance',Path(__file__).with_name('r24-comparison-provenance.py'))
provenance=importlib.util.module_from_spec(spec);spec.loader.exec_module(provenance)
if len(sys.argv)!=5:raise SystemExit('route roster dateiname arbeitsverzeichnis')
route,roster,label,work=sys.argv[1:];work=Path(work)
seeds=[11,42,101,123,777,2025,2026,2027,9001,31415]
out=Path('docs/race/r24-grossvergleich-daten');out.mkdir(exist_ok=True)
if (work/'vergleich-ungueltig.txt').exists():raise ValueError('Vergleichsreihe als ungültig markiert')
roster_path=work/'rosters.json'
rosters=json.loads(roster_path.read_text()) if roster_path.exists() else {}
records=[]
for seed in seeds:
 pair={}
 for version in ('main','dev'):
  p=work/f'{version}-{roster}-{route}-{seed}.json';d=json.loads(p.read_text())
  provenance.verify_result(work,d,version)
  if (d['route'],d['roster'],d['seed'])!=(route,roster,seed):raise ValueError(str(p))
  pair[version]=d;records.append({'version':version,'race':d})
 if pair['main']['fingerprints']['commonInputs']!=pair['dev']['fingerprints']['commonInputs']:raise ValueError('Eingabehash: '+str(seed))
# Vor dem Schreiben alle für die CSV benötigten Fahrerdaten prüfen.
for record in records:
 d=record['race'];lookup=d.get('riderLookup') or rosters.get(roster+'-'+route)
 if not lookup or d['classification'][0]['id'] not in lookup:
  raise ValueError('Fahrerdaten fehlen: '+roster+'-'+route)
 if len(d['classification'])<77:
  raise ValueError('Weniger als 77 klassierte Fahrer: '+str(d['seed']))
with (out/f'{label}.jsonl.gz').open('wb') as raw:
 with gzip.GzipFile(fileobj=raw,filename='',mode='wb',mtime=0,compresslevel=9) as z:
  for row in records:z.write(json.dumps(row,separators=(',',':'),ensure_ascii=False).encode()+b'\n')
with (out/f'{label}.csv').open('w',newline='') as raw:
 writer=csv.writer(raw,lineterminator='\n');writer.writerow(['version','seed','winner_id','winner_specialty','winner_group_1s','largest_group_1s','winner_group_3s','rank_77_gap_s','favorite_id','favorite_rank','attacks','breakaways','catches','common_sha256'])
 for record in records:
  d=record['race'];lookup=d.get('riderLookup') or rosters.get(roster+'-'+route)
  if not lookup:raise ValueError('Fahrerdaten fehlen: '+roster+'-'+route)
  winner=d['classification'][0]['id'];f=d['favorites']['profileFavorite'];writer.writerow([record['version'],d['seed'],winner,lookup[winner]['specialty'],d['groups1s'][0]['size'],max(g['size'] for g in d['groups1s']),d['groups3s'][0]['size'],round(d['classification'][76]['gapS'],3),f['riderId'],f['finishRank'],d['diagnostics']['attacks'],d['diagnostics']['breakaways'],d['diagnostics']['caughtBreakaways'],d['fingerprints']['commonInputs']])
print('Gesichert:',len(records),'Rennen,',len(seeds),'geprüfte Eingabepaare')
