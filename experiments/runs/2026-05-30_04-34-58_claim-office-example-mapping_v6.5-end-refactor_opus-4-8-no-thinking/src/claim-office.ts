interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
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

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

// Strip floating-point noise (e.g. 197.49999999) before rounding so that
// arithmetic artefacts don't push the result across a whole Gold boundary.
const NOISE_FREE_DECIMALS = 6;
const roundAfterStrippingNoise = (amount: number, roundFn: (n: number) => number): number =>
  roundFn(Number(amount.toFixed(NOISE_FREE_DECIMALS)));

// Premiums are rounded up; payouts are rounded down (in the office's favour).
const roundPremiumUp = (amount: number): number => roundAfterStrippingNoise(amount, Math.ceil);
const roundPayoutDown = (amount: number): number => roundAfterStrippingNoise(amount, Math.floor);

// A block applies only to a group of exactly BLOCK_SIZE alike components,
// priced at BLOCK_PREMIUM; any other count is priced individually.
const componentBasePremium = (count: number, perComponent: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * perComponent;
};

const sum = (amounts: number[]): number => amounts.reduce((acc, amount) => acc + amount, 0);

const isKnownItemType = (type: string): boolean => BASE_PREMIUM[type] !== undefined;

// A quote may only insure item types the office prices. An unknown type has no
// premium or insurance value, so we reject the whole quote rather than guess.
const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown !== undefined) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);
const isMainItem = (item: Item): boolean => !isComponent(item);

// Tally how many values fall under each key the selector returns.
const countBy = <T>(values: T[], keyOf: (value: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = keyOf(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const countByType = (items: Item[]): Record<string, number> =>
  countBy(items, (item) => item.type);

// A surcharge rate is an additive percentage applied on top of a base premium.
const applySurcharge = (base: number, rate: number): number => base * (1 + rate);

// A conditional rate: the given percentage when its condition holds, else 0.
// Used for both item surcharges and policy-wide discounts.
const rateWhen = (applies: boolean, rate: number): number => (applies ? rate : 0);

// Item-specific surcharges are additive percentages of the item's base premium.
// First insurance applies to every item; the others only when their condition holds.
const itemSurchargeRate = (item: Item): number =>
  sum([
    FIRST_INSURANCE_SURCHARGE,
    rateWhen(item.cursed === true, CURSE_SURCHARGE),
    rateWhen((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD, HIGH_ENCHANTMENT_SURCHARGE),
  ]);

const mainItemPremium = (item: Item): number =>
  applySurcharge(BASE_PREMIUM[item.type], itemSurchargeRate(item));

const componentGroupBases = (items: Item[]): number[] =>
  Object.entries(countByType(items.filter(isComponent))).map(([type, count]) =>
    componentBasePremium(count, BASE_PREMIUM[type]),
  );

// Sum of item base premiums with block pricing but no surcharges; the basis
// for policy-wide modifiers (loyalty, follow-up).
const policyBasePremium = (items: Item[]): number =>
  sum(items.filter(isMainItem).map((item) => BASE_PREMIUM[item.type])) +
  sum(componentGroupBases(items));

// Sum of item premiums including item-specific surcharges (curse, high
// enchantment, first insurance).
const itemsPremium = (items: Item[]): number => {
  const mainItemsPremium = sum(items.filter(isMainItem).map(mainItemPremium));
  const componentsPremium = sum(
    componentGroupBases(items).map((base) => applySurcharge(base, FIRST_INSURANCE_SURCHARGE)),
  );
  return mainItemsPremium + componentsPremium;
};

// Policy-wide discounts are a rate applied to the unmodified policy base.
// Loyalty is one such discount; the follow-up-contract discount will be another.
const policyWideDiscount = (rate: number, policyBase: number): number => rate * policyBase;

const loyaltyDiscountRate = (yearsWithMHPCO: number): number =>
  rateWhen(yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, LOYALTY_DISCOUNT);

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowup: boolean): number => {
  const surcharged = itemsPremium(items);
  const policyBase = policyBasePremium(items);
  const discountRate = loyaltyDiscountRate(yearsWithMHPCO) + rateWhen(isFollowup, FOLLOWUP_DISCOUNT);
  const discount = policyWideDiscount(discountRate, policyBase);
  return roundPremiumUp(surcharged - discount + PROCESSING_FEE);
};

const insuranceSum = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUE[item.type]));

const findInsuredItem = (policyItems: Item[], itemType: string): Item | undefined =>
  policyItems.find((item) => item.type === itemType);

const isHighlyEnchanted = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

// The damaged item's traits decide what fraction of the damage is reimbursed
// before the deductible. Clauses are checked in priority order, so the first
// matching one wins; a full reimbursement applies when none does.
const reimbursementRate = (item: Item | undefined): number => {
  if (isHighlyEnchanted(item)) return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return FULL_REIMBURSEMENT_RATE;
};

const reimbursement = (item: Item | undefined, amount: number): number =>
  amount * reimbursementRate(item);

const damagePayout = (damage: Damage, item: Item | undefined): number =>
  Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);

// A damage amount represents a loss, so it cannot be negative.
const assertDamageAmountsNonNegative = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(`Negative damage amount: ${negative.amount}`);
  }
};

// A claim may only report as many damages of a type as the policy insures of
// that type; an uninsured type insures zero, so it is rejected too.
const assertDamagesWithinInsuredCounts = (policyItems: Item[], damages: Damage[]): void => {
  const insured = countByType(policyItems);
  const damaged = countBy(damages, (damage) => damage.itemType);
  const excessType = Object.keys(damaged).find((type) => damaged[type] > (insured[type] ?? 0));
  if (excessType !== undefined) {
    throw new Error(`Too many damages for item type: ${excessType}`);
  }
};

// A claim is valid only if every damage is a non-negative loss and no item type
// is damaged more times than the policy insures it.
const assertClaimValid = (policyItems: Item[], incident: ClaimStep["incident"]): void => {
  assertDamageAmountsNonNegative(incident.damages);
  assertDamagesWithinInsuredCounts(policyItems, incident.damages);
};

// The uncapped payout an incident would pay before the policy's remaining cap
// is applied: each damage reimbursed per its item's clause, less the deductible.
const incidentPayout = (policyItems: Item[], incident: ClaimStep["incident"]): number =>
  sum(
    incident.damages.map((damage) =>
      damagePayout(damage, findInsuredItem(policyItems, damage.itemType)),
    ),
  );

interface Policy {
  items: Item[];
  remainingCap: number;
}

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const { yearsWithMHPCO } = scenario.customer;
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;

  const handleQuote = (step: QuoteStep, index: number): { premium: number } => {
    assertKnownItemTypes(step.items);
    policies[index] = {
      items: step.items,
      remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
    };
    const isFollowup = quoteCount > 0;
    quoteCount += 1;
    return { premium: quotePremium(step.items, yearsWithMHPCO, isFollowup) };
  };

  const handleClaim = (step: ClaimStep): { payout: number; remainingCap: number } => {
    const policy = policies[step.policy];
    assertClaimValid(policy.items, step.incident);
    const desiredPayout = incidentPayout(policy.items, step.incident);
    const payout = roundPayoutDown(Math.min(desiredPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  };

  const results = scenario.steps.map((step, index) =>
    step.op === "claim" ? handleClaim(step) : handleQuote(step, index),
  );

  return { results };
};
