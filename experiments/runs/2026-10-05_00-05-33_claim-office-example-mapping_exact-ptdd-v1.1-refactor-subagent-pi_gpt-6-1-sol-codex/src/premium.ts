import { riskSurchargesForItems } from './item-risk.js';
import { basePremiumForItems } from './policy-valuation.js';
import type { Item } from './item.js';
function roundFinalPremium(premium: number): number {
  return Math.ceil(premium);
}

const PROCESSING_FEE = 5;
function finalPremium(unroundedPremium: number): number {
  return roundFinalPremium(unroundedPremium + PROCESSING_FEE);
}

const INITIAL_ASSESSMENT = 0.1;
function initialAssessmentSurcharge(basePremium: number): number {
  return basePremium * INITIAL_ASSESSMENT;
}

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT : 0;
}

const FOLLOW_UP_DISCOUNT = 0.15;
function followUpContractDiscount(basePremium: number, priorContracts: number): number {
  return priorContracts > 0 ? basePremium * FOLLOW_UP_DISCOUNT : 0;
}

export function premiumForQuote(items: Item[], years: number, priorContracts: number): number {
  const base = basePremiumForItems(items);
  const { curse, enchantment } = riskSurchargesForItems(items);
  const loyalty = loyaltyDiscount(base, years);
  const followUp = followUpContractDiscount(base, priorContracts);
  return finalPremium(base + curse + enchantment + initialAssessmentSurcharge(base) - loyalty - followUp);
}
