import { COMPONENT_TYPES, isComponent, type Item } from "./catalogue.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

function isInsurableType(type: string): boolean {
  return type in BASE_PREMIUMS || COMPONENT_TYPES.has(type);
}

function alikeComponentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function componentsBasePremium(items: Item[]): number {
  return [...COMPONENT_TYPES]
    .map((type) => items.filter((item) => item.type === type).length)
    .reduce((sum, count) => sum + alikeComponentsBasePremium(count), 0);
}

function mainItemsBasePremium(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
}

function policyBasePremium(items: Item[]): number {
  return mainItemsBasePremium(items) + componentsBasePremium(items);
}

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargePercent(item: Item): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

function itemRiskSurcharges(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + percentOf(BASE_PREMIUMS[item.type], riskSurchargePercent(item)), 0);
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  const loyaltyPercent = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyaltyPercent + followUpPercent;
}

function assertKnownItemTypes(items: Item[]): void {
  const unknown = items.find((item) => !isInsurableType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
}

function roundPremiumInMHPCOsFavor(amount: number): number {
  return Math.ceil(amount);
}

export function premiumFor(customer: Customer, items: Item[], isFollowUpContract: boolean): number {
  assertKnownItemTypes(items);
  const basePremium = policyBasePremium(items);
  const premium =
    basePremium +
    itemRiskSurcharges(items) +
    percentOf(basePremium, policyModifierPercent(customer, isFollowUpContract)) +
    PROCESSING_FEE;
  return roundPremiumInMHPCOsFavor(premium);
}
