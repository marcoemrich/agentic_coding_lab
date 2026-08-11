export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  staff: 80,
  amulet: 60,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const FIRST_INSURANCE_PERCENT = 10;

// Surcharges are applied as (amount * percent) / 100 rather than via a decimal
// multiplier (e.g. * 1.1): the integer intermediate is exact, whereas 100 * 1.1
// is 110.00000000000001 in binary floating point. Since the final amount feeds
// straight into Math.ceil, that error would round a 115 G premium up to 116 G.
/** The whole of an amount, as a percentage. */
const FULL_PERCENT = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / FULL_PERCENT;

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

/**
 * Reads a per-type rate table, rejecting types the MHPCO does not insure.
 *
 * The rate tables all share one domain — the insurable item types — so an
 * absent entry means the same thing in every one of them, and is reported the
 * same way. Keeping the guard here rather than at each call site is what stops
 * the tables from drifting into one validated and one silently yielding NaN.
 */
const rateFor = (table: Record<string, number>, itemType: string): number => {
  const rate = table[itemType];
  if (rate === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${itemType}"`);
  }
  return rate;
};

const itemBasePremium = (item: Item): number =>
  rateFor(BASE_PREMIUM_BY_TYPE, item.type);

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const sumItemBasePremiums = (items: Item[]): number =>
  sum(items.map(itemBasePremium));

/** Items of one and the same type, e.g. the three runes that form a block. */
type TypeGroup = Item[];

const groupByType = (items: Item[]): TypeGroup[] => [
  ...items
    .reduce(
      (groups, item) =>
        groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<string, TypeGroup>(),
    )
    .values(),
];

const formsBlock = (group: TypeGroup): boolean => group.length === BLOCK_SIZE;

const groupBasePremium = (group: TypeGroup): number =>
  formsBlock(group) ? BLOCK_BASE_PREMIUM : sumItemBasePremiums(group);

const policyBasePremium = (items: Item[]): number =>
  sum(groupByType(items).map(groupBasePremium));

const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

/**
 * A modifier adjusts a base premium by `percent` when it `applies` to its
 * subject. Discounts are expressed as negative percentages, so that the
 * applicable rules of one scope always combine by summation.
 */
interface ModifierRule<Subject> {
  applies: (subject: Subject) => boolean;
  percent: number;
}

const applicablePercent = <Subject>(
  rules: ModifierRule<Subject>[],
  subject: Subject,
): number =>
  rules.reduce(
    (percent, rule) => (rule.applies(subject) ? percent + rule.percent : percent),
    0,
  );

/**
 * Item-scoped modifiers apply to the affected item's own base premium, not to
 * the policy total.
 */
const ITEM_MODIFIER_RULES: ModifierRule<Item>[] = [
  { applies: (item) => item.cursed === true, percent: CURSE_PERCENT },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    percent: HIGH_ENCHANTMENT_PERCENT,
  },
];

const itemSurcharge = (item: Item): number =>
  percentOf(itemBasePremium(item), applicablePercent(ITEM_MODIFIER_RULES, item));

const totalItemSurcharges = (items: Item[]): number =>
  sum(items.map(itemSurcharge));

const LOYALTY_DISCOUNT_PERCENT = -20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = -15;

/**
 * Everything a quote needs to know about the scenario around it: whose policy
 * this is, and how many quotes preceded it. Not the policy itself — it carries
 * no items, insurance sum or cap.
 */
interface QuoteContext {
  customer: Customer;
  precedingQuoteCount: number;
}

/**
 * Policy-scoped modifiers apply to the policy base premium (the sum of all
 * item base premiums), independently of any item-scoped surcharges.
 */
const POLICY_MODIFIER_RULES: ModifierRule<QuoteContext>[] = [
  { applies: () => true, percent: FIRST_INSURANCE_PERCENT },
  {
    applies: ({ customer }) =>
      customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    percent: LOYALTY_DISCOUNT_PERCENT,
  },
  {
    applies: ({ precedingQuoteCount }) => precedingQuoteCount > 0,
    percent: FOLLOW_UP_DISCOUNT_PERCENT,
  },
];

const quotePremium = (step: QuoteStep, context: QuoteContext): number => {
  const basePremium = policyBasePremium(step.items);
  return Math.ceil(
    basePremium +
      percentOf(basePremium, applicablePercent(POLICY_MODIFIER_RULES, context)) +
      totalItemSurcharges(step.items) +
      PROCESSING_FEE,
  );
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  staff: 800,
  amulet: 600,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

const itemInsuranceValue = (item: Item): number =>
  rateFor(INSURANCE_VALUE_BY_TYPE, item.type);

const insuranceSum = (items: Item[]): number =>
  sum(items.map(itemInsuranceValue));

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

/**
 * The share of a damage amount the MHPCO reimburses before the deductible.
 *
 * The spec's dragon-material clause ("fully reimbursed") is not a separate
 * branch here: full reimbursement is already the default, and where dragon
 * material meets enchantment >= 8 the spec says the 50 % rule wins. Dragon
 * material therefore never changes a payout, so encoding it would add a
 * branch no input can distinguish.
 */
const reimbursementPercent = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    : FULL_PERCENT;

/** A damage entry together with the insured item it was matched to. */
interface CoveredDamage {
  damage: Damage;
  damagedItem: Item;
}

const coveredDamagePayout = ({ damage, damagedItem }: CoveredDamage): number =>
  percentOf(damage.amount, reimbursementPercent(damagedItem)) - DEDUCTIBLE;

/**
 * Pairs every damage entry with the insured item it refers to.
 *
 * Each entry consumes a distinct insured item, so a policy covering one sword
 * cannot absorb two sword damages. A damage the remaining cover cannot account
 * for — an uninsured type, an unknown type, or one damage too many — voids the
 * whole claim.
 */
const matchDamagesToItems = (
  insuredItems: Item[],
  damages: Damage[],
): CoveredDamage[] => {
  const unclaimed = [...insuredItems];

  return damages.map((damage) => {
    const index = unclaimed.findIndex(
      (insured) => insured.type === damage.itemType,
    );
    if (index === -1) {
      throw new Error(
        `The policy does not cover a damage to an item of type "${damage.itemType}"`,
      );
    }
    return { damage, damagedItem: unclaimed.splice(index, 1)[0] };
  });
};

const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const { amount } of damages) {
    if (amount < 0) {
      throw new Error(`A damage amount cannot be negative, got ${amount}`);
    }
  }
};

const totalPayout = (insuredItems: Item[], damages: Damage[]): number => {
  rejectNegativeAmounts(damages);
  return Math.floor(
    sum(matchDamagesToItems(insuredItems, damages).map(coveredDamagePayout)),
  );
};

/**
 * A claim pays what the damages come to, but never more than the policy's
 * remaining cap — successive claims against one policy draw down a shared
 * budget.
 */
const cappedPayout = (
  insuredItems: Item[],
  damages: Damage[],
  remainingCap: number,
): number => Math.min(totalPayout(insuredItems, damages), remainingCap);

/**
 * The policy a claim refers to. A `policy` index is only meaningful if it
 * points at a quote step, so the lookup narrows rather than casts; the
 * `undefined` case is left for the error-handling tests to give meaning.
 */
const policyAt = (steps: Step[], index: number): QuoteStep | undefined => {
  const step = steps[index];
  return step?.op === "quote" ? step : undefined;
};

/**
 * What a scenario accumulates as it runs: the remaining cap of every policy
 * quoted so far (keyed by the step index a claim names as its `policy`), and
 * how many quotes have been issued — the follow-up discount depends on it.
 */
class Ledger {
  private readonly remainingCapByPolicy = new Map<number, number>();
  quoteCount = 0;

  openPolicy(policyIndex: number, items: Item[]): void {
    this.quoteCount++;
    this.remainingCapByPolicy.set(policyIndex, CAP_MULTIPLE * insuranceSum(items));
  }

  /** Draws `payout` down from the policy's cap and reports what is left. */
  drawDown(policyIndex: number, payout: number): number {
    const remaining = this.remainingCap(policyIndex) - payout;
    this.remainingCapByPolicy.set(policyIndex, remaining);
    return remaining;
  }

  remainingCap(policyIndex: number): number {
    return this.remainingCapByPolicy.get(policyIndex) ?? 0;
  }
}

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const ledger = new Ledger();

  /** Quoting a policy opens it on the ledger, which is what a later claim draws against. */
  const runQuote = (step: QuoteStep, index: number): StepResult => {
    const context = {
      customer: scenario.customer,
      precedingQuoteCount: ledger.quoteCount,
    };
    ledger.openPolicy(index, step.items);
    return { premium: quotePremium(step, context) };
  };

  const runClaim = (step: ClaimStep): StepResult => {
    const insuredItems = policyAt(scenario.steps, step.policy)?.items ?? [];
    const payout = cappedPayout(
      insuredItems,
      step.incident.damages,
      ledger.remainingCap(step.policy),
    );
    return { payout, remainingCap: ledger.drawDown(step.policy, payout) };
  };

  const runStep = (step: Step, index: number): StepResult =>
    step.op === "quote" ? runQuote(step, index) : runClaim(step);

  return { results: scenario.steps.map(runStep) };
};
