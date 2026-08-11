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

export type Damage = {
  itemType: string;
  amount: number;
};

export type ClaimStep = {
  op: "claim";
  /** Zero-based index of the quote step that created the policy. */
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ScenarioResult = {
  results: unknown[];
};

const PROCESSING_FEE = 5;

/**
 * Intermediate amounts are kept as fractions, so a total that should be exact can
 * carry binary-floating-point noise. Discarding digits well beyond any real amount
 * of G recovers the intended value before rounding.
 */
const SIGNIFICANT_DECIMALS = 6;
const withoutFloatNoise = (amount: number): number => Number(amount.toFixed(SIGNIFICANT_DECIMALS));

/** Premiums round up — in the MHPCO's favour. */
const roundUpToWholeG = (amount: number): number => Math.ceil(withoutFloatNoise(amount));

/** The item types the MHPCO will insure, and what each costs to cover. */
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** The MHPCO declines to quote for anything outside its price list. */
export class UninsurableItemError extends Error {
  constructor(type: string) {
    super(`The MHPCO does not insure items of type "${type}"`);
    this.name = "UninsurableItemError";
  }
}

/**
 * Reads an item type out of one of the MHPCO's price lists. A type the list does not
 * name is a type the MHPCO does not insure, whichever list is being consulted.
 */
const requireInsurable =
  (priceList: Record<string, number>) =>
  (type: string): number => {
    const price = priceList[type];
    if (price === undefined) throw new UninsurableItemError(type);
    return price;
  };

/** Premium for a single item of this type. */
const unitPremiumFor = requireInsurable(BASE_PREMIUMS);

/** Component types that form discounted blocks. */
const BLOCK_FORMING_COMPONENTS = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const formsComponentBlock = (type: string, count: number): boolean =>
  BLOCK_FORMING_COMPONENTS.has(type) && count === COMPONENT_BLOCK_SIZE;

/** How many items of each type the policy covers. */
const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

/** Alike components form a discounted block; everything else is priced per unit. */
const basePremiumForGroup = (type: string, count: number): number =>
  formsComponentBlock(type, count)
    ? COMPONENT_BLOCK_PREMIUM
    : count * unitPremiumFor(type);

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForGroup(type, count),
    0,
  );

/** A modifier that applies to some subject, contributing a rate when it does. */
type ModifierRule<Subject> = { applies: (subject: Subject) => boolean; rate: number };

/** Modifier rates stack additively — at both the item and the policy level. */
const sumApplicableRates = <Subject>(
  rules: ModifierRule<Subject>[],
  subject: Subject,
): number =>
  rules.reduce((total, rule) => (rule.applies(subject) ? total + rule.rate : total), 0);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

/** Each risk an item can carry, and the surcharge rate it attracts. */
const ITEM_SURCHARGE_RULES: ModifierRule<Item>[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

/** Item-level surcharge rates stack additively on one item. */
const surchargeRateFor = (item: Item): number =>
  sumApplicableRates(ITEM_SURCHARGE_RULES, item);

/**
 * Item-level surcharges apply to the affected item's own base premium, not to
 * the policy total.
 */
const itemSurchargeTotal = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + unitPremiumFor(item.type) * surchargeRateFor(item),
    0,
  );

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

/** A quote in the context of the customer's history with the MHPCO. */
type Contract = {
  customer: Customer;
  /** How many contracts this customer already held when this quote was made. */
  precedingContracts: number;
};

/** Each policy-level modifier, and the rate it contributes. Discounts are negative. */
const POLICY_MODIFIER_RULES: ModifierRule<Contract>[] = [
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: -LOYALTY_DISCOUNT_RATE,
  },
  // Every quote insures its items for the first time, whatever the customer's history.
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE_RATE },
  {
    applies: ({ precedingContracts }) => precedingContracts > 0,
    rate: -FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
  },
];

/**
 * Policy-level modifiers are percentages of the policy base premium and stack
 * additively, per the MHPCO's worked examples.
 */
const policyModifierRate = (contract: Contract): number =>
  sumApplicableRates(POLICY_MODIFIER_RULES, contract);

/**
 * Every modifier is a percentage of a base premium, and they are summed as flat
 * amounts rather than compounded: item surcharges are percentages of the affected
 * item's own base premium, policy modifiers percentages of the policy base premium
 * (the sum of all item base premiums, before any surcharge).
 */
const quotePremium = (items: Item[], contract: Contract): number => {
  const policyBase = policyBasePremium(items);
  const policyModifiers = policyBase * policyModifierRate(contract);
  const total = policyBase + itemSurchargeTotal(items) + policyModifiers + PROCESSING_FEE;
  return roundUpToWholeG(total);
};

/** What each item type contributes to a policy's insurance sum. */
const INSURED_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/** Payouts round down — in the MHPCO's favour. */
const roundDownToWholeG = (amount: number): number => Math.floor(withoutFloatNoise(amount));

/** A policy created by a quote step, tracked across the claims made against it. */
type Policy = {
  items: Item[];
  remainingCap: number;
};

const insuredValueFor = requireInsurable(INSURED_VALUE_BY_TYPE);

/**
 * The insurance sum is the plain sum of insured values — block discounts and premium
 * modifiers affect what the policy costs, never what it covers.
 */
const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuredValueFor(item.type), 0);

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
});

/** The MHPCO pays only for what a policy actually covers. */
export class UncoveredDamageError extends Error {
  constructor(itemType: string) {
    super(`The policy does not cover an item of type "${itemType}"`);
    this.name = "UncoveredDamageError";
  }
}

/** The MHPCO does not entertain damage reports for negative amounts. */
export class InvalidDamageAmountError extends Error {
  constructor(amount: number) {
    super(`A damage amount cannot be negative, but was ${amount}`);
    this.name = "InvalidDamageAmountError";
  }
}

/** A damage the MHPCO is willing to look at, or no damage at all. */
const requireReportable = (damage: Damage): Damage => {
  if (damage.amount < 0) throw new InvalidDamageAmountError(damage.amount);
  return damage;
};

/** A damage and the specific insured item it was matched against. */
type MatchedDamage = { damage: Damage; item: Item };

/**
 * Pairs each reported damage with the insured item it refers to, rejecting anything
 * the MHPCO will not settle. Every damage consumes a distinct item, so a policy
 * covering one sword cannot absorb two sword damages.
 */
const matchDamagesToItems = (policy: Policy, damages: Damage[]): MatchedDamage[] => {
  const unclaimed = [...policy.items];

  return damages.map((reported) => {
    const damage = requireReportable(reported);
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new UncoveredDamageError(damage.itemType);
    return { damage, item: unclaimed.splice(index, 1)[0] };
  });
};

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

/**
 * How much of the damage the MHPCO reimburses, before the deductible. Claim clauses
 * do not stack the way premium modifiers do — the strongest applicable clause decides
 * the rate on its own.
 */
const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

/** A deductible applies once per damaged item, and never turns a payout negative. */
const payoutForDamage = ({ damage, item }: MatchedDamage): number =>
  Math.max(0, damage.amount * reimbursementRateFor(item) - DEDUCTIBLE_PER_DAMAGE);

/**
 * Settling a claim yields both the payout and the policy as it stands afterwards —
 * each claim eats into the cap available to the next one.
 */
const settleClaim = (
  policy: Policy,
  damages: Damage[],
): { settlement: { payout: number; remainingCap: number }; policy: Policy } => {
  const uncappedPayout = matchDamagesToItems(policy, damages).reduce(
    (total, matched) => total + payoutForDamage(matched),
    0,
  );
  const payout = roundDownToWholeG(Math.min(uncappedPayout, policy.remainingCap));
  const remainingCap = policy.remainingCap - payout;
  return { settlement: { payout, remainingCap }, policy: { ...policy, remainingCap } };
};

/**
 * The policies a scenario has opened so far, keyed by the index of the quote step
 * that opened them — which is how claim steps refer back to them.
 */
type PolicyRegister = Map<number, Policy>;

/** A quote opens a policy, priced against the contracts the customer already holds. */
const quoteStepResult = (
  step: QuoteStep,
  stepIndex: number,
  register: PolicyRegister,
  customer: Customer,
) => {
  const precedingContracts = register.size;
  register.set(stepIndex, openPolicy(step.items));
  return { premium: quotePremium(step.items, { customer, precedingContracts }) };
};

/** A claim settles against its policy and leaves that policy with less cap. */
const claimStepResult = (step: ClaimStep, register: PolicyRegister) => {
  const { settlement, policy } = settleClaim(
    register.get(step.policy)!,
    step.incident.damages,
  );
  register.set(step.policy, policy);
  return settlement;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const register: PolicyRegister = new Map();

  const results = scenario.steps.map((step, index) =>
    step.op === "claim"
      ? claimStepResult(step, register)
      : quoteStepResult(step, index, register, scenario.customer),
  );

  return { results };
};
