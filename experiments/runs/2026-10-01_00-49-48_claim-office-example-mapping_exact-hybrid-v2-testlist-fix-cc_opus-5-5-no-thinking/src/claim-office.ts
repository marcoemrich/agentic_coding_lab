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
  customer: { yearsWithMHPCO: number };
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
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

const BLOCK_COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

interface ItemTypeTerms {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_CATALOG: Record<string, ItemTypeTerms> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const basePremiumOfType = (type: string): number =>
  ITEM_CATALOG[type].basePremium;

const insuranceValueOfType = (type: string): number =>
  ITEM_CATALOG[type].insuranceValue;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

const countOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

const blockSavingFor = (items: Item[], type: string): number =>
  countOfType(items, type) === BLOCK_SIZE
    ? BLOCK_SIZE * basePremiumOfType(type) - BLOCK_BASE_PREMIUM
    : 0;

const blockDiscount = (items: Item[]): number =>
  BLOCK_COMPONENT_TYPES.reduce(
    (discount, type) => discount + blockSavingFor(items, type),
    0,
  );

const basePremiumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOfType(item.type), 0) -
  blockDiscount(items);

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargePercentOf = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const itemSurchargeOf = (item: Item): number =>
  percentOf(basePremiumOfType(item.type), itemSurchargePercentOf(item));

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargeOf(item), 0);

const isLoyalCustomer = (yearsWithMHPCO: number): boolean =>
  yearsWithMHPCO >= LOYALTY_MIN_YEARS;

const assertKnownItemTypes = (items: Item[]): void => {
  const unknownItem = items.find((item) => !(item.type in ITEM_CATALOG));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
};

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  assertKnownItemTypes(items);
  const basePremium = basePremiumOf(items);
  const firstInsuranceSurcharge = percentOf(
    basePremium,
    FIRST_INSURANCE_SURCHARGE_PERCENT,
  );
  const loyaltyDiscount = isLoyalCustomer(yearsWithMHPCO)
    ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT)
    : 0;
  const followUpDiscount = isFollowUpContract
    ? percentOf(basePremium, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT)
    : 0;
  return Math.ceil(
    basePremium +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      itemSurchargesOf(items) +
      PROCESSING_FEE,
  );
};

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOfType(item.type), 0);

const claimCapOf = (insuredItems: Item[]): number =>
  CAP_MULTIPLIER * insuranceSumOf(insuredItems);

const hasReducedReimbursement = (item: Item): boolean =>
  enchantmentOf(item) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

const reimbursableAmount = (damage: Damage, damagedItem: Item): number =>
  hasReducedReimbursement(damagedItem)
    ? percentOf(damage.amount, REDUCED_REIMBURSEMENT_PERCENT)
    : damage.amount;

const afterDeductible = (amount: number): number =>
  Math.max(0, amount - DEDUCTIBLE);

const damagedCountOfType = (damages: Damage[], type: string): number =>
  damages.filter((damage) => damage.itemType === type).length;

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find(({ amount }) => amount < 0);
  if (negative) throw new Error(`Negative damage amount: ${negative.amount}`);
};

const assertDamagesCoveredByPolicy = (
  damages: Damage[],
  insuredItems: Item[],
): void => {
  const uncovered = damages.find(
    ({ itemType }) =>
      damagedCountOfType(damages, itemType) >
      countOfType(insuredItems, itemType),
  );
  if (uncovered)
    throw new Error(
      `Damaged ${uncovered.itemType} not covered by policy: more damaged than insured`,
    );
};

// Only called after assertDamagesCoveredByPolicy, so an insured item always exists.
const insuredItemOfType = (insuredItems: Item[], type: string): Item =>
  insuredItems.find((insured) => insured.type === type) as Item;

const damagePayout = (damage: Damage, insuredItems: Item[]): number =>
  afterDeductible(
    reimbursableAmount(damage, insuredItemOfType(insuredItems, damage.itemType)),
  );

const settleClaim = (
  step: ClaimStep,
  insuredItems: Item[],
  availableCap: number,
): ClaimResult => {
  const { damages } = step.incident;
  assertNonNegativeDamages(damages);
  assertDamagesCoveredByPolicy(damages, insuredItems);
  const uncappedPayout = damages.reduce(
    (sum, damage) => sum + damagePayout(damage, insuredItems),
    0,
  );
  const payout = Math.floor(Math.min(uncappedPayout, availableCap));
  return { payout, remainingCap: availableCap - payout };
};

const policyItemsOf = (scenario: Scenario, claim: ClaimStep): Item[] =>
  (scenario.steps[claim.policy] as QuoteStep).items;

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  const availableCapOf = (claim: ClaimStep, insuredItems: Item[]): number =>
    remainingCaps.get(claim.policy) ?? claimCapOf(insuredItems);

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const isFollowUpContract = index > 0;
      return {
        premium: quotePremium(
          step.items,
          scenario.customer.yearsWithMHPCO,
          isFollowUpContract,
        ),
      };
    }
    const insuredItems = policyItemsOf(scenario, step);
    const result = settleClaim(
      step,
      insuredItems,
      availableCapOf(step, insuredItems),
    );
    remainingCaps.set(step.policy, result.remainingCap);
    return result;
  });
  return { results };
};
