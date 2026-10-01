export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function isKnownType(type: string): boolean {
  return type in MAIN_ITEM_PREMIUMS || isComponent(type);
}

/**
 * Base premium of a single item, ignoring component block discounts.
 * Used as the reference amount for item-specific modifiers.
 */
export function itemBasePremium(item: Item): number {
  if (!isKnownType(item.type)) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return isComponent(item.type) ? COMPONENT_PREMIUM : MAIN_ITEM_PREMIUMS[item.type];
}

export function basePremium(items: Item[]): number {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
  const mainTotal = items
    .filter((item) => !isComponent(item.type))
    .reduce((sum, item) => sum + MAIN_ITEM_PREMIUMS[item.type], 0);
  return mainTotal + componentsBasePremium(items.filter((item) => isComponent(item.type)));
}

function componentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }

  let total = 0;
  for (const count of countsByType.values()) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
}
