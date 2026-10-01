import type { Customer, Item } from "./claimOffice.js";
import * as priceList from "./priceList.js";
import { roundPremiumInMHPCOsFavor } from "./rounding.js";

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const PERCENT = 100;
const PROCESSING_FEE = 5;

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function isBuildingBlock(type: string, count: number): boolean {
  return priceList.isComponent(type) && count === BLOCK_SIZE;
}

function groupBasePremium(type: string, count: number): number {
  return isBuildingBlock(type, count) ? BLOCK_BASE_PREMIUM : count * priceList.basePremium(type);
}

function policyBasePremium(items: Item[]): number {
  let sum = 0;
  for (const [type, count] of countByType(items)) sum += groupBasePremium(type, count);
  return sum;
}

function itemBasePremium(item: Item): number {
  return priceList.basePremium(item.type);
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

interface ItemRisk {
  appliesTo: (item: Item) => boolean;
  surchargePercent: number;
}

const ITEM_RISKS: ItemRisk[] = [
  { appliesTo: isCursed, surchargePercent: CURSE_SURCHARGE_PERCENT },
  { appliesTo: isHighlyEnchanted, surchargePercent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT },
];

function itemRiskSurcharge(item: Item): number {
  const applicablePercent = ITEM_RISKS.filter((risk) => risk.appliesTo(item)).reduce(
    (sum, risk) => sum + risk.surchargePercent,
    0,
  );
  return percentOf(itemBasePremium(item), applicablePercent);
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscountPercent(customer: Customer): number {
  return isLongStanding(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
}

function followUpContractDiscountPercent(previousContracts: number): number {
  return previousContracts > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
}

function policyWideAdjustment(
  basePremium: number,
  customer: Customer,
  previousContracts: number,
): number {
  const netPercent =
    FIRST_INSURANCE_SURCHARGE_PERCENT -
    loyaltyDiscountPercent(customer) -
    followUpContractDiscountPercent(previousContracts);
  return percentOf(basePremium, netPercent);
}

export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  const premium =
    basePremium +
    itemRiskSurcharges(items) +
    policyWideAdjustment(basePremium, customer, previousContracts) +
    PROCESSING_FEE;
  return roundPremiumInMHPCOsFavor(premium);
}
