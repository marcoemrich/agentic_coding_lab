import { COMPONENT_BLOCK_PREMIUM, COMPONENT_BLOCK_SIZE, Item, priceOf } from './items';

export interface CustomerHistory {
  yearsWithMHPCO: number;
  previousContracts: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

export function basePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    const price = priceOf(item.type);
    if (price.component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += price.basePremium;
    }
  }
  for (const [type, count] of componentCounts) {
    total += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * priceOf(type).basePremium;
  }
  return total;
}

function itemSurcharges(item: Item): number {
  const itemBase = priceOf(item.type).basePremium;
  let surcharge = 0;
  if (item.cursed) surcharge += itemBase * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) surcharge += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
  return surcharge;
}

export function quotePremium(items: Item[], customer: CustomerHistory): number {
  const policyBase = basePremium(items);
  let premium = policyBase + items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) premium -= policyBase * LOYALTY_DISCOUNT;
  premium += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (customer.previousContracts > 0) premium -= policyBase * FOLLOW_UP_DISCOUNT;
  return Math.ceil(premium + PROCESSING_FEE);
}
