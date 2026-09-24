// The MHPCO price list: what each insured item type is worth and what it costs to insure.
interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICES: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function priceOf(type: string): PriceListEntry {
  if (isComponent(type)) return COMPONENT_PRICE;
  const price = MAIN_ITEM_PRICES[type];
  if (price === undefined) throw new Error(`Unknown item type: ${type}`);
  return price;
}

export function unitInsuranceValue(type: string): number {
  return priceOf(type).insuranceValue;
}

export function unitBasePremium(type: string): number {
  return priceOf(type).basePremium;
}
