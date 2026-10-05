import { priceForItemType } from './catalogue.js';
import { componentBlockDiscount } from './building-block.js';
import { itemRiskSurcharge } from './item-risk.js';
import { loyaltyDiscount } from './loyalty.js';
import { followUpContractDiscount } from './follow-up-contract.js';
import type { Item } from './item.js';

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;

function totalBasePremium(items: Item[]): number {
  const base = items.reduce((sum, item) => sum + priceForItemType(item.type).basePremium, 0);
  return base - componentBlockDiscount(items);
}

function initialAssessmentSurcharge(basePremium: number): number {
  return basePremium * INITIAL_ASSESSMENT_RATE;
}

function finalPremium(premiumBeforeFee: number): number {
  return Math.ceil(premiumBeforeFee + PROCESSING_FEE);
}

export function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = totalBasePremium(items);
  const riskSurcharge = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const discount = loyaltyDiscount(basePremium, yearsWithMHPCO);
  const followUpDiscount = followUpContractDiscount(basePremium, previousContracts);
  return finalPremium(basePremium + initialAssessmentSurcharge(basePremium) + riskSurcharge - discount - followUpDiscount);
}
