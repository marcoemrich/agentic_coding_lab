import { type ItemType, insuranceValueOf, type QuoteStep } from "./premium.ts";

/** Deductible withheld per damage event, in whole G. */
const DEDUCTIBLE_G = 100;

/** Damage to highly enchanted items is reimbursed at this share of the damage amount. */
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/** Items count as highly enchanted for claims from this level onwards. */
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;

/** The payout cap is a multiple of the policy's insurance sum. */
const CAP_MULTIPLE = 2;

/** A claim step from the scenario, as the CLI schema defines it. */
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

/** Narrows a scenario step to a claim step. */
export function isClaimStep(step: { op: string }): step is ClaimStep {
  return step.op === "claim";
}

/** An insured policy, as a claim refers to it. */
export interface Policy {
  items: QuoteStep["items"];
}

/** A damage entry, as the CLI schema defines it. */
interface Damage {
  itemType: string;
  amount: number;
}

/** The covered item a damage entry refers to. */
function coveredItemFor(damage: Damage, policy: Policy): QuoteStep["items"][number] | undefined {
  return policy.items.find((item) => item.type === damage.itemType);
}

/**
 * Reimbursement for one damage event, before the deductible:
 * highly enchanted items (enchantment level >= 8) at 50% of the
 * damage amount, otherwise the full damage amount.
 */
function reimbursementFor(damage: Damage, policy: Policy): number {
  const covered = coveredItemFor(damage, policy);
  if ((covered?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return damage.amount;
}

/** Payout for one damage event: reimbursement minus the deductible. */
function payoutFor(damage: Damage, policy: Policy): number {
  return reimbursementFor(damage, policy) - DEDUCTIBLE_G;
}

/** Maximum total payout per policy: twice the unmodified insurance sum. */
export function newPolicyCap(policy: Policy): number {
  const insuranceSumG = policy.items.reduce(
    (sum, item) => sum + insuranceValueOf(item.type as ItemType),
    0,
  );
  return insuranceSumG * CAP_MULTIPLE;
}

/**
 * Settles a claim against a policy: each damage entry is reimbursed
 * per the claim rules and the total is capped by the policy's
 * remaining cap (twice the unmodified insurance sum). Returns the
 * payout and the cap remaining after this claim.
 */
export function settleClaim(
  claim: ClaimStep,
  policy: Policy,
  remainingCapG: number,
): { payout: number; remainingCap: number } {
  const desiredPayoutG = claim.incident.damages.reduce(
    (sum, damage) => sum + payoutFor(damage, policy),
    0,
  );
  // Only the final payout is rounded, in the MHPCO's favor (down).
  const payoutG = Math.floor(Math.min(desiredPayoutG, remainingCapG));
  return { payout: payoutG, remainingCap: remainingCapG - payoutG };
}
