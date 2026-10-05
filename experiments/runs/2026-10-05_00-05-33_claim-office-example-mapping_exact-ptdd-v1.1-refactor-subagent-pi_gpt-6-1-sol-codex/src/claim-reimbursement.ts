import type { Item } from './item.js';
import { consumeNextInsuredOccurrence } from './insured-occurrence.js';

export interface Damage { itemType: string; amount: number }

const CLAIM_ENCHANTMENT = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
function reimbursementForDamage(item: Item, damageAmount: number): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? damageAmount * ENCHANTED_REIMBURSEMENT : damageAmount;
}

const DEDUCTIBLE = 100;
function payoutAfterDeductible(reimbursement: number): number {
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function requireNonNegativeDamageAmount(damageAmount: number): void {
  if (damageAmount < 0) throw new Error('Damage amount must not be negative');
}

export function payoutForDamage(item: Item, damageAmount: number): number {
  requireNonNegativeDamageAmount(damageAmount);
  return payoutAfterDeductible(reimbursementForDamage(item, damageAmount));
}

export function payoutForIncident(insuredItems: readonly Item[], damages: readonly Damage[]): number {
  const available = [...insuredItems];
  return damages.reduce((sum, damage) => {
    const item = consumeNextInsuredOccurrence(available, damage.itemType);
    return sum + payoutForDamage(item, damage.amount);
  }, 0);
}
