const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const SWORD_PREMIUM = 100;
const AMULET_PREMIUM = 60;
const STAFF_PREMIUM = 80;
const POTION_PREMIUM = 40;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: readonly Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: readonly Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: readonly (QuoteStep | ClaimStep)[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type Result = QuoteResult | ClaimResult;

const MAIN_ITEM_PREMIUMS: Readonly<Record<string, number>> = {
  sword: SWORD_PREMIUM,
  amulet: AMULET_PREMIUM,
  staff: STAFF_PREMIUM,
  potion: POTION_PREMIUM,
  rune: COMPONENT_PREMIUM,
  moonstone: COMPONENT_PREMIUM,
};

const INSURANCE_VALUES: Readonly<Record<string, number>> = {
  sword: SWORD_INSURANCE_VALUE,
  amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE,
  potion: POTION_INSURANCE_VALUE,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

interface Policy {
  items: readonly Item[];
  remainingCap: number;
}

const COMPONENT_TYPES = ["rune", "moonstone"] as const;
const COMPONENT_BLOCK_SAVING = COMPONENT_PREMIUM * COMPONENT_BLOCK_SIZE - COMPONENT_BLOCK_PREMIUM;

function basePremiumFor(items: readonly Item[]): number {
  const ordinaryPremium = items.reduce((total, item) => total + (MAIN_ITEM_PREMIUMS[item.type] ?? 0), 0);
  const blockSavings = COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_SAVING : 0);
  }, 0);
  return ordinaryPremium - blockSavings;
}

function cursedSurchargeFor(items: readonly Item[]): number {
  return items
    .filter((item) => item.cursed === true)
    .reduce((total, item) => total + (MAIN_ITEM_PREMIUMS[item.type] ?? 0) * CURSE_RATE, 0);
}

function enchantmentSurchargeFor(items: readonly Item[]): number {
  return items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((total, item) => total + (MAIN_ITEM_PREMIUMS[item.type] ?? 0) * HIGH_ENCHANTMENT_RATE, 0);
}

function quote(items: readonly Item[], customer: Customer, isFollowUp: boolean): QuoteResult {
  const basePremium = basePremiumFor(items);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  const premium = basePremium + cursedSurchargeFor(items) + enchantmentSurchargeFor(items)
    + basePremium * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount;
  return { premium: Math.ceil(premium + PROCESSING_FEE) };
}

function assertKnownItems(items: readonly Item[]): void {
  for (const item of items) {
    if (MAIN_ITEM_PREMIUMS[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function insuranceCapFor(items: readonly Item[]): number {
  return items.reduce((total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0) * CAP_MULTIPLIER;
}

function reimbursementFor(item: Item, damageAmount: number): number {
  const reimbursableDamage = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? damageAmount * ENCHANTED_REIMBURSEMENT_RATE
    : damageAmount;
  return Math.max(0, reimbursableDamage - DEDUCTIBLE);
}

function matchDamagedItems(items: readonly Item[], damages: readonly Damage[]): Item[] {
  const availableItems = [...items];
  return damages.map((damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex === -1) {
      throw new Error("Damage does not match an insured item");
    }
    return availableItems.splice(itemIndex, 1)[0]!;
  });
}

function assertNonNegativeDamages(damages: readonly Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
}

function claim(policy: Policy, damages: readonly Damage[]): ClaimResult {
  assertNonNegativeDamages(damages);
  const damagedItems = matchDamagedItems(policy.items, damages);
  const desiredPayout = damages.reduce(
    (total, damage, index) => total + reimbursementFor(damagedItems[index]!, damage.amount),
    0,
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") {
      return claim(policies.get(step.policy)!, step.incident.damages);
    }
    assertKnownItems(step.items);
    const result = quote(step.items, scenario.customer, quoteCount > 0);
    policies.set(index, { items: step.items, remainingCap: insuranceCapFor(step.items) });
    quoteCount += 1;
    return result;
  });
  return { results };
}
