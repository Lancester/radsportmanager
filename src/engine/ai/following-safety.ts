/**
 * R-05: konservative longitudinale Abstandsregelung (nur auf gerader Strecke).
 * Keine autonome Spurwahl, keine Quer-/Kurvenhaftung. Alle Werte pro Fahrer.
 * Ein zu kleiner Bremsweg wird als Gefahr gemeldet, nicht wegteleportiert.
 */
export interface FollowingSafetyOptions {
  minimumCenterGapM: number;
  desiredExtraGapM: number;
  reactionSeconds: number;
  maximumDecelerationMps2: number;
  approachTimeS: number;
}
export interface FollowingObservation {
  centerGapM: number;
  ownSpeedMps: number;
  leaderSpeedMps: number;
  massKg: number;
  /** Optionaler physikalischer Hinweis: angekündigte Verzögerung des Vordermanns. */
  leaderDecelerationMps2?: number;
}
export interface FollowingDecision {
  powerAllowed: boolean;
  brakeForceN: number;
  tooLateToGuarantee: boolean;
  requiredSafeDistanceM: number;
  closingSpeedMps: number;
  reason: string;
}
export const R05_SAFETY: Readonly<FollowingSafetyOptions> = Object.freeze({
  minimumCenterGapM: 1.8,
  desiredExtraGapM: 0.7,
  reactionSeconds: 0.25,
  maximumDecelerationMps2: 3,
  approachTimeS: 1.0,
});
const finite=(name:string,value:number,valid:boolean)=>{
  if(!Number.isFinite(value)||!valid)throw new RangeError('Abstandsregelung: '+name);
};
export function validateFollowingSafety(o:FollowingSafetyOptions):void {
  if(!o)throw new RangeError('Abstandsregelung fehlt');
  finite('minimumCenterGapM',o.minimumCenterGapM,o.minimumCenterGapM>0);
  finite('desiredExtraGapM',o.desiredExtraGapM,o.desiredExtraGapM>=0);
  finite('reactionSeconds',o.reactionSeconds,o.reactionSeconds>=0&&o.reactionSeconds<=2);
  finite('maximumDecelerationMps2',o.maximumDecelerationMps2,
    o.maximumDecelerationMps2>0&&o.maximumDecelerationMps2<=12);
  finite('approachTimeS',o.approachTimeS,o.approachTimeS>0&&o.approachTimeS<=10);
}
/** Wahl von Null-Antrieb und ggf. Bremskraft, ohne Positions-/Temposprünge.
 * Kein garantierter Crash-Schutz bei bereits unzureichendem Bremsweg.
 */
export function decideFollowingSafety(
  obs:FollowingObservation, options:FollowingSafetyOptions=R05_SAFETY,
):FollowingDecision {
  validateFollowingSafety(options);
  const {centerGapM,ownSpeedMps,leaderSpeedMps,massKg}=obs;
  const leaderDeceleration=obs.leaderDecelerationMps2??options.maximumDecelerationMps2;
  finite('leaderDecelerationMps2',leaderDeceleration,leaderDeceleration>0&&leaderDeceleration<=12);
  finite('centerGapM',centerGapM,centerGapM>0);
  finite('ownSpeedMps',ownSpeedMps,ownSpeedMps>=0&&ownSpeedMps<100);
  finite('leaderSpeedMps',leaderSpeedMps,leaderSpeedMps>=0&&leaderSpeedMps<100);
  finite('massKg',massKg,massKg>0);
  const closing=Math.max(0,ownSpeedMps-leaderSpeedMps);
  // Vergleicht Anhaltewege BEIDER Fahrer statt nur ihre momentane
  // Relativgeschwindigkeit. Der Vordermann darf stärker bremsen.
  const brakingDistance=Math.max(0,
    ownSpeedMps**2/(2*options.maximumDecelerationMps2)-
    leaderSpeedMps**2/(2*leaderDeceleration));
  const required=options.minimumCenterGapM + closing*options.reactionSeconds+
    brakingDistance;
  const remaining=centerGapM-options.minimumCenterGapM;
  const tooLate=closing>0 && required>centerGapM+1e-7;
  const desired=options.minimumCenterGapM+options.desiredExtraGapM;
  const predictedGap=centerGapM-closing*options.approachTimeS;
  // Wer sich dem Vordermann nähert, darf nicht weiter beschleunigen.
  const control=closing>0.005 && (
    predictedGap < desired+closing*options.reactionSeconds+1.0 ||
    required+options.desiredExtraGapM+1.0 >= centerGapM);
  // Bei echter Gefahr proaktiv bis zur physikalischen Deceleration-Grenze bremsen.
  const danger=closing>0.005 && (predictedGap<desired || required+options.desiredExtraGapM>=centerGapM);
  const brakeA=danger ? Math.min(options.maximumDecelerationMps2,
    Math.max(0.05, (ownSpeedMps**2-leaderSpeedMps**2)/
      (2*Math.max(0.15,remaining-options.desiredExtraGapM)))) : 0;
  const brakeForceN=brakeA*massKg;
  return {
    powerAllowed: !control && brakeForceN===0,
    brakeForceN,tooLateToGuarantee:tooLate,
    requiredSafeDistanceM:required,closingSpeedMps:closing,
    reason:tooLate?'Bremsweg möglicherweise unzureichend':
      brakeForceN>0?'Bremsen wegen auflaufendem Vordermann':
      control?'Leistung zurücknehmen wegen Schließgeschwindigkeit':
      'Abstand ausreichend',
  };
}
