export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const itemBasePremium = (item: Item): number => {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_BASE_PREMIUM;
  return BASE_PREMIUM[item.type] ?? 0;
};

const itemSurcharges = (item: Item): number => {
  let surcharge = 0;
  if (item.cursed) surcharge += itemBasePremium(item) * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
};

const componentBasePremium = (count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_BASE_PREMIUM;
  return count * COMPONENT_BASE_PREMIUM;
};

const itemSurchargeTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const basePremium = (items: Item[]): number => {
  let total = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += BASE_PREMIUM[item.type] ?? 0;
    }
  }
  for (const count of Object.values(componentCounts)) {
    total += componentBasePremium(count);
  }
  return total;
};

export const quote = (
  customer: Customer,
  items: Item[],
  priorContracts: number
): number => {
  const base = basePremium(items);
  const modifier = (rate: number, applies: boolean): number =>
    applies ? base * rate : 0;

  const firstInsuranceSurcharge = modifier(FIRST_INSURANCE_SURCHARGE_RATE, true);
  const loyaltyDiscount = modifier(
    LOYALTY_DISCOUNT_RATE,
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
  );
  const followupDiscount = modifier(FOLLOWUP_DISCOUNT_RATE, priorContracts > 0);

  const premium =
    base +
    itemSurchargeTotal(items) +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followupDiscount +
    PROCESSING_FEE;

  return Math.ceil(premium);
};

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const itemInsuranceValue = (item: Item): number => {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUE[item.type] ?? 0;
};

export const insuranceSum = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
};

export const cap = (items: Item[]): number => {
  return insuranceSum(items) * CAP_MULTIPLIER;
};
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const damageReimbursement = (items: Item[], damage: Damage): number => {
  const item = items.find((i) => i.type === damage.itemType);
  const isHighEnchantment =
    (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  const covered = isHighEnchantment
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, covered - DEDUCTIBLE);
};

export const claim = (
  items: Item[],
  damages: Damage[],
  remainingCap: number
): ClaimResult => {
  const reimbursableTotal = damages.reduce(
    (sum, damage) => sum + damageReimbursement(items, damage),
    0
  );
  const payout = Math.min(Math.floor(reimbursableTotal), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

const KNOWN_ITEM_TYPES = new Set([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

const countByType = (items: Item[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
};

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

export const runScenario = (scenario: Scenario): StepResult[] => {
  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;

  steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const premium = quote(customer, step.items, quoteCount);
      quoteCount += 1;
      policies[index] = { items: step.items, remainingCap: cap(step.items) };
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`No policy at step ${step.policy}`);
      }
      const { damages } = step.incident;
      validateDamages(policy.items, damages);
      const result = claim(policy.items, damages, policy.remainingCap);
      policy.remainingCap = result.remainingCap;
      results.push(result);
    }
  });

  return results;
};

const validateDamages = (items: Item[], damages: Damage[]): void => {
  const coveredCounts = countByType(items);
  const claimedCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!KNOWN_ITEM_TYPES.has(damage.itemType)) {
      throw new Error(`Unknown item type: ${damage.itemType}`);
    }
    claimedCounts[damage.itemType] =
      (claimedCounts[damage.itemType] ?? 0) + 1;
    if (claimedCounts[damage.itemType] > (coveredCounts[damage.itemType] ?? 0)) {
      throw new Error(`Damage to uninsured item: ${damage.itemType}`);
    }
  }
};
