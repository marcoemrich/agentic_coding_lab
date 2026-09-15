type Item = Record<string, unknown>;
type Step = Record<string, unknown> & { op: string; items?: Item[] };

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface OperationResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

interface ScenarioResult {
  results: OperationResult[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_TO_PREMIUM_RATIO = 10;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const PREMIUM_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

function componentBlockDiscount(items: Item[]): number {
  const componentTypes = ["rune", "moonstone"];
  const blockDiscount = COMPONENT_BLOCK_SIZE * BASE_PREMIUM.rune - COMPONENT_BLOCK_PREMIUM;
  return componentTypes.reduce((discount, type) => {
    const count = items.filter((item) => item.type === type).length;
    return discount + (count === COMPONENT_BLOCK_SIZE ? blockDiscount : 0);
  }, 0);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const base = BASE_PREMIUM[String(item.type)] ?? 0;
    const curse = item.cursed === true ? base * CURSE_RATE : 0;
    const enchantment = Number(item.enchantment) >= PREMIUM_ENCHANTMENT_THRESHOLD ? base * ENCHANTMENT_RATE : 0;
    return total + curse + enchantment;
  }, 0);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const individualPremium = items.reduce((total, item) => total + (BASE_PREMIUM[String(item.type)] ?? 0), 0);
  const basePremium = individualPremium - componentBlockDiscount(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  const premium = basePremium + itemSurcharges(items) + basePremium * FIRST_INSURANCE_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(premium);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + (BASE_PREMIUM[String(item.type)] ?? 0) * INSURANCE_TO_PREMIUM_RATIO,
    0,
  );
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function validateDamages(damages: Array<{ itemType: string; amount?: number }>, policy: Policy): void {
  if (damages.some((damage) => Number(damage.amount) < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
  for (const type of new Set(damages.map((damage) => damage.itemType))) {
    const insuredCount = policy.items.filter((item) => item.type === type).length;
    const damageCount = damages.filter((damage) => damage.itemType === type).length;
    if (damageCount > insuredCount) {
      throw new Error(`Damage entries exceed insured items for type: ${type}`);
    }
  }
}

function processClaim(step: Step, policy: Policy): OperationResult {
  const incident = step.incident as { damages: Array<{ itemType: string; amount: number }> };
  validateDamages(incident.damages, policy);
  const desiredPayout = incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    const reimbursementRate = Number(item?.enchantment) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : 1;
    return sum + Math.max(0, damage.amount * reimbursementRate - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validateQuoteItems(items: Item[]): void {
  const unknownItem = items.find((item) => BASE_PREMIUM[String(item.type)] === undefined);
  if (unknownItem !== undefined) {
    throw new Error(`Unknown item type: ${String(unknownItem.type)}`);
  }
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: OperationResult[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      validateQuoteItems(items);
      results.push({ premium: quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(items));
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policies.get(Number(step.policy))!));
    }
  });
  return { results };
}
