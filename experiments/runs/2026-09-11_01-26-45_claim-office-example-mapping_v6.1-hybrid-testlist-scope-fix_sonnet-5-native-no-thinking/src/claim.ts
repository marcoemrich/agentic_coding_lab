export interface PolicyItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_DIVISOR = 2;

const HIGH_ENCHANTMENT_THRESHOLD = 8;

// Per-damage payout: reimbursement clauses (based on the damaged item's
// properties) apply to the raw damage amount first, then the flat
// deductible is subtracted, floored at 0.
//
// Per spec there are two clauses: high-enchantment (>=8) reimburses at
// 50%, and dragon material reimburses fully, with the 50% rule winning if
// both apply. Only the 50% clause is checked below: "full reimbursement"
// is already this function's fallback behavior for an item with neither
// clause, so `item.material === "dragon"` can never change the result —
// checking it would be a dead branch. This is a deliberate omission, not
// a missed requirement: no black-box test can distinguish the two paths.
const payoutForDamage = (damage: Damage, item: PolicyItem): number => {
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? damage.amount / HIGH_ENCHANTMENT_REIMBURSEMENT_DIVISOR
      : damage.amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

// Builds one consumable pool of policy items per type. Each pool is later
// drained (via pop) as damages are matched, one item per damage, enforcing
// a one-to-one match between damages and insured items of that type.
//
// Named distinctly from quote.ts's `countByType` on purpose: that helper
// returns read-only per-type counts, while this one returns arrays meant to
// be mutated (drained) by the caller.
const buildItemPoolsByType = (items: PolicyItem[]): Map<string, PolicyItem[]> => {
  const pools = new Map<string, PolicyItem[]>();
  for (const item of items) {
    const pool = pools.get(item.type) ?? [];
    pool.push(item);
    pools.set(item.type, pool);
  }
  return pools;
};

// Validates one damage entry against the remaining item pools and returns
// the specific policy item it consumes. Consolidates both throw conditions
// (negative amount, unmatched/exhausted item type) so the reduce below can
// stay a pure accumulation of payouts.
const resolveDamage = (
  damage: Damage,
  pools: Map<string, PolicyItem[]>
): PolicyItem => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
  const item = pools.get(damage.itemType)?.pop();
  if (!item) {
    throw new Error(
      `Damage references item type "${damage.itemType}" not covered (or already exhausted) by the policy`
    );
  }
  return item;
};

export const claim = (
  policyItems: PolicyItem[],
  damages: Damage[],
  priorPayouts: number
): ClaimResult => {
  const insuranceSum = policyItems.reduce(
    (sum, item) => sum + INSURANCE_VALUES[item.type],
    0
  );
  const cap = insuranceSum * CAP_MULTIPLIER;
  const pools = buildItemPoolsByType(policyItems);
  const desiredPayout = damages.reduce((sum, damage) => {
    const item = resolveDamage(damage, pools);
    return sum + payoutForDamage(damage, item);
  }, 0);
  const availableCap = Math.max(0, cap - priorPayouts);
  const payout = Math.floor(Math.min(desiredPayout, availableCap));
  return { payout, remainingCap: availableCap - payout };
};
