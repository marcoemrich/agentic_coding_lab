const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

type Item = { type: string };
type Step = { op: string; items?: Item[] };
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const withFirstInsuranceSurcharge = (base: number): number =>
  base + base * FIRST_INSURANCE_SURCHARGE_RATE;

const itemPremium = (item: Item): number =>
  withFirstInsuranceSurcharge(BASE_PREMIUMS[item.type]);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const groupBy = <T>(
  xs: T[],
  key: (x: T, index: number) => string,
): Map<string, T[]> => {
  const result = new Map<string, T[]>();
  xs.forEach((x, i) => {
    const k = key(x, i);
    result.set(k, [...(result.get(k) ?? []), x]);
  });
  return result;
};

const groupPremium = (group: Item[]): number =>
  group.length === BLOCK_SIZE
    ? withFirstInsuranceSurcharge(BLOCK_BASE_PREMIUM)
    : group.reduce((sum, item) => sum + itemPremium(item), 0);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const componentGroupKey = (item: Item, index: number): string =>
  isComponent(item) ? `component:${item.type}` : `single:${index}`;

const sumPremiums = (items: Item[]): number =>
  [...groupBy(items, componentGroupKey).values()].reduce(
    (sum, group) => sum + groupPremium(group),
    0,
  );

const quote = (items: Item[]): { premium: number } => ({
  premium: Math.ceil(sumPremiums(items) + PROCESSING_FEE),
});

const runStep = (step: Step): unknown => {
  if (step.op === "quote") return quote(step.items ?? []);
  return {};
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => ({
  results: scenario.steps.map(runStep),
});
