const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const RUNE_BLOCK_SIZE = 3;
const RUNE_BLOCK_PREMIUM = 60;

type Item = { type: string };
type Step = { op: "quote"; items: Item[] };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const basePremiumFor = (item: Item): number => BASE_PREMIUMS[item.type];

const sumIndividualPremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item), 0);

const isRuneBlock = (items: Item[]): boolean =>
  items.length === RUNE_BLOCK_SIZE && items.every((item) => item.type === "rune");

const policyBaseFor = (items: Item[]): number =>
  isRuneBlock(items) ? RUNE_BLOCK_PREMIUM : sumIndividualPremiums(items);

const quotePremium = (items: Item[]): number => {
  const policyBase = policyBaseFor(items);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  return policyBase + firstInsurance + PROCESSING_FEE;
};

export const runScenario = (scenario: Scenario): { results: { premium: number }[] } => ({
  results: scenario.steps.map((step) => ({ premium: quotePremium(step.items) })),
});
