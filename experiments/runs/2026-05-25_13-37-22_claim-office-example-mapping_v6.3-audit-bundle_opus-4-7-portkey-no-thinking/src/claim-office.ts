const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

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

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

// Per spec: intermediate amounts are kept as fractions; only the final
// premium is rounded (up, in MHPCO's favour).
const applyPercentSurcharge = (base: number, percent: number): number =>
  (base * (100 + percent)) / 100;

const roundPremiumUp = (amount: number): number => Math.ceil(amount);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_UNIT_PREMIUM = 25;

const itemBasePremium = (item: Item): number => BASE_PREMIUM[item.type];

const componentGroupPremium = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_UNIT_PREMIUM;
};

const itemsBaseTotal = (items: Item[]): number => {
  const componentCounts = new Map<string, number>();
  let mainTotal = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      mainTotal += itemBasePremium(item);
    }
  }
  let componentsTotal = 0;
  for (const count of componentCounts.values()) {
    componentsTotal += componentGroupPremium(count);
  }
  return mainTotal + componentsTotal;
};

const quotePremium = (step: QuoteStep): number => {
  const itemsTotal = itemsBaseTotal(step.items);
  const withFirstInsurance = applyPercentSurcharge(itemsTotal, FIRST_INSURANCE_SURCHARGE_PERCENT);
  return roundPremiumUp(withFirstInsurance + PROCESSING_FEE);
};

export const processScenario = (scenario: Scenario): unknown => {
  const results = scenario.steps.map((step) => ({ premium: quotePremium(step) }));
  return { results };
};
