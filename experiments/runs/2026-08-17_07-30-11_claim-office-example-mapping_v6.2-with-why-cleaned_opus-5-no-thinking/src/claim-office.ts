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

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

/**
 * Added at the very end of every premium, after all percentage modifiers, so
 * no surcharge or discount is ever computed on top of it.
 */
const PROCESSING_FEE = 5;

/**
 * Every rate in this file is written as a whole number of percent, so this is
 * the denominator that turns one back into a fraction of an amount.
 */
const PER_CENT = 100;

/**
 * Rates are kept as exact numerator/denominator fractions rather than float
 * multipliers (10 / 100, never 1.1) so intermediate amounts stay exact and
 * only the final premium is rounded. Multiplying before dividing is what keeps
 * them exact — (amount * rate) / 100, never amount * (rate / 100).
 */
const percent = (amount: number, rate: number): number =>
  (amount * rate) / PER_CENT;

/**
 * Both roundings go the MHPCO's way, and both are applied once, at the very end
 * of a calculation — never to an intermediate amount. The two are stated here as
 * a pair because that is the rule: it is one policy with two directions, and
 * which direction applies follows from who pays.
 */
const roundedUpForWhatTheCustomerPays = Math.ceil;
const roundedDownForWhatTheMHPCOPays = Math.floor;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
/**
 * Enchantment is read by two unrelated rules with different cut-offs: this one
 * charges a premium surcharge from 5 up, and REDUCED_REIMBURSEMENT_THRESHOLD
 * halves a claim from 8 up. Each threshold is named after the rule it gates so
 * the two cannot be mistaken for one shared notion of "highly enchanted".
 */
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

/**
 * Everything the pricing rules need to know about an item type lives here, so
 * that "what is a rune?" has a single answer. Components are the small parts
 * (runes, moonstones) that can be bought as a building block; main items
 * (swords, amulets, ...) never form a block.
 */
const ITEM_TYPES: Record<
  string,
  { unitPremium: number; insuranceValue: number; isComponent: boolean }
> = {
  sword: { unitPremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { unitPremium: 60, insuranceValue: 600, isComponent: false },
  staff: { unitPremium: 80, insuranceValue: 800, isComponent: false },
  potion: { unitPremium: 40, insuranceValue: 400, isComponent: false },
  rune: { unitPremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { unitPremium: 25, insuranceValue: 250, isComponent: true },
};

/**
 * The single gate onto ITEM_TYPES, so that an item the MHPCO does not insure is
 * refused by name rather than surfacing as a stray TypeError somewhere downstream.
 */
const itemTypeOf = (type: string): (typeof ITEM_TYPES)[string] => {
  const itemType = ITEM_TYPES[type];
  if (itemType === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return itemType;
};

/** A building block of 3 alike components is offered at this base premium. */
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

/**
 * Tallies how often each value occurs, e.g. ["rune", "rune"] → [["rune", 2]].
 *
 * Takes plain strings rather than items because both callers are counting a
 * type name, but reach it by different routes: a quote counts `item.type`, a
 * claim counts `damage.itemType`. Each caller projects its own key and this
 * stays ignorant of what the strings denote.
 */
const tally = (values: string[]): [string, number][] => {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts];
};

/**
 * The two projections `tally` is fed. Named as a pair because their results are
 * compared against each other: a claim is covered when the damaged type names
 * line up with the insured ones, and that comparison only reads as a comparison
 * if both sides are reached the same way.
 */
const typesOf = (items: Item[]): string[] => items.map((item) => item.type);

const damagedTypesOf = (damages: Damage[]): string[] =>
  damages.map((damage) => damage.itemType);

/**
 * Prices every item of one type together, because exactly 3 alike components
 * form a block charged as one. "Alike" means the same type, and the block does
 * not repeat: 4 or 7 runes are each priced per item.
 */
const basePremiumForType = (type: string, count: number): number => {
  const { unitPremium, isComponent } = itemTypeOf(type);
  return isComponent && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * unitPremium;
};

const sumOfBasePremiums = (items: Item[]): number =>
  tally(typesOf(items)).reduce(
    (sum, [type, count]) => sum + basePremiumForType(type, count),
    0,
  );

/**
 * A rule whose rate is ADDED to those of every other matching rule. Read with
 * filter+reduce: matching several rules charges for each.
 *
 * Distinct from ExclusiveRule<T> below, which has the same {appliesTo, rate}
 * shape but the opposite semantics. The two are separate named types rather
 * than one shared shape so that the reader — and the compiler — cannot mistake
 * a stacking table for a first-match-wins one.
 */
interface StackingRule<T> {
  appliesTo: (subject: T) => boolean;
  rate: number;
}

/**
 * What a stacking table charges against a base amount: every matching rule
 * contributes, so the rates add up rather than compete. This is the one place
 * the filter+reduce reading of StackingRule is performed — item surcharges and
 * policy adjustments are both this same idea, differing only in which table
 * they consult and what their percentages are taken of.
 */
const sumOfMatchingRates = <T>(
  rules: StackingRule<T>[],
  subject: T,
  base: number,
): number =>
  rules
    .filter(({ appliesTo }) => appliesTo(subject))
    .reduce((sum, { rate }) => sum + percent(base, rate), 0);

/**
 * A rule that is an ALTERNATIVE to the others: the first match wins and the
 * rest are skipped. Read with find. Order is therefore meaningful — it encodes
 * precedence, and reordering the table changes results.
 */
interface ExclusiveRule<T> {
  appliesTo: (subject: T) => boolean;
  rate: number;
}

/**
 * Item-specific modifiers: each applies to one item and is charged as a
 * percentage of THAT item's unit premium, never of the policy total.
 * They stack — an item matching several rules is charged for each.
 *
 * Unit premium, not the item's share of the policy base: the two differ only
 * for components inside a block of 3 (billed 60 G for three 25 G runes), and
 * no test pins down a surcharged component yet. Revisit when one does.
 */
const ITEM_MODIFIERS: StackingRule<Item>[] = [
  { appliesTo: (item) => item.cursed === true, rate: CURSE_SURCHARGE_PERCENT },
  {
    appliesTo: (item) =>
      (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  },
];

const surchargeForItem = (item: Item): number =>
  sumOfMatchingRates(ITEM_MODIFIERS, item, itemTypeOf(item.type).unitPremium);

const sumOfItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargeForItem(item), 0);

/**
 * Policy-wide modifiers: each is charged as a percentage of the POLICY BASE
 * premium (the sum of item base premiums, before any item surcharge), so no
 * modifier is ever computed on top of another. Discounts carry a negative rate.
 */
interface PolicyContext {
  customer: Customer;
  /** Quotes already issued to this customer earlier in the scenario. */
  previousContracts: number;
}

const POLICY_MODIFIERS: StackingRule<PolicyContext>[] = [
  // Always applies: every item in a quote is treated as a first insurance,
  // regardless of how long the customer has been with the MHPCO.
  { appliesTo: () => true, rate: FIRST_INSURANCE_SURCHARGE_PERCENT },
  {
    // Negative rate: a discount is just a surcharge pointing the other way, so
    // it needs no separate code path and cannot stack onto another modifier.
    appliesTo: ({ customer }) =>
      customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    rate: -LOYALTY_DISCOUNT_PERCENT,
  },
  {
    appliesTo: ({ previousContracts }) => previousContracts >= 1,
    rate: -FOLLOW_UP_DISCOUNT_PERCENT,
  },
];

const sumOfPolicyAdjustments = (
  context: PolicyContext,
  policyBasePremium: number,
): number =>
  sumOfMatchingRates(POLICY_MODIFIERS, context, policyBasePremium);

const premiumFor = (context: PolicyContext, items: Item[]): number => {
  const policyBasePremium = sumOfBasePremiums(items);
  return roundedUpForWhatTheCustomerPays(
    policyBasePremium +
      sumOfItemSurcharges(items) +
      sumOfPolicyAdjustments(context, policyBasePremium) +
      PROCESSING_FEE,
  );
};

/** A policy created by a quote step, tracked so later claims can draw on it. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemTypeOf(item.type).insuranceValue, 0);

const REDUCED_REIMBURSEMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

/** Reimbursed in full when no clause below claims the item. */
const FULL_REIMBURSEMENT_PERCENT = 100;
const DRAGON_MATERIAL = "dragon";

/**
 * Clauses that change how much of a damage is reimbursed. Exclusive and ordered
 * by precedence, because clauses overlap (a highly enchanted dragon-material
 * item matches more than one) and they are alternatives — unlike the stacking
 * ITEM_MODIFIERS, which the {appliesTo, rate} shape would otherwise suggest.
 */
const REIMBURSEMENT_CLAUSES: ExclusiveRule<Item>[] = [
  {
    appliesTo: (item) =>
      (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_THRESHOLD,
    rate: REDUCED_REIMBURSEMENT_PERCENT,
  },
  // Listed after the clause above so that a highly enchanted dragon item is
  // still reimbursed at 50 %. This entry yields exactly what the no-clause
  // default yields, so removing it would not change any current result — it is
  // here because the spec states dragon material as a rule, and because the
  // ordering is what makes the 50 % rule win.
  {
    appliesTo: (item) => item.material === DRAGON_MATERIAL,
    rate: FULL_REIMBURSEMENT_PERCENT,
  },
];

const reimbursementRateFor = (item: Item): number =>
  REIMBURSEMENT_CLAUSES.find(({ appliesTo }) => appliesTo(item))?.rate ??
  FULL_REIMBURSEMENT_PERCENT;

/**
 * The one phrasing of "the policy does not cover that". Both the whole-claim
 * check and the per-damage lookup below can raise it, so the wording lives in
 * one place rather than being written out at each site.
 *
 * A damage naming a type the MHPCO does not insure at all is this same refusal:
 * it is not in the policy either, so it needs no rule of its own.
 */
const notCoveredByPolicy = (itemType: string): Error =>
  new Error(`damaged item is not covered by the policy: ${itemType}`);

/**
 * Which insured item a damage entry is about. The counterpart to itemTypeOf:
 * both resolve a name to the thing it denotes.
 *
 * The not-found branch is unreachable for any damage that got past
 * assertDamagesAreCovered, which rejects uncovered types before a payout is
 * computed. It stays because `find` returns `Item | undefined` and the type has
 * to be honoured — but the rule it enforces is stated there, not here, so this
 * reuses that refusal instead of restating it.
 */
const insuredItemFor = (damage: Damage, insuredItems: Item[]): Item => {
  const insuredItem = insuredItems.find(
    (item) => item.type === damage.itemType,
  );
  if (insuredItem === undefined) {
    throw notCoveredByPolicy(damage.itemType);
  }
  return insuredItem;
};

/**
 * The clause is applied to the damage first; the deductible comes off whatever
 * the clause leaves.
 *
 * Takes the already-resolved item, so this is pure arithmetic over a damage and
 * the item it hit — mirroring basePremiumForType, which likewise prices an
 * already-resolved type rather than doing its own lookup.
 */
const payoutForDamage = (damage: Damage, damagedItem: Item): number =>
  percent(damage.amount, reimbursementRateFor(damagedItem)) -
  DEDUCTIBLE_PER_DAMAGE;

/**
 * The contract a quote step issues: what it covers, and how much of its cap is
 * still available to later claims.
 */
const policyFor = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSumOf(items),
});

/**
 * What an incident is worth against a policy, as a pure calculation: each
 * damage is settled on its own (own clause, own deductible) and the results are
 * added up. Drawing this down from the policy's cap is the caller's job.
 */
const payoutForIncident = (
  incident: ClaimStep["incident"],
  insuredItems: Item[],
): number =>
  incident.damages.reduce(
    (sum, damage) =>
      sum + payoutForDamage(damage, insuredItemFor(damage, insuredItems)),
    0,
  );

/**
 * A policy covering one sword cannot answer for two damaged swords. Checked
 * before anything is paid, because the whole claim is rejected rather than
 * settled as far as the cover reaches.
 */
const assertDamagesAreCovered = (
  damages: Damage[],
  insuredItems: Item[],
): void => {
  const insuredCounts = new Map(tally(typesOf(insuredItems)));
  for (const [itemType, damaged] of tally(damagedTypesOf(damages))) {
    const insured = insuredCounts.get(itemType) ?? 0;
    if (insured === 0) {
      throw notCoveredByPolicy(itemType);
    }
    if (damaged > insured) {
      throw new Error(`more ${itemType} damages than the policy covers`);
    }
  }
};

/**
 * A negative damage would be a negative payout, which the drawdown would then
 * SUBTRACT from the remaining cap — letting a claim enlarge the very cover it
 * draws on. Refused outright rather than clamped to zero.
 *
 * Not-negative rather than strictly positive: a zero damage is harmless — it
 * pays nothing and moves no cap — so there is no rule to enforce against it.
 */
const assertDamageAmountsAreNotNegative = (damages: Damage[]): void => {
  for (const { amount } of damages) {
    if (amount < 0) {
      throw new Error(`negative damage amount: ${amount}`);
    }
  }
};

/**
 * Settles an incident against a policy and draws the payout down from its cap.
 * Mutates the policy, because what this claim consumes has to be visible to
 * every later claim on the same one.
 *
 * Both assertions run before any payout is computed, because a bad claim is
 * refused whole rather than settled as far as it is valid.
 *
 * The cap is a ceiling, not just a running total: once it is exhausted a claim
 * is paid only what is left of it. Rounding happens once, here, after the clamp
 * — so per-damage amounts stay fractional (a multi-item incident is not rounded
 * once per damage) and the cap stays whole.
 */
const settleClaim = (
  policy: Policy,
  incident: ClaimStep["incident"],
): StepResult => {
  assertDamageAmountsAreNotNegative(incident.damages);
  assertDamagesAreCovered(incident.damages, policy.items);
  const payout = roundedDownForWhatTheMHPCOPays(
    Math.min(payoutForIncident(incident, policy.items), policy.remainingCap),
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

/**
 * Steps are executed in order because a step's result can depend on the ones
 * before it: the count of contracts already issued decides the follow-up
 * discount, and the policies a quote registers are what later claims draw on.
 */
export const runScenario = (scenario: Scenario): ScenarioResult => {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      // Unguarded: no test yet describes a claim naming a policy that was never
      // quoted. The "claim references an item/policy not in the policy" test
      // will force this honest.
      const policy = policies.get(step.policy) as Policy;
      return settleClaim(policy, step.incident);
    }

    const premium = premiumFor(
      { customer: scenario.customer, previousContracts },
      step.items,
    );
    policies.set(index, policyFor(step.items));
    // Counted after pricing, so a quote never discounts itself, and only for
    // quotes, because a claim does not issue a contract.
    previousContracts += 1;
    return { premium };
  });
  return { results };
};
