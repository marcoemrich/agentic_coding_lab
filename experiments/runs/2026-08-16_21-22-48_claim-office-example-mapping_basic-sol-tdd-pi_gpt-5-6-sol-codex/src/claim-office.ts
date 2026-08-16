export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
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
  customer: Customer;
  steps: Array<QuoteStep | ClaimStep>;
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS = 2;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function listedPremium(type: string): number {
  const premium = BASE_PREMIUM[type];
  if (premium === undefined) throw new Error(`Unknown item type: ${type}`);
  return premium;
}

function basePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce((total, [type, count]) => {
    if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) return total + BLOCK_PREMIUM;
    return total + listedPremium(type) * count;
  }, 0);
}

function itemSurcharge(item: Item): number {
  const premium = listedPremium(item.type);
  const curse = item.cursed ? premium * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= ENCHANTMENT_THRESHOLD ? premium * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function premiumFor(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const base = basePremium(items);
  const itemSurcharges = items.reduce((total, item) => total + itemSurcharge(item), 0);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(
    base + itemSurcharges + base * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayment(damage: Damage, item: Item): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : damage.amount;
  return Math.max(reimbursement - DEDUCTIBLE, 0);
}

function takeInsuredItem(damage: Damage, availableItems: Item[]): Item {
  if (damage.amount < 0) throw new Error(`Negative damage amount for ${damage.itemType}`);
  if (INSURANCE_VALUE[damage.itemType] === undefined) throw new Error(`Unknown item type: ${damage.itemType}`);
  const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
  if (itemIndex < 0) {
    throw new Error(`${damage.itemType} is not insured or damage entries exceed insured items`);
  }
  const [item] = availableItems.splice(itemIndex, 1);
  return item;
}

function claimFor(step: ClaimStep, policy: Policy): Result {
  const availableItems = [...policy.items];
  const desired = step.incident.damages.reduce((total, damage) => {
    const item = takeInsuredItem(damage, availableItems);
    return total + damagePayment(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: premiumFor(step.items, scenario.customer, quoteCount > 0) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      results.push(claimFor(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
