/**
 * Rennlabor-Taktikplan v1: teamweite Vorab-Anweisungen für die bestehende
 * autonome KI. Keine feste Helferzahl, keine neuen Geschwindigkeitsboni.
 *
 * Alle Entscheidungen bleiben an Position, W′, CP, Steigung und reale
 * Verfolgungslage gebunden. Unbekannte Pläne werden explizit abgewiesen.
 */
export type AttackRisk='keine'|'vorsichtig'|'normal'|'aggressiv'|'maximal';
export type AttackPhase='flexibel'|'frueh'|'mitte'|'spaet'|'finale';
export type ChasePolicy='vermeiden'|'selektiv'|'normal'|'konsequent';
export type TeamTempo='sparen'|'normal'|'hoch';
export type FinalePlan='situativ'|'sprint'|'spaete_attacke'|'kapitaen';
export type LeaderProtection='normal'|'hoch';

export interface TeamTacticalPlan {
  attackRisk:AttackRisk;
  attackPhase:AttackPhase;
  chasePolicy:ChasePolicy;
  teamTempo:TeamTempo;
  finale:FinalePlan;
  leaderProtection:LeaderProtection;
}
export const DEFAULT_TEAM_PLAN:Readonly<TeamTacticalPlan>=Object.freeze({
  attackRisk:'normal',attackPhase:'flexibel',chasePolicy:'normal',
  teamTempo:'normal',finale:'situativ',leaderProtection:'normal',
});
const allowed={
  attackRisk:['keine','vorsichtig','normal','aggressiv','maximal'],
  attackPhase:['flexibel','frueh','mitte','spaet','finale'],
  chasePolicy:['vermeiden','selektiv','normal','konsequent'],
  teamTempo:['sparen','normal','hoch'],
  finale:['situativ','sprint','spaete_attacke','kapitaen'],
  leaderProtection:['normal','hoch'],
} as const;
export function validateTeamPlan(x:TeamTacticalPlan):void{
  if(!x||typeof x!=='object')throw new RangeError('Rennlabor: Taktikplan fehlt');
  const keys=Object.keys(allowed);
  if(Object.keys(x).some(k=>!keys.includes(k))||
     keys.some(k=>!allowed[k as keyof typeof allowed].includes(x[k as keyof TeamTacticalPlan] as never)))
    throw new RangeError('Rennlabor: unbekannte taktische Anweisung');
}
export function effectiveTeamPlan(plan?:TeamTacticalPlan):Readonly<TeamTacticalPlan>{
  if(!plan)return DEFAULT_TEAM_PLAN;
  validateTeamPlan(plan);return plan;
}
function inPhase(plan:TeamTacticalPlan,p:number):boolean {
  if(plan.attackPhase==='flexibel')return true;
  if(plan.attackPhase==='frueh')return p<.30;
  if(plan.attackPhase==='mitte')return p>=.30&&p<.70;
  if(plan.attackPhase==='spaet')return p>=.70;
  return p>=.86;
}
/** Der Angriffsmultiplikator beeinflusst nur die Wahrscheinlichkeit der
 * Entscheidung, nicht die tatsächlich geleisteten Watt.
 */
export function attackOrder(
  plan:TeamTacticalPlan|undefined,progress:number,
):{allowed:boolean;probabilityFactor:number}{
  const x=effectiveTeamPlan(plan);
  if(!Number.isFinite(progress)||progress<0||progress>1)
    throw new RangeError('Rennlabor: Fortschritt');
  if(x.attackRisk==='keine'||!inPhase(x,progress))
    return {allowed:false,probabilityFactor:0};
  const factors={vorsichtig:.35,normal:1,aggressiv:2.2,maximal:3.6};
  let factor=factors[x.attackRisk];
  if(x.finale==='spaete_attacke'&&progress>=.78)factor*=2;
  if(x.finale==='sprint'&&progress>=.75)factor*=.35;
  if(x.finale==='kapitaen')factor*=x.leaderProtection==='hoch'?.52:.65;
  return {allowed:true,probabilityFactor:factor};
}
export function chaseInterested(
  plan:TeamTacticalPlan|undefined,base:boolean,urgent:boolean,
):boolean {
  const x=effectiveTeamPlan(plan);
  if(x.chasePolicy==='vermeiden')return false;
  if(x.chasePolicy==='selektiv')return base&&urgent;
  if(x.chasePolicy==='konsequent')return true;
  return base;
}
export function crewPowerFactor(plan:TeamTacticalPlan|undefined,
  mission:'jagd'|'sprintzug'|'schutz',duty:'fuehrung'|'unterstuetzung'):number{
  const x=effectiveTeamPlan(plan);
  if(mission==='schutz'){
    return x.leaderProtection==='hoch'||x.finale==='kapitaen'?1.03:
      x.teamTempo==='sparen'?.985:1;
  }
  if(duty!=='fuehrung')return x.teamTempo==='sparen'?.98:1;
  return x.teamTempo==='hoch'?1.055:x.teamTempo==='sparen'?.96:1;
}
