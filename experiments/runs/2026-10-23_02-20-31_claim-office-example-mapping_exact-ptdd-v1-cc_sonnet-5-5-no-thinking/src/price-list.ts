interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const COMPONENT_ENTRY: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT_ENTRY,
  moonstone: COMPONENT_ENTRY,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function priceListEntry(itemType: string): PriceListEntry {
  if (!Object.hasOwn(PRICE_LIST, itemType)) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return PRICE_LIST[itemType];
}

export function insuranceValueOf(itemType: string): number {
  return priceListEntry(itemType).insuranceValue;
}

export function basePremiumOf(itemType: string): number {
  return priceListEntry(itemType).basePremium;
}

function countByType(itemTypes: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const itemType of itemTypes) {
    counts.set(itemType, (counts.get(itemType) ?? 0) + 1);
  }
  return counts;
}

function isBuildingBlock(itemType: string, count: number): boolean {
  return COMPONENT_TYPES.has(itemType) && count === COMPONENT_BLOCK_SIZE;
}

function alikeItemsBasePremium(itemType: string, count: number): number {
  return isBuildingBlock(itemType, count) ? COMPONENT_BLOCK_PREMIUM : count * basePremiumOf(itemType);
}

export function policyBasePremium(itemTypes: string[]): number {
  let total = 0;
  for (const [itemType, count] of countByType(itemTypes)) {
    total += alikeItemsBasePremium(itemType, count);
  }
  return total;
}
