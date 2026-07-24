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
export interface DamageLine {
  itemType: string;
  amount: number;
}
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageLine[] };
}
export type Step = QuoteStep | ClaimStep;
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
export type StepResult = { premium: number } | { payout: number; remainingCap: number };
export interface ScenarioResult {
  results: StepResult[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const FIRST_TIME_SURCHARGE = 1.1;
const REPEAT_CONTRACT_DISCOUNT = 0.85;
const LOYALTY_DISCOUNT = 0.8;
const LOYALTY_YEARS = 2;
const PROCESSING_FEE = 5;

// Round up to whole gold (in MHPCO's favor), guarding against binary FP noise.
const roundInMHPCOFavor = (amount: number): number =>
  Math.ceil(Math.round(amount * 100) / 100);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;

const CURSED_SURCHARGE = 1.5;
const HIGH_ENCHANT_SURCHARGE = 1.3;
const HIGH_ENCHANT_THRESHOLD = 5;

// Per-item multiplicative factor (cursed and high enchantment) applied to base premium.
const itemMultiplier = (item: Item): number => {
  const cursedFactor = item.cursed ? CURSED_SURCHARGE : 1;
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD;
  const enchantFactor = isHighlyEnchanted ? HIGH_ENCHANT_SURCHARGE : 1;
  return cursedFactor * enchantFactor;
};

const basePremiumForType = (type: string): number => BASE_PREMIUMS[type] ?? 0;
const basePremiumFor = (item: Item): number => basePremiumForType(item.type) * itemMultiplier(item);

// 3 alike components (rune/moonstone) form a block priced at COMPONENT_BLOCK_BASE;
// leftover singles are billed at the component's normal base premium.
const componentBlockPremium = (type: string, count: number): number => {
  const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
  const singles = count % COMPONENT_BLOCK_SIZE;
  return blocks * COMPONENT_BLOCK_BASE + singles * basePremiumForType(type);
};

const basePremiumForItems = (items: Item[]): number => {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += basePremiumFor(item);
    }
  }
  for (const [type, count] of componentCounts) {
    total += componentBlockPremium(type, count);
  }
  return total;
};

// Customer-level multiplicative factor: loyal customers get a discount.
const loyaltyFactor = (customer: { yearsWithMHPCO: number }): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT : 1;

const contractFactor = (contractIndex: number): number =>
  contractIndex === 0 ? FIRST_TIME_SURCHARGE : REPEAT_CONTRACT_DISCOUNT;

const quote = (items: Item[], customer: { yearsWithMHPCO: number }, contractIndex: number): number => {
  const baseTotal = basePremiumForItems(items);
  return roundInMHPCOFavor(baseTotal * loyaltyFactor(customer) * contractFactor(contractIndex)) + PROCESSING_FEE;
};

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

// A policy's total lifetime payout cap is 2x the sum of insured values of the covered items.
const POLICY_CAP_MULTIPLIER = 2;
const policyCapFor = (items: Item[]): number => POLICY_CAP_MULTIPLIER * insuranceSum(items);

const DEDUCTIBLE = 100;

const reimbursementRate = (item: Item): number => {
  if (item.material === "dragon") return 1;
  if ((item.enchantment ?? 0) >= 8) return 0.5;
  return 0;
};

const reimbursableAmount = (policy: PolicyState, dmg: DamageLine): number => {
  const item = policy.items.find((i) => i.type === dmg.itemType);
  return item ? dmg.amount * reimbursementRate(item) : 0;
};

const computePayout = (policy: PolicyState, damages: DamageLine[]): number => {
  const gross = damages.reduce((sum, dmg) => sum + reimbursableAmount(policy, dmg), 0);
  const net = Math.max(0, gross - DEDUCTIBLE);
  return Math.floor(Math.min(net, policy.remainingCap));
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, PolicyState>();
  let contractIndex = 0;
  const results: StepResult[] = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quote(step.items, scenario.customer, contractIndex);
      contractIndex += 1;
      policies.set(stepIndex, { items: step.items, remainingCap: policyCapFor(step.items) });
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    const payout = computePayout(policy, step.incident.damages);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
