export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

export const COMPONENT_INSURANCE_VALUE = 250;

const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES = ['rune', 'moonstone'];

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

export function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEM_BASE_PREMIUM || COMPONENT_TYPES.includes(type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function itemBasePremium(item: Item): number {
  return isComponent(item)
    ? COMPONENT_BASE_PREMIUM
    : MAIN_ITEM_BASE_PREMIUM[item.type];
}

export function itemModifierTotal(items: Item[]): number {
  return items.reduce((total, item) => {
    const base = itemBasePremium(item);
    let modifiers = 0;
    if (item.cursed) modifiers += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      modifiers += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
    return total + modifiers;
  }, 0);
}

export function basePremium(items: Item[]): number {
  const mainTotal = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + itemBasePremium(item), 0);

  let componentTotal = 0;
  for (const count of countByType(items.filter(isComponent)).values()) {
    componentTotal +=
      count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }

  return mainTotal + componentTotal;
}
