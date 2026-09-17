/**
 * The MHPCO price list: the office's catalogue of what it will insure and what
 * each kind of thing costs. It answers the questions of item *kind* -- is this a
 * main item or a component, what is its tariff row -- and nothing about
 * underwriting policy or settlement. A new item type revises this table alone.
 */

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

/**
 * The price list prices each main item type by its own tariff row, but prices
 * every component by one rule: 25 G per component, whatever its kind.
 */
const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE = 250;

export const COMPONENT_BASE_PREMIUM = 25;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

/**
 * The MHPCO insures nothing that is absent from its price list, so an unlisted
 * type is refused rather than priced. This is one underwriting decision, not one
 * per column: whichever figure is being looked up, a type without a tariff row is
 * a type the office does not insure. Every column reads its row through here so
 * that the refusal -- and one day the shape the CLI must report it as -- is
 * revised in a single place.
 */
function listedRow(table: Record<string, number>, type: string): number {
  const figure = table[type];
  if (figure === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }
  return figure;
}

/**
 * The tariff row a main item is priced from. Components have no row of their own.
 */
export function mainItemBasePremium(type: string): number {
  return listedRow(MAIN_ITEM_BASE_PREMIUM, type);
}

/**
 * What the MHPCO insures an item for. Every item is insured on its own value --
 * the block discount is a premium concession and never lowers the insured sum.
 */
function insuranceValue(type: string): number {
  if (isComponent(type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return listedRow(MAIN_ITEM_INSURANCE_VALUE, type);
}

/**
 * What a set of items insures for. The price list adds insurance values item by
 * item, with no group rate of any kind: 3 runes insure for 750 G even though the
 * same 3 runes are *premiumed* as a 60 G block. The block is a premium
 * concession, and this is the line that keeps it out of the insured sum.
 */
export function insuranceValueOf(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValue(item.type), 0);
}
