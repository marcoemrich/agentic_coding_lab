/*
 * Rounding — a single rule with two faces.
 *
 * Money is only ever settled in whole gold pieces, and a fraction of a gold
 * piece always falls to MHPCO. Which way that rounds depends on who is paying:
 * a premium the customer owes rounds up, a payout MHPCO owes rounds down.
 * Both functions below are that one rule; keep them together so a change of
 * heart about it is a change in one place.
 */

/** Premiums are rounded up — the fraction falls to MHPCO. */
const roundPremiumUp = (amount: number): number => Math.ceil(amount);

/** Payouts are rounded down — the fraction stays with MHPCO. */
const roundPayoutDown = (amount: number): number => Math.floor(amount);

/** How many of each kind, where `kindOf` says what kind a value is. */
const countByKind = <T>(
  values: T[],
  kindOf: (value: T) => string,
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const kind = kindOf(value);
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }
  return counts;
};

export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteStep = { op: string; items: Item[] };

export type Damage = { itemType: string; amount: number };

export type Incident = { cause: string; damages: Damage[] };

export type ClaimStep = { op: string; policy: number; incident: Incident };

export type Step = QuoteStep | ClaimStep;

export type Item = { type: string } & Record<string, unknown>;

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };

export type Result = QuoteResult | ClaimResult;

export type ScenarioOutcome = { results: Result[] };

// ---------------------------------------------------------------------------
// Quoting — what a policy costs the customer.
// ---------------------------------------------------------------------------

/** Base premium of each insurable item type. */
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** A block is exactly this many items of one and the same type. */
const BLOCK_SIZE = 3;

/** Special base premium charged for a complete block, instead of the per-item sum. */
const BLOCK_BASE_PREMIUM = 60;

/** Number of items of each type on a policy. */
const countItemsByType = (items: Item[]): Map<string, number> =>
  countByKind(items, (item) => item.type);

/**
 * Base premium of a single item of the given type, before block pricing or
 * surcharge. A type MHPCO does not insure has no base premium, so this throws
 * rather than inventing one — an unpriceable item must not silently become a
 * NaN premium.
 *
 * This is also the only place a quote checks that a type is insurable at all.
 * Every item reaches it via the surcharge pass, which prices items one by one;
 * the block path in `groupBasePremium` skips the lookup, so it alone would let
 * a complete block of an unknown type through.
 */
const basePremiumOfType = (type: string): number => {
  const basePremium = BASE_PREMIUM_BY_TYPE[type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
};

/** Base premium for all items of one and the same type. */
const groupBasePremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremiumOfType(type);

/** Base premium of a policy covering the given items. */
const calculateBasePremium = (items: Item[]): number =>
  [...countItemsByType(items)].reduce(
    (total, [type, count]) => total + groupBasePremium(type, count),
    0,
  );

/** Risk surcharge charged on the base premium of a cursed item. */
const CURSE_RATE = 0.5;

/** Enchantment level from which an item counts as highly enchanted. */
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Risk surcharge charged on the base premium of a highly enchanted item. */
const HIGH_ENCHANTMENT_RATE = 0.3;

/** True when the item is enchanted strongly enough to attract the surcharge. */
const isHighlyEnchanted = (item: Item): boolean =>
  typeof item.enchantment === "number" &&
  item.enchantment >= HIGH_ENCHANTMENT_LEVEL;

/** Combined rate of the surcharges an item attracts. */
const itemSurchargeRate = (item: Item): number => {
  const curseRate = item.cursed ? CURSE_RATE : 0;
  const enchantmentRate = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RATE : 0;
  return curseRate + enchantmentRate;
};

/** Surcharges an individual item attracts, charged on its own base premium. */
const itemSurcharges = (item: Item): number =>
  basePremiumOfType(item.type) * itemSurchargeRate(item);

/** Surcharges that attach to individual items rather than to the whole policy. */
const calculateItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

/** Initial assessment surcharge on a customer's first insurance. */
const FIRST_INSURANCE_RATE = 0.1;

/** Years of business from which a customer counts as long-standing. */
const LOYALTY_YEARS = 2;

/** Discount a long-standing customer receives on the policy base premium. */
const LOYALTY_RATE = -0.2;

/** True when the customer has been with MHPCO long enough to earn the discount. */
const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

/** Discount on every contract after the customer's first. */
const FOLLOW_UP_RATE = -0.15;

/** True when this is not the customer's first contract. */
const isFollowUpContract = (
  _customer: Customer,
  previousContracts: number,
): boolean => previousContracts > 0;

/**
 * Rates that attach to the policy as a whole. Each applies to the policy base
 * premium; positive rates are surcharges, negative ones discounts.
 */
const POLICY_RATES: {
  rate: number;
  applies: (customer: Customer, previousContracts: number) => boolean;
}[] = [
  { rate: FIRST_INSURANCE_RATE, applies: () => true },
  { rate: LOYALTY_RATE, applies: isLongStanding },
  { rate: FOLLOW_UP_RATE, applies: isFollowUpContract },
];

/** Net of every policy-wide rate the customer qualifies for. */
const policyRate = (customer: Customer, previousContracts: number): number =>
  POLICY_RATES.reduce(
    (total, { rate, applies }) =>
      applies(customer, previousContracts) ? total + rate : total,
    0,
  );

/** Net policy-wide adjustment, charged on the policy base premium. */
const calculatePolicyAdjustment = (
  policyBasePremium: number,
  customer: Customer,
  previousContracts: number,
): number => policyBasePremium * policyRate(customer, previousContracts);

/** Flat fee added to every premium, regardless of the items insured. */
const PROCESSING_FEE = 5;

/** Price a policy covering the given items. */
const quotePremium = (
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number => {
  const policyBasePremium = calculateBasePremium(items);
  const surcharges = calculateItemSurcharges(items);
  const policyAdjustment = calculatePolicyAdjustment(
    policyBasePremium,
    customer,
    previousContracts,
  );
  return roundPremiumUp(
    policyBasePremium + surcharges + policyAdjustment + PROCESSING_FEE,
  );
};

// ---------------------------------------------------------------------------
// Claims — what a policy pays out when insured items are damaged.
// ---------------------------------------------------------------------------

/** Sum insured for each item type, per the MHPCO price list. */
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

/** Excess the claimant bears on every damaged item. */
const DEDUCTIBLE = 100;

/** A policy pays out at most this multiple of its insurance sum. */
const CAP_MULTIPLIER = 2;

/** Total sum insured under a policy covering the given items. */
const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_TYPE[item.type], 0);

/** Enchantment level from which damage is only partly reimbursed. */
const REDUCED_REIMBURSEMENT_LEVEL = 8;

/** Share of the damage MHPCO reimburses on a heavily enchanted item. */
const REDUCED_REIMBURSEMENT_RATE = 0.5;

/** Share of the damage MHPCO reimburses for the given insured item. */
const reimbursementRate = (item: Item): number =>
  typeof item.enchantment === "number" &&
  item.enchantment >= REDUCED_REIMBURSEMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_RATE
    : 1;

/** What MHPCO owes for a single damaged item, before the cap is considered. */
const damagePayout = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRate(item) - DEDUCTIBLE;

/** A quoted policy, tracked so later claim steps can draw against its cap. */
type Policy = { items: Item[]; remainingCap: number };

/** The policy a quote step establishes, with its cap untouched. */
const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSum(items),
});

/**
 * The insured item a damage entry refers to.
 *
 * Throws when the policy covers no item of that type. Note this is a different
 * kind of failure from `basePremiumOfType`'s: that one rejects a type MHPCO
 * insures for nobody, this one rejects a type merely absent from *this*
 * contract.
 *
 * A previous refactor guessed these two messages only looked alike by accident;
 * the later rejections settled it. Of the four throws in this file, two name an
 * offending value (`"<reason>: <value>"`) and two do not —
 * `rejectMoreDamagesThanInsuredItems` reports a count mismatch, which has no
 * single value to name. Four throws, four sentences, no shared shape worth
 * factoring out — they stay separate inline throws until some caller actually
 * needs to tell error kinds apart programmatically.
 */
const damagedItem = (policy: Policy, damage: Damage): Item => {
  const item = policy.items.find((item) => item.type === damage.itemType);
  if (item === undefined) {
    throw new Error(
      `Damaged item not covered by the policy: ${damage.itemType}`,
    );
  }
  return item;
};

/**
 * What MHPCO owes for one damage entry under the given policy: the entry is
 * matched to the insured item it refers to, and that item's clauses decide how
 * much of the damage is reimbursed.
 */
const policyDamagePayout = (policy: Policy, damage: Damage): number =>
  damagePayout(damage, damagedItem(policy, damage));

/** Number of damage entries naming each item type. */
const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countByKind(damages, (damage) => damage.itemType);

/**
 * Rejects an incident that reports more damaged items of a type than the policy
 * insures. Each insured item may be damaged once per incident, so a second
 * sword entry on a one-sword policy is a claim for an item that does not exist.
 *
 * This and `rejectNegativeDamageAmounts` are deliberately left as two calls in
 * `handleClaim` rather than composed behind one `rejectInvalidIncident`. A
 * wrapper would take `policy` purely to forward it to this one of its two
 * callees, and would replace two precise names at the claim's entry with one
 * vaguer one. Two calls are not a list. Revisit if a third validator appears.
 */
const rejectMoreDamagesThanInsuredItems = (
  incident: Incident,
  policy: Policy,
): void => {
  const insuredCounts = countItemsByType(policy.items);
  for (const [itemType, damaged] of countDamagesByType(incident.damages)) {
    if (damaged > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(
        `More ${itemType} damages than insured items of that type`,
      );
    }
  }
};

/**
 * Rejects an incident reporting damage of a negative amount.
 *
 * Checked before `rejectMoreDamagesThanInsuredItems`: a negative amount is a
 * malformed entry, whereas a count mismatch is a well-formed claim for an item
 * that does not exist. Saying "more swords damaged than insured" about a list
 * whose entries are not valid damage reports puts the complaint in the wrong
 * place. An incident violating both rules is therefore reported as negative
 * first — no test pins this, so it rests on that reading alone.
 */
const rejectNegativeDamageAmounts = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
};

/** What MHPCO owes for an entire incident, before the cap is considered. */
const grossIncidentPayout = (incident: Incident, policy: Policy): number =>
  incident.damages.reduce(
    (total, damage) => total + policyDamagePayout(policy, damage),
    0,
  );

/**
 * Draws an amount owed against the policy's cap. A policy never pays out more
 * than the cap it has left, so the amount drawn is whichever is smaller.
 */
const drawAgainstCap = (policy: Policy, amountOwed: number): number => {
  const drawn = Math.min(roundPayoutDown(amountOwed), policy.remainingCap);
  policy.remainingCap -= drawn;
  return drawn;
};

// ---------------------------------------------------------------------------
// Running a scenario — quote steps open policies, claim steps draw on them.
// ---------------------------------------------------------------------------

/** True when the step reports damage against a policy rather than asking for a price. */
const isClaimStep = (step: Step): step is ClaimStep => step.op === "claim";

export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;

  const handleQuote = (step: QuoteStep, stepIndex: number): QuoteResult => {
    const premium = quotePremium(
      step.items,
      scenario.customer,
      previousContracts,
    );
    previousContracts += 1;
    policies.set(stepIndex, openPolicy(step.items));
    return { premium };
  };

  const handleClaim = (step: ClaimStep): ClaimResult => {
    /*
     * `!` because a claim step is assumed to name a quote step that ran before
     * it. An out-of-range `policy` index makes this `undefined` and the next
     * line throws a TypeError from inside the domain — a loud failure with an
     * unhelpful message, which the CLI still reports as a non-zero exit.
     *
     * Left deliberately unguarded. The specification lists four error cases and
     * this is not among them, so a guard would have to invent a message and a
     * rejection point that nothing pins — and it would make a third validator
     * beside the two below, whose comment argues that two calls are not a list.
     * Considered and declined, not overlooked: add the guard if and when a
     * specified behaviour asks for it, and revisit that comment when you do.
     */
    const policy = policies.get(step.policy)!;
    rejectNegativeDamageAmounts(step.incident);
    rejectMoreDamagesThanInsuredItems(step.incident, policy);
    const payout = drawAgainstCap(
      policy,
      grossIncidentPayout(step.incident, policy),
    );
    return { payout, remainingCap: policy.remainingCap };
  };

  const results = scenario.steps.map((step, stepIndex): Result =>
    isClaimStep(step) ? handleClaim(step) : handleQuote(step, stepIndex),
  );

  return { results };
};
