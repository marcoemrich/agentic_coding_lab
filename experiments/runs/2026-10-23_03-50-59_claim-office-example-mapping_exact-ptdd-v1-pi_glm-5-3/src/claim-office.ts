/**
 * Domain entry point for the Most Honorable Privileged Claims Office
 * (MHPCO). Reads a scenario (a customer and sequential steps) and
 * produces one result per step.
 */

/** One item a customer wishes to insure. */
export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

/** A single damage entry of a claim incident. */
export interface Damage {
  itemType: string;
  amount: number;
}

/** The single customer a scenario is about. */
export interface Customer {
  yearsWithMHPCO: number;
}

/** A quote or claim step of a scenario. */
export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

/** A whole scenario: one customer and sequential steps. */
export interface Scenario {
  customer: Customer;
  steps: Step[];
}

/** The result of one step. */
export type StepResult = { premium: number } | { payout: number; remainingCap: number };

/** Flat processing fee added to every premium, in G. */
const PROCESSING_FEE_G = 5;

/** Surcharges the MHPCO adds for a first insurance: 10 %. */
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

/** A whole 100 percent. */
const WHOLE_PERCENT = 100;

/** How many alike components form one building block. */
const COMPONENTS_PER_BLOCK = 3;

/** Base premium of a building block of 3 alike components, in G. */
const BLOCK_BASE_PREMIUM_G = 60;

/** Item types that are components rather than main items. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** Base premium of one component, in G. */
const COMPONENT_BASE_PREMIUM_G = 25;

/** Risk surcharge for cursed items: 50 %. */
const CURSE_SURCHARGE_PERCENT = 50;

/** Risk surcharge for highly enchanted items: 30 %. */
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

/** Enchantment level at or above which an item counts as highly enchanted. */
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Loyalty discount for long-standing customers: 20 %. */
const LOYALTY_DISCOUNT_PERCENT = 20;

/** Years of business at or above which the loyalty discount applies. */
const LOYALTY_YEARS = 2;

/** Discount on each contract after the customer's first: 15 %. */
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

/** True when this quote is not the customer's first contract. */
function isFollowUpContract(contractCount: number): boolean {
  return contractCount > 1;
}

/** Deductible the MHPCO subtracts per damaged item, in G. */
const DEDUCTIBLE_G = 100;

/** The payout per policy is capped at this multiple of the insurance sum. */
const PAYOUT_CAP_MULTIPLE = 2;

/** Damage to items enchanted at or above this level is reimbursed at half. */
const SEVERE_ENCHANTMENT_LEVEL = 8;

/** Reimbursement rate for damage to severely enchanted items: 50 %. */
const SEVERE_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

/** Insurance value of each item type, in G. */
const ITEM_INSURANCE_VALUE_G: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

/** An insurance policy created by a quote step. */
interface Policy {
  items: Item[];
  remainingCapG: number;
}

/**
 * Ensures the item type is on the MHPCO price list; otherwise the whole
 * scenario is rejected.
 */
function requireKnownItemType(itemType: string): void {
  if (!(itemType in MAIN_ITEM_BASE_PREMIUM_G)) {
    throw new Error(`unknown item type: ${itemType}`);
  }
}

/** Base premium of each main item, in G. */
const MAIN_ITEM_BASE_PREMIUM_G: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/**
 * Processes a scenario sequentially and returns one result per step.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let contractCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      contractCount += 1;
      policies.push(createPolicy(step.items));
    }
    results.push(runStep(scenario.customer, step, contractCount, policies));
  }
  return results;
}

/**
 * Creates the insurance policy for a quote: the items and the remaining
 * payout cap, which starts at twice the insurance sum.
 */
function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + ITEM_INSURANCE_VALUE_G[item.type],
    0
  );
  return {
    items,
    remainingCapG: insuranceSum * PAYOUT_CAP_MULTIPLE,
  };
}

function runStep(
  customer: Customer,
  step: Step,
  contractCount: number,
  policies: Policy[]
): StepResult {
  if (step.op === "quote") {
    return { premium: quotePremium(customer, step.items, contractCount) };
  }
  return processClaim(step, policies);
}

/**
 * Processes one claim against a policy and returns payout and remaining cap.
 */
function processClaim(
  step: Extract<Step, { op: "claim" }>,
  policies: Policy[]
): StepResult {
  const policy = policies[step.policy];
  requireNoExcessDamages(step, policy);
  const payoutG = step.incident.damages.reduce(
    (sum, damage) => sum + reimbursementForDamage(damage, policy),
    0
  );
  const paidG = roundDown(Math.min(payoutG, policy.remainingCapG));
  policy.remainingCapG -= paidG;
  return { payout: paidG, remainingCap: policy.remainingCapG };
}

/**
 * Ensures the claim does not contain more damage entries of a type than
 * the policy covers; otherwise the whole claim is rejected.
 */
function requireNoExcessDamages(
  step: Extract<Step, { op: "claim" }>,
  policy: Policy
): void {
  const damageCounts = new Map<string, number>();
  for (const damage of step.incident.damages) {
    damageCounts.set(
      damage.itemType,
      (damageCounts.get(damage.itemType) ?? 0) + 1
    );
  }
  for (const [itemType, damageCount] of damageCounts) {
    const coveredCount = policy.items.filter(
      (item) => item.type === itemType
    ).length;
    if (damageCount > coveredCount) {
      throw new Error(
        `claim contains ${damageCount} ${itemType} damages but the policy covers only ${coveredCount}`
      );
    }
  }
}

/**
 * The insured item of the given type that a damage entry refers to.
 */
function coveredItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((item) => item.type === itemType);
}

/**
 * The reimbursement for one damage entry: damage to severely enchanted
 * items (enchantment >= 8) at half the damage amount, other damage in full;
 * the deductible is subtracted afterwards.
 */
function reimbursementForDamage(damage: Damage, policy: Policy): number {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
  const item = coveredItem(policy, damage.itemType);
  if (!item) {
    throw new Error(`damage to an item that is not part of the policy: ${damage.itemType}`);
  }
  const reimbursable =
    (item?.enchantment ?? 0) >= SEVERE_ENCHANTMENT_LEVEL
      ? percentOf(damage.amount, SEVERE_ENCHANTMENT_REIMBURSEMENT_PERCENT)
      : damage.amount;
  return Math.max(reimbursable - DEDUCTIBLE_G, 0);
}

/**
 * Computes the total premium for one quote, in G.
 */
function quotePremium(
  customer: Customer,
  items: Item[],
  contractCount: number
): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharges = items.reduce(
    (sum, item) => sum + riskSurcharge(item),
    0
  );
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS
      ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT)
      : 0;
  const followUpDiscount = isFollowUpContract(contractCount)
    ? percentOf(basePremium, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT)
    : 0;
  const firstInsuranceSurcharge = percentOf(
    basePremium,
    FIRST_INSURANCE_SURCHARGE_PERCENT
  );
  return roundUp(
    basePremium +
      riskSurcharges -
      loyaltyDiscount -
      followUpDiscount +
      firstInsuranceSurcharge +
      PROCESSING_FEE_G
  );
}

/**
 * Sums the base premiums of the quoted items: main items at their price-list
 * premium, components at 25 G each with a 60 G building-block rate for
 * exactly 3 alike components.
 */
function policyBasePremium(items: Item[]): number {
  for (const item of items) {
    requireKnownItemType(item.type);
  }
  const componentCounts = new Map<string, number>();
  let basePremium = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(
        item.type,
        (componentCounts.get(item.type) ?? 0) + 1
      );
    } else {
      basePremium += MAIN_ITEM_BASE_PREMIUM_G[item.type];
    }
  }
  for (const count of componentCounts.values()) {
    basePremium +=
      count === COMPONENTS_PER_BLOCK
        ? BLOCK_BASE_PREMIUM_G
        : count * COMPONENT_BASE_PREMIUM_G;
  }
  return basePremium;
}

/**
 * Applies a percentage to an amount, e.g. percentOf(100, 10) = 10.
 */
function percentOf(amount: number, percent: number): number {
  return (amount * percent) / WHOLE_PERCENT;
}

/**
 * The risk surcharge on a single quoted item - 50 % of the item's base
 * premium for cursed items, plus 30 % for highly enchanted items.
 */
function riskSurcharge(item: Item): number {
  const basePremium = MAIN_ITEM_BASE_PREMIUM_G[item.type];
  let surcharge = 0;
  if (item.cursed) {
    surcharge += percentOf(basePremium, CURSE_SURCHARGE_PERCENT);
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += percentOf(basePremium, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);
  }
  return surcharge;
}

/**
 * Rounds an amount up to whole G - the MHPCO rounds in its own favor.
 */
function roundUp(amount: number): number {
  return Math.ceil(amount);
}

/**
 * Rounds an amount down to whole G - the MHPCO rounds payouts in its
 * own favor.
 */
function roundDown(amount: number): number {
  return Math.floor(amount);
}
