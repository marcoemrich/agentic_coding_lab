import {
  COMPONENT_BASE_PREMIUM,
  COMPONENT_TYPES,
  isComponentType,
  quoteItemBasePremium,
} from "./quote-item-catalog.js";

interface PremiumItem {
  type: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;

function calculatePremiumForAlikeComponents(items: PremiumItem[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === BUILDING_BLOCK_SIZE ? BUILDING_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function calculatePolicyBasePremium(items: PremiumItem[]): number {
  const mainItemPremium = items
    .filter((item) => !isComponentType(item.type))
    .reduce((total, item) => total + quoteItemBasePremium(item), 0);
  const componentPremium = COMPONENT_TYPES
    .reduce((total, type) => total + calculatePremiumForAlikeComponents(items, type), 0);
  return mainItemPremium + componentPremium;
}

function calculateCurseSurcharge(items: PremiumItem[]): number {
  return items
    .filter((item) => item.cursed)
    .reduce((total, item) => total + quoteItemBasePremium(item) * CURSE_SURCHARGE_RATE, 0);
}

function isHighlyEnchanted(item: PremiumItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function calculateHighEnchantmentSurcharge(items: PremiumItem[]): number {
  return items
    .filter(isHighlyEnchanted)
    .reduce((total, item) => total + quoteItemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE, 0);
}

function calculateItemSpecificSurcharges(items: PremiumItem[]): number {
  return calculateCurseSurcharge(items) + calculateHighEnchantmentSurcharge(items);
}

function calculateInitialAssessmentSurcharge(basePremium: number): number {
  return basePremium * INITIAL_ASSESSMENT_RATE;
}

function calculateLoyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
}

function calculateFollowUpContractDiscount(basePremium: number, isFollowUpContract: boolean): number {
  return isFollowUpContract ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function finalizePremium(adjustedPremium: number): number {
  return Math.ceil(adjustedPremium + PROCESSING_FEE);
}

export function calculateQuotePremium(
  items: PremiumItem[] = [],
  yearsWithMHPCO = 0,
  isFollowUpContract = false,
): number {
  const basePremium = calculatePolicyBasePremium(items);
  const itemSpecificSurcharges = calculateItemSpecificSurcharges(items);
  const loyaltyDiscount = calculateLoyaltyDiscount(basePremium, yearsWithMHPCO);
  const initialAssessmentSurcharge = calculateInitialAssessmentSurcharge(basePremium);
  const followUpDiscount = calculateFollowUpContractDiscount(basePremium, isFollowUpContract);
  const adjustedPremium = basePremium + itemSpecificSurcharges + initialAssessmentSurcharge
    - loyaltyDiscount - followUpDiscount;
  return finalizePremium(adjustedPremium);
}
