import type { Item } from "./magicalItem.js";

export type Damage = { itemType: string; amount: number };

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;
const FULL_REIMBURSEMENT_SHARE = 1;

function fallsUnderHighEnchantmentClause(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;
}

function reimbursementShare(item: Item): number {
  return fallsUnderHighEnchantmentClause(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : FULL_REIMBURSEMENT_SHARE;
}

export function damageEventPayout(damage: Damage, damagedItem: Item): number {
  return damage.amount * reimbursementShare(damagedItem) - DEDUCTIBLE;
}
