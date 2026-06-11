type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

type Customer = { yearsWithMHPCO: number };

type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: string; amount: number };

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: Customer;
  steps: Step[];
};

type ScenarioResult = {
  results: { premium?: number; payout?: number; remainingCap?: number }[];
};

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const firstInsuranceSurcharge = (premium: number): number =>
  premium * FIRST_INSURANCE_SURCHARGE_RATE;

const COMPONENT_PREMIUM = 25;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_PREMIUM,
  moonstone: COMPONENT_PREMIUM,
};

const BLOCK_PREMIUM = 60;

const isBlock = (count: number): boolean => count === 3;

const countBy = <T>(
  values: T[],
  keyOf: (value: T) => string,
): Record<string, number> =>
  values.reduce<Record<string, number>>((counts, value) => {
    counts[keyOf(value)] = (counts[keyOf(value)] ?? 0) + 1;
    return counts;
  }, {});

const countByType = (items: Item[]): Record<string, number> =>
  countBy(items, (item) => item.type);

const premiumForGroup = (type: string, count: number): number =>
  isBlock(count) ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];

const basePremiumFor = (items: Item[]): number =>
  Object.entries(countByType(items)).reduce(
    (total, [type, count]) => total + premiumForGroup(type, count),
    0,
  );

const roundUpToWholeGold = (amount: number): number => Math.ceil(amount);

const roundDownToWholeGold = (amount: number): number => Math.floor(amount);

const sumBy = (items: Item[], valueOf: (item: Item) => number): number =>
  items.reduce((total, item) => total + valueOf(item), 0);

const surchargeFor = (
  items: Item[],
  qualifies: (item: Item) => boolean,
  rate: number,
): number =>
  sumBy(items, (item) =>
    qualifies(item) ? BASE_PREMIUMS[item.type] * rate : 0,
  );

const CURSE_SURCHARGE_RATE = 0.5;

const isCursed = (item: Item): boolean => item.cursed === true;

const curseSurchargeFor = (items: Item[]): number =>
  surchargeFor(items, isCursed, CURSE_SURCHARGE_RATE);

const ENCHANTMENT_SURCHARGE_RATE = 0.3;

const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_THRESHOLD;

const enchantmentSurchargeFor = (items: Item[]): number =>
  surchargeFor(items, isHighlyEnchanted, ENCHANTMENT_SURCHARGE_RATE);

const discountFor = (
  qualifies: boolean,
  premium: number,
  rate: number,
): number => (qualifies ? premium * rate : 0);

const LOYALTY_DISCOUNT_RATE = 0.2;

const LOYALTY_YEARS_THRESHOLD = 2;

const loyaltyDiscountFor = (customer: Customer, premium: number): number =>
  discountFor(
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    premium,
    LOYALTY_DISCOUNT_RATE,
  );

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscountFor = (isFollowUp: boolean, premium: number): number =>
  discountFor(isFollowUp, premium, FOLLOW_UP_DISCOUNT_RATE);

const assertEach = <T>(
  values: T[],
  isValid: (value: T) => boolean,
  errorFor: (value: T) => string,
): void => {
  for (const value of values) {
    if (!isValid(value)) {
      throw new Error(errorFor(value));
    }
  }
};

const isKnownItemType = (item: Item): boolean => item.type in BASE_PREMIUMS;

const assertKnownItemTypes = (items: Item[]): void =>
  assertEach(items, isKnownItemType, (item) => `Unknown item type: ${item.type}`);

const quotePremium = (
  customer: Customer,
  items: Item[],
  isFollowUp: boolean,
): number => {
  assertKnownItemTypes(items);
  const basePremium = basePremiumFor(items);
  return roundUpToWholeGold(
    basePremium +
      curseSurchargeFor(items) +
      enchantmentSurchargeFor(items) +
      firstInsuranceSurcharge(basePremium) -
      loyaltyDiscountFor(customer, basePremium) -
      followUpDiscountFor(isFollowUp, basePremium) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;

const HIGH_ENCHANTMENT_THRESHOLD = 8;

const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursementRateFor = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

const insuredItemFor = (
  insuredItems: Item[],
  damage: Damage,
): Item | undefined =>
  insuredItems.find((item) => item.type === damage.itemType);

const payoutForDamage = (insuredItems: Item[], damage: Damage): number =>
  damage.amount * reimbursementRateFor(insuredItemFor(insuredItems, damage)) -
  DEDUCTIBLE;

const insuredItemsForPolicy = (steps: Step[], policy: number): Item[] => {
  const policyStep = steps[policy];
  return policyStep.op === "quote" ? policyStep.items : [];
};

const assertDamagesCoveredByPolicy = (
  insuredItems: Item[],
  damages: Damage[],
): void => {
  const insuredCounts = countByType(insuredItems);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, damageCount] of Object.entries(damageCounts)) {
    if (damageCount > (insuredCounts[itemType] ?? 0)) {
      throw new Error(`Item type not in policy: ${itemType}`);
    }
  }
};

const isNonNegativeDamage = (damage: Damage): boolean => damage.amount >= 0;

const assertNonNegativeDamageAmounts = (damages: Damage[]): void =>
  assertEach(
    damages,
    isNonNegativeDamage,
    (damage) => `Negative damage amount: ${damage.amount}`,
  );

const claimPayout = (insuredItems: Item[], damages: Damage[]): number =>
  damages.reduce(
    (total, damage) => total + payoutForDamage(insuredItems, damage),
    0,
  );

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const CAP_MULTIPLIER = 2;

const insuranceSumFor = (items: Item[]): number =>
  sumBy(items, (item) => INSURANCE_VALUES[item.type]);

const remainingCapFor = (insuredItems: Item[], totalPaid: number): number =>
  CAP_MULTIPLIER * insuranceSumFor(insuredItems) - totalPaid;

const claimResult = (
  steps: Step[],
  step: ClaimStep,
  alreadyPaid: number,
): { payout: number; remainingCap: number } => {
  const insuredItems = insuredItemsForPolicy(steps, step.policy);
  assertDamagesCoveredByPolicy(insuredItems, step.incident.damages);
  assertNonNegativeDamageAmounts(step.incident.damages);
  const capBeforePayout = remainingCapFor(insuredItems, alreadyPaid);
  const payout = roundDownToWholeGold(
    Math.min(claimPayout(insuredItems, step.incident.damages), capBeforePayout),
  );
  return { payout, remainingCap: capBeforePayout - payout };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const paidByPolicy: Record<number, number> = {};
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        return {
          premium: quotePremium(scenario.customer, step.items, index > 0),
        };
      }
      const alreadyPaid = paidByPolicy[step.policy] ?? 0;
      const result = claimResult(scenario.steps, step, alreadyPaid);
      paidByPolicy[step.policy] = alreadyPaid + result.payout;
      return result;
    }),
  };
};
