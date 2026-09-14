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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
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
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const ENCHANTMENT_SURCHARGE_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

/** What the MHPCO knows about a kind of item it will insure: what insuring
 *  one costs (`basePremium`), and what one is insured FOR (`insuranceValue`,
 *  from which the cap is derived — never from premiums). One entry per kind,
 *  so the two figures for a kind cannot drift apart. */
interface ItemKind {
  basePremium: number;
  insuranceValue: number;
}

/** The MHPCO's price list. */
const ITEM_KINDS: Record<string, ItemKind> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

/** The price list entry for a type. The MHPCO insures only what its price
 *  list names, so an unlisted type is rejected rather than priced. */
const itemKindOf = (type: string): ItemKind => {
  const kind = ITEM_KINDS[type];
  if (kind === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return kind;
};

/** What insuring this item costs, before any modifier. */
const basePremiumOf = (item: Item): number => itemKindOf(item.type).basePremium;

/** What this item is insured FOR — the figure the cap derives from. Unmodified
 *  by anything that moves the premium: a curse costs more to insure without
 *  making the sword worth more. */
const insuranceValueOf = (item: Item): number =>
  itemKindOf(item.type).insuranceValue;

const DEDUCTIBLE_PER_DAMAGED_ITEM = 100;
const CAP_MULTIPLE = 2;

/** The enchantment level from which a CLAIM is only half reimbursed. A claim
 *  rule, unrelated to ENCHANTMENT_SURCHARGE_LEVEL, which gates a premium
 *  surcharge — the two thresholds differ and move independently. */
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_PERCENT = 50;

/** Modifiers are expressed as an amount to add, never as a factor to multiply
 *  by, so that they stay additive against their base and so that the integer
 *  numerator keeps float artifacts out of the final rounding
 *  (100 * 1.1 === 110.000…1, but (100 * 10) / 100 === 10 exactly). */
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

/** Rounds up — premiums round in the MHPCO's favour. */
const roundPremium = (amount: number): number => Math.ceil(amount);

/** Rounds down — payouts, too, round in the MHPCO's favour. */
const roundPayout = (amount: number): number => Math.floor(amount);

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

/** How many of each kind, for whatever "kind" means to the caller. Quotes
 *  tally insured items by their type; claims tally damage entries by the type
 *  they name — one notion of counting, two things counted. */
const countBy = <T>(values: T[], keyOf: (value: T) => string) => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const typeOfItem = (item: Item): string => item.type;
const typeOfDamage = (damage: Damage): string => damage.itemType;

/** A block is exactly three alike components, priced as a unit rather than
 *  per item. Larger counts do not decompose into blocks: 7 runes cost 7 × 25. */
const componentGroupBasePremium = ([type, count]: [string, number]): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * itemKindOf(type).basePremium;

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

const policyBasePremium = (items: Item[]): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const componentGroups = [...countBy(items.filter(isComponent), typeOfItem)];

  return (
    sum(mainItems.map(basePremiumOf)) +
    sum(componentGroups.map(componentGroupBasePremium))
  );
};

interface ItemModifierRule {
  appliesTo: (item: Item) => boolean;
  percent: number;
}

/** Every item-scoped modifier, as a rule that either applies to an item or
 *  does not. Applicable rules stack. */
const ITEM_MODIFIER_RULES: ItemModifierRule[] = [
  {
    appliesTo: (item) => item.cursed === true,
    percent: CURSE_SURCHARGE_PERCENT,
  },
  {
    appliesTo: (item) => (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_LEVEL,
    percent: ENCHANTMENT_SURCHARGE_PERCENT,
  },
];

/** Item-scoped modifiers apply to the affected item's own base premium,
 *  not to the policy total. */
const itemModifierAmount = (item: Item): number =>
  sum(
    ITEM_MODIFIER_RULES.filter((rule) => rule.appliesTo(item)).map((rule) =>
      percentOf(basePremiumOf(item), rule.percent),
    ),
  );

/** A policy written by a quote step, as later claim steps see it. The insured
 *  items are kept because a damage entry names only a type, while the clauses
 *  that govern its reimbursement depend on the insured item itself. */
interface Policy {
  remainingCap: number;
  items: Item[];
}

/** What a step leaves behind for the steps after it. Steps are not
 *  independent: a quote is priced against how many contracts precede it, and
 *  a claim is paid against a policy an earlier quote wrote, so running a
 *  scenario threads this state from each step to the next. */
interface ScenarioState {
  customer: Customer;
  precedingContracts: number;
  /** Keyed by the zero-based index of the quote step that wrote the policy —
   *  which is what a claim step's `policy` field refers to. */
  policiesByStep: Record<number, Policy>;
}

const initialState = (customer: Customer): ScenarioState => ({
  customer,
  precedingContracts: 0,
  policiesByStep: {},
});

/** A step's outcome: what it reports, and the state the next step sees. */
interface StepOutcome {
  result: StepResult;
  state: ScenarioState;
}

/** What a policy-wide rule may look at: the customer, plus where this quote
 *  sits in the customer's history of contracts. A pricing view of the
 *  scenario state — rules read it, they never advance it. */
type PolicyContext = Readonly<ScenarioState>;

interface PolicyModifierRule {
  appliesTo: (context: PolicyContext) => boolean;
  /** Signed: positive surcharges, negative discounts. */
  percent: number;
}

/** Every policy-wide modifier, as a rule that either applies to a policy or
 *  does not. Applicable rules stack. */
const POLICY_MODIFIER_RULES: PolicyModifierRule[] = [
  {
    appliesTo: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS,
    percent: -LOYALTY_DISCOUNT_PERCENT,
  },
  {
    appliesTo: () => true,
    percent: FIRST_INSURANCE_SURCHARGE_PERCENT,
  },
  {
    appliesTo: ({ precedingContracts }) => precedingContracts > 0,
    percent: -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT,
  },
];

/** Policy-wide modifiers apply to the policy base premium — the sum of every
 *  item's base premium — not to any single item. */
const policyModifierAmount = (
  basePremium: number,
  context: PolicyContext,
): number =>
  sum(
    POLICY_MODIFIER_RULES.filter((rule) => rule.appliesTo(context)).map(
      (rule) => percentOf(basePremium, rule.percent),
    ),
  );

const quote = (items: Item[], context: PolicyContext): QuoteResult => {
  const basePremium = policyBasePremium(items);
  // Every modifier is an amount added to the base premium, not a factor
  // compounded onto a running total: item-scoped modifiers take a percentage
  // of their own item's base premium, policy-wide ones take a percentage of
  // the policy base premium.
  const modifierAmounts = [
    ...items.map(itemModifierAmount),
    policyModifierAmount(basePremium, context),
  ];
  // The processing fee is added last, after all percentage modifiers.
  const premium = basePremium + sum(modifierAmounts) + PROCESSING_FEE;
  return { premium: roundPremium(premium) };
};

/** The cap on everything a policy will ever pay out: twice the sum of the
 *  insured items' values. Premium modifiers do not raise it. */
const policyCap = (items: Item[]): number =>
  CAP_MULTIPLE * sum(items.map(insuranceValueOf));

/** What one damage entry reimburses before the deductible: the full damage,
 *  unless a special clause reduces it. */
const reimbursableAmount = (damage: Damage, insuredItem: Item): number =>
  (insuredItem.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? percentOf(damage.amount, HALF_REIMBURSEMENT_PERCENT)
    : damage.amount;

/** The insured item a damage entry refers to. A damage entry names only a
 *  type, while the clauses governing its reimbursement depend on the item.
 *  The MHPCO pays only for what it insured, so a damage entry naming a type
 *  the policy does not cover is rejected rather than reimbursed. */
const insuredItemFor = (damage: Damage, policy: Policy): Item => {
  const insuredItem = policy.items.find(
    (item) => item.type === damage.itemType,
  );
  if (insuredItem === undefined) {
    throw new Error(`damaged item is not insured: ${damage.itemType}`);
  }
  return insuredItem;
};

/** A damage entry states what an incident cost. An amount below zero states
 *  that the incident paid the claimant, which is not a thing an incident can
 *  do — so it is rejected as malformed rather than reimbursed. Zero is a
 *  well-formed claim for nothing, and passes. */
const rejectNegativeDamageAmount = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
};

/** What one damage entry claims: the reimbursable amount, less the deductible
 *  that is charged once per damaged item. Not yet what the policy pays — the
 *  cap applies to the incident total, not to any single entry, and rounding
 *  comes later still, so this figure stays fractional. */
const claimedForDamage = (damage: Damage, policy: Policy): number => {
  rejectNegativeDamageAmount(damage);
  return (
    reimbursableAmount(damage, insuredItemFor(damage, policy)) -
    DEDUCTIBLE_PER_DAMAGED_ITEM
  );
};

/** The state that results from recording one policy against a step index,
 *  replacing any policy already recorded there. */
const withPolicy = (
  state: ScenarioState,
  stepIndex: number,
  policy: Policy,
): ScenarioState => ({
  ...state,
  policiesByStep: { ...state.policiesByStep, [stepIndex]: policy },
});

/** Writes a policy, and records it so later claim steps can be paid against
 *  it. Each quote written also becomes a preceding contract for the next. */
const runQuote = (
  step: QuoteStep,
  stepIndex: number,
  state: ScenarioState,
): StepOutcome => ({
  result: quote(step.items, state),
  state: withPolicy(
    { ...state, precedingContracts: state.precedingContracts + 1 },
    stepIndex,
    { remainingCap: policyCap(step.items), items: step.items },
  ),
});

/** The MHPCO insures items, not types: a policy covering one sword answers
 *  for one damaged sword. More entries of a type than the policy covers
 *  rejects the whole claim, not merely the surplus entry. */
const rejectMoreDamagesThanInsuredItems = (
  damages: Damage[],
  policy: Policy,
): void => {
  const insuredCounts = countBy(policy.items, typeOfItem);
  const overclaimed = [...countBy(damages, typeOfDamage)].find(
    ([type, claimed]) => claimed > (insuredCounts.get(type) ?? 0),
  );
  if (overclaimed !== undefined) {
    const [overclaimedType] = overclaimed;
    throw new Error(
      `more damage entries than insured items of type: ${overclaimedType}`,
    );
  }
};

/** What an incident claims in total, before the policy's cap is applied:
 *  every damage entry reimbursed on its own terms, less its own deductible. */
const claimedAmount = (damages: Damage[], policy: Policy): number => {
  rejectMoreDamagesThanInsuredItems(damages, policy);
  return sum(damages.map((damage) => claimedForDamage(damage, policy)));
};

/** A policy never pays out more than the cap it has left, so a claim that
 *  exhausts the cap is paid down to it rather than past it. */
const paidWithinCap = (claimed: number, remainingCap: number): number =>
  Math.min(claimed, remainingCap);

/** What a policy actually hands over for one incident: what the incident
 *  claims, held to what the cap has left, and only then rounded. Rounding
 *  last is what keeps the intermediates fractional — a half-reimbursed
 *  damage stays at 450.5 until the whole payout is settled. */
const payoutFor = (damages: Damage[], policy: Policy): number =>
  roundPayout(
    paidWithinCap(claimedAmount(damages, policy), policy.remainingCap),
  );

/** The policy a claim step is claiming against. A claim names a policy by the
 *  index of the quote step that wrote it, so an index no quote step wrote — or
 *  one naming a later step, or another claim — has no policy to pay from and
 *  is rejected rather than dereferenced. */
const policyClaimedAgainst = (
  step: ClaimStep,
  state: ScenarioState,
): Policy => {
  const policy = state.policiesByStep[step.policy];
  if (policy === undefined) {
    throw new Error(`no policy written by step: ${step.policy}`);
  }
  return policy;
};

/** Pays a claim against the policy an earlier quote step wrote, drawing the
 *  payout down from that policy's remaining cap. */
const runClaim = (step: ClaimStep, state: ScenarioState): StepOutcome => {
  const policy = policyClaimedAgainst(step, state);
  const payout = payoutFor(step.incident.damages, policy);
  const remainingCap = policy.remainingCap - payout;
  return {
    result: { payout, remainingCap },
    state: withPolicy(state, step.policy, { ...policy, remainingCap }),
  };
};

const runStep = (
  step: Step,
  stepIndex: number,
  state: ScenarioState,
): StepOutcome =>
  step.op === "quote"
    ? runQuote(step, stepIndex, state)
    : runClaim(step, state);

/** Runs every step in order, threading the state each one leaves behind into
 *  the next, and reports one result per step. Steps are run for their results
 *  AND for their effect on the steps after them, so this is a sequence rather
 *  than a mapping: a quote counts towards later quotes' follow-up discount and
 *  writes the policy later claims draw down. */
export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  let state = initialState(scenario.customer);

  for (const [stepIndex, step] of scenario.steps.entries()) {
    const outcome = runStep(step, stepIndex, state);
    results.push(outcome.result);
    state = outcome.state;
  }

  return { results };
};
