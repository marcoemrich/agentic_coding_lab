export const ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface QuoteStep { op: "quote"; items: Item[] }
export interface Damage { itemType: ItemType; amount: number }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PRICES: Record<ItemType, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const COMPONENTS = new Set<ItemType>(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_ITEM_PREMIUM = 20;
const RATE_DENOMINATOR = 20;
const CURSE_RATE_UNITS = 10;
const HIGH_ENCHANTMENT_RATE_UNITS = 6;
const INITIAL_RATE_UNITS = 2;
const LOYALTY_RATE_UNITS = 4;
const FOLLOW_UP_RATE_UNITS = 3;
const HIGH_PREMIUM_ENCHANTMENT = 5;
const HIGH_CLAIM_ENCHANTMENT = 8;
const LOYALTY_YEARS = 2;
const PROCESSING_FEE = 5;
const POLICY_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

interface Policy { items: Item[]; remainingCap: number }

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isItemType(value: unknown): value is ItemType {
  return typeof value === "string" && ITEM_TYPES.includes(value as ItemType);
}

function validateItem(value: unknown): asserts value is Item {
  assert(isRecord(value), "Each insured item must be an object");
  assert(isItemType(value.type), `Unknown item type: ${String(value.type)}`);
  assert(value.enchantment === undefined || Number.isInteger(value.enchantment), "Enchantment must be an integer");
  assert(value.cursed === undefined || typeof value.cursed === "boolean", "Cursed must be boolean");
  assert(value.material === undefined || typeof value.material === "string", "Material must be a string");
}

function itemPremiumUnits(item: Item, count: number): number {
  const normal = PRICES[item.type].premium;
  const base = COMPONENTS.has(item.type) && count === BLOCK_SIZE ? BLOCK_ITEM_PREMIUM : normal;
  let units = base * RATE_DENOMINATOR;
  if (item.cursed) units += base * CURSE_RATE_UNITS;
  if ((item.enchantment ?? 0) >= HIGH_PREMIUM_ENCHANTMENT) units += base * HIGH_ENCHANTMENT_RATE_UNITS;
  return units;
}

function quote(items: Item[], years: number, priorContracts: number): number {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  const base = items.reduce((sum, item) => sum + (COMPONENTS.has(item.type) && counts.get(item.type) === BLOCK_SIZE ? BLOCK_ITEM_PREMIUM : PRICES[item.type].premium), 0);
  let units = items.reduce((sum, item) => sum + itemPremiumUnits(item, counts.get(item.type) ?? 0), 0);
  units += base * INITIAL_RATE_UNITS;
  if (years >= LOYALTY_YEARS) units -= base * LOYALTY_RATE_UNITS;
  if (priorContracts > 0) units -= base * FOLLOW_UP_RATE_UNITS;
  return Math.ceil(units / RATE_DENOMINATOR + PROCESSING_FEE);
}

function makePolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + PRICES[item.type].value, 0);
  return { items: items.map(item => ({ ...item })), remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function desiredPayout(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function validateDamage(value: unknown): asserts value is Damage {
  assert(isRecord(value), "Each damage entry must be an object");
  assert(isItemType(value.itemType), `Unknown damaged item type: ${String(value.itemType)}`);
  assert(Number.isInteger(value.amount) && (value.amount as number) >= 0, "Damage amount must be a non-negative integer");
}

function claim(policy: Policy, damages: unknown[]): { payout: number; remainingCap: number } {
  const available = new Map<ItemType, Item[]>();
  for (const item of policy.items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  let desired = 0;
  for (const damage of damages) {
    validateDamage(damage);
    const covered = available.get(damage.itemType)?.shift();
    assert(covered, `Damaged ${damage.itemType} is not covered by this policy`);
    desired += desiredPayout(covered, damage.amount);
  }
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function validateScenario(input: unknown): asserts input is Scenario {
  assert(isRecord(input), "Scenario must be an object");
  assert(isRecord(input.customer), "Customer must be an object");
  assert(Number.isInteger(input.customer.yearsWithMHPCO), "yearsWithMHPCO must be an integer");
  assert(Array.isArray(input.steps), "Steps must be an array");
}

export function processScenario(input: unknown): { results: Result[] } {
  validateScenario(input);
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  input.steps.forEach((rawStep, index) => {
    assert(isRecord(rawStep), "Each step must be an object");
    if (rawStep.op === "quote") {
      assert(Array.isArray(rawStep.items), "Quote items must be an array");
      rawStep.items.forEach(validateItem);
      results.push({ premium: quote(rawStep.items, input.customer.yearsWithMHPCO, quoteCount) });
      policies.set(index, makePolicy(rawStep.items));
      quoteCount += 1;
      return;
    }
    assert(rawStep.op === "claim", `Unknown operation: ${String(rawStep.op)}`);
    assert(Number.isInteger(rawStep.policy), "Policy reference must be an integer");
    const policy = policies.get(rawStep.policy as number);
    assert(policy, "Claim must reference an earlier quote step");
    assert(isRecord(rawStep.incident) && typeof rawStep.incident.cause === "string", "Invalid incident");
    assert(Array.isArray(rawStep.incident.damages), "Incident damages must be an array");
    results.push(claim(policy, rawStep.incident.damages));
  });
  return { results };
}
