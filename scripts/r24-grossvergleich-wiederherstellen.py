#!/usr/bin/env python3
"""Originale Ergebnisdateien aus geprüften Vergleichsblöcken wiederherstellen."""
import argparse,base64,gzip,hashlib,importlib.util,json,os,tempfile
from pathlib import Path

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--blocks',required=True,type=Path,help='Verzeichnis mit Manifest, Blöcken und Metadaten')
p.add_argument('--output',required=True,type=Path)
a=p.parse_args()
spec=importlib.util.spec_from_file_location('comparison_provenance',Path(__file__).with_name('r24-comparison-provenance.py'))
provenance=importlib.util.module_from_spec(spec);spec.loader.exec_module(provenance)
manifest=json.loads((a.blocks/'vergleich-manifest.json').read_text(encoding='utf-8'))
manifest_id=provenance.manifest_id(manifest)
if (a.output/'vergleich-ungueltig.txt').exists():raise SystemExit('Zielserie ist als ungültig markiert.')
existing=a.output/'vergleich-manifest.json'
if existing.exists() and json.loads(existing.read_text(encoding='utf-8'))!=manifest:
 raise SystemExit('Zielmanifest stimmt nicht überein.')
if not existing.exists() and a.output.exists() and any(a.output.glob('*-*.json')):
 raise SystemExit('Vorhandene Ergebnisse ohne Manifest werden nicht übernommen.')
files={};blocks=sorted(a.blocks.glob('block-*.jsonl.gz.b64'))
if not blocks:raise SystemExit('Keine Sicherungsblöcke gefunden.')
for block in blocks:
 meta=json.loads(Path(str(block)+'.json').read_text(encoding='utf-8'))
 if meta.get('name')!=block.name or meta.get('manifest_id')!=manifest_id:raise ValueError('Falsches Manifest: '+block.name)
 compressed=base64.b64decode(block.read_bytes(),validate=True)
 if hashlib.sha256(compressed).hexdigest()!=meta.get('compressed_sha256'):raise ValueError('Blockprüfsumme: '+block.name)
 names=[]
 for line in gzip.decompress(compressed).splitlines():
  record=json.loads(line);name=record['filename'];version=record['version']
  if version not in ('main','dev') or not name.startswith(version+'-') or Path(name).name!=name or not name.endswith('.json'):
   raise ValueError('Ungültiger Ergebnisname: '+name)
  raw=record['raceRaw'].encode('utf-8')
  if hashlib.sha256(raw).hexdigest()!=record['sha256']:raise ValueError('Dateiprüfsumme: '+name)
  race=json.loads(raw);expected=manifest_id+':'+version
  if race.get('comparisonProvenance')!=expected:raise ValueError('Ergebnisherkunft: '+name)
  if name in files and files[name]!=raw:raise ValueError('Widersprüchliches Ergebnis: '+name)
  files[name]=raw;names.append(name)
 if names!=meta.get('races'):raise ValueError('Blockinhalt stimmt nicht mit Metadaten überein: '+block.name)
for name,raw in files.items():
 target=a.output/name
 if target.exists() and target.read_bytes()!=raw:raise SystemExit('Vorhandenes Ergebnis abweichend: '+name)
a.output.mkdir(parents=True,exist_ok=True)
if not existing.exists():existing.write_text(json.dumps(manifest,indent=2,sort_keys=True,ensure_ascii=False)+'\n',encoding='utf-8')
restored=0
for name,raw in files.items():
 target=a.output/name
 if target.exists():continue
 fd,tmp=tempfile.mkstemp(prefix='.r24-restore-',dir=a.output)
 try:
  with os.fdopen(fd,'wb') as f:f.write(raw)
  os.replace(tmp,target);restored+=1
 finally:
  if os.path.exists(tmp):os.unlink(tmp)
print(f'{len(blocks)} Blöcke geprüft, {restored} Originaldateien wiederhergestellt.')
