/** API-kompatibler Adapter auf den gemeinsamen dynamischen Physikkern. */
import { simulateMotionRoute } from './motion-core.ts';
import type { CornerRider, CornerRouteResult } from './motion-core.ts';

export interface RouteRider extends Omit<CornerRider, 'wheelInertiaKgM2' | 'wheelRadiusM'> {}
export interface RouteSection {
  lengthM: number; gradeFraction: number; crankPowerW: number;
  brakeForceN?: number; label?: string;
}
export interface DynamicRouteInput {
  rider: RouteRider; sections: RouteSection[]; initialSpeedMps: number;
  stepSeconds?: number; maxDriveForceN?: number; maxSteps?: number;
}
export interface SectionReport {
  sectionIndex: number; label: string;
  startTimeS: number; endTimeS: number;
  startDistanceM: number; endDistanceM: number;
  startSpeedMps: number; endSpeedMps: number; maxSpeedMps: number;
  elevationChangeM: number;
  driveWorkJ: number; aeroLossJ: number; rollingLossJ: number;
  gravityWorkJ: number; brakeLossJ: number;
  kineticEnergyChangeJ: number; energyResidualJ: number;
}
export interface DynamicRouteResult {
  totalTimeS: number; totalDistanceM: number; totalElevationChangeM: number;
  finalSpeedMps: number; peakSpeedMps: number; steps: number;
  reports: SectionReport[];
}
export function simulateDynamicRoute(input: DynamicRouteInput): DynamicRouteResult {
  const r: CornerRouteResult = simulateMotionRoute({ ...input, maxSteps: input.maxSteps ?? 2_000_000 });
  // Keine neuen Felder in der ursprünglichen öffentlichen Schnittstelle.
  const { totalTimeS, totalDistanceM, totalElevationChangeM,
    finalSpeedMps, peakSpeedMps, steps, reports } = r;
  return { totalTimeS, totalDistanceM, totalElevationChangeM,
    finalSpeedMps, peakSpeedMps, steps,
    reports: reports.map(p => ({
      sectionIndex: p.sectionIndex, label: p.label,
      startTimeS: p.startTimeS, endTimeS: p.endTimeS,
      startDistanceM: p.startDistanceM, endDistanceM: p.endDistanceM,
      startSpeedMps: p.startSpeedMps, endSpeedMps: p.endSpeedMps, maxSpeedMps: p.maxSpeedMps,
      elevationChangeM: p.elevationChangeM,
      driveWorkJ: p.driveWorkJ, aeroLossJ: p.aeroLossJ, rollingLossJ: p.rollingLossJ,
      gravityWorkJ: p.gravityWorkJ, brakeLossJ: p.brakeLossJ,
      kineticEnergyChangeJ: p.kineticEnergyChangeJ, energyResidualJ: p.energyResidualJ,
    })),
  };
}
export const DYNAMIC_ROUTE_EXAMPLE: DynamicRouteInput = {
  rider: { riderMassKg: 72, equipmentMassKg: 8, dragAreaM2: 0.30,
    rollingCoefficient: 0.004, airDensityKgM3: 1.20, drivetrainEfficiency: 0.975 },
  initialSpeedMps: 8, stepSeconds: 0.25,
  sections: [
    { label: 'Ebene', lengthM: 1000, gradeFraction: 0, crankPowerW: 250 },
    { label: 'Anstieg 7 %', lengthM: 1000, gradeFraction: 0.07, crankPowerW: 300 },
    { label: 'Abfahrt -7 %', lengthM: 1000, gradeFraction: -0.07, crankPowerW: 0 },
    { label: 'Bremsen vor Kurve (nur Befehl)', lengthM: 200,
      gradeFraction: 0, crankPowerW: 0, brakeForceN: 20 },
    { label: 'Wieder beschleunigen', lengthM: 800, gradeFraction: 0, crankPowerW: 250 },
  ],
};
