import type { Damage, Incident, Item, Policy } from './types.js';

const DEDUCTIBLE = 100;

/**
 * Compute reimbursement for a single damage. The `policyItems` are
 * used to look up properties of damaged items when not provided in
 * the damage record itself.
 *
 * Rules:
 * - Items made of dragon material: fully reimbursed
 * - Items with enchantment >= 8: 50% reimbursement
 * - Otherwise: fully reimbursed
 */
function reimbursementForDamage(damage: Damage, policyItems: Item[]): number {
  // Look up the first matching item by type (best effort).
  const matched = policyItems.find((it) => it.type === damage.itemType);
  const material = damage.material ?? matched?.material;
  const enchantment = damage.enchantment ?? matched?.enchantment ?? 0;

  if (material === 'dragon') {
    return damage.amount;
  }
  if (enchantment >= 8) {
    return damage.amount * 0.5;
  }
  return damage.amount;
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

/**
 * Process a claim against a policy, mutating the policy's remainingCap.
 *
 * - One deductible (100G) per damage event (= per incident/claim).
 * - The total payout is limited by the policy's remainingCap (twice
 *   the insurance sum, less prior payouts).
 * - Negative payouts are clamped to 0.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimOutcome {
  let gross = 0;
  for (const damage of incident.damages) {
    gross += reimbursementForDamage(damage, policy.items);
  }

  // Apply deductible per damage event
  let net = gross - DEDUCTIBLE;
  if (net < 0) net = 0;

  // Apply remaining cap
  const payout = Math.min(net, policy.remainingCap);

  // MHPCO's favor: round payout DOWN, keep amounts as integers.
  const payoutInt = Math.floor(payout);
  policy.remainingCap = policy.remainingCap - payoutInt;

  return {
    payout: payoutInt,
    remainingCap: policy.remainingCap,
  };
}
