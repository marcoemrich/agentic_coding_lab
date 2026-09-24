import { insuranceSum, type Item } from './catalogue.js';

export type Damage = { itemType: string; amount: number };
export type Policy = { items: Item[]; remainingCap: number };

const POLICY_CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const DAMAGE_EVENT_DEDUCTIBLE = 100;

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: POLICY_CAP_MULTIPLIER * insuranceSum(items) };
}

function reimbursableDamage(item: Item, amount: number): number {
  const fraction = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL ? HALF_REIMBURSEMENT_RATE : 1;
  return Math.max(0, amount * fraction - DAMAGE_EVENT_DEDUCTIBLE);
}

export function settle(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  let desired = 0;
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error('Negative damage amount');
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Uninsured damage item: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    desired += reimbursableDamage(item, damage.amount);
  }
  const payout = Math.min(policy.remainingCap, Math.floor(desired));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
