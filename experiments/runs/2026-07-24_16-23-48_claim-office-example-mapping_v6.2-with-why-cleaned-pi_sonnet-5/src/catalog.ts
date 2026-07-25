export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const computeTypePremium = (type: string, count: number): number => {
  if (!(type in ITEM_BASE_PREMIUM)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * ITEM_BASE_PREMIUM[type];
};

export const computeItemBasePremium = (item: Item): number => computeTypePremium(item.type, 1);

export const computeItemsBasePremium = (items: Item[]): number => {
  const countsByType = new Map<string, number>();
  for (const { type } of items) {
    countsByType.set(type, (countsByType.get(type) ?? 0) + 1);
  }
  return [...countsByType].reduce(
    (total, [type, count]) => total + computeTypePremium(type, count),
    0
  );
};

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

export const computeInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, { type }) => sum + ITEM_INSURANCE_VALUE[type], 0);
