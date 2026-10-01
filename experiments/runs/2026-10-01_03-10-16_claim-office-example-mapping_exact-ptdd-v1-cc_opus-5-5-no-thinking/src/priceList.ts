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

function mainItemEntry(item: Item): PriceListEntry {
  const entry = MAIN_ITEMS[item.type];
  if (!entry) throw new Error(`Unknown item type: ${item.type}`);
  return entry;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function alikeComponentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

export function itemBasePremium(item: Item): number {
  return isComponent(item) ? COMPONENT_BASE_PREMIUM : mainItemEntry(item).basePremium;
}

export function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  const mainItemsPremium = mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0);
  const componentsPremium = [...countByType(components).values()].reduce(
    (sum, count) => sum + alikeComponentsBasePremium(count),
    0,
  );
  return mainItemsPremium + componentsPremium;
}

function itemInsuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_INSURANCE_VALUE : mainItemEntry(item).insuranceValue;
}

export function policyInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}
