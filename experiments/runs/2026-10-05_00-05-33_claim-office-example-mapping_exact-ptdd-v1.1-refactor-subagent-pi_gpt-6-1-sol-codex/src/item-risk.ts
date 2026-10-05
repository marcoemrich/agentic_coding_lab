import { basePremiumForItemType } from './price-list.js';
import type { Item } from './item.js';

export function riskSurchargesForItems(items: readonly Item[]) {
  const curse = items.reduce((sum, item) => sum + curseSurchargeForItem(item), 0);
  const enchantment = items.reduce((sum, item) => sum + enchantmentSurchargeForItem(item), 0);
  return { curse, enchantment };
}

const CURSE_SURCHARGE = 0.5;
export function curseSurchargeForItem(item: Item): number {
  return item.cursed ? basePremiumForItemType(item.type) * CURSE_SURCHARGE : 0;
}

const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
export function enchantmentSurchargeForItem(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? basePremiumForItemType(item.type) * ENCHANTMENT_SURCHARGE : 0;
}
