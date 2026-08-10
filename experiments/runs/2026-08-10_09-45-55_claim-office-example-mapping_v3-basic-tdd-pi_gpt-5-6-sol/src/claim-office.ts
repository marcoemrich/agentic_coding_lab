export const ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"] as const;
export type ItemType = typeof ITEM_TYPES[number];

export interface Customer { yearsWithMHPCO: number }
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
export type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: Customer; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Price { value: number; premium: number }
interface Policy { items: PricedItem[]; remainingCap: number }
interface PricedItem extends Item { type: ItemType; basePremium: number }

const PRICES: Record<ItemType, Price> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const POLICY_CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function itemType(type: string): ItemType {
  if (!ITEM_TYPES.includes(type as ItemType)) throw new Error(`Unknown item type: ${type}`);
  return type as ItemType;
}

function componentBase(type: ItemType, count: number): number {
  const regular = PRICES[type].premium;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM / count : regular;
}

function priceItems(items: Item[]): PricedItem[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map((item) => {
    const type = itemType(item.type);
    const component = type === "rune" || type === "moonstone";
    const basePremium = component ? componentBase(type, counts.get(type) ?? 0) : PRICES[type].premium;
    return { ...item, type, basePremium };
  });
}

function itemSurcharge(item: PricedItem): number {
  const curse = item.cursed ? item.basePremium * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
    ? item.basePremium * HIGH_ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quote(items: Item[], years: number, quoteNumber: number): { result: Result; policy: Policy } {
  const pricedItems = priceItems(items);
  const base = pricedItems.reduce((sum, item) => sum + item.basePremium, 0);
  const surcharges = pricedItems.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteNumber > 0 ? base * FOLLOW_UP_RATE : 0;
  const assessment = base * INITIAL_ASSESSMENT_RATE;
  const premium = Math.ceil(base + surcharges + assessment - loyalty - followUp + PROCESSING_FEE);
  const insuranceSum = pricedItems.reduce((sum, item) => sum + PRICES[item.type].value, 0);
  const remainingCap = insuranceSum * POLICY_CAP_MULTIPLIER;
  return { result: { premium }, policy: { items: pricedItems, remainingCap } };
}

function assignedItems(policy: Policy, damages: Damage[]): Array<[Damage, PricedItem]> {
  const available = new Map<ItemType, PricedItem[]>();
  for (const item of policy.items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  return damages.map((damage) => {
    if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error("Damage amount must be a non-negative integer");
    const type = itemType(damage.itemType);
    const item = available.get(type)?.shift();
    if (!item) throw new Error(`Damaged item is not covered by policy: ${damage.itemType}`);
    return [damage, item];
  });
}

function reimbursementRate(item: PricedItem): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL) return REDUCED_REIMBURSEMENT_RATE;
  return 1;
}

function claim(policy: Policy, damages: Damage[]): Result {
  const desired = assignedItems(policy, damages).reduce((sum, [damage, item]) => {
    return sum + Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function policyFor(stepIndex: number, policies: Map<number, Policy>): Policy {
  if (!Number.isInteger(stepIndex) || !policies.has(stepIndex)) {
    throw new Error(`Policy ${stepIndex} does not reference an earlier quote`);
  }
  return policies.get(stepIndex)!;
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  if (!scenario || !scenario.customer || !Array.isArray(scenario.steps)) throw new Error("Invalid scenario");
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteNumber = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      if (!Array.isArray(step.items)) throw new Error("Quote items must be an array");
      const created = quote(step.items, scenario.customer.yearsWithMHPCO, quoteNumber++);
      policies.set(index, created.policy);
      results.push(created.result);
    } else if (step.op === "claim") {
      if (!step.incident || !Array.isArray(step.incident.damages)) throw new Error("Invalid claim incident");
      results.push(claim(policyFor(step.policy, policies), step.incident.damages));
    } else {
      throw new Error("Unknown operation");
    }
  });
  return { results };
}
