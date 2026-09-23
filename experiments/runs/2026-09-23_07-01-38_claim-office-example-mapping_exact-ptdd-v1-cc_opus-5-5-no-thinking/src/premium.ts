import { COMPONENT, COMPONENT_TYPES, isComponent, mainItemEntry } from "./catalogue.js";
import type { Customer, Item } from "./claimOffice.js";

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
function alikeComponentsBasePremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE_PREMIUM : count * COMPONENT.basePremium;
}

function componentsBasePremium(items: Item[]): number {
  return COMPONENT_TYPES.reduce(
    (sum, type) => sum + alikeComponentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
}

function mainItemBasePremium(item: Item): number {
  return mainItemEntry(item).basePremium;
}

function mainItemsBasePremium(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + mainItemBasePremium(item), 0);
}

export function policyBasePremium(items: Item[]): number {
  return mainItemsBasePremium(items) + componentsBasePremium(items);
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargePercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + highEnchantment;
}

function itemSurcharges(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + (mainItemBasePremium(item) * riskSurchargePercent(item)) / PERCENT, 0);
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

function policyModifierPercent(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = isFollowUpContract(previousContracts) ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyalty + followUp;
}

function roundPremiumInMhpcoFavor(premium: number): number {
  return Math.ceil(premium);
}

export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  const policyModifier = (basePremium * policyModifierPercent(customer, previousContracts)) / PERCENT;
  return roundPremiumInMhpcoFavor(basePremium + itemSurcharges(items) + policyModifier + PROCESSING_FEE);
}
