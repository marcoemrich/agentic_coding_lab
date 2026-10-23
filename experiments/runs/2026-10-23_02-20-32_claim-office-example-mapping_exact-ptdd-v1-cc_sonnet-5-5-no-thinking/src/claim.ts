import { insuranceSum, matchInsuredItems, type Damage } from "./coverage.js";
import type { Item } from "./item.js";
import { reimbursedAmount } from "./reimbursement.js";

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function damagePayout(damage: Damage, insuredItem: Item): number {
  return Math.max(0, reimbursedAmount(damage.amount, insuredItem) - DEDUCTIBLE);
}

function rejectNegativeAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
}

export function policyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

export function processClaim(
  items: Item[],
  damages: Damage[],
  availableCap: number,
): ClaimResult {
  rejectNegativeAmounts(damages);
  const insuredItems = matchInsuredItems(items, damages);
  const exactPayout = damages.reduce(
    (sum, damage, index) => sum + damagePayout(damage, insuredItems[index]),
    0,
  );
  const payout = Math.min(Math.floor(exactPayout), availableCap);
  return { payout, remainingCap: availableCap - payout };
}
