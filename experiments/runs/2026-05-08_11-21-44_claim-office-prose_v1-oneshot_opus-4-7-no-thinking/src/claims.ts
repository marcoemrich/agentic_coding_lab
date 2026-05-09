import { Incident, Item, Policy } from './types.js';

const DEDUCTIBLE = 100;

/**
 * Find an item in a policy that matches the damage's itemType.
 * Returns the first matching item if any.
 */
function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

/**
 * Compute the reimbursement rate for a damaged item:
 * - Dragon material: 100%
 * - Enchantment level >= 8: 50%
 * - Otherwise: 100%
 *
 * Dragon material takes precedence over enchantment.
 */
function reimbursementRate(item: Item | undefined): number {
  if (!item) {
    return 1.0;
  }
  if (item.material === 'dragon') {
    return 1.0;
  }
  if ((item.enchantment ?? 0) >= 8) {
    return 0.5;
  }
  return 1.0;
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

/**
 * Process a claim against a policy. Mutates the policy's remainingCap.
 *
 * Per-incident deductible is 100G applied once to the gross reimbursable
 * amount. The total payout is capped by the policy's remaining cap.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimOutcome {
  // Sum reimbursable amounts across all damages in this incident
  let gross = 0;
  for (const dmg of incident.damages) {
    const item = findItem(policy, dmg.itemType);
    const rate = reimbursementRate(item);
    gross += dmg.amount * rate;
  }

  // Apply deductible (per damage event = per incident)
  let net = gross - DEDUCTIBLE;
  if (net < 0) {
    net = 0;
  }

  // Cap by remaining policy cap
  let payout = Math.min(net, policy.remainingCap);
  if (payout < 0) {
    payout = 0;
  }

  // Round to whole G; payout is rounded down to the nearest G
  // (in MHPCO's favor, since it pays out)
  payout = Math.floor(payout);

  policy.remainingCap -= payout;
  if (policy.remainingCap < 0) {
    policy.remainingCap = 0;
  }

  return { payout, remainingCap: policy.remainingCap };
}
