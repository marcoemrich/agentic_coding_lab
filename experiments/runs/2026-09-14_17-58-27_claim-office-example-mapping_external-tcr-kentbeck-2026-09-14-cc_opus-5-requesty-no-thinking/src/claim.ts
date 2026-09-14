import { Item } from './premium.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export function damagePayout(item: Item, amount: number): number {
  let reimbursed = amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    reimbursed = amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return Math.max(0, reimbursed - DEDUCTIBLE);
}
