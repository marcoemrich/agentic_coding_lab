// MHPCO Claim Office — domain logic.
// Scaffold: grows one behavior at a time under Predictive TDD.

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageEntry[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

interface InsuredItem {
  type: string;
  material?: string;
  enchantment: number;
  cursed: boolean;
}

interface Policy {
  items: InsuredItem[];
  insuranceSum: number;
  remainingCap: number;
}

// Premium rates, as whole percentages. Multiplying a whole-G base by a rate
// yields centi-G directly, so all premium arithmetic stays in integers.
const CENTS_PER_G = 100;
const FIRST_INSURANCE_PERCENT = 10;
const LOYALTY_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_PERCENT = 15;
const CURSED_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const PROCESSING_FEE_G = 5;

// Claim domain constants.
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_G = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;

// MHPCO price list: insurance value per item type (used for the policy cap,
// independent of premium modifiers and block discounts).
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// Item-specific risk surcharges, applied to each affected item's own base
// premium (never to the policy total).
function itemSurchargesCenti(items: QuoteItem[]): number {
  let centi = 0;
  for (const item of items) {
    const base = BASE_PREMIUM[item.type];
    if (item.cursed) {
      centi += base * CURSED_PERCENT;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      centi += base * HIGH_ENCHANTMENT_PERCENT;
    }
  }
  return centi;
}

// Policy-wide modifiers, each applied to the policy base premium (the sum of
// item base premiums), never to individual items.
function policyModifiersCenti(policyBase: number, customer: Customer, isFirstContract: boolean): number {
  let centi = policyBase * FIRST_INSURANCE_PERCENT;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    centi -= policyBase * LOYALTY_PERCENT;
  }
  if (!isFirstContract) {
    centi -= policyBase * FOLLOW_UP_PERCENT;
  }
  return centi;
}

function computePremium(items: QuoteItem[], customer: Customer, isFirstContract: boolean): number {
  const policyBase = computeBasePremium(items);
  let centi = policyBase * CENTS_PER_G;
  centi += itemSurchargesCenti(items);
  centi += policyModifiersCenti(policyBase, customer, isFirstContract);
  centi += PROCESSING_FEE_G * CENTS_PER_G;
  return Math.ceil(centi / CENTS_PER_G);
}

// A policy's insurance sum is the sum of the catalog insurance values of its
// items; the payout cap is twice that sum.
function createPolicy(items: QuoteItem[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += INSURANCE_VALUE[item.type];
  }
  const cap = insuranceSum * CAP_MULTIPLIER;
  return {
    items: items.map((item) => ({
      type: item.type,
      material: item.material,
      enchantment: item.enchantment ?? 0,
      cursed: item.cursed ?? false,
    })),
    insuranceSum,
    remainingCap: cap,
  };
}

// Reimbursement rate per damaged item. Highly enchanted items (enchantment
// >= 8) are reimbursed at half; this rule wins over dragon material. Dragon-
// material items are fully reimbursed, which matches standard reimbursement,
// so only the enchantment clause changes the rate.
function reimbursementPercent(item: InsuredItem): number {
  if (item.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD) {
    return HALF_REIMBURSEMENT_PERCENT;
  }
  return FULL_REIMBURSEMENT_PERCENT;
}

function assertKnownItemType(type: string): void {
  if (!(type in BASE_PREMIUM)) {
    throw new Error(`unknown item type: ${type}`);
  }
}

function validateQuoteItems(items: QuoteItem[]): void {
  for (const item of items) {
    assertKnownItemType(item.type);
  }
}

// Reject a claim before any payout is made: damage amounts must not be
// negative, and the policy must insure at least as many items of each damaged
// type as the claim reports (an unknown or uncovered type insures zero).
function validateClaim(policy: Policy, damages: DamageEntry[]): void {
  const damageCountByType = new Map<string, number>();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative, got ${damage.amount}`);
    }
    damageCountByType.set(damage.itemType, (damageCountByType.get(damage.itemType) ?? 0) + 1);
  }
  const insuredCountByType = new Map<string, number>();
  for (const item of policy.items) {
    insuredCountByType.set(item.type, (insuredCountByType.get(item.type) ?? 0) + 1);
  }
  for (const [type, damagedCount] of damageCountByType) {
    const insuredCount = insuredCountByType.get(type) ?? 0;
    if (damagedCount > insuredCount) {
      throw new Error(`claim damages ${damagedCount} ${type} item(s) but the policy insures ${insuredCount}`);
    }
  }
}

function processClaim(policy: Policy, incident: ClaimStep["incident"]): number {
  validateClaim(policy, incident.damages);
  const available = [...policy.items];
  let payoutCenti = 0;
  for (const damage of incident.damages) {
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    const item = available.splice(itemIndex, 1)[0];
    payoutCenti += damage.amount * reimbursementPercent(item) - DEDUCTIBLE_G * CENTS_PER_G;
  }
  const cappedCenti = Math.min(payoutCenti, policy.remainingCap * CENTS_PER_G);
  const payout = Math.floor(cappedCenti / CENTS_PER_G);
  policy.remainingCap -= payout;
  return payout;
}

export function processScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateQuoteItems(step.items);
      const isFirstContract = quoteCount === 0;
      results.push({ premium: computePremium(step.items, scenario.customer, isFirstContract) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`claim references a policy that does not exist at step ${step.policy}`);
      }
      const payout = processClaim(policy, step.incident);
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  });
  return { results };
}

// MHPCO price list: base premium per item type, before modifiers or the fee.
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Components form a building block only when exactly BLOCK_SIZE items of the
// same component type are insured together.
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function componentGroupPremium(count: number, unitPremium: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * unitPremium;
}

// Base premium for a list of items before any modifiers or the processing fee.
export function computeBasePremium(items: QuoteItem[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += BASE_PREMIUM[item.type];
    }
  }
  for (const [type, count] of componentCounts) {
    total += componentGroupPremium(count, BASE_PREMIUM[type]);
  }
  return total;
}
