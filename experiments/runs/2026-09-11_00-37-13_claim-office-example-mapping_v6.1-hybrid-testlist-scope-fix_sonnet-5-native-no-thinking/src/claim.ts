import type { Item } from "./premium.js";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;

const itemInsuranceValue = (item: Item): number =>
  INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

export interface Damage {
  itemType: string;
  amount: number;
}

export interface PayoutResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursementAmount = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damageAmount;
};

const consumeMatchingItem = (availableItems: Item[], itemType: string): Item => {
  const index = availableItems.findIndex((item) => item.type === itemType);
  if (index === -1) {
    throw new Error(
      `Damage references item type "${itemType}" not covered by the policy`,
    );
  }
  const [item] = availableItems.splice(index, 1);
  return item;
};

export const calculatePayout = (
  policyItems: Item[],
  damages: Damage[],
  capRemaining: number = insuranceSum(policyItems) * CAP_MULTIPLIER,
): PayoutResult => {
  const availableItems = [...policyItems];
  const payout = damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
    const item = consumeMatchingItem(availableItems, damage.itemType);
    return sum + reimbursementAmount(item, damage.amount) - DEDUCTIBLE;
  }, 0);
  const cappedPayout = Math.floor(Math.min(payout, capRemaining));
  return { payout: cappedPayout, remainingCap: capRemaining - cappedPayout };
};
