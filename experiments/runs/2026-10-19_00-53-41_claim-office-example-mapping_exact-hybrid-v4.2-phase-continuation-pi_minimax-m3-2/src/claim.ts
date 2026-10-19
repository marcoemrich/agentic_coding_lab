import type { Damage, Item, ItemType, Policy } from "./types.js";

const INSURANCE_VALUE: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

function applyItemClauses(item: Item | undefined, amount: number): number {
  if ((item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return HIGH_ENCHANTMENT_PAYOUT_RATE * amount;
  }
  return amount;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  const cap = insuranceSum * CAP_MULTIPLIER;
  return {
    items,
    insuranceSum,
    cap,
    remainingCap: cap,
  };
}

export function processClaim(
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } {
  const rawPayout = damages.reduce((sum, damage) => {
    const policyItem = policy.items.find((i) => i.type === damage.itemType);
    const clauseAmount = applyItemClauses(policyItem, damage.amount);
    return sum + (clauseAmount - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}
