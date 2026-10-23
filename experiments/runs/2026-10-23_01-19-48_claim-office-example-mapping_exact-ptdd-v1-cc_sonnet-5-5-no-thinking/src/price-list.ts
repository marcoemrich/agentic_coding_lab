export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
type PriceListEntry = { insuranceValue: number; basePremium: number };

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

function priceListEntryOf(item: Item): PriceListEntry {
  if (!Object.hasOwn(PRICE_LIST, item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return PRICE_LIST[item.type];
}

export function insuranceValueOf(item: Item): number {
  return priceListEntryOf(item).insuranceValue;
}

export function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

export function basePremiumOf(item: Item): number {
  return priceListEntryOf(item).basePremium;
}

export function itemsBasePremium(items: Item[]): number {
  const countOf = (type: string) => items.filter((item) => item.type === type).length;
  const blockTypes = COMPONENT_TYPES.filter((type) => countOf(type) === COMPONENT_BLOCK_SIZE);
  const separateItems = items.filter((item) => !blockTypes.includes(item.type));
  return (
    blockTypes.length * COMPONENT_BLOCK_PREMIUM +
    separateItems.reduce((sum, item) => sum + basePremiumOf(item), 0)
  );
}
