import { QuoteItem, countByType } from "./quote.js";
import { avoidFloatNoise } from "./rounding.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

// Names the domain rule that a policy's cap is twice the unmodified
// insurance value of its items -- unaffected by premium modifiers or
// block discounts, which only ever change the premium, not the
// insurance sum.
const insuranceSumOf = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

export const capFor = (items: QuoteItem[]): number =>
  insuranceSumOf(items) * CAP_MULTIPLIER;

// Names the single arithmetic step the claim payout depends on today,
// mirroring the small-named-helper style used throughout quote.ts.
const applyDeductible = (amount: number): number => amount - DEDUCTIBLE;

const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const findPolicyItem = (
  policyItems: QuoteItem[],
  itemType: string
): QuoteItem | undefined =>
  policyItems.find((item) => item.type === itemType);

const reimbursementRateFor = (item: QuoteItem | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutFor = (policyItems: QuoteItem[], damage: Damage): number => {
  const item = findPolicyItem(policyItems, damage.itemType);
  const rate = reimbursementRateFor(item);
  const reimbursedAmount = damage.amount * rate;
  return applyDeductible(reimbursedAmount);
};

const sumDeductedPayouts = (
  policyItems: QuoteItem[],
  damages: Damage[]
): number =>
  damages.reduce((sum, damage) => sum + payoutFor(policyItems, damage), 0);

// A damage amount is meaningless below zero regardless of what the
// policy covers -- this is a data-integrity check, not a policy rule.
const validateNoNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

// The policy rule: a claim can't reference more damaged items of a
// given type than the policy actually insures.
const validateDamageCountsFitPolicy = (
  policyItems: QuoteItem[],
  damages: Damage[]
): void => {
  const insuredCounts = countByType(policyItems);
  const damageCounts = countByType(
    damages.map((damage) => ({ type: damage.itemType }))
  );
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[itemType] ?? 0)) {
      throw new Error(
        `More damage entries for '${itemType}' than the policy covers`
      );
    }
  }
};

const validateDamages = (
  policyItems: QuoteItem[],
  damages: Damage[]
): void => {
  validateNoNegativeDamageAmounts(damages);
  validateDamageCountsFitPolicy(policyItems, damages);
};

// Names the domain rule that a claim's payout can never exceed what's
// left of the policy's insurance cap, mirroring the small-named-helper
// style used for applyDeductible above.
const capPayoutAtRemainingLimit = (
  desiredPayout: number,
  remainingCap: number
): number => Math.min(desiredPayout, remainingCap);

const roundDownInInsurersFavor = (amount: number): number =>
  Math.floor(avoidFloatNoise(amount));

export const computeClaim = (
  policyItems: QuoteItem[],
  damages: Damage[],
  remainingCap: number
): ClaimResult => {
  validateDamages(policyItems, damages);
  const desiredPayout = sumDeductedPayouts(policyItems, damages);
  const payout = roundDownInInsurersFavor(
    capPayoutAtRemainingLimit(desiredPayout, remainingCap)
  );
  return { payout, remainingCap: remainingCap - payout };
};
