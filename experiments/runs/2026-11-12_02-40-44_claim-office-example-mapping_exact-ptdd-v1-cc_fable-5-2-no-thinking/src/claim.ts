import { percentOf } from "./percent.js";
import type { Policy } from "./policy.js";
import type { Item } from "./price-list.js";
import { roundPayoutInMHPCOsFavor } from "./rounding.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Settlement {
  payout: number;
  remainingCap: number;
}

function rejectNegativeDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
}

interface CoveredDamage {
  damage: Damage;
  item: Item;
}

function coveredDamages(policy: Policy, damages: Damage[]): CoveredDamage[] {
  const unclaimedItems = [...policy.items];
  return damages.map((damage) => {
    const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return { damage, item: unclaimedItems.splice(index, 1)[0] };
  });
}

const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

function reimbursement({ damage, item }: CoveredDamage): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT
    ? percentOf(damage.amount, REDUCED_REIMBURSEMENT_PERCENT)
    : damage.amount;
}

const DEDUCTIBLE = 100;

function damagePayout(coveredDamage: CoveredDamage): number {
  return Math.max(0, reimbursement(coveredDamage) - DEDUCTIBLE);
}

function desiredPayout(damages: CoveredDamage[]): number {
  return roundPayoutInMHPCOsFavor(damages.reduce((sum, coveredDamage) => sum + damagePayout(coveredDamage), 0));
}

export function settleClaim(policy: Policy, damages: Damage[]): Settlement {
  rejectNegativeDamageAmounts(damages);
  const payout = Math.min(desiredPayout(coveredDamages(policy, damages)), policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}
