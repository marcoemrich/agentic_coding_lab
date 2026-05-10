import type { Damage, Incident, Item, Policy } from './types.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const ENCHANTMENT_THRESHOLD = 8;
const DRAGON_MATERIAL = 'dragon';

/**
 * Find an item by type in a policy. Returns the first match (assumes
 * homogeneous claim semantics — when multiple items of the same type exist,
 * any one is sufficient to determine the reimbursement category).
 */
function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

/**
 * Compute the reimbursable share of a single damage entry given the matching
 * insured item. Returns 0 if the damage does not qualify under either rule.
 */
function reimbursableAmount(item: Item | undefined, damage: Damage): number {
  if (!item) return 0;
  // Dragon material: fully reimbursed
  if (item.material === DRAGON_MATERIAL) {
    return damage.amount;
  }
  // High enchantment: 50% reimbursed
  if (item.enchantment >= ENCHANTMENT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return 0;
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

/**
 * Process a single damage claim against a policy. Mutates the policy's
 * remainingCap to reflect the payout. Returns the integer payout and the
 * remaining cap after the claim.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimOutcome {
  // Sum reimbursable amounts across the incident, then apply the single
  // per-incident deductible.
  let reimbursable = 0;
  for (const damage of incident.damages) {
    const item = findItem(policy, damage.itemType);
    reimbursable += reimbursableAmount(item, damage);
  }
  let payout = reimbursable - DEDUCTIBLE;
  if (payout < 0) payout = 0;
  // Apply the per-policy cap
  if (payout > policy.remainingCap) payout = policy.remainingCap;
  // Round down in MHPCO's favor
  payout = Math.floor(payout + 1e-9);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
