/** MHPCO premium pricing: surcharges, discounts, fee, rounding. */

import {
  basePremiumG,
  componentBlockPremiumG,
  isComponent,
} from "./itemCatalog.js";
import type { QuoteItem } from "./scenario.js";

/** All internal amounts are integer hundredths of a G (centi-G). */
const CENTI = 100;
const PERCENT = 100;

/** Processing fee added to every premium, in G. */
export const PROCESSING_FEE_G = 5;

/** First insurance carries a 10 % initial assessment surcharge. */
const FIRST_INSURANCE_PERCENT = 10;

/** Cursed items add a 50 % risk surcharge on their base premium. */
const CURSED_SURCHARGE_PERCENT = 50;

/** Highly enchanted items (enchantment >= 5) add a 30 % surcharge. */
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

/** Long-standing customers (>= 2 years) receive a 20 % loyalty discount. */
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;

/** Customers receive a 15 % discount on each contract after their first. */
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

/** Base premium of one main item from the catalog, in centi-G. */
function mainItemBaseCenti(item: QuoteItem): number {
  return basePremiumG(item.type) * CENTI;
}

/** One main item's premium including its risk surcharges, in centi-G. */
function mainItemPremiumCenti(item: QuoteItem): number {
  const baseCenti = mainItemBaseCenti(item);
  let premiumCenti = baseCenti;
  if (item.cursed) {
    premiumCenti += (baseCenti * CURSED_SURCHARGE_PERCENT) / PERCENT;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    premiumCenti += (baseCenti * HIGH_ENCHANTMENT_SURCHARGE_PERCENT) / PERCENT;
  }
  return premiumCenti;
}

/** Base premium of all components, honoring the block offer. */
function componentBaseCenti(items: QuoteItem[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let totalCenti = 0;
  for (const count of counts.values()) {
    totalCenti += componentBlockPremiumG(count) * CENTI;
  }
  return totalCenti;
}

/** Split items into main items and the component premium total. */
function mainItemsOf(items: QuoteItem[]): QuoteItem[] {
  return items.filter((item) => !isComponent(item.type));
}

/** Policy base premium: sum of unmodified item base premiums. */
function policyBaseCenti(items: QuoteItem[]): number {
  const mainCenti = mainItemsOf(items).reduce(
    (sum, item) => sum + mainItemBaseCenti(item),
    0,
  );
  return mainCenti + componentBaseCenti(items);
}

/** Sum of item premiums with item-specific modifiers, in centi-G. */
function itemsTotalCenti(items: QuoteItem[]): number {
  const mainCenti = mainItemsOf(items).reduce(
    (sum, item) => sum + mainItemPremiumCenti(item),
    0,
  );
  return mainCenti + componentBaseCenti(items);
}

/** Premium in whole G for a quote; rounds up in the MHPCO's favor. */
export function quotePremium(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  previousContracts: number,
): number {
  const baseCenti = policyBaseCenti(items);
  const firstInsuranceCenti = (baseCenti * FIRST_INSURANCE_PERCENT) / PERCENT;
  let totalCenti = itemsTotalCenti(items) + firstInsuranceCenti;
  if (yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    totalCenti -= (baseCenti * LOYALTY_DISCOUNT_PERCENT) / PERCENT;
  }
  if (previousContracts > 0) {
    totalCenti -= (baseCenti * FOLLOW_UP_DISCOUNT_PERCENT) / PERCENT;
  }
  totalCenti += PROCESSING_FEE_G * CENTI;
  return Math.ceil(totalCenti / CENTI);
}
