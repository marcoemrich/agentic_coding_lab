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

export interface QuoteResult { premium: number }
export interface ClaimResult { payout: number; remainingCap: number }

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function calculateBasePremium(items: Item[]): number {
  const typeCounts = items.reduce<Record<string, number>>((counts, item) => ({
    ...counts,
    [item.type]: (counts[item.type] ?? 0) + 1,
  }), {});
  return items.reduce((total, item) => {
    const hasComponentBlock = COMPONENT_TYPES.has(item.type)
      && typeCounts[item.type] === BLOCK_SIZE;
    const price = hasComponentBlock ? BLOCK_PREMIUM / BLOCK_SIZE : MAIN_ITEM_PREMIUMS[item.type];
    return total + price;
  }, 0);
}

function calculateItemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const itemBase = MAIN_ITEM_PREMIUMS[item.type];
    const curse = item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? itemBase * ENCHANTMENT_SURCHARGE_RATE
      : 0;
    return total + curse + enchantment;
  }, 0);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = calculateItemSurcharges(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(
    basePremium + itemSurcharges + basePremium * INITIAL_ASSESSMENT_RATE
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

function validateClaimCoverage(step: ClaimStep, policy: PolicyState): void {
  if (step.incident.damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
  const hasExcessDamage = step.incident.damages.some((damage) => {
    const insuredCount = policy.items.filter((item) => item.type === damage.itemType).length;
    const damageCount = step.incident.damages.filter(
      (entry) => entry.itemType === damage.itemType,
    ).length;
    return damageCount > insuredCount;
  });
  if (hasExcessDamage) throw new Error("Damage item is not covered by policy");
}

function processClaim(step: ClaimStep, policy: PolicyState): ClaimResult {
  validateClaimCoverage(step, policy);
  const desiredPayout = step.incident.damages.reduce((total, damage) => {
    const item = policy.items.find((covered) => covered.type === damage.itemType)!;
    const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? damage.amount * ENCHANTED_REIMBURSEMENT_RATE
      : damage.amount;
    return total + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validateQuoteItems(items: Item[]): void {
  if (items.some((item) => !(item.type in MAIN_ITEM_PREMIUMS))) {
    throw new Error("Unknown item type");
  }
}

export function processScenario(scenario: Scenario): { results: Array<QuoteResult | ClaimResult> } {
  const policies = new Map<number, PolicyState>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(step, policies.get(step.policy)!);
    validateQuoteItems(step.items);
    const hasPriorQuote = scenario.steps.slice(0, index).some((prior) => prior.op === "quote");
    const insuranceSum = step.items.reduce(
      (total, item) => total + INSURANCE_VALUES[item.type], 0,
    );
    policies.set(index, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
    return {
      premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, hasPriorQuote),
    };
  }) };
}
