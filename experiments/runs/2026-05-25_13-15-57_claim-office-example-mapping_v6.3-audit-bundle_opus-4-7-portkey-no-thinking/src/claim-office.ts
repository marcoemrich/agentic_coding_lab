const PROCESSING_FEE = 5;

const BASE_PRICE_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

type Item = { type: string };
type Step = { op: "quote"; items: Item[] };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const itemBasePrice = (item: Item): number => BASE_PRICE_BY_TYPE[item.type];

const quotePremium = (step: Step): number =>
  step.items.reduce((sum, item) => sum + itemBasePrice(item), 0) + PROCESSING_FEE;

export const runScenario = (input: unknown): unknown => ({
  results: (input as Scenario).steps.map((step) => ({ premium: quotePremium(step) })),
});
