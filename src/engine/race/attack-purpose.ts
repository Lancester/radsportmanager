/** Vorläufige, beobachtbare Angriffsmotivation. Keine zusätzliche Leistung. */
export type AttackPurpose='flucht_gruenden'|'gruppe_erreichen'|'sieg_angreifen';
export interface AttackPurposeObservation {
  remainingM:number;progress:number;gradeFraction:number;
  role:string;protectedFavorite:boolean;inMainGroup:boolean;
  gapToRaceFrontM:number;gapToNextGroupM:number|null;
  breakawayEstablished:boolean;teammateAhead:boolean;
  groupSize:number;winnerFinished:boolean;
}
export function selectAttackPurpose(o:AttackPurposeObservation):AttackPurpose|null{
  // Eine Rennentscheidung ist keine Zugabe von Watt oder Position.
  if(o.remainingM<=250||o.groupSize<1||o.winnerFinished)return null;
  // Der Sieg ist noch erreichbar: frühestens 60 km vor Ziel, oder an
  // einem selektiven Anstieg in der zweiten Rennhälfte. Nur in Reichweite.
  const deciding=o.remainingM<=60000||
    (o.progress>=.5&&o.gradeFraction>=.05&&o.remainingM<=90000);
  if(deciding&&o.gapToRaceFrontM<=2000&&o.groupSize>1)
    return 'sieg_angreifen';
  // Zu einer konkret vorausfahrenden Gruppe aufschließen. Die Begrenzung
  // ist zunächst eine unkalibrierte Reichweitenannahme, keine Siegregel.
  if(o.gapToNextGroupM!==null&&o.gapToNextGroupM>=30&&
    o.gapToNextGroupM<=500&&o.gapToRaceFrontM<=3000&&
    (!o.protectedFavorite||o.progress>=.35))return 'gruppe_erreichen';
  // Früh eine Flucht bilden: nicht während geschützter Kapitänsarbeit,
  // nicht bei bereits etablierter Flucht oder vorausfahrendem Teamkollegen.
  if(!o.protectedFavorite&&o.inMainGroup&&o.groupSize>=4&&
    !o.breakawayEstablished&&!o.teammateAhead&&o.gapToRaceFrontM<=150)
    return 'flucht_gruenden';
  return null;
}
