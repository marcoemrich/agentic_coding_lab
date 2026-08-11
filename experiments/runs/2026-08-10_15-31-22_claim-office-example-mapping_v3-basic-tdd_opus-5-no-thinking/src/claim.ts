import { priceOf } from './priceList.js';
import { ClaimOfficeError, type Damage, type Item, type Policy } from './types.js';

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

export const CAP_FACTOR = 2;

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceOf(item.type).insuranceValue, 0);
}

/**
 * Matches each damage to a distinct insured item, so that two damages of the
 * same type need two insured items of that type.
 */
function matchDamages(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];

  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new ClaimOfficeError(`negative damage amount: ${damage.amount}`);
    }

    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ClaimOfficeError(`item not covered by the policy: ${damage.itemType}`);
    }
    const [matched] = available.splice(index, 1);
    return matched;
  });
}

/**
 * Reimbursement for a single damage, before the deductible.
 *
 * High enchantment halves the damage and wins over dragon material, which is
 * reimbursed in full — as is any item to which no special clause applies.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
    return amount * HALF_REIMBURSEMENT_RATE;
  }
  return amount;
}

export function settleClaim(
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } {
  const items = matchDamages(policy, damages);

  const desired = damages.reduce((total, damage, index) => {
    const covered = reimbursement(items[index], damage.amount);
    return total + Math.max(0, covered - DEDUCTIBLE);
  }, 0);

  // Rounded in the MHPCO's favour: payouts go down.
  const payout = Math.min(Math.floor(desired), policy.remainingCap);

  return { payout, remainingCap: policy.remainingCap - payout };
}
