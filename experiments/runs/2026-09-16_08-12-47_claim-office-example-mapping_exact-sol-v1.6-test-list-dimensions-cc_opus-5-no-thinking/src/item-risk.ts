import { basePremiumOf } from "./price-list.js";
import type { Item } from "./item.js";

/** Item-specific risk surcharges, charged on the base premium of the affected item. */
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const PERCENT = 100;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function surchargePercentFor(item: Item): number {
  const cursePercent = isCursed(item) ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

export function riskSurchargeInG(item: Item): number {
  return (basePremiumOf(item.type) * surchargePercentFor(item)) / PERCENT;
}
