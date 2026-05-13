export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface Result {
  results: StepResult[];
}

const MAIN_ITEM_TYPES = ["sword", "amulet", "staff", "potion"] as const;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_BASE_PREMIUM = 25;
const BUNDLE_SIZE = 3;
const BUNDLE_BASE_PREMIUM = 60;

const isMainItem = (item: Item): boolean =>
  (MAIN_ITEM_TYPES as readonly string[]).includes(item.type);

const componentsBasePremium = (components: Item[]): number => {
  // Group alike components and apply bundle discount per group of 3
  const groups = new Map<string, number>();
  for (const c of components) {
    groups.set(c.type, (groups.get(c.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of groups.values()) {
    const bundles = Math.floor(count / BUNDLE_SIZE);
    const singles = count % BUNDLE_SIZE;
    total += bundles * BUNDLE_BASE_PREMIUM + singles * COMPONENT_BASE_PREMIUM;
  }
  return total;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const AFTER_FIRST_CONTRACT_DISCOUNT = 0.15;
const FP_EPSILON = 1e-9;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const itemInsuranceValue = (item: Item): number =>
  isMainItem(item) ? INSURANCE_VALUES[item.type] : COMPONENT_INSURANCE_VALUE;

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const itemRiskMultiplier = (item: Item): number => {
  let multiplier = 1;
  if (item.cursed) multiplier += CURSED_SURCHARGE;
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD)
    multiplier += HIGH_ENCHANTMENT_SURCHARGE;
  return multiplier;
};

const computeBase = (items: Item[]): number => {
  const mains = items.filter(isMainItem);
  const components = items.filter((i) => !isMainItem(i));
  const mainBase = mains.reduce(
    (sum, item) => sum + BASE_PREMIUMS[item.type] * itemRiskMultiplier(item),
    0,
  );
  return mainBase + componentsBasePremium(components);
};

const computeQuote = (
  step: QuoteStep,
  customer: Customer,
  isFirstQuote: boolean,
): QuoteResult => {
  const base = computeBase(step.items);
  let premium = base;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    premium *= 1 - LOYALTY_DISCOUNT;
  }
  if (isFirstQuote) {
    premium *= 1 + FIRST_INSURANCE_SURCHARGE;
  } else {
    premium *= 1 - AFTER_FIRST_CONTRACT_DISCOUNT;
  }
  premium += PROCESSING_FEE;
  return { premium: Math.ceil(premium - FP_EPSILON) };
};

const findDamagedItem = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((item) => item.type === itemType);

const reimbursementForDamage = (policy: Policy, damage: Damage): number => {
  const item = findDamagedItem(policy, damage.itemType);
  if (item && item.enchantment >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const computeClaim = (step: ClaimStep, policies: Map<number, Policy>): ClaimResult => {
  const policy = policies.get(step.policy);
  if (!policy) {
    return { payout: 0, remainingCap: 0 };
  }
  const rawPayout = step.incident.damages.reduce(
    (sum, d) => sum + reimbursementForDamage(policy, d),
    0,
  );
  const afterDeductible = Math.max(0, rawPayout - DEDUCTIBLE);
  const payout = Math.min(afterDeductible, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): Result => {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFirstQuote = quoteCount === 0;
      quoteCount += 1;
      const insuranceSum = step.items.reduce(
        (sum, item) => sum + itemInsuranceValue(item),
        0,
      );
      policies.set(index, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      });
      return computeQuote(step, scenario.customer, isFirstQuote);
    }
    return computeClaim(step, policies);
  });
  return { results };
};
