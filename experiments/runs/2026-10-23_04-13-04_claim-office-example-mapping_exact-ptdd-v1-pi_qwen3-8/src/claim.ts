/** MHPCO claim policy: deductible, reimbursement clauses, payout cap. */

import { insuranceValueG } from "./itemCatalog.js";
import type { ClaimResult, DamageEntry, QuoteItem } from "./scenario.js";

const CENTI = 100;
const PERCENT = 100;

/** A deductible of 100 G applies per damage event. */
const DEDUCTIBLE_G = 100;

/** The total payout per policy is capped at twice the insurance sum. */
const CAP_MULTIPLIER = 2;

/** Damage to items with enchantment >= 8 is reimbursed at 50 %. */
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSE_PERCENT = 50;

/** A created policy: its insured items and remaining payout cap. */
export interface Policy {
  items: QuoteItem[];
  remainingCapCenti: number;
}

/** A quote creates a policy capped at twice the insurance sum. */
export function createPolicy(items: QuoteItem[]): Policy {
  const insuranceSumCenti = items.reduce(
    (sum, item) => sum + insuranceValueG(item.type) * CENTI,
    0,
  );
  return { items, remainingCapCenti: insuranceSumCenti * CAP_MULTIPLIER };
}

/** Reimbursement percent for a damaged item: 50 % if highly enchanted. */
function reimbursePercent(policy: Policy, damage: DamageEntry): number {
  const item = policy.items.find((entry) => entry.type === damage.itemType);
  if ((item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSE_PERCENT;
  }
  return PERCENT;
}

/** One damage entry: reimbursed damage minus the deductible. */
function damagePayoutCenti(policy: Policy, damage: DamageEntry): number {
  const reimbursedCenti =
    (damage.amount * CENTI * reimbursePercent(policy, damage)) / PERCENT;
  return reimbursedCenti - DEDUCTIBLE_G * CENTI;
}

/**
 * Reject damage entries the policy does not cover (type or count)
 * and damage amounts that are not non-negative.
 */
function validateDamages(policy: Policy, damages: DamageEntry[]): void {
  const claimedCount = new Map<string, number>();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount ${damage.amount} must not be negative`);
    }
    const insuredCount = policy.items.filter(
      (item) => item.type === damage.itemType,
    ).length;
    const entries = (claimedCount.get(damage.itemType) ?? 0) + 1;
    claimedCount.set(damage.itemType, entries);
    if (entries > insuredCount) {
      throw new Error(
        `policy covers ${insuredCount} of "${damage.itemType}" ` +
          `but the claim reports ${entries} damage entries`,
      );
    }
  }
}

/** Pays a claim under the remaining cap; rounds down in MHPCO's favor. */
export function processClaim(
  policy: Policy,
  damages: DamageEntry[],
): ClaimResult {
  validateDamages(policy, damages);
  const desiredCenti = damages.reduce(
    (sum, damage) => sum + damagePayoutCenti(policy, damage),
    0,
  );
  const payoutCenti = Math.min(desiredCenti, policy.remainingCapCenti);
  const payoutG = Math.floor(payoutCenti / CENTI);
  policy.remainingCapCenti -= payoutG * CENTI;
  return {
    payout: payoutG,
    remainingCap: policy.remainingCapCenti / CENTI,
  };
}
