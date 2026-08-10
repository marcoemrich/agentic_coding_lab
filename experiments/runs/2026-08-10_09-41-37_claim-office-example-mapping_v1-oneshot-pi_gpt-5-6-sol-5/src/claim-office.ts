export const ITEM_TYPES = [
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface InsuredItem {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export type Result =
  | { premium: number }
  | { payout: number; remainingCap: number };

interface Price {
  value: number;
  premium: number;
}

interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

const PRICES: Record<ItemType, Price> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

const COMPONENT_TYPES: ReadonlySet<ItemType> = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

export class InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isItemType(value: unknown): value is ItemType {
  return typeof value === "string" && (ITEM_TYPES as readonly string[]).includes(value);
}

function requireInteger(value: unknown, field: string): asserts value is number {
  if (!Number.isInteger(value)) throw new InputError(`${field} must be an integer`);
}

function parseItem(value: unknown): InsuredItem {
  if (!isRecord(value) || !isItemType(value.type)) throw new InputError("Unknown or missing item type");
  if (value.enchantment !== undefined) requireInteger(value.enchantment, "enchantment");
  if (value.material !== undefined && typeof value.material !== "string") throw new InputError("material must be a string");
  if (value.cursed !== undefined && typeof value.cursed !== "boolean") throw new InputError("cursed must be a boolean");
  return value as unknown as InsuredItem;
}

function itemBasePremium(item: InsuredItem, typeCounts: Map<ItemType, number>): number {
  const count = typeCounts.get(item.type) ?? 0;
  if (COMPONENT_TYPES.has(item.type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE;
  }
  return PRICES[item.type].premium;
}

function quotePremium(items: InsuredItem[], years: number, quoteNumber: number): number {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  let base = 0;
  let itemSurcharges = 0;
  for (const item of items) {
    const itemBase = itemBasePremium(item, counts);
    base += itemBase;
    if (item.cursed === true) itemSurcharges += itemBase * CURSE_RATE;
    if ((item.enchantment ?? 0) >= ENCHANTMENT_PREMIUM_THRESHOLD) itemSurcharges += itemBase * ENCHANTMENT_RATE;
  }
  let total = base + itemSurcharges + base * INITIAL_RATE;
  if (years >= LOYALTY_YEARS) total -= base * LOYALTY_RATE;
  if (quoteNumber > 0) total -= base * FOLLOW_UP_RATE;
  return Math.ceil(total + PROCESSING_FEE);
}

function insuranceCap(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + PRICES[item.type].value, 0) * CAP_MULTIPLIER;
}

function parseQuote(value: Record<string, unknown>): QuoteStep {
  if (!Array.isArray(value.items)) throw new InputError("quote items must be an array");
  return { op: "quote", items: value.items.map(parseItem) };
}

function parseDamage(value: unknown): Damage {
  if (!isRecord(value) || typeof value.itemType !== "string") throw new InputError("Invalid damage entry");
  requireInteger(value.amount, "damage amount");
  if (value.amount < 0) throw new InputError("damage amount must not be negative");
  return { itemType: value.itemType, amount: value.amount };
}

function parseClaim(value: Record<string, unknown>): ClaimStep {
  requireInteger(value.policy, "policy");
  if (!isRecord(value.incident) || typeof value.incident.cause !== "string" || !Array.isArray(value.incident.damages)) {
    throw new InputError("Invalid incident");
  }
  return {
    op: "claim",
    policy: value.policy,
    incident: { cause: value.incident.cause, damages: value.incident.damages.map(parseDamage) },
  };
}

function parseScenario(input: unknown): Scenario {
  if (!isRecord(input) || !isRecord(input.customer) || !Array.isArray(input.steps)) throw new InputError("Invalid scenario");
  requireInteger(input.customer.yearsWithMHPCO, "yearsWithMHPCO");
  const steps = input.steps.map((step) => {
    if (!isRecord(step)) throw new InputError("Invalid step");
    if (step.op === "quote") return parseQuote(step);
    if (step.op === "claim") return parseClaim(step);
    throw new InputError("Unknown operation");
  });
  return { customer: { yearsWithMHPCO: input.customer.yearsWithMHPCO }, steps };
}

function coveredItemsForDamages(policy: Policy, damages: Damage[]): InsuredItem[] {
  const available = new Map<ItemType, InsuredItem[]>();
  for (const item of policy.items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  return damages.map((damage) => {
    if (!isItemType(damage.itemType)) throw new InputError(`Unknown damaged item type: ${damage.itemType}`);
    const matching = available.get(damage.itemType);
    const item = matching?.shift();
    if (item === undefined) throw new InputError(`Damaged ${damage.itemType} is not covered by policy`);
    return item;
  });
}

function reimbursement(item: InsuredItem, amount: number): number {
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT
    : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const coveredItems = coveredItemsForDamages(policy, damages);
  const rawPayout = damages.reduce(
    (sum, damage, index) => sum + reimbursement(coveredItems[index], damage.amount),
    0,
  );
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(input: unknown): { results: Result[] } {
  const scenario = parseScenario(input);
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteNumber = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteNumber) });
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceCap(step.items) });
      quoteNumber += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new InputError("Claim policy must reference an earlier quote step");
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}
