interface Item {
  type: string;
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

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

// The item types the office insures, mapped to their insured value. Doubles as
// the registry of "known" types for quote validation (isKnownType) and as the
// basis for a policy's cap (insuranceSum).
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

// Tally how many times each value appears, keyed by the value.
const countByType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const componentGroupBase = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_UNIT_PREMIUM;

const componentsBase = (components: Item[]): number => {
  const countsByType = countByType(components.map((component) => component.type));
  return [...countsByType.values()].reduce(
    (total, count) => total + componentGroupBase(count),
    0,
  );
};

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.has(item.type);

const itemsBase = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  const mainBase = mainItems.reduce(
    (sum, item) => sum + BASE_PREMIUM[item.type],
    0,
  );
  return mainBase + componentsBase(components);
};

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// Sum `rate * base premium` for every item matching `applies`. The additive
// per-item form keeps each surcharge a flat term so quotePremium stays additive
// (see the float-drift note there).
const itemSurcharge = (
  items: Item[],
  applies: (item: Item) => boolean,
  rate: number,
): number =>
  items.reduce(
    (sum, item) => sum + (applies(item) ? BASE_PREMIUM[item.type] * rate : 0),
    0,
  );

const curseSurcharge = (items: Item[]): number =>
  itemSurcharge(items, (item) => item.cursed === true, CURSE_SURCHARGE);

const highEnchantmentSurcharge = (items: Item[]): number =>
  itemSurcharge(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE,
  );

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;

const loyaltyDiscount = (base: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT : 0;

const followupDiscount = (base: number, isFollowup: boolean): number =>
  isFollowup ? base * FOLLOWUP_DISCOUNT : 0;

// Always-on surcharge charged on every policy, expressed as a flat term so
// quotePremium stays additive (see the float-drift note there).
const firstInsuranceSurcharge = (base: number): number =>
  base * FIRST_INSURANCE_SURCHARGE;

const isKnownType = (type: string): boolean => type in INSURANCE_VALUE;

const assertKnownItems = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownType(item.type));
  if (unknown !== undefined) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowup: boolean,
): number => {
  assertKnownItems(items);
  const base = itemsBase(items);
  const surcharges =
    firstInsuranceSurcharge(base) +
    curseSurcharge(items) +
    highEnchantmentSurcharge(items);
  const discounts =
    loyaltyDiscount(base, yearsWithMHPCO) + followupDiscount(base, isFollowup);
  // Sum flat terms rather than scaling `base * (1 + rate)`: the additive form
  // avoids IEEE-754 drift that would otherwise round wrong under Math.ceil.
  return Math.ceil(base + surcharges - discounts + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

// Reimbursement for a single damage before the deductible. Items enchanted to
// level 8+ are reimbursed at only 50% of the damage amount.
const reimbursement = (item: Item, amount: number): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;

// The policy item a damage refers to, matched by type. Throws if the damage
// references an item the policy does not cover.
const policyItemFor = (damage: Damage, policyItems: Item[]): Item => {
  const item = policyItems.find((i) => i.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`Item not in policy: ${damage.itemType}`);
  }
  return item;
};

// Each damaged item is reimbursed (subject to clauses) less one deductible,
// floored in MHPCO's favor.
const damagesPayout = (damages: Damage[], policyItems: Item[]): number =>
  Math.floor(
    damages.reduce((sum, damage) => {
      const item = policyItemFor(damage, policyItems);
      return sum + (reimbursement(item, damage.amount) - DEDUCTIBLE);
    }, 0),
  );

const claimResult = (
  claim: ClaimStep,
  policyItems: Item[],
  remainingCap: number,
): ClaimResult => {
  const desiredPayout = damagesPayout(claim.incident.damages, policyItems);
  const payout = Math.min(desiredPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

// A damage amount must be a real loss, so a negative amount is rejected outright.
const assertNonNegativeDamages = (claim: ClaimStep): void => {
  const negative = claim.incident.damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(`Negative damage amount: ${negative.amount}`);
  }
};

// A claim may not report more damages of a type than the policy insures — you
// can't lose three swords under a policy that covers two.
const assertDamageCountWithinPolicy = (claim: ClaimStep, policyItems: Item[]): void => {
  const insured = countByType(policyItems.map((item) => item.type));
  const damaged = countByType(claim.incident.damages.map((damage) => damage.itemType));
  for (const [type, count] of damaged) {
    if (count > (insured.get(type) ?? 0)) {
      throw new Error(`Too many damages for item type: ${type}`);
    }
  }
};

const settleClaim = (
  claim: ClaimStep,
  steps: Step[],
  remainingCapByPolicy: Map<number, number>,
): ClaimResult => {
  const policyItems = (steps[claim.policy] as QuoteStep).items;
  assertNonNegativeDamages(claim);
  assertDamageCountWithinPolicy(claim, policyItems);
  // A policy's cap starts at twice its insurance sum and is drawn down by each
  // claim. remainingCapByPolicy tracks the running balance keyed by policy step
  // index, seeding the initial cap the first time a policy is claimed against.
  const remainingCap =
    remainingCapByPolicy.get(claim.policy) ??
    CAP_MULTIPLIER * insuranceSum(policyItems);
  const result = claimResult(claim, policyItems, remainingCap);
  remainingCapByPolicy.set(claim.policy, result.remainingCap);
  return result;
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const remainingCapByPolicy = new Map<number, number>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      return settleClaim(step, scenario.steps, remainingCapByPolicy);
    }
    // Every quote after the first is a follow-up contract; the map index is
    // already the count of quotes seen so far, so no separate counter is needed.
    const isFollowup = index > 0;
    return {
      premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowup),
    };
  });
  return { results };
};
