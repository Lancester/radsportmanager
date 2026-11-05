/** Vorläufige, öffentlich einschätzbare Gegnerstärke relativ zum Feld.
 * Keine Benutzung fremder aktueller W′- oder Erschöpfungszustände. */
export interface KnownRiderAbility {id:string;knownCpW:number;massKg:number;
  bikeMassKg:number;dragAreaM2:number;sprintSkill:number}
export type ThreatProfile='flach'|'berg'|'gemischt';
const bound=(n:number)=>Math.min(1,Math.max(0,n));
function ability(r:KnownRiderAbility,profile:ThreatProfile):number {
  const climb=r.knownCpW/(r.massKg+r.bikeMassKg);
  const solo=Math.cbrt(r.knownCpW/r.dragAreaM2);
  if(profile==='berg')return climb;
  if(profile==='flach')return solo;
  return .5*climb/5+.5*solo/11;
}
/** Vergleichsrang, keine kalibrierte Siegchance und kein Wattbonus. */
export function estimateOpponentThreat(o:{opponent:KnownRiderAbility;
  field:readonly KnownRiderAbility[];profile:ThreatProfile;
  situation:'flucht'|'sprint'}):number {
  if(!o.field.length)return .5;
  const score=(r:KnownRiderAbility)=>o.situation==='sprint'?
    .55*bound(r.sprintSkill)+.45*bound(ability(r,'flach')/13):ability(r,o.profile);
  const value=score(o.opponent);
  const comparable=o.field.filter(r=>r.id!==o.opponent.id);
  if(!comparable.length)return .5;
  return comparable.reduce((n,r)=>n+(score(r)<value?1:score(r)===value?.5:0),0)/comparable.length;
}
