import { COMPONENT_PRICE, type InsuredItem, isComponent, priceOf } from "./price-list.js";

export type Customer = { yearsWithMHPCO: number };

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;

function alikeComponentsBasePremium(count: number): number {
  return count === BUILDING_BLOCK_SIZE
    ? BUILDING_BLOCK_BASE_PREMIUM
    : count * COMPONENT_PRICE.basePremium;
}

function mainItemBasePremium(item: InsuredItem): number {
  return priceOf(item.type).basePremium;
}

// "Alike" components are components of exactly the same type.
function componentsBasePremium(components: InsuredItem[]): number {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }
  return [...countsByType.values()].reduce(
    (sum, count) => sum + alikeComponentsBasePremium(count),
    0,
  );
}

function policyBasePremium(items: InsuredItem[]): number {
  const mainItems = items.filter((item) => !isComponent(item.type));
  return (
    mainItems.reduce((sum, item) => sum + mainItemBasePremium(item), 0) +
    componentsBasePremium(items.filter((item) => isComponent(item.type)))
  );
}

function isHighlyEnchanted(item: InsuredItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargePercent(item: InsuredItem): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

function itemSurcharges(items: InsuredItem[]): number {
  return items
    .filter((item) => !isComponent(item.type))
    .reduce(
      (sum, item) => sum + (mainItemBasePremium(item) * itemSurchargePercent(item)) / PERCENT,
      0,
    );
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  const loyaltyPercent = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyaltyPercent + followUpPercent;
}

export function quotePremium(
  customer: Customer,
  items: InsuredItem[],
  isFollowUpContract: boolean,
): number {
  const basePremium = policyBasePremium(items);
  const policyModifiers =
    (basePremium * policyModifierPercent(customer, isFollowUpContract)) / PERCENT;
  return Math.ceil(basePremium + itemSurcharges(items) + policyModifiers + PROCESSING_FEE);
}
