import { getItemBasePremium, getPriceListEntry } from "./price-list.js";

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_QUOTE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function roundPremiumInFavorOfMHPCO(amount: number): number {
  return Math.ceil(amount);
}

function isBuildingBlockOfAlikeComponents(
  type: string,
  count: number
): boolean {
  return getPriceListEntry(type).isComponent && count === COMPONENT_BLOCK_SIZE;
}

function calculatePolicyBasePremium(items: QuoteItem[]): number {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of countsByType.entries()) {
    total += isBuildingBlockOfAlikeComponents(type, count)
      ? COMPONENT_BLOCK_BASE_PREMIUM
      : count * getItemBasePremium(type);
  }
  return total;
}

function isHighlyEnchantedForQuote(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_QUOTE_THRESHOLD;
}

function calculateItemRiskSurcharge(item: QuoteItem): number {
  const itemBase = getItemBasePremium(item.type);
  const cursedSurcharge = item.cursed ? itemBase * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchantedForQuote(item)
    ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return cursedSurcharge + enchantmentSurcharge;
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function calculatePolicyWideModifiers(
  basePremium: number,
  customer: Customer,
  isFollowUpContract: boolean
): number {
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = isLongStandingCustomer(customer)
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUpContract
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

export function calculateQuotePremium(
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean
): number {
  const basePremium = calculatePolicyBasePremium(items);
  const itemSurcharges = items.reduce(
    (sum, item) => sum + calculateItemRiskSurcharge(item),
    0
  );
  const policyModifiers = calculatePolicyWideModifiers(
    basePremium,
    customer,
    isFollowUpContract
  );
  return roundPremiumInFavorOfMHPCO(
    basePremium + itemSurcharges + policyModifiers + PROCESSING_FEE
  );
}
