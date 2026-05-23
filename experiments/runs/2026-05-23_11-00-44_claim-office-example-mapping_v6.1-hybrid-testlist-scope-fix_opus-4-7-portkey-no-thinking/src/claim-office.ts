export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_BASE = 60;

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUM;

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const baseForGroup = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === 3) return BLOCK_BASE;
  return BASE_PREMIUM[type] * count;
};

const countBy = <T>(items: readonly T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const sum = (numbers: number[]): number =>
  numbers.reduce((total, n) => total + n, 0);

export const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = sum(items.map((item) => INSURANCE_VALUE[item.type]));
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
};

const groupBaseTotal = (items: Item[]): number => {
  const counts = countByType(items);
  return sum(
    Array.from(counts, ([type, count]) => baseForGroup(type, count)),
  );
};

const itemSurchargeTotal = (items: Item[]): number =>
  sum(items.map((item) => surchargesFor(item)));

const surchargesFor = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  let total = 0;
  if (item.cursed) total += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) total += base * 0.3;
  return total;
};

const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export const quote = (
  customer: Customer,
  items: Item[],
  priorContracts: number,
): number => {
  assertKnownItemTypes(items);
  const groupBase = groupBaseTotal(items);
  const firstInsurance = groupBase * FIRST_INSURANCE_RATE;
  const surcharges = itemSurchargeTotal(items);
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? groupBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = priorContracts > 0 ? groupBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(
    groupBase + firstInsurance + surcharges - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const isHighlyEnchanted = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item | undefined): number =>
  isHighlyEnchanted(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const findInsuredItem = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((item) => item.type === itemType);

const payoutForDamage = (damage: Damage, policy: Policy): number => {
  const item = findInsuredItem(policy, damage.itemType);
  return reimbursableAmount(damage, item) - DEDUCTIBLE;
};

const assertDamagesNonNegative = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`Damage amount must be non-negative: ${negative.amount}`);
  }
};

const assertDamagesCovered = (policy: Policy, damages: Damage[]): void => {
  const itemCounts = countByType(policy.items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(`Damage count for ${type} exceeds policy coverage`);
    }
  }
};

const totalPayoutBeforeCap = (policy: Policy, damages: Damage[]): number =>
  sum(damages.map((damage) => payoutForDamage(damage, policy)));

const cappedPayout = (policy: Policy, damages: Damage[]): number =>
  Math.floor(Math.min(totalPayoutBeforeCap(policy, damages), policy.remainingCap));

export const claim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  assertDamagesNonNegative(incident.damages);
  assertDamagesCovered(policy, incident.damages);
  const payout = cappedPayout(policy, incident.damages);
  return { payout, remainingCap: policy.remainingCap - payout };
};
