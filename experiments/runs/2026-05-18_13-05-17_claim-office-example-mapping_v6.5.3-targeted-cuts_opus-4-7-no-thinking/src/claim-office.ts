type Item = { type: string; cursed?: boolean; enchantment?: number };
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] }>;
};

const PROCESSING_FEE = 5;
const COMPONENT_PRICE = 25;
const COMPONENT_BLOCK_PRICE = 60;
const BLOCK_SIZE = 3;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOWUP_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

type Unit = { base: number; cursed: boolean; highEnchant: boolean };

const isComponent = (item: Item): boolean => !(item.type in BASE_PREMIUMS);

const partitionItems = (items: Item[]): { components: Item[]; insured: Item[] } =>
  items.reduce<{ components: Item[]; insured: Item[] }>(
    (acc, it) => {
      (isComponent(it) ? acc.components : acc.insured).push(it);
      return acc;
    },
    { components: [], insured: [] },
  );

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, it) => counts.set(it.type, (counts.get(it.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const plainUnit = (base: number): Unit => ({ base, cursed: false, highEnchant: false });

const componentUnits = (count: number): Unit[] =>
  count === BLOCK_SIZE
    ? [plainUnit(COMPONENT_BLOCK_PRICE)]
    : Array.from({ length: count }, () => plainUnit(COMPONENT_PRICE));

const insuredUnit = (it: Item): Unit => ({
  base: BASE_PREMIUMS[it.type],
  cursed: it.cursed === true,
  highEnchant: (it.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD,
});

const buildUnits = (items: Item[]): Unit[] => {
  const { components, insured } = partitionItems(items);
  const componentCounts = Array.from(countByType(components).values());
  return componentCounts.flatMap(componentUnits).concat(insured.map(insuredUnit));
};

const surcharge = (base: number, applies: boolean, rate: number): number =>
  applies ? base * rate : 0;

const unitPremium = (u: Unit): number =>
  u.base
  + u.base * FIRST_INSURANCE_RATE
  + surcharge(u.base, u.cursed, CURSE_RATE)
  + surcharge(u.base, u.highEnchant, HIGH_ENCHANT_RATE);

type Customer = { yearsWithMHPCO: number };

const policyDiscountRate = (customer: Customer, isFollowUp: boolean): number =>
  (customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_RATE : 0)
  + (isFollowUp ? FOLLOWUP_RATE : 0);

const quote = (items: Item[], customer: Customer, isFollowUp: boolean): { premium: number } => {
  const totals = buildUnits(items).reduce(
    (acc, u) => ({ base: acc.base + u.base, premium: acc.premium + unitPremium(u) }),
    { base: 0, premium: 0 },
  );
  const discount = totals.base * policyDiscountRate(customer, isFollowUp);
  return { premium: Math.ceil(totals.premium - discount + PROCESSING_FEE) };
};

export const runScenario = (input: Scenario): { results: unknown[] } => ({
  results: input.steps.map((step, index) => quote(step.items, input.customer, index > 0)),
});
