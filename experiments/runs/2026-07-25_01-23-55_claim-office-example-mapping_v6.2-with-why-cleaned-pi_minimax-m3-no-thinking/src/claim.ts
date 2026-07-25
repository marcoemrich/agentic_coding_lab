import type { ClaimResult, Damage, Item, Policy } from "./types.js";

// Per-claim flat deductible (MHPCO business rule).
const DEDUCTIBLE_PER_CLAIM = 100;

// Enchantment at or above this threshold triggers the 50% reimbursement rule.
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_FACTOR = 0.5;

export type { ClaimResult };

export function claim(policy: Policy, damages: Damage[]): ClaimResult {
  validateDamageAmounts(damages);

  const pools = poolItemsByType(policy.items);
  let totalReimbursement = 0;
  for (const damage of damages) {
    const item = consumeItemFromPool(pools, damage.itemType);
    totalReimbursement += Math.max(
      0,
      computeReimbursement(item, damage.amount) - DEDUCTIBLE_PER_CLAIM,
    );
  }

  // Cap never exceeded; round down to favor MHPCO.
  const payout = Math.floor(Math.min(totalReimbursement, policy.remainingCap));
  return {
    payout,
    remainingCap: policy.remainingCap - payout,
  };
}

function validateDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

// Per-item reimbursement BEFORE the per-claim deductible.
// Enchantment >= 8 wins; otherwise the item is reimbursed in full
// (this also covers the dragon-material clause, which grants full reimbursement).
function computeReimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_FACTOR;
  }
  return amount;
}

function poolItemsByType(items: Item[]): Map<string, Item[]> {
  const pools = new Map<string, Item[]>();
  for (const item of items) {
    const pool = pools.get(item.type) ?? [];
    pools.set(item.type, pool);
    pool.push(item);
  }
  return pools;
}

// Pool size tracks remaining insured items of each type, so an empty/missing
// pool entry means a damage references an uninsured item or one already consumed.
function consumeItemFromPool(pools: Map<string, Item[]>, type: string): Item {
  const pool = pools.get(type);
  if (!pool || pool.length === 0) {
    throw new Error(`Damage references "${type}" beyond insured items.`);
  }
  return pool.shift()!;
}
