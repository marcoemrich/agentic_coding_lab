export type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

export type Customer = { yearsWithMHPCO: number };

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;
export type ScenarioResult = { results: StepResult[] };

// Pricing & payout constants
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

// Per-item-type tables
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Component block rules
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Premium modifiers
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Claim reimbursement rules
const SEVERE_ENCHANTMENT_THRESHOLD = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const componentGroupBasePremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * (BASE_PREMIUMS[type] ?? 0);

const sumItemBasePremiums = (items: Item[]): number => {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }
  for (const [type, count] of componentCounts) {
    total += componentGroupBasePremium(type, count);
  }
  return total;
};

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const firstInsuranceSurchargeOn = (baseTotal: number): number =>
  baseTotal * FIRST_INSURANCE_SURCHARGE_RATE;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const loyaltyDiscountOn = (baseTotal: number, customer: Customer): number =>
  isLoyal(customer) ? baseTotal * LOYALTY_DISCOUNT_RATE : 0;

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUES)) {
      throw new Error(`unknown item type "${item.type}"`);
    }
  }
};

const quoteStep = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => {
  validateItemTypes(step.items);
  const baseTotal = sumItemBasePremiums(step.items);
  const itemSurchargesTotal = sumItemSurcharges(step.items);
  const firstInsurance = firstInsuranceSurchargeOn(baseTotal);
  const loyaltyDiscount = loyaltyDiscountOn(baseTotal, customer);
  const followUpDiscount = isFollowUp ? baseTotal * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = Math.ceil(
    baseTotal +
      itemSurchargesTotal +
      firstInsurance -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
  return { premium };
};

type Policy = { items: Item[]; remainingCap: number };

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

const createPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: policyInsuranceSum(items) * CAP_MULTIPLIER,
});

const reimbursableAmount = (damage: Damage, item: Item): number => {
  const enchantment = item.enchantment ?? 0;
  if (enchantment >= SEVERE_ENCHANTMENT_THRESHOLD) {
    return damage.amount * SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);

const findCoveredItem = (items: Item[], itemType: string): Item =>
  items.find((item) => item.type === itemType)!;

const sumDamagePayouts = (damages: Damage[], items: Item[]): number =>
  damages.reduce(
    (sum, damage) => sum + damagePayout(damage, findCoveredItem(items, damage.itemType)),
    0,
  );

const countBy = <T>(entries: T[], keyOf: (entry: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = keyOf(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const validateClaimCoverage = (damages: Damage[], items: Item[]): void => {
  const insuredCounts = countBy(items, (item) => item.type);
  const claimedCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, claimed] of claimedCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (claimed > insured) {
      throw new Error(
        `claim has ${claimed} damage(s) of type "${type}" but policy only covers ${insured}`,
      );
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(
      `damage amount must be non-negative, got ${negative.amount} for "${negative.itemType}"`,
    );
  }
};

const claimStep = (step: ClaimStep, policy: Policy): ClaimResult => {
  const { damages } = step.incident;
  validateDamageAmounts(damages);
  validateClaimCoverage(damages, policy.items);
  const requestedPayout = sumDamagePayouts(damages, policy.items);
  const payout = Math.floor(Math.min(requestedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "claim") return claimStep(step, policies[step.policy]);
    const isFollowUp = policies.length > 0;
    policies.push(createPolicy(step.items));
    return quoteStep(step, scenario.customer, isFollowUp);
  });
  return { results };
};
