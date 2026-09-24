import { basePremiumFor } from './pricing.js';

export type InsuredItem = { type: string; material?: string; enchantment?: number };
export type Damage = { itemType: string; amount: number };
export type Policy = { items: InsuredItem[]; remainingCap: number };
const COMPONENT_VALUE = 250;
const VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: COMPONENT_VALUE, moonstone: COMPONENT_VALUE };
const CAP_MULTIPLIER = 2;
const HALF_RATE = 0.5;
const HIGH_ENCHANTMENT = 8;
const DEDUCTIBLE = 100;

export function createPolicy(items: InsuredItem[]): Policy {
  const sum = items.reduce((total, item) => {
    basePremiumFor(item.type);
    return total + VALUES[item.type];
  }, 0);
  return { items, remainingCap: sum * CAP_MULTIPLIER };
}

function reimbursement(item: InsuredItem, amount: number): number {
  const covered = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? amount * HALF_RATE : amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

export function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  let desired = 0;
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error('Negative damage amount');
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Uninsured damage: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    desired += reimbursement(item, damage.amount);
  }
  const payout = Math.min(policy.remainingCap, Math.floor(desired));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
