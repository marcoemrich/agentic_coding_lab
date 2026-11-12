import type { Item } from "./item.js";
import { percentOf } from "./percent.js";

const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const DEDUCTIBLE = 100;

export function damagePayout(damagedItem: Item, damageAmount: number): number {
  return afterDeductible(reimbursementOf(damagedItem, damageAmount));
}

// Dragon material is "fully reimbursed", which is also the standard reimbursement, and the
// enchantment clause wins when both apply — so the material needs no rule of its own here.
function reimbursementOf(damagedItem: Item, damageAmount: number): number {
  const isReducedByEnchantment = (damagedItem.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL;
  return isReducedByEnchantment ? percentOf(damageAmount, REDUCED_REIMBURSEMENT_PERCENT) : damageAmount;
}

function afterDeductible(reimbursement: number): number {
  return Math.max(0, reimbursement - DEDUCTIBLE);
}
