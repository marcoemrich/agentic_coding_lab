const PROCESSING_FEE = 5;

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

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// The office only prices the item types it knows how to premium. Derived from
// ITEM_BASE_PREMIUMS so the two never drift apart.
const KNOWN_ITEM_TYPES = new Set(Object.keys(ITEM_BASE_PREMIUMS));

const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

// A building block of exactly 3 alike components is priced as a block
// (25 G x 3 = 75 G individually, but 60 G as a block).
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const baseUnit = (type: string): number => ITEM_BASE_PREMIUMS[type] ?? 0;

const groupBase = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return baseUnit(type) * count;
};

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const policyBasePremium = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += groupBase(type, count);
  }
  return total;
};

const rateWhen = (applies: boolean, base: number, rate: number): number =>
  applies ? base * rate : 0;

const itemSurcharge = (item: Item): number => {
  const base = baseUnit(item.type);
  const isHighlyEnchanted =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
  const curse = rateWhen(item.cursed ?? false, base, CURSE_SURCHARGE_RATE);
  const highEnchantment = rateWhen(
    isHighlyEnchanted,
    base,
    HIGH_ENCHANTMENT_RATE,
  );
  return curse + highEnchantment;
};

const policySurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const loyaltyDiscount = (basePremium: number, customer: Customer): number =>
  rateWhen(
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    basePremium,
    LOYALTY_DISCOUNT_RATE,
  );

// Fractional Gold always lands in MHPCO's favor: premiums round up, payouts
// round down. The two rules are mirror images, so they live together.
const roundPremiumUp = (premium: number): number => Math.ceil(premium);
const roundPayoutDown = (payout: number): number => Math.floor(payout);

const stepPremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const basePremium = policyBasePremium(step.items);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const surcharges = policySurcharges(step.items);
  const discount = loyaltyDiscount(basePremium, customer);
  const followUpDiscount = rateWhen(
    isFollowUp,
    basePremium,
    FOLLOWUP_DISCOUNT_RATE,
  );
  return (
    basePremium +
    surcharges +
    firstInsurance -
    discount -
    followUpDiscount +
    PROCESSING_FEE
  );
};

// The follow-up discount applies to every quote after the customer's first
// quote.
const followsAPriorQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some((prior) => prior.op === "quote");

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0);

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const reimbursableAmount = (item: Item, amount: number): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : amount;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(item, damage.amount) - DEDUCTIBLE);

// The item covered by the policy that a given damage refers to. A later test
// will handle a damage that names an item the policy does not cover; that
// error handling belongs here.
const insuredItemFor = (policy: QuoteStep, damage: Damage): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const claimPayout = (policy: QuoteStep, incident: Incident): number =>
  incident.damages.reduce(
    (total, damage) =>
      total + damagePayout(damage, insuredItemFor(policy, damage)),
    0,
  );

const rejectNegativeAmounts = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
};

const rejectOverClaims = (policy: QuoteStep, incident: Incident): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countBy(incident.damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(
        `claim damages ${count} ${type}(s) but policy covers fewer`,
      );
    }
  }
};

const validateClaim = (policy: QuoteStep, incident: Incident): void => {
  rejectNegativeAmounts(incident);
  rejectOverClaims(policy, incident);
};

// A policy's total payout cap starts at twice its unmodified insurance sum
// and is consumed across successive claims.
const initialCap = (policy: QuoteStep): number =>
  policyInsuranceSum(policy.items) * CAP_MULTIPLIER;

// Clamps a desired payout to the cap remaining for a policy, then records the
// cap left over. This owns the cap-state mutation; the caller stays a pure
// payout calculation.
const applyCap = (
  remainingCaps: Map<number, number>,
  policyIndex: number,
  policy: QuoteStep,
  desired: number,
): { payout: number; remainingCap: number } => {
  const capBefore = remainingCaps.get(policyIndex) ?? initialCap(policy);
  const payout = Math.min(desired, capBefore);
  const remainingCap = capBefore - payout;
  remainingCaps.set(policyIndex, remainingCap);
  return { payout, remainingCap };
};

const processClaim = (
  claim: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policy = steps[claim.policy] as QuoteStep;
  validateClaim(policy, claim.incident);
  const desired = roundPayoutDown(claimPayout(policy, claim.incident));
  return applyCap(remainingCaps, claim.policy, policy, desired);
};

const validateQuote = (quote: QuoteStep): void => {
  for (const item of quote.items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const processQuote = (
  quote: QuoteStep,
  scenario: Scenario,
  index: number,
): { premium: number } => {
  validateQuote(quote);
  return {
    premium: roundPremiumUp(
      stepPremium(
        quote,
        scenario.customer,
        followsAPriorQuote(scenario.steps, index),
      ),
    ),
  };
};

export const processScenario = (scenario: Scenario): { results: unknown[] } => {
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index) =>
    step.op === "claim"
      ? processClaim(step, scenario.steps, remainingCaps)
      : processQuote(step, scenario, index),
  );
  return { results };
};
