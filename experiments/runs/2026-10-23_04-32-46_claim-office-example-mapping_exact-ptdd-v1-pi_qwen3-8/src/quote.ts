import type { QuoteItem } from "./types";

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function componentBasePremium(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * BASE_PREMIUM[type];
}

export function basePremiumFor(items: QuoteItem[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += BASE_PREMIUM[item.type];
    }
  }
  for (const [type, count] of componentCounts) {
    total += componentBasePremium(type, count);
  }
  return total;
}

const PROCESSING_FEE = 5;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function itemBasePremium(item: QuoteItem): number {
  return BASE_PREMIUM[item.type];
}

function isHighlyEnchanted(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemRiskSurcharge(item: QuoteItem): number {
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += itemBasePremium(item) * CURSED_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    surcharge += itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function isLongStandingCustomer(yearsWithMHPCO: number): boolean {
  return yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;
}

function rejectUnknownItemType(type: string): void {
  if (!(type in BASE_PREMIUM)) {
    throw new Error(`unknown item type '${type}'`);
  }
}

export function quotePremium(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  for (const item of items) {
    rejectUnknownItemType(item.type);
  }
  const policyBase = basePremiumFor(items);
  let total = policyBase;
  for (const item of items) {
    total += itemRiskSurcharge(item);
  }
  total += policyBase * FIRST_INSURANCE_RATE;
  if (isLongStandingCustomer(yearsWithMHPCO)) {
    total -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUpContract) {
    total -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }
  return Math.ceil(total + PROCESSING_FEE);
}
