type Item = { type: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: QuoteStep[] };

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const TYPES_WITH_BLOCK_DISCOUNT = new Set(["rune"]);

const countsByType = (items: Item[]): Record<string, number> =>
  items.reduce<Record<string, number>>(
    (counts, item) => ({ ...counts, [item.type]: (counts[item.type] ?? 0) + 1 }),
    {},
  );

const blockDiscountFor = (type: string, count: number): number =>
  TYPES_WITH_BLOCK_DISCOUNT.has(type) && count === BLOCK_SIZE ? BLOCK_DISCOUNT : 0;

const baseForTypeGroup = (type: string, count: number): number =>
  count * BASE_PREMIUM_BY_TYPE[type] - blockDiscountFor(type, count);

const quoteStep = (step: QuoteStep): { premium: number } => {
  const counts = countsByType(step.items);
  const itemsBase = Object.entries(counts).reduce(
    (sum, [type, count]) => sum + baseForTypeGroup(type, count),
    0,
  );
  return { premium: itemsBase + PROCESSING_FEE };
};

export const runScenario = (scenario: Scenario): { results: { premium: number }[] } => {
  return { results: scenario.steps.map(quoteStep) };
};
