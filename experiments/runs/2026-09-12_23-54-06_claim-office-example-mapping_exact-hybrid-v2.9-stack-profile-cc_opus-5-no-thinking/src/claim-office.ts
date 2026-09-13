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

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/**
 * What each item is insured FOR — distinct from its base premium above.
 * A block of 3 alike components discounts the premium only, never this sum.
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
const CAP_MULTIPLIER = 2;

/**
 * The spec states ONE rounding rule — "in the MHPCO's favour" — but it resolves
 * to OPPOSITE directions on the two sides of the ledger: money coming in rounds
 * up, money going out rounds down. Because that asymmetry is counterintuitive
 * for a single rule, the direction is in each NAME and not only in a comment:
 * a call site then reads as its own check, and a swapped `ceil`/`floor`
 * contradicts the name rather than merely contradicting prose.
 *
 * They are deliberately NOT unified behind one helper with a direction
 * parameter: the shape is shared but the knowledge is not, and a parameter
 * would restore exactly the opacity that naming these two things removes.
 */
const roundPremiumUp = (amount: number): number => Math.ceil(amount);

const roundPayoutDown = (amount: number): number => Math.floor(amount);

const policyCap = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0) *
  CAP_MULTIPLIER;

/** Damage to a very highly enchanted item is only half reimbursed. */
const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

/** The share of a damage amount the MHPCO reimburses, before the deductible. */
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

/**
 * Rejects a claim the policy cannot honour. Run BEFORE any payout arithmetic so
 * a rejected claim leaves the policy's remaining cap untouched — a negative
 * amount would otherwise REFUND cap, raising it above its start.
 *
 * Split from `damagedItems` because that name promised resolution while the
 * body also validated. The checks stay in ONE pass over `damages`, in this
 * order, because a claim with several faults reports the first fault of its
 * first offending ENTRY — reordering them, or checking one rule across all
 * entries before the next, would change which error a bad claim reports.
 *
 * Only negatives are rejected: the spec says nothing about an amount of 0.
 */
const assertClaimable = (incident: Incident, insuredItems: Item[]): void => {
  // Per-type COUNTS, not per-type identity: two sword damages are legitimate
  // against two insured swords but must be rejected against one.
  const insuredCounts = countByType(insuredItems);
  const claimedCounts = new Map<string, number>();

  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }

    const insured = insuredCounts.get(damage.itemType) ?? 0;
    // COVERAGE before MULTIPLICITY, and deliberately not folded into it. An
    // uncovered type has an insured count of 0, so the multiplicity check alone
    // would already reject it — but with the wrong description: "more damage
    // entries than insured items of type: amulet" is a confusing account of
    // "you claimed an amulet you never insured". Keeping this check first buys
    // the right sentence for each fault, and leaves the multiplicity message
    // to mean only what it says.
    if (insured === 0) {
      throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    }

    const claimed = (claimedCounts.get(damage.itemType) ?? 0) + 1;
    claimedCounts.set(damage.itemType, claimed);
    if (claimed > insured) {
      throw new Error(
        `More damage entries than insured items of type: ${damage.itemType}`,
      );
    }
  }
};

/**
 * Resolves each damage to the insured item it refers to. Assumes an already
 * validated claim, so every damage resolves.
 *
 * `find` rather than a hoisted `Map<type, Item>`: a map keeps only ONE item per
 * type, which would bury the known limitation that two swords at different
 * enchantments share the first's reimbursement rate. `find` leaves that visible
 * at the line a future spec example would have to change.
 */
const damagedItems = (incident: Incident, insuredItems: Item[]): Item[] =>
  incident.damages.map(
    (damage) =>
      insuredItems.find(
        (candidate) => candidate.type === damage.itemType,
      ) as Item,
  );

const claimPayout = (
  incident: Incident,
  insuredItems: Item[],
  remainingCap: number,
): number => {
  assertClaimable(incident, insuredItems);
  const items = damagedItems(incident, insuredItems);

  // Reimburse first, deduct second: a 1000 G damage at 50 % is 500 − 100 = 400,
  // not (1000 − 100) / 2 = 450.
  const reimbursed = incident.damages.reduce(
    (sum, damage, index) =>
      sum +
      damage.amount * reimbursementRate(items[index]) -
      DEDUCTIBLE_PER_DAMAGE,
    0,
  );
  // Rounded HERE, AFTER the cap clamp — the order is load-bearing, not
  // incidental. One integer then flows into both the reported payout and the cap
  // decrement; rounding before the clamp instead leaves a fraction in the
  // remaining cap even when the reported payout itself reads clean.
  return roundPayoutDown(Math.min(reimbursed, remainingCap));
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

/** A group of exactly 3 alike components is priced as one building block. */
const groupBasePremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const SURCHARGE_ENCHANTMENT_THRESHOLD = 5;

/**
 * Rates are SUMMED here and multiplied by the base premium once by the caller,
 * so two modifiers on one item are additive (0.5 + 0.3) rather than
 * compounding (× 1.5 × 1.3) — per the spec's integration example.
 */
const itemSurchargeRate = (item: Item): number => {
  const curseRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentRate =
    (item.enchantment ?? 0) >= SURCHARGE_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curseRate + highEnchantmentRate;
};

/**
 * Item-specific surcharges apply to the affected item's OWN base premium, so
 * they need a per-item pass — the grouping in `countByType` collapses both
 * `cursed` and `enchantment`.
 */
const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + BASE_PREMIUMS[item.type] * itemSurchargeRate(item),
    0,
  );

/**
 * Rejects items the MHPCO does not underwrite. Keyed off BASE_PREMIUMS, whose
 * key set is identical to INSURANCE_VALUES', so one check covers both lookups.
 * Throws rather than reporting: the CLI turns this into stderr + a non-zero
 * exit, keeping process concerns out of this module.
 */
const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

/** Is this contract a follow-up, i.e. not the customer's first in the run? */
const isFollowUpContract = (stepIndex: number): boolean => stepIndex > 0;

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  stepIndex: number,
): number => {
  assertKnownItemTypes(step.items);

  // Policy-scoped modifiers below are percentages of THIS total, never of a
  // running total — hence the explicit `policy` in the name: item surcharges
  // are percentages of each item's OWN base premium instead.
  const policyBasePremium = [...countByType(step.items)].reduce(
    (sum, [type, count]) => sum + groupBasePremium(type, count),
    0,
  );

  /**
   * A conditional policy-scoped modifier: a rate on the policy base premium,
   * applied only when it is due. The two users differ solely in rate and
   * predicate — and deliberately in their INPUT: loyalty reads the customer,
   * the follow-up discount reads the step's position. That difference in input
   * is why the terms stay separate in the sum below rather than collapsing
   * into one lumped "adjustments" subtotal.
   */
  const policyModifier = (rate: number, isDue: boolean): number =>
    isDue ? policyBasePremium * rate : 0;

  // Unconditional — every item in a quote counts as a first insurance — so it
  // does not go through `policyModifier`, which exists to gate a rate.
  const firstInsuranceSurcharge =
    policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = policyModifier(
    LOYALTY_DISCOUNT_RATE,
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
  );
  const followUpDiscount = policyModifier(
    FOLLOWUP_DISCOUNT_RATE,
    isFollowUpContract(stepIndex),
  );

  return (
    policyBasePremium +
    itemSurcharges(step.items) +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE
  );
};

/** A policy as it stands: what it covers, and how much cap it has left. */
interface PolicyState {
  items: Item[];
  remainingCap: number;
}

/**
 * Settles one claim against its policy's remaining cap, DECREMENTING that cap
 * in `policiesByStepIndex` — successive claims on one policy must each see the
 * previous one's decrement, so this is deliberately not a pure function.
 */
const claimResult = (
  step: ClaimStep,
  policiesByStepIndex: Map<number, PolicyState>,
): ClaimResult => {
  // PLACEHOLDER, not intended behaviour: a claim naming a policy that no quote
  // step created currently reads as an empty policy with zero cap, so it pays
  // out 0. Such a claim must be REJECTED; the pending dangling-policy test owns
  // replacing this.
  const policy = policiesByStepIndex.get(step.policy) ?? {
    items: [],
    remainingCap: 0,
  };
  const payout = claimPayout(step.incident, policy.items, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  policiesByStepIndex.set(step.policy, { ...policy, remainingCap });
  return { payout, remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  // Claim steps reference a policy by the index of the quote step that created
  // it, and the remaining cap persists across claims — so the steps cannot be
  // processed independently of one another. That cross-step state is why this
  // stays an explicit loop: a fold would have to carry both the result list and
  // this ledger in one accumulator, hiding the sequencing rather than showing it.
  const policiesByStepIndex = new Map<number, PolicyState>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      policiesByStepIndex.set(stepIndex, {
        items: step.items,
        remainingCap: policyCap(step.items),
      });
      results.push({
        premium: roundPremiumUp(
          quotePremium(step, scenario.customer, stepIndex),
        ),
      });
    } else {
      results.push(claimResult(step, policiesByStepIndex));
    }
  });

  return { results };
};
