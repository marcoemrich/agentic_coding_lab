import type { Customer, Item } from "./claim-office.js";
import { itemBasePremium, policyBasePremium } from "./price-list.js";

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

function roundPremiumInMhpcoFavor(premium: number): number {
  return Math.ceil(premium);
}

function itemRiskSurcharge(item: Item): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  const surchargePercent = cursePercent + enchantmentPercent;
  return (itemBasePremium(item) * surchargePercent) / PERCENT;
}

export interface CustomerHistory extends Customer {
  previousContracts: number;
}

function policyModifierPercent(history: CustomerHistory): number {
  const loyaltyPercent = history.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = history.previousContracts > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyPercent - followUpPercent;
}

export function quotePremium(items: Item[], history: CustomerHistory): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharges = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const policyModifiers = (basePremium * policyModifierPercent(history)) / PERCENT;
  return roundPremiumInMhpcoFavor(basePremium + riskSurcharges + policyModifiers + PROCESSING_FEE);
}
