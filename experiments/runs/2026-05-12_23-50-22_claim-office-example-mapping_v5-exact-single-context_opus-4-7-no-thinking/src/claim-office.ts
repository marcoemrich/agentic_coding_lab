export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: unknown }>;
};

export type ScenarioResult = {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;

const MAIN_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const itemBasePremium = (item: Item, allItemsOfSameType: number): number => {
  if (COMPONENT_TYPES.has(item.type)) {
    // Special-case block: if exactly 3 of this type, base is BLOCK_BASE / 3 per item
    if (allItemsOfSameType === COMPONENT_BLOCK_SIZE) {
      return COMPONENT_BLOCK_BASE / COMPONENT_BLOCK_SIZE;
    }
    return COMPONENT_BASE;
  }
  return MAIN_BASE_PREMIUMS[item.type] ?? 0;
};

const computePremium = (items: Item[]): number => {
  const countsByType: Record<string, number> = {};
  for (const item of items) {
    countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
  }
  let policyBase = 0;
  for (const item of items) {
    const base = itemBasePremium(item, countsByType[item.type]);
    let itemPremium = base + base * FIRST_INSURANCE_SURCHARGE;
    if (item.cursed) {
      itemPremium += base * 0.5;
    }
    if ((item.enchantment ?? 0) >= 5) {
      itemPremium += base * 0.3;
    }
    policyBase += itemPremium;
  }
  return Math.ceil(policyBase + PROCESSING_FEE);
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      return { premium: computePremium(step.items) };
    }
    return { payout: 0, remainingCap: 0 };
  });
  return { results };
};
