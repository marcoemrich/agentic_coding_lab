import type { Item } from "./magicalItem.js";
import { roundPremiumInMhpcoFavor } from "./mhpcoRounding.js";
import { BUILDING_BLOCK_OFFER, COMPONENT_PRICE, COMPONENT_TYPES, priceListEntry } from "./priceList.js";

const PROCESSING_FEE = 5;
const SAVINGS_PER_BUILDING_BLOCK =
  BUILDING_BLOCK_OFFER.componentCount * COMPONENT_PRICE.basePremium - BUILDING_BLOCK_OFFER.basePremium;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

const WHOLE_IN_PERCENT = 100;

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / WHOLE_IN_PERCENT;
}

function buildingBlockDiscount(items: Item[]): number {
  const blockCount = COMPONENT_TYPES.filter(
    (componentType) => items.filter((item) => item.type === componentType).length === BUILDING_BLOCK_OFFER.componentCount,
  ).length;
  return blockCount * SAVINGS_PER_BUILDING_BLOCK;
}

function itemBasePremium(item: Item): number {
  return priceListEntry(item.type).basePremium;
}

function policyBasePremium(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemBasePremium(item), 0) - buildingBlockDiscount(items);
}

function isHighlyEnchantedForPremium(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_LEVEL;
}

function itemRiskSurchargePercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantment = isHighlyEnchantedForPremium(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + highEnchantment;
}

function riskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + percentOf(itemBasePremium(item), itemRiskSurchargePercent(item)), 0);
}

function loyaltyDiscountPercent(yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
}

function followUpContractDiscountPercent(previousContracts: number): number {
  return previousContracts > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
}

function policyWideModifierPercent(yearsWithMHPCO: number, previousContracts: number): number {
  return (
    FIRST_INSURANCE_SURCHARGE_PERCENT -
    loyaltyDiscountPercent(yearsWithMHPCO) -
    followUpContractDiscountPercent(previousContracts)
  );
}

export function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const base = policyBasePremium(items);
  const policyWideModifier = percentOf(base, policyWideModifierPercent(yearsWithMHPCO, previousContracts));
  return roundPremiumInMhpcoFavor(base + riskSurcharges(items) + policyWideModifier + PROCESSING_FEE);
}
