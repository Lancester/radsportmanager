/** Bewusst manueller Node-Kurzbenchmark – KEINE Android- oder Peloton-Messung. */
import { performance } from 'node:perf_hooks';
import { R03_PAIR_EXAMPLE, simulateTwoRiders } from '../src/engine/physics/drafting-pair.ts';
const repetitions=[1,10,100];
for(let i=0;i<20;i++) simulateTwoRiders(R03_PAIR_EXAMPLE); // JIT-Warmup
const rows=[];
for(const count of repetitions){
  const times=[];
  for(let n=0;n<3;n++){
    const a=performance.now();
    for(let i=0;i<count;i++) simulateTwoRiders(R03_PAIR_EXAMPLE);
    times.push(performance.now()-a);
  }
  times.sort((a,b)=>a-b);
  rows.push({pairRuns:count,simulatedSecondsPerPair:R03_PAIR_EXAMPLE.durationS,
    medianMs:Number(times[1].toFixed(3))});
}
console.log(JSON.stringify({runtime:process.version,
  note:'Nur zwei unabhängig von anderen Paaren gekoppelte Fahrer pro Lauf; 12 s, Node.js, kein Android, kein Peloton.',
  results:rows},null,2));
