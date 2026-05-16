import type { ClaimResult, Incident, Item, Policy } from "./types.js";
import { DEDUCTIBLE } from "./pricing.js";

/**
 * Find the first item in the policy matching a given type.
 */
function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((i) => i.type === itemType);
}

/**
 * Compute the eligible reimbursement for a single damage entry against
 * an item.
 *
 * Eligibility rules:
 * - Damage to items made of dragon material is fully reimbursed.
 * - Damage to items with enchantment level >= 8 is reimbursed at 50%.
 * - All other damage is not reimbursed.
 *
 * Dragon material wins over high enchantment when both apply.
 */
export function eligibleReimbursement(item: Item | undefined, amount: number): number {
  if (!item) return 0;
  if (item.material === "dragon") {
    return amount;
  }
  if ((item.enchantment ?? 0) >= 8) {
    return amount * 0.5;
  }
  return 0;
}

/**
 * Process a claim against a policy, mutating the policy's remainingCap.
 * Returns the payout and the policy's remainingCap after the claim.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  let eligible = 0;
  for (const damage of incident.damages) {
    const item = findItem(policy, damage.itemType);
    eligible += eligibleReimbursement(item, damage.amount);
  }

  // Deductible per damage event (per claim).
  let payout = eligible - DEDUCTIBLE;
  if (payout < 0) payout = 0;

  // Cap at remaining policy cap.
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  // Round in MHPCO's favor — for payouts (paid out by MHPCO), favor means
  // round down to whole G.
  payout = Math.floor(payout);

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
