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

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

/** Premiums round up: fractions of a Gold piece go to the MHPCO, never the customer. */
const roundPremiumInMHPCOFavour = (amount: number): number => Math.ceil(amount);

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const countsByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** Exactly three alike components form a building block, priced at a flat rate. */
const basePremiumForAlikeItems = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * BASE_PREMIUMS[type];

const policyBasePremium = (items: Item[]): number =>
  [...countsByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForAlikeItems(type, count),
    0,
  );

/**
 * Applies a rate to the amount it is measured against. Rates never compound:
 * premium modifiers all measure against the same base premium and are summed,
 * and a reimbursement rate measures against the damage amount.
 */
const amountOf = (rate: number, measuredAgainst: number): number => rate * measuredAgainst;

/** Item-specific surcharge rates stack additively on the item's own base premium. */
const surchargeRateFor = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE : 0) +
  ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE : 0);

/** Item-specific surcharges are rates on the affected item's own base premium. */
const itemSurchargeAmount = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + amountOf(surchargeRateFor(item), BASE_PREMIUMS[item.type]),
    0,
  );

/**
 * The facts a policy-wide rate is measured against. Rates key on different
 * things — loyalty on the customer's history, the assessment/follow-up rate on
 * where the quote falls in the scenario — so they travel together as context.
 */
interface PolicyContext {
  customer: Customer;
  /** Zero-based position of this quote among the scenario's quotes. */
  quoteOrdinal: number;
}

/** Policy-wide rates apply to the policy base premium; discounts are negative. */
const policyRateFor = ({ customer, quoteOrdinal }: PolicyContext): number =>
  INITIAL_ASSESSMENT_SURCHARGE +
  (customer.yearsWithMHPCO >= LOYALTY_YEARS ? -LOYALTY_DISCOUNT : 0) +
  (quoteOrdinal > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT : 0);

/** The MHPCO insures only what is on its price list. */
const requireInsurableItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`The MHPCO does not insure items of type ${item.type}`);
    }
  }
};

const quote = (step: QuoteStep, policy: PolicyContext): StepResult => {
  requireInsurableItems(step.items);
  const base = policyBasePremium(step.items);
  const modifiers = itemSurchargeAmount(step.items) + amountOf(policyRateFor(policy), base);
  return {
    premium: roundPremiumInMHPCOFavour(base + modifiers + PROCESSING_FEE),
  };
};

const isQuote = (step: Step): step is QuoteStep => step.op === "quote";

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;

/** Payouts round down: fractions of a Gold piece stay with the MHPCO. */
const roundPayoutInMHPCOFavour = (amount: number): number => Math.floor(amount);

const SEVERE_ENCHANTMENT_LEVEL = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT = 0.5;
const FULL_REIMBURSEMENT = 1;

/**
 * Damage to a heavily enchanted item is reimbursed at half its amount;
 * everything else — including the price list's dragon-material clause, which
 * grants full reimbursement — is reimbursed in full. Where both clauses apply
 * the half rate wins, so the enchantment level alone decides the rate.
 */
const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_LEVEL
    ? SEVERE_ENCHANTMENT_REIMBURSEMENT
    : FULL_REIMBURSEMENT;

const insuredCountOfType = (type: string, items: Item[]): number =>
  items.filter((item) => item.type === type).length;

const claimedCountOfType = (type: string, damages: Damage[]): number =>
  damages.filter((damage) => damage.itemType === type).length;

/**
 * A claim can run out of insured items either because the policy covers none of
 * that type at all, or because it covers fewer than the claim names.
 */
const overClaimMessage = (type: string, damages: Damage[], items: Item[]): string => {
  const insured = insuredCountOfType(type, items);
  if (insured === 0) return `Policy does not cover a ${type}`;
  return `Claim damages ${claimedCountOfType(type, damages)} ${type}s but the policy insures only ${insured} ${type}`;
};

/** A damage entry together with the specific insured item it claims against. */
interface ClaimedDamage {
  damage: Damage;
  item: Item;
}

/**
 * A damage entry names its item only by type, so pairing is positional within a
 * type: the policy may insure several items of one type, and each damage entry
 * claims against a distinct one. Pairing therefore happens for the damage list
 * as a whole — an item already claimed against is no longer available to the
 * next entry, which is what makes over-claiming detectable.
 */
const claimsAgainstInsuredItems = (damages: Damage[], items: Item[]): ClaimedDamage[] => {
  const unclaimed = [...items];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(overClaimMessage(damage.itemType, damages, items));
    return { damage, item: unclaimed.splice(index, 1)[0] };
  });
};

/** A policy issued by a quote step, tracking how much of its cap remains. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSum(items),
});

/** Every damage entry carries its own deductible, applied after any clause. */
const payoutForDamage = ({ damage, item }: ClaimedDamage): number =>
  amountOf(reimbursementRateFor(item), damage.amount) - DEDUCTIBLE_PER_DAMAGE;

/**
 * What the damages come to on their own, before the policy's cap limits it.
 * Rejects the claim if it damages more items of a type than the policy insures.
 */
const uncappedPayoutForClaim = (damages: Damage[], items: Item[]): number =>
  claimsAgainstInsuredItems(damages, items).reduce(
    (total, claimed) => total + payoutForDamage(claimed),
    0,
  );

/** A damage is a loss, never a gain: the MHPCO does not accept negative claims. */
const requireLosses = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount ${damage.amount} is not a loss`);
    }
  }
};

/**
 * Settling a claim pays out and draws the policy's cap down by that amount, so
 * it yields both the result and the policy as it stands afterwards.
 */
const settleClaim = (
  step: ClaimStep,
  policy: Policy,
): { result: StepResult; policy: Policy } => {
  requireLosses(step.incident.damages);
  const payout = Math.min(
    roundPayoutInMHPCOFavour(uncappedPayoutForClaim(step.incident.damages, policy.items)),
    policy.remainingCap,
  );
  const remainingCap = policy.remainingCap - payout;
  return { result: { payout, remainingCap }, policy: { ...policy, remainingCap } };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  /** A claim names its policy by the index of the quote step that opened it. */
  const policiesByQuoteStep = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (isQuote(step)) {
      const context = {
        customer: scenario.customer,
        quoteOrdinal: policiesByQuoteStep.size,
      };
      policiesByQuoteStep.set(index, openPolicy(step.items));
      return quote(step, context);
    }
    const policy = policiesByQuoteStep.get(step.policy);
    if (!policy) throw new Error(`No policy created by step ${step.policy}`);
    const settled = settleClaim(step, policy);
    policiesByQuoteStep.set(step.policy, settled.policy);
    return settled.result;
  });
  return { results };
};
