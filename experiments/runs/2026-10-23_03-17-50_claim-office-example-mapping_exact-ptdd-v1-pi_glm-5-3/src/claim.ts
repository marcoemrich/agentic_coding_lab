import type { ClaimStep, DamageEntry, ItemSpec } from "./office.js";
import { RejectionError } from "./office.js";
import { insuranceValueOf, percentOf } from "./premium.js";

/** Deductible applied per damage event, in G. */
const DEDUCTIBLE_G = 100;

/** The total payout per policy is capped at twice the insurance sum. */
const CAP_MULTIPLE = 2;

export interface Policy {
  items: ItemSpec[];
  insuranceSum: number;
  remainingCap: number;
}

export function createPolicy(items: ItemSpec[]): Policy {
  const insuranceSum = items.reduce((total, itemSpec) => total + insuranceValueOf(itemSpec.type), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLE };
}

/** Damage to items with enchantment level >= 8 is reimbursed at 50 % of the damage amount. */
const HIGH_ENCHANTMENT_REIMBURSEMENT_PCT = 50;
const HIGH_ENCHANTMENT_DAMAGE_LEVEL = 8;

/** Find the policy item a damage entry refers to (first of its type). */
function insuredItemFor(policy: Policy, itemType: string): ItemSpec | undefined {
  return policy.items.find((itemSpec) => itemSpec.type === itemType);
}

/** Reimbursement for one damage entry before the deductible, in G. */
function reimbursementOf(policy: Policy, damage: DamageEntry): number {
  const insuredItem = insuredItemFor(policy, damage.itemType);
  if ((insuredItem?.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_LEVEL) {
    return percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PCT);
  }
  return damage.amount;
}

/** Every damage entry must refer to an item the policy actually covers,
 * and entries of a type must not exceed the insured count of that type. */
function assertDamageCovered(policy: Policy, damages: DamageEntry[]): void {
  const entriesPerType = new Map<string, number>();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new RejectionError("damage amounts must not be negative");
    }
    entriesPerType.set(damage.itemType, (entriesPerType.get(damage.itemType) ?? 0) + 1);
  }
  for (const [itemType, entryCount] of entriesPerType) {
    const insuredCount = policy.items.filter((itemSpec) => itemSpec.type === itemType).length;
    if (insuredCount === 0) {
      throw new RejectionError(`the policy does not cover '${itemType}'`);
    }
    if (entryCount > insuredCount) {
      throw new RejectionError(
        `the policy covers only ${insuredCount} '${itemType}' but the claim reports ${entryCount} damages`,
      );
    }
  }
}

/** Process a claim against a policy: per-damage reimbursement, deductible, cap. */
export function processClaim(policy: Policy, claim: ClaimStep): { payout: number; remainingCap: number } {
  assertDamageCovered(policy, claim.incident.damages);
  let payout = 0;
  for (const damage of claim.incident.damages) {
    payout += Math.max(reimbursementOf(policy, damage) - DEDUCTIBLE_G, 0);
  }
  const cappedPayout = Math.floor(Math.min(payout, policy.remainingCap));
  policy.remainingCap -= cappedPayout;
  return { payout: cappedPayout, remainingCap: policy.remainingCap };
}
