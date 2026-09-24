import { enchantmentLevel, mainItems, policyBasePremium, priceListEntry, type Item } from "./itemCatalog.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function mainItemBasePremium(item: Item): number {
  return priceListEntry(item).basePremium;
}

function isHighlyEnchanted(item: Item): boolean {
  return enchantmentLevel(item) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemRiskSurchargeRate(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const highEnchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + highEnchantment;
}

function itemRiskSurcharges(items: Item[]): number {
  return mainItems(items).reduce((sum, item) => sum + mainItemBasePremium(item) * itemRiskSurchargeRate(item), 0);
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierRate(customer: Customer, isFollowUpContract: boolean): number {
  const loyalty = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUpContract = isFollowUpContract ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_SURCHARGE_RATE + loyalty + followUpContract;
}

export function quotePremium(customer: Customer, isFollowUpContract: boolean, items: Item[]): number {
  const basePremium = policyBasePremium(items);
  const policyModifiers = basePremium * policyModifierRate(customer, isFollowUpContract);
  return Math.ceil(basePremium + itemRiskSurcharges(items) + policyModifiers + PROCESSING_FEE);
}
