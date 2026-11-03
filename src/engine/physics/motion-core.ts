/** Vorläufiges Modell für Kurvenvorschau und rotierende Laufradträgheit.
 * Kurven sind zunächst Kontrollpunkte am Ende eines Abschnitts; keine 3D-Fahrspur.
 */
export interface Curve { radiusM: number; gripCoefficient: number; safetyFactor?: number }
export interface CornerRider {
  riderMassKg: number; equipmentMassKg: number; dragAreaM2: number;
  rollingCoefficient: number; airDensityKgM3: number; drivetrainEfficiency: number;
  wheelInertiaKgM2?: number; wheelRadiusM?: number;
}
export interface CornerSection {
  lengthM: number; gradeFraction: number; crankPowerW: number;
  label?: string; cornerAtEnd?: Curve;
  /** Explizit befohlene Bremskraft, zusätzlich zum Kurvenplaner. */
  brakeForceN?: number;
}
export interface CornerRouteInput {
  rider: CornerRider; sections: CornerSection[]; initialSpeedMps: number;
  stepSeconds?: number; maxDriveForceN?: number;
  maxBrakingDecelerationMps2?: number; reactionTimeS?: number;
  maxSteps?: number;
}
export interface CornerPass {
  distanceM: number; radiusM: number; limitMps: number;
  entrySpeedMps: number; firstBrakeDistanceM: number | null;
}
export interface CornerSectionReport {
  sectionIndex: number;
  label: string;
  startTimeS: number; endTimeS: number;
  startDistanceM: number; endDistanceM: number;
  startSpeedMps: number; endSpeedMps: number; maxSpeedMps: number;
  elevationChangeM: number;
  driveWorkJ: number; aeroLossJ: number; rollingLossJ: number;
  gravityWorkJ: number; brakeLossJ: number;
  kineticEnergyChangeJ: number; energyResidualJ: number;
}
export interface CornerRouteResult {
  totalTimeS: number; totalDistanceM: number; finalSpeedMps: number;
  peakSpeedMps: number; totalElevationChangeM: number; steps: number;
  effectiveMassKg: number; corners: CornerPass[]; reports: CornerSectionReport[];
}
const G = 9.81;
const check = (name: string, v: number, ok: boolean): void => {
  if (!Number.isFinite(v) || !ok) throw new RangeError('Ungültig: ' + name);
};
const angle = (grade: number) => ({
  cos: 1 / Math.hypot(1, grade), sin: grade / Math.hypot(1, grade),
});
export function effectiveAccelerationMassKg(r: CornerRider): number {
  const m = r.riderMassKg + r.equipmentMassKg;
  return m + (r.wheelInertiaKgM2 ?? 0) / (r.wheelRadiusM ?? 0.34) ** 2;
}
export function cornerSpeedLimitMps(curve: Curve, gradeFraction = 0): number {
  check('radiusM', curve.radiusM, curve.radiusM > 0);
  check('gripCoefficient', curve.gripCoefficient, curve.gripCoefficient > 0 && curve.gripCoefficient <= 2);
  const s = curve.safetyFactor ?? 0.70;
  check('safetyFactor', s, s > 0 && s <= 1);
  check('gradeFraction', gradeFraction, Math.abs(gradeFraction) <= 0.35);
  return Math.sqrt(curve.radiusM * curve.gripCoefficient * G * angle(gradeFraction).cos * s);
}
function validate(x: CornerRouteInput): void {
  if (!x?.rider || !Array.isArray(x.sections) || !x.sections.length) throw new RangeError('Fahrer und Abschnitte fehlen');
  const r = x.rider;
  check('riderMassKg', r.riderMassKg, r.riderMassKg > 0);
  check('equipmentMassKg', r.equipmentMassKg, r.equipmentMassKg >= 0);
  check('dragAreaM2', r.dragAreaM2, r.dragAreaM2 > 0);
  check('rollingCoefficient', r.rollingCoefficient, r.rollingCoefficient >= 0);
  check('airDensityKgM3', r.airDensityKgM3, r.airDensityKgM3 > 0);
  check('drivetrainEfficiency', r.drivetrainEfficiency, r.drivetrainEfficiency > 0 && r.drivetrainEfficiency <= 1);
  check('wheelInertiaKgM2', r.wheelInertiaKgM2 ?? 0, (r.wheelInertiaKgM2 ?? 0) >= 0);
  check('wheelRadiusM', r.wheelRadiusM ?? 0.34, (r.wheelRadiusM ?? 0.34) > 0.1);
  check('initialSpeedMps', x.initialSpeedMps, x.initialSpeedMps >= 0 && x.initialSpeedMps < 100);
  check('stepSeconds', x.stepSeconds ?? 0.25, (x.stepSeconds ?? 0.25) >= 0.01 && (x.stepSeconds ?? 0.25) <= 1);
  check('maxDriveForceN', x.maxDriveForceN ?? 180, (x.maxDriveForceN ?? 180) > 0);
  check('maxBrakingDecelerationMps2', x.maxBrakingDecelerationMps2 ?? 3,
    (x.maxBrakingDecelerationMps2 ?? 3) > 0 && (x.maxBrakingDecelerationMps2 ?? 3) <= 10);
  check('reactionTimeS', x.reactionTimeS ?? 0.5, (x.reactionTimeS ?? 0.5) >= 0 && (x.reactionTimeS ?? 0.5) <= 5);
  check('maxSteps', x.maxSteps ?? 1_000_000, Number.isSafeInteger(x.maxSteps ?? 1_000_000) && (x.maxSteps ?? 1_000_000) > 0);
  x.sections.forEach((s, i) => {
    check('lengthM ' + i, s.lengthM, s.lengthM > 0);
    check('gradeFraction ' + i, s.gradeFraction, Math.abs(s.gradeFraction) <= 0.35);
    check('crankPowerW ' + i, s.crankPowerW, s.crankPowerW >= 0);
    check('brakeForceN ' + i, s.brakeForceN ?? 0, (s.brakeForceN ?? 0) >= 0);
    if (s.cornerAtEnd) cornerSpeedLimitMps(s.cornerAtEnd, s.gradeFraction);
  });
}
interface Forces { drive: number; aero: number; roll: number; gravity: number; brake: number; net: number }
function computeForces(v: number, s: CornerSection, r: CornerRider, driveW: number, brakeN: number, driveLimitN: number, aeroFactor = 1): Forces {
  const { sin, cos } = angle(s.gradeFraction);
  const mass = r.riderMassKg + r.equipmentMassKg;
  const aero = 0.5 * r.airDensityKgM3 * r.dragAreaM2 * aeroFactor * v * v;
  const roll = r.rollingCoefficient * mass * G * cos;
  const gravity = mass * G * sin;
  const drive = Math.min(driveLimitN, driveW * r.drivetrainEfficiency / Math.max(v, 0.001));
  return { drive, aero, roll, gravity, brake: brakeN,
    net: drive - aero - roll - gravity - brakeN };
}
function integrate(v0: number, dt: number, section: CornerSection, rider: CornerRider,
  massEff: number, power: number, brakeN: number, maxDriveN: number, aeroFactor = 1) {
  const residual = (endV: number) => endV - v0 - dt *
    computeForces((v0 + endV) / 2, section, rider, power, brakeN, maxDriveN, aeroFactor).net / massEff;
  let endV = 0;
  if (residual(0) < 0) {
    let lo = 0, hi = Math.max(1, v0 + 1);
    while (residual(hi) < 0) {
      hi *= 2;
      if (hi > 200) throw new RangeError('Unplausible Geschwindigkeit');
    }
    for (let i = 0; i < 35; i++) {
      const mid = (lo + hi) / 2;
      if (residual(mid) < 0) lo = mid; else hi = mid;
    }
    endV = (lo + hi) / 2;
  }
  const vMid = (v0 + endV) / 2;
  return { endV, distanceM: vMid * dt,
    forces: computeForces(vMid, section, rider, power, brakeN, maxDriveN, aeroFactor) };
}
/** Ein gemeinsamer Integrationsschritt für unabhängig oder gekoppelt simulierte Fahrer.
 * aeroFactor wirkt AUSSCHLIESSLICH auf den aerodynamischen Widerstand.
 * Die bereits vorhandene Kurven-/Streckensimulation benutzt diesen Solver weiterhin mit Faktor 1.
 */
export interface ExternalMotionStep {
  endSpeedMps: number;
  distanceM: number;
  driveWorkJ: number;
  aeroLossJ: number;
  rollingLossJ: number;
  gravityWorkJ: number;
  kineticEnergyChangeJ: number;
  energyResidualJ: number;
}
export function advanceMotionStep(input: {
  speedMps: number;
  stepSeconds: number;
  crankPowerW: number;
  rider: CornerRider;
  gradeFraction?: number;
  aeroFactor?: number;
  maxDriveForceN?: number;
}): ExternalMotionStep {
  const { speedMps, stepSeconds, crankPowerW, rider } = input;
  const aeroFactor = input.aeroFactor ?? 1;
  const gradeFraction = input.gradeFraction ?? 0;
  check('speedMps', speedMps, speedMps >= 0 && speedMps < 100);
  check('stepSeconds', stepSeconds, stepSeconds > 0 && stepSeconds <= 1);
  check('crankPowerW', crankPowerW, crankPowerW >= 0);
  check('aeroFactor', aeroFactor, aeroFactor > 0 && aeroFactor <= 1);
  check('gradeFraction', gradeFraction, Math.abs(gradeFraction) <= 0.35);
  const massEff = effectiveAccelerationMassKg(rider);
  const step = integrate(speedMps, stepSeconds,
    {lengthM: 1, gradeFraction, crankPowerW},
    rider, massEff, crankPowerW, 0, input.maxDriveForceN ?? 180, aeroFactor);
  const ds = step.distanceM;
  const driveWorkJ = step.forces.drive * ds;
  const aeroLossJ = step.forces.aero * ds;
  const rollingLossJ = step.forces.roll * ds;
  const gravityWorkJ = step.forces.gravity * ds;
  const kineticEnergyChangeJ = 0.5 * massEff * (step.endV**2 - speedMps**2);
  return {endSpeedMps: step.endV, distanceM: ds, driveWorkJ,
    aeroLossJ, rollingLossJ, gravityWorkJ, kineticEnergyChangeJ,
    energyResidualJ: driveWorkJ - aeroLossJ - rollingLossJ - gravityWorkJ - kineticEnergyChangeJ};
}
export function simulateMotionRoute(x: CornerRouteInput): CornerRouteResult {
  validate(x);
  const m = x.rider.riderMassKg + x.rider.equipmentMassKg;
  const meff = effectiveAccelerationMassKg(x.rider);
  const maxBrakeA = x.maxBrakingDecelerationMps2 ?? 3;
  const dtMax = x.stepSeconds ?? 0.25;
  const driveLimit = x.maxDriveForceN ?? 180;
  const reactionS = x.reactionTimeS ?? 0.5;
  let distanceM = 0, timeS = 0, speedMps = x.initialSpeedMps, peakSpeedMps = speedMps, steps = 0;
  let elevation = 0;
  const cornerPoints: CornerPass[] = [];
  const cornerGripFractions: number[] = [];
  let boundary = 0;
  for (const s of x.sections) {
    boundary += s.lengthM;
    if (s.cornerAtEnd) {
      cornerGripFractions.push(s.cornerAtEnd.gripCoefficient * (s.cornerAtEnd.safetyFactor ?? 0.70) * angle(s.gradeFraction).cos);
      cornerPoints.push({
      distanceM: boundary, radiusM: s.cornerAtEnd.radiusM,
      limitMps: cornerSpeedLimitMps(s.cornerAtEnd, s.gradeFraction),
      entrySpeedMps: NaN, firstBrakeDistanceM: null,
    });
    }
  }
  const reports: CornerSectionReport[] = [];
  let cornerIndex = 0;
  let segmentEnd = 0;
  for (const [index, s] of x.sections.entries()) {
    const startDistance = distanceM, startV = speedMps, startTimeS = timeS;
    segmentEnd += s.lengthM;
    const elevationChangeM = s.lengthM * angle(s.gradeFraction).sin;
    const rep: CornerSectionReport = {
      sectionIndex: index, label: s.label ?? 'Abschnitt ' + (index + 1),
      startTimeS, endTimeS: startTimeS, startDistanceM: startDistance,
      endDistanceM: segmentEnd, startSpeedMps: startV, endSpeedMps: NaN,
      maxSpeedMps: startV, elevationChangeM,
      driveWorkJ: 0, aeroLossJ: 0, rollingLossJ: 0, gravityWorkJ: 0, brakeLossJ: 0,
      kineticEnergyChangeJ: 0, energyResidualJ: 0 };
    elevation += elevationChangeM;
    while (distanceM < segmentEnd - 1e-9) {
      if (++steps > (x.maxSteps ?? 1_000_000)) throw new RangeError('Schrittgrenze erreicht');
      const nextCorner = cornerPoints[cornerIndex];
      let power = s.crankPowerW, brakeN = s.brakeForceN ?? 0;
      if (nextCorner) {
        const remaining = Math.max(1e-6, nextCorner.distanceM - distanceM);
        const target = nextCorner.limitMps;
        if (speedMps > target) {
          const unpowered = computeForces(speedMps, s, x.rider, 0, 0, driveLimit);
          const naturalDecel = -unpowered.net / meff;
          // Reifenhaftung begrenzt die tatsächlich mögliche Bremskraft;
          // Drehträgheit erhöht dabei die wirksame Verzögerungsmasse.
          const maxBrakeForceN = m * Math.min(maxBrakeA, G * cornerGripFractions[cornerIndex]);
          const netMaxDecel = Math.max(0.1, maxBrakeForceN / meff + naturalDecel);
          const needDistance = (speedMps ** 2 - target ** 2) / (2 * netMaxDecel);
          if (remaining <= needDistance + speedMps * reactionS + 1) {
            power = 0;
            const availableDistance = Math.max(0.3, remaining - 0.25);
            const desiredDecel = Math.max(0, (speedMps ** 2 - target ** 2) / (2 * availableDistance));
            brakeN = Math.max(brakeN, Math.max(0, Math.min(maxBrakeForceN,
              (desiredDecel - naturalDecel) * meff)));
            if (brakeN > 0 && nextCorner.firstBrakeDistanceM === null) {
              nextCorner.firstBrakeDistanceM = distanceM;
            }
          }
        }
      }
      let dt = dtMax;
      let step = integrate(speedMps, dt, s, x.rider, meff, power, brakeN, driveLimit);
      const left = segmentEnd - distanceM;
      if (step.distanceM > left) {
        let lo = 0, hi = dt;
        for (let i = 0; i < 37; i++) {
          const mid = (lo + hi) / 2;
          if (integrate(speedMps, mid, s, x.rider, meff, power, brakeN, driveLimit).distanceM < left) lo = mid;
          else hi = mid;
        }
        dt = (lo + hi) / 2;
        step = integrate(speedMps, dt, s, x.rider, meff, power, brakeN, driveLimit);
      }
      if (speedMps === 0 && step.endV === 0 && step.distanceM <= 0) {
        throw new RangeError('Stillstand ohne Vortrieb');
      }
      const ds = Math.min(left, step.distanceM), f = step.forces;
      rep.driveWorkJ += f.drive * ds;
      rep.aeroLossJ += f.aero * ds;
      rep.rollingLossJ += f.roll * ds;
      rep.gravityWorkJ += f.gravity * ds;
      rep.brakeLossJ += f.brake * ds;
      rep.kineticEnergyChangeJ += 0.5 * meff * (step.endV ** 2 - speedMps ** 2);
      timeS += dt; distanceM += ds; speedMps = step.endV;
      peakSpeedMps = Math.max(peakSpeedMps, speedMps);
      rep.maxSpeedMps = Math.max(rep.maxSpeedMps, speedMps);
    }
    distanceM = segmentEnd;
    rep.endSpeedMps = speedMps;
    rep.endTimeS = timeS;
    rep.energyResidualJ = rep.driveWorkJ - rep.aeroLossJ - rep.rollingLossJ - rep.gravityWorkJ
      - rep.brakeLossJ - rep.kineticEnergyChangeJ;
    reports.push(rep);
    if (cornerPoints[cornerIndex]?.distanceM <= segmentEnd + 1e-8) {
      const c = cornerPoints[cornerIndex];
      c.entrySpeedMps = speedMps;
      if (speedMps > c.limitMps + 0.15) {
        throw new RangeError('Kurve mit unzulässigem Tempo erreicht: ' + speedMps + ' > ' + c.limitMps);
      }
      cornerIndex++;
    }
  }
  return { totalTimeS: timeS, totalDistanceM: distanceM, finalSpeedMps: speedMps,
    peakSpeedMps, totalElevationChangeM: elevation, steps, effectiveMassKg: meff,
    corners: cornerPoints, reports };
}
export const CORNER_EXAMPLE: CornerRouteInput = {
  rider: { riderMassKg: 72, equipmentMassKg: 8, dragAreaM2: 0.30,
    rollingCoefficient: 0.004, airDensityKgM3: 1.20, drivetrainEfficiency: 0.975,
    wheelInertiaKgM2: 0.14, wheelRadiusM: 0.34 },
  initialSpeedMps: 12,
  sections: [
    { label: 'Anfahrt', lengthM: 250, gradeFraction: 0, crankPowerW: 250,
      cornerAtEnd: { radiusM: 15, gripCoefficient: 0.6, safetyFactor: 0.7 } },
    { label: 'Aus Kurve beschleunigen', lengthM: 350, gradeFraction: 0, crankPowerW: 250 },
  ],
};
