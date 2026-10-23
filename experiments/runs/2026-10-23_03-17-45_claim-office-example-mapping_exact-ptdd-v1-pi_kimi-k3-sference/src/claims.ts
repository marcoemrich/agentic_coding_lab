import type { Item } from "./premium.js";
import { isComponent } from "./catalogue.js";

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_NUMERATOR = 1;
const HIGH_ENCHANTMENT_REIMBURSEMENT_DENOMINATOR = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += isComponent(item.type)
      ? COMPONENT_INSURANCE_VALUE
      : INSURANCE_VALUES[item.type];
  }
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM,
  };
}

function reimburseDamage(item: Item, amount: number): number {
  let reimbursement = amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD) {
    reimbursement =
      (reimbursement * HIGH_ENCHANTMENT_REIMBURSEMENT_NUMERATOR) /
      HIGH_ENCHANTMENT_REIMBURSEMENT_DENOMINATOR;
  }
  return reimbursement - DEDUCTIBLE_PER_DAMAGE;
}

export function processClaim(policy: Policy, damages: Damage[]): number {
  let payout = 0;
  const unmatched = [...policy.items];
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const matchIndex = unmatched.findIndex(
      (insured) => insured.type === damage.itemType,
    );
    if (matchIndex === -1) {
      throw new Error(
        `damaged item is not part of the policy: ${damage.itemType}`,
      );
    }
    const [item] = unmatched.splice(matchIndex, 1);
    payout += reimburseDamage(item, damage.amount);
  }
  const paid = Math.floor(Math.min(payout, policy.remainingCap));
  policy.remainingCap -= paid;
  return paid;
}
