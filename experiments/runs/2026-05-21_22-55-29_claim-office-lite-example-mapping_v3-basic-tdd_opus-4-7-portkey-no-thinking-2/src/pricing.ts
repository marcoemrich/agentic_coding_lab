export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const MAIN_ITEM_PRICES: Record<string, { value: number; base: number }> = {
  sword: { value: 1000, base: 100 },
  amulet: { value: 600, base: 60 },
  staff: { value: 800, base: 80 },
  potion: { value: 400, base: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isMainItem(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(MAIN_ITEM_PRICES, type);
}

export function isKnownItemType(type: string): boolean {
  return isMainItem(type) || isComponent(type);
}

export function itemInsuranceValue(item: Item): number {
  if (isMainItem(item.type)) return MAIN_ITEM_PRICES[item.type].value;
  if (isComponent(item.type)) return COMPONENT_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

export function itemBasePremium(item: Item): number {
  if (isMainItem(item.type)) return MAIN_ITEM_PRICES[item.type].base;
  if (isComponent(item.type)) return COMPONENT_BASE;
  throw new Error(`Unknown item type: ${item.type}`);
}

/**
 * Sum of base premiums for a policy, applying the component block discount.
 * Per type, if count is exactly 3, charge 60 G; otherwise count * 25.
 */
export function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();

  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }

  for (const count of componentCounts.values()) {
    total += count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_BASE
      : count * COMPONENT_BASE;
  }

  return total;
}
