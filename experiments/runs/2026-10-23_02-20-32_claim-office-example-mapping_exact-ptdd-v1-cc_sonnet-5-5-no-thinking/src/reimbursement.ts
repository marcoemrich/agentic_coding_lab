import type { Item } from "./item.js";

const HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const PERCENT = 100;

export function reimbursedAmount(damageAmount: number, insuredItem: Item | undefined): number {
  const highlyEnchanted =
    (insuredItem?.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL;
  return highlyEnchanted
    ? (damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT) / PERCENT
    : damageAmount;
}
