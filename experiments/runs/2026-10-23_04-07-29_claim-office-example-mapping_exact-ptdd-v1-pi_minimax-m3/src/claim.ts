import type { ClaimResult, Damage, Item, Policy } from "./types.js";
import {
  DEDUCTIBLE_PER_DAMAGE,
  DAMAGE_REIMBURSEMENT_THRESHOLD,
  HIGH_ENCHANTMENT_DAMAGE_RATE,
} from "./types.js";

function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((i) => i.type === itemType);
}

function isHighEnchantmentDamageClause(item: Item): boolean {
  return item.enchantment !== undefined
    && item.enchantment >= DAMAGE_REIMBURSEMENT_THRESHOLD;
}

function isDragonMaterial(item: Item): boolean {
  return item.material === "dragon";
}

function reimbursementMultiplier(item: Item): number {
  // 50% rule wins when both dragon material and high-enchantment clauses apply.
  if (isHighEnchantmentDamageClause(item)) {
    return HIGH_ENCHANTMENT_DAMAGE_RATE;
  }
  if (isDragonMaterial(item)) {
    return 1;
  }
  return 1;
}

function countByType<T>(items: Iterable<T>, key: (t: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

function validateDamage(policy: Policy, damage: Damage): void {
  const policyCounts = countByType(policy.items, (i) => i.type);
  const damageCounts = countByType(damage.damages, (d) => {
    if (d.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${d.amount}`);
    }
    return d.itemType;
  });

  for (const [itemType, count] of damageCounts) {
    const covered = policyCounts.get(itemType) ?? 0;
    if (covered === 0) {
      throw new Error(`Damage item type "${itemType}" is not part of the policy`);
    }
    if (count > covered) {
      throw new Error(
        `More damages (${count}) of type "${itemType}" than covered items (${covered})`,
      );
    }
  }
}

export function claim(policy: Policy, damage: Damage): ClaimResult {
  validateDamage(policy, damage);

  let totalPayout = 0;
  for (const d of damage.damages) {
    const item = findItem(policy, d.itemType);
    if (!item) {
      throw new Error(`Damage item type "${d.itemType}" is not part of the policy`);
    }
    const adjusted = reimbursementMultiplier(item) * d.amount;
    const perItem = adjusted - DEDUCTIBLE_PER_DAMAGE;
    totalPayout += perItem;
  }

  const payoutRaw = Math.floor(totalPayout);
  const payout = Math.min(payoutRaw, policy.remainingCap);
  const newRemainingCap = policy.remainingCap - payout;

  return { payout, remainingCap: newRemainingCap };
}
