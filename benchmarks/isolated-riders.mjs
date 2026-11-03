/** Manueller Node.js-Kurzbenchmark – keine gekoppelte Renn-/Peloton-Simulation. */
import { performance } from 'node:perf_hooks';
import { simulateMotionRoute } from '../src/engine/physics/motion-core.ts';
import { DYNAMIC_ROUTE_EXAMPLE } from '../src/engine/physics/dynamic-route.ts';

const sizes=[1,20,160];
const base=structuredClone(DYNAMIC_ROUTE_EXAMPLE);
const data=[];
// JIT-Initialisierung, nicht als Messergebnis werten.
for(let i=0;i<12;i++) simulateMotionRoute(base);
for(const riders of sizes){
 const samples=[]; let steps=0;
 for(let repeat=0;repeat<3;repeat++){
  let local=0;
  const start=performance.now();
  for(let i=0;i<riders;i++) {
   const result=simulateMotionRoute(base);
   local+=result.steps;
  }
  samples.push(performance.now()-start);
  steps=local;
 }
 samples.sort((a,b)=>a-b);
 data.push({riders,distancePerRiderKm:4,steps,medianMs:Number(samples[1].toFixed(2)),samplesMs:samples.map(v=>Number(v.toFixed(2)))});
}
console.log(JSON.stringify({environment:process.version,note:'Unabhängige Einzelfahrer ohne Windschatten/Positions-KI, Node.js auf Server-/Notebook-CPU, kein Android.',data},null,2));
