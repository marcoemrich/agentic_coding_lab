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

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_DISCOUNT = -0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = -0.15;
/** Levied on every quote, not only the customer's first — see the policy-wide modifier rules. */
const INITIAL_ASSESSMENT_SURCHARGE = 0.1;

/** The MHPCO price list; only the types pinned down by tests so far. */
const BASE_PREMIUMS: Record<string, number | undefined> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** What each item is insured for; distinct from what it costs to insure. */
const INSURANCE_VALUES: Record<string, number | undefined> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/**
 * Keeps binary floating-point drift from tipping an exact amount over a rounding
 * boundary. Six decimals is far finer than any amount in G the rules produce, so
 * it discards only the drift and never a real fraction.
 */
const SIGNIFICANT_DECIMALS = 6;
const withoutFloatNoise = (amount: number): number =>
  Number(amount.toFixed(SIGNIFICANT_DECIMALS));

/** Premiums are rounded in the MHPCO's favour: up to the next whole G. */
const roundUpToWholeG = (amount: number): number => Math.ceil(withoutFloatNoise(amount));

/** Payouts are rounded in the MHPCO's favour too — which for money paid out is down. */
const roundDownToWholeG = (amount: number): number => Math.floor(withoutFloatNoise(amount));

/** Every price list is keyed by item type, and an unlisted type is never priceable. */
const listedAmountFor = (priceList: Record<string, number | undefined>) =>
  (item: Item): number => {
    const amount = priceList[item.type];
    if (amount === undefined) throw new Error(`Unknown item type: ${item.type}`);
    return amount;
  };

const basePremiumFor = listedAmountFor(BASE_PREMIUMS);
const insuranceValueFor = listedAmountFor(INSURANCE_VALUES);

/** Sums a projection over a list: the amounts, rates, or values it maps to. */
const sumOf = <T>(values: T[], numberFor: (value: T) => number): number =>
  values.reduce((total, value) => total + numberFor(value), 0);

/** A building block of 3 alike components is offered at a special base premium. */
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/** Components are the small parts; main items never qualify for block pricing. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

/** Block pricing is decided per type, so items are priced in same-type groups. */
const groupedByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type);
    if (group === undefined) groups.set(item.type, [item]);
    else group.push(item);
  }
  return [...groups.values()];
};

/**
 * A group is same-type by construction, so one member settles whether the group
 * is made of components.
 */
const isBlock = (group: Item[]): boolean =>
  group.length === BLOCK_SIZE && isComponent(group[0]);

const basePremiumForGroup = (group: Item[]): number =>
  isBlock(group) ? BLOCK_BASE_PREMIUM : sumOf(group, basePremiumFor);

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;

/**
 * A modifier raises or lowers the amount it applies to by `rate`, but only for
 * subjects it applies to. Modifiers that apply stack additively.
 */
interface Modifier<Subject> {
  appliesTo: (subject: Subject) => boolean;
  rate: number;
}

const combinedRateOf = <Subject>(
  modifiers: Modifier<Subject>[],
  subject: Subject,
): number => sumOf(modifiers, ({ appliesTo, rate }) => (appliesTo(subject) ? rate : 0));

/** Item-specific modifiers are levied on the affected item's own base premium. */
const ITEM_MODIFIERS: Modifier<Item>[] = [
  { appliesTo: isCursed, rate: CURSE_SURCHARGE },
  { appliesTo: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE },
];

const itemSurchargeFor = (item: Item): number =>
  basePremiumFor(item) * combinedRateOf(ITEM_MODIFIERS, item);

const LOYALTY_THRESHOLD_YEARS = 2;

/**
 * The circumstances a single quote is issued under: who is being quoted, and
 * where this contract falls in their history with the MHPCO. Policy-wide
 * modifiers are decided from this alone.
 */
interface QuoteContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

const isLongStanding = ({ customer }: QuoteContext): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const followsAnEarlierContract = ({ isFollowUpContract }: QuoteContext): boolean =>
  isFollowUpContract;

const appliesToEveryQuote = (): boolean => true;

/** Policy-wide modifiers are levied on the whole policy's base premium. */
const POLICY_MODIFIERS: Modifier<QuoteContext>[] = [
  { appliesTo: isLongStanding, rate: LOYALTY_DISCOUNT },
  { appliesTo: appliesToEveryQuote, rate: INITIAL_ASSESSMENT_SURCHARGE },
  { appliesTo: followsAnEarlierContract, rate: FOLLOW_UP_CONTRACT_DISCOUNT },
];

/**
 * Item-specific modifiers are levied on the affected item's own base premium,
 * while policy-wide modifiers are levied on the policy base premium — the sum
 * of the item base premiums, before any item surcharge is added.
 */
const quote = (step: QuoteStep, context: QuoteContext): StepResult => {
  const policyBasePremium = sumOf(groupedByType(step.items), basePremiumForGroup);
  const itemSurcharges = sumOf(step.items, itemSurchargeFor);
  const policyAdjustment = policyBasePremium * combinedRateOf(POLICY_MODIFIERS, context);
  return {
    premium: roundUpToWholeG(
      policyBasePremium + itemSurcharges + policyAdjustment + PROCESSING_FEE,
    ),
  };
};

/** A policy created by a quote step, against which later claims are settled. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

const policyFor = (step: QuoteStep): Policy => ({
  items: step.items,
  remainingCap: sumOf(step.items, insuranceValueFor) * CAP_MULTIPLE_OF_INSURANCE_SUM,
});

/**
 * Damage to a very strongly enchanted item is only half reimbursed. This
 * threshold is deliberately distinct from the premium side's
 * HIGH_ENCHANTMENT_THRESHOLD: the same attribute is read by two unrelated rules.
 */
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const isTooEnchantedToFullyReimburse = (item: Item): boolean =>
  item.enchantment !== undefined &&
  item.enchantment >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

const reimbursementRateFor = (item: Item): number =>
  isTooEnchantedToFullyReimburse(item) ? HALF_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;

/** One damage settled against the one insured item it is charged against. */
interface Charge {
  damage: Damage;
  item: Item;
}

/**
 * A negative amount is malformed input rather than a small claim, so it is
 * rejected outright. A legitimately small positive damage is not an error: it
 * falls below the deductible and simply pays nothing.
 */
const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const { amount } of damages) {
    if (amount < 0) throw new Error(`Damage amount cannot be negative: ${amount}`);
  }
};

/**
 * Every damage is charged against a distinct insured item, so a policy covering
 * one sword cannot answer for two damaged swords: each match consumes the item
 * it charges. Claiming for more items of a type than the policy covers rejects
 * the whole claim.
 */
const chargesFor = (damages: Damage[], insuredItems: Item[]): Charge[] => {
  const unclaimed = [...insuredItems];
  return damages.map((damage) => {
    const index = unclaimed.findIndex(({ type }) => type === damage.itemType);
    if (index === -1) throw new Error(`Item not insured: ${damage.itemType}`);
    return { damage, item: unclaimed.splice(index, 1)[0] };
  });
};

/**
 * The clause is applied to the damage first; the deductible comes off the result.
 * The deductible can reduce a charge to nothing but never below it, so a damage
 * smaller than the deductible pays nothing rather than clawing back from the
 * other damages in the same incident.
 */
const deductedReimbursementFor = ({ damage, item }: Charge): number => {
  const reimbursed = damage.amount * reimbursementRateFor(item);
  return Math.max(reimbursed - DEDUCTIBLE_PER_DAMAGE, 0);
};

/** Claims name the quote step that created the policy they are settled against. */
const policyAt = (policies: Map<number, Policy>, step: number): Policy => {
  const policy = policies.get(step);
  if (policy === undefined) throw new Error(`No policy at step ${step}`);
  return policy;
};

/**
 * A claim both reports a payout and draws down the policy's cap, so settling one
 * yields the settled policy rather than mutating it: successive claims against
 * the same policy are then an explicit chain, not a hidden shared-state effect.
 */
const claim = (
  step: ClaimStep,
  policy: Policy,
): { result: StepResult; policy: Policy } => {
  const { damages } = step.incident;
  rejectNegativeAmounts(damages);
  const charges = chargesFor(damages, policy.items);
  const reimbursementBeforeCap = sumOf(charges, deductedReimbursementFor);
  const payout = roundDownToWholeG(Math.min(reimbursementBeforeCap, policy.remainingCap));
  const remainingCap = policy.remainingCap - payout;
  return { result: { payout, remainingCap }, policy: { ...policy, remainingCap } };
};

/**
 * Steps are not independent: a quote's premium depends on whether an earlier
 * quote in the same scenario already established a contract, and a claim is
 * settled against the policy an earlier quote created.
 */
export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  let hasQuoted = false;

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const result = quote(step, {
        customer: scenario.customer,
        isFollowUpContract: hasQuoted,
      });
      policies.set(index, policyFor(step));
      hasQuoted = true;
      return result;
    }

    const { result, policy: settledPolicy } = claim(step, policyAt(policies, step.policy));
    policies.set(step.policy, settledPolicy);
    return result;
  });

  return { results };
};
