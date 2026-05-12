interface Item {
  type: string;
  componentType?: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

interface ScenarioOutput {
  results: StepResult[];
}

interface Policy {
  insuranceSum: number;
  remainingCap: number;
  items: Item[];
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
  component: 250,
};

const DEDUCTIBLE = 100;

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE_PERCENT = 10;
const MULTI_CONTRACT_DISCOUNT_PERCENT = 15;
const LOYALTY_DISCOUNT_PERCENT = 20;
const COMPONENT_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const BUILDING_BLOCK_SIZE = 3;

function calculateItemTotal(items: Item[]): number {
  let premium = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (item.type === "component" && item.componentType) {
      componentCounts[item.componentType] = (componentCounts[item.componentType] ?? 0) + 1;
    } else {
      const baseItemPremium = BASE_PREMIUMS[item.type] ?? 0;
      let itemPremium = baseItemPremium;
      if (item.cursed) {
        itemPremium += Math.ceil(baseItemPremium * 50 / 100);
      }
      if ((item.enchantment ?? 0) >= 5) {
        itemPremium += Math.ceil(baseItemPremium * 30 / 100);
      }
      premium += itemPremium;
    }
  }

  for (const count of Object.values(componentCounts)) {
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const remainder = count % BUILDING_BLOCK_SIZE;
    premium += blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_PREMIUM;
  }

  return premium;
}

function calculateInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    sum += INSURANCE_VALUES[item.type] ?? 0;
  }
  return sum;
}

function processQuote(items: Item[], isFirstQuote: boolean, customer: Customer): { premium: number } {
  const itemTotal = calculateItemTotal(items);
  let premiumBeforeFee = itemTotal;
  if (isFirstQuote) {
    premiumBeforeFee += Math.ceil(itemTotal * INITIAL_ASSESSMENT_SURCHARGE_PERCENT / 100);
  } else {
    premiumBeforeFee -= Math.floor(premiumBeforeFee * MULTI_CONTRACT_DISCOUNT_PERCENT / 100);
  }
  if (customer.yearsWithMHPCO >= 2) {
    premiumBeforeFee -= Math.floor(premiumBeforeFee * LOYALTY_DISCOUNT_PERCENT / 100);
  }
  return { premium: premiumBeforeFee + PROCESSING_FEE };
}

function processClaim(step: Step, policy: Policy): { payout: number; remainingCap: number } {
  let payout = 0;
  for (const damage of step.incident!.damages) {
    const insuredItem = policy.items.find(item => item.type === damage.itemType);
    const isDragonMaterial = insuredItem?.material === "dragon";
    const isHighlyEnchanted = (insuredItem?.enchantment ?? 0) >= 8;
    let reimbursement = damage.amount;
    if (isHighlyEnchanted && !isDragonMaterial) {
      reimbursement = Math.floor(reimbursement * 50 / 100);
    }
    payout += Math.max(0, reimbursement - DEDUCTIBLE);
  }
  payout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: unknown): ScenarioOutput {
  const input = scenario as Scenario;
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let isFirstQuote = true;
  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];
    if (step.op === "quote") {
      const items = step.items!;
      results.push(processQuote(items, isFirstQuote, input.customer));
      const insuranceSum = calculateInsuranceSum(items);
      policies[i] = { insuranceSum, remainingCap: insuranceSum * 2, items };
      isFirstQuote = false;
    } else if (step.op === "claim") {
      results.push(processClaim(step, policies[step.policy!]));
    }
  }
  return { results };
}
