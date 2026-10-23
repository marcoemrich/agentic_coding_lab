interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
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

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

const curseSurchargeFor = (item: Item): number =>
  item.cursed ? BASE_PREMIUM[item.type] * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurchargeFor = (item: Item): number =>
  item.enchantment !== undefined &&
  item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
    ? BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const sumSurcharges = (
  items: Item[],
  surchargeFor: (item: Item) => number,
): number => items.reduce((sum, item) => sum + surchargeFor(item), 0);

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: { type: string }): boolean =>
  COMPONENT_TYPES.includes(item.type);

const sumComponentPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_PREMIUM;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: { type: string }[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const sumBasePremiums = (items: { type: string }[]): number => {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += isComponent({ type })
      ? sumComponentPremium(count)
      : BASE_PREMIUM[type] * count;
  }
  return total;
};

// Item-specific surcharges: each depends on a single item's attributes.
const itemSurchargesFor = (items: Item[]): number =>
  sumSurcharges(items, curseSurchargeFor) +
  sumSurcharges(items, highEnchantmentSurchargeFor);

// Policy-wide adjustments: each is a rate applied to the whole policy base.
const policyAdjustmentsFor = (
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOWUP_DISCOUNT_RATE : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const policyBase = sumBasePremiums(step.items);
  const premium =
    policyBase +
    itemSurchargesFor(step.items) +
    policyAdjustmentsFor(policyBase, customer, isFollowUp) +
    PROCESSING_FEE;
  return Math.ceil(premium);
};

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const isHighEnchantment = (item: Item): boolean =>
  item.enchantment !== undefined &&
  item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

// Fraction of the damage amount reimbursed, before the deductible.
// This is the seam the material/enchantment claim rules extend: add new
// clauses here in precedence order (high-enchantment 50% wins over any
// future full-reimbursement clause).
const reimbursementRateFor = (insuredItem: Item): number =>
  isHighEnchantment(insuredItem) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;

// Per-damage payout: reimbursable amount after the deductible.
const payoutForDamage = (damage: Damage, insuredItem: Item): number => {
  const reimbursable = damage.amount * reimbursementRateFor(insuredItem);
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const policyCovers = (policy: QuoteStep, itemType: string): boolean =>
  policy.items.some((item) => item.type === itemType);

const insuredItemFor = (damage: Damage, policy: QuoteStep): Item =>
  policy.items.find((item) => item.type === damage.itemType) as Item;

// Resolve the insured item for a damage, then compute its payout.
const payoutForClaimDamage = (damage: Damage, policy: QuoteStep): number =>
  payoutForDamage(damage, insuredItemFor(damage, policy));

const sumClaimPayout = (step: ClaimStep, policy: QuoteStep): number =>
  step.incident.damages.reduce(
    (sum, damage) => sum + payoutForClaimDamage(damage, policy),
    0,
  );

const capFor = (policy: QuoteStep): number =>
  CAP_MULTIPLIER * insuranceSumOf(policy.items);

const processClaim = (
  step: ClaimStep,
  policy: QuoteStep,
  remainingCap: number,
): { payout: number; remainingCap: number } => {
  const desired = Math.floor(sumClaimPayout(step, policy));
  const payout = Math.min(desired, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

// Mutable state threaded through the steps of a single scenario run:
// how many quotes have been seen (for the follow-up discount) and the
// unused payout cap still available on each policy.
interface ScenarioState {
  quoteCount: number;
  remainingCapByPolicy: Map<number, number>;
}

// --- Validation ---
// Each guard throws on one invalid-input condition. Handlers call the
// relevant guards first, before any premium/payout computation. New rules
// (unknown claim item, negative damage) add a sibling assert* here.
const assertKnownItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const handleQuote = (
  step: QuoteStep,
  index: number,
  customer: Customer,
  state: ScenarioState,
): unknown => {
  assertKnownItems(step.items);
  const isFollowUp = state.quoteCount > 0;
  state.quoteCount += 1;
  state.remainingCapByPolicy.set(index, capFor(step));
  return { premium: quotePremium(step, customer, isFollowUp) };
};

// Run a per-damage guard against every damage in the claim. Each guard
// (coverage, non-negative amount) differs only in its per-damage check, so
// the iteration lives here once.
const assertEachDamage = (
  step: ClaimStep,
  guard: (damage: Damage) => void,
): void => {
  for (const damage of step.incident.damages) {
    guard(damage);
  }
};

const assertDamagesCovered = (step: ClaimStep, policy: QuoteStep): void =>
  assertEachDamage(step, (damage) => {
    if (!policyCovers(policy, damage.itemType)) {
      throw new Error(
        `Damaged item is not part of the policy: ${damage.itemType}`,
      );
    }
  });

const assertDamageAmountsNonNegative = (step: ClaimStep): void =>
  assertEachDamage(step, (damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  });

const assertDamageCountsWithinCoverage = (
  step: ClaimStep,
  policy: QuoteStep,
): void => {
  const damageCounts = countBy(
    step.incident.damages,
    (damage) => damage.itemType,
  );
  const itemCounts = countByType(policy.items);
  for (const [type, count] of damageCounts) {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(`More ${type} damages than insured`);
    }
  }
};

const handleClaim = (
  step: ClaimStep,
  steps: Step[],
  state: ScenarioState,
): unknown => {
  const policy = steps[step.policy] as QuoteStep;
  assertDamagesCovered(step, policy);
  assertDamageAmountsNonNegative(step);
  assertDamageCountsWithinCoverage(step, policy);
  const remainingCap =
    state.remainingCapByPolicy.get(step.policy) ?? capFor(policy);
  const result = processClaim(step, policy, remainingCap);
  state.remainingCapByPolicy.set(step.policy, result.remainingCap);
  return result;
};

export const runScenario = (scenario: Scenario): unknown => {
  const state: ScenarioState = {
    quoteCount: 0,
    remainingCapByPolicy: new Map<number, number>(),
  };
  const results = scenario.steps.map((step, index) =>
    step.op === "quote"
      ? handleQuote(step, index, scenario.customer, state)
      : handleClaim(step, scenario.steps, state),
  );
  return { results };
};
