export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet: { insuranceValue: 600, basePremium: 60, isComponent: false },
  staff: { insuranceValue: 800, basePremium: 80, isComponent: false },
  potion: { insuranceValue: 400, basePremium: 40, isComponent: false },
  rune: { insuranceValue: 250, basePremium: 25, isComponent: true },
  moonstone: { insuranceValue: 250, basePremium: 25, isComponent: true },
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function entryFor(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }
  return entry;
}

export function insuranceValueOf(item: Item): number {
  return entryFor(item.type).insuranceValue;
}

export function basePremiumOf(item: Item): number {
  return entryFor(item.type).basePremium;
}

/**
 * The base premium for a group of alike items -- items of the very same type.
 * A building block of exactly 3 alike components is offered at a special price.
 */
/** A building block is exactly 3 alike components -- main items never qualify. */
function formsBuildingBlock(type: string, count: number): boolean {
  return entryFor(type).isComponent && count === BLOCK_SIZE;
}

export function basePremiumForAlike(type: string, count: number): number {
  return formsBuildingBlock(type, count)
    ? BLOCK_BASE_PREMIUM
    : count * entryFor(type).basePremium;
}
