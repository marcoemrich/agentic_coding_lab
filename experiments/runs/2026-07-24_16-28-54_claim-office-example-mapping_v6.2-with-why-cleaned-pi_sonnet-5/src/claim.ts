import type { Item, Damage, ClaimResult } from "./types.js";
import { correctFloatingPointError } from "./rounding.js";

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

// Rounds down to the nearest whole gold piece, in the MHPCO's favor for
// payouts (the opposite direction from premium rounding in quote.ts).
const roundDownToNearestGold = (amount: number): number =>
  Math.floor(correctFloatingPointError(amount));

const findPolicyItem = (policyItems: Item[], itemType: string): Item | undefined =>
  policyItems.find((item) => item.type === itemType);

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

// Named to match the domain language used in the policy spec ("insurance
// sum" vs. "cap"), mirroring how quote.ts separates sumBasePremiums from
// the surcharges/discounts applied on top of it.
const computeInsuranceSum = (policyItems: Item[]): number =>
  policyItems.reduce((sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type], 0);

export const computeInsuranceCap = (policyItems: Item[]): number =>
  computeInsuranceSum(policyItems) * CAP_MULTIPLIER;

// Split from the policy-coverage check below: a negative amount is an
// invalid claim regardless of what the policy covers, so it doesn't
// belong under a name that says "against policy".
const validateDamageAmountsAreNonNegative = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const validateDamagesAgainstPolicy = (policyItems: Item[], damages: Damage[]): void => {
  const remainingByType = new Map<string, number>();
  for (const item of policyItems) {
    remainingByType.set(item.type, (remainingByType.get(item.type) ?? 0) + 1);
  }
  for (const damage of damages) {
    const remaining = remainingByType.get(damage.itemType) ?? 0;
    if (remaining <= 0) {
      throw new Error(`Damage references item type "${damage.itemType}" not covered by the policy`);
    }
    remainingByType.set(damage.itemType, remaining - 1);
  }
};

const computeReimbursement = (enchantment: number | undefined, amount: number): number => {
  if ((enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
};

const computeDamagePayout = (policyItems: Item[], damage: Damage): number => {
  const item = findPolicyItem(policyItems, damage.itemType);
  const reimbursed = computeReimbursement(item?.enchantment, damage.amount);
  return reimbursed - DEDUCTIBLE;
};

// Named and extracted to mirror computeInsuranceSum's shape (reduce over
// policy items to a single total), keeping computeClaim itself a plain
// sequence of named steps rather than mixing an inline reduce with the
// cap-clamping logic.
const computeDesiredPayout = (policyItems: Item[], damages: Damage[]): number =>
  damages.reduce((sum, damage) => sum + computeDamagePayout(policyItems, damage), 0);

export const computeClaim = (
  policyItems: Item[],
  damages: Damage[],
  currentRemainingCap: number
): ClaimResult => {
  validateDamageAmountsAreNonNegative(damages);
  validateDamagesAgainstPolicy(policyItems, damages);
  const desiredPayout = computeDesiredPayout(policyItems, damages);
  const payout = roundDownToNearestGold(Math.min(desiredPayout, currentRemainingCap));
  return { payout, remainingCap: currentRemainingCap - payout };
};
