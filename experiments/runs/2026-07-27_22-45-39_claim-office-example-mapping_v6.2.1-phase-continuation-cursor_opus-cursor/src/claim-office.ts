const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

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

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const componentGroupBase = (count: number): number => {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_UNIT_PREMIUM;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemBasePremium = (item: Item): number => {
  if (isComponent(item)) {
    return COMPONENT_UNIT_PREMIUM;
  }
  if (item.type in BASE_PREMIUMS) {
    return BASE_PREMIUMS[item.type];
  }
  throw new Error(`Unknown item type: ${item.type}`);
};

const basePremium = (items: Item[]): number => {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += itemBasePremium(item);
    }
  }
  for (const count of Object.values(componentCounts)) {
    total += componentGroupBase(count);
  }
  return total;
};

const SURCHARGE_RULES: { rate: number; applies: (item: Item) => boolean }[] = [
  { rate: CURSE_RATE, applies: (item) => item.cursed === true },
  {
    rate: HIGH_ENCHANTMENT_RATE,
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
  },
];

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  return SURCHARGE_RULES.filter((rule) => rule.applies(item)).reduce(
    (sum, rule) => sum + base * rule.rate,
    0,
  );
};

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const base = basePremium(items);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty = isLoyal(customer) ? base * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  return Math.ceil(
    base + firstInsurance - loyalty - followUp + surcharges + PROCESSING_FEE,
  );
};

const itemInsuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type];

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

interface Policy {
  items: Item[];
  remainingCap: number;
}

const reimbursementBeforeDeductible = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damage.amount;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursementBeforeDeductible(damage, item) - DEDUCTIBLE);

const validateDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Claim rejected: negative damage amount ${damage.amount}`);
  }
};

const consumeInsuredItem = (available: Item[], damage: Damage): Item => {
  const index = available.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(
      `Claim rejected: no insured ${damage.itemType} available for this damage`,
    );
  }
  const [item] = available.splice(index, 1);
  return item;
};

const claimResult = (
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } => {
  const available = [...policy.items];
  const rawPayout = damages.reduce((sum, damage) => {
    validateDamage(damage);
    return sum + damagePayout(damage, consumeInsuredItem(available, damage));
  }, 0);
  const flooredPayout = Math.floor(rawPayout);
  const payout = Math.min(flooredPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  policy.remainingCap = remainingCap;
  return { payout, remainingCap };
};

export const processScenario = (scenario: Scenario): { results: unknown[] } => {
  let hasQuotedBefore = false;
  const policies: Record<number, Policy> = {};

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = hasQuotedBefore;
      hasQuotedBefore = true;
      policies[index] = {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      };
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    }
    return claimResult(policies[step.policy], step.incident.damages);
  });
  return { results };
};
