import { basePremiumOf, type Item } from "./catalogue.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PERCENT = 100;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function alikeGroupBasePremium(type: string, count: number): number {
  const qualifiesForBlock = count === BLOCK_SIZE;
  return qualifiesForBlock ? BLOCK_BASE_PREMIUM : count * basePremiumOf(type);
}

export function basePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += alikeGroupBasePremium(type, count);
  }
  return total;
}

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function riskSurchargePercent(item: Item): number {
  const cursed = item.cursed === true ? CURSE_SURCHARGE_PERCENT : 0;
  const highlyEnchanted =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT
      : 0;
  return cursed + highlyEnchanted;
}

function itemRiskSurcharge(item: Item): number {
  return (basePremiumOf(item.type) * riskSurchargePercent(item)) / PERCENT;
}

function riskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
}

const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;

const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

function customerModifierPercent(customer: Customer, previousContracts: number): number {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return loyalty + followUp + FIRST_INSURANCE_SURCHARGE_PERCENT;
}

export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  const base = basePremium(items);
  const customerModifiers = (base * customerModifierPercent(customer, previousContracts)) / PERCENT;
  return Math.ceil(base + riskSurcharges(items) + customerModifiers + PROCESSING_FEE);
}
