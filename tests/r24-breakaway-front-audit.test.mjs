import test from 'node:test';
import assert from 'node:assert/strict';
import {BreakawayFrontAudit} from '../src/engine/race/breakaway-front-audit.ts';
test('Erfasst tatsächlich abgerechnete Frontarbeit und unterbrochene Stints',()=>{
 const audit=new BreakawayFrontAudit();
 const a={riderId:'A',teamId:'T1',timeS:0,dt:2,appliedPowerW:300,aeroFactor:1,groupSize:4};
 audit.observe(a);audit.observe({...a,timeS:2,appliedPowerW:200,aeroFactor:.8,frontAmbiguous:true});
 audit.observe({...a,riderId:'B',teamId:'T2',timeS:4,dt:1,appliedPowerW:400});
 audit.observe(null);audit.observe({...a,timeS:10,dt:1,appliedPowerW:100});
 const report=audit.report(),first=report.riders.find(r=>r.riderId==='A');
 assert.equal(first.frontSeconds,5);assert.equal(first.crankWorkJ,1100);
 assert.equal(first.windExposedSeconds,3);
 assert.deepEqual(report.stints.map(s=>s.durationS),[4,1,1]);
 assert.equal(report.stints[0].crankWorkJ,1000);
 assert.equal(report.ambiguousSeconds,2);
 assert.equal(report.frontChanges.length,1);
 assert.deepEqual(report.frontChanges[0],{timeS:4,fromRiderId:'A',toRiderId:'B',
  fromSeconds:4,toSeconds:1,ambiguous:true});
});
