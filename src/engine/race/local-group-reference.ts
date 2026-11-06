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
  // Wenn sich das direkte Rad vom Fahrer entfernt und selbst nicht
  // weniger stark verzögert als die Fernprognose, darf diese keine vorzeitige
  // stärkere Verzögerung dieses Rades vorgeben. Sonst wächst die Lücke, bevor
  // der Regler die mit der Distanz abnehmende Abschirmung ausgleicht.
  // Es ändern sich nur die angeforderten Watt; Position und Tempo
  // bleiben im vorhandenen Bewegungsintegrator.
  const groupAndWheelOppose=input.frontSpeedMps!==null&&
    input.frontSpeedMps>input.ownSpeedMps&&
    input.groupAccelerationMps2<0&&
    localAcceleration>input.groupAccelerationMps2;
  return {speedMps:localSpeed+weight*(input.groupSpeedMps-localSpeed),
    accelerationMps2:groupAndWheelOppose?localAcceleration:
      localAcceleration+weight*(input.groupAccelerationMps2-localAcceleration)};
}
