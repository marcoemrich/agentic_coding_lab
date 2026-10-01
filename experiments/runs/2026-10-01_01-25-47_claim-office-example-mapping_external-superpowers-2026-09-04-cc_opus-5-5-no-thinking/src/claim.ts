import type { Item } from './premium';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_FACTOR = 2;

function insuranceValue(item: Item): number {
  return MAIN_ITEM_INSURANCE_VALUE[item.type] ?? COMPONENT_INSURANCE_VALUE;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return { items, remainingCap: insuranceSum * CAP_FACTOR };
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/** Pairs each damage with a distinct insured item of the same type, in policy order; rejects invalid damages. */
function matchDamagedItems(policy: Policy, damages: Damage[]): Item[] {
  const used = new Set<Item>();
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
    const item = policy.items.find((i) => i.type === damage.itemType && !used.has(i));
    if (!item) {
      throw new Error(`Damaged item "${damage.itemType}" is not (sufficiently) covered by the policy`);
    }
    used.add(item);
    return item;
  });
}

function reimbursement(item: Item, amount: number): number {
  const rate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const items = matchDamagedItems(policy, damages);
  const requested = damages.reduce(
    (sum, damage, i) => sum + reimbursement(items[i], damage.amount),
    0,
  );
  const payout = Math.min(Math.floor(requested), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
