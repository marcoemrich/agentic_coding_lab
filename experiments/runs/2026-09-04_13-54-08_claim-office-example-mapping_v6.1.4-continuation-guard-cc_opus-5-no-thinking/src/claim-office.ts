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

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE_RATE = 0.1;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** Insurance values are independent of base premiums and of any premium modifier. */
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HALVING_THRESHOLD = 8;
const CLAIM_HALVING_RATE = 0.5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const sum = (amounts: number[]): number => amounts.reduce((total, amount) => total + amount, 0);

/** Premiums round up — in the MHPCO's favour. */
const roundUpToWholeG = (amount: number): number => Math.ceil(amount);

/** Payouts round down — also in the MHPCO's favour. */
const roundDownToWholeG = (amount: number): number => Math.floor(amount);

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  }
  return groups;
};

/**
 * A type is known only when BOTH tables define it. The tables stay separate
 * because pricing and cover are separate concepts that vary independently — the
 * block discount and the curse surcharge move premiums without moving the cap.
 * But a type defined in one table and not the other is a half-defined type, and
 * validating against either table alone would wave it through to become the
 * silent NaN this guard exists to prevent. Hence the intersection: a union, or
 * either table on its own, would not catch that.
 */
const KNOWN_ITEM_TYPES = new Set(
  Object.keys(BASE_PREMIUM_BY_TYPE).filter((type) => type in INSURANCE_VALUE_BY_TYPE),
);

const isKnownType = (type: string): boolean => KNOWN_ITEM_TYPES.has(type);

/** Guards the lookups, which would otherwise yield undefined and silently poison the arithmetic with NaN. */
const assertKnownTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const basePremiumForItem = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type];

/**
 * Components are priced per group of alike items, because a building block of
 * exactly 3 alike components earns a special rate. Main items price per item.
 */
const basePremiumForGroup = (type: string, group: Item[]): number => {
  if (COMPONENT_TYPES.includes(type) && group.length === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return sum(group.map(basePremiumForItem));
};

/** Item-specific surcharges apply to the affected item's own base premium. */
const ITEM_SURCHARGES: { applies: (item: Item) => boolean; rate: number }[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const itemSurchargeTotalFor = (item: Item): number =>
  sum(
    ITEM_SURCHARGES.filter(({ applies }) => applies(item)).map(
      ({ rate }) => basePremiumForItem(item) * rate,
    ),
  );

/**
 * Policy-wide modifiers are rates on the UNMODIFIED policy base premium — not
 * on the running total, and not on the item surcharges. Charging 10 % of a
 * cursed sword's 150 G rather than of its 100 G base is the mistake this
 * indirection exists to prevent.
 */
const policyModifierTotalFor = (policyBasePremium: number, rates: number[]): number =>
  sum(rates.map((rate) => policyBasePremium * rate));

/**
 * Discounts are negative rates, so the policy modifiers stay a single sum.
 *
 * The initial assessment surcharge is deliberately NOT in here: it is charged on
 * every policy, including a long-standing customer's follow-up contract, so it
 * depends on nothing about the customer.
 */
const customerModifierRatesFor = (customer: Customer): number[] =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? [-LOYALTY_DISCOUNT_RATE] : [];

/** The follow-up discount depends on scenario position, not on the customer. */
const policyModifierRatesFor = (customer: Customer, isFollowUpContract: boolean): number[] => [
  INITIAL_ASSESSMENT_SURCHARGE_RATE,
  ...customerModifierRatesFor(customer),
  ...(isFollowUpContract ? [-FOLLOW_UP_DISCOUNT_RATE] : []),
];

/**
 * The customer and the contract's position in the scenario are context, not
 * subject: they are named at the call site so a bare `true` never has to be
 * decoded back into "this is a follow-up contract".
 */
interface PolicyContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

const quotePremium = (items: Item[], { customer, isFollowUpContract }: PolicyContext): number => {
  assertKnownTypes(items);
  const policyBasePremium = sum(
    [...groupByType(items)].map(([type, group]) => basePremiumForGroup(type, group)),
  );
  const itemSurchargeTotal = sum(items.map(itemSurchargeTotalFor));
  const policyModifierTotal = policyModifierTotalFor(
    policyBasePremium,
    policyModifierRatesFor(customer, isFollowUpContract),
  );
  return roundUpToWholeG(
    policyBasePremium + itemSurchargeTotal + policyModifierTotal + PROCESSING_FEE,
  );
};

/** A policy created by a quote step; claims draw down its remaining cap. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

const openPolicy = (items: Item[]): Policy => {
  const insuranceSum = sum(items.map((item) => INSURANCE_VALUE_BY_TYPE[item.type]));
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

/**
 * The amount covered before the deductible, which depends on the damaged item.
 *
 * Two spec clauses reach this point. The 50 % high-enchantment clause is
 * checked first, so it wins when both would apply. Dragon material has NO
 * branch of its own: it reimburses in full, which is already the default, so a
 * branch for it would return exactly what the fallback returns. No input could
 * ever tell the two apart — including a dragon sword at enchantment 9, where
 * the halving clause takes precedence anyway. The rule is real but currently
 * indistinguishable from the default; give it a branch only once some clause
 * makes the default something other than full reimbursement.
 */
const coveredAmountFor = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= CLAIM_HALVING_THRESHOLD
    ? damage.amount * CLAIM_HALVING_RATE
    : damage.amount;

/**
 * A negative amount would yield a negative payout, and since the cap is drawn
 * down by the payout, it would INCREASE the remaining cover. Zero is left
 * alone: the spec calls out negatives only.
 */
const assertNonNegativeAmount = (amount: number): void => {
  if (amount < 0) {
    throw new Error(`damage amount must not be negative: ${amount}`);
  }
};

/** A damage and the specific insured item it was matched against. */
interface MatchedDamage {
  damage: Damage;
  damagedItem: Item;
}

/**
 * Resolves each damage into the DISTINCT insured item it will be paid against,
 * rejecting any damage that cannot be resolved.
 *
 * Validation is not split into a separate pass, because the three rejections are
 * one idea — this damage cannot become a payable pair — and one of them is only
 * observable mid-walk: exhausting the alike items is what detects too many
 * entries, so a pre-pass could not own that check without duplicating the
 * consuming match it depends on.
 *
 * Consuming is what makes the count meaningful: two sword damages against a
 * one-sword policy exhaust the swords and the second entry finds nothing, so
 * over-claiming is caught by the same mechanism that catches an uninsured type.
 *
 * Returning pairs rather than a bare item list keeps the correspondence in the
 * value: a parallel array would leave the caller re-deriving by index which
 * damage each item belongs to, and an index-zip is a correctness invariant no
 * type enforces.
 *
 * `unmatched` is mutated, but it is a private copy that never escapes this
 * function, so no caller can observe the mutation.
 */
const resolveDamages = (damages: Damage[], items: Item[]): MatchedDamage[] => {
  const unmatched = [...items];
  return damages.map((damage) => {
    assertNonNegativeAmount(damage.amount);
    const index = unmatched.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item is not insured: ${damage.itemType}`);
    }
    return { damage, damagedItem: unmatched.splice(index, 1)[0] };
  });
};

/** The deductible applies per damage event, after the clause. */
const reimbursementFor = ({ damage, damagedItem }: MatchedDamage): number =>
  coveredAmountFor(damage, damagedItem) - DEDUCTIBLE_PER_DAMAGE;

/**
 * Pure: returns the settlement WITHOUT drawing down the policy. The caller owns
 * the policy store and applies `remainingCap`, so a claim's effect on later
 * claims is visible at the call site rather than hidden in a shared reference.
 */
const settleClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const matchedDamages = resolveDamages(incident.damages, policy.items);
  const claimed = sum(matchedDamages.map(reimbursementFor));
  const payout = roundDownToWholeG(Math.min(claimed, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  /** Keyed by step index, because that is what a claim's `policy` refers to. */
  const policiesByStepIndex = new Map<number, Policy>();
  let quotesSoFar = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({
        premium: quotePremium(step.items, {
          customer: scenario.customer,
          isFollowUpContract: quotesSoFar > 0,
        }),
      });
      quotesSoFar += 1;
      policiesByStepIndex.set(stepIndex, openPolicy(step.items));
      return;
    }

    /**
     * `!` asserts the claim names a policy that exists. Nothing validates that
     * yet — a claim against an unknown step index throws an opaque TypeError.
     *
     * This is the last remaining non-null assertion, and it is deliberate. The
     * spec's error list covers an unknown item type in a quote, a damaged item
     * not in the policy, a negative amount, and too many damage entries — but
     * says nothing about a claim naming a step index that was never quoted. No
     * test, active or pending, reaches this line with a missing policy. Giving
     * it an error message now would be inventing a requirement the spec has not
     * stated; revisit if a test ever demands one.
     */
    const policy = policiesByStepIndex.get(step.policy)!;
    const settlement = settleClaim(policy, step.incident);
    /** Successive claims draw down one shared cap. */
    policiesByStepIndex.set(step.policy, {
      ...policy,
      remainingCap: settlement.remainingCap,
    });
    results.push(settlement);
  });

  return { results };
};
