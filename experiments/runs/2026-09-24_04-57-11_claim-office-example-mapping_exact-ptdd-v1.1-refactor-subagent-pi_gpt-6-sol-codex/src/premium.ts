import { type Item, price } from './catalogue.js';

export const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

function basePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  const blocks = ['rune', 'moonstone'].reduce((total, type) =>
    total + (counts.get(type) === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_SIZE * price(type).premium - COMPONENT_BLOCK_BASE_PREMIUM : 0), 0);
  return items.reduce((sum, item) => sum + price(item.type).premium, 0) - blocks;
}

export function premium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const base = basePremium(items);
  const itemRisk = items.reduce((sum, item) => {
    const individualBase = price(item.type).premium;
    return sum + (item.cursed ? individualBase * CURSE_SURCHARGE_RATE : 0) +
      ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? individualBase * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);
  }, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(base + itemRisk + base * FIRST_INSURANCE_SURCHARGE_RATE - loyalty - followUp + PROCESSING_FEE);
}
