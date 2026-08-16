export const ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export interface Item {
  type: ItemType;
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
export type Step = QuoteStep | ClaimStep;
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Price { value: number; premium: number }
interface Policy { items: Item[]; remainingCap: number }

const PRICES: Record<ItemType, Price> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const COMPONENTS = new Set<ItemType>(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const HIGH_PREMIUM_ENCHANTMENT = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_CLAIM_ENCHANTMENT = 8;
const HIGH_CLAIM_RATE = 0.5;

function isItemType(value: unknown): value is ItemType {
  return typeof value === "string" && ITEM_TYPES.includes(value as ItemType);
}

function validateItem(item: Item): void {
  if (!item || !isItemType(item.type)) throw new Error(`unknown item type: ${String(item?.type)}`);
}

function itemBases(items: Item[]): number[] {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map((item) =>
    COMPONENTS.has(item.type) && counts.get(item.type) === BLOCK_SIZE
      ? BLOCK_PREMIUM / BLOCK_SIZE
      : PRICES[item.type].premium,
  );
}

function quotePremium(items: Item[], years: number, quoteNumber: number): number {
  items.forEach(validateItem);
  const bases = itemBases(items);
  const base = bases.reduce((sum, amount) => sum + amount, 0);
  const specific = items.reduce((sum, item, index) => {
    const curse = item.cursed === true ? bases[index] * CURSE_RATE : 0;
    const enchanted = (item.enchantment ?? 0) >= HIGH_PREMIUM_ENCHANTMENT ? bases[index] * ENCHANTMENT_RATE : 0;
    return sum + curse + enchanted;
  }, 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteNumber > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + specific - loyalty + base * INITIAL_RATE - followUp + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + PRICES[item.type].value, 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function validateDamage(damage: Damage): void {
  if (!Number.isInteger(damage.amount)) throw new Error("damage amount must be an integer");
  if (damage.amount < 0) throw new Error("negative damage amount");
}

function rawReimbursement(item: Item, amount: number): number {
  const fraction = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT ? HIGH_CLAIM_RATE : 1;
  return Math.max(0, amount * fraction - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  let wanted = 0;
  for (const damage of damages) {
    validateDamage(damage);
    const matching = available.get(damage.itemType);
    if (!matching?.length) throw new Error(`item type ${damage.itemType} is not covered by policy`);
    wanted += rawReimbursement(matching.shift()!, damage.amount);
  }
  const payout = Math.floor(Math.min(wanted, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function requireScenario(input: Scenario): void {
  if (!input || !input.customer || !Array.isArray(input.steps)) throw new Error("invalid scenario");
  if (!Number.isInteger(input.customer.yearsWithMHPCO)) throw new Error("yearsWithMHPCO must be an integer");
}

export function processScenario(inputValue: unknown): { results: Result[] } {
  const input = inputValue as Scenario;
  requireScenario(input);
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quotes = 0;
  input.steps.forEach((step, index) => {
    if (step.op === "quote") {
      if (!Array.isArray(step.items)) throw new Error("quote items must be an array");
      const premium = quotePremium(step.items, input.customer.yearsWithMHPCO, quotes++);
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
      return;
    }
    if (step.op !== "claim") throw new Error(`unknown operation: ${(step as Step).op}`);
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`policy ${step.policy} does not refer to an earlier quote`);
    if (!step.incident || !Array.isArray(step.incident.damages)) throw new Error("invalid incident");
    results.push(claim(policy, step.incident.damages));
  });
  return { results };
}
