import { RATE_UNIT, roundPayoutDown } from "./amounts.js";
import { itemInsuranceValue } from "./price-list.js";
import type { IncidentInput, ItemInput } from "./scenario.js";

// A deductible of 100 G applies per damage event (per damaged item).
const DEDUCTIBLE_G = 100;
// Damage to items with enchantment >= 8 is reimbursed at 50 %. When a dragon
// material item is also that highly enchanted, the 50 % rule wins.
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 10; // 10/20 = 50 %
// The total payout per policy is capped at twice the insurance sum.
const CAP_MULTIPLIER = 2;

export interface Policy {
  items: ItemInput[];
  remainingCap: number;
}

export function createPolicy(items: ItemInput[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item.type), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursementTwentieths(item: ItemInput, amount: number): number {
  if ((item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL) {
    return amount * HALF_REIMBURSEMENT_RATE;
  }
  // Dragon-material items are fully reimbursed, as are regular items.
  return amount * RATE_UNIT;
}

function payoutTwentieths(policy: Policy, damage: IncidentInput["damages"][number]): number {
  const item = policy.items.find((insured) => insured.type === damage.itemType);
  if (!item) {
    throw new Error(`the policy does not cover a ${damage.itemType}`);
  }
  return reimbursementTwentieths(item, damage.amount) - DEDUCTIBLE_G * RATE_UNIT;
}

function countByType(damages: IncidentInput["damages"]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const damage of damages) {
    counts.set(damage.itemType, (counts.get(damage.itemType) ?? 0) + 1);
  }
  return counts;
}

// A claim is admissible only if every damage amount is non-negative and the
// policy covers at least as many items of each damaged type as reported.
function assertAdmissibleClaim(policy: Policy, incident: IncidentInput): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`a damage amount must not be negative (got ${damage.amount} G)`);
    }
  }
  for (const [type, damagedCount] of countByType(incident.damages)) {
    const insuredCount = policy.items.filter((item) => item.type === type).length;
    if (damagedCount > insuredCount) {
      throw new Error(
        `the policy covers ${insuredCount} ${type} item(s) but ${damagedCount} damage(s) were reported`,
      );
    }
  }
}

export function processClaim(
  policy: Policy,
  incident: IncidentInput,
): { payout: number; remainingCap: number } {
  assertAdmissibleClaim(policy, incident);
  const twentieths = incident.damages.reduce(
    (sum, damage) => sum + payoutTwentieths(policy, damage),
    0,
  );
  const payout = Math.min(roundPayoutDown(twentieths), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
