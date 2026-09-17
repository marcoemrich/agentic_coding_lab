const DAMAGE_EVENT_DEDUCTIBLE_G = 100;

export function payoutAfterDamageEventDeductible(reimbursableDamage: number): number {
  return Math.max(0, reimbursableDamage - DAMAGE_EVENT_DEDUCTIBLE_G);
}
