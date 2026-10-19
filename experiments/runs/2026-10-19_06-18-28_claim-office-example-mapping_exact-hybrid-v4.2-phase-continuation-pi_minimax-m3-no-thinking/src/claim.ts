import type { Item, ItemType } from "./types.js";

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  capRemaining: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimInput {
  policy: Policy;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class ClaimError extends Error {}

const DEDUCTIBLE_PER_EVENT = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_RATE = 0.5;

function countByKey<T>(items: T[], getKey: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function findFirstItemOfType(itemType: ItemType, items: Item[]): Item {
  const item = items.find((i) => i.type === itemType);
  if (!item) {
    throw new ClaimError(`Item ${itemType} not in policy`);
  }
  return item;
}

function reimbursementForItem(item: Item, damage: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    return damage * HIGH_ENCHANTMENT_RATE;
  }
  return damage;
}

function validateDamages(damages: Damage[], policy: Policy): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new ClaimError(`Negative damage amount: ${damage.amount}`);
    }
  }
  const policyCounts = countByKey(policy.items, (i) => i.type);
  const damageCounts = countByKey(damages, (d) => d.itemType);
  for (const [type, count] of damageCounts) {
    const available = policyCounts.get(type as ItemType) ?? 0;
    if (count > available) {
      throw new ClaimError(
        `Damage count for ${type} (${count}) exceeds policy coverage (${available})`
      );
    }
  }
}

function calculateTotalPayout(damages: Damage[], policy: Policy): number {
  let totalPayout = 0;
  for (const damage of damages) {
    const item = findFirstItemOfType(damage.itemType as ItemType, policy.items);
    const reimbursement = reimbursementForItem(item, damage.amount);
    totalPayout += reimbursement - DEDUCTIBLE_PER_EVENT;
  }
  return totalPayout;
}

export function processClaim(input: ClaimInput): ClaimResult {
  const { policy, damages } = input;
  validateDamages(damages, policy);
  const cappedPayout = Math.min(
    calculateTotalPayout(damages, policy),
    policy.capRemaining
  );
  const payout = Math.max(0, Math.floor(cappedPayout));
  return { payout, remainingCap: policy.capRemaining - payout };
}
