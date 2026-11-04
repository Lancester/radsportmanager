/** Situativer Begleiter: Der Helfer muss sich mit eigener Leistung an
 * seinen Kapitaen heranfahren. Keine direkte Positions-/Aeroaenderung. */
export function captainEscortPower(o:{sameGroup:boolean;mission:string|null;
  helperPositionM:number;captainPositionM:number;followPowerW:number;
  criticalPowerW:number;reserveFraction:number}):number|null{
  if(!o.sameGroup||o.mission!=='schutz'||o.reserveFraction<.18||
    !Number.isFinite(o.followPowerW)||o.followPowerW<0||
    !Number.isFinite(o.criticalPowerW)||o.criticalPowerW<=0)return null;
  const behind=o.captainPositionM-o.helperPositionM;
  if(behind<=0||behind>65)return null;
  const power=Math.min(o.criticalPowerW*1.025,
    o.followPowerW+Math.min(18,behind*.3));
  return power>o.followPowerW+1?power:null;
}
