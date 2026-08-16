export interface Customer {
  yearsWithMHPCO: number;
}

export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: Customer; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Price { premium: number; value: number }
interface Policy { items: InsuredItem[]; remainingCap: number }

const PRICES: Readonly<Record<string, Price>> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;

function priceFor(type: string): Price {
  const price = PRICES[type];
  if (!price) throw new Error(`Unknown item type: ${type}`);
  return price;
}

function componentCounts(items: InsuredItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return counts;
}

function baseFor(item: InsuredItem, counts: Map<string, number>): number {
  const price = priceFor(item.type).premium;
  return counts.get(item.type) === BLOCK_SIZE ? BLOCK_PREMIUM / BLOCK_SIZE : price;
}

function itemPremium(item: InsuredItem, base: number): number {
  let premium = base;
  if (item.cursed === true) premium += base * CURSE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT) premium += base * ENCHANTMENT_RATE;
  return premium;
}

export function calculatePremium(items: InsuredItem[], customer: Customer, quoteNumber = 0): number {
  if (!Array.isArray(items)) throw new Error("Quote items must be an array");
  const counts = componentCounts(items);
  let base = 0;
  let total = 0;
  for (const item of items) {
    const itemBase = baseFor(item, counts);
    base += itemBase;
    total += itemPremium(item, itemBase);
  }
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) total -= base * LOYALTY_RATE;
  total += base * FIRST_INSURANCE_RATE;
  if (quoteNumber > 0) total -= base * FOLLOW_UP_RATE;
  return Math.ceil(total + PROCESSING_FEE);
}

function insuranceSum(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + priceFor(item.type).value, 0);
}

function reimbursement(item: InsuredItem, amount: number): number {
  const covered = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT
    ? amount * REDUCED_REIMBURSEMENT
    : amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

function findCoveredItem(policy: Policy, damage: Damage, used: Set<number>): InsuredItem {
  const index = policy.items.findIndex((item, itemIndex) => item.type === damage.itemType && !used.has(itemIndex));
  if (index < 0) throw new Error(`Damaged item is not covered by policy: ${damage.itemType}`);
  used.add(index);
  return policy.items[index];
}

function validateDamage(damage: Damage): void {
  priceFor(damage.itemType);
  if (!Number.isInteger(damage.amount) || damage.amount < 0) {
    throw new Error("Damage amount must be a non-negative integer");
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  if (!Array.isArray(damages)) throw new Error("Claim damages must be an array");
  const used = new Set<number>();
  let desiredPayout = 0;
  for (const damage of damages) {
    validateDamage(damage);
    desiredPayout += reimbursement(findCoveredItem(policy, damage, used), damage.amount);
  }
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validateScenario(scenario: Scenario): void {
  if (!scenario || !scenario.customer || !Array.isArray(scenario.steps)) {
    throw new Error("Invalid scenario: customer and steps are required");
  }
  if (!Number.isInteger(scenario.customer.yearsWithMHPCO) || scenario.customer.yearsWithMHPCO < 0) {
    throw new Error("yearsWithMHPCO must be a non-negative integer");
  }
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  validateScenario(scenario);
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteNumber = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = calculatePremium(step.items, scenario.customer, quoteNumber++);
      policies.set(stepIndex, { items: step.items.map(item => ({ ...item })), remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
      results.push({ premium });
      return;
    }
    if (step.op !== "claim") throw new Error("Unknown operation");
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy ${step.policy} does not reference an earlier quote`);
    results.push(processClaim(policy, step.incident?.damages));
  });
  return { results };
}
