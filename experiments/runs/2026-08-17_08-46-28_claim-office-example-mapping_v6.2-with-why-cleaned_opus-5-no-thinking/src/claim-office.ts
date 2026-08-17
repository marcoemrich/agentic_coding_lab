export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

/**
 * What the MHPCO charges to insure a type, before any modifier.
 *
 * Deliberately NOT the same table as `INSURANCE_VALUES`, and deliberately not
 * derived from it — see the note there.
 */
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/**
 * What the MHPCO considers a type to be WORTH. Only the payout cap reads this.
 *
 * Every value here is currently exactly 10 × the type's base premium, which
 * makes this table look like derivable duplication of `BASE_PREMIUMS`. It is
 * not: the two encode different facts that merely agree numerically today. The
 * ratio is a coincidence of the MHPCO's price list, not a rule of it.
 *
 * Collapsing them — `INSURANCE_VALUES[t]` to `BASE_PREMIUMS[t] * 10` — would
 * put every premium modifier on the path to the cap, since modifiers apply to
 * the base premium. "caps a cursed sword policy at 2000 G based on the
 * unmodified insurance value" is the executable guard: the cursed sword's
 * premium is modified to 165 G while its cap stays 2 × 1000 = 2000 G. A
 * derived table would let the 50 % curse surcharge inflate the cap to 3000 G,
 * paying the customer MORE for insuring a cursed item. The separation is what
 * keeps premium modifiers out of valuation.
 */
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

/**
 * The MHPCO rounds every gold amount in its own favor, which means the
 * direction depends on which way the money moves: a premium it collects rounds
 * up, a payout it makes rounds down. These two are the same rule, so they are
 * named as a pair rather than left as a bare `Math.ceil` at one call site and a
 * bare `Math.floor` at another — apart, each reads as a local arithmetic choice
 * and a reader has to reconstruct the symmetry to see the policy.
 *
 * Both are applied once at the end of a total, never to intermediate terms.
 * Rounding each term separately would let a multi-damage incident lose several
 * gold instead of at most one, and "rounds a payout of 350.5 G down to 350 G"
 * pins the total-level behavior for a 450.5 − 100 intermediate that never gets
 * rounded on its own.
 */
const roundInFavorOfInsurer = {
  collected: Math.ceil,
  paidOut: Math.floor,
};

/** Items that share the same `type`, and so are priced together. */
type AlikeItems = Item[];

const groupAlikeItems = (items: Item[]): AlikeItems[] => {
  const byType = new Map<string, AlikeItems>();
  items.forEach((item) => byType.set(item.type, [...(byType.get(item.type) ?? []), item]));
  return [...byType.values()];
};

const formsBlock = (items: AlikeItems): boolean => items.length === BLOCK_SIZE;

/**
 * Rejects a type the MHPCO has no price list entry for.
 *
 * Named `require*` like `requireInsuredItems` and `requireValidDamages`,
 * and for the same reason: the throw is the interesting half. Kept separate from
 * `itemBasePremium` so that no pricing path can decide whether validation runs.
 * `alikeItemsBasePremium` short-circuits a block of 3 to a flat `BLOCK_PREMIUM`
 * without ever consulting `BASE_PREMIUMS`, so if the check lived in the lookup,
 * 3 broomsticks would price at 60 G instead of being rejected. (Today the throw
 * would still be reached, but only because `itemSurchargesTotal` happens to
 * touch every item — validation should not rest on that coincidence.)
 */
const requireInsurableType = (item: Item): void => {
  if (!(item.type in BASE_PREMIUMS)) throw new Error(`The MHPCO does not insure a ${item.type}`);
};

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type];

const alikeItemsBasePremium = (alikeItems: AlikeItems): number =>
  formsBlock(alikeItems)
    ? BLOCK_PREMIUM
    : alikeItems.reduce((total, item) => total + itemBasePremium(item), 0);

const totalBasePremium = (items: Item[]): number =>
  groupAlikeItems(items).reduce((total, alikeItems) => total + alikeItemsBasePremium(alikeItems), 0);

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

/**
 * An additive rate rule: contributes `rate` × some base premium, but only to
 * subjects the rule `applies` to. Every rule is an independent additive term —
 * nothing compounds onto a running total — so a discount is simply a negative
 * `rate` rather than a subtraction applied at some point in a sequence.
 */
type RateRule<Subject> = { applies: (subject: Subject) => boolean; rate: number };

/**
 * The combined rate of every rule that applies to `subject`. Callers multiply
 * this by the relevant base premium once, which keeps each rule additive.
 */
const combinedRate = <Subject>(rules: RateRule<Subject>[], subject: Subject): number =>
  rules.filter(({ applies }) => applies(subject)).reduce((total, { rate }) => total + rate, 0);

const ITEM_SURCHARGES: RateRule<Item>[] = [
  { applies: isCursed, rate: CURSE_SURCHARGE_RATE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const itemSurcharge = (item: Item): number =>
  itemBasePremium(item) * combinedRate(ITEM_SURCHARGES, item);

/**
 * Summed across the policy's items, but each term is charged on the item's own
 * base premium — so this is item-scoped pricing that merely totals up, unlike
 * `policyAdjustments`, which rates the policy base as a whole.
 */
const itemSurchargesTotal = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

/** Everything a policy-wide rule may look at when deciding whether it applies. */
type Policy = { customer: Customer; priorContracts: number };

const isLoyalCustomer = ({ customer }: Policy): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const isFollowUpContract = ({ priorContracts }: Policy): boolean => priorContracts > 0;

/**
 * Charged once per quote on the policy's base premium.
 *
 * The unconditional first-insurance surcharge is deliberately not in this table:
 * see `FIRST_INSURANCE_SURCHARGE_RATE` at the quote site.
 */
const POLICY_ADJUSTMENTS: RateRule<Policy>[] = [
  { applies: isLoyalCustomer, rate: -LOYALTY_DISCOUNT_RATE },
  { applies: isFollowUpContract, rate: -FOLLOW_UP_DISCOUNT_RATE },
];

const policyAdjustments = (policyBasePremium: number, policy: Policy): number =>
  policyBasePremium * combinedRate(POLICY_ADJUSTMENTS, policy);

const quotePremium = (items: Item[], policy: Policy): number => {
  // Validated up front, for the whole quote, before any pricing runs. A quote
  // for an uninsurable item has no premium at all, so this is a precondition of
  // pricing rather than a step within it.
  items.forEach(requireInsurableType);
  const policyBasePremium = totalBasePremium(items);
  // The first-insurance surcharge has no condition to test: the MHPCO treats
  // every item in a quote as newly insured, so it is charged on every quote,
  // including a long-standing customer's follow-up contract. That makes it a
  // fixed rate on the base — like PROCESSING_FEE is a fixed addend — rather
  // than a rule belonging in POLICY_ADJUSTMENTS.
  //
  // "applies the first insurance surcharge on a follow-up contract too" is the
  // executable guard: a 5-year customer's SECOND contract, for a brand-new
  // sword, still pays it (100 − 20 loyalty + 10 first insurance − 15 follow-up
  // + 5 fee = 80 G). Both conditions that might plausibly gate this surcharge —
  // long-standing customer, follow-up contract — hold in that case, and it is
  // charged regardless. Giving it an `applies` and moving it into
  // POLICY_ADJUSTMENTS would need a predicate that is always true, which is a
  // rule that is not a rule.
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  // Every term is added to the base, never multiplied onto a running total. The
  // algebraically equivalent base * (1 + rate) yields 110.00000000000001 for
  // base 100, which rounding up turns into a premium that is 1 G too high.
  return roundInFavorOfInsurer.collected(
    policyBasePremium +
      itemSurchargesTotal(items) +
      firstInsuranceSurcharge +
      policyAdjustments(policyBasePremium, policy) +
      PROCESSING_FEE,
  );
};

const isQuote = (step: Step): boolean => step.op === "quote";

/**
 * A contract is created by each quote, so the number the customer already held
 * when `stepIndex` is reached is just the number of quotes before it. Claims are
 * not contracts and so do not count.
 */
const priorContractsAt = (steps: Step[], stepIndex: number): number =>
  steps.slice(0, stepIndex).filter(isQuote).length;

/**
 * The items covered by the policy a claim points at, rejecting a `policy` index
 * that names no policy at all.
 *
 * Named for the rejection rather than the lookup because the throw is the
 * interesting half: a claim carries an index into a step list it does not
 * control, so "step 3 is a policy" is an assumption to check, not a given.
 */
const requireInsuredItems = (steps: Step[], policyIndex: number): Item[] => {
  const step = steps[policyIndex];
  if (step?.op !== "quote") throw new Error(`Step ${policyIndex} did not create a policy`);
  return step.items;
};

/**
 * The insured item a damage entry refers to.
 *
 * No longer named `require*` like its two siblings: `requireValidDamages`
 * now runs first, in `claimResult`, and rejects both an uncovered type and a
 * surplus entry, so by the time this is reached a match always exists. The
 * interesting half is the resolution, not the throw, and the name should say
 * which — it is `damagedItem`, not `requireDamagedItem`.
 *
 * The throw stays anyway, and is deliberately NOT replaced by a `!` assertion.
 * It is unreachable only because of the order of two calls in `claimResult`;
 * nothing in a type or signature enforces that order, and a future caller
 * reaching payout by another route would get `undefined.enchantment` instead of
 * a sentence naming the type. Same reasoning as `requireInsurableType`, which
 * keeps its check rather than resting on `itemSurchargesTotal` happening to
 * touch every item. The message matches the one `requireValidDamages`
 * throws for the same mistake, so which guard fires first is invisible.
 *
 * Matching is by `itemType` only — a damage entry names a type, not a specific
 * item, so with several alike items on one policy the first match stands in for
 * whichever was damaged. Alike items agree on the properties the payout clauses
 * read, so which one stands in does not change the result. Surplus entries are
 * rejected up front, so first-match only ever resolves among genuinely-covered
 * alike items.
 */
const damagedItem = (insured: Item[], damage: Damage): Item => {
  const item = insured.find(({ type }) => type === damage.itemType);
  if (!item) throw new Error(`Policy does not cover an item of type ${damage.itemType}`);
  return item;
};

const countByType = (types: string[]): Map<string, number> =>
  types.reduce((counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1), new Map());

/**
 * Rejects a damage entry that is not a coherent report of a loss on its own
 * terms, whatever policy it is later matched against. A negative amount is
 * damage that paid the customer, which no policy could mean.
 *
 * Scope is what separates this from `requireDamagesAreCovered`: this reads one
 * entry and nothing else, so it needs no `insured` argument to say what is
 * wrong. Keeping the two apart means neither has to be read with "…but only the
 * other half of this function looks at the policy" held in mind.
 */
const requireWellFormedDamage = ({ itemType, amount }: Damage): void => {
  if (amount < 0) {
    throw new Error(`Damage to a ${itemType} cannot be a negative amount: ${amount}`);
  }
};

/**
 * Rejects an incident that claims damage the policy cannot cover, in the two
 * ways that can happen: a type the policy does not cover at all, and more
 * damaged items of a covered type than the policy covers (e.g. two sword
 * damages against a single insured sword). Each damage entry is a distinct
 * damaged item — that is what earns it its own deductible — so the policy must
 * cover one item per entry.
 *
 * The two get distinct messages because they are distinct mistakes and this
 * text reaches the customer via stderr: "covers fewer swords than you report
 * damaged" tells someone with one insured sword something useful, while the
 * same phrasing about an amulet they never insured reads as a miscount rather
 * than as "that was never on the policy". Both tests here assert only on the
 * type name, so this split is for the reader, not for the assertions.
 */
const requireDamagesAreCovered = (insured: Item[], damages: Damage[]): void => {
  const insuredCounts = countByType(insured.map(({ type }) => type));
  countByType(damages.map(({ itemType }) => itemType)).forEach((damaged, type) => {
    const covered = insuredCounts.get(type) ?? 0;
    if (covered === 0) throw new Error(`Policy does not cover an item of type ${type}`);
    if (damaged > covered) {
      throw new Error(`Policy covers fewer items of type ${type} than the claim reports damaged`);
    }
  });
};

/**
 * Every rejection a claim's damages can earn, in the order the customer would
 * want to hear them: an entry that makes no sense on its own is reported as
 * such before the policy is consulted about it, so a negative amount against an
 * uninsured type is answered "that amount is negative" rather than sending the
 * customer to fix their policy over a number that would be refused anyway.
 */
const requireValidDamages = (insured: Item[], damages: Damage[]): void => {
  damages.forEach(requireWellFormedDamage);
  requireDamagesAreCovered(insured, damages);
};

/**
 * Summed over EVERY item the policy covers, not just a damaged one. A claim on
 * one item of a multi-item policy still draws against the whole policy's sum:
 * damaging only the amulet of a sword + amulet policy reports a cap of 3200
 * (2 × 1600), not 1200 (2 × 600).
 *
 * Reads the item's `type` and nothing else. An item's `cursed` and `enchantment`
 * fields move its premium but never its insured value, so this stays on the
 * valuation side of the pricing/valuation split described at `INSURANCE_VALUES`.
 */
const insuranceSum = (policyItems: Item[]): number =>
  policyItems.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);

/**
 * The reimbursable value of a damage before the deductible. Special clauses key
 * off the DAMAGED ITEM's own properties, so this takes the insured item rather
 * than the damage entry alone.
 *
 * The spec's dragon-material clause has no branch here on purpose: full
 * reimbursement is already the no-clause baseline, and where dragon material
 * meets enchantment >= 8 the 50 % rule wins, so a `material === "dragon"`
 * branch could only return what these two lines already return.
 */
const reimbursedAmount = (damage: Damage, insuredItem: Item): number =>
  (insuredItem.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? damage.amount * HALF_REIMBURSEMENT_RATE
    : damage.amount;

/** The deductible is charged per damaged item, not once per incident. */
const damagePayout = (damage: Damage, insuredItem: Item): number =>
  reimbursedAmount(damage, insuredItem) - DEDUCTIBLE_PER_DAMAGE;

const incidentPayout = (damages: Damage[], insured: Item[]): number =>
  // Applied to the incident total rather than to each damage, so a single
  // incident loses at most 1 G to rounding.
  roundInFavorOfInsurer.paidOut(
    damages.reduce(
      (total, damage) => total + damagePayout(damage, damagedItem(insured, damage)),
      0,
    ),
  );

/** A policy pays out at most twice the insurance sum of the items it covers. */
const payoutCap = (policyItems: Item[]): number =>
  insuranceSum(policyItems) * CAP_MULTIPLE_OF_INSURANCE_SUM;

/**
 * What the policy can still pay after `paidOutSoFar` has been paid against it.
 * The cap belongs to the policy, not to a claim, so this subtracts every payout
 * the policy has already made — across all earlier claims, not just this one.
 */
const capRemainingAfter = (policyItems: Item[], paidOutSoFar: number): number =>
  payoutCap(policyItems) - paidOutSoFar;

/**
 * A step is priced against the whole scenario, not just its own fields: a quote
 * needs the customer and the steps before it to know about discounts, and a
 * claim needs the steps before it to find its policy. Both halves therefore
 * take the same two arguments, which is what lets `runScenario` dispatch on
 * `op` alone.
 */
const quoteResult = (scenario: Scenario, stepIndex: number, items: Item[]): QuoteResult => {
  const policy = {
    customer: scenario.customer,
    priorContracts: priorContractsAt(scenario.steps, stepIndex),
  };
  return { premium: quotePremium(items, policy) };
};

/**
 * Total already paid against each policy, keyed by the policy's step index.
 *
 * Absent keys mean "nothing paid yet", so this is deliberately partial rather
 * than pre-seeded with a 0 per quote: a claim can name any step index, and only
 * `requireInsuredItems` gets to decide whether that index is a policy at all.
 */
type PaidOutByPolicy = Partial<Record<number, number>>;

const claimResult = (
  scenario: Scenario,
  policyIndex: number,
  damages: Damage[],
  paidOutSoFar: number,
): ClaimResult => {
  // The same list serves two different scopes: the payout looks up only the
  // damaged items within it, while the cap is drawn from all of it.
  const policyItems = requireInsuredItems(scenario.steps, policyIndex);
  requireValidDamages(policyItems, damages);
  const capRemaining = capRemainingAfter(policyItems, paidOutSoFar);
  // The claim can never draw more than the policy has left, so a claim worth
  // more than the remaining cap is paid down to exactly that remainder.
  const payout = Math.min(incidentPayout(damages, policyItems), capRemaining);
  return { payout, remainingCap: capRemaining - payout };
};

/**
 * The result of one step, plus the payouts-so-far that the NEXT step must see.
 * A quote returns the tally untouched; a claim returns it with its own payout
 * added. Returning the tally rather than mutating a shared one is what lets the
 * scenario be a fold over immutable states instead of a map with a side effect.
 */
const stepResult = (
  scenario: Scenario,
  step: Step,
  stepIndex: number,
  paidOut: PaidOutByPolicy,
): { result: Result; paidOut: PaidOutByPolicy } => {
  if (step.op === "quote") {
    return { result: quoteResult(scenario, stepIndex, step.items), paidOut };
  }
  const paidOutSoFar = paidOut[step.policy] ?? 0;
  const result = claimResult(scenario, step.policy, step.incident.damages, paidOutSoFar);
  // Read back off the result rather than recomputed: the payout the policy has
  // drawn is by definition the payout the customer was told about.
  return {
    result,
    paidOut: { ...paidOut, [step.policy]: paidOutSoFar + result.payout },
  };
};

export const runScenario = (scenario: Scenario): Result[] =>
  // A claim's payout depends on what earlier claims against the same policy
  // already drew, so the steps are folded with that running total rather than
  // mapped independently.
  scenario.steps.reduce<{ results: Result[]; paidOut: PaidOutByPolicy }>(
    ({ results, paidOut }, step, stepIndex) => {
      const { result, paidOut: paidOutAfter } = stepResult(scenario, step, stepIndex, paidOut);
      return { results: [...results, result], paidOut: paidOutAfter };
    },
    { results: [], paidOut: {} },
  ).results;
