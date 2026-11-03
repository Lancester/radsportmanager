/** R-01: stationäre Fahrt auf der Ebene ohne Wind. Noch kein Rennsimulator. */
export interface R01Input {
  distanceM: number;
  riderMassKg: number;
  equipmentMassKg: number;
  dragAreaM2: number;
  rollingCoefficient: number;
  airDensityKgM3: number;
  crankPowerW: number;
  drivetrainEfficiency: number;
}
export interface R01Result {
  speedMps: number;
  speedKmh: number;
  timeSeconds: number;
  wheelPowerW: number;
  aeroPowerW: number;
  rollingPowerW: number;
}
const GRAVITY_MPS2 = 9.81;

function requireFinite(name: string, value: number, minimum: number, inclusive: boolean): void {
  const valid = Number.isFinite(value) && (inclusive ? value >= minimum : value > minimum);
  if (!valid) throw new RangeError(name + ' ist kein gueltiger Zahlenwert oberhalb der Mindestgrenze.');
}
function validate(input: R01Input): void {
  requireFinite('distanceM', input.distanceM, 0, false);
  requireFinite('riderMassKg', input.riderMassKg, 0, false);
  requireFinite('equipmentMassKg', input.equipmentMassKg, 0, true);
  requireFinite('dragAreaM2', input.dragAreaM2, 0, false);
  requireFinite('rollingCoefficient', input.rollingCoefficient, 0, true);
  requireFinite('airDensityKgM3', input.airDensityKgM3, 0, false);
  requireFinite('crankPowerW', input.crankPowerW, 0, false);
  requireFinite('drivetrainEfficiency', input.drivetrainEfficiency, 0, false);
  if (input.drivetrainEfficiency > 1) throw new RangeError('drivetrainEfficiency darf 1 nicht ueberschreiten.');
}

/** W = 0,5 * rho * CdA * v^3 + Crr * m * g * v. */
export function powerAtWheelW(speedMps: number, input: R01Input): {
  aeroPowerW: number; rollingPowerW: number; totalW: number
} {
  validate(input);
  requireFinite('speedMps', speedMps, 0, true);
  const massKg = input.riderMassKg + input.equipmentMassKg;
  const aeroPowerW = 0.5 * input.airDensityKgM3 * input.dragAreaM2 * speedMps ** 3;
  const rollingPowerW = input.rollingCoefficient * massKg * GRAVITY_MPS2 * speedMps;
  return { aeroPowerW, rollingPowerW, totalW: aeroPowerW + rollingPowerW };
}

/** Die eindeutige positive stationäre Geschwindigkeit per Intervallhalbierung. */
export function simulateR01(input: R01Input): R01Result {
  validate(input);
  const wheelPowerW = input.crankPowerW * input.drivetrainEfficiency;
  let low = 0;
  let high = 5;
  while (powerAtWheelW(high, input).totalW < wheelPowerW) {
    high *= 2;
    if (high > 200) throw new RangeError('Kein physikalisch sinnvoller Geschwindigkeitsbereich gefunden.');
  }
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    if (powerAtWheelW(mid, input).totalW < wheelPowerW) low = mid;
    else high = mid;
  }
  const speedMps = (low + high) / 2;
  const { aeroPowerW, rollingPowerW } = powerAtWheelW(speedMps, input);
  return {
    speedMps,
    speedKmh: speedMps * 3.6,
    timeSeconds: input.distanceM / speedMps,
    wheelPowerW,
    aeroPowerW,
    rollingPowerW,
  };
}

export const R01_BASE: Readonly<R01Input> = Object.freeze({
  distanceM: 20_000,
  riderMassKg: 72,
  equipmentMassKg: 8,
  dragAreaM2: 0.30,
  rollingCoefficient: 0.004,
  airDensityKgM3: 1.20,
  crankPowerW: 250,
  drivetrainEfficiency: 0.975,
});
