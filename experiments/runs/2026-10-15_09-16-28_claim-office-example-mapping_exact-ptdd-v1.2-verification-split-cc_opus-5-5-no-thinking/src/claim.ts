import { percentOf } from "./percent.js";
import { type Item, isComponent, mainItemPrices } from "./items.js";

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;
const COMPONENT_INSURANCE_VALUE = 250;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const insuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : mainItemPrices(item).insuranceValue;

const insuranceSum = (items: Item[]): number => items.reduce((sum, item) => sum + insuranceValue(item), 0);

const fallsUnderHighEnchantmentClause = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;

function reimbursementPercent(damagedItem: Item): number {
  return fallsUnderHighEnchantmentClause(damagedItem) ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT : FULL_REIMBURSEMENT_PERCENT;
}

function coveredItemsFor(damages: Damage[], insuredItems: Item[]): Item[] {
  const unmatchedInsuredItems = [...insuredItems];
  return damages.map((damage) => {
    const index = unmatchedInsuredItems.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return unmatchedInsuredItems.splice(index, 1)[0];
  });
}

const damagePayout = (damage: Damage, damagedItem: Item): number =>
  percentOf(damage.amount, reimbursementPercent(damagedItem)) - DEDUCTIBLE_PER_DAMAGE;

const roundPayoutInMHPCOFavor = Math.floor;

export interface Policy {
  insuredItems: Item[];
  remainingCap: number;
}

export const openPolicy = (insuredItems: Item[]): Policy => ({
  insuredItems,
  remainingCap: CAP_MULTIPLIER * insuranceSum(insuredItems),
});

function rejectNegativeDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount must not be negative");
  }
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  rejectNegativeDamageAmounts(damages);
  const damagedItems = coveredItemsFor(damages, policy.insuredItems);
  const desiredPayout = damages.reduce((sum, damage, index) => sum + damagePayout(damage, damagedItems[index]), 0);
  const payout = roundPayoutInMHPCOFavor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
