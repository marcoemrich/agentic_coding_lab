export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

// One row per item type the office recognises. Base premium (what it costs to
// insure) and insurance value (what it is insured FOR) are independent numbers,
// but they are known for exactly the same set of types — so they belong in one
// table. Keeping them apart would leave two key sets that must agree with
// nothing enforcing it.
interface ItemSpec {
  basePremium: number;
  insuranceValue: number;
  isComponent: boolean;
}

const ITEM_SPECS = {
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
} as const satisfies Record<string, ItemSpec>;

type KnownItemType = keyof typeof ITEM_SPECS;

const isKnownItemType = (type: string): type is KnownItemType =>
  type in ITEM_SPECS;

// The office insures only what its price list names. An unknown type has no
// premium and no insurance value, so there is nothing to quote — the whole
// scenario is rejected rather than priced at zero.
const specForItem = (item: Item): ItemSpec => {
  if (!isKnownItemType(item.type)) {
    throw new Error(`The MHPCO does not insure items of type ${item.type}`);
  }
  return ITEM_SPECS[item.type];
};

const basePremiumForItem = (item: Item): number => specForItem(item).basePremium;

const BLOCK_SIZE = 3;

const BLOCK_BASE_PREMIUM = 60;

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

// "Alike" means the same exact type, not merely the same family: two runes and
// a moonstone are three components but not three alike ones, so grouping them
// by type keeps them apart and denies them the block price.
const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  }
  return [...groups.values()];
};

// A block is three alike COMPONENTS — the discount is offered on runes and
// moonstones, not on swords. It is also not carved out of a larger group: the
// price applies only when the group holds exactly three (7 runes cost 7 × 25,
// not 60 + 60 + 25). Alikeness is guaranteed by the caller, which only ever
// passes a single group from groupByType.
const isComponent = (item: Item): boolean => specForItem(item).isComponent;

const isBlock = (group: Item[]): boolean =>
  group.length === BLOCK_SIZE && group.every(isComponent);

const basePremiumForGroup = (group: Item[]): number =>
  isBlock(group) ? BLOCK_BASE_PREMIUM : sum(group.map(basePremiumForItem));

const basePremiumForItems = (items: Item[]): number =>
  sum(groupByType(items).map(basePremiumForGroup));

const CURSE_SURCHARGE = 0.5;

// Every modifier is an additive percentage of its OWN base — modifiers never
// compound with each other. Item-scoped modifiers take the affected item's base
// premium as their base; policy-scoped modifiers take the policy base premium
// (the sum of all item base premiums). So the total is always
// base + Σ (rate × that modifier's base), never a product of (1 + rate) factors.
const modifierAmount = (rate: number, base: number): number => rate * base;

const ENCHANTMENT_SURCHARGE = 0.3;

const ENCHANTMENT_SURCHARGE_LEVEL = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const attractsEnchantmentSurcharge = (item: Item): boolean =>
  (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_LEVEL;

interface ItemModifier {
  rate: number;
  appliesTo: (item: Item) => boolean;
}

// Each item-scoped modifier is a row: a rate and the condition under which it
// applies. The predicate names the modifier, so a row needs no separate label.
// Adding a modifier means adding a row, not a new branch.
const ITEM_MODIFIERS: ItemModifier[] = [
  { rate: CURSE_SURCHARGE, appliesTo: isCursed },
  { rate: ENCHANTMENT_SURCHARGE, appliesTo: attractsEnchantmentSurcharge },
];

const itemModifierRates = (item: Item): number[] =>
  ITEM_MODIFIERS.filter((modifier) => modifier.appliesTo(item)).map(
    (modifier) => modifier.rate,
  );

const LOYALTY_DISCOUNT = 0.2;

const LOYALTY_THRESHOLD_YEARS = 2;

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

// Discounts are surcharges with the sign flipped: expressing one as a negative
// rate lets it flow through the same additive sum as every surcharge, with no
// separate subtraction step. Discount constants stay positive magnitudes and
// are negated here, at the point of use, so the direction is visible in the
// rate list rather than buried in a constant's sign.
const asDiscount = (rate: number): number => -rate;

const INITIAL_ASSESSMENT_SURCHARGE = 0.1;

const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

// Policy-scoped modifiers apply to the policy base premium. Unlike item
// modifiers they select on the customer and on the quote's position in the
// scenario rather than on an item.
//
// The initial-assessment surcharge applies to every quote: each item is treated
// as a first insurance regardless of customer history. The follow-up discount
// is what distinguishes a customer's later contracts.
const policyModifierRates = (
  customer: Customer,
  isFollowUpContract: boolean,
): number[] => [
  INITIAL_ASSESSMENT_SURCHARGE,
  ...(isLongStanding(customer) ? [asDiscount(LOYALTY_DISCOUNT)] : []),
  ...(isFollowUpContract ? [asDiscount(FOLLOW_UP_CONTRACT_DISCOUNT)] : []),
];

const itemModifiersTotal = (items: Item[]): number =>
  sum(
    items.flatMap((item) =>
      itemModifierRates(item).map((rate) =>
        modifierAmount(rate, basePremiumForItem(item)),
      ),
    ),
  );

const policyModifiersTotal = (
  policyBasePremium: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  sum(
    policyModifierRates(customer, isFollowUpContract).map((rate) =>
      modifierAmount(rate, policyBasePremium),
    ),
  );

// All amounts are rounded to whole G in the MHPCO's favour. Which way that
// points depends on which way the money flows: a premium comes in, so it rounds
// up; a payout goes out, so it rounds down.
//
// Two functions rather than one taking a direction, so that knowing which way
// favour points for a given kind of money stays here. A direction parameter
// would push that back onto every caller — the one thing these exist to answer.
const roundPremiumInMHPCOsFavour = (amount: number): number =>
  Math.ceil(amount);

const roundPayoutInMHPCOsFavour = (amount: number): number =>
  Math.floor(amount);

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const policyBasePremium = basePremiumForItems(items);
  return roundPremiumInMHPCOsFavour(
    policyBasePremium +
      itemModifiersTotal(items) +
      policyModifiersTotal(policyBasePremium, customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

const insuranceValueForItem = (item: Item): number =>
  specForItem(item).insuranceValue;

// Deliberately NOT the shape of basePremiumForItems. Both aggregate a per-item
// figure from ITEM_SPECS, but the premium side groups by type first so a block
// of three alike components can be priced as one; this side never groups. Three
// runes cost 60 to insure and are insured for 3 × 250 = 750. The block is a
// discount on the price of cover, not a reduction of the cover bought.
//
// So the near-symmetry is a false friend: factoring the two into one traversal
// would read as tidier and would silently make blocks shrink the insurance sum.
// The repetition of `sum(items.map(...))` is the price of keeping them free to
// diverge, and is paid on purpose.
const insuranceSum = (items: Item[]): number =>
  sum(items.map(insuranceValueForItem));

const CAP_MULTIPLE = 2;

// The cap is twice the insurance sum — the value the items are insured FOR, so
// it is computed from the items alone and never from the premium. Curses,
// enchantments and loyalty change what a policy costs without changing what it
// covers (as do blocks — see insuranceSum). Naming the relation keeps that
// separation visible at the one place a policy is created.
const capForItems = (items: Item[]): number =>
  CAP_MULTIPLE * insuranceSum(items);

const DEDUCTIBLE = 100;

interface Policy {
  items: Item[];
  remainingCap: number;
}

// Steps are not independent: a quote's premium depends on how many quotes came
// before it, and a claim draws down the cap of a policy an earlier quote
// created. So a step is a function from state to (result, next state), and the
// scenario is a fold over that — not a map, which would promise an independence
// the steps do not have.
//
// Policies are keyed by the index of the quote step that created them: a claim
// step names its policy by that zero-based index.
interface ScenarioState {
  // What makes a contract a follow-up is that the customer has already been
  // quoted in this scenario — the first quote is the initial contract, every
  // later one follows it. This is what decides whether the 15 % discount
  // applies.
  //
  // A flag rather than a count of quotes so far: the rule asks only whether a
  // quote has happened, never how many. A counter would carry a number nothing
  // reads — every value from 1 upward answers the only question asked
  // identically — and would invite the reader to wonder what the third quote
  // does differently. Nothing.
  hasQuotedBefore: boolean;
  policies: Map<number, Policy>;
}

// A fresh state per run, not a shared constant. The Map makes the difference:
// a module-level seed would hand every scenario the same one. Nothing mutates
// it today — withPolicy copies before it writes — so a shared seed would work,
// but only by an invariant that lives in another function and would have to be
// rediscovered by the next writer. Building the seed per run makes each
// scenario's independence a property of the code rather than a promise about it.
const initialState = (): ScenarioState => ({
  hasQuotedBefore: false,
  policies: new Map(),
});

interface StepOutcome {
  result: StepResult;
  state: ScenarioState;
}

// Both operations end by filing a policy under its quote's index — a claim
// re-files the same policy with a drawn-down cap. Naming that once keeps the
// Map out of the operations, so neither has to know how policies are stored.
const withPolicy = (
  state: ScenarioState,
  policyIndex: number,
  policy: Policy,
): ScenarioState => ({
  ...state,
  policies: new Map(state.policies).set(policyIndex, policy),
});

const runQuote = (
  step: QuoteStep,
  customer: Customer,
  state: ScenarioState,
  stepIndex: number,
): StepOutcome => ({
  result: {
    premium: quotePremium(step.items, customer, state.hasQuotedBefore),
  },
  state: withPolicy(
    { ...state, hasQuotedBefore: true },
    stepIndex,
    {
      items: step.items,
      remainingCap: capForItems(step.items),
    },
  ),
});

const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;

const REDUCED_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

// Reads enchantment like the premium-side surcharge rule, but is a different
// rule with its own level: this one halves what a claim pays out, that one
// raises what a policy costs. Sharing a predicate would tie two levels that the
// spec lets move independently, so the shape is repeated deliberately.
const qualifiesForReducedReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL;

// The reimbursement rate is decided first, then one deductible comes off.
//
// The dragon-material clause is absent on purpose, not by oversight. It promises
// full reimbursement of the damage before the deductible — which is exactly what
// FULL_REIMBURSEMENT_RATE already gives every item that misses the reduced-rate
// clause. Where both clauses apply the spec awards it to the 50 % rule. Between
// them the two facts leave the clause with no input it can move: dragon material
// at enchantment 9 or 8 pays the same 400 as steel at those levels, and at
// enchantment 5 it pays the same 700 steel would. Writing it as its own branch
// would add a branch no test could ever tell from the default — a distinction
// the domain does not make.
const reimbursementRate = (item: Item): number =>
  qualifiesForReducedReimbursement(item)
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRate(item) - DEDUCTIBLE;

// Returns AN insured item of the damaged type, not THE damaged one — a policy
// can cover two swords, so the type does not name a unique item. Two damage
// entries of the same type are both answered with the same first match.
//
// That is sound today because the answer is used solely to read payout
// attributes (the reimbursement rate), and the covered case — two damages
// against two swords — insures identical swords, which read the same either
// way. The deductible is charged per damage entry, not per matched item, so
// counting is unaffected too.
//
// One thing would break it, not yet under test: two swords with DIFFERENT
// attributes (say enchantment 3 and 9). Both damages would take the first
// sword's rate; the second should take its own. This lookup must then become a
// pairing that consumes what it matches. The honest name marks that spot.
//
// The `!` is a proof, not an assumption: rejectUnmatchedDamages runs first and
// throws unless every claimed type is covered at least as many times as it is
// named — so by the time this runs, a match exists for every damage entry. Both
// ways it could fail are covered by tests: claiming a type more often than it is
// insured, and claiming a type the policy does not cover at all.
const anInsuredItemOfDamagedType = (policy: Policy, damage: Damage): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

// Counts how many times each value occurs. Deliberately typed on strings rather
// than on Item: the guard below tallies two different things (item types held
// and item types named by damages) and only their counts are ever compared, so
// the tally has no business knowing what the strings mean.
const tally = (values: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
};

// Every damage entry must claim an insured item of its own, so a type cannot be
// damaged more times than the policy covers it. One rule, three error cases the
// spec states separately — all of them the same comparison at different counts:
//
//   claimed > insured, insured ≥ 1  a type damaged more often than it is insured
//   claimed > insured, insured = 0  a type the policy does not cover at all
//   claimed > insured, insured = 0  a type the office does not insure at all
//
// The last two differ only in why the count is zero, which is why neither needs
// its own test. An uninsured type and an unknown type are both covered 0 times
// against a claimed 1. In particular the unknown type never reaches a lookup in
// ITEM_SPECS: a broomstick is not in THIS policy, which is the more precise
// complaint than whether the office insures broomsticks in general. The quote
// path is where the price list is consulted and where an unknown type is
// rejected as uninsurable.
//
// Checked before any payout is computed: the spec rejects the whole claim, not
// just the surplus entries.
const rejectUnmatchedDamages = (policy: Policy, incident: Incident): void => {
  const insured = tally(policy.items.map((item) => item.type));
  const claimed = tally(incident.damages.map((damage) => damage.itemType));
  for (const [type, claimedCount] of claimed) {
    const insuredCount = insured.get(type) ?? 0;
    if (claimedCount > insuredCount) {
      throw new Error(
        `Policy covers ${insuredCount} ${type}(s) but the claim names ${claimedCount}`,
      );
    }
  }
};

// A damage is what an incident cost the owner, so it cannot be negative. Zero
// is left alone: the spec forbids only negative amounts, and a zero damage
// simply pays nothing once the deductible bites.
const isNegative = (damage: Damage): boolean => damage.amount < 0;

const rejectNegativeDamages = (incident: Incident): void => {
  const negative = incident.damages.find(isNegative);
  if (negative) {
    throw new Error(
      `Damage to ${negative.itemType} is negative: ${negative.amount}`,
    );
  }
};

// Both guards run before any payout is computed: the spec rejects the whole
// claim, not just the offending entries, so a valid entry alongside an invalid
// one must not be paid.
//
// They are two statements rather than a list of validations. Their signatures
// differ (only the first needs the policy), so a uniform list could hold them
// only by giving the second a parameter it ignores. And the order is not
// incidental: rejectUnmatchedDamages must come first because it is what makes
// the lookup in anInsuredItemOfDamagedType total — an obligation that reads as
// a sequenced line here but would vanish into array order in a list.
//
// Two is the whole set, not a stage on the way to more. The spec's remaining
// claim-side error — a damage naming an item type the office does not insure —
// needs no guard of its own: rejectUnmatchedDamages already catches it, because
// a type the office does not insure cannot be in the policy either and so is
// covered zero times. See its comment for why that is the more precise
// diagnosis rather than a lucky accident.
const payoutForIncident = (policy: Policy, incident: Incident): number => {
  rejectUnmatchedDamages(policy, incident);
  rejectNegativeDamages(incident);
  return sum(
    incident.damages.map((damage) =>
      payoutForDamage(damage, anInsuredItemOfDamagedType(policy, damage)),
    ),
  );
};

// The damage decides what a claim is WORTH; the cap decides what there is left
// to pay it WITH. Once the cap is spent the office pays what remains, not what
// was asked — so the cap bounds the payout before it is charged against it.
//
// This is the guarantee that makes drawDownCap's subtraction safe: a payout that
// has passed through here can never exceed the balance, so the balance can never
// go negative. The two are a pair — bound, then spend — and neither is sound
// without the other.
const payoutWithinCap = (payout: number, remainingCap: number): number =>
  Math.min(payout, remainingCap);

// A policy's cap is a balance, not a per-claim limit: each claim spends part of
// it and the rest carries forward to the next claim against the same policy.
// The balance stays non-negative because payoutWithinCap has already bounded
// what is spent — this subtraction does not defend itself, it relies on that.
//
// Naming the draw-down separates what the cap DOES from how a claim is assembled
// — the one line in runClaim that was arithmetic rather than plumbing.
const drawDownCap = (remainingCap: number, payout: number): number =>
  remainingCap - payout;

const runClaim = (step: ClaimStep, state: ScenarioState): StepOutcome => {
  // A claim naming a policy that does not exist is a spec error case, but no
  // test drives it yet. The assertion stands in until one does — at which point
  // the missing case becomes the error branch rather than a crash.
  const policy = state.policies.get(step.policy)!;
  // Rounded before the clamp so the cap is only ever compared with, and reduced
  // by, whole G — a fractional payout would otherwise leave a fractional cap
  // behind for the next claim.
  const claimWorth = roundPayoutInMHPCOsFavour(
    payoutForIncident(policy, step.incident),
  );
  const payout = payoutWithinCap(claimWorth, policy.remainingCap);
  const remainingCap = drawDownCap(policy.remainingCap, payout);
  return {
    result: { payout, remainingCap },
    state: withPolicy(state, step.policy, { ...policy, remainingCap }),
  };
};

// Dispatch decides once what a step is; each operation then owns both its
// result and how it advances the state, so no caller has to re-test step.op to
// know what the step did.
const runStep = (
  step: Step,
  customer: Customer,
  state: ScenarioState,
  stepIndex: number,
): StepOutcome =>
  step.op === "quote"
    ? runQuote(step, customer, state, stepIndex)
    : runClaim(step, state);

// The fold carries both halves of the outcome: the results accumulated so far
// and the state the next step will see. Threading the state explicitly (rather
// than recovering it from the last result) keeps the dependency between steps
// visible in the type.
interface ScenarioRun {
  results: StepResult[];
  state: ScenarioState;
}

const initialRun = (): ScenarioRun => ({ results: [], state: initialState() });

// Appends the step's RESULT, not the step: `steps` is the fold's input and is
// never added to. Naming the accumulated list is what makes the one-result-per-
// step guarantee readable here — results grow by exactly one per step, in step
// order, because this is the only thing that grows them.
const appendStepResult =
  (customer: Customer) =>
  (run: ScenarioRun, step: Step, stepIndex: number): ScenarioRun => {
    const outcome = runStep(step, customer, run.state, stepIndex);
    return {
      results: [...run.results, outcome.result],
      state: outcome.state,
    };
  };

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => ({
  results: steps.reduce(appendStepResult(customer), initialRun()).results,
});
