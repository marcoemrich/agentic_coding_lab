import { coveredItemsFor, type Damage } from "./policy.js";
import { type Item } from "./price-list.js";
import { type Quote } from "./quote.js";
import { reimbursableAmount } from "./reimbursement.js";
import { roundedPayout } from "./rounding.js";

export type { Damage };

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;

function reimbursementFor(damage: Damage, item: Item): number {
  const afterDeductible =
    reimbursableAmount(damage.amount, item) - DEDUCTIBLE_PER_DAMAGE;
  return Math.max(afterDeductible, 0);
}

function requireReportableAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
  }
}

/** What the incident is worth under the MHPCO's clauses and deductible. */
function assessedDamage(items: Item[], damages: Damage[]): number {
  damages.forEach(requireReportableAmount);
  const covered = coveredItemsFor(damages, items);
  return damages.reduce(
    (total, damage, index) => total + reimbursementFor(damage, covered[index]),
    0,
  );
}

export function claim(
  policy: Quote,
  items: Item[],
  damages: Damage[],
  capRemaining: number = policy.cap,
): ClaimResult {
  const payout = roundedPayout(
    Math.min(assessedDamage(items, damages), capRemaining),
  );
  return { payout, remainingCap: capRemaining - payout };
}
