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
  op: 'quote';
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: 'claim';
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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function itemSurcharges(item: Item): number {
  const base = BASE_PREMIUMS[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

function policyBase(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += BASE_PREMIUMS[item.type];
    }
  }

  for (const [type, count] of componentCounts) {
    total +=
      count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];
  }

  return total;
}

function quote(step: QuoteStep, customer: Customer, previousQuotes: number): QuoteResult {
  for (const item of step.items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }

  const base = policyBase(step.items);
  let premium = base + step.items.reduce((sum, item) => sum + itemSurcharges(item), 0);

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= base * LOYALTY_DISCOUNT;
  }
  premium += base * FIRST_INSURANCE_SURCHARGE;
  if (previousQuotes > 0) {
    premium -= base * FOLLOW_UP_DISCOUNT;
  }

  return { premium: Math.ceil(premium + PROCESSING_FEE) };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function claim(step: ClaimStep, policy: Policy): ClaimResult {
  let payout = 0;
  const available = [...policy.items];

  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by the policy: ${damage.itemType}`);
    }
    const [item] = available.splice(index, 1);
    let reimbursed = damage.amount;
    if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
      reimbursed *= HALF_REIMBURSEMENT_RATE;
    }
    payout += Math.max(0, reimbursed - DEDUCTIBLE);
  }

  payout = Math.floor(Math.min(payout, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy)!;
      return claim(step, policy);
    }

    const result = quote(step, scenario.customer, quoteCount);
    quoteCount += 1;
    policies.set(index, {
      items: step.items,
      remainingCap:
        CAP_MULTIPLIER *
        step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0),
    });
    return result;
  });

  return { results };
}
