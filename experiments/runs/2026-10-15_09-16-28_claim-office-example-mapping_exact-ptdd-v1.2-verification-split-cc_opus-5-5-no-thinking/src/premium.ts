import { COMPONENT_TYPES, type Item, isComponent, mainItemPrices } from "./items.js";
import { percentOf } from "./percent.js";

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const LONG_STANDING_YEARS = 2;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

export interface Customer {
  yearsWithMHPCO: number;
}

const mainItemBasePremium = (item: Item): number => mainItemPrices(item).basePremium;

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + mainItemBasePremium(item), 0);
}

function alikeComponentsBasePremium(count: number): number {
  if (count === BUILDING_BLOCK_SIZE) {
    return BUILDING_BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

function componentsBasePremium(components: Item[]): number {
  return COMPONENT_TYPES.reduce(
    (sum, type) => sum + alikeComponentsBasePremium(components.filter((item) => item.type === type).length),
    0,
  );
}

function policyBasePremium(items: Item[]): number {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  return mainItemsBasePremium(mainItems) + componentsBasePremium(components);
}

const roundPremiumInMHPCOFavor = Math.ceil;

const isHighlyEnchanted = (item: Item): boolean => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

function itemRiskSurchargePercent(item: Item): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

function itemRiskSurcharges(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + percentOf(mainItemBasePremium(item), itemRiskSurchargePercent(item)), 0);
}

const isLongStandingCustomer = (customer: Customer): boolean => customer.yearsWithMHPCO >= LONG_STANDING_YEARS;

function policyWideModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  const loyaltyPercent = isLongStandingCustomer(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyPercent - followUpPercent;
}

export function quotePremium(items: Item[], customer: Customer, isFollowUpContract: boolean): number {
  const basePremium = policyBasePremium(items);
  const policyWideModifiers = percentOf(basePremium, policyWideModifierPercent(customer, isFollowUpContract));
  return roundPremiumInMHPCOFavor(basePremium + itemRiskSurcharges(items) + policyWideModifiers + PROCESSING_FEE);
}
