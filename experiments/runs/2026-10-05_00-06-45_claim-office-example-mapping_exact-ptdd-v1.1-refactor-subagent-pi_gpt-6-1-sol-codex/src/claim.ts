import type { Item } from './item.js';
const DEDUCTIBLE = 100;
const LIMITED_ENCHANTMENT = 8;
const LIMITED_REIMBURSEMENT = 0.5;

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= LIMITED_ENCHANTMENT ? LIMITED_REIMBURSEMENT : 1;
}

function afterDamageDeductible(reimbursement: number): number {
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function assertNonnegativeDamageAmount(amount: number): void {
  if (amount < 0) throw new Error('Damage amount must not be negative');
}

function damagePayout(item: Item, amount: number): number {
  return afterDamageDeductible(amount * reimbursementRate(item));
}

function takeInsuredOccurrence(availableItems: Item[], itemType: string): Item {
  const index = availableItems.findIndex(item => item.type === itemType);
  if (index < 0) throw new Error(`No insured occurrence for ${itemType}`);
  const [item] = availableItems.splice(index, 1);
  return item;
}

function finalPayout(unroundedPayout: number): number {
  return Math.floor(unroundedPayout);
}

export function claimPayout(items: Item[], damages: { itemType: string; amount: number }[]): number {
  const availableItems = [...items];
  const unroundedPayout = damages.reduce((sum, damage) => {
    const item = takeInsuredOccurrence(availableItems, damage.itemType);
    assertNonnegativeDamageAmount(damage.amount);
    return sum + damagePayout(item, damage.amount);
  }, 0);
  return finalPayout(unroundedPayout);
}
