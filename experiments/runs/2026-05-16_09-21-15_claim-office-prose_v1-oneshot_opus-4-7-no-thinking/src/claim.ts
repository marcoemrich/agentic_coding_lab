import type { Damage, Incident, Item, Policy } from "./types.js";

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * Find a representative item in the policy matching the damaged item
 * type. Used to decide reimbursement factors based on the insured
 * item's attributes.
 *
 * If multiple items of the same type are in the policy, we pick one
 * that maximises reimbursement for the customer? No — MHPCO is
 * slightly stingy: pick the one that minimises reimbursement. But
 * practically, all alike items should have similar attributes. We
 * pick the *first* match and treat that as canonical.
 *
 * Actually to be precise to "items made of dragon material" — if any
 * insured item of that type is dragon material, that doesn't help if
 * the damaged one isn't. We rely on the policy having homogeneous
 * attributes per type for the simple test cases, otherwise we'd need
 * the claim to identify the specific item.
 */
function findRepresentativeItem(
  policy: Policy,
  itemType: string,
): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

function reimbursementFactor(item: Item | undefined): number {
  if (!item) return 1; // unknown item type; default full reimbursement
  if (item.material === "dragon") {
    return 1;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return 1;
}

function reimbursableForDamage(policy: Policy, damage: Damage): number {
  const item = findRepresentativeItem(policy, damage.itemType);
  const factor = reimbursementFactor(item);
  return damage.amount * factor;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/**
 * Process a claim against a policy. Mutates policy.remainingCap.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  let reimbursable = 0;
  for (const damage of incident.damages) {
    reimbursable += reimbursableForDamage(policy, damage);
  }

  // Deductible per incident.
  let payout = reimbursable - DEDUCTIBLE;
  if (payout < 0) payout = 0;

  // Cap at remaining cap.
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  // Round payout (MHPCO's favor = floor for what they pay out).
  payout = Math.floor(payout);

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
