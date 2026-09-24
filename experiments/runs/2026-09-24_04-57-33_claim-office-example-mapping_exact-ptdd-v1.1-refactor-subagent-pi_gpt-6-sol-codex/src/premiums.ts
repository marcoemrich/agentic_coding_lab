import { itemPrice, type Item } from './item-prices.js';
const COMPONENT_TYPES = ['rune', 'moonstone'];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const PREMIUM_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const FEE = 5;

function basePremium(items: Item[]): number {
  const ordinary = items.reduce((sum, item) => sum + itemPrice(item).base, 0);
  const blocks = COMPONENT_TYPES.filter(type => items.filter(item => item.type === type).length === BLOCK_SIZE).length;
  return ordinary - blocks * (BLOCK_SIZE * itemPrice({ type: 'rune' }).base - BLOCK_PREMIUM);
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const base = itemPrice(item).base;
    const curse = item.cursed ? CURSE_RATE * base : 0;
    const enchantment = (item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_RATE * base : 0;
    return sum + curse + enchantment;
  }, 0);
}

export function quotePremium(items: Item[], yearsWithMHPCO: number, previousQuotes: number): number {
  const base = basePremium(items);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_RATE * base : 0;
  const followUp = previousQuotes > 0 ? FOLLOW_UP_RATE * base : 0;
  return Math.ceil(base + itemRiskSurcharges(items) + INITIAL_RATE * base - loyalty - followUp + FEE);
}


