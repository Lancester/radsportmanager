/** Stationäres physikalisches Grundmodell für konstante Leistung ohne Wind.
 * Bergab, Beschleunigung, Kurven, Windschatten und Ermüdung folgen später.
 */
export interface SteadyRideInput {
  distanceM: number;
  riderMassKg: number;
  equipmentMassKg: number;
  dragAreaM2: number;
  rollingCoefficient: number;
  airDensityKgM3: number;
  crankPowerW: number;
  drivetrainEfficiency: number;
  /** Straßensteigung als Höhenanstieg pro horizontaler Strecke, z.B. 0.07 = 7 %. */
  gradeFraction: number;
}
export interface SteadyRidePower {
  aeroPowerW: number;
  rollingPowerW: number;
  gravityPowerW: number;
  totalW: number;
}
export interface SteadyRideResult extends Omit<SteadyRidePower, 'totalW'> {
  speedMps: number;
  speedKmh: number;
  timeSeconds: number;
  wheelPowerW: number;
  elevationGainM: number;
}
const G = 9.81;

function ensure(name: string, value: number, condition: boolean): void {
  if (!Number.isFinite(value) || !condition) {
    throw new RangeError(name + ': ungültiger Eingabewert');
  }
}

export function validateSteadyInput(x: SteadyRideInput): void {
  ensure('distanceM', x.distanceM, x.distanceM > 0);
  ensure('riderMassKg', x.riderMassKg, x.riderMassKg > 0);
  ensure('equipmentMassKg', x.equipmentMassKg, x.equipmentMassKg >= 0);
  ensure('dragAreaM2', x.dragAreaM2, x.dragAreaM2 > 0);
  ensure('rollingCoefficient', x.rollingCoefficient, x.rollingCoefficient >= 0);
  ensure('airDensityKgM3', x.airDensityKgM3, x.airDensityKgM3 > 0);
  ensure('crankPowerW', x.crankPowerW, x.crankPowerW > 0);
  ensure('drivetrainEfficiency', x.drivetrainEfficiency, x.drivetrainEfficiency > 0 && x.drivetrainEfficiency <= 1);
  // Nur Ebene und bergauf: bergab kann die Gravitation selbst antreiben.
  ensure('gradeFraction', x.gradeFraction, x.gradeFraction >= 0);
}

export function wheelPowerRequiredW(speedMps: number, x: SteadyRideInput): SteadyRidePower {
  validateSteadyInput(x);
  ensure('speedMps', speedMps, speedMps >= 0);
  const massKg = x.riderMassKg + x.equipmentMassKg;
  const cosSlope = 1 / Math.sqrt(1 + x.gradeFraction ** 2);
  const sinSlope = x.gradeFraction * cosSlope;
  const aeroPowerW = 0.5 * x.airDensityKgM3 * x.dragAreaM2 * speedMps ** 3;
  const rollingPowerW = x.rollingCoefficient * massKg * G * cosSlope * speedMps;
  const gravityPowerW = massKg * G * sinSlope * speedMps;
  return { aeroPowerW, rollingPowerW, gravityPowerW, totalW: aeroPowerW + rollingPowerW + gravityPowerW };
}

/** Findet stationäres v durch Intervallhalbierung, ohne externe Abhängigkeiten. */
export function solveSteadyRide(x: SteadyRideInput): SteadyRideResult {
  validateSteadyInput(x);
  const wheelPowerW = x.crankPowerW * x.drivetrainEfficiency;
  let lo = 0;
  let hi = 5;
  while (wheelPowerRequiredW(hi, x).totalW < wheelPowerW) {
    hi *= 2;
    if (hi > 200) throw new RangeError('Unplausibel hohe stationäre Geschwindigkeit');
  }
  for (let i = 0; i < 80; i++) {
    const v = (lo + hi) / 2;
    if (wheelPowerRequiredW(v, x).totalW < wheelPowerW) lo = v;
    else hi = v;
  }
  const speedMps = (lo + hi) / 2;
  const { aeroPowerW, rollingPowerW, gravityPowerW } = wheelPowerRequiredW(speedMps, x);
  const sinSlope = x.gradeFraction / Math.sqrt(1 + x.gradeFraction ** 2);
  return {
    speedMps,
    speedKmh: speedMps * 3.6,
    timeSeconds: x.distanceM / speedMps,
    wheelPowerW,
    aeroPowerW,
    rollingPowerW,
    gravityPowerW,
    elevationGainM: x.distanceM * sinSlope,
  };
}
