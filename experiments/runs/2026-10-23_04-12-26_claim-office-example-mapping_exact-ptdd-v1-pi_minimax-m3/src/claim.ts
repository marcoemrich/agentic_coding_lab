// Claim computation — payout calculation given a policy and damages.

import type { QuoteItem } from "./quote.js";

export const DEDUCTIBLE_G = 100;

// The high-enchantment clause (item.enchantment >= 8) always wins over the
// dragon-material clause and pays 50 % of the damage; everything else (dragon
// or default) pays 100 % of the damage. The multiplier is applied BEFORE the
// deductible.
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_MULTIPLIER = 0.5;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface PolicyState {
  items: QuoteItem[];
  insuranceSum: number;
  premium: number;
  remainingCap: number;
}

function damageMultiplier(item: QuoteItem): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    return HIGH_ENCHANTMENT_MULTIPLIER;
  }
  return 1.0;
}

function findItem(policy: PolicyState, itemType: string): QuoteItem | undefined {
  return policy.items.find((i) => i.type === itemType);
}

function availableCount(policy: PolicyState, itemType: string): number {
  return policy.items.filter((i) => i.type === itemType).length;
}

function damagePayout(item: QuoteItem, amount: number): number {
  return Math.max(0, amount * damageMultiplier(item) - DEDUCTIBLE_G);
}

function resolveDamageItem(
  policy: PolicyState,
  damage: Damage,
): QuoteItem {
  const item = findItem(policy, damage.itemType);
  if (!item) {
    throw new Error(`damage references item not on policy: ${damage.itemType}`);
  }
  return item;
}

function validateDamage(
  policy: PolicyState,
  damage: Damage,
  item: QuoteItem,
  usedSoFar: number,
): void {
  if (damage.amount < 0) {
    throw new Error(`damage amount must be non-negative: ${damage.amount}`);
  }
  const available = availableCount(policy, damage.itemType);
  if (usedSoFar >= available) {
    throw new Error(
      `more damages of type ${damage.itemType} (${usedSoFar + 1}) than policy covers (${available})`,
    );
  }
}

export function claimPayout(
  policy: PolicyState,
  damages: Damage[],
): ClaimResult {
  const used = new Map<string, number>();
  let totalRaw = 0;
  for (const damage of damages) {
    const item = resolveDamageItem(policy, damage);
    const usedSoFar = used.get(damage.itemType) ?? 0;
    validateDamage(policy, damage, item, usedSoFar);
    used.set(damage.itemType, usedSoFar + 1);
    totalRaw += damagePayout(item, damage.amount);
  }
  const payout = Math.min(Math.floor(totalRaw), policy.remainingCap);
  return {
    payout,
    remainingCap: policy.remainingCap - payout,
  };
}
