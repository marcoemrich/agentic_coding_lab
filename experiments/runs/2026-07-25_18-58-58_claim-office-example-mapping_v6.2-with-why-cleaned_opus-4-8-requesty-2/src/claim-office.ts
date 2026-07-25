const priceList: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string };

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

const sumOfItemPrices = (items: Item[]): number =>
  items.reduce((sum, item) => sum + priceList[item.type], 0);

export const basePremium = (items: Item[]): number => {
  const nonComponents = items.filter(
    (item) => !COMPONENT_TYPES.includes(item.type),
  );
  let total = sumOfItemPrices(nonComponents);
  for (const type of COMPONENT_TYPES) {
    const count = items.filter((item) => item.type === type).length;
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PRICE;
    } else {
      total += count * priceList[type];
    }
  }
  return total;
};

const PROCESSING_FEE = 5;

type QuoteStep = { op: "quote"; items: Item[] };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: QuoteStep[] };

export const runScenario = (scenario: Scenario): { results: { premium: number }[] } => {
  const results = scenario.steps.map((step) => ({
    premium: basePremium(step.items) + PROCESSING_FEE,
  }));
  return { results };
};
