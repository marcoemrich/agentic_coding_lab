const PROCESSING_FEE = 5;
const FIRST_QUOTE_SURCHARGE_RATE = 0.1;
const BASE_PRICE_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

type Item = { type: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: QuoteStep[] };

const itemBasePrice = (item: Item): number => BASE_PRICE_BY_TYPE[item.type];

const totalBasePrice = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemBasePrice(item), 0);

const quotePremium = (items: Item[]): number => {
  const basePrice = totalBasePrice(items);
  const firstQuoteSurcharge = basePrice * FIRST_QUOTE_SURCHARGE_RATE;
  const premiumBeforeRounding = basePrice + firstQuoteSurcharge + PROCESSING_FEE;
  return Math.ceil(premiumBeforeRounding);
};

export const runScenario = (scenario: Scenario): { results: Array<{ premium: number }> } => {
  const results = scenario.steps.map((step) => ({ premium: quotePremium(step.items) }));
  return { results };
};
