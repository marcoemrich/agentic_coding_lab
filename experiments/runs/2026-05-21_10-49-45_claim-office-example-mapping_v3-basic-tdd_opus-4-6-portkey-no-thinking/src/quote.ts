import { getItemBasePremium, getItemInsuranceValue, isComponent, isKnownItem, computeComponentsPremium } from './pricing.js';

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

export function computeQuote(
  customer: Customer,
  items: Item[],
  previousQuoteCount: number,
): number {
  for (const item of items) {
    if (!isKnownItem(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  const mainItems = items.filter(i => !isComponent(i.type));
  const components = items.filter(i => isComponent(i.type));

  // Compute policy base premium (sum of individual item base premiums)
  let policyBasePremium = 0;
  for (const item of mainItems) {
    policyBasePremium += getItemBasePremium(item.type);
  }
  policyBasePremium += computeComponentsPremium(components);

  // Compute item-specific surcharges
  let itemSurcharges = 0;
  for (const item of mainItems) {
    const base = getItemBasePremium(item.type);
    if (item.cursed) {
      itemSurcharges += base * CURSE_SURCHARGE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      itemSurcharges += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }

  // Policy-wide modifiers apply to policyBasePremium
  let policyModifiers = 0;

  // First insurance surcharge (always applies - each item in a quote is treated as first insurance)
  policyModifiers += policyBasePremium * FIRST_INSURANCE_SURCHARGE;

  // Loyalty discount
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    policyModifiers -= policyBasePremium * LOYALTY_DISCOUNT;
  }

  // Follow-up contract discount
  if (previousQuoteCount > 0) {
    policyModifiers -= policyBasePremium * FOLLOW_UP_DISCOUNT;
  }

  const subtotal = policyBasePremium + itemSurcharges + policyModifiers;

  // Round up (in MHPCO's favor for premiums)
  return Math.ceil(subtotal) + PROCESSING_FEE;
}

export function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    sum += getItemInsuranceValue(item.type);
  }
  return sum;
}
