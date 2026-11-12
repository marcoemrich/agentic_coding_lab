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

const MAIN_ITEMS = new Map<string, PriceListEntry>(
  Object.entries({
    sword: { insuranceValue: 1000, basePremium: 100 },
    amulet: { insuranceValue: 600, basePremium: 60 },
    staff: { insuranceValue: 800, basePremium: 80 },
    potion: { insuranceValue: 400, basePremium: 40 },
  }),
);
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;
const BUILDING_BLOCK_SAVING = BUILDING_BLOCK_SIZE * COMPONENT.basePremium - BUILDING_BLOCK_BASE_PREMIUM;

function priceListEntry(item: Item): PriceListEntry {
  if (COMPONENT_TYPES.includes(item.type)) {
    return COMPONENT;
  }
  const mainItem = MAIN_ITEMS.get(item.type);
  if (mainItem === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return mainItem;
}

export function itemBasePremium(item: Item): number {
  return priceListEntry(item).basePremium;
}

function formsBuildingBlock(items: Item[], componentType: string): boolean {
  return items.filter((item) => item.type === componentType).length === BUILDING_BLOCK_SIZE;
}

export function policyBasePremium(items: Item[]): number {
  const listPremium = items.reduce((sum, item) => sum + itemBasePremium(item), 0);
  const buildingBlocks = COMPONENT_TYPES.filter((componentType) => formsBuildingBlock(items, componentType));
  return listPremium - buildingBlocks.length * BUILDING_BLOCK_SAVING;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item).insuranceValue, 0);
}
