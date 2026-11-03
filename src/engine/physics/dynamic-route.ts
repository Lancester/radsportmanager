/**
 * Dynamischer Einzelfahrer-Rechenkern: mehrere gerade Streckenabschnitte,
 * Beschleunigung/Verzögerung, positive/negative Steigung und explizites Bremsen.
 * Noch keine Kurvenphysik, kein Wind, keine Physiologie, kein Peloton.
 */
export interface RouteRider {
  riderMassKg: number;
  equipmentMassKg: number;
  dragAreaM2: number;
  rollingCoefficient: number;
  airDensityKgM3: number;
  drivetrainEfficiency: number;
}
export interface RouteSection {
  /** Straßenlänge entlang der Fahrbahn, nicht horizontale Projektion. */
  lengthM: number;
  /** tan(Straßenwinkel): 0.07 = 7 %, -0.07 = -7 %. */
  gradeFraction: number;
  /** Vorgegebene Kurbel-/Pedalleistung für den Abschnitt. */
  crankPowerW: number;
  /** Zusätzliche konstante Bremskraft (N), keine automatische Kurvenerkennung. */
  brakeForceN?: number;
  label?: string;
}
export interface DynamicRouteInput {
  rider: RouteRider;
  sections: RouteSection[];
  initialSpeedMps: number;
  /** Max. Zeitschritt in Sekunden. Standard: 0.25. */
  stepSeconds?: number;
  /** Anfahrkraftlimit: P/v wäre bei v=0 singulär. Standard: 180 N. */
  maxDriveForceN?: number;
  /** Abbruchgrenze gegen Endlosschleifen. Standard: 2 Millionen. */
  maxSteps?: number;
}
export interface SectionReport {
  sectionIndex: number;
  label: string;
  startTimeS: number;
  endTimeS: number;
  startDistanceM: number;
  endDistanceM: number;
  startSpeedMps: number;
  endSpeedMps: number;
  maxSpeedMps: number;
  elevationChangeM: number;
  driveWorkJ: number;
  aeroLossJ: number;
  rollingLossJ: number;
  gravityWorkJ: number;
  brakeLossJ: number;
  kineticEnergyChangeJ: number;
  energyResidualJ: number;
}
export interface DynamicRouteResult {
  totalTimeS: number;
  totalDistanceM: number;
  totalElevationChangeM: number;
  finalSpeedMps: number;
  peakSpeedMps: number;
  steps: number;
  reports: SectionReport[];
}
const G = 9.81;
const DEFAULT_STEP_SECONDS = 0.25;
const DEFAULT_MAX_FORCE_N = 180;
const MAX_SPEED_MPS = 200;

function valid(name: string, value: number, condition: boolean): void {
  if (!Number.isFinite(value) || !condition) throw new RangeError(name + ': ungültiger Wert');
}
function validate(input: DynamicRouteInput): void {
  const r = input.rider;
  if (!r || !Array.isArray(input.sections) || input.sections.length === 0) {
    throw new RangeError('Fahrer und mindestens ein Streckenabschnitt sind erforderlich');
  }
  valid('riderMassKg', r.riderMassKg, r.riderMassKg > 0);
  valid('equipmentMassKg', r.equipmentMassKg, r.equipmentMassKg >= 0);
  valid('dragAreaM2', r.dragAreaM2, r.dragAreaM2 > 0);
  valid('rollingCoefficient', r.rollingCoefficient, r.rollingCoefficient >= 0);
  valid('airDensityKgM3', r.airDensityKgM3, r.airDensityKgM3 > 0);
  valid('drivetrainEfficiency', r.drivetrainEfficiency, r.drivetrainEfficiency > 0 && r.drivetrainEfficiency <= 1);
  valid('initialSpeedMps', input.initialSpeedMps, input.initialSpeedMps >= 0 && input.initialSpeedMps < MAX_SPEED_MPS);
  valid('stepSeconds', input.stepSeconds ?? DEFAULT_STEP_SECONDS,
    (input.stepSeconds ?? DEFAULT_STEP_SECONDS) >= 0.01 && (input.stepSeconds ?? DEFAULT_STEP_SECONDS) <= 2);
  valid('maxDriveForceN', input.maxDriveForceN ?? DEFAULT_MAX_FORCE_N, (input.maxDriveForceN ?? DEFAULT_MAX_FORCE_N) > 0);
  valid('maxSteps', input.maxSteps ?? 2_000_000,
    Number.isSafeInteger(input.maxSteps ?? 2_000_000) && (input.maxSteps ?? 2_000_000) > 0);
  input.sections.forEach((s, i) => {
    valid('sections[' + i + '].lengthM', s.lengthM, s.lengthM > 0);
    // Schützt z.B. vor der versehentlichen Eingabe "7" statt "0.07".
    valid('sections[' + i + '].gradeFraction', s.gradeFraction, Math.abs(s.gradeFraction) <= 0.35);
    valid('sections[' + i + '].crankPowerW', s.crankPowerW, s.crankPowerW >= 0);
    valid('sections[' + i + '].brakeForceN', s.brakeForceN ?? 0, (s.brakeForceN ?? 0) >= 0);
  });
}
interface ForceComponents {
  driveN: number;
  aeroN: number;
  rollN: number;
  gravityN: number;
  brakeN: number;
  netN: number;
}
function forces(speedMps: number, section: RouteSection, r: RouteRider, maxDriveForceN: number): ForceComponents {
  const massKg = r.riderMassKg + r.equipmentMassKg;
  const cos = 1 / Math.sqrt(1 + section.gradeFraction ** 2);
  const sin = section.gradeFraction * cos;
  const aeroN = 0.5 * r.airDensityKgM3 * r.dragAreaM2 * speedMps ** 2;
  const rollN = r.rollingCoefficient * massKg * G * cos;
  const gravityN = massKg * G * sin; // negativ bergab: treibende Kraft
  const driveN = Math.min(maxDriveForceN,
    section.crankPowerW * r.drivetrainEfficiency / Math.max(speedMps, 0.001));
  const brakeN = section.brakeForceN ?? 0;
  return { driveN, aeroN, rollN, gravityN, brakeN,
    netN: driveN - aeroN - rollN - gravityN - brakeN };
}
/** Impliziter Mittelpunktschritt: numerisch stabile Geschwindigkeitsentwicklung. */
function integrate(v0: number, dt: number, section: RouteSection, r: RouteRider, maxDriveForceN: number) {
  const massKg = r.riderMassKg + r.equipmentMassKg;
  function residual(v1: number): number {
    const vm = (v0 + v1) / 2;
    return v1 - v0 - dt * forces(vm, section, r, maxDriveForceN).netN / massKg;
  }
  let v1: number;
  if (residual(0) >= 0) {
    v1 = 0; // kein negatives Tempo, Stillstand wird ggf. gesondert gemeldet
  } else {
    let lo = 0;
    let hi = Math.max(1, v0 + 1);
    while (residual(hi) < 0) {
      hi *= 2;
      if (hi > MAX_SPEED_MPS) throw new RangeError('Unplausible Geschwindigkeit erreicht');
    }
    for (let i = 0; i < 42; i++) {
      const mid = (lo + hi) / 2;
      if (residual(mid) < 0) lo = mid;
      else hi = mid;
    }
    v1 = (lo + hi) / 2;
  }
  const midV = (v0 + v1) / 2;
  return { v1, distanceM: midV * dt, force: forces(midV, section, r, maxDriveForceN) };
}
export function simulateDynamicRoute(input: DynamicRouteInput): DynamicRouteResult {
  validate(input);
  const dtMax = input.stepSeconds ?? DEFAULT_STEP_SECONDS;
  const maxForce = input.maxDriveForceN ?? DEFAULT_MAX_FORCE_N;
  const maxSteps = input.maxSteps ?? 2_000_000;
  const massKg = input.rider.riderMassKg + input.rider.equipmentMassKg;
  let timeS = 0;
  let distanceM = 0;
  let speedMps = input.initialSpeedMps;
  let peakSpeedMps = speedMps;
  let totalElevationChangeM = 0;
  let steps = 0;
  const reports: SectionReport[] = [];
  for (const [index, section] of input.sections.entries()) {
    const startDistanceM = distanceM;
    const targetDistanceM = startDistanceM + section.lengthM;
    const startTimeS = timeS;
    const startSpeedMps = speedMps;
    const report: SectionReport = {
      sectionIndex: index,
      label: section.label ?? 'Abschnitt ' + (index + 1),
      startTimeS, endTimeS: startTimeS, startDistanceM, endDistanceM: startDistanceM,
      startSpeedMps, endSpeedMps: startSpeedMps, maxSpeedMps: startSpeedMps,
      elevationChangeM: section.lengthM * section.gradeFraction / Math.sqrt(1 + section.gradeFraction ** 2),
      driveWorkJ: 0, aeroLossJ: 0, rollingLossJ: 0, gravityWorkJ: 0,
      brakeLossJ: 0, kineticEnergyChangeJ: 0, energyResidualJ: 0,
    };
    while (distanceM < targetDistanceM - 1e-9) {
      if (++steps > maxSteps) throw new RangeError('Maximale Schrittzahl erreicht (möglicher Stillstand)');
      let dt = dtMax;
      let step = integrate(speedMps, dt, section, input.rider, maxForce);
      const left = targetDistanceM - distanceM;
      if (step.distanceM > left) {
        // Ende eines Abschnitts exakt treffen, Geschwindigkeit NICHT zurücksetzen.
        let lo = 0;
        let hi = dt;
        for (let i = 0; i < 45; i++) {
          const mid = (lo + hi) / 2;
          if (integrate(speedMps, mid, section, input.rider, maxForce).distanceM < left) lo = mid;
          else hi = mid;
        }
        dt = (lo + hi) / 2;
        step = integrate(speedMps, dt, section, input.rider, maxForce);
      }
      if (speedMps === 0 && step.v1 === 0 && step.distanceM <= 0) {
        throw new RangeError('Stillstand in Abschnitt ' + (index + 1) +
          ': Fahrkraft reicht nicht zum Vorwärtsfahren');
      }
      const travelled = Math.min(left, step.distanceM);
      const f = step.force;
      report.driveWorkJ += f.driveN * travelled;
      report.aeroLossJ += f.aeroN * travelled;
      report.rollingLossJ += f.rollN * travelled;
      report.gravityWorkJ += f.gravityN * travelled;
      report.brakeLossJ += f.brakeN * travelled;
      report.kineticEnergyChangeJ += 0.5 * massKg * (step.v1 ** 2 - speedMps ** 2);
      speedMps = step.v1;
      timeS += dt;
      distanceM += travelled;
      peakSpeedMps = Math.max(peakSpeedMps, speedMps);
      report.maxSpeedMps = Math.max(report.maxSpeedMps, speedMps);
    }
    distanceM = targetDistanceM;
    totalElevationChangeM += report.elevationChangeM;
    report.endDistanceM = distanceM;
    report.endTimeS = timeS;
    report.endSpeedMps = speedMps;
    report.energyResidualJ = report.driveWorkJ - report.aeroLossJ - report.rollingLossJ
      - report.gravityWorkJ - report.brakeLossJ - report.kineticEnergyChangeJ;
    reports.push(report);
  }
  return {
    totalTimeS: timeS, totalDistanceM: distanceM,
    totalElevationChangeM, finalSpeedMps: speedMps,
    peakSpeedMps, steps, reports,
  };
}
/** Fiktives Testprofil, nicht für echte Rennpacing-Empfehlungen. */
export const DYNAMIC_ROUTE_EXAMPLE: DynamicRouteInput = {
  rider: {
    riderMassKg: 72, equipmentMassKg: 8, dragAreaM2: 0.30,
    rollingCoefficient: 0.004, airDensityKgM3: 1.20, drivetrainEfficiency: 0.975,
  },
  initialSpeedMps: 8,
  stepSeconds: 0.25,
  sections: [
    { label: 'Ebene', lengthM: 1000, gradeFraction: 0, crankPowerW: 250 },
    { label: 'Anstieg 7 %', lengthM: 1000, gradeFraction: 0.07, crankPowerW: 300 },
    { label: 'Abfahrt -7 %', lengthM: 1000, gradeFraction: -0.07, crankPowerW: 0 },
    { label: 'Bremsen vor Kurve (nur Befehl)', lengthM: 200,
      gradeFraction: 0, crankPowerW: 0, brakeForceN: 20 },
    { label: 'Wieder beschleunigen', lengthM: 800, gradeFraction: 0, crankPowerW: 250 },
  ],
};
