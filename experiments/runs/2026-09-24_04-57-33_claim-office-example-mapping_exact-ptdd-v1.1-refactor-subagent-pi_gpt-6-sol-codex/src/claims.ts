import type { Item } from './item-prices.js';

export type Damage = { itemType: string; amount: number };

const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

function reimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function desiredReimbursement(items: Item[], damages: Damage[]): number {
  const available = [...items];
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount must not be negative');
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage to uninsured item type: ${damage.itemType}`);
    const [insured] = available.splice(index, 1);
    return sum + reimbursement(insured, damage.amount);
  }, 0);
}

export function claimPayout(items: Item[], damages: Damage[], remainingCap: number): number {
  return Math.min(remainingCap, Math.floor(desiredReimbursement(items, damages)));
}
