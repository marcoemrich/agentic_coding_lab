export type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: readonly Damage[];
};

export type QuoteStep = {
  op: "quote";
  items: readonly Item[];
};

export type ClaimStep = {
  op: "claim";
  // Zero-based index of the quote step that created the policy.
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: readonly Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };

// One entry per scenario step, in order. Each step's `op` selects the shape.
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Every percentage modifier is a delta computed against an *unmodified* base
// and summed with the others — modifiers never compound. Policy-wide ones use
// the policy base, item-specific ones the affected item's own base premium.
//
// Percentages stay in integer percent points: multiply first, divide by 100
// last. A float multiplier such as `base * 1.1` yields 110.00000000000001 for
// a sword and breaks the ceil. `(base * 10) / 100` gives exactly 10.
const PERCENT_POINTS_PER_WHOLE = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_POINTS_PER_WHOLE;

// The MHPCO insures only the items on its price list. Anything else is a
// rejected policy, not a zero-priced one — so an absent type throws rather
// than defaulting to zero, and every caller may treat the result as a price.
const insurableValueOf = (
  table: Record<string, number>,
  type: string,
): number => {
  const value = table[type];

  if (value === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }

  return value;
};

// Rejecting uninsurable items is a rule of its own, so it is stated once and
// up front rather than left to fall out of whichever pricing step happens to
// look a type up first. Without this, a block of three unknown items would
// price through `basePremiumOfTypeGroup` untouched and only fail later, by
// luck, in the per-item surcharge pass.
const rejectUninsurableItems = (items: readonly Item[]): void => {
  for (const item of items) {
    insurableValueOf(BASE_PREMIUMS, item.type);
  }
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// How many of each key a collection holds. Items and damages both need this,
// over different fields — `keyOf` is the only thing that differs, so it is the
// only thing the caller supplies.
const tally = <Element>(
  elements: readonly Element[],
  keyOf: (element: Element) => string,
): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const element of elements) {
    const key = keyOf(element);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
};

const countByType = (items: readonly Item[]): Map<string, number> =>
  tally(items, (item) => item.type);

// Prices one type-group. A block of exactly three costs a flat rate instead of
// three individual premiums — deliberately including main items, not just the
// small components. Callers have already rejected uninsurable types, so the
// flat-rate branch skipping the price list is safe rather than a hole.
const basePremiumOfTypeGroup = (type: string, count: number): number =>
  count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * insurableValueOf(BASE_PREMIUMS, type);

const policyBaseOf = (items: readonly Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + basePremiumOfTypeGroup(type, count),
    0,
  );

// A modifier rule: when `applies` holds for the subject, `percent` percent of
// the relevant base premium is added. A negative percent is a discount. Every
// rule whose predicate holds contributes; the deltas are summed, never
// compounded.
type ModifierRule<Subject> = {
  applies: (subject: Subject) => boolean;
  percent: number;
};

const sumApplicablePercents = <Subject>(
  rules: ModifierRule<Subject>[],
  subject: Subject,
): number =>
  rules.reduce(
    (total, rule) => (rule.applies(subject) ? total + rule.percent : total),
    0,
  );

// Policy-wide modifiers: each is a percentage of the policy base premium.
//
// Their subject is the circumstances under which the quote is issued — not the
// customer alone, and not the issued policy either (that is `IssuedPolicy`,
// which a claim reads). Today those circumstances are just who is asking and
// how many quotes they have had; rules that depend on more read the field they
// need off the same subject.
type QuoteCircumstances = {
  customer: Customer;
  // Zero-based ordinal among the customer's quotes in this scenario.
  quoteOrdinal: number;
};

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = -20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = -15;

const POLICY_MODIFIER_RULES: ModifierRule<QuoteCircumstances>[] = [
  { applies: () => true, percent: FIRST_INSURANCE_SURCHARGE_PERCENT },
  {
    applies: ({ customer }) =>
      customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    percent: LOYALTY_DISCOUNT_PERCENT,
  },
  {
    applies: ({ quoteOrdinal }) => quoteOrdinal > 0,
    percent: FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT,
  },
];

const policyModifierDelta = (
  policyBase: number,
  circumstances: QuoteCircumstances,
): number =>
  percentOf(
    policyBase,
    sumApplicablePercents(POLICY_MODIFIER_RULES, circumstances),
  );

// Item-specific modifiers: each is a percentage of the affected item's own
// base premium.
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const ITEM_MODIFIER_RULES: ModifierRule<Item>[] = [
  { applies: (item) => item.cursed === true, percent: CURSE_SURCHARGE_PERCENT },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  },
];

const itemModifierDelta = (item: Item): number =>
  percentOf(
    insurableValueOf(BASE_PREMIUMS, item.type),
    sumApplicablePercents(ITEM_MODIFIER_RULES, item),
  );

const quote = (
  items: readonly Item[],
  circumstances: QuoteCircumstances,
): number => {
  rejectUninsurableItems(items);

  const policyBase = policyBaseOf(items);
  const modifiers =
    policyModifierDelta(policyBase, circumstances) +
    items.reduce((total, item) => total + itemModifierDelta(item), 0);

  // Rounding is in the MHPCO's favour: premiums round up.
  return Math.ceil(policyBase + modifiers) + PROCESSING_FEE;
};

// Insurance values are what an item is insured FOR, distinct from the base
// premium charged to insure it.
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceSumOf = (items: readonly Item[]): number =>
  items.reduce(
    (sum, item) => sum + insurableValueOf(INSURANCE_VALUES, item.type),
    0,
  );

// A policy as a claim sees it: the items it covers, and how much of its cap
// is still available. Successive claims against the same policy draw the cap
// down, so `remainingCap` is state that outlives the claim step that reads it.
type IssuedPolicy = {
  items: readonly Item[];
  remainingCap: number;
};

const issuePolicy = (items: readonly Item[]): IssuedPolicy => ({
  items,
  remainingCap: CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSumOf(items),
});

// A reimbursement clause: when `applies` holds for the damaged item, the
// damage is reimbursed at `percent` of its amount.
//
// Unlike the premium modifiers above, clauses do NOT sum. When several apply
// the most restrictive one wins — the lowest percentage. So a clause table
// needs no ordering to be correct, and adding a clause can only ever lower a
// payout, never raise it.
type ReimbursementClause = {
  applies: (item: Item) => boolean;
  percent: number;
};

const FULL_REIMBURSEMENT_PERCENT = 100;
const HALVED_REIMBURSEMENT_ENCHANTMENT = 8;
const HALVED_REIMBURSEMENT_PERCENT = 50;

const REIMBURSEMENT_CLAUSES: ReimbursementClause[] = [
  {
    applies: (item) =>
      (item.enchantment ?? 0) >= HALVED_REIMBURSEMENT_ENCHANTMENT,
    percent: HALVED_REIMBURSEMENT_PERCENT,
  },
];

// Full reimbursement is the default: with no clause applying, the damage is
// covered in full.
const reimbursementPercentFor = (item: Item): number =>
  REIMBURSEMENT_CLAUSES.reduce(
    (percent, clause) =>
      clause.applies(item) ? Math.min(percent, clause.percent) : percent,
    FULL_REIMBURSEMENT_PERCENT,
  );

// The damaged item a damage entry refers to, or undefined if the policy does
// not cover that type. Matched by type alone, so with two swords insured both
// sword damages resolve to the first. That is harmless while every item of a
// type is interchangeable for reimbursement purposes; the case that forces a
// positional match is rejecting more damage entries of a type than the policy
// covers, which needs a count rather than a lookup.
const insuredItemFor = (
  policy: IssuedPolicy,
  damage: Damage,
): Item | undefined =>
  policy.items.find((item) => item.type === damage.itemType);

// A damage entry that has passed validation, paired with the insured item it
// was resolved against. Producing this is what the validation pass is *for*:
// downstream code takes the item as given rather than re-looking it up and
// re-handling a "not covered" case that can no longer occur.
type AdmittedDamage = {
  damage: Damage;
  damagedItem: Item;
};

// Admits an incident's damages, or refuses the claim outright. Stated here,
// once and up front, for the same reason `rejectUninsurableItems` is: a
// rejection is a rule in its own right, not something that should fall out of
// whichever computation step happens to trip over it first.
//
// Running before any money is computed also keeps the settlement total clean —
// a function that can throw partway through an accumulation is doing control
// flow through the accumulator.
const admitDamages = (
  policy: IssuedPolicy,
  incident: Incident,
): AdmittedDamage[] => {
  rejectOverCountedDamages(policy, incident);

  return incident.damages.map((damage) => admitDamage(policy, damage));
};

// A policy cannot lose more of a thing than it insures. This is the one
// admission rule that must see the whole incident at once — it counts entries
// per type — which is why it stands apart from the per-damage rules below.
const rejectOverCountedDamages = (
  policy: IssuedPolicy,
  incident: Incident,
): void => {
  const insuredCounts = countByType(policy.items);
  const damagedCounts = tally(incident.damages, (damage) => damage.itemType);

  for (const [itemType, damagedCount] of damagedCounts) {
    const insuredCount = insuredCounts.get(itemType) ?? 0;

    if (damagedCount > insuredCount) {
      throw new Error(
        `more ${itemType} damages than the policy covers: ` +
          `${damagedCount} of ${insuredCount}`,
      );
    }
  }
};

// Admits one damage entry, or refuses the claim. Every rule here judges a
// single entry against the policy, so they read as one list of ways a damage
// can be refused rather than as steps in a computation.
const admitDamage = (policy: IssuedPolicy, damage: Damage): AdmittedDamage => {
  // Damage is a loss, never a credit.
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }

  const damagedItem = insuredItemFor(policy, damage);

  // A policy only answers for what it covers.
  //
  // Unreachable as the rules currently stand: an uncovered type has an insured
  // count of zero, so `rejectOverCountedDamages` has already refused any damage
  // to it — which is why a claim naming an uncovered item reports the count
  // message rather than this one. Kept deliberately, for two reasons. It is
  // what makes `damagedItem` an `Item` rather than an `Item | undefined`, so
  // everything downstream takes the item as given instead of asserting; and it
  // states the rule locally, rather than resting on an invariant that lives in
  // another function and could quietly lapse if the count rule ever narrows.
  if (damagedItem === undefined) {
    throw new Error(`item not covered by the policy: ${damage.itemType}`);
  }

  return { damage, damagedItem };
};

// What a single admitted damage is reimbursable for: the reimbursement its
// clauses allow, less the deductible. The deductible is charged once per
// damaged item, not once per incident, so it belongs here rather than at the
// incident level. The policy's cap is NOT applied here — it limits the
// incident as a whole, so only `settleClaim` can apply it.
//
// The clauses grade the reimbursement by the *damaged item's* properties
// (enchantment, material), which is why the resolved item travels with the
// damage instead of the policy being passed in to look it up again.
const reimbursableForDamage = ({
  damage,
  damagedItem,
}: AdmittedDamage): number =>
  percentOf(damage.amount, reimbursementPercentFor(damagedItem)) -
  DEDUCTIBLE_PER_DAMAGE;

// Settles one incident against a policy, returning the payout and the policy
// as it stands afterwards. The cap is drawn down here — that is what makes a
// second claim against the same policy see less headroom than the first.
const settleClaim = (
  policy: IssuedPolicy,
  incident: Incident,
): { payout: number; policy: IssuedPolicy } => {
  // Admit every damage before paying for any: a claim is refused as a whole,
  // so no part of it should be priced until all of it is known to be valid.
  const admitted = admitDamages(policy, incident);

  const reimbursable = admitted.reduce(
    (total, admittedDamage) => total + reimbursableForDamage(admittedDamage),
    0,
  );

  // Rounding is in the MHPCO's favour: payouts round down, mirroring the
  // premium's round up.
  // The policy pays at most what is left of its cap.
  const payout = Math.min(Math.floor(reimbursable), policy.remainingCap);

  return {
    payout,
    policy: { ...policy, remainingCap: policy.remainingCap - payout },
  };
};

// What the scenario has established by the time a step runs. Threaded through
// the steps in order: each step reads it, and hands the next step the progress
// its own execution made.
type ScenarioProgress = {
  // How many quotes the customer has already been given. Only quote steps
  // advance this, so an op that is not a quote leaves it untouched.
  quotesSoFar: number;
  // Policies created by earlier quote steps, keyed by their step index — the
  // handle a later claim step names in its `policy` field.
  policies: Map<number, IssuedPolicy>;
};

// The policy a claim step names. A claim against an index no quote step
// created currently settles against an empty policy: no items, so every damage
// is uncovered, and a zero cap. That is a placeholder standing in for a rule
// nobody has written yet, not a decision — the honest behaviour is almost
// certainly to reject the claim outright, the way an unknown item type is
// rejected. Named here so the choice is visible at the point it is made, and
// so the test that pins it down has one place to change.
const policyClaimedAgainst = (
  policies: ReadonlyMap<number, IssuedPolicy>,
  policyIndex: number,
): IssuedPolicy => policies.get(policyIndex) ?? issuePolicy([]);

// Runs one step against the progress so far, returning its result alongside
// the progress the *next* step inherits. Dispatch on `step.op` lives here:
// a new op is a new branch, and the loop below is unaffected.
type StepRun = { result: StepResult; progress: ScenarioProgress };

const runClaimStep = (step: ClaimStep, progress: ScenarioProgress): StepRun => {
  const settled = settleClaim(
    policyClaimedAgainst(progress.policies, step.policy),
    step.incident,
  );

  return {
    result: {
      payout: settled.payout,
      remainingCap: settled.policy.remainingCap,
    },
    // The drawn-down policy replaces the one the claim was made against, so
    // the next claim against it starts from the reduced cap.
    progress: {
      ...progress,
      policies: new Map(progress.policies).set(step.policy, settled.policy),
    },
  };
};

// A quote is what creates a policy, and the step's own index is the handle a
// later claim names in its `policy` field.
const runQuoteStep = (
  step: QuoteStep,
  stepIndex: number,
  customer: Customer,
  progress: ScenarioProgress,
): StepRun => ({
  result: {
    premium: quote(step.items, {
      customer,
      quoteOrdinal: progress.quotesSoFar,
    }),
  },
  progress: {
    quotesSoFar: progress.quotesSoFar + 1,
    policies: new Map(progress.policies).set(
      stepIndex,
      issuePolicy(step.items),
    ),
  },
});

const runStep = (
  step: Step,
  stepIndex: number,
  customer: Customer,
  progress: ScenarioProgress,
): StepRun =>
  step.op === "claim"
    ? runClaimStep(step, progress)
    : runQuoteStep(step, stepIndex, customer, progress);

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  let progress: ScenarioProgress = { quotesSoFar: 0, policies: new Map() };

  for (const [stepIndex, step] of scenario.steps.entries()) {
    const stepRun = runStep(step, stepIndex, scenario.customer, progress);

    results.push(stepRun.result);
    progress = stepRun.progress;
  }

  return { results };
};
