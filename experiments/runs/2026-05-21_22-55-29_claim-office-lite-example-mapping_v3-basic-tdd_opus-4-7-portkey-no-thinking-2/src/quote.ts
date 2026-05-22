import { Item, itemBasePremium, policyBasePremium } from './pricing.js';

export interface QuoteInput {
  items: Item[];
  yearsWithMHPCO: number;
  isFirstContract: boolean;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANT_THRESHOLD = 5;
const HIGH_ENCHANT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

export function computeQuote(input: QuoteInput): number {
  const { items, yearsWithMHPCO, isFirstContract } = input;

  // Item-specific surcharges sum (cursed, high enchantment)
  let itemSurcharges = 0;
  for (const item of items) {
    const itemBase = itemBasePremium(item);
    if (item.cursed) itemSurcharges += itemBase * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) {
      itemSurcharges += itemBase * HIGH_ENCHANT_SURCHARGE;
    }
  }

  // Policy base premium (with block discount for components)
  const policyBase = policyBasePremium(items);

  // Policy-wide modifiers (applied to policy base premium)
  let policyMods = 0;
  if (yearsWithMHPCO >= LOYALTY_YEARS) policyMods -= policyBase * LOYALTY_DISCOUNT;
  policyMods += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (!isFirstContract) policyMods -= policyBase * FOLLOWUP_DISCOUNT;

  const total = policyBase + itemSurcharges + policyMods + PROCESSING_FEE;

  // Round up in MHPCO's favor
  return Math.ceil(total);
}
