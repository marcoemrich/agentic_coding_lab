import type { Item } from "./claimOffice.js";

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;
const FULL_REIMBURSEMENT_SHARE = 1;

function fallsUnderHighEnchantmentClause(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;
}

function reimbursementShare(item: Item): number {
  return fallsUnderHighEnchantmentClause(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE
    : FULL_REIMBURSEMENT_SHARE;
}

export function damagePayout(item: Item, damageAmount: number): number {
  return Math.max(0, damageAmount * reimbursementShare(item) - DEDUCTIBLE);
}
