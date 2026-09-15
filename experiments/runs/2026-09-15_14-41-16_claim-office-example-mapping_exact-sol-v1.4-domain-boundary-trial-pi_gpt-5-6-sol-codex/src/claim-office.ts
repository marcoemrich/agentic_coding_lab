const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const INSURANCE_VALUES: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

interface QuoteResult { premium: number }
interface ClaimResult { payout: number; remainingCap: number }
interface Policy { items: Item[]; remainingCap: number }

export interface ScenarioResult {
  results: Array<QuoteResult | ClaimResult>;
}

function basePremiumFor(type: string): number {
  const premium = BASE_PREMIUMS[type];
  if (premium === undefined) throw new Error(`Unknown item type: ${type}`);
  return premium;
}

function itemBasePremiums(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce((total, [type, count]) => {
    if ((type === "rune" || type === "moonstone") && count === BLOCK_SIZE) return total + BLOCK_PREMIUM;
    return total + basePremiumFor(type) * count;
  }, 0);
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const base = basePremiumFor(item.type);
    const curse = item.cursed ? base * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? base * ENCHANTMENT_RATE : 0;
    return total + curse + enchantment;
  }, 0);
}

function quote(items: Item[], yearsWithMHPCO: number, followUp: boolean): number {
  const basePremium = itemBasePremiums(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = followUp ? basePremium * FOLLOW_UP_RATE : 0;
  const premium = basePremium + itemRiskSurcharges(items) + basePremium * FIRST_INSURANCE_RATE;
  return Math.ceil(premium - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function newPolicy(items: Item[]): Policy {
  items.forEach((item) => basePremiumFor(item.type));
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUES[item.type]!, 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableDamage(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const unmatchedItems = [...policy.items];
  return damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const itemIndex = unmatchedItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error("Damage item is not insured by this policy");
    const [item] = unmatchedItems.splice(itemIndex, 1);
    return total + reimbursableDamage(item, damage.amount);
  }, 0);
}

function claim(policy: Policy, damages: Damage[]): ClaimResult {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: Array<QuoteResult | ClaimResult> = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(claim(policies.get(step.policy)!, step.incident.damages));
    } else {
      policies.set(index, newPolicy(step.items));
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      quoteCount += 1;
    }
  });
  return { results };
}
