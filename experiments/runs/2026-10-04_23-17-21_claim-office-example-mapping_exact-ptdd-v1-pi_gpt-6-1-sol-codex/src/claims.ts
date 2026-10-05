import { settlePayout, type Policy } from './policy.js';
import type { Item } from './premium.js';
import type { Damage } from './scenario.js';

const deductible = 100;
const reducedReimbursementLevel = 8;
const reducedReimbursementRate = 0.5;

function reimbursedDamage(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= reducedReimbursementLevel ? reducedReimbursementRate : 1;
  return amount * rate;
}

function validateDamageAmount(amount: number): void {
  if (amount < 0) throw new Error('Damage amount must be nonnegative');
}

function damagePayout(item: Item, amount: number): number {
  validateDamageAmount(amount);
  return Math.max(0, reimbursedDamage(item, amount) - deductible);
}

function coveredDamages(items: Item[], damages: Damage[]) {
  const available = [...items];
  return damages.map(damage => {
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage exceeds insured items: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return { item, amount: damage.amount };
  });
}

export function processClaim(policy: Policy, damages: Damage[]) {
  const desiredPayout = coveredDamages(policy.items, damages).reduce((total, damage) => total + damagePayout(damage.item, damage.amount), 0);
  return settlePayout(policy, desiredPayout);
}
