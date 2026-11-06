#!/usr/bin/env python3
"""Zusammenfassung ausschließlich vollständig gespeicherter Renn-JSONs."""
import glob,json,statistics,collections,os,sys
from pathlib import Path
import importlib.util
spec=importlib.util.spec_from_file_location('comparison_provenance',Path(__file__).with_name('r24-comparison-provenance.py'))
provenance=importlib.util.module_from_spec(spec);spec.loader.exec_module(provenance)
base=Path(sys.argv[1] if len(sys.argv)>1 else 'artifacts/r24-grossvergleich')
roster_path=base/'rosters.json'
rosters=json.loads(roster_path.read_text()) if roster_path.exists() else {}
if (base/'vergleich-ungueltig.txt').exists():raise ValueError('Vergleichsreihe als ungültig markiert')
races={}
for p in sorted(base.glob('*.json')):
    if not (p.name.startswith('main-') or p.name.startswith('dev-')): continue
    try:
        d=json.loads(p.read_text())
        if 'classification' not in d or d.get('route','').startswith('synthetic_'): continue
        version=p.name.split('-')[0]; provenance.verify_result(base,d,version); key=(d['route'],d['roster'],d['seed'],version)
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
    for idx,label in [(3,'main'),(4,'dev')]:
        data=[x[idx] for x in same]; med=lambda vals:round(statistics.median(vals),2)
        def lookup(d):
            r=d.get('riderLookup') or rosters.get(roster+'-'+route)
            if not r:raise ValueError('Fahrerdaten für '+roster+'-'+route+' fehlen')
            return r
        def typecount(r):return lookup(r)[r['classification'][0]['id']]['specialty']
        top10=[d for d in data if len(d['classification'])>=10]
        categories=sorted({lookup(d)[r['id']].get('specialty','unbekannt') or 'unbekannt'
                           for d in top10 for r in d['classification'][:10]})
        top10_mean={category:round(statistics.mean(sum(
            (lookup(d)[r['id']].get('specialty','unbekannt') or 'unbekannt')==category
            for r in d['classification'][:10]) for d in top10),2) for category in categories}
        observed=[d for d in data if isinstance(d['diagnostics'].get('attackTraces'),list)]
        favorite_attacks=[sum(t.get('riderId')==d['favorites']['profileFavorite']['riderId']
                              for t in d['diagnostics']['attackTraces']) for d in observed]
        versions[label]={'top10Races':len(top10),'meanTop10BySpecialty':top10_mean,
          'favoriteAttackTraceRaces':len(observed),
          'medianFavoriteAttackStarts':med(favorite_attacks) if favorite_attacks else None,
          'winnerTypes':dict(collections.Counter(typecount(d) for d in data)),
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
          'medianOfFinishWPrimePct':med([statistics.median(x['finalWPrimeJ']/lookup(d)[x['id']]['wPrimeJ']*100 for x in d['classification']) for d in data]),
          'medianOfFinishCarbsKcal':med([statistics.median(x['carbohydrateRemainingKcal'] for x in d['classification']) for d in data])}
    summary.append({'route':route,'roster':roster,'pairs':len(same),'seeds':[p[2] for p in same],'versions':versions})
print(json.dumps({'loaded':len(races),'paired':len(pairs),'summary':summary},ensure_ascii=False,indent=2))
