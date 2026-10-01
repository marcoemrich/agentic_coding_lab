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

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export class ScenarioError extends Error {}

const PROCESSING_FEE = 5;
// Percentages are kept as integers so intermediate amounts stay exact
// (amounts below are in hundredths of a G until the final rounding).
const FULL_PCT = 100;
const FIRST_INSURANCE_SURCHARGE_PCT = 10;
const LOYALTY_DISCOUNT_PCT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PCT = 15;
const CURSED_SURCHARGE_PCT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!isComponent(item) && !Object.hasOwn(MAIN_ITEMS, item.type)) {
      throw new ScenarioError(`Unknown item type: ${item.type}`);
    }
  }
}

// --- Quote ---

function componentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

export function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let mainItemsPremium = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      mainItemsPremium += MAIN_ITEMS[item.type].basePremium;
    }
  }
  let componentsPremium = 0;
  for (const count of componentCounts.values()) componentsPremium += componentsBasePremium(count);
  return mainItemsPremium + componentsPremium;
}

function itemSurchargesHundredths(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => {
      let pct = 0;
      if (item.cursed) pct += CURSED_SURCHARGE_PCT;
      if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) pct += HIGH_ENCHANTMENT_SURCHARGE_PCT;
      return sum + MAIN_ITEMS[item.type].basePremium * pct;
    }, 0);
}

function quote(step: QuoteStep, customer: Customer, previousContracts: number): number {
  const base = policyBasePremium(step.items);
  let policyPct = FULL_PCT + FIRST_INSURANCE_SURCHARGE_PCT;
  if (customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS) policyPct -= LOYALTY_DISCOUNT_PCT;
  if (previousContracts > 0) policyPct -= FOLLOW_UP_DISCOUNT_PCT;
  const hundredths = base * policyPct + itemSurchargesHundredths(step.items) + PROCESSING_FEE * FULL_PCT;
  return Math.ceil(hundredths / FULL_PCT);
}

// --- Claim ---

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT_DIVISOR = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEMS[item.type].insuranceValue;
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursable(damage: Damage, item: Item): number {
  const highlyEnchanted = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT;
  const reimbursed = highlyEnchanted ? damage.amount / HALF_REIMBURSEMENT_DIVISOR : damage.amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

function claim(step: ClaimStep, policy: Policy): StepResult {
  const undamaged = [...policy.items];
  const desired = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new ScenarioError(`Negative damage amount: ${damage.amount}`);
    const index = undamaged.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new ScenarioError(`Damaged item not covered by policy: ${damage.itemType}`);
    const [item] = undamaged.splice(index, 1);
    return sum + reimbursable(damage, item);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new ScenarioError(`Unknown policy: ${step.policy}`);
      return claim(step, policy);
    }
    validateItems(step.items);
    policies.set(index, createPolicy(step.items));
    return { premium: quote(step, scenario.customer, contracts++) };
  });
  return { results };
}
