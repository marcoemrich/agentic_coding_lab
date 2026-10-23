import type { QuoteItem } from "./premium.js";

export interface Damage {
  itemType: string;
  amount: number;
}

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT = 0.5;

function isReimbursedAtHalf(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT;
}

function reimbursedAmount(item: QuoteItem, damage: Damage): number {
  return isReimbursedAtHalf(item) ? damage.amount * HALF_REIMBURSEMENT : damage.amount;
}

export function payoutForDamage(item: QuoteItem, damage: Damage): number {
  return Math.max(0, reimbursedAmount(item, damage) - DEDUCTIBLE);
}
