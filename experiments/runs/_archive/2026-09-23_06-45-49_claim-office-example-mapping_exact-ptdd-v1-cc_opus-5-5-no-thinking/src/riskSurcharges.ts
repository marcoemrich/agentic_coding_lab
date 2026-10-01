import { isComponent, mainItemBasePremium, type Item } from "./catalogue.js";
import { percentOf } from "./percent.js";

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargePercent(item: Item): number {
  const cursePercent = item.cursed === true ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

export function riskSurcharges(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + percentOf(mainItemBasePremium(item), itemSurchargePercent(item)), 0);
}
