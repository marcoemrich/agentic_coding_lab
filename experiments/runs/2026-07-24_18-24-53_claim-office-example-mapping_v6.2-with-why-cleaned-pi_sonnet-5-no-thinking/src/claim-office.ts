export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const FIRST_INSURANCE_SURCHARGE = 0.1;

// Multiplier used to round to 6 decimal places before ceiling, avoiding
// binary floating point artifacts (e.g. 114.99999999999999) that would
// otherwise round the premium down to the wrong whole number.
const FLOAT_ROUNDING_PRECISION = 1e6;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

// A block requires exactly 3 items that are all the SAME component type
// (e.g. 3 runes, or 3 moonstones) -- mixed component types (e.g. 2 runes +
// 1 moonstone) do not qualify for the block discount.
function isComponentBlockOfThree(items: QuoteItem[]): boolean {
  if (items.length !== COMPONENT_BLOCK_SIZE) {
    return false;
  }
  const [first, ...rest] = items;
  return COMPONENT_TYPES.has(first.type) && rest.every((item) => item.type === first.type);
}

function groupByType(items: QuoteItem[]): QuoteItem[][] {
  const groups = new Map<string, QuoteItem[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
}

// Looks up a numeric value for an item's type in a per-type table (e.g. base
// premiums or insurance values), throwing if the item's type is not
// recognized. Shared by basePremiumFor and insuranceValueFor so both kinds
// of item-type lookup fail loudly on an unknown type instead of silently
// producing NaN.
function lookupItemTypeValue(table: Record<string, number>, item: QuoteItem): number {
  const value = table[item.type];
  if (value === undefined) {
    throw new Error(`Unknown item type: "${item.type}"`);
  }
  return value;
}

// Looks up an item's own base premium by type. Shared by group pricing
// (sumBasePremiums) and item-level surcharges (itemSurcharge) so both use
// a single source of truth for "what is this item worth on its own".
function basePremiumFor(item: QuoteItem): number {
  return lookupItemTypeValue(BASE_PREMIUM_BY_ITEM_TYPE, item);
}

// Prices a single group of same-type items: a flat block premium if the
// group qualifies as a discounted "block of 3 alike components", otherwise
// the sum of each item's individual base premium.
function premiumForGroup(group: QuoteItem[]): number {
  if (isComponentBlockOfThree(group)) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return group.reduce((sum, item) => sum + basePremiumFor(item), 0);
}

// Sums the base premium across all items. A policy may contain several
// separate blocks (e.g. 3 runes and 3 moonstones), so items are first
// grouped by type and each group is priced independently.
function sumBasePremiums(items: QuoteItem[]): number {
  return groupByType(items).reduce((total, group) => total + premiumForGroup(group), 0);
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_MIN_LEVEL = 5;

function itemSurcharge(item: QuoteItem): number {
  const itemBasePremium = basePremiumFor(item);
  const curseSurcharge = item.cursed ? itemBasePremium * CURSE_SURCHARGE_RATE : 0;
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN_LEVEL;
  const enchantmentSurcharge = isHighlyEnchanted ? itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseSurcharge + enchantmentSurcharge;
}

function sumItemSurcharges(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + itemSurcharge(item), 0);
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

function isLoyalCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS;
}

function computeQuotePremium(customer: Customer, items: QuoteItem[], isFirstContract: boolean): number {
  const basePremiumSum = sumBasePremiums(items);
  const surchargeSum = sumItemSurcharges(items);
  const firstInsuranceSurcharge = basePremiumSum * FIRST_INSURANCE_SURCHARGE;
  const loyaltyDiscount = isLoyalCustomer(customer) ? basePremiumSum * LOYALTY_DISCOUNT_RATE : 0;
  const followUpContractDiscount = isFirstContract ? 0 : basePremiumSum * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  const withModifiers =
    basePremiumSum + surchargeSum + firstInsuranceSurcharge - loyaltyDiscount - followUpContractDiscount;
  const roundedToAvoidFloatError =
    Math.round((withModifiers + PROCESSING_FEE) * FLOAT_ROUNDING_PRECISION) / FLOAT_ROUNDING_PRECISION;
  return Math.ceil(roundedToAvoidFloatError);
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_MIN_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function findInsuredItem(policyItems: QuoteItem[], itemType: string): QuoteItem | undefined {
  return policyItems.find((item) => item.type === itemType);
}

function reimbursementRate(item: QuoteItem | undefined): number {
  if ((item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_MIN_LEVEL) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return 1;
}

function payoutForDamage(policyItems: QuoteItem[], damage: Damage): number {
  const item = findInsuredItem(policyItems, damage.itemType);
  const reimbursed = damage.amount * reimbursementRate(item);
  return Math.floor(reimbursed - DEDUCTIBLE);
}

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

// Looks up an item's own insurance value by type. Mirrors basePremiumFor's
// role for premiums: a single source of truth for "what is this item worth
// for insurance purposes", used by insuranceSum. Uses the same
// lookupItemTypeValue helper as basePremiumFor so an unknown item type
// fails the same way on both paths.
function insuranceValueFor(item: QuoteItem): number {
  return lookupItemTypeValue(INSURANCE_VALUE_BY_ITEM_TYPE, item);
}

function insuranceSum(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + insuranceValueFor(item), 0);
}

function policyCap(items: QuoteItem[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

// Counts how many items share each key (as produced by keyFor). Used to compare
// "how many of type X are damaged" against "how many of type X are insured"
// without duplicating the counting loop for each side of that comparison.
function countByKey<T>(items: T[], keyFor: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFor(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

// Rejects damage entries with a negative amount. This is a sanity check on
// the damage data itself, independent of any particular policy, so it is
// kept separate from validateDamagesAgainstPolicy's policy-comparison logic.
function validateNonNegativeDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative, got ${damage.amount}`);
    }
  }
}

function validateDamagesAgainstPolicy(policyItems: QuoteItem[], damages: Damage[]): void {
  validateNonNegativeDamageAmounts(damages);
  const damageCountByType = countByKey(damages, (damage) => damage.itemType);
  const insuredCountByType = countByKey(policyItems, (item) => item.type);
  for (const [itemType, damageCount] of damageCountByType) {
    const insuredCount = insuredCountByType.get(itemType) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `Claim references ${damageCount} damaged item(s) of type "${itemType}" but the policy only insures ${insuredCount}`
      );
    }
  }
}

function computeClaimResult(policyItems: QuoteItem[], incident: Incident, capAlreadyUsed: number): ClaimResult {
  validateDamagesAgainstPolicy(policyItems, incident.damages);
  const desiredPayout = incident.damages.reduce((total, damage) => total + payoutForDamage(policyItems, damage), 0);
  const capRemainingBeforeClaim = policyCap(policyItems) - capAlreadyUsed;
  const payout = Math.min(desiredPayout, capRemainingBeforeClaim);
  const remainingCap = capRemainingBeforeClaim - payout;
  return { payout, remainingCap };
}

// Looks up the policy referenced by a claim step, computes its result, and
// records the cumulative cap usage for that policy so later claims against
// the same policy see the correct remaining cap.
function processClaimStep(
  step: ClaimStep,
  steps: Step[],
  capUsedByPolicyIndex: Map<number, number>
): ClaimResult {
  const policyStep = steps[step.policy] as QuoteStep;
  const capAlreadyUsed = capUsedByPolicyIndex.get(step.policy) ?? 0;
  const claimResult = computeClaimResult(policyStep.items, step.incident, capAlreadyUsed);
  capUsedByPolicyIndex.set(step.policy, capAlreadyUsed + claimResult.payout);
  return claimResult;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const capUsedByPolicyIndex = new Map<number, number>();
  // Only the very first quote step in the scenario is the customer's "first
  // contract" -- every later quote step (even for the same customer) gets
  // the follow-up-contract discount instead of the newcomer pricing.
  let hasQuotedBefore = false;
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFirstContract = !hasQuotedBefore;
      hasQuotedBefore = true;
      return { premium: computeQuotePremium(scenario.customer, step.items, isFirstContract) };
    }
    return processClaimStep(step, scenario.steps, capUsedByPolicyIndex);
  });
  return { results };
}
