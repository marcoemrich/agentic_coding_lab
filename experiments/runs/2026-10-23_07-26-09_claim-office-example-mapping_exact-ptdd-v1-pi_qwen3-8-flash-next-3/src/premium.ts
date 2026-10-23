export const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

// Base premiums from the MHPCO price list (G per item).
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  amulet: 60,
  moonstone: 25,
  potion: 40,
  rune: 25,
  staff: 80,
  sword: 100,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface CustomerProfile {
  yearsWithMHPCO: number;
}

export class ScenarioError extends Error {}

function basePremiumOf(type: string): number {
  return BASE_PREMIUM_BY_TYPE[type] ?? 0;
}

export function isKnownItemType(type: string): boolean {
  return type in BASE_PREMIUM_BY_TYPE;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function basePremiumForType(type: string, count: number): number {
  const isAlikeBlock =
    COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;
  return isAlikeBlock
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * basePremiumOf(type);
}

export function premiumForQuote(
  items: InsuredItem[],
  customer: CustomerProfile,
  isFollowUpContract: boolean,
): number {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new ScenarioError(`unknown item type: ${item.type}`);
    }
  }
  const policyBase = sumBasePremiumByType(items);
  const itemSurcharges =
    surchargesFor(items, isCursed, CURSED_SURCHARGE_PERCENT) +
    surchargesFor(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);
  const discounts = policyWideDiscounts(
    policyBase,
    customer,
    isFollowUpContract,
  );
  const firstInsurance = percentOf(policyBase, FIRST_INSURANCE_PERCENT);
  return Math.ceil(
    policyBase + itemSurcharges + firstInsurance - discounts + PROCESSING_FEE,
  );
}

function policyWideDiscounts(
  policyBase: number,
  customer: CustomerProfile,
  isFollowUpContract: boolean,
): number {
  const loyalty = isLoyaltyCustomer(customer)
    ? percentOf(policyBase, LOYALTY_DISCOUNT_PERCENT)
    : 0;
  const followUp = isFollowUpContract
    ? percentOf(policyBase, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT)
    : 0;
  return loyalty + followUp;
}

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function isLoyaltyCustomer(customer: CustomerProfile): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function isCursed(item: InsuredItem): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: InsuredItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL_THRESHOLD;
}

function surchargesFor(
  items: InsuredItem[],
  ruleApplies: (item: InsuredItem) => boolean,
  surchargePercent: number,
): number {
  return items
    .filter(ruleApplies)
    .map((item) => percentOf(basePremiumOf(item.type), surchargePercent))
    .reduce((sum, surcharge) => sum + surcharge, 0);
}

function sumBasePremiumByType(items: InsuredItem[]): number {
  const countByType = new Map<string, number>();
  for (const item of items) {
    countByType.set(item.type, (countByType.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of countByType) {
    total += basePremiumForType(type, count);
  }
  return total;
}
