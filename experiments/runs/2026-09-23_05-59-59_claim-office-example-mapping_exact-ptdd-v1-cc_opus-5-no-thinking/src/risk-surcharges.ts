import type { Item } from "./item.js";

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

export function riskSurchargeRate(item: Item): number {
  let rate = 0;
  if (isCursed(item)) {
    rate += CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
}
