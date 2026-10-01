import { itemBasePremium, policyBasePremium, type Item } from "./priceList.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const WHOLE_IN_PERCENT = 100;

const percentOf = (amount: number, percent: number): number => (amount * percent) / WHOLE_IN_PERCENT;

const roundPremiumInMhpcoFavor = Math.ceil;

const isHighlyEnchanted = (item: Item): boolean => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

function itemRiskSurcharge(item: Item): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return percentOf(itemBasePremium(item), cursePercent + enchantmentPercent);
}

export interface Customer {
  yearsWithMHPCO: number;
}

const isLongStandingCustomer = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS;

const isFollowUpContract = (previousContracts: number): boolean => previousContracts > 0;

function policyModifierPercent(customer: Customer, previousContracts: number): number {
  const loyaltyPercent = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract(previousContracts) ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyaltyPercent + followUpPercent;
}

export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const base = policyBasePremium(items);
  const riskSurcharges = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const policyModifiers = percentOf(base, policyModifierPercent(customer, previousContracts));
  return roundPremiumInMhpcoFavor(base + riskSurcharges + policyModifiers + PROCESSING_FEE);
}
