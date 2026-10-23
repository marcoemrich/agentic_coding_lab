import { basePremiumOf, isComponent } from "./priceList.js";

const PROCESSING_FEE = 5;

const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const COMPONENT_BLOCK_SIZE = 3;

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const LOYALTY_DISCOUNT_RATE = 0.2;

const LOYALTY_MINIMUM_YEARS = 2;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  previousQuotes: number;
}

export function basePremium(items: QuoteItem[]): number {
  return policyBasePremium(items) + itemSurcharges(items);
}

function itemSurcharges(items: QuoteItem[]): number {
  return items
    .filter((item) => !isComponent(item.type))
    .reduce((total, item) => total + basePremiumOf(item.type) * riskSurchargeRate(item), 0);
}

export function itemPremium(item: QuoteItem): number {
  return basePremiumOf(item.type) * (1 + riskSurchargeRate(item));
}

function riskSurchargeRate(item: QuoteItem): number {
  const curseRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseRate + enchantmentRate;
}

function isHighlyEnchanted(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function componentBasePremium(items: QuoteItem[]): number {
  const componentsByType = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentsByType.set(item.type, (componentsByType.get(item.type) ?? 0) + 1);
    }
  }
  let total = 0;
  for (const count of componentsByType.values()) {
    total += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE_PREMIUM : count * basePremiumOf("rune");
  }
  return total;
}

export function quotePremium(items: QuoteItem[], context: QuoteContext): number {
  const unrounded = basePremium(items) + policyBasePremium(items) * policyRate(context) + PROCESSING_FEE;
  return roundPremiumInFavorOfMHPCO(unrounded);
}

function roundPremiumInFavorOfMHPCO(amount: number): number {
  return Math.ceil(amount);
}

function policyRate(context: QuoteContext): number {
  return FIRST_INSURANCE_SURCHARGE_RATE + loyaltyRate(context) - followUpContractRate(context);
}

function loyaltyRate(context: QuoteContext): number {
  return context.yearsWithMHPCO >= LOYALTY_MINIMUM_YEARS ? -LOYALTY_DISCOUNT_RATE : 0;
}

function followUpContractRate(context: QuoteContext): number {
  return context.previousQuotes > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
}

function policyBasePremium(items: QuoteItem[]): number {
  return mainItemBasePremiums(items) + componentBasePremium(items);
}

function mainItemBasePremiums(items: QuoteItem[]): number {
  return items
    .filter((item) => !isComponent(item.type))
    .reduce((total, item) => total + basePremiumOf(item.type), 0);
}
