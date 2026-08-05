export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
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

// Money is always rounded in MHPCO's favour: premiums up, payouts down.
const premiumRoundedInMHPCOsFavour = Math.ceil;
const payoutRoundedInMHPCOsFavour = Math.floor;

const PROCESSING_FEE = 5;

interface ItemTypeRating {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_TYPE_RATINGS: Record<string, ItemTypeRating> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: InsuredItem): boolean =>
  COMPONENT_TYPES.includes(item.type);

const isComponentBlock = (sameTypeGroup: InsuredItem[]): boolean =>
  sameTypeGroup.length === COMPONENT_BLOCK_SIZE &&
  isComponent(sameTypeGroup[0]);

const groupBy = <T>(
  items: T[],
  keyOf: (item: T) => string,
): Map<string, T[]> => {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return groups;
};

const typeOfItem = (item: InsuredItem): string => item.type;
const typeOfDamage = (damage: Damage): string => damage.itemType;

const groupByType = (items: InsuredItem[]): InsuredItem[][] => [
  ...groupBy(items, typeOfItem).values(),
];

const orRejectWith = <T>(value: T | undefined, reason: string): T => {
  if (value === undefined) {
    throw new Error(reason);
  }
  return value;
};

const rejectFirstViolation = <T>(
  candidates: T[],
  violates: (candidate: T) => boolean,
  reasonFor: (violation: T) => string,
): void => {
  const violation = candidates.find(violates);
  if (violation !== undefined) {
    throw new Error(reasonFor(violation));
  }
};

const ratingOf = (itemType: string): ItemTypeRating =>
  orRejectWith(ITEM_TYPE_RATINGS[itemType], `Unknown item type: ${itemType}`);

const basePremiumOf = (item: InsuredItem): number =>
  ratingOf(item.type).basePremium;

const insuranceValueOf = (item: InsuredItem): number =>
  ratingOf(item.type).insuranceValue;

const sumOfItemValues =
  (valueOfItem: (item: InsuredItem) => number) =>
  (items: InsuredItem[]): number =>
    items.reduce((sum, item) => sum + valueOfItem(item), 0);

const sumOfBasePremiums = sumOfItemValues(basePremiumOf);

const insuranceSumOf = sumOfItemValues(insuranceValueOf);

const policyBasePremiumFor = (items: InsuredItem[]): number =>
  groupByType(items).reduce(
    (sum, group) =>
      sum +
      (isComponentBlock(group)
        ? COMPONENT_BLOCK_BASE_PREMIUM
        : sumOfBasePremiums(group)),
    0,
  );

const isCursed = (item: InsuredItem): boolean => item.cursed === true;

const isEnchantedAtLeast =
  (level: number) =>
  (item: InsuredItem | undefined): boolean =>
    (item?.enchantment ?? 0) >= level;

const isHighlyEnchanted = isEnchantedAtLeast(HIGH_ENCHANTMENT_LEVEL);

const surchargeOnItemsWhere =
  (appliesTo: (item: InsuredItem) => boolean, rate: number) =>
  (items: InsuredItem[]): number =>
    sumOfBasePremiums(items.filter(appliesTo)) * rate;

const curseSurchargeFor = surchargeOnItemsWhere(isCursed, CURSE_SURCHARGE_RATE);

const highEnchantmentSurchargeFor = surchargeOnItemsWhere(
  isHighlyEnchanted,
  HIGH_ENCHANTMENT_SURCHARGE_RATE,
);

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

const discountOnBasePremiumWhen = (
  applies: boolean,
  basePremium: number,
  rate: number,
): number => (applies ? basePremium * rate : 0);

const firstInsuranceSurchargeFor = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const surchargesFor = (items: InsuredItem[], basePremium: number): number =>
  curseSurchargeFor(items) +
  highEnchantmentSurchargeFor(items) +
  firstInsuranceSurchargeFor(basePremium);

const discountsFor = (
  customer: Customer,
  isFollowUpContract: boolean,
  basePremium: number,
): number =>
  discountOnBasePremiumWhen(
    isLoyalCustomer(customer),
    basePremium,
    LOYALTY_DISCOUNT_RATE,
  ) +
  discountOnBasePremiumWhen(
    isFollowUpContract,
    basePremium,
    FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
  );

const quoteForStep = (
  { items }: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean,
): QuoteResult => {
  const basePremium = policyBasePremiumFor(items);
  return {
    premium: premiumRoundedInMHPCOsFavour(
      basePremium +
        surchargesFor(items, basePremium) -
        discountsFor(customer, isFollowUpContract, basePremium) +
        PROCESSING_FEE,
    ),
  };
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const isHalfReimbursed = isEnchantedAtLeast(
  HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL,
);

const coveredItemFor = (
  damage: Damage,
  insuredItems: InsuredItem[],
): InsuredItem =>
  orRejectWith(
    insuredItems.find((item) => item.type === damage.itemType),
    `Item not covered by the policy: ${damage.itemType}`,
  );

const reimbursementFor = (
  damage: Damage,
  insuredItems: InsuredItem[],
): number =>
  isHalfReimbursed(coveredItemFor(damage, insuredItems))
    ? damage.amount * HALF_REIMBURSEMENT_RATE
    : damage.amount;

const payoutForDamage = (damage: Damage, insuredItems: InsuredItem[]): number =>
  reimbursementFor(damage, insuredItems) - DEDUCTIBLE;

const rejectOverclaimedTypes = (
  damages: Damage[],
  insuredItems: InsuredItem[],
): void => {
  const insuredByType = groupBy(insuredItems, typeOfItem);
  rejectFirstViolation(
    [...groupBy(damages, typeOfDamage)],
    ([type, claimed]) => claimed.length > (insuredByType.get(type)?.length ?? 0),
    ([type]) => `More damages than insured items of type: ${type}`,
  );
};

const rejectNegativeAmounts = (damages: Damage[]): void =>
  rejectFirstViolation(
    damages,
    (damage) => damage.amount < 0,
    (damage) => `Damage amount must not be negative: ${damage.amount}`,
  );

const rejectInvalidClaim = (
  damages: Damage[],
  insuredItems: InsuredItem[],
): void => {
  rejectNegativeAmounts(damages);
  rejectOverclaimedTypes(damages, insuredItems);
};

const claimForStep = (
  { incident }: ClaimStep,
  insuredItems: InsuredItem[],
  remainingCap: number,
): ClaimResult => {
  rejectInvalidClaim(incident.damages, insuredItems);
  const uncappedPayout = incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, insuredItems),
    0,
  );
  const payout = payoutRoundedInMHPCOsFavour(
    Math.min(uncappedPayout, remainingCap),
  );
  return { payout, remainingCap: remainingCap - payout };
};

const capOf = (insuredItems: InsuredItem[]): number =>
  CAP_MULTIPLIER * insuranceSumOf(insuredItems);

const isQuote = (step: Step): step is QuoteStep => step.op === "quote";

const insuredItemsOfPolicy = (steps: Step[], policy: number): InsuredItem[] => {
  const step = steps[policy];
  return isQuote(step) ? step.items : [];
};

const hasEarlierQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some(isQuote);

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();

  const settleClaim = (step: ClaimStep): ClaimResult => {
    const insuredItems = insuredItemsOfPolicy(steps, step.policy);
    const capBeforeClaim =
      remainingCaps.get(step.policy) ?? capOf(insuredItems);
    const result = claimForStep(step, insuredItems, capBeforeClaim);
    remainingCaps.set(step.policy, result.remainingCap);
    return result;
  };

  const results = steps.map((step, index): StepResult =>
    isQuote(step)
      ? quoteForStep(step, customer, hasEarlierQuote(steps, index))
      : settleClaim(step),
  );
  return { results };
};
