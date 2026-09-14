export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

// MHPCO always rounds in its own favour: money it receives rounds up,
// money it pays out rounds down.
const roundIncomingInMHPCOsFavour = Math.ceil;
const roundOutgoingInMHPCOsFavour = Math.floor;

const sumOf = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((sum, value) => sum + amountOf(value), 0);

const BASE_PREMIUM_BY_ITEM_TYPE = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const satisfies Record<string, number>;

type InsurableItemType = keyof typeof BASE_PREMIUM_BY_ITEM_TYPE;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_PERCENT = 50;
const SURCHARGED_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

// Every tariff is a lookup keyed by insurable item type. The guard on the
// quote path has already rejected uninsurable types, so by the time any
// tariff is read the key is known good.
const tariffLookup =
  (tariff: Record<InsurableItemType, number>) =>
  (item: Item): number =>
    tariff[item.type as InsurableItemType];

const basePremiumOf = tariffLookup(BASE_PREMIUM_BY_ITEM_TYPE);

interface RiskSurcharge {
  appliesTo: (item: Item) => boolean;
  percent: number;
}

const RISK_SURCHARGES: RiskSurcharge[] = [
  { appliesTo: (item) => item.cursed === true, percent: CURSE_SURCHARGE_PERCENT },
  {
    appliesTo: (item) =>
      (item.enchantment ?? 0) >= SURCHARGED_ENCHANTMENT_THRESHOLD,
    percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  },
];

const itemSurcharge = (item: Item): number =>
  sumOf(
    RISK_SURCHARGES.filter((surcharge) => surcharge.appliesTo(item)),
    (surcharge) => percentOf(basePremiumOf(item), surcharge.percent),
  );

const policySurcharges = (items: Item[]): number => sumOf(items, itemSurcharge);

const groupByType = (items: Item[]): Item[][] => [
  ...items
    .reduce(
      (groups, item) =>
        groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<string, Item[]>(),
    )
    .values(),
];

const basePremiumOfGroup = (group: Item[]): number =>
  group.length === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : sumOf(group, basePremiumOf);

const policyBasePremium = (items: Item[]): number =>
  sumOf(groupByType(items), basePremiumOfGroup);

interface QuoteContext {
  customer: Customer;
  previousQuotes: number;
}

const isLoyal = ({ customer }: QuoteContext): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const isFollowUpContract = ({ previousQuotes }: QuoteContext): boolean =>
  previousQuotes > 0;

interface PolicyAdjustment {
  appliesTo: (context: QuoteContext) => boolean;
  percent: number;
}

const POLICY_ADJUSTMENTS: PolicyAdjustment[] = [
  { appliesTo: () => true, percent: FIRST_INSURANCE_SURCHARGE_PERCENT },
  { appliesTo: isLoyal, percent: -LOYALTY_DISCOUNT_PERCENT },
  { appliesTo: isFollowUpContract, percent: -FOLLOW_UP_DISCOUNT_PERCENT },
];

const policyAdjustments = (policyBase: number, context: QuoteContext): number =>
  sumOf(
    POLICY_ADJUSTMENTS.filter((adjustment) => adjustment.appliesTo(context)),
    (adjustment) => percentOf(policyBase, adjustment.percent),
  );

const isInsurableType = (type: string): type is InsurableItemType =>
  type in BASE_PREMIUM_BY_ITEM_TYPE;

// The MHPCO's price list is closed: an item it has no tariff for cannot be
// quoted at all, so the whole quote is rejected.
const rejectUninsurableItems = (items: Item[]): void => {
  for (const { type } of items) {
    if (!isInsurableType(type)) {
      throw new Error(`the MHPCO does not insure items of type ${type}`);
    }
  }
};

const quotePremium = (items: Item[], context: QuoteContext): number => {
  rejectUninsurableItems(items);
  const policyBase = policyBasePremium(items);
  const premiumBeforeFee =
    policyBase + policySurcharges(items) + policyAdjustments(policyBase, context);
  return roundIncomingInMHPCOsFavour(premiumBeforeFee + PROCESSING_FEE);
};

const INSURANCE_VALUE_BY_ITEM_TYPE = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
} as const satisfies Record<InsurableItemType, number>;

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceValueOf = tariffLookup(INSURANCE_VALUE_BY_ITEM_TYPE);

// Unlike the base premium, the cap does not group items by type: every item
// contributes its full insurance value, so two swords insure for 2 x 1000 G.
// Block discounts are a premium concept only.
const policyCapOf = (items: Item[]): number =>
  CAP_MULTIPLE_OF_INSURANCE_SUM * sumOf(items, insuranceValueOf);

const HALVING_ENCHANTMENT_THRESHOLD = 8;
const HALVED_REIMBURSEMENT_PERCENT = 50;

const FULL_REIMBURSEMENT_PERCENT = 100;

const reimbursesAtHalf = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HALVING_ENCHANTMENT_THRESHOLD;

const reimbursementPercentFor = (item: Item | undefined): number =>
  reimbursesAtHalf(item)
    ? HALVED_REIMBURSEMENT_PERCENT
    : FULL_REIMBURSEMENT_PERCENT;

// Matches by type only, so several damage entries of one type all resolve to
// the same insured item. Safe because rejectDamagesNotBackedByInsuredItems has
// already guaranteed there are at least as many insured items of the type as
// damage entries, and items of a type are interchangeable for reimbursement.
const insuredItemFor = (damage: Damage, insured: Item[]): Item | undefined =>
  insured.find(({ type }) => type === damage.itemType);

// Each damage entry carries its own deductible, so a two-sword incident is
// docked 100 G twice.
const reimbursementFor = (damage: Damage, insured: Item[]): number =>
  percentOf(
    damage.amount,
    reimbursementPercentFor(insuredItemFor(damage, insured)),
  ) - DEDUCTIBLE_PER_DAMAGE;

const policyOf = (step: Extract<Step, { op: "claim" }>, steps: Step[]) => {
  const policy = steps[step.policy];
  if (policy?.op !== "quote") throw new Error("claim references no policy");
  return policy;
};

// A claim consumes part of its policy's cap, so each policy carries a
// remaining cap that later claims against the same policy draw down.
type RemainingCapByPolicy = ReadonlyMap<number, number>;

const countByType = <T>(values: T[], typeOf: (value: T) => string) =>
  values.reduce((counts, value) => {
    const type = typeOf(value);
    return counts.set(type, (counts.get(type) ?? 0) + 1);
  }, new Map<string, number>());

// Every damage entry must be backed by its own insured item, which settles
// three spec rules at once: an item the policy never covered has nothing to
// back it; a second damage to a singly-insured item has nothing left to back
// it; and an item of an unknown type can never be insured at all, because the
// quote guard rejects the policy before it is written. Any of the three
// rejects the whole claim rather than honouring it in part.
const rejectDamagesNotBackedByInsuredItems = (
  damages: Damage[],
  insured: Item[],
): void => {
  const insuredCounts = countByType(insured, ({ type }) => type);
  for (const [itemType, damaged] of countByType(
    damages,
    ({ itemType }) => itemType,
  )) {
    const covered = insuredCounts.get(itemType) ?? 0;
    if (damaged > covered) {
      throw new Error(
        covered === 0
          ? `claim reports damage to ${itemType}, which the policy does not cover`
          : `claim reports more ${itemType} damages than the policy covers`,
      );
    }
  }
};

// A damage is a loss, never a gain: the MHPCO does not accept claims that
// would have it collect money from the customer.
const rejectNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const { itemType, amount } of damages) {
    if (amount < 0) {
      throw new Error(
        `claim reports a negative damage amount of ${amount} for ${itemType}`,
      );
    }
  }
};

// Settling a claim is a state transition: it reports what the customer is
// paid and what the policy has left. The caller owns the running state.
const settleClaim = (
  step: Extract<Step, { op: "claim" }>,
  steps: Step[],
  remainingCaps: RemainingCapByPolicy,
): { payout: number; remainingCap: number } => {
  const insured = policyOf(step, steps).items;
  rejectDamagesNotBackedByInsuredItems(step.incident.damages, insured);
  rejectNegativeDamageAmounts(step.incident.damages);
  const desiredPayout = roundOutgoingInMHPCOsFavour(
    sumOf(step.incident.damages, (damage) => reimbursementFor(damage, insured)),
  );
  const capBeforeClaim =
    remainingCaps.get(step.policy) ?? policyCapOf(insured);
  const payout = Math.min(desiredPayout, capBeforeClaim);
  return { payout, remainingCap: capBeforeClaim - payout };
};

const countQuotesBefore = (steps: Step[], index: number): number =>
  steps.slice(0, index).filter((step) => step.op === "quote").length;

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  // The one place that owns the running cap state: settleClaim reports each
  // policy's new remaining cap, and the write back happens here, in plain sight.
  const remainingCaps = new Map<number, number>();
  return {
    results: steps.map((step, index) => {
      if (step.op === "quote") {
        const context = {
          customer,
          previousQuotes: countQuotesBefore(steps, index),
        };
        return { premium: quotePremium(step.items, context) };
      }
      const result = settleClaim(step, steps, remainingCaps);
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }),
  };
};
