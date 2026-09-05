export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };

export type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};
export type Customer = { yearsWithMHPCO: number };
export type Scenario = { customer: Customer; steps: Step[] };

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;
export type ScenarioResult = { results: StepResult[] };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HALVED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALVED_REIMBURSEMENT_RATE = 0.5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE = 5;

const CURSE_SURCHARGE_RATE = 0.5;
const SURCHARGED_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

// Exactly three items of one type are priced as a discounted block; any other
// count, including four or more, is priced per item.
const basePremiumForAlikeGroup = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];

const policyBasePremium = (items: Item[]): number =>
  sum(
    [...countByType(items)].map(([type, count]) =>
      basePremiumForAlikeGroup(type, count),
    ),
  );

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type];

// Only types the MHPCO publishes a price for can be insured. Checked up front
// so an unpriced type is reported by name, rather than silently making every
// downstream premium NaN.
const rejectUnpricedItems = (items: Item[]): void => {
  const unpriced = items.find((item) => !(item.type in BASE_PREMIUMS));
  if (unpriced) {
    throw new Error(`Unknown item type: ${unpriced.type}`);
  }
};

const isCursed = (item: Item): boolean => item.cursed === true;

const attractsEnchantmentSurcharge = (item: Item): boolean =>
  (item.enchantment ?? 0) >= SURCHARGED_ENCHANTMENT_LEVEL;

const curseSurcharge = (item: Item): number =>
  isCursed(item) ? itemBasePremium(item) * CURSE_SURCHARGE_RATE : 0;

const enchantmentSurcharge = (item: Item): number =>
  attractsEnchantmentSurcharge(item)
    ? itemBasePremium(item) * ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemModifierSurcharges = (items: Item[]): number =>
  sum(items.map((item) => curseSurcharge(item) + enchantmentSurcharge(item)));

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

// Policy-wide modifiers are rates applied to the policy base premium.
// Surcharges are positive, discounts negative; they sum to one net rate.
const policyModifierRates = (
  customer: Customer,
  isFollowUpContract: boolean,
): number[] => [
  FIRST_INSURANCE_SURCHARGE_RATE,
  isLoyalCustomer(customer) ? -LOYALTY_DISCOUNT_RATE : 0,
  isFollowUpContract ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0,
];

const netPolicyModifierRate = (
  customer: Customer,
  isFollowUpContract: boolean,
): number => sum(policyModifierRates(customer, isFollowUpContract));

const quotePremium = (
  customer: Customer,
  items: Item[] = [],
  isFollowUpContract = false,
): number => {
  const policyBase = policyBasePremium(items);
  const policyModifiers =
    policyBase * netPolicyModifierRate(customer, isFollowUpContract);
  return Math.ceil(
    policyBase +
      itemModifierSurcharges(items) +
      policyModifiers +
      PROCESSING_FEE,
  );
};

type Policy = { items: Item[]; remainingCap: number };

const insuranceSum = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type]));

const hasHalvedReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALVED_REIMBURSEMENT_ENCHANTMENT_LEVEL;

const reimbursedAmount = (item: Item, damage: Damage): number =>
  hasHalvedReimbursement(item)
    ? damage.amount * HALVED_REIMBURSEMENT_RATE
    : damage.amount;

const damagePayout = (item: Item, damage: Damage): number =>
  reimbursedAmount(item, damage) - DEDUCTIBLE_PER_DAMAGE;

type ClaimedItem = { item: Item; damage: Damage };

// Removes and returns the first still-unclaimed item of the wanted type. A
// damage with no item left to match is not covered — either the type was
// never insured, or every insured item of that type has already been matched
// to an earlier damage in this same incident.
const takeInsuredItemOfType = (unclaimed: Item[], itemType: string): Item => {
  const matchIndex = unclaimed.findIndex((item) => item.type === itemType);
  if (matchIndex === -1) {
    throw new Error(
      `Damage reported for a ${itemType} that is not covered by this policy`,
    );
  }
  return unclaimed.splice(matchIndex, 1)[0];
};

// A damage cannot be for less than nothing; a negative amount is a malformed
// report rather than a claim the MHPCO can settle.
const rejectNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`Damage amount cannot be negative: ${negative.amount}`);
  }
};

// Each damage entry is matched to a distinct insured item, so a policy
// covering two swords can absorb two separate sword damages but no more.
// Matching against a copy of the item list means each item is consumed at
// most once, and pairing the two up here keeps that correspondence in the
// data rather than leaving callers to line up two arrays by index.
const matchDamagesToItems = (
  policy: Policy,
  damages: Damage[],
): ClaimedItem[] => {
  const unclaimed = [...policy.items];
  return damages.map((damage) => ({
    item: takeInsuredItemOfType(unclaimed, damage.itemType),
    damage,
  }));
};

// Payouts are summed as exact fractions and only then rounded down, so that
// rounding happens once per claim rather than once per damaged item.
const desiredPayout = (policy: Policy, incident: Incident): number =>
  Math.floor(
    sum(
      matchDamagesToItems(policy, incident.damages).map(({ item, damage }) =>
        damagePayout(item, damage),
      ),
    ),
  );

const settleClaim = (policy: Policy, incident: Incident): ClaimResult => {
  rejectNegativeDamages(incident.damages);
  const payout = Math.min(desiredPayout(policy, incident), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

export const runScenario = (scenario: Scenario): ScenarioResult => {
  // Policies are keyed by the index of the quote step that opened them;
  // a claim step names that index in `step.policy`.
  const policies = new Map<number, Policy>();

  const quoteStep = (step: Step, stepIndex: number): QuoteResult => {
    const items = step.items ?? [];
    rejectUnpricedItems(items);
    // A quote is a follow-up when some earlier step already opened a policy,
    // so this must be read before the new policy is registered below.
    const isFollowUpContract = policies.size > 0;
    policies.set(stepIndex, openPolicy(items));
    return {
      premium: quotePremium(scenario.customer, items, isFollowUpContract),
    };
  };

  // A claim must name a policy opened by an earlier quote step, and carry the
  // incident being claimed for. Reported by step index rather than trusted,
  // so a malformed scenario is rejected with a description an operator can
  // act on instead of a TypeError from deep inside the payout calculation.
  const policyClaimedBy = (step: Step): Policy => {
    const policy =
      step.policy === undefined ? undefined : policies.get(step.policy);
    if (!policy) {
      throw new Error(`Claim refers to unknown policy: ${step.policy}`);
    }
    return policy;
  };

  const claimStep = (step: Step): ClaimResult => {
    if (!step.incident) {
      throw new Error("Claim is missing an incident");
    }
    return settleClaim(policyClaimedBy(step), step.incident);
  };

  const results = scenario.steps.map((step, stepIndex): StepResult =>
    step.op === "claim" ? claimStep(step) : quoteStep(step, stepIndex),
  );

  return { results };
};
