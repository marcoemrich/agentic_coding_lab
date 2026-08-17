const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

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
  cause: string;
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

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function isKnownType(type: string): boolean {
  return type in BASE_PREMIUM || COMPONENT_TYPES.has(type);
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type '${item.type}'`);
    }
  }
}

function componentGroupBase(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

function componentsBase(items: Item[]): number {
  const counts = countByType(items.map((item) => item.type));
  let base = 0;
  for (const count of counts.values()) {
    base += componentGroupBase(count);
  }
  return base;
}

function itemsBase(items: Item[]): number {
  const mainBase = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const componentBase = componentsBase(items.filter(isComponent));
  return mainBase + componentBase;
}

function itemSurcharge(item: Item): number {
  const base = BASE_PREMIUM[item.type];
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_RATE;
  }
  return surcharge;
}

function itemsSurcharge(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + itemSurcharge(item), 0);
}

function policyModifiers(base: number, customer: Customer, isFollowUp: boolean): number {
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  return firstInsurance - loyalty - followUp;
}

function quotePremium(step: QuoteStep, customer: Customer, isFollowUp: boolean): number {
  validateItems(step.items);
  const base = itemsBase(step.items);
  const surcharges = itemsSurcharge(step.items);
  const modifiers = policyModifiers(base, customer, isFollowUp);
  return Math.ceil(base + surcharges + modifiers + PROCESSING_FEE);
}

function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return INSURANCE_VALUE[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function reimbursedAmount(damage: Damage, item: Item): number {
  if ((item.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD) {
    return damage.amount * REDUCED_REIMBURSEMENT_RATE;
  }
  return damage.amount;
}

function damagePayout(damage: Damage, item: Item): number {
  return Math.max(reimbursedAmount(damage, item) - DEDUCTIBLE, 0);
}

function countByType(types: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

function validateClaim(incident: Incident, policy: Policy): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
  const insured = countByType(policy.items.map((item) => item.type));
  const claimed = countByType(incident.damages.map((damage) => damage.itemType));
  for (const [type, claimedCount] of claimed) {
    if (claimedCount > (insured.get(type) ?? 0)) {
      throw new Error(`Claim references more '${type}' items than are insured`);
    }
  }
}

function claimPayout(incident: Incident, policy: Policy): number {
  validateClaim(incident, policy);
  const gross = incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    return sum + damagePayout(damage, item as Item);
  }, 0);
  return Math.min(Math.floor(gross), policy.remainingCap);
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies: Policy[] = [];
  let quoteCount = 0;

  const results = scenario.steps.map((step): StepResult => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const premium = quotePremium(step, scenario.customer, isFollowUp);
      policies.push({
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      return { premium };
    }

    const policy = policies[step.policy];
    const payout = claimPayout(step.incident, policy);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });

  return { results };
}
