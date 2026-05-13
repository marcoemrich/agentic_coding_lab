export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
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

export interface ScenarioResult {
  results: StepResult[];
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

const insuranceValueForItem = (item: Item): number =>
  INSURANCE_VALUE[item.type] ?? COMPONENT_INSURANCE_VALUE;

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueForItem(item), 0);

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => !(item.type in BASE_PREMIUM);

const baseForItem = (item: Item): number =>
  BASE_PREMIUM[item.type] ?? COMPONENT_BASE_PREMIUM;

const riskMultiplier = (item: Item): number => {
  let multiplier = 1;
  if (item.cursed) multiplier *= 1.5;
  if ((item.enchantment ?? 0) >= 5) multiplier *= 1.3;
  return multiplier;
};

const basePremiumForItems = (items: Item[]): number => {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += baseForItem(item) * riskMultiplier(item);
    }
  }
  for (const count of componentCounts.values()) {
    const blocks = Math.floor(count / 3);
    const singles = count - blocks * 3;
    total += blocks * COMPONENT_BLOCK_BASE_PREMIUM + singles * COMPONENT_BASE_PREMIUM;
  }
  return total;
};

const roundUpInMHPCOFavor = (amount: number): number =>
  Math.ceil(Math.round(amount * 1e6) / 1e6);

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const loyaltyMultiplier = scenario.customer.yearsWithMHPCO >= 2 ? 0.8 : 1;
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const contractMultiplier = quoteCount === 0 ? 1.1 : 0.85;
      quoteCount += 1;
      const base = basePremiumForItems(step.items);
      const premium = roundUpInMHPCOFavor(
        base * contractMultiplier * loyaltyMultiplier + 5,
      );
      const insuranceSum = insuranceSumForItems(step.items);
      policies.set(index, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      });
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    let dragonReimbursable = 0;
    let standardReimbursable = 0;
    for (const d of step.incident.damages) {
      const item = policy.items.find((i) => i.type === d.itemType);
      if (item?.material === "dragon") {
        dragonReimbursable += d.amount;
      } else {
        const rate = item && (item.enchantment ?? 0) >= 8 ? 0.5 : 1;
        standardReimbursable += d.amount * rate;
      }
    }
    const standardAfterDeductible = Math.max(0, standardReimbursable - DEDUCTIBLE);
    const totalReimbursable = dragonReimbursable + standardAfterDeductible;
    const payout = Math.min(totalReimbursable, policy.remainingCap);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
