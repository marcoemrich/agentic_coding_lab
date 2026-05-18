const PROCESSING_FEE = 5;
const DEFAULT_BASE_PREMIUM = 100;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

interface Item {
  type: string;
}

interface Step {
  op: string;
  items?: Item[];
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PRICE = 60;

const basePremiumFor = (item: Item): number =>
  BASE_PREMIUMS[item.type] ?? DEFAULT_BASE_PREMIUM;

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const priceAlikeGroup = (type: string, count: number): number =>
  count === ALIKE_BLOCK_SIZE
    ? ALIKE_BLOCK_PRICE
    : count * basePremiumFor({ type });

const priceItems = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (sum, [type, count]) => sum + priceAlikeGroup(type, count),
    0,
  );

const quoteStep = (step: Step) => ({
  premium: priceItems(step.items ?? []) + PROCESSING_FEE,
});

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  return { results: scenario.steps.map(quoteStep) };
};
