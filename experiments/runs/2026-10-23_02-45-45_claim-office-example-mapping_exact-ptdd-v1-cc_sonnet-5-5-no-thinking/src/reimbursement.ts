import type { DamagedItem } from "./damaged-items.js";
import type { Item } from "./premium.js";
import { PERCENT, roundDownToWholeG } from "./rounding.js";

const DEDUCTIBLE = 100;
const FULL_REIMBURSEMENT_PERCENT = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;

function reimbursementPercent(item: Item): number {
  return (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    : FULL_REIMBURSEMENT_PERCENT;
}

// Exact payout scaled by PERCENT, so fractions of G stay exact until the final rounding.
function scaledPayoutForDamage({ damage, item }: DamagedItem): number {
  return Math.max(damage.amount * reimbursementPercent(item) - DEDUCTIBLE * PERCENT, 0);
}

export function reimbursementFor(damagedItems: DamagedItem[]): number {
  const scaledTotal = damagedItems.reduce((sum, damaged) => sum + scaledPayoutForDamage(damaged), 0);
  return roundDownToWholeG(scaledTotal);
}
