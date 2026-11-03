/** R-01: stationäre Fahrt auf der Ebene ohne Wind. */
import { solveSteadyRide, wheelPowerRequiredW } from './steady-state.ts';
import type { SteadyRideInput } from './steady-state.ts';

export interface R01Input extends Omit<SteadyRideInput, 'gradeFraction'> {}
export interface R01Result {
  speedMps: number;
  speedKmh: number;
  timeSeconds: number;
  wheelPowerW: number;
  aeroPowerW: number;
  rollingPowerW: number;
}

export function powerAtWheelW(speedMps: number, input: R01Input): {
  aeroPowerW: number; rollingPowerW: number; totalW: number
} {
  const { aeroPowerW, rollingPowerW, totalW } = wheelPowerRequiredW(speedMps, { ...input, gradeFraction: 0 });
  return { aeroPowerW, rollingPowerW, totalW };
}

export function simulateR01(input: R01Input): R01Result {
  const { speedMps, speedKmh, timeSeconds, wheelPowerW, aeroPowerW, rollingPowerW } =
    solveSteadyRide({ ...input, gradeFraction: 0 });
  return { speedMps, speedKmh, timeSeconds, wheelPowerW, aeroPowerW, rollingPowerW };
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
