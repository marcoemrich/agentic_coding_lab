const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const ROUNDING_EPSILON = 1e-9;

function roundPremium(amount: number): number {
  return Math.ceil(amount - ROUNDING_EPSILON);
}

function roundPayout(amount: number): number {
  return Math.floor(amount + ROUNDING_EPSILON);
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_FACTOR = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const MAIN_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return isComponent(type) || type in MAIN_BASE_PREMIUMS;
}

function assertKnownItem(item: Item): void {
  if (!isKnownType(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

function componentGroupPremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

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

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += isComponent(type)
      ? componentGroupPremium(count)
      : MAIN_BASE_PREMIUMS[type] * count;
  }
  return total;
}

function itemBase(item: Item): number {
  return isComponent(item.type) ? COMPONENT_BASE_PREMIUM : MAIN_BASE_PREMIUMS[item.type];
}

function isHighlyEnchanted(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurcharge(item: Item): number {
  const base = itemBase(item);
  const curse = item.cursed ? base * CURSE_SURCHARGE : 0;
  const highEnchantment = isHighlyEnchanted(item) ? base * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + highEnchantment;
}

function computeQuote(step: QuoteStep, customer: Customer, isFollowup: boolean): QuoteResult {
  const policyBase = policyBasePremium(step.items);
  const itemSurcharges = step.items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? policyBase * LOYALTY_DISCOUNT
    : 0;
  const followup = isFollowup ? policyBase * FOLLOWUP_DISCOUNT : 0;
  const premium = roundPremium(
    policyBase + itemSurcharges + firstInsurance - loyalty - followup + PROCESSING_FEE,
  );
  return { premium };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

function isHighlyEnchantedForClaim(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function reimbursementFactor(insuredItem: Item): number {
  return isHighlyEnchantedForClaim(insuredItem) ? HIGH_ENCHANTMENT_PAYOUT_FACTOR : 1;
}

function damagePayout(damage: Damage, insuredItem: Item): number {
  const reimbursed = damage.amount * reimbursementFactor(insuredItem);
  return roundPayout(reimbursed - DEDUCTIBLE);
}

function assertValidDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
  }
}

function takeInsuredItem(available: Item[], itemType: string): Item {
  const index = available.findIndex((item) => item.type === itemType);
  if (index === -1) {
    throw new Error(`Damaged item not covered by policy: ${itemType}`);
  }
  return available.splice(index, 1)[0];
}

function computeClaim(step: ClaimStep, policies: Map<number, Policy>): ClaimResult {
  const policy = policies.get(step.policy)!;
  const available = [...policy.items];
  let payout = 0;
  for (const damage of step.incident.damages) {
    assertValidDamage(damage);
    const insuredItem = takeInsuredItem(available, damage.itemType);
    const desired = damagePayout(damage, insuredItem);
    const granted = Math.min(desired, policy.remainingCap);
    payout += granted;
    policy.remainingCap -= granted;
  }
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return computeClaim(step, policies);
    }
    const isFollowup = quoteCount > 0;
    quoteCount += 1;
    step.items.forEach(assertKnownItem);
    policies.set(index, createPolicy(step.items));
    return computeQuote(step, scenario.customer, isFollowup);
  });
  return { results };
}
