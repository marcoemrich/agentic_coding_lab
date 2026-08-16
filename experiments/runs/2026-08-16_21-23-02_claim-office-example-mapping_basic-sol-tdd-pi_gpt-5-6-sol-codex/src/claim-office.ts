export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CAP_MULTIPLIER = 2;
const INITIAL_ASSESSMENT_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const LOYALTY_YEARS = 2;
const ONE_HUNDRED_PERCENT = 100;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
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

function itemSurcharge(items: Item[], applies: (item: Item) => boolean, percent: number): number {
  return items
    .filter(applies)
    .reduce((total, item) => total + BASE_PREMIUMS[item.type] * percent / ONE_HUNDRED_PERCENT, 0);
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp = false): { premium: number } {
  const ordinaryBase = items.reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
  const blockDiscount = COMPONENT_TYPES.reduce((discount, type) => {
    const typeCount = items.filter((item) => item.type === type).length;
    return discount + (typeCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0);
  }, 0);
  const basePremium = ordinaryBase - blockDiscount;
  const assessment = basePremium * INITIAL_ASSESSMENT_PERCENT / ONE_HUNDRED_PERCENT;
  const curseSurcharge = itemSurcharge(items, (item) => item.cursed === true, CURSE_SURCHARGE_PERCENT);
  const enchantmentSurcharge = itemSurcharge(
    items, (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT, ENCHANTMENT_SURCHARGE_PERCENT,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS
    ? basePremium * LOYALTY_DISCOUNT_PERCENT / ONE_HUNDRED_PERCENT
    : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_PERCENT / ONE_HUNDRED_PERCENT : 0;
  return {
    premium: Math.ceil(
      basePremium + assessment + curseSurcharge + enchantmentSurcharge
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
    ),
  };
}

function validateItems(items: Item[]): void {
  const unknownItem = items.find((item) => BASE_PREMIUMS[item.type] === undefined);
  if (unknownItem !== undefined) throw new Error(`unknown item type: ${unknownItem.type}`);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function desiredClaimPayout(step: ClaimStep, policy: Policy): number {
  const availableItems = [...policy.items];
  return step.incident.damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("damage amount must not be negative");
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error("damage item is not covered by policy");
    const [item] = availableItems.splice(itemIndex, 1);
    const reimbursable = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? damage.amount * REDUCED_REIMBURSEMENT_PERCENT / ONE_HUNDRED_PERCENT
      : damage.amount;
    return total + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
}

function claim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  const payout = Math.min(Math.floor(desiredClaimPayout(step, policy)), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: ScenarioResult["results"] = [];
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      validateItems(step.items);
      results.push(quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0));
      policies.set(stepIndex, createPolicy(step.items));
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error("claim references an unknown policy");
      results.push(claim(step, policy));
    }
  });
  return { results };
}
