import type { Item } from './item.js';
const limitedEnchantment = 8;
const enchantedReimbursement = 0.5;
export function rawReimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= limitedEnchantment ? enchantedReimbursement : 1;
  return amount * rate;
}
