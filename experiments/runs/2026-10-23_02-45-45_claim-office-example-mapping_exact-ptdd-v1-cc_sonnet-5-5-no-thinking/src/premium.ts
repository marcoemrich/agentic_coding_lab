import { basePremiumOf, isComponent } from "./catalog.js";
import { PERCENT, roundUpToWholeG } from "./rounding.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  followUp: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function formsBuildingBlock(type: string, count: number): boolean {
  return isComponent(type) && count === BLOCK_SIZE;
}

function typePremium(type: string, count: number): number {
  const unitPremium = basePremiumOf(type);
  if (formsBuildingBlock(type, count)) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * unitPremium;
}

export function basePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += typePremium(type, count);
  }
  return total;
}

function curseSurchargePercent(item: Item): number {
  return item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
}

function highEnchantmentSurchargePercent(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
}

function itemSurchargePercent(item: Item): number {
  return curseSurchargePercent(item) + highEnchantmentSurchargePercent(item);
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + basePremiumOf(item.type) * itemSurchargePercent(item),
    0,
  );
}

function loyaltyDiscountPercent(context: QuoteContext): number {
  return context.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
}

function followUpDiscountPercent(context: QuoteContext): number {
  return context.followUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
}

function policyWidePercent(context: QuoteContext): number {
  return (
    PERCENT +
    FIRST_INSURANCE_SURCHARGE_PERCENT -
    loyaltyDiscountPercent(context) -
    followUpDiscountPercent(context)
  );
}

export function quotePremium(items: Item[], context: QuoteContext): number {
  const scaledPremium = basePremium(items) * policyWidePercent(context) + itemRiskSurcharges(items);
  return roundUpToWholeG(scaledPremium) + PROCESSING_FEE;
}
