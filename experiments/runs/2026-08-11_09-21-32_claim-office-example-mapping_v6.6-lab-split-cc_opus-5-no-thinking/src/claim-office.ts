export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

// The catalogue of insurable item types. Each type carries both figures the
// office needs: what it costs to insure (base premium) and what it is worth
// when destroyed (insurance value). Keeping them in one row means a new item
// type is one edit, and the two figures can never drift apart.
const CATALOGUE: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

// Three of this file's lookups can miss, and in every case a miss is the office
// declining rather than a bug: an uninsurable type, an uncovered item, an absent
// policy. Each caller names its own offender; this says once what they share — a
// miss is a domain error naming what was declined, never an undefined that
// travels on to surface later as a TypeError.
const foundOrThrow = <Found,>(found: Found | undefined, declined: string): Found => {
  if (found === undefined) {
    throw new Error(declined);
  }
  return found;
};

// Both catalogue figures are read through this one row lookup, so an item's type
// is resolved against the catalogue in exactly one place — which makes it also
// the one place that can tell an insurable type from an uninsurable one. The
// catalogue does not merely price the types the MHPCO insures; it DEFINES them,
// so a missing row is not a lookup miss to defend against but the office
// declining the item, and it is reported in those terms.
const catalogueEntryFor = (item: Item) =>
  foundOrThrow(
    CATALOGUE[item.type],
    `the MHPCO does not insure items of type "${item.type}"`,
  );

// Totalling a catalogue column over a list of items is the same operation on the
// premium side and the claim side; only the column differs. Naming it once keeps
// the two columns visibly separate — which is the point: the building-block
// discount rewrites the basePremium column and never touches insuranceValue.
const totalOfColumn =
  (columnOf: (item: Item) => number) =>
  (items: Item[]): number =>
    items.reduce((total, item) => total + columnOf(item), 0);

const basePremiumOf = (item: Item): number => catalogueEntryFor(item).basePremium;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const formsABuildingBlock = (alikeItems: Item[]): boolean =>
  alikeItems.length === BLOCK_SIZE;

const sumOfBasePremiums = totalOfColumn(basePremiumOf);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const isCursed = (item: Item): boolean => item.cursed === true;

// An unenchanted item is enchantment 0, so every threshold reads the level the
// same way. The MHPCO sets several enchantment thresholds for different rules;
// each names its own level and compares through here.
const enchantmentLevelOf = (item: Item): number => item.enchantment ?? 0;

const carriesEnchantmentSurcharge = (item: Item): boolean =>
  enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_LEVEL;

// A rate table prices one subject: every row whose risk applies contributes its
// rate, and the total is their sum. Both the item surcharges and the policy-wide
// modifiers are rate tables — they differ only in what they are applied to.
type RateTable<Subject> = { appliesTo: (subject: Subject) => boolean; rate: number }[];

const totalRateFrom = <Subject,>(table: RateTable<Subject>, subject: Subject): number =>
  table.reduce((total, row) => (row.appliesTo(subject) ? total + row.rate : total), 0);

// Every item-specific surcharge is a rate on THAT item's base premium, charged
// when its risk applies. Adding a new one means adding a row here — nothing else.
const ITEM_SURCHARGES: RateTable<Item> = [
  { appliesTo: isCursed, rate: CURSE_SURCHARGE_RATE },
  { appliesTo: carriesEnchantmentSurcharge, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const surchargeRateOn = (item: Item): number => totalRateFrom(ITEM_SURCHARGES, item);

const surchargeOn = (item: Item): number => basePremiumOf(item) * surchargeRateOn(item);

// The surcharge is a third catalogue-derived column alongside basePremium and
// insuranceValue — a per-item amount totalled the same way, so it is totalled by
// the same named operation rather than by a fold spelled out again here.
const itemSurchargesOn = totalOfColumn(surchargeOn);

// Items of the same type are "alike"; each group is priced together so a
// building block can be recognised.
const alikeItemGroupsIn = (items: Item[]): Item[][] => [
  ...items
    .reduce(
      (groups, item) => groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<string, Item[]>(),
    )
    .values(),
];

const basePremiumOfAlikeItems = (alikeItems: Item[]): number =>
  formsABuildingBlock(alikeItems) ? BLOCK_BASE_PREMIUM : sumOfBasePremiums(alikeItems);

const policyBaseOf = (items: Item[]): number =>
  alikeItemGroupsIn(items).reduce(
    (sum, alikeItems) => sum + basePremiumOfAlikeItems(alikeItems),
    0,
  );

// Rounding always favours the MHPCO. Which direction that is follows from which
// way the money moves: an amount the office RECEIVES is rounded up, an amount it
// PAYS is rounded down. Naming the two directions makes the rule one concept
// rather than two opposite-looking halves, and each call site says which kind of
// amount it holds — so the reason for the direction is in the code, not a comment.
const settledAsReceived = Math.ceil;
const settledAsPaid = Math.floor;

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = -0.2;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = -0.15;

// A quote insures items the policy did not previously cover, so every quote is
// a first insurance OF THOSE ITEMS — including a follow-up contract, which is a
// later contract for the same customer but still the first for its own items.
// That is why this holds for every quote and reads as a condition that is always
// met, rather than as a rule with no condition at all.
const insuresItemsForTheFirstTime = (): boolean => true;

const isLongStanding = ({ customer }: QuoteContext): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

const isFollowUpContract = ({ precedingQuotes }: QuoteContext): boolean =>
  precedingQuotes > 0;

// A quote is priced from the customer plus its place in the scenario's history.
type QuoteContext = { customer: Customer; precedingQuotes: number };

// Every policy-wide modifier is a rate on the UNMODIFIED policy base — never on a
// base that already includes the item surcharges. Surcharges carry a positive
// rate, discounts a negative one. Adding a new one means adding a row here.
const POLICY_MODIFIERS: RateTable<QuoteContext> = [
  { appliesTo: insuresItemsForTheFirstTime, rate: FIRST_INSURANCE_SURCHARGE_RATE },
  { appliesTo: isLongStanding, rate: LOYALTY_DISCOUNT_RATE },
  { appliesTo: isFollowUpContract, rate: FOLLOW_UP_CONTRACT_DISCOUNT_RATE },
];

const policyModifiersOn = (policyBase: number, context: QuoteContext): number =>
  policyBase * totalRateFrom(POLICY_MODIFIERS, context);

const quoteFor = (items: Item[], context: QuoteContext): Result => {
  const policyBase = policyBaseOf(items);
  const riskAdjustedBase = policyBase + itemSurchargesOn(items);
  return {
    premium: settledAsReceived(
      riskAdjustedBase + policyModifiersOn(policyBase, context) + PROCESSING_FEE,
    ),
  };
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceValueOf = (item: Item): number => catalogueEntryFor(item).insuranceValue;

// The insurance sum totals the value column over every insured item — one item,
// one row, no grouping. Blocks are a premium concept and cannot reach it.
const insuranceSumOf = totalOfColumn(insuranceValueOf);

// A policy created by a quote step, tracked by that step's index so later claims
// can find it and draw down its cap.
type Policy = { items: Item[]; remainingCap: number };

const policyFor = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumOf(items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
});

const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// A distinct rule from the premium's HIGH_ENCHANTMENT_LEVEL, at a distinct
// level: this one halves what a claim pays out, that one raises what a policy
// costs. They move independently — deliberately not shared.
const reimbursesOnlyHalf = (item: Item): boolean =>
  enchantmentLevelOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL;

// How much of the damage the MHPCO reimburses, before the deductible bites.
const reimbursementRateFor = (item: Item): number =>
  reimbursesOnlyHalf(item) ? HALF_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;

// A damage names only an item TYPE, so it can identify no more than the type of
// the item it refers to — which is why this takes the type alone: the amount has
// no say in WHICH item answers for the damage. It returns the first insured item
// of that type as the representative whose traits price the damage.
//
// It is also the claim side's coverage guard. A type absent from the policy and
// a type the MHPCO does not insure at all are indistinguishable here, and both
// are declined by this one lookup: an uninsurable type could never have been
// quoted, so it can never appear among a policy's items.
//
// UNTESTED ASSUMPTION: that the first match is the right representative. Where a
// policy holds several alike items, the suite never distinguishes them — its only
// two-alike-items example insures two IDENTICAL swords, so first-match is
// unobservable there, and the spec offers no example pairing one type with
// DIFFERING enchantment or material. So this is an assumption the tests permit,
// not one they confirm. Should such an example appear, the damage would have to
// be matched to a specific item and this would be the place that changes.
const insuredItemOfType = (policy: Policy, itemType: string): Item =>
  foundOrThrow(
    policy.items.find((item) => item.type === itemType),
    `the policy does not cover an item of type "${itemType}"`,
  );

// A damage is what the incident cost; an office cannot be owed money by a
// misfortune, so a negative amount is a malformed claim rather than a refund.
const damagedAmountOf = (damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(`a damage cannot be negative, but was ${damage.amount}`);
  }
  return damage.amount;
};

const reimbursedAmountFor = (damage: Damage, policy: Policy): number =>
  damagedAmountOf(damage) *
  reimbursementRateFor(insuredItemOfType(policy, damage.itemType));

// The deductible bites once per damage, after the reimbursement rate is applied
// — never the other way round, which would pay out more.
const payoutForDamage = (damage: Damage, policy: Policy): number =>
  reimbursedAmountFor(damage, policy) - DEDUCTIBLE_PER_DAMAGE;

// How many times each type appears among a list of things that name a type.
// Items and damages name theirs under different keys, so each caller says how
// its own kind is read rather than first flattening to a list of bare strings.
// The file's other by-type reading, alikeItemGroupsIn, collects the items
// themselves because the premium side prices them; here only the tally matters.
const countByType = <Named,>(
  named: Named[],
  typeOf: (one: Named) => string,
): Map<string, number> =>
  named.reduce((counts, one) => {
    const type = typeOf(one);
    return counts.set(type, (counts.get(type) ?? 0) + 1);
  }, new Map<string, number>());

// A damage entry stands for one damaged item, so an incident cannot name more
// damages of a type than the policy insures of that type. Asking for the
// overclaimed type — rather than testing each damage in turn — puts this beside
// the file's other three misses: a lookup that yields nothing when all is well
// and names the offender when it is not.
// The whole claim is rejected rather than settled in part, so the overclaim is
// checked before any damage is priced.
const rejectOverclaimedTypes = (incident: Incident, policy: Policy): void => {
  const insuredCounts = countByType(policy.items, (item) => item.type);
  const overclaimed = [
    ...countByType(incident.damages, (damage) => damage.itemType),
  ].find(([type, damaged]) => damaged > (insuredCounts.get(type) ?? 0));
  if (overclaimed !== undefined) {
    const [type] = overclaimed;
    throw new Error(`the policy does not cover that many items of type "${type}"`);
  }
};

// One incident can damage several items; each damage is settled on its own
// (and so bears its own deductible), and the incident pays out their sum.
const payoutForIncident = (incident: Incident, policy: Policy): number => {
  rejectOverclaimedTypes(incident, policy);
  return incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, policy),
    0,
  );
};

// A payout is drawn from the policy's cap, leaving less for later claims.
const capDrawnDownBy = (policy: Policy, payout: number): Policy => ({
  ...policy,
  remainingCap: policy.remainingCap - payout,
});

// The policy pays no more than the cap it has left, however large the damage.
const payoutWithinCapOf = (policy: Policy, desiredPayout: number): number =>
  Math.min(desiredPayout, policy.remainingCap);

// Settling a claim pays out and draws the cap down by the same amount, so the
// result the customer sees is the payout plus the cap that payout left behind.
const claimFor = (incident: Incident, policy: Policy): [Result, Policy] => {
  const payout = settledAsPaid(
    payoutWithinCapOf(policy, payoutForIncident(incident, policy)),
  );
  const settledPolicy = capDrawnDownBy(policy, payout);
  return [{ payout, remainingCap: settledPolicy.remainingCap }, settledPolicy];
};

// What the scenario has accumulated before the current step: the results so far,
// the history a quote is priced against, and the policies earlier quotes created.
type ScenarioState = {
  results: Result[];
  precedingQuotes: number;
  policies: Record<number, Policy>;
};

const INITIAL_SCENARIO_STATE: ScenarioState = {
  results: [],
  precedingQuotes: 0,
  policies: {},
};

// Every step reports exactly one result and leaves one policy at its index —
// the two things both step kinds always do. Recording them is named once here
// rather than rebuilt in each of them.
const withStepRecorded = (
  state: ScenarioState,
  result: Result,
  policyIndex: number,
  policy: Policy,
): ScenarioState => ({
  ...state,
  results: [...state.results, result],
  policies: { ...state.policies, [policyIndex]: policy },
});

const afterQuote = (
  state: ScenarioState,
  items: Item[],
  customer: Customer,
  stepIndex: number,
): ScenarioState => ({
  ...withStepRecorded(
    state,
    quoteFor(items, { customer, precedingQuotes: state.precedingQuotes }),
    stepIndex,
    policyFor(items),
  ),
  precedingQuotes: state.precedingQuotes + 1,
});

// A claim names the quote step whose policy it draws on. Only a quote creates a
// policy, so an index no quote reached is the claim naming a policy that does
// not exist.
const policyAt = (state: ScenarioState, policyIndex: number): Policy =>
  foundOrThrow(
    state.policies[policyIndex],
    `there is no policy at step ${policyIndex}`,
  );

const afterClaim = (
  state: ScenarioState,
  policyIndex: number,
  incident: Incident,
): ScenarioState => {
  const [result, settledPolicy] = claimFor(incident, policyAt(state, policyIndex));
  return withStepRecorded(state, result, policyIndex, settledPolicy);
};

const afterStep = (
  state: ScenarioState,
  step: Step,
  customer: Customer,
  stepIndex: number,
): ScenarioState =>
  step.op === "quote"
    ? afterQuote(state, step.items, customer, stepIndex)
    : afterClaim(state, step.policy, step.incident);

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const { results } = scenario.steps.reduce(
    (state, step, stepIndex) => afterStep(state, step, scenario.customer, stepIndex),
    INITIAL_SCENARIO_STATE,
  );
  return { results };
};
