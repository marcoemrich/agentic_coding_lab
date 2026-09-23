import { COMPONENT_BLOCK_PREMIUM, COMPONENT_BLOCK_SIZE, Item, ROUNDING_EPSILON, lookup } from './catalog';

/** Base premium of each item, in input order; block pricing is spread evenly over its components. */
export function itemBasePremiums(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (lookup(item.type).component) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return items.map((item) => {
    const entry = lookup(item.type);
    if (entry.component && counts.get(item.type) === COMPONENT_BLOCK_SIZE) {
      return COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE;
    }
    return entry.premium;
  });
}

export function basePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((a, b) => a + b, 0);
}

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

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
}

export function quotePremium(items: Item[], customer: CustomerHistory): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((a, b) => a + b, 0);
  const itemSurcharges = items.reduce((sum, item, i) => sum + bases[i] * itemSurchargeRate(item), 0);

  // Every quoted item counts as a first insurance, regardless of customer history.
  let policyRate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) policyRate -= LOYALTY_DISCOUNT;
  if (customer.previousContracts > 0) policyRate -= FOLLOW_UP_DISCOUNT;

  const total = policyBase + itemSurcharges + policyBase * policyRate + PROCESSING_FEE;
  return Math.ceil(total - ROUNDING_EPSILON);
}
