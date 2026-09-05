// A scenario the claim office refuses to process: the input is well-formed
// enough to read, but breaks a rule of the domain (an item type nobody insures,
// a claim against a step that never issued a policy). Distinct from a
// TypeError or any other bug in this module — the CLI must report a rejection
// as an error description and a non-zero exit, whereas a bug is a bug. Catching
// this type, rather than every throwable, is what keeps the two apart.
export class ClaimOfficeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClaimOfficeError";
  }
}

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResults = { results: StepResult[] };

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const LOYALTY_DISCOUNT_RATE = 0.2;

const LOYALTY_THRESHOLD_YEARS = 2;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// One catalogue entry per insurable item type. Premium and insurance value are
// two facts about the same thing, so they live together: an item type either is
// in the catalogue with both, or is unknown.
type CatalogueEntry = { basePremium: number; insuranceValue: number };

const ITEM_CATALOGUE: Record<string, CatalogueEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

// The catalogue is the single place that decides whether an item type exists,
// so an unknown type fails here, by name, rather than as a stray TypeError
// somewhere downstream.
const catalogueEntryOf = (type: string): CatalogueEntry => {
  const entry = ITEM_CATALOGUE[type];
  if (entry === undefined) {
    throw new ClaimOfficeError(`Unknown item type: ${type}`);
  }
  return entry;
};

const basePremiumOf = (type: string): number =>
  catalogueEntryOf(type).basePremium;

const insuranceValueOf = (type: string): number =>
  catalogueEntryOf(type).insuranceValue;

type Item = { type: string; cursed?: boolean; enchantment?: number };

// Steps are discriminated by `op`: a quote carries the items to insure, a claim
// carries damage entries against a policy an earlier quote step created.
type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: string; amount: number };

type Incident = { cause: string; damages: Damage[] };

type ClaimStep = { op: "claim"; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;

// Scenarios arrive as parsed JSON (from the CLI, and from object literals in
// the spec whose `op` widens to `string`), so the boundary type is deliberately
// wider than `Step`. Narrowing happens once, in `runStep`.
type StepInput = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

const isQuoteStep = (step: StepInput): step is QuoteStep =>
  step.op === "quote" && step.items !== undefined;

const isClaimStep = (step: StepInput): step is ClaimStep =>
  step.op === "claim" && step.incident !== undefined && step.policy !== undefined;

type Customer = { yearsWithMHPCO: number };

type Scenario = { customer: Customer; steps: StepInput[] };

const BLOCK_SIZE = 3;

// A block is exactly BLOCK_SIZE components of the same type, priced as a unit.
// Exactly: 4 runes are not a block (4 x 25), and 2 runes + 1 moonstone is not
// a block either — "alike" means the same type, not the same family.
const BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const isBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const groupBasePremium = (type: string, count: number): number =>
  isBlock(type, count) ? BLOCK_BASE_PREMIUM : count * basePremiumOf(type);

const sum = (numbers: number[]): number =>
  numbers.reduce((total, value) => total + value, 0);

// Gold is only ever quoted in whole pieces, and every fractional amount the
// price list produces is resolved the same way: in the office's favor. That
// single rule points in opposite directions depending on which way the money
// moves, which is why these are two functions and not one — money coming in
// rounds up, money going out rounds down. Naming both sides of the rule is what
// keeps the asymmetry from reading as an inconsistency at the call sites.
const roundIncomingInOfficesFavor = (amount: number): number =>
  Math.ceil(amount);

const roundOutgoingInOfficesFavor = (amount: number): number =>
  Math.floor(amount);

const policyBasePremium = (items: Item[]): number =>
  sum(
    [...countByType(items)].map(([type, count]) =>
      groupBasePremium(type, count),
    ),
  );

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

// Both surcharges can apply to the same item, so the rates add.
const itemSurchargeRate = (item: Item): number =>
  (isCursed(item) ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

// Item-specific modifiers apply to the affected item's own base premium, not to
// the policy total — note that is the *ungrouped* base premium, so a cursed
// rune inside a block is surcharged on 25 G, not on a share of the block's 60.
const policyItemSurchargeTotal = (items: Item[]): number =>
  sum(
    items.map((item) => basePremiumOf(item.type) * itemSurchargeRate(item)),
  );

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

// Policy-wide rates are summed rather than compounded, so a loyal customer's
// first insurance is levied at -20 % + 10 % = -10 % of the policy base premium.
// Every quote after the customer's first is a follow-up contract; the
// first-insurance surcharge still applies to it, since each item in a quote is
// treated as a first insurance regardless of customer history.
const policyModifierRate = (customer: Customer, isFollowUp: boolean): number =>
  (isLoyal(customer) ? -LOYALTY_DISCOUNT_RATE : 0) +
  (isFollowUp ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0) +
  FIRST_INSURANCE_SURCHARGE_RATE;

const priceQuote = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => {
  // Every modifier is a percentage of an *unmodified* base and they are all
  // summed, never compounded. Item surcharges are percentages of the affected
  // item's own base premium; policy-wide modifiers are percentages of the
  // policy base premium, which excludes those item surcharges. Summing the
  // rates before multiplying also keeps binary floating point out of trouble:
  // a compounded `base * (1 + rate)` chain drifts by ~1e-14, and rounding a
  // premium up would turn that into a whole extra gold piece.
  const policyBase = policyBasePremium(step.items);
  const premiumBeforeFee =
    policyBase +
    policyItemSurchargeTotal(step.items) +
    policyBase * policyModifierRate(customer, isFollowUp);

  // The fee is added after every percentage modifier, and only the final
  // premium is rounded — intermediates stay fractional.
  return {
    premium: roundIncomingInOfficesFavor(premiumBeforeFee + PROCESSING_FEE),
  };
};

// A quote is a follow-up contract when the customer already holds one, i.e.
// when an earlier step in this scenario was itself a quote. Preceding claim
// steps do not make the next quote a follow-up.
const isFollowUpContract = (steps: StepInput[], index: number): boolean =>
  steps.slice(0, index).some(isQuoteStep);

const DEDUCTIBLE_PER_DAMAGE = 100;

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

// The insurance sum is the plain sum of the items' insurance values; the block
// discount applies to the premium only, never to the sum insured.
const insuranceSum = (items: Item[]): number =>
  sum(items.map((item) => insuranceValueOf(item.type)));

// A policy pays out at most twice its insurance sum over its lifetime.
const policyCap = (items: Item[]): number =>
  CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSum(items);

// Distinct from the premium-side high-enchantment *surcharge*, whose threshold
// is 5: this is a different rule that happens to key off the same attribute.
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;

const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

const hasHighEnchantmentReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;

// Each clause states the share of the damage it will reimburse; an item that
// trips no clause is reimbursed in full.
//
// The spec's second reimbursement clause — "damage to items made of dragon
// material is fully reimbursed" — is deliberately absent, not forgotten. It is
// unobservable here, on two counts:
//
//   1. It reimburses at FULL_REIMBURSEMENT_RATE, which is already the rate for
//      an item that trips no clause at all. On its own it changes nothing.
//   2. Where it competes with the high-enchantment clause, the spec says the
//      50 % rule wins (enchantment 9 + dragon → 400 G, same as enchantment 9
//      alone). So it cannot win a conflict either.
//
// No input the spec describes distinguishes an implementation with a dragon
// branch from this one, so `material` is not a field on `Item`. This stops
// holding the moment full reimbursement stops being the default — e.g. if a
// policy-wide co-payment is introduced — at which point the clause becomes
// observable and must be implemented.
const reimbursementRate = (item: Item): number =>
  hasHighEnchantmentReimbursement(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// A damage is something the office pays out against; a negative one would have
// the customer owing the office, which the price list has no notion of.
const hasNegativeAmount = (damage: Damage): boolean => damage.amount < 0;

// A reimbursement clause reduces the damage amount; the deductible comes off
// whatever the clause leaves.
//
// The deductible is the share of a damage event the customer absorbs, so it can
// at most cancel the payout — it never inverts into the customer owing the
// office. Without this floor a damage smaller than the deductible (or reduced
// below it by the 50 % clause) yields a negative payout, which then *raises*
// the policy's remaining cap above its ceiling, since `settleClaim` subtracts
// the payout from it. Every example in the spec exceeds the deductible, so no
// test pins this; the floor is what keeps the two absurdities out.
const NO_PAYOUT = 0;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(
    damage.amount * reimbursementRate(item) - DEDUCTIBLE_PER_DAMAGE,
    NO_PAYOUT,
  );

// A damage entry carries no identity beyond its type, so it is settled against
// any insured item of that type — and it consumes that item, so a second
// damage entry of the same type must find a second insured item. The pool is
// what is left to settle against: each match takes its item out of it.
type ItemPool = ReadonlyMap<string, Item[]>;

const poolOf = (items: Item[]): ItemPool =>
  items.reduce(
    (pool, item) => pool.set(item.type, [...(pool.get(item.type) ?? []), item]),
    new Map<string, Item[]>(),
  );

// A policy only covers what it insures, so a damage entry naming an item the
// policy does not carry — or one more of a type than it carries — is a
// rejection rather than a zero-value payout.
//
// This subsumes the unknown-item-type case, and deliberately so: the claim path
// never consults ITEM_CATALOGUE. Coverage is the stronger check — a policy can
// only hold items that passed `catalogueEntryOf` when it was quoted, so a type
// nobody insures is necessarily absent from the pool and is rejected here, by
// name. Adding a catalogue lookup on this path would be dead code: it could
// only fire on inputs that this lookup already rejects, and it would report the
// weaker of the two reasons ("unknown type" when the actionable fact is that
// the policy does not cover it).
const takeInsuredItem = (
  pool: ItemPool,
  itemType: string,
): { item: Item; remaining: ItemPool } => {
  const [item, ...rest] = pool.get(itemType) ?? [];
  if (item === undefined) {
    throw new ClaimOfficeError(
      `Damaged item is not covered by the policy: ${itemType}`,
    );
  }
  return { item, remaining: new Map(pool).set(itemType, rest) };
};

// One pass over the damages, drawing down the pool as it goes: the nth damage
// of a type meets the nth insured item of that type, and running out is a
// rejection. Pairing them up front is what keeps `incidentPayout` a plain sum.
// A damage entry paired with the insured item it will be settled against.
type SettledDamage = { damage: Damage; item: Item };

const matchDamagesToItems = (
  damages: Damage[],
  policyItems: Item[],
): SettledDamage[] =>
  damages.reduce<{ matches: SettledDamage[]; pool: ItemPool }>(
    ({ matches, pool }, damage) => {
      const { item, remaining } = takeInsuredItem(pool, damage.itemType);

      return { matches: [...matches, { damage, item }], pool: remaining };
    },
    { matches: [], pool: poolOf(policyItems) },
  ).matches;

// Well-formedness of the damages is settled before any of them is priced, so a
// rejection does not depend on how far a partial pass happened to get. The
// first offending amount names itself in the message.
const rejectNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find(hasNegativeAmount);
  if (negative !== undefined) {
    throw new ClaimOfficeError(
      `Damage amount cannot be negative: ${negative.amount}`,
    );
  }
};

// The deductible applies once per damaged item, so each damage entry is
// reduced separately before the entries are summed. A damage entry names its
// item by type, so the clauses are read off the insured item it was matched to.
const incidentPayout = (incident: Incident, policyItems: Item[]): number => {
  rejectNegativeDamages(incident.damages);

  return roundOutgoingInOfficesFavor(
    sum(
      matchDamagesToItems(incident.damages, policyItems).map(
        ({ damage, item }) => damagePayout(damage, item),
      ),
    ),
  );
};

// The cap is a lifetime budget for the policy, so a claim can pay out only what
// earlier claims against the same policy have left of it.
const settleClaim = (
  step: ClaimStep,
  policyItems: Item[],
  alreadyPaidOut: number,
): ClaimResult => {
  const remainingBefore = policyCap(policyItems) - alreadyPaidOut;
  const payout = Math.min(
    incidentPayout(step.incident, policyItems),
    remainingBefore,
  );

  return { payout, remainingCap: remainingBefore - payout };
};

// A claim names its policy by the step number of the quote that created it, so
// the reference indexes the full step list — not a prefix of it. The parameter
// is `policy` rather than `index` because that is the thing being looked up: a
// policy reference, not a position among siblings. `ScenarioPosition` keeps the
// two apart at the call sites; naming this one after its role keeps them apart
// here too.
const quoteStepFor = (steps: StepInput[], policy: number): QuoteStep => {
  const step = steps[policy];
  if (step === undefined || !isQuoteStep(step)) {
    throw new ClaimOfficeError(
      `Claim references a step that is not a quote: ${policy}`,
    );
  }
  return step;
};

// The payouts made so far against each policy, keyed by the step index of the
// quote that created it. Claims consume their policy's cap as the scenario
// runs, so this has to be carried from each step to the next.
type PaidOutByPolicy = ReadonlyMap<number, number>;

const paidOutOn = (paidOut: PaidOutByPolicy, policy: number): number =>
  paidOut.get(policy) ?? 0;

const withPayoutRecorded = (
  paidOut: PaidOutByPolicy,
  policy: number,
  payout: number,
): PaidOutByPolicy =>
  new Map(paidOut).set(policy, paidOutOn(paidOut, policy) + payout);

// Running a step yields its result *and* the cap ledger the next step must see.
// Pairing them is what lets a claim hand on the payout it just consumed without
// the caller having to re-derive the step's kind from its result.
type StepOutcome = { result: StepResult; paidOut: PaidOutByPolicy };

// Where in the scenario a step sits. The step, the list it came from, and its
// index are one idea, not three arguments: both the follow-up-contract rule and
// the policy lookup are questions about a step's position among its siblings,
// and neither can be answered from the step alone. Bundling them also keeps
// `index` (a position) from being passed where `policy` (also a bare number,
// also a step index) is meant.
type ScenarioPosition = {
  step: StepInput;
  steps: StepInput[];
  index: number;
};

const runStep = (
  { step, steps, index }: ScenarioPosition,
  customer: Customer,
  paidOut: PaidOutByPolicy,
): StepOutcome => {
  if (isQuoteStep(step)) {
    // A quote consumes no cap, so it passes the ledger on untouched.
    return {
      result: priceQuote(step, customer, isFollowUpContract(steps, index)),
      paidOut,
    };
  }
  if (isClaimStep(step)) {
    const result = settleClaim(
      step,
      quoteStepFor(steps, step.policy).items,
      paidOutOn(paidOut, step.policy),
    );

    return {
      result,
      paidOut: withPayoutRecorded(paidOut, step.policy, result.payout),
    };
  }
  throw new ClaimOfficeError(`Unsupported step op: ${step.op}`);
};

// What the fold carries from step to step: the results so far, plus the cap
// ledger. Only `results` is part of the answer — `paidOut` is scaffolding, so
// this is deliberately not `ScenarioResults`.
type ScenarioProgress = {
  results: StepResult[];
  paidOut: PaidOutByPolicy;
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  const { results } = scenario.steps.reduce<ScenarioProgress>(
    ({ results, paidOut }, step, index) => {
      const { result, paidOut: paidOutAfter } = runStep(
        { step, steps: scenario.steps, index },
        scenario.customer,
        paidOut,
      );

      return { results: [...results, result], paidOut: paidOutAfter };
    },
    { results: [], paidOut: new Map() },
  );

  return { results };
};
