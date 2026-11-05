/** Vorläufige Führungsentscheidung in einer realen Fluchtgruppe.
 * Sie ist ein Wattwunsch und verändert weder Position noch Kräfte direkt. */
export function decideBreakawayWork(o:{isTrackedEscape:boolean;isActualFront:boolean;
  nearbyTrackedCompanions:number;teamStrategy:string;teamSprinterBehind:boolean;
  reserveFraction:number;criticalPowerW:number;requestedPowerW:number;
  currentIntent:string}):{powerW:number;intent:'work'|'save'}|null{
  if(!o.isTrackedEscape||!o.isActualFront||o.nearbyTrackedCompanions<1||
    !Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0||
    !Number.isFinite(o.requestedPowerW)||o.requestedPowerW<0||
    !Number.isFinite(o.reserveFraction)||o.reserveFraction<0||o.reserveFraction>1||
    ['angriff','sprint','verfolgung','helferarbeit'].includes(o.currentIntent))return null;
  // Ein Team mit eigenem Sprinter im Feld kann das Interesse an der
  // Flucht anders bewerten; erschöpfte Fahrer müssen nicht mitarbeiten.
  if((o.teamStrategy==='sprint'&&o.teamSprinterBehind)||o.reserveFraction<.20)
    return {powerW:Math.min(o.requestedPowerW,o.criticalPowerW*.82),intent:'save'};
  return {powerW:Math.max(o.requestedPowerW,o.criticalPowerW*.96),intent:'work'};
}
