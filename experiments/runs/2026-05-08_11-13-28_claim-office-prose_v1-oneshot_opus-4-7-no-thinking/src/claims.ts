import type { Incident, Item, Policy } from './types.js';

const DEDUCTIBLE = 100;

/**
 * Determine reimbursement fraction for damage to a given item.
 * - Dragon material: 100%
 * - Enchantment >= 8: 50%
 * - Otherwise: 0% (claim does not qualify)
 */
function reimbursementFraction(item: Item): number {
  if (item.material === 'dragon') return 1.0;
  if ((item.enchantment ?? 0) >= 8) return 0.5;
  return 0;
}

/**
 * Find the matching item for a damage entry by itemType. Picks the first
 * matching item in the policy.
 */
function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

export interface ClaimComputation {
  payout: number;
  remainingCap: number;
}

/**
 * Process a single claim against a policy. Mutates policy.remainingCap.
 *
 * Steps:
 *  1. Compute eligible reimbursement: sum over damages of (amount * fraction)
 *     where fraction depends on the item.
 *  2. Apply 100 G deductible per damage event (the incident).
 *  3. Cap at remaining policy cap.
 *  4. Round to whole G in MHPCO's favor (round down for payouts).
 */
export function processClaim(
  policy: Policy,
  incident: Incident
): ClaimComputation {
  let eligible = 0;
  for (const dmg of incident.damages) {
    const item = findItem(policy, dmg.itemType);
    if (!item) continue;
    const fraction = reimbursementFraction(item);
    eligible += dmg.amount * fraction;
  }

  // Apply deductible (per damage event)
  let payout = eligible - DEDUCTIBLE;
  if (payout < 0) payout = 0;

  // Cap at remaining policy cap
  if (payout > policy.remainingCap) payout = policy.remainingCap;

  // Round in MHPCO's favor (round down for payouts)
  payout = Math.floor(payout + 1e-9);

  policy.remainingCap -= payout;

  return {
    payout,
    remainingCap: policy.remainingCap,
  };
}
