interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Damage {
  type: string;
  amount: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policyIndex: number;
  damages: Damage[];
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
}

interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
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

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const itemBasePremium = (item: Item): number =>
  BASE_PREMIUMS[item.type] ?? 0;

const itemPremiumWithModifiers = (item: Item): number =>
  itemBasePremium(item) * (1 + (item.cursed ? 0.5 : 0) + ((item.enchantment ?? 0) >= 5 ? 0.3 : 0));

const regularItems = (items: Item[]): Item[] =>
  items.filter((item) => !isComponent(item));

const regularItemsPremium = (items: Item[]): number =>
  regularItems(items)
    .reduce((sum, item) => sum + itemPremiumWithModifiers(item), 0);

const componentBlockPremium = (count: number, type: string): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];

const countByType = (entries: { type: string }[]): Record<string, number> =>
  entries.reduce(
    (acc: Record<string, number>, entry) => ({
      ...acc,
      [entry.type]: (acc[entry.type] ?? 0) + 1,
    }),
    {},
  );

const countComponentsByType = (items: Item[]): Record<string, number> =>
  countByType(items.filter(isComponent));

const componentsPremium = (items: Item[]): number =>
  Object.entries(countComponentsByType(items)).reduce(
    (sum, [type, count]) => sum + componentBlockPremium(count, type),
    0,
  );

const policyBasePremium = (items: Item[]): number =>
  regularItems(items)
    .reduce((sum, item) => sum + itemBasePremium(item), 0)
  + componentsPremium(items);

const policyWideModifierRate = (customer: Customer, quoteIndex: number): number =>
  0.1 + (customer.yearsWithMHPCO >= 2 ? -0.2 : 0) + (quoteIndex > 0 ? -0.15 : 0);

const validateItemTypes = (items: Item[]): void => {
  const unknownItem = items.find((item) => !(item.type in BASE_PREMIUMS));
  if (unknownItem) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
};

const calculateQuotePremium = (items: Item[], customer: Customer, quoteIndex: number): number => {
  validateItemTypes(items);
  const itemsTotal = regularItemsPremium(items) + componentsPremium(items);
  const policyModifier = policyBasePremium(items) * policyWideModifierRate(customer, quoteIndex);
  return Math.ceil(itemsTotal + policyModifier + PROCESSING_FEE);
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const reimbursableAmount = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((i) => i.type === damage.type)!;
  const amount = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
  return Math.max(0, amount - DEDUCTIBLE);
};

const insuranceSum = (policyItems: Item[]): number =>
  policyItems.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

const validateDamages = (damages: Damage[], policyItems: Item[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const damageCounts = countByType(damages);
  const policyCounts = countByType(policyItems);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(
        (policyCounts[type] ?? 0) === 0
          ? `Damage to item not covered by policy: ${type}`
          : `More damage entries for ${type} than policy covers`,
      );
    }
  }
};

const calculateClaimPayout = (damages: Damage[], policyItems: Item[], remainingCap: number): number => {
  validateDamages(damages, policyItems);
  return Math.min(
    damages.reduce((sum, d) => sum + reimbursableAmount(d, policyItems), 0),
    remainingCap,
  );
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Item[][] = [];
  const remainingCaps: number[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "claim") {
      const policyItems = policies[step.policyIndex];
      const payout = calculateClaimPayout(step.damages, policyItems, remainingCaps[step.policyIndex]);
      remainingCaps[step.policyIndex] -= payout;
      return { payout };
    }
    const premium = calculateQuotePremium(step.items, scenario.customer, policies.length);
    policies.push(step.items);
    remainingCaps.push(CAP_MULTIPLIER * insuranceSum(step.items));
    return { premium };
  });
  return { results };
};
