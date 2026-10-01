import type { QuoteItem } from "./item.js";

const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

function isCoveredByHighEnchantmentClause(damagedItem: QuoteItem): boolean {
  return (damagedItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD;
}

export function reimbursementRateOf(damagedItem: QuoteItem): number {
  return isCoveredByHighEnchantmentClause(damagedItem)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}
