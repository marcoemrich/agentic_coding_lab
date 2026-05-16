import { Damage, Incident, Item, Policy } from './types.js';

const DEDUCTIBLE_PER_INCIDENT = 100;

function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

/**
 * Compute reimbursement for a single damage entry based on the item's
 * properties.  enchantment ≥ 8 → 50% reimbursement; dragon material → 100%.
 * Otherwise full reimbursement of the damage amount.
 */
function reimbursementFor(item: Item | undefined, amount: number): number {
  if (!item) return amount; // default: full reimbursement
  if (item.material === 'dragon') return amount;
  if ((item.enchantment ?? 0) >= 8) return amount * 0.5;
  return amount;
}

export interface ClaimResultInternal {
  payout: number;
  remainingCap: number;
}

/**
 * Process a claim incident against a policy. Mutates `policy.remainingCap`.
 * Returns the payout (integer, rounded down in MHPCO's favor) and the new
 * remaining cap.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimResultInternal {
  let total = 0;
  for (const dmg of incident.damages) {
    const item = findItem(policy, dmg.itemType);
    total += reimbursementFor(item, dmg.amount);
  }

  // Apply the deductible once per damage event (incident).
  let payout = total - DEDUCTIBLE_PER_INCIDENT;
  if (payout < 0) payout = 0;

  // Cap payout to remainingCap.
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  // Round down in MHPCO's favor.
  const eps = 1e-9;
  payout = Math.floor(payout + eps);

  policy.remainingCap -= payout;

  return {
    payout,
    remainingCap: policy.remainingCap,
  };
}
