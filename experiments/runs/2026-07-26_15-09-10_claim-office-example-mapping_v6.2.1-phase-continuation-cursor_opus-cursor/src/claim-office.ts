export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const PROCESSING_FEE = 5;

const componentBasePremium = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_BASE_PREMIUM;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurcharge = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_RATE;
  }
  return surcharge;
};

const isKnownType = (type: string): boolean =>
  COMPONENT_TYPES.has(type) || type in BASE_PREMIUM;

const policyBasePremium = (items: Item[]): number => {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += BASE_PREMIUM[item.type];
    }
  }
  for (const count of Object.values(componentCounts)) {
    total += componentBasePremium(count);
  }
  return total;
};

const itemSurchargesTotal = (items: Item[]): number =>
  items
    .filter((item) => !COMPONENT_TYPES.has(item.type))
    .reduce((sum, item) => sum + itemSurcharge(item), 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

export const quote = (
  customer: Customer,
  items: Item[],
  contractIndex: number,
): number => {
  const policyBase = policyBasePremium(items);
  let premium = policyBase + itemSurchargesTotal(items);
  premium += policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (contractIndex > 0) {
    premium -= policyBase * FOLLOWUP_DISCOUNT_RATE;
  }
  return Math.ceil(premium + PROCESSING_FEE);
};

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;

const itemInsuranceValue = (item: Item): number => {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUE[item.type];
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const reimbursement = (item: Item, amount: number): number => {
  let reimbursed = amount;
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
    reimbursed = amount * HALF_REIMBURSEMENT_RATE;
  }
  return reimbursed - DEDUCTIBLE;
};

export const claim = (
  items: Item[],
  incident: Incident,
  capRemaining: number = insuranceSum(items) * CAP_MULTIPLIER,
): ClaimResult => {
  const available = [...items];
  let desired = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const index = available.findIndex((i) => i.type === damage.itemType);
    if (index === -1) {
      throw new Error(`No insured item for damage: ${damage.itemType}`);
    }
    const [item] = available.splice(index, 1);
    desired += reimbursement(item, damage.amount);
  }
  const payout = Math.floor(Math.min(desired, capRemaining));
  return { payout, remainingCap: capRemaining - payout };
};

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export type StepResult = { premium: number } | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const results: StepResult[] = [];
  const policyItems: Record<number, Item[]> = {};
  const policyCap: Record<number, number> = {};
  let quoteCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quote(scenario.customer, step.items, quoteCount) });
      policyItems[stepIndex] = step.items;
      quoteCount += 1;
    } else {
      const items = policyItems[step.policy];
      if (items === undefined) {
        throw new Error(`Claim references unknown policy: ${step.policy}`);
      }
      const result = claim(items, step.incident, policyCap[step.policy]);
      policyCap[step.policy] = result.remainingCap;
      results.push(result);
    }
  });

  return { results };
};
