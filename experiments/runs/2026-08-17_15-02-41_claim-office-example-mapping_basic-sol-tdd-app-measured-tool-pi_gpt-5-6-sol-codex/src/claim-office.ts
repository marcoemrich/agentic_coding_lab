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
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const COMPONENT_BLOCK_DISCOUNT = 15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_TYPES = ["rune", "moonstone"];
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
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

interface Policy {
  items: Item[];
  remainingCap: number;
}

function policyBasePremium(items: Item[]): number {
  const regularPremium = items.reduce(
    (total, item) => total + (BASE_PREMIUM[item.type] ?? 0),
    0,
  );
  const blockDiscount = COMPONENT_TYPES.reduce((discount, type) => {
    const count = items.filter((item) => item.type === type).length;
    return discount + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0);
  }, 0);
  return regularPremium - blockDiscount;
}

function itemRiskSurcharge(item: Item): number {
  const curseRate = item.cursed ? CURSE_RATE : 0;
  const enchantmentRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_RATE : 0;
  return (BASE_PREMIUM[item.type] ?? 0) * (curseRate + enchantmentRate);
}

function quotePremium(step: QuoteStep, yearsWithMHPCO: number, isFollowUp: boolean): number {
  for (const item of step.items) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const basePremium = policyBasePremium(step.items);
  const riskSurcharge = step.items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  const premium = basePremium + riskSurcharge + basePremium * FIRST_INSURANCE_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(premium);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayout(damage: ClaimStep["incident"]["damages"][number], items: Item[]): number {
  const item = items.find((insured) => insured.type === damage.itemType);
  const reimbursementRate = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;
  return Math.max(0, damage.amount * reimbursementRate - DEDUCTIBLE);
}

function validateDamages(step: ClaimStep, policy: Policy): void {
  const seen = new Map<string, number>();
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const damagedCount = (seen.get(damage.itemType) ?? 0) + 1;
    const insuredCount = policy.items.filter((item) => item.type === damage.itemType).length;
    if (damagedCount > insuredCount) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    seen.set(damage.itemType, damagedCount);
  }
}

function processClaim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  validateDamages(step, policy);
  const desiredPayout = step.incident.damages.reduce(
    (total, damage) => total + damagePayout(damage, policy.items), 0,
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: ScenarioResult["results"] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
