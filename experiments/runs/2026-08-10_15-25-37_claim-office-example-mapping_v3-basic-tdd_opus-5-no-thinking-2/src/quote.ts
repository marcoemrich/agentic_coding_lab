import { basePremiumOf, priceOf } from './catalog.js';
import { policyBasePremium } from './premium.js';
import type { Customer, Item } from './types.js';

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

export interface QuoteContext {
  customer: Customer;
  /** Number of contracts the customer already holds with the MHPCO. */
  previousContracts: number;
}

/**
 * Surcharges tied to a single item, charged on that item's own base premium
 * rather than on the policy total.
 */
function itemSurcharges(item: Item): number {
  const base = basePremiumOf(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

/**
 * Modifiers tied to the customer's history, charged on the policy base
 * premium. Every quote is a first insurance for the items it covers.
 */
function policyModifiers(base: number, context: QuoteContext): number {
  let modifier = FIRST_INSURANCE_SURCHARGE;
  if (context.customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    modifier -= LOYALTY_DISCOUNT;
  }
  if (context.previousContracts >= 1) {
    modifier -= FOLLOW_UP_DISCOUNT;
  }
  return base * modifier;
}

/** Total premium in whole G, rounded up in the MHPCO's favour. */
export function quotePremium(items: Item[], context: QuoteContext): number {
  items.forEach((item) => priceOf(item.type));

  const base = policyBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  const total = base + surcharges + policyModifiers(base, context) + PROCESSING_FEE;

  return Math.ceil(total);
}
