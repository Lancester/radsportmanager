import {R03_PAIR_EXAMPLE, simulateTwoRiders} from './generated/drafting-pair.js';
const round = x => Math.round(x * 1e6) / 1e6;
function once(pairs, durationS) {
  let checksum = 0;
  let steps = 0;
  for (let index = 0; index < pairs; index++) {
    const result = simulateTwoRiders({...R03_PAIR_EXAMPLE, durationS, sampleEveryS: durationS});
    steps += result.steps;
    // Ausschließlich physikalisch berechnete Endzustände, keine erfundenen Ergebnisse.
    checksum += result.riders[0].positionM + result.riders[1].positionM +
      result.riders[0].aeroLossJ * 0.00001 + result.riders[1].aeroLossJ * 0.00001;
  }
  return {checksum: round(checksum), steps};
}
self.onmessage = e => {
  if (e.data?.type !== 'run') return;
  try {
    const {pairs, durationS, repeats} = e.data.preset;
    if (!Number.isSafeInteger(pairs) || pairs < 1 || pairs > 80 ||
        !Number.isSafeInteger(durationS) || durationS < 1 || durationS > 120 ||
        repeats !== 3) throw Error('Ungültige Testgröße');
    once(1, 2); // JIT-Warmup, nicht messen
    const times=[];
    let expected;
    for (let i=0; i<repeats; i++) {
      const start = performance.now();
      const output = once(pairs, durationS);
      const ms = performance.now() - start;
      if (expected !== undefined && expected !== output.checksum) throw Error('Unterschiedliche Simulationsergebnisse!');
      expected = output.checksum;
      times.push(round(ms));
      self.postMessage({type:'progress', current:i+1, total:repeats});
    }
    const sorted = [...times].sort((a,b)=>a-b);
    self.postMessage({type:'result', result:{
      pairs, durationS, repeats, stepsPerRepeat: pairs * Math.ceil(durationS / (R03_PAIR_EXAMPLE.stepSeconds ?? 0.2)),
      medianMs: sorted[1], rawTimesMs:times, checksum:expected,
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
      runtime: 'Web Worker (Browser)',
      scenario: 'R-03, unabhängige Zweiergruppen, keine Peloton-Interaktion',
    }});
  } catch(e) { self.postMessage({type:'error',message:String(e?.message ?? e)}); }
};
