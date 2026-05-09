import { Item, Incident, Policy } from './types.js';
import { roundDown } from './pricing.js';

const DEDUCTIBLE = 100;

/**
 * Determine the reimbursement factor for damage to a particular item.
 * - Dragon material: 100% (full)
 * - Else if enchantment >= 8: 50%
 * - Else: 100%
 */
function reimbursementFactor(item: Item): number {
  if (item.material === 'dragon') return 1.0;
  if ((item.enchantment ?? 0) >= 8) return 0.5;
  return 1.0;
}

/**
 * Find the first item in the policy matching the given itemType.
 * If multiple items of the same type exist, we use the first one;
 * the rules don't disambiguate further.
 */
function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

/**
 * Process a single claim against the given policy. Mutates the policy's
 * remainingCap.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimOutcome {
  // Compute reimbursable damage total across all damages in this incident.
  let reimbursable = 0;
  for (const damage of incident.damages) {
    const item = findItem(policy, damage.itemType);
    const factor = item ? reimbursementFactor(item) : 1.0;
    reimbursable += damage.amount * factor;
  }

  // Apply deductible (per damage event = per incident).
  let payout = reimbursable - DEDUCTIBLE;
  if (payout < 0) payout = 0;

  // Round payout down (in MHPCO's favor).
  payout = roundDown(payout);

  // Apply remaining cap.
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
