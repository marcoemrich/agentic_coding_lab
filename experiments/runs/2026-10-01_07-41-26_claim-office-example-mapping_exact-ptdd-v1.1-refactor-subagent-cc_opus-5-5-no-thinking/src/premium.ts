import {
  COMPONENT_PRICE_LIST_ENTRY,
  type Item,
  basePremiumOf,
  enchantmentLevelOf,
  isComponent,
} from "./item-catalog.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function alikeComponentsBasePremiumOf(count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * COMPONENT_PRICE_LIST_ENTRY.basePremium;
}

// "Alike" components are components of exactly the same type.
function countAlikeComponents(components: Item[]): number[] {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(
      component.type,
      (countsByType.get(component.type) ?? 0) + 1,
    );
  }
  return [...countsByType.values()];
}

function componentsBasePremiumOf(components: Item[]): number {
  return countAlikeComponents(components).reduce(
    (sum, count) => sum + alikeComponentsBasePremiumOf(count),
    0,
  );
}

function mainItemsBasePremiumOf(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0);
}

function policyBasePremiumOf(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  return (
    mainItemsBasePremiumOf(mainItems) + componentsBasePremiumOf(components)
  );
}

function curseSurchargeOf(item: Item): number {
  return item.cursed ? basePremiumOf(item) * CURSE_SURCHARGE_RATE : 0;
}

function isHighlyEnchanted(item: Item): boolean {
  return enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_LEVEL;
}

function highEnchantmentSurchargeOf(item: Item): number {
  return isHighlyEnchanted(item)
    ? basePremiumOf(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
}

function itemRiskSurchargesOf(items: Item[]): number {
  return items.reduce(
    (sum, item) =>
      sum + curseSurchargeOf(item) + highEnchantmentSurchargeOf(item),
    0,
  );
}

function isLoyalCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscountOf(
  policyBasePremium: number,
  customer: Customer,
): number {
  return isLoyalCustomer(customer)
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
}

function followUpContractDiscountOf(
  policyBasePremium: number,
  isFollowUpContract: boolean,
): number {
  return isFollowUpContract
    ? policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
}

function roundPremiumInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

// Policy-wide modifiers apply to the policy base premium; each quote counts as a first insurance.
function policyWideModifiersOf(
  policyBasePremium: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  return (
    policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE -
    loyaltyDiscountOf(policyBasePremium, customer) -
    followUpContractDiscountOf(policyBasePremium, isFollowUpContract)
  );
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const policyBasePremium = policyBasePremiumOf(items);
  return roundPremiumInMHPCOsFavor(
    policyBasePremium +
      itemRiskSurchargesOf(items) +
      policyWideModifiersOf(policyBasePremium, customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
}
