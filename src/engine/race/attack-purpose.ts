/** Vorläufige, beobachtbare Angriffsmotivation. Keine zusätzliche Leistung. */
export type AttackPurpose='flucht_gruenden'|'gruppe_erreichen'|'sieg_angreifen';
export interface AttackPurposeObservation {
  remainingM:number;progress:number;gradeFraction:number;
  role:string;protectedFavorite:boolean;inMainGroup:boolean;
  gapToRaceFrontM:number;gapToNextGroupM:number|null;
  breakawayEstablished:boolean;teammateAhead:boolean;
  groupSize:number;winnerFinished:boolean;bridgeReachable:boolean;
  assignedTeamDuty:boolean;
}
export function selectAttackPurpose(o:AttackPurposeObservation):AttackPurpose|null{
  // Eine Rennentscheidung ist keine Zugabe von Watt oder Position.
  if(o.remainingM<=250||o.groupSize<1||o.winnerFinished||o.assignedTeamDuty)return null;
  // Der Sieg ist noch erreichbar: frühestens 60 km vor Ziel, oder an
  // einem selektiven Anstieg in der zweiten Rennhälfte. Nur in Reichweite.
  const deciding=o.remainingM<=60000||
    (o.progress>=.5&&o.gradeFraction>=.05&&o.remainingM<=90000);
  if(deciding&&o.gapToRaceFrontM<=2000&&o.groupSize>1)
    return 'sieg_angreifen';
  // Zu einer konkret vorausfahrenden Gruppe aufschließen. Die Begrenzung
  // ist zunächst eine unkalibrierte Reichweitenannahme, keine Siegregel.
  if(o.gapToNextGroupM!==null&&o.gapToNextGroupM>=30&&
    o.gapToNextGroupM<=500&&o.bridgeReachable&&o.gapToRaceFrontM<=3000&&
    (!o.protectedFavorite||o.progress>=.35))return 'gruppe_erreichen';
  // Früh eine Flucht bilden: nicht während geschützter Kapitänsarbeit,
  // nicht bei bereits etablierter Flucht oder vorausfahrendem Teamkollegen.
  if(!o.protectedFavorite&&o.inMainGroup&&o.groupSize>=4&&
    !o.breakawayEstablished&&!o.teammateAhead&&o.gapToRaceFrontM<=150)
    return 'flucht_gruenden';
  return null;
}

/** Vereinfacht Vorgriff auf mögliche eigene Leistung für maximal drei Minuten.
 * Konstante lokale Steigung, Wind und aktuelle Zielgruppengeschwindigkeit;
 * weder Vorhersage noch Bewegungsänderung. Keine Prüfung auf Abfahrten. */
export function estimateBridge(o:{gapM:number;targetSpeedMps:number;effectiveCpW:number;
  wPrimeJ:number;massKg:number;dragAreaM2:number;gradeFraction:number;
  rollingCoefficient:number;drivetrainEfficiency:number;airDensityKgM3:number;
  headwindMps:number;crosswindMps:number}):{reachable:boolean;closingMps:number;
  speedMps:number;budgetW:number}{
  const durationS=180;
  const budgetW=o.effectiveCpW+Math.min(o.wPrimeJ/durationS,o.effectiveCpW*.2);
  const theta=Math.atan(o.gradeFraction);
  const power=(v:number)=>{
    const airV=Math.hypot(Math.max(0,v+o.headwindMps),o.crosswindMps);
    return Math.max(0,v/o.drivetrainEfficiency*(o.massKg*9.80665*
      (Math.sin(theta)+o.rollingCoefficient*Math.cos(theta))+
      .5*o.airDensityKgM3*o.dragAreaM2*airV**2));
  };
  let low=0,high=30;
  for(let i=0;i<28;i++){const m=(low+high)/2;if(power(m)<=budgetW)low=m;else high=m;}
  const closingMps=Math.max(0,low-o.targetSpeedMps);
  // Stark negative Steigung/Abfahrt wird durch Brems- und Kurvenmodelle
  // begrenzt; die stationäre Wattgleichung wäre dort keine gute Prognose.
  const reachable=o.gradeFraction>-.03&&closingMps>0&&
    o.gapM<=closingMps*durationS;
  return {reachable,closingMps,speedMps:low,budgetW};
}
