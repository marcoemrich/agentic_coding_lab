const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"] as const;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const BASE_PREMIUM: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResult {
  results: Array<QuoteResult | ClaimResult>;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function basePremium(items: Item[]): number {
  const regularPremium = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const blockDiscount = COMPONENT_TYPES.reduce((discount, type) => {
    const count = items.filter((item) => item.type === type).length;
    const regularBlockPremium = BASE_PREMIUM[type] * COMPONENT_BLOCK_SIZE;
    return count === COMPONENT_BLOCK_SIZE
      ? discount + regularBlockPremium - COMPONENT_BLOCK_PREMIUM
      : discount;
  }, 0);
  return regularPremium - blockDiscount;
}

function itemSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => {
    const itemBase = BASE_PREMIUM[item.type];
    const curse = item.cursed === true ? itemBase * CURSE_SURCHARGE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
    return sum + curse + enchantment;
  }, 0);
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const policyBasePremium = basePremium(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const rawPremium = policyBasePremium + itemSurcharge(items) - loyaltyDiscount - followUpDiscount
    + policyBasePremium * INITIAL_ASSESSMENT_RATE + PROCESSING_FEE;
  return Math.ceil(rawPremium);
}

function assertKnownItems(items: Item[]): void {
  if (items.some((item) => !Object.hasOwn(BASE_PREMIUM, item.type))) {
    throw new Error("Quote contains an unknown item type");
  }
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayout(item: Item, amount: number): number {
  const reimbursementRate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? HALF_REIMBURSEMENT_RATE : 1;
  return Math.max(amount * reimbursementRate - DEDUCTIBLE, 0);
}

function takeCoveredItem(availableItems: Item[], itemType: string): Item {
  const itemIndex = availableItems.findIndex((item) => item.type === itemType);
  if (itemIndex < 0) throw new Error("Damage item is not covered by policy");
  return availableItems.splice(itemIndex, 1)[0];
}

function settleClaim(policy: Policy, damages: ClaimStep["incident"]["damages"]): ClaimResult {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
  const availableItems = [...policy.items];
  const desiredPayout = damages.reduce((sum, damage) => {
    const item = takeCoveredItem(availableItems, damage.itemType);
    return sum + damagePayout(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: Array<QuoteResult | ClaimResult> = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      assertKnownItems(step.items);
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error("Claim references an unknown policy");
      results.push(settleClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
