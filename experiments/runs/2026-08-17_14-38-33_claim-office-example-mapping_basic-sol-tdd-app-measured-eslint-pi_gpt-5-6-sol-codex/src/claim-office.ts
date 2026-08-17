const PROCESSING_FEE = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_PREMIUM = 25;

const PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

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

function calculateComponentPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

function calculateBasePremium(items: Item[]): number {
  const mainItemPremium = items.reduce((total, item) => total + (PREMIUMS[item.type] ?? 0), 0);
  const componentPremium = COMPONENT_TYPES.reduce(
    (total, type) => total + calculateComponentPremium(items, type), 0,
  );
  return mainItemPremium + componentPremium;
}

function itemBasePremium(item: Item): number {
  return PREMIUMS[item.type] ?? COMPONENT_PREMIUM;
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): QuoteResult {
  const basePremium = calculateBasePremium(items);
  const curseSurcharge = items.reduce(
    (total, item) => total + (item.cursed ? itemBasePremium(item) * CURSE_RATE : 0), 0,
  );
  const enchantmentSurcharge = items.reduce(
    (total, item) => total + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? itemBasePremium(item) * HIGH_ENCHANTMENT_RATE : 0), 0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const initialAssessment = basePremium * INITIAL_ASSESSMENT_RATE;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  const premium = basePremium + curseSurcharge + enchantmentSurcharge
    - loyaltyDiscount + initialAssessment - followUpDiscount + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
}

function validateItems(items: Item[]): void {
  items.forEach((item) => {
    if (INSURANCE_VALUES[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  });
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function validateDamageOccurrences(items: Item[], damages: Damage[]): void {
  const damagedCounts = new Map<string, number>();
  damages.forEach((damage) => {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
    damagedCounts.set(damage.itemType, (damagedCounts.get(damage.itemType) ?? 0) + 1);
  });
  damagedCounts.forEach((count, type) => {
    if (count > items.filter((item) => item.type === type).length) {
      throw new Error("Damage entries exceed insured items");
    }
  });
}

function damagePayout(amount: number, item: Item): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function processClaim(step: ClaimStep, policy: QuoteStep, cap: number): ClaimResult {
  validateDamageOccurrences(policy.items, step.incident.damages);
  const desiredPayout = step.incident.damages.reduce((total, damage) => {
    const item = policy.items.find((insuredItem) => insuredItem.type === damage.itemType) as Item;
    return total + damagePayout(damage.amount, item);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, cap));
  return { payout, remainingCap: cap - payout };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: Array<QuoteResult | ClaimResult> = [];
  const remainingCaps = new Map<number, number>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateItems(step.items);
      results.push(quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0));
      remainingCaps.set(index, insuranceSum(step.items) * CAP_MULTIPLIER);
      quoteCount += 1;
      return;
    }
    const cap = remainingCaps.get(step.policy) ?? 0;
    const policy = scenario.steps[step.policy] as QuoteStep;
    const claimResult = processClaim(step, policy, cap);
    remainingCaps.set(step.policy, claimResult.remainingCap);
    results.push(claimResult);
  });
  return { results };
}
