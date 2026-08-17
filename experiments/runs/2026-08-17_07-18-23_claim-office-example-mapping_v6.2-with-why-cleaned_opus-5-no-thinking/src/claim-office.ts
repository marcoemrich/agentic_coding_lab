const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT_PERCENT = 20;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;
// The CLAIM_ prefix marks the claim-side pair. Both are deliberately distinct
// from their premium-side namesakes above: a sword can be enchanted enough to
// cost more to insure (threshold 5) without being enchanted enough to pay out
// less (threshold 8).
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const BASE_PREMIUMS = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const;

// What an item is insured FOR, as opposed to what insuring it costs. The cap on
// claims is derived from these, so premium discounts never move it.
const INSURANCE_VALUES = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
} as const;

// The six priced types are the domain, so they are derived from the premium
// table rather than restated: a type nobody prices cannot be insured. The
// unknown-type case (broomstick) is still a runtime error the tests will drive.
type ItemType = keyof typeof BASE_PREMIUMS;

// Components (as opposed to main items) are the only things the block rule
// applies to, so the distinction has to be data, not a price coincidence.
// Typed as a set of ItemType so a component can never name an unpriced type.
const COMPONENT_TYPES = new Set<ItemType>(["rune", "moonstone"]);

const PERCENT_WHOLE = 100;

// Takes the percentage as a whole number and divides at the end, rather than
// scaling by a precomputed rate like `amount * 0.1`. The rate would carry
// floating-point error into every term of the premium sum, and the spec rounds
// that sum in MHPCO's favour — so an error of one ULP below a whole number is
// enough to round a premium a full Gold piece the wrong way.
const percentOf = (percent: number, amount: number): number =>
  (amount * percent) / PERCENT_WHOLE;

// MHPCO rounds every money amount in its own favour: premiums (customer pays)
// round up, payouts (MHPCO pays) round down.
const roundPremiumInMHPCOsFavour = Math.ceil;

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };

export type ScenarioResult = QuoteResult | ClaimResult;

// `material` is accepted but never read: the dragon-material clause reimburses
// in full, which is what every ordinary item already gets, so no code can yet
// tell dragon from steel. See `reimbursableAmountFor`. All three are optional so
// a bare `{ type: "rune" }` typechecks: a rune has no enchantment to speak of,
// rather than an enchantment of zero.
type Item = {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Damage = { itemType: string; amount: number };

type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };

type ClaimStep = { op: "claim"; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;

const isQuote = (step: Step): step is QuoteStep => step.op === "quote";

type Customer = { yearsWithMHPCO: number };

// Exported because it is the parameter type of `runScenario`: a caller building
// a scenario has to be able to name the shape it is required to pass.
export type Scenario = {
  customer: Customer;
  steps: Step[];
};

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

// The scenario asks for something MHPCO cannot price or pay: an unpriced item
// type, a negative damage, a claim on an item the policy never covered, a claim
// on a step that is not a policy. All four are the customer's input being wrong,
// not this code being wrong — which is the distinction the CLI needs. A bare
// `Error` reaching the CLI is a defect in here and must not be reported as a
// rejected scenario, so the class exists to be caught, not merely to be read.
export class InvalidScenarioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidScenarioError";
  }
}

// The ItemType union is compile-time only, and scenarios arrive as parsed JSON,
// so an unknown type has to be caught here rather than trusted. Without this the
// missing table entry would quietly poison the arithmetic with NaN.
const basePremiumForItem = (item: Item): number => {
  const basePremium = BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new InvalidScenarioError(`MHPCO does not insure items of type ${item.type}`);
  }
  return basePremium;
};

const sumBasePremiums = (items: Item[]): number => sum(items.map(basePremiumForItem));

// Groups of items that are "alike" — same type. The type is kept alongside the
// items because the block rule asks about it; recovering it from items[0] would
// make every reader re-derive that a group is non-empty and homogeneous.
type AlikeItems = { type: ItemType; items: Item[] };

const groupByType = (items: Item[]): AlikeItems[] => {
  const groups = new Map<ItemType, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups].map(([type, groupedItems]) => ({ type, items: groupedItems }));
};

// A block is a discount on the components' combined base premium, not a flat
// price: 3 runes are 75 G less 20 % = 60 G. Derived rather than hardcoded so the
// 20 % stays visible as the rule it is.
const blockBasePremium = (items: Item[]): number => {
  const undiscounted = sumBasePremiums(items);
  return undiscounted - percentOf(BLOCK_DISCOUNT_PERCENT, undiscounted);
};

// Exactly BLOCK_SIZE, not "at least": 4 or 7 runes form no block, so a bigger
// pile is never cheaper than the block it contains. Components only — three
// swords are three separate insurances, not a discounted building block.
const formsABlock = ({ type, items }: AlikeItems): boolean =>
  items.length === BLOCK_SIZE && COMPONENT_TYPES.has(type);

const basePremiumForGroup = (alikeItems: AlikeItems): number =>
  formsABlock(alikeItems)
    ? blockBasePremium(alikeItems.items)
    : sumBasePremiums(alikeItems.items);

// Priced per group of alike items rather than over the whole list, so 3 runes
// and 3 moonstones each form their own block.
const policyBasePremiumFor = (items: Item[]): number =>
  sum(groupByType(items).map(basePremiumForGroup));

const percentOfWhen = (applies: boolean, percent: number, amount: number): number =>
  applies ? percentOf(percent, amount) : 0;

// Each item-specific surcharge is a percentage of the affected item's OWN base
// premium, so every rule reads as "this much, when this holds". The terms are
// summed rather than chosen between: an item can trigger several at once.
//
// Deliberately two explicit terms rather than a table of rules. The shared
// shape is only the arithmetic tail; the conditions differ in kind (a flag vs.
// a threshold over an optional number), and nothing in the remaining spec adds
// a third item-specific surcharge to generalise over.
const surchargeFor = (item: Item): number => {
  const base = basePremiumForItem(item);
  return (
    percentOfWhen(item.cursed === true, CURSE_SURCHARGE_PERCENT, base) +
    percentOfWhen(
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
      HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
      base,
    )
  );
};

// Charged alongside the policy base premium — never folded into it, or the
// policy-wide modifiers would compound on top of them.
const itemSurchargesFor = (items: Item[]): number => sum(items.map(surchargeFor));

// Unlike the item-specific surcharges, these are percentages of the WHOLE
// policy's base premium. Each is returned already signed — a surcharge is
// positive, a discount negative — so the rule and its direction stay on one
// line instead of the sign living in a `+`/`-` further down the sum.
const policyModifiersFor = (
  policyBasePremium: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number[] => [
  // Applies to every quote, follow-ups included: the spec treats each item in a
  // quote as newly insured, regardless of how long the customer has been around.
  percentOf(FIRST_INSURANCE_SURCHARGE_PERCENT, policyBasePremium),
  -percentOfWhen(
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    LOYALTY_DISCOUNT_PERCENT,
    policyBasePremium,
  ),
  -percentOfWhen(isFollowUpContract, FOLLOW_UP_DISCOUNT_PERCENT, policyBasePremium),
];

// The order of the terms is the order of the spec's rules: what the items are
// worth, what they individually cost extra, what the policy as a whole is
// adjusted by, and MHPCO's fee on top.
const quoteFor = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): QuoteResult => {
  const policyBasePremium = policyBasePremiumFor(items);
  const premium = roundPremiumInMHPCOsFavour(
    policyBasePremium +
      itemSurchargesFor(items) +
      sum(policyModifiersFor(policyBasePremium, customer, isFollowUpContract)) +
      PROCESSING_FEE,
  );
  return { premium };
};

// A follow-up contract is any quote after the customer's first, so what counts
// is how many QUOTES precede this step — not how many steps do. Claim steps sit
// in the same list and must not push a later quote into follow-up territory.
const isFollowUpContract = (precedingSteps: Step[]): boolean =>
  precedingSteps.some(isQuote);

const insuranceSumFor = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type]));

// MHPCO pays, so payouts round down.
const roundPayoutInMHPCOsFavour = Math.floor;

// How much of a damage the policy reimburses, before the deductible. The
// clauses are CHOSEN BETWEEN, not summed — unlike the premium surcharges, where
// a cursed AND highly-enchanted sword pays both. Written as a chain of
// exceptions over a default so precedence is the reading order: the first
// matching clause wins.
//
// Only one exception is listed. Dragon material is the spec's other clause, but
// it reimburses in full, which is already the default — so it is deliberately
// absent rather than written as a branch returning `damage.amount` unchanged.
// A conditional whose arms agree hides that agreement instead of stating it,
// and suggests the material is doing work here when it is not. It earns a
// branch on the day a test makes dragon differ from ordinary steel.
const reimbursableAmountFor = (damage: Damage, damagedItem: Item): number => {
  // Negative damage would have MHPCO billing the customer for being attacked.
  // Zero is allowed: a scratch below the deductible is a real, if futile, claim.
  if (damage.amount < 0) {
    throw new InvalidScenarioError(
      `Claim reports a damage of ${damage.amount} G, which cannot be negative`,
    );
  }
  return (damagedItem.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
    ? percentOf(CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT, damage.amount)
    : damage.amount;
};

// A damage entry together with the insured item it was matched to. Pairing them
// in one value keeps the two from being re-joined by position further down,
// where the correctness of the join would rest on an unstated shared ordering.
type DamagedItem = { damage: Damage; item: Item };

// Each damage entry carries its own deductible: one dragon attack damaging two
// items is two damages, and MHPCO withholds 100 G from each. The reimbursement
// clauses apply to the damage amount FIRST, so the deductible bites last.
const payoutForDamage = ({ damage, item }: DamagedItem): number =>
  reimbursableAmountFor(damage, item) - DEDUCTIBLE;

// Splits the insured items into the first one of the wanted type and the rest.
// A damage with nothing left to match is a claim on something MHPCO never
// insured, which voids the whole claim.
const claimOneItemOfType = (
  itemType: string,
  unclaimed: Item[],
): { item: Item; stillUnclaimed: Item[] } => {
  const index = unclaimed.findIndex((insured) => insured.type === itemType);
  if (index === -1) {
    throw new InvalidScenarioError(
      `Claim damages a ${itemType} beyond what this policy covers`,
    );
  }
  return {
    item: unclaimed[index],
    stillUnclaimed: unclaimed.filter((_, position) => position !== index),
  };
};

// Pairs each damage entry with the insured item it refers to. An item can only
// be damaged once per incident, so entries CONSUME the items they match: two
// sword damages need two insured swords. The fold carries the not-yet-matched
// items from one entry to the next, which is what makes the consumption a
// property of the traversal rather than a side effect on a scratch array.
const damagedItemsFor = (damages: Damage[], insuredItems: Item[]): DamagedItem[] =>
  damages.reduce<{ damagedItems: DamagedItem[]; unclaimed: Item[] }>(
    ({ damagedItems, unclaimed }, damage) => {
      const { item, stillUnclaimed } = claimOneItemOfType(damage.itemType, unclaimed);
      return {
        damagedItems: [...damagedItems, { damage, item }],
        unclaimed: stillUnclaimed,
      };
    },
    { damagedItems: [], unclaimed: insuredItems },
  ).damagedItems;

// The cap is a property of the POLICY, not of the claim: twice what the policy's
// items are insured for. Kept separate from the payout so the cross-claim
// accumulation the spec still demands has an obvious place to attach.
const capFor = (policy: QuoteStep): number =>
  insuranceSumFor(policy.items) * CAP_MULTIPLE;

// The cap is spent down across every claim on a policy rather than reset per
// claim, so the caller supplies what is left; a claim wanting more than remains
// is cut short by it.
const claimFor = (claim: ClaimStep, policy: QuoteStep, capRemaining: number): ClaimResult => {
  const damagedItems = damagedItemsFor(claim.incident.damages, policy.items);
  const payoutBeforeCap = roundPayoutInMHPCOsFavour(
    sum(damagedItems.map(payoutForDamage)),
  );
  const payout = Math.min(payoutBeforeCap, capRemaining);
  return { payout, remainingCap: capRemaining - payout };
};

// `claim.policy` indexes the scenario's steps, and the referenced step must be a
// quote — a claim against a claim is meaningless. Both the out-of-range and the
// wrong-kind case are the customer's input being wrong, so this throws the same
// InvalidScenarioError the CLI reports as a rejected scenario.
const policyReferencedBy = (claim: ClaimStep, steps: Step[]): QuoteStep => {
  const step = steps[claim.policy];
  if (step === undefined || !isQuote(step)) {
    throw new InvalidScenarioError(
      `Claim references step ${claim.policy}, which is not a quote`,
    );
  }
  return step;
};

// What a policy has left to pay out, keyed by the step index that quoted it.
// A policy absent from the map has had no claims yet, so its remaining cap is
// still the full `capFor` — the map records spending, not entitlement.
type CapRemainingByPolicy = ReadonlyMap<number, number>;

// Everything the scenario carries FORWARD from one step to the next. Results
// accumulate; caps are spent down. Naming it makes the fold below a transition
// between two of these rather than bookkeeping over loose variables.
type ScenarioProgress = {
  results: ScenarioResult[];
  capRemainingByPolicy: CapRemainingByPolicy;
};

const withCapRemaining = (
  capRemainingByPolicy: CapRemainingByPolicy,
  policyIndex: number,
  capRemaining: number,
): CapRemainingByPolicy =>
  new Map(capRemainingByPolicy).set(policyIndex, capRemaining);

// A claim reads the cap its policy has left and hands back what remains, so it
// is the only step kind that advances more than the results list.
const claimStepResult = (
  step: ClaimStep,
  steps: Step[],
  capRemainingByPolicy: CapRemainingByPolicy,
): { result: ClaimResult; capRemainingByPolicy: CapRemainingByPolicy } => {
  const policy = policyReferencedBy(step, steps);
  const capRemaining = capRemainingByPolicy.get(step.policy) ?? capFor(policy);
  const result = claimFor(step, policy, capRemaining);
  return {
    result,
    capRemainingByPolicy: withCapRemaining(
      capRemainingByPolicy,
      step.policy,
      result.remainingCap,
    ),
  };
};

// A quote depends only on the steps BEFORE it (to spot a follow-up contract),
// never on what later steps do, so it leaves the caps untouched.
const quoteStepResult = (
  step: QuoteStep,
  precedingSteps: Step[],
  customer: Customer,
): QuoteResult => quoteFor(step.items, customer, isFollowUpContract(precedingSteps));

// A fold rather than a map: claims spend a shared cap, so a step's result
// depends on the steps before it. `reduce` says that in the signature — `map`
// would promise each step is independent and then quietly break the promise.
export const runScenario = (scenario: Scenario): { results: ScenarioResult[] } => {
  const { results } = scenario.steps.reduce<ScenarioProgress>(
    (progress, step, stepIndex) => {
      if (isQuote(step)) {
        const result = quoteStepResult(
          step,
          scenario.steps.slice(0, stepIndex),
          scenario.customer,
        );
        return { ...progress, results: [...progress.results, result] };
      }
      const { result, capRemainingByPolicy } = claimStepResult(
        step,
        scenario.steps,
        progress.capRemainingByPolicy,
      );
      return { results: [...progress.results, result], capRemainingByPolicy };
    },
    { results: [], capRemainingByPolicy: new Map() },
  );
  return { results };
};
