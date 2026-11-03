/** API-kompatibler Adapter: gesamte Bewegungsphysik liegt in motion-core.ts. */
export { simulateMotionRoute as simulateCornerRoute, cornerSpeedLimitMps,
  effectiveAccelerationMassKg, CORNER_EXAMPLE } from './motion-core.ts';
export type { Curve, CornerRider, CornerSection, CornerRouteInput,
  CornerPass, CornerSectionReport, CornerRouteResult } from './motion-core.ts';
