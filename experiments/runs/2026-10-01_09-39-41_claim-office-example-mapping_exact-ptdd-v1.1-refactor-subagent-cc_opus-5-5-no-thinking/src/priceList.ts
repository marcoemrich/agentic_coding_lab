interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function isMainItemType(type: string): boolean {
  return type in MAIN_ITEM_PRICE_LIST;
}

export function isComponentType(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isListedType(type: string): boolean {
  return isMainItemType(type) || isComponentType(type);
}

export function assertOnPriceList(type: string): void {
  if (!isListedType(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

export function priceOf(type: string): PriceListEntry {
  return isComponentType(type) ? COMPONENT_PRICE : MAIN_ITEM_PRICE_LIST[type];
}
