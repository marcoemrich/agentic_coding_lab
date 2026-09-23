import { COMPONENT_BASE_PREMIUM, isComponent, mainItemBasePremium } from "./priceList.js";
import type { Customer, InsuredItem } from "./types.js";

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const PERCENT = 100;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;

const percentOf = (amount: number, percent: number): number => (amount * percent) / PERCENT;

function mainItemsBasePremium(items: InsuredItem[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + mainItemBasePremium(item), 0);
}

function alikeComponentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function componentsBasePremium(items: InsuredItem[]): number {
  const countsByType = new Map<string, number>();
  for (const item of items.filter(isComponent)) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }
  return [...countsByType.values()].reduce((sum, count) => sum + alikeComponentsBasePremium(count), 0);
}

function policyBasePremiumOf(items: InsuredItem[]): number {
  return mainItemsBasePremium(items) + componentsBasePremium(items);
}

const isHighlyEnchanted = (item: InsuredItem): boolean => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

function riskSurchargePercent(item: InsuredItem): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + highEnchantment;
}

function itemSurcharges(items: InsuredItem[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + percentOf(mainItemBasePremium(item), riskSurchargePercent(item)), 0);
}

const isLongStandingCustomer = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS;

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  const loyalty = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = isFollowUpContract ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyalty + followUp;
}

export function quotePremium(items: InsuredItem[], customer: Customer, isFollowUpContract: boolean): number {
  const policyBasePremium = policyBasePremiumOf(items);
  const policyModifiers = percentOf(policyBasePremium, policyModifierPercent(customer, isFollowUpContract));
  return Math.ceil(policyBasePremium + itemSurcharges(items) + policyModifiers + PROCESSING_FEE);
}
