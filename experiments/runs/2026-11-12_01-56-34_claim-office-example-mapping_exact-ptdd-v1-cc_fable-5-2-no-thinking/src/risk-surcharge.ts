import { percentOf, total } from "./amounts.js";
import { itemBasePremium, type Item } from "./price-list.js";

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargePercent(item: Item): number {
  const cursePercent = isCursed(item) ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

export function riskSurcharge(items: Item[]): number {
  return total(
    items.map((item) => percentOf(itemBasePremium(item, items), riskSurchargePercent(item))),
  );
}
