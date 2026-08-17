const PROCESSING_FEE_G = 5;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const CURSE_PERCENT = 50;
const LOYALTY_PERCENT = 20;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_PERCENT = 30;
const FOLLOW_UP_PERCENT = 15;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const DEDUCTIBLE_G = 100;
const CAP_MULTIPLIER = 2;

interface ItemPrice {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, ItemPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT_G = 15;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface Customer {
  yearsWithMHPCO: number;
}

interface Item {
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
  customer: Customer;
  steps: Array<QuoteStep | ClaimStep>;
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ScenarioResult {
  results: Array<QuoteResult | ClaimResult>;
}

function basePremiumFor(items: Item[]): number {
  const listedPremium = items.reduce((total, item) => total + (PRICE_LIST[item.type]?.basePremium ?? 0), 0);
  const componentTypes = new Set(items.filter((item) => COMPONENT_TYPES.has(item.type)).map((item) => item.type));
  const blockDiscount = [...componentTypes].reduce((discount, type) => {
    const count = items.filter((item) => item.type === type).length;
    return discount + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT_G : 0);
  }, 0);
  return listedPremium - blockDiscount;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const itemBase = PRICE_LIST[item.type]?.basePremium ?? 0;
    const curse = item.cursed ? itemBase * CURSE_PERCENT / PERCENT : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? itemBase * HIGH_ENCHANTMENT_PERCENT / PERCENT
      : 0;
    return total + curse + enchantment;
  }, 0);
}

function quote(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const basePremium = basePremiumFor(items);
  const firstInsurance = basePremium * FIRST_INSURANCE_PERCENT / PERCENT;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS
    ? basePremium * LOYALTY_PERCENT / PERCENT
    : 0;
  const followUp = isFollowUp ? basePremium * FOLLOW_UP_PERCENT / PERCENT : 0;
  return Math.ceil(basePremium + itemSurcharges(items) + firstInsurance - loyalty - followUp + PROCESSING_FEE_G);
}

function createPolicy(items: Item[]): Policy {
  for (const item of items) {
    if (PRICE_LIST[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
  }
  const insuranceSum = items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function validateDamageCounts(policy: Policy, damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Negative damage amount is not allowed");
  const damagedTypes = new Set(damages.map((damage) => damage.itemType));
  for (const type of damagedTypes) {
    const insuredCount = policy.items.filter((item) => item.type === type).length;
    const damageCount = damages.filter((damage) => damage.itemType === type).length;
    if (damageCount > insuredCount) throw new Error(`More damage entries than insured for item type: ${type}`);
  }
}

function claim(policy: Policy, damages: Damage[]): ClaimResult {
  validateDamageCounts(policy, damages);
  const rawPayout = damages.reduce((total, damage) => {
    const item = policy.items.find((covered) => covered.type === damage.itemType);
    const reimbursement = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? damage.amount * REDUCED_REIMBURSEMENT_PERCENT / PERCENT
      : damage.amount;
    return total + Math.max(0, reimbursement - DEDUCTIBLE_G);
  }, 0);
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") return claim(policies.get(step.policy)!, step.incident.damages);
    policies.set(stepIndex, createPolicy(step.items));
    const premium = quote(step.items, scenario.customer, quoteCount > 0);
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
