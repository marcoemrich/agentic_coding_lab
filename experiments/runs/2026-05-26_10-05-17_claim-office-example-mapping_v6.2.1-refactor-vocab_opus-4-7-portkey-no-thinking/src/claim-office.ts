interface Item {
  type: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: QuoteStep[];
}

interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const basePremiumOf = (item: Item): number => BASE_PREMIUM[item.type];

const isBlockOfAlike = (items: Item[]): boolean =>
  items.length === BLOCK_SIZE && items.every((i) => i.type === items[0].type);

const sumOfBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOf(item), 0);

const itemsBasePremium = (items: Item[]): number =>
  isBlockOfAlike(items) ? BLOCK_BASE_PREMIUM : sumOfBasePremiums(items);

const quoteStep = (step: QuoteStep): QuoteResult => {
  const itemsBase = itemsBasePremium(step.items);
  const firstInsuranceSurcharge = itemsBase * FIRST_INSURANCE_SURCHARGE_RATE;
  return { premium: itemsBase + firstInsuranceSurcharge + PROCESSING_FEE };
};

export const processScenario = (scenario: Scenario): { results: QuoteResult[] } => {
  const results = scenario.steps.map(quoteStep);
  return { results };
};
