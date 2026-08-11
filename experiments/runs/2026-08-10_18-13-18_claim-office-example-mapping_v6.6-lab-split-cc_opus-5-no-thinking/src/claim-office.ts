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
  damages: Damage[];
};

/**
 * One type covers both ops, so items/policy/incident are all optional. A
 * discriminated union on `op` would express this better, but the spec's
 * scenarios are plain object literals whose `op` widens to `string` and so
 * would no longer typecheck against literal `"quote"` / `"claim"` variants.
 * Revisit if a scenario parser ever narrows `op` on the way in.
 */
export type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };

export type ScenarioResult = {
  results: (QuoteResult | ClaimResult)[];
};

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
/**
 * Deliberately NOT derived from the base premiums, though every entry today
 * happens to be 10x its counterpart. The MHPCO publishes two independent
 * price lists ("Sword: 1000 G insurance value, 100 G base premium"), and the
 * rules already pull them apart: the 3-alike building block cuts the base
 * premium to 60 G while the insurance value stays 250 G per component. Making
 * one a function of the other would encode a coincidence as a rule.
 *
 * A test now guards this — "caps a policy covering a sword and 3 runes at
 * 3500 G". Deriving these values from the base premiums, or routing both
 * through a shared summing helper, makes the block rule reach the insurance
 * sum and yields a cap of 2120 instead of 3500.
 */
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_PERCENT = 50;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOWUP_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;

/**
 * Not a tunable constant — this is what "per cent" means. It is named only
 * because the divisor reads as a bare literal otherwise; nothing should ever
 * change it.
 */
const PERCENT_DIVISOR = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_DIVISOR;

/**
 * A modifier's percentage when its condition holds, and nothing when it does
 * not. Both the item-specific surcharges and the policy-wide adjustments are
 * built by summing modifiers that either apply in full or not at all, so the
 * "or contribute zero" half is stated once here rather than at each of the four
 * places that would otherwise spell out the same ternary.
 */
const percentWhen = (applies: boolean, percent: number): number =>
  applies ? percent : 0;

/**
 * The MHPCO insures only what is on its price list. Looking a type up through
 * here rather than indexing a table directly means an unknown type cannot slip
 * through as `undefined` and surface later as a NaN premium.
 */
const priceOf = (
  priceList: Record<string, number>,
  itemType: string,
): number => {
  const price = priceList[itemType];
  if (price === undefined) {
    throw new Error(`unknown item type: ${itemType}`);
  }
  return price;
};

/**
 * Premiums round UP — the MHPCO's favour on money coming IN. Payouts will need
 * the opposite direction, so this deliberately names the premium case only
 * rather than a general "in the MHPCO's favour" rounding.
 */
const roundPremiumUp = (premium: number): number => Math.ceil(premium);

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/**
 * How many of a key a tally holds. A key the tally never saw is 0, not
 * missing — that is what counting means, and saying so here keeps every reader
 * of a tally from restating the same default.
 */
const tallyFor = (counts: Map<string, number>, key: string): number =>
  counts.get(key) ?? 0;

/**
 * Tallies how often each key occurs. Shared by the two things the MHPCO counts
 * by type — the items ON a policy and the damages claimed AGAINST it — which
 * are different domain concepts over different shapes, but genuinely the same
 * counting. The key is supplied by the caller precisely so neither concept has
 * to borrow the other's field name.
 */
const countByKey = <T>(
  values: T[],
  keyOf: (value: T) => string,
): Map<string, number> =>
  values.reduce((counts, value) => {
    const key = keyOf(value);
    return counts.set(key, tallyFor(counts, key) + 1);
  }, new Map<string, number>());

/** Counts of items of the same type — "alike" in the MHPCO's terms. */
const countAlikeItems = (items: Item[]): Map<string, number> =>
  countByKey(items, (item) => item.type);

const formsBuildingBlock = (count: number): boolean => count === BLOCK_SIZE;

const basePremiumForAlikeItems = (type: string, count: number): number =>
  formsBuildingBlock(count)
    ? BLOCK_BASE_PREMIUM
    : count * priceOf(BASE_PREMIUM_BY_ITEM_TYPE, type);

const policyBasePremium = (items: Item[]): number =>
  [...countAlikeItems(items)].reduce(
    (total, [type, count]) => total + basePremiumForAlikeItems(type, count),
    0,
  );

const itemBasePremium = (item: Item): number =>
  priceOf(BASE_PREMIUM_BY_ITEM_TYPE, item.type);

/**
 * An absent `enchantment` reads as 0 — a plain rune is not enchanted at all.
 * The threshold is a parameter because the MHPCO sets two different bars: 5
 * for the premium surcharge, 8 for the payout clause.
 */
const enchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);

/** Item-specific surcharges stack additively. */
const itemSurchargePercent = (item: Item): number =>
  percentWhen(item.cursed === true, CURSE_SURCHARGE_PERCENT) +
  percentWhen(isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE_PERCENT);

/**
 * Item-specific modifiers are percentages of the AFFECTED ITEM's own base
 * premium — unlike policy-wide modifiers, which apply to the policy base.
 */
const totalItemSurcharges = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + percentOf(itemBasePremium(item), itemSurchargePercent(item)),
    0,
  );

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

/**
 * The net of all policy-wide percentages. Policy-wide modifiers are
 * percentages of the POLICY base premium — unlike item-specific modifiers,
 * which apply to the affected item's own base. The net is negative when the
 * discounts outweigh the surcharges: a long-standing customer nets -10 %.
 */
const netPolicyAdjustmentPercent = (
  customer: Customer,
  precedingSteps: number,
): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENT -
  percentWhen(isLongStanding(customer), LOYALTY_DISCOUNT_PERCENT) -
  // The follow-up discount is owed on every quote after the customer's FIRST
  // QUOTE, but what we have here is a count of preceding STEPS. The two
  // coincide only because every step exercised so far is a quote; once claim
  // steps arrive, [quote, claim, quote] will wrongly discount the third step
  // as a second follow-up. No test forces the distinction yet.
  percentWhen(precedingSteps > 0, FOLLOWUP_DISCOUNT_PERCENT);

const policyAdjustment = (
  policyBase: number,
  customer: Customer,
  precedingSteps: number,
): number =>
  percentOf(policyBase, netPolicyAdjustmentPercent(customer, precedingSteps));

const quotePremium = (
  items: Item[],
  customer: Customer,
  precedingSteps: number,
): number => {
  const basePremium = policyBasePremium(items);
  return roundPremiumUp(
    basePremium +
      totalItemSurcharges(items) +
      policyAdjustment(basePremium, customer, precedingSteps) +
      PROCESSING_FEE,
  );
};

const roundPayoutDown = (payout: number): number => Math.floor(payout);

/**
 * Goes through `priceOf` for the same reason the premium side does: an unknown
 * type would otherwise index to `undefined` and sum to a NaN cap, which
 * `Math.min` would carry into a NaN payout instead of an error. This is a
 * guarded lookup, not a derivation — the two price lists stay independent.
 */
const insuranceSum = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + priceOf(INSURANCE_VALUE_BY_ITEM_TYPE, item.type),
    0,
  );

/**
 * The MHPCO settles damage only to what it insures. Throwing here rather than
 * returning undefined means an uninsured item cannot be quietly paid out.
 *
 * ONE check covers both halves of the spec's error bullet, and two tests now
 * hold it there: "rejects a claim whose damage references an item not covered
 * by the policy" (amulet damage against a sword-only policy) and "rejects a
 * claim whose damage references an unknown item type" (broomstick). The second
 * needed no code — an unknown type is a strict subset of "not among the
 * policy's items", since nothing unknown can be on a policy in the first place;
 * a quote naming one is rejected by `priceOf` before any claim can reference it.
 *
 * Do NOT route this through `priceOf` to unify the two "unknown item" errors.
 * The domains differ: an amulet is a perfectly KNOWN type, so `priceOf` would
 * return 600 and the uninsured-amulet claim would silently pay out. Membership
 * in this policy, not membership on the price list, is the question here.
 */
const damagedItem = (damage: Damage, policyItems: Item[]): Item => {
  const item = policyItems.find((it) => it.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`item not covered by the policy: ${damage.itemType}`);
  }
  return item;
};

/**
 * What the MHPCO reimburses for ONE damaged item, before the deductible.
 * Highly enchanted items are reimbursed at half the damage amount.
 *
 * NOT A BUG: the spec's "dragon material is fully reimbursed" clause is
 * deliberately absent, because no example can observe it. Full reimbursement is
 * already what happens when no clause fires, so below enchantment 8 a dragon
 * item is indistinguishable from a steel one; at enchantment >= 8 the spec says
 * the 50 % rule wins, so dragon is indistinguishable again. The clause has no
 * input that would change an output — adding it would be unfalsifiable by the
 * suite. Both dragon tests below pass against this code for exactly the reasons
 * their comments state. If a future rule ever makes material observable (say, a
 * dragon-only exemption from the deductible, or a clause the 50 % rule does not
 * override), add it then, driven by that example.
 *
 * The enchantment is read from the FIRST policy item of the damaged type — see
 * `damagedItem`, which throws if the policy covers no such type at all. Since
 * `rejectSurplusDamages` now bounds the damages of a type by the number
 * insured, the remaining gap is narrow: a policy holding alike items that
 * DIFFER in enchantment, damaged within that count, reimburses every one of
 * them at the first item's enchantment. Two enchantment-9 swords are settled
 * correctly; an enchantment-9 and an enchantment-3 sword are not. Pairing each
 * damage with a distinct item needs an example that says which one a claim
 * refers to, and the spec's damages name only a type.
 */
const reimbursementFor = (damage: Damage, policyItems: Item[]): number =>
  enchantmentAtLeast(
    damagedItem(damage, policyItems),
    HIGH_ENCHANTMENT_PAYOUT_THRESHOLD,
  )
    ? percentOf(damage.amount, HIGH_ENCHANTMENT_PAYOUT_PERCENT)
    : damage.amount;

/**
 * One damaged item's contribution to the payout. The deductible comes off ONCE
 * PER DAMAGED ITEM, not once per incident — expressing it at the level of a
 * single damage is what makes that per-item scope structural rather than a
 * remark about where a subtraction happens to sit.
 */
const payoutForDamage = (damage: Damage, policyItems: Item[]): number =>
  reimbursementFor(damage, policyItems) - DEDUCTIBLE;

/**
 * The MHPCO will not pay twice for one insured item. Two sword damages against
 * a single insured sword is a malformed claim, not a double loss — and the
 * spec rejects the WHOLE claim rather than dropping the surplus entry, so this
 * is checked up front for the entire incident before anything is paid.
 */
const rejectSurplusDamages = (
  incident: Incident,
  policyItems: Item[],
): void => {
  const covered = countAlikeItems(policyItems);
  const claimed = countByKey(incident.damages, (damage) => damage.itemType);

  for (const [itemType, count] of claimed) {
    if (count > tallyFor(covered, itemType)) {
      throw new Error(`more ${itemType} damages than the policy covers`);
    }
  }
};

/**
 * A negative loss is not a loss. Left unchecked such an entry would not merely
 * misprice the claim: it subtracts from the payout and so ADDS to the policy's
 * remaining cap, letting a claimant raise their own ceiling.
 */
const rejectNegativeDamages = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

/**
 * Every way a claim can be malformed, checked before a single G is settled.
 * The spec rejects the WHOLE claim in each case rather than dropping the
 * offending entry, so all of these run up front for the entire incident.
 *
 * The rules stay separate functions because each throws for a distinct reason
 * with a distinct message. They are called directly rather than through a
 * uniform list: only one of them needs the policy items, and a shared
 * signature would buy dispatch uniformity at the price of an unused parameter.
 */
const rejectMalformedClaim = (
  incident: Incident,
  policyItems: Item[],
): void => {
  rejectNegativeDamages(incident);
  rejectSurplusDamages(incident, policyItems);
};

/**
 * The whole incident's payout, before rounding — the per-item payouts summed,
 * and nothing else: validation is the caller's business, so this function does
 * only what its name says. NOT named for reimbursement: `reimbursementFor` is
 * the amount BEFORE the deductible, and reusing that word here would invite a
 * reader to subtract it a second time.
 */
const payoutBeforeRounding = (
  incident: Incident,
  policyItems: Item[],
): number =>
  incident.damages.reduce(
    (total, damage) => total + payoutForDamage(damage, policyItems),
    0,
  );

/**
 * Anything that is not a claim is treated as a quote, which is why this names
 * the claim case rather than offering an `isQuote` counterpart: a two-sided
 * pair would imply a third possibility the code does not handle. See the Step
 * doc comment on why `op` is a plain string.
 */
const isClaim = (step: Step): boolean => step.op === "claim";

/**
 * The items a step puts on a policy. Absent `items` reads as an empty policy
 * rather than a failure: a quote naming nothing is a well-formed request for a
 * quote on nothing. Named here — rather than defaulted at each use — so the
 * optionality that the single `Step` type forces (see its doc comment) is
 * resolved in one place instead of branching at every reader.
 */
const itemsOn = (step: Step): Item[] => step.items ?? [];

/**
 * The policy a claim step is made against. Defaults to the scenario's first
 * step, which is the only policy that can exist when a claim omits the field.
 * Named alongside `itemsOn` for the same reason: one place resolves the
 * optionality that the shared `Step` type imposes.
 */
const policyClaimedAgainst = (step: Step): number => step.policy ?? 0;

/** A claim's `policy` field is the index of the quote step that wrote it. */
const itemsCoveredBy = (policy: number, scenario: Scenario): Item[] =>
  itemsOn(scenario.steps[policy]);

/** The MHPCO caps a policy at twice its insurance sum. */
const capFor = (policyItems: Item[]): number =>
  CAP_MULTIPLE * insuranceSum(policyItems);

/**
 * A policy's cap is consumed cumulatively: each payout draws down what remains,
 * and a claim can never pay out more than is left. The clamp is applied AFTER
 * rounding, so a fractional payout cannot round its way past the remaining cap.
 *
 * A malformed claim is rejected here, before any of that: this is the first
 * point at which both the incident and the items it is claimed against are in
 * hand, and rejecting up front means no ledger state is touched on the way to
 * a throw.
 *
 * Takes the policy's items and its remaining cap rather than looking either up,
 * which keeps the arithmetic of a single claim free of the ledger's bookkeeping.
 * `capLedger.settle` resolves both and is the only caller.
 */
const settleClaim = (
  incident: Incident,
  policyItems: Item[],
  remainingBefore: number,
): ClaimResult => {
  rejectMalformedClaim(incident, policyItems);
  const desired = roundPayoutDown(payoutBeforeRounding(incident, policyItems));
  const payout = Math.min(desired, remainingBefore);
  return { payout, remainingCap: remainingBefore - payout };
};

/**
 * Tracks what each policy has left of its cap as claims land against it, and
 * settles claims against it. A policy is seeded from its items the first time
 * it is claimed against, which is why this needs the scenario: the cap is a
 * property of the covered items, and those live in the quote step the claim
 * points at.
 *
 * Settling lives here rather than in the caller because the drawdown is the
 * whole reason the ledger exists: reading what remains, paying out of it, and
 * writing back what is left are one indivisible step, and a caller that could
 * read without writing back could silently let a policy pay twice over.
 */
const capLedger = (scenario: Scenario) => {
  const remainingByPolicy = new Map<number, number>();

  return {
    settle: (policy: number, incident: Incident): ClaimResult => {
      const policyItems = itemsCoveredBy(policy, scenario);
      const remainingBefore =
        remainingByPolicy.get(policy) ?? capFor(policyItems);
      const result = settleClaim(incident, policyItems, remainingBefore);
      remainingByPolicy.set(policy, result.remainingCap);
      return result;
    },
  };
};

/**
 * Steps are processed in order because claims draw down a policy's remaining
 * cap, so each result depends on the claims before it.
 */
export const runScenario = (scenario: Scenario): ScenarioResult => {
  const caps = capLedger(scenario);

  const results = scenario.steps.map((step, precedingSteps) => {
    if (isClaim(step)) {
      // Non-null: only claim steps reach here, and every claim carries an
      // incident. See the Step doc comment.
      return caps.settle(policyClaimedAgainst(step), step.incident!);
    }

    return {
      premium: quotePremium(itemsOn(step), scenario.customer, precedingSteps),
    };
  });

  return { results };
};
