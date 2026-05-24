export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: any[];
};

export type ScenarioResult = {
  results: any[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const firstInsuranceSurchargeOn = (base: number): number =>
  base * FIRST_INSURANCE_SURCHARGE_RATE;

const nonComponentItemPremium = (item: any): number => {
  const base = BASE_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  return base + curseSurcharge + firstInsuranceSurchargeOn(base);
};

const componentGroupPremium = (type: string, count: number): number => {
  const base = count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
  return base + firstInsuranceSurchargeOn(base);
};

const quotePremium = (items: any[]): number => {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += nonComponentItemPremium(item);
    }
  }
  for (const type in componentCounts) {
    total += componentGroupPremium(type, componentCounts[type]);
  }
  return Math.ceil(total + PROCESSING_FEE);
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results = scenario.steps.map((step) => ({ premium: quotePremium(step.items) }));
  return { results };
};
