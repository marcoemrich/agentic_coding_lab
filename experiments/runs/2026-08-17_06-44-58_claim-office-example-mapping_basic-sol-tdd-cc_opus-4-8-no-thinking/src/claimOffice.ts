const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_RATE = 0.15;

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REIMBURSEMENT_HALF = 0.5;
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

interface Customer {
  yearsWithMHPCO: number;
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
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

interface Policy {
  items: Item[];
  remainingCap: number;
}

function componentGroupPremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * COMPONENT_PREMIUM;
}

function componentsBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    total += componentGroupPremium(count);
  }
  return total;
}

function policyBasePremium(items: Item[]): number {
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const mainBase = mainItems.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  return mainBase + componentsBasePremium(components);
}

function itemBase(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) {
    return COMPONENT_PREMIUM;
  }
  return BASE_PREMIUM[item.type];
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurcharge(item: Item): number {
  const base = itemBase(item);
  const curse = item.cursed ? base * CURSE_RATE : 0;
  const enchantment = isHighlyEnchanted(item) ? base * HIGH_ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function isLoyal(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_THRESHOLD;
}

function policyAdjustment(policyBase: number, customer: Customer, isFollowUp: boolean): number {
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyalty = isLoyal(customer) ? policyBase * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_RATE : 0;
  return firstInsurance - loyalty - followUp;
}

function isKnownType(type: string): boolean {
  return COMPONENT_TYPES.has(type) || type in BASE_PREMIUM;
}

function validateItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
  }
}

function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  validateItemTypes(items);
  const policyBase = policyBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const adjustment = policyAdjustment(policyBase, customer, isFollowUp);
  return Math.ceil(policyBase + surcharges + adjustment + PROCESSING_FEE);
}

function itemInsuranceValue(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return INSURANCE_VALUE[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

function reimbursedAmount(damage: Damage, item: Item): number {
  const covered =
    (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT
      ? damage.amount * REIMBURSEMENT_HALF
      : damage.amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`No insured item of type "${damage.itemType}" available for this claim`);
    }
    return available.splice(index, 1)[0];
  });
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
  const items = matchDamagesToItems(policy, incident.damages);
  const gross = incident.damages.reduce(
    (sum, damage, i) => sum + reimbursedAmount(damage, items[i]),
    0,
  );
  const payout = Math.min(Math.floor(gross), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    }
    const policy = policies.get(step.policy)!;
    return processClaim(policy, step.incident);
  });
  return { results };
}
