const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUM = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
} as const;

type ItemType = keyof typeof BASE_PREMIUM;
type Item = { type: ItemType };
type Step = { op: "quote"; items: Array<Item> };
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<Step>;
};

const itemPremium = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE;
  return base + firstInsuranceSurcharge;
};

const sumItemPremiums = (items: Array<Item>): number =>
  items.reduce((total, item) => total + itemPremium(item), 0);

const quotePremium = (items: Array<Item>): number =>
  Math.ceil(sumItemPremiums(items) + PROCESSING_FEE);

export const runScenario = (scenario: unknown): unknown => {
  const { steps } = scenario as Scenario;
  return {
    results: steps.map(({ items }) => ({ premium: quotePremium(items) })),
  };
};
