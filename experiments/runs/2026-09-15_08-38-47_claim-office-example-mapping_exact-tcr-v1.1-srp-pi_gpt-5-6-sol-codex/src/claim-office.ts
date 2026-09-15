export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export interface ScenarioResult { results: Result[] }

const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function quoteBasePremium(items: Item[]): number {
  const unknown = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
  const individualTotal = items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
  const blocks = COMPONENT_TYPES.filter(
    (type) => items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE,
  ).length;
  return individualTotal - blocks * COMPONENT_BLOCK_DISCOUNT;
}

function itemSurcharge(items: Item[], matches: (item: Item) => boolean, rate: number): number {
  return items.filter(matches).reduce((total, item) => total + BASE_PREMIUM[item.type] * rate, 0);
}

function quotePremium(items: Item[], years: number, quoteIndex: number): number {
  const base = quoteBasePremium(items);
  const curse = itemSurcharge(items, (item) => item.cursed === true, CURSE_RATE);
  const enchanted = itemSurcharge(items, (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL, HIGH_ENCHANTMENT_RATE);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteIndex > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + curse + enchanted + base * INITIAL_ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE);
}

function policyCap(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0) * CAP_MULTIPLIER;
}

function reimbursableDamage(item: Item | undefined, amount: number): number {
  return (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;
}

function matchDamages(items: Item[], damages: Damage[]): Item[] {
  const available = [...items];
  return damages.map((damage) => {
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Policy does not cover another item type: ${damage.itemType}`);
    return available.splice(itemIndex, 1)[0];
  });
}

function settleClaim(policy: Policy, damages: Damage[]): Result {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount cannot be negative");
  const matchedItems = matchDamages(policy.items, damages);
  const desired = damages.reduce((total, damage, index) => {
    return total + Math.max(0, reimbursableDamage(matchedItems[index], damage.amount) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;
  const results = scenario.steps.map((step, stepIndex): Result => {
    if (step.op === "quote") {
      policies.set(stepIndex, { items: step.items, remainingCap: policyCap(step.items) });
      return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteIndex++) };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error("Claim references a missing policy");
    return settleClaim(policy, step.incident.damages);
  });
  return { results };
}
