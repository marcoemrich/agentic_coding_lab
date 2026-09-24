import { insuranceSum } from './quote.js';

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT = 8;
const HALF = 2;

export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Policy = { items: Item[]; remainingCap: number };
export type Damage = { itemType: string; amount: number };

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

function reimbursement(item: Item | undefined, amount: number): number {
  return (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT ? amount / HALF : amount;
}

export function settle(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Negative damage: ${damage.amount}`);
    const index = available.findIndex(insured => insured.type === damage.itemType);
    if (index < 0) throw new Error(`Uninsured item: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return sum + Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
