import type { Item } from "./item.js";
import { insuranceSum } from "./priceList.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: CAP_FACTOR * insuranceSum(items) };
}

function reimbursedShare(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : 1;
}

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeDamagedItem(undamagedItems: Item[], damage: Damage): Item {
  const index = undamagedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index < 0) {
    throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
  }
  return undamagedItems.splice(index, 1)[0];
}

function coveredDamages(policy: Policy, damages: Damage[]): { item: Item; amount: number }[] {
  const undamagedItems = [...policy.items];
  return damages.map((damage) => {
    rejectNegativeAmount(damage);
    return { item: takeDamagedItem(undamagedItems, damage), amount: damage.amount };
  });
}

function reimbursement(item: Item, amount: number): number {
  return amount * reimbursedShare(item) - DEDUCTIBLE;
}

function roundPayoutInMhpcoFavor(amount: number): number {
  return Math.floor(amount);
}

function assessedPayout(policy: Policy, damages: Damage[]): number {
  const total = coveredDamages(policy, damages).reduce((sum, { item, amount }) => sum + reimbursement(item, amount), 0);
  return roundPayoutInMhpcoFavor(total);
}

export function settleClaim(policy: Policy, damages: Damage[]): number {
  const payout = Math.min(assessedPayout(policy, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return payout;
}
