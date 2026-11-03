import {R03_PAIR_EXAMPLE, simulateTwoRiders} from './generated/physics/drafting-pair.js';
import {createEightRiderExample, createEightRiderAgentExample, createEightRiderR05Example, createEightRiderPassExample, createEightRiderAutoPassExample, createEightRiderTimedPassWithCpExample, simulateGroup} from './generated/physics/drafting-group.js';
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
function onceGroup(durationS, agent = false, r05 = false, passing = false, autoPassing = false) {
  const result = simulateGroup(autoPassing ? createEightRiderAutoPassExample(durationS) :
    passing ? createEightRiderPassExample(durationS) :
    r05 ? createEightRiderR05Example(durationS) :
    agent ? createEightRiderAgentExample(durationS) : createEightRiderExample(durationS));
  let checksum = 0;
  for (const rider of result.riders) {
    checksum += rider.positionM + rider.aeroLossJ * 0.00001;
  }
  const gapEvents = result.events.filter(e => e.type === 'gap-opened');
  const aiEvents = result.events.filter(e => e.type === 'agent-decision');
  const firstAiChase = aiEvents.find(e => e.agentMode === 'nachsetzen');
  const overtakes=result.events.filter(e=>e.type==='overtake');
  const laneChanges=result.events.filter(e=>e.type==='lane-complete');
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
    wPrimeRemainingJ: result.riders[7].wPrimeRemainingJ === undefined ? null : round(result.riders[7].wPrimeRemainingJ),
    wPrimeSpentJ: result.riders[7].wPrimeSpentJ === undefined ? null : round(result.riders[7].wPrimeSpentJ),
    cpLimitedSeconds: round(result.riders[7].cpLimitedSeconds),
    safetyBrakeSeconds: round(result.riders.reduce((x,r)=>x+r.safetyBrakeSeconds,0)),
    safetyEvents: result.events.filter(e=>e.type === 'safety').length,
    cpEvents: result.events.filter(e=>e.type === 'cp-limit').length,
    overtakes:overtakes.length,
    laneChanges:laneChanges.length,
    finalLateralF8M:round(result.riders[7].lateralPositionM),
    averageF8PowerW:result.riders[7].averageCrankPowerW === undefined ?
      null : round(result.riders[7].averageCrankPowerW),
    timeAboveFtpS:result.riders[7].timeAboveFtpS === undefined ?
      null : round(result.riders[7].timeAboveFtpS),
    autoLaneChoices:result.events.filter(e=>e.type==='agent-lane-choice').length,
    autonomousOvertakes:result.riders[7].autonomousOvertakes??0,
    workAboveFtpJ:result.riders[7].workAboveFtpJ === undefined ?
      null : round(result.riders[7].workAboveFtpJ),
  };
}
self.onmessage = e => {
  if (e.data?.type !== 'run') return;
  try {
    const {pairs, durationS, repeats, group = false, agent = false, r05 = false, passing = false, autoPassing = false} = e.data.preset;
    if (!Number.isSafeInteger(durationS) || durationS < 1 || durationS > 120 ||
        repeats !== 3 || (!group && (!Number.isSafeInteger(pairs) || pairs < 1 || pairs > 80))) {
      throw Error('Ungültige Testgröße');
    }
    if (group && !(durationS === 120 || ((passing||autoPassing) && durationS === 65))) throw Error('Ungültiges Achtfahrerprofil');
    if (agent && !group) throw Error('Agenten-Preset benötigt Achtfahrergruppe');
    if (r05 && (!agent || !group)) throw Error('CP/Wprime-Test benötigt Achtfahrer-Agenten');
    if (passing && (!group || agent || r05 || autoPassing)) throw Error('Überholen ohne KI/CP als isolierter Test');
    if (autoPassing && (!group || passing || agent || r05)) throw Error('Autonome Überhol-KI als eigenständiger Test');
    if (group) onceGroup(passing||autoPassing?25:30, agent, r05, passing, autoPassing); else once(1, 2); // Warmup, nicht messen
    const times=[];
    let expected;
    for (let i=0; i<repeats; i++) {
      const start = performance.now();
      const output = group ? onceGroup(durationS, agent, r05, passing, autoPassing) : once(pairs, durationS);
      const ms = performance.now() - start;
      if (expected !== undefined && expected !== output.checksum) throw Error('Unterschiedliche Simulationsergebnisse!');
      expected = output.checksum;
      times.push(round(ms));
      self.postMessage({type:'progress', current:i+1, total:repeats});
    }
    const sorted = [...times].sort((a,b)=>a-b);
    self.postMessage({type:'result', result:{
      mode: group ? (autoPassing ? 'achtfahrer-autonom-ueberholen' : passing ? 'achtfahrer-ueberholen' : r05 ? 'achtfahrer-sicher-cp' : agent ? 'achtfahrer-agent' : 'achtfahrer-gruppe') : 'unabhaengige-paare',
      pairs: group ? null : pairs,
      riderCount: group ? 8 : pairs * 2,
      durationS, repeats,
      stepsPerRepeat: group ? Math.ceil(durationS / 0.2) :
        pairs * Math.ceil(durationS / (R03_PAIR_EXAMPLE.stepSeconds ?? 0.2)),
      medianMs: sorted[1], rawTimesMs:times, checksum:expected,
      ...(group ? (() => {
        const check = onceGroup(durationS, agent, r05, passing, autoPassing);
        return {finalGapM: check.finalGapM, gapEvents: check.gapEvents,
          firstGapTimeS: check.firstGapTimeS, lastRiderSpeedKmh: check.lastRiderSpeedKmh,
          ...(agent ? {agentDecisionCount:check.agentDecisionCount,
            agentFirstChaseS:check.agentFirstChaseS,
            agentPursuitS:check.agentPursuitS,agentExtraWorkJ:check.agentExtraWorkJ,
            ...(r05 ? {wPrimeRemainingJ:check.wPrimeRemainingJ,wPrimeSpentJ:check.wPrimeSpentJ,
              cpLimitedSeconds:check.cpLimitedSeconds,safetyBrakeSeconds:check.safetyBrakeSeconds,
              safetyEvents:check.safetyEvents,cpEvents:check.cpEvents,
              averageF8PowerW:check.averageF8PowerW,
              timeAboveFtpS:check.timeAboveFtpS,
              workAboveFtpJ:check.workAboveFtpJ} : {})} : {}),
          ...(passing||autoPassing ? {
            overtakes:check.overtakes,laneChanges:check.laneChanges,
            finalLateralF8M:check.finalLateralF8M
          }: {}),
          ...(autoPassing ? {
            autoLaneChoices:check.autoLaneChoices,
            autonomousOvertakes:check.autonomousOvertakes,
            wPrimeRemainingJ:check.wPrimeRemainingJ,
            wPrimeSpentJ:check.wPrimeSpentJ,
            averageF8PowerW:check.averageF8PowerW,
            timeAboveFtpS:check.timeAboveFtpS
          }: {})};
      })() : {}),
      browser: navigator.userAgent,
      timestamp: new Date().toISOString(),
      runtime: 'Web Worker (Browser)',
      scenario: group ? (autoPassing ? 'R-07: 8 Fahrer, autonomer Spurentscheid, physisches Ueberholen, CP-Wprime-Limit, noch keine Fahrtechnik' : passing ? 'R-06: 8 Fahrer, extern befohlene, stetige Querbewegung und Überholen, noch keine Spur-KI' : r05 ? 'R-05: 8 Fahrer, F8 mit KI und CP-Wprime, aktiver Abstandsregler' : agent ? 'R-04: 8 Fahrer, F8 mit regelbasierter Luecken-KI' : 'R-03G, 8 Fahrer gemeinsam, vorgegebene Wattzahlen, keine KI') :
        'R-03, unabhängige Zweiergruppen, keine Peloton-Interaktion',
    }});
  } catch(e) { self.postMessage({type:'error',message:String(e?.message ?? e)}); }
};
