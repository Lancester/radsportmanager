#!/usr/bin/env python3
"""Zusammenfassung ausschließlich vollständig gespeicherter Renn-JSONs."""
import glob,json,statistics,collections,os,sys
from pathlib import Path
base=Path(sys.argv[1] if len(sys.argv)>1 else 'artifacts/r24-grossvergleich')
rosters=json.loads((base/'rosters.json').read_text())
races={}
for p in sorted(base.glob('*.json')):
    if not (p.name.startswith('main-') or p.name.startswith('dev-')): continue
    try:
        d=json.loads(p.read_text())
        if 'classification' not in d or d.get('route','').startswith('synthetic_'): continue
        version=p.name.split('-')[0]; key=(d['route'],d['roster'],d['seed'],version)
        if key in races: raise ValueError('Duplikat '+str(key))
        races[key]=d
    except (ValueError,KeyError,json.JSONDecodeError) as e: print('FEHLER',p,e,file=sys.stderr);raise
pairs=[]
for (route,roster,seed,version),a in sorted(races.items()):
    if version!='main':continue
    b=races.get((route,roster,seed,'dev'))
    if b is None:continue
    if a['fingerprints']['commonInputs']!=b['fingerprints']['commonInputs']:raise ValueError('Abweichende Basisdaten '+str((route,roster,seed)))
    pairs.append((route,roster,seed,a,b))
summary=[]
for route,roster in sorted({(x[0],x[1]) for x in pairs}):
    same=[p for p in pairs if p[0]==route and p[1]==roster];versions={}
    rider=rosters[roster+'-'+route]
    for idx,label in [(3,'main'),(4,'dev')]:
        data=[x[idx] for x in same]; med=lambda vals:round(statistics.median(vals),2)
        def typecount(r):return rider[r['classification'][0]['id']]['specialty']
        versions[label]={'winnerTypes':dict(collections.Counter(typecount(d) for d in data)),
          'winnerGroup1sMedian':med([d['groups1s'][0]['size'] for d in data]),
          'largestGroup1sMedian':med([max(g['size'] for g in d['groups1s']) for d in data]),
          'winnerGroup3sMedian':med([d['groups3s'][0]['size'] for d in data]),
          'medianOfMedianGapS':med([statistics.median(x['gapS'] for x in d['classification']) for d in data]),
          'topFavoriteMedianFinish':med([d['favorites']['profileFavorite']['finishRank'] for d in data]),
          'topFavoriteRanks':[d['favorites']['profileFavorite']['finishRank'] for d in data],
          'meanAttacks':round(statistics.mean(d['diagnostics']['attacks'] for d in data),1),
          'breakaways':sum(d['diagnostics']['breakaways'] for d in data),'catches':sum(d['diagnostics']['caughtBreakaways'] for d in data),
          'winnerIds':[d['classification'][0]['id'] for d in data],
          'medianOfFinishAvailabilityPct':med([statistics.median(x['endurancePowerAvailability']*100 for x in d['classification']) for d in data]),
          'medianOfFinishWPrimePct':med([statistics.median(x['finalWPrimeJ']/rider[x['id']]['wPrimeJ']*100 for x in d['classification']) for d in data]),
          'medianOfFinishCarbsKcal':med([statistics.median(x['carbohydrateRemainingKcal'] for x in d['classification']) for d in data])}
    summary.append({'route':route,'roster':roster,'pairs':len(same),'seeds':[p[2] for p in same],'versions':versions})
print(json.dumps({'loaded':len(races),'paired':len(pairs),'summary':summary},ensure_ascii=False,indent=2))
