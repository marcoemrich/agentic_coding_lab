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

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: ItemType;
  amount: number;
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
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM_PER_ITEM = 20;
const PROCESSING_FEE = 5;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const PRICES: Record<Exclude<ItemType, "rune" | "moonstone">, Price> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

type ComponentType = Extract<ItemType, "rune" | "moonstone">;
type MainItemType = Exclude<ItemType, ComponentType>;

const isComponent = (type: ItemType): type is ComponentType => type === "rune" || type === "moonstone";
const isMainItem = (type: ItemType): type is MainItemType => !isComponent(type);

function componentCounts(items: Item[]): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const item of items) {
    if (isComponent(item.type)) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function itemBasePremium(item: Item, counts: Map<ItemType, number>): number {
  if (isMainItem(item.type)) return PRICES[item.type].premium;
  return counts.get(item.type) === BLOCK_SIZE ? BLOCK_PREMIUM_PER_ITEM : COMPONENT_PREMIUM;
}

function itemPremiumSurcharge(item: Item, base: number): number {
  const curse = item.cursed ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

export function quotePremium(customer: Customer, items: Item[], previousQuotes: number): number {
  const counts = componentCounts(items);
  const bases = items.map((item) => itemBasePremium(item, counts));
  const base = bases.reduce((total, amount) => total + amount, 0);
  const surcharges = items.reduce(
    (total, item, index) => total + itemPremiumSurcharge(item, bases[index]), 0,
  );
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousQuotes > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + surcharges - loyalty + base * ASSESSMENT_RATE - followUp + PROCESSING_FEE);
}

function insuranceValue(item: Item): number {
  if (isMainItem(item.type)) return PRICES[item.type].value;
  return COMPONENT_VALUE;
}

function newPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? CLAIM_RATE : 1;
}

function matchDamages(policy: Policy, damages: Damage[]): Array<{ item: Item; damage: Damage }> {
  const available = new Map<ItemType, Item[]>();
  for (const item of policy.items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  return damages.map((damage) => {
    const matching = available.get(damage.itemType);
    if (!matching?.length) throw new Error(`Damage references an uninsured ${damage.itemType}`);
    return { item: matching.shift()!, damage };
  });
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const desired = matchDamages(policy, damages).reduce((sum, { item, damage }) => {
    const reimbursed = damage.amount * reimbursementRate(item);
    return sum + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(scenario.customer, step.items, quoteCount) });
      policies.set(index, newPolicy(step.items));
      quoteCount += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy || step.policy >= index) throw new Error(`Policy ${step.policy} is not a previous quote`);
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}
