import { basePremiumOf, type Item } from "./price-list.js";

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

export function riskSurchargeFor(item: Item): number {
  const basePremium = basePremiumOf(item);
  const curse = isCursed(item) ? basePremium * CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item)
    ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + enchantment;
}
