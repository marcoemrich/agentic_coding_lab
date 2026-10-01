import { basePremium, itemBasePremium, type Item } from './premium.js';

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteRequest {
  items: Item[];
  customer: Customer;
  /** Number of contracts the customer already holds in this scenario. */
  previousContracts: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

export function quotePremium(request: QuoteRequest): number {
  const { items, customer, previousContracts } = request;
  const policyBase = basePremium(items);

  let premium = policyBase;
  for (const item of items) {
    premium += itemSurcharges(item);
  }

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= policyBase * LOYALTY_DISCOUNT;
  }
  premium += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) {
    premium -= policyBase * FOLLOW_UP_CONTRACT_DISCOUNT;
  }

  return Math.ceil(premium + PROCESSING_FEE);
}

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharges = 0;
  if (item.cursed) {
    surcharges += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharges += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharges;
}
