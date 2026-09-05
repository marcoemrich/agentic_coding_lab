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

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

// ---------------------------------------------------------------------------
// Shared arithmetic — used by both the premium and the claim side.
// ---------------------------------------------------------------------------

// Percentages MUST go through this helper. Multiplying first and dividing by
// 100 afterwards keeps the arithmetic drift-free; the tempting `amount * 0.5`
// (or `* 1.1`) introduces binary-fraction error — 100 * 1.1 yields
// 110.00000000000001 — and since the spec rounds premiums UP at the very end
// that drift becomes a whole extra G.
const PERCENT_WHOLE = 100;
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_WHOLE;

// Money adds up the same way everywhere in this module — over items, over
// damages, over per-type groups. Naming the fold once keeps each call site
// about WHAT is being totalled rather than re-deriving how a sum is spelled.
const sumOf = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((total, value) => total + amountOf(value), 0);

// Both sides of the business tally things by type — the premium side groups
// items to find blocks, the claim side groups damages to check them against
// what is insured. The two differ only in WHICH field names the type
// (`type` on an Item, `itemType` on a Damage), so that is the parameter.
const tallyByType = <T>(values: T[], typeOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const type = typeOf(value);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  return counts;
};

// Each item-level surcharge is "a percentage of this item's base premium, or
// nothing at all", so the condition is the only part that varies.
const percentOfWhen = (applies: boolean, amount: number, percent: number): number =>
  applies ? percentOf(amount, percent) : 0;

// The MHPCO rounds in its own favour. That is ONE rule, but "its favour" points
// in opposite directions on the two sides of the business: a premium is money
// coming in, so a fraction rounds UP; a payout is money going out, so a fraction
// rounds DOWN. Naming both halves keeps the rule greppable and stops either call
// site from reading as an arbitrary choice of Math.ceil over Math.floor.
// They are deliberately two functions rather than one with a direction flag:
// `roundInMhpcosFavour(total, UP)` would hide at the call site exactly what the
// reader came there to learn.
const roundPremiumInMhpcosFavour = (amount: number): number => Math.ceil(amount);
const roundPayoutInMhpcosFavour = (amount: number): number => Math.floor(amount);

// ---------------------------------------------------------------------------
// Premium side — quoting a policy.
// ---------------------------------------------------------------------------

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_PERCENT = 10;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const countByType = (items: Item[]): Map<string, number> =>
  tallyByType(items, ({ type }) => type);

// Priced per GROUP of alike items, not per item: a group of exactly BLOCK_SIZE
// buys the flat block rate instead of the unit price. Deliberately not named
// after BASE_PREMIUMS[type] — that constant is the unit price, this is the
// group's premium, and conflating the two is what the block rule invites.
const premiumForAlikeGroup = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];

const policyBasePremium = (items: Item[]): number =>
  sumOf([...countByType(items)], ([type, count]) => premiumForAlikeGroup(type, count));

const CURSE_PERCENT = 50;

const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurcharge = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type];
  const curseSurcharge = percentOfWhen(item.cursed === true, base, CURSE_PERCENT);
  const highEnchantmentSurcharge = percentOfWhen(
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    base,
    HIGH_ENCHANTMENT_PERCENT,
  );

  return curseSurcharge + highEnchantmentSurcharge;
};

const itemSurcharges = (items: Item[]): number => sumOf(items, itemSurcharge);

// Every modifier is a percentage of a base premium, and they are SUMMED rather
// than compounded: the spec's worked example reads
// "100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G",
// so the first-insurance 10 % is taken on the policy base, not on the
// curse-inflated amount.
const LOYALTY_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;

const FOLLOW_UP_PERCENT = 15;

// Rejections surface as exceptions; the CLI turns them into a non-zero exit
// and a stderr line.
const rejectUnknownTypes = (items: Item[]): void => {
  for (const { type } of items) {
    if (!(type in BASE_PREMIUMS)) throw new Error(`The MHPCO does not insure a ${type}.`);
  }
};

const quote = ({ items }: QuoteStep, customer: Customer, isFollowUp: boolean): StepResult => {
  rejectUnknownTypes(items);

  const policyBase = policyBasePremium(items);

  // Surcharges add to the policy base, discounts subtract from it. Both are
  // percentages OF THE POLICY BASE (never of each other) — see the note above.
  const firstInsuranceSurcharge = percentOf(policyBase, FIRST_INSURANCE_PERCENT);
  const loyaltyDiscount = percentOfWhen(
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    policyBase,
    LOYALTY_PERCENT,
  );

  const followUpDiscount = percentOfWhen(isFollowUp, policyBase, FOLLOW_UP_PERCENT);

  const surcharges = itemSurcharges(items) + firstInsuranceSurcharge;
  const discounts = loyaltyDiscount + followUpDiscount;
  const total = policyBase + surcharges - discounts + PROCESSING_FEE;

  return { premium: roundPremiumInMhpcosFavour(total) };
};

// ---------------------------------------------------------------------------
// Claim side — settling a payout against an open policy.
// ---------------------------------------------------------------------------

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

// The cap is a multiple of the INSURED values of the items — the unit values,
// untouched by anything that moved the premium (block rate, curse, loyalty).
const insuranceSum = (items: Item[]): number =>
  sumOf(items, ({ type }) => INSURANCE_VALUES[type]);

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSum(items),
});

// Settling a claim both answers the step and moves the policy on: successive
// claims draw down the same cap. Rather than writing through the caller's
// Policy, `claim` returns the policy it leaves behind, so the depletion is
// visible at the one place that owns the registry.
// The claim-side enchantment threshold (8) is deliberately NOT the premium-side
// one (5): a sword can be enchanted enough to cost more to insure without being
// enchanted enough to have its damage halved.
const HALVED_REIMBURSEMENT_THRESHOLD = 8;
const HALVED_REIMBURSEMENT_PERCENT = 50;

// How much of a damage amount the policy covers, BEFORE the deductible — the
// caller subtracts that. Special clauses are written as guards in precedence
// order: the first one that matches decides, so a clause that must win over
// another is simply written above it.
const coveredAmount = (damage: Damage, item: Item): number => {
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HALVED_REIMBURSEMENT_THRESHOLD;
  if (isHighlyEnchanted) return percentOf(damage.amount, HALVED_REIMBURSEMENT_PERCENT);

  return damage.amount;
};

// What a single damage entry is worth on its own: the covered amount that the
// item's clauses allow, less the deductible that every damaged item carries.
// Takes the already-resolved item rather than finding it: by the time any
// arithmetic runs, `resolveDamagedItems` has established that every damage has
// an item, so there is no absent case left for this function to answer for.
const payoutForDamage = (damage: Damage, item: Item): number =>
  coveredAmount(damage, item) - DEDUCTIBLE;

// The two limits the incident total is squeezed between, named so each call site
// says which way it bites rather than leaving the reader to decode a bare
// Math.max/Math.min. Both are floors and ceilings on the SAME quantity, applied
// in this order: nothing below zero, nothing above what the cap still holds.
const neverBelowZero = (amount: number): number => Math.max(0, amount);
const neverAboveRemainingCap = (amount: number, remainingCap: number): number =>
  Math.min(amount, remainingCap);

// Rejected outright rather than left to the payout's zero floor, which would
// quietly turn a nonsensical claim into a payout of nothing.
const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const { itemType, amount } of damages) {
    if (amount < 0) {
      throw new Error(`A ${itemType} cannot suffer a negative damage of ${amount} G.`);
    }
  }
};

// A policy answers only for what it insures. Pairs each damage with the item it
// hits, rejecting the whole claim if any damage has no such item.
//
// Hoisted out of the payout arithmetic to sit with its sibling guards: "the
// whole claim is rejected, never partially paid" is a claim-level contract, and
// running every rejection up front is what makes that structural rather than a
// consequence of which order the payout fold happens to visit entries in.
// Returning the pairs rather than void is what lets the guard move here AND
// keeps the arithmetic cast-free — "the item is present" is carried in the
// return type instead of re-asserted downstream with `as Item`.
const resolveDamagedItems = (damages: Damage[], items: Item[]): [Damage, Item][] =>
  damages.map((damage) => {
    const item = items.find(({ type }) => type === damage.itemType);
    if (!item) throw new Error(`This policy does not cover a ${damage.itemType}.`);

    return [damage, item];
  });

// A policy insuring one sword cannot answer for two damaged swords. The whole
// claim is rejected rather than paid in part.
const rejectOverCountedDamages = (damages: Damage[], items: Item[]): void => {
  const insured = countByType(items);

  for (const [itemType, claimed] of tallyByType(damages, ({ itemType }) => itemType)) {
    if (claimed > (insured.get(itemType) ?? 0)) {
      throw new Error(`This policy does not cover ${claimed} items of type ${itemType}.`);
    }
  }
};

const claim = (
  { incident }: ClaimStep,
  policy: Policy,
): { result: StepResult; policy: Policy } => {
  // Every way a claim can be rejected outright, all of them before any payout
  // arithmetic runs — a rejected claim is never partially paid. Order matters
  // between the last two: a damage to a type the policy does not insure at all
  // must report exactly that, rather than being caught by the over-count guard
  // as "0 insured, 1 claimed" and misreported as a miscount.
  rejectNegativeAmounts(incident.damages);
  const damagedItems = resolveDamagedItems(incident.damages, policy.items);
  rejectOverCountedDamages(incident.damages, policy.items);

  // Per-damage amounts stay fractional: the rounding wraps the SUMMED total, not
  // each entry, and happens before the cap clamp below so remainingCap stays whole.
  const incidentTotal = roundPayoutInMhpcosFavour(
    sumOf(damagedItems, ([damage, item]) => payoutForDamage(damage, item)),
  );

  // A damage below the deductible pays nothing; the MHPCO is stingy, not a
  // debt collector. Only the TOTAL is held at zero — whether a below-deductible
  // entry should offset a sibling entry in the same incident is unspecified.
  const claimable = neverBelowZero(incidentTotal);

  // The policy pays at most what is left of its cap; the excess is simply lost.
  const payout = neverAboveRemainingCap(claimable, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;

  return { result: { payout, remainingCap }, policy: { ...policy, remainingCap } };
};

// The follow-up discount is about contract number, so only quote steps count —
// interleaved claim steps must not make the next quote look like a follow-up.
const isFollowUpQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some((earlier) => earlier.op === "quote");

// A claim cites the step index of the quote that opened its policy. A well-formed
// scenario always cites one that exists, so this is not one of the spec's four
// rejections — but saying so costs a line and buys an honest message. The
// alternative, `policies.get(index) as Policy`, makes the same claim by assertion
// and pays for it downstream: the reader gets "Cannot read properties of
// undefined", which is machinery, exactly what the CLI promises never to print.
const policyCited = (policies: Map<number, Policy>, index: number): Policy => {
  const policy = policies.get(index);
  if (!policy) throw new Error(`No policy was quoted at step ${index}.`);

  return policy;
};

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  // Policies opened by quote steps, keyed by the step index a later claim cites.
  // Claims draw the cap down, so this registry is the one piece of carried state.
  const policies = new Map<number, Policy>();

  const results = steps.map((step, index) => {
    if (step.op === "quote") {
      policies.set(index, openPolicy(step.items));

      return quote(step, customer, isFollowUpQuote(steps, index));
    }

    const settled = claim(step, policyCited(policies, step.policy));
    policies.set(step.policy, settled.policy);

    return settled.result;
  });

  return { results };
};
