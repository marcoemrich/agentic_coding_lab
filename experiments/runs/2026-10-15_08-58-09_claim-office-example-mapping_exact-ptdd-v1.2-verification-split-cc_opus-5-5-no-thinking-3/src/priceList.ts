// The MHPCO price list: insurance values and base premiums per item type.
type PriceListEntry = { insuranceValue: number; basePremium: number };

export const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
export const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
export const BLOCK_SIZE = 3;
export const BLOCK_BASE_PREMIUM = 60;

export const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

export function mainItem(type: string): PriceListEntry {
  const entry = MAIN_ITEMS[type];
  if (!entry) throw new Error(`Unknown item type: ${type}`);
  return entry;
}

export function insuranceValueOf(type: string): number {
  return isComponent(type) ? COMPONENT.insuranceValue : mainItem(type).insuranceValue;
}
