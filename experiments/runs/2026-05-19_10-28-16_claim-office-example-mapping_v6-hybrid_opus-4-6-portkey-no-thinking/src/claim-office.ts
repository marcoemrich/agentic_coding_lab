// MHPCO Claim Office — implementation

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Step {
  op: string;
  items?: Item[];
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const isComponent = (item: Item): boolean =>
  BASE_PREMIUM[item.type] === undefined;

const countByType = (items: Item[]): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});

const calculateComponentPremium = (components: Item[]): number =>
  Object.values(countByType(components)).reduce(
    (total, count) =>
      total + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );

const calculateItemSurcharge = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const calculateQuotePremium = (items: Item[], customer: { yearsWithMHPCO: number }, isFollowUp: boolean): number => {
  const standardItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);

  const standardBase = standardItems.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const componentBase = calculateComponentPremium(components);
  const policyBase = standardBase + componentBase;

  const itemSurcharges = standardItems.reduce((sum, item) => sum + calculateItemSurcharge(item), 0);

  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE;
  const policyWideModifier = firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;

  return Math.ceil(policyBase + itemSurcharges + policyWideModifier + PROCESSING_FEE);
};

export function processScenario(scenario: unknown): unknown {
  const { customer, steps } = scenario as Scenario;
  let quoteCount = 0;
  const results = steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const items = step.items ?? [];
      return { premium: calculateQuotePremium(items, customer, isFollowUp) };
    }
    return {};
  });
  return { results };
}
