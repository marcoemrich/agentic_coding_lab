type InsuredItem = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

type Customer = { yearsWithMHPCO: number };

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_DISCOUNTABLE_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUE_MULTIPLIER = 10;
const CAP_MULTIPLIER = 2;

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const basePremiumForType = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const insuranceValueForType = (type: string): number =>
  basePremiumForType(type) * INSURANCE_VALUE_MULTIPLIER;

const premiumForGroup = (type: string, count: number): number => {
  if (BLOCK_DISCOUNTABLE_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * basePremiumForType(type);
};

const itemTypes = (items: InsuredItem[]): string[] =>
  items.map((item) => item.type);

const countByType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const basePremiumForItems = (items: InsuredItem[]): number => {
  const groups = countByType(itemTypes(items));
  let total = 0;
  for (const [type, count] of groups) {
    if (!isKnownItemType(type)) {
      throw new Error(`Unknown item type: ${type}`);
    }
    total += premiumForGroup(type, count);
  }
  return total;
};

const itemSurchargeFor = (item: InsuredItem): number => {
  const base = basePremiumForType(item.type);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const totalItemSurchargeFor = (items: InsuredItem[]): number =>
  items.reduce((total, item) => total + itemSurchargeFor(item), 0);

const firstInsuranceSurchargeFor = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const followUpDiscountFor = (
  basePremium: number,
  contractIndex: number,
): number =>
  contractIndex > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const loyaltyDiscountFor = (customer: Customer, basePremium: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

export const quote = (
  customer: Customer,
  items: InsuredItem[],
  contractIndex: number = 0,
): number => {
  const policyBasePremium = basePremiumForItems(items);
  const itemSurcharges = totalItemSurchargeFor(items);
  const firstInsuranceSurcharge = firstInsuranceSurchargeFor(policyBasePremium);
  const followUpDiscount = followUpDiscountFor(
    policyBasePremium,
    contractIndex,
  );
  const loyaltyDiscount = loyaltyDiscountFor(customer, policyBasePremium);
  return Math.ceil(
    PROCESSING_FEE +
      policyBasePremium +
      itemSurcharges +
      firstInsuranceSurcharge -
      followUpDiscount -
      loyaltyDiscount,
  );
};

export type Policy = {
  items: InsuredItem[];
  insuranceSum: number;
  remainingCap: number;
};

type Damage = { itemType: string; amount: number };

type Incident = { cause: string; damages: Damage[] };

export const createPolicy = (items: InsuredItem[]): Policy => {
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValueForType(item.type),
    0,
  );
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const DAMAGE_DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_MULTIPLIER = 0.5;

const damageAfterPriorityClauses = (
  amount: number,
  item?: InsuredItem,
): number => {
  if (item && item.enchantment >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_DAMAGE_MULTIPLIER;
  }
  // Dragon-material items are reimbursed in full, so no reduction applies.
  return amount;
};

const reimbursableDamageFor = (
  item: InsuredItem | undefined,
  amount: number,
): number => {
  if (amount < 0) throw new Error("Damage amount must be non-negative");
  const amountAfterClauses = damageAfterPriorityClauses(amount, item);
  return Math.max(0, amountAfterClauses - DAMAGE_DEDUCTIBLE);
};

const cappedPayout = (
  requestedPayout: number,
  remainingCap: number,
): { payout: number; newRemainingCap: number } => {
  const payout = Math.min(requestedPayout, remainingCap);
  return { payout, newRemainingCap: remainingCap - payout };
};

const validateDamageCounts = (
  policyCounts: Map<string, number>,
  damageCounts: Map<string, number>,
): void => {
  for (const [type, count] of damageCounts) {
    if (!policyCounts.has(type)) {
      throw new Error(`Item type ${type} is not part of the policy`);
    }
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(`More damages for ${type} than policy covers`);
    }
  }
};

export const claim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  const policyCounts = countByType(itemTypes(policy.items));
  const damageCounts = countByType(
    incident.damages.map((d) => d.itemType),
  );
  validateDamageCounts(policyCounts, damageCounts);
  let requestedPayout = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    requestedPayout += reimbursableDamageFor(item, damage.amount);
  }
  const { payout, newRemainingCap } = cappedPayout(
    requestedPayout,
    policy.remainingCap,
  );
  policy.remainingCap = newRemainingCap;
  return { payout: Math.floor(payout), remainingCap: newRemainingCap };
};

type ScenarioStep =
  | { op: "quote"; items: InsuredItem[] }
  | { op: "claim"; policy: number; incident: Incident };

type Scenario = {
  customer: Customer;
  steps: ScenarioStep[];
};

export const processScenario = (scenario: Scenario): { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> } => {
  const results: Array<{ premium?: number; payout?: number; remainingCap?: number }> = [];
  const policies: Policy[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      policies.push(createPolicy(step.items));
      const premium = quote(
        scenario.customer,
        step.items,
        policies.length - 1,
      );
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      const result = claim(policy, step.incident);
      results.push(result);
    }
  }
  return { results };
};
