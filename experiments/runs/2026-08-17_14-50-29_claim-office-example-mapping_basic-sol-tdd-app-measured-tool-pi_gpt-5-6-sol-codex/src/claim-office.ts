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

type Step = QuoteStep | ClaimStep;
type Result = { premium: number } | { payout: number; remainingCap: number };

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

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
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CLAIM_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function basePremiumFor(items: Item[]): number {
  const mainItemPremium = items
    .filter((item) => !COMPONENT_TYPES.includes(item.type))
    .reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
  const componentPremium = COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUMS[type]);
  }, 0);
  return mainItemPremium + componentPremium;
}

function validateItems(items: Item[]): void {
  items.forEach((item) => {
    if (!Object.hasOwn(BASE_PREMIUMS, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  });
}

function quotePremium(items: Item[], customerYears: number, isFollowUp: boolean): number {
  validateItems(items);
  const basePremium = basePremiumFor(items);
  const curseSurcharge = items
    .filter((item) => item.cursed === true)
    .reduce((total, item) => total + BASE_PREMIUMS[item.type] * CURSE_SURCHARGE_RATE, 0);
  const enchantmentSurcharge = items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((total, item) => total + BASE_PREMIUMS[item.type] * ENCHANTMENT_SURCHARGE_RATE, 0);
  const loyaltyDiscount = customerYears >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge + basePremium * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function insuranceCap(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0) * CAP_MULTIPLIER;
}

function damagePayout(item: Item, amount: number): number {
  if (amount < 0) throw new Error("Damage amount cannot be negative");
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * REDUCED_REIMBURSEMENT_RATE
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const availableItems = [...policy.items];
  const desiredPayout = damages.reduce((total, damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage to ${damage.itemType} exceeds insured items`);
    const [item] = availableItems.splice(itemIndex, 1);
    return total + damagePayout(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceCap(step.items) });
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error("Claim references an unknown policy");
      results.push(processClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
