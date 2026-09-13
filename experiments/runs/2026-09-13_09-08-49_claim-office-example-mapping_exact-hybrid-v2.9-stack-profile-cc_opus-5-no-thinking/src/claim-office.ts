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

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ScenarioResult = {
  results: unknown[];
};

const PROCESSING_FEE = 5;

// Only the main item types. Components are priced separately: individually,
// or as a discounted block of 3 alike ones.
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

// Insurance values are the SUM INSURED per item - distinct from the base
// premiums above, which price the policy.
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE_PER_DAMAGE = 100;

// A CLAIM-side rule, unrelated to the premium-side
// ENCHANTMENT_SURCHARGE_THRESHOLD of 5; the two merely both key off
// enchantment, and are deliberately kept as separate numbers.
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const CAP_MULTIPLE = 2;

// Derived from the premium table rather than listed again, so the set of
// underwritten main types cannot drift from the set that can be priced.
const MAIN_ITEM_TYPES = Object.keys(BASE_PREMIUMS);

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

// Modifiers are additive percentages of the UNMODIFIED base premium, never
// compounding multipliers, and are kept as exact fractions rather than float
// multipliers: 100 * 1.1 is 110.00000000000001 in IEEE-754. Only the final
// premium is rounded, so intermediate amounts stay fractional.
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

// Modifiers are signed terms in one additive sum, so a discount is simply a
// negative percentage. Naming the sign keeps it from riding on a single easily
// overlooked "-" at a call site.
const discountOf = (amount: number, percent: number): number =>
  -percentOf(amount, percent);

const FIRST_INSURANCE_PERCENT = 10;
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const basePremiumOf = (item: Item): number => BASE_PREMIUMS[item.type];

// A group of exactly 3 alike components is offered at a block price. Any
// other count is priced per component.
const componentGroupPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;

// Components are priced per group of alike ones, so each distinct type is
// counted and priced on its own.
const componentsPremium = (components: Item[]): number => {
  const distinctTypes = new Set(components.map((component) => component.type));

  return [...distinctTypes].reduce((sum, type) => {
    const alike = components.filter((component) => component.type === type);
    return sum + componentGroupPremium(alike.length);
  }, 0);
};

// Splits a quote's items into the two independently-priced kinds, so the
// main/component distinction is decided in exactly one place.
const partitionByComponent = (
  items: Item[],
): { mainItems: Item[]; components: Item[] } => ({
  mainItems: items.filter((item) => !isComponent(item)),
  components: items.filter(isComponent),
});

// Item-specific modifiers apply to the affected item's OWN base premium, not
// to the policy total. They are independent: a cursed, highly enchanted item
// carries both, so each item sums the surcharges that apply to it.
// Named for the consequence rather than the measurement, so it cannot be
// mistaken for the claim-side qualifiesForHalfReimbursement below.
const attractsEnchantmentSurcharge = (item: Item): boolean =>
  (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_THRESHOLD;

const surchargesFor = (item: Item): number => {
  const base = basePremiumOf(item);
  const curse = item.cursed ? percentOf(base, CURSE_PERCENT) : 0;
  const enchantment = attractsEnchantmentSurcharge(item)
    ? percentOf(base, HIGH_ENCHANTMENT_PERCENT)
    : 0;

  return curse + enchantment;
};

const itemSpecificModifiers = (mainItems: Item[]): number =>
  mainItems.reduce((sum, item) => sum + surchargesFor(item), 0);

// Policy-wide modifiers are percentages of the whole policy's base premium,
// taken from the UNMODIFIED base so item-specific modifiers never feed into
// them - that is what keeps modifiers additive instead of compounding.
// Discounts are negative terms.
const qualifiesForLoyalty = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const policyWideModifiers = (
  basePremium: number,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  // First insurance applies to every quote, including follow-ups: the spec
  // treats each item in a quote as a first insurance regardless of customer
  // history, so this coexists with the follow-up discount.
  const firstInsurance = percentOf(basePremium, FIRST_INSURANCE_PERCENT);
  const loyalty = qualifiesForLoyalty(customer)
    ? discountOf(basePremium, LOYALTY_DISCOUNT_PERCENT)
    : 0;
  const followUp = isFollowUp
    ? discountOf(basePremium, FOLLOW_UP_DISCOUNT_PERCENT)
    : 0;

  return firstInsurance + loyalty + followUp;
};

// Amounts are rounded in the MHPCO's favor, and the direction depends on who
// pays. The two directions are defined together so the asymmetry is visible
// at a glance; they are deliberately two named functions rather than one
// round(amount, direction), because the name at each call site is what makes
// the direction self-evident. Every amount inside the pipelines stays an
// exact fraction - rounding is applied once per amount, as late as each
// pipeline allows.
//
// A premium is owed TO MHPCO, so it rounds up. Applied at the point a quote
// result is emitted (priceQuote).
const roundPremiumInMhpcoFavor = (premium: number): number =>
  Math.ceil(premium);

// A payout is owed BY MHPCO, so it rounds down. Applied earlier than its
// premium counterpart - inside drawAgainstPolicy rather than at emission -
// because the rounded payout is what decrements the cap; rounding only at
// emission would leave remainingCap fractional.
const roundPayoutInMhpcoFavor = (payout: number): number => Math.floor(payout);

// Returns the EXACT, unrounded premium. Rounding happens once, at the point
// the result is emitted - see runScenario.
const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const { mainItems, components } = partitionByComponent(step.items);

  const basePremium =
    mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0) +
    componentsPremium(components);

  const modifiers =
    itemSpecificModifiers(mainItems) +
    policyWideModifiers(basePremium, customer, isFollowUp);

  return basePremium + modifiers + PROCESSING_FEE;
};

const insuranceValueOf = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type];

// The insurance sum is a plain per-item total: the component block discount
// affects the premium only, never the sum insured.
const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

// A policy remembers what it covers and how much of its cap is left, so later
// claim steps can draw against it.
type Policy = {
  items: Item[];
  remainingCap: number;
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLE * insuranceSumOf(items),
});

// Damage to a sufficiently enchanted item is only half reimbursed. Named for
// the consequence rather than the measurement, so it cannot be mistaken for
// the premium-side attractsEnchantmentSurcharge above.
const qualifiesForHalfReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

// Decides how much of a damage amount the clauses cover, before the
// deductible. Takes the amount rather than the whole Damage: the itemType has
// already been resolved to an item by the caller.
const reimbursementFor = (item: Item, amount: number): number =>
  qualifiesForHalfReimbursement(item)
    ? percentOf(amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : amount;

// Each damage entry carries its own deductible, applied after the
// reimbursement clauses have decided how much of the damage is covered.
const payoutForDamage = (policy: Policy, damage: Damage): number => {
  const damagedItem = policy.items.find(
    (item) => item.type === damage.itemType,
  );

  // Unreachable for a validated claim: assertDamagesWithinCover requires each
  // damaged type to be claimed no more often than it is insured, and an
  // uninsured type is that rule's count-zero case. Stated as a check rather
  // than an "as Item" cast: a cast would quietly hand undefined to
  // reimbursementFor if a caller ever settled a claim without validating it
  // first, which is the TypeError the coverage rule exists to prevent.
  if (!damagedItem) {
    throw new Error(`item not covered by policy: ${damage.itemType}`);
  }

  return reimbursementFor(damagedItem, damage.amount) - DEDUCTIBLE_PER_DAMAGE;
};

// Returns what the incident's damages come to BEFORE the cap is applied -
// hence "desired" rather than "settled": this amount is what the claimant has
// coming if the policy still has the cover, and drawAgainstPolicy decides
// whether it does.
const desiredPayoutFor = (policy: Policy, incident: Incident): number =>
  incident.damages.reduce(
    (total, damage) => total + payoutForDamage(policy, damage),
    0,
  );

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };

// The cap limits the money actually paid out, not just the reported
// remainder: once it is exhausted the desired payout is cut down to whatever
// cover is left, and the remainder floors at 0. Takes the remaining cap
// itself rather than the whole Policy - that one number is the only thing
// this rule depends on.
const limitToRemainingCap = (desired: number, remainingCap: number): number =>
  Math.min(desired, remainingCap);

// Draws the payout against the policy's cap, so the policy carries less cover
// into any later claim.
const drawAgainstPolicy = (policy: Policy, incident: Incident): ClaimResult => {
  // Rounded before the cap is applied and decremented, so the remaining cover
  // never becomes fractional. No active test distinguishes this order from
  // clamping first: remainingCap is always integral, so either order agrees.
  const desired = roundPayoutInMhpcoFavor(desiredPayoutFor(policy, incident));
  const payout = limitToRemainingCap(desired, policy.remainingCap);

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
};

// An item type MHPCO does not underwrite cannot be priced at all, so a quote
// naming one is rejected outright rather than silently producing NaN.
const isKnownItemType = (item: Item): boolean =>
  MAIN_ITEM_TYPES.includes(item.type) || isComponent(item);

const assertQuotableItems = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item));

  if (unknown) {
    throw new Error(`unknown item type: ${unknown.type}`);
  }
};

const countOfType = (types: string[], type: string): number =>
  types.filter((candidate) => candidate === type).length;

// Each damaged item must be one the policy actually insures, so a type may be
// claimed no more often than it is covered. Counting subsumes mere coverage:
// an uninsured type is the count-zero case, one damage against nothing.
const assertDamagesWithinCover = (
  policy: Policy,
  incident: Incident,
): void => {
  const damagedTypes = incident.damages.map((damage) => damage.itemType);
  const insuredTypes = policy.items.map((item) => item.type);

  const overclaimed = damagedTypes.find(
    (type) =>
      countOfType(damagedTypes, type) > countOfType(insuredTypes, type),
  );

  // Tested against undefined rather than for truthiness: overclaimed is a
  // string, so a falsy-but-present "" type would slip past a bare truthiness
  // check. (assertQuotableItems above guards an OBJECT, where the two forms
  // coincide - the shapes look parallel but are not.)
  if (overclaimed !== undefined) {
    throw new Error(
      `claimed more ${overclaimed} damages than the policy insures`,
    );
  }
};

// Damage is something suffered, never something owed: a negative amount would
// invert the payout into a bill AND restore cover instead of consuming it.
// Zero is left alone - the spec rejects only negatives.
const assertNoNegativeDamages = (incident: Incident): void => {
  const negative = incident.damages.find((damage) => damage.amount < 0);

  if (negative) {
    throw new Error(`negative damage amount: ${negative.amount}`);
  }
};

const priceQuote = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => ({
  premium: roundPremiumInMhpcoFavor(quotePremium(step, customer, isFollowUp)),
});

export const runScenario = (scenario: Scenario): ScenarioResult => {
  // Policies are keyed by the step index of the quote that created them, which
  // is how claim steps reference them.
  const policies = new Map<number, Policy>();

  // The follow-up discount depends on how many QUOTES preceded this one, which
  // is not the step index once claim steps are interleaved.
  let quotesSoFar = 0;

  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy) as Policy;

      // The two claim-side validators are independent rules, and no test
      // pins their order: a claim that is BOTH negative and overclaimed
      // currently reports the negative amount only because that check runs
      // first. Either message would be correct, so the order is arbitrary -
      // recorded here so a future reordering is not mistaken for a fix.
      assertNoNegativeDamages(step.incident);
      assertDamagesWithinCover(policy, step.incident);

      return drawAgainstPolicy(policy, step.incident);
    }

    assertQuotableItems(step.items);
    policies.set(stepIndex, openPolicy(step.items));
    const isFollowUp = quotesSoFar > 0;
    quotesSoFar += 1;

    return priceQuote(step, scenario.customer, isFollowUp);
  });

  return { results };
};
