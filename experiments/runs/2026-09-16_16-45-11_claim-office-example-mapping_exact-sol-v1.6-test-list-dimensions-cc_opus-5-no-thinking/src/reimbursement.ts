import { type Item } from "./price-list.js";

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

/**
 * The share of a damage the MHPCO reimburses.
 *
 * Two special clauses exist. Damage to an item with enchantment level >= 8 is
 * reimbursed at 50 %. Damage to an item of dragon material is fully reimbursed
 * -- which is also the rate for an item under no special clause, so the clause
 * changes an outcome only where the high-enchantment clause would otherwise
 * reduce it, and there the high-enchantment clause wins. The dragon-material
 * clause therefore needs no branch of its own.
 */
function reimbursementRateFor(item: Item): number {
  return isHighlyEnchanted(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

/** The reimbursable share of a damage amount, before the deductible. */
export function reimbursableAmount(damageAmount: number, item: Item): number {
  return damageAmount * reimbursementRateFor(item);
}
