interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
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

interface ScenarioOutput {
  results: QuoteResult[];
}

const PROCESSING_FEE = 5;

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

const basePremiumFor = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const componentGroupPremium = (count: number, type: string): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * basePremiumFor(type);

const itemSurcharges = (item: Item): number => {
  const base = basePremiumFor(item.type);
  const curseSurcharge = item.cursed ? base * 0.5 : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= 5 ? base * 0.3 : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const countComponentsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return counts;
};

const calculateQuotePremium = (items: Item[], customer: { yearsWithMHPCO: number }): number => {
  const standardItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const componentCounts = countComponentsByType(items);

  const standardBasePremium = standardItems.reduce(
    (sum, item) => sum + basePremiumFor(item.type),
    0,
  );

  const totalComponentPremium = [...componentCounts].reduce(
    (sum, [type, count]) => sum + componentGroupPremium(count, type),
    0,
  );

  const policyBasePremium = standardBasePremium + totalComponentPremium;

  const totalItemSurcharges = standardItems.reduce(
    (sum, item) => sum + itemSurcharges(item),
    0,
  );

  const firstInsuranceSurcharge = policyBasePremium * 0.1;
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;

  return Math.ceil(
    policyBasePremium + totalItemSurcharges + firstInsuranceSurcharge - loyaltyDiscount + PROCESSING_FEE,
  );
};

export function processScenario(scenario: Scenario): ScenarioOutput {
  const results = scenario.steps.map((step) => ({
    premium: calculateQuotePremium(step.items, scenario.customer),
  }));
  return { results };
}
