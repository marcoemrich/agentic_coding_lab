import type { ItemInput } from "./scenario.js";
import { catalogBasePremium, itemBasePremium } from "./catalog.js";

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_MIN_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function curseSurcharge(items: ItemInput[]): number {
  const cursedItemsBasePremium = items
    .filter((item) => item.cursed === true)
    .reduce((sum, item) => sum + itemBasePremium(item), 0);
  return (cursedItemsBasePremium * CURSE_SURCHARGE_PERCENT) / PERCENT;
}

function highEnchantmentSurcharge(items: ItemInput[]): number {
  const highlyEnchantedItemsBasePremium = items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN_LEVEL)
    .reduce((sum, item) => sum + itemBasePremium(item), 0);
  return (
    (highlyEnchantedItemsBasePremium * HIGH_ENCHANTMENT_SURCHARGE_PERCENT) /
    PERCENT
  );
}

function itemRiskSurcharge(items: ItemInput[]): number {
  return curseSurcharge(items) + highEnchantmentSurcharge(items);
}

function loyaltyDiscount(
  policyBasePremium: number,
  yearsWithMHPCO: number,
): number {
  if (yearsWithMHPCO < LOYALTY_MIN_YEARS) {
    return 0;
  }
  return (policyBasePremium * LOYALTY_DISCOUNT_PERCENT) / PERCENT;
}

function followUpDiscount(
  policyBasePremium: number,
  isFollowUpContract: boolean,
): number {
  if (!isFollowUpContract) {
    return 0;
  }
  return (policyBasePremium * FOLLOW_UP_DISCOUNT_PERCENT) / PERCENT;
}

export function quotePremium(
  items: ItemInput[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const policyBasePremium = catalogBasePremium(items);
  const firstInsuranceSurcharge =
    (policyBasePremium * FIRST_INSURANCE_SURCHARGE_PERCENT) / PERCENT;
  return Math.ceil(
    policyBasePremium +
      itemRiskSurcharge(items) -
      loyaltyDiscount(policyBasePremium, yearsWithMHPCO) -
      followUpDiscount(policyBasePremium, isFollowUpContract) +
      firstInsuranceSurcharge +
      PROCESSING_FEE,
  );
}
