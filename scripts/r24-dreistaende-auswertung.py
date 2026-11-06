#!/usr/bin/env python3
import json,statistics,collections,hashlib
from pathlib import Path
P=Path('/workspace/scratch/2d2a2956c99e/kurzvergleich'); m=json.loads((P/'kurzvergleich-manifest.json').read_text()); rows=[]; agg=[]
for route in m['routes']:
 for seed in m['seeds']:
  triple=[]
  for v in ['main','audit','dev']:
   name=f'{v}-common-{route}-{seed}.json'; raw=(P/name).read_bytes(); d=json.loads(raw)
   if name in m['reuse']:assert hashlib.sha256(raw).hexdigest()==m['reuse'][name]['sha256']
   else:assert d['comparisonProvenance']==m['series']+':'+v
   assert d['route']==route and d['seed']==seed and d['roster']=='common' and len(d['classification'])==154
   assert all(abs(x['energyResidualJ'])<=.05 and x['finalWPrimeJ']>=0 for x in d['classification'])
   assert len(d['events'])<100000
   triple.append(d)
  assert len({d['fingerprints']['commonInputs'] for d in triple})==1
  for v,d in zip(['main','audit','dev'],triple):
   c=d['classification'];w=c[0];pre=d['preRace']['top10'];nonhelper=next((x for x in pre if x.get('role') in ('kapitaen','sprinter')),None);nr=next((x['rank'] for x in c if nonhelper and x['id']==nonhelper['riderId']),None)
   def cp(k):
    x=next((x for x in d['checkpoints'] if x['km']>=k),None);return x['largestGroup'] if x else None
   ev=d['events'];chases=[x for x in ev if x['type']=='chase'];react=[x for x in chases if 'Reaktion auf Angriff' in x.get('description','')];riderlookup=d.get('riderLookup') or {};winner_type=riderlookup.get(w['id'],{}).get('specialty') or next((x['specialty'] for x in pre if x['riderId']==w['id']),None)
   rows.append({'route':route,'seed':seed,'version':v,'winner':w['id'],'winnerRole':w['role'],'winnerSpecialty':winner_type,'winnerTimeS':w['finishTimeS'],'winner1s':d['groups1s'][0]['size'],'winner3s':d['groups3s'][0]['size'],'largest1s':max(x['size'] for x in d['groups1s']),'group50km':cp(50),'group100km':cp(100),'group150km':cp(150),'medianGapS':statistics.median(x['gapS'] for x in c),'rank77GapS':c[76]['gapS'],'attacks':d['diagnostics']['attacks'],'chases':d['diagnostics']['chases'],'attackReaction':len(react) if v=='dev' else None,'reactionFirst30Km':sum(e['km']<30 for e in react) if v=='dev' else None,'proxy':d['favorites']['profileFavorite'],'nonHelperProxyId':nonhelper['riderId'] if nonhelper else None,'nonHelperProxyRole':nonhelper['role'] if nonhelper else None,'nonHelperProxyRank':nr,'finished':len(c),'elapsedS':d['elapsedS']})
for route in m['routes']:
 for v in ['main','audit','dev']:
  rr=[r for r in rows if r['route']==route and r['version']==v]; med=lambda k:statistics.median([x[k] for x in rr]);avg=lambda k:round(statistics.mean(x[k] for x in rr),1)
  agg.append({'route':route,'version':v,'n':len(rr),'winners':[(x['winner'],x['winnerSpecialty']) for x in rr],'winner1sMedian':med('winner1s'),'winner3sMedian':med('winner3s'),'largest1sMedian':med('largest1s'),'group50Median':med('group50km'),'group100Median':med('group100km'),'group150Median':med('group150km'),'medianGapMedianS':round(med('medianGapS'),1),'rank77GapMedianS':round(med('rank77GapS'),1),'attacksMean':avg('attacks'),'chasesMean':avg('chases'),'nonHelperProxyRanks':[x['nonHelperProxyRank'] for x in rr],'raceTimesS':[round(x['winnerTimeS']) for x in rr]})
print(json.dumps({'races':len(rows),'triples':len(rows)//3,'rows':rows,'summary':agg},ensure_ascii=False,indent=2))
