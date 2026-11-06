#!/usr/bin/env python3
"""Reconstruct new races from manifest-bound R24 short comparison blocks."""
import argparse,base64,gzip,hashlib,json,os,tempfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--blocks',required=True,type=Path);p.add_argument('--output',required=True,type=Path);a=p.parse_args()
def sha(x):return hashlib.sha256(x).hexdigest()
m=(a.blocks/'manifest.json').read_bytes();manifest=json.loads(m);found={}
for bp in sorted(a.blocks.glob('block-*.b64')):
 meta=json.loads(bp.with_suffix('.json').read_bytes());assert meta['manifest_sha256']==sha(m)
 z=base64.b64decode(bp.read_bytes(),validate=True);assert sha(z)==meta['compressed_sha256'] and len(bp.read_bytes())==meta['base64_chars']
 names=[]
 for line in gzip.decompress(z).splitlines():
  rec=json.loads(line);name=rec['filename'];raw=rec['raw'].encode();assert Path(name).name==name and name.endswith('.json') and sha(raw)==rec['sha256'];d=json.loads(raw);v=name.split('-')[0];assert v in ('main','dev','audit') and d['comparisonProvenance']==manifest['series']+':'+v and len(d['classification'])==154
  if name in found:assert found[name]==raw
  found[name]=raw;names.append(name)
 assert names==meta['files']
a.output.mkdir(parents=True,exist_ok=True)
for name,raw in found.items():
 target=a.output/name
 if target.exists():assert target.read_bytes()==raw;continue
 fd,tmp=tempfile.mkstemp(prefix='.r24-kurz-',dir=a.output)
 try:
  with os.fdopen(fd,'wb') as f:f.write(raw)
  os.replace(tmp,target)
 finally:
  if os.path.exists(tmp):os.unlink(tmp)
print(len(found),'vollständige neue Rennen geprüft und verfügbar.')
