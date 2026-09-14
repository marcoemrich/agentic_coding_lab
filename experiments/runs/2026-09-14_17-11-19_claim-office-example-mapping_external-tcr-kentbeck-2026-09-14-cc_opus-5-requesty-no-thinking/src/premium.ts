import { Item, itemBasePremium, policyBasePremium } from './policy.js';

export interface Customer {
  yearsWithMHPCO: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/** Rounds in the MHPCO's favour: premiums go up. */
function roundUp(amount: number): number {
  return Math.ceil(amount);
}

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const base = policyBasePremium(items);
  let total = base;
  for (const item of items) total += itemSurcharges(item);
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) total -= base * LOYALTY_DISCOUNT;
  total += base * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) total -= base * FOLLOW_UP_DISCOUNT;
  return roundUp(total + PROCESSING_FEE);
}
