export interface ScenarioInput {
  customer?: { yearsWithMHPCO?: number };
  steps: unknown[];
}

export type StepResult = Record<string, unknown>;

export interface QuoteStep {
  op: "quote";
  items: ItemInput[];
}

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

/** Processing fee added to every premium (spec: "A 5 G processing fee is added to every premium"). */
export const PROCESSING_FEE_G = 5;

/** First insurance carries a 10% initial assessment surcharge (applies to every quote). */
const FIRST_INSURANCE_SURCHARGE_DENOMINATOR = 10; // tenths of the policy base premium

/** Long-standing customers (>= 2 years of business with MHPCO) receive a 20% loyalty discount. */
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_NUMERATOR = 2;
const LOYALTY_DISCOUNT_DENOMINATOR = 10;

/**
 * Intermediates are exact fractions of a G; we compute them in integer milli-G
 * (all MHPCO percentages of whole G are integral in milli-G) and round only
 * the final amount, in the MHPCO's favor.
 */
const G_IN_MILLI_G = 1000;

/** Base premium in G per insured item type (MHPCO price list). */
const ITEM_BASE_PREMIUM_G: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** Types priced as components at 25 G each (base premium). */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** A building block of 3 alike components is offered at a special base premium of 60 G. */
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM_G = 60;

/** Customers receive a 15% discount on each contract after their first. */
const FOLLOW_UP_DISCOUNT_NUMERATOR = 15;
const FOLLOW_UP_DISCOUNT_DENOMINATOR = 100;

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

/** Insurance value in G per insured item type. */
const ITEM_INSURANCE_VALUE_G: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

/** A deductible of 100 G applies per damage event. */
const DEDUCTIBLE_G = 100;

/** Damage to items with enchantment level >= 8 is reimbursed at 50% of the damage amount. */
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_DENOMINATOR = 2; // halves

/** The total payout per policy is capped at twice the insurance sum. */
const CAP_INSURANCE_SUM_FACTOR = 2;

export function processScenario(scenario: ScenarioInput): { results: StepResult[] } {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (isQuoteStep(step)) {
      for (const item of step.items) {
        assertKnownItemType(item.type);
      }
      policies.push(createPolicy(step.items));
      results.push(processQuote(step, scenario.customer, ++quoteCount));
    } else if (isClaimStep(step)) {
      const policy = policies[step.policy];
      assertDamagesCoveredByPolicy(step, policy);
      results.push(processClaim(step, policy));
    } else {
      results.push({});
    }
  }
  return { results };
}

/** Every damage entry must reference an item covered by the policy, and the policy must
 *  cover at least as many items of each type as the claim damages. */
function assertDamagesCoveredByPolicy(step: ClaimStep, policy: Policy | undefined): void {
  if (policy === undefined) {
    throw new Error(`no policy at index ${step.policy}`);
  }
  const coveredCounts = new Map<string, number>();
  for (const item of policy.items) {
    coveredCounts.set(item.type, (coveredCounts.get(item.type) ?? 0) + 1);
  }
  const damagedCounts = new Map<string, number>();
  for (const damage of step.incident.damages) {
    damagedCounts.set(damage.itemType, (damagedCounts.get(damage.itemType) ?? 0) + 1);
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
  for (const [type, damaged] of damagedCounts) {
    const covered = coveredCounts.get(type) ?? 0;
    if (damaged > covered) {
      throw new Error(`claim damages ${damaged} ${type}(s) but policy covers only ${covered}`);
    }
  }
}

/** Only item types on the MHPCO price list can be insured. */
function assertKnownItemType(type: string): void {
  if (!(type in ITEM_BASE_PREMIUM_G)) {
    throw new Error(`unknown item type: ${type}`);
  }
}

export interface Policy {
  items: ItemInput[];
  remainingCapMilliG: number;
}

function createPolicy(items: ItemInput[]): Policy {
  const insuranceSumMilliG = items.reduce(
    (sum, item) => sum + (ITEM_INSURANCE_VALUE_G[item.type] ?? 0) * G_IN_MILLI_G,
    0,
  );
  return { items, remainingCapMilliG: insuranceSumMilliG * CAP_INSURANCE_SUM_FACTOR };
}

function processClaim(step: ClaimStep, policy: Policy): StepResult {
  const payoutMilliG = step.incident.damages.reduce(
    (sum, damage) => sum + damageReimbursementMilliG(damage, policy),
    0,
  );
  const payout = roundPayoutDownG(Math.min(payoutMilliG, policy.remainingCapMilliG));
  policy.remainingCapMilliG -= payout * G_IN_MILLI_G;
  return { payout, remainingCap: policy.remainingCapMilliG / G_IN_MILLI_G };
}

function roundPayoutDownG(amountMilliG: number): number {
  return Math.floor(amountMilliG / G_IN_MILLI_G);
}

/** Per damage event: special reimbursement clauses apply, then the 100 G deductible. */
function damageReimbursementMilliG(
  damage: { itemType: string; amount: number },
  policy: Policy,
): number {
  const insuredItem = policy.items.find((item) => item.type === damage.itemType);
  let reimbursed = damage.amount;
  if ((insuredItem?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    reimbursed = damage.amount / HIGH_ENCHANTMENT_CLAIM_DENOMINATOR;
  }
  return (reimbursed - DEDUCTIBLE_G) * G_IN_MILLI_G;
}

function processQuote(step: QuoteStep, customer: { yearsWithMHPCO?: number } | undefined, quoteNumber: number): StepResult {
  return { premium: quotePremium(step.items, customer, quoteNumber) };
}

function quotePremium(
  items: ItemInput[],
  customer: { yearsWithMHPCO?: number } | undefined,
  quoteNumber: number,
): number {
  const policyBaseMilliG = policyBasePremiumMilliG(items);
  const withItemSurcharges = policyBaseMilliG + itemSurchargesMilliG(items);
  const withLoyalty = withItemSurcharges - loyaltyDiscountMilliG(policyBaseMilliG, customer);
  const withFirstInsurance = withLoyalty + policyBaseMilliG / FIRST_INSURANCE_SURCHARGE_DENOMINATOR;
  const withFollowUp = withFirstInsurance - followUpDiscountMilliG(policyBaseMilliG, quoteNumber);
  return roundPremiumUpG(withFollowUp + PROCESSING_FEE_G * G_IN_MILLI_G);
}

/** Each contract after the customer's first receives a 15% discount on the policy base premium. */
function followUpDiscountMilliG(policyBaseMilliG: number, quoteNumber: number): number {
  if (quoteNumber > 1) {
    return policyBaseMilliG * FOLLOW_UP_DISCOUNT_NUMERATOR / FOLLOW_UP_DISCOUNT_DENOMINATOR;
  }
  return 0;
}

/** Policy-wide modifiers apply to the policy base premium (sum of all item base premiums). */
function loyaltyDiscountMilliG(
  policyBaseMilliG: number,
  customer: { yearsWithMHPCO?: number } | undefined,
): number {
  const years = customer?.yearsWithMHPCO ?? 0;
  if (years >= LOYALTY_YEARS_THRESHOLD) {
    return policyBaseMilliG * LOYALTY_DISCOUNT_NUMERATOR / LOYALTY_DISCOUNT_DENOMINATOR;
  }
  return 0;
}

function policyBasePremiumMilliG(items: ItemInput[]): number {
  const componentCounts = new Map<string, number>();
  let mainItemsMilliG = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      mainItemsMilliG += itemBasePremium(item) * G_IN_MILLI_G;
    }
  }
  let componentsMilliG = 0;
  for (const count of componentCounts.values()) {
    componentsMilliG += componentBasePremiumMilliG(count);
  }
  return mainItemsMilliG + componentsMilliG;
}

/** Item-specific modifiers (cursed, high enchantment) apply to the affected item's base premium. */
function itemSurchargesMilliG(items: ItemInput[]): number {
  return items.reduce((sum, item) => sum + itemSurchargeMilliG(item), 0);
}

/** Cursed items add a 50% risk surcharge on the affected item's base premium. */
const CURSED_SURCHARGE_DENOMINATOR = 2; // halves

/** Highly enchanted items (enchantment level >= 5) add a 30% risk surcharge. */
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_NUMERATOR = 3; // tenths
const HIGH_ENCHANTMENT_DENOMINATOR = 10;

function itemSurchargeMilliG(item: ItemInput): number {
  const base = itemBasePremium(item) * G_IN_MILLI_G;
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += base / CURSED_SURCHARGE_DENOMINATOR;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_NUMERATOR / HIGH_ENCHANTMENT_DENOMINATOR;
  }
  return surcharge;
}

/** A building block of 3 alike components is offered at a special base premium of 60 G;
 *  the block rate applies only when the count divides evenly into blocks (4 runes -> 100 G, no block). */
function componentBasePremiumMilliG(count: number): number {
  const usesBlocks = count % COMPONENT_BLOCK_SIZE === 0;
  const perComponentG = ITEM_BASE_PREMIUM_G.rune;
  if (usesBlocks) {
    return (count / COMPONENT_BLOCK_SIZE) * COMPONENT_BLOCK_PREMIUM_G * G_IN_MILLI_G;
  }
  return count * perComponentG * G_IN_MILLI_G;
}

function itemBasePremium(item: ItemInput): number {
  return ITEM_BASE_PREMIUM_G[item.type] ?? 0;
}

function roundPremiumUpG(amountMilliG: number): number {
  return Math.ceil(amountMilliG / G_IN_MILLI_G);
}

function isClaimStep(step: unknown): step is ClaimStep {
  return (
    typeof step === "object" &&
    step !== null &&
    (step as { op?: unknown }).op === "claim"
  );
}

function isQuoteStep(step: unknown): step is QuoteStep {
  return (
    typeof step === "object" &&
    step !== null &&
    (step as { op?: unknown }).op === "quote"
  );
}
