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

export interface ScenarioResult {
  results: StepResult[];
}

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const PROCESSING_FEE = 5;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PREMIUM = 60;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countItemsByType = (items: QuoteItem[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const sumBy = <T>(items: Iterable<T>, valueOf: (item: T) => number): number => {
  let total = 0;
  for (const item of items) {
    total += valueOf(item);
  }
  return total;
};

const basePremiumForType = (type: string): number => {
  const basePremium = ITEM_BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
};

const premiumForAlikeGroup = (type: string, count: number): number => {
  const basePremium = basePremiumForType(type);
  const formsExactlyOneBlock = count === ALIKE_BLOCK_SIZE;
  return formsExactlyOneBlock ? ALIKE_BLOCK_PREMIUM : count * basePremium;
};

const calculatePolicyBasePremium = (items: QuoteItem[]): number =>
  sumBy(countItemsByType(items), ([type, count]) =>
    premiumForAlikeGroup(type, count),
  );

const itemSurcharge = (
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  rate: number,
): number =>
  sumBy(items, (item) =>
    applies(item) ? basePremiumForType(item.type) * rate : 0,
  );

const calculateCurseSurcharge = (items: QuoteItem[]): number =>
  itemSurcharge(items, (item) => item.cursed === true, CURSE_SURCHARGE_RATE);

const calculateHighEnchantmentSurcharge = (items: QuoteItem[]): number =>
  itemSurcharge(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );

const calculateQuotePremium = (
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const policyBasePremium = calculatePolicyBasePremium(items);
  const curseSurcharge = calculateCurseSurcharge(items);
  const highEnchantmentSurcharge = calculateHighEnchantmentSurcharge(items);
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? policyBasePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUpContract
    ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return Math.ceil(
    policyBasePremium +
      curseSurcharge +
      highEnchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};
const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
// Claim-side threshold — a separate business rule from the premium-side
// HIGH_ENCHANTMENT_THRESHOLD (5); do not merge them.
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const calculateInsuranceSum = (items: QuoteItem[]): number =>
  sumBy(items, (item) => ITEM_INSURANCE_VALUES[item.type]);

const initialPayoutCap = (policy: QuoteStep): number =>
  calculateInsuranceSum(policy.items) * PAYOUT_CAP_MULTIPLIER;

const reimbursementForDamage = (
  damage: Damage,
  insuredItems: QuoteItem[],
): number => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const damagedItem = insuredItems.find(
    (item) => item.type === damage.itemType,
  );
  if (damagedItem === undefined) {
    throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  }
  const hasHighEnchantment =
    (damagedItem.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
  const reimbursedAmount = hasHighEnchantment
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursedAmount - DEDUCTIBLE;
};

const assertDamagesCoveredByPolicy = (
  damages: Damage[],
  insuredItems: QuoteItem[],
): void => {
  const insuredCounts = countItemsByType(insuredItems);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, damageCount] of damageCounts) {
    if (damageCount > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More damages than insured items of type: ${type}`);
    }
  }
};

const processClaim = (
  claimStep: ClaimStep,
  policy: QuoteStep,
  remainingCapBefore: number,
): ClaimResult => {
  assertDamagesCoveredByPolicy(claimStep.incident.damages, policy.items);
  const totalReimbursed = sumBy(claimStep.incident.damages, (damage) =>
    reimbursementForDamage(damage, policy.items),
  );
  const payout = Math.min(Math.floor(totalReimbursed), remainingCapBefore);
  return { payout, remainingCap: remainingCapBefore - payout };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      const policy = scenario.steps[step.policy] as QuoteStep;
      const remainingCapBefore =
        remainingCaps.get(step.policy) ?? initialPayoutCap(policy);
      const result = processClaim(step, policy, remainingCapBefore);
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }
    const isFollowUpContract = index > 0;
    return {
      premium: calculateQuotePremium(
        step.items,
        scenario.customer,
        isFollowUpContract,
      ),
    };
  });
  return { results };
};
