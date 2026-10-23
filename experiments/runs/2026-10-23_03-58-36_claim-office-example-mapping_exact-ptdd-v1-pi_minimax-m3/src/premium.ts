// Premium calculation: applies item-specific modifiers, then policy-wide
// modifiers (loyalty, first insurance, follow-up), then adds the processing
// fee. Intermediate values are kept as fractions; only the final premium
// is rounded (up, in MHPCO's favor).

import type { Customer, QuoteItem } from "./domain.js";
import {
  CURSED_SURCHARGE_RATE,
  FIRST_INSURANCE_SURCHARGE_RATE,
  FOLLOW_UP_DISCOUNT_RATE,
  HIGH_ENCHANTMENT_PREMIUM_RATE,
  HIGH_ENCHANTMENT_PREMIUM_THRESHOLD,
  LOYALTY_DISCOUNT_RATE,
  LOYALTY_THRESHOLD_YEARS,
  MAIN_ITEM_BASE_PREMIUM,
  PROCESSING_FEE,
} from "./domain.js";
import { calculateBasePremium, isMainItemType } from "./policy.js";

export function calculateItemModifier(item: QuoteItem): number {
  if (!isMainItemType(item.type)) {
    return 0;
  }
  const base = MAIN_ITEM_BASE_PREMIUM[item.type];
  let modifier = 0;
  if (item.cursed === true) {
    modifier += CURSED_SURCHARGE_RATE * base;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD) {
    modifier += HIGH_ENCHANTMENT_PREMIUM_RATE * base;
  }
  return modifier;
}

export function calculatePremium(
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const policyBasePremium = calculateBasePremium(items);
  const itemModifiersTotal = items.reduce(
    (sum, item) => sum + calculateItemModifier(item),
    0,
  );

  let policyModifier = FIRST_INSURANCE_SURCHARGE_RATE * policyBasePremium;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyModifier -= LOYALTY_DISCOUNT_RATE * policyBasePremium;
  }
  if (isFollowUpContract) {
    policyModifier -= FOLLOW_UP_DISCOUNT_RATE * policyBasePremium;
  }

  const subtotal = policyBasePremium + itemModifiersTotal + policyModifier;
  return Math.ceil(subtotal + PROCESSING_FEE);
}
