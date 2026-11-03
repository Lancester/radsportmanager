/** R-03: zwei auf gemeinsamer Uhr fahrende, in Längsrichtung gekoppelte Fahrer.
 * Windstill, auf der Ebene; keine automatische Spur- oder Kollisionsvermeidung.
 * Windschatten reduziert NUR die aerodynamische Kraft, keine Watt-Boni.
 */
import { advanceMotionStep } from './motion-core.ts';
import type { CornerRider } from './motion-core.ts';
import { wheelPowerRequiredW } from './steady-state.ts';

export interface DraftingParameters {
  /** Testannahme: maximale relative Aero-Reduktion bei 0 m Abstand hinter dem Hinterrad. */
  maximumAeroReduction: number;
  /** Testannahme: Längsabstand, über den der Windschatten exponentiell abnimmt. */
  decayLengthM: number;
  /** Testannahme: Empfindlichkeit für seitlichen Abstand. */
  lateralScaleM: number;
  /** Vereinfachte Mindestentfernung zwischen den beiden Fahrerpositionen in derselben Spur. */
  minimumCenterDistanceM: number;
  /** Ab dieser lateralen Differenz dürfen die Fahrer ohne Kollisionsprüfung überholen. */
  overtakingLaneSeparationM: number;
}
export const R03_DRAFT: Readonly<DraftingParameters> = Object.freeze({
  maximumAeroReduction: 0.35,
  decayLengthM: 1.8,
  lateralScaleM: 0.75,
  minimumCenterDistanceM: 1.8,
  overtakingLaneSeparationM: 1.25,
});
export interface PairedRiderInput {
  id: string;
  physical: CornerRider;
  positionM: number;
  speedMps: number;
  lateralPositionM: number;
  crankPowerW: number;
}
export interface PairCommand {
  timeS: number;
  riderId: string;
  crankPowerW?: number;
  /** Bis auf Weiteres rein szenarisch vorgegebene Spurwahl, KEINE Fahrtechnik-KI. */
  lateralPositionM?: number;
}
export interface TwoRiderInput {
  riders: [PairedRiderInput, PairedRiderInput];
  durationS: number;
  stepSeconds?: number;
  sampleEveryS?: number;
  parameters?: DraftingParameters;
  commands?: PairCommand[];
}
export interface RiderSummary {
  id: string;
  positionM: number;
  speedMps: number;
  lateralPositionM: number;
  crankPowerW: number;
  driveWorkJ: number;
  aeroLossJ: number;
  rollingLossJ: number;
  kineticEnergyChangeJ: number;
  energyResidualJ: number;
  shelteredTimeS: number;
}
export interface PairSnapshot {
  timeS: number;
  positionsM: [number, number];
  speedsMps: [number, number];
  aeroFactors: [number, number];
  frontRiderId: string;
  centerGapM: number;
}
export interface PairEvent { timeS: number; eventType: 'lead-change' | 'command'; riderId: string }
export interface TwoRiderResult {
  elapsedS: number;
  steps: number;
  riders: [RiderSummary, RiderSummary];
  snapshots: PairSnapshot[];
  events: PairEvent[];
}
function check(name: string, value: number, valid: boolean): void {
  if (!Number.isFinite(value) || !valid) throw new RangeError('Ungültiger Wert: ' + name);
}
function validateParameters(p: DraftingParameters): void {
  check('maximumAeroReduction', p.maximumAeroReduction,
    p.maximumAeroReduction >= 0 && p.maximumAeroReduction < 1);
  check('decayLengthM', p.decayLengthM, p.decayLengthM > 0);
  check('lateralScaleM', p.lateralScaleM, p.lateralScaleM > 0);
  check('minimumCenterDistanceM', p.minimumCenterDistanceM, p.minimumCenterDistanceM > 0);
  check('overtakingLaneSeparationM', p.overtakingLaneSeparationM,
    p.overtakingLaneSeparationM > 0);
}
function validateRider(r: PairedRiderInput, name: string): void {
  if (!r || !r.physical || typeof r.id !== 'string' || !r.id.trim()) {
    throw new RangeError('Fahrer-ID/Physik fehlt: ' + name);
  }
  check(name + '.positionM', r.positionM, true);
  check(name + '.speedMps', r.speedMps, r.speedMps >= 0 && r.speedMps < 100);
  check(name + '.lateralPositionM', r.lateralPositionM, true);
  check(name + '.crankPowerW', r.crankPowerW, r.crankPowerW >= 0);
  const x = r.physical;
  for (const [key, val, minimum] of [
    ['riderMassKg', x.riderMassKg, 0],
    ['equipmentMassKg', x.equipmentMassKg, -1],
    ['dragAreaM2', x.dragAreaM2, 0],
    ['rollingCoefficient', x.rollingCoefficient, -1],
    ['airDensityKgM3', x.airDensityKgM3, 0],
    ['drivetrainEfficiency', x.drivetrainEfficiency, 0],
  ] as const) check(name + '.' + key, val, val > minimum);
  check(name + '.drivetrainEfficiency', x.drivetrainEfficiency, x.drivetrainEfficiency <= 1);
  const inertia = x.wheelInertiaKgM2 ?? 0;
  const radius = x.wheelRadiusM ?? 0.34;
  check(name + '.wheelInertiaKgM2', inertia, inertia >= 0);
  check(name + '.wheelRadiusM', radius, radius > 0.1);
}
function collision(positions: readonly [number, number], laterals: readonly [number, number],
  p: DraftingParameters): boolean {
  return Math.abs(laterals[0] - laterals[1]) < p.overtakingLaneSeparationM
    && Math.abs(positions[0] - positions[1]) < p.minimumCenterDistanceM - 1e-9;
}
/** Aerodynamischer Faktor für beide Fahrer: 1 = frei im Wind; z. B. 0,7 = 30 % weniger Luftwiderstand. */
export function aeroFactorsForPair(
  positions: readonly [number, number],
  laterals: readonly [number, number],
  params: DraftingParameters = R03_DRAFT,
): [number, number] {
  validateParameters(params);
  positions.forEach((v, i) => check('position' + i, v, true));
  laterals.forEach((v, i) => check('lateral' + i, v, true));
  if (collision(positions, laterals, params)) throw new RangeError('Unzulässige Überlappung in derselben Spur');
  const front = positions[0] >= positions[1] ? 0 : 1;
  const rear = 1 - front;
  const centerDistance = Math.abs(positions[0] - positions[1]);
  const wheelGap = Math.max(0, centerDistance - params.minimumCenterDistanceM);
  const lateralGap = Math.abs(laterals[0] - laterals[1]);
  const longitudinal = Math.exp(-wheelGap / params.decayLengthM);
  const lateral = Math.exp(-0.5 * (lateralGap / params.lateralScaleM) ** 2);
  const factors: [number, number] = [1, 1];
  factors[rear] = 1 - params.maximumAeroReduction * longitudinal * lateral;
  return factors;
}
/** Gleiches v erzwingen, daraus reale Pedalleistung einschließlich Rollwiderstand berechnen. */
export function requiredCrankPowerAtSpeedW(
  rider: CornerRider, speedMps: number, aeroFactor = 1,
): { crankPowerW: number; aeroPowerW: number; rollingPowerW: number } {
  check('speedMps', speedMps, speedMps >= 0);
  check('aeroFactor', aeroFactor, aeroFactor > 0 && aeroFactor <= 1);
  const base = wheelPowerRequiredW(speedMps, {
    distanceM: 1,
    riderMassKg: rider.riderMassKg,
    equipmentMassKg: rider.equipmentMassKg,
    dragAreaM2: rider.dragAreaM2 * aeroFactor,
    rollingCoefficient: rider.rollingCoefficient,
    airDensityKgM3: rider.airDensityKgM3,
    crankPowerW: 1,
    drivetrainEfficiency: rider.drivetrainEfficiency,
    gradeFraction: 0,
  });
  return {
    crankPowerW: base.totalW / rider.drivetrainEfficiency,
    aeroPowerW: base.aeroPowerW,
    rollingPowerW: base.rollingPowerW,
  };
}
function snapshot(timeS: number, riders: readonly [PairedRiderInput, PairedRiderInput],
  factors: [number, number]): PairSnapshot {
  return {
    timeS,
    positionsM: [riders[0].positionM, riders[1].positionM],
    speedsMps: [riders[0].speedMps, riders[1].speedMps],
    aeroFactors: [...factors],
    frontRiderId: riders[riders[0].positionM >= riders[1].positionM ? 0 : 1].id,
    centerGapM: Math.abs(riders[0].positionM - riders[1].positionM),
  };
}
/** Positions-/Leistungsentwicklung mit synchronem, gemeinsamen Zeitschritt. */
export function simulateTwoRiders(input: TwoRiderInput): TwoRiderResult {
  if (!input || !Array.isArray(input.riders) || input.riders.length !== 2) {
    throw new RangeError('Exakt zwei Fahrer erforderlich');
  }
  const riders: [PairedRiderInput, PairedRiderInput] =
    [structuredClone(input.riders[0]), structuredClone(input.riders[1])];
  validateRider(riders[0], 'Fahrer A');
  validateRider(riders[1], 'Fahrer B');
  if (riders[0].id === riders[1].id) throw new RangeError('Fahrer-IDs müssen verschieden sein');
  const params = input.parameters ?? R03_DRAFT;
  validateParameters(params);
  check('durationS', input.durationS, input.durationS > 0 && input.durationS <= 86400);
  const dtDefault = input.stepSeconds ?? 0.2;
  check('stepSeconds', dtDefault, dtDefault > 0 && dtDefault <= 1);
  const sampleEveryS = input.sampleEveryS ?? 1;
  check('sampleEveryS', sampleEveryS, sampleEveryS > 0 && sampleEveryS <= 3600);
  const commands = [...(input.commands ?? [])].sort((a,b) => a.timeS - b.timeS);
  commands.forEach((cmd,i) => {
    check('command.timeS ' + i, cmd.timeS, cmd.timeS >= 0 && cmd.timeS <= input.durationS);
    if (!riders.some(r=>r.id === cmd.riderId)) throw new RangeError('Unbekannter Fahrer in Kommando');
    if (cmd.crankPowerW !== undefined) check('command.crankPowerW',cmd.crankPowerW,cmd.crankPowerW >= 0);
    if (cmd.lateralPositionM !== undefined) check('command.lateralPositionM',cmd.lateralPositionM,true);
  });
  // Auch bei nebeneinander fahrenden Fahrern darf es keine nicht gekennzeichnete Überlappung geben.
  aeroFactorsForPair([riders[0].positionM,riders[1].positionM],
    [riders[0].lateralPositionM,riders[1].lateralPositionM],params);
  const summary: [RiderSummary,RiderSummary] = riders.map(r=>({
    id:r.id,positionM:r.positionM,speedMps:r.speedMps,lateralPositionM:r.lateralPositionM,
    crankPowerW:r.crankPowerW,driveWorkJ:0,aeroLossJ:0,rollingLossJ:0,
    kineticEnergyChangeJ:0,energyResidualJ:0,shelteredTimeS:0,
  })) as [RiderSummary,RiderSummary];
  const events: PairEvent[] = [];
  const snapshots: PairSnapshot[] = [];
  let t = 0, steps = 0, commandIndex = 0, nextSample = sampleEveryS;
  while (t < input.durationS - 1e-10) {
    while (commandIndex < commands.length && commands[commandIndex].timeS <= t + 1e-10) {
      const cmd = commands[commandIndex++];
      const index = riders.findIndex(r=>r.id === cmd.riderId);
      const r = riders[index];
      if(cmd.crankPowerW !== undefined) r.crankPowerW=cmd.crankPowerW;
      if(cmd.lateralPositionM !== undefined) r.lateralPositionM=cmd.lateralPositionM;
      events.push({timeS:t,eventType:'command',riderId:r.id});
    }
    const pos: [number,number] = [riders[0].positionM, riders[1].positionM];
    const lat: [number,number] = [riders[0].lateralPositionM,riders[1].lateralPositionM];
    const factor = aeroFactorsForPair(pos,lat,params);
    if (steps===0) snapshots.push(snapshot(t,riders,factor));
    const nextCommandTime = commands[commandIndex]?.timeS ?? Infinity;
    const dt = Math.min(dtDefault,input.durationS-t,nextCommandTime-t,nextSample-t);
    if (!(dt > 1e-11)) {
      // Abtastzeitpunkt erreicht, ohne Zeit zu verbrauchen.
      if(nextSample <= t + 1e-10){nextSample+=sampleEveryS;continue}
      throw new RangeError('Zeitschritt unter numerischer Grenze');
    }
    const prevFront = riders[pos[0]>=pos[1]?0:1].id;
    const updates = riders.map((r,i)=>advanceMotionStep({
      speedMps:r.speedMps, stepSeconds:dt,crankPowerW:r.crankPowerW,
      rider:r.physical,gradeFraction:0,aeroFactor:factor[i],
    }));
    const nextPos: [number,number] = [pos[0]+updates[0].distanceM,pos[1]+updates[1].distanceM];
    if (collision(nextPos, lat, params) ||
      (Math.sign(pos[0]-pos[1]) !== Math.sign(nextPos[0]-nextPos[1])
        && Math.abs(lat[0]-lat[1])<params.overtakingLaneSeparationM)) {
      throw new RangeError('Kollision: kein automatisches Überholen in derselben Spur');
    }
    for (const [i,r] of riders.entries()) {
      r.positionM=nextPos[i];r.speedMps=updates[i].endSpeedMps;
      summary[i].driveWorkJ+=updates[i].driveWorkJ;
      summary[i].aeroLossJ+=updates[i].aeroLossJ;
      summary[i].rollingLossJ+=updates[i].rollingLossJ;
      summary[i].kineticEnergyChangeJ+=updates[i].kineticEnergyChangeJ;
      summary[i].energyResidualJ+=updates[i].energyResidualJ;
      if(factor[i] < 1 - 1e-6) summary[i].shelteredTimeS+=dt;
    }
    t += dt;steps++;
    const newFront=riders[nextPos[0]>=nextPos[1]?0:1].id;
    if (newFront !== prevFront) events.push({timeS:t,eventType:'lead-change',riderId:newFront});
    if(t >= nextSample-1e-10 || t >= input.durationS-1e-10){
      snapshots.push(snapshot(t,riders,aeroFactorsForPair(nextPos,lat,params)));
      nextSample+=sampleEveryS;
    }
    if (steps>2_000_000) throw new RangeError('Zu viele Rechenschritte');
  }
  for(const [i,r] of riders.entries()){
    summary[i].positionM=r.positionM;
    summary[i].speedMps=r.speedMps;
    summary[i].lateralPositionM=r.lateralPositionM;
    summary[i].crankPowerW=r.crankPowerW;
  }
  return {elapsedS:t,steps,riders:summary,snapshots,events};
}
export const R03_PAIR_EXAMPLE: TwoRiderInput = {
  riders: [
    {id:'A',physical:{riderMassKg:72,equipmentMassKg:8,dragAreaM2:0.30,
      rollingCoefficient:0.004,airDensityKgM3:1.2,drivetrainEfficiency:0.975},
      positionM:10,speedMps:11,lateralPositionM:0,crankPowerW:255},
    {id:'B',physical:{riderMassKg:72,equipmentMassKg:8,dragAreaM2:0.30,
      rollingCoefficient:0.004,airDensityKgM3:1.2,drivetrainEfficiency:0.975},
      positionM:7.7,speedMps:11,lateralPositionM:0,crankPowerW:170},
  ],
  durationS:12,
  stepSeconds:0.2,
};
