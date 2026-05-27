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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult { premium: number }
export interface ClaimResult { payout: number; remainingCap: number }
export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// Insurance value is always 10x the base premium for every item type.
const INSURANCE_VALUE_TO_PREMIUM_RATIO = 10;

const ITEM_BASE_PREMIUM: Record<string, number> = {
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

const isKnownItemType = (type: string): boolean => type in ITEM_BASE_PREMIUM;

const basePremiumForType = (type: string): number => ITEM_BASE_PREMIUM[type] ?? 0;

const insuranceValueForType = (type: string): number =>
  basePremiumForType(type) * INSURANCE_VALUE_TO_PREMIUM_RATIO;

type Damage = ClaimStep["incident"]["damages"][number];

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countItemsByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const countDamagesByItemType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const isComponentType = (type: string): boolean => COMPONENT_TYPES.has(type);

const qualifiesForComponentBlock = (type: string, count: number): boolean =>
  isComponentType(type) && count === COMPONENT_BLOCK_SIZE;

const groupPremium = (type: string, count: number): number => {
  if (qualifiesForComponentBlock(type, count)) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * basePremiumForType(type);
};

const sumBasePremiums = (items: Item[]): number =>
  Array.from(countItemsByType(items)).reduce(
    (total, [type, count]) => total + groupPremium(type, count),
    0,
  );

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;

const itemSurcharge = (item: Item): number => {
  const base = basePremiumForType(item.type);
  const cursed = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchanted = isHighlyEnchanted(item) ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return cursed + enchanted;
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const loyaltyDiscount = (customer: Customer, basePremium: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const followUpContractDiscount = (isFollowUp: boolean, basePremium: number): number =>
  isFollowUp ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueForType(item.type), 0);
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
};

const isHighEnchantmentForPayout = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const computeDamagePayout = (item: Item, damageAmount: number): number => {
  const amountBeforeDeductible = isHighEnchantmentForPayout(item)
    ? damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damageAmount;
  return Math.max(0, amountBeforeDeductible - DEDUCTIBLE);
};

const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (!item) throw new Error(`item ${itemType} not in policy`);
  return item;
};

const sumDesiredPayout = (policy: Policy, damages: Damage[]): number =>
  damages.reduce(
    (total, damage) =>
      total + computeDamagePayout(findInsuredItem(policy, damage.itemType), damage.amount),
    0,
  );

const validateDamageCountsWithinPolicy = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countItemsByType(policy.items);
  const damageCounts = countDamagesByItemType(damages);
  for (const [type, damageCount] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(`more ${type} damages (${damageCount}) than insured (${insuredCount})`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative, got ${damage.amount}`);
    }
  }
};

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  validateDamageAmounts(step.incident.damages);
  validateDamageCountsWithinPolicy(policy, step.incident.damages);
  const desired = sumDesiredPayout(policy, step.incident.damages);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const validateKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const quote = (step: QuoteStep, customer: Customer, isFollowUp: boolean): QuoteResult => {
  validateKnownItemTypes(step.items);
  const basePremium = sumBasePremiums(step.items);
  const surcharges =
    sumItemSurcharges(step.items) + firstInsuranceSurcharge(basePremium);
  const discounts =
    loyaltyDiscount(customer, basePremium) +
    followUpContractDiscount(isFollowUp, basePremium);
  const premiumBeforeProcessingFee = basePremium + surcharges - discounts;
  return { premium: Math.ceil(premiumBeforeProcessingFee + PROCESSING_FEE) };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let priorQuoteCount = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push(quote(step, scenario.customer, priorQuoteCount > 0));
      policies.push(createPolicy(step.items));
      priorQuoteCount += 1;
    } else {
      results.push(processClaim(step, policies));
    }
  }
  return { results };
};
