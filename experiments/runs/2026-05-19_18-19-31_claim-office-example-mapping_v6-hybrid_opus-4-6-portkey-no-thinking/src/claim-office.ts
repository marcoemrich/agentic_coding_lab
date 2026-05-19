type Customer = {
  yearsWithMHPCO: number;
};

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Step = {
  op: "quote";
  items: Item[];
};

type Scenario = {
  customer: Customer;
  steps: Step[];
};

type QuoteResult = {
  premium: number;
};

type ScenarioOutput = {
  results: QuoteResult[];
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const basePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurcharge = (item: Item): number => {
  const base = basePremium(item);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const calculateComponentPremiums = (components: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(components)) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * (BASE_PREMIUMS[type] ?? 0);
  }
  return total;
};

export const processScenario = (scenario: Scenario): ScenarioOutput => {
  const results = scenario.steps.map((step) => {
    const mainItems = step.items.filter((item) => !isComponent(item));
    const components = step.items.filter(isComponent);

    const mainBasePremiums = mainItems.reduce(
      (sum, item) => sum + basePremium(item),
      0,
    );
    const componentBasePremiums = calculateComponentPremiums(components);
    const policyBase = mainBasePremiums + componentBasePremiums;

    const itemSurcharges = mainItems.reduce(
      (sum, item) => sum + itemSurcharge(item),
      0,
    );

    const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
    const policyModifier = policyBase * FIRST_INSURANCE_RATE - loyaltyDiscount;

    const premium = Math.ceil(policyBase + itemSurcharges + policyModifier + PROCESSING_FEE);
    return { premium };
  });
  return { results };
};
