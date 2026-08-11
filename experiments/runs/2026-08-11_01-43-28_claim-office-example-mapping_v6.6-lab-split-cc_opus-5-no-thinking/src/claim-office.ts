export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioOutcome = {
  results: StepResult[];
};

type Item = { type: string; cursed?: boolean; enchantment?: number };

type Customer = { yearsWithMHPCO: number };

/** The policy-scope context a quote is priced in: who is buying, and whether
 * this is their first contract or a follow-up. */
type Policy = { customer: Customer; isFollowUpContract: boolean };

type Damage = { itemType: string; amount: number };

type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: string; items: Item[] };

type ClaimStep = { op: string; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const SURCHARGED_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

/**
 * "All amounts are rounded to whole G in the MHPCO's favour." One rule, two
 * directions: the MHPCO collects premiums, so those round UP; it disburses
 * payouts, so those round DOWN. The pair is named rather than written as bare
 * Math.ceil / Math.floor at the call sites so that the shared rule — and the
 * fact that the two directions are the same rule, not two ad-hoc conveniences —
 * survives a reader who only ever sees one of them.
 *
 * WHERE these are applied is load-bearing and is decided at the call site, not
 * here. In particular the claim path rounds the amount claimed BEFORE it is
 * clamped against the cap, so that the cap arithmetic runs in whole gold;
 * rounding the returned payout instead would leave a fraction in the remaining
 * cap. Intermediates — the halved damage amount, the per-damage deductible
 * subtraction — stay fractional per the spec.
 */
const roundedInFavourOfMHPCO = {
  collected: Math.ceil,
  disbursed: Math.floor,
};

/**
 * The MHPCO price list. The spec states it as ONE table with two columns —
 * "Sword: 1000 G insurance value, 100 G base premium" — so it is one table
 * here. Keeping the columns in separate objects let them fall out of step: an
 * insured staff could be quoted from one and then rejected as uninsurable by
 * the other, which is a contradiction no input should be able to produce.
 *
 * Components (runes, moonstones) share a row shape with main items; the spec
 * distinguishes them only by the alike-block discount, which is applied on the
 * premium side and needs no separate table.
 */
type PriceListEntry = { insuranceValue: number; basePremium: number };

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const HALVED_ENCHANTMENT_THRESHOLD = 8;
const HALVED_REIMBURSEMENT = 0.5;
const FULL_REIMBURSEMENT = 1;
const CAP_MULTIPLIER = 2;

const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PREMIUM = 60;

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

/**
 * A run of identical item types on one policy, as `countByKey` yields it: the
 * type and how many of it are insured. Three of a kind are priced as a block
 * rather than individually, which is the only reason the count travels with the
 * type at all.
 */
type AlikeGroup = [type: string, count: number];

/**
 * How many of a key a tally holds. A tally records only keys it has SEEN, so an
 * absent key is not missing data — it is a count of zero, and every caller wants
 * that reading. Stating it once here keeps the `undefined` from a Map lookup
 * from leaking into the arithmetic (or into a `?? 0` repeated at each site).
 */
const countOf = (counts: Map<string, number>, key: string): number =>
  counts.get(key) ?? 0;

/**
 * How many of each key are present. Two questions in this module have that
 * shape — how many items of each type a policy insures, and how many entries of
 * each type an incident damages — and they differ only in which field is the
 * key, so they share one tally rather than two loops that must be kept in step.
 *
 * A Map is returned rather than pairs because it answers both callers: one
 * iterates it (a Map yields `[key, count]` pairs directly), the other looks up
 * single keys in it. Returning pairs forced the looking-up caller to rebuild the
 * Map that this loop had just discarded.
 */
const countByKey = <T>(
  values: T[],
  keyOf: (value: T) => string,
): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const value of values) {
    const key = keyOf(value);

    counts.set(key, countOf(counts, key) + 1);
  }

  return counts;
};

const insuredCountByType = (items: Item[]): Map<string, number> =>
  countByKey(items, ({ type }) => type);

/**
 * The MHPCO refusing to process a scenario. Every rejection in this module ends
 * here, so "rejected" is one word with one meaning rather than a `throw` open-
 * coded at each site.
 *
 * Returns `never`, which is what lets it be used as an EXPRESSION — the arm of a
 * conditional, the fallback of a `??` — instead of forcing every guard into a
 * statement block. The rejections then read alike whatever their shape.
 */
const reject = (message: string): never => {
  throw new Error(message);
};

/**
 * Rejection for a value the MHPCO requires but does not have. The two rate
 * tables are keyed by item type, and an item type absent from either has no
 * answer to give — so the lookup rejects rather than handing back `undefined`
 * for the arithmetic downstream to turn into NaN.
 *
 * Deliberately narrow: this covers a MISSING value only. A value that is
 * present but unacceptable — a damage amount of -200, say — is a different
 * shape of rejection: it has a value to name in its message, so it states its
 * own condition and calls `reject` directly rather than being forced through
 * the `undefined` check here.
 */
const required = <T>(value: T | undefined, message: string): T =>
  value ?? reject(message);

const uninsuredTypeMessage = (type: string): string =>
  `The MHPCO does not insure items of type "${type}".`;

/**
 * A damage entry reports what an incident COST, and a cost below zero is not a
 * smaller claim — it is a claim that would pay the MHPCO. Nothing downstream
 * treats it as a rejection on its own: the deductible subtraction would quietly
 * turn -200 G of "damage" into a -300 G contribution to the claim total, netting
 * off against the genuine damages beside it. So the entry is refused at the door.
 */
const isNegative = (amount: number): boolean => amount < 0;

const negativeAmountMessage = (amount: number): string =>
  `A damage amount cannot be negative, but the claim reports ${amount} G.`;

const priceListEntryOf = (type: string): PriceListEntry =>
  required(PRICE_LIST[type], uninsuredTypeMessage(type));

const basePremiumOfType = (type: string): number =>
  priceListEntryOf(type).basePremium;

const basePremiumOfGroup = ([type, count]: AlikeGroup): number => {
  if (count === ALIKE_BLOCK_SIZE) return ALIKE_BLOCK_PREMIUM;

  return count * basePremiumOfType(type);
};

/**
 * The policy base premium: the sum of the item base premiums, with the
 * alike-block discount applied. Policy-scope modifiers are percentages OF
 * THIS amount — never of a total that already includes item surcharges.
 */
const policyBasePremiumOf = (items: Item[]): number =>
  sum([...insuredCountByType(items)].map(basePremiumOfGroup));

/**
 * Item-scope surcharges: each is a percentage of the affected item's OWN base
 * premium, independent of the policy base and of the alike-block discount.
 */
const isCursed = (item: Item): boolean => item.cursed === true;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const carriesEnchantmentSurcharge = (item: Item): boolean =>
  enchantmentOf(item) >= SURCHARGED_ENCHANTMENT_THRESHOLD;

const itemSurchargeRateOf = (item: Item): number =>
  (isCursed(item) ? CURSE_SURCHARGE : 0) +
  (carriesEnchantmentSurcharge(item) ? ENCHANTMENT_SURCHARGE : 0);

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + basePremiumOfType(item.type) * itemSurchargeRateOf(item),
    0,
  );

/**
 * Policy-scope modifiers: each is a percentage of the policy base premium.
 * Surcharges and discounts are netted into a single rate, so the policy base is
 * multiplied exactly once — this keeps the result free of the rounding drift
 * that separate discount and surcharge terms would introduce. The netted rate
 * (and hence the returned amount) is negative when the discounts outweigh the
 * surcharges.
 */
const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const policyModifierRateOf = ({ customer, isFollowUpContract }: Policy): number =>
  FIRST_INSURANCE_SURCHARGE -
  (isLongStanding(customer) ? LOYALTY_DISCOUNT : 0) -
  (isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT : 0);

const policyModifiersOn = (policyBase: number, policy: Policy): number =>
  policyBase * policyModifierRateOf(policy);

const quotePremium = (items: Item[], policy: Policy): number => {
  const policyBase = policyBasePremiumOf(items);
  const premium =
    policyBase +
    itemSurchargesOf(items) +
    policyModifiersOn(policyBase, policy) +
    PROCESSING_FEE;

  return roundedInFavourOfMHPCO.collected(premium);
};

/**
 * Whether any step precedes this one. A quote is a follow-up contract when the
 * customer already holds one, and today every step is a quote — so "has a
 * predecessor" and "is a follow-up contract" coincide.
 *
 * They stop coinciding once claim steps exist: a claim at index 0 would make
 * the quote at index 1 look like a follow-up. At that point the caller must
 * count preceding QUOTE steps instead of asking this. The name is deliberately
 * about position, not contracts, so that the substitution is a visible change
 * at the call site rather than a silent redefinition here.
 */
const hasPrecedingStep = (stepIndex: number): boolean => stepIndex > 0;

const insuredValueOfType = (type: string): number =>
  priceListEntryOf(type).insuranceValue;

const insuranceSumOf = (items: Item[]): number =>
  sum(items.map(({ type }) => insuredValueOfType(type)));

const isReimbursedByHalf = (item: Item): boolean =>
  enchantmentOf(item) >= HALVED_ENCHANTMENT_THRESHOLD;

/**
 * The share of a damage amount that is reimbursed, before the deductible.
 *
 * The specification's dragon-material rule ("damage to items made of dragon
 * material is fully reimbursed") is deliberately ABSENT here, and `Item` has no
 * `material` field. The rule is unobservable given the other rules:
 *
 * - Full reimbursement is already FULL_REIMBURSEMENT, the default rate, so on
 *   items below the halving threshold a dragon clause would compute what this
 *   function computes anyway.
 * - The only inputs where the two clauses disagree are items with enchantment
 *   >= HALVED_ENCHANTMENT_THRESHOLD, and there the spec awards the conflict to
 *   halving ("both clauses apply; the 50 % rule wins").
 *
 * So no input distinguishes an implemented dragon clause from this one. The
 * spec's own examples confirm it: a steel sword and a dragon sword at
 * enchantment 9 with 1000 G damage both pay out 400 G. Implementing it would
 * add an unreachable branch and a field nothing reads.
 *
 * This stops holding the moment dragon material gains an effect OUTSIDE the
 * reimbursement rate — a different deductible, or an exemption from the payout
 * cap. Such a rule would need a real `material` field and a real branch.
 */
const reimbursementRateFor = (item: Item): number =>
  isReimbursedByHalf(item) ? HALVED_REIMBURSEMENT : FULL_REIMBURSEMENT;

/**
 * The insured item a damage entry refers to. A damage entry can fail to name one
 * for two DIFFERENT reasons, and they get different messages because they are
 * different problems for the claimant:
 *
 * - The MHPCO does not insure the type at all (a broomstick). Nothing the
 *   claimant does to their policy would help.
 * - The type is insurable but is not on THIS policy (an amulet, on a policy
 *   covering only a sword). Perfectly insurable — just not insured here.
 *
 * The first is checked first, because it is the broader fact: an uninsurable
 * type is also, trivially, not on the policy, and reporting it as a coverage gap
 * would send the claimant off to read a policy that was never the problem.
 */
const isInsurableType = (type: string): boolean => type in PRICE_LIST;

const insuredItemFor = ({ itemType }: Damage, items: Item[]): Item => {
  if (!isInsurableType(itemType)) reject(uninsuredTypeMessage(itemType));

  return required(
    items.find(({ type }) => type === itemType),
    `The policy does not cover an item of type "${itemType}".`,
  );
};

/**
 * A single damage entry settles in two stages, in this order: the reimbursement
 * rate applies to the damage amount, and the deductible comes off the result.
 * The spec is explicit that the sequencing matters ("the 50 % rule wins, then
 * deductible"), so it is spelled out rather than left to operator precedence.
 */
const payoutForDamage = (damage: Damage, items: Item[]): number => {
  if (isNegative(damage.amount)) reject(negativeAmountMessage(damage.amount));

  const reimbursed =
    damage.amount * reimbursementRateFor(insuredItemFor(damage, items));

  return reimbursed - DEDUCTIBLE_PER_DAMAGE;
};

/**
 * The quote step a claim is filed against. This ASSUMES the referenced index
 * holds a quote, and the assumption is unchecked: a claim naming a claim step —
 * or an out-of-range index — fails downstream with an opaque undefined-property
 * error instead of a rejection.
 *
 * NO test forces the check, and none is pending: every claim in the suite
 * references `policy: 0`, which is always a quote. The two remaining rejection
 * tests are both about the CONTENTS of a claim (an unknown item type, a
 * negative amount) and are served elsewhere — the item-type one by
 * `insuredItemFor`, which already rejects.
 *
 * So the cast stays, deliberately: writing the guard now would be implementing
 * ahead of the tests. It is isolated here so that the day a scenario can point
 * a claim at a non-quote step, this is the one function that has to change.
 */
const policyReferencedBy = (claim: ClaimStep, steps: Step[]): QuoteStep =>
  steps[claim.policy] as QuoteStep;

/**
 * A damage entry names a TYPE, not a particular item, so two entries reading
 * `sword` are two separate swords damaged — each with its own deductible. A
 * policy covering one sword therefore cannot answer a claim for two of them.
 *
 * This is why the check lives at claim scope: `insuredItemFor` resolves each
 * entry on its own and would happily match both entries to the same insured
 * sword. Only here are all the entries visible at once.
 */
const damagedCountByType = (incident: Incident): Map<string, number> =>
  countByKey(incident.damages, ({ itemType }) => itemType);

const rejectOverclaimedTypes = (incident: Incident, items: Item[]): void => {
  const insuredCounts = insuredCountByType(items);

  for (const [itemType, damaged] of damagedCountByType(incident)) {
    const insured = countOf(insuredCounts, itemType);

    if (damaged > insured) {
      reject(
        `The claim reports ${damaged} damaged items of type "${itemType}", but the policy covers ${insured}.`,
      );
    }
  }
};

/**
 * The total a claim asks for: every damage entry settled on its own, then
 * summed. Unclamped — the payout cap is applied to this total, not per damage.
 */
const amountClaimed = (incident: Incident, items: Item[]): number => {
  rejectOverclaimedTypes(incident, items);

  return incident.damages.reduce(
    (total, damage) => total + payoutForDamage(damage, items),
    0,
  );
};

/**
 * Applying the payout cap to a claim: a policy pays at most what is left of its
 * cap, and whatever it pays comes off that remainder. Pure, and stated as a
 * before/after pair, so the invariant `payout + capAfter === capBefore` is
 * visible in one place rather than spread across the caller.
 */
const chargedAgainstCap = (claimed: number, capBefore: number): ClaimResult => {
  const payout = Math.min(claimed, capBefore);

  return { payout, remainingCap: capBefore - payout };
};

/**
 * The cap a policy starts with, before any claim has drawn on it.
 */
const initialCapOf = (policy: QuoteStep): number =>
  CAP_MULTIPLIER * insuranceSumOf(policy.items);

/**
 * Settling a claim DRAWS DOWN the policy's remaining cap: the result depends on
 * how much earlier claims already consumed, so the running cap is read from and
 * written back to `capRemainingByPolicy`. That state write is this function's
 * one effect, and it is deliberately the last statement.
 */
const settleClaim = (
  claim: ClaimStep,
  steps: Step[],
  capRemainingByPolicy: Map<number, number>,
): ClaimResult => {
  const policy = policyReferencedBy(claim, steps);
  const capBefore =
    capRemainingByPolicy.get(claim.policy) ?? initialCapOf(policy);
  const claimedInWholeGold = roundedInFavourOfMHPCO.disbursed(
    amountClaimed(claim.incident, policy.items),
  );
  const settled = chargedAgainstCap(claimedInWholeGold, capBefore);

  capRemainingByPolicy.set(claim.policy, settled.remainingCap);

  return settled;
};

const priceQuote = (
  quote: QuoteStep,
  stepIndex: number,
  customer: Customer,
): QuoteResult => ({
  premium: quotePremium(quote.items, {
    customer,
    isFollowUpContract: hasPrecedingStep(stepIndex),
  }),
});

/**
 * Steps are settled IN ORDER, and that order is load-bearing: a claim's payout
 * depends on how much of the policy's cap the claims before it consumed.
 */
export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const capRemainingByPolicy = new Map<number, number>();

  return {
    results: scenario.steps.map((step, stepIndex) =>
      isQuoteStep(step)
        ? priceQuote(step, stepIndex, scenario.customer)
        : settleClaim(step, scenario.steps, capRemainingByPolicy),
    ),
  };
};
