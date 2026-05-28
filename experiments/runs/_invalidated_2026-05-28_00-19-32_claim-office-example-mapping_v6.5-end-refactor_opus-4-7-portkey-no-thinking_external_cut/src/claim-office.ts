const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

type Item = { type: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: QuoteStep[] };
type QuoteResult = { premium: number };
type Output = { results: QuoteResult[] };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
};

const basePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const quote = (step: QuoteStep): QuoteResult => {
  const base = step.items.reduce((sum, item) => sum + basePremium(item), 0);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  return { premium: Math.ceil(base + firstInsurance + PROCESSING_FEE) };
};

export const run = (input: unknown): Output => {
  const scenario = input as Scenario;
  return { results: scenario.steps.map(quote) };
};
