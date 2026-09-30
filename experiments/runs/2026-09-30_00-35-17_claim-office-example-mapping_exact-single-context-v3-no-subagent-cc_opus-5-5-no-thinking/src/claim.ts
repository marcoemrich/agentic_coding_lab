import { percentOf, roundPayout, sum } from "./amounts.js";
import { countOfType, enchantmentOf, type Item } from "./premium.js";

export type Damage = { itemType: string; amount: number };

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;

export const payoutCap = (insuranceSum: number): number => CAP_MULTIPLIER * insuranceSum;

// The high-enchantment clause wins over the dragon-material clause; dragon material
// otherwise means full reimbursement, which equals the standard reimbursement.
const reimbursementPercent = (item: Item): number =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    : FULL_REIMBURSEMENT_PERCENT;

// The deductible applies once per damaged item.
const damagePayout = (damage: Damage, item: Item): number =>
  percentOf(damage.amount, reimbursementPercent(item)) - DEDUCTIBLE;

// Only called after assertDamagesCovered, so a matching insured item always exists.
const insuredItemFor = (damage: Damage, policyItems: Item[]): Item =>
  policyItems.find((item) => item.type === damage.itemType) as Item;

const damagedCount = (damages: Damage[], type: string): number => damages.filter((d) => d.itemType === type).length;

// Each damage entry must correspond to its own insured item; otherwise the whole claim is rejected.
const assertDamagesCovered = (damages: Damage[], policyItems: Item[]): void => {
  const isOverClaimed = (damage: Damage) =>
    damagedCount(damages, damage.itemType) > countOfType(policyItems, damage.itemType);
  const uncovered = damages.find(isOverClaimed);
  if (uncovered) throw new Error(`Claim includes uninsured ${uncovered.itemType} damage`);
};

const assertValidAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Invalid damage amount: ${negative.amount}`);
};

export const claimPayout = (damages: Damage[], policyItems: Item[]): number => {
  assertValidAmounts(damages);
  assertDamagesCovered(damages, policyItems);
  return roundPayout(sum(damages.map((damage) => damagePayout(damage, insuredItemFor(damage, policyItems)))));
};
