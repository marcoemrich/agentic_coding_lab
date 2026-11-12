import { percentOf } from "./percent.js";
import { type Item, isComponent, itemBasePremium } from "./price-list.js";
import { roundPremiumInMHPCOsFavor } from "./rounding.js";

export interface CustomerHistory {
  yearsWithMHPCO: number;
  previousContracts: number;
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function formsBuildingBlock(alikeItems: Item[]): boolean {
  return isComponent(alikeItems[0]) && alikeItems.length === BLOCK_SIZE;
}

function groupAlikeItems(items: Item[]): Item[][] {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  }
  return [...groups.values()];
}

function alikeItemsBasePremium(alikeItems: Item[]): number {
  if (formsBuildingBlock(alikeItems)) {
    return BLOCK_BASE_PREMIUM;
  }
  return alikeItems.reduce((sum, item) => sum + itemBasePremium(item), 0);
}

export function policyBasePremium(items: Item[]): number {
  return groupAlikeItems(items).reduce((sum, alikeItems) => sum + alikeItemsBasePremium(alikeItems), 0);
}

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function riskSurchargePercent(item: Item): number {
  return (
    (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0)
  );
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + percentOf(itemBasePremium(item), riskSurchargePercent(item)), 0);
}

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LONG_STANDING_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

function isLongStandingCustomer(customer: CustomerHistory): boolean {
  return customer.yearsWithMHPCO >= LONG_STANDING_YEARS;
}

function isFollowUpContract(customer: CustomerHistory): boolean {
  return customer.previousContracts > 0;
}

function policyWideModifierPercent(customer: CustomerHistory): number {
  return (
    FIRST_INSURANCE_SURCHARGE_PERCENT -
    (isLongStandingCustomer(customer) ? LOYALTY_DISCOUNT_PERCENT : 0) -
    (isFollowUpContract(customer) ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0)
  );
}

function policyWideModifiers(basePremium: number, customer: CustomerHistory): number {
  return percentOf(basePremium, policyWideModifierPercent(customer));
}

const PROCESSING_FEE = 5;

export function quotePremium(items: Item[], customer: CustomerHistory): number {
  const basePremium = policyBasePremium(items);
  return roundPremiumInMHPCOsFavor(
    basePremium + itemRiskSurcharges(items) + policyWideModifiers(basePremium, customer) + PROCESSING_FEE,
  );
}
