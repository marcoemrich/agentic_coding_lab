/**
 * The MHPCO price list: what each insured thing costs before any modifier.
 *
 * This module owns catalogue knowledge — which item types the office recognises,
 * what it insures each for and what base premium it charges — and, inseparably
 * from it, the office's coverage ruling: MHPCO insures exactly what its price
 * list names, so being absent from the catalogue *is* being uninsurable. All of
 * it is one decision revised by one edit (list a broomstick, with its value and
 * rate, and it becomes covered), which is why coverage is not a register of its
 * own.
 *
 * It deliberately knows nothing about surcharges, discounts, the processing fee
 * or rounding: those are underwriting policy and change for entirely different
 * reasons. The building-block discount for alike components is likewise not
 * here; this module only supplies the per-component rate the block rule prices
 * against.
 */

import { type Item } from "./item.js";
import { componentsBasePremium } from "./component-blocks.js";

/** What the price list states about one main item type. */
interface PriceListEntry {
  readonly insuranceValueG: number;
  readonly basePremiumG: number;
}

/**
 * The MHPCO price list for main items. One entry per type the office
 * recognises, stating everything the list says about it — so listing a
 * broomstick, or revising what a sword is worth, is a single edit here.
 */
const MAIN_ITEM_PRICE_LIST: Readonly<Record<string, PriceListEntry>> = {
  sword: { insuranceValueG: 1000, basePremiumG: 100 },
  amulet: { insuranceValueG: 600, basePremiumG: 60 },
  staff: { insuranceValueG: 800, basePremiumG: 80 },
  potion: { insuranceValueG: 400, basePremiumG: 40 },
};

/**
 * Components — runes, moonstones and their kin — are not listed individually on
 * the main price list. MHPCO insures every component at the same value and
 * charges one uniform rate per component, whatever a block costs.
 */
const COMPONENT_INSURANCE_VALUE_G = 250;
const COMPONENT_BASE_PREMIUM_G = 25;

/**
 * What the price list says about a main item — and, in the same step, whether
 * MHPCO covers it at all. The office insures only what its list names, so the
 * missing entry *is* the refusal; splitting the lookup from the refusal would
 * let the two drift apart.
 */
function mainItemEntry(item: Item): PriceListEntry {
  const entry = MAIN_ITEM_PRICE_LIST[item.type];
  if (entry === undefined) {
    throw new Error(`MHPCO does not insure items of type "${item.type}"`);
  }
  return entry;
}

/**
 * What MHPCO insures a single item for. Unlike the base premium, this value is
 * untouched by any discount: the building block lowers what a policy costs, not
 * what its components are insured for.
 */
function itemInsuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_INSURANCE_VALUE_G : mainItemEntry(item).insuranceValueG;
}

/**
 * What MHPCO insures a whole policy's items for: the sum of the items' own
 * insurance values, untouched by any premium modifier or block discount. This
 * is the quantity the office measures its payouts against.
 */
export function policyInsuranceSum(items: readonly Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

const COMPONENT_TYPES: readonly string[] = ["rune", "moonstone"];

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

/**
 * The base premium of a single item, as the item-specific risk surcharges see
 * it: the price list rate for the item on its own, before any building-block
 * discount the policy as a whole may earn.
 */
export function itemBasePremium(item: Item): number {
  return isComponent(item) ? COMPONENT_BASE_PREMIUM_G : mainItemBasePremium(item);
}

/** The base premium of a single main item according to the MHPCO price list. */
function mainItemBasePremium(item: Item): number {
  return mainItemEntry(item).basePremiumG;
}

/**
 * The sum of the base premiums of all insured items, before any modifier.
 *
 * Main items are priced one by one straight off the price list; components are
 * handed to the building-block rule as a group, because their price depends on
 * how many alike ones the policy covers.
 */
export function policyBasePremium(items: readonly Item[]): number {
  const mainItemsTotal = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + mainItemBasePremium(item), 0);
  return (
    mainItemsTotal + componentsBasePremium(items.filter(isComponent), COMPONENT_BASE_PREMIUM_G)
  );
}
