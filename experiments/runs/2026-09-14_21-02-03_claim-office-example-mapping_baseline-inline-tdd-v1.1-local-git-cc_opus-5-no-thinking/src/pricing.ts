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

const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = ['rune', 'moonstone'];

const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

/** A block of exactly 3 alike components is offered at this base premium. */
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function entryFor(type: string): PriceListEntry {
  if (type in MAIN_ITEMS) return MAIN_ITEMS[type];
  if (isComponent(type)) return COMPONENT;
  throw new Error(`Unknown item type: ${type}`);
}

export function insuranceValue(item: Item): number {
  return entryFor(item.type).insuranceValue;
}

/** Insurance sum of a policy: the unmodified sum of all item insurance values. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item), 0);
}

/**
 * Base premium of a single item, before item-specific modifiers.
 * Components are priced by their group, so this is only meaningful for
 * main items; component pricing goes through basePremium.
 */
export function itemBasePremium(item: Item): number {
  return entryFor(item.type).basePremium;
}

/**
 * Base premium of a group of alike components: exactly 3 of the same type
 * form a block at a reduced premium, any other count is priced per piece.
 */
function componentGroupPremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT.basePremium;
}

export function basePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    const entry = entryFor(item.type);
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += entry.basePremium;
    }
  }

  for (const count of componentCounts.values()) {
    total += componentGroupPremium(count);
  }

  return total;
}
