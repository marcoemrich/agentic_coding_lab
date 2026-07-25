import { insuranceSum } from "./items.js";
import { countByType } from "./collections.js";

export interface PolicyItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const FULL_REIMBURSEMENT_RATE = 1;
const CAP_MULTIPLIER = 2;

const reimbursementRate = (item: PolicyItem): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
};

const assertDamagesAreInsured = (policyItems: PolicyItem[], damages: Damage[]): void => {
  const insuredCountByType = countByType(policyItems, (item) => item.type);
  const damagedCountByType = countByType(damages, (damage) => damage.itemType);
  for (const [type, damagedCount] of damagedCountByType) {
    if (damagedCount > (insuredCountByType.get(type) ?? 0)) {
      throw new Error(`Claim references more '${type}' damages than insured on the policy`);
    }
  }
};

const assertDamageAmountsAreValid = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
};

const payoutForDamage = (policyItems: PolicyItem[], damage: Damage): number => {
  const insuredItem = policyItems.find((item) => item.type === damage.itemType)!;
  const rate = reimbursementRate(insuredItem);
  return damage.amount * rate - DEDUCTIBLE;
};

// Fractional payouts (e.g. from the 50% high-enchantment rate) are rounded
// down rather than up, so any fractional gold works in the MHPCO's favor.
const roundDownInMHPCOsFavor = (amount: number): number => Math.floor(amount);

const applyCap = (desiredPayout: number, cap: number, capUsedSoFar: number): ClaimResult => {
  const capRemainingBefore = cap - capUsedSoFar;
  const payout = roundDownInMHPCOsFavor(Math.min(desiredPayout, capRemainingBefore));
  const remainingCap = capRemainingBefore - payout;
  return { payout, remainingCap };
};

export const computeClaim = (
  policyItems: PolicyItem[],
  damages: Damage[],
  capUsedSoFar: number
): ClaimResult => {
  assertDamagesAreInsured(policyItems, damages);
  assertDamageAmountsAreValid(damages);
  const desiredPayout = damages.reduce(
    (sum, damage) => sum + payoutForDamage(policyItems, damage),
    0
  );
  const cap = insuranceSum(policyItems) * CAP_MULTIPLIER;
  return applyCap(desiredPayout, cap, capUsedSoFar);
};
