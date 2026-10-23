import { priceListEntryOf } from "./price-list.js";
import type { Item } from "./quote.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATIO = 0.5;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATIO
    : damage.amount;

const insuranceSumOf = (items: Item[]): number => items.reduce((sum, item) => sum + priceListEntryOf(item.type).insuranceValue, 0);

const damagePayout = (item: Item, damage: Damage): number =>
  Math.max(reimbursableAmount(damage, item) - DEDUCTIBLE, 0);

const insuredItemFor = (policyItems: Item[], damages: Damage[], index: number): Item => {
  const { itemType } = damages[index];
  const earlierDamages = damages.slice(0, index).filter((damage) => damage.itemType === itemType).length;
  const insuredItem = policyItems.filter((item) => item.type === itemType)[earlierDamages];
  if (insuredItem === undefined) {
    throw new Error(`No insured ${itemType} left for damage ${index}`);
  }
  return insuredItem;
};

export const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumOf(items) * CAP_MULTIPLIER,
});

const assertNonNegative = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
};

export const processClaim = (policy: Policy, damages: Damage[]): ClaimOutcome => {
  damages.forEach(assertNonNegative);
  const requested = damages.reduce(
    (sum, damage, index) => sum + damagePayout(insuredItemFor(policy.items, damages, index), damage),
    0,
  );
  const payout = Math.floor(Math.min(requested, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};
