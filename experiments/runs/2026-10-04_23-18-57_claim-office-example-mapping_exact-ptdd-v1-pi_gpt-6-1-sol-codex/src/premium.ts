import type { Item } from './item.js';
const processingFee = 5;
const componentBase = 25;
const basePrices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: componentBase, moonstone: componentBase };
const initialAssessment = 0.1;
const curseRate = 0.5;
const highEnchantment = 5;
const enchantmentRate = 0.3;
const loyaltyYears = 2;
const loyaltyRate = 0.2;
const followUpRate = 0.15;
const blockSize = 3;
const blockBase = 60;
function alikeItemsBase(type: string, count: number): number {
  if (!Object.hasOwn(basePrices, type)) throw new Error(`Unknown item type: ${type}`);
  const component = type === 'rune' || type === 'moonstone';
  return component && count === blockSize ? blockBase : count * basePrices[type];
}
function basePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  let total = 0;
  for (const [type, count] of counts) total += alikeItemsBase(type, count);
  return total;
}
function curseRiskRate(item: Item): number {
  return item.cursed ? curseRate : 0;
}
function enchantmentRiskRate(item: Item): number {
  return (item.enchantment ?? 0) >= highEnchantment ? enchantmentRate : 0;
}
function itemRiskSurcharge(item: Item): number {
  return basePrices[item.type] * (curseRiskRate(item) + enchantmentRiskRate(item));
}
function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= loyaltyYears ? base * loyaltyRate : 0;
}
function followUpDiscount(base: number, previousContracts: number): number {
  return previousContracts > 0 ? base * followUpRate : 0;
}
function initialAssessmentSurcharge(base: number): number {
  return base * initialAssessment;
}
export function premium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const base = basePremium(items);
  const risk = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const loyalty = loyaltyDiscount(base, yearsWithMHPCO);
  return Math.ceil(base + risk + initialAssessmentSurcharge(base) - loyalty - followUpDiscount(base, previousContracts) + processingFee);
}
