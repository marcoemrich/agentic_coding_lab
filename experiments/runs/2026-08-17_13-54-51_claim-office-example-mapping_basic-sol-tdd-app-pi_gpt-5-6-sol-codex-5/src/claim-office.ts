export interface Item {
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
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export interface QuoteResult { premium: number }
export interface ClaimResult { payout: number; remainingCap: number }

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function quoteBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let premium = 0;
  for (const item of items) {
    if (item.type === "rune" || item.type === "moonstone") {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      premium += BASE_PREMIUMS[item.type];
    }
  }
  for (const [type, count] of componentCounts) {
    premium += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
  }
  return premium;
}

function itemRisk(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type];
  const curse = item.cursed ? basePremium * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? basePremium * HIGH_ENCHANTMENT_RATE
    : 0;
  return curse + enchantment;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = quoteBasePremium(items);
  const risk = items.reduce((total, item) => total + itemRisk(item), 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = previousContracts > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + risk + basePremium * INITIAL_ASSESSMENT_RATE - loyalty - followUpDiscount + PROCESSING_FEE);
} 

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (BASE_PREMIUMS[item.type] === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function validateDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("damage amount cannot be negative");
  }
}

function matchDamagesToItems(items: Item[], damages: Damage[]): Array<{ item: Item; damage: Damage }> {
  validateDamageAmounts(damages);
  const availableItems = [...items];
  return damages.map((damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) {
      throw new Error("damage entries exceed insured items");
    }
    const [item] = availableItems.splice(itemIndex, 1);
    return { item, damage };
  });
}

function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const matchedDamages = matchDamagesToItems(policy.items, damages);
  const desiredPayout = matchedDamages.reduce((total, { item, damage }) => {
    const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : damage.amount;
    return total + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Array<QuoteResult | ClaimResult> } {
  const results: Array<QuoteResult | ClaimResult> = [];
  const policies = new Map<number, Policy>();
  let contractCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateItems(step.items);
      const insuranceSum = step.items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
      policies.set(index, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, contractCount) });
      contractCount += 1;
    } else {
      results.push(processClaim(policies.get(step.policy)!, step.incident.damages));
    }
  });
  return { results };
}
