import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT=Path(__file__).resolve().parent.parent
SCRIPTS=['r24-grossvergleich-starten.py','r24-comparison-provenance.py',
         'r24-grossvergleich.mjs','r24-grossvergleich-szenario.mjs']

class ComparisonResumeTest(unittest.TestCase):
 def test_interrupted_resume_and_provenance_guard(self):
  with tempfile.TemporaryDirectory() as tmp:
   base=Path(tmp);runner=base/'runner';(runner/'scripts').mkdir(parents=True)
   for script in SCRIPTS:shutil.copy(ROOT/'scripts'/script,runner/'scripts'/script)
   for version in ['main','dev']:
    path=base/version/'src/engine/race';path.mkdir(parents=True)
    (path/'race-simulator.ts').write_text(version)
   binpath=base/'bin';binpath.mkdir()
   node=binpath/'node'
   node.write_text('''#!/usr/bin/env python3
import json,os,sys
from pathlib import Path
if sys.argv[1:] == ['--version']:
 print('v-test');sys.exit(0)
root,route,seed,roster,out=sys.argv[-5:]
if os.environ.get('FAIL_ONCE') and Path(out).name=='dev-common-tdf25_lille-11.json':sys.exit(1)
data={'route':route,'seed':int(seed),'roster':roster,
 'comparisonProvenance':os.environ.get('R24_COMPARISON_PROVENANCE'),
 'classification':[{'id':'A'}],'fingerprints':{'commonInputs':'test'},'diagnostics':{},'preRace':{},'events':[],
 'riderLookup':{'A':{}},'favorites':{},'groups1s':[{}],'groups3s':[{}]}
Path(out).write_text(json.dumps(data))
''');node.chmod(0o755)
   env={**os.environ,'PATH':str(binpath)+os.pathsep+os.environ['PATH']}
   output=base/'result'
   command=['python3',str(runner/'scripts'/SCRIPTS[0]),'--main-root',str(base/'main'),
    '--dev-root',str(base/'dev'),'--output',str(output),'--workers','8']
   def execute(extra=(),environment=env):
    return subprocess.run(command+list(extra),env=environment,text=True,capture_output=True)
   dry=execute(['--dry-run']);self.assertEqual(dry.returncode,0,dry.stderr)
   self.assertIn('200 fehlende',dry.stdout);self.assertFalse(output.exists())
   failed=execute(environment={**env,'FAIL_ONCE':'1'})
   self.assertNotEqual(failed.returncode,0);self.assertIn('1 Läufe fehlgeschlagen',failed.stderr)
   self.assertEqual(len(list(output.glob('main-*.json')))+len(list(output.glob('dev-*.json'))),199)
   resumed=execute();self.assertEqual(resumed.returncode,0,resumed.stderr)
   self.assertIn('1 fehlende',resumed.stdout)
   self.assertIn('0 fehlende',execute(['--dry-run']).stdout)
   victim=output/'main-common-tdf25_lille-11.json'
   data=json.loads(victim.read_text());data['comparisonProvenance']='wrong';victim.write_text(json.dumps(data))
   tampered=execute(['--dry-run']);self.assertNotEqual(tampered.returncode,0)
   self.assertIn('falsche Aufgabe oder Herkunft',tampered.stderr)
   (base/'dev/src/engine/race/race-simulator.ts').write_text('changed')
   changed=execute(['--dry-run']);self.assertNotEqual(changed.returncode,0)
   self.assertIn('Quellstand',changed.stderr)
   (output/'vergleich-manifest.json').unlink()
   missing=execute(['--dry-run']);self.assertNotEqual(missing.returncode,0)
   self.assertIn('ohne Manifest',missing.stderr)

if __name__=='__main__':unittest.main()
