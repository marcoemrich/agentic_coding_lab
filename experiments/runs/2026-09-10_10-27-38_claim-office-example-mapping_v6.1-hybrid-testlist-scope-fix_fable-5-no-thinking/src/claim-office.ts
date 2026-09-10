export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
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
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const roundUpInMHPCOsFavor = Math.ceil;
const roundDownInMHPCOsFavor = Math.floor;

const basePremiumFor = (type: string, count: number): number => {
  const unitPremium = BASE_PREMIUMS[type];
  if (unitPremium === undefined) {
    throw new Error(`unknown item type: "${type}"`);
  }
  const isComponentBlock =
    COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;
  return isComponentBlock ? COMPONENT_BLOCK_PREMIUM : count * unitPremium;
};

const countBy = <T>(
  items: T[],
  typeOf: (item: T) => string,
): Map<string, number> => {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    const type = typeOf(item);
    countsByType.set(type, (countsByType.get(type) ?? 0) + 1);
  }
  return countsByType;
};

const countItemsByType = (items: QuoteItem[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const isCursed = (item: QuoteItem): boolean => item.cursed === true;

const isHighlyEnchanted = (item: QuoteItem): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const perItemSurcharge = (
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  rate: number,
): number =>
  items.reduce(
    (total, item) =>
      total + (applies(item) ? BASE_PREMIUMS[item.type] * rate : 0),
    0,
  );

const quotePremium = (
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const basePremium = [...countItemsByType(items)].reduce(
    (total, [type, count]) => total + basePremiumFor(type, count),
    0,
  );
  const curseSurcharge = perItemSurcharge(items, isCursed, CURSE_SURCHARGE_RATE);
  const enchantmentSurcharge = perItemSurcharge(
    items,
    isHighlyEnchanted,
    ENCHANTMENT_SURCHARGE_RATE,
  );
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUpContract
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return roundUpInMHPCOsFavor(
    basePremium +
      curseSurcharge +
      enchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const reimbursementFor = (damage: Damage, policyItems: QuoteItem[]): number => {
  const damagedItem = policyItems.find(
    (item) => item.type === damage.itemType,
  );
  const isHalfReimbursed =
    (damagedItem?.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;
  return isHalfReimbursed
    ? damage.amount * HALF_REIMBURSEMENT_RATE
    : damage.amount;
};

const assertDamagesWithinInsuredCounts = (
  damages: Damage[],
  policyItems: QuoteItem[],
): void => {
  const insuredCounts = countItemsByType(policyItems);
  for (const [type, damageCount] of countBy(
    damages,
    (damage) => damage.itemType,
  )) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `claim rejected: ${damageCount} damage entries for "${type}" but only ${insuredCount} insured`,
      );
    }
  }
};

const assertNoNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`claim rejected: negative damage amount ${damage.amount}`);
    }
  }
};

const settleClaim = (
  claimStep: ClaimStep,
  policyItems: QuoteItem[],
  remainingCapBefore: number,
): ClaimResult => {
  const { damages } = claimStep.incident;
  assertNoNegativeDamageAmounts(damages);
  assertDamagesWithinInsuredCounts(damages, policyItems);
  const uncappedPayout = roundDownInMHPCOsFavor(
    damages.reduce(
      (total, damage) =>
        total + (reimbursementFor(damage, policyItems) - DEDUCTIBLE),
      0,
    ),
  );
  const payout = Math.min(uncappedPayout, remainingCapBefore);
  return { payout, remainingCap: remainingCapBefore - payout };
};

const initialPayoutCap = (policyItems: QuoteItem[]): number => {
  const insuranceSum = policyItems.reduce(
    (sum, item) => sum + INSURANCE_VALUES[item.type],
    0,
  );
  return insuranceSum * PAYOUT_CAP_MULTIPLIER;
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const remainingCapByPolicy = new Map<number, number>();
  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "claim") {
      const policyStep = scenario.steps[step.policy] as QuoteStep;
      const remainingCapBefore =
        remainingCapByPolicy.get(step.policy) ??
        initialPayoutCap(policyStep.items);
      const result = settleClaim(step, policyStep.items, remainingCapBefore);
      remainingCapByPolicy.set(step.policy, result.remainingCap);
      return result;
    }
    const isFollowUpContract = stepIndex > 0;
    return {
      premium: quotePremium(step.items, scenario.customer, isFollowUpContract),
    };
  });
  return { results };
};
