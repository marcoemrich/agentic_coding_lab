import type { ItemSpec } from "./office.js";
import { RejectionError } from "./office.js";

/** Processing fee added to every premium, in G. */
export const PROCESSING_FEE_G = 5;

/** First-insurance assessment surcharge, in percent of the policy base premium. */
const FIRST_INSURANCE_SURCHARGE_PCT = 10;

/** A whole of something, in percent. */
const WHOLE_PERCENT = 100;

/** The MHPCO price list: insurance value and base premium per item type, in G. */
const PRICE_LIST: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

/** Percent helper: amount * pct / 100 stays exact for the MHPCO's quarter-G amounts. */
export function percentOf(amount: number, pct: number): number {
  return (amount * pct) / WHOLE_PERCENT;
}

/** A building block of exactly 3 alike components: special base premium in G. */
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM_G = 60;

/** Item types that are components (insured per piece at 250 G). */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function isComponent(itemSpec: ItemSpec): boolean {
  return COMPONENT_TYPES.has(itemSpec.type);
}

/** Group components by type so blocks of exactly 3 alike can be priced together. */
function countAlikeComponents(items: ItemSpec[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const itemSpec of items) {
    if (isComponent(itemSpec)) {
      counts.set(itemSpec.type, (counts.get(itemSpec.type) ?? 0) + 1);
    }
  }
  return counts;
}

/** Base premium for a group of `count` alike components of one type. */
function componentGroupBasePremium(type: string, count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE_PREMIUM_G;
  }
  return count * PRICE_LIST[type].basePremium;
}

/** The insurance value of one item type, in G. */
export function insuranceValueOf(type: string): number {
  return PRICE_LIST[type].insuranceValue;
}

/** Item types the MHPCO insures. */
export function assertKnownItemType(type: string): void {
  if (!(type in PRICE_LIST)) {
    throw new RejectionError(`the MHPCO does not insure items of type '${type}'`);
  }
}

function basePremiumOf(items: ItemSpec[]): number {
  let total = 0;
  const componentCounts = countAlikeComponents(items);
  for (const itemSpec of items) {
    if (!isComponent(itemSpec)) {
      total += PRICE_LIST[itemSpec.type].basePremium;
    }
  }
  for (const [type, count] of componentCounts) {
    total += componentGroupBasePremium(type, count);
  }
  return total;
}

/** Cursed items add a 50 % risk surcharge on the affected item's base premium. */
const CURSED_SURCHARGE_PCT = 50;

/** Highly enchanted items (level >= 5) add a 30 % risk surcharge on the item's base premium. */
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Item-scoped risk surcharges (cursed, high enchantment) applied to the affected items' base premiums. */
function itemRiskSurcharges(items: ItemSpec[]): number {
  let total = 0;
  for (const itemSpec of items) {
    const basePremium = PRICE_LIST[itemSpec.type].basePremium;
    if (itemSpec.cursed) {
      total += percentOf(basePremium, CURSED_SURCHARGE_PCT);
    }
    if ((itemSpec.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
      total += percentOf(basePremium, HIGH_ENCHANTMENT_SURCHARGE_PCT);
    }
  }
  return total;
}

/** Long-standing customers (>= 2 years) receive a 20 % loyalty discount. */
const LOYALTY_DISCOUNT_PCT = 20;
const LOYALTY_YEARS = 2;

/** Customers receive a 15 % discount on each contract after their first. */
const FOLLOW_UP_DISCOUNT_PCT = 15;

/** Customer-history discounts (loyalty, follow-up contract) on the policy base premium. */
function customerDiscount(policyBasePremium: number, yearsWithMHPCO: number, isFollowUpContract: boolean): number {
  let discount = 0;
  if (yearsWithMHPCO >= LOYALTY_YEARS) {
    discount += percentOf(policyBasePremium, LOYALTY_DISCOUNT_PCT);
  }
  if (isFollowUpContract) {
    discount += percentOf(policyBasePremium, FOLLOW_UP_DISCOUNT_PCT);
  }
  return discount;
}

/** Price a quote: policy base premium, item-scoped risk surcharges, first-insurance surcharge, customer discounts, then the processing fee. */
export function quotePremium(
  items: ItemSpec[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  for (const itemSpec of items) {
    assertKnownItemType(itemSpec.type);
  }
  const policyBasePremium = basePremiumOf(items);
  const firstInsuranceSurcharge = percentOf(policyBasePremium, FIRST_INSURANCE_SURCHARGE_PCT);
  const premium =
    policyBasePremium +
    itemRiskSurcharges(items) +
    firstInsuranceSurcharge -
    customerDiscount(policyBasePremium, yearsWithMHPCO, isFollowUpContract);
  return premium + PROCESSING_FEE_G;
}
