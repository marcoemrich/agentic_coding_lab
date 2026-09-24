/** The insured things the MHPCO knows, and the price-list facts that both the
 *  premium office and the claims office read off the same catalogue entry.
 *  Neither side owns this knowledge: a new item type is one catalogue change,
 *  not a change to how premiums or payouts are decided. */

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

/** One row of the MHPCO price list: everything the office has decided about an
 *  item type. Insurance value and base premium are quoted together, per type,
 *  and are revised together when the office reprices a type. */
interface CatalogueEntry {
  insuranceValue: number;
  basePremium: number;
}

/** Every component -- rune, moonstone -- is insured for the same sum and
 *  carries the same base premium, independent of which component it is. */
const COMPONENT: CatalogueEntry = { insuranceValue: 250, basePremium: 25 };

/** The MHPCO price list. Every item type the office recognizes appears here
 *  exactly once, so a new type is one row, never two half-entries. */
const PRICE_LIST: Record<string, CatalogueEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

/** The price list's entry for an insured item. The MHPCO insures only what its
 *  price list names, so a type the list does not carry is refused here rather
 *  than priced: the office has no insurance value and no base premium to quote
 *  for it, and both counters must refuse it for the same one reason. */
function catalogueEntry(item: Item): CatalogueEntry {
  const entry = PRICE_LIST[item.type];
  if (entry === undefined) {
    throw new Error(`the MHPCO price list knows no item of type "${item.type}"`);
  }
  return entry;
}

/** The sum the MHPCO insures an item for, per the price list. */
export function insuranceValue(item: Item): number {
  return catalogueEntry(item).insuranceValue;
}

/** The MHPCO price list's base premium for an insured item. */
export function basePremium(item: Item): number {
  return catalogueEntry(item).basePremium;
}

/** Two items are "alike" when they share this key. The MHPCO reads "alike"
 *  as *the same type* -- a rune is alike another rune, but not a moonstone. */
export function alikeKey(item: Item): string {
  return item.type;
}
