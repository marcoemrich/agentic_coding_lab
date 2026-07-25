type Item = { type: string; enchantment?: number };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PRICE = 25;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const priceOf = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const componentPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE : count * COMPONENT_PRICE;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countByType = (items: Item[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
};

export const basePremium = (items: Item[]): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const componentCounts = countByType(items.filter(isComponent));

  const mainTotal = mainItems.reduce((sum, item) => sum + priceOf(item), 0);
  const componentTotal = Object.values(componentCounts).reduce(
    (sum, count) => sum + componentPremium(count),
    0,
  );

  return mainTotal + componentTotal;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_MIN = 5;

const itemSurcharge = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN
    ? priceOf(item) * HIGH_ENCHANTMENT_RATE
    : 0;

export const premium = (
  items: Item[],
  opts: { yearsWithMHPCO: number; isFollowUp: boolean },
): number => {
  const base = basePremium(items);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty =
    opts.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? base * LOYALTY_RATE : 0;
  const surcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  return Math.ceil(base + firstInsurance - loyalty + surcharges + PROCESSING_FEE);
};

export const runScenario = (): unknown => undefined;
