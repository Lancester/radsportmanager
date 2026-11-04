/**
 * R-24: reproduzierbare situative Angriffswahl fuer stable-pack.
 * Die Zahlen sind unkalibrierte KI-Heuristiken, keine Ergebnisvorgaben.
 * Ein Entschluss erzeugt nur eine anschliessend begrenzte Wattanfrage.
 */
export interface AdaptiveAttackObservation {
  timeS:number;remainingM:number;progress:number;gradeFraction:number;
  role:string;strategy:string;aggression:number;
  groupSize:number;gapToGroupFrontM:number;gapToRaceFrontM:number;
  effectiveCpW:number;wPrimeJ:number;reserveFraction:number;
  exposedHoldPowerW:number;lastAttackAgeS:number;currentIntent:string;
  breakawayEstablished:boolean;teammateAhead:boolean;draw:number;
}
export function adaptiveAttackDraw(seed:number,riderId:string,timeS:number):number{
  if(!Number.isSafeInteger(seed)||seed<0||!riderId||
    !Number.isFinite(timeS)||timeS<0)
    throw new RangeError('R24: ungueltiger Angriffs-Zufall');
  let h=(seed^Math.imul(Math.floor(timeS/10)+1,0x9e3779b1))>>>0;
  for(let i=0;i<riderId.length;i++)h=Math.imul(h^riderId.charCodeAt(i),16777619)>>>0;
  h^=h>>>16;h=Math.imul(h,0x7feb352d)>>>0;
  h^=h>>>15;h=Math.imul(h,0x846ca68b)>>>0;
  return ((h^(h>>>16))>>>0)/4294967296;
}
export function decideAdaptiveAttackOpportunity(o:AdaptiveAttackObservation):boolean{
  const nums=[o.timeS,o.remainingM,o.progress,o.gradeFraction,o.aggression,
    o.groupSize,o.gapToGroupFrontM,o.gapToRaceFrontM,o.effectiveCpW,
    o.wPrimeJ,o.reserveFraction,o.exposedHoldPowerW,o.lastAttackAgeS,o.draw];
  if(nums.some(x=>!Number.isFinite(x))||o.timeS<0||o.remainingM<0||
    o.progress<0||o.progress>1||o.aggression<0||o.aggression>1||
    !Number.isInteger(o.groupSize)||o.groupSize<1||o.gapToGroupFrontM<0||
    o.gapToRaceFrontM<0||o.effectiveCpW<=0||o.wPrimeJ<0||
    o.reserveFraction<0||o.reserveFraction>1.000001||
    o.exposedHoldPowerW<0||o.draw<0||o.draw>=1)
    throw new RangeError('R24: ungueltige Angriffslage');
  // Begonnene Attacken duerfen nach dem wirklichen Absetzen weiterlaufen.
  if(o.currentIntent==='angriff'&&o.lastAttackAgeS>=0&&
    o.lastAttackAgeS<40+30*o.aggression)
    return o.reserveFraction>=.16;
  // Ein bereits isolierter Rennfuehrer kann kein weiteres Mal aus
  // seiner Gruppe heraus attackieren; er faehrt das Solotempo weiter.
  // Ein allein zurueckliegender Fahrer darf dagegen weiterhin nachsetzen.
  if(o.groupSize===1&&o.gapToRaceFrontM<5)return false;
  if(o.timeS<180||o.remainingM<=250||o.reserveFraction<.28||
    o.lastAttackAgeS<120||
    ['sprint','erholung','verfolgung','helferarbeit'].includes(o.currentIntent))
    return false;
  // Um sich abzusetzen muss auch OHNE Windschatten Mehrleistung moeglich
  // sein. W′ finanziert den vorlaeufigen 60-s-Ueberschuss, keine Wattgabe.
  const sustainableAttackW=o.effectiveCpW+
    Math.min(o.wPrimeJ/60,o.effectiveCpW*.28);
  const advantage=(sustainableAttackW-o.exposedHoldPowerW)/o.effectiveCpW;
  if(advantage<=.015)return false;
  const ramp=Math.max(0,Math.min(1,o.gradeFraction/.08));
  const finale=1/(1+o.remainingM/25000);
  const early=o.progress<.16&&!o.breakawayEstablished?1:0;
  const readiness=Math.min(1,Math.max(0,(o.lastAttackAgeS-120)/780));
  const position=1/(1+o.gapToGroupFrontM/45);
  const raceGap=1/(1+o.gapToRaceFrontM/
    Math.max(1000,o.remainingM*.08));
  const strategy=o.strategy==='offensiv'?1.4:
    o.strategy==='kapitaen_schuetzen'?.8:
    o.strategy==='sprint'?.55:1;
  // Helfer koennen mitfahren und angreifen, priorisieren aber im Mittel
  // ihren Teamauftrag. Ein Fitnessetikett alleine entscheidet nichts.
  const role=o.role==='kapitaen'?1:o.role==='sprinter'?.12:.16;
  const team=o.teammateAhead?.25:1;
  const probability=(.0008+.0048*ramp+.0032*finale+.0024*early)*
    (.35+.65*o.aggression)*Math.min(1,advantage/.18)*
    readiness*position*raceGap*strategy*role*team;
  return o.draw<Math.min(.08,Math.max(0,probability));
}
