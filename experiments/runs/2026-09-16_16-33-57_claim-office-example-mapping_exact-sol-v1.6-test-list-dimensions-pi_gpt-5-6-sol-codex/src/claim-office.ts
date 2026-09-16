export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep { op: "quote"; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const PERCENT = 100;
const CURSE_PERCENT = 50;
const ENCHANTMENT_PERCENT = 30;
const LOYALTY_PERCENT = 20;
const ASSESSMENT_PERCENT = 10;
const FOLLOW_UP_PERCENT = 15;
const LOYALTY_YEARS = 2;

const CATALOGUE: Readonly<Record<string, { premium: number; value: number }>> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: COMPONENT_PREMIUM, value: COMPONENT_VALUE },
  moonstone: { premium: COMPONENT_PREMIUM, value: COMPONENT_VALUE },
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function knownItem(item: Item): { premium: number; value: number } {
  const entry = CATALOGUE[item.type];
  if (entry === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return entry;
}

function componentBase(items: Item[]): number {
  let total = 0;
  for (const type of COMPONENT_TYPES) {
    const count = items.filter((item) => item.type === type).length;
    total += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
}

function policyBase(items: Item[]): number {
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  return mainItems.reduce((sum, item) => sum + knownItem(item).premium, 0) + componentBase(items);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const base = knownItem(item).premium;
    const curse = item.cursed === true ? base * CURSE_PERCENT / PERCENT : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * ENCHANTMENT_PERCENT / PERCENT : 0;
    return sum + curse + enchantment;
  }, 0);
}

function quotePremium(items: Item[], years: number, quoteNumber: number): number {
  items.forEach(knownItem);
  const base = policyBase(items);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_PERCENT / PERCENT : 0;
  const followUp = quoteNumber > 0 ? base * FOLLOW_UP_PERCENT / PERCENT : 0;
  const assessment = base * ASSESSMENT_PERCENT / PERCENT;
  return Math.ceil(base + itemSurcharges(items) + assessment - loyalty - followUp + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + knownItem(item).value, 0);
}

interface Policy { items: Item[]; remainingCap: number }

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) {
    const entries = available.get(item.type) ?? [];
    entries.push(item);
    available.set(item.type, entries);
  }
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    if (CATALOGUE[damage.itemType] === undefined) throw new Error(`Unknown damaged item: ${damage.itemType}`);
    const item = available.get(damage.itemType)?.shift();
    if (item === undefined) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    const reimbursable = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? damage.amount / CAP_MULTIPLIER : damage.amount;
    return sum + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let quoteNumber = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteNumber++);
      policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error(`Unknown policy step: ${step.policy}`);
    return processClaim(policy, step.incident.damages);
  });
  return { results };
}
