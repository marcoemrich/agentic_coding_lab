export const ITEM_TYPES = [
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: ItemType;
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

interface Price { value: number; premium: number }
interface Policy { items: Item[]; remainingCap: number }

const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = -0.2;
const FOLLOW_UP_RATE = -0.15;
const ASSESSMENT_RATE = 0.1;
const POLICY_CAP_MULTIPLIER = 2;

const PRICES: Record<Exclude<ItemType, "rune" | "moonstone">, Price> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

type ComponentType = "rune" | "moonstone";
type MainItemType = Exclude<ItemType, ComponentType>;

const isComponent = (type: ItemType): type is ComponentType => type === "rune" || type === "moonstone";
const mainPrice = (type: ItemType): Price => PRICES[type as MainItemType];

function itemValue(item: Item): number {
  return isComponent(item.type) ? COMPONENT_VALUE : mainPrice(item.type).value;
}

function componentUnitPremium(type: ItemType, items: Item[]): number {
  const count = items.filter((item) => item.type === type).length;
  return count === BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM / BLOCK_SIZE : COMPONENT_PREMIUM;
}

function basePremium(item: Item, items: Item[]): number {
  return isComponent(item.type) ? componentUnitPremium(item.type, items) : mainPrice(item.type).premium;
}

function quotePremium(customer: Customer, items: Item[], quoteIndex: number): number {
  const bases = items.map((item) => basePremium(item, items));
  const policyBase = bases.reduce((total, amount) => total + amount, 0);
  const itemRisk = items.reduce((total, item, index) => {
    const curseRate = item.cursed === true ? CURSE_RATE : 0;
    const enchantmentRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
      ? HIGH_ENCHANTMENT_RATE : 0;
    return total + bases[index] * (curseRate + enchantmentRate);
  }, 0);
  const loyaltyRate = customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_RATE : 0;
  const contractRate = quoteIndex > 0 ? FOLLOW_UP_RATE : 0;
  const policyRate = loyaltyRate + contractRate + ASSESSMENT_RATE;
  return Math.ceil(policyBase + itemRisk + policyBase * policyRate + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + itemValue(item), 0);
  return {
    items: items.map((item) => ({ ...item })),
    remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER,
  };
}

function reimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL ? CURSE_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = new Map<ItemType, Item[]>();
  for (const item of policy.items) {
    available.set(item.type, [...(available.get(item.type) ?? []), item]);
  }
  const desired = damages.reduce((total, damage) => {
    const matches = available.get(damage.itemType) ?? [];
    const item = matches.shift();
    if (!item) throw new Error(`Damage references uninsured item type: ${damage.itemType}`);
    return total + reimbursement(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(scenario.customer, step.items, quoteCount++) });
      policies.set(stepIndex, createPolicy(step.items));
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy ${step.policy} does not refer to an earlier quote`);
    results.push(claim(policy, step.incident.damages));
  });
  return { results };
}
