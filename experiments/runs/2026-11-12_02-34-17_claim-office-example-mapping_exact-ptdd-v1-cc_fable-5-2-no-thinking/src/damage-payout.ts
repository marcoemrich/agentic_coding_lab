import type { Item } from "./item.js";
import { percentOf } from "./percent.js";

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

function fallsUnderHighEnchantmentClause(damagedItem: Item): boolean {
  return (damagedItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;
}

// The dragon-material clause promises full reimbursement, which is also the
// standard, and the high-enchantment clause wins over it. So the
// high-enchantment clause is the only one that changes the reimbursed amount.
function reimbursement(damagedItem: Item, amount: number): number {
  return fallsUnderHighEnchantmentClause(damagedItem)
    ? percentOf(amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : amount;
}

export function damagePayout(damagedItem: Item, amount: number): number {
  return Math.max(0, reimbursement(damagedItem, amount) - DEDUCTIBLE);
}
