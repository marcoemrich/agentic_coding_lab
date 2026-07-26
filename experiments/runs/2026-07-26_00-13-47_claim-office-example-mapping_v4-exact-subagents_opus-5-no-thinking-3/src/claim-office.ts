const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const COMPONENT_BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  rune: 25,
  moonstone: 25,
};
const MAIN_ITEM_BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  ...MAIN_ITEM_BASE_PREMIUM_BY_TYPE,
  ...COMPONENT_BASE_PREMIUM_BY_TYPE,
};
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_MINIMUM_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Damage = {
  itemType: string;
  amount: number;
};

type Incident = {
  cause: string;
  damages: Damage[];
};

type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type QuoteResult = {
  premium: number;
};

type ClaimResult = {
  payout: number;
  remainingCap: number;
};

type StepResult = QuoteResult | ClaimResult;

type ScenarioOutput = {
  results: StepResult[];
};

const isComponent = (item: Item): boolean =>
  item.type in COMPONENT_BASE_PREMIUM_BY_TYPE;

const isComponentBlock = (sameTypeItems: Item[]): boolean =>
  sameTypeItems.length === COMPONENT_BLOCK_SIZE &&
  sameTypeItems.every(isComponent);

const groupByType = (items: Item[]): Item[][] => {
  const distinctTypes = [...new Set(items.map((item) => item.type))];
  return distinctTypes.map((type) =>
    items.filter((item) => item.type === type),
  );
};

const basePremiumForItem = (item: Item): number => {
  const basePremium = BASE_PREMIUM_BY_ITEM_TYPE[item.type];
  if (basePremium === undefined)
    throw new Error(`Unknown item type: ${item.type}`);
  return basePremium;
};

const basePremiumForGroup = (sameTypeItems: Item[]): number => {
  if (isComponentBlock(sameTypeItems)) return COMPONENT_BLOCK_BASE_PREMIUM;
  return sameTypeItems.reduce(
    (total, item) => total + basePremiumForItem(item),
    0,
  );
};

const basePremiumForItems = (items: Item[]): number =>
  groupByType(items).reduce(
    (total, group) => total + basePremiumForGroup(group),
    0,
  );

const amountAtRate = (
  basePremium: number,
  rate: number,
  applies?: boolean,
): number => (applies ? basePremium * rate : 0);

const cursedSurcharge = (item: Item): number =>
  amountAtRate(basePremiumForItem(item), CURSED_SURCHARGE_RATE, item.cursed);

const enchantmentLevelOf = (item: Item): number => item.enchantment ?? 0;

const hasHighEnchantment = (item: Item): boolean =>
  enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const highEnchantmentSurcharge = (item: Item): number =>
  amountAtRate(
    basePremiumForItem(item),
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
    hasHighEnchantment(item),
  );

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + cursedSurcharge(item) + highEnchantmentSurcharge(item),
    0,
  );

const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const isLoyalCustomer = (yearsWithMHPCO: number): boolean =>
  yearsWithMHPCO >= LOYALTY_MINIMUM_YEARS;

const loyaltyDiscount = (basePremium: number, yearsWithMHPCO: number): number =>
  amountAtRate(
    basePremium,
    LOYALTY_DISCOUNT_RATE,
    isLoyalCustomer(yearsWithMHPCO),
  );

const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  amountAtRate(basePremium, FOLLOW_UP_DISCOUNT_RATE, isFollowUp);

const premiumBeforeProcessingFee = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number => {
  const basePremium = basePremiumForItems(items);
  return (
    basePremium +
    totalItemSurcharges(items) +
    firstInsuranceSurcharge(basePremium) -
    loyaltyDiscount(basePremium, yearsWithMHPCO) -
    followUpDiscount(basePremium, isFollowUp)
  );
};

const isFollowUpQuote = (stepIndex: number): boolean => stepIndex > 0;

const isClaimStep = (step: Step): boolean => step.op === "claim";

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + INSURANCE_VALUE_BY_ITEM_TYPE[item.type],
    0,
  );

const capForItems = (items: Item[]): number =>
  insuranceSumForItems(items) * CAP_MULTIPLIER;

const damagedItemFor = (damage: Damage, policyItems: Item[]): Item => {
  const damagedItem = policyItems.find(
    (item) => item.type === damage.itemType,
  );
  if (damagedItem === undefined)
    throw new Error(`Item type not covered by the policy: ${damage.itemType}`);
  return damagedItem;
};

const reimbursementRateFor = (item: Item): number =>
  enchantmentLevelOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, policyItems: Item[]): number =>
  damage.amount * reimbursementRateFor(damagedItemFor(damage, policyItems)) -
  DEDUCTIBLE;

const countWhere = <T>(values: T[], matches: (value: T) => boolean): number =>
  values.filter(matches).length;

const assertDamageCountsWithinPolicy = (
  damages: Damage[],
  policyItems: Item[],
): void => {
  for (const damage of damages) {
    const damagedCount = countWhere(
      damages,
      (entry) => entry.itemType === damage.itemType,
    );
    const insuredCount = countWhere(
      policyItems,
      (item) => item.type === damage.itemType,
    );
    if (damagedCount > insuredCount)
      throw new Error(
        `More damage entries than insured items of type: ${damage.itemType}`,
      );
  }
};

const assertDamageAmountsAreNotNegative = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0)
      throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const totalPayoutForDamages = (damages: Damage[], policyItems: Item[]): number =>
  damages.reduce(
    (total, damage) => total + payoutForDamage(damage, policyItems),
    0,
  );

const policyIndexOf = (step: Step): number => step.policy ?? 0;

const policyItemsAt = (policyIndex: number, steps: Step[]): Item[] =>
  steps[policyIndex].items ?? [];

const damagesFor = (step: Step): Damage[] => step.incident?.damages ?? [];

const claimResultFor = (
  step: Step,
  steps: Step[],
  remainingCapByPolicy: Map<number, number>,
): ClaimResult => {
  const policyIndex = policyIndexOf(step);
  const policyItems = policyItemsAt(policyIndex, steps);
  const damages = damagesFor(step);
  const availableCap =
    remainingCapByPolicy.get(policyIndex) ?? capForItems(policyItems);
  assertDamageCountsWithinPolicy(damages, policyItems);
  assertDamageAmountsAreNotNegative(damages);
  const payoutBeforeCap = Math.floor(
    totalPayoutForDamages(damages, policyItems),
  );
  const payout = Math.min(payoutBeforeCap, availableCap);
  const remainingCap = availableCap - payout;
  remainingCapByPolicy.set(policyIndex, remainingCap);
  return { payout, remainingCap };
};

const quoteResultFor = (
  step: Step,
  yearsWithMHPCO: number,
  stepIndex: number,
): QuoteResult => ({
  premium: Math.ceil(
    premiumBeforeProcessingFee(
      step.items ?? [],
      yearsWithMHPCO,
      isFollowUpQuote(stepIndex),
    ) + PROCESSING_FEE,
  ),
});

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const remainingCapByPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, stepIndex) =>
      isClaimStep(step)
        ? claimResultFor(step, scenario.steps, remainingCapByPolicy)
        : quoteResultFor(step, scenario.customer.yearsWithMHPCO, stepIndex),
    ),
  };
};
