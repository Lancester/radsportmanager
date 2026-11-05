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
  // Eine real vorausfahrende Gruppe kann auch über mehrere Minuten
  // verfolgt werden; ihr Abstand allein ist keine feste Zeitsperre.
  if(o.gapToNextGroupM!==null&&o.gapToNextGroupM>=30&&o.bridgeReachable)
    return 'gruppe_erreichen';
  // Eine kleine Spitzengruppe kann auch weit vor dem Ziel Anlass sein,
  // sich für den Sieg abzusetzen: auf Ebene ebenso wie am Berg. Ob die
  // Attacke erfolgt und physisch gelingt, entscheidet die nachfolgende KI.
  const selectedFrontGroup=o.breakawayEstablished&&!o.inMainGroup&&
    !o.teammateAhead&&o.gapToRaceFrontM<=150&&o.groupSize>1&&o.groupSize<=12;
  const deciding=o.remainingM<=60000||
    (o.progress>=.5&&o.gradeFraction>=.05&&o.remainingM<=90000)||
    selectedFrontGroup;
  if(deciding&&o.gapToRaceFrontM<=2000&&o.groupSize>1)
    return 'sieg_angreifen';
  // Früh eine Flucht bilden: nicht während geschützter Kapitänsarbeit,
  // nicht bei bereits etablierter Flucht oder vorausfahrendem Teamkollegen.
  if(!o.protectedFavorite&&o.inMainGroup&&o.groupSize>=4&&
    !o.breakawayEstablished&&!o.teammateAhead&&o.gapToRaceFrontM<=150)
    return 'flucht_gruenden';
  return null;
}

/** Statische Momentanschätzung mehrerer Leistungsniveaus für einen
 * realen Anschlussversuch. Keine Bewegung oder Energiegutschrift.
 * Gleichbleibendes Gelände/Tempo sind Annahmen, keine Erfolgszusage. */
export function estimateBridge(o:{gapM:number;targetSpeedMps:number;effectiveCpW:number;
  wPrimeJ:number;massKg:number;dragAreaM2:number;gradeFraction:number;
  rollingCoefficient:number;drivetrainEfficiency:number;airDensityKgM3:number;
  headwindMps:number;crosswindMps:number;remainingM?:number}):{reachable:boolean;
  closingMps:number;speedMps:number;budgetW:number;estimatedSeconds:number|null}{
  const theta=Math.atan(o.gradeFraction);
  const power=(v:number)=>{
    const airV=Math.hypot(Math.max(0,v+o.headwindMps),o.crosswindMps);
    return Math.max(0,v/o.drivetrainEfficiency*(o.massKg*9.80665*
      (Math.sin(theta)+o.rollingCoefficient*Math.cos(theta))+
      .5*o.airDensityKgM3*o.dragAreaM2*airV**2));
  };
  // Beschränkung der geplanten Reserveausgabe, nicht der Nachführdauer.
  const energyBudget=.35*o.wPrimeJ;
  const candidates=[o.effectiveCpW*.92,o.effectiveCpW,
    ...[1200,600,300,120,60].map(t=>o.effectiveCpW+
      Math.min(energyBudget/t,o.effectiveCpW*.20))];
  const travelLimit=o.remainingM??Infinity;
  for(const budgetW of candidates){
    let low=0,high=30;
    for(let i=0;i<28;i++){const m=(low+high)/2;
      if(power(m)<=budgetW)low=m;else high=m;}
    const closingMps=low-o.targetSpeedMps;
    if(closingMps<=0)continue;
    const estimatedSeconds=o.gapM/closingMps;
    const reserveNeeded=Math.max(0,budgetW-o.effectiveCpW)*estimatedSeconds;
    if(reserveNeeded<=energyBudget&&low*estimatedSeconds<travelLimit)
      return {reachable:true,closingMps,speedMps:low,budgetW,estimatedSeconds};
  }
  return {reachable:false,closingMps:0,speedMps:0,budgetW:0,estimatedSeconds:null};
}
