export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: QuoteItem[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
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
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_REDUCTION = 15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

function listedBasePremium(item: QuoteItem): number {
  const premium = BASE_PREMIUM[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

function basePremiumFor(items: QuoteItem[]): number {
  const ordinaryBase = items.reduce((total, item) => total + listedBasePremium(item), 0);
  const runeCount = items.filter((item) => item.type === "rune").length;
  const moonstoneCount = items.filter((item) => item.type === "moonstone").length;
  const blockCount = Number(runeCount === BLOCK_SIZE) + Number(moonstoneCount === BLOCK_SIZE);
  return ordinaryBase - blockCount * BLOCK_REDUCTION;
}

function quotePremium(customer: Customer, items: QuoteItem[], isFollowUp: boolean): number {
  const base = basePremiumFor(items);
  const riskSurcharge = items.reduce((total, item) => {
    const rate = (item.cursed ? CURSE_RATE : 0) + (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_RATE : 0);
    return total + listedBasePremium(item) * rate;
  }, 0);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + riskSurcharge + base * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function newPolicy(items: QuoteItem[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursementFor(item: QuoteItem, damage: Damage): number {
  if (damage.amount < 0) throw new Error("Negative damage amount");
  const rate = item.enchantment !== undefined && item.enchantment >= CLAIM_ENCHANTMENT_LEVEL ? ENCHANTED_REIMBURSEMENT_RATE : 1;
  return Math.max(damage.amount * rate - DEDUCTIBLE, 0);
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  const availableItems = [...policy.items];
  const desired = damages.reduce((total, damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error("Damage references an uninsured item");
    const [item] = availableItems.splice(itemIndex, 1);
    return total + reimbursementFor(item, damage);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(scenario.customer, step.items, quoteCount > 0) });
      policies.set(stepIndex, newPolicy(step.items));
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error("Claim references an unknown policy");
      results.push(processClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
