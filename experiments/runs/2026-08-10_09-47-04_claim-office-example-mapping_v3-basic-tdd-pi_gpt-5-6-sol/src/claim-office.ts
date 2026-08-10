export const ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

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

export interface QuoteStep { op: "quote"; items: Item[] }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

const LOYAL_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const COMPONENT_PRICE = 25;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const DEDUCTIBLE = 100;
const HIGH_CLAIM_ENCHANTMENT = 8;
const HIGH_CLAIM_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const basePremiums: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_PRICE,
  moonstone: COMPONENT_PRICE,
};

const insuranceValues: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

function componentCounts(items: Item[]): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function itemBase(item: Item, counts: Map<ItemType, number>): number {
  const count = counts.get(item.type);
  if ((item.type === "rune" || item.type === "moonstone") && count === BLOCK_SIZE) {
    return BLOCK_PRICE / BLOCK_SIZE;
  }
  return basePremiums[item.type];
}

function quotePremium(items: Item[], years: number, quoteIndex: number): number {
  const counts = componentCounts(items);
  const lines = items.map((item) => ({ item, base: itemBase(item, counts) }));
  const base = lines.reduce((sum, line) => sum + line.base, 0);
  const risk = lines.reduce((sum, { item, base: price }) => {
    const curse = item.cursed ? price * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? price * ENCHANTMENT_RATE : 0;
    return sum + curse + enchantment;
  }, 0);
  const loyalty = years >= LOYAL_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteIndex > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + risk + base * FIRST_INSURANCE_RATE - loyalty - followUp + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const sum = items.reduce((total, item) => total + insuranceValues[item.type], 0);
  return { items, remainingCap: sum * CAP_MULTIPLIER };
}

function rawDamagePayout(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT
    ? amount * HIGH_CLAIM_RATE
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  const desired = damages.reduce((total, damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Item ${damage.itemType} is not covered by policy`);
    const [item] = available.splice(index, 1);
    return total + rawDamagePayout(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function object(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value as Record<string, unknown>;
}

function integer(value: unknown, name: string): number {
  if (!Number.isInteger(value)) throw new Error(`${name} must be an integer`);
  return value as number;
}

function itemType(value: unknown): ItemType {
  if (typeof value !== "string" || !ITEM_TYPES.includes(value as ItemType)) {
    throw new Error(`Unknown item type: ${String(value)}`);
  }
  return value as ItemType;
}

function parseItem(value: unknown): Item {
  const input = object(value, "item");
  const item: Item = { type: itemType(input.type) };
  if (input.material !== undefined) {
    if (typeof input.material !== "string") throw new Error("material must be a string");
    item.material = input.material;
  }
  if (input.enchantment !== undefined) item.enchantment = integer(input.enchantment, "enchantment");
  if (input.cursed !== undefined) {
    if (typeof input.cursed !== "boolean") throw new Error("cursed must be a boolean");
    item.cursed = input.cursed;
  }
  return item;
}

function parseDamage(value: unknown): Damage {
  const input = object(value, "damage");
  const amount = integer(input.amount, "damage amount");
  if (amount < 0) throw new Error("Damage amount must be non-negative");
  return { itemType: itemType(input.itemType), amount };
}

function array(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
  return value;
}

function parseStep(value: unknown): QuoteStep | ClaimStep {
  const input = object(value, "step");
  if (input.op === "quote") return { op: "quote", items: array(input.items, "items").map(parseItem) };
  if (input.op !== "claim") throw new Error(`Unknown operation: ${String(input.op)}`);
  const incident = object(input.incident, "incident");
  if (typeof incident.cause !== "string") throw new Error("cause must be a string");
  return {
    op: "claim",
    policy: integer(input.policy, "policy"),
    incident: { cause: incident.cause, damages: array(incident.damages, "damages").map(parseDamage) },
  };
}

export function parseScenario(value: unknown): Scenario {
  const input = object(value, "scenario");
  const customer = object(input.customer, "customer");
  return {
    customer: { yearsWithMHPCO: integer(customer.yearsWithMHPCO, "yearsWithMHPCO") },
    steps: array(input.steps, "steps").map(parseStep),
  };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let quoteIndex = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex): Result => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Policy ${step.policy} does not reference a quote`);
      return claim(policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteIndex);
    policies.set(stepIndex, createPolicy(step.items));
    quoteIndex += 1;
    return { premium };
  });
  return { results };
}
