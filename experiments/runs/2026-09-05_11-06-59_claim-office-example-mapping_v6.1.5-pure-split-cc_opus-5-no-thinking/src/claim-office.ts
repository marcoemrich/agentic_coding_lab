const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_ITEM_TYPE = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const satisfies Record<string, number>;

type InsurableItemType = keyof typeof BASE_PREMIUM_BY_ITEM_TYPE;

const INSURANCE_VALUE_BY_ITEM_TYPE = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
} as const satisfies Record<InsurableItemType, number>;

const DEDUCTIBLE_PER_DAMAGE = 100;

// Distinct from HIGH_ENCHANTMENT_THRESHOLD: that one raises the premium at
// level 5, this one halves the reimbursement at level 8.
const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;

const REIMBURSEMENT_ENCHANTMENT_RATE = 0.5;

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const BLOCK_SIZE = 3;

const BLOCK_BASE_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const LOYALTY_YEARS_THRESHOLD = 2;

const LOYALTY_DISCOUNT_RATE = 0.2;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };

export type ScenarioResult = QuoteResult | ClaimResult;

export type ScenarioOutcome = { results: ScenarioResult[] };

type Item = {
  type: InsurableItemType;
  cursed?: boolean;
  enchantment?: number;
};

type Customer = { yearsWithMHPCO: number };

type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: string; amount: number };

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

type Step = QuoteStep | ClaimStep;

export type Scenario = { customer: Customer; steps: Step[] };

// One rounding rule, stated once: a fractional amount always settles in the
// MHPCO's favour, so the direction follows the direction the money moves.
// Money the customer pays rounds up; money the customer receives rounds down.
const roundAmountCustomerPays = Math.ceil;
const roundAmountCustomerReceives = Math.floor;

const countByItemType = (items: Item[]): Map<InsurableItemType, number> => {
  const counts = new Map<InsurableItemType, number>();

  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  return counts;
};

// Exactly 3 alike components form a building block at a special base premium.
const basePremiumForAlikeItems = (
  type: InsurableItemType,
  count: number,
): number =>
  count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * BASE_PREMIUM_BY_ITEM_TYPE[type];

const basePremiumOf = (items: Item[]): number =>
  [...countByItemType(items)]
    .map(([type, count]) => basePremiumForAlikeItems(type, count))
    .reduce((total, premium) => total + premium, 0);

const ownBasePremiumOf = (item: Item): number =>
  BASE_PREMIUM_BY_ITEM_TYPE[item.type];

// Item-specific modifiers apply to the affected item's own base premium,
// not to the policy total.
type ItemModifier = { appliesTo: (item: Item) => boolean; rate: number };

const CURSE_MODIFIER: ItemModifier = {
  appliesTo: (item) => item.cursed === true,
  rate: CURSE_SURCHARGE_RATE,
};

const HIGH_ENCHANTMENT_MODIFIER: ItemModifier = {
  appliesTo: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
  rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
};

const ITEM_MODIFIERS: ItemModifier[] = [
  CURSE_MODIFIER,
  HIGH_ENCHANTMENT_MODIFIER,
];

const itemSurchargeOf = (items: Item[], modifier: ItemModifier): number =>
  items
    .filter(modifier.appliesTo)
    .reduce((total, item) => total + ownBasePremiumOf(item) * modifier.rate, 0);

// Item modifiers accumulate: an item matching several of them pays each
// surcharge on its own base premium.
const itemSurchargesOf = (items: Item[]): number =>
  ITEM_MODIFIERS.reduce(
    (total, modifier) => total + itemSurchargeOf(items, modifier),
    0,
  );

// Policy-wide modifiers are computed from the policy base premium, so the
// first insurance surcharge is 10 % of the base — not of base plus curse.
// A modifier's rate is signed: surcharges are positive, discounts negative.
type PolicyContext = { customer: Customer; precedingQuotes: number };

type PolicyModifier = {
  appliesTo: (context: PolicyContext) => boolean;
  rate: number;
};

const FIRST_INSURANCE_MODIFIER: PolicyModifier = {
  appliesTo: () => true,
  rate: FIRST_INSURANCE_SURCHARGE_RATE,
};

const LOYALTY_MODIFIER: PolicyModifier = {
  appliesTo: ({ customer }) =>
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
  rate: -LOYALTY_DISCOUNT_RATE,
};

// Each item in a quote counts as a first insurance regardless of customer
// history, so this discount stacks with the first insurance surcharge.
const FOLLOW_UP_CONTRACT_MODIFIER: PolicyModifier = {
  appliesTo: ({ precedingQuotes }) => precedingQuotes >= 1,
  rate: -FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
};

const POLICY_MODIFIERS: PolicyModifier[] = [
  FIRST_INSURANCE_MODIFIER,
  LOYALTY_MODIFIER,
  FOLLOW_UP_CONTRACT_MODIFIER,
];

// Policy modifiers accumulate: each applicable one is computed on the same
// policy base premium, never compounded on top of another.
const policyAdjustmentOf = (
  basePremium: number,
  context: PolicyContext,
): number =>
  POLICY_MODIFIERS.filter((modifier) => modifier.appliesTo(context)).reduce(
    (total, modifier) => total + basePremium * modifier.rate,
    0,
  );

const quotePremium = (items: Item[], context: PolicyContext): number => {
  const basePremium = basePremiumOf(items);

  return roundAmountCustomerPays(
    basePremium +
      itemSurchargesOf(items) +
      policyAdjustmentOf(basePremium, context) +
      PROCESSING_FEE,
  );
};

const insuranceSumOf = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + INSURANCE_VALUE_BY_ITEM_TYPE[item.type],
    0,
  );

// A reimbursement clause reduces the damage amount to a fraction of itself,
// keyed on the insured item's attributes — which the damage entry does not
// carry, it names only the item type. Same {appliesTo, rate} shape as
// ItemModifier, but the rate is a share of the damage rather than a surcharge
// on a base premium. Only one clause exists so far, so the selection below is
// a plain conditional; a second clause will need a rule for which one wins.
type ReimbursementClause = { appliesTo: (item: Item) => boolean; rate: number };

const HIGH_ENCHANTMENT_CLAUSE: ReimbursementClause = {
  appliesTo: (item) =>
    (item.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD,
  rate: REIMBURSEMENT_ENCHANTMENT_RATE,
};

const FULL_REIMBURSEMENT_RATE = 1;

const reimbursementRateFor = (insuredItem: Item): number =>
  HIGH_ENCHANTMENT_CLAUSE.appliesTo(insuredItem)
    ? HIGH_ENCHANTMENT_CLAUSE.rate
    : FULL_REIMBURSEMENT_RATE;

const reimbursementFor = (damageAmount: number, insuredItem: Item): number =>
  damageAmount * reimbursementRateFor(insuredItem);

// Each damage entry is a distinct damaged item, so it claims one insured item
// of that type and no other entry may claim the same one.
const claimInsuredItem = (
  damage: Damage,
  unclaimedItems: Item[],
): { insuredItem: Item; remainingItems: Item[] } => {
  const index = unclaimedItems.findIndex(
    (item) => item.type === damage.itemType,
  );

  if (index === -1) {
    throw new Error(
      `the policy does not cover a damaged ${damage.itemType}`,
    );
  }

  return {
    insuredItem: unclaimedItems[index],
    remainingItems: unclaimedItems.filter((_, at) => at !== index),
  };
};

// Rejecting a damage entry is kept apart from pricing it, so payoutForDamage
// below is purely a calculation and its name stays true. Zero is a valid
// amount: the spec rejects only negative ones.
//
// All four throw sites (this one, rejectInvalidDamage, claimInsuredItem and
// policyCreatedBy) raise a plain Error. A named error type has been
// reconsidered at each and deferred again: no consumer discriminates between
// them — every test asserts a bare .toThrow() or matches the message text, and
// all four mean the same thing, "the submitted scenario is invalid". The CLI is
// the first real consumer; introduce a type when a CLI test demands different
// handling per cause, not merely a non-zero exit.
// The MHPCO insures only the item types on its price list.
const rejectUninsurableItem = (item: Item): void => {
  if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) {
    throw new Error(`the MHPCO does not insure a ${item.type}`);
  }
};

const rejectInvalidDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(
      `the damage to the ${damage.itemType} is a negative amount`,
    );
  }
};

// A deductible applies per damage event, i.e. once per damaged item.
const payoutForDamage = (damage: Damage, insuredItem: Item): number =>
  reimbursementFor(damage.amount, insuredItem) - DEDUCTIBLE_PER_DAMAGE;

// Each damage entry carries its own deductible, so this is a plain sum over
// the entries. The policy's cap is applied by the caller.
const desiredPayoutForIncident = (
  damages: Damage[],
  insuredItems: Item[],
): number =>
  damages.reduce(
    ({ total, unclaimedItems }, damage) => {
      rejectInvalidDamage(damage);

      const { insuredItem, remainingItems } = claimInsuredItem(
        damage,
        unclaimedItems,
      );

      return {
        total: total + payoutForDamage(damage, insuredItem),
        unclaimedItems: remainingItems,
      };
    },
    { total: 0, unclaimedItems: insuredItems },
  ).total;

// A policy is created by a quote step; claims draw down its remaining cap.
// The insured items are retained because payout clauses depend on them.
type Policy = { remainingCap: number; items: Item[] };

const capFor = (items: Item[]): number =>
  insuranceSumOf(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;

// A claim quotes its policy by the index of the step that created it, so
// policies are keyed by that index rather than collected in a list.
type ScenarioState = {
  customer: Customer;
  policiesByStep: Map<number, Policy>;
  precedingQuotes: number;
  results: ScenarioResult[];
};

const initialState = (customer: Customer): ScenarioState => ({
  customer,
  policiesByStep: new Map(),
  precedingQuotes: 0,
  results: [],
});

// Each step handler folds the state forward: it reads what earlier steps
// established and returns the state the following steps will see.
const applyQuote = (
  state: ScenarioState,
  step: QuoteStep,
  stepIndex: number,
): ScenarioState => {
  const { customer, precedingQuotes } = state;

  step.items.forEach(rejectUninsurableItem);

  const premium = quotePremium(step.items, { customer, precedingQuotes });

  return {
    ...state,
    policiesByStep: new Map(state.policiesByStep).set(stepIndex, {
      remainingCap: capFor(step.items),
      items: step.items,
    }),
    precedingQuotes: precedingQuotes + 1,
    results: [...state.results, { premium }],
  };
};

// A resolving guard rather than a void `reject*` one: the other validators
// check a value the caller already holds, this one produces the value. Hence
// the noun name — it reads as a lookup that refuses to fail silently.
const policyCreatedBy = (
  stepIndex: number,
  policiesByStep: Map<number, Policy>,
): Policy => {
  const policy = policiesByStep.get(stepIndex);

  if (policy === undefined) {
    throw new Error(`no policy was created by step ${stepIndex}`);
  }

  return policy;
};

const applyClaim = (state: ScenarioState, step: ClaimStep): ScenarioState => {
  const policy = policyCreatedBy(step.policy, state.policiesByStep);

  const desiredPayout = desiredPayoutForIncident(
    step.incident.damages,
    policy.items,
  );
  // The total payout per policy is capped, so a claim can pay out no more
  // than the cap the policy has left.
  const payout = roundAmountCustomerReceives(
    Math.min(desiredPayout, policy.remainingCap),
  );
  const remainingCap = policy.remainingCap - payout;

  return {
    ...state,
    policiesByStep: new Map(state.policiesByStep).set(step.policy, {
      ...policy,
      remainingCap,
    }),
    results: [...state.results, { payout, remainingCap }],
  };
};

const applyStep = (
  state: ScenarioState,
  step: Step,
  stepIndex: number,
): ScenarioState =>
  step.op === "quote"
    ? applyQuote(state, step, stepIndex)
    : applyClaim(state, step);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

// Each step's envelope — that it is an object naming an operation this domain
// runs, and carries the field that operation needs. Only the envelope: an
// item's `type` or a damage's `amount` is still the domain's to judge, so those
// keep producing their own descriptions. The line sits exactly where a value
// would otherwise be dereferenced blind (`step.items.forEach`, `step.op`) and
// surface a JavaScript internal instead of a description of the input.
const parseQuoteStep = (
  step: Record<string, unknown>,
  stepIndex: number,
): QuoteStep => {
  if (!Array.isArray(step.items)) {
    throw new Error(`the quote at step ${stepIndex} needs an array of items`);
  }

  return { op: "quote", items: step.items };
};

const parseClaimStep = (
  step: Record<string, unknown>,
  stepIndex: number,
): ClaimStep => {
  if (typeof step.policy !== "number") {
    throw new Error(`the claim at step ${stepIndex} needs a policy number`);
  }

  if (!isObject(step.incident) || !Array.isArray(step.incident.damages)) {
    throw new Error(
      `the claim at step ${stepIndex} needs an incident with an array of damages`,
    );
  }

  return {
    op: "claim",
    policy: step.policy,
    incident: {
      cause: String(step.incident.cause),
      damages: step.incident.damages,
    },
  };
};

const parseStep = (step: unknown, stepIndex: number): Step => {
  if (!isObject(step)) {
    throw new Error(`step ${stepIndex} must be an object`);
  }

  if (step.op === "quote") return parseQuoteStep(step, stepIndex);
  if (step.op === "claim") return parseClaimStep(step, stepIndex);

  throw new Error(
    `step ${stepIndex} must be a quote or a claim, not ${JSON.stringify(step.op)}`,
  );
};

// The wire boundary: stdin carries arbitrary JSON, so the scenario shape is
// checked here rather than asserted. The check runs only as deep as the shape
// the domain relies on structurally; the values inside are the domain's to
// reject, with its own wording.
export const parseScenario = (input: unknown): Scenario => {
  if (!isObject(input)) {
    throw new Error("the scenario must be an object");
  }

  const { customer, steps } = input;

  if (!isObject(customer) || typeof customer.yearsWithMHPCO !== "number") {
    throw new Error(
      "the scenario needs a customer with a numeric yearsWithMHPCO",
    );
  }

  if (!Array.isArray(steps)) {
    throw new Error("the scenario needs an array of steps");
  }

  return {
    customer: { yearsWithMHPCO: customer.yearsWithMHPCO },
    steps: steps.map(parseStep),
  };
};

export const runScenario = ({ customer, steps }: Scenario): ScenarioOutcome => {
  const { results } = steps.reduce(applyStep, initialState(customer));

  return { results };
};
