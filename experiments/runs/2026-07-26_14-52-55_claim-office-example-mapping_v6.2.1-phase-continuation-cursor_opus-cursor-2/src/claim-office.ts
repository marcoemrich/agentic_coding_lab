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
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE = 60;

const PROCESSING_FEE = 5;

const componentBasePremium = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE;
  }
  return count * COMPONENT_BASE;
};

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM || COMPONENT_TYPES.has(type);

const policyBasePremium = (items: Item[]): number => {
  let base = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      base += BASE_PREMIUM[item.type];
    }
  }
  for (const count of Object.values(componentCounts)) {
    base += componentBasePremium(count);
  }
  return base;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const itemSurcharges = (items: Item[]): number => {
  let surcharge = 0;
  for (const item of items) {
    const base = BASE_PREMIUM[item.type];
    if (item.cursed) {
      surcharge += base * CURSE_SURCHARGE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharge;
};

const quotePremium = (step: QuoteStep, customer: Customer, contractIndex: number): number => {
  const base = policyBasePremium(step.items);
  const surcharges = itemSurcharges(step.items);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followupDiscount = contractIndex > 0 ? base * FOLLOWUP_DISCOUNT_RATE : 0;
  const total =
    base + surcharges + firstInsurance - loyaltyDiscount - followupDiscount + PROCESSING_FEE;
  return Math.ceil(total);
};

const itemInsuranceValue = (item: Item): number =>
  COMPONENT_TYPES.has(item.type) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUE[item.type];

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

interface Policy {
  items: Item[];
  remainingCap: number;
}

const damagePayout = (damage: Damage, item: Item): number => {
  let reimbursed = damage.amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    reimbursed = damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const countByType = (types: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const type of types) {
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
};

const assertNonNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
};

const validateClaim = (step: ClaimStep, policy: Policy): void => {
  assertNonNegativeDamages(step.incident.damages);
  const insuredCounts = countByType(policy.items.map((item) => item.type));
  const damageCounts = countByType(step.incident.damages.map((damage) => damage.itemType));
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const insured = insuredCounts[itemType] ?? 0;
    if (count > insured) {
      throw new Error(
        `Claim rejected: ${count} ${itemType} damages but only ${insured} insured`,
      );
    }
  }
};

const processClaim = (step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } => {
  validateClaim(step, policy);
  let rawPayout = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType)!;
    rawPayout += damagePayout(damage, item);
  }
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  let quoteCount = 0;
  const policiesByStep: Record<number, Policy> = {};
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quotePremium(step, scenario.customer, quoteCount);
      quoteCount += 1;
      policiesByStep[stepIndex] = {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      };
      return { premium };
    }
    return processClaim(step, policiesByStep[step.policy]);
  });
  return { results };
};
