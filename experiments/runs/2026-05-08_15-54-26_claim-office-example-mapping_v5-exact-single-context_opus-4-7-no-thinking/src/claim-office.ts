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

export interface ScenarioOutput {
  results: StepResult[];
}

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemBasePremium = (item: Item): number => {
  if (isComponent(item)) return COMPONENT_BASE_PREMIUM;
  const base = BASE_PREMIUMS[item.type];
  if (base === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return base;
};

const itemInsuranceValue = (item: Item): number => {
  if (isComponent(item)) return COMPONENT_INSURANCE;
  const value = INSURANCE_VALUES[item.type];
  if (value === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return value;
};

const policyBasePremium = (items: Item[]): number => {
  const componentCounts: Record<string, number> = {};
  let nonComponentTotal = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      nonComponentTotal += itemBasePremium(item);
    }
  }
  let componentTotal = 0;
  for (const count of Object.values(componentCounts)) {
    componentTotal += count === 3 ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return nonComponentTotal + componentTotal;
};

const itemModifiers = (item: Item): number => {
  let mod = 0;
  const base = itemBasePremium(item);
  if (item.cursed) mod += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) mod += base * 0.3;
  return mod;
};

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const buildPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * 2 };
};

const findItemForDamage = (policy: Policy, damage: Damage, usedIndices: Set<number>): Item => {
  for (let i = 0; i < policy.items.length; i++) {
    if (usedIndices.has(i)) continue;
    if (policy.items[i].type === damage.itemType) {
      usedIndices.add(i);
      return policy.items[i];
    }
  }
  throw new Error(`Damage references item type '${damage.itemType}' not in policy`);
};

const computeDamagePayout = (item: Item, damageAmount: number): number => {
  if (damageAmount < 0) throw new Error("Damage amount cannot be negative");
  const highEnch = (item.enchantment ?? 0) >= 8;
  const dragon = item.material === "dragon";
  // When both clauses apply, the 50% rule wins (per spec)
  let reimbursable: number;
  if (highEnch) reimbursable = damageAmount * 0.5;
  else if (dragon) reimbursable = damageAmount;
  else reimbursable = damageAmount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const usedIndices = new Set<number>();
  let totalPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const item = findItemForDamage(policy, damage, usedIndices);
    let perDamage = computeDamagePayout(item, damage.amount);
    // Cap exhaustion: payout limited by remaining cap
    if (totalPayout + perDamage > policy.remainingCap) {
      perDamage = policy.remainingCap - totalPayout;
    }
    totalPayout += perDamage;
  }
  const flooredPayout = Math.floor(totalPayout);
  policy.remainingCap -= flooredPayout;
  return { payout: flooredPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  let quoteCount = 0;
  const policies: Map<number, Policy> = new Map();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const policyBase = policyBasePremium(step.items);
      const itemSurcharges = step.items.reduce((sum, item) => sum + itemModifiers(item), 0);
      const firstInsurance = policyBase * 0.1;
      const loyalty = scenario.customer.yearsWithMHPCO >= 2 ? policyBase * 0.2 : 0;
      const followUp = isFollowUp ? policyBase * 0.15 : 0;
      const total = policyBase + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE;
      // Build policy snapshot (using items so claims can reference)
      policies.set(index, buildPolicy(step.items));
      return { premium: Math.ceil(total) };
    }
    // claim
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy at index ${step.policy} not found`);
    return processClaim(policy, step.incident);
  });
  return { results };
};
