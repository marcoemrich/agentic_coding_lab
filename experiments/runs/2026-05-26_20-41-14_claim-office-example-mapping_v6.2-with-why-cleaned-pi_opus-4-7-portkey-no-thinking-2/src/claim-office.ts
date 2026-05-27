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
  items: Item[];
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
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEAR_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BASE_PREMIUM = 25;

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_DAMAGE_RATE = 0.5;

// Look up a per-item-type value, treating a missing entry as an unknown
// (and therefore uninsurable) item type. Used for both premium and
// insurance-value tables so both fail loudly the same way.
const lookupByItemType = (
  table: Record<string, number>,
  item: Item,
): number => {
  const value = table[item.type];
  if (value === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return value;
};

const itemBasePremium = (item: Item): number =>
  lookupByItemType(ITEM_BASE_PREMIUM, item);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countBy = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

// Within a single component type: an exact block of 3 gets the block price;
// any other count is priced per-unit (no partial-block discount).
const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const componentsPremium = (components: Item[]): number => {
  let total = 0;
  for (const count of countByType(components).values()) {
    total += componentGroupPremium(count);
  }
  return total;
};

const sumBy = <T>(items: T[], f: (item: T) => number): number =>
  items.reduce((sum, item) => sum + f(item), 0);

const policyBasePremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mains = items.filter((item) => !isComponent(item));
  return sumBy(mains, itemBasePremium) + componentsPremium(components);
};

// Single source of truth for how an item's enchantment level is read;
// missing enchantment is treated as level 0.
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const hasHighEnchantmentForPremium = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;

const hasHighEnchantmentForClaim = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = hasHighEnchantmentForPremium(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const policyItemSurcharges = (items: Item[]): number =>
  sumBy(items, itemSurcharges);

const firstInsuranceSurcharge = (base: number): number =>
  base * FIRST_INSURANCE_SURCHARGE_RATE;

const loyaltyDiscount = (base: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEAR_THRESHOLD
    ? base * LOYALTY_DISCOUNT_RATE
    : 0;

// The follow-up discount is binary per the spec: it applies to every quote
// after the customer's first contract, regardless of how many quotes preceded.
const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const computeQuotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const base = policyBasePremium(items);
  const total =
    base +
    policyItemSurcharges(items) +
    firstInsuranceSurcharge(base) -
    loyaltyDiscount(base, customer) -
    followUpDiscount(base, isFollowUp) +
    PROCESSING_FEE;
  return Math.ceil(total);
};

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const itemInsuranceValue = (item: Item): number =>
  lookupByItemType(ITEM_INSURANCE_VALUE, item);

const policyInsuranceSum = (items: Item[]): number =>
  sumBy(items, itemInsuranceValue);

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = policyInsuranceSum(items);
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLIER,
  };
};

const damageReimbursementRate = (item: Item): number =>
  hasHighEnchantmentForClaim(item) ? HIGH_ENCHANTMENT_DAMAGE_RATE : 1;

const policyItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (!item) throw new Error(`Item type ${itemType} not in policy`);
  return item;
};

const damagePayout = (policy: Policy, damage: Damage): number => {
  const item = policyItem(policy, damage.itemType);
  const reimbursed = damage.amount * damageReimbursementRate(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

// Each validation rule is its own named helper so that the rule a claim
// violates (and the corresponding error) is obvious at the call site.
const assertDamageAmountsNonNegative = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
};

const assertDamagesCoveredByPolicy = (
  policy: Policy,
  incident: Incident,
): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countBy(incident.damages, (d) => d.itemType);
  for (const [type, damageCount] of damageCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (damageCount > insured) {
      throw new Error(
        `Claim has ${damageCount} damages for type ${type}, but only ${insured} insured`,
      );
    }
  }
};

const validateDamages = (policy: Policy, incident: Incident): void => {
  assertDamageAmountsNonNegative(incident);
  assertDamagesCoveredByPolicy(policy, incident);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamages(policy, incident);
  const desired = sumBy(incident.damages, (damage) =>
    damagePayout(policy, damage),
  );
  const cappedPayout = Math.min(desired, policy.remainingCap);
  const payout = Math.floor(cappedPayout);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  // Policies are keyed by the index of the quote step that issued them,
  // so claim steps can reference their originating quote via step.policy.
  const policiesByStepIndex = new Map<number, Policy>();
  let hasQuotedBefore = false;

  const handleStep = (step: Step, stepIndex: number): StepResult => {
    if (step.op === "quote") {
      policiesByStepIndex.set(stepIndex, createPolicy(step.items));
      const isFollowUp = hasQuotedBefore;
      hasQuotedBefore = true;
      return {
        premium: computeQuotePremium(step.items, scenario.customer, isFollowUp),
      };
    }
    const policy = policiesByStepIndex.get(step.policy);
    if (!policy) throw new Error(`No policy at step index ${step.policy}`);
    return processClaim(policy, step.incident);
  };

  return { results: scenario.steps.map(handleStep) };
};
