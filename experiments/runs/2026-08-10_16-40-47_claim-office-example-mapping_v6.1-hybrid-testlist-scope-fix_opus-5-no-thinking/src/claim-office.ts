export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = { itemType: string; amount: number };

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };

/**
 * A step reports one of exactly two shapes, discriminated by which fields are
 * present: a quote is answered with a premium, a claim with a payout and what
 * is left of the cap. They are named as a union rather than left as `unknown`
 * because both shapes are final and each is built in exactly one place — a
 * caller that has to cast to read `premium` is being told the library does not
 * know its own answer.
 */
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResults = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

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

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;
const FULL_REIMBURSEMENT = 1;
const DRAGON_MATERIAL = "dragon";

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

/** Items are priced per type, because the component block applies to alike items. */
const groupByType = (items: Item[]): Map<string, Item[]> =>
  items.reduce(
    (groups, item) => groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
    new Map<string, Item[]>(),
  );

/**
 * Tallies how often each type occurs. Distinct from `groupByType`: pricing needs
 * the items themselves (material, enchantment, block size), whereas comparing a
 * claim against a policy needs only how many of a type each side names.
 */
const countByType = (types: string[]): Map<string, number> =>
  types.reduce(
    (counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1),
    new Map<string, number>(),
  );

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type];

/**
 * Item-level risk surcharges, each a rate on the item's own base premium.
 * They are separate addends: unlike the policy-level initial assessment, they
 * do not compound with each other or with it.
 */
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

const ITEM_SURCHARGE_RULES: { applies: (item: Item) => boolean; rate: number }[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    rate: HIGH_ENCHANTMENT_SURCHARGE,
  },
];

const itemSurchargeTotal = (item: Item): number =>
  ITEM_SURCHARGE_RULES.filter(({ applies }) => applies(item)).reduce(
    (sum, { rate }) => sum + itemBasePremium(item) * rate,
    0,
  );

/**
 * A building block of exactly 3 alike components is offered at a special base
 * premium. "Alike" means the same type, and the block does not repeat: 4 or 7
 * runes are charged per item.
 */
const formsComponentBlock = (type: string, items: Item[]): boolean =>
  COMPONENT_TYPES.includes(type) && items.length === BLOCK_SIZE;

const alikeItemsBasePremium = (type: string, items: Item[]): number =>
  formsComponentBlock(type, items)
    ? BLOCK_BASE_PREMIUM
    : items.reduce((sum, item) => sum + itemBasePremium(item), 0);

const policyBasePremium = (items: Item[]): number =>
  [...groupByType(items)].reduce(
    (sum, [type, alikeItems]) => sum + alikeItemsBasePremium(type, alikeItems),
    0,
  );

/**
 * Money is always rounded in the MHPCO's favour. Which way that is depends on
 * the direction it flows: a premium is paid *to* the MHPCO, so it rounds up;
 * a payout is paid *by* it, so it rounds down (see `roundPayoutInMHPCOsFavour`).
 */
const roundPremiumInMHPCOsFavour = (premium: number): number => Math.ceil(premium);

/**
 * Applies a surcharge additively rather than as `amount * (1 + rate)`.
 * The multiplicative form introduces IEEE-754 error that `roundInMHPCOsFavour`
 * then amplifies to a whole Gold piece — e.g. `100 * 1.1` is 110.00000000000001,
 * which rounds up to 116 instead of the specified 115. Do not "simplify" this.
 */
const withSurcharge = (amount: number, rate: number): number => amount + amount * rate;

const policyItemSurchargeTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargeTotal(item), 0);

/**
 * Policy-level modifiers, each a signed rate on the policy base premium.
 * Like the item-level surcharges they are independent addends: they do not
 * compound with one another. A discount is simply a negative rate.
 */
type Policy = { items: Item[]; paidOut: number };

type ScenarioState = {
  customer: Customer;
  contractsIssued: number;
  policies: Map<number, Policy>;
};

const POLICY_MODIFIER_RULES: { applies: (state: ScenarioState) => boolean; rate: number }[] = [
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS,
    rate: -LOYALTY_DISCOUNT,
  },
  { applies: ({ contractsIssued }) => contractsIssued > 0, rate: -FOLLOW_UP_DISCOUNT },
];

const policyModifierTotal = (basePremium: number, state: ScenarioState): number =>
  POLICY_MODIFIER_RULES.filter(({ applies }) => applies(state)).reduce(
    (sum, { rate }) => sum + basePremium * rate,
    0,
  );

/**
 * The premium is the policy base premium plus a set of independent addends,
 * each a rate on that same base — they do not compound with one another:
 *
 *   100 base + 50 curse + 30 high ench - 20 loyalty + 10 first insurance = 170, + 5 fee
 *
 * The initial assessment surcharge is expressed via `withSurcharge` (base plus
 * its own rate) rather than as a bare addend, to keep the IEEE-754 behaviour
 * documented there.
 */
const premiumFor = (items: Item[], state: ScenarioState): number => {
  const basePremium = policyBasePremium(items);
  const assessedPremium = withSurcharge(basePremium, INITIAL_ASSESSMENT_SURCHARGE);
  const itemSurcharges = policyItemSurchargeTotal(items);
  const policyModifiers = policyModifierTotal(basePremium, state);

  return roundPremiumInMHPCOsFavour(
    assessedPremium + itemSurcharges + policyModifiers + PROCESSING_FEE,
  );
};

/** The payout half of the rule on `roundPremiumInMHPCOsFavour`: down. */
const roundPayoutInMHPCOsFavour = (payout: number): number => Math.floor(payout);

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

/**
 * Reimbursement clauses, in precedence order: the first one that applies wins.
 * Unlike the premium's surcharges these are alternatives, not addends — a
 * dragon-material item enchanted to 9 is reimbursed at 50 %, not at 150 %.
 *
 * The dragon-material clause is written out even though it currently yields the
 * same rate as the default. It is a distinct rule of the domain — the spec calls
 * it "the only clause that applies" for an unenchanted dragon item, rather than
 * calling it no clause at all — and it merely *coincides* with the default
 * today. Naming it is what makes the precedence above visible: without it there
 * is nothing for the half-reimbursement clause to win against.
 */
const REIMBURSEMENT_CLAUSES: { applies: (item: Item) => boolean; rate: number }[] = [
  {
    applies: (item) => (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL,
    rate: HALF_REIMBURSEMENT,
  },
  { applies: (item) => item.material === DRAGON_MATERIAL, rate: FULL_REIMBURSEMENT },
];

const reimbursementRate = (item: Item): number =>
  REIMBURSEMENT_CLAUSES.find(({ applies }) => applies(item))?.rate ?? FULL_REIMBURSEMENT;

/**
 * The clause applies to the damage amount; the deductible is subtracted
 * afterwards, per damage event — i.e. once per damaged item.
 */
const reimbursedAmount = (item: Item, amount: number): number =>
  amount * reimbursementRate(item);

const damagePayout = (damage: Damage, policy: Policy): number => {
  const item = policy.items.find(({ type }) => type === damage.itemType) as Item;

  return reimbursedAmount(item, damage.amount) - DEDUCTIBLE;
};

/**
 * A claim names the policy it is made against by the step index of the quote
 * that created it. That the policy exists is an *assumption*, not a guarantee.
 *
 * The neighbouring error cases — unknown item, uninsured damage, negative
 * damage — are all now checked, which leaves this the one unguarded gap: a
 * claim naming a step index no quote ever issued. It stays unguarded on
 * purpose. No test covers it (the spec's "item not in the policy" case is a
 * different rule, and `rejectUninsuredDamages` handles it), so a check here
 * would be behaviour no example asked for, with an error message nothing
 * verifies. The assumption is named rather than buried in a bare `as` cast so
 * the gap is visible; when an example arrives, this is the seam to replace.
 */
const assumeIssued = (policy: Policy | undefined): Policy => policy as Policy;

/**
 * Steps are processed in order and later steps depend on earlier ones — a quote
 * issues a contract that discounts every following quote, and a claim is made
 * against a policy an earlier quote created. Every operation therefore has the
 * same shape: it maps the state it is given to the result it reports and the
 * state the next step sees. Neither operation is a pure calculation, and
 * `runStep` below does not need to know which parts of the state each touches.
 */
type Outcome = { result: StepResult; nextState: ScenarioState };

/** A policy is filed under the index of the quote step that issued it. */
const withPolicy = (state: ScenarioState, at: number, policy: Policy): ScenarioState => ({
  ...state,
  policies: new Map(state.policies).set(at, policy),
});

/**
 * The three guards below reject a step before it is priced. They are written as
 * three plain functions rather than as calls to a shared `rejectWhere(xs, fails,
 * message)` helper, which was considered and declined once all three existed:
 *
 * Only two of them actually share the shape that helper would capture.
 * `rejectUnknownItems` and `rejectNegativeDamages` test each element of their
 * input independently and build a message from that element.
 * `rejectUninsuredDamages` does not — it iterates a *derived* tally, compares it
 * against a second derived tally, and its message needs both sides. Its
 * predicate is a function of an aggregate, not of an element, so it can only be
 * forced through the helper by having the caller pre-build both maps, at which
 * point the helper saves nothing and the call site reads worse.
 *
 * What the three share is `forEach` + `if` + `throw` — language grammar, not
 * domain knowledge. They encode three unrelated MHPCO rules; no future change
 * touches more than one of them. DRY protects knowledge with a single point of
 * change, and there is none here. A helper covering two of three would also
 * imply a family rule with an unexplained exception, which reads worse than
 * three functions that are plainly parallel where they can be.
 */

/** The MHPCO insures only what its price list names. */
const rejectUnknownItems = (items: Item[]): void => {
  items.forEach(({ type }) => {
    if (!(type in BASE_PREMIUMS)) {
      throw new Error(`the MHPCO price list does not cover a ${type}`);
    }
  });
};

/** A damage event cannot restore value, so a negative amount is not a claim. */
const rejectNegativeDamages = (damages: Damage[]): void => {
  damages.forEach(({ itemType, amount }) => {
    if (amount < 0) {
      throw new Error(
        `claim reports ${amount} damage to a ${itemType}, but damage cannot be negative`,
      );
    }
  });
};

/**
 * A damage entry names an insured item by type, and each entry is a separate
 * damage event. More entries of a type than the policy covers cannot all refer
 * to insured items, so the whole claim is rejected.
 */
const rejectUninsuredDamages = (damages: Damage[], policy: Policy): void => {
  const insured = countByType(policy.items.map(({ type }) => type));

  countByType(damages.map(({ itemType }) => itemType)).forEach((claimed, type) => {
    const covered = insured.get(type) ?? 0;

    if (claimed > covered) {
      throw new Error(
        `claim covers ${claimed} ${type} damage(s) but the policy insures ${covered}`,
      );
    }
  });
};

/** Issuing a contract discounts every quote that follows it. */
const quote = (step: QuoteStep, state: ScenarioState, index: number): Outcome => {
  rejectUnknownItems(step.items);

  return {
    result: { premium: premiumFor(step.items, state) },
    nextState: withPolicy(
      { ...state, contractsIssued: state.contractsIssued + 1 },
      index,
      { items: step.items, paidOut: 0 },
    ),
  };
};

const claim = (step: ClaimStep, state: ScenarioState): Outcome => {
  const policy = assumeIssued(state.policies.get(step.policy));
  rejectNegativeDamages(step.incident.damages);
  rejectUninsuredDamages(step.incident.damages, policy);

  const cap = CAP_MULTIPLE * insuranceSum(policy.items);
  const desiredPayout = roundPayoutInMHPCOsFavour(
    step.incident.damages.reduce((sum, damage) => sum + damagePayout(damage, policy), 0),
  );
  const payout = Math.min(desiredPayout, cap - policy.paidOut);
  const paidOut = policy.paidOut + payout;

  return {
    result: { payout, remainingCap: cap - paidOut },
    nextState: withPolicy(state, step.policy, { ...policy, paidOut }),
  };
};

const runStep = (step: Step, state: ScenarioState, index: number): Outcome =>
  step.op === "quote" ? quote(step, state, index) : claim(step, state);

export const runScenario = (scenario: Scenario): ScenarioResults => {
  const { results } = scenario.steps.reduce<{
    results: StepResult[];
    state: ScenarioState;
  }>(
    ({ results, state }, step, index) => {
      const { result, nextState } = runStep(step, state, index);

      return { results: [...results, result], state: nextState };
    },
    {
      results: [],
      state: { customer: scenario.customer, contractsIssued: 0, policies: new Map() },
    },
  );

  return { results };
};
