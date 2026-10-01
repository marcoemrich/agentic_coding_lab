import { Item, itemBasePremiums, policyBasePremium } from './premium.js';
import { roundPremium } from './rounding.js';

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

/**
 * Item-specific surcharges apply to the base premium of the affected item;
 * policy-wide modifiers apply to the policy base premium. All modifiers are
 * computed against those bases and summed, then the fee is added last.
 */
export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const policyBase = policyBasePremium(items);
  let total = policyBase;

  for (const { item, basePremium } of itemBasePremiums(items)) {
    if (item.cursed) total += basePremium * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += basePremium * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) total -= policyBase * LOYALTY_DISCOUNT;

  // Every item in a quote counts as a first insurance, regardless of history.
  total += policyBase * FIRST_INSURANCE_SURCHARGE;

  if (previousContracts > 0) total -= policyBase * FOLLOW_UP_DISCOUNT;

  return roundPremium(total + PROCESSING_FEE);
}
