interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

interface ScenarioResult {
  results: StepResult[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const BUILDING_BLOCK_SIZE = 3;
const CURSED_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const MULTI_CONTRACT_DISCOUNT_RATE = 0.15;
const INITIAL_ASSESSMENT_RATE = 0.1;
const PROCESSING_FEE = 5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function calculateItemsPremium(items: Item[]): number {
  let total = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    const mainItemPremium = BASE_PREMIUMS[item.type];
    if (mainItemPremium !== undefined) {
      let itemPremium = mainItemPremium;
      if (item.cursed) {
        itemPremium += Math.ceil(mainItemPremium * CURSED_SURCHARGE_RATE);
      }
      if (item.enchantment >= ENCHANTMENT_THRESHOLD) {
        itemPremium += Math.ceil(mainItemPremium * ENCHANTMENT_SURCHARGE_RATE);
      }
      total += itemPremium;
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }

  for (const count of Object.values(componentCounts)) {
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const remainder = count % BUILDING_BLOCK_SIZE;
    total += blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_BASE_PREMIUM;
  }

  return total;
}

function calculateInsuranceSum(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const value = INSURANCE_VALUES[item.type];
    if (value !== undefined) {
      total += value;
    } else {
      total += COMPONENT_INSURANCE_VALUE;
    }
  }
  return total;
}

interface Policy {
  remainingCap: number;
  items: Item[];
}

function processClaim(step: ClaimStep, policy: Policy): ClaimResult {
  let reimbursable = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    if (item && item.material !== "dragon" && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      reimbursable += Math.floor(damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE);
    } else {
      reimbursable += damage.amount;
    }
  }
  const payout = Math.min(Math.max(0, reimbursable - DEDUCTIBLE), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const { customer } = scenario;
  let quoteCount = 0;
  const policies: Map<number, Policy> = new Map();
  const results: StepResult[] = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return processClaim(step, policies.get(step.policy)!);
    }
    let premium = calculateItemsPremium(step.items);
    if (customer.yearsWithMHPCO === 0) {
      premium += Math.ceil(premium * INITIAL_ASSESSMENT_RATE);
    }
    if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
      premium -= Math.floor(premium * LOYALTY_DISCOUNT_RATE);
    }
    if (quoteCount > 0) {
      premium -= Math.floor(premium * MULTI_CONTRACT_DISCOUNT_RATE);
    }
    quoteCount++;
    premium += PROCESSING_FEE;
    policies.set(stepIndex, {
      remainingCap: calculateInsuranceSum(step.items) * 2,
      items: step.items,
    });
    return { premium };
  });
  return { results };
}
