export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

/** The MHPCO price list: it defines both what is insurable and at what value and premium. */
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const COMPONENT_TYPES = ["rune", "moonstone"];

/** The MHPCO insures only the item types on its price list. */
function priceListEntry(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return entry;
}

export function basePremiumOf(type: string): number {
  return priceListEntry(type).basePremium;
}

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

/** The insurance sum is the unmodified insured value of every item on the policy. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item.type).insuranceValue, 0);
}
