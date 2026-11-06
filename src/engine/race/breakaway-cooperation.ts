/** Individuelle Entscheidung: Ist Mitarbeit derzeit möglich und gewünscht?
 * Die eigene Reserve bleibt eine interne Fahrereigenschaft. */
export function breakawayWorkInterest(o:{teamStrategy:string;teamSprinterBehind:boolean;
  reserveFraction:number;currentIntent:string;unavailable?:boolean}):'work'|'save'|null{
  if(o.unavailable||!Number.isFinite(o.reserveFraction)||o.reserveFraction<0||
    o.reserveFraction>1||
    ['angriff','sprint','verfolgung','helferarbeit'].includes(o.currentIntent))return null;
  if((o.teamStrategy==='sprint'&&o.teamSprinterBehind)||o.reserveFraction<.20)return 'save';
  return 'work';
}

/** Auswahl nur aus real nahen Fahrern, die selbst Mitarbeit anbieten.
 * Kein Befehl, keine garantierte Übernahme und kein Positionswechsel. */
export function willingBreakawayPartner(o:{frontPositionM:number;
  candidates:readonly {id:string;positionM:number;offersWork:boolean}[]}):string|null{
  const candidate=o.candidates.find(r=>r.offersWork&&
    o.frontPositionM-r.positionM>=0&&o.frontPositionM-r.positionM<=12);
  return candidate?.id??null;
}

/** Vorläufige Führungsentscheidung in einer realen Fluchtgruppe.
 * Sie ist ein Wattwunsch und verändert weder Position noch Kräfte direkt. */
export function decideBreakawayWork(o:{isTrackedEscape:boolean;isActualFront:boolean;
  nearbyTrackedCompanions:number;teamStrategy:string;teamSprinterBehind:boolean;
  reserveFraction:number;criticalPowerW:number;requestedPowerW:number;
  currentIntent:string}):{powerW:number;intent:'work'|'save'}|null{
  if(!o.isTrackedEscape||!o.isActualFront||o.nearbyTrackedCompanions<1||
    !Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0||
    !Number.isFinite(o.requestedPowerW)||o.requestedPowerW<0)return null;
  const intent=breakawayWorkInterest(o);
  if(!intent)return null;
  if(intent==='save')return {powerW:Math.min(o.requestedPowerW,o.criticalPowerW*.82),intent};
  return {powerW:Math.max(o.requestedPowerW,o.criticalPowerW*.96),intent};
}

/** Diagnostik: Angebot ist noch keine Übernahme; protokolliert wird nur
 * ein späterer Längspositionswechsel in derselben erfassten Fluchtgruppe. */
export function observeBreakawayRelay(o:{sameTrackedGroup:boolean;elapsedS:number;
  formerPositionM:number;partnerPositionM:number}):'waiting'|'position-change'|'expired'{
  // 120 s begrenzen nur die Zuordnung eines Diagnoseereignisses.
  if(!o.sameTrackedGroup||o.elapsedS>120)return 'expired';
  return o.elapsedS>0&&o.partnerPositionM>o.formerPositionM?'position-change':'waiting';
}
