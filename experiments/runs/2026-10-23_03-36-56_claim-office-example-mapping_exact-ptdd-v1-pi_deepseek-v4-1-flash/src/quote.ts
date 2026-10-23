export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM,
  amulet: AMULET_BASE_PREMIUM,
  staff: STAFF_BASE_PREMIUM,
  potion: POTION_BASE_PREMIUM,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function insuranceValueOf(item: QuoteItem): number {
  return INSURANCE_VALUES[item.type] ?? 0;
}

export function insuranceSum(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function isComponent(item: QuoteItem): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function basePremiumOf(item: QuoteItem): number {
  return BASE_PREMIUMS[item.type] ?? 0;
}

function cursedSurchargeOf(item: QuoteItem): number {
  return item.cursed ? basePremiumOf(item) * CURSED_SURCHARGE : 0;
}

function isHighlyEnchanted(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function highEnchantmentSurchargeOf(item: QuoteItem): number {
  return isHighlyEnchanted(item)
    ? basePremiumOf(item) * HIGH_ENCHANTMENT_SURCHARGE
    : 0;
}

function itemSurchargeOf(item: QuoteItem): number {
  return cursedSurchargeOf(item) + highEnchantmentSurchargeOf(item);
}

function itemSurchargesOf(items: QuoteItem[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + itemSurchargeOf(item), 0);
}

function countByType(items: QuoteItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function componentBasePremium(items: QuoteItem[]): number {
  const counts = countByType(items.filter(isComponent));
  let total = 0;
  for (const count of counts.values()) {
    total +=
      count === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

export function basePremium(items: QuoteItem[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  return (
    mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0) +
    componentBasePremium(items)
  );
}

function roundUpInFavorOfMhpco(amount: number): number {
  return Math.ceil(amount);
}

function loyaltyDiscountOf(base: number, customer: Customer): number {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? base * LOYALTY_DISCOUNT
    : 0;
}

function policyWideModifiersOf(
  base: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE;
  const followUp = isFollowUpContract ? base * FOLLOW_UP_CONTRACT_DISCOUNT : 0;
  return firstInsurance - loyaltyDiscountOf(base, customer) - followUp;
}

export function quotePremium(
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const base = basePremium(items);
  return roundUpInFavorOfMhpco(
    base +
      itemSurchargesOf(items) +
      policyWideModifiersOf(base, customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
}
