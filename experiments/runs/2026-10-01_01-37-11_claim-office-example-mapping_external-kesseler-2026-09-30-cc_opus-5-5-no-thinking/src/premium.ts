import { catalogEntry, Item } from './catalog';

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function componentsBasePremium(componentPremium: number, count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * componentPremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1));
  return counts;
}

function typeGroupBasePremium(type: string, count: number): number {
  const entry = catalogEntry(type);
  return entry.isComponent ? componentsBasePremium(entry.basePremium, count) : entry.basePremium * count;
}

export function basePremium(items: Item[]): number {
  return [...countByType(items)].reduce((sum, [type, count]) => sum + typeGroupBasePremium(type, count), 0);
}

export interface CustomerHistory {
  yearsWithMHPCO: number;
  isFollowUp: boolean;
}

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function itemSurchargePercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + enchantment;
}

function policyAdjustmentPercent(history: CustomerHistory): number {
  const loyalty = history.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = history.isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyalty - followUp;
}

export function quotePremium(items: Item[], history: CustomerHistory): number {
  const policyBase = basePremium(items);
  const itemSurchargesInPercent = items.reduce((sum, item) => sum + basePremium([item]) * itemSurchargePercent(item), 0);
  const policyAdjustmentInPercent = policyBase * policyAdjustmentPercent(history);
  const premiumInPercent = (policyBase + PROCESSING_FEE) * PERCENT + itemSurchargesInPercent + policyAdjustmentInPercent;
  return Math.ceil(premiumInPercent / PERCENT);
}
