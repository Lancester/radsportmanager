/** R-02: stationäre Bergauffahrt ohne Wind. */
import { solveSteadyRide, wheelPowerRequiredW } from './steady-state.ts';
import type { SteadyRideInput } from './steady-state.ts';

export type R02Input = SteadyRideInput;
export const R02_BASE: Readonly<R02Input> = Object.freeze({
  distanceM: 8_000,
  riderMassKg: 60,
  equipmentMassKg: 8,
  dragAreaM2: 0.30,
  rollingCoefficient: 0.004,
  airDensityKgM3: 1.20,
  crankPowerW: 300,
  drivetrainEfficiency: 0.975,
  gradeFraction: 0.07,
});
export { solveSteadyRide as simulateR02, wheelPowerRequiredW as requiredWheelPowerR02W };
