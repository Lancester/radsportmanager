/** R-04: Deterministischer, erklärbarer Fahrer-Agent für eine aufreißende Lücke.
 * Reine Entscheidungsschicht: gibt ausschließlich einen WATT-Befehl zurück.
 * Bewegung, Arbeit und Geschwindigkeit berechnet weiterhin motion-core.ts.
 * Keine ML-/Online-Bibliothek, kein W'- oder Ermüdungsmodell.
 */
export type GapMode = 'halten' | 'nachsetzen' | 'erholen';
export interface GapAgentConfig {
  riderId: string;
  triggerGapM: number;
  releaseGapM: number;
  targetGapM: number;
  minimumSafeGapM: number;
  maxPursuitPowerW: number;
  maxPursuitSeconds: number;
  cooldownSeconds: number;
  gapGainWPerM: number;
  speedGainWPerMps: number;
}
export interface GapObservation {
  timeS: number;
  gapM: number | null; // Fahrerzentren, null für Spitzenfahrer
  leaderSpeedMps: number | null;
  ownSpeedMps: number;
  basePowerW: number; // vorgesehene Fahrtleistung, nicht das KI-Ergebnis
}
export interface GapAgentState {
  mode: GapMode;
  pursuitSeconds: number;
  cooldownUntilS: number;
}
export interface GapDecision {
  state: GapAgentState;
  powerW: number;
  reason: string;
  stateChanged: boolean;
}
export const F8_GAP_AGENT: Readonly<GapAgentConfig> = Object.freeze({
  riderId: 'F8',
  triggerGapM: 5.0,
  releaseGapM: 4.2,
  targetGapM: 3.4,
  minimumSafeGapM: 2.7,
  maxPursuitPowerW: 255,
  maxPursuitSeconds: 30,
  cooldownSeconds: 20,
  gapGainWPerM: 18,
  speedGainWPerMps: 24,
});
const ok = (label: string, val: number, good: boolean) => {
  if (!Number.isFinite(val) || !good) throw new RangeError('Agent: ' + label);
};
export function validateGapConfig(c: GapAgentConfig): void {
  if(!c || typeof c.riderId !== 'string' || !c.riderId.trim())
    throw new RangeError('Agent: ungültige Fahrer-ID');
  ok('triggerGapM',c.triggerGapM,c.triggerGapM>0);
  ok('releaseGapM',c.releaseGapM,c.releaseGapM>0 && c.releaseGapM<c.triggerGapM);
  ok('targetGapM',c.targetGapM,c.targetGapM>0&&c.targetGapM<=c.releaseGapM);
  ok('minimumSafeGapM',c.minimumSafeGapM,c.minimumSafeGapM>0&&c.minimumSafeGapM<c.releaseGapM);
  ok('maxPursuitPowerW',c.maxPursuitPowerW,c.maxPursuitPowerW>0&&c.maxPursuitPowerW<=1500);
  ok('maxPursuitSeconds',c.maxPursuitSeconds,c.maxPursuitSeconds>0&&c.maxPursuitSeconds<=300);
  ok('cooldownSeconds',c.cooldownSeconds,c.cooldownSeconds>=0&&c.cooldownSeconds<=600);
  ok('gapGainWPerM',c.gapGainWPerM,c.gapGainWPerM>=0&&c.gapGainWPerM<=150);
  ok('speedGainWPerMps',c.speedGainWPerMps,c.speedGainWPerMps>=0&&c.speedGainWPerMps<=200);
}
export function initialGapState():GapAgentState {
  return {mode:'halten',pursuitSeconds:0,cooldownUntilS:0};
}
/** Kein Eingriff in Positionen: Wattwunsch und nachvollziehbarer Grund. */
export function decideGapPower(
  c: GapAgentConfig, observation: GapObservation, previous: GapAgentState,
): GapDecision {
  validateGapConfig(c);
  const o=observation;
  ok('timeS',o.timeS,o.timeS>=0);
  ok('ownSpeedMps',o.ownSpeedMps,o.ownSpeedMps>=0&&o.ownSpeedMps<100);
  ok('basePowerW',o.basePowerW,o.basePowerW>=0);
  if(o.gapM!==null)ok('gapM',o.gapM,o.gapM>=0);
  if(o.leaderSpeedMps!==null)
    ok('leaderSpeedMps',o.leaderSpeedMps,o.leaderSpeedMps>=0&&o.leaderSpeedMps<100);
  if(!previous||!['halten','nachsetzen','erholen'].includes(previous.mode))
    throw new RangeError('Agent: ungültiger Zustand');
  ok('pursuitSeconds',previous.pursuitSeconds,previous.pursuitSeconds>=0);
  ok('cooldownUntilS',previous.cooldownUntilS,previous.cooldownUntilS>=0);
  let mode=previous.mode, pursuitSeconds=previous.pursuitSeconds;
  let cooldownUntilS=previous.cooldownUntilS;
  let reason='Fahrtleistung halten';
  const gap=o.gapM,leaderSpeed=o.leaderSpeedMps;
  if(mode==='erholen'&&o.timeS>=cooldownUntilS-1e-9){
    mode='halten';pursuitSeconds=0;
  }
  if(gap===null||leaderSpeed===null){
    mode='halten';pursuitSeconds=0;reason='Kein unmittelbarer Vordermann';
  } else if(mode==='nachsetzen'&&pursuitSeconds>=c.maxPursuitSeconds-1e-9){
    mode='erholen';cooldownUntilS=o.timeS+c.cooldownSeconds;
    reason='Begrenztes Nachsetzfenster ausgeschöpft';
  } else if(mode==='erholen'){
    reason='Erholungsfenster nach voriger Anstrengung';
  } else {
    const closing=o.ownSpeedMps-leaderSpeed;
    // Vorausschau: spätes Beschleunigen darf nicht schon einen zu kurzen
    // Restabstand erwarten lassen. Kein automatisches Bremsen implementiert.
    const predictedGap=gap-closing*2;
    if(mode==='nachsetzen' && (gap<=c.releaseGapM||predictedGap<=c.minimumSafeGapM)){
      mode='halten';pursuitSeconds=0;reason='Lücke fast geschlossen oder Abstand zu gering';
    } else if(mode==='halten' && gap>=c.triggerGapM &&
              (leaderSpeed>o.ownSpeedMps+0.02||gap>=c.triggerGapM+1) &&
              predictedGap>c.minimumSafeGapM){
      mode='nachsetzen';pursuitSeconds=0;reason='Lücke wächst: kontrolliert nachsetzen';
    }
  }
  let powerW=o.basePowerW;
  if(mode==='nachsetzen' && gap!==null && leaderSpeed!==null){
    const extra=c.gapGainWPerM*Math.max(0,gap-c.targetGapM)
      +c.speedGainWPerMps*Math.max(0,leaderSpeed-o.ownSpeedMps);
    // Diese feste Höchstleistung ist ein TESTLIMIT; CP/W' kommt später.
    powerW=Math.min(c.maxPursuitPowerW,Math.max(o.basePowerW,o.basePowerW+extra));
  }
  return {state:{mode,pursuitSeconds,cooldownUntilS},powerW,reason,
    stateChanged:mode!==previous.mode};
}
