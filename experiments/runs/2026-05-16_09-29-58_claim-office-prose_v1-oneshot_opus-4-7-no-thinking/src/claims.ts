import { Damage, Incident, Item, Policy } from './types.js';

const DEDUCTIBLE = 100;

/**
 * Look up an item in a policy that matches the type of a damage entry.
 * The first matching item is returned (claims reference items by type only
 * per the schema example, so this is the natural lookup).
 */
function findInsuredItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

/**
 * Reimbursement rate for a single damaged item, based on the rules:
 *  - dragon material: 100% (fully reimbursed)
 *  - enchantment level >= 8: 50%
 *  - otherwise: 100% (standard insurance)
 *
 * If both apply, dragon material wins (full reimbursement is more generous,
 * and the rules don't say to compound penalties).
 */
function reimbursementRate(damage: Damage, insured: Item | undefined): number {
  const material = damage.material ?? insured?.material;
  if (material === 'dragon') return 1.0;
  const enchantment = damage.enchantment ?? insured?.enchantment ?? 0;
  if (enchantment >= 8) return 0.5;
  return 1.0;
}

/**
 * Compute the gross damage covered by the policy for an incident, applying
 * the per-item reimbursement rate based on enchantment and material.
 */
function grossCoveredDamage(policy: Policy, incident: Incident): number {
  let total = 0;
  for (const dmg of incident.damages) {
    const insured = findInsuredItem(policy, dmg.itemType);
    const rate = reimbursementRate(dmg, insured);
    total += dmg.amount * rate;
  }
  return total;
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

/**
 * Process a single claim event against a policy. Mutates the policy's
 * remainingCap to reflect the payout.
 *
 * Order of operations:
 *   1. Sum the covered damage (per-item reimbursement rates).
 *   2. Subtract the 100 G deductible (per damage event), floored at 0.
 *   3. Cap the payout at the remaining policy cap.
 *   4. Round in the MHPCO's favor: floor to whole G.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimOutcome {
  const covered = grossCoveredDamage(policy, incident);
  const afterDeductible = Math.max(0, covered - DEDUCTIBLE);
  const cappedPayout = Math.min(afterDeductible, policy.remainingCap);

  // Round in MHPCO's favor: pay out the floor.
  const payout = Math.floor(cappedPayout);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
