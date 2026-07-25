const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
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

interface ScenarioResult {
  results: QuoteResult[];
}

const componentGroupBase = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

interface PricedUnit {
  base: number;
  surcharges: number[];
}

const mainItemUnit = (item: Item): PricedUnit => {
  const base = BASE_PREMIUMS[item.type];
  const surcharges: number[] = [];
  if (item.cursed) surcharges.push(base * CURSE_SURCHARGE);
  if (isHighEnchantment(item)) surcharges.push(base * HIGH_ENCHANTMENT_SURCHARGE);
  return { base, surcharges };
};

const componentUnit = (count: number): PricedUnit => ({
  base: componentGroupBase(count),
  surcharges: [],
});

const pricedUnits = (items: Item[]): PricedUnit[] => {
  const mainUnits = items.filter((item) => !isComponent(item)).map(mainItemUnit);

  const components = items.filter(isComponent);
  const componentUnits = [...countByType(components).values()].map(componentUnit);

  return [...mainUnits, ...componentUnits];
};

const unitTotal = (unit: PricedUnit): number =>
  unit.base +
  unit.base * FIRST_INSURANCE_SURCHARGE +
  unit.surcharges.reduce((sum, surcharge) => sum + surcharge, 0);

const quotePremium = (items: Item[]): number => {
  const itemsTotal = pricedUnits(items).reduce(
    (sum, unit) => sum + unitTotal(unit),
    0,
  );
  return Math.ceil(itemsTotal + PROCESSING_FEE);
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results = scenario.steps.map((step) => ({
    premium: quotePremium(step.items),
  }));
  return { results };
};
