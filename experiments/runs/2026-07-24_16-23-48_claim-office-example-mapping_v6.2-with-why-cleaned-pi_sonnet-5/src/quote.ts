import type { Item } from "./catalog.js";
import { computeItemBasePremium, computeItemsBasePremium } from "./catalog.js";
import { roundPremium } from "./rounding.js";

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const computeItemSurchargeRate = (item: Item): number => {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return rate;
};

const computeItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + computeItemBasePremium(item) * computeItemSurchargeRate(item), 0);

export const computeRawPolicyPremium = (items: Item[]): number =>
  computeItemsBasePremium(items) + computeItemSurcharges(items);

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const computeLoyaltyDiscount = (customer: Customer, policyBase: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_DISCOUNT_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

export const computeQuotePremium = (customer: Customer, items: Item[], isFirstContract: boolean): number => {
  const policyBase = computeItemsBasePremium(items);
  const raw = policyBase + computeItemSurcharges(items);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = computeLoyaltyDiscount(customer, policyBase);
  const followUpContractDiscount = isFirstContract ? 0 : policyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  return (
    roundPremium(raw + firstInsuranceSurcharge - loyaltyDiscount - followUpContractDiscount) + PROCESSING_FEE
  );
};
