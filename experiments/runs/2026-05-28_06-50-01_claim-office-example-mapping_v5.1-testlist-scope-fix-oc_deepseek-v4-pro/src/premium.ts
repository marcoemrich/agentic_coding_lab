export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_SINGLE_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;

function itemBasePremium(item: Item): number {
  if (MAIN_ITEM_BASE[item.type] !== undefined) {
    return MAIN_ITEM_BASE[item.type];
  }
  return COMPONENT_SINGLE_BASE;
}

function computeComponentsBasePremium(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    }
  }
  let total = 0;
  for (const count of Object.values(componentCounts)) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_BASE;
    } else {
      total += count * COMPONENT_SINGLE_BASE;
    }
  }
  return total;
}

export function calculatePremium(
  items: Item[],
  yearsWithMHPCO: number,
  contractNumber: number
): number {
  if (items.length === 0) return 5;

  let policyBasePremium = 0;
  const mainItems: Item[] = [];

  for (const item of items) {
    if (MAIN_ITEM_BASE[item.type] !== undefined) {
      policyBasePremium += MAIN_ITEM_BASE[item.type];
      mainItems.push(item);
    }
  }
  policyBasePremium += computeComponentsBasePremium(items);

  let itemSurcharges = 0;
  for (const item of items) {
    const base = itemBasePremium(item);
    if (item.cursed) itemSurcharges += base * 0.5;
    if ((item.enchantment || 0) >= 5) itemSurcharges += base * 0.3;
  }

  let totalBeforeFee = policyBasePremium + itemSurcharges;

  totalBeforeFee += policyBasePremium * 0.1;

  if (contractNumber > 0) {
    totalBeforeFee -= policyBasePremium * 0.15;
  }

  if (yearsWithMHPCO >= 2) {
    totalBeforeFee -= policyBasePremium * 0.2;
  }

  totalBeforeFee += 5;

  return Math.ceil(totalBeforeFee);
}