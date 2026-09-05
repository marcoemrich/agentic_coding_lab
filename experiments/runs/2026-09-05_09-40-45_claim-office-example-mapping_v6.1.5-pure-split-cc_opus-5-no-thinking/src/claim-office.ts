export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

// A scenario's results are heterogeneous: a quote step yields a premium, a
// claim step a payout and the cap left on its policy.
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResults = {
  results: StepResult[];
};

// --- Quotes ------------------------------------------------------------------

const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Charged on every quote, unconditionally — it is the cost of assessing the
// items, not a penalty for being a new customer. Named "first insurance" in
// some of the domain material, which misleads: it does not depend on customer
// history or on the quote's position in the scenario.
const INITIAL_ASSESSMENT_SURCHARGE_PERCENT = 10;

const WHOLE_PERCENT = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / WHOLE_PERCENT;

// The tables keyed by item type cover exactly the types the MHPCO insures.
// Anything else is not a mispriced item, it is not an item at all, so a lookup
// miss is an error rather than a zero. `priceName` names the price the table
// holds, so the rejection can say which one the item had none of.
const lookUpByItemType = (
  table: Record<string, number>,
  item: Item,
  priceName: string,
): number => {
  const value = table[item.type];

  if (value === undefined) {
    throw new Error(`unknown item type "${item.type}": no ${priceName}`);
  }

  return value;
};

const itemBasePremium = (item: Item): number =>
  lookUpByItemType(BASE_PREMIUM_BY_TYPE, item, "base premium");

const BLOCK_SIZE = 3;

const BLOCK_PREMIUM = 60;

const sumOf = (amounts: number[]): number =>
  amounts.reduce((sum, amount) => sum + amount, 0);

const formsABlock = (items: Item[]): boolean => items.length === BLOCK_SIZE;

const sumOfItemBasePremiums = (items: Item[]): number =>
  sumOf(items.map(itemBasePremium));

// Grouping by type is the one piece of knowledge shared by the two places that
// care about how many of a kind there are: premiums price alike items together,
// and a claim compares damaged counts against insured counts. Both take their
// key from a type field, so `typeOf` says which field on the element that is.
const groupByType = <T>(
  elements: T[],
  typeOf: (element: T) => string,
): Map<string, T[]> => {
  const groups = new Map<string, T[]>();

  for (const element of elements) {
    const type = typeOf(element);
    groups.set(type, [...(groups.get(type) ?? []), element]);
  }

  return groups;
};

const itemType = (item: Item): string => item.type;

// Items of the same type are "alike" and are priced together, so the policy
// base premium is computed group by group rather than item by item.
const alikeGroups = (items: Item[]): Item[][] => [
  ...groupByType(items, itemType).values(),
];

const alikeGroupBasePremium = (alikeItems: Item[]): number =>
  formsABlock(alikeItems)
    ? BLOCK_PREMIUM
    : sumOfItemBasePremiums(alikeItems);

const policyBasePremium = (items: Item[]): number =>
  sumOf(alikeGroups(items).map(alikeGroupBasePremium));

// One domain rule — "round in the MHPCO's favour" — which cuts in opposite
// directions depending on which way the money moves: a premium is collected, so
// a fraction rounds up; a payout is paid, so a fraction rounds down. The two are
// stated as separate functions rather than one taking a direction, because they
// share no computation, only a motive: a single helper would have to reintroduce
// the collected/paid distinction as a runtime conditional, and each call site
// would name its direction in an argument instead of in the function it calls.
// Both are applied to a final amount only; intermediates stay fractional.
const roundPremiumInMHPCOsFavor = (amount: number): number =>
  Math.ceil(amount);

const roundPayoutInMHPCOsFavor = (amount: number): number => Math.floor(amount);

// The inputs a single quote is computed from: `items` drives the base premium
// and item-scoped surcharges, `customer` and `precedingQuoteCount` drive the
// policy-wide modifiers. The count is of preceding QUOTE steps, not of steps in
// general — a claim step is not a contract and must not trigger the follow-up
// discount.
type QuoteRequest = {
  customer: Customer;
  items: Item[];
  precedingQuoteCount: number;
};

const LOYALTY_YEARS = 2;

const LOYALTY_DISCOUNT_PERCENT = 20;

// Modifier percents are signed so surcharges and discounts can be summed
// uniformly; a discount enters the sum as its negation.
const asDiscount = (percent: number): number => -percent;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

const isFollowUpContract = (request: QuoteRequest): boolean =>
  request.precedingQuoteCount > 0;

const policyModifierPercents = (request: QuoteRequest): number[] => [
  INITIAL_ASSESSMENT_SURCHARGE_PERCENT,
  ...(isLoyal(request.customer) ? [asDiscount(LOYALTY_DISCOUNT_PERCENT)] : []),
  ...(isFollowUpContract(request)
    ? [asDiscount(FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT)]
    : []),
];

// Policy-wide modifiers do NOT compound: each is an independent percentage of
// the policy base premium, and they are summed. Chaining them (base * 1.1 * 0.8)
// would give a different, wrong answer.
const applyPolicyModifiers = (
  basePremium: number,
  request: QuoteRequest,
): number =>
  basePremium +
  sumOf(
    policyModifierPercents(request).map((percent) =>
      percentOf(basePremium, percent),
    ),
  );

const CURSE_SURCHARGE_PERCENT = 50;

const HIGH_ENCHANTMENT_LEVEL = 5;

const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

const isCursed = (item: Item): boolean => item.cursed === true;

type ItemSurchargeRule = {
  applies: (item: Item) => boolean;
  percent: number;
};

const ITEM_SURCHARGE_RULES: ItemSurchargeRule[] = [
  { applies: isCursed, percent: CURSE_SURCHARGE_PERCENT },
  { applies: isHighlyEnchanted, percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT },
];

// Item-scoped surcharges are charged on the item's own base premium, so they
// must NOT go through applyPolicyModifiers.
const itemSurcharges = (item: Item): number =>
  sumOf(
    ITEM_SURCHARGE_RULES.filter((rule) => rule.applies(item)).map((rule) =>
      percentOf(itemBasePremium(item), rule.percent),
    ),
  );

const policyItemSurcharges = (items: Item[]): number =>
  sumOf(items.map(itemSurcharges));

const quotePremium = (request: QuoteRequest): number =>
  roundPremiumInMHPCOsFavor(
    applyPolicyModifiers(policyBasePremium(request.items), request) +
      policyItemSurcharges(request.items) +
      PROCESSING_FEE,
  );

// --- Claims -----------------------------------------------------------------
// An item's insurance value is what it is worth if destroyed, and is unrelated
// to its premium: the premium is what the customer pays to be covered. The two
// tables below happen to agree on a 10x ratio today, but that is a property of
// the current price list and not a rule of the domain — repricing premiums must
// not silently revalue payouts, so they stay separate.
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const itemInsuranceValue = (item: Item): number =>
  lookUpByItemType(INSURANCE_VALUE_BY_TYPE, item, "insurance value");

const insuranceSum = (items: Item[]): number =>
  sumOf(items.map(itemInsuranceValue));

// A policy pays out at most twice what it insures.
const CAP_MULTIPLIER = 2;

const policyCap = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(items);

const DEDUCTIBLE = 100;

const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;

const HALF_REIMBURSEMENT_PERCENT = 50;

const isHalfReimbursed = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL;

const DRAGON_MATERIAL = "dragon";

const isDragonMaterial = (item: Item): boolean =>
  item.material === DRAGON_MATERIAL;

// A damage entry names the item it damaged by type. The MHPCO only reimburses
// what it insured, so a type the policy does not cover is a rejection rather
// than an uncovered-but-tolerated entry.
const damagedItem = (insuredItems: Item[], damage: Damage): Item => {
  const item = insuredItems.find((insured) => insured.type === damage.itemType);

  if (item === undefined) {
    throw new Error(
      `damaged item "${damage.itemType}" is not covered by this policy`,
    );
  }

  return item;
};

const FULL_REIMBURSEMENT_PERCENT = 100;

// A reimbursement clause pays a stated percentage of the damage. Clauses are
// listed in precedence order and the first applicable one wins.
type ReimbursementClause = {
  applies: (item: Item) => boolean;
  percent: number;
};

const REIMBURSEMENT_CLAUSES: ReimbursementClause[] = [
  // Half reimbursement outranks the dragon clause: the spec's "50 % rule wins"
  // example is a dragon-material item enchanted to 8, and it pays out half.
  { applies: isHalfReimbursed, percent: HALF_REIMBURSEMENT_PERCENT },
  // "Damage to items made of dragon material is fully reimbursed." This clause
  // is currently indistinguishable from the fallback below — every example it
  // matches would reimburse in full anyway, so removing it would not change a
  // single result, and no test can tell it is here. It is stated regardless
  // because it is a rule the domain asserts about dragon material, not an
  // accident of what the other rules happen to leave over. Should a future rule
  // ever reduce reimbursement below 100 % for some other reason, dragon items
  // must keep their full payout, and this line is what will say so.
  { applies: isDragonMaterial, percent: FULL_REIMBURSEMENT_PERCENT },
];

// An item no clause matches is reimbursed in full: that is the domain's
// default, not a fallback for a missing item. `damagedItem` now rejects a
// damage naming a type the policy does not cover, so there is no such thing
// here as an item that isn't there.
const reimbursementPercent = (item: Item): number =>
  REIMBURSEMENT_CLAUSES.find((clause) => clause.applies(item))?.percent ??
  FULL_REIMBURSEMENT_PERCENT;

// A damage is something that happened to an item; a negative one is not a
// smaller damage but a nonsensical report, so it is rejected rather than
// netted off against the rest of the claim.
const damageAmount = (damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(
      `damage amount ${damage.amount} for "${damage.itemType}" is negative`,
    );
  }

  return damage.amount;
};

// What a damage entry reimburses before the deductible: a percentage of the
// damage amount, decided by the clauses covering the damaged item.
const reimbursableAmount = (insuredItems: Item[], damage: Damage): number =>
  percentOf(
    damageAmount(damage),
    reimbursementPercent(damagedItem(insuredItems, damage)),
  );

// The deductible applies once per damage event, i.e. per entry in `damages`,
// and always last — after the clause has decided the reimbursable amount.
const damagePayout = (insuredItems: Item[], damage: Damage): number =>
  reimbursableAmount(insuredItems, damage) - DEDUCTIBLE;

// --- Running a scenario ------------------------------------------------------

const isQuote = (step: Step): boolean => step.op === "quote";

// What the scenario has accumulated so far. Steps are folded rather than mapped
// because a step's result depends on the steps before it: `precedingQuoteCount`
// drives the follow-up discount today, and claim steps will thread a remaining
// cap through the same carry.
// A policy as it stands at some point in the scenario: what it insures, and how
// much of its cap is left. The remaining cap belongs to the policy rather than
// to a side table because successive claims spend it down — it is the one part
// of a policy that changes over the scenario's lifetime.
type Policy = {
  insuredItems: Item[];
  remainingCap: number;
};

const issuePolicy = (insuredItems: Item[]): Policy => ({
  insuredItems,
  remainingCap: policyCap(insuredItems),
});

type ScenarioState = {
  results: StepResult[];
  precedingQuoteCount: number;
  // Policies issued by earlier quote steps, keyed by that step's index — a
  // claim names its policy that way (`step.policy`).
  policiesByStep: Map<number, Policy>;
};

const INITIAL_STATE: ScenarioState = {
  results: [],
  precedingQuoteCount: 0,
  policiesByStep: new Map(),
};

const withPolicy = (
  state: ScenarioState,
  stepIndex: number,
  policy: Policy,
): ScenarioState => ({
  ...state,
  policiesByStep: new Map(state.policiesByStep).set(stepIndex, policy),
});

// Running a step is a state transition: it reads the carry accumulated by the
// preceding steps and returns the next carry. Each step kind has its own runner
// and `runStep` below is pure dispatch on `op`, so the quote and claim paths
// share only the state they thread, not their logic.
type StepRunner = (
  customer: Customer,
  state: ScenarioState,
  step: Step,
  stepIndex: number,
) => ScenarioState;

const appendResult = (
  state: ScenarioState,
  result: StepResult,
): ScenarioState => ({ ...state, results: [...state.results, result] });

const runQuoteStep: StepRunner = (customer, state, step, stepIndex) => {
  const items = step.items ?? [];

  const premium = quotePremium({
    customer,
    items,
    precedingQuoteCount: state.precedingQuoteCount,
  });

  return withPolicy(
    {
      ...appendResult(state, { premium }),
      precedingQuoteCount: state.precedingQuoteCount + 1,
    },
    stepIndex,
    issuePolicy(items),
  );
};

// A claim names its policy by the index of the quote step that issued it. A
// claim that names no policy, or names one no quote step issued, is not a claim
// for 0 G — there is nothing to claim against, so it is rejected. Resolving
// yields the key as well as the policy, so that debiting the cap later needs no
// second, separately-justified lookup of `step.policy` — the key travelled with
// the thing it addresses.
type ClaimedPolicy = { key: number; policy: Policy };

const claimedPolicy = (state: ScenarioState, step: Step): ClaimedPolicy => {
  const key = step.policy;

  if (key === undefined) {
    throw new Error("claim names no policy");
  }

  const policy = state.policiesByStep.get(key);

  if (policy === undefined) {
    throw new Error(`claim against unknown policy ${key}`);
  }

  return { key, policy };
};

const countsByType = <T>(
  elements: T[],
  typeOf: (element: T) => string,
): Map<string, number> =>
  new Map(
    [...groupByType(elements, typeOf)].map(([type, group]) => [
      type,
      group.length,
    ]),
  );

const damagedType = (damage: Damage): string => damage.itemType;

// Each damage entry is a separate damaged item, so a policy insuring one sword
// cannot suffer two sword damages. Over-claiming rejects the whole claim rather
// than the offending entry — the MHPCO does not part-settle a suspect report.
const rejectOverClaiming = (insuredItems: Item[], damages: Damage[]): void => {
  const insuredCounts = countsByType(insuredItems, itemType);

  for (const [type, claimed] of countsByType(damages, damagedType)) {
    const insured = insuredCounts.get(type) ?? 0;

    if (claimed > insured) {
      throw new Error(
        `claim reports ${claimed} damaged "${type}" but the policy covers ${insured}`,
      );
    }
  }
};

const runClaimStep: StepRunner = (_customer, state, step) => {
  const damages = step.incident?.damages ?? [];
  const { key, policy } = claimedPolicy(state, step);
  const { insuredItems, remainingCap } = policy;

  rejectOverClaiming(insuredItems, damages);

  // The clamp is outside the per-damage sum: the whole claim is limited by
  // what is left of the policy's cap, not each damage individually. The sum is
  // rounded before the cap is spent down, so the cap stays whole too.
  const desiredPayout = roundPayoutInMHPCOsFavor(
    sumOf(damages.map((damage) => damagePayout(insuredItems, damage))),
  );
  const payout = Math.min(desiredPayout, remainingCap);
  const capAfterClaim = remainingCap - payout;

  return withPolicy(
    appendResult(state, { payout, remainingCap: capAfterClaim }),
    key,
    { ...policy, remainingCap: capAfterClaim },
  );
};

const runStep: StepRunner = (customer, state, step, stepIndex) =>
  isQuote(step)
    ? runQuoteStep(customer, state, step, stepIndex)
    : runClaimStep(customer, state, step, stepIndex);

// The customer is scenario-wide, so the fold closes over it rather than
// threading it through the per-step state alongside the parts that do change.
export const runScenario = (scenario: Scenario): ScenarioResults => ({
  results: scenario.steps.reduce(
    (state, step, stepIndex) =>
      runStep(scenario.customer, state, step, stepIndex),
    INITIAL_STATE,
  ).results,
});
