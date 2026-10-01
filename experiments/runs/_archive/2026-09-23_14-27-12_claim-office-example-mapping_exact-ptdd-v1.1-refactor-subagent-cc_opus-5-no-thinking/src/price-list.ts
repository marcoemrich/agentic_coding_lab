/** What the MHPCO insures: the price list prices it, the policy carries it. */
export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

/**
 * One row of the MHPCO price list. The office publishes both columns for an item
 * type in one editorial act, so they are carried together rather than in separate
 * tables that would have to be kept aligned by hand.
 */
interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

/** Main items are listed by type, each row carrying both published columns. */
const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

/** Components are not listed by type: the office carries the whole class at one rate. */
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_ENTRY: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

/**
 * The price list is the single authority on what the MHPCO insures: an item type it
 * does not carry is uninsurable, so the lookup that prices an item is also the one
 * that rejects it. Both columns are refused together, because a type the office does
 * not list has neither a premium nor a value.
 */
function entryFor(item: Item): PriceListEntry {
  const entry = isComponent(item) ? COMPONENT_ENTRY : MAIN_ITEMS[item.type];
  if (entry === undefined) {
    throw new Error(`The MHPCO price list does not cover items of type "${item.type}".`);
  }
  return entry;
}

/** What the office charges to insure an item. */
export function basePremiumOf(item: Item): number {
  return entryFor(item).basePremium;
}

/** What the office carries for an item -- the figure a policy's cover is built on. */
export function insuranceValueOf(item: Item): number {
  return entryFor(item).insuranceValue;
}
