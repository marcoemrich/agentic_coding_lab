import { Damage, Item, Policy } from "./types.js";
import { isKnownItemType } from "./pricing.js";

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function validateDamages(policy: Policy, damages: Damage[]): void {
  for (const dmg of damages) {
    if (!isKnownItemType(dmg.itemType)) {
      throw new Error(`Unknown item type in claim: ${dmg.itemType}`);
    }
    if (dmg.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${dmg.amount}`);
    }
  }

  const policyCounts = countByType(policy.items.map((i) => i.type));
  const damageCounts = countByType(damages.map((d) => d.itemType));
  for (const [type, count] of damageCounts) {
    const available = policyCounts.get(type) ?? 0;
    if (count > available) {
      throw new Error(
        `Claim references more ${type} damages (${count}) than policy covers (${available})`
      );
    }
  }
}

function countByType(types: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of types) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
}

function reimbursementFor(item: Item, damageAmount: number): number {
  // The high-enchantment clause (≥ 8) reimburses at 50% and wins when it overlaps with
  // dragon material; dragon material on its own means "full reimbursement" — the default —
  // so it does not need its own branch.
  const reduced = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  const reimburse = reduced
    ? damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damageAmount;
  return Math.max(0, reimburse - DEDUCTIBLE_PER_DAMAGE);
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  validateDamages(policy, damages);

  // Pair each damage with a not-yet-consumed item of the same type from the policy.
  const availableByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    if (!availableByType.has(item.type)) availableByType.set(item.type, []);
    availableByType.get(item.type)!.push(item);
  }

  let totalPayout = 0;
  for (const dmg of damages) {
    const item = availableByType.get(dmg.itemType)!.shift()!;
    totalPayout += reimbursementFor(item, dmg.amount);
  }

  const payout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
