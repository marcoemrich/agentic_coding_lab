/**
 * Per-event deductible subtracted from every damage payout (in G).
 */
const DAMAGE_DEDUCTIBLE = 100;

/**
 * Enchantment level at which the "high-enchantment" damage clause kicks in.
 * Per spec, items enchanted at or above this level receive only a fraction of
 * the claimed damage before the deductible is applied. This threshold is
 * deliberately higher than the premium-side surcharge threshold (5): the
 * reimbursement clause is reserved for exceptionally powerful items.
 */
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;

/**
 * Multiplier applied to the damage amount for items meeting the
 * high-enchantment threshold. Per spec: such items are reimbursed at 50 %.
 */
const HIGH_ENCHANTMENT_FACTOR = 0.5;

/**
 * Insurance values (in G) per item type. Per spec:
 *   sword=1000, amulet=600, staff=800, potion=400;
 *   components (rune/moonstone)=250 each.
 */
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export type PolicyItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Policy = {
  items: PolicyItem[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
};

export type Damage = { itemType: string; amount: number };

export type Incident = { cause: string; damages: Damage[] };

export function createPolicy(items: PolicyItem[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

/**
 * Look up the policy item corresponding to a damage entry. Throws when the
 * damaged item type is not part of the policy.
 */
function findPolicyItem(policy: Policy, damage: Damage): PolicyItem {
  const item = policy.items.find((i) => i.type === damage.itemType);
  if (!item) {
    throw new Error(`Damage references item type not in policy: ${damage.itemType}`);
  }
  return item;
}

/**
 * Ensure a damage entry reports a non-negative amount.
 */
function validateDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
}

/**
 * Compute the raw payout for a single damage event, before flooring and the
 * per-claim cap are applied. Applies the high-enchantment clause (multiplies
 * the damage by HIGH_ENCHANTMENT_FACTOR) when the item is enchanted at or
 * above HIGH_ENCHANTMENT_DAMAGE_THRESHOLD, then subtracts the per-event deductible.
 */
function computeDamagePayout(item: PolicyItem, damage: Damage): number {
  const isHighEnchant = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD;
  const gross = isHighEnchant ? damage.amount * HIGH_ENCHANTMENT_FACTOR : damage.amount;
  return gross - DAMAGE_DEDUCTIBLE;
}

function countBy<T>(items: readonly T[], keyFn: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function validateDamageCounts(policy: Policy, damages: readonly Damage[]): void {
  const damageCounts = countBy(damages, (d) => d.itemType);
  const policyCounts = countBy(policy.items, (i) => i.type);
  for (const [type, count] of damageCounts) {
    const available = policyCounts.get(type) ?? 0;
    if (count > available) {
      throw new Error(
        `More damages of type "${type}" (${count}) than items in policy (${available})`,
      );
    }
  }
}

/**
 * Process a claim against a policy:
 *   1. Verify no damage type is over-counted vs the items in the policy.
 *   2. Sum the per-damage raw payouts (high-enchant clause applied,
 *      per-event deductible subtracted per damage).
 *   3. Floor the sum and clamp it to the policy's remaining cap.
 */
export function processClaim(
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } {
  validateDamageCounts(policy, incident.damages);
  let totalRaw = 0;
  for (const damage of incident.damages) {
    const item = findPolicyItem(policy, damage);
    validateDamageAmount(damage);
    totalRaw += computeDamagePayout(item, damage);
  }
  const payout = Math.min(Math.floor(totalRaw), policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}
