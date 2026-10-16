export const COMPONENT_TYPES: readonly string[] = ["rune", "moonstone"];

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

interface MainItemPrices {
  insuranceValue: number;
  basePremium: number;
}

const MHPCO_PRICE_LIST: Record<string, MainItemPrices> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export function mainItemPrices(item: Item): MainItemPrices {
  const prices = MHPCO_PRICE_LIST[item.type];
  if (prices === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return prices;
}
