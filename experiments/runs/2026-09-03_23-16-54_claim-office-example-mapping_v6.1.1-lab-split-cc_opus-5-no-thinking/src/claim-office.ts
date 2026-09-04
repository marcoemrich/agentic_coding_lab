export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  /** Zero-based index of the quote step that created the policy. */
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

export interface ScenarioResults {
  results: StepResult[];
}

/**
 * A customer as they stand at one point in a scenario: who they are, plus what
 * they have already been quoted. `quotesSoFar` counts *quotes priced*, not
 * steps taken — once claim steps exist the two will differ, and it is the quote
 * count that decides whether a policy is a follow-up contract.
 */
interface CustomerStanding {
  readonly customer: Customer;
  readonly quotesSoFar: number;
}

const PROCESSING_FEE = 5;

/**
 * The spec keeps intermediate amounts as exact fractions and rounds only the
 * final amount. Binary floating point cannot do that: `100 * 1.1` is
 * 110.00000000000001, which rounds *up* to 111 instead of 110.
 *
 * So percentages are applied as integer rationals — multiply by the numerator
 * first, divide by the denominator last — and money is carried in hundredths
 * of a G. Both operands of every product stay integral, so no drift accrues.
 */
const SUBUNITS_PER_G = 100;
const toSubunits = (gold: number): number => Math.round(gold * SUBUNITS_PER_G);

/**
 * A percentage held as an exact rational, so that it can be applied without
 * float drift: multiply by `num` first, divide by `den` last.
 *
 * Deliberately anonymous about *meaning*. Both sides of the business use
 * percentages, but they use them for opposite things — see `Rate` and `Share`,
 * which are the names the domain actually reads in.
 */
interface Fraction {
  num: number;
  den: number;
}

/**
 * The part of `subunits` that `fraction` denotes.
 *
 * Deliberately the only arithmetic on a `Fraction`. What the result *means*
 * differs by which alias is passed — a `Rate` yields a modifier to be summed
 * onto a base, a `Share` yields the whole of what is paid — but the
 * calculation is the same one, so it is written once and the types carry the
 * distinction.
 */
const partOf = (subunits: number, fraction: Fraction): number =>
  (subunits * fraction.num) / fraction.den;

/**
 * A modifier as an exact rational: the surcharge or discount *itself*, not the
 * multiplied total. +10 % is { num: 10, den: 100 }; a discount has a negative
 * numerator. Modifiers are summed onto a base, never multiplied through it.
 */
type Rate = Fraction;

const FIRST_INSURANCE_SURCHARGE: Rate = { num: 10, den: 100 };
const CURSE_SURCHARGE: Rate = { num: 50, den: 100 };
const HIGH_ENCHANTMENT_SURCHARGE: Rate = { num: 30, den: 100 };

const LOYALTY_DISCOUNT: Rate = { num: -20, den: 100 };
const FOLLOW_UP_DISCOUNT: Rate = { num: -15, den: 100 };

/** An item is highly enchanted from this level upwards. */
const HIGH_ENCHANTMENT_LEVEL = 5;

/** A customer is long-standing from this many years of business upwards. */
const LOYALTY_YEARS = 2;

/** Premiums round up — in the MHPCO's favour. */
const toPremiumGold = (subunits: number): number => Math.ceil(subunits / SUBUNITS_PER_G);

/**
 * What the MHPCO charges to insure an item type, and what it insures it for.
 * Two independent facts, held together because they are looked up together.
 *
 * Every insuranceValue here happens to be ten times its basePremium. That is a
 * coincidence of the current rate card, not a rule the spec states — the two
 * columns are given independently — so it is left unfactored. Deriving one from
 * the other would make a future type whose value is not 10x its premium
 * inexpressible.
 */
interface Rating {
  readonly basePremium: number;
  readonly insuranceValue: number;
  /** Components price in blocks; main items do not. */
  readonly isComponent: boolean;
}

const RATE_CARD: Record<string, Rating> = {
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
};

/**
 * A scenario the MHPCO declines to process — malformed input rather than a
 * business outcome. Thrown so that no partial results reach the caller; the CLI
 * catches it and reports the message, distinguishing it from an outright bug.
 */
export class ClaimOfficeError extends Error {}

/** The MHPCO insures only what is on its price list. */
const ratingOf = (item: Item): Rating => {
  const rating = RATE_CARD[item.type];
  if (rating === undefined) throw new ClaimOfficeError(`Unknown item type: ${item.type}`);

  return rating;
};

const basePremiumOf = (item: Item): number => ratingOf(item).basePremium;

/** What an item is insured for — distinct from what it costs to insure. */
const insuranceValueOf = (item: Item): number => ratingOf(item).insuranceValue;

const isComponent = (item: Item): boolean => ratingOf(item).isComponent;

/** Exactly this many alike components form a block, priced as one unit. */
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

/** Splits items into those matching the predicate and those that do not. */
const partition = (items: Item[], matches: (item: Item) => boolean): [Item[], Item[]] => [
  items.filter(matches),
  items.filter((item) => !matches(item)),
];

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) groups.set(item.type, [...(groups.get(item.type) ?? []), item]);

  return groups;
};

const sumOfBasePremiums = (items: Item[]): number =>
  items.reduce((total, item) => total + basePremiumOf(item), 0);

/**
 * Alike components — those of the very same type — form a block when there are
 * exactly COMPONENT_BLOCK_SIZE of them; the block is priced as one unit.
 * Any other count is priced per component.
 */
const componentGroupPremium = (group: Item[]): number =>
  group.length === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : sumOfBasePremiums(group);

/**
 * The policy base premium: every insured item's base premium, summed — except
 * that each group of alike components is priced as blocks where it can be.
 */
const policyBasePremiumOf = (items: Item[]): number => {
  const [components, mainItems] = partition(items, isComponent);
  const componentsTotal = [...groupByType(components).values()].reduce(
    (total, group) => total + componentGroupPremium(group),
    0,
  );

  return sumOfBasePremiums(mainItems) + componentsTotal;
};

/** The total the given rates contribute against a shared base. */
const sumOfRateAmounts = (base: number, rates: Rate[]): number =>
  rates.reduce((total, rate) => total + partOf(base, rate), 0);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

/** Which item-specific modifiers an item attracts, by its own attributes. */
const ratesForItem = (item: Item): Rate[] => [
  ...(item.cursed ? [CURSE_SURCHARGE] : []),
  ...(isHighlyEnchanted(item) ? [HIGH_ENCHANTMENT_SURCHARGE] : []),
];

const isLongStanding = (standing: CustomerStanding): boolean =>
  standing.customer.yearsWithMHPCO >= LOYALTY_YEARS;

const holdsAnEarlierQuote = (standing: CustomerStanding): boolean => standing.quotesSoFar > 0;

/** Which policy-wide modifiers a policy attracts, by the customer's standing. */
const ratesForPolicy = (standing: CustomerStanding): Rate[] => [
  FIRST_INSURANCE_SURCHARGE,
  ...(isLongStanding(standing) ? [LOYALTY_DISCOUNT] : []),
  ...(holdsAnEarlierQuote(standing) ? [FOLLOW_UP_DISCOUNT] : []),
];

/** Item-specific modifiers apply to the affected item's own base premium. */
const sumOfItemModifierAmounts = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + sumOfRateAmounts(toSubunits(basePremiumOf(item)), ratesForItem(item)),
    0,
  );

/**
 * Modifiers are additive amounts, each computed against its own base: item
 * modifiers against the affected item, policy-wide modifiers against the
 * policy base premium. The processing fee is added at the very end.
 */
const quotePremium = (items: Item[], standing: CustomerStanding): number => {
  const policyBase = toSubunits(policyBasePremiumOf(items));

  return toPremiumGold(
    policyBase +
      sumOfItemModifierAmounts(items) +
      sumOfRateAmounts(policyBase, ratesForPolicy(standing)) +
      toSubunits(PROCESSING_FEE),
  );
};

/** A deductible is withheld from each damaged item's reimbursement. */
const DEDUCTIBLE = 100;

/** The MHPCO pays at most this multiple of a policy's insurance sum. */
const CAP_MULTIPLE = 2;

/** Payouts round down — in the MHPCO's favour. */
const toPayoutGold = (subunits: number): number => Math.floor(subunits / SUBUNITS_PER_G);

/**
 * A policy created by a quote step: the items it covers, and how much of its
 * payout cap is still available.
 */
interface Policy {
  readonly items: Item[];
  readonly remainingCap: number;
}

/**
 * What a policy insures for in total: every covered item's own insurance value,
 * summed. Unmodified — curses and enchantments move the premium, not this, and
 * a component block is a premium discount only.
 */
const insuranceSumOf = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValueOf(item), 0);

const policyFor = (items: Item[]): Policy => ({
  items,
  remainingCap: toSubunits(insuranceSumOf(items) * CAP_MULTIPLE),
});

/**
 * How much of a damage the MHPCO reimburses, as an exact rational. Unlike a
 * `Rate`, a share is the *whole* of what is paid rather than an adjustment to
 * it: HALF_REIMBURSEMENT is what the claimant gets, not what they lose, and
 * FULL_REIMBURSEMENT is the identity. Shares are multiplied through the
 * damage; they are never summed with one another.
 */
type Share = Fraction;

const FULL_REIMBURSEMENT: Share = { num: 100, den: 100 };
const HALF_REIMBURSEMENT: Share = { num: 50, den: 100 };

/**
 * Damage to an item this heavily enchanted is reimbursed at half. Note this is
 * a different threshold from HIGH_ENCHANTMENT_LEVEL, which governs the premium.
 */
const HALF_REIMBURSEMENT_LEVEL = 8;

const isHeavilyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;

/**
 * The share of a damage the MHPCO reimburses for an item.
 *
 * Reimbursement clauses do not stack the way premium modifiers do: exactly one
 * clause decides the share, and a share is multiplied through the damage rather
 * than summed. This is the opposite of `ratesForItem`, which collects every
 * modifier that applies — hence a single answer rather than a list.
 *
 * The spec also states a dragon-material clause granting *full* reimbursement,
 * and it is deliberately absent here. It is unobservable: full reimbursement is
 * already the default, and the only reducing clause (half, at enchantment >=
 * HALF_REIMBURSEMENT_LEVEL) is specified to win wherever both would apply. So
 * the dragon clause can only ever agree with this function, never override it —
 * no input exists for which reading `item.material` changes the answer. All
 * three worked dragon examples in the spec (enchantment 8 and 9 → half; 5 →
 * full) come out right without it.
 *
 * That makes a dragon branch unfalsifiable code: the suite stays green with it
 * above the enchantment check, below it, or gone. It is left out rather than
 * written untestable. Should a later clause make material observable — a
 * *reducing* dragon rule, or a full-reimbursement clause that outranks the
 * half — a failing test will demand it, and this note should go with it.
 */
const reimbursedShareOf = (item: Item): Share =>
  isHeavilyEnchanted(item) ? HALF_REIMBURSEMENT : FULL_REIMBURSEMENT;

/**
 * What a damage is worth, in subunits.
 *
 * A damage cannot be worth less than nothing, so a negative amount is rejected
 * here rather than carried into the arithmetic. Were one allowed through, it
 * would not merely pay out negatively — it would *return* cap to the policy,
 * letting a later claim draw more than twice the insurance sum.
 *
 * Zero is left valid: a damage of exactly the deductible nets no payout and is
 * an ordinary, reportable outcome, not malformed input.
 */
const damageAmountOf = (damage: Damage): number => {
  if (damage.amount < 0) {
    throw new ClaimOfficeError(`Damage amount cannot be negative: ${damage.amount}`);
  }

  return toSubunits(damage.amount);
};

/**
 * What the MHPCO reimburses for one damaged item, before the cap is applied:
 * the reimbursed share of the damage, less the deductible.
 *
 * Damage worth less than the deductible is simply not worth claiming — it is
 * never a debt owed back. Flooring at nothing is what keeps that true, and it
 * protects the cap for the same reason `damageAmountOf` rejects negative
 * amounts: a below-zero reimbursement would *return* cap to the policy, letting
 * a later claim draw more than twice the insurance sum.
 *
 * The floor is per damaged item, since the deductible is: one item's shortfall
 * must not eat into what another item is owed.
 */
const reimbursementFor = (damage: Damage, item: Item): number =>
  Math.max(
    0,
    partOf(damageAmountOf(damage), reimbursedShareOf(item)) - toSubunits(DEDUCTIBLE),
  );

/** Everything a step may read and advance as the scenario runs. */
interface Ledger {
  readonly standing: CustomerStanding;
  /** Policies by the index of the quote step that created them. */
  readonly policies: ReadonlyMap<number, Policy>;
}

/** The ledger as it stands once `policy` is on record at `stepIndex`. */
const withPolicy = (ledger: Ledger, stepIndex: number, policy: Policy): Ledger => ({
  ...ledger,
  policies: new Map(ledger.policies).set(stepIndex, policy),
});

/**
 * The policy created by the quote step at `stepIndex`.
 *
 * A claim names its policy by step index, and nothing constrains that index to
 * name a quote that happened — so the lookup rejects a dangling reference
 * rather than letting a claim proceed against no policy at all.
 */
const policyCreatedBy = (ledger: Ledger, stepIndex: number): Policy => {
  const policy = ledger.policies.get(stepIndex);
  if (policy === undefined) throw new ClaimOfficeError(`No policy created by step ${stepIndex}`);

  return policy;
};

/** A damage together with the insured item it befell. */
interface DamagedItem {
  readonly damage: Damage;
  readonly item: Item;
}

/**
 * Each damage paired with the insured item it befell.
 *
 * A policy may cover several alike items — two swords, say — and each damage
 * entry is a separate item's misfortune. So a matched item is consumed: the
 * second sword damage pairs with the *other* sword, which may be enchanted
 * differently and so reimbursed differently.
 *
 * The pairing is returned joined rather than as an items list parallel to the
 * damages, so that a caller cannot read the two out of step.
 *
 * Finding no item to pair with is the *only* check on whether a policy covers
 * what was damaged. It is not merely an exhaustion guard: an item type can be
 * perfectly well known to the rate card — `ratingOf` would price an amulet
 * happily — and still be no part of *this* policy. Coverage is a fact about the
 * policy, not about the price list, so it can only be decided here.
 */
const pairDamagesWithItems = (policy: Policy, damages: Damage[]): DamagedItem[] => {
  const unharmed = [...policy.items];

  return damages.map((damage) => {
    const found = unharmed.findIndex((covered) => covered.type === damage.itemType);
    if (found === -1) throw new ClaimOfficeError(`Policy does not cover a ${damage.itemType}`);

    return { damage, item: unharmed.splice(found, 1)[0] };
  });
};

/** The result of a step, and the ledger as the *next* step will find it. */
interface StepOutcome {
  readonly result: StepResult;
  readonly ledger: Ledger;
}

/**
 * A quote prices the items against the customer's standing, and leaves the
 * customer holding one more quote than before — which is what makes the *next*
 * quote a follow-up. It also creates the policy that later claims draw on.
 */
const applyQuote = (step: QuoteStep, ledger: Ledger, stepIndex: number): StepOutcome => ({
  result: { premium: quotePremium(step.items, ledger.standing) },
  ledger: withPolicy(
    { ...ledger, standing: { ...ledger.standing, quotesSoFar: ledger.standing.quotesSoFar + 1 } },
    stepIndex,
    policyFor(step.items),
  ),
});

/**
 * What an incident's damages come to against a policy, before the cap: every
 * damaged item reimbursed on its own terms, each less its own deductible.
 */
const reimbursementForIncident = (incident: Incident, policy: Policy): number =>
  pairDamagesWithItems(policy, incident.damages).reduce(
    (total, { damage, item }) => total + reimbursementFor(damage, item),
    0,
  );

/**
 * What an incident actually pays out: what it is worth, or what the policy has
 * left, whichever is less.
 *
 * The cap binds the payout, not merely the report — a claim worth more than the
 * policy has left pays out only what remains. Clamping in subunits, before
 * `toPayoutGold` rounds, is what keeps the cap from running negative and lets it
 * reach exactly 0 rather than a rounded near-zero.
 */
const cappedPayout = (incident: Incident, policy: Policy): number =>
  Math.min(reimbursementForIncident(incident, policy), policy.remainingCap);

/**
 * A claim reimburses each damaged item, less the deductible, and draws the
 * total down from the policy's remaining cap.
 */
const applyClaim = (step: ClaimStep, ledger: Ledger): StepOutcome => {
  const policy = policyCreatedBy(ledger, step.policy);
  const payout = cappedPayout(step.incident, policy);
  const remainingCap = policy.remainingCap - payout;

  return {
    result: { payout: toPayoutGold(payout), remainingCap: toPayoutGold(remainingCap) },
    ledger: withPolicy(ledger, step.policy, { ...policy, remainingCap }),
  };
};

/**
 * Steps are processed in order, since a step's result can depend on those
 * before it — a quote is discounted once the customer holds an earlier one, and
 * a claim draws on a policy an earlier quote created.
 *
 * Each step both produces a result and hands on the ledger the next step will
 * see, so that a step's effect on later steps lives with the step's own logic
 * rather than in loose accumulators advanced by hand here.
 */
export const runScenario = (scenario: Scenario): ScenarioResults => {
  const results: StepResult[] = [];
  let ledger: Ledger = {
    standing: { customer: scenario.customer, quotesSoFar: 0 },
    policies: new Map(),
  };

  scenario.steps.forEach((step, stepIndex) => {
    const outcome =
      step.op === "quote" ? applyQuote(step, ledger, stepIndex) : applyClaim(step, ledger);
    results.push(outcome.result);
    ledger = outcome.ledger;
  });

  return { results };
};
