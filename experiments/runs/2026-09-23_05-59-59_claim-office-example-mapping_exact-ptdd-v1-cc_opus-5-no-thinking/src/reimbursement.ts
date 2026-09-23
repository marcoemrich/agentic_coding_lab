import type { Item } from "./item.js";

const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

export function reimbursementRate(item: Item): number {
  if (isHighlyEnchanted(item)) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
}
