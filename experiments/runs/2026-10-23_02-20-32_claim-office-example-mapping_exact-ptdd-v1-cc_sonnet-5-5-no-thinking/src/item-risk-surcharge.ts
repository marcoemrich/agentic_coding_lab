import type { Item } from "./item.js";
import { MAIN_ITEM_PRICES } from "./price-list.js";

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargePercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + enchantment;
}

export function riskSurchargeInHundredths(item: Item): number {
  return (MAIN_ITEM_PRICES[item.type]?.basePremium ?? 0) * riskSurchargePercent(item);
}
