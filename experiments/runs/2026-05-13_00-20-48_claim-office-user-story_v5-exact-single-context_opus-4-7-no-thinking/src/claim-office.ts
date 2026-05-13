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

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const AFTER_FIRST_DISCOUNT = 0.15;

function ceilFavor(amount: number): number {
  return Math.ceil(Math.round(amount * 100) / 100);
}

const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_BASE_PREMIUM = 60;
const BUILDING_BLOCK_SIZE = 3;

function isMainItem(item: Item): boolean {
  return item.type in BASE_PREMIUM;
}

function componentsBaseSum(components: Item[]): number {
  // Group by type; every 3 alike components form a building block (60 G).
  const byType = new Map<string, number>();
  for (const c of components) {
    byType.set(c.type, (byType.get(c.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of byType.values()) {
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const remaining = count % BUILDING_BLOCK_SIZE;
    total += blocks * BUILDING_BLOCK_BASE_PREMIUM + remaining * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

function itemRiskMultiplier(item: Item): number {
  let mult = 1;
  if (item.cursed) mult += CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    mult += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return mult;
}

function customerMultiplier(customer: Customer, contractIndex: number): number {
  let mult = 1;
  if (contractIndex === 0) {
    mult *= 1 + FIRST_INSURANCE_SURCHARGE;
  } else {
    mult *= 1 - AFTER_FIRST_DISCOUNT;
  }
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    mult *= 1 - LOYALTY_DISCOUNT;
  }
  return mult;
}

function quotePremium(items: Item[], customer: Customer, contractIndex: number): number {
  const mains = items.filter(isMainItem);
  const components = items.filter((i) => !isMainItem(i));
  const baseTotal =
    mains.reduce((s, item) => s + BASE_PREMIUM[item.type] * itemRiskMultiplier(item), 0) +
    componentsBaseSum(components);
  return ceilFavor(baseTotal * customerMultiplier(customer, contractIndex)) + PROCESSING_FEE;
}

interface Policy {
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce(
    (s, item) => s + (INSURANCE_VALUE[item.type] ?? COMPONENT_INSURANCE_VALUE),
    0,
  );
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const totalDamage = incident.damages.reduce((s, d) => s + d.amount, 0);
  const beforeCap = Math.max(0, totalDamage - DEDUCTIBLE);
  const payout = Math.min(beforeCap, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let contractIndex = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, contractIndex);
      contractIndex++;
      const sum = insuranceSum(step.items);
      policies.push({
        items: step.items,
        insuranceSum: sum,
        remainingCap: CAP_MULTIPLIER * sum,
      });
      return { premium };
    }
    if (step.op === "claim") {
      return processClaim(policies[step.policy], step.incident);
    }
    throw new Error(`Unknown op: ${(step as Step).op}`);
  });
  return { results };
}
