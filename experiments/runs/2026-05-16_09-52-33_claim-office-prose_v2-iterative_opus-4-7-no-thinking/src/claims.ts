import type { Item, Incident, PolicyRecord } from "./types.js";
import { roundFavor } from "./pricing.js";

const DEDUCTIBLE = 100;
const HIGH_ENCHANT_THRESHOLD = 8;
const HIGH_ENCHANT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

/**
 * Find a representative item in the policy that matches a damaged
 * itemType. We use the first matching item to read its material and
 * enchantment level.
 */
function findItem(policy: PolicyRecord, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

/**
 * Round in MHPCO's favor for payouts — payouts are paid OUT by the
 * insurer, so favoring MHPCO means paying less: round down.
 */
function roundPayoutFavor(amount: number): number {
  return Math.floor(amount + 1e-9);
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function processClaim(
  policy: PolicyRecord,
  incident: Incident,
): ClaimResult {
  // Compute gross reimbursable amount across all damages
  let gross = 0;
  for (const damage of incident.damages) {
    const item = findItem(policy, damage.itemType);
    let rate = 1;
    if (item) {
      const isDragon =
        typeof item.material === "string" &&
        item.material.toLowerCase() === DRAGON_MATERIAL;
      const isHighEnchant = (item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD;
      if (isDragon) {
        rate = 1;
      } else if (isHighEnchant) {
        rate = HIGH_ENCHANT_RATE;
      } else {
        // Per the spec, claims "may concern damage to items with high
        // enchantment level (≥ 8) or made of dragon material". For
        // ordinary items, full reimbursement applies before deductible.
        rate = 1;
      }
    }
    gross += damage.amount * rate;
  }

  // Apply deductible per damage event (one incident = one event)
  let afterDeductible = gross - DEDUCTIBLE;
  if (afterDeductible < 0) afterDeductible = 0;

  // Cap at remaining cap
  const capped = Math.min(afterDeductible, policy.remainingCap);
  const payout = roundPayoutFavor(capped);

  const newRemainingCap = policy.remainingCap - payout;

  return {
    payout,
    remainingCap: newRemainingCap,
  };
}
