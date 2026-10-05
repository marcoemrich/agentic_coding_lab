import { settlePayout, type Policy } from './policy.js';
import { rawReimbursement } from './reimbursement.js';
import { coveredDamages } from './coverage.js';
import type { Damage } from './damage.js';
const deductible = 100;
function afterDeductible(reimbursement: number): number {
  return Math.max(0, reimbursement - deductible);
}
function desiredPayout(policy: Policy, damages: Damage[]): number {
  return coveredDamages(policy.items, damages).reduce((sum, damage) =>
    sum + afterDeductible(rawReimbursement(damage.item, damage.amount)), 0);

}
export function claim(policy: Policy, damages: Damage[]) {
  return settlePayout(policy, Math.floor(desiredPayout(policy, damages)));
}
