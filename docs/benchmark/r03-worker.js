import {R03_PAIR_EXAMPLE, simulateTwoRiders} from './generated/drafting-pair.js';
import {createEightRiderExample, createEightRiderAgentExample, simulateGroup} from './generated/drafting-group.js';
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
/** Echter gemeinsamer 8er-Lauf – anders als 80 voneinander unabhängige Paare. */
function onceGroup(durationS, agent = false) {
  const result = simulateGroup(agent ? createEightRiderAgentExample(durationS) : createEightRiderExample(durationS));
  let checksum = 0;
  for (const rider of result.riders) {
    checksum += rider.positionM + rider.aeroLossJ * 0.00001;
  }
  const gapEvents = result.events.filter(e => e.type === 'gap-opened');
  const aiEvents = result.events.filter(e => e.type === 'agent-decision');
  const firstAiChase = aiEvents.find(e => e.agentMode === 'nachsetzen');
  return {
    checksum: round(checksum), steps: result.steps,
    riderCount: result.riders.length,
    finalGapM: round(result.riders[6].positionM - result.riders[7].positionM),
    gapEvents: gapEvents.length,
    firstGapTimeS: gapEvents.length ? round(gapEvents[0].timeS) : null,
    lastRiderSpeedKmh: round(result.riders[7].speedMps * 3.6),
    agentDecisionCount: aiEvents.length,
    agentFirstChaseS: firstAiChase ? round(firstAiChase.timeS) : null,
    agentPursuitS: round(result.riders[7].agentPursuitSeconds),
    agentExtraWorkJ: round(result.riders[7].agentExtraDriveWorkJ),
  };
}
self.onmessage = e => {
  if (e.data?.type !== 'run') return;
  try {
    const {pairs, durationS, repeats, group = false, agent = false} = e.data.preset;
    if (!Number.isSafeInteger(durationS) || durationS < 1 || durationS > 120 ||
        repeats !== 3 || (!group && (!Number.isSafeInteger(pairs) || pairs < 1 || pairs > 80))) {
      throw Error('Ungültige Testgröße');
    }
    if (group && durationS !== 120) throw Error('8er-Demoprofil ist auf 120 s ausgelegt');
    if (agent && !group) throw Error('Agenten-Preset benötigt Achtfahrergruppe');
    if (group) onceGroup(30, agent); else once(1, 2); // Warmup, nicht messen
    const times=[];
    let expected;
    for (let i=0; i<repeats; i++) {
      const start = performance.now();
      const output = group ? onceGroup(durationS, agent) : once(pairs, durationS);
      const ms = performance.now() - start;
      if (expected !== undefined && expected !== output.checksum) throw Error('Unterschiedliche Simulationsergebnisse!');
      expected = output.checksum;
      times.push(round(ms));
      self.postMessage({type:'progress', current:i+1, total:repeats});
    }
    const sorted = [...times].sort((a,b)=>a-b);
    self.postMessage({type:'result', result:{
      mode: group ? (agent ? 'achtfahrer-agent' : 'achtfahrer-gruppe') : 'unabhaengige-paare',
      pairs: group ? null : pairs,
      riderCount: group ? 8 : pairs * 2,
      durationS, repeats,
      stepsPerRepeat: group ? Math.ceil(durationS / 0.2) :
        pairs * Math.ceil(durationS / (R03_PAIR_EXAMPLE.stepSeconds ?? 0.2)),
      medianMs: sorted[1], rawTimesMs:times, checksum:expected,
      ...(group ? (() => {
        const check = onceGroup(durationS, agent);
        return {finalGapM: check.finalGapM, gapEvents: check.gapEvents,
          firstGapTimeS: check.firstGapTimeS, lastRiderSpeedKmh: check.lastRiderSpeedKmh,
          ...(agent ? {agentDecisionCount:check.agentDecisionCount,
            agentFirstChaseS:check.agentFirstChaseS,
            agentPursuitS:check.agentPursuitS,agentExtraWorkJ:check.agentExtraWorkJ} : {})};
      })() : {}),
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
      runtime: 'Web Worker (Browser)',
      scenario: group ? (agent ? 'R-04: 8 Fahrer, F8 mit regelbasierter Luecken-KI' : 'R-03G, 8 Fahrer gemeinsam, vorgegebene Wattzahlen, keine KI') :
        'R-03, unabhängige Zweiergruppen, keine Peloton-Interaktion',
    }});
  } catch(e) { self.postMessage({type:'error',message:String(e?.message ?? e)}); }
};
