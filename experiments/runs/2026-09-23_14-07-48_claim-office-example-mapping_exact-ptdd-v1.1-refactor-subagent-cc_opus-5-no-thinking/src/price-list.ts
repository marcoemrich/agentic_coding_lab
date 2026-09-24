import type { Item } from "./insured-item.js";

// The MHPCO price list. Each listed item type carries a pair: what the MHPCO
// insures it for and what it charges to insure it. The spec states the two
// columns as one row per type, and both operations read this same list --
// quote reads the base premium column, claim the insurance value column -- so
// the list belongs to neither operation and changes for one reason only: the
// MHPCO revises its prices or its catalogue of item types.
interface ListedPrice {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICES: Record<string, ListedPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PRICE: ListedPrice = { insuranceValue: 250, basePremium: 25 };

// Components are listed as one undifferentiated kind rather than by type: the
// price list names no individual component, only the kind and its single price.
export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

// The MHPCO insures only what its price list names; anything else is refused.
function listedPrice(item: Item): ListedPrice {
  if (isComponent(item)) {
    return COMPONENT_PRICE;
  }
  const price = MAIN_ITEM_PRICES[item.type];
  if (price === undefined) {
    throw new Error(`the MHPCO price list does not cover "${item.type}"`);
  }
  return price;
}

export function insuranceValue(item: Item): number {
  return listedPrice(item).insuranceValue;
}

// An item's own price per the MHPCO price list. A component is listed at its
// individual price here; the block discount is a property of a group of alike
// components, not of any single component.
export function itemBasePremium(item: Item): number {
  return listedPrice(item).basePremium;
}

export const COMPONENT_BASE_PREMIUM = COMPONENT_PRICE.basePremium;
