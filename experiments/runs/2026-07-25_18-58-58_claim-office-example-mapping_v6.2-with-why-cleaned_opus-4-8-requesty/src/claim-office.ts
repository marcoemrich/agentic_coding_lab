interface Item {
  type: string;
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

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const componentGroupBase = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_UNIT_PREMIUM;

const componentsBase = (components: Item[]): number => {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }
  return [...countsByType.values()].reduce(
    (total, count) => total + componentGroupBase(count),
    0,
  );
};

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.has(item.type);

const itemsBase = (items: Item[]): number => {
  const mainBase = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  return mainBase + componentsBase(items.filter(isComponent));
};

const CURSE_SURCHARGE = 0.5;

const curseSurcharge = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] * CURSE_SURCHARGE : 0),
    0,
  );

const quotePremium = (items: Item[]): number => {
  const base = itemsBase(items);
  // Keep as `base + base * rate`, not `base * (1 + rate)`: the additive form
  // avoids IEEE-754 drift that would otherwise round wrong under Math.ceil.
  return Math.ceil(
    base + base * FIRST_INSURANCE_SURCHARGE + curseSurcharge(items) + PROCESSING_FEE,
  );
};

export const runScenario = (scenario: Scenario): { results: QuoteResult[] } => {
  const results = scenario.steps.map((step) => ({
    premium: quotePremium(step.items),
  }));
  return { results };
};
