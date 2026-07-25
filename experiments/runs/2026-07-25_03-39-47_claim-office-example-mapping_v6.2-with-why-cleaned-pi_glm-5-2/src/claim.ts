import { insuranceSum, type Item } from "./quote.js";

export type Damage = { itemType: string; amount: number };

export type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

export type ClaimResult = { payout: number; remainingCap: number };

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_RATE = 0.5;
const STANDARD_RATE = 1;

const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_RATE
    : STANDARD_RATE;

const findItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType) as Item;

const reimbursementFor = (policy: Policy, damage: Damage): number => {
  const item = findItem(policy, damage.itemType);
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
};

export const createPolicy = (items: readonly Item[]): Policy => {
  const sum = insuranceSum(items);
  return { items: [...items], insuranceSum: sum, remainingCap: sum * CAP_MULTIPLIER };
};

export const processClaim = (
  policy: Policy,
  damages: readonly Damage[]
): ClaimResult => {
  const totalReimbursement = damages.reduce(
    (sum, damage) => sum + reimbursementFor(policy, damage),
    0
  );
  const payout = Math.floor(Math.min(totalReimbursement, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
};
