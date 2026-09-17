import type { Item } from "./policy.js";

/**
 * The MHPCO price list states one row per main item type: what the item is
 * insured for, and what insuring it costs. The spec states the two figures
 * together ("Sword: 1000 G insurance value, 100 G base premium"), and the
 * MHPCO revises them together, so they are kept in one row rather than in
 * parallel tables that would have to be kept in step by hand.
 *
 * The list covers main items only. Components (runes, moonstones) are
 * priced elsewhere, by the rules that let them form blocks, so a component
 * type has no row here and is never looked up here: `item-price-rules`
 * decides which rules govern an item and routes components away before the
 * list is consulted. A type that does reach the list without a row is one
 * the MHPCO does not insure at all, and is refused.
 */
interface PriceListRow {
  /**
   * A row states only the figures the MHPCO has published. The spec fixes an
   * insurance value for the sword and the amulet and is silent on the staff
   * and the potion, so the row carries what is stated and omits what is not,
   * rather than inventing a figure the MHPCO has never quoted.
   */
  readonly insuranceValue?: number;
  readonly basePremium?: number;
}

const MAIN_ITEM_PRICE_LIST: Readonly<Record<string, PriceListRow>> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { basePremium: 80 },
  potion: { basePremium: 40 },
};

/**
 * A figure a row is silent on costs and covers nothing.
 *
 * This is narrower than it looks: it applies only where a row exists but
 * omits a figure (staff and potion state a base premium and no insurance
 * value), never to a type the list does not carry at all -- such a type is
 * refused outright. The distinction is the point. A type the MHPCO does not
 * insure is a refusal; a figure the MHPCO has not published for a type it
 * does insure is nothing owed and nothing charged, which is what a silent
 * row means.
 */
const UNSTATED = 0;

/**
 * The MHPCO insures the item types on its price list and no others, so an
 * item it does not recognise is refused rather than quoted at nothing.
 */
function priceListRowOf(item: Item): PriceListRow {
  const row = MAIN_ITEM_PRICE_LIST[item.type];
  if (row === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
  }
  return row;
}

/** What the MHPCO charges to insure one main item of this type, before modifiers. */
export function basePremiumOf(item: Item): number {
  return priceListRowOf(item).basePremium ?? UNSTATED;
}

/** What the MHPCO's main item price list states this type is insured for. */
export function insuranceValueOf(item: Item): number {
  return priceListRowOf(item).insuranceValue ?? UNSTATED;
}
