export interface Customer {
  yearsWithMHPCO: number;
}

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

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: Customer; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PRICES: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_ITEM_PREMIUM = 20;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const INITIAL_ASSESSMENT_RATE = 0.1;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const POLICY_CAP_MULTIPLIER = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function priceFor(item: Item): { value: number; premium: number } {
  const price = PRICES[item.type];
  if (!price) throw new Error(`Unknown item type: ${item.type}`);
  return price;
}

function itemBasePremiums(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map((item) => {
    const price = priceFor(item).premium;
    const isDiscountedComponent = price === COMPONENT_PREMIUM
      && counts.get(item.type) === COMPONENT_BLOCK_SIZE;
    return isDiscountedComponent ? COMPONENT_BLOCK_ITEM_PREMIUM : price;
  });
}

function premium(items: Item[], customer: Customer, quoteNumber: number): number {
  const itemBases = itemBasePremiums(items);
  const base = itemBases.reduce((total, itemBase) => total + itemBase, 0);
  const itemSurcharges = items.reduce((total, item, index) => {
    const itemBase = itemBases[index];
    return total + (item.cursed ? itemBase * CURSE_RATE : 0)
      + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
        ? itemBase * HIGH_ENCHANTMENT_RATE : 0);
  }, 0);
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteNumber > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemSurcharges - loyalty
    + base * INITIAL_ASSESSMENT_RATE - followUp + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + priceFor(item).value, 0);
  return { items: [...items], remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function reimbursement(item: Item, amount: number): number {
  if (!Number.isInteger(amount) || amount < 0) throw new Error("Damage amount must be a non-negative integer");
  const coveredDamage = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;
  return Math.max(0, coveredDamage - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const availableByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const matchingItems = availableByType.get(item.type) ?? [];
    matchingItems.push(item);
    availableByType.set(item.type, matchingItems);
  }
  const desired = damages.reduce((total, damage) => {
    const item = availableByType.get(damage.itemType)?.shift();
    if (!item) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    return total + reimbursement(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteNumber = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const result = { premium: premium(step.items, scenario.customer, quoteNumber) };
      policies.set(stepIndex, createPolicy(step.items));
      quoteNumber += 1;
      return result;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
    return claim(policy, step.incident.damages);
  });
  return { results };
}
