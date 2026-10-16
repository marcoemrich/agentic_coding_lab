import { alikeComponentsBasePremium, COMPONENT_TYPES, isComponent, mainItemBasePremium } from "./priceList.js";

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
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const PERCENT = 100;

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function componentsBasePremium(items: QuoteItem[]): number {
  return COMPONENT_TYPES.reduce(
    (sum, type) => sum + alikeComponentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
}

function mainItemsOf(items: QuoteItem[]): QuoteItem[] {
  return items.filter((item) => !isComponent(item.type));
}

function policyBasePremium(items: QuoteItem[]): number {
  return mainItemsOf(items).reduce((sum, item) => sum + mainItemBasePremium(item.type), 0) + componentsBasePremium(items);
}

function isHighlyEnchanted(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemRiskSurcharge(item: QuoteItem): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return percentOf(mainItemBasePremium(item.type), cursePercent + enchantmentPercent);
}

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  const loyaltyPercent = customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyPercent - followUpPercent;
}

export function premium(customer: Customer, items: QuoteItem[], isFollowUpContract: boolean): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharges = mainItemsOf(items).reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const policyModifiers = percentOf(basePremium, policyModifierPercent(customer, isFollowUpContract));
  return Math.ceil(basePremium + riskSurcharges + policyModifiers + PROCESSING_FEE);
}
