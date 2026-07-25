type Item = { type: string };

const basePremiumsByType: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const basePremiumForItem = (item: Item): number => basePremiumsByType[item.type];

const sumOfItemBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumForItem(item), 0);

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
};

const basePremiumForGroup = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? BLOCK_PREMIUM : sumOfItemBasePremiums(group);

export const basePremium = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + basePremiumForGroup(group), 0);

export const runScenario = (scenario: unknown): unknown => undefined;
