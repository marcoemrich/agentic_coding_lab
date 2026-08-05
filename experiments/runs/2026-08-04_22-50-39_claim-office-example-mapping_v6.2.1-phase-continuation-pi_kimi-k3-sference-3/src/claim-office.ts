export interface ScenarioResult {
  results: unknown[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const COMPONENT_TYPES = ["rune", "moonstone"];

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Step {
  op: string;
  items?: QuoteItem[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

function basePremiumOf(item: QuoteItem): number {
  return BASE_PREMIUMS[item.type] ?? 0;
}

function countWhere<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.filter(predicate).length;
}

function countItemsOfType(items: QuoteItem[], type: string): number {
  return countWhere(items, (item) => item.type === type);
}

function countDamagesOfType(damages: Damage[], itemType: string): number {
  return countWhere(damages, (damage) => damage.itemType === itemType);
}

function surchargeFor(
  items: QuoteItem[],
  matches: (item: QuoteItem) => boolean,
  rate: number,
): number {
  return items
    .filter(matches)
    .reduce((sum, item) => sum + basePremiumOf(item) * rate, 0);
}

function isCursed(item: QuoteItem): boolean {
  return item.cursed ?? false;
}

function enchantmentOf(item: QuoteItem): number {
  return item.enchantment ?? 0;
}

function hasHighEnchantment(item: QuoteItem): boolean {
  return enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function blockDiscountFor(items: QuoteItem[]): number {
  return COMPONENT_TYPES.reduce(
    (discount, componentType) =>
      countItemsOfType(items, componentType) === COMPONENT_BLOCK_SIZE
        ? discount + COMPONENT_BLOCK_DISCOUNT
        : discount,
    0,
  );
}

function conditionalDiscount(
  base: number,
  applies: boolean,
  rate: number,
): number {
  return applies ? base * rate : 0;
}

function computeQuotePremium(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const basePremium = items.reduce((sum, item) => sum + basePremiumOf(item), 0);
  const premiumAfterBlockDiscounts = basePremium - blockDiscountFor(items);
  const cursedSurcharge = surchargeFor(items, isCursed, CURSED_SURCHARGE_RATE);
  const highEnchantmentSurcharge = surchargeFor(
    items,
    hasHighEnchantment,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
  const firstInsuranceFee = premiumAfterBlockDiscounts * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = conditionalDiscount(
    premiumAfterBlockDiscounts,
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    LOYALTY_DISCOUNT_RATE,
  );
  const followUpDiscount = conditionalDiscount(
    premiumAfterBlockDiscounts,
    isFollowUpContract,
    FOLLOW_UP_DISCOUNT_RATE,
  );
  return Math.ceil(
    premiumAfterBlockDiscounts +
      cursedSurcharge +
      highEnchantmentSurcharge +
      firstInsuranceFee -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
}

function insuranceSumOf(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function qualifiesForHalfReimbursement(item: QuoteItem): boolean {
  return enchantmentOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;
}

function reimbursementFor(item: QuoteItem, amount: number): number {
  if (qualifiesForHalfReimbursement(item)) {
    return amount * HALF_REIMBURSEMENT_RATE;
  }
  return amount;
}

function payoutForDamage(item: QuoteItem, amount: number): number {
  return Math.max(reimbursementFor(item, amount) - DEDUCTIBLE, 0);
}

function assertKnownItemTypes(items: QuoteItem[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function createPolicy(items: QuoteItem[]): Policy {
  return { items, remainingCap: insuranceSumOf(items) * CAP_MULTIPLIER };
}

function findCoveredItem(policy: Policy, itemType: string): QuoteItem {
  const item = policy.items.find(
    (candidate) => candidate.type === itemType,
  );
  if (item === undefined) {
    throw new Error(`Damaged item not covered by policy: ${itemType}`);
  }
  return item;
}

function assertDamageCountsCoveredByPolicy(
  policy: Policy,
  damages: Damage[],
): void {
  const damagedTypes = [...new Set(damages.map((damage) => damage.itemType))];
  for (const itemType of damagedTypes) {
    const damageCount = countDamagesOfType(damages, itemType);
    const coveredCount = countItemsOfType(policy.items, itemType);
    if (damageCount > coveredCount) {
      throw new Error(
        `Claim rejected: ${damageCount} damages for '${itemType}' exceed the ${coveredCount} covered by the policy`,
      );
    }
  }
}

function assertValidDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(
        `Invalid damage amount: ${damage.amount} for '${damage.itemType}'`,
      );
    }
  }
}

function processClaim(
  policies: Map<number, Policy>,
  step: Step,
): { payout: number; remainingCap: number } {
  const policy = policies.get(step.policy!)!;
  const damages = step.incident!.damages;
  assertValidDamageAmounts(damages);
  assertDamageCountsCoveredByPolicy(policy, damages);
  const rawPayout = damages.reduce(
    (sum, damage) =>
      sum + payoutForDamage(findCoveredItem(policy, damage.itemType), damage.amount),
    0,
  );
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: unknown[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      assertKnownItemTypes(items);
      results.push({
        premium: computeQuotePremium(
          items,
          scenario.customer.yearsWithMHPCO,
          quoteCount > 0,
        ),
      });
      policies.set(index, createPolicy(items));
      quoteCount++;
    } else if (step.op === "claim") {
      results.push(processClaim(policies, step));
    }
  });
  return { results };
}
