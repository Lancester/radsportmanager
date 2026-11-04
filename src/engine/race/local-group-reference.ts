/** R-24: Das unmittelbar vorausfahrende Rad ist die lokale Referenz.
 * In einem dichten Feld wird dessen Tempo kurzraeumig durch die beobachtete
 * Gruppenfront gedaempft; deren Einfluss faellt ueber 500 m stetig auf null.
 * Diese Distanz ist eine Testheuristik, keine physikalische Windschattengrenze. */
export const GROUP_FRONT_INFLUENCE_M=500;
export function localGroupReference(input:{
  stablePack:boolean;ownSpeedMps:number;frontSpeedMps:number|null;
  frontAccelerationMps2:number|null;groupSpeedMps:number;
  groupAccelerationMps2:number;distanceFromGroupFrontM:number;
}):{speedMps:number;accelerationMps2:number}{
  if(!input.stablePack)return {speedMps:input.groupSpeedMps,
    accelerationMps2:input.groupAccelerationMps2};
  const weight=Math.max(0,Math.min(1,
    1-input.distanceFromGroupFrontM/GROUP_FRONT_INFLUENCE_M));
  const localSpeed=input.frontSpeedMps??input.ownSpeedMps;
  const localAcceleration=input.frontAccelerationMps2??0;
  return {speedMps:localSpeed+weight*(input.groupSpeedMps-localSpeed),
    accelerationMps2:localAcceleration+weight*
      (input.groupAccelerationMps2-localAcceleration)};
}
