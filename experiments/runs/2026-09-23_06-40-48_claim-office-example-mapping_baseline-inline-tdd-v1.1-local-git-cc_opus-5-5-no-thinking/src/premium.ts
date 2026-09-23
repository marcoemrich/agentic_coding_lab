import { BLOCK_PREMIUM, BLOCK_SIZE, catalogEntry, type Item } from './catalog';

export interface Customer {
  yearsWithMHPCO: number;
}

const CURSE_SURCHARGE = 50;
const HIGH_ENCHANTMENT_SURCHARGE = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 20;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 10;
const FOLLOW_UP_DISCOUNT = 15;
const PROCESSING_FEE = 5;
const PERCENT = 100;

/** Base premium of each item, in the order given (block components share the block premium). */
function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (catalogEntry(item.type).component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  return items.map((item) => {
    const entry = catalogEntry(item.type);
    if (entry.component && componentCounts.get(item.type) === BLOCK_SIZE) {
      return BLOCK_PREMIUM / BLOCK_SIZE;
    }
    return entry.basePremium;
  });
}

export function basePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((a, b) => a + b, 0);
}

/**
 * Computes the premium in hundredths of G to keep intermediate amounts exact,
 * then rounds up in the MHPCO's favor.
 */
export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((a, b) => a + b, 0);

  let percentOfItems = 0;
  items.forEach((item, i) => {
    let percent = 0;
    if (item.cursed) percent += CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) percent += HIGH_ENCHANTMENT_SURCHARGE;
    percentOfItems += bases[i] * percent;
  });

  let policyPercent = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) policyPercent -= LOYALTY_DISCOUNT;
  if (previousContracts > 0) policyPercent -= FOLLOW_UP_DISCOUNT;

  const hundredths = policyBase * PERCENT + percentOfItems + policyBase * policyPercent + PROCESSING_FEE * PERCENT;
  return Math.ceil(hundredths / PERCENT);
}
