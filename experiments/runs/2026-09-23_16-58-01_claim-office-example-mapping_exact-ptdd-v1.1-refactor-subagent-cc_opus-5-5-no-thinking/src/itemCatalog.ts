export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

export function priceListEntry(item: Item): PriceListEntry {
  if (isComponent(item)) {
    return COMPONENT_PRICE;
  }
  const entry = MAIN_ITEM_PRICE_LIST[item.type];
  if (!entry) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return entry;
}

export function enchantmentLevel(item: Item): number {
  return item.enchantment ?? 0;
}

function alikeComponentsBasePremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE_PREMIUM : count * COMPONENT_PRICE.basePremium;
}

function componentsBasePremium(items: Item[]): number {
  return COMPONENT_TYPES.reduce(
    (sum, type) => sum + alikeComponentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
}

export function mainItems(items: Item[]): Item[] {
  return items.filter((item) => !isComponent(item));
}

function mainItemsBasePremium(items: Item[]): number {
  return mainItems(items).reduce((sum, item) => sum + priceListEntry(item).basePremium, 0);
}

export function policyBasePremium(items: Item[]): number {
  return mainItemsBasePremium(items) + componentsBasePremium(items);
}
