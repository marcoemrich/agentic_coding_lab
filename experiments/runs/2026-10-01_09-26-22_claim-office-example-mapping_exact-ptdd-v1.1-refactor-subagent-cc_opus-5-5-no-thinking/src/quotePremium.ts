import type { Customer, Item } from "./claimOffice";
import { COMPONENT_BASE_PREMIUM, isComponent, mainItemBasePremium } from "./itemCatalogue";
import { percentOf } from "./percentage";

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

function mainItemsOf(items: Item[]): Item[] {
  return items.filter((item) => !isComponent(item));
}

function alikeComponentsBasePremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function componentCountsByType(components: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const component of components) {
    counts.set(component.type, (counts.get(component.type) ?? 0) + 1);
  }
  return counts;
}

function componentsBasePremium(components: Item[]): number {
  const alikeCounts = [...componentCountsByType(components).values()];
  return alikeCounts.reduce((sum, count) => sum + alikeComponentsBasePremium(count), 0);
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + mainItemBasePremium(item), 0);
}

function policyBasePremium(items: Item[]): number {
  return mainItemsBasePremium(mainItemsOf(items)) + componentsBasePremium(items.filter(isComponent));
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemRiskSurchargePercent(item: Item): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

function itemRiskSurcharge(item: Item): number {
  return percentOf(mainItemBasePremium(item), itemRiskSurchargePercent(item));
}

function policyRiskSurcharge(items: Item[]): number {
  return mainItemsOf(items).reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
}

function loyaltyDiscountPercent(customer: Customer): number {
  return customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
}

function followUpContractDiscountPercent(isFollowUpContract: boolean): number {
  return isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
}

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  return (
    FIRST_INSURANCE_SURCHARGE_PERCENT -
    loyaltyDiscountPercent(customer) -
    followUpContractDiscountPercent(isFollowUpContract)
  );
}

export function quotePremium(customer: Customer, items: Item[], isFollowUpContract: boolean): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharge = policyRiskSurcharge(items);
  const policyModifier = percentOf(basePremium, policyModifierPercent(customer, isFollowUpContract));
  const premium = basePremium + riskSurcharge + policyModifier + PROCESSING_FEE;
  return Math.ceil(premium);
}
