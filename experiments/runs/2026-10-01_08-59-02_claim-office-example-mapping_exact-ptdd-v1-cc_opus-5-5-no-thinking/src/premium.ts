import type { Item } from "./claimOffice.js";
import { mainItemBasePremium, policyBasePremium } from "./priceList.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PERCENT = 100;

export type CustomerHistory = { yearsWithMHPCO: number; previousContracts: number };

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargePercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + highEnchantment;
}

function itemRiskSurchargesInPercentOfG(items: Item[]): number {
  return items.reduce((sum, item) => sum + mainItemBasePremium(item) * riskSurchargePercent(item), 0);
}

function isLongStandingCustomer(yearsWithMHPCO: number): boolean {
  return yearsWithMHPCO >= LOYALTY_YEARS;
}

function isFollowUpContract(customer: CustomerHistory): boolean {
  return customer.previousContracts > 0;
}

function policyModifierPercent(customer: CustomerHistory): number {
  const loyalty = isLongStandingCustomer(customer.yearsWithMHPCO) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = isFollowUpContract(customer) ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyalty + followUp;
}

export function quotePremium(items: Item[], customer: CustomerHistory): number {
  const premiumInPercentOfG =
    policyBasePremium(items) * (PERCENT + policyModifierPercent(customer)) +
    itemRiskSurchargesInPercentOfG(items);
  return Math.ceil(premiumInPercentOfG / PERCENT) + PROCESSING_FEE;
}
