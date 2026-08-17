import { catalogEntry } from './catalog';
import { basePremium, QuoteItem } from './basePremium';
import { roundInFavor } from './rounding';

export interface CustomerContext {
  years: number;
  contractIndex: number; // zero-based index of this quote among the scenario's quotes
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function itemSurcharge(item: QuoteItem): number {
  const base = catalogEntry(item.type).premium;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function quotePremium(items: QuoteItem[], customer: CustomerContext): number {
  const policyBase = basePremium(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);

  let total = policyBase + itemSurcharges;
  total += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (customer.years >= LOYALTY_YEARS) {
    total -= policyBase * LOYALTY_DISCOUNT;
  }
  if (customer.contractIndex >= 1) {
    total -= policyBase * FOLLOWUP_DISCOUNT;
  }

  return roundInFavor(total + PROCESSING_FEE, 'premium');
}
