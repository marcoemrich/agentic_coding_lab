import type { ClaimResult, DamageEntry, Incident, Item, Policy } from "./types.js";

const DEDUCTIBLE = 100;

function findItem(policy: Policy, damage: DamageEntry): Item | undefined {
  return policy.items.find((i) => i.type === damage.itemType);
}

function isDragonMaterial(item: Item | undefined, damage: DamageEntry): boolean {
  const material = damage.material ?? item?.material;
  return material === "dragon";
}

function enchantmentLevel(item: Item | undefined, damage: DamageEntry): number {
  return damage.enchantment ?? item?.enchantment ?? 0;
}

/**
 * Process a claim against a policy. Mutates `policy.remainingCap`.
 *
 * Reimbursement rules:
 *   - Damage to dragon-material items: fully reimbursed.
 *   - Damage to items with enchantment ≥ 8: 50% reimbursed.
 *   - Other damages: not reimbursed (claims only concern those categories).
 *
 * A 100 G deductible is subtracted per incident from the gross reimbursable amount,
 * and the resulting payout is capped by the remaining policy cap (2× insurance sum).
 */
export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  let gross = 0;
  for (const dmg of incident.damages) {
    const item = findItem(policy, dmg);
    if (isDragonMaterial(item, dmg)) {
      gross += dmg.amount;
    } else if (enchantmentLevel(item, dmg) >= 8) {
      gross += dmg.amount * 0.5;
    } else {
      // Damage type not covered by policy.
    }
  }

  let payout = gross - DEDUCTIBLE;
  if (payout < 0) payout = 0;
  payout = Math.floor(payout);

  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
